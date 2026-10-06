-- Merge students who registered twice (Wayne, 5 Oct 2026). Why a merged record
-- stays, and how its code keeps working: migrations/0010_merged_students.sql.
--
-- Look first, with tools/merge-duplicate-students-preview.sql. Then, with a
-- restore point noted (docs/disaster-recovery.md: `d1 time-travel info`):
--
--   npx wrangler d1 execute chapala-students --remote --config wrangler.jsonc \
--     --file tools/merge-duplicate-students.sql
--
-- Safe to run again: a second run finds nothing new to mark or move.
--
-- WHO IS MERGED. Live records sharing an email (case and spaces ignored) AND
-- a name (the same). Only a real address counts: the front page stores "—"
-- for a blank email, and the 5 Oct run matched one pair on it (the same
-- person, as it turned out -- same country, program and language, and no
-- progress on either -- but nothing about "—" says so). Same email, different names is left alone: a husband and
-- wife may share one address, and two people must never become one record.
-- The preview lists those pairs by roster row number; to merge one after
-- checking it on the staff roster, mark it by hand and run this file again:
--
--   UPDATE students SET merged_into = (SELECT id FROM students WHERE rowid = <keep>),
--     merged_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE rowid = <merge>;
--
-- WHICH RECORD STAYS. The one registered first. It takes the most advanced
-- program of the records merged into it (Robert, 5 Oct 2026): M.Div., then
-- Th.M., then Associate, then Certificate -- completions count up toward a
-- program, never down. Its name and email are its own; a verified email, a
-- country, a language or a stop-the-notes request missing from it is taken
-- from the other.
--
-- WHAT MOVES. Every unit, completion, textbook test, certificate, notice and
-- note. Where both records have the same unit, course or textbook, the
-- earlier date is kept, and a course's level only rises, as the API keeps it.
-- Certificates move whole, so every verification code still checks.
-- Contact links (stop-the-notes) and email codes stay where they are: they
-- follow merged_into when used.

-- 1. Mark: each later record of a same-email, same-name group points at the first.
UPDATE students SET
  merged_into = (SELECT k.id FROM students k
                 WHERE k.merged_into IS NULL
                   AND lower(trim(k.email)) = lower(trim(students.email))
                   AND lower(trim(k.name)) = lower(trim(students.name))
                 ORDER BY k.created_at, k.id LIMIT 1),
  merged_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
WHERE merged_into IS NULL
  AND email LIKE '%_@_%'
  AND lower(trim(email)) <> 'tester@chapalaseminary.org'
  AND id <> (SELECT k.id FROM students k
             WHERE k.merged_into IS NULL
               AND lower(trim(k.email)) = lower(trim(students.email))
               AND lower(trim(k.name)) = lower(trim(students.name))
             ORDER BY k.created_at, k.id LIMIT 1);

-- 2. The record that stays: the most advanced program, and what it lacks.
UPDATE students SET (track, goal) = (
    SELECT m.track, m.goal FROM students m WHERE m.merged_into = students.id
    ORDER BY CASE WHEN lower(m.track) = 'mdiv' THEN 4 WHEN lower(m.track) IN ('thm', 'mth') THEN 3
                  WHEN lower(m.track) = 'associate' OR lower(COALESCE(m.goal, '')) = 'assoc' THEN 2 ELSE 1 END DESC
    LIMIT 1)
WHERE merged_into IS NULL
  AND (SELECT MAX(CASE WHEN lower(m.track) = 'mdiv' THEN 4 WHEN lower(m.track) IN ('thm', 'mth') THEN 3
                       WHEN lower(m.track) = 'associate' OR lower(COALESCE(m.goal, '')) = 'assoc' THEN 2 ELSE 1 END)
       FROM students m WHERE m.merged_into = students.id)
    > CASE WHEN lower(track) = 'mdiv' THEN 4 WHEN lower(track) IN ('thm', 'mth') THEN 3
           WHEN lower(track) = 'associate' OR lower(COALESCE(goal, '')) = 'assoc' THEN 2 ELSE 1 END;

UPDATE students SET
  email_verified_at  = COALESCE(email_verified_at,  (SELECT MIN(m.email_verified_at)  FROM students m WHERE m.merged_into = students.id)),
  country            = COALESCE(country,            (SELECT MAX(m.country)            FROM students m WHERE m.merged_into = students.id)),
  lang               = COALESCE(lang,               (SELECT MAX(m.lang)               FROM students m WHERE m.merged_into = students.id)),
  heard              = COALESCE(heard,              (SELECT MAX(m.heard)              FROM students m WHERE m.merged_into = students.id)),
  contact_opt_out_at = COALESCE(contact_opt_out_at, (SELECT MIN(m.contact_opt_out_at) FROM students m WHERE m.merged_into = students.id)),
  updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
WHERE merged_into IS NULL AND EXISTS (SELECT 1 FROM students m WHERE m.merged_into = students.id);

-- 3. Move: copy each merged record's rows to the one that stays, then remove them.
INSERT INTO unit_progress (student_id, course, unit, completed_at)
  SELECT m.merged_into, u.course, u.unit, u.completed_at
  FROM unit_progress u JOIN students m ON m.id = u.student_id WHERE m.merged_into IS NOT NULL
  ON CONFLICT(student_id, course, unit) DO UPDATE SET completed_at = MIN(completed_at, excluded.completed_at);
DELETE FROM unit_progress WHERE student_id IN (SELECT id FROM students WHERE merged_into IS NOT NULL);

INSERT INTO textbook_results (student_id, textbook, passed_at)
  SELECT m.merged_into, t.textbook, t.passed_at
  FROM textbook_results t JOIN students m ON m.id = t.student_id WHERE m.merged_into IS NOT NULL
  ON CONFLICT(student_id, textbook) DO UPDATE SET passed_at = MIN(passed_at, excluded.passed_at);
DELETE FROM textbook_results WHERE student_id IN (SELECT id FROM students WHERE merged_into IS NOT NULL);

INSERT INTO course_completions (student_id, code, track, completed_at)
  SELECT m.merged_into, c.code, c.track, c.completed_at
  FROM course_completions c JOIN students m ON m.id = c.student_id WHERE m.merged_into IS NOT NULL
  ON CONFLICT(student_id, code) DO UPDATE SET
    completed_at = MIN(course_completions.completed_at, excluded.completed_at),
    track = CASE
      WHEN course_completions.track IS NULL THEN excluded.track
      WHEN course_completions.track = 'cert' AND excluded.track IN ('assoc', 'thm', 'mdiv') THEN excluded.track
      WHEN course_completions.track = 'assoc' AND excluded.track IN ('thm', 'mdiv') THEN excluded.track
      ELSE course_completions.track END;
DELETE FROM course_completions WHERE student_id IN (SELECT id FROM students WHERE merged_into IS NOT NULL);

UPDATE certificates SET student_id = (SELECT m.merged_into FROM students m WHERE m.id = certificates.student_id)
  WHERE student_id IN (SELECT id FROM students WHERE merged_into IS NOT NULL);

UPDATE outreach SET student_id = (SELECT m.merged_into FROM students m WHERE m.id = outreach.student_id)
  WHERE student_id IN (SELECT id FROM students WHERE merged_into IS NOT NULL);

-- One notice per student, kind and course: one already sent for the record
-- that stays is the one kept.
UPDATE OR IGNORE notifications SET student_id = (SELECT m.merged_into FROM students m WHERE m.id = notifications.student_id)
  WHERE student_id IN (SELECT id FROM students WHERE merged_into IS NOT NULL);
DELETE FROM notifications WHERE student_id IN (SELECT id FROM students WHERE merged_into IS NOT NULL);

-- 4. What it did, as counts: no names, emails or codes.
SELECT
  (SELECT COUNT(*) FROM students WHERE merged_into IS NOT NULL)                       AS records_merged_total,
  (SELECT COUNT(*) FROM students WHERE merged_into IS NULL
     AND lower(COALESCE(email, '')) <> 'tester@chapalaseminary.org')                  AS students_now,
  (SELECT COUNT(*) FROM unit_progress u JOIN students m ON m.id = u.student_id
     WHERE m.merged_into IS NOT NULL)                                                 AS rows_left_on_merged_records;
