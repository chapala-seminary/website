-- Keeping students going (Wayne, 27 Sept 2026): notice a student who has
-- stopped making progress and write to them -- a short, personal note asking
-- whether something on the site got in their way -- and give the seminary one
-- place to see every student's courses, program, country and last activity.
--
-- Nothing here changes what a student sees on the site. It records the
-- language they read in, when the seminary last wrote to them, and whether
-- they asked not to be written to.

-- The language the student reads the site in: 'en' | 'es'. The language
-- switch has always kept it in the browser (cts_lang); the sync now carries
-- it, so a note reaches a student in the language they study in.
ALTER TABLE students ADD COLUMN lang TEXT;

-- Set when the student follows "don't write to me about my progress" in a
-- note. Never cleared by the site; a student who wants notes again writes
-- to the seminary.
ALTER TABLE students ADD COLUMN contact_opt_out_at TEXT;

-- One row per note the seminary sends a student about their progress.
-- kind: 'quiet' (no progress for three weeks) | 'not_started' (registered a
-- week ago, no unit passed yet). The row, like a notice's, is the record: the
-- weekly summary to the seminary and the roster page read it, and it is what
-- stops the same student being written to again too soon.
CREATE TABLE IF NOT EXISTS outreach (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id  TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  kind        TEXT NOT NULL,
  status      TEXT NOT NULL,                 -- 'sent' | 'failed'
  error       TEXT,
  sent_at     TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_outreach_student ON outreach (student_id, sent_at);

-- The token in a note's "don't write to me" link. Random, one per student,
-- made when the first note is sent. Not the student code: that is a bearer
-- credential for the whole record, and does not belong in an email.
CREATE TABLE IF NOT EXISTS contact_tokens (
  token       TEXT PRIMARY KEY,
  student_id  TEXT NOT NULL UNIQUE REFERENCES students(id) ON DELETE CASCADE
);

-- Every student, one row, everything the roster shows. last_progress_at is
-- the latest of: a unit passed, a course completed, registering. A student
-- who comes back to the site and passes nothing does not count as active --
-- the question is whether they are moving forward, not whether they visited.
--
-- One caution, also on the roster page: a student's history from before the
-- new site arrives with the date of their first visit to it, so for returning
-- students the clock starts at the cutover.
CREATE VIEW IF NOT EXISTS student_activity AS
SELECT
  s.id                                  AS student_id,
  s.name, s.email, s.email_verified_at, s.country, s.lang, s.track, s.goal, s.heard,
  s.created_at,
  s.contact_opt_out_at,
  (SELECT COUNT(*) FROM unit_progress u WHERE u.student_id = s.id)          AS units_passed,
  (SELECT COUNT(*) FROM course_completions c WHERE c.student_id = s.id)     AS courses_done,
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
FROM students s;
