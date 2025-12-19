// ============================
// CONFIG
// ============================
const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbyYyTrObA51WeYAo2yumSRZxu0ZH17IpMjrTeeEBBDJ3qhUv0ZKXwHD12JWHyed9he7Cg/exec";

// Статус мәтіндері
const STATUS = {
  katysty: { kk: "Қатысты", ru: "Присутствовал(а)" },
  auyrdy:  { kk: "Ауырды",  ru: "Болел(а)" },
  sebep:   { kk: "Себепті", ru: "Отсутствовал(а) по уважительной причине" },
  sebsez:  { kk: "Себепсіз",ru: "Отсутствовал(а) без уважительной причины" },
  keshikti:{ kk: "Кешікті", ru: "Опоздал(а)" },
};

const I18N = {
  kk: {
    bannerTitle: "Сабаққа қатысу журналы",
    bannerSubtitle: "Оқушылардың сабаққа қатысуын есепке алудың автоматтандырылған жүйесі.",
    btnAttendance: "Күнделікті бақылау",
    btnAttendanceSub: "Күн сайын белгілеу",
    btnReports: "Есептер",
    btnReportsSub: "Күн / апта / ай",
    backHome: "Басты бет",

    attendanceTitle: "Күнделікті бақылау",
    reportsTitle: "Есептер мен статистика",

    dateLabel: "Күні",
    classLabel: "Сынып",
    searchLabel: "Іздеу",
    saveBtn: "Сақтау",
    showBtn: "Көрсету",

    colStudent: "Оқушы",
    colClass: "Сынып",
    colStatus: "Белгі",

    attendanceHint: "Ескерту: барлығы әдепкіде «Қатысты». Тек қажет болса ғана «Ауырды / Себепті / Себепсіз / Кешікті» таңдаңыз.",

    periodLabel: "Кезең",
    periodDay: "Күн",
    periodWeek: "Апта",
    periodMonth: "Ай",
    periodCustom: "Кез келген",
    customRange: "Аралығы",

    late: "Кешіккендер",
    sick: "Ауырғандар",
    excused: "Себепті",
    unexcused: "Себепсіз",
    topLate: "Көп кешіккендер",
    topUnexcused: "Көп себепсіз",

    needDate: "Күнді таңдаңыз",
    needClass: "Сыныпты таңдаңыз",
    needPeriod: "Кезеңді таңдаңыз",
    noStudents: "Оқушылар тізімі бос. Google Sheet students толтырылғанын тексеріңіз.",

    saveOk: "✅ Сақталды:",
    saveErr: "❌ Қате:",
    alreadySaved: "✅ Бұл сынып бұл күні бұрын сақталған"
  },
  ru: {
    bannerTitle: "Журнал посещаемости",
    bannerSubtitle: "Автоматизированная система учета посещаемости учащихся.",
    btnAttendance: "Ежедневный контроль",
    btnAttendanceSub: "Отметки по дням",
    btnReports: "Отчеты",
    btnReportsSub: "День / неделя / месяц",
    backHome: "Главная",

    attendanceTitle: "Ежедневный контроль",
    reportsTitle: "Отчеты и статистика",

    dateLabel: "Дата",
    classLabel: "Класс",
    searchLabel: "Поиск",
    saveBtn: "Сохранить",
    showBtn: "Показать",

    colStudent: "Ученик",
    colClass: "Класс",
    colStatus: "Статус",

    attendanceHint: "Примечание: по умолчанию «Присутствовал(а)». Выбирайте «Болел/Уважит./Без уважит./Опоздал» только при необходимости.",

    periodLabel: "Период",
    periodDay: "День",
    periodWeek: "Неделя",
    periodMonth: "Месяц",
    periodCustom: "Произвольно",
    customRange: "Диапазон",

    late: "Опоздавшие",
    sick: "Болели",
    excused: "По уважительной",
    unexcused: "Без уважительной",
    topLate: "Часто опаздывают",
    topUnexcused: "Часто без уважительной",

    needDate: "Выберите дату",
    needClass: "Выберите класс",
    needPeriod: "Выберите период",
    noStudents: "Список учеников пуст. Проверьте лист students в Google Sheet.",

    saveOk: "✅ Сохранено:",
    saveErr: "❌ Ошибка:",
    alreadySaved: "✅ Этот класс за этот день уже сохранён"
  }
};

// ============================
// STATE
// ============================
let currentLang = localStorage.getItem("lang") || "kk";
let allStudents = [];
const statusMap = new Map(); // student_id -> status_code
let __lastReport = null;
let __saving = false;

// ============================
// HELPERS
// ============================
function t(key){
  return (I18N[currentLang] && I18N[currentLang][key]) || (I18N.kk[key] || key);
}

function showView(id){
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  document.getElementById(id)?.classList.add("active");
}

function parseClass(cls){
  const m = String(cls || "").trim().match(/^(\d+)(.*)$/);
  return { grade: m ? m[1] : "", letter: (m ? m[2] : "").trim() };
}

function statusLabel(code){
  const s = STATUS[code] || STATUS.katysty;
  return currentLang === "ru" ? s.ru : s.kk;
}

function setLang(lang){
  currentLang = (lang === "ru" ? "ru" : "kk");
  localStorage.setItem("lang", currentLang);
  document.body.dataset.lang = currentLang;
  applyI18n();
  renderAttendanceTable();
}

function applyI18n(){
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    el.textContent = t(key);
  });

  const search = document.getElementById("searchInput");
  if (search) search.placeholder = currentLang === "ru" ? "Поиск по ФИО..." : "Оқушының аты-жөні бойынша іздеу";
}

async function apiGet(action, params = {}){
  const url = new URL(WEBAPP_URL);
  url.searchParams.set("action", action);
  Object.entries(params).forEach(([k,v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString(), { method:"GET" });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = { ok:false, error:text }; }
  if (!res.ok || data.ok === false) throw new Error(data.error || ("HTTP " + res.status));
  return data;
}

async function apiPost(payload){
  const res = await fetch(WEBAPP_URL, {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify(payload)
  });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = { ok:false, error:text }; }
  if (!res.ok || data.ok === false) throw new Error(data.error || ("HTTP " + res.status));
  return data;
}

// ============================
// UI RENDER
// ============================
function renderClassesTo(selectEl, classList, includeAll){
  if (!selectEl) return;
  selectEl.innerHTML = "";
  if (includeAll){
    const opt = document.createElement("option");
    opt.value = "ALL";
    opt.textContent = currentLang === "ru" ? "ВСЕ" : "БАРЛЫҒЫ";
    selectEl.appendChild(opt);
  }

  (classList || []).forEach(c => {
    const opt = document.createElement("option");
    const val = `${c.grade}${c.class_letter}`.replace(/\s+/g,"");
    opt.value = val;
    opt.textContent = val;
    selectEl.appendChild(opt);
  });
}

function getFilteredStudents(){
  const cls = document.getElementById("classSelect")?.value;
  if (!cls) return [];
  const p = parseClass(cls);
  const g = String(p.grade);
  const l = String(p.letter).replace(/\s+/g,"").toUpperCase();

  return allStudents.filter(s => {
    const sg = String(s.grade);
    const sl = String(s.class_letter).replace(/\s+/g,"").toUpperCase();
    return sg === g && sl === l;
  });
}

function renderAttendanceTable(){
  const tbody = document.querySelector("#attendanceTable tbody");
  if (!tbody) return;

  const search = (document.getElementById("searchInput")?.value || "").trim().toLowerCase();

  const students = getFilteredStudents().filter(s => {
    if (!search) return true;
    return String(s.full_name || "").toLowerCase().includes(search);
  });

  tbody.innerHTML = "";

  students.forEach((s, idx) => {
    const tr = document.createElement("tr");

    const tdN = document.createElement("td");
    tdN.textContent = String(idx+1);

    const tdName = document.createElement("td");
    tdName.textContent = s.full_name;

    const tdClass = document.createElement("td");
    tdClass.textContent = `${s.grade}${s.class_letter}`;

    const tdStatus = document.createElement("td");
    const sel = document.createElement("select");
    sel.dataset.sid = String(s.id);

    Object.keys(STATUS).forEach(code => {
      const o = document.createElement("option");
      o.value = code;
      o.textContent = statusLabel(code);
      sel.appendChild(o);
    });

    const saved = statusMap.get(String(s.id)) || "katysty";
    sel.value = saved;

    sel.addEventListener("change", () => {
      statusMap.set(String(s.id), sel.value);
    });

    tdStatus.appendChild(sel);

    tr.appendChild(tdN);
    tr.appendChild(tdName);
    tr.appendChild(tdClass);
    tr.appendChild(tdStatus);
    tbody.appendChild(tr);
  });
}

// ============================
// ATTENDANCE SAVE
// ============================
async function saveAttendance(){
  if (__saving) return;

  const btn = document.getElementById("saveAttendanceBtn");
  const saveStatus = document.getElementById("saveStatus");
  const date = document.getElementById("attendanceDate")?.value;
  const cls = document.getElementById("classSelect")?.value;

  if (!date) return alert(t("needDate"));
  if (!cls) return alert(t("needClass"));

  const p = parseClass(cls);
  const grade = String(p.grade);
  const letter = String(p.letter);

  // localStorage guard (қайта сақтауды фронтта тоқтату)
  const guardKey = `att_saved:${date}:${grade}:${letter}`;
  if (localStorage.getItem(guardKey) === "1") {
    saveStatus.textContent = t("alreadySaved");
    return;
  }

  const students = getFilteredStudents();
  if (!students.length) return alert(t("noStudents"));

  __saving = true;
  if (btn) btn.disabled = true;
  saveStatus.textContent = "⏳ ...";

  try{
    const records = students.map(s => ({
      student_id: s.id,
      status_code: statusMap.get(String(s.id)) || "katysty",
    }));

    const res = await apiPost({
      action: "save",
      date,
      grade,
      class_letter: letter,
      records
    });

    localStorage.setItem(guardKey, "1");
    saveStatus.textContent = `${t("saveOk")} ${res.saved || records.length}`;

  }catch(e){
    saveStatus.textContent = `${t("saveErr")} ${e.message}`;
  }finally{
    __saving = false;
    if (btn) btn.disabled = false;
  }
}

// ============================
// REPORTS
// ============================
function getRangeFromPeriod(){
  const type = document.getElementById("periodType")?.value || "day";
  const today = new Date();
  const isoToday = today.toISOString().slice(0,10);

  if (type === "day"){
    return { from: isoToday, to: isoToday };
  }

  if (type === "week"){
    const d = new Date(today);
    const day = d.getDay(); // 0..6
    const diff = (day === 0 ? 6 : day-1); // Monday start
    d.setDate(d.getDate() - diff);
    const from = d.toISOString().slice(0,10);
    const e = new Date(d);
    e.setDate(e.getDate() + 6);
    const to = e.toISOString().slice(0,10);
    return { from, to };
  }

  if (type === "month"){
    const d = new Date(today.getFullYear(), today.getMonth(), 1);
    const e = new Date(today.getFullYear(), today.getMonth()+1, 0);
    return { from: d.toISOString().slice(0,10), to: e.toISOString().slice(0,10) };
  }

  if (type === "custom"){
    const s = document.getElementById("customStart")?.value;
    const e = document.getElementById("customEnd")?.value;
    if (!s || !e) return null;
    return { from: s, to: e };
  }

  return { from: isoToday, to: isoToday };
}

function sumFromDaily(daily){
  let late=0, sick=0, exc=0, unexc=0;
  Object.values(daily || {}).forEach(st => {
    const code = st?.status_code || "katysty";
    if (code === "keshikti") late++;
    if (code === "auyrdy") sick++;
    if (code === "sebep") exc++;
    if (code === "sebsez") unexc++;
  });
  return { late, sick, excused: exc, unexcused: unexc };
}

function buildTopFromDaily(report, codeNeed, limit=5){
  const byId = new Map(); // id -> count
  Object.values(report.daily || {}).forEach(dayObj => {
    Object.entries(dayObj || {}).forEach(([sid, st]) => {
      const code = st?.status_code || "katysty";
      if (code === codeNeed){
        byId.set(sid, (byId.get(sid) || 0) + 1);
      }
    });
  });

  const idToName = new Map((report.students || []).map(s => [String(s.id), s.full_name]));
  const items = [...byId.entries()]
    .map(([sid, count]) => ({ sid, name: idToName.get(String(sid)) || sid, count }))
    .sort((a,b) => b.count - a.count)
    .slice(0, limit);

  return items;
}

function renderTop(listEl, items){
  if (!listEl) return;
  listEl.innerHTML = "";
  if (!items.length){
    listEl.innerHTML = `<div class="hint">${currentLang==="ru"?"Нет данных":"Дерек жоқ"}</div>`;
    return;
  }
  items.forEach(it => {
    const div = document.createElement("div");
    div.className = "top-item";
    div.innerHTML = `<div class="top-name">${it.name}</div><div class="top-count">${it.count}</div>`;
    listEl.appendChild(div);
  });
}

function downloadCsv(filename, rows){
  const csv = rows.map(r => r.map(v => `"${String(v ?? "").replace(/"/g,'""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type:"text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

async function updateStats(){
  const range = getRangeFromPeriod();
  if (!range) return alert(t("needPeriod"));

  const reportClass = document.getElementById("reportClass")?.value || "ALL";
  let grade="ALL", class_letter="ALL";

  if (reportClass !== "ALL"){
    const p = parseClass(reportClass);
    grade = String(p.grade);
    class_letter = String(p.letter);
  }

  try{
    const report = await apiGet("report", { from: range.from, to: range.to, grade, class_letter });
    __lastReport = { report, range, reportClass };

    // Санақ: барлық күндерді қосып санаймыз
    let total = { late:0, sick:0, excused:0, unexcused:0 };
    Object.values(report.daily || {}).forEach(dayObj => {
      const s = sumFromDaily(dayObj);
      total.late += s.late;
      total.sick += s.sick;
      total.excused += s.excused;
      total.unexcused += s.unexcused;
    });

    document.getElementById("statLate").textContent = total.late;
    document.getElementById("statSick").textContent = total.sick;
    document.getElementById("statExcused").textContent = total.excused;
    document.getElementById("statUnexcused").textContent = total.unexcused;

    renderTop(document.getElementById("topLateList"), buildTopFromDaily(report, "keshikti"));
    renderTop(document.getElementById("topUnexcusedList"), buildTopFromDaily(report, "sebsez"));

    const hint = document.getElementById("reportHint");
    if (hint) hint.textContent = `${range.from} — ${range.to}`;

  }catch(e){
    alert("Отчет қатесі: " + e.message);
  }
}

function exportCsv(){
  if (!__lastReport) return alert(currentLang==="ru" ? "Сначала нажмите «Показать»" : "Алдымен «Көрсету» басыңыз");

  const { report, range, reportClass } = __lastReport;
  const rows = [["date","student","class","status_code","status_kk","status_ru"]];

  // Барлық күндерді жинаймыз
  const wantedDates = Object.keys(report.daily || {});
  wantedDates.sort();

  wantedDates.forEach(dateISO => {
    const dayObj = report.daily?.[dateISO] || {};
    (report.students || []).forEach(s => {
      const st = dayObj[String(s.id)] || null;
      const code = st?.status_code || "katysty";
      rows.push([
        dateISO,
        s.full_name,
        `${s.grade}${s.class_letter}`,
        code,
        STATUS[code]?.kk || "",
        STATUS[code]?.ru || ""
      ]);
    });
  });

  const name = `attendance_${reportClass}_${range.from}_${range.to}.csv`.replace(/\s+/g,"");
  downloadCsv(name, rows);
}

// ============================
// INIT
// ============================
document.addEventListener("DOMContentLoaded", async () => {
  // Buttons
  document.getElementById("goAttendance")?.addEventListener("click", () => showView("viewAttendance"));
  document.getElementById("goReports")?.addEventListener("click", () => showView("viewReports"));
  document.getElementById("backHome1")?.addEventListener("click", () => showView("viewHome"));
  document.getElementById("backHome2")?.addEventListener("click", () => showView("viewHome"));

  document.getElementById("langToggle")?.addEventListener("click", () => {
    setLang(currentLang === "kk" ? "ru" : "kk");
  });

  // Period UI
  document.getElementById("periodType")?.addEventListener("change", () => {
    const type = document.getElementById("periodType").value;
    const custom = document.getElementById("customControl");
    if (custom) custom.style.display = (type === "custom") ? "flex" : "none";
  });

  // Actions
  document.getElementById("saveAttendanceBtn")?.addEventListener("click", saveAttendance);
  document.getElementById("updateStatsBtn")?.addEventListener("click", updateStats);
  document.getElementById("exportCsvBtn")?.addEventListener("click", exportCsv);
  document.getElementById("searchInput")?.addEventListener("input", renderAttendanceTable);

  // Default dates
  const today = new Date().toISOString().slice(0,10);
  document.getElementById("attendanceDate").value = today;
  document.getElementById("customStart").value = today;
  document.getElementById("customEnd").value = today;

  // Load data
  try{
    setLang(currentLang);
    document.body.dataset.lang = currentLang;

    const cls = await apiGet("classes");
    const classList = cls.classes || [];
    renderClassesTo(document.getElementById("classSelect"), classList, false);
    renderClassesTo(document.getElementById("reportClass"), classList, true);

    const st = await apiGet("students");
    allStudents = st.students || [];
    allStudents.forEach(s => statusMap.set(String(s.id), "katysty"));

    document.getElementById("classSelect")?.addEventListener("change", () => {
      allStudents.forEach(s => statusMap.set(String(s.id), "katysty"));
      renderAttendanceTable();
    });

    renderAttendanceTable();
  }catch(e){
    alert("API error: " + e.message);
  }
});
