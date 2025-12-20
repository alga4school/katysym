/*************************
 * CONFIG
 *************************/
const SPREADSHEET_ID = "1dHAvNmJXPe1F60wP9ZSw9GhVHM2eMELP90-sWnoSPCE";
const SHEET_STUDENTS = 'students';
const SHEET_ATT = 'attendance';
const API_KEY = 'school2025';

/*************************
 * HELPERS
 *************************/
function normClass(v){
  return String(v ?? '')
    .trim()
    .replace(/\s+/g,'')
    .toUpperCase();
}

function ok_(obj){
  return ContentService
    .createTextOutput(JSON.stringify({ ok:true, ...obj }))
    .setMimeType(ContentService.MimeType.JSON);
}

function err_(msg){
  return ContentService
    .createTextOutput(JSON.stringify({ ok:false, error: msg }))
    .setMimeType(ContentService.MimeType.JSON);
}

/*************************
 * ENTRY
 *************************/
function doGet(e){
  try{
    if (e.parameter.key !== API_KEY) return err_('Invalid key');

    const mode = e.parameter.mode;
    if (mode === 'classes')  return ok_({ classes: getClasses_() });
    if (mode === 'students') return ok_({ students: getStudents_(e.parameter) });
    if (mode === 'report')   return ok_(getReport_(e.parameter));

    return err_('Unknown mode');
  }catch(ex){
    return err_(ex.message);
  }
}

function doPost(e){
  try{
    const body = JSON.parse(e.postData.contents || '{}');
    if (body.key !== API_KEY) return err_('Invalid key');
    saveAttendance_(body);
    return ok_({ saved: body.records.length });
  }catch(ex){
    return err_(ex.message);
  }
}

/*************************
 * CLASSES
 *************************/
function getClasses_(){
  const sh = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_STUDENTS);
  const data = sh.getDataRange().getValues();
  const idx = header_(data[0]);

  const set = new Set();
  for (let i=1;i<data.length;i++){
    const g = normClass(data[i][idx.grade]);
    const l = normClass(data[i][idx.class_letter]);
    if (g && l) set.add(`${g}${l}`);
  }
  return [...set].sort((a,b)=>a.localeCompare(b,'ru',{numeric:true}));
}

/*************************
 * STUDENTS
 *************************/
function getStudents_(p){
  const grade  = normClass(p.grade || 'ALL');
  const letter = normClass(p.class_letter || 'ALL');

  const sh = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_STUDENTS);
  const data = sh.getDataRange().getValues();
  const idx = header_(data[0]);

  return data.slice(1).map(r => ({
    id: r[idx.id],
    full_name: r[idx.full_name],
    grade: normClass(r[idx.grade]),
    class_letter: normClass(r[idx.class_letter])
  }))
  .filter(s =>
    (grade === 'ALL'  || s.grade === grade) &&
    (letter === 'ALL' || s.class_letter === letter)
  );
}

/*************************
 * SAVE ATTENDANCE
 *************************/
function saveAttendance_(body){
  const sh = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_ATT);
  const date = body.date;
  const grade = normClass(body.grade);
  const letter = normClass(body.class_letter);

  body.records.forEach(r=>{
    sh.appendRow([
      date,
      r.student_id,
      grade,
      letter,
      r.status_code
    ]);
  });
}

/*************************
 * REPORT
 *************************/
function getReport_(p){
  const grade  = normClass(p.grade || 'ALL');         // "0" дұрыс сақталады
  const letter = normClass(p.class_letter || 'ALL');  // "Ә" дұрыс

  const from = String(p.from || "");
  const to   = String(p.to || "");

  const students = getStudents_({ grade, class_letter: letter });
  const mapStudents = new Map(students.map(s=>[String(s.id),s]));

  const sh = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_ATT);
  const data = sh.getDataRange().getValues();
  const idx = header_(data[0]);

  const daily = {};
  const totals = {};

  for (let i=1;i<data.length;i++){
    const r = data[i];

    // ✅ date-ті міндетті түрде YYYY-MM-DD қыламыз
    let d = r[idx.date];
    if (d instanceof Date) {
      d = Utilities.formatDate(d, Session.getScriptTimeZone(), "yyyy-MM-dd");
    } else {
      d = String(d || "").slice(0,10);
    }

    if (!d) continue;
    if (from && d < from) continue;
    if (to && d > to) continue;

    // ✅ grade/letter-ді нормализация
    const rg = normClass(r[idx.grade]);
    const rl = normClass(r[idx.class_letter]);

    // ✅ "0" енді ешқашан жоғалып кетпейді
    if (grade !== 'ALL' && rg !== grade) continue;
    if (letter !== 'ALL' && rl !== letter) continue;

    const sid = String(r[idx.student_id]);
    if (!mapStudents.has(sid)) continue;

    const code = String(r[idx.status_code] || "");

    if (!daily[d]) daily[d] = {};
    daily[d][sid] = { status_code: code };

    if (!totals[sid]) totals[sid] = {};
    totals[sid][code] = (totals[sid][code] || 0) + 1;
  }

  return { students, daily, totals };
  // rowsFiltered — фильтрден өткен жазбалар

const list = { late: [], sick: [], excused: [], unexcused: [] };

rowsFiltered.forEach(r => {
  const st = String(r[idx.status_code] || "");

  const item = {
    full_name: r[idx.full_name],
    grade: r[idx.grade],
    class_letter: r[idx.class_letter],
  };

  if (st === "keshikti") list.late.push(item);
  if (st === "auyrdy")   list.sick.push(item);
  if (st === "sebep")    list.excused.push(item);
  if (st === "sebsez")   list.unexcused.push(item);
});

// ✅ return тек функцияның ішінде болуы керек!
return {
  totals: totals,
  topLate: topLate,
  topUnexcused: topUnexcused,
  lists: list
};

}

/*************************
 * HEADER MAP
 *************************/
function header_(h){
  const m = {};
  h.forEach((v,i)=> m[String(v).toLowerCase()] = i);

  return {
    id: m.id,
    full_name: m.full_name,
    grade: m.grade,
    class_letter: m.class_letter,
    date: m.date,
    student_id: m.student_id,
    status_code: m.status_code
  };
}


function testOpen(){
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  Logger.log(ss.getName());
}

