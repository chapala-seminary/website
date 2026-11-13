-- CTS Correspondence Console, M2/M3 (issue #163; Wayne, 23 Oct 2026):
--   1. read ALL six connected Gmail accounts, the personal ones included,
--      keeping only seminary mail from the personal ones;
--   2. answer routine student questions automatically, from approved
--      templates only, from one sending account.
--
-- Nothing here turns sending on. settings.auto_send starts 'off'; the owner
-- moves it to 'shadow' (write what would be sent, send nothing) and then to
-- 'live' from the console, and each template must be approved first.

-- personal = 1: a personal account. Only messages that are about the seminary
-- are stored from it; everything else is not read into the ledger at all.
ALTER TABLE mailboxes ADD COLUMN personal INTEGER NOT NULL DEFAULT 0;

-- The same email reaching two mailboxes (forwarding, CC, an outreach copy) is
-- one message: the second copy points at the first and does nothing else.
ALTER TABLE messages ADD COLUMN copy_of INTEGER REFERENCES messages(id);

-- Personal-mailbox messages that are not about the seminary: only the ids,
-- so the next run does not fetch them again. No sender, subject or text.
CREATE TABLE skipped_messages (
  mailbox_id      TEXT NOT NULL,
  provider_msg_id TEXT NOT NULL,
  at              TEXT NOT NULL,
  PRIMARY KEY (mailbox_id, provider_msg_id)
);

-- Every automatic reply, planned, shadowed, sent, blocked or superseded.
-- idem_key is the trigger message's identity: one automatic answer per
-- message, ever, whatever retries or second mailboxes do.
CREATE TABLE auto_replies (
  id               INTEGER PRIMARY KEY,
  idem_key         TEXT NOT NULL UNIQUE,
  case_id          INTEGER NOT NULL REFERENCES cases(id),
  message_id       INTEGER NOT NULL REFERENCES messages(id),   -- the student's message
  contact_id       INTEGER NOT NULL REFERENCES contacts(id),
  intents          TEXT NOT NULL,                              -- comma list of template ids
  template_version TEXT NOT NULL,                              -- hash of the exact texts used
  policy_version   TEXT NOT NULL,
  language         TEXT NOT NULL,
  to_addr          TEXT NOT NULL,
  subject          TEXT,
  body             TEXT,
  status           TEXT NOT NULL CHECK (status IN
                   ('pending','shadow','sending','sent','blocked','superseded','failed','unknown','cancelled')),
  reason           TEXT,                                       -- why blocked / superseded / failed
  not_before       TEXT NOT NULL,                              -- wait, so a person or another assistant can answer first
  sent_provider_id TEXT,
  created_at       TEXT NOT NULL,
  updated_at       TEXT NOT NULL
);
CREATE INDEX auto_replies_due ON auto_replies (status, not_before);
CREATE INDEX auto_replies_contact ON auto_replies (contact_id, status, updated_at);

INSERT INTO settings (key, value) VALUES
  ('auto_send', 'off'),            -- off | shadow | live
  ('auto_daily_cap', '40'),        -- automatic replies per day, all students together
  ('auto_delay_min', '30'),        -- minutes to wait after the student's message
  ('approved_templates', '{}');    -- {"template_id": "version"}: the owner's approvals
