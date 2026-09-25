-- Notices to the seminary, recorded (Wayne's audit, 25 Sept 2026, item 5).
--
-- Until now the only automatic word the seminary had of a completion was a row
-- the browser posted to a Google Apps Script, and an email only if the student
-- pressed Send in their own mail app -- which is how one student finished
-- twenty-odd master's courses without a single notice arriving. The Worker
-- now sends the notice itself, from the same request that records the
-- completion, and keeps a row per notice here. The row, not the inbox, is the
-- record: the student tracker can read this table directly, and a failed send
-- is visible and retried rather than silently lost.
--
-- One row per (student, kind, code): a course reported again from a second
-- device is not a second notice.
CREATE TABLE IF NOT EXISTS notifications (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id  TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  kind        TEXT NOT NULL,                 -- 'course' (a course completed) | 'certificate' (an award issued)
  code        TEXT NOT NULL,                 -- the completion code, or the certificate's verification code
  status      TEXT NOT NULL,                 -- 'sent' | 'failed'
  attempts    INTEGER NOT NULL DEFAULT 1,
  error       TEXT,                          -- the last failure, for the tracker and for whoever looks
  created_at  TEXT NOT NULL,
  sent_at     TEXT,
  UNIQUE (student_id, kind, code)
);
CREATE INDEX IF NOT EXISTS notifications_status ON notifications (status, created_at);
