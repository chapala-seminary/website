-- Faculty approvals are separate from earned completions. Append revisions,
-- including a null plan to withdraw approval; never manufacture course passes.
CREATE TABLE IF NOT EXISTS thm_study_plans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  substitutions TEXT,
  approved_at TEXT NOT NULL,
  approved_by TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS thm_study_plans_student ON thm_study_plans(student_id, id DESC);
