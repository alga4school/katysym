let __isSavingAttendance = false;

// ============================
// I18N / UI STRINGS
// ============================
const I18N = {
  ru: {
    home: "Главная",
    attendanceTitle: "Ежедневный контроль",
    date: "Дата",
    class: "Класс",
    lesson: "Урок",
    searchStudent: "Поиск ученика…",
    status: "Статус",
    save: "Сохранить",
    saving: "Сохранение…",
    savedOk: "Сохранено!",
    savedErr: "Ошибка сохранения",
    report: "Отчёт",
    exportCsv: "Экспорт CSV",
    filterFrom: "С",
    filterTo: "По",
    apply: "Применить",
    reset: "Сброс",
    totals: "Итоги",
    top: "ТОП пропусков",
    present: "Присутствовал(а)",
    sick: "Болел(а)",
    excused: "Уважительная",
    unexcused: "Без уважительной",
    late: "Опоздал(а)",
  },
  kk: {
    home: "Басты бет",
    attendanceTitle: "Күнделікті бақылау",
    date: "Күні",
    class: "Сынып",
    lesson: "Сабақ",
    searchStudent: "Оқушыны іздеу…",
    status: "Статус",
    save: "Сақтау",
    saving: "Сақталуда…",
    savedOk: "Сақталды!",
    savedErr: "Сақтау қатесі",
    report: "Есеп",
    exportCsv: "CSV экспорт",
    filterFrom: "Бастап",
    filterTo: "Дейін",
    apply: "Қолдану",
    reset: "Тазалау",
    totals: "Қорытынды",
    top: "ТОП пропуск",
    present: "Қатысты",
    sick: "Ауырды",
    excused: "Себепті",
    unexcused: "Себепсіз",
    late: "Кешікті",
  },
};

let LANG = (localStorage.getItem("lang") || "kk").toLowerCase();
if (!I18N[LANG]) LANG = "kk";
const t = (k) => (I18N[LANG] && I18N[LANG][k]) || k;

// ============================
// CONFIG
// ============================
// Егер сіз Cloudflare Worker прокси қолдансаңыз:
// const API_BASE = "https://old-recipe-0d35eduqatysu.alga4school.workers.dev/";
//
// Егер тікелей Apps Script-ке жіберсеңіз (CORS проблема болса Worker жақсырақ):
const API_BASE = "https://old-recipe-0d35eduqatysu.alga4school.workers.dev/";

// Статустар
const STATUS = {
  katysty: { kk: "Қатысты", ru: "Присутствовал(а)" },
  auyrdy: { kk: "Ауырды", ru: "Болел(а)" },
  sebep: { kk: "Себепті", ru: "Отсутствовал(а) по уважительной причине" },
  sebsez: { kk: "Себепсіз", ru: "Отсутствовал(а) без уважительной причины" },
  keshikti: { kk: "Кешікті", ru: "Опоздал(а)" },
};

// ============================
// HELPERS
// ============================
function qs(sel, root = document) {
  return root.querySelector(sel);
}
function qsa(sel, root = document) {
  return Array.from(root.querySelectorAll(sel));
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (m) => {
    const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
    return map[m];
  });
}
function todayISO() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}
function debounce(fn, ms = 250) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

// ============================
// API
// ============================
async function apiGet(action, params = {}) {
  const url = new URL(API_BASE);
  url.searchParams.set("action", action);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const r = await fetch(url.toString(), { method: "GET" });
  const txt = await r.text();
  try {
    return JSON.parse(txt);
  } catch {
    return { ok: false, error: "Bad JSON", raw: txt };
  }
}

async function apiPost(action, payload = {}) {
  const url = new URL(API_BASE);
  url.searchParams.set("action", action);

  const r = await fetch(url.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const txt = await r.text();
  try {
    return JSON.parse(txt);
  } catch {
    return { ok: false, error: "Bad JSON", raw: txt };
  }
}

// ============================
// DATA
// ============================
let STUDENTS = []; // from students.js OR API
let CLASSES = [];
let CURRENT_CLASS = localStorage.getItem("currentClass") || "";
let CURRENT_DATE = localStorage.getItem("currentDate") || todayISO();
let CURRENT_LESSON = localStorage.getItem("currentLesson") || "1";

// Attendance for current class/date: map studentId -> statusKey
let ATT = {};

// ============================
// UI INIT
// ============================
document.addEventListener("DOMContentLoaded", async () => {
  // language switch (if exists)
  const langSel = qs("#langSelect");
  if (langSel) {
    langSel.value = LANG;
    langSel.addEventListener("change", () => {
      LANG = langSel.value;
      localStorage.setItem("lang", LANG);
      location.reload();
    });
  }

  // set static texts (if you have data-i18n)
  qsa("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    el.textContent = t(key);
  });
  qsa("[data-i18n-ph]").forEach((el) => {
    const key = el.getAttribute("data-i18n-ph");
    el.setAttribute("placeholder", t(key));
  });

  // fill date/class/lesson
  const dateInput = qs("#dateInput");
  if (dateInput) dateInput.value = CURRENT_DATE;

  const lessonSel = qs("#lessonSelect");
  if (lessonSel) {
    lessonSel.value = CURRENT_LESSON;
    lessonSel.addEventListener("change", () => {
      CURRENT_LESSON = lessonSel.value;
      localStorage.setItem("currentLesson", CURRENT_LESSON);
    });
  }

  // Load students: if global STUDENTS_DATA exists use it, otherwise try API
  if (window.STUDENTS_DATA && Array.isArray(window.STUDENTS_DATA)) {
    STUDENTS = window.STUDENTS_DATA;
  } else {
    const st = await apiGet("students");
    if (st && st.ok && Array.isArray(st.students)) STUDENTS = st.students;
  }

  CLASSES = Array.from(new Set(STUDENTS.map((s) => s.className || s.class || "").filter(Boolean))).sort();

  renderClassSelect();
  bindControls();

  // initial load
  await loadAttendance();
  renderStudents();
  await updateStats();
});

function renderClassSelect() {
  const classSel = qs("#classSelect");
  if (!classSel) return;

  classSel.innerHTML =
    `<option value="">—</option>` +
    CLASSES.map((c) => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join("");

  if (!CURRENT_CLASS && CLASSES.length) CURRENT_CLASS = CLASSES[0];
  classSel.value = CURRENT_CLASS;

  classSel.addEventListener("change", async () => {
    CURRENT_CLASS = classSel.value;
    localStorage.setItem("currentClass", CURRENT_CLASS);
    await loadAttendance();
    renderStudents();
    await updateStats();
  });
}

function bindControls() {
  const dateInput = qs("#dateInput");
  if (dateInput) {
    dateInput.addEventListener("change", async () => {
      CURRENT_DATE = dateInput.value || todayISO();
      localStorage.setItem("currentDate", CURRENT_DATE);
      await loadAttendance();
      renderStudents();
      await updateStats();
    });
  }

  const searchInput = qs("#searchInput");
  if (searchInput) {
    searchInput.addEventListener(
      "input",
      debounce(() => {
        renderStudents();
      }, 150)
    );
  }

  const saveBtn = qs("#saveBtn");
  if (saveBtn) {
    saveBtn.addEventListener("click", async () => {
      await saveAttendance();
    });
  }

  const applyBtn = qs("#applyFilterBtn");
  if (applyBtn) {
    applyBtn.addEventListener("click", async () => {
      await updateStats();
    });
  }

  const resetBtn = qs("#resetFilterBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", async () => {
      const from = qs("#fromDate");
      const to = qs("#toDate");
      if (from) from.value = "";
      if (to) to.value = "";
      await updateStats();
    });
  }

  const exportBtn = qs("#exportBtn");
  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      exportCsv();
    });
  }
}

// ============================
// ATTENDANCE LOAD/SAVE
// ============================
async function loadAttendance() {
  if (!CURRENT_CLASS) return;

  const r = await apiGet("attendance_get", { className: CURRENT_CLASS, date: CURRENT_DATE });
  if (r && r.ok && r.data) {
    ATT = r.data;
  } else {
    ATT = {}; // empty
  }
}

async function saveAttendance() {
  if (__isSavingAttendance) return;
  if (!CURRENT_CLASS) return;

  __isSavingAttendance = true;
  setSaveState("saving");

  try {
    // payload: {className, date, lesson, items:[{studentId,status}]}
    const items = Object.entries(ATT).map(([studentId, status]) => ({
      studentId,
      status,
    }));

    const r = await apiPost("attendance_set", {
      className: CURRENT_CLASS,
      date: CURRENT_DATE,
      lesson: CURRENT_LESSON,
      items,
    });

    if (r && r.ok) {
      setSaveState("ok");
      // refresh stats after save
      await updateStats();
    } else {
      setSaveState("err", (r && r.error) || "save failed");
    }
  } catch (e) {
    setSaveState("err", String(e));
  } finally {
    __isSavingAttendance = false;
    setTimeout(() => setSaveState("idle"), 1200);
  }
}

function setSaveState(state, msg = "") {
  const saveBtn = qs("#saveBtn");
  const saveHint = qs("#saveHint");
  if (saveBtn) {
    if (state === "saving") saveBtn.textContent = t("saving");
    else saveBtn.textContent = t("save");
    saveBtn.disabled = state === "saving";
  }
  if (saveHint) {
    if (state === "ok") saveHint.textContent = t("savedOk");
    else if (state === "err") saveHint.textContent = `${t("savedErr")}: ${msg}`;
    else if (state === "saving") saveHint.textContent = "";
    else saveHint.textContent = "";
  }
}

// ============================
// RENDER STUDENTS TABLE
// ============================
function renderStudents() {
  const tbody = qs("#studentsTbody");
  if (!tbody) return;

  const search = (qs("#searchInput")?.value || "").trim().toLowerCase();

  const list = STUDENTS.filter((s) => {
    const c = s.className || s.class || "";
    if (CURRENT_CLASS && c !== CURRENT_CLASS) return false;
    if (!search) return true;
    const fio = `${s.lastName || ""} ${s.firstName || ""} ${s.middleName || ""}`.toLowerCase();
    return fio.includes(search);
  });

  tbody.innerHTML = list
    .map((s, idx) => {
      const id = String(s.id || s.studentId || s.iin || `${s.lastName}_${s.firstName}_${idx}`);
      const fio = `${s.lastName || ""} ${s.firstName || ""} ${s.middleName || ""}`.trim();
      const currentStatus = ATT[id] || "katysty";

      return `
        <tr>
          <td>${idx + 1}</td>
          <td>${escapeHtml(fio)}</td>
          <td>
            <select class="statusSel" data-student-id="${escapeHtml(id)}">
              ${Object.keys(STATUS)
                .map((k) => {
                  const label = STATUS[k][LANG] || k;
                  return `<option value="${k}" ${k === currentStatus ? "selected" : ""}>${escapeHtml(
                    label
                  )}</option>`;
                })
                .join("")}
            </select>
          </td>
        </tr>
      `;
    })
    .join("");

  // bind selects
  qsa(".statusSel", tbody).forEach((sel) => {
    sel.addEventListener("change", () => {
      const id = sel.getAttribute("data-student-id");
      ATT[id] = sel.value;
    });
  });
}

// ============================
// REPORT / STATS
// ============================
function eachDateISO(fromISO, toISO) {
  const res = [];
  const start = new Date(fromISO + "T00:00:00");
  const end = new Date(toISO + "T00:00:00");
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    res.push(d.toISOString().slice(0, 10));
  }
  return res;
}

async function updateStats() {
  const fromInput = qs("#fromDate");
  const toInput = qs("#toDate");

  const fromISO = (fromInput && fromInput.value) || CURRENT_DATE;
  const toISO = (toInput && toInput.value) || CURRENT_DATE;

  // диапазон дұрыс болмаса — ауыстырып қоямыз
  const a = new Date(fromISO);
  const b = new Date(toISO);
  let from = fromISO,
    to = toISO;
  if (a > b) {
    from = toISO;
    to = fromISO;
    if (fromInput) fromInput.value = from;
    if (toInput) toInput.value = to;
  }

  // 1) серверден report аламыз
  const report = await apiGet("report", { className: CURRENT_CLASS, from, to });

  if (!report || !report.ok) {
    renderTotals(null);
    renderTop([]);
    return;
  }

  // report.data: { totals: {...}, perStudent: [{studentId,fio,counts:{...}}] }
  renderTotals(report.data && report.data.totals ? report.data.totals : null);

  const perStudent = (report.data && report.data.perStudent) || [];
  // TOP by unexcused + excused + sick (exclude present)
  const sorted = perStudent
    .map((x) => {
      const c = x.counts || {};
      const miss =
        (c.sebsez || 0) + (c.sebep || 0) + (c.auyrdy || 0) + (c.keshikti || 0);
      return { ...x, miss };
    })
    .sort((x, y) => y.miss - x.miss)
    .slice(0, 10);

  renderTop(sorted);
}

function renderTotals(totals) {
  const box = qs("#totalsBox");
  if (!box) return;

  if (!totals) {
    box.innerHTML = `<div class="muted">—</div>`;
    return;
  }

  // totals keys: katysty, auyrdy, sebep, sebsez, keshikti
  const rows = Object.keys(STATUS).map((k) => {
    const label = STATUS[k][LANG];
    const val = totals[k] || 0;
    return `<div class="totRow"><span>${escapeHtml(label)}</span><b>${val}</b></div>`;
  });

  box.innerHTML = rows.join("");
}

function renderTop(list) {
  const box = qs("#topBox");
  if (!box) return;

  if (!list || !list.length) {
    box.innerHTML = `<div class="muted">—</div>`;
    return;
  }

  box.innerHTML = `
    <table class="miniTable">
      <thead>
        <tr>
          <th>#</th>
          <th>Оқушы</th>
          <th>Пропуск</th>
        </tr>
      </thead>
      <tbody>
        ${list
          .map((x, i) => {
            const fio = x.fio || x.name || x.studentName || x.studentId;
            return `
              <tr>
                <td>${i + 1}</td>
                <td>${escapeHtml(fio || "")}</td>
                <td><b>${x.miss || 0}</b></td>
              </tr>
            `;
          })
          .join("")}
      </tbody>
    </table>
  `;
}

// ============================
// EXPORT CSV
// ============================
function exportCsv() {
  const from = qs("#fromDate")?.value || CURRENT_DATE;
  const to = qs("#toDate")?.value || CURRENT_DATE;

  const url = new URL(API_BASE);
  url.searchParams.set("action", "report_csv");
  url.searchParams.set("className", CURRENT_CLASS);
  url.searchParams.set("from", from);
  url.searchParams.set("to", to);

  // open download
  window.open(url.toString(), "_blank");
}
