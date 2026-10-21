-- Coordinator-led paper study (docs/offline-coordinator.md; Wayne Cook, 20 Oct 2026).
--
-- A study group is a church or community that studies together, often on
-- paper, with one coordinator who has a sign-in. Each learner in the group
-- is an ordinary student record with their own CTS code; the group only
-- says who may enter their paper answer sheets.
--
-- Safe to run more than once (IF NOT EXISTS). Adds tables only: no existing
-- row or column changes. This file contains no student.

-- One group per coordinator email. `course` is the course slug the group's
-- coordinator may enter sheets for (worker/catalog.json), 'ots' at first.
CREATE TABLE IF NOT EXISTS study_groups (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  name              TEXT NOT NULL,
  country           TEXT,
  coordinator_email TEXT NOT NULL UNIQUE,   -- stored lower-case
  course            TEXT NOT NULL DEFAULT 'ots',
  created_at        TEXT NOT NULL,
  created_by        TEXT NOT NULL,          -- the staff member who made it
  closed_at         TEXT
);

-- A learner belongs to at most one group. `id` is what the coordinator's page
-- uses in its links, so a student code never appears in a URL.
CREATE TABLE IF NOT EXISTS study_group_members (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  group_id    INTEGER NOT NULL REFERENCES study_groups(id),
  student_id  TEXT NOT NULL UNIQUE REFERENCES students(id) ON DELETE CASCADE,
  enrolled_at TEXT NOT NULL,
  enrolled_by TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS study_group_members_group ON study_group_members(group_id);

-- A paper answer sheet the coordinator typed in. The attempt it became is an
-- ordinary row in `attempts`, graded by the same code as an online one; this
-- row only records that it came from paper, who entered it, and the letters.
CREATE TABLE IF NOT EXISTS paper_sheets (
  attempt_id TEXT PRIMARY KEY,
  group_id   INTEGER NOT NULL,
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  scope      TEXT NOT NULL,
  letters    TEXT NOT NULL,
  entered_by TEXT NOT NULL,
  entered_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS paper_sheets_student ON paper_sheets(student_id);
