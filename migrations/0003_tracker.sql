-- What the seminary's student tracker needs that the first schema did not
-- hold. Wayne keeps a private tracker of every student -- courses, track,
-- degree progress, country -- and until now filled it from completion
-- notices emailed by the certificate pages, which arrive for some students
-- and not others. Once the site records completions here he will read this
-- database directly, so it has to carry what the tracker shows.
--
-- Two columns and a view. Nothing here changes how the site behaves for a
-- student; it records more of what they already told the registration form.

-- How the student heard about the seminary. The registration form has asked
-- since the beginning (search / ai / referral / church / social / other) and
-- kept the answer in the browser; it was never sent up.
ALTER TABLE students ADD COLUMN heard TEXT;

-- The track a course was completed on. The certificate pages have always
-- kept a separate list of courses finished on the master's tracks
-- (cts_mdiv_done_codes, cts_thm_done_codes) because a degree counts only the
-- courses earned at its own level; the sync now carries that list, and this
-- is where it lands. NULL means the completion arrived before this column
-- existed, or from a browser that had no track list for it -- treat it as
-- the student's track at the time, which is the best anyone can do.
ALTER TABLE course_completions ADD COLUMN track TEXT;   -- cert | thm | mdiv

-- Degree progress per student, computed the way the certificate pages
-- compute it, so the tracker never has to. The seven foundation codes and
-- the twenty-course M.Div. core are the same lists as worker/awards.js; if
-- one changes the other must.
CREATE VIEW IF NOT EXISTS degree_progress AS
SELECT
  s.id                                                        AS student_id,
  s.name,
  s.track,
  s.country,
  COUNT(c.code)                                               AS courses_done,
  COALESCE(SUM(c.code IN ('CTSOTS','CTSNT','CTSST','CTSEVANGELISM','CTSPM','CTSCH','WISESPEAK')), 0)
                                                              AS foundation_done,
  COALESCE(SUM(COALESCE(c.track, s.track) IN ('thm','mdiv')), 0) AS masters_done,
  COALESCE(SUM(c.code IN ('CTSOTS','CTSNT','CTSST','CTSEVANGELISM','CTSPM','CTSCH','WISESPEAK',
                 'CTSHERMENEUTICS','CTSLA','CTSGENESIS','CTSPSALMS','CTSMATT','CTSROMANS','CTSACTS',
                 'CTSAPOL','COUNSELING','CTSAL','CTSWORSHIP','CTSCE','CTSMISSIONS')
      AND COALESCE(c.track, s.track) IN ('thm','mdiv')), 0)   AS mdiv_core_done,
  MAX(c.completed_at)                                         AS last_completion_at
FROM students s
LEFT JOIN course_completions c ON c.student_id = s.id
GROUP BY s.id;
