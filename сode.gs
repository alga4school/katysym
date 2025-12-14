// ============================
// CONFIG (СЮДА ТОЛЬКО ВАШИ ID)
// ============================
const SPREADSHEET_ID = "1dHAvNmJXPe1F60wP9ZSw9GhVHM2eMELP90-sWnoSPCE";
const SHEET_STUDENTS = "students";
const SHEET_ATT = "attendance";

const STATUS = {
  katysty: { kk: "Қатысты", ru: "Присутствовал(а)" },
  auyrdy:  { kk: "Ауырды",  ru: "Болел(а)" },
  sebep:   { kk: "Себепті", ru: "Отсутствовал(а) по уважительной причине" },
  sebsez:  { kk: "Себепсіз",ru: "Отсутствовал(а) без уважительной причины" },
  keshikti:{ kk: "Кешікті", ru: "Опоздал(а)" },
};

// ============================
// SECURITY (API KEY)
// ============================
// ВНИМАНИЕ: API_KEY хранится в Script Properties.
// Apps Script -> Project Settings -> Script properties:
//   API_KEY = school2025
function getKey_() {
  return PropertiesService.getScriptProperties().getProperty("API_KEY");
}

function parseBody_(e) {
  return e?.postData?.contents ? JSON.parse(e.postData.contents) : {};
}

function checkKey_(e, body) {
  const key = (e.parameter && e.parameter.key) || body.key;
  if (!key || key !== getKey_()) throw new Error("Unauthorized");
}

// ============================
// ROUTES
// ============================
function doGet(e) {
  try {
    const mode = String(e.parameter.mode || "").trim();
    checkKey_(e, {}); // key обязателен для всех GET

    if (mode === "students") return students_(e);
    if (mode === "classes")  return classes_(e);
    if (mode === "report")   return report_(e);

    return json_({ ok:false, error:"Bad mode" }, 400);
  } catch (err) {
    return json_({ ok:false, error:String(err.message || err) }, 401);
  }
}

function doPost(e) {
  try {
    const body = parseBody_(e);
    checkKey_(e, body);

    // body: { key, date:"YYYY-MM-DD", grade:"3", class_letter:"А", records:[{student_id, status_code}] }
    if (!body.date || !body.grade || !body.class_letter || !Array.isArray(body.records)) {
      return json_({ ok:false, error:"Bad payload" }, 400);
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sh = ensureAttendanceSheet_(ss);

    // перезапись без дублей (date+grade+class_letter)
    removeExisting_(sh, body.date, body.grade, body.class_letter);

    const ts = new Date();
    const rows = body.records.map(r => {
      const code = String(r.status_code || "katysty");
      const dict = STATUS[code] || STATUS.katysty;

      return [
        String(body.date),
        String(r.student_id),
        code,
        dict.kk,
        dict.ru,
        String(body.grade),
        String(body.class_letter),
        ts
      ];
    });

    if (rows.length) {
      sh.getRange(sh.getLastRow() + 1, 1, rows.length, 8).setValues(rows);
    }

    return json_({ ok:true, saved: rows.length });
  } catch (err) {
    return json_({ ok:false, error:String(err.message || err) }, 400);
  }
}

// ============================
// STUDENTS
// ============================
function students_(e) {
  const grade = e.parameter.grade;              // optional
  const classLetter = e.parameter.class_letter; // optional

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sh = ss.getSheetByName(SHEET_STUDENTS);
  if (!sh) return json_({ ok:false, error:"Sheet students not found" }, 400);

  const data = sh.getDataRange().getValues();
  if (data.length < 2) return json_({ ok:true, students: [] });

  const header = data.shift().map(h => String(h).trim());
  const idx = Object.fromEntries(header.map((h,i)=>[h,i]));

  // ВАЖНО: заголовки должны быть: id, full_name, grade, class_letter
  const need = ["id","full_name","grade","class_letter"];
  for (const n of need) {
    if (idx[n] === undefined) return json_({ ok:false, error:`Bad header in students. Need: ${need.join(", ")}` }, 400);
  }

  const out = data
    .filter(r => r[idx.id] !== "" && r[idx.id] != null)
    .filter(r => !grade || String(r[idx.grade]) === String(grade))
    .filter(r => !classLetter || String(r[idx.class_letter]) === String(classLetter))
    .map(r => ({
      id: String(r[idx.id]),
      full_name: String(r[idx.full_name]),
      grade: String(r[idx.grade]),
      class_letter: String(r[idx.class_letter]),
    }));

  return json_({ ok:true, students: out });
}

// ============================
// CLASSES (для dropdown)
// ============================
function classes_(e) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sh = ss.getSheetByName(SHEET_STUDENTS);
  if (!sh) return json_({ ok:false, error:"Sheet students not found" }, 400);

  const data = sh.getDataRange().getValues();
  if (data.length < 2) return json_({ ok:true, classes: [] });

  const header = data.shift().map(h => String(h).trim());
  const idx = Object.fromEntries(header.map((h,i)=>[h,i]));

  const need = ["grade","class_letter"];
  for (const n of need) {
    if (idx[n] === undefined) return json_({ ok:false, error:`Bad header in students. Need columns: grade, class_letter` }, 400);
  }

  const set = new Set();
  data.forEach(r => {
    const g = String(r[idx.grade] || "").trim();
    const l = String(r[idx.class_letter] || "").trim();
    if (g && l) set.add(`${g}${l}`);
  });

  const classes = Array.from(set).sort((a,b) => {
    const ga = parseInt(a,10), gb = parseInt(b,10);
    if (ga !== gb) return ga - gb;
    return a.localeCompare(b, "ru");
  });

  return json_({ ok:true, classes });
}

// ============================
// REPORT
// ============================
function report_(e) {
  const from = e.parameter.from;
  const to = e.parameter.to;
  const grade = e.parameter.grade || "ALL";
  const classLetter = e.parameter.class_letter || "ALL";

  if (!from || !to) return json_({ ok:false, error:"Need from/to" }, 400);

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const shA = ss.getSheetByName(SHEET_ATT);
  const shS = ss.getSheetByName(SHEET_STUDENTS);
  if (!shA) return json_({ ok:false, error:"Sheet attendance not found" }, 400);
  if (!shS) return json_({ ok:false, error:"Sheet students not found" }, 400);

  const att = shA.getDataRange().getValues();
  if (att.length < 2) {
    return json_({ ok:true, from, to, grade, class_letter: classLetter, students: [], daily:{}, totals:{} });
  }

  const attH = att.shift().map(h => String(h).trim());
  const a = Object.fromEntries(attH.map((h,i)=>[h,i]));
  const reqAtt = ["date","student_id","status_code","status_kk","status_ru","grade","class_letter","ts"];
  for (const n of reqAtt) if (a[n] === undefined) return json_({ ok:false, error:`Bad header in attendance. Need: ${reqAtt.join(", ")}` }, 400);

  // students list
  const studs = shS.getDataRange().getValues();
  const sH = studs.shift().map(h => String(h).trim());
  const s = Object.fromEntries(sH.map((h,i)=>[h,i]));
  const reqS = ["id","full_name","grade","class_letter"];
  for (const n of reqS) if (s[n] === undefined) return json_({ ok:false, error:`Bad header in students. Need: ${reqS.join(", ")}` }, 400);

  const students = studs
    .filter(r => r[s.id] !== "" && r[s.id] != null)
    .filter(r => grade === "ALL" || String(r[s.grade]) === String(grade))
    .filter(r => classLetter === "ALL" || String(r[s.class_letter]) === String(classLetter))
    .map(r => ({
      id: String(r[s.id]),
      full_name: String(r[s.full_name]),
      grade: String(r[s.grade]),
      class_letter: String(r[s.class_letter]),
    }));

  const studentMap = new Map(students.map(x => [x.id, x]));

  // filter attendance rows
  const rows = att
    .filter(r => String(r[a.date]) >= from && String(r[a.date]) <= to)
    .filter(r => grade === "ALL" || String(r[a.grade]) === String(grade))
    .filter(r => classLetter === "ALL" || String(r[a.class_letter]) === String(classLetter))
    .filter(r => studentMap.has(String(r[a.student_id])));

  // daily: date -> { student_id: {status_code,status_kk,status_ru} }
  const daily = {};
  rows.forEach(r => {
    const d = String(r[a.date]);
    const sid = String(r[a.student_id]);
    if (!daily[d]) daily[d] = {};
    daily[d][sid] = {
      status_code: String(r[a.status_code] || "katysty"),
      status_kk: String(r[a.status_kk] || STATUS.katysty.kk),
      status_ru: String(r[a.status_ru] || STATUS.katysty.ru),
    };
  });

  // totals per student
  const totals = {};
  students.forEach(st => totals[st.id] = { katysty:0, auyrdy:0, sebep:0, sebsez:0, keshikti:0 });
  rows.forEach(r => {
    const sid = String(r[a.student_id]);
    const code = String(r[a.status_code] || "katysty");
    if (!totals[sid]) totals[sid] = { katysty:0, auyrdy:0, sebep:0, sebsez:0, keshikti:0 };
    if (totals[sid][code] === undefined) totals[sid][code] = 0;
    totals[sid][code] += 1;
  });

  return json_({ ok:true, from, to, grade, class_letter: classLetter, students, daily, totals });
}

// ============================
// HELPERS
// ============================
function ensureAttendanceSheet_(ss) {
  let sh = ss.getSheetByName(SHEET_ATT);
  if (!sh) sh = ss.insertSheet(SHEET_ATT);

  if (sh.getLastRow() === 0) {
    sh.getRange(1,1,1,8).setValues([[
      "date","student_id","status_code","status_kk","status_ru","grade","class_letter","ts"
    ]]);
  }
  return sh;
}

function removeExisting_(sh, date, grade, classLetter) {
  const data = sh.getDataRange().getValues();
  if (data.length < 2) return;

  const header = data[0].map(h => String(h).trim());
  const idx = Object.fromEntries(header.map((h,i)=>[h,i]));

  for (let i = data.length - 1; i >= 1; i--) {
    const r = data[i];
    if (String(r[idx.date]) === String(date) &&
        String(r[idx.grade]) === String(grade) &&
        String(r[idx.class_letter]) === String(classLetter)) {
      sh.deleteRow(i + 1);
    }
  }
}

function json_(obj, code=200) {
  const out = ContentService.createTextOutput(JSON.stringify(obj));
  out.setMimeType(ContentService.MimeType.JSON);
  return out;
}
