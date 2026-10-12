-- Synthetic pre-existing account: new signup rules must not lock it out.
INSERT INTO students (id, name, email, track, created_at, updated_at)
VALUES ('CTS-TEST-0000-0001', 'Legacy No Email', NULL, 'cert',
        '2026-09-01T00:00:00.000Z', '2026-09-01T00:00:00.000Z');
