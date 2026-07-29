-- ============================================================
-- GDG NIT Hamirpur — Supabase Schema
-- Table 1: members (community membership)
-- Table 2: sophomore_interviews (interview form submissions)
-- ============================================================

-- ─────────────────────────────────────────────
-- TABLE 1: members
-- ─────────────────────────────────────────────
CREATE TABLE if not exist members (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID REFERENCES auth.users(id) NOT NULL UNIQUE,
  name          TEXT NOT NULL,
  linkedin      TEXT,
  github        TEXT,
  rollno        TEXT,
  branch        TEXT,
  year          TEXT,
  contact_no    TEXT,
  created_at    TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- Allow authenticated insert
CREATE POLICY "Allow authenticated insert on members"
  ON members FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow authenticated update
CREATE POLICY "Allow authenticated update on members"
  ON members FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow public read on members
CREATE POLICY "Allow public read on members"
  ON members FOR SELECT
  TO public
  USING (true);


-- ─────────────────────────────────────────────
-- TABLE 2: sophomore_interviews
-- ─────────────────────────────────────────────
CREATE TABLE if not exist sophomore_interviews (
  id                      UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  submitted_at            TIMESTAMPTZ DEFAULT now() NOT NULL,

  -- Personal Info
  email                   TEXT NOT NULL,
  name                    TEXT NOT NULL,
  roll_no                 TEXT NOT NULL,
  contact_no              TEXT NOT NULL,

  -- Domain Preferences
  technical_domains       TEXT[] NOT NULL,          -- multi-select → array
  non_technical_domain    TEXT NOT NULL,             -- single select

  -- Skills & Experience
  skills                  TEXT,                      -- free-text list of skills/tools
  technical_proficiency   INTEGER CHECK (technical_proficiency BETWEEN 1 AND 10),
  prior_experience        TEXT,                      -- projects / experience description
  hackathon_participation BOOLEAN DEFAULT false,
  hackathon_details       TEXT,                      -- event names & role/achievement

  -- Motivation
  why_join_gdg            TEXT NOT NULL,
  expectations            TEXT,

  -- Availability & History
  available_year_round    BOOLEAN DEFAULT true,
  attended_gdg_events     BOOLEAN DEFAULT false,
  attended_events_list    TEXT,                      -- which events attended
  part_of_other_clubs     BOOLEAN DEFAULT false,
  other_clubs_details     TEXT,                      -- club names & responsibilities

  -- Resume
  resume_url              TEXT,                      -- URL to uploaded resume file

  -- Confirmation
  confirmed_accurate      BOOLEAN DEFAULT false NOT NULL,

  created_at              TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE sophomore_interviews ENABLE ROW LEVEL SECURITY;

-- Allow inserts for anyone (anon and authenticated)
CREATE POLICY "Allow public insert on sophomore_interviews"
  ON sophomore_interviews FOR INSERT
  TO public
  WITH CHECK (true);

-- Restrict reads to authenticated users only (admin/team leads)
CREATE POLICY "Allow authenticated read on sophomore_interviews"
  ON sophomore_interviews FOR SELECT
  TO authenticated
  USING (true);
