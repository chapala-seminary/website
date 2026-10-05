-- A student who registered twice -- usually a new browser, before they knew
-- to type their code -- had two records: counted twice on the roster and in
-- the weekly summary, their progress split between them (Wayne, 5 Oct 2026).
--
-- Merging cannot simply delete the second record. Its code is the only
-- credential the student has, saved in the browser that made it, and the API
-- answers an unknown code with "no record": that browser would stop saving
-- the student's progress, silently. So a merged record stays, its progress
-- moved to the record it joined, and merged_into names that record. Every
-- lookup by code follows it (worker/api.js, resolveCode), so both codes reach
-- the one record. The merge itself is tools/merge-duplicate-students.sql.
--
-- The roster's two views are made again without merged records.

ALTER TABLE students ADD COLUMN merged_into TEXT;   -- the id this record was merged into; NULL for a live record
ALTER TABLE students ADD COLUMN merged_at TEXT;
CREATE INDEX IF NOT EXISTS idx_students_merged ON students (merged_into);

DROP VIEW IF EXISTS student_activity;
CREATE VIEW student_activity AS
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
LEFT JOIN course_completions c ON c.student_id = s.id
WHERE s.merged_into IS NULL
GROUP BY s.id;
