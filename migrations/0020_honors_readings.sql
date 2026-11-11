-- Honors reading attestations (Dr. Cook, 9 Nov 2026): kept on the record as
-- well as in the browser, so "with honors" survives a new device or browser.
-- One row per course; the first attestation stands. Purely additive.
-- Rollback: DROP TABLE honors_readings; (the browser copies are untouched).
CREATE TABLE IF NOT EXISTS honors_readings (
  student_id  TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  course      TEXT NOT NULL,             -- the cts_honors_v1:<course> key's course code
  data        TEXT NOT NULL,             -- the browser's attestation, as stored (name, date, works)
  recorded_at TEXT NOT NULL,
  PRIMARY KEY (student_id, course)
);
