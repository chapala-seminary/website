-- Both methods confirm the same challenge; only a hash of the link is kept.
ALTER TABLE email_challenges ADD COLUMN link_hash TEXT;
CREATE UNIQUE INDEX email_challenge_link ON email_challenges(link_hash)
  WHERE link_hash IS NOT NULL;
