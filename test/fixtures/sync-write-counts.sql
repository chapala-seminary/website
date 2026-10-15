-- Test-only instrumentation, installed before wrangler dev starts.
CREATE TABLE _sync_write_counts (table_name TEXT PRIMARY KEY, inserts INTEGER NOT NULL, updates INTEGER NOT NULL);
INSERT INTO _sync_write_counts VALUES ('unit_progress', 0, 0);
CREATE TRIGGER _sync_write_unit_progress_INSERT AFTER INSERT ON unit_progress
BEGIN UPDATE _sync_write_counts SET inserts = inserts + 1 WHERE table_name = 'unit_progress'; END;
CREATE TRIGGER _sync_write_unit_progress_UPDATE AFTER UPDATE ON unit_progress
BEGIN UPDATE _sync_write_counts SET updates = updates + 1 WHERE table_name = 'unit_progress'; END;
INSERT INTO _sync_write_counts VALUES ('textbook_results', 0, 0);
CREATE TRIGGER _sync_write_textbook_results_INSERT AFTER INSERT ON textbook_results
BEGIN UPDATE _sync_write_counts SET inserts = inserts + 1 WHERE table_name = 'textbook_results'; END;
CREATE TRIGGER _sync_write_textbook_results_UPDATE AFTER UPDATE ON textbook_results
BEGIN UPDATE _sync_write_counts SET updates = updates + 1 WHERE table_name = 'textbook_results'; END;
INSERT INTO _sync_write_counts VALUES ('course_completions', 0, 0);
CREATE TRIGGER _sync_write_course_completions_INSERT AFTER INSERT ON course_completions
BEGIN UPDATE _sync_write_counts SET inserts = inserts + 1 WHERE table_name = 'course_completions'; END;
CREATE TRIGGER _sync_write_course_completions_UPDATE AFTER UPDATE ON course_completions
BEGIN UPDATE _sync_write_counts SET updates = updates + 1 WHERE table_name = 'course_completions'; END;
