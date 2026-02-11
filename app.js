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
// API HELPERS
// ============================
async function apiGet(mode, params = {}) {
  const url = new URL(WEBAPP_URL);
  url.searchParams.set("mode", mode);
  url.searchParams.set("key", API_KEY);

  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") {
      url.searchParams.set(k, String(v));
    }
  });

  const resp = await fetch(url.toString(), { method: "GET" });
  const text = await resp.text();

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("API JSON емес: " + text.slice(0, 160));
  }

  if (!resp.ok || data?.ok === false) {
    throw new Error(data?.error || ("HTTP " + resp.status));
  }

  return data;
}

async function apiPost(body = {}) {
  const payload = { ...body };

  if (!payload.key) payload.key = API_KEY;

  const url = new URL(WEBAPP_URL);
  url.searchParams.set("key", String(payload.key));
  if (payload.mode) url.searchParams.set("mode", String(payload.mode));

  const resp = await fetch(url.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const text = await resp.text();

  let data;
  try { data = JSON.parse(text); }
  catch { throw new Error("API JSON емес: " + text.slice(0, 160)); }

  if (!resp.ok || data?.ok === false) throw new Error(data?.error || ("HTTP " + resp.status));
  return data;
}


// ============================
// HARD REFRESH (FIX CACHE / PWA)
// ============================
async function hardRefreshApp() {
  try {
    // 1) очистим локальные отметки "уже сохраняли"
    Object.keys(localStorage).forEach((k) => {
      if (k.startsWith("att_saved:")) localStorage.removeItem(k);
    });

    // 2) обновим Service Worker
    if ("serviceWorker" in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      for (const r of regs) {
        try { await r.update(); } catch (_) {}
      }
    }

    // 3) очистим Cache Storage (если есть)
    if ("caches" in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    }
  } catch (e) {
    console.warn("hardRefreshApp warning:", e);
  }

  // 4) перезагрузка страницы
  location.reload();
}

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
    schoolName: '"№4 Алға орта мектебі" КММ',
    homeBtn: "← 🏠Басты бет",
    
installPWA: "📱 Қосымша ретінде орнату",
installAndroid: "📱 Android (Samsung және т.б.)",
installIOS: "🍎 iPhone (iOS)",
installPC: "💻 Компьютер",

installAndroidSteps:
"1) Chrome ашыңыз\n2) ⋮ мәзір → \"Басты экранға қосу\" / \"Install app\"\n3) \"Орнату\" таңдаңыз",

installIOSSteps:
"1) Safari ашыңыз\n2) Төмендегі \"Бөлісу\" (⬆️) → \"Басты экранға қосу\"\n3) \"Қосу\" таңдаңыз",

installPCSteps:
"1) Chrome/Edge ашыңыз\n2) Адрес жолағындағы \"Install\" (қосу) белгісін басыңыз\n3) \"Орнату\" таңдаңыз",

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
    btnAdd: "➕ Қосу",
    saveBtn: "💾 Сақтау",

    note: "Ескерту",
    attendanceHint:
      "Ескерту: барлығы әдепкіде «Қатысты». Тек қажет болса ғана «Ауырды / Себепті / Себепсіз / Кешікті» таңдаңыз.",

    dayIssuesTitle: "📌 Сабақтан қалғандар (күндік)",
    late: "⏰ Кешіккендер",
    sick: "🤒 Ауырғандар",
    excused: "📄 Себепті",
    unexcused: "❌ Себепсіз",
    unmarkedClasses: "📍 Белгі қойылмаған сыныптар",
    dayIssuesNote: "Ескерту: “Қатысты” оқушылар көрсетілмейді.",

    kpiTotal: "📊 Барлық белгі",
    kpiPresent: "✅ Қатысты",
    kpiLate: "⏰ Кешікті",
    kpiSick: "🤒 Ауырды",
    kpiExcused: "📄 Себепті",
    kpiUnexcused: "❌ Себепсіз",

    topLate: "🔥 Көп кешігу (TOP)",
    topUnexcused: "🚫 Көп себепсіз (TOP)",

    saveOk: "✅ Сақталды:",
    saveErr: "❌ Қате:",
    needClass: "Сыныпты таңдаңыз",
    needDate: "Күнді таңдаңыз",
    chooseException: "Тек қажет болса таңдаңыз",
    needPeriod: "Кезеңді таңдаңыз",
    noStudents: "Оқушылар тізімі бос",
    alreadySaved: "✅ Бұл сынып бұл күні бұрын сақталған",
    replaced: "(қайта жазылды)",

    attendance: "Сабаққа қатысу журналы",
    attendanceDesc:
      "Оқушылардың сабаққа қатысуын есепке алудың автоматтандырылған жүйесі",
    markAttendance: "📚 Сабаққа қатысуды белгілеу",
    reports: "📊 Есептер мен статистика",

    // Students view
    studentsBtn: "👥 Оқушылар (басқару)",
    studentsTitle: "Оқушыларды басқару",
    refreshStudents: "🔄 Жаңарту",
    
departBtn: "🚪 Шықты",
restoreBtn: "↩️ Қайтару",
departPrompt: "Шығу күні (YYYY-MM-DD):",

    addStudentTitle: "➕ Оқушы қосу",
    studentFio: "ФИО",
    studentFioExample: "Мысалы: Айдар Нұрланов",
    classLetter: "Әріп",
    arrivalDate: "Келген күні",
    studentManageHint:
"Кеңес: оқушы шықса — “Шықты” батырмасын басыңыз (өшірмейді, тек шығу күнін қояды).",
  },

  ru: {
    schoolName: 'КГУ "Алгинская средняя школа №4"',
    homeBtn: "← 🏠 Главная",
    
installPWA: "📱 Установить как приложение",
installAndroid: "📱 Android (Samsung и др.)",
installIOS: "🍎 iPhone (iOS)",
installPC: "💻 Компьютер",

installAndroidSteps:
"1) Откройте Chrome\n2) Меню ⋮ → \"Установить приложение\" / \"Добавить на главный экран\"\n3) Нажмите \"Установить\"",

installIOSSteps:
"1) Откройте Safari\n2) Поделиться (⬆️) → \"На экран Домой\"\n3) Нажмите \"Добавить\"",

installPCSteps:
"1) Откройте Chrome/Edge\n2) Нажмите значок установки (Install) в адресной строке\n3) Нажмите \"Установить\"",

    reportsTitle: "Отчёты и статистика",
    dailyControlTitle: "📚 Ежедневный контроль",

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

    btnUpdate: "📈 Показать",
    btnExport: "⬇️ Экспорт CSV",
    btnAdd: "➕ Добавить",
    saveBtn: "💾 Сохранить",

    note: "Примечание",
    attendanceHint:
      "Подсказка: по умолчанию все «Присутствовал(а)». Выбирайте «Болел(а) / По уважительной / Без уважительной / Опоздал(а)» только при необходимости.",

    dayIssuesTitle: "📌 Пропуски за день",
    late: "⏰ Опоздавшие",
    sick: "🤒 Болели",
    excused: "📄 По уважительной",
    unexcused: "❌ Без уважительной",
    unmarkedClasses: "📍 Не отмеченные классы",
    dayIssuesNote: "Примечание: “Присутствовал(а)” не показывается.",

    kpiTotal: "📊 Всего отметок",
    kpiPresent: "✅ Присутствовал(а)",
    kpiLate: "⏰ Опоздал(а)",
    kpiSick: "🤒 Болел(а)",
    kpiExcused: "📄 По уважительной",
    kpiUnexcused: "❌ Без уважительной",

    topLate: "🔥 Часто опаздывают (TOP)",
    topUnexcused: "🚫 Много без причины (TOP)",

    saveOk: "✅ Сохранено:",
    saveErr: "❌ Ошибка:",
    needClass: "Выберите класс",
    needDate: "Выберите дату",
    chooseException: "Выбирайте только при необходимости",
    needPeriod: "Укажите период",
    noStudents: "Список учеников пуст",
    alreadySaved: "✅ Этот класс в этот день уже сохранён",
    replaced: "(перезаписано)",

    attendance: "Журнал посещаемости",
    attendanceDesc:
      "Автоматизированная система учёта посещаемости учебных занятий",
    markAttendance: "📚 Отметить посещаемость",
    reports: "📊 Отчёты и статистика",

    // Students view
    studentsBtn: "👥 Ученики (управление)",
    studentsTitle: "Управление учениками",
    refreshStudents: "🔄 Обновить",
    
departBtn: "🚪 Выбыл",
restoreBtn: "↩️ Вернуть",
departPrompt: "Дата выбытия (YYYY-MM-DD):",

    addStudentTitle: "➕ Добавить ученика",
    studentFio: "ФИО",
    studentFioExample: "Например: Айдар Нурланов",
    classLetter: "Литера",
    arrivalDate: "Дата прибытия",
    studentManageHint:
      "Подсказка: если ученик выбыл — нажмите “Выбыл” (не удаляет, только ставит дату).",
  }
};

// ============================
// LANG
// ============================
function setLang(lang) {
  currentLang = (lang === "ru") ? "ru" : "kk";
  document.body.dataset.lang = currentLang;
  localStorage.setItem("lang", currentLang);
  applyI18n();
}

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

  // period options
  const period = document.getElementById("periodType");
  if (period) {
    [...period.options].forEach(opt => {
      const key = opt.dataset.i18n;
      if (key && dict[key] != null) opt.textContent = dict[key];
    });
  }

  // Refresh classes labels when language changes
  if (window.__classesLoaded) {
    renderClassesTo(document.getElementById("classSelect"), window.__classList, false);
    renderClassesTo(document.getElementById("reportClass"), window.__classList, true);
    renderClassesTo(document.getElementById("manageClass"), window.__classList, true);
  }

  renderAttendanceTable();
  renderManageStudents();
}

// ============================
// DATE HELPERS (timezone-safe)  ✅ бір ғана нұсқа!
// ============================
function iso(d) {
  return d.toISOString().slice(0, 10);
}

// "YYYY-MM-DD" → timezone сырғып кетпесін
function d0(s) {
  const [y, m, d] = String(s).split("-").map(Number);
  return new Date(Date.UTC(y, (m || 1) - 1, d || 1, 0, 0, 0));
}

// ============================
// VIEW SWITCH
// ============================
function showView(id) {
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  document.getElementById(id)?.classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ============================
// STATE
// ============================
let allStudents = [];
let statusMap = new Map();

// ============================
// STATUS HELPERS
// ============================
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

// ============================
// CLASSES
// ============================
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

  classList.forEach(cls => {
    const opt = document.createElement("option");
    opt.value = cls;
    opt.textContent = cls;
    selectEl.appendChild(opt);
  });
}

function normalizeClassValue(v) {
  return String(v || "")
    .replace(/\s+/g, "")
    .toUpperCase();
}

function parseClass(cls) {
  const c = normalizeClassValue(cls);
  const m = c.match(/^(\d+)(.*)$/);
  if (!m) return { grade: "", letter: "" };
  return { grade: m[1], letter: m[2] || "" };
}

// ============================
// PERIOD HELPERS
// ============================
function getQuarterRange(q, y) {
  const map = {
    1: ["01-01", "03-31"],
    2: ["04-01", "06-30"],
    3: ["09-01", "10-31"],
    4: ["11-01", "12-31"],
  };
  return {
    from: `${y}-${map[q][0]}`,
    to: `${y}-${map[q][1]}`,
  };
}

function getYearRange(y) {
  return {
    from: `${y}-01-01`,
    to: `${y}-12-31`,
  };
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
    filtered = filtered.filter(s =>
      String(s.grade) === grade && String(s.class_letter) === letter
    );
  } else {
    filtered = [];
  }

  if (q) {
    filtered = filtered.filter(s =>
      String(s.full_name).toLowerCase().includes(q)
    );
  }

  tbody.innerHTML = "";

  if (filtered.length === 0 && selectedClass) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="4" style="text-align:center; color:#999; padding:20px;">Оқушылар табылмады</td>`;
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
// SAVE ATTENDANCE (FIXED)
// ============================
async function saveAttendance() {
  const btn = document.getElementById("saveAttendanceBtn");
  const dateEl = document.getElementById("attendanceDate");
  const classEl = document.getElementById("classSelect");
  const saveStatus = document.getElementById("saveStatus");

  const date = dateEl?.value;
  const cls = classEl?.value;

  if (!date) return alert(I18N[currentLang].needDate);
  if (!cls) return alert(I18N[currentLang].needClass);

  const { grade, letter } = parseClass(cls);

  if (btn) btn.disabled = true;
  if (saveStatus) saveStatus.textContent = "⏳ Сақталуда...";

  try {
    const students = allStudents.filter(
      (s) => String(s.grade) === grade && String(s.class_letter) === letter
    );

    if (!students.length) {
      throw new Error(I18N[currentLang].noStudents);
    }

    const records = students.map((s) => ({
      student_id: s.id,
      status_code: statusMap.get(s.id) || "katysty",
    }));

    const res = await apiPost({
      key: API_KEY,
      mode: "saveattendance", // 🔥 ОБЯЗАТЕЛЬНО
      date,
      grade,
      class_letter: letter,
      records,
    });

    if (saveStatus) {
      const extra = res?.replaced ? I18N[currentLang].replaced : "";
      saveStatus.textContent = `${I18N[currentLang].saveOk} ${res?.saved || ""} ${extra}`;
    }

    // 🔥 сразу обновляем дневной отчёт
    if (document.getElementById("periodType")?.value === "day") {
      await loadReport();
    }

  } catch (e) {
    if (saveStatus) {
      saveStatus.textContent = `${I18N[currentLang].saveErr} ${e.message}`;
    } else {
      alert(`${I18N[currentLang].saveErr} ${e.message}`);
    }
  } finally {
    if (btn) btn.disabled = false;
  }
}


// ============================
// REPORT PERIOD HELPERS
// ============================
function iso(d) {
  return d.toISOString().slice(0, 10);
}

function getQuarterRangeByYear(q, year) {
  const y = Number(year);
  const qq = Math.min(4, Math.max(1, Number(q)));
  const startMonth = (qq - 1) * 3;
  const from = new Date(y, startMonth, 1);
  const to = new Date(y, startMonth + 3, 0);
  return { from: iso(from), to: iso(to) };
}

function getRangeFromPeriod() {
  const type = document.getElementById("periodType")?.value;
  if (!type) return null;

  if (type === "day") {
    const d = document.getElementById("customStart")?.value;
    return d ? { from: d, to: d } : null;
  }

  if (type === "week" || type === "all") {
    const s = document.getElementById("customStart")?.value;
    const e = document.getElementById("customEnd")?.value;
    return s && e ? { from: s, to: e } : null;
  }

  if (type === "month") {
    const v = document.getElementById("monthInput")?.value;
    if (!v) return null;
    const [y, m] = v.split("-");
    const last = new Date(Number(y), Number(m), 0);
    return { from: `${y}-${m}-01`, to: iso(last) };
  }

  if (type === "year") {
    const y = Number(document.getElementById("yearInput")?.value);
    return y ? { from: `${y}-01-01`, to: `${y}-12-31` } : null;
  }

  if (type === "quarter") {
    const q = Number(document.getElementById("quarterInput")?.value);
    const y = Number(document.getElementById("quarterYearInput")?.value);
    return q && y ? getQuarterRangeByYear(q, y) : null;
  }

  return null;
}

// ============================
// UPDATE PERIOD CONTROLS
// ============================
function updatePeriodControls() {
  const type = document.getElementById("periodType")?.value;

  const monthCtrl = document.getElementById("monthControl");
  const quarterCtrl = document.getElementById("quarterControl");
  const yearCtrl = document.getElementById("yearControl");
  const customCtrl = document.getElementById("customControl");

  [monthCtrl, quarterCtrl, yearCtrl, customCtrl].forEach(
    (el) => el && (el.style.display = "none")
  );

  if (type === "month" && monthCtrl) monthCtrl.style.display = "flex";
  if (type === "quarter" && quarterCtrl) quarterCtrl.style.display = "flex";
  if (type === "year" && yearCtrl) yearCtrl.style.display = "flex";

  if (["day", "week", "quarter"].includes(type) && customCtrl) {
    customCtrl.style.display = "flex";
  }

  // day → to = from
  if (type === "day") {
    const s = document.getElementById("customStart");
    const e = document.getElementById("customEnd");
    if (s && e) e.value = s.value;
  }

  // quarter → авто диапазон
  if (type === "quarter") {
    const q = document.getElementById("quarterInput")?.value;
    const y = document.getElementById("quarterYearInput")?.value;
    if (q && y) {
      const r = getQuarterRangeByYear(q, y);
      const s = document.getElementById("customStart");
      const e = document.getElementById("customEnd");
      if (s && e) {
        s.value = r.from;
        e.value = r.to;
      }
    }
  }
}


// ============================
// REPORTS (LOAD + RENDER + CSV)
// ============================

// ---------- helpers ----------
function setText_(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = String(val ?? 0);
}

function clearTbody_(tableId) {
  const tb = document.querySelector(`#${tableId} tbody`);
  if (tb) tb.innerHTML = "";
}

function fillStudentList_(tableId, rows) {
  const tb = document.querySelector(`#${tableId} tbody`);
  if (!tb) return;
  tb.innerHTML = "";

  if (!rows || rows.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="3" style="text-align:center;color:#999;padding:10px;">—</td>`;
    tb.appendChild(tr);
    return;
  }

  rows.forEach((r, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td style="width:44px">${i + 1}</td>
      <td>${r.name || ""}</td>
      <td>${r.class || ""}</td>`;
    tb.appendChild(tr);
  });
}

function fillTop_(tableId, rows) {
  const tb = document.querySelector(`#${tableId} tbody`);
  if (!tb) return;
  tb.innerHTML = "";

  if (!rows || rows.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="4" style="text-align:center;color:#999;padding:10px;">—</td>`;
    tb.appendChild(tr);
    return;
  }

  rows.forEach((r, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${r.name || ""}</td>
      <td>${r.class || ""}</td>
      <td>${r.count ?? 0}</td>`;
    tb.appendChild(tr);
  });
}

function fillUnmarkedClasses_(classes) {
  const tb = document.querySelector(`#tblUnmarkedClasses tbody`);
  if (!tb) return;
  tb.innerHTML = "";

  if (!classes || classes.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="2" style="text-align:center;color:#999;padding:10px;">—</td>`;
    tb.appendChild(tr);
    return;
  }

  classes.forEach((cls, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td style="width:44px">${i + 1}</td><td>${cls}</td>`;
    tb.appendChild(tr);
  });
}

// ---------- params ----------
function normalizeReportParams_() {
  const type = document.getElementById("periodType")?.value || "day";
  const cls = document.getElementById("reportClass")?.value || "ALL";
  const { grade, letter } =
    cls === "ALL" ? { grade: "ALL", letter: "ALL" } : parseClass(cls);

  const range = getRangeFromPeriod();
  if (!range) return null;

  return {
    type,
    params: {
      grade,
      class_letter: letter,
      from: range.from,
      to: range.to,
    },
  };
}

// ============================
// LOAD REPORT
// ============================
async function loadReport() {
  const btn = document.getElementById("updateStatsBtn");
  if (btn) btn.disabled = true;

  try {
    [
      "tblLate",
      "tblSick",
      "tblExcused",
      "tblUnexcused",
      "tblUnmarkedClasses",
      "topLateTable",
      "topUnexcusedTable",
    ].forEach(clearTbody_);

    const norm = normalizeReportParams_();
    if (!norm) throw new Error("Период выбран неверно");

    const { type, params } = norm;
    const res = await apiGet("report", params);

    // ---------- KPI ----------
    const totals = res.totals || {};
    let total = 0, present = 0, late = 0, sick = 0, excused = 0, unexcused = 0;

    Object.values(totals).forEach((t) => {
      const p = Number(t.katysty || 0);
      const l = Number(t.keshikti || 0);
      const s = Number(t.auyrdy || 0);
      const e = Number(t.sebep || 0);
      const u = Number(t.sebsez || 0);

      present += p;
      late += l;
      sick += s;
      excused += e;
      unexcused += u;
      total += p + l + s + e + u;
    });

    setText_("totalLessons", total);
    setText_("totalPresent", present);
    setText_("totalLate", late);
    setText_("totalSick", sick);
    setText_("totalExcused", excused);
    setText_("totalUnexcused", unexcused);

    // ---------- day / week issues ----------
    const dayBox = document.getElementById("dayIssuesBox");
    if (dayBox) dayBox.style.display = (type === "day" || type === "week") ? "block" : "none";

    const students = Array.isArray(res.students) ? res.students : [];
    const stMap = new Map(students.map(s => [String(s.id), s]));

    const lateRows = [], sickRows = [], excRows = [], unexcRows = [];
    const seenClasses = new Set();

    if ((type === "day" || type === "week") && res.daily) {
      const dailyMaps = [];

      if (type === "day" && res.daily[params.from]) {
        dailyMaps.push(res.daily[params.from]);
      }

      if (type === "week") {
        Object.values(res.daily).forEach(v => {
          if (v && typeof v === "object") dailyMaps.push(v);
        });
      }

      dailyMaps.forEach(dayMap => {
        Object.entries(dayMap).forEach(([sid, obj]) => {
          const s = stMap.get(String(sid));
          if (!s) return;

          const cls = `${s.grade || ""}${s.class_letter || ""}`;
          seenClasses.add(cls);

          const row = { name: s.full_name || "", class: cls };
          const code = obj?.status_code;

          if (code === "keshikti") lateRows.push(row);
          else if (code === "auyrdy") sickRows.push(row);
          else if (code === "sebep") excRows.push(row);
          else if (code === "sebsez") unexcRows.push(row);
        });
      });
    }

    fillStudentList_("tblLate", lateRows);
    fillStudentList_("tblSick", sickRows);
    fillStudentList_("tblExcused", excRows);
    fillStudentList_("tblUnexcused", unexcRows);

    // ---------- unmarked classes ----------
    const filteredStudents =
      params.grade === "ALL"
        ? students
        : students.filter(
            s =>
              String(s.grade) === String(params.grade) &&
              String(s.class_letter) === String(params.class_letter)
          );

    const allClasses = new Set(
      filteredStudents.map(s => `${s.grade}${s.class_letter}`)
    );

    const unmarked = [...allClasses]
      .filter(c => !seenClasses.has(c))
      .sort((a, b) => a.localeCompare(b, "ru"));

    fillUnmarkedClasses_(unmarked);

    // ---------- TOP ----------
    fillTop_("topLateTable", res.topLate || []);
    fillTop_("topUnexcusedTable", res.topUnexcused || []);

  } catch (e) {
    alert("Ошибка отчёта: " + (e?.message || e));
  } finally {
    if (btn) btn.disabled = false;
  }
}

// ============================
// EXPORT CSV
// ============================
async function exportReportCsv() {
  try {
    const norm = normalizeReportParams_();
    if (!norm) throw new Error("Период выбран неверно");

    const res = await apiGet("report", norm.params);
    const totals = res.totals || {};
    const students = Array.isArray(res.students) ? res.students : [];
    const stMap = new Map(students.map(s => [String(s.id), s]));

    const lines = [];
    lines.push(["student_id","fio","class","katysty","keshikti","auyrdy","sebep","sebsez"].join(","));

    Object.entries(totals).forEach(([sid, t]) => {
      const s = stMap.get(String(sid)) || {};
      const cls = `${s.grade || ""}${s.class_letter || ""}`;
      const fio = String(s.full_name || "").replace(/"/g, '""');

      lines.push([
        sid,
        `"${fio}"`,
        `"${cls}"`,
        t.katysty || 0,
        t.keshikti || 0,
        t.auyrdy || 0,
        t.sebep || 0,
        t.sebsez || 0,
      ].join(","));
    });

    const blob = new Blob(["\ufeff" + lines.join("\n")], {
      type: "text/csv;charset=utf-8",
    });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "report.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();

  } catch (e) {
    alert("CSV ошибка: " + (e?.message || e));
  }
}


// ============================
// STUDENTS MANAGE
// ============================
let manageStudentsAll = [];

function toDDMMYYYY(isoStr) {
  const v = String(isoStr || "").trim();
  if (!v || !v.includes("-")) return "";
  const [y, m, d] = v.split("-");
  return `${d}.${m}.${y}`;
}

async function refreshManageStudents() {
  try {
    const res = await apiGet("students", { include_inactive: "1" });
    manageStudentsAll = res.students || [];
    renderManageStudents();

    const st = document.getElementById("manageStatus");
    if (st) st.textContent = "";
  } catch (e) {
    alert("Ошибка загрузки учеников: " + e.message);
  }
}

function renderManageStudents() {
  const tbody = document.querySelector("#manageTable tbody");
  if (!tbody) return;

  const cls = document.getElementById("manageClass")?.value || "ALL";
  const q = (document.getElementById("manageSearch")?.value || "").trim().toLowerCase();

  let list = manageStudentsAll.slice();

  if (cls !== "ALL") {
    const { grade, letter } = parseClass(cls);
    list = list.filter(s => String(s.grade) === grade && String(s.class_letter) === letter);
  }

  if (q) {
    list = list.filter(s => String(s.full_name || "").toLowerCase().includes(q));
  }

  list.sort((a, b) => String(a.full_name || "").localeCompare(String(b.full_name || ""), "ru"));

  tbody.innerHTML = "";

  list.forEach((s, i) => {
    const tr = document.createElement("tr");
    const isInactive = String(s.departure_date || "").trim() !== "";
    if (isInactive) tr.style.opacity = "0.55";

    const td1 = document.createElement("td");
    td1.textContent = String(i + 1);

    const td2 = document.createElement("td");
    td2.textContent = s.full_name || "";

    const td3 = document.createElement("td");
    td3.textContent = `${s.grade || ""}${s.class_letter || ""}`;

    const td4 = document.createElement("td");
    td4.textContent = s.arrival_date ? toDDMMYYYY(s.arrival_date) : "—";

    const td5 = document.createElement("td");
    td5.textContent = s.departure_date ? toDDMMYYYY(s.departure_date) : "—";

    const td6 = document.createElement("td");

    if (!isInactive) {
      const btn = document.createElement("button");
      btn.className = "btn";
     btn.textContent = I18N[currentLang].departBtn;
      btn.addEventListener("click", () => markStudentDeparted(s.id));
      td6.appendChild(btn);
    } else {
      const btn = document.createElement("button");
      btn.className = "btn";
     btn.textContent = I18N[currentLang].restoreBtn;
      btn.addEventListener("click", () => restoreStudentById(s.id));
      td6.appendChild(btn);
    }

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tr.appendChild(td5);
    tr.appendChild(td6);
    tbody.appendChild(tr);
  });
}

async function addStudentFromUI() {
  const full_name = (document.getElementById("addFullName")?.value || "").trim();
  const grade = (document.getElementById("addGrade")?.value || "").trim();
  const class_letter = (document.getElementById("addLetter")?.value || "").trim();
  const arrival_date = (document.getElementById("addArrivalDate")?.value || "").trim();

  if (!full_name || !grade || !class_letter) {
    alert(currentLang === "ru" ? "Заполните ФИО, класс и литеру" : "Аты-жөні, класс, әріпті толтырыңыз");
    return;
  }

  try {
    await apiPost({
      key: API_KEY,
      mode: "addstudent",
      full_name,
      grade,
      class_letter,
      arrival_date,
    });

    document.getElementById("addFullName").value = "";
    document.getElementById("addGrade").value = "";
    document.getElementById("addLetter").value = "";
    const ad = document.getElementById("addArrivalDate");
    if (ad) ad.value = "";

    const st = document.getElementById("manageStatus");
    if (st) st.textContent = "✅ Ученик добавлен";
    setTimeout(() => { if (st) st.textContent = ""; }, 1500);

    await refreshManageStudents();
  } catch (e) {
    alert("Ошибка добавления: " + e.message);
  }
}

async function markStudentDeparted(id) {
  const def = document.getElementById("attendanceDate")?.value || new Date().toISOString().slice(0, 10);
 const d = prompt(I18N[currentLang].departPrompt, def);
  if (!d) return;

  try {
    await apiPost({
      key: API_KEY,
      mode: "deletestudent",
      id: String(id),
      departure_date: d,
    });

    const st = document.getElementById("manageStatus");
    if (st) st.textContent = "✅ Ученик отмечен как выбывший";
    setTimeout(() => { if (st) st.textContent = ""; }, 1500);

    await refreshManageStudents();
  } catch (e) {
    alert("Ошибка: " + e.message);
  }
}

async function restoreStudentById(id) {
  if (!confirm("Вернуть ученика в активные (очистить дату выбытия)?")) return;

  try {
    await apiPost({
      key: API_KEY,
      mode: "restorestudent",
      id: String(id),
    });

    const st = document.getElementById("manageStatus");
    if (st) st.textContent = "✅ Ученик восстановлен";
    setTimeout(() => { if (st) st.textContent = ""; }, 1500);

    await refreshManageStudents();
  } catch (e) {
    alert("Ошибка: " + e.message);
  }
}

// ============================
// INIT
// ============================
document.addEventListener("DOMContentLoaded", async () => {

  // Navigation
  document.getElementById("goAttendance")?.addEventListener("click", () => showView("viewAttendance"));
  document.getElementById("goReports")?.addEventListener("click", () => showView("viewReports"));
  document.getElementById("backHome1")?.addEventListener("click", () => showView("viewHome"));
  document.getElementById("backHome2")?.addEventListener("click", () => showView("viewHome"));

  document.getElementById("goStudents")?.addEventListener("click", async () => {
    showView("viewStudents");
    await refreshManageStudents();
  });

  document.getElementById("backHome3")?.addEventListener("click", () => showView("viewHome"));

  // Buttons in Students page
  document.getElementById("addStudentBtn")?.addEventListener("click", addStudentFromUI);
  document.getElementById("refreshStudentsBtn")?.addEventListener("click", refreshManageStudents);
  document.getElementById("manageSearch")?.addEventListener("input", renderManageStudents);
  document.getElementById("manageClass")?.addEventListener("change", renderManageStudents);

  // Lang toggle
  document.getElementById("langToggle")?.addEventListener("click", () => {
    setLang(currentLang === "kk" ? "ru" : "kk");
  });

  // Hard refresh button
  document.getElementById("refreshAppBtn")?.addEventListener("click", hardRefreshApp);

  // Today defaults
  const todayISO = new Date().toISOString().slice(0, 10);

  // Default values for reports inputs
  const monthInput = document.getElementById("monthInput");
  if (monthInput && !monthInput.value) monthInput.value = todayISO.slice(0, 7); // YYYY-MM

  const yearInput = document.getElementById("yearInput");
  if (yearInput && !yearInput.value) yearInput.value = String(new Date().getFullYear());

  const qYearInput = document.getElementById("quarterYearInput");
  if (qYearInput && !qYearInput.value) qYearInput.value = String(new Date().getFullYear());

  const attendanceDate = document.getElementById("attendanceDate");
  if (attendanceDate) attendanceDate.value = todayISO;

  const customStart = document.getElementById("customStart");
  const customEnd = document.getElementById("customEnd");
  if (customStart && !customStart.value) customStart.value = todayISO;
  if (customEnd && !customEnd.value) customEnd.value = todayISO;

  document.getElementById("periodType")?.addEventListener("change", updatePeriodControls);
  document.getElementById("updateStatsBtn")?.addEventListener("click", loadReport);
  document.getElementById("exportCsvBtn")?.addEventListener("click", exportReportCsv);
  document.getElementById("quarterInput")?.addEventListener("change", updatePeriodControls);
  document.getElementById("customStart")?.addEventListener("change", () => {
    if (document.getElementById("periodType")?.value === "day") {
      const e = document.getElementById("customEnd");
      if (e && customStart) e.value = customStart.value;
    }
  });

  document.getElementById("saveAttendanceBtn")?.addEventListener("click", saveAttendance);
  document.getElementById("searchInput")?.addEventListener("input", renderAttendanceTable);

  updatePeriodControls();

  // Load classes + students
  try {
    const cls = await apiGet("classes");
    window.__classesLoaded = true;
    window.__classList = cls.classes || [];

    renderClassesTo(document.getElementById("classSelect"), window.__classList, false);
    renderClassesTo(document.getElementById("reportClass"), window.__classList, true);
    renderClassesTo(document.getElementById("manageClass"), window.__classList, true);

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







