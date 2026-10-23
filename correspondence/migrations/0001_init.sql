-- CTS Correspondence Console: the case ledger (issue #163).
--
-- Its own D1 database (cts-correspondence), never the students' database. The
-- console reaches student records only through a server-side lookup that
-- returns the minimum needed (M2), so a fault here cannot touch a student's
-- progress, and the students' database never holds correspondence.
--
-- Rules the schema enforces rather than hopes for:
--   * a provider message is stored once: UNIQUE (mailbox, provider_msg_id)
--   * a mailbox thread belongs to one conversation: UNIQUE (mailbox, provider_thread_id)
--   * a contact is an address, never a name: UNIQUE (address_norm)
--   * a suppressed address is suppressed once per reason: UNIQUE (address_norm, reason)
--   * every change to a case leaves a row in case_events (append-only)

PRAGMA foreign_keys = ON;

-- Mailboxes the console may read. Only institutional accounts the owner has
-- approved; a personal account is never added here.
CREATE TABLE mailboxes (
  id            TEXT PRIMARY KEY,                -- short name, e.g. 'cts-gmail'
  address       TEXT NOT NULL UNIQUE,            -- lower-case address
  provider      TEXT NOT NULL DEFAULT 'gmail',
  enabled       INTEGER NOT NULL DEFAULT 0,      -- 0 until the owner approves it
  history_id    TEXT,                            -- Gmail history cursor (resume point)
  last_internal_ms INTEGER,                      -- newest message seen, for cursor recovery
  last_sync_at  TEXT,
  last_error    TEXT,
  created_at    TEXT NOT NULL
);

-- People and institutions, keyed by normalized address only. Similar names
-- never merge two contacts; display_name is for reading, not matching.
CREATE TABLE contacts (
  id            INTEGER PRIMARY KEY,
  address_norm  TEXT NOT NULL UNIQUE,
  display_name  TEXT,
  institution   TEXT,
  kind          TEXT NOT NULL DEFAULT 'unknown'  -- student | faculty | partner | outreach | automated | unknown
                CHECK (kind IN ('student','faculty','partner','outreach','automated','unknown')),
  language      TEXT,                            -- en | es | fr | pt | sw | ...
  student_ref   TEXT,                            -- opaque reference from the site (M2); never a student code
  created_at    TEXT NOT NULL,
  updated_at    TEXT NOT NULL
);

-- Who may not be written to, and why. Permanent rows (bounce, opt-out,
-- refusal) are never lifted automatically. Temporary deferrals count up and
-- become 'review' after repeated failures, never 'permanent' on their own.
CREATE TABLE suppressions (
  id            INTEGER PRIMARY KEY,
  address_norm  TEXT NOT NULL,
  reason        TEXT NOT NULL CHECK (reason IN ('hard_bounce','soft_bounce','opt_out','refusal','manual')),
  permanent     INTEGER NOT NULL,
  soft_count    INTEGER NOT NULL DEFAULT 0,
  first_at      TEXT NOT NULL,
  last_at       TEXT NOT NULL,
  evidence_msg  INTEGER REFERENCES messages(id),
  note          TEXT,
  UNIQUE (address_norm, reason)
);

-- A case is one matter with one counterpart: a student problem, or a
-- faculty/partner/outreach relationship. The two tracks never share a case.
CREATE TABLE cases (
  id            INTEGER PRIMARY KEY,
  track         TEXT NOT NULL CHECK (track IN ('student_support','relations','automated')),
  contact_id    INTEGER NOT NULL REFERENCES contacts(id),
  topic         TEXT,
  category      TEXT NOT NULL,
  priority      TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('urgent','high','normal','low')),
  status        TEXT NOT NULL DEFAULT 'new' CHECK (status IN
                ('new','draft','waiting_on_us','waiting_on_them','scheduled_follow_up','resolved','escalated')),
  needs_owner   INTEGER NOT NULL DEFAULT 0,      -- 1: only Dr. Cook (or an authorized reviewer) may decide
  owner_reason  TEXT,                            -- why it needs the owner, in a few words
  assignee      TEXT,                            -- 'wayne' | 'claude' | 'chatgpt' | 'robert' | ...
  summary       TEXT,                            -- 3-5 sentence running summary
  facts_json    TEXT NOT NULL DEFAULT '[]',
  commitments_json TEXT NOT NULL DEFAULT '[]',
  next_action   TEXT,
  due_at        TEXT,
  last_inbound_at  TEXT,
  last_outbound_at TEXT,
  resolution_evidence TEXT,                      -- required to close an escalation
  opened_at     TEXT NOT NULL,
  updated_at    TEXT NOT NULL
);
CREATE INDEX cases_open ON cases (status, needs_owner, priority, updated_at);
CREATE INDEX cases_contact ON cases (contact_id, track, status);

-- A Gmail thread in one mailbox. Threads from different mailboxes that are
-- the same conversation point at the same case; that link is made only on
-- RFC Message-ID evidence (In-Reply-To / References), never on subject alone.
CREATE TABLE threads (
  id                 INTEGER PRIMARY KEY,
  mailbox_id         TEXT NOT NULL REFERENCES mailboxes(id),
  provider_thread_id TEXT NOT NULL,
  case_id            INTEGER REFERENCES cases(id),
  subject            TEXT,
  link_state         TEXT NOT NULL DEFAULT 'linked' CHECK (link_state IN ('linked','needs_review')),
  created_at         TEXT NOT NULL,
  UNIQUE (mailbox_id, provider_thread_id)
);
CREATE INDEX threads_case ON threads (case_id);

-- One provider message, stored once. The body is not kept: only a short,
-- redacted excerpt of the newest text (quoted history stripped), which the
-- retention job clears after RETENTION_DAYS. The full message stays in Gmail.
CREATE TABLE messages (
  id               INTEGER PRIMARY KEY,
  mailbox_id       TEXT NOT NULL REFERENCES mailboxes(id),
  provider_msg_id  TEXT NOT NULL,
  thread_id        INTEGER NOT NULL REFERENCES threads(id),
  rfc_message_id   TEXT,                        -- the Message-ID header, global across mailboxes
  in_reply_to      TEXT,
  direction        TEXT NOT NULL CHECK (direction IN ('in','out')),
  from_norm        TEXT NOT NULL,
  to_norm          TEXT,                        -- comma list
  internal_ms      INTEGER NOT NULL,
  subject          TEXT,
  excerpt          TEXT,                        -- redacted, quote-stripped, capped
  lane             TEXT NOT NULL,               -- deterministic lane (see src/triage.js)
  category         TEXT,
  question_fp      TEXT,                        -- normalized question fingerprint (already-answered check)
  flags            TEXT NOT NULL DEFAULT '',    -- comma list: injection, sensitive, duplicate_question, ...
  view_url         TEXT,
  ingested_at      TEXT NOT NULL,
  UNIQUE (mailbox_id, provider_msg_id)
);
CREATE INDEX messages_rfc ON messages (rfc_message_id);
CREATE INDEX messages_thread ON messages (thread_id, internal_ms);
CREATE INDEX messages_retention ON messages (ingested_at) WHERE excerpt IS NOT NULL;

-- Append-only history of every decision: rule hits, AI calls (model, prompt
-- version, input size, output), status changes, drafts, sends, human actions.
CREATE TABLE case_events (
  id         INTEGER PRIMARY KEY,
  case_id    INTEGER REFERENCES cases(id),
  message_id INTEGER REFERENCES messages(id),
  actor      TEXT NOT NULL,                     -- 'rules' | 'ai:<model>' | 'sync' | person's email
  kind       TEXT NOT NULL,
  detail     TEXT,                              -- JSON
  at         TEXT NOT NULL
);
CREATE INDEX case_events_case ON case_events (case_id, at);

-- Durable retries: a message that failed to ingest is parked here with its
-- error and retried with backoff; after MAX_ATTEMPTS it stays for a person.
CREATE TABLE dead_letters (
  id              INTEGER PRIMARY KEY,
  mailbox_id      TEXT NOT NULL,
  provider_msg_id TEXT NOT NULL,
  attempts        INTEGER NOT NULL DEFAULT 1,
  last_error      TEXT,
  next_try_at     TEXT NOT NULL,
  given_up        INTEGER NOT NULL DEFAULT 0,
  created_at      TEXT NOT NULL,
  UNIQUE (mailbox_id, provider_msg_id)
);

-- Switches. sending_enabled stays '0' through M1 and M2: there is no sending
-- code in this Worker until the owner authorizes M3. paused='1' stops every
-- automated step, including sync, at once.
CREATE TABLE settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_by TEXT,
  updated_at TEXT
);
INSERT INTO settings (key, value) VALUES ('paused', '0'), ('sending_enabled', '0'), ('ai_enabled', '0');
