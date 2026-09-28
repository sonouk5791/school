-- Run once on the institution's PostgreSQL database before enabling scheduled jobs.
-- One tenant per deployment. Credentials and admin sessions are never sent to the browser.
CREATE TABLE IF NOT EXISTS school_operations (
  id text PRIMARY KEY,
  body jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
INSERT INTO school_operations (id, body) VALUES ('institution', '{}'::jsonb)
ON CONFLICT (id) DO NOTHING;
