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
// SETTINGS (SERVER / KEY)
// ============================
const WEBAPP_URL = "https://old-recipe-0d35eduqatysu.alga4school.workers.dev/";
const API_KEY = "school2025";

// ============================
// API HELPERS (Worker -> Apps Script)
// ============================
async function apiGet(mode, params = {}) {
  const url = new URL(WEBAPP_URL);
  url.searchParams.set("mode", mode);
  url.searchParams.set("key", API_KEY);

  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
  });

  const resp = await fetch(url.toString(), { method: "GET" });
  const text = await resp.text();

  let data;
  try { data = JSON.parse(text); }
  catch { throw new Error("API JSON емес: " + text.slice(0, 160)); }

  if (!resp.ok || data?.ok === false) throw new Error(data?.error || ("HTTP " + resp.status));
  return data;
}

async function apiPost(body) {
  const resp = await fetch(WEBAPP_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const text = await resp.text();

  let data;
  try { data = JSON.parse(text); }
  catch { throw new Error("API JSON емес: " + text.slice(0, 160)); }

  if (!resp.ok || data?.ok === false) throw new Error(data?.error || ("HTTP " + resp.status));
  return data;
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
    noHolidays: "Таңдалмаған",

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
    holidaysLabel: "Оқымайтын күндер (мереке/каникул):",
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
    noHolidays: "Не выбрано",

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
    topLate: "Часто опаздывают (TOP)",
    topUnexcused: "Много без причины (TOP)",

    // ===== HOLIDAYS =====
   topLate: "🔥 Часто опаздывают (TOP)",
topUnexcused: "🚫 Много без причины (TOP)",

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

  // тіл ауысқанда интерфейс мәтіндерін жаңарту
  applyI18n();
}
/* ================== DATE HELPERS ================== */
/* Күнмен жұмыс істейтін функциялар (отчёт/сүзгі үшін керек болуы мүмкін) */

function d0(iso) { 
  return new Date(iso + "T00:00:00"); 
}
function iso(d) { 
  return d.toISOString().slice(0, 10); 
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
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  document.getElementById(id)?.classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ============================
// I18N
// ============================
function applyI18n() {
  const dict = I18N[currentLang] || I18N.kk;

  // мәтіндер
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    if (dict[key] != null) el.textContent = dict[key];
  });

  // placeholder-лар
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    if (dict[key] != null) el.placeholder = dict[key];
  });

  // период option-дары
  const period = document.getElementById("periodType");
  if (period) {
    [...period.options].forEach(opt => {
      const key = opt.dataset.i18n;
      if (key && dict[key] != null) opt.textContent = dict[key];
    });
  }

  // ✅ Сынып select-тері (тіл ауысқанда "Барлық сынып/Все классы" дұрыс ауысуы үшін)
  if (window.__classesLoaded) {
    renderClassesTo(document.getElementById("classSelect"), window.__classList, false);
    renderClassesTo(document.getElementById("reportClass"), window.__classList, true);
  }

  // attendance кестесін қайта салу
  if (typeof renderAttendanceTable === "function") {
    renderAttendanceTable();
  }

  // ❌ HOLIDAYS өшірсең — мыналарды МҮЛДЕ ҚОСУҒА БОЛМАЙДЫ:
  // renderHolidays();
  // updateSchoolDaysUI();
}

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
    .replace(/\s+/g, "")   // "0 Ә" -> "0Ә"
    .toUpperCase();
}

function parseClass(cls) {
  const c = normalizeClassValue(cls);
  const m = c.match(/^(\d+)(.*)$/); // сан + әріп(тер)
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
// SAVE
// ============================
async function saveAttendance() {
  const btn = document.getElementById("saveAttendanceBtn");
  const dateEl = document.getElementById("attendanceDate");
  const classSelect = document.getElementById("classSelect");
  const saveStatus = document.getElementById("saveStatus"); // ⚠️ болуы да мүмкін, болмауы да мүмкін

  const date = dateEl?.value;
  const cls = classSelect?.value;

  if (!date) return alert(I18N[currentLang].needDate);
  if (!cls) return alert(I18N[currentLang].needClass);

  // ҚАЙТАЛАНҒАН басуды тоқтатамыз (localStorage guard)
  const { grade, letter } = parseClass(cls);
  const guardKey = `att_saved:${date}:${grade}:${letter}`;

  if (localStorage.getItem(guardKey) === "1") {
    if (saveStatus) {
      saveStatus.textContent =
        I18N[currentLang].alreadySaved || "✅ Бұл сынып бұл күні сақталған";
    }
    return;
  }

  if (btn) btn.disabled = true;
  if (saveStatus) saveStatus.textContent = "⏳ ...";

  try {
    const students = allStudents.filter(
      (s) => String(s.grade) === grade && String(s.class_letter) === letter
    );

    if (!students.length) {
      throw new Error(
        I18N[currentLang].noStudents ||
          "Оқушылар тізімі бос. Google Sheet students толтырылғанын тексеріңіз."
      );
    }

    const records = students.map((s) => ({
      student_id: s.id,
      status_code: statusMap.get(s.id) || "katysty",
    }));

    const res = await apiPost({
      key: API_KEY,
      date,
      grade,
      class_letter: letter,
      records,
    });

    if (!res || res.ok === false) {
      throw new Error(res?.error || "Save failed");
    }

    // ✅ қайта басса да, фронт бөгейді; сервер жағы overwrite (duplicate болмайды)
    localStorage.setItem(guardKey, "1");

    const extra = res.replaced
      ? (I18N[currentLang].replaced || "(қайта жазылды)")
      : "";

    if (saveStatus) {
      saveStatus.textContent = `${I18N[currentLang].saveOk} ${res.saved} ${extra}`;
    }

    // ✅ ЕҢ МАҢЫЗДЫ: сақтағаннан кейін БҮГІНГІ ОТЧЁТ бірден шықсын
    // Reports-та "Күні" ашып қойсаң, дәл сол күнге есеп көрсетіледі
    const periodType = document.getElementById("periodType");
    const customStart = document.getElementById("customStart");
    const customEnd = document.getElementById("customEnd");

    if (periodType) periodType.value = "day";
    if (customStart) customStart.value = date;
    if (customEnd) customEnd.value = date;

    // контролдарды бірден дұрыстау
    if (typeof updatePeriodControls === "function") updatePeriodControls();

    // отчётты жаңарту
    if (typeof updateStats === "function") {
      await updateStats();
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


/* ================== ПЕРИОД (2025–2026 оқу жылы) ================== */

// ✅ 2025–2026 оқу жылы тоқсандары (каникулсыз оқу аралығы)
function getQuarterRange_2025_2026(q) {
  const Q = {
    1: { from: "2025-09-01", to: "2025-10-26" },
    2: { from: "2025-11-03", to: "2025-12-28" },
    3: { from: "2026-01-08", to: "2026-03-18" },
    4: { from: "2026-03-30", to: "2026-05-25" },
  };
  return Q[q] || Q[1];
}

// ✅ Диапазонды periodType бойынша есептеу
function getRangeFromPeriod() {
  const type = document.getElementById("periodType")?.value;
  if (!type) return null;

  const toISO = (d) => d.toISOString().slice(0, 10);

  // ✅ DAY: customStart арқылы 1 күн
  if (type === "day") {
    const d = document.getElementById("customStart")?.value;
    if (!d) return null;
    return { from: d, to: d };
  }

  // ✅ WEEK: user таңдаған диапазон (customStart → customEnd)
  if (type === "week") {
    const s = document.getElementById("customStart")?.value;
    const e = document.getElementById("customEnd")?.value;
    if (!s || !e) return null;
    return { from: s, to: e };
  }

  // ✅ MONTH: monthInput = "YYYY-MM"
  if (type === "month") {
    const v = document.getElementById("monthInput")?.value;
    if (!v) return null;

    const [y, m] = v.split("-");
    const last = new Date(Number(y), Number(m), 0); // соңғы күн
    return { from: `${y}-${m}-01`, to: toISO(last) };
  }

  // ✅ YEAR: календарь жыл
  if (type === "year") {
    const y = Number(
      document.getElementById("yearInput")?.value || new Date().getFullYear()
    );
    return { from: `${y}-01-01`, to: `${y}-12-31` };
  }

  // ✅ QUARTER: 2025–2026 оқу жылы тоқсандары
  if (type === "quarter") {
    const q = Number(document.getElementById("quarterInput")?.value || 1);
    return getQuarterRange_2025_2026(q);
  }

  // ✅ ALL: user таңдаған диапазон (customStart → customEnd)
  if (type === "all") {
    const s = document.getElementById("customStart")?.value;
    const e = document.getElementById("customEnd")?.value;
    if (!s || !e) return null;
    return { from: s, to: e };
  }

  return null;
}

/* ================== ПЕРИОД UI (авто толтыру) ================== */

// ✅ Тоқсан таңдағанда customStart/customEnd автомат толтыру
function updatePeriodControls() {
  const type = document.getElementById("periodType")?.value;

  const customCtrl = document.getElementById("customCtrl");
  const customStart = document.getElementById("customStart");
  const customEnd = document.getElementById("customEnd");

  // customCtrl бар болса ғана көрсет/жасыр (сенде бар деп есептеймін)
  if (customCtrl) {
    // day/week/all/quarter кезінде custom диапазон көрінсін
    const showCustom = type === "day" || type === "week" || type === "all" || type === "quarter";
    customCtrl.style.display = showCustom ? "block" : "none";
  }

  // ✅ QUARTER таңдағанда автомат күндер қойылады
  if (type === "quarter" && customStart && customEnd) {
    const q = Number(document.getElementById("quarterInput")?.value || 1);
    const r = getQuarterRange_2025_2026(q);
    customStart.value = r.from;
    customEnd.value = r.to;
  }
}

// ✅ Listener-лер: periodType/quarter өзгерсе — күндер автомат жаңарсын
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("periodType")?.addEventListener("change", updatePeriodControls);
  document.getElementById("quarterInput")?.addEventListener("change", updatePeriodControls);

  // Бет ашылғанда да бір рет толтырып қоямыз
  updatePeriodControls();
});
function sumTotals(report) {
  const totals = {
    total: 0,
    katysty: 0,
    keshikti: 0,
    sebep: 0,
    sebsez: 0,
    auyrdy: 0,
  };

  Object.values(report?.totals || {}).forEach((t) => {
    ["katysty", "keshikti", "sebep", "sebsez", "auyrdy"].forEach((k) => {
      const n = Number(t?.[k] || 0);
      totals[k] += n;
      totals.total += n;
    });
  });

  return totals;
}

/* ================== TOP ================== */
function buildTop(report, code, limit = 10) {
  const students = report?.students || [];
  return students
    .map((s) => ({
      name: s.full_name,
      cls: `${s.grade}${s.class_letter}`,
      count: Number(report?.totals?.[String(s.id)]?.[code] || 0),
    }))
    .filter((x) => x.count > 3) // ✅ 4+ рет (3-тен жоғары)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c]));
}

function fillTable(tableId, rows) {
  const tbody = document.querySelector(`#${tableId} tbody`);
  if (!tbody) return;

  tbody.innerHTML = "";

  rows.forEach((r, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${escapeHtml(r.name)}</td>
      <td>${escapeHtml(r.cls)}</td>
      <td>${Number(r.count || 0)}</td>
    `;
    tbody.appendChild(tr);
  });
}

/* ================== DAY ISSUES TABLES ================== */
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

// ============================
// REPORTS (Day issues tables)
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

// 1) Day Issues box жасыру (бір ғана)
function hideDayIssues() {
  const box = document.getElementById("dayIssuesBox");
  if (box) box.style.display = "none";

  ["tblLate", "tblSick", "tblExcused", "tblUnexcused"].forEach((id) => {
    const tb = document.querySelector(`#${id} tbody`);
    if (tb) tb.innerHTML = "";
  });
}

// 2) 3 бағанмен толтыру (қауіпсіз)
function fill3(tableId, rows) {
  const tb = document.querySelector(`#${tableId} tbody`);
  if (!tb) return;

  tb.innerHTML = "";
  rows.forEach((r, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${escapeHtml(r.name)}</td>
      <td>${escapeHtml(r.cls)}</td>
    `;
    tb.appendChild(tr);
  });
}

// 3) дата диапазонындағы ISO күндер тізімі (timezone safe)
function eachDateISO(fromISO, toISO) {
  const res = [];
  const start = d0(fromISO);
  const end = d0(toISO);

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    res.push(iso(d));
  }
  return res;
}

// 4) report.daily ішінен таңдалған мерзім бойынша тізімдерді жинау
function buildIssuesForRange(report, range) {
  const stById = new Map((report?.students || []).map((s) => [String(s.id), s]));
  const daily = report?.daily || {};

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

      // қайталамау: бір оқушы бір категорияға 1-ақ рет түссін
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

// 5) dayIssuesBox көрсету (кез келген мерзім, кез келген класс/ALL)
function renderDayIssuesForRange(report, range) {
  const box = document.getElementById("dayIssuesBox");
  if (!box) return;

  const issues = buildIssuesForRange(report, range);

  // бәрі бос болса — жасырамыз
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
  if (!range) {
    alert(I18N[currentLang]?.needPeriod || "Периодты таңдаңыз");
    return;
  }

  const reportClass = document.getElementById("reportClass")?.value || "ALL";
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
      class_letter,
    });

    // ✅ dayIssues
    renderDayIssuesForRange(report, range);

    // ✅ KPI
    const t = sumTotals(report);

    const elTotal = document.getElementById("totalLessons");
    const elPres = document.getElementById("totalPresent");
    const elLate = document.getElementById("totalLate");
    const elSick = document.getElementById("totalSick");
    const elExc = document.getElementById("totalExcused");
    const elUnx = document.getElementById("totalUnexcused");

    if (elTotal) elTotal.textContent = t.total;
    if (elPres) elPres.textContent = t.katysty;
    if (elLate) elLate.textContent = t.keshikti;
    if (elSick) elSick.textContent = t.auyrdy;
    if (elExc) elExc.textContent = t.sebep;
    if (elUnx) elUnx.textContent = t.sebsez;

    // ✅ TOP tables
    fillTable("topLateTable", buildTop(report, "keshikti"));
    fillTable("topUnexcusedTable", buildTop(report, "sebsez"));
  } catch (e) {
    hideDayIssues();
    alert((currentLang === "ru" ? "Ошибка отчёта: " : "Есеп қатесі: ") + (e?.message || e));
  }
}


// ===== DATE HELPERS (timezone-safe) =====
function iso(d) {
  return d.toISOString().slice(0, 10);
}

// "YYYY-MM-DD" → local/timezone сырғып кетпейтін Date
function d0(s) {
  const [y, m, d] = String(s).split("-").map(Number);
  return new Date(Date.UTC(y, (m || 1) - 1, d || 1, 0, 0, 0));
}

function betweenInclusive(dateISO, fromISO, toISO) {
  const t = d0(dateISO).getTime();
  return t >= d0(fromISO).getTime() && t <= d0(toISO).getTime();
}

function exportCsv() {
  const range = getRangeFromPeriod();
  if (!range) {
    alert(I18N[currentLang]?.needPeriod || "Кезеңді таңдаңыз");
    return;
  }

  const reportClass = document.getElementById("reportClass")?.value || "ALL";
  let grade = "ALL", class_letter = "ALL";

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

      // ---------- helpers ----------
      // ---------- helpers ----------
const norm = (s) => String(s || "").replace(/\s+/g, "").toUpperCase();
const wantedClassNorm = (reportClass === "ALL") ? "" : norm(reportClass);

// ✅ class дұрыс құралуы үшін (әріп жоқ болса да қате шықпайды)
const getStudentClass = (s, st) => {
  const g = (s?.grade ?? st?.grade ?? "");
  const l = (s?.class_letter || st?.class_letter || "");
  return `${g}${l}`.trim();
};

const getCode = (st) => (st?.status_code || "katysty");

const getKk = (st) => {
  const code = getCode(st);
  return st?.status_kk || STATUS?.[code]?.kk || STATUS.katysty.kk;
};

const getRu = (st) => {
  const code = getCode(st);
  return st?.status_ru || STATUS?.[code]?.ru || STATUS.katysty.ru;
};

// ---------- build DAILY rows ----------
const headerDaily = ["date", "student", "class", "status_code", "status_kk", "status_ru"];
const rowsDaily = [];

Object.entries(daily).forEach(([dateISO, byId]) => {
  students.forEach((s) => {
    const st = byId?.[String(s.id)];
    const cls = getStudentClass(s, st);

    // Фильтр класс если выбран
    if (reportClass !== "ALL" && norm(cls) !== wantedClassNorm) return;

    const code = getCode(st);

    rowsDaily.push([
      dateISO,
      s.full_name,
      cls,
      code,
      getKk(st),
      getRu(st),
    ]);
  });
});


      // Егер daily жоқ/бос болса — totals шығарамыз
      let header = headerDaily;
      let rows = rowsDaily;

      if (!rowsDaily.length) {
        const headerTotals = ["student", "class", "katysty", "keshikti", "auyrdy", "sebep", "sebsez", "total"];
        const rowsTotals = [];

        students.forEach((s) => {
          const cls = getStudentClass(s);
          if (reportClass !== "ALL" && norm(cls) !== wantedClassNorm) return;

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

      // ---------- CSV (Excel-friendly) ----------
      const sep = ";";
      const csv =
        "\ufeff" +
        [header, ...rows]
          .map((r) =>
            r
              .map((x) => {
                const v = String(x ?? "");
                return (v.includes(sep) || v.includes('"') || v.includes("\n") || v.includes("\r"))
                  ? `"${v.replace(/"/g, '""')}"`
                  : v;
              })
              .join(sep)
          )
          .join("\r\n");

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
    .catch((err) => {
      const msg = err?.message || String(err || "");
      alert((currentLang === "ru" ? "Ошибка экспорта: " : "Экспорт қатесі: ") + msg);
    });
}

// ============================
// PERIOD CONTROLS (GLOBAL)
// ============================
function updatePeriodControls() {
  const type = document.getElementById("periodType")?.value;

  const monthCtrl = document.getElementById("monthControl");
  const quarterCtrl = document.getElementById("quarterControl");
  const yearCtrl = document.getElementById("yearControl");
  const customCtrl = document.getElementById("customControl");

  // бәрін жасырамыз
  if (monthCtrl) monthCtrl.style.display = "none";
  if (quarterCtrl) quarterCtrl.style.display = "none";
  if (yearCtrl) yearCtrl.style.display = "none";
  if (customCtrl) customCtrl.style.display = "none";

  // керегін көрсетеміз
  if (type === "month" && monthCtrl) monthCtrl.style.display = "flex";
  if (type === "quarter" && quarterCtrl) quarterCtrl.style.display = "flex";
  if (type === "year" && yearCtrl) yearCtrl.style.display = "flex";

  // day/week/all => custom диапазон көрінсін
  if ((type === "day" || type === "week" || type === "all") && customCtrl) {
    customCtrl.style.display = "flex";
  }

  // day таңдағанда end=start болсын
  if (type === "day") {
    const s = document.getElementById("customStart");
    const e = document.getElementById("customEnd");
    if (s && e) e.value = s.value;
  }
}

// ============================
// INIT
// ============================
document.addEventListener("DOMContentLoaded", async () => {

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
  const todayISO = today.toISOString().slice(0, 10);

  const attendanceDate = document.getElementById("attendanceDate");
  if (attendanceDate) attendanceDate.value = todayISO;

  const customStart = document.getElementById("customStart");
  const customEnd = document.getElementById("customEnd");
  if (customStart && !customStart.value) customStart.value = todayISO;
  if (customEnd && !customEnd.value) customEnd.value = todayISO;

  const yearInput = document.getElementById("yearInput");
  if (yearInput) yearInput.value = today.getFullYear();

  const quarterYearInput = document.getElementById("quarterYearInput");
  if (quarterYearInput) quarterYearInput.value = today.getFullYear();

  // periodType өзгерсе — контролдарды басқару
  document.getElementById("periodType")?.addEventListener("change", updatePeriodControls);

  // customStart өзгергенде day режимінде customEnd те тең болсын
  document.getElementById("customStart")?.addEventListener("change", () => {
    if (document.getElementById("periodType")?.value === "day") {
      const s = document.getElementById("customStart");
      const e = document.getElementById("customEnd");
      if (s && e) e.value = s.value;
    }
  });

  // Батырмалар
  document.getElementById("saveAttendanceBtn")?.addEventListener("click", saveAttendance);
  document.getElementById("updateStatsBtn")?.addEventListener("click", updateStats);
  document.getElementById("exportCsvBtn")?.addEventListener("click", exportCsv);
  document.getElementById("searchInput")?.addEventListener("input", renderAttendanceTable);

  // ✅ Бет ашылғанда period control-дар бірден дұрыс көрінсін
  updatePeriodControls();

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







