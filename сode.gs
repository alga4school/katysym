/*************************
 * CONFIG
 *************************/
const SPREADSHEET_ID = "1dHAvNmJXPe1F60wP9ZSw9GhVHM2eMELP90-sWnoSPCE";
const SHEET_STUDENTS = "students";
const SHEET_ATT = "attendance";
const API_KEY = "school2025";

/*************************
 * HELPERS
 *************************/
function normClass(v) {
  return String(v ?? "")
    .trim()
    .replace(/\s+/g, "")
    .toUpperCase()
    // Latin → Cyrillic
    .replace(/Ə/g, "Ә")
    .replace(/A/g, "А")
    .replace(/B/g, "В")
    .replace(/C/g, "С")
    .replace(/E/g, "Е")
    .replace(/H/g, "Н")
    .replace(/K/g, "К")
    .replace(/M/g, "М")
    .replace(/O/g, "О")
    .replace(/P/g, "Р")
    .replace(/T/g, "Т")
    .replace(/X/g, "Х")
    // 🔥 ЖЕТІСПЕГЕНІ ОСЫ ЕКЕУ
    .replace(/G/g, "Г")
    .replace(/D/g, "Д");
}

// ✅ grade: "1", "01", "1 класс", "1-сынып" -> "1"
function normGrade(v) {
  const m = String(v ?? "").match(/\d+/);
  return m ? String(Number(m[0])) : "";
}

// ✅ letter: " Ә " -> "Ә", "а" -> "А"
function normLetter(v) {
  const s = String(v ?? "")
    .trim()
    .replace(/\s+/g, "")
    .toUpperCase();
  return s ? s[0] : "";
}

// ✅ date: Date / "2026-01-12" / "12.01.2026" / "12/01/2026" -> "yyyy-MM-dd"
function dateToISO_(v) {
  if (v instanceof Date) {
    return Utilities.formatDate(v, Session.getScriptTimeZone(), "yyyy-MM-dd");
  }

  let s = String(v ?? "").trim();
  if (!s) return "";

  // already ISO
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);

  // dd.mm.yyyy or dd/mm/yyyy
  const m = s.match(/^(\d{1,2})[./](\d{1,2})[./](\d{4})/);
  if (m) {
    const dd = String(m[1]).padStart(2, "0");
    const mm = String(m[2]).padStart(2, "0");
    const yy = m[3];
    return `${yy}-${mm}-${dd}`;
  }

  return s.slice(0, 10);
}

function ok_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, ...obj }))
    .setMimeType(ContentService.MimeType.JSON);
}

function err_(msg) {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: false, error: msg }))
    .setMimeType(ContentService.MimeType.JSON);
}

/*************************
 * ENTRY
 *************************/
function doGet(e) {
  try {
    if (e.parameter.key !== API_KEY) return err_("Invalid key");

    const mode = e.parameter.mode;

    if (mode === "classes")  return ok_({ classes: getClasses_() });
    if (mode === "students") return ok_({ students: getStudents_(e.parameter) });
    if (mode === "report")   return ok_(getReport_(e.parameter));

    return err_("Unknown mode");
  } catch (ex) {
    return err_(ex.message);
  }
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents || "{}");
    if (body.key !== API_KEY) return err_("Invalid key");

    const mode = String(body.mode || "saveAttendance");

    if (mode === "saveAttendance") {
      const info = saveAttendance_(body);
      return ok_(info);
    }

    if (mode === "addStudent") {
      const info = addStudent_(body);
      return ok_(info);
    }

    if (mode === "deleteStudent") {
      const info = deleteStudent_(body);
      return ok_(info);
    }

    return err_("Unknown POST mode: " + mode);
  } catch (ex) {
    return err_(ex.message);
  }
}


/*************************
 * HEADER MAP
 *************************/
function header_(h) {
  const m = {};
  h.forEach((v, i) => {
    const key = String(v || "").trim().toLowerCase();
    if (key) m[key] = i;
  });
  const pick = (name) => (Object.prototype.hasOwnProperty.call(m, name) ? m[name] : undefined);

  return {
    // students
    id: pick("id"),
    full_name: pick("full_name"),
    grade: pick("grade"),
    class_letter: pick("class_letter"),

    // attendance
    date: pick("date"),
    student_id: pick("student_id"),
    status_code: pick("status_code"),
    status_kk: pick("status_kk"),
    status_ru: pick("status_ru"),
    ts: pick("ts"),
  };
}

/*************************
 * CLASSES
 *************************/
function getClasses_() {
  const sh = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_STUDENTS);
  const data = sh.getDataRange().getValues();
  const idx = header_(data[0]);

  const set = new Set();
  for (let i = 1; i < data.length; i++) {
    const g = normClass(data[i][idx.grade]);
    const l = normClass(data[i][idx.class_letter]);
    if (g && l) set.add(`${g}${l}`);
  }

  return [...set].sort((a, b) => a.localeCompare(b, "ru", { numeric: true }));
}

/*************************
 * STUDENTS
 *************************/
function getStudents_(p) {
  const grade = normClass(p.grade || "ALL");
  const letter = normClass(p.class_letter || "ALL");

  const sh = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_STUDENTS);
  const data = sh.getDataRange().getValues();
  const idx = header_(data[0]);

  return data
    .slice(1)
    .map((r) => ({
      id: r[idx.id],
      full_name: r[idx.full_name],
      grade: String(r[idx.grade] ?? ""),
      class_letter: String(r[idx.class_letter] ?? ""),
    }))
    .filter((s) => {
      const sg = normClass(s.grade);
      const sl = normClass(s.class_letter);

      if (grade !== "ALL" && sg !== grade) return false;
      if (letter !== "ALL" && sl !== letter) return false;
      return true;
    })
    .sort((a, b) => String(a.full_name).localeCompare(String(b.full_name), "ru"));
}

/*************************
 * SAVE (OVERWRITE, NO DUPLICATES)
 *************************/
function saveAttendance_(body) {
  const sh = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_ATT);

  const date = String(body.date || "").slice(0, 10);
  const grade = normClass(body.grade);
  const letter = normClass(body.class_letter);

  if (!date) throw new Error("Missing date");
  if (!grade) throw new Error("Missing grade");
  if (!letter) throw new Error("Missing class_letter");

  const records = Array.isArray(body.records) ? body.records : [];
  if (!records.length) throw new Error("Records empty");

  // header / map
  const lastCol = Math.max(8, sh.getLastColumn() || 8);
  const headerRow = sh.getRange(1, 1, 1, lastCol).getValues()[0];
  const idx = header_(headerRow);

  // егер негізгі бағандар жоқ болса — қате (қазір сенде бар)
  if (idx.date == null || idx.student_id == null || idx.status_code == null || idx.grade == null || idx.class_letter == null) {
    throw new Error("attendance header қате. Керегі: date, student_id, status_code, grade, class_letter");
  }

  // бар жазбаларды оқу
  const data = sh.getDataRange().getValues();
  const rowsToDelete = [];

  // duplicate (сол күн + сол класс) өшіру
  for (let i = 1; i < data.length; i++) {
    let d = data[i][idx.date];
    if (d instanceof Date) d = Utilities.formatDate(d, Session.getScriptTimeZone(), "yyyy-MM-dd");
    else d = String(d || "").slice(0, 10);

    const rg = normClass(data[i][idx.grade]);
    const rl = normClass(data[i][idx.class_letter]);

    if (d === date && rg === grade && rl === letter) rowsToDelete.push(i + 1);
  }
  if (rowsToDelete.length) rowsToDelete.sort((a, b) => b - a).forEach((r) => sh.deleteRow(r));

  // жаңа жолдарды full-width қылып жазу (8+ баған)
  const now = new Date();
  const values = records.map((r) => {
    const row = new Array(lastCol).fill("");
    row[idx.date] = date;
    row[idx.student_id] = String(r.student_id);
    row[idx.status_code] = String(r.status_code || "katysty");
    row[idx.grade] = grade;
    row[idx.class_letter] = letter;

    if (idx.ts != null) row[idx.ts] = now;
    // status_kk/status_ru керек болса, кейін толтыра аламыз (қазір бос қалсын)
    return row;
  });

  sh.getRange(sh.getLastRow() + 1, 1, values.length, lastCol).setValues(values);

  return { saved: values.length, replaced: rowsToDelete.length > 0 };
}


/*************************
 * REPORT
 *************************/
/*************************
 * REPORT
 *************************/
function getReport_(p) {
  // ✅ Параметрлерді дұрыстау
  const gradeParam = String(p.grade || "ALL").trim();
  const letterParam = String(p.class_letter || "ALL").trim();

  const grade = (gradeParam === "ALL") ? "ALL" : normGrade(gradeParam);
  const letter = (letterParam === "ALL") ? "ALL" : normLetter(letterParam);

  // ✅ Барлық кезең: from/to бос болса — фильтр жоқ
  const from = dateToISO_(p.from || ""); // "" болса OK
  const to   = dateToISO_(p.to || "");   // "" болса OK

  // ✅ Студенттер тізімі (класс фильтрі дұрыс)
  const students = getStudents_({ grade, class_letter: letter });
  const mapStudents = new Map(students.map((s) => [String(s.id), s]));

  const sh = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_ATT);
  const data = sh.getDataRange().getValues();
  const idx = header_(data[0]);

  const daily = {};
  const totals = {};

  for (let i = 1; i < data.length; i++) {
    const r = data[i];

    // ✅ дата әр форматта келсе де бірдей болады
    const d = dateToISO_(r[idx.date]);
    if (!d) continue;

    // ✅ диапазон (егер from/to бос емес болса ғана сүземіз)
    if (from && d < from) continue;
    if (to && d > to) continue;

    // ✅ сынып мәндерін дұрыстау
    const rg = normGrade(r[idx.grade]);
    const rl = normLetter(r[idx.class_letter]);

    if (grade !== "ALL" && rg !== grade) continue;
    if (letter !== "ALL" && rl !== letter) continue;

    const sid = String(r[idx.student_id]);
    const code = String(r[idx.status_code] || "katysty");

    // ✅ тек осы фильтрге кіретін студенттерді ғана есептеу (қауіпсіз)
    if (students.length && !mapStudents.has(sid)) continue;

    if (!daily[d]) daily[d] = {};
    daily[d][sid] = { status_code: code };

    if (!totals[sid]) totals[sid] = { katysty: 0, keshikti: 0, auyrdy: 0, sebep: 0, sebsez: 0 };
    if (totals[sid][code] == null) totals[sid][code] = 0;
    totals[sid][code] += 1;
  }

  const topLate = Object.entries(totals)
    .map(([sid, codes]) => ({
      id: sid,
      count: codes.keshikti || 0,
      name: mapStudents.get(sid)?.full_name || "",
      class: `${mapStudents.get(sid)?.grade || ""}${mapStudents.get(sid)?.class_letter || ""}`,
    }))
    .filter((x) => x.count > 4)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const topUnexcused = Object.entries(totals)
    .map(([sid, codes]) => ({
      id: sid,
      count: codes.sebsez || 0,
      name: mapStudents.get(sid)?.full_name || "",
      class: `${mapStudents.get(sid)?.grade || ""}${mapStudents.get(sid)?.class_letter || ""}`,
    }))
    .filter((x) => x.count > 4)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return { students, daily, totals, topLate, topUnexcused };
}

/*************************
 * TEST
 *************************/
function testOpen() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  Logger.log(ss.getName());
}

function addStudent_(body) {
  const full_name = String(body.full_name || "").trim();
  const grade = normClass(body.grade);
  const class_letter = normClass(body.class_letter);

  if (!full_name) throw new Error("Missing full_name");
  if (!grade) throw new Error("Missing grade");
  if (!class_letter) throw new Error("Missing class_letter");

  const sh = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_STUDENTS);
  const data = sh.getDataRange().getValues();
  const idx = header_(data[0]);

  // новый ID = max(id)+1
  let maxId = 0;
  for (let i = 1; i < data.length; i++) {
    const v = Number(data[i][idx.id]);
    if (!isNaN(v)) maxId = Math.max(maxId, v);
  }
  const newId = maxId + 1;

  const row = new Array(data[0].length).fill("");
  row[idx.id] = newId;
  row[idx.full_name] = full_name;
  row[idx.grade] = grade;
  row[idx.class_letter] = class_letter;

  sh.appendRow(row);
  return { added: true, id: newId };
}

function deleteStudent_(body) {
  const id = String(body.id || "").trim();
  if (!id) throw new Error("Missing id");

  const sh = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_STUDENTS);
  const data = sh.getDataRange().getValues();
  const idx = header_(data[0]);

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][idx.id]) === id) {
      sh.deleteRow(i + 1);
      return { deleted: true };
    }
  }
  return { deleted: false, note: "id not found" };
} 
