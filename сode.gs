// ============================
// CONFIG
// ============================
const SPREADSHEET_ID = "1dHAvNmJXPe1F60wP9ZSw9GhVHM2eMELP90-sWnoSPCE";
const SHEET_STUDENTS = "students";
const SHEET_ATT = "attendance";

// ключ как в твоём фронте (API_KEY в app.js)
const API_KEY = "school2025";

const STATUS = {
  katysty: { kk: "Қатысты", ru: "Присутствовал(а)" },
  auyrdy:  { kk: "Ауырды",  ru: "Болел(а)" },
  sebep:   { kk: "Себепті", ru: "Отсутствовал(а) по уважительной причине" },
  sebsez:  { kk: "Себепсіз",ru: "Отсутствовал(а) без уважительной причины" },
  keshikti:{ kk: "Кешікті", ru: "Опоздал(а)" },
};

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function bad(msg, extra) {
  return jsonOut(Object.assign({ ok: false, error: msg }, extra || {}));
}

function ok(obj) {
  return jsonOut(Object.assign({ ok: true }, obj || {}));
}

function auth_(key) {
  return String(key || "") === String(API_KEY);
}

function doGet(e) {
  try {
    const p = e.parameter || {};
    if (!auth_(p.key)) return bad("Unauthorized");

    const mode = String(p.mode || "students").toLowerCase();
    if (mode === "students") return ok({ students: getStudents_(p) });
    if (mode === "report") return handleReport_(p);

    return bad("unknown_mode", { got: mode });
  } catch (err) {
    return bad("exception", { message: String(err), stack: (err && err.stack) ? String(err.stack) : "" });
  }
}

function doPost(e) {
  try {
    const data = e && e.postData && e.postData.contents ? JSON.parse(e.postData.contents) : {};
    if (!auth_(data.key)) return bad("Unauthorized");

    const mode = String(data.mode || "save").toLowerCase();
    if (mode === "save") return handleSave_(data);
    if (mode === "report") return handleReport_(data); // если захочешь POST-отчёт

    return bad("unknown_mode", { got: mode });
  } catch (err) {
    return bad("exception", { message: String(err), stack: (err && err.stack) ? String(err.stack) : "" });
  }
}

// ============================
// STUDENTS
// ============================
function getStudents_(p) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sh = ss.getSheetByName(SHEET_STUDENTS);
  if (!sh) throw new Error("Sheet students not found");

  const values = sh.getDataRange().getValues();
  const head = values.shift().map(String);

  const idx = {
    id: head.indexOf("id"),
    full_name: head.indexOf("full_name"),
    grade: head.indexOf("grade"),
    class_letter: head.indexOf("class_letter"),
  };

  const grade = String(p.grade || "ALL");
  const letter = String(p.class_letter || "ALL");

  return values
    .filter(r => r[idx.id] !== "" && r[idx.id] != null)
    .map(r => ({
      id: String(r[idx.id]),
      full_name: String(r[idx.full_name] || ""),
      grade: String(r[idx.grade] || ""),
      class_letter: String(r[idx.class_letter] || "")
    }))
    .filter(s => (grade === "ALL" || s.grade === grade) &&
                 (letter === "ALL" || s.class_letter === letter));
}

// ============================
// SAVE attendance
// ============================
function handleSave_(data) {
  const date = String(data.date || "");
  const grade = String(data.grade || "");
  const class_letter = String(data.class_letter || "");
  const records = Array.isArray(data.records) ? data.records : [];

  if (!date) return bad("missing_date");
  if (!grade) return bad("missing_grade");
  if (!class_letter) return bad("missing_class_letter");

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sh = ss.getSheetByName(SHEET_ATT);
  if (!sh) throw new Error("Sheet attendance not found");

  // гарантируем шапку
  if (sh.getLastRow() === 0) {
    sh.appendRow(["date","student_id","status_code","status_kk","status_ru","grade","class_letter","ts"]);
  }

  const nowTs = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd.MM.yyyy HH:mm:ss");

  // Удаляем старые записи по этому дню/классу чтобы не было дублей
  // (если у тебя уже реализовано иначе — можно убрать этот блок)
  const range = sh.getDataRange().getValues();
  const head = range[0].map(String);
  const i = {
    date: head.indexOf("date"),
    student_id: head.indexOf("student_id"),
    grade: head.indexOf("grade"),
    class_letter: head.indexOf("class_letter"),
  };

  const rowsToDelete = [];
  for (let r = 1; r < range.length; r++) {
    const row = range[r];
    if (String(row[i.date]) === date && String(row[i.grade]) === grade && String(row[i.class_letter]) === class_letter) {
      rowsToDelete.push(r + 1); // sheet row index (1-based)
    }
  }
  // удаляем снизу вверх
  rowsToDelete.reverse().forEach(rr => sh.deleteRow(rr));

  // записываем новые
  const out = records.map(rec => {
    const sid = String(rec.student_id);
    const code = String(rec.status_code || "katysty");
    const st = STATUS[code] || STATUS.katysty;
    return [date, sid, code, st.kk, st.ru, grade, class_letter, nowTs];
  });

  if (out.length) {
    sh.getRange(sh.getLastRow() + 1, 1, out.length, out[0].length).setValues(out);
  }

  return ok({ saved: out.length });
}

// ============================
// REPORT
// ============================
function handleReport_(p) {
  const from = String(p.from || "");
  const to   = String(p.to || "");
  const grade = String(p.grade || "ALL");
  const class_letter = String(p.class_letter || "ALL");

  if (!from || !to) return bad("need_from_to");

  const students = getStudents_({ grade, class_letter });

  const allowedIds = new Set(students.map(s => s.id));

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const shA = ss.getSheetByName(SHEET_ATT);
  if (!shA) throw new Error("Sheet attendance not found");

  const vals = shA.getDataRange().getValues();
  const head = vals.shift().map(String);

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

  vals.forEach(r => {
    const dStr = String(r[idx.date] || "");
    if (!dStr) return;

    const d = new Date(dStr + "T00:00:00");
    if (d < fromD || d > toD) return;

    const sid = String(r[idx.student_id] || "");
    if (!allowedIds.has(sid)) return;

    // дополнительно фильтруем по grade/letter если в запросе не ALL
    const rg = String(r[idx.grade] || "");
    const rl = String(r[idx.class_letter] || "");
    if (grade !== "ALL" && rg !== grade) return;
    if (class_letter !== "ALL" && rl !== class_letter) return;

    const code = String(r[idx.status_code] || "katysty");
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

  // гарантируем что у каждого ученика есть totals, даже если 0
  students.forEach(s => {
    if (!totals[s.id]) totals[s.id] = { katysty:0, auyrdy:0, sebep:0, sebsez:0, keshikti:0 };
  });

  return ok({ from, to, grade, class_letter, students, daily, totals });
}
