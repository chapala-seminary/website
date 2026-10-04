-- Textbook tests (Dr. Cook, 4 Oct 2026): a pass on a Master's textbook test
-- is part of the student record, so it survives a new device and reaches the
-- tracker, and on the M.Div. and Th.M. tracks the course is not complete
-- without it (worker/awards.js). Certificate and Associate students may take
-- the tests; for them nothing depends on the result.
--
-- One row per textbook a student has passed. The slug is the textbook's
-- (src/content/textbooks: cults, counseling, ...); passed_at is the earliest
-- time any device reported it, as unit_progress keeps it.
CREATE TABLE IF NOT EXISTS textbook_results (
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  textbook   TEXT NOT NULL,
  passed_at  TEXT NOT NULL,
  PRIMARY KEY (student_id, textbook)
);
