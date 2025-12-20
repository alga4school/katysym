// ============================
// CONFIG
// ============================
const SPREADSHEET_ID = "1dHAvNmJXPe1F60wP9ZSw9GhVHM2eMELP90-sWnoSPCE";
const SHEET_STUDENTS = "students";
const SHEET_ATT = "attendance";

// MUST match API_KEY in app.js
const API_KEY = "school2025";

const STATUS = {
  katysty: { kk: "Қатысты", ru: "Присутствовал(а)" },
  auyrdy:  { kk: "Ауырды",  ru: "Болел(а)" },
  sebep:   { kk: "Себепті", ru: "Отсутствовал(а) по уважительной причине" },
  sebsez:  { kk: "Себепсіз",ru: "Отсутствовал(а) без уважительной причины" },
  keshikti:{ kk: "Кешікті", ru: "Опоздал(а)" },
};

// ============================
// HELPERS
// ============================
function normDateISO_(v) {
  if (!v) return "";
  if (v instanceof Date) {
    return Utilities.formatDate(v, Session.getScriptTimeZone(), "yyyy-MM-dd");
  }
  const s = String(v).trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  return s;
}

function jsonOut_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function ok_(obj) {
  return jsonOut_(Object.assign({ ok: true }, obj || {}));
}

function bad_(msg, extra) {
  return jsonOut_(Object.assign({ ok: false, error: msg }, extra || {}));
}

function auth_(key) {
  return String(key || "") === String(API_KEY);
}

function openSS_() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function getOrCreateSheet_(ss, name, headerRow) {
  let sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  if (headerRow && sh.getLastRow() === 0) {
    sh.appendRow(headerRow);
  }
  return sh;
}

function headerIndex_(head, names) {
  // names: array of possible header strings
  const norm = head.map(h => String(h).trim().toLowerCase());
  for (let i = 0; i < names.length; i++) {
    const n = String(names[i]).trim().toLowerCase();
    const idx = norm.indexOf(n);
    if (idx !== -1) return idx;
  }
  return -1;
}

// ============================
// ENTRYPOINTS
// ============================
function doGet(e) {
  try {
    const p = (e && e.parameter) ? e.parameter : {};
    if (!auth_(p.key)) return bad_("Unauthorized");

    const mode = String(p.mode || "students").toLowerCase();
    if (mode === "students") return ok_({ students: getStudents_(p) });
    if (mode === "classes")  return ok_({ classes: getClasses_() });
    if (mode === "report")   return handleReport_(p);

    return bad_("unknown_mode", { got: mode });
  } catch (err) {
    return bad_("exception", {
      message: String(err),
      stack: (err && err.stack) ? String(err.stack) : "",
    });
  }
}

function doPost(e) {
  try {
    const body = e && e.postData && e.postData.contents ? e.postData.contents : "{}";
    const data = JSON.parse(body);
    if (!auth_(data.key)) return bad_("Unauthorized");

    const mode = String(data.mode || "save").toLowerCase();
    if (mode === "save")   return handleSave_(data);
    if (mode === "report") return handleReport_(data);

    return bad_("unknown_mode", { got: mode });
  } catch (err) {
    return bad_("exception", {
      message: String(err),
      stack: (err && err.stack) ? String(err.stack) : "",
    });
  }
}

// ============================
// STUDENTS / CLASSES
// ============================
function getStudents_(p) {
  const ss = openSS_();
  const sh = ss.getSheetByName(SHEET_STUDENTS);
  if (!sh) throw new Error("Sheet students not found");

  const values = sh.getDataRange().getValues();
  if (values.length < 2) return [];

  const head = values.shift();

  // Accept both english and russian/kazakh headers (fallback to first 4 columns)
  const iId = headerIndex_(head, ["id", "student_id", "№", "num", "номер", "код"]);
  const iName = headerIndex_(head, ["full_name", "fio", "фио", "оқушы", "student", "name", "аты-жөні"]);
  const iGrade = headerIndex_(head, ["grade", "класс", "сынып", "grade_num"]);
  const iLet = headerIndex_(head, ["class_letter", "буква", "әріп", "letter"]);

  const idx = {
    id: (iId !== -1) ? iId : 0,
    full_name: (iName !== -1) ? iName : 1,
    grade: (iGrade !== -1) ? iGrade : 2,
    class_letter: (iLet !== -1) ? iLet : 3,
  };

  const grade = String((p && p.grade) ? p.grade : "ALL");
  const letter = String((p && p.class_letter) ? p.class_letter : "ALL");

  return values
    .filter(r => r[idx.id] !== "" && r[idx.id] != null)
    .map(r => ({
      id: String(r[idx.id] ?? "").trim(),
      full_name: String(r[idx.full_name] ?? "").trim(),
      grade: String(r[idx.grade] ?? "").trim(),
      class_letter: String(r[idx.class_letter] ?? "").trim(),
    }))
    .filter(s =>
      (grade === "ALL" || String(s.grade) === grade) &&
      (letter === "ALL" || String(s.class_letter) === letter)
    );
}

function getClasses_() {
  const students = getStudents_({ grade: "ALL", class_letter: "ALL" });
  const set = new Set();
  students.forEach(s => {
    const g = String(s.grade || "").trim();
    const l = String(s.class_letter || "").trim();
    if (g && l) set.add(g + l);
  });

  return Array.from(set).sort((a, b) => {
    const ga = parseInt(a, 10);
    const gb = parseInt(b, 10);
    if (ga !== gb) return ga - gb;
    return a.localeCompare(b, 'ru');
  });
}

// ============================
// SAVE (idempotent: replaces existing class/day instead of duplicating)
// ============================
function handleSave_(data) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const date = normDateISO_(data.date);
    const grade = String(data.grade ?? "").trim();
    const class_letter = String(data.class_letter ?? "").trim();
    const records = Array.isArray(data.records) ? data.records : [];

    if (!date) return bad_("missing_date");
    if (!grade) return bad_("missing_grade");
    if (!class_letter) return bad_("missing_class_letter");
    if (!records.length) return bad_("missing_records");

    const ss = openSS_();
    const sh = getOrCreateSheet_(ss, SHEET_ATT, [
      "date","student_id","status_code","status_kk","status_ru","grade","class_letter","ts"
    ]);

    // read all once
    const lastRow = sh.getLastRow();
    let replaced = false;

    if (lastRow >= 2) {
      const vals = sh.getRange(1, 1, lastRow, 8).getValues();
      const head = vals[0].map(String);
      const iDate  = head.indexOf("date");
      const iGrade = head.indexOf("grade");
      const iLet   = head.indexOf("class_letter");

      // if headers are broken, force to standard
      if (iDate === -1 || iGrade === -1 || iLet === -1) {
        sh.clear();
        sh.appendRow(["date","student_id","status_code","status_kk","status_ru","grade","class_letter","ts"]);
      } else {
        // delete previous rows for same day/class (from bottom to top)
        for (let r = vals.length - 1; r >= 1; r--) {
          const d = normDateISO_(vals[r][iDate]);
          const g = String(vals[r][iGrade] ?? "").trim();
          const l = String(vals[r][iLet] ?? "").trim();
          if (d === date && g === grade && l === class_letter) {
            sh.deleteRow(r + 1); // +1 because vals is 0-based and includes header row
            replaced = true;
          }
        }
      }
    }

    const nowTs = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd.MM.yyyy HH:mm:ss");
    const out = records.map(rec => {
      const sid = String(rec.student_id ?? "").trim();
      const code = String(rec.status_code ?? "katysty").trim();
      const st = STATUS[code] || STATUS.katysty;
      return [date, sid, code, st.kk, st.ru, grade, class_letter, nowTs];
    });

    if (out.length) {
      sh.getRange(sh.getLastRow() + 1, 1, out.length, out[0].length).setValues(out);
    }

    return ok_({ saved: out.length, replaced: replaced, date, grade, class_letter });
  } finally {
    lock.releaseLock();
  }
}

// ============================
// REPORT
// ============================
function handleReport_(p) {
  const from = String(p.from || "");
  const to   = String(p.to || "");
  const grade = String(p.grade || "ALL");
  const class_letter = String(p.class_letter || "ALL");

  if (!from || !to) return bad_("need_from_to");

  const students = getStudents_({ grade, class_letter });
  const allowedIds = new Set(students.map(s => s.id));

  const ss = openSS_();
  const shA = ss.getSheetByName(SHEET_ATT);
  if (!shA) return ok_({ from, to, grade, class_letter, students, daily: {}, totals: {} });

  const valsAll = shA.getDataRange().getValues();
  if (valsAll.length < 2) return ok_({ from, to, grade, class_letter, students, daily: {}, totals: {} });

  const head = valsAll.shift().map(String);
  const idx = {
    date: head.indexOf("date"),
    student_id: head.indexOf("student_id"),
    status_code: head.indexOf("status_code"),
    status_kk: head.indexOf("status_kk"),
    status_ru: head.indexOf("status_ru"),
    grade: head.indexOf("grade"),
    class_letter: head.indexOf("class_letter"),
  };

  const fromD = new Date(from + "T00:00:00");
  const toD   = new Date(to + "T23:59:59");

  const daily = {};  // daily[YYYY-MM-DD][studentId] = {status_code,status_kk,status_ru}
  const totals = {}; // totals[studentId] = {katysty,auyrdy,sebep,sebsez,keshikti}

  function ensureTotals_(sid) {
    if (!totals[sid]) totals[sid] = { katysty:0, auyrdy:0, sebep:0, sebsez:0, keshikti:0 };
  }

  valsAll.forEach(r => {
    const dStr = normDateISO_(r[idx.date]);
    if (!dStr) return;

    const d = new Date(dStr + "T00:00:00");
    if (d < fromD || d > toD) return;

    const sid = String(r[idx.student_id] || "").trim();
    if (!allowedIds.has(sid)) return;

    const rg = String(r[idx.grade] || "").trim();
    const rl = String(r[idx.class_letter] || "").trim();
    if (grade !== "ALL" && rg !== grade) return;
    if (class_letter !== "ALL" && rl !== class_letter) return;

    const code = String(r[idx.status_code] || "katysty").trim();
    const st = STATUS[code] || STATUS.katysty;

    if (!daily[dStr]) daily[dStr] = {};
    daily[dStr][sid] = {
      status_code: code,
      status_kk: String(r[idx.status_kk] || st.kk),
      status_ru: String(r[idx.status_ru] || st.ru),
    };

    ensureTotals_(sid);
    totals[sid][code] = (totals[sid][code] || 0) + 1;
  });

  students.forEach(s => {
    if (!totals[s.id]) totals[s.id] = { katysty:0, auyrdy:0, sebep:0, sebsez:0, keshikti:0 };
  });

  return ok_({ from, to, grade, class_letter, students, daily, totals });
}
