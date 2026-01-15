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
    .toUpperCase();
}

function ok_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, ...obj }))
    .setMimeType(ContentService.MimeType.JSON);
}

function err_(msg) {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: false, error: String(msg || "") }))
    .setMimeType(ContentService.MimeType.JSON);
}

function todayISO_() {
  return Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd");
}

// Любое значение → ISO YYYY-MM-DD (или "")
function toISODate_(v) {
  if (!v) return "";
  if (v instanceof Date) {
    return Utilities.formatDate(v, Session.getScriptTimeZone(), "yyyy-MM-dd");
  }
  const s = String(v).trim();
  if (!s) return "";

  // уже ISO
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);

  // dd.mm.yyyy → yyyy-mm-dd (на всякий)
  const m = s.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (m) {
    const dd = String(m[1]).padStart(2, "0");
    const mm = String(m[2]).padStart(2, "0");
    const yy = m[3];
    return `${yy}-${mm}-${dd}`;
  }

  // иначе режем первые 10 символов как было
  return s.slice(0, 10);
}

/*************************
 * ENTRY
 *************************/
function doGet(e) {
  try {
    if (e.parameter.key !== API_KEY) return err_("Invalid key");

    const mode = String(e.parameter.mode || "").trim();

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
    const body = e?.postData?.contents ? JSON.parse(e.postData.contents) : {};

    // ✅ key: body-дан да, URL параметрден де оқимыз
    const key = String(body.key || e?.parameter?.key || "").trim();
    if (key !== API_KEY) return err_("Invalid key");

    // ✅ mode: body-дан да, URL параметрден де оқимыз
    const rawMode = String(body.mode || e?.parameter?.mode || "").trim();
    const mode = rawMode ? rawMode.toLowerCase() : ""; // если пусто — потом решим

    // ✅ Students manage modes
    if (mode === "addstudent") {
      return ok_(addStudent_(body));
    }
    if (mode === "deletestudent") {
      return ok_(deleteStudent_(body));
    }
    if (mode === "restorestudent") {
      return ok_(restoreStudent_(body));
    }

    // ✅ Default: attendance save
    if (!mode || mode === "saveattendance") {
      return ok_(saveAttendance_(body));
    }

    return err_("Unknown mode: " + rawMode);
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
    arrival_date: pick("arrival_date"),
    departure_date: pick("departure_date"),

    // attendance
    date: pick("date"),
    student_id: pick("student_id"),
    status_code: pick("status_code"),
    status_kk: pick("status_kk"),
    status_ru: pick("status_ru"),
    ts: pick("ts"),

    // attendance grade/class_letter (обычно так и есть)
    att_grade: pick("grade"),
    att_class_letter: pick("class_letter"),
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
  const includeInactive = String(p.include_inactive || "0") === "1";

  const sh = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_STUDENTS);
  const data = sh.getDataRange().getValues();
  const idx = header_(data[0]);

  if (idx.id == null || idx.full_name == null || idx.grade == null || idx.class_letter == null) {
    throw new Error("students header қате. Керегі: id, full_name, grade, class_letter");
  }

  return data
    .slice(1)
    .map((r) => ({
      id: String(r[idx.id] ?? "").trim(),
      full_name: String(r[idx.full_name] ?? "").trim(),
      grade: String(r[idx.grade] ?? "").trim(),
      class_letter: String(r[idx.class_letter] ?? "").trim(),
      arrival_date: idx.arrival_date != null ? toISODate_(r[idx.arrival_date]) : "",
      departure_date: idx.departure_date != null ? toISODate_(r[idx.departure_date]) : "",
    }))
    .filter((s) => {
      const sg = normClass(s.grade);
      const sl = normClass(s.class_letter);

      if (grade !== "ALL" && sg !== grade) return false;
      if (letter !== "ALL" && sl !== letter) return false;

      if (!includeInactive && String(s.departure_date || "").trim()) return false;
      return true;
    })
    .sort((a, b) => String(a.full_name).localeCompare(String(b.full_name), "ru"));
}

/*************************
 * ADD / DELETE / RESTORE STUDENT
 *************************/
function addStudent_(body) {
  const sh = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_STUDENTS);
  const data = sh.getDataRange().getValues();
  const idx = header_(data[0]);

  if (idx.id == null || idx.full_name == null || idx.grade == null || idx.class_letter == null) {
    throw new Error("students header қате. Керегі: id, full_name, grade, class_letter");
  }

  const full_name = String(body.full_name || "").trim();
  const grade = String(body.grade || "").trim();
  const class_letter = String(body.class_letter || "").trim();

  // ✅ если не пришло — сегодня
  const arrival_date = toISODate_(String(body.arrival_date || "").trim()) || todayISO_();

  if (!full_name) throw new Error("Missing full_name");
  if (!grade) throw new Error("Missing grade");
  if (!class_letter) throw new Error("Missing class_letter");

  // id generate
  let id = String(body.id || "").trim();
  if (!id) {
    const used = new Set(data.slice(1).map(r => String(r[idx.id] ?? "").trim()));
    for (let k = 0; k < 30; k++) {
      const candidate = Utilities.getUuid().slice(0, 8);
      if (!used.has(candidate)) { id = candidate; break; }
    }
    if (!id) id = Utilities.getUuid();
  }

  const row = new Array(data[0].length).fill("");
  row[idx.id] = id;
  row[idx.full_name] = full_name;
  row[idx.grade] = grade;
  row[idx.class_letter] = class_letter;

  if (idx.arrival_date != null) row[idx.arrival_date] = arrival_date;
  if (idx.departure_date != null) row[idx.departure_date] = "";

  sh.appendRow(row);

  return { added: true, id, arrival_date };
}

// мягкое удаление = departure_date
function deleteStudent_(body) {
  const id = String(body.id || "").trim();
  const departure_date = toISODate_(String(body.departure_date || "").trim()) || todayISO_();
  if (!id) throw new Error("Missing id");

  const sh = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_STUDENTS);
  const data = sh.getDataRange().getValues();
  const idx = header_(data[0]);

  if (idx.departure_date == null) throw new Error("Column departure_date not found in students sheet");

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][idx.id] ?? "").trim() === id) {
      sh.getRange(i + 1, idx.departure_date + 1).setValue(departure_date);
      return { departed: true, departure_date };
    }
  }
  return { departed: false, note: "id not found" };
}

function restoreStudent_(body) {
  const id = String(body.id || "").trim();
  if (!id) throw new Error("Missing id");

  const sh = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_STUDENTS);
  const data = sh.getDataRange().getValues();
  const idx = header_(data[0]);

  if (idx.departure_date == null) throw new Error("Column departure_date not found in students sheet");

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][idx.id] ?? "").trim() === id) {
      sh.getRange(i + 1, idx.departure_date + 1).setValue("");
      return { restored: true };
    }
  }
  return { restored: false, note: "id not found" };
}

/*************************
 * SAVE ATTENDANCE (OVERWRITE, NO DUPLICATES)
 *************************/
function saveAttendance_(body) {
  const sh = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_ATT);

  const date = toISODate_(body.date);
  const grade = normClass(body.grade);
  const letter = normClass(body.class_letter);

  if (!date) throw new Error("Missing date");
  if (!grade) throw new Error("Missing grade");
  if (!letter) throw new Error("Missing class_letter");

  const records = Array.isArray(body.records) ? body.records : [];
  if (!records.length) throw new Error("Records empty");

  const lastCol = Math.max(8, sh.getLastColumn() || 8);
  const headerRow = sh.getRange(1, 1, 1, lastCol).getValues()[0];
  const idx = header_(headerRow);

  if (idx.date == null || idx.student_id == null || idx.status_code == null || idx.att_grade == null || idx.att_class_letter == null) {
    throw new Error("attendance header қате. Керегі: date, student_id, status_code, grade, class_letter");
  }

  const data = sh.getDataRange().getValues();
  const rowsToDelete = [];

  // delete duplicates (same date + class)
  for (let i = 1; i < data.length; i++) {
    let d = data[i][idx.date];
    d = toISODate_(d);

    const rg = normClass(data[i][idx.att_grade]);
    const rl = normClass(data[i][idx.att_class_letter]);

    if (d === date && rg === grade && rl === letter) rowsToDelete.push(i + 1);
  }
  if (rowsToDelete.length) {
    rowsToDelete.sort((a, b) => b - a).forEach((r) => sh.deleteRow(r));
  }

  const now = new Date();
  const values = records.map((r) => {
    const row = new Array(lastCol).fill("");
    row[idx.date] = date;
    row[idx.student_id] = String(r.student_id);
    row[idx.status_code] = String(r.status_code || "katysty");
    row[idx.att_grade] = grade;
    row[idx.att_class_letter] = letter;
    if (idx.ts != null) row[idx.ts] = now;
    return row;
  });

  sh.getRange(sh.getLastRow() + 1, 1, values.length, lastCol).setValues(values);

  return { saved: values.length, replaced: rowsToDelete.length > 0 };
}

/*************************
 * REPORT
 *************************/
function getReport_(p) {
  const grade = normClass(p.grade || "ALL");
  const letter = normClass(p.class_letter || "ALL");

  const from = toISODate_(p.from);
  const to = toISODate_(p.to);

  const students = getStudents_({ grade, class_letter: letter, include_inactive: "1" });
  const mapStudents = new Map(students.map((s) => [String(s.id), s]));

  const sh = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_ATT);
  const data = sh.getDataRange().getValues();
  const idx = header_(data[0]);

  if (idx.date == null || idx.student_id == null || idx.status_code == null || idx.att_grade == null || idx.att_class_letter == null) {
    throw new Error("attendance header қате. Керегі: date, student_id, status_code, grade, class_letter");
  }

  const daily = {};
  const totals = {};

  for (let i = 1; i < data.length; i++) {
    const r = data[i];

    const d = toISODate_(r[idx.date]);
    if (!d) continue;

    if (from && d < from) continue;
    if (to && d > to) continue;

    const rg = normClass(r[idx.att_grade]);
    const rl = normClass(r[idx.att_class_letter]);

    if (grade !== "ALL" && rg !== grade) continue;
    if (letter !== "ALL" && rl !== letter) continue;

    const sid = String(r[idx.student_id]);
    const code = String(r[idx.status_code] || "katysty");

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
