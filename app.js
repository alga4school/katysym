// ============================
// LANG (global)
// ============================
let currentLang =
  localStorage.getItem("lang") ||
  document.body.dataset.lang ||
  "kk";
document.body.dataset.lang = currentLang;
let __isSavingAttendance = false;

// ============================
// SETTINGS (СЕРВЕР / KEY)
// ============================
const WEBAPP_URL = "https://old-recipe-0d35eduqatysu.alga4school.workers.dev/";
const API_KEY = "school2025";

// ============================
// STATUS
// ============================
const STATUS = {
  katysty: { kk: "Қатысты", ru: "Присутствовал(а)" }, // default
  auyrdy:  { kk: "Ауырды",  ru: "Болел(а)" },
  sebep:   { kk: "Себепті", ru: "Отсутствовал(а) по уважительной причине" },
  sebsez:  { kk: "Себепсіз",ru: "Отсутствовал(а) без уважительной причины" },
  keshikti:{ kk: "Кешікті", ru: "Опоздал(а)" },
};
const EXCEPTIONS = ["auyrdy", "sebep", "sebsez", "keshikti"];

// ============================
// I18N
// ============================

const I18N = {
  kk: {
    // ===== HEADER / UI =====
    schoolName:
      '"№4 Алға орта мектебі" КММ',
    backHome: "🏠Басты бет",
    homeBtn: "←🏠 Басты бет",

    // ===== TITLES =====
    reportsTitle: "Есептер мен статистика",
    dailyControlTitle: "📚Күнделікті бақылау",

    // ===== FORMS / LABELS =====
    periodLabel: "Кезең",
    pDay: "Күні",
    pWeek: "Апта",
    pMonth: "Ай",
    pQuarter: "Тоқсан",
    pYear: "Жыл",
    pAll: "Барлығы",

    date: "Күні",
    class: "Сынып",
    search: "Іздеу",
    chooseClass: "Сыныпты таңдаңыз",
    allClasses: "Барлық сынып",
fromLabel: "Басталу күні",
toLabel: "Аяқталу күні",
    student: "Оқушы",
    mark: "Белгі",
    colCount: "Саны",

    studentNamePlaceholder: "Оқушы аты",

    // ===== BUTTONS =====
  btnUpdate: " 📈 Көрсету",
btnExport: "⬇️ CSV жүктеу",
btnAdd: "➕ Қосу",
btnClear: "🧹 Тазалау",
saveBtn: "💾 Сақтау",
    save: "Сақтау",

    // ===== HINTS / NOTES =====
    note: "Ескерту",
    attendanceHint:
      "Ескерту: барлығы әдепкіде «Қатысты». Тек қажет болса ғана «Ауырды / Себепті / Себепсіз / Кешікті» таңдаңыз.",
    dayIssuesNote: "Ескерту: “Қатысты” оқушылар көрсетілмейді.",

    // ===== KPI =====
   kpiTotal: "📊 Барлық белгі",
kpiPresent: "✅ Қатысты",
kpiLate: "⏰ Кешікті",
kpiSick: "🤒 Ауырды",
kpiExcused: "📄 Себепті",
kpiUnexcused: "❌ Себепсіз",

    // ===== DAY ISSUES =====
    dayIssuesTitle: "📌 Сабақтан қалғандар (күндік)",
 late: "⏰ Кешіккендер",
sick: "🤒 Ауырғандар",
excused: "📄 Себепті",
unexcused: "❌ Себепсіз",

    // ===== TOP TABLES =====
   topLate: "🔥 Көп кешігу (TOP)",
topUnexcused: "🚫 Көп себепсіз (TOP)",
    
     // ===== HOLIDAYS =====
    schoolDaysLabel: "Оқу күндерінің саны:",

    // ===== MESSAGES =====
    saveOk: "✅ Сақталды:",
    saveErr: "❌ Қате:",
    needClass: "Сыныпты таңдаңыз",
    needDate: "Күнді таңдаңыз",
    chooseException: "Тек қажет болса таңдаңыз",
    needPeriod: "Кезеңді таңдаңыз",
    selectDate: "Күнді таңдаңыз",
    noStudents: "Оқушылар тізімі бос",
    alreadySaved: "✅ Бұл сынып бұл күні бұрын сақталған",
    replaced: "(қайта жазылды)",

    // ===== MAIN PAGE =====
    attendance: "Сабаққа қатысу журналы",
    attendanceDesc:
      "Оқушылардың сабаққа қатысуын есепке алудың автоматтандырылған жүйесі",
    markAttendance: "📚 Сабаққа қатысуды белгілеу",
    reports: "Есептер мен статистика",

    // ===== PWA INSTALL =====
    installPWA: "📱 Қосымша ретінде орнату",
    installAndroid: "📱 Android (Samsung және т.б.)",
    installAndroidSteps:
      "1. Төмен оң жағындағы үш нүкте (⋮) басыңыз\n2. 'Қосымшаға орнату' немесе 'Экранға орнату' таңдаңыз",
    installIOS: "🍎 iPhone (iOS)",
    installIOSSteps:
      "1. Төменгі панельдегі 'Ортадағы' бөлісу батырмасын басыңыз\n2. 'Негізгі экранға қосу' таңдаңыз\n3. 'Қосу' басыңыз",
    installPC: "💻 Компьютер",
    installPCSteps:
      "1. Адрес жолындағы орнату батырмасын басыңыз\n2. Немесе Параметрлер > Қосымшалар > Орнату",
  },

  ru: {
    // ===== HEADER / UI =====
    schoolName:
      'КГУ "Алгинская средняя школа №4"',
    backHome: "🏠Главная",
    homeBtn: "←🏠 Главная",

    // ===== TITLES =====
    reportsTitle: "Отчёты и статистика",
    dailyControlTitle: "📚 Ежедневный контроль",

    // ===== FORMS / LABELS =====
    periodLabel: "Период",
    pDay: "День",
    pWeek: "Неделя",
    pMonth: "Месяц",
    pQuarter: "Квартал",
    pYear: "Год",
    pAll: "Все",

    date: "Дата",
    class: "Класс",
    search: "Поиск",
    chooseClass: "Выберите класс",
    allClasses: "Все классы",
fromLabel: "Дата начала",
toLabel: "Дата окончания",
    student: "Ученик",
    mark: "Отметка",
    colCount: "Кол-во",

    studentNamePlaceholder: "Имя ученика(цы)",

    // ===== BUTTONS =====
    btnUpdate: " Показать",
btnExport: " Экспорт CSV",
btnAdd: "➕ Добавить",
btnClear: "🧹 Очистить",
saveBtn: "💾 Сохранить",
  save: "Сохранить",
    
    // ===== HINTS / NOTES =====
    note: "Примечание",
    attendanceHint:
      "Подсказка: по умолчанию все «Присутствовал(а)». Выбирайте «Болел(а) / По уважительной / Без уважительной / Опоздал(а)» только при необходимости.",
    dayIssuesNote: "Примечание: “Присутствовал(а)” не показывается.",

    // ===== KPI =====
   kpiTotal: "📊 Всего отметок",
kpiPresent: "✅ Присутствовал(а)",
kpiLate: "⏰ Опоздал(а)",
kpiSick: "🤒 Болел(а)",
kpiExcused: "📄 По уважительной",
kpiUnexcused: "❌ Без уважительной",

    // ===== DAY ISSUES =====
    dayIssuesTitle: "📌 Пропуски за день",
late: "⏰ Опоздавшие",
sick: "🤒 Болели",
excused: "📄 По уважительной",
unexcused: "❌ Без уважительной",

    // ===== TOP TABLES =====
   topLate: "🔥 Часто опаздывают (TOP)",
topUnexcused: "🚫 Много без причины (TOP)",

    // ===== HOLIDAYS =====
     schoolDaysLabel: "Количество учебных дней:",
    
    // ===== MESSAGES =====
    saveOk: "✅ Сохранено:",
    saveErr: "❌ Ошибка:",
    needClass: "Выберите класс",
    needDate: "Выберите дату",
    chooseException: "Выбирайте только при необходимости",
    needPeriod: "Укажите период",
    selectDate: "Выберите дату",
    noStudents: "Список учеников пуст",
    alreadySaved: "✅ Этот класс в этот день уже сохранён",
    replaced: "(перезаписано)",

    // ===== MAIN PAGE =====
    attendance: "Журнал посещаемости",
    attendanceDesc:
      "Автоматизированная система учёта посещаемости учебных занятий",
    markAttendance: "📚Отметить посещаемость",
    reports: "📊Отчёты и статистика",

    // ===== PWA INSTALL =====
    installPWA: "📱Установить как приложение",
    installAndroid: "📱Android (Samsung и др.)",
    installAndroidSteps:
      "1. Нажмите три точки (⋮) в нижнем правом углу\n2. Выберите 'Установить приложение' или 'На главный экран'",
    installIOS: "🍎iPhone (iOS)",
    installIOSSteps:
      "1. Нажмите кнопку 'Поделиться' (↑) внизу\n2. Выберите 'На главный экран'\n3. Нажмите 'Добавить'",
    installPC: "💻Компьютер",
    installPCSteps:
      "1. Нажмите кнопку установки в адресной строке\n2. Или Параметры > Приложения > Установить",
  }
};

// ============================
// LANG FUNCTIONS
// ============================
function setLang(lang) {
  currentLang = (lang === "ru") ? "ru" : "kk";
  document.body.dataset.lang = currentLang;
  localStorage.setItem("lang", currentLang);
  applyI18n();
}

/* ================== SCHOOL CALENDAR / HOLIDAYS (ONE COPY ONLY) ================== */
// Saturday/Sunday — rest (5-day study)
constWEEKEND_DAYS = newSet([0, 6]); // Sun=0, Sat=6

// Resmi holidays (2025-2026)
constOFFICIAL_BREAKS_2025_2026 = [
  { from : "2025-10-27" , to : "2025-11-02" }, // autumn
  { from : "2025-12-29" , to : "2026-01-07" }, // winter
  { from : "2026-03-19" , to : "2026-03-29" }, // spring
  // Add if you need a 1st class extension:
  // { from:"2026-02-09", to:"2026-02-15" },
];

functiond0(iso) { returnnewDate(iso + "T00:00:00"); }
   
functioniso(d) { return d.toISOString().slice(0, 10); }
 

functionbetweenInclusive(dateISO, fromISO, toISO) {
 
  const t = d0 (dateISO). getTime ();
  return t >= d0(fromISO).getTime() && t <= d0(toISO).getTime();
}

functionisOfficialBreakDay(dateISO) {
 
  returnOFFICIAL_BREAKS_2025_2026.some(b =>betweenInclusive(dateISO, b.from, b.to));
  
}

function isSchoolDayISO ( dateISO ) {
 
  const day = d0 (dateISO). getDay ();
  if (WEEKEND_DAYS.has(day)) returnfalse;
 
  if ( isOfficialBreakDay (dateISO)) return false ;
 
  returntrue;
 
}

functioncountSchoolDays(fromISO, toISO) {
 
  let c = 0;
  for (let d = d0(fromISO); d <= d0(toISO); d.setDate(d.getDate() + 1)) {
    const dayISO = iso(d);
    if (isSchoolDayISO(dayISO)) c++;
  }
  return c;
}

functionupdateSchoolDaysUI() {
 
  const el = document.getElementById("schoolDaysCount");
  if (!el) return;
  const r = getRangeFromPeriod ();
  el.textContent = r ? countSchoolDays(r.from, r.to) : 0;
}

// ============================
// API
// ============================
async function apiGet(mode, params = {}) {
  const url = new URL(WEBAPP_URL);
  url.searchParams.set("mode", mode);
  url.searchParams.set("key", API_KEY);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const r = await fetch(url.toString(), { method: "GET" });
  const data = await r.json();
  if (!data.ok) throw new Error(data.error || "API error");
  return data;
}

async function apiPost(body) {
  const r = await fetch(WEBAPP_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await r.json();
  if (!data.ok) throw new Error(data.error || "API error");
  return data;
}

// ============================
// STATE
// ============================

let allStudents = [];
let statusMap = newMap();

// ============================
// VIEW SWITCH
// ============================
functionshowView(id){
 
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  const view = document.getElementById(id);
  if (view) view.classList.add("active");
  window.scrollTo({top:0, behavior:"smooth"});
}

functionisReportsViewActive() {
 
  const view = document.getElementById("viewReports");
  return !!(view && view.classList.contains("active"));
}

functiongetElementValue(id, fallback) {
 
  const el = document.getElementById(id);
  return el ? el.value : fallback;
}

// ===== I18N =====
function applyI18n() {
  const dict = I18N[currentLang] || I18N.kk;

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    if (dict[key] != null) el.textContent = dict[key];
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    if (dict[key] != null) el.placeholder = dict[key];
  });

  const period = document.getElementById("periodType");
  if (period) {
    [...period.options].forEach(opt => {
      const key = opt.dataset.i18n;
      if (key && dict[key] != null) opt.textContent = dict[key];
    });
  }

   // ✅ ОСЫ ЖЕРДЕ БОЛУЫ КЕРЕК
  if (window.__classesLoaded) {
    renderClassesTo(document.getElementById("classSelect"), window.__classList, false);
    renderClassesTo(document.getElementById("reportClass"), window.__classList, true);
  }

  if (typeof renderAttendanceTable === "function") {
    renderAttendanceTable();
  }
  updateSchoolDaysUI();
  }

function statusLabel(code){
  const item = STATUS[code] || STATUS.katysty;
  return currentLang === "ru" ? item.ru : item.kk;
}

function rowClassColor(code){
  if (code === "katysty") return "present";
  if (code === "auyrdy") return "sick";
  if (code === "keshikti") return "late";
  if (code === "sebep") return "excused";
  if (code === "sebsez") return "absent";
  return "";
}

function renderClassesTo(selectEl, classList, includeAll=false){
  if (!selectEl) return;
  selectEl.innerHTML = "";

  if (includeAll) {
    const opt = document.createElement("option");
    opt.value = "ALL";
    opt.textContent = currentLang === "ru" ? "Все классы" : "Барлық сынып";
    selectEl.appendChild(opt);
  } else {
    const opt0 = document.createElement("option");
    opt0.value = "";
    opt0.textContent = currentLang === "ru" ? "Выберите класс" : "Сыныпты таңдаңыз";
    selectEl.appendChild(opt0);
  }

  classList.forEach(cls => {
    const opt = document.createElement("option");
    opt.value = cls;
    opt.textContent = cls;
    selectEl.appendChild(opt);
  });
}

function normalizeClassValue(v){
  return String(v || "")
    .replace(/\s+/g, "")   // убираем пробелы: "0 Ә" -> "0Ә"
    .toUpperCase();
}

function parseClass(cls){
  const c = normalizeClassValue(cls);
  const m = c.match(/^(\d+)(.*)$/); // число + буква(ы)
  if (!m) return { grade:"", letter:"" };
  return { grade: m[1], letter: m[2] || "" };
}

function buildStatusCell(studentId){
  const wrap = document.createElement("div");
  wrap.className = "status-cell";

  const text = document.createElement("div");
  text.className = "status-text";
  text.textContent = statusLabel(statusMap.get(studentId) || "katysty");

  const sel = document.createElement("select");
  sel.className = "status-select";

  const hint = document.createElement("option");
  hint.value = "";
  hint.textContent = I18N[currentLang].chooseException;
  sel.appendChild(hint);

  EXCEPTIONS.forEach(code => {
    const o = document.createElement("option");
    o.value = code;
    o.textContent = currentLang === "ru" ? STATUS[code].ru : STATUS[code].kk;
    sel.appendChild(o);
  });

  sel.addEventListener("change", () => {
    const pick = sel.value;
    if (!pick) return;
    statusMap.set(studentId, pick);
    text.textContent = statusLabel(pick);
    sel.value = "";
    const tr = wrap.closest("tr");
    if (tr) tr.className = rowClassColor(pick);
  });

 wrap.appendChild(text);
wrap.appendChild(sel);
return wrap;
}

function renderAttendanceTable(){
  const tbody = document.querySelector("#attendanceTable tbody");
  if (!tbody) return;

  const classSelect = document.getElementById("classSelect");
  const searchInput = document.getElementById("searchInput");

  const selectedClass = classSelect?.value || "";
  const q = (searchInput?.value || "").trim().toLowerCase();

  let filtered = allStudents.slice();

  if (selectedClass) {
    const { grade, letter } = parseClass(selectedClass);
    filtered = filtered.filter(s => String(s.grade) === grade && String(s.class_letter) === letter);
  } else {
    filtered = [];
  }

  if (q) filtered = filtered.filter(s => String(s.full_name).toLowerCase().includes(q));

  tbody.innerHTML = "";
  
  if (filtered.length === 0 && selectedClass) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="4" style="text-align:center; color: #999; padding: 20px;">Оқушылар табылмады</td>`;
    tbody.appendChild(tr);
    return;
  }
  
  filtered.forEach((s, i) => {
    const tr = document.createElement("tr");
    const code = statusMap.get(s.id) || "katysty";
    tr.className = rowClassColor(code);

    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${s.full_name}</td>
      <td>${s.grade}${s.class_letter}</td>
      <td></td>
    `;
    tr.children[3].appendChild(buildStatusCell(s.id));
    tbody.appendChild(tr);
  });
}

// ============================
// SAVE
// ============================
async function saveAttendance() {
  const btn = document.getElementById("saveAttendanceBtn");
  const dateEl = document.getElementById("attendanceDate");
  const classSelect = document.getElementById("classSelect");
  const saveStatus = document.getElementById("saveStatus");

  const date = dateEl?.value;
  const cls = classSelect?.value;

  if (!date) return alert(I18N[currentLang].needDate);
  if (!cls) return alert(I18N[currentLang].needClass);

  // ҚАЙТАЛАНҒАН басуды тоқтатамыз (localStorage guard)
  const { grade, letter } = parseClass(cls);
  const guardKey = `att_saved:${date}:${grade}:${letter}`;
  if (localStorage.getItem(guardKey) === "1") {
    saveStatus.textContent = I18N[currentLang].alreadySaved || "✅ Бұл сынып бұл күні already сақталған";
    return;
  }

  if (btn) btn.disabled = true;
  saveStatus.textContent = "⏳ ...";

  try {
    const students = allStudents.filter(s => String(s.grade) === grade && String(s.class_letter) === letter);
    if (!students.length) {
      throw new Error(I18N[currentLang].noStudents || "Оқушылар тізімі бос. Google Sheet students толтырылғанын тексеріңіз.");
    }

    const records = students.map(s => ({
      student_id: s.id,
      status_code: statusMap.get(s.id) || "katysty",
    }));

    const res = await apiPost({ key: API_KEY, date, grade, class_letter: letter, records });
    if (!res || res.ok === false) {
      throw new Error(res?.error || "Save failed");
    }

    // ✅ енді қайта басса да, фронт бөгейді; ал сервер жағы — overwrite (duplicate болмайды)
    localStorage.setItem(guardKey, "1");
    const extra = res.replaced ? (I18N[currentLang].replaced || "(қайта жазылды)") : "";
    saveStatus.textContent = `${I18N[currentLang].saveOk} ${res.saved} ${extra}`;
  } catch (e) {
    saveStatus.textContent = `${I18N[currentLang].saveErr} ${e.message}`;
  } finally {
    if (btn) btn.disabled = false;
  }
}

/* ================== ПЕРИОД ================== */
function getRangeFromPeriod() {
  const type = document.getElementById("periodType")?.value;
  const toISO = d => d.toISOString().slice(0,10);
  const d0 = s => new Date(s + "T00:00:00");
  const todayISO = () => new Date().toISOString().slice(0, 10);
  
if (type === "custom") {
  const start = document.getElementById("customStart")?.value;
  const end   = document.getElementById("customEnd")?.value || start;
  if (!start) return null;
  return (start <= end) ? { from: start, to: end } : { from: end, to: start };
}
 // ✅ DAY: customStart арқылы 1 күн
  if (type === "day") {
    const d = document.getElementById("customStart")?.value || todayISO();
    return { from: d, to: d };
  }

  // ✅ WEEK: customStart/customEnd арқылы
  if (type === "week") {
    const start = document.getElementById("customStart")?.value || todayISO();
    const end = document.getElementById("customEnd")?.value || start;
    return (start <= end) ? { from: start, to: end } : { from: end, to: start };
  }

  // ✅ MONTH
  if (type === "month") {
    const v = getElementValue ( "monthInput" , "" ) ;
    if (!v) return null;
    const [y,m] = v.split("-");
    const last = new Date ( Number (y), Number (m), 0 ); // last date 
    return { from:`${y}-${m}-01`, to: toISO(last) };
  }

  // ✅ YEAR
  if (type === "year") {
    const y = Number(getElementValue("yearInput", newDate().getFullYear()));
 
    return { from:`${y}-01-01`, to:`${y}-12-31` };
  }

  // ✅ QUARTER
   (type === "quarter") {
    const q = Number(getElementValue("quarterInput", 0));
    // let's say the academic year is 2025 (starts 2025-09-01) 
    const baseY = Number(getElementValue("quarterYearInput", 2025));

    const Q = {
      1: { from:`${baseY}-09-01`, to:`${baseY}-10-26` },
      2: { from:`${baseY}-11-03`, to:`${baseY}-12-28` },
      3: { from:`${baseY+1}-01-08`, to:`${baseY+1}-03-18` },
      4: { from:`${baseY+1}-03-30`, to:`${baseY+1}-05-25` },
    };
    
    return Q[q] || null;
  }

  // ✅ ALL
  if (type === "all") return { from:"2000-01-01", to:"2100-01-01" };

  return null;
}

function sumTotals(report){
  const totals = { total:0, katysty:0, keshikti:0, sebep:0, sebsez:0, auyrdy:0 };
  Object.values(report.totals || {}).forEach(t => {
    ["katysty","keshikti","sebep","sebsez","auyrdy"].forEach(k => {
      totals[k] += Number(t[k] || 0);
      totals.total += Number(t[k] || 0);
    });
  });
  
  return totals;
}

/* ================== TOP ================== */
// ✅ daily арқылы нақты санау (тоқсан/ай/жыл бәріне дұрыс)
function buildTopFromDaily ( report, code, minCount = 3 , limit = 10 ) { 
  const students = (report && report.students) || [];
  const daily = (report && report.daily) || {};

  // id -> student
  const stById = new Map(students.map(s => [String(s.id), s]));

  // id -> count
  const counts = new Map();

  Object.entries(daily).forEach(([dateISO, byId]) => {
    if (!byId) return;
    Object.entries(byId).forEach(([sid, st]) => {
     const c = (st && st.status_code) || "katysty";
      if (c !== code) return;
      counts.set(String(sid), (counts.get(String(sid)) || 0) + 1);
    });
  });

  // build rows
  const rows = [];
  counts.forEach((cnt, sid) => {
    if (cnt < minCount) return;

    const s = stById.get(String(sid));
    const name = s ? s.full_name : sid;
    const cls = s ? `${s.grade}${s.class_letter}` : "";

    rows.push({ name, cls, count: cnt });
  });

  rows.sort((a, b) => b.count - a.count);
  return rows.slice(0, limit);
}


function fillTable(tableId, rows) {
  const tbody = document.querySelector(`#${tableId} tbody`);
  if (!tbody) return;

  tbody.innerHTML = "";

  if (!rows || rows.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="4" style="text-align:center; color:#888; padding:12px;">
      ${currentLang === "ru" ? "Нет данных (нужно ≥ 3 раз)" : "Дерек жоқ (≥ 3 рет болуы керек)"}
    </td>`;
    tbody.appendChild(tr);
    return;
  }

  rows.forEach((r, i) => {
    const tr = document.createElement("tr");
 tr.innerHTML = `<td>${i + 1}</td><td>${escapeHtml(r.name)}</td><td>${escapeHtml(r.cls)}</td><td>${r.count}</td>`;
    tbody.appendChild(tr);
  });
}

functionescapeHtml(s){
  const safe = (s === null || s === undefined) ? "" : s;
  returnString(safe).replace(/[&<>"']/g, c => ({
    "&":"&amp;",
    "<":"&lt;",
    ">":"&gt;",
    "\"":"&quot;",
    "'":"&#39;"
  }[c]));
}

// ============================
// REPORTS
// ============================

function fillSimpleTable(tableId, rows) {
  const tbody = document.querySelector(`#${tableId} tbody`);
  if (!tbody) return;

  tbody.innerHTML = "";
  rows.forEach((r, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${escapeHtml(r.name)}</td>
      <td>${escapeHtml(r.cls)}</td>
    `;
    tbody.appendChild(tr);
  });
}

  /* =========================================
   Day Issues (Lists) + Update Stats (clean)
   ========================================= */
  
  // 1) бір ғана hideDayIssues
function hideDayIssues() {
  const box = document.getElementById("dayIssuesBox");
  if (box) box.style.display = "none";

  ["tblLate", "tblSick", "tblExcused", "tblUnexcused"].forEach((id) => {
    const tb = document.querySelector(`#${id} tbody`);
    if (tb) tb.innerHTML = "";
  });
}
  
// 2) кестеге 3 бағанмен толтыру
function fill3(tableId, rows) {
  
  const tb = document.querySelector(`#${tableId} tbody`);
  if (!tb) return;

  tb.innerHTML = "";
  rows.forEach((r, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${i + 1}</td><td>${r.name}</td><td>${r.cls}</td>`;
    tb.appendChild(tr);
  });
}

// 3) дата диапазонындағы ISO күндер тізімі (бір ғана)
function eachDateISO(fromISO, toISO) {
  const res = [];
  const start = new Date(fromISO + "T00:00:00");
  const end = new Date(toISO + "T00:00:00");
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    res.push(fmtISO(d));
  }
  return res;
}

// 4) report.daily ішінен таңдалған мерзім бойынша (1 күн/апта/ай/жыл/барлығы)
// кешіккен/ауырған/себепті/себепсіз тізімдерді жинау

function buildIssuesForRange(report, range) {
  const stById = new Map((report.students || []).map(s => [String(s.id), s]));
  const daily = report.daily || {};

  const late = [];
  const sick = [];
  const exc  = [];
  const unex = [];

  const seen = {
    keshikti: new Set(),
    auyrdy: new Set(),
    sebep: new Set(),
    sebsez: new Set(),
  };

  for (const dateISO of Object.keys(daily)) {
    if (!betweenInclusive(dateISO, range.from, range.to)) continue;

    const dailyMap = daily[dateISO];
    if (!dailyMap) continue;

    Object.entries(dailyMap).forEach(([sid, st]) => {
       const code = st ? st.status_code : "";
      if (!code || code === "katysty") return;

      if (seen[code] && seen[code].has(String(sid))) return;
      if (seen[code]) seen[code].add(String(sid));

      const s = stById.get(String(sid));
      const row = {
        name: s ? s.full_name : String(sid),
        cls:  s ? `${s.grade}${s.class_letter}` : ""
      };

      if (code === "keshikti") late.push(row);
      if (code === "auyrdy")   sick.push(row);
      if (code === "sebep")    exc.push(row);
      if (code === "sebsez")   unex.push(row);
    });
  }

  return { late, sick, exc, unex };
}

// 5) dayIssuesBox көрсету (ЕНДІ: кез келген мерзімде, кез келген класс/ALL үшін)
function renderDayIssuesForRange(report, range) {
  const box = document.getElementById("dayIssuesBox");
  if (!box) return;

  const issues = buildIssuesForRange(report, range);

  // бәрі бос болса — жасырамыз
  if (!(issues.late.length || issues.sick.length || issues.exc.length || issues.unex.length)) {
    hideDayIssues();
    return;
  }

  // ✅ КҮНДІКТЕ ДЕ 4 КАТЕГОРИЯ
  fill3("tblLate", issues.late);
  fill3("tblSick", issues.sick);
  fill3("tblExcused", issues.exc);
  fill3("tblUnexcused", issues.unex);

  box.style.display = "block";
}

// ===== DATE HELPERS =====

function fmtISO(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function addDaysISO(isoStr, days) {
  const [y,m,d] = isoStr.split("-").map(Number);
  const dt = new Date(y, m-1, d);   // local date
  dt.setDate(dt.getDate() + days);
  return fmtISO(dt);
}

async function updateStats() {
  const range = getRangeFromPeriod();
  if (!range) {
  alert( (I18N[currentLang] && I18N[currentLang].needPeriod) || "Please select a period");
    return;
  }

  const reportClass = getElementValue("reportClass", "ALL");
  let grade = "ALL", class_letter = "ALL";

  if (reportClass !== "ALL") {
    const p = parseClass(reportClass);
    grade = p.grade;
    class_letter = p.letter;
  }

  try {
    
    // ✅ API үшін диапазон: to = келесі күн (end-exclusive болса да дұрыс)
   const apiFrom = range.from;
const apiTo = addDaysISO(range.to, 1); // ✅ әрқашан to+1

const report = await apiGet("report", {
  from: apiFrom,
  to: apiTo,
  grade,
  class_letter,
});
    
console.log("RANGE(UI):", range);
console.log("API:", { from: apiFrom, to: apiTo, grade, class_letter });
console.log("DAILY KEYS:", Object.keys(report.daily || {}).slice(0, 20));
console.log("TOTALS KEYS:", Object.keys(report.totals || {}).length);

    renderDayIssuesForRange(report, range);
    updateSchoolDaysUI();

    // ✅ KPI
    const t = sumTotals(report);
    document.getElementById("totalLessons").textContent = t.total;
    document.getElementById("totalPresent").textContent = t.katysty;
    document.getElementById("totalLate").textContent = t.keshikti;
    document.getElementById("totalSick").textContent = t.auyrdy;
    document.getElementById("totalExcused").textContent = t.sebep;
    document.getElementById("totalUnexcused").textContent = t.sebsez;

    // ✅ TOP (3+)
    fillTable("topLateTable", buildTopFromDaily(report, "keshikti", 3, 10));
    fillTable("topUnexcusedTable", buildTopFromDaily(report, "sebsez", 3, 10));

    // 🔍 Диагностика (қаласаңыз уақытша қалдырыңыз)
    // console.log("RANGE(UI)", range);
    // console.log("RANGE(API)", { from: apiFrom, to: apiTo });
// console.log("DAILY keys sample", report && report.daily ? Object.keys(report.daily).slice(0, 5) : null);

  } catch (e) {
    alert((currentLang === "ru" ? "Ошибка отчёта: " : "Есеп қатесі: ") + e.message);
  }
}

// ===== DATE HELPERS (LOCAL) =====
function iso(d){
  return fmtISO(d);
}

function d0(s){
  const [y,m,d] = s.split("-").map(Number);
  return new Date(y, m-1, d); // local
}
function betweenInclusive(dateISO, fromISO, toISO){
  const t = d0(dateISO).getTime();
  return t >= d0(fromISO).getTime() && t <= d0(toISO).getTime();
}

function exportCsv() {
  const range = getRangeFromPeriod();
  if (!range) {
   alert( (I18N[currentLang] && I18N[currentLang].needPeriod) || "Select a period");
    return;
  }
  const reportClass = getElementValue("reportClass", "ALL");
  let grade = "ALL", class_letter = "ALL";

  if (reportClass !== "ALL") {
    const p = parseClass(reportClass);
    grade = p.grade;
    class_letter = p.letter;
  }
  const apiFrom = range.from;
  const apiTo = addDaysISO(range.to, 1);

 apiGet("report", { from: apiFrom, to: apiTo, grade, class_letter })
    .then(report => {

     const students = (report && report.students) || [];
      const daily = (report && report.daily) || {};
      const totals = (report && report.totals) || {};

      // helpers
     const norm = (s) => String(s || "").replace(/\s+/g, "").toUpperCase();
      const wantedClassNorm = (reportClass === "ALL") ? "" : norm(reportClass);

const getStudentClass = (s) => `${s.grade}${s.class_letter}`;
      const getCode = (st) => ((st && st.status_code) || "katysty");

      const getKk = (st) => {
        const code = getCode(st);
       return (st && st.status_kk) || (STATUS[code] && STATUS[code].kk) || STATUS.katysty.kk;
      };
      
     const getRu = (st) => {
        const code = getCode(st);
        return (st && st.status_ru) || (STATUS[code] && STATUS[code].ru) || STATUS.katysty.ru;
      };
      
      // DAILY rows
      const headerDaily = ["date","student","class","status_code","status_kk","status_ru"];
      const rowsDaily = [];

       Object.entries(daily).forEach(([dateISO, byId]) => {
        students.forEach(s => {
          const cls = getStudentClass(s);
          if (reportClass !== "ALL" && norm(cls) !== wantedClassNorm) return;
        
        const st = byId ? byId[String(s.id)] : undefined;
          const code = getCode(st);

          rowsDaily.push([dateISO, s.full_name, cls, code, getKk(st), getRu(st)]);
        });
      });
      
      // if daily empty → totals export
      let header = headerDaily;
      let rows = rowsDaily;

      if (!rowsDaily.length) {
        const headerTotals = ["student","class","katysty","keshikti","auyrdy","sebep","sebsez","total"];
        const rowsTotals = [];

        students.forEach(s => {
          const cls = getStudentClass(s);
          if (reportClass !== "ALL" && norm(cls) !== wantedClassNorm) return;

           const t = (totals && totals[String(s.id)]) || {};
          const katysty  = Number(t.katysty || 0);
          const keshikti = Number(t.keshikti || 0);
          const auyrdy   = Number(t.auyrdy || 0);
          const sebep    = Number(t.sebep || 0);
          const sebsez   = Number(t.sebsez || 0);
          const total    = katysty + keshikti + auyrdy + sebep + sebsez;

          if (total === 0) return;

          rowsTotals.push([s.full_name, cls, katysty, keshikti, auyrdy, sebep, sebsez, total]);
        });

        if (!rowsTotals.length) {
          alert(currentLang === "ru"
            ? "Нет данных для экспорта за выбранный период."
            : "Таңдалған кезең бойынша экспортқа дерек жоқ.");
          return;
        }

        header = headerTotals;
        rows = rowsTotals;
      }

      // CSV
      const sep = ";";
      const csv = "\ufeff" + [header, ...rows]
        .map(r => r.map(x => {
          const v = String((x === null || x === undefined) ? "" : x);
          return (v.includes(sep) || v.includes('"') || v.includes("\n"))
            ? `"${v.replace(/"/g, '""')}"`
            : v;
        }).join(sep))
        .join("\n");

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;

      const clsPart = (reportClass === "ALL") ? "ALL" : reportClass.replace(/\s+/g, "");
      a.download = `attendance_${clsPart}_${range.from}_to_${range.to}.csv`;

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    })
    .catch(err => alert(err.message));
}

// ============================
// INIT (runs inside DOMContentLoaded above)
// ============================
document.addEventListener("DOMContentLoaded", async () => {

  // Навигация
 const goAttendance = document.getElementById("goAttendance");
  if (goAttendance) goAttendance.addEventListener("click", () => showView("viewAttendance"));
  const goReports = document.getElementById("goReports");
  if (goReports) {
    goReports.addEventListener("click", () => {
      showView("viewReports");
      updateStats();
    });
  }
  const backHome1 = document.getElementById("backHome1");
  if (backHome1) backHome1.addEventListener("click", () => showView("viewHome"));
  const backHome2 = document.getElementById("backHome2");
  if (backHome2) backHome2.addEventListener("click", () => showView("viewHome"));

  // Тілді ауыстыру
  const langToggle = document.getElementById("langToggle");
  if (langToggle) {
    langToggle.addEventListener("click", () => {
      setLang(currentLang === "kk" ? "ru" : "kk");
    });
  }
  
applyI18n();
updateSchoolDaysUI();

  const customStartInput = document.getElementById("customStart");
  if (customStartInput) {
    customStartInput.addEventListener("change", () => {
      const type = getElementValue("periodType", "");
      const startISO = customStartInput.value;
      const endInput = document.getElementById("customEnd");

      if (!startISO || !endInput) {
        updateSchoolDaysUI();
        return;
      }

      if (type === "day") {
        endInput.value = startISO;
      }

      if (type === "week") {
        const d = new Date(startISO + "T00:00:00");
        d.setDate(d.getDate() + 6);
        endInput.value = d.toISOString().slice(0, 10);
      }

      updateSchoolDaysUI();
      updateStats();
    });
  }

  const customEndInput = document.getElementById("customEnd");
  if (customEndInput) {
    customEndInput.addEventListener("change", () => {
      updateSchoolDaysUI();
      updateStats();
    });
  }
  
    // If the period changes — show/hide controls
const periodTypeSelect = document.getElementById("periodType");
if (periodTypeSelect) periodTypeSelect.addEventListener("change", () => {
  const type = periodTypeSelect.value;

  ["monthControl", "quarterControl", "yearControl", "customControl"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
  });

  if (type === "month") document.getElementById("monthControl") && (document.getElementById("monthControl").style.display = "flex");
  if (type === "quarter") document.getElementById("quarterControl") && (document.getElementById("quarterControl").style.display = "flex");
  if (type === "year") document.getElementById("yearControl") && (document.getElementById("yearControl").style.display = "flex");

  if (type === "day" || type === "week" || type === "custom") {
    const customControl = document.getElementById("customControl");
    if (customControl) customControl.style.display = "flex";
  }
  
const customControl = document.getElementById("customControl");
  const toLabel = customControl ? customControl.querySelector('[data-i18n="toLabel"]') : null;
  const toInput = customControl ? customControl.querySelector("#customEnd") : null;
  if (type === "day") {
    if (toLabel) toLabel.style.display = "none";
    if (toInput) {
      toInput.style.display = "none";
      toInput.value = getElementValue("customStart", toInput.value);
    }
  } else {
    if (toLabel) toLabel.style.display = "";
    if (toInput) toInput.style.display = "";
  }
   updateSchoolDaysUI();
   if (isReportsViewActive()) {
     updateStats();
   }
});

// Buttons
 const saveAttendanceBtn = document.getElementById("saveAttendanceBtn");
if (saveAttendanceBtn) saveAttendanceBtn.addEventListener("click", saveAttendance);
const updateStatsBtn = document.getElementById("updateStatsBtn");
if (updateStatsBtn) updateStatsBtn.addEventListener("click", updateStats);
const exportCsvBtn = document.getElementById("exportCsvBtn");
if (exportCsvBtn) exportCsvBtn.addEventListener("click", exportCsv);
const searchInput = document.getElementById("searchInput");
if (searchInput) searchInput.addEventListener("input", renderAttendanceTable);
const reportClassSelect = document.getElementById("reportClass");
if (reportClassSelect) {
  reportClassSelect.addEventListener("change", () => {
    if (isReportsViewActive()) {
      updateStats();
    }
  });
}

// ✅ Make period controls appear correctly immediately when the page opens
if (periodTypeSelect) periodTypeSelect.dispatchEvent(new Event("change"));
  
// API: classes, students
try {
  const cls = await apiGet("classes");
  window.__classesLoaded = true;
  window.__classList = cls.classes || [];

  renderClassesTo(document.getElementById("classSelect"), window.__classList, false);
  renderClassesTo(document.getElementById("reportClass"), window.__classList, true);

  const st = await apiGet("students");
  allStudents = st.students || [];

  allStudents.forEach((s) => statusMap.set(s.id, "katysty"));

  const classSelect = document.getElementById("classSelect");
  if (classSelect) {
    classSelect.addEventListener("change", () => {
      allStudents.forEach((s) => statusMap.set(s.id, "katysty"));
      renderAttendanceTable();
    });
  }

  applyI18n();
  renderAttendanceTable();
} catch (e) {
  alert("API error: " + e.message);
}
}); // ✅ end DOMContentLoaded




























































































