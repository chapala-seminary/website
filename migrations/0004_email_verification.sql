-- A verified email, required to claim a certificate (Robert's decision,
-- 24 Sept 2026: students start with only a student code; the email is asked
-- for, and confirmed, when a certificate is claimed).
--
-- students.email stays what it was: whatever the student typed, synced
-- last-writer-wins. email_verified_at is set only by /api/email/confirm and is
-- cleared whenever the stored address changes, so a verified flag can never
-- belong to an address nobody confirmed.
ALTER TABLE students ADD COLUMN email_verified_at TEXT;

-- One open challenge per student. The code itself is never stored, only its
-- SHA-256 (salted with the student id), and it expires after 15 minutes.
CREATE TABLE IF NOT EXISTS email_challenges (
  student_id  TEXT PRIMARY KEY REFERENCES students(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  code_hash   TEXT NOT NULL,
  expires_at  TEXT NOT NULL,
  attempts    INTEGER NOT NULL DEFAULT 0,   -- wrong guesses against this code
  sent_at     TEXT NOT NULL,                -- last send, for the resend wait
  sends_today INTEGER NOT NULL DEFAULT 1,
  sends_day   TEXT NOT NULL                 -- YYYY-MM-DD the count belongs to
);
