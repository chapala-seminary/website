-- Failed lookups, counted per address, so guessing a student code costs
-- something.
--
-- Only FAILURES are recorded. Limiting every request would slow the students
-- this exists to protect -- a class finishing a unit together shares a school
-- or a church's address -- while doing nothing extra to someone guessing,
-- whose requests are nearly all failures by definition. Counting the failures
-- alone puts the cost exactly where the abuse is.
--
-- The address is stored hashed, not in the clear. This table would otherwise
-- be a log of who used the site and when, which is not something the seminary
-- has any reason to keep, and it is the one table an attacker would most like
-- to read.
CREATE TABLE IF NOT EXISTS lookup_failures (
  bucket     TEXT NOT NULL,   -- hash of (address + what was being attempted)
  at         INTEGER NOT NULL -- unix seconds
);

CREATE INDEX IF NOT EXISTS idx_failures_bucket ON lookup_failures (bucket, at);
