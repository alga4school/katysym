// ============================
// LANG (global)
// ============================
let currentLang =
  localStorage.getItem("lang") ||
  document.body.dataset.lang ||
  "kk";

document.body.dataset.lang = currentLang;

let __isSavingAttendance = false;

  applyI18n();
}

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
    // ===== UI =====
    backHome: "Басты бет",
    reportsTitle: "Есептер мен статистика",
    dailyControlTitle: "📚 Күнделікті бақылау",

    periodLabel: "Кезең",
    pDay: "Күні",
    pWeek: "Апта",
    pMonth: "Ай",
    pQuarter: "Тоқсан",
    pYear: "Жыл",
    pAll: "Барлығы",
    
    btnUpdate: "Көрсету",
    btnExport: "CSV жүктеу",

    // ===== DAY ISSUES =====
    dayIssuesTitle:"📌 Сабақтан қалғандар (күндік)",
    late:"Кешіккендер",
    sick:"Ауырғандар",
    excused:"Себепті",
    unexcused:"Себепсіз",
    student:"Оқушы",
    class:"Сынып",
    dayIssuesNote:"Ескерту: “Қатысты” оқушылар көрсетілмейді.",

    // ===== HOLIDAYS =====
    holidaysLabel: "Оқымайтын күндер (мереке/каникул):",
    btnAdd: "Қосу",
    btnClear: "Тазалау",
    schoolDaysLabel: "Оқу күндерінің саны:",

    // ===== MESSAGES =====
    saveOk: "✅ Сақталды:",
    saveErr: "❌ Қате:",
    needClass: "Сыныпты таңдаңыз",
    needDate: "Күнді таңдаңыз",
    chooseException: "Тек қажет болса таңдаңыз",
    needPeriod: "Кезеңді таңдаңыз",
    noStudents: "Оқушылар тізімі бос",
    alreadySaved: "✅ Бұл сынып бұл күні уже сақталған",
    replaced: "(қайта жазылды)",
    allClasses: "Барлық сынып",
    chooseClass: "Сыныпты таңдаңыз",
    date: "Күні",
    class: "Сынып",
    search: "Іздеу",
    selectDate: "Күнді таңдаңыз",
    save: "Сақтау",
    note: "Ескерту",
    select: "Таңдаңыз",
    studentNamePlaceholder: "Оқушы аты",
    mark: "Белгі",

    // ===== MAIN PAGE =====
    attendance: "Журнал посещаемости",
    attendanceDesc: "Оқушылардың сабаққа қатысуын есепке алудың автоматтандырылған жүйесі",
    markAttendance: "📚 Сабаққа қатысуды белгілеу",
    reports: "📊 Есептер мен статистика",
    school: "Мектеп",
    
    // ===== PWA INSTALL =====
    installPWA: "📱 Приложение ретінде орнату",
    installTitle: "Қадамдары",
    installAndroid: "📱 Android (Samsung және т.б.)",
    installAndroidSteps: "1. Төмен оң жағындағы үш нүкте (⋮) басыңыз\n2. 'Қосымшаға орнату' немесе 'Экранға орнату' таңдаңыз",
    installIOS: "🍎 iPhone (iOS)",
    installIOSSteps: "1. Төмен оң жағындағы 'Ортасындағы' батырма басыңыз\n2. 'Негіздің экранына қосу' таңдаңыз\n3. 'Қосу' басыңыз",
    installPC: "💻 Компьютер",
    installPCSteps: "1. Адресі барлау ішіндегі орнату батырмасын басыңыз\n2. Немесе параметрлер > Қосымшалар > Орнату",
  },

  ru: {
    // ===== UI =====
    backHome: "Главная",
    reportsTitle: "Отчеты и статистика",
    dailyControlTitle: "📚 Ежедневный контроль",

    periodLabel: "Период",
    pDay: "День",
    pWeek: "Неделя",
    pMonth: "Месяц",
    pQuarter: "Квартал",
    pYear: "Год",
    pAll: "Все",

    btnUpdate: "Показать",
    btnExport: "Экспорт CSV",

    // ===== DAY ISSUES =====
    dayIssuesTitle:"📌 Пропуски за день",
    late:"Опоздавшие",
    sick:"Болели",
    excused:"По уважительной",
    unexcused:"Без уважительной",
    student:"Ученик",
    class:"Класс",
    dayIssuesNote:"Примечание: “Присутствовал(а)” не показывается.",
studentNamePlaceholder: "Имя ученика",
mark: "Отметка",
    // ===== HOLIDAYS =====
    holidaysLabel: "Неучебные дни (праздники/каникулы):",
    btnAdd: "Добавить",
    btnClear: "Очистить",
    schoolDaysLabel: "Учебных дней в периоде:",

    // ===== MESSAGES =====
    saveOk: "✅ Сохранено:",
    saveErr: "❌ Ошибка:",
    needClass: "Выберите класс",
    needDate: "Выберите дату",
    chooseException: "Выбирайте только при необходимости",
    needPeriod: "Укажите период",
    noStudents: "Список студентов пуст",
    alreadySaved: "✅ Этот класс в этот день уже сохранен",
    replaced: "(перезаписано)",
    allClasses: "Все классы",
    chooseClass: "Выберите класс",
    date: "Дата",
    class: "Класс",
    search: "Поиск",
    selectDate: "Выберите дату",
    save: "Сохранить",
    note: "Примечание",
    select: "Выберите",
    
    // ===== MAIN PAGE =====
    attendance: "Журнал посещаемости",
    attendanceDesc: "Автоматизированная система учета посещения занятий студентами",
    markAttendance: "📚 Отметить посещение",
    reports: "📊 Отчеты и статистика",
    school: "Школа",
    
    // ===== PWA INSTALL =====
    installPWA: "📱 Установить как приложение",
    installTitle: "Инструкции по установке",
    installAndroid: "📱 Android (Samsung и др.)",
    installAndroidSteps: "1. Нажмите три точки (⋮) в нижнем правом углу\n2. Выберите 'Установить приложение' или 'На главный экран'",
    installIOS: "🍎 iPhone (iOS)",
    installIOSSteps: "1. Нажмите кнопку 'Поделиться' (↑) в нижней части\n2. Выберите 'На главный экран'\n3. Нажмите 'Добавить'",
    installPC: "💻 Компьютер",
    installPCSteps: "1. Нажмите кнопку установки в адресной строке\n2. Или Параметры > Приложения > Установить",
  }
};

// ============================
// LANG FUNCTIONS
// ============================
function setLang(lang) {
  currentLang = (lang === "ru") ? "ru" : "kk";
  document.body.dataset.lang = currentLang;
  localStorage.setItem("lang", currentLang);

  // ✅ Қорғаныс: applyI18n бар болса ғана шақыр
  if (typeof applyI18n === "function") applyI18n();
}

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
// ===== I18N =====
document.addEventListener("DOMContentLoaded", async () => {
  currentLang =
    localStorage.getItem("lang") ||
    document.body?.dataset?.lang ||
    "kk";

  document.body.dataset.lang = currentLang;

  applyI18n();
  // қалған код...
});

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

  // керек болса: renderAttendanceTable();
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
    .filter(x=>x.count>3) // 4+ рет (3тен жогары)
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

function escapeHtml(s){return String(s??'').replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));}

// ============================
// REPORTS
// ============================

function fillSimpleTable(tableId, rows) {
  const tbody = document.querySelector(`#${tableId} tbody`);
  if (!tbody) return;
  tbody.innerHTML = "";
  rows.forEach((r, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${i + 1}</td><td>${escapeHtml(r.name)}</td><td>${escapeHtml(r.cls)}</td>`;
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
    res.push(d.toISOString().slice(0, 10));
  }
  return res;
}

// 4) report.daily ішінен таңдалған мерзім бойынша (1 күн/апта/ай/жыл/барлығы)
// кешіккен/ауырған/себепті/себепсіз тізімдерді жинау
function buildIssuesForRange(report, range) {
  const stById = new Map((report.students || []).map((s) => [String(s.id), s]));
  const daily = report.daily || {};

  const late = [];
  const sick = [];
  const exc = [];
  const unex = [];

  const dates = eachDateISO(range.from, range.to);

  // бір адам мерзім ішінде бірнеше рет кездесуі мүмкін → қайталамас үшін Set
  const seen = {
    keshikti: new Set(),
    auyrdy: new Set(),
    sebep: new Set(),
    sebsez: new Set(),
  };

  for (const dateISO of dates) {
    const dailyMap = daily[dateISO];
    if (!dailyMap) continue;

    Object.entries(dailyMap).forEach(([sid, st]) => {
      const code = st?.status_code;
      if (!code || code === "katysty") return;

      const s = stById.get(String(sid));
      const name = s ? s.full_name : String(sid);
      const cls = s ? `${s.grade}${s.class_letter}` : "";

      // қайталамау: бір оқушы бір категорияға 1-ақ рет түссін
      if (seen[code] && seen[code].has(String(sid))) return;
      if (seen[code]) seen[code].add(String(sid));

      const row = { name, cls };

      if (code === "keshikti") late.push(row);
      if (code === "auyrdy") sick.push(row);
      if (code === "sebep") exc.push(row);
      if (code === "sebsez") unex.push(row);
    });
  }

  return { late, sick, exc, unex };
}

// 5) dayIssuesBox көрсету (ЕНДІ: кез келген мерзімде, кез келген класс/ALL үшін)
function renderDayIssuesForRange(report, range) {
  const box = document.getElementById("dayIssuesBox");
  if (!box) return;

  const issues = buildIssuesForRange(report, range);

  // егер бәрі бос болса — жасырамыз
  if (!(issues.late.length || issues.sick.length || issues.exc.length || issues.unex.length)) {
    hideDayIssues();
    return;
  }

  fill3("tblLate", issues.late);
  fill3("tblSick", issues.sick);
  fill3("tblExcused", issues.exc);
  fill3("tblUnexcused", issues.unex);
  box.style.display = "block";
}

// 6) Update Stats (CLEAN)
async function updateStats() {
  const range = getRangeFromPeriod();
  updateSchoolDaysUI();

  if (!range) {
    alert(I18N[currentLang].needPeriod);
    return;
  }

  const reportClass = document.getElementById("reportClass").value || "ALL";
  let grade = "ALL";
  let class_letter = "ALL";

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
      class_letter,
    });

    // ✅ БАРЛЫҚ МЕРЗІМГЕ БІРДЕЙ (күн / апта / ай / жыл / барлық сынып)
    renderDayIssuesForRange(report, range);

    const t = sumTotals(report);

    document.getElementById("totalLessons").textContent = t.total;
    document.getElementById("totalPresent").textContent = t.katysty;
    document.getElementById("totalLate").textContent = t.keshikti;
    document.getElementById("totalSick").textContent = t.auyrdy;
    document.getElementById("totalExcused").textContent = t.sebep;
    document.getElementById("totalUnexcused").textContent = t.sebsez;

    fillTable("topLateTable", buildTop(report, "keshikti"));
    fillTable("topUnexcusedTable", buildTop(report, "sebsez"));
  } catch (e) {
    alert(
      (currentLang === "ru" ? "Ошибка отчёта: " : "Есеп қатесі: ") +
        e.message
    );
  }
}

function exportCsv(){
  const range = getRangeFromPeriod();
  if (!range) return alert(I18N[currentLang].needPeriod);

  const reportClass = document.getElementById("reportClass").value || "ALL";
  let grade="ALL", class_letter="ALL";
  if (reportClass !== "ALL") {
    const p = parseClass(reportClass);
    grade = p.grade;
    class_letter = p.letter;
  }

  apiGet("report", { from: range.from, to: range.to, grade, class_letter })
    .then(report => {

      // 1) пробуем детальный экспорт (daily)
      const headerDaily = ["date","student","class","status_code","status_kk","status_ru"];
      const rowsDaily = [];
      const byId = new Map((report.students || []).map(s => [String(s.id), s]));

      const wantedDates = (range.from === range.to)
        ? [range.from]
        : eachDateISO(range.from, range.to);

      wantedDates.forEach(dateISO => {
        const daily = report.daily?.[dateISO];
        if (!daily) return;

        Object.entries(daily).forEach(([sid, st]) => {
          const s = byId.get(String(sid));
          if (!s) return;

          if (reportClass !== "ALL") {
           const cls = normalizeClassValue(`${s.grade}${s.class_letter}`);
if (cls !== normalizeClassValue(reportClass)) return;

          }

          rowsDaily.push([
            dateISO,
            s.full_name,
            `${s.grade}${s.class_letter}`,
            st?.status_code ?? "",
            st?.status_kk ?? "",
            st?.status_ru ?? ""
          ]);
        });
      });

      // 2) если daily пустой — делаем экспорт итогов по ученику (totals)
      let header = headerDaily;
      let rows = rowsDaily;

      if (!rowsDaily.length) {
        const headerTotals = ["student","class","katysty","keshikti","auyrdy","sebep","sebsez","total"];
        const rowsTotals = [];

        (report.students || []).forEach(s => {
          const t = report.totals?.[String(s.id)] || {};
          const katysty  = Number(t.katysty || 0);
          const keshikti = Number(t.keshikti || 0);
          const auyrdy   = Number(t.auyrdy || 0);
          const sebep    = Number(t.sebep || 0);
          const sebsez   = Number(t.sebsez || 0);
          const total    = katysty + keshikti + auyrdy + sebep + sebsez;

          if (total === 0) return; // чтобы не выгружать совсем пустых

          rowsTotals.push([
            s.full_name,
            `${s.grade}${s.class_letter}`,
            katysty, keshikti, auyrdy, sebep, sebsez, total
          ]);
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

      // Excel-friendly CSV
      const sep = ";";
      const csv = "\ufeff" + [header, ...rows]
        .map(r => r.map(x => {
          const v = String(x ?? "");
          return (v.includes(sep) || v.includes('"') || v.includes("\n"))
            ? `"${v.replace(/"/g,'""')}"`
            : v;
        }).join(sep))
        .join("\n");

      const blob = new Blob([csv], { type:"text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      const clsPart = (reportClass === "ALL") ? "ALL" : reportClass.replace(/\s+/g,"");
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

  // Навигация
  document.getElementById("goAttendance")?.addEventListener("click", () => showView("viewAttendance"));
  document.getElementById("goReports")?.addEventListener("click", () => showView("viewReports"));
  document.getElementById("backHome1")?.addEventListener("click", () => showView("viewHome"));
  document.getElementById("backHome2")?.addEventListener("click", () => showView("viewHome"));

  // Тілді ауыстыру
  document.getElementById("langToggle")?.addEventListener("click", () => {
    setLang(currentLang === "kk" ? "ru" : "kk");
  });

  // Бүгінгі күнді қою
  const today = new Date();
  const iso = today.toISOString().slice(0, 10);

  const elAttendanceDate = document.getElementById("attendanceDate");
  if (elAttendanceDate) elAttendanceDate.value = iso;

  const elCustomStart = document.getElementById("customStart");
  if (elCustomStart) elCustomStart.value = iso;

  const elCustomEnd = document.getElementById("customEnd");
  if (elCustomEnd) elCustomEnd.value = iso;

  const elYearInput = document.getElementById("yearInput");
  if (elYearInput) elYearInput.value = today.getFullYear();

  const elQuarterYearInput = document.getElementById("quarterYearInput");
  if (elQuarterYearInput) elQuarterYearInput.value = today.getFullYear();

  // Период өзгерсе — контролдарды көрсету/жасыру
  document.getElementById("periodType")?.addEventListener("change", () => {
    const type = document.getElementById("periodType")?.value;

    ["monthControl", "quarterControl", "yearControl", "customControl"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.style.display = "none";
    });

    if (type === "month") document.getElementById("monthControl") && (document.getElementById("monthControl").style.display = "flex");
    if (type === "quarter") document.getElementById("quarterControl") && (document.getElementById("quarterControl").style.display = "flex");
    if (type === "year") document.getElementById("yearControl") && (document.getElementById("yearControl").style.display = "flex");
    if (type === "custom") document.getElementById("customControl") && (document.getElementById("customControl").style.display = "flex");
    if (type === "custom" || type === "week") {
      document.getElementById("customControl") && (document.getElementById("customControl").style.display = "flex");
}
  });
// Батырмалар
document.getElementById("saveAttendanceBtn")?.addEventListener("click", saveAttendance);
document.getElementById("updateStatsBtn")?.addEventListener("click", updateStats);
document.getElementById("exportCsvBtn")?.addEventListener("click", exportCsv);
document.getElementById("searchInput")?.addEventListener("input", renderAttendanceTable);

// ✅ Бет ашылғанда period control-дар бірден дұрыс көрінсін
document.getElementById("periodType")?.dispatchEvent(new Event("change"));
document.getElementById("rep_periodType")?.dispatchEvent(new Event("change")); // егер бар болса

// API: сыныптар, оқушылар
try {
  const cls = await apiGet("classes");
  window.__classesLoaded = true;
  window.__classList = cls.classes || [];

  renderClassesTo(document.getElementById("classSelect"), window.__classList, false);
  renderClassesTo(document.getElementById("reportClass"), window.__classList, true);

  const st = await apiGet("students");
  allStudents = st.students || [];

  allStudents.forEach((s) => statusMap.set(s.id, "katysty"));

  document.getElementById("classSelect")?.addEventListener("change", () => {
    allStudents.forEach((s) => statusMap.set(s.id, "katysty"));
    renderAttendanceTable();
  });

  applyI18n();
  renderAttendanceTable();
} catch (e) {
  alert("API error: " + e.message);
}
}); // ✅ end DOMContentLoaded














