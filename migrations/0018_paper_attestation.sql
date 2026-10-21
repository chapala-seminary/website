-- The coordinator's statement that the learner did the paper exam as their
-- own work (docs/offline-coordinator.md). Stored with the sheet. Credit is
-- refused until the person entering the sheet confirms it.
--
-- Adds one column. Safe to run once. This file contains no student.

ALTER TABLE paper_sheets ADD COLUMN attestation TEXT;
