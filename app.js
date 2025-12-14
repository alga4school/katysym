// ============================
// SETTINGS (ВПИШИТЕ СВОЁ)
// ============================
const WEBAPP_URL = "https://broken-paper-fdf4.alga4school.workers.dev";
const API_KEY = "school2025";
// ============================
// STATUS CONFIG (3 поля)
// ============================
const STATUS = {
  katysty: { kk: "Қатысты", ru: "Присутствовал(а)" }, // DEFAULT
  auyrdy:  { kk: "Ауырды",  ru: "Болел(а)" },
  sebep:   { kk: "Себепті", ru: "Отсутствовал(а) по уважительной причине" },
  sebsez:  { kk: "Себепсіз",ru: "Отсутствовал(а) без уважительной причины" },
  keshikti:{ kk: "Кешікті", ru: "Опоздал(а)" },
};

const EXCEPTIONS = ["auyrdy", "sebep", "sebsez", "keshikti"]; // учитель выбирает только это

// ============================
// I18N
// ============================
let currentLang = document.body.dataset.lang || "kk";

const I18N = {
  kk: {
    saveOk: "✅ Сақталды:",
    saveErr: "❌ Қате:",
    needClass: "Сыныпты таңдаңыз",
    needDate: "Күнді таңдаңыз",
    statusDefault: "✔ Қатысты",
    chooseException: "Тек қажет болса таңдаңыз",
  },
  ru: {
    saveOk: "✅ Сохранено:",
    saveErr: "❌ Ошибка:",
    needClass: "Выберите класс",
    needDate: "Выберите дату",
    statusDefault: "✔ Присутствовал(а)",
    chooseException: "Выбирайте только при необходимости",
  }
};

// ============================
// API HELPERS
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
let allStudents = []; // from sheet
let statusMap = new Map(); // key: student_id -> status_code (default katysty)

// ============================
// UI
// ============================
function setLang(lang) {
  currentLang = lang;
  document.body.dataset.lang = lang;
}

function statusLabel(code) {
  const item = STATUS[code] || STATUS.katysty;
  return currentLang === "ru" ? item.ru : item.kk;
}

function rowClassColor(code) {
  // просто подсветка по смыслу (по желанию можно убрать)
  if (code === "katysty") return "present";
  if (code === "auyrdy") return "sick";
  if (code === "keshikti") return "late";
  if (code === "sebep") return "excused";
  if (code === "sebsez") return "absent";
  return "";
}

function renderClassesTo(selectEl, classList, includeAll = false) {
  selectEl.innerHTML = "";
  if (includeAll) {
    const opt = document.createElement("option");
    opt.value = "ALL";
    opt.textContent = "ALL";
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

function parseClass(cls) {
  // "7Б" => grade="7", letter="Б"
  const grade = String(parseInt(cls, 10));
  const letter = cls.replace(grade, "");
  return { grade, letter };
}

function buildStatusCell(studentId) {
  const wrap = document.createElement("div");
  wrap.className = "status-cell";

  // text
  const text = document.createElement("div");
  text.className = "status-text";
  text.textContent = statusLabel(statusMap.get(studentId) || "katysty");

  // select (only exceptions)
  const sel = document.createElement("select");
  sel.className = "status-select";
  const hint = document.createElement("option");
  hint.value = "";
  hint.textContent = I18N[currentLang].chooseException;
  sel.appendChild(hint);

  EXCEPTIONS.forEach(code => {
    const o = document.createElement("option");
    o.value = code;
    o.textContent = (currentLang === "ru" ? STATUS[code].ru : STATUS[code].kk);
    sel.appendChild(o);
  });

  sel.addEventListener("change", () => {
    const pick = sel.value;
    if (!pick) return;

    statusMap.set(studentId, pick);
    text.textContent = statusLabel(pick);

    // reset selector to hint (чтобы не держать выбранным)
    sel.value = "";
  });

  wrap.appendChild(text);
  wrap.appendChild(sel);
  return wrap;
}

function renderAttendanceTable() {
  const tbody = document.querySelector("#attendanceTable tbody");
  const classSelect = document.getElementById("classSelect");
  const searchInput = document.getElementById("searchInput");

  const selectedClass = classSelect.value;
  const q = (searchInput.value || "").trim().toLowerCase();

  let filtered = allStudents.slice();

  if (selectedClass) {
    const { grade, letter } = parseClass(selectedClass);
    filtered = filtered.filter(s => String(s.grade) === grade && String(s.class_letter) === letter);
  }
  if (q) {
    filtered = filtered.filter(s => String(s.full_name).toLowerCase().includes(q));
  }

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

    const tdStatus = tr.children[3];
    tdStatus.appendChild(buildStatusCell(s.id));

    tbody.appendChild(tr);
  });
}

// ============================
// SAVE (AUTO PRESENT)
// ============================
async function saveAttendance() {
  const dateEl = document.getElementById("attendanceDate");
  const classSelect = document.getElementById("classSelect");
  const saveStatus = document.getElementById("saveStatus");

  const date = dateEl.value;
  const cls = classSelect.value;

  if (!date) return alert(I18N[currentLang].needDate);
  if (!cls) return alert(I18N[currentLang].needClass);

  const { grade, letter } = parseClass(cls);

  // Берём учеников этого класса
  const students = allStudents.filter(s => String(s.grade) === grade && String(s.class_letter) === letter);

  // ВАЖНО: если нет отметки — значит katysty (присутствовал)
  const records = students.map(s => ({
    student_id: s.id,
    status_code: statusMap.get(s.id) || "katysty"
  }));

  saveStatus.textContent = "⏳ ...";

  try {
    const res = await apiPost({
      key: API_KEY,
      date,
      grade,
      class_letter: letter,
      records
    });

    saveStatus.textContent = `${I18N[currentLang].saveOk} ${res.saved}`;
  } catch (e) {
    saveStatus.textContent = `${I18N[currentLang].saveErr} ${e.message}`;
  }
}

// ============================
// REPORT / STATS
// ============================
function getRangeFromPeriod() {
  const type = document.getElementById("periodType").value;
  const today = new Date();

  const toISO = (d) => d.toISOString().slice(0, 10);

  if (type === "all") return { from: "2000-01-01", to: "2100-01-01" };

  if (type === "month") {
    const mi = document.getElementById("monthInput").value; // YYYY-MM
    if (!mi) return null;
    const [y, m] = mi.split("-").map(Number);
    const start = new Date(y, m - 1, 1);
    const end = new Date(y, m, 0);
    return { from: toISO(start), to: toISO(end) };
  }

  if (type === "year") {
    const y = Number(document.getElementById("yearInput").value || today.getFullYear());
    const start = new Date(y, 0, 1);
    const end = new Date(y, 11, 31);
    return { from: toISO(start), to: toISO(end) };
  }

  if (type === "quarter") {
    const q = Number(document.getElementById("quarterInput").value || 1);
    const y = Number(document.getElementById("quarterYearInput").value || today.getFullYear());
    const startMonth = (q - 1) * 3;
    const start = new Date(y, startMonth, 1);
    const end = new Date(y, startMonth + 3, 0);
    return { from: toISO(start), to: toISO(end) };
  }

  if (type === "custom") {
    const s = document.getElementById("customStart").value;
    const e = document.getElementById("customEnd").value;
    if (!s || !e) return null;
    return { from: s, to: e };
  }

  return null;
}

function sumTotals(report) {
  const totals = {
    total: 0,
    katysty: 0,
    keshikti: 0,
    sebep: 0,
    sebsez: 0,
    auyrdy: 0,
  };

  // report.totals: { studentId: { katysty: n, ... } }
  Object.values(report.totals || {}).forEach(t => {
    Object.keys(totals).forEach(k => {
      if (k === "total") return;
      totals[k] += Number(t[k] || 0);
      totals.total += Number(t[k] || 0);
    });
  });

  return totals;
}

function buildTop(report, code, limit = 10) {
  const arr = report.students.map(s => ({
    name: s.full_name,
    cls: `${s.grade}${s.class_letter}`,
    count: Number(report.totals?.[s.id]?.[code] || 0)
  })).filter(x => x.count > 0);

  arr.sort((a, b) => b.count - a.count);
  return arr.slice(0, limit);
}

function fillTable(tableId, rows) {
  const tbody = document.querySelector(`#${tableId} tbody`);
  tbody.innerHTML = "";
  rows.forEach((r, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${i + 1}</td><td>${r.name}</td><td>${r.cls}</td><td>${r.count}</td>`;
    tbody.appendChild(tr);
  });
}

async function updateStats() {
  const range = getRangeFromPeriod();
  if (!range) return alert(currentLang === "ru" ? "Укажите период" : "Кезеңді таңдаңыз");

  const reportClass = document.getElementById("reportClass").value || "ALL";
  let grade = "ALL", class_letter = "ALL";
  if (reportClass !== "ALL") {
    const p = parseClass(reportClass);
    grade = p.grade;
    class_letter = p.letter;
  }

  const report = await apiGet("report", {
    from: range.from,
    to: range.to,
    grade,
    class_letter
  });

  const t = sumTotals(report);

  document.getElementById("totalLessons").textContent = t.total;
  document.getElementById("totalPresent").textContent = t.katysty;
  document.getElementById("totalLate").textContent = t.keshikti;
  document.getElementById("totalSick").textContent = t.auyrdy;
  document.getElementById("totalExcused").textContent = t.sebep;
  document.getElementById("totalUnexcused").textContent = t.sebsez;

  fillTable("topLateTable", buildTop(report, "keshikti"));
  fillTable("topUnexcusedTable", buildTop(report, "sebsez"));
}

function exportCsv() {
  const range = getRangeFromPeriod();
  if (!range) return alert(currentLang === "ru" ? "Укажите период" : "Кезеңді таңдаңыз");

  const reportClass = document.getElementById("reportClass").value || "ALL";
  let grade = "ALL", class_letter = "ALL";
  if (reportClass !== "ALL") {
    const p = parseClass(reportClass);
    grade = p.grade;
    class_letter = p.letter;
  }

  apiGet("report", { from: range.from, to: range.to, grade, class_letter })
    .then(report => {
      const header = ["date","student","class","status_code","status_kk","status_ru"];
      const rows = [];

      Object.entries(report.daily || {}).forEach(([date, map]) => {
        Object.entries(map).forEach(([sid, st]) => {
          const s = report.students.find(x => x.id === sid);
          rows.push([
            date,
            s ? s.full_name : sid,
            s ? `${s.grade}${s.class_letter}` : "",
            st.status_code,
            st.status_kk,
            st.status_ru
          ]);
        });
      });

      const csv = [header, ...rows]
        .map(r => r.map(x => {
          const v = String(x ?? "");
          return (v.includes(",") || v.includes('"') || v.includes("\n"))
            ? `"${v.replace(/"/g,'""')}"`
            : v;
        }).join(","))
        .join("\n");

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "attendance_report.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    })
    .catch(err => alert(err.message));
}

// ============================
// INIT
// ============================
document.addEventListener("DOMContentLoaded", async () => {
  const langToggle = document.getElementById("langToggle");
  const classSelect = document.getElementById("classSelect");
  const attendanceDate = document.getElementById("attendanceDate");
  const searchInput = document.getElementById("searchInput");
  const saveBtn = document.getElementById("saveAttendanceBtn");

  const updateStatsBtn = document.getElementById("updateStatsBtn");
  const exportCsvBtn = document.getElementById("exportCsvBtn");

  const reportClass = document.getElementById("reportClass");

  // today
  const today = new Date();
  attendanceDate.value = today.toISOString().slice(0, 10);
  document.getElementById("yearInput").value = today.getFullYear();
  document.getElementById("quarterYearInput").value = today.getFullYear();

  // language toggle
  langToggle.addEventListener("click", () => {
    setLang(currentLang === "kk" ? "ru" : "kk");
    renderAttendanceTable();
  });

  // load classes + students from SHEET via API
  try {
    const cls = await apiGet("classes");
    renderClassesTo(classSelect, cls.classes, false);
    renderClassesTo(reportClass, cls.classes, true);

    const st = await apiGet("students");
    allStudents = st.students;

    // default присутствовал всем
    allStudents.forEach(s => statusMap.set(s.id, "katysty"));

    renderAttendanceTable();
  } catch (e) {
    alert("API error: " + e.message);
  }

  classSelect.addEventListener("change", () => {
    // при смене класса: сбросить статусы на default для чистоты
    allStudents.forEach(s => statusMap.set(s.id, "katysty"));
    renderAttendanceTable();
  });

  searchInput.addEventListener("input", renderAttendanceTable);
  saveBtn.addEventListener("click", saveAttendance);

  updateStatsBtn.addEventListener("click", updateStats);
  exportCsvBtn.addEventListener("click", exportCsv);

  // период-controls show/hide
  document.getElementById("periodType").addEventListener("change", () => {
    const type = document.getElementById("periodType").value;
    ["monthControl","quarterControl","yearControl","customControl"].forEach(id => {
      document.getElementById(id).style.display = "none";
    });
    if (type === "month") document.getElementById("monthControl").style.display = "flex";
    if (type === "quarter") document.getElementById("quarterControl").style.display = "flex";
    if (type === "year") document.getElementById("yearControl").style.display = "flex";
    if (type === "custom") document.getElementById("customControl").style.display = "flex";
  });
});

