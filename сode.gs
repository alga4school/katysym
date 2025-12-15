// ============= CONFIG =============
const SPREADSHEET_ID = "1dHAvNmJXPe1F60wP9ZSw9GhVHM2eMELP90-sWnoSPCE";
const SHEET_STUDENTS = "students";
const SHEET_ATT = "attendance";
const API_KEY = "CHANGE_ME_KEY"; // поставь такой же ключ как в app.js

const STATUS = {
  katysty: { kk: "Қатысты", ru: "Присутствовал(а)" },
  auyrdy:  { kk: "Ауырды",  ru: "Болел(а)" },
  sebep:   { kk: "Себепті", ru: "Отсутствовал(а) по уважительной причине" },
  sebsez:  { kk: "Себепсіз",ru: "Отсутствовал(а) без уважительной причины" },
  keshikti:{ kk: "Кешікті", ru: "Опоздал(а)" },
};

function jsonOut(obj){
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e){
  try{
    const p = e.parameter || {};
    if ((p.key || "") !== API_KEY) return jsonOut({ ok:false, error:"bad_key" });

    const mode = (p.mode || "").toLowerCase();
    if (mode === "report") return handleReport_(p);

    return jsonOut({ ok:false, error:"unknown_mode", got:mode });
  }catch(err){
    return jsonOut({ ok:false, error:String(err) });
  }
}

function handleReport_(p){
  const from = p.from; // YYYY-MM-DD
  const to   = p.to;   // YYYY-MM-DD
  const grade = p.grade || "ALL";
  const class_letter = p.class_letter || "ALL";
  if (!from || !to) return jsonOut({ ok:false, error:"need_from_to" });

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const shA = ss.getSheetByName(SHEET_ATT);
  const shS = ss.getSheetByName(SHEET_STUDENTS);
  if (!shA || !shS) return jsonOut({ ok:false, error:"missing_sheets" });

  // students: ожидаем колонки: id, full_name, grade, class_letter
  const sVals = shS.getDataRange().getValues();
  const sHead = sVals.shift().map(String);
  const si = {
    id: sHead.indexOf("id"),
    full_name: sHead.indexOf("full_name"),
    grade: sHead.indexOf("grade"),
    class_letter: sHead.indexOf("class_letter"),
  };
  const studentsAll = sVals
    .filter(r => r[si.id])
    .map(r => ({
      id: String(r[si.id]),
      full_name: String(r[si.full_name] || ""),
      grade: String(r[si.grade] || ""),
      class_letter: String(r[si.class_letter] || "")
    }))
    .filter(s => (grade === "ALL" || s.grade === String(grade)) &&
                 (class_letter === "ALL" || s.class_letter === String(class_letter)));

  const allowedIds = new Set(studentsAll.map(s => s.id));

  // attendance: ожидаем колонки: date, student_id, status_code, grade, class_letter
  const aVals = shA.getDataRange().getValues();
  const aHead = aVals.shift().map(String);
  const ai = {
    date: aHead.indexOf("date"),
    student_id: aHead.indexOf("student_id"),
    status_code: aHead.indexOf("status_code"),
    grade: aHead.indexOf("grade"),
    class_letter: aHead.indexOf("class_letter"),
  };

  const daily = {};   // daily[date][studentId] = {status_code, status_kk, status_ru}
  const totals = {};  // totals[studentId][code]++

  const fromD = new Date(from + "T00:00:00");
  const toD   = new Date(to   + "T23:59:59");

  aVals.forEach(r => {
    const dStr = String(r[ai.date] || "");
    if (!dStr) return;
    const d = new Date(dStr + "T00:00:00");
    if (d < fromD || d > toD) return;

    const sid = String(r[ai.student_id] || "");
    if (!allowedIds.has(sid)) return;

    const code = String(r[ai.status_code] || "katysty");
    const st = STATUS[code] || STATUS.katysty;

    if (!daily[dStr]) daily[dStr] = {};
    daily[dStr][sid] = { status_code: code, status_kk: st.kk, status_ru: st.ru };

    if (!totals[sid]) totals[sid] = { katysty:0, auyrdy:0, sebep:0, sebsez:0, keshikti:0 };
    totals[sid][code] = (totals[sid][code] || 0) + 1;
  });

  return jsonOut({
    ok:true,
    from, to,
    grade, class_letter,
    students: studentsAll,
    daily,
    totals
  });
}
