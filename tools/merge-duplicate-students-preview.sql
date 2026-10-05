-- What tools/merge-duplicate-students.sql would do. Changes nothing, and shows
-- no names, emails or student codes: each record by its roster row number
-- (the n of /staff/students/<n>), with what it holds.
--
--   npx wrangler d1 execute chapala-students --remote --config wrangler.jsonc \
--     --file tools/merge-duplicate-students-preview.sql
--
-- action: "keep" (registered first) and "merge" -- same email and same name,
-- merged when the merge runs; "check" -- same email, different names, left
-- alone unless merged by hand after looking at the roster (two people may
-- share an address).

WITH live AS (
  SELECT s.rowid AS row, s.id, s.created_at, s.track, s.goal,
         lower(trim(s.email)) AS e, lower(trim(s.name)) AS nm
  FROM students s
  WHERE s.merged_into IS NULL AND s.email LIKE '%_@_%'
    AND lower(trim(s.email)) <> 'tester@chapalaseminary.org'
),
dup AS (
  SELECT e FROM live GROUP BY e HAVING COUNT(*) > 1
),
grp AS (
  SELECT e, ROW_NUMBER() OVER (ORDER BY MIN(created_at)) AS g FROM live WHERE e IN (SELECT e FROM dup) GROUP BY e
)
SELECT
  grp.g                                                         AS pair,
  l.row                                                         AS roster_row,
  CASE
    WHEN l.id = (SELECT k.id FROM live k WHERE k.e = l.e AND k.nm = l.nm ORDER BY k.created_at, k.id LIMIT 1)
      THEN CASE WHEN (SELECT COUNT(*) FROM live k WHERE k.e = l.e AND k.nm = l.nm) > 1 THEN 'keep' ELSE 'check' END
    ELSE 'merge' END                                            AS action,
  substr(l.created_at, 1, 10)                                   AS registered,
  CASE WHEN lower(l.track) = 'mdiv' THEN 'M.Div.' WHEN lower(l.track) IN ('thm', 'mth') THEN 'Th.M.'
       WHEN lower(l.track) = 'associate' OR lower(COALESCE(l.goal, '')) = 'assoc' THEN 'Associate'
       ELSE 'Certificate' END                                   AS program,
  (SELECT COUNT(*) FROM unit_progress u WHERE u.student_id = l.id)        AS units,
  (SELECT COUNT(*) FROM course_completions c WHERE c.student_id = l.id)   AS courses,
  (SELECT COUNT(*) FROM certificates c WHERE c.student_id = l.id)         AS certificates,
  (SELECT COUNT(*) FROM textbook_results t WHERE t.student_id = l.id)     AS textbooks
FROM live l JOIN grp ON grp.e = l.e
ORDER BY grp.g, l.created_at;
