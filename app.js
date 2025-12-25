// ============================
// LANG (global)
// ============================
let currentLang =
  localStorage.getItem("lang") ||
  document.body.dataset.lang ||
  "kk";
document.body.dataset.lang = currentLang;

// ============================
// SETTINGS (SERVER / KEY)
// ============================
const WEBAPP_URL = "https://old-recipe-0d35eduqatysu.alga4school.workers.dev/";
const API_KEY = "school2025";

// ============================
// STATUS
// ============================
const STATUS = {
  katysty: { kk: "Қатысты", ru: "Присутствовал(а)" }, // default
  auyrdy: { kk: "Ауырды", ru: "Болел(а)" },
  sebep: { kk: "Себепті", ru: "По уважительной причине" },
  sebsez: { kk: "Себепсіз", ru: "Без уважительной причины" },
  keshikti: { kk: "Кешікті", ru: "Опоздал(а)" },
};
const EXCEPTIONS = ["auyrdy", "sebep", "sebsez", "keshikti"];

// ============================
// I18N
// ============================
const I18N = {
  kk: {
    schoolName: '"№4 Алға орта мектебі" КММ',
    homeBtn: "← 🏠Басты бет",
    reportsTitle: "Есептер мен статистика",
    dailyControlTitle: "📚 Күнделікті бақылау",

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

    btnUpdate: "📈 Көрсету",
    btnExport: "⬇️ CSV жүктеу",
    saveBtn: "💾 Сақтау",

    attendance: "Сабаққа қатысу журналы",
    attendanceDesc: "Оқушылардың сабаққа қатысуын есепке алудың автоматтандырылған жүйесі",
    markAttendance: "📚 Сабаққа қатысуды белгілеу",
    reports: "📊 Есептер мен статистика",

    // дұрыс hint key
    attendanceHint:
      "Ескерту: барлығы әдепкіде «Қатысты». Тек қажет болса ғана «Ауырды / Себепті / Себепсіз / Кешікті» таңдаңыз.",

    // DAY ISSUES
    dayIssuesTitle: "📌 Сабақтан қалғандар",
    dayIssuesNote: "Ескерту: “Қатысты” оқушылар көрсетілмейді.",
    late: "⏰ Кешіккендер",
    sick: "🤒 Ауырғандар",
    excused: "📄 Себепті",
    unexcused: "❌ Себепсіз",

    // KPI
    kpiTotal: "📊 Барлық белгі",
    kpiPresent: "✅ Қатысты",
    kpiLate: "⏰ Кешікті",
    kpiSick: "🤒 Ауырды",
    kpiExcused: "📄 Себепті",
    kpiUnexcused: "❌ Себепсіз",

    // TOP
    topLate: "🔥 Көп кешігу (TOP)",
    topUnexcused: "🚫 Көп себепсіз (TOP)",

    schoolDaysLabel: "Оқу күндерінің саны:",

    saveOk: "✅ Сақталды:",
    saveErr: "❌ Қате:",
    needClass: "Сыныпты таңдаңыз",
    needDate: "Күнді таңдаңыз",
    needPeriod: "Кезеңді таңдаңыз",
    noStudents: "Оқушылар тізімі бос",
    alreadySaved: "✅ Бұл сынып бұл күні бұрын сақталған",
    replaced: "(қайта жазылды)",
    chooseException: "Тек қажет болса таңдаңыз",
  },

  ru: {
    schoolName: 'КГУ "Алгинская средняя школа №4"',
    homeBtn: "← 🏠 Главная",
    reportsTitle: "Отчёты и статистика",
    dailyControlTitle: "📚 Ежедневный контроль",

    periodLabel: "Период",
    pDay: "День",
    pWeek: "Неделя",
    pMonth: "Месяц",
    pQuarter: "Четверть",
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
    studentNamePlaceholder: "Имя ученика",

    btnUpdate: "Показать",
    btnExport: "Экспорт CSV",
    saveBtn: "💾 Сохранить",

    attendance: "Журнал посещаемости",
    attendanceDesc: "Автоматизированная система учёта посещаемости",
    markAttendance: "📚 Отметить посещаемость",
    reports: "📊 Отчёты и статистика",

    attendanceHint:
      "Подсказка: по умолчанию все «Присутствовал(а)». Выбирайте статусы только при необходимости.",

    dayIssuesTitle: "📌 Отсутствующие за период",
    dayIssuesNote: "Примечание: “Присутствовал(а)” не показывается.",
    late: "⏰ Опоздавшие",
    sick: "🤒 Болели",
    excused: "📄 По уважительной",
    unexcused: "❌ Без причины",

    kpiTotal: "📊 Всего отметок",
    kpiPresent: "✅ Присутствовал(а)",
    kpiLate: "⏰ Опоздал(а)",
    kpiSick: "🤒 Болел(а)",
    kpiExcused: "📄 По уважительной",
    kpiUnexcused: "❌ Без причины",

    topLate: "🔥 Частые опоздания (TOP)",
    topUnexcused: "🚫 Частые пропуски без причины (TOP)",

    schoolDaysLabel: "Количество учебных дней:",

    saveOk: "✅ Сохранено:",
    saveErr: "❌ Ошибка:",
    needClass: "Выберите класс",
    needDate: "Выберите дату",
    needPeriod: "Выберите период",
    noStudents: "Список учеников пуст",
    alreadySaved: "✅ Этот класс в этот день уже сохранён",
    replaced: "(перезаписано)",
    chooseException: "Выбирайте только при необходимости",
  },
};

// ============================
// SCHOOL CALENDAR
// ============================
// 5 күндік оқу: сенбі/жексенбі демалыс
const WEEKEND_DAYS = new Set([0, 6]);

// Ресми каникул (2025-2026) — керек болса өзгерте аласың
const OFFICIAL_BREAKS_2025_2026 = [
  { from: "2025-10-27", to: "2025-11-02" }, // күзгі
  { from: "2025-12-29", to: "2026-01-07" }, // қысқы
  { from: "2026-03-19", to: "2026-03-29" }, // көктемгі
];

function d0(iso) {
  return new Date(iso + "T00:00:00");
}
function iso(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function betweenInclusive(dateISO, fromISO, toISO) {
  const t = d0(dateISO).getTime();
  return t >= d0(fromISO).getTime() && t <= d0(toISO).getTime();
}
function isOfficialBreakDay(dateISO) {
  return OFFICIAL_BREAKS_2025_2026.some((b) => betweenInclusive(dateISO, b.from, b.to));
}
function isSchoolDayISO(dateISO) {
  const day = d0(dateISO).getDay();
  if (WEEKEND_DAYS.has(day)) return false;
  if (isOfficialBreakDay(dateISO)) return false;
  return true;
}
function countSchoolDays(fromISO, toISO) {
  let c = 0;
  for (let d = d0(fromISO); d <= d0(toISO); d.setDate(d.getDate() + 1)) {
    const dayISO = iso(d);
    if (isSchoolDayISO(dayISO)) c++;
  }
  return c;
}
function updateSchoolDaysUI() {
  const el = document.getElementById("schoolDaysCount");
  if (!el) return;
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
function showView(id) {
  document.querySelectorAll(".view").forEach((v) => v.classList.remove("active"));
  document.getElementById(id)?.classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });

  if (id === "viewReports") {
    updateSchoolDaysUI();
    updateStats();
  }
}

// ============================
// LANG
// ============================
function setLang(lang) {
  currentLang = lang === "ru" ? "ru" : "kk";
  document.body.dataset.lang = currentLang;
  localStorage.setItem("lang", currentLang);
  applyI18n();
}

function applyI18n() {
  const dict = I18N[currentLang] || I18N.kk;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (dict[key] != null) el.textContent = dict[key];
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    if (dict[key] != null) el.placeholder = dict[key];
  });

  // period options
  const period = document.getElementById("periodType");
  if (period) {
    [...period.options].forEach((opt) => {
      const key = opt.dataset.i18n;
      if (key && dict[key] != null) opt.textContent = dict[key];
    });
  }

  // classes reload after lang switch
  if (window.__classesLoaded) {
    renderClassesTo(document.getElementById("classSelect"), window.__classList, false);
    renderClassesTo(document.getElementById("reportClass"), window.__classList, true);
  }

  renderAttendanceTable();
  updateSchoolDaysUI();
}

function statusLabel(code) {
  const item = STATUS[code] || STATUS.katysty;
  return currentLang === "ru" ? item.ru : item.kk;
}
function rowClassColor(code) {
  if (code === "katysty") return "present";
  if (code === "auyrdy") return "sick";
  if (code === "keshikti") return "late";
  if (code === "sebep") return "excused";
  if (code === "sebsez") return "absent";
  return "";
}

function renderClassesTo(selectEl, classList, includeAll = false) {
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

  classList.forEach((cls) => {
    const opt = document.createElement("option");
    opt.value = cls;
    opt.textContent = cls;
    selectEl.appendChild(opt);
  });
}

function normalizeClassValue(v) {
  return String(v || "").replace(/\s+/g, "").toUpperCase();
}
function parseClass(cls) {
  const c = normalizeClassValue(cls);
  const m = c.match(/^(\d+)(.*)$/);
  if (!m) return { grade: "", letter: "" };
  return { grade: m[1], letter: m[2] || "" };
}

// ============================
// ATTENDANCE TABLE
// ============================
function buildStatusCell(studentId) {
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

  EXCEPTIONS.forEach((code) => {
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

function renderAttendanceTable() {
  const tbody = document.querySelector("#attendanceTable tbody");
  if (!tbody) return;

  const classSelect = document.getElementById("classSelect");
  const searchInput = document.getElementById("searchInput");

  const selectedClass = classSelect?.value || "";
  const q = (searchInput?.value || "").trim().toLowerCase();

  let filtered = allStudents.slice();

  if (selectedClass) {
    const { grade, letter } = parseClass(selectedClass);
    filtered = filtered.filter(
      (s) => String(s.grade) === grade && String(s.class_letter) === letter
    );
  } else {
    filtered = [];
  }

  if (q) filtered = filtered.filter((s) => String(s.full_name).toLowerCase().includes(q));

  tbody.innerHTML = "";

  if (filtered.length === 0 && selectedClass) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="4" style="text-align:center; color:#999; padding:20px;">${
      currentLang === "ru" ? "Ученики не найдены" : "Оқушылар табылмады"
    }</td>`;
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
// SAVE (attendance)
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

  const { grade, letter } = parseClass(cls);
  const guardKey = `att_saved:${date}:${grade}:${letter}`;
  if (localStorage.getItem(guardKey) === "1") {
    saveStatus.textContent = I18N[currentLang].alreadySaved;
    return;
  }

  if (btn) btn.disabled = true;
  saveStatus.textContent = "⏳ ...";

  try {
    const students = allStudents.filter(
      (s) => String(s.grade) === grade && String(s.class_letter) === letter
    );
    if (!students.length) throw new Error(I18N[currentLang].noStudents);

    const records = students.map((s) => ({
      student_id: s.id,
      status_code: statusMap.get(s.id) || "katysty",
    }));

    const res = await apiPost({ key: API_KEY, date, grade, class_letter: letter, records });
    if (!res || res.ok === false) throw new Error(res?.error || "Save failed");

    localStorage.setItem(guardKey, "1");
    const extra = res.replaced ? I18N[currentLang].replaced : "";
    saveStatus.textContent = `${I18N[currentLang].saveOk} ${res.saved} ${extra}`;

    // ✅ САҚТАЛҒАН КҮНГЕ ЕСЕПТІ БІРДЕН ДАЙЫНДАУ
    const pt = document.getElementById("periodType");
    const cs = document.getElementById("customStart");
    const ce = document.getElementById("customEnd");

    if (pt) pt.value = "day";
    if (cs) cs.value = date;
    if (ce) ce.value = date;

    pt?.dispatchEvent(new Event("change"));
    updateSchoolDaysUI();
    updateStats();
    // showView("viewReports"); // қаласаң ашылады

  } catch (e) {
    saveStatus.textContent = `${I18N[currentLang].saveErr} ${e.message}`;
  } finally {
    if (btn) btn.disabled = false;
  }
}

// ============================
// PERIOD (reports)
// ============================
function getRangeFromPeriod() {
  const type = document.getElementById("periodType")?.value;

  // DAY
  if (type === "day") {
    const d = document.getElementById("customStart")?.value;
    if (!d) return null;
    return { from: d, to: d };
  }

  // WEEK (таңдалған диапазон)
  if (type === "week") {
    const from = document.getElementById("customStart")?.value;
    const to = document.getElementById("customEnd")?.value;
    if (!from || !to) return null;
    return { from, to };
  }

  // MONTH
  if (type === "month") {
    const v = document.getElementById("monthInput")?.value;
    if (!v) return null;
    const [y, m] = v.split("-");
    const last = new Date(Number(y), Number(m), 0);
    return { from: `${y}-${m}-01`, to: iso(last) };
  }

  // YEAR
  if (type === "year") {
    const y = Number(document.getElementById("yearInput")?.value || new Date().getFullYear());
    return { from: `${y}-01-01`, to: `${y}-12-31` };
  }

  // QUARTER (оқу жылы)
  if (type === "quarter") {
    const q = Number(document.getElementById("quarterInput")?.value || 0);
    const baseY = Number(document.getElementById("quarterYearInput")?.value || 2025);

    const Q = {
      1: { from: `${baseY}-09-01`, to: `${baseY}-10-26` },
      2: { from: `${baseY}-11-03`, to: `${baseY}-12-28` },
      3: { from: `${baseY + 1}-01-08`, to: `${baseY + 1}-03-18` },
      4: { from: `${baseY + 1}-03-30`, to: `${baseY + 1}-05-25` },
    };
    return Q[q] || null;
  }

  // ALL
  if (type === "all") return { from: "2000-01-01", to: "2100-01-01" };

  return null;
}

// ============================
// REPORT HELPERS
// ============================
function sumTotals(report) {
  const totals = { total: 0, katysty: 0, keshikti: 0, sebep: 0, sebsez: 0, auyrdy: 0 };

  const totalsByStudent = report.totals || {};
  if (Object.keys(totalsByStudent).length) {
    Object.values(totalsByStudent).forEach((t) => {
      ["katysty", "keshikti", "sebep", "sebsez", "auyrdy"].forEach((k) => {
        totals[k] += Number(t[k] || 0);
        totals.total += Number(t[k] || 0);
      });
    });
    return totals;
  }

  const daily = report.daily || {};
  Object.values(daily).forEach((byStudent) => {
    Object.values(byStudent || {}).forEach((st) => {
      const code = st?.status_code || "katysty";
      if (totals[code] == null) return;
      totals[code] += 1;
      totals.total += 1;
    });
  });
  return totals;
}

function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[c]);
}

function fillTable(tableId, rows) {
  const tbody = document.querySelector(`#${tableId} tbody`);
  if (!tbody) return;
  tbody.innerHTML = "";
  rows.forEach((r, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${i + 1}</td><td>${escapeHtml(r.name)}</td><td>${escapeHtml(r.cls)}</td><td>${r.count}</td>`;
    tbody.appendChild(tr);
  });
}

function buildTop(report, code, limit = 10) {
  return (report.students || [])
    .map((s) => ({
      name: s.full_name,
      cls: `${s.grade}${s.class_letter}`,
      count: Number(report.totals?.[String(s.id)]?.[code] || 0),
    }))
    .filter((x) => x.count >= 3)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

// ============================
// Day Issues (опоздавшие/болели/и т.д.)
// ============================
function hideDayIssues() {
  const box = document.getElementById("dayIssuesBox");
  if (box) box.style.display = "none";

  ["tblLate", "tblSick", "tblExcused", "tblUnexcused"].forEach((id) => {
    const tb = document.querySelector(`#${id} tbody`);
    if (tb) tb.innerHTML = "";
  });
}

function fill3(tableId, rows) {
  const tb = document.querySelector(`#${tableId} tbody`);
  if (!tb) return;
  tb.innerHTML = "";
  rows.forEach((r, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${i + 1}</td><td>${escapeHtml(r.name)}</td><td>${escapeHtml(r.cls)}</td>`;
    tb.appendChild(tr);
  });
}

function eachDateISO(fromISO, toISO) {
  const res = [];
  const start = d0(fromISO);
  const end = d0(toISO);
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    res.push(iso(d));
  }
  return res;
}

function buildIssuesForRange(report, range) {
  const stById = new Map((report.students || []).map((s) => [String(s.id), s]));
  const daily = report.daily || {};

  const late = [];
  const sick = [];
  const exc = [];
  const unex = [];

  const dates = eachDateISO(range.from, range.to);

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

      if (seen[code] && seen[code].has(String(sid))) return;
      if (seen[code]) seen[code].add(String(sid));

      const s = stById.get(String(sid));
      const name = s ? s.full_name : String(sid);
      const cls = s ? `${s.grade}${s.class_letter}` : "";

      const row = { name, cls };

      if (code === "keshikti") late.push(row);
      if (code === "auyrdy") sick.push(row);
      if (code === "sebep") exc.push(row);
      if (code === "sebsez") unex.push(row);
    });
  }

  return { late, sick, exc, unex };
}

function renderDayIssuesForRange(report, range) {
  const box = document.getElementById("dayIssuesBox");
  if (!box) return;

  const issues = buildIssuesForRange(report, range);

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

// ============================
// UPDATE STATS
// ============================
async function updateStats() {
  const range = getRangeFromPeriod();
  if (!range) {
    alert(I18N[currentLang].needPeriod);
    return;
  }

  const reportClass = document.getElementById("reportClass")?.value || "ALL";
  let grade = "ALL",
    class_letter = "ALL";

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

    // day issues block
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
    alert((currentLang === "ru" ? "Ошибка отчёта: " : "Есеп қатесі: ") + e.message);
  }
}

// ============================
// EXPORT CSV (optional)
// ============================
function exportCsv() {
  const range = getRangeFromPeriod();
  if (!range) {
    alert(I18N[currentLang].needPeriod);
    return;
  }

  const reportClass = document.getElementById("reportClass")?.value || "ALL";
  let grade = "ALL",
    class_letter = "ALL";

  if (reportClass !== "ALL") {
    const p = parseClass(reportClass);
    grade = p.grade;
    class_letter = p.letter;
  }

  apiGet("report", { from: range.from, to: range.to, grade, class_letter })
    .then((report) => {
      const students = report?.students || [];
      const daily = report?.daily || {};
      const totals = report?.totals || {};

      const headerDaily = ["date", "student", "class", "status_code"];
      const rowsDaily = [];

      Object.entries(daily).forEach(([dateISO, byId]) => {
        students.forEach((s) => {
          const cls = `${s.grade}${s.class_letter}`;
          if (reportClass !== "ALL" && normalizeClassValue(cls) !== normalizeClassValue(reportClass)) return;

          const st = byId?.[String(s.id)];
          const code = st?.status_code || "katysty";
          rowsDaily.push([dateISO, s.full_name, cls, code]);
        });
      });

      let header = headerDaily;
      let rows = rowsDaily;

      if (!rowsDaily.length) {
        const headerTotals = ["student", "class", "katysty", "keshikti", "auyrdy", "sebep", "sebsez", "total"];
        const rowsTotals = [];

        students.forEach((s) => {
          const cls = `${s.grade}${s.class_letter}`;
          if (reportClass !== "ALL" && normalizeClassValue(cls) !== normalizeClassValue(reportClass)) return;

          const t = totals?.[String(s.id)] || {};
          const katysty = Number(t.katysty || 0);
          const keshikti = Number(t.keshikti || 0);
          const auyrdy = Number(t.auyrdy || 0);
          const sebep = Number(t.sebep || 0);
          const sebsez = Number(t.sebsez || 0);
          const total = katysty + keshikti + auyrdy + sebep + sebsez;

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

      const sep = ";";
      const csv =
        "\ufeff" +
        [header, ...rows]
          .map((r) =>
            r
              .map((x) => {
                const v = String(x ?? "");
                return v.includes(sep) || v.includes('"') || v.includes("\n")
                  ? `"${v.replace(/"/g, '""')}"`
                  : v;
              })
              .join(sep)
          )
          .join("\n");

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      const clsPart = reportClass === "ALL" ? "ALL" : reportClass.replace(/\s+/g, "");
      a.download = `attendance_${clsPart}_${range.from}_to_${range.to}.csv`;

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    })
    .catch((err) => alert(err.message));
}

// ============================
// INIT
// ============================
document.addEventListener("DOMContentLoaded", async () => {
  // navigation
  document.getElementById("goAttendance")?.addEventListener("click", () => showView("viewAttendance"));
  document.getElementById("goReports")?.addEventListener("click", () => showView("viewReports"));
  document.getElementById("backHome1")?.addEventListener("click", () => showView("viewHome"));
  document.getElementById("backHome2")?.addEventListener("click", () => showView("viewHome"));

  // language
  document.getElementById("langToggle")?.addEventListener("click", () => {
    setLang(currentLang === "kk" ? "ru" : "kk");
  });

  // today defaults
  const today = new Date();
  const todayIso = iso(today);

  if (document.getElementById("attendanceDate")) document.getElementById("attendanceDate").value = todayIso;
  if (document.getElementById("customStart")) document.getElementById("customStart").value = todayIso;
  if (document.getElementById("customEnd")) document.getElementById("customEnd").value = todayIso;
  if (document.getElementById("yearInput")) document.getElementById("yearInput").value = today.getFullYear();
  if (document.getElementById("quarterYearInput")) document.getElementById("quarterYearInput").value = today.getFullYear();

  // period UI show/hide
  document.getElementById("periodType")?.addEventListener("change", () => {
    const type = document.getElementById("periodType")?.value;

    ["monthControl", "quarterControl", "yearControl", "customControl"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.style.display = "none";
    });

    if (type === "month") document.getElementById("monthControl") && (document.getElementById("monthControl").style.display = "flex");
    if (type === "quarter") document.getElementById("quarterControl") && (document.getElementById("quarterControl").style.display = "flex");
    if (type === "year") document.getElementById("yearControl") && (document.getElementById("yearControl").style.display = "flex");

    if (type === "day" || type === "week") {
      const customControl = document.getElementById("customControl");
      if (customControl) customControl.style.display = "flex";
    }

    const customControl = document.getElementById("customControl");
    const toLabel = customControl?.querySelector('[data-i18n="toLabel"]');
    const toInput = customControl?.querySelector("#customEnd");

    if (type === "day") {
      if (toLabel) toLabel.style.display = "none";
      if (toInput) {
        toInput.style.display = "none";
        toInput.value = document.getElementById("customStart")?.value || toInput.value;
      }
    } else {
      if (toLabel) toLabel.style.display = "";
      if (toInput) toInput.style.display = "";
    }

    updateSchoolDaysUI();
    updateStats();
  });

  // customStart change (бір-ақ рет!)
  document.getElementById("customStart")?.addEventListener("change", () => {
    const type = document.getElementById("periodType")?.value;
    const startISO = document.getElementById("customStart")?.value;
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
      endInput.value = iso(d);
    }

    updateSchoolDaysUI();
    updateStats();
  });

  // buttons
  document.getElementById("saveAttendanceBtn")?.addEventListener("click", saveAttendance);
  document.getElementById("updateStatsBtn")?.addEventListener("click", updateStats);
  document.getElementById("exportCsvBtn")?.addEventListener("click", exportCsv);

  // auto updates
  document.getElementById("monthInput")?.addEventListener("change", () => { updateSchoolDaysUI(); updateStats(); });
  document.getElementById("quarterInput")?.addEventListener("change", () => { updateSchoolDaysUI(); updateStats(); });
  document.getElementById("quarterYearInput")?.addEventListener("input", () => { updateSchoolDaysUI(); updateStats(); });
  document.getElementById("yearInput")?.addEventListener("input", () => { updateSchoolDaysUI(); updateStats(); });
  document.getElementById("reportClass")?.addEventListener("change", () => updateStats());

  // search (attendance)
  document.getElementById("searchInput")?.addEventListener("input", renderAttendanceTable);

  // init period UI
  document.getElementById("periodType")?.dispatchEvent(new Event("change"));

  // load classes & students
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
});
