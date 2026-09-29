-- Completion levels (Dr. Cook's review, 29 Sept 2026): a course counts toward
-- a degree only at the level it was completed on. course_completions.track now
-- also takes 'assoc' -- a course finished on the Associate path, multiple
-- choice and fill-ins -- beside 'cert', 'thm' and 'mdiv' (worker/awards.js).
--
-- degree_progress gains assoc_done: the courses that count toward the
-- Associate of Divinity (Associate-level or master's-level). A view cannot be
-- altered, so it is dropped and made again; nothing is stored in it.
-- A completion with no level (before 0003) counts at the student's own level,
-- as before, with the Associate goal counted as 'assoc'.

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
  COALESCE(SUM(COALESCE(c.track,
      CASE WHEN s.track IN ('thm','mdiv') THEN s.track WHEN s.goal = 'assoc' THEN 'assoc' ELSE 'cert' END)
    IN ('assoc','thm','mdiv')), 0)                           AS assoc_done,
  COALESCE(SUM(COALESCE(c.track, s.track) IN ('thm','mdiv')), 0) AS masters_done,
  COALESCE(SUM(c.code IN ('CTSOTS','CTSNT','CTSST','CTSEVANGELISM','CTSPM','CTSCH','WISESPEAK',
                 'CTSHERMENEUTICS','CTSLA','CTSGENESIS','CTSPSALMS','CTSMATT','CTSROMANS','CTSACTS',
                 'CTSAPOL','COUNSELING','CTSAL','CTSWORSHIP','CTSCE','CTSMISSIONS')
      AND COALESCE(c.track, s.track) IN ('thm','mdiv')), 0)   AS mdiv_core_done,
  MAX(c.completed_at)                                         AS last_completion_at
FROM students s
LEFT JOIN course_completions c ON c.student_id = s.id
GROUP BY s.id;
