-- "Email me my code" (worker/api.js, emailMyCode): the throttle's memory.
-- One row per request, under two hashed buckets -- the email address asked
-- about, and the address the request came from -- so neither is stored in
-- the clear. Rows older than a day are pruned on each request.

CREATE TABLE IF NOT EXISTS code_email_requests (
  bucket TEXT NOT NULL,      -- hash of what is being counted
  at     INTEGER NOT NULL    -- unix seconds
);

CREATE INDEX IF NOT EXISTS idx_code_email_bucket ON code_email_requests (bucket, at);
