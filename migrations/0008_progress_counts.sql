-- A student with no completions counted one course toward their program
-- (Dr. Cook's audit, 30 Sept 2026: an Associate test row showed 1/25 with no
-- courses and no units). degree_progress joins students to their completions
-- with a LEFT JOIN, so a student with none still has one row, its code and
-- level empty; the level then fell back to the student's own, and that empty
-- row was counted -- toward the Associate since 0007, toward the Th.M. and
-- M.Div. since 0003. Only the staff roster read these numbers; eligibility
-- and certificates count completions directly (worker/awards.js).
--
-- The view is made again with each count requiring a real completion.

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
GROUP BY s.id;
