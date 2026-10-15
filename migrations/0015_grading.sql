-- AI grading and server-written credit (docs/ai-grading.md, section 6).
--
-- The server becomes the grader of record for written work. These tables hold
-- the answer keys the pages no longer carry, every attempt, every graded
-- answer, the fill-in decisions that can be reused, the faculty's rulings,
-- appeals, the calibration marks, the pending queue and the model usage.
--
-- Nothing here is student data until a student answers: grading_keys,
-- grade_cache, grade_overrides and ai_usage hold none.

CREATE TABLE IF NOT EXISTS grading_keys (
  qid            TEXT PRIMARY KEY,
  kind           TEXT NOT NULL,                -- mc | fill | sa | meta
  source         TEXT NOT NULL,                -- unit | textbook | reading | single
  data_json      TEXT NOT NULL,                -- {prompt:{en,es,fr}, answer, accept, options?, why?, model, keywords, rubric}
  rubric_version INTEGER,
  content_hash   TEXT NOT NULL,
  updated_at     TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS attempts (
  id            TEXT PRIMARY KEY,
  student_id    TEXT NOT NULL,
  scope         TEXT NOT NULL,                 -- 'u:CTSJohn/1', 'tb:john', ...
  track         TEXT NOT NULL,
  lang          TEXT NOT NULL,
  shadow        INTEGER NOT NULL DEFAULT 0,
  status        TEXT NOT NULL DEFAULT 'open',  -- open | pending | passed | failed
  mc_right      INTEGER, mc_total INTEGER,
  fill_right    INTEGER, fill_total INTEGER,
  sa_met        INTEGER, sa_total INTEGER,
  locked_until  TEXT,
  lock_kind     TEXT,                          -- full | sa
  started_at    TEXT NOT NULL,
  submitted_at  TEXT,
  graded_at     TEXT,
  client_result TEXT                            -- shadow only: what the browser's own grader decided (JSON)
);
CREATE INDEX IF NOT EXISTS attempts_student ON attempts(student_id, scope);

CREATE TABLE IF NOT EXISTS answer_grades (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  attempt_id     TEXT NOT NULL,
  student_id     TEXT NOT NULL,
  qid            TEXT NOT NULL,
  kind           TEXT NOT NULL,
  lang           TEXT NOT NULL,
  answer_text    TEXT NOT NULL,
  verdict        TEXT NOT NULL,                -- right|wrong (mc, fill) · met|partly|not_met (sa) · pending
  feedback       TEXT,
  points_json    TEXT,
  graded_by      TEXT NOT NULL,                -- exact|cache|override|rule|ai|human
  model          TEXT,
  prompt_version TEXT,
  rubric_version INTEGER,
  grader_email   TEXT,
  created_at     TEXT NOT NULL,
  graded_at      TEXT
);
CREATE INDEX IF NOT EXISTS answer_grades_attempt ON answer_grades(attempt_id);
CREATE INDEX IF NOT EXISTS answer_grades_student_qid ON answer_grades(student_id, qid);
-- One grade per question per attempt: the first answer stands, and two requests
-- at once cannot count a question twice.
CREATE UNIQUE INDEX IF NOT EXISTS answer_grades_attempt_qid ON answer_grades(attempt_id, qid);

CREATE TABLE IF NOT EXISTS grade_cache (
  qid            TEXT NOT NULL,
  lang           TEXT NOT NULL,
  norm_answer    TEXT NOT NULL,
  verdict        TEXT NOT NULL,
  feedback       TEXT,
  model          TEXT,
  prompt_version TEXT,
  seen_count     INTEGER NOT NULL DEFAULT 1,
  first_seen     TEXT NOT NULL,
  last_seen      TEXT NOT NULL,
  PRIMARY KEY (qid, lang, norm_answer)
);

CREATE TABLE IF NOT EXISTS grade_overrides (
  qid         TEXT NOT NULL,
  lang        TEXT NOT NULL,
  norm_answer TEXT NOT NULL,
  verdict     TEXT NOT NULL,
  decided_by  TEXT NOT NULL,
  decided_at  TEXT NOT NULL,
  note        TEXT,
  PRIMARY KEY (qid, lang, norm_answer)
);

CREATE TABLE IF NOT EXISTS appeals (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  grade_id    INTEGER NOT NULL,
  student_id  TEXT NOT NULL,
  note        TEXT,
  status      TEXT NOT NULL DEFAULT 'open',    -- open | upheld | overturned
  claimed_by  TEXT,
  decided_by  TEXT,
  decided_at  TEXT,
  ruling_note TEXT,
  created_at  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS calibration (
  grade_id      INTEGER NOT NULL,
  marked_by     TEXT NOT NULL,
  human_verdict TEXT NOT NULL,
  marked_at     TEXT NOT NULL,
  week          TEXT NOT NULL,
  PRIMARY KEY (grade_id, marked_by)
);

CREATE TABLE IF NOT EXISTS grade_queue (
  grade_id    INTEGER PRIMARY KEY,
  attempts    INTEGER NOT NULL DEFAULT 0,
  next_try_at TEXT NOT NULL,
  last_error  TEXT,
  created_at  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS ai_usage (
  day           TEXT NOT NULL,
  model         TEXT NOT NULL,
  calls         INTEGER NOT NULL DEFAULT 0,
  input_tokens  INTEGER NOT NULL DEFAULT 0,
  output_tokens INTEGER NOT NULL DEFAULT 0,
  errors        INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (day, model)
);

-- Where each row of credit came from. Rows that exist today are 'legacy': the
-- browser decided them and they stay valid. From the switch date the server
-- writes 'server'. 'client' is reserved for a row a browser would write; the
-- live Worker never writes one.
ALTER TABLE course_completions ADD COLUMN source TEXT NOT NULL DEFAULT 'legacy';
ALTER TABLE unit_progress ADD COLUMN source TEXT NOT NULL DEFAULT 'legacy';
ALTER TABLE textbook_results ADD COLUMN source TEXT NOT NULL DEFAULT 'legacy';

-- The views that count degrees count only server and legacy completions
-- (definitions copied from 0010_merged_students.sql, with the source filter).
DROP VIEW IF EXISTS student_activity;
CREATE VIEW student_activity AS
SELECT
  s.id                                  AS student_id,
  s.name, s.email, s.email_verified_at, s.country, s.lang, s.track, s.goal, s.heard,
  s.created_at,
  s.contact_opt_out_at,
  (SELECT COUNT(*) FROM unit_progress u WHERE u.student_id = s.id)          AS units_passed,
  (SELECT COUNT(*) FROM course_completions c WHERE c.student_id = s.id AND c.source IN ('server','legacy')) AS courses_done,
  (SELECT MAX(u.completed_at) FROM unit_progress u WHERE u.student_id = s.id) AS last_unit_at,
  (SELECT u.course || ' ' || u.unit FROM unit_progress u WHERE u.student_id = s.id
     ORDER BY u.completed_at DESC, u.unit DESC LIMIT 1)                     AS last_unit,
  MAX(s.created_at,
      COALESCE((SELECT MAX(u.completed_at) FROM unit_progress u WHERE u.student_id = s.id), ''),
      COALESCE((SELECT MAX(c.completed_at) FROM course_completions c WHERE c.student_id = s.id), ''))
                                        AS last_progress_at,
  (SELECT MAX(o.sent_at) FROM outreach o WHERE o.student_id = s.id AND o.status = 'sent')
                                        AS last_contacted_at,
  (SELECT COUNT(*) FROM notifications n WHERE n.student_id = s.id AND n.kind = 'course' AND n.status = 'sent')
                                        AS notices_sent
FROM students s
WHERE s.merged_into IS NULL;

DROP VIEW IF EXISTS degree_progress;
CREATE VIEW degree_progress AS
SELECT
  s.id                                                        AS student_id,
  s.name,
  s.track,
  s.country,
  COUNT(c.code)                                               AS courses_done,
  COALESCE(SUM(c.code IN ('CTSOTS','CTSNT','CTSST','CTSEVANGELISM','CTSPM','CTSCH','WISESPEAK')), 0)
                                                              AS foundation_done,
  COALESCE(SUM(c.code IS NOT NULL AND COALESCE(c.track,
      CASE WHEN s.track IN ('thm','mdiv') THEN s.track WHEN s.goal = 'assoc' THEN 'assoc' ELSE 'cert' END)
    IN ('assoc','thm','mdiv')), 0)                           AS assoc_done,
  COALESCE(SUM(c.code IS NOT NULL AND COALESCE(c.track, s.track) IN ('thm','mdiv')), 0) AS masters_done,
  COALESCE(SUM(c.code IN ('CTSOTS','CTSNT','CTSST','CTSEVANGELISM','CTSPM','CTSCH','WISESPEAK',
                 'CTSHERMENEUTICS','CTSLA','CTSGENESIS','CTSPSALMS','CTSMATT','CTSROMANS','CTSACTS',
                 'CTSAPOL','COUNSELING','CTSAL','CTSWORSHIP','CTSCE','CTSMISSIONS')
      AND COALESCE(c.track, s.track) IN ('thm','mdiv')), 0)   AS mdiv_core_done,
  MAX(c.completed_at)                                         AS last_completion_at
FROM students s
LEFT JOIN course_completions c ON c.student_id = s.id AND c.source IN ('server','legacy')
WHERE s.merged_into IS NULL
GROUP BY s.id;
