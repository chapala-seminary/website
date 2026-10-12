-- Policy metadata only. No student records are rewritten or deleted.
-- Beta inserts its cutoff on the first post-deployment health request.
CREATE TABLE IF NOT EXISTS test_activations (
  name TEXT PRIMARY KEY,
  activated_at TEXT NOT NULL
);
