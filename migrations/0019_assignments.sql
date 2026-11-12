-- Ministry papers (Dr. Cook, 2 Nov 2026): a master's student pastes a paper
-- (and, for a sermon, its exegetical notes) into the course's paper page
-- (/CTS<Course>Paper.html); the AI scores it against the rubric on the
-- course's master's page (worker/grading/paper.js). 80 of 100 meets the
-- standard; below that the student revises and submits a new version.
-- One row per submitted version. A pass also writes textbook_results under the
-- paper's slug (worker/assignments.js). Delete My Record removes these rows.
--
-- status: pending (waiting for the model; the 15-minute cron retries it,
-- next_try_at) | passed | revise | unavailable (the model could not grade it
-- after the tries allowed; the student may submit again).
--
-- New table only. Safe to run once. This file contains no student.
CREATE TABLE IF NOT EXISTS assignments (
  id             TEXT PRIMARY KEY,
  student_id     TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  slug           TEXT NOT NULL,
  version        INTEGER NOT NULL,
  format         TEXT NOT NULL CHECK (format IN ('study', 'sermon', 'plan')),
  topic          TEXT NOT NULL,
  lang           TEXT NOT NULL,
  body_text      TEXT NOT NULL CHECK (length(body_text) <= 25000),
  notes_text     TEXT CHECK (notes_text IS NULL OR length(notes_text) <= 12000),
  word_count     INTEGER NOT NULL,
  status         TEXT NOT NULL DEFAULT 'pending',
  scores_json    TEXT,
  total          INTEGER,
  feedback       TEXT,
  record_json    TEXT,
  model          TEXT,
  prompt_version TEXT,
  tries          INTEGER NOT NULL DEFAULT 0,
  next_try_at    TEXT,
  last_error     TEXT,
  submitted_at   TEXT NOT NULL,
  graded_at      TEXT,
  UNIQUE (student_id, slug, version)
);
CREATE INDEX IF NOT EXISTS assignments_student ON assignments(student_id, slug);
CREATE INDEX IF NOT EXISTS assignments_pending ON assignments(status, next_try_at);
