// ============================
// SETTINGS (ӨЗІҢІЗДІКІН ҚОЙЫҢЫЗ)
// ============================
const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbybwO1f-AnhloW8H_yLqNPL5TcKJaCiyxFFoAGWfepka99XI1e8TfnzVJ8cHvCQ6Fp-hw/exec";
const API_KEY = "school2025";

// ============================
// SCHOOL NAME (KK/RU)
// ============================
const SCHOOL_NAME = {
  kk: 'Ақтөбе облысының білім басқармасы Алға ауданының білім бөлімі "ММ" "№4 Алға орта мектебі" КММ',
  ru: 'КГУ "Алгинская средняя школа №4" ГУ "Отдел образования Алгинского района Управления образования Актюбинской области"',
};

// ============================
// STATUS CONFIG
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
// UI i18n
// ============================
let currentLang = document.body.dataset.lang || "kk";

const I18N_UI = {
  kk: {
    bannerTitle: "Қатысу журналы",
    bannerText: "Оқушылардың сабаққа қатысуын, кешігуді және себепсіз қалуды күнделікті бақылауға арналған мектепішілік жүйе.",
    btnAttendance: "Журнал посещаемости",
    btnReports: "Отчёты и статистика",
    backHome: "Басты бет",
    attendanceTitle: "Қатысу журналы",
    reportsTitle: "Отчёты и статистика",
    dateLabel: "Күні",
    classLabel: "Сынып",
    searchLabel: "Іздеу",
    saveBtn: "Сақтау",
    colStudent: "Оқушы",
    colClass: "Сынып",
    colStatus: "Белгі",
    attendanceHint: "Ескерту: барлығы әдепкіде «Қатысты». Тек қажет болса ғана таңдаңыз.",
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
    kpiTotal: "Барлық белгі",
    kpiPresent: "Қатысты",
    kpiLate: "Кешікті",
    kpiSick: "Ауырды",
    kpiExcused: "Себепті",
    kpiUnexcused: "Себепсіз",
    topLate: "Кешігу көп (TOP)",
    topUnexcused: "Себепсіз көп (TOP)",
    reportHint: "Ескерту: Отчёт деректері Google Script арқылы алынады.",
    apiErr: "API қате:",
    saveOk: "✅ Сақталды:",
    saveErr: "❌ Қате:",
    needClass: "Сыныпты таңдаңыз",
    needDate: "Күнді таңдаңыз",
  },
  ru: {
    bannerTitle: "Журнал посещаемости",
    bannerText: "Система для ежедневного контроля посещаемости, опозданий и пропусков без причины.",
    btnAttendance: "Журнал посещаемости",
    btnReports: "Отчёты и статистика",
    backHome: "На главную",
    attendanceTitle: "Журнал посещаемости",
    reportsTitle: "Отчёты и статистика",
    dateLabel: "Дата",
    classLabel: "Класс",
    searchLabel: "Поиск",
    saveBtn: "Сохранить",
    colStudent: "Ученик",
    colClass: "Класс",
    colStatus: "Отметка",
    attendanceHint: "Примечание: по умолчанию все «Присутствовал(а)». Меняйте только при необходимости.",
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
    reportHint: "Примечание: данные отчёта берутся через Google Script.",
    apiErr: "Ошибка API:",
    saveOk: "✅ Сохранено:",
    saveErr: "❌ Ошибка:",
    needClass: "Выберите класс",
    needDate: "Выберите дату",
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
  // CORS “preflight” шықпау үшін text/plain
  const r = await fetch(WEBAPP_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(body),
  });

  const text = await r.text();
  const data = JSON.parse(text);
  if (!data.ok) throw new Error(data.error || "API error");
  return data;
}

// ============================
// STATE
// ============================
let allStudents = [];
let statusMap = new Map();

// ============================
// HELPERS UI
// ============================
function showView(id) {
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  document.getElementById(id)?.classList.add("active");
}

function applyI18n() {
  // school name
  const schoolEl = document.getElementById("schoolNameText");
  if (schoolEl) schoolEl.textContent = SCHOOL_NAME[currentLang] || SCHOOL_NAME.kk;

  // data-i18n
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const k = el.getAttribute("data-i18n");
    if (I18N_UI[currentLang][k] != null) el.textContent = I18N_UI[currentLang][k];
  });

  document.body.dataset.lang = currentLang;
}

function setLang(lang) {
  currentLang = lang;
  applyI18n();
  renderAttendanceTable();
}

function renderClassesTo(selectEl, classes, withAll) {
  if (!selectEl) return;
  selectEl.innerHTML = "";
  if (withAll) {
    const opt = document.createElement("option");
    opt.value = "ALL";
    opt.textContent = "ALL";
    selectEl.appendChild(opt);
  }
  classes.forEach(c => {
    const g = String(parseInt(c, 10));
    const l = c.replace(String(parseInt(c,10)), "");
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    opt.dataset.grade = g;
    opt.dataset.letter = l;
    selectEl.appendChild(opt);
  });
}

function getSelectedClass(selectEl) {
  const v = selectEl?.value || "";
  if (!v || v === "ALL") return null;
  const grade = String(parseInt(v,10));
  const class_letter = v.replace(String(parseInt(v,10)), "");
  return { grade, class_letter };
}

function renderAttendanceTable() {
  const tbody = document.querySelector("#attendanceTable tbody");
  if (!tbody) return;

  const classSelect = document.getElementById("classSelect");
  const search = (document.getElementById("searchInput")?.value || "").toLowerCase().trim();

  const cls = getSelectedClass(classSelect);
  tbody.innerHTML = "";

  if (!cls) return;

  const list = allStudents
    .filter(s => String(s.grade) === cls.grade && String(s.class_letter) === cls.class_letter)
    .filter(s => !search || String(s.full_name).toLowerCase().includes(search));

  list.forEach((s, i) => {
    const tr = document.createElement("tr");

    const td1 = document.createElement("td");
    td1.textContent = String(i + 1);

    const td2 = document.createElement("td");
    td2.textContent = s.full_name;

    const td3 = document.createElement("td");
    td3.textContent = `${s.grade}${s.class_letter}`;

    const td4 = document.createElement("td");
    const sel = document.createElement("select");
    sel.dataset.studentId = s.id;

    // default
    const defaultOpt = document.createElement("option");
    defaultOpt.value = "katysty";
    defaultOpt.textContent = (currentLang === "kk")
      ? `✔ ${STATUS.katysty.kk}`
      : `✔ ${STATUS.katysty.ru}`;
    sel.appendChild(defaultOpt);

    EXCEPTIONS.forEach(code => {
      const o = document.createElement("option");
      o.value = code;
      o.textContent = (currentLang === "kk")
        ? STATUS[code].kk
        : STATUS[code].ru;
      sel.appendChild(o);
    });

    sel.value = statusMap.get(s.id) || "katysty";
    sel.addEventListener("change", () => statusMap.set(s.id, sel.value));

    td4.appendChild(sel);

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tbody.appendChild(tr);
  });
}

async function saveAttendance() {
  const cls = getSelectedClass(document.getElementById("classSelect"));
  const date = document.getElementById("attendanceDate")?.value;
  const statusEl = document.getElementById("saveStatus");

  if (!cls) return alert(I18N_UI[currentLang].needClass);
  if (!date) return alert(I18N_UI[currentLang].needDate);

  const records = allStudents
    .filter(s => String(s.grade) === cls.grade && String(s.class_letter) === cls.class_letter)
    .map(s => ({
      student_id: s.id,
      status_code: statusMap.get(s.id) || "katysty"
    }));

  try {
    const res = await apiPost({
      key: API_KEY,
      date,
      grade: cls.grade,
      class_letter: cls.class_letter,
      records
    });

    if (statusEl) statusEl.textContent = `${I18N_UI[currentLang].saveOk} ${res.saved}`;
  } catch (e) {
    if (statusEl) statusEl.textContent = `${I18N_UI[currentLang].saveErr} ${e.message}`;
  }
}

function calcRangeFromPeriod() {
  const type = document.getElementById("periodType")?.value || "custom";
  const today = new Date();
  const isoToday = today.toISOString().slice(0,10);

  if (type === "all") return { from: "2000-01-01", to: "2100-12-31" };
  if (type === "custom" || type === "day" || type === "week") {
    const from = document.getElementById("customStart")?.value || isoToday;
    const to = document.getElementById("customEnd")?.value || isoToday;
    return { from, to };
  }
  if (type === "month") {
    const m = document.getElementById("monthInput")?.value || isoToday.slice(0,7);
    const from = `${m}-01`;
    const to = `${m}-31`;
    return { from, to };
  }
  if (type === "quarter") {
    const q = parseInt(document.getElementById("quarterInput")?.value || "1", 10);
    const y = parseInt(document.getElementById("quarterYearInput")?.value || String(today.getFullYear()), 10);
    const startMonth = (q-1)*3 + 1;
    const endMonth = startMonth + 2;
    const from = `${y}-${String(startMonth).padStart(2,"0")}-01`;
    const to = `${y}-${String(endMonth).padStart(2,"0")}-31`;
    return { from, to };
  }
  if (type === "year") {
    const y = parseInt(document.getElementById("yearInput")?.value || String(today.getFullYear()), 10);
    return { from: `${y}-01-01`, to: `${y}-12-31` };
  }
  return { from: isoToday, to: isoToday };
}

async function updateStats() {
  const clsVal = document.getElementById("reportClass")?.value || "ALL";
  const { from, to } = calcRangeFromPeriod();

  const grade = (clsVal === "ALL") ? "ALL" : String(parseInt(clsVal,10));
  const class_letter = (clsVal === "ALL") ? "ALL" : clsVal.replace(String(parseInt(clsVal,10)), "");

  const data = await apiGet("report", { from, to, grade, class_letter });

  // totals (sum)
  let total = 0, present = 0, late = 0, sick = 0, excused = 0, unexcused = 0;

  Object.values(data.totals || {}).forEach(t => {
    present += (t.katysty || 0);
    late += (t.keshikti || 0);
    sick += (t.auyrdy || 0);
    excused += (t.sebep || 0);
    unexcused += (t.sebsez || 0);
  });
  total = present + late + sick + excused + unexcused;

  document.getElementById("totalLessons").textContent = total;
  document.getElementById("totalPresent").textContent = present;
  document.getElementById("totalLate").textContent = late;
  document.getElementById("totalSick").textContent = sick;
  document.getElementById("totalExcused").textContent = excused;
  document.getElementById("totalUnexcused").textContent = unexcused;

  // TOP tables
  const studentsMap = new Map((data.students || []).map(s => [s.id, s]));
  const lateArr = [];
  const unexcArr = [];

  Object.entries(data.totals || {}).forEach(([sid, t]) => {
    const s = studentsMap.get(sid);
    if (!s) return;
    lateArr.push({ sid, n: t.keshikti || 0, name: s.full_name, cls: `${s.grade}${s.class_letter}` });
    unexcArr.push({ sid, n: t.sebsez || 0, name: s.full_name, cls: `${s.grade}${s.class_letter}` });
  });

  lateArr.sort((a,b)=>b.n-a.n);
  unexcArr.sort((a,b)=>b.n-a.n);

  const lateBody = document.querySelector("#topLateTable tbody");
  const unexcBody = document.querySelector("#topUnexcusedTable tbody");
  lateBody.innerHTML = "";
  unexcBody.innerHTML = "";

  lateArr.slice(0,10).forEach((x,i)=>{
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${i+1}</td><td>${x.name}</td><td>${x.cls}</td><td>${x.n}</td>`;
    lateBody.appendChild(tr);
  });

  unexcArr.slice(0,10).forEach((x,i)=>{
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${i+1}</td><td>${x.name}</td><td>${x.cls}</td><td>${x.n}</td>`;
    unexcBody.appendChild(tr);
  });
}

async function exportCsv() {
  const clsVal = document.getElementById("reportClass")?.value || "ALL";
  const { from, to } = calcRangeFromPeriod();
  const grade = (clsVal === "ALL") ? "ALL" : String(parseInt(clsVal,10));
  const class_letter = (clsVal === "ALL") ? "ALL" : clsVal.replace(String(parseInt(clsVal,10)), "");

  const data = await apiGet("report", { from, to, grade, class_letter });

  // Excel үшін ыңғайлы болсын деп ";" қолданамыз
  const SEP = ";";
  const header = ["date","student","class","status_code","status_kk","status_ru"].join(SEP);

  const studentsMap = new Map((data.students || []).map(s => [s.id, s]));
  const dates = Object.keys(data.daily || {}).sort();

  const rows = [];
  dates.forEach(d => {
    const day = data.daily[d] || {};
    Object.entries(day).forEach(([sid, st]) => {
      const s = studentsMap.get(sid);
      if (!s) return;
      rows.push([
        d,
        s.full_name,
        `${s.grade}${s.class_letter}`,
        st.status_code,
        st.status_kk,
        st.status_ru
      ].map(v => `"${String(v ?? "").replace(/"/g,'""')}"`).join(SEP));
    });
  });

  const csv = [header, ...rows].join("\n");

  // BOM (Excel кириллица дұрыс көрсін)
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "attendance_report.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ============================
// INIT
// ============================
document.addEventListener("DOMContentLoaded", async () => {
  // NAV
  document.getElementById("goAttendance")?.addEventListener("click", () => showView("viewAttendance"));
  document.getElementById("goReports")?.addEventListener("click", () => showView("viewReports"));
  document.getElementById("backHome1")?.addEventListener("click", () => showView("viewHome"));
  document.getElementById("backHome2")?.addEventListener("click", () => showView("viewHome"));

  // Default dates
  const today = new Date().toISOString().slice(0,10);
  const attendanceDate = document.getElementById("attendanceDate");
  if (attendanceDate) attendanceDate.value = today;
  const cs = document.getElementById("customStart");
  const ce = document.getElementById("customEnd");
  if (cs) cs.value = today;
  if (ce) ce.value = today;

  // Lang
  document.getElementById("langToggle")?.addEventListener("click", () => {
    setLang(currentLang === "kk" ? "ru" : "kk");
  });

  // Period controls show/hide
  document.getElementById("periodType")?.addEventListener("change", () => {
    const type = document.getElementById("periodType").value;
    ["monthControl","quarterControl","yearControl","customControl"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = "none";
    });
    if (type === "month") document.getElementById("monthControl").style.display = "flex";
    if (type === "quarter") document.getElementById("quarterControl").style.display = "flex";
    if (type === "year") document.getElementById("yearControl").style.display = "flex";
    if (type === "custom" || type === "week" || type === "day") document.getElementById("customControl").style.display = "flex";
  });

  // Apply i18n
  applyI18n();

  // Load classes + students
  try {
    const cls = await apiGet("classes");
    renderClassesTo(document.getElementById("classSelect"), cls.classes || [], false);
    renderClassesTo(document.getElementById("reportClass"), cls.classes || [], true);

    const st = await apiGet("students");
    allStudents = st.students || [];
    allStudents.forEach(s => statusMap.set(s.id, "katysty"));
    renderAttendanceTable();
  } catch (e) {
    console.error(e);
    alert(I18N_UI[currentLang].apiErr + " " + e.message);
  }

  // Events
  document.getElementById("classSelect")?.addEventListener("change", () => {
    // әр сынып ауысқанда default қайта қоямыз
    allStudents.forEach(s => statusMap.set(s.id, "katysty"));
    renderAttendanceTable();
  });

  document.getElementById("searchInput")?.addEventListener("input", renderAttendanceTable);
  document.getElementById("saveAttendanceBtn")?.addEventListener("click", saveAttendance);

  document.getElementById("updateStatsBtn")?.addEventListener("click", () => {
    updateStats().catch(e => alert(I18N_UI[currentLang].apiErr + " " + e.message));
  });

  document.getElementById("exportCsvBtn")?.addEventListener("click", () => {
    exportCsv().catch(e => alert(I18N_UI[currentLang].apiErr + " " + e.message));
  });
});

