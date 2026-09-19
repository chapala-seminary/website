-- Student records for Chapala Theological Seminary.
--
-- localStorage stays the primary store: instant, offline-capable, and unchanged
-- for students who never sign in anywhere else. This database mirrors it, so a
-- cleared browser or a new phone is no longer the end of someone's degree.
--
-- Identity is a student code, not an email and not a password. The seminary has
-- no email infrastructure, its students are international and often on poor
-- connections, and a password is one more thing to lose for a programme most
-- people study once a week. The trade-off is real and is documented in the API:
-- the code is a bearer credential, so anyone holding it holds the record.

CREATE TABLE IF NOT EXISTS students (
  id           TEXT PRIMARY KEY,         -- the student code, normalised
  name         TEXT NOT NULL,
  email        TEXT,                     -- optional, for recovery later
  country      TEXT,
  track        TEXT NOT NULL,            -- cert | associate | thm | mdiv
  goal         TEXT,
  created_at   TEXT NOT NULL,
  updated_at   TEXT NOT NULL
);

-- One row per unit a student has passed. Progress is merged, never overwritten:
-- a unit passed on any device stays passed, and the earliest completion wins.
CREATE TABLE IF NOT EXISTS unit_progress (
  student_id   TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  course       TEXT NOT NULL,            -- storage slug, e.g. "1peter"
  unit         INTEGER NOT NULL,
  completed_at TEXT NOT NULL,
  PRIMARY KEY (student_id, course, unit)
);

-- The course-completion codes the certificate pages already write into
-- localStorage as cts_done_codes. Prerequisite gating reads these.
CREATE TABLE IF NOT EXISTS course_completions (
  student_id   TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  code         TEXT NOT NULL,            -- e.g. CTSOTS, WISESPEAK
  completed_at TEXT NOT NULL,
  PRIMARY KEY (student_id, code)
);

-- An issued certificate, and the public code that verifies it.
--
-- Honest limits: grading is still client-side, so this records that a
-- certificate was issued for a name and a course, not that the work was
-- independently proven. Issuing requires the student's code AND matching
-- progress rows, so a fabricated certificate needs fabricated progress first.
-- Server-side grading is the real fix and is not this table's job.
CREATE TABLE IF NOT EXISTS certificates (
  verify_code  TEXT PRIMARY KEY,
  student_id   TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,            -- snapshot: the name as printed
  level        TEXT NOT NULL,            -- course | certificate | associate | thm | mdiv
  course       TEXT,                     -- null for degree-level awards
  title        TEXT NOT NULL,
  issued_at    TEXT NOT NULL,
  revoked_at   TEXT
);

CREATE INDEX IF NOT EXISTS idx_progress_student    ON unit_progress (student_id);
CREATE INDEX IF NOT EXISTS idx_completions_student ON course_completions (student_id);
CREATE INDEX IF NOT EXISTS idx_certs_student       ON certificates (student_id);
