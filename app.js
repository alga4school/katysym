// ============================
// SETTINGS (СІЗДІҢ URL / KEY)
// ============================
const WEBAPP_URL = "https://broken-paper-fdf4.alga4school.workers.dev/";
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
let currentLang = document.body.dataset.lang || "kk";

const I18N_UI = {
  kk: {
    schoolName: 'Ақтөбе облысының білім басқармасы Алға ауданының білім бөлімі" ММ "№4 Алға орта мектебі" КММ',
    bannerTitle: "Қатысу журналы",
    bannerText: "Оқушылардың сабаққа қатысуын, кешігуді және себепсіз қалуды\nкүнделікті бақылауға арналған мектепішілік жүйе.",
    btnAttendance: "Қатысуды белгілеу",
    btnReports: "Есептер мен статистика",
    backHome: "Басты бет",
    attendanceTitle: "Қатысу журналы",
    reportsTitle: "Есептер мен статистика",
    dateLabel: "Күні",
    classLabel: "Сынып",
    searchLabel: "Іздеу",
    saveBtn: "Сақтау",
    colStudent: "Оқушы",
    colClass: "Сынып",
    colStatus: "Белгі",
    colCount: "Саны",
    attendanceHint: "Ескерту: барлығы әдепкіде «Қатысты». Тек қажет болса ғана «Ауырды / Себепті / Себепсіз / Кешікті» таңдаңыз.",
    reportHint: "Ескерту: Есептер деректері Google Script арқылы алынады.",
    periodLabel: "Кезең",
    fromLabel: "Басталу күні",
    toLabel: "Аяқталу күні",
    monthLabel: "Ай",
    quarterLabel: "Тоқсан",
    yearLabel: "Жыл",
    pDay: "Күні",
    pWeek: "Апта",
    pMonth: "Ай",
    pQuarter: "Тоқсан",
    pYear: "Жыл",
    pAll: "Барлығы",
    btnUpdate: "Көрсету",
    btnExport: "CSV жүктеу",
    kpiTotal: "Барлық белгі",
    kpiPresent: "Қатысты",
    kpiLate: "Кешікті",
    kpiSick: "Ауырды",
    kpiExcused: "Себепті",
    kpiUnexcused: "Себепсіз",
    topLate: "Көп кешігу (TOP)",
    topUnexcused: "Көп себепсіз (TOP)",
  },
  ru: {
    schoolName: 'КГУ "Алгинская средняя школа №4" ГУ "Отдел образования Алгинского района Управления образования Актюбинской области"',
    bannerTitle: "Журнал посещаемости",
    bannerText: "Внутришкольная система для ежедневного контроля посещаемости,\nопозданий и пропусков без причины.",
    btnAttendance: "Журнал посещаемости",
    btnReports: "Отчёты и статистика",
    backHome: "Главная",
    attendanceTitle: "Журнал посещаемости",
    reportsTitle: "Отчёты и статистика",
    dateLabel: "Дата",
    classLabel: "Класс",
    searchLabel: "Поиск",
    saveBtn: "Сохранить",
    colStudent: "Ученик",
    colClass: "Класс",
    colStatus: "Статус",
    colCount: "Кол-во",
    attendanceHint: "Подсказка: по умолчанию все «Присутствовал(а)». Выбирайте «Болел(а) / По уважит. / Без уважит. / Опоздал(а)» только при необходимости.",
    reportHint: "Подсказка: данные отчёта берутся через Google Script.",
    periodLabel: "Период",
    fromLabel: "От даты",
    toLabel: "До даты",
    monthLabel: "Месяц",
    quarterLabel: "Квартал",
    yearLabel: "Год",
    pDay: "День",
    pWeek: "Неделя",
    pMonth: "Месяц",
    pQuarter: "Квартал",
    pYear: "Год",
    pAll: "Все",
    btnUpdate: "Показать",
    btnExport: "Экспорт CSV",
    kpiTotal: "Всего отметок",
    kpiPresent: "Присутствовал(а)",
    kpiLate: "Опоздал(а)",
    kpiSick: "Болел(а)",
    kpiExcused: "По уважит.",
    kpiUnexcused: "Без уважит.",
    topLate: "Часто опаздывают (TOP)",
    topUnexcused: "Много без причины (TOP)",
  }
};

/* ================== НАСТРОЙКИ ================== */
const WEEKEND_DAYS = new Set([5, 6]); // Пятница + Суббота
const HOLIDAYS_KEY = "katysym_holidays_v1";

/* ================== HOLIDAYS ================== */
function loadHolidays() {
  try {
    return new Set(JSON.parse(localStorage.getItem(HOLIDAYS_KEY) || "[]"));
  } catch {
    return new Set();
  }
}
function saveHolidays(set) {
  localStorage.setItem(HOLIDAYS_KEY, JSON.stringify([...set].sort()));
}

let HOLIDAYS = loadHolidays();

function renderHolidays() {
  const el = document.getElementById("holidaysList");
  if (!el) return;

  if (!HOLIDAYS.size) {
    el.innerHTML = "<em>Таңдалмаған</em>";
    return;
  }

  el.innerHTML = [...HOLIDAYS].map(d => `
    <span class="holidayTag">${d}
      <button data-date="${d}" class="delHolidayBtn">×</button>
    </span>
  `).join(" ");

  el.querySelectorAll(".delHolidayBtn").forEach(btn => {
    btn.onclick = () => {
      HOLIDAYS.delete(btn.dataset.date);
      saveHolidays(HOLIDAYS);
      renderHolidays();
      updateSchoolDaysUI();
    };
  });
}

function initHolidayUI() {
  document.getElementById("addHolidayBtn").onclick = () => {
    const d = document.getElementById("holidayPick").value;
    if (!d) return;
    HOLIDAYS.add(d);
    saveHolidays(HOLIDAYS);
    renderHolidays();
    updateSchoolDaysUI();
  };

  document.getElementById("clearHolidaysBtn").onclick = () => {
    HOLIDAYS.clear();
    saveHolidays(HOLIDAYS);
    renderHolidays();
    updateSchoolDaysUI();
  };

  renderHolidays();
}

function isSchoolDayISO(iso) {
  if (HOLIDAYS.has(iso)) return false;
  const d = new Date(iso + "T00:00:00");
  return !WEEKEND_DAYS.has(d.getDay());
}

function countSchoolDays(from, to) {
  let c = 0;
  for (let d = new Date(from); d <= new Date(to); d.setDate(d.getDate() + 1)) {
    if (isSchoolDayISO(d.toISOString().slice(0,10))) c++;
  }
  return c;
}

function updateSchoolDaysUI() {
  const el = document.getElementById("schoolDaysCount");
  const r = getRangeFromPeriod();
  el.textContent = r ? countSchoolDays(r.from, r.to) : 0;
}

const I18N_MSG = {
  kk: {
    saveOk: "✅ Сақталды:",
    saveErr: "❌ Қате:",
    needClass: "Сыныпты таңдаңыз",
    needDate: "Күнді таңдаңыз",
    chooseException: "Тек қажет болса таңдаңыз",
    needPeriod: "Кезеңді таңдаңыз",
  },
  ru: {
    saveOk: "✅ Сохранено:",
    saveErr: "❌ Ошибка:",
    needClass: "Выберите класс",
    needDate: "Выберите дату",
    chooseException: "Выбирайте только при необходимости",
    needPeriod: "Укажите период",
  }
};

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
let statusMap = new Map();

// ============================
// VIEW SWITCH
// ============================
function showView(id){
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  document.getElementById(id)?.classList.add("active");
  window.scrollTo({top:0, behavior:"smooth"});
}

// ============================
// I18N APPLY
// ============================
function setLang(lang){
  currentLang = lang;
  document.body.dataset.lang = lang;
  applyI18n();
}

function applyI18n(){
  const dict = I18N_UI[currentLang] || I18N_UI.kk;

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key] != null) el.textContent = dict[key];
  });

  const search = document.getElementById("searchInput");
  if (search) search.placeholder = currentLang === "ru" ? "ФИО..." : "Аты-жөні...";

  const period = document.getElementById("periodType");
  if (period) {
    [...period.options].forEach(opt => {
      const k = opt.getAttribute("data-i18n");
      if (k && dict[k] != null) opt.textContent = dict[k];
    });
  }

  if (window.__classesLoaded) {
    renderClassesTo(document.getElementById("classSelect"), window.__classList, false);
    renderClassesTo(document.getElementById("reportClass"), window.__classList, true);
  }

  renderAttendanceTable();
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

function parseClass(cls){
  const grade = String(parseInt(cls, 10));
  const letter = cls.replace(grade, "");
  return { grade, letter };
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
  hint.textContent = I18N_MSG[currentLang].chooseException;
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
async function saveAttendance(){
  const dateEl = document.getElementById("attendanceDate");
  const classSelect = document.getElementById("classSelect");
  const saveStatus = document.getElementById("saveStatus");

  const date = dateEl?.value;
  const cls = classSelect?.value;

  if (!date) return alert(I18N_MSG[currentLang].needDate);
  if (!cls) return alert(I18N_MSG[currentLang].needClass);

  const { grade, letter } = parseClass(cls);
  const students = allStudents.filter(s => String(s.grade) === grade && String(s.class_letter) === letter);

  const records = students.map(s => ({
    student_id: s.id,
    status_code: statusMap.get(s.id) || "katysty"
  }));

  saveStatus.textContent = "⏳ ...";

  try {
    const res = await apiPost({ key: API_KEY, date, grade, class_letter: letter, records });
    saveStatus.textContent = `${I18N_MSG[currentLang].saveOk} ${res.saved}`;
  } catch (e) {
    saveStatus.textContent = `${I18N_MSG[currentLang].saveErr} ${e.message}`;
  }
}

/* ================== ПЕРИОД ================== */
function getRangeFromPeriod() {
  const type = document.getElementById("periodType").value;
  const today = new Date();
  const toISO = d => d.toISOString().slice(0,10);

  if (type === "custom") {
    const s = customStart.value, e = customEnd.value;
    if (!s || !e) return null;
    return { from:s, to:e };
  }

  if (type === "week") {
    const end = today, start = new Date();
    start.setDate(start.getDate() - 6);
    return { from:toISO(start), to:toISO(end) };
  }

  if (type === "month") {
    const [y,m] = monthInput.value.split("-");
    return { from:`${y}-${m}-01`, to:toISO(new Date(y,m,0)) };
  }

  if (type === "year") {
    const y = quarterYearInput.value || today.getFullYear();
    return { from:`${y}-01-01`, to:`${y}-12-31` };
  }

  if (type === "quarter") {
    const q = Number(quarterInput.value || 0);
    const y = Number(quarterYearInput.value || 2025);

    const Q = {
      1:{from:`${y}-09-01`,to:`${y}-10-26`},
      2:{from:`${y}-11-01`,to:`${y}-12-28`},
      3:{from:`${y+1}-01-07`,to:`${y+1}-03-22`},
      4:{from:`${y+1}-03-30`,to:`${y+1}-05-25`}
    };

    if (q === 0) {
      const t = today.toISOString().slice(0,10);
      for (const k in Q)
        if (t>=Q[k].from && t<=Q[k].to) return Q[k];
    }
    return Q[q];
  }

  if (type === "all") return {from:"2000-01-01",to:"2100-01-01"};
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
function buildTop(report, code, limit=10) {
  return (report.students||[])
    .map(s=>({
      name:s.full_name,
      cls:`${s.grade}${s.class_letter}`,
      count:Number(report.totals?.[String(s.id)]?.[code]||0)
    }))
    .filter(x=>x.count>4) // ТЕК 5+ рет
    .sort((a,b)=>b.count-a.count)
    .slice(0,limit);
}

function fillTable(tableId, rows){
  const tbody = document.querySelector(`#${tableId} tbody`);
  if (!tbody) return;
  tbody.innerHTML = "";
  rows.forEach((r,i)=>{
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${i+1}</td><td>${r.name}</td><td>${r.cls}</td><td>${r.count}</td>`;
    tbody.appendChild(tr);
  });
}

async function updateStats() {
  const range = getRangeFromPeriod();
  updateSchoolDaysUI();
  if (!range) return alert(I18N_MSG[currentLang].needPeriod);
  const reportClass = document.getElementById("reportClass").value || "ALL";
  let grade = "ALL", class_letter = "ALL";
  if (reportClass !== "ALL") {
    const p = parseClass(reportClass);
    grade = p.grade;
    class_letter = p.letter;
  }
  try {
    const report = await apiGet("report", {
      from: range.from,
      to: range.to,
      grade,
      class_letter
    });
    async function updateStats() {
  const range = getRangeFromPeriod();
  updateSchoolDaysUI();
  if (!range) return alert(I18N_MSG[currentLang].needPeriod);
  const reportClass = document.getElementById("reportClass").value || "ALL";
  let grade = "ALL", class_letter = "ALL";
  if (reportClass !== "ALL") {
    const p = parseClass(reportClass);
    grade = p.grade;
    class_letter = p.letter;
  }
  try {
    const report = await apiGet("report", {
      from: range.from,
      to: range.to,
      grade,
      class_letter
    });
    
    if (document.getElementById("periodType").value === "custom" && range.from === range.to) {
  renderDayIssues(report, range.from);
} else {
 hideDayIssues();
}
const periodType = document.getElementById("periodType").value;
const reportClass = document.getElementById("reportClass").value || "ALL";

// Тек "Күні" және нақты сынып таңдалса ғана тізім көрсетеміз
if (periodType === "custom" && reportClass !== "ALL" && range.from === range.to) {
  renderDayList(report, range.from);
} else {
  hideDayIssues();
}

    const t = sumTotals(report); 
    
    if (document.getElementById("periodType").value === "custom" && range.from === range.to) {
  renderDayIssues(report, range.from);
} else {
 hideDayIssues();
}
const periodType = document.getElementById("periodType").value;
const reportClass = document.getElementById("reportClass").value || "ALL";

// Тек "Күні" және нақты сынып таңдалса ғана тізім көрсетеміз
if (periodType === "custom" && reportClass !== "ALL" && range.from === range.to) {
  renderDayList(report, range.from);
} else {
  hideDayIssues();
}

    const t = sumTotals(report);

    document.getElementById("totalLessons").textContent = t.total;
    document.getElementById("totalPresent").textContent = t.katysty;
    document.getElementById("totalLate").textContent = t.keshikti;
    document.getElementById("totalSick").textContent = t.auyrdy;
    document.getElementById("totalExcused").textContent = t.sebep;
    document.getElementById("totalUnexcused").textContent = t.sebsez;

   fillTable("topLateTable", buildTop(report, "keshikti", 10, 4));
fillTable("topUnexcusedTable", buildTop(report, "sebsez", 10, 4));

  } catch (e) {
    alert((currentLang === "ru" ? "Ошибка отчёта: " : "Отчет қатесі: ") + e.message);
  }
}
/* ================== INIT ================== */
document.addEventListener("DOMContentLoaded",()=>{
  initHolidayUI();
  updateSchoolDaysUI();
});

/* ================== CSV ================== */
function exportCsv(){
  const r=getRangeFromPeriod(); if(!r)return alert("Период таңдаңыз");
  apiGet("report",{from:r.from,to:r.to,grade:"ALL",class_letter:"ALL"}).then(rep=>{
    const header=["Күні","Оқушы","Сынып","Статус"];
    const rows=[];
    Object.entries(rep.daily||{}).forEach(([d,m])=>{
      Object.entries(m).forEach(([id,st])=>{
        const s=rep.students.find(x=>String(x.id)===String(id));
        rows.push([d,s?.full_name||"",`${s?.grade||""}${s?.class_letter||""}`,st.status_kk]);
      });
    });

    const sep=";";
    const csv="\ufeff"+[header,...rows].map(r=>r.join(sep)).join("\n");
    const a=document.createElement("a");
    a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8;"}));
    a.download="attendance.csv"; a.click();
  });
}


// ============================
// INIT
// ============================
document.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("goAttendance")?.addEventListener("click", () => showView("viewAttendance"));
  document.getElementById("goReports")?.addEventListener("click", () => showView("viewReports"));
  document.getElementById("backHome1")?.addEventListener("click", () => showView("viewHome"));
  document.getElementById("backHome2")?.addEventListener("click", () => showView("viewHome"));

  document.getElementById("langToggle")?.addEventListener("click", () => {
    setLang(currentLang === "kk" ? "ru" : "kk");
  });

  const today = new Date();
  const iso = today.toISOString().slice(0,10);
  document.getElementById("attendanceDate").value = iso;
  document.getElementById("customStart").value = iso;
  document.getElementById("customEnd").value = iso;
  document.getElementById("yearInput").value = today.getFullYear();
  document.getElementById("quarterYearInput").value = today.getFullYear();

  document.getElementById("periodType")?.addEventListener("change", () => {
    const type = document.getElementById("periodType").value;
    ["monthControl","quarterControl","yearControl","customControl"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = "none";
    });
    if (type === "month") document.getElementById("monthControl").style.display = "flex";
    if (type === "quarter") document.getElementById("quarterControl").style.display = "flex";
    if (type === "year") document.getElementById("yearControl").style.display = "flex";
    if (type === "custom") document.getElementById("customControl").style.display = "flex";
    if (type === "week") document.getElementById("customControl").style.display = "none";
  });

  document.getElementById("saveAttendanceBtn")?.addEventListener("click", saveAttendance);
  document.getElementById("updateStatsBtn")?.addEventListener("click", updateStats);
  document.getElementById("exportCsvBtn")?.addEventListener("click", exportCsv);
  document.getElementById("searchInput")?.addEventListener("input", renderAttendanceTable);

  try {
    const cls = await apiGet("classes");
    window.__classesLoaded = true;
    window.__classList = cls.classes || [];
    renderClassesTo(document.getElementById("classSelect"), window.__classList, false);
    renderClassesTo(document.getElementById("reportClass"), window.__classList, true);

    const st = await apiGet("students");
    allStudents = st.students || [];
    allStudents.forEach(s => statusMap.set(s.id, "katysty"));

    document.getElementById("classSelect")?.addEventListener("change", () => {
      allStudents.forEach(s => statusMap.set(s.id, "katysty"));
      renderAttendanceTable();
    });

    applyI18n();
    renderAttendanceTable();
  } catch (e) {
    alert("API error: " + e.message);
  }
});

function hideDayIssues(){
  const box = document.getElementById("dayIssuesBox");
  if (box) box.style.display = "none";
}














