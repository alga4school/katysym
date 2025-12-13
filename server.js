const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');

const app = express();
const db = new Database('school.db');

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // frontend осы папкадан келеді

// ---------------------
// БАЗА ҚҰРЫЛЫМЫ
// ---------------------
db.prepare(`
  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    grade INTEGER NOT NULL,
    class_letter TEXT NOT NULL
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    date TEXT NOT NULL,               -- '2025-09-01' форматында
    status TEXT NOT NULL,             -- katysty | keshikti | sebep | sebsez | auyrdy
    comment TEXT,
    FOREIGN KEY (student_id) REFERENCES students(id)
  )
`).run();

// Фильтр көмекші функциялары
function buildDateFilter(filters) {
  let where = 'WHERE a.date BETWEEN ? AND ?';
  const params = [filters.dateFrom, filters.dateTo];

  if (filters.grade) {
    where += ' AND s.grade = ?';
    params.push(Number(filters.grade));
  }
  if (filters.classLetter) {
    where += ' AND s.class_letter = ?';
    params.push(filters.classLetter);
  }

  return { where, params };
}

function buildStatusFilter(status, filters) {
  let where = 'WHERE a.status = ? AND a.date BETWEEN ? AND ?';
  const params = [status, filters.dateFrom, filters.dateTo];

  if (filters.grade) {
    where += ' AND s.grade = ?';
    params.push(Number(filters.grade));
  }
  if (filters.classLetter) {
    where += ' AND s.class_letter = ?';
    params.push(filters.classLetter);
  }

  return { where, params };
}

// ---------------------
// API: /api/dashboard
// ---------------------
app.get('/api/dashboard', (req, res) => {
  const filters = {
    dateFrom: req.query.from || '2000-01-01',
    dateTo: req.query.to || '2100-01-01',
    grade: req.query.grade || null,
    classLetter: req.query.class_letter || null,
  };

  try {
    // ---- SUMMARY ----
    const df = buildDateFilter(filters);

    const totalDaysRow = db
      .prepare(
        `SELECT COUNT(*) AS c
         FROM attendance a
         JOIN students s ON s.id = a.student_id
         ${df.where}`
      )
      .get(df.params);

    const totalPresentRow = db
      .prepare(
        `SELECT COUNT(*) AS c
         FROM attendance a
         JOIN students s ON s.id = a.student_id
         ${buildStatusFilter('katysty', filters).where}`
      )
      .get(buildStatusFilter('katysty', filters).params);

    const totalLateRow = db
      .prepare(
        `SELECT COUNT(*) AS c
         FROM attendance a
         JOIN students s ON s.id = a.student_id
         ${buildStatusFilter('keshikti', filters).where}`
      )
      .get(buildStatusFilter('keshikti', filters).params);

    const totalUnexcusedRow = db
      .prepare(
        `SELECT COUNT(*) AS c
         FROM attendance a
         JOIN students s ON s.id = a.student_id
         ${buildStatusFilter('sebsez', filters).where}`
      )
      .get(buildStatusFilter('sebsez', filters).params);

    const summary = {
      total_days: totalDaysRow.c || 0,
      present: totalPresentRow.c || 0,
      late: totalLateRow.c || 0,
      unexcused: totalUnexcusedRow.c || 0,
      attendance_percent:
        totalDaysRow.c > 0
          ? Math.round(((totalPresentRow.c || 0) / totalDaysRow.c) * 100)
          : 0,
    };

    // ---- TOP-10 КЕШІККЕНДЕР ----
    const lf = buildStatusFilter('keshikti', filters);
    const topLate = db
      .prepare(
        `SELECT
           s.full_name,
           s.grade,
           s.class_letter,
           COUNT(*) AS late_count
         FROM attendance a
         JOIN students s ON s.id = a.student_id
         ${lf.where}
         GROUP BY s.id, s.full_name, s.grade, s.class_letter
         ORDER BY late_count DESC
         LIMIT 10`
      )
      .all(lf.params);

    // ---- TOP-10 СЕБЕПСІЗ ҚАЛҒАНДАР ----
    const uf = buildStatusFilter('sebsez', filters);
    const topUnexcused = db
      .prepare(
        `SELECT
           s.full_name,
           s.grade,
           s.class_letter,
           COUNT(*) AS unexcused_count
         FROM attendance a
         JOIN students s ON s.id = a.student_id
         ${uf.where}
         GROUP BY s.id, s.full_name, s.grade, s.class_letter
         ORDER BY unexcused_count DESC
         LIMIT 10`
      )
      .all(uf.params);

    // ---- КЛАСС БОЙЫНША КЕШІГУ РЕЙТИНГІ ----
    const lateByStudent = db
      .prepare(
        `SELECT
           s.grade,
           s.class_letter,
           s.full_name,
           COUNT(*) AS late_count
         FROM attendance a
         JOIN students s ON s.id = a.student_id
         ${lf.where}
         GROUP BY s.id, s.full_name, s.grade, s.class_letter
         ORDER BY s.grade, s.class_letter, late_count DESC`
      )
      .all(lf.params);

    // ---- КЛАСС БОЙЫНША СЕБЕПСІЗ ҚАЛУ РЕЙТИНГІ ----
    const unexcusedByStudent = db
      .prepare(
        `SELECT
           s.grade,
           s.class_letter,
           s.full_name,
           COUNT(*) AS unexcused_count
         FROM attendance a
         JOIN students s ON s.id = a.student_id
         ${uf.where}
         GROUP BY s.id, s.full_name, s.grade, s.class_letter
         ORDER BY s.grade, s.class_letter, unexcused_count DESC`
      )
      .all(uf.params);

    res.json({
      summary,
      topLate,
      topUnexcused,
      lateByStudent,
      unexcusedByStudent,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ---------------------
// СЕРВЕРДІ ІСКЕ ҚОСУ
// ---------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
