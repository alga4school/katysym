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
const HOLIDAYS_KEY = "katysym_holidays_v1";
const WEEKEND_DAYS = new Set([5, 6]); // Пт+Сб выходные (как ты сказала)

function loadHolidays() {
  try { return new Set(JSON.parse(localStorage.getItem(HOLIDAYS_KEY) || "[]")); }
  catch { return new Set(); }
}
function saveHolidays(set) {
  localStorage.setItem(HOLIDAYS_KEY, JSON.stringify([...set].sort()));
}

let HOLIDAYS = loadHolidays();

function renderHolidays() {
  const el = document.getElementById("holidaysList");
  if (!el) return;

  const arr = [...HOLIDAYS].sort();
  if (!arr.length) {
    el.innerHTML = "<em>Не выбрано</em>";
    return;
  }

  el.innerHTML = arr.map(d => `
    <span class="holidayTag">
      ${d}
      <button type="button" data-date="${d}" class="delHolidayBtn">×</button>
    </span>
  `).join(" ");

  el.querySelectorAll(".delHolidayBtn").forEach(btn => {
    btn.addEventListener("click", () => {
      HOLIDAYS.delete(btn.dataset.date);
      saveHolidays(HOLIDAYS);
      renderHolidays();
      updateSchoolDaysUI(); // пересчёт
    });
  });
}

function initHolidayUI() {
  const addBtn = document.getElementById("addHolidayBtn");
  const clearBtn = document.getElementById("clearHolidaysBtn");
  const pick = document.getElementById("holidayPick");

  if (addBtn && pick) {
    addBtn.addEventListener("click", () => {
      const v = pick.value;
      if (!v) return;
      HOLIDAYS.add(v);
      saveHolidays(HOLIDAYS);
      renderHolidays();
      pick.value = "";
      updateSchoolDaysUI();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      HOLIDAYS = new Set();
      saveHolidays(HOLIDAYS);
      renderHolidays();
      updateSchoolDaysUI();
    });
  }

  renderHolidays();
}

function isSchoolDayISO(iso) {
  if (HOLIDAYS.has(iso)) return false;

  const d = new Date(iso + "T00:00:00");
  const dow = d.getDay();
  if (WEEKEND_DAYS.has(dow)) return false;

  return true;
}
function renderDayList(report, dateISO) {
  const box = document.getElementById("dayListBox");
  const tbody = document.querySelector("#dayListTable tbody");
  if (!box || !tbody) return;

  // Тек 1 күнге арналған map
  const map = (report.daily && report.daily[dateISO]) ? report.daily[dateISO] : null;

  // Егер дерек жоқ болса да — сыныптағы оқушыларды “Қатысты” деп шығарып қоямыз
  const students = report.students || [];

  tbody.innerHTML = "";

  students.forEach((s, i) => {
    const sid = String(s.id);
    const st = map && map[sid] ? map[sid] : null;

    const statusText =
      st ? (st.status_kk || st.status_ru || st.status_code)
         : "Қатысты"; // егер жазба жоқ болса

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${s.full_name || ""}</td>
      <td>${(s.grade || "")}${(s.class_letter || "")}</td>
      <td>${statusText}</td>
    `;
    tbody.appendChild(tr);
  });

  box.style.display = "block";
}

function hideDayList() {
  const box = document.getElementById("dayListBox");
  if (box) box.style.display = "none";
}

function countSchoolDays(fromISO, toISO) {
  const from = new Date(fromISO + "T00:00:00");
  const to = new Date(toISO + "T00:00:00");
  let c = 0;
  for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
    const iso = d.toISOString().slice(0,10);
    if (isSchoolDayISO(iso)) c++;
  }
  return c;
}

function updateSchoolDaysUI() {
  const el = document.getElementById("schoolDaysCount");
  if (!el) return;
  const range = getRangeFromPeriod();
  if (!range) { el.textContent = "0"; return; }
  el.textContent = String(countSchoolDays(range.from, range.to));
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

// ============================
// REPORTS
// ============================
function getRangeFromPeriod(){
  const type = document.getElementById("periodType").value;
  const today = new Date();
  const toISO = (d) => d.toISOString().slice(0, 10);

  if (type === "custom") {
    const s = document.getElementById("customStart").value;
    const e = document.getElementById("customEnd").value;
    if (!s || !e) return null;
    return { from: s, to: e };
  }

  if (type === "week") {
    // автомат: соңғы 7 күн
    const end = new Date(today);
    const start = new Date(today);
    start.setDate(start.getDate() - 6);
    return { from: toISO(start), to: toISO(end) };
  }

  if (type === "all") return { from:"2000-01-01", to:"2100-01-01" };

  if (type === "month") {
    const mi = document.getElementById("monthInput").value;
    if (!mi) return null;
    const [y,m] = mi.split("-").map(Number);
    const start = new Date(y, m-1, 1);
    const end = new Date(y, m, 0);
    return { from: toISO(start), to: toISO(end) };
  }

  if (type === "year") {
    const y = Number(document.getElementById("yearInput").value || today.getFullYear());
    return { from: `${y}-01-01`, to: `${y}-12-31` };
  }

 if (type === "quarter") {
  const q = Number(document.getElementById("quarterInput").value || 1);
  const y = Number(document.getElementById("quarterYearInput").value || today.getFullYear());

  // ШКОЛЬНЫЕ ЧЕТВЕРТИ 2025-2026 (по твоему календарю с каникулами)
  // Осенние каникулы: 27–31.10.2025 → четверть 1 до 26.10, четверть 2 с 01.11
  // Зимние: 29–31.12.2025 и 01–06.01.2026 → четверть 2 до 28.12, четверть 3 с 07.01
  // Весенние: 23–29.03.2026 → четверть 3 до 22.03, четверть 4 с 30.03
  const Q = {
    1: { from: `${y}-09-01`, to: `${y}-10-26` },
    2: { from: `${y}-11-01`, to: `${y}-12-28` },
    3: { from: `${y+1}-01-07`, to: `${y+1}-03-22` },
    4: { from: `${y+1}-03-30`, to: `${y+1}-05-31` }, // если у вас учеба до 25/30 мая — скажи, поменяю
  };

  return Q[q] || Q[1];
}

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
const periodType = document.getElementById("periodType").value;
const reportClass = document.getElementById("reportClass").value || "ALL";

// Тек "Күні" және нақты сынып таңдалса ғана тізім көрсетеміз
if (periodType === "custom" && reportClass !== "ALL" && range.from === range.to) {
  renderDayList(report, range.from);
} else {
  hideDayList();
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









