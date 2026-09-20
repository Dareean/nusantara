-- ============================================================
-- NUSANTARA: BEFORE IT'S GONE — DATABASE SCHEMA
-- Target: PostgreSQL 15+ (Supabase)
-- Notes:
--   - uuid primary keys via gen_random_uuid() (pgcrypto)
--   - RLS (Row Level Security) hooks noted per Cultural Consent
--   - timestamps in UTC, app converts to Asia/Makassar (WITA) client-side
-- ============================================================

create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- 1. USERS & ROLES
-- ------------------------------------------------------------

create type user_role as enum ('learner', 'holder', 'organization', 'admin');

create table users (
  id                uuid primary key default gen_random_uuid(),
  auth_user_id       uuid unique,              -- maps to Supabase auth.users.id
  full_name         text not null,
  email             text unique not null,
  role              user_role not null default 'learner',
  avatar_url        text,
  location_city     text,
  location_region   text,
  languages         text[] default '{}',       -- e.g. {'Bahasa Indonesia','Kaili'}
  bio               text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- Extra profile fields specific to cultural holders
create table cultural_holder_profiles (
  user_id           uuid primary key references users(id) on delete cascade,
  expertise_summary text,
  years_of_practice int,
  availability      text,               -- free text or structured JSON later
  teaching_methods  text[] default '{}',-- e.g. {'in-person','video-call','workshop'}
  verified          boolean not null default false,
  created_at        timestamptz not null default now()
);

-- Cultural organizations (secondary/tertiary users, supporting role)
create table organizations (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  type              text,               -- 'community' | 'school' | 'campus' | 'museum' | 'government'
  region            text,
  contact_user_id   uuid references users(id),
  created_at        timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 2. KNOWLEDGE (top-level cultural entity, e.g. "Tenun Sekomandi")
-- ------------------------------------------------------------

create type consent_level as enum (
  'public', 'community_only', 'apprentice_only', 'restricted', 'do_not_document'
);

create type risk_level as enum ('healthy', 'warning', 'high', 'critical');

create table knowledge (
  id                uuid primary key default gen_random_uuid(),
  title             text not null,                 -- "Tenun Sekomandi"
  category          text,                           -- 'craft' | 'language' | 'music' | 'culinary' | 'ritual' | 'oral_story' | 'other'
  region            text,                           -- origin region/ethnic group
  summary           text,
  cover_media_url   text,
  consent_level     consent_level not null default 'public',
  organization_id   uuid references organizations(id),
  created_by        uuid references users(id),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
-- RLS: SELECT allowed only if consent_level = 'public'
--      OR requester has an approved apprenticeship/community membership for this knowledge
--      OR requester.role = 'admin'

-- ------------------------------------------------------------
-- 3. KNOWLEDGE DNA (structured sub-nodes of a knowledge entity)
-- ------------------------------------------------------------

create type dna_node_type as enum (
  'technique', 'knowledge_fact', 'meaning', 'story', 'people', 'variation', 'warning', 'terminology'
);

create table knowledge_dna_nodes (
  id                uuid primary key default gen_random_uuid(),
  knowledge_id      uuid not null references knowledge(id) on delete cascade,
  node_type         dna_node_type not null,
  title             text not null,          -- e.g. "Memintal" under technique
  content           text,
  order_index       int default 0,
  parent_node_id    uuid references knowledge_dna_nodes(id) on delete cascade, -- optional nesting
  created_at        timestamptz not null default now()
);

-- Links a knowledge_dna_node of type 'people' to an actual holder/user record
create table knowledge_people_links (
  id                uuid primary key default gen_random_uuid(),
  dna_node_id       uuid not null references knowledge_dna_nodes(id) on delete cascade,
  user_id           uuid references users(id),   -- nullable if the person is deceased/not on platform
  external_name     text,                          -- fallback name if not a platform user
  role_in_knowledge text                            -- 'originator' | 'current_holder' | 'contributor'
);

-- ------------------------------------------------------------
-- 4. KNOWLEDGE AT RISK / RISK RADAR
-- ------------------------------------------------------------

create table knowledge_risk_snapshots (
  id                    uuid primary key default gen_random_uuid(),
  knowledge_id          uuid not null references knowledge(id) on delete cascade,
  known_practitioners    int not null default 0,
  apprentice_count      int not null default 0,
  documentation_pct     numeric(5,2) not null default 0,   -- 0-100
  risk_level            risk_level not null default 'warning',
  computed_at           timestamptz not null default now(),
  notes                 text
);
-- Latest snapshot per knowledge = current displayed risk.
-- risk_level computation (reference formula, app-side or DB function):
--   score = w1*(1/max(known_practitioners,0.5)) + w2*(1/max(apprentice_count+1,1)) + w3*(1 - documentation_pct/100)
--   critical: score high & known_practitioners <= 1
--   thresholds tunable; kept in application config, not hardcoded in DB

-- What is lost if this knowledge disappears (used on "IF LOST" cards)
create table knowledge_risk_impact_items (
  id                uuid primary key default gen_random_uuid(),
  knowledge_id      uuid not null references knowledge(id) on delete cascade,
  item_label        text not null   -- 'Technique' | 'Terminology' | 'Variation' | 'Oral history' | 'Philosophy' | 'Context'
);

-- ------------------------------------------------------------
-- 5. CAPTURE MEMORY (guided interviews -> raw material for DNA)
-- ------------------------------------------------------------

create table interview_sessions (
  id                uuid primary key default gen_random_uuid(),
  knowledge_id      uuid references knowledge(id) on delete set null, -- may be null if creating new knowledge from this interview
  interviewer_id    uuid not null references users(id),
  holder_id         uuid references users(id),           -- interviewee, if platform user
  holder_external_name text,                               -- if interviewee not a platform user
  raw_transcript    text,
  audio_url         text,
  video_url         text,
  status            text not null default 'draft',        -- 'draft' | 'structuring' | 'structured' | 'published'
  created_at        timestamptz not null default now()
);

create table interview_questions_asked (
  id                    uuid primary key default gen_random_uuid(),
  interview_session_id  uuid not null references interview_sessions(id) on delete cascade,
  question_text         text not null,
  answer_text           text,
  order_index            int default 0
);

-- Output of AI structuring: links interview -> generated DNA nodes, for traceability/audit
create table interview_dna_outputs (
  id                    uuid primary key default gen_random_uuid(),
  interview_session_id  uuid not null references interview_sessions(id) on delete cascade,
  dna_node_id           uuid not null references knowledge_dna_nodes(id) on delete cascade,
  confidence_score      numeric(4,3),          -- optional, from LLM output
  reviewed_by_human     boolean not null default false
);

-- ------------------------------------------------------------
-- 6. TEACH ME (learning paths & progress)
-- ------------------------------------------------------------

create table learning_paths (
  id                uuid primary key default gen_random_uuid(),
  knowledge_id      uuid not null references knowledge(id) on delete cascade,
  title             text not null,
  description       text,
  created_at        timestamptz not null default now()
);

create table learning_path_steps (
  id                uuid primary key default gen_random_uuid(),
  learning_path_id  uuid not null references learning_paths(id) on delete cascade,
  step_number       int not null,
  title             text not null,      -- "Kenali bahan", "Pahami makna", ...
  description       text,
  related_dna_node_id uuid references knowledge_dna_nodes(id)
);

create table user_learning_progress (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references users(id) on delete cascade,
  learning_path_id  uuid not null references learning_paths(id) on delete cascade,
  current_step_number int not null default 0,
  completed         boolean not null default false,
  started_at        timestamptz not null default now(),
  completed_at      timestamptz,
  unique (user_id, learning_path_id)
);

-- ------------------------------------------------------------
-- 7. FIND MY MENTOR (matching)
-- ------------------------------------------------------------

create table mentor_match_requests (
  id                uuid primary key default gen_random_uuid(),
  learner_id        uuid not null references users(id) on delete cascade,
  knowledge_id      uuid not null references knowledge(id) on delete cascade,
  preferred_language text,
  preferred_method  text,     -- 'in-person' | 'video-call' | 'workshop'
  status            text not null default 'open',  -- 'open' | 'matched' | 'closed'
  created_at        timestamptz not null default now()
);

create table mentor_match_results (
  id                uuid primary key default gen_random_uuid(),
  match_request_id  uuid not null references mentor_match_requests(id) on delete cascade,
  holder_id         uuid not null references users(id),
  match_score       numeric(5,2),      -- 0-100, heuristic or ML-derived
  score_breakdown   jsonb,             -- {"expertise":0.4,"location":0.2,"language":0.2,"availability":0.2}
  created_at        timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 8. BECOME THE NEXT (apprenticeship & lineage)
-- ------------------------------------------------------------

create type carrier_status as enum ('learner', 'apprentice', 'verified_carrier');

create table apprenticeships (
  id                uuid primary key default gen_random_uuid(),
  learner_id        uuid not null references users(id) on delete cascade,
  holder_id         uuid references users(id),
  knowledge_id      uuid not null references knowledge(id) on delete cascade,
  status            carrier_status not null default 'learner',
  started_at        timestamptz not null default now(),
  verified_at       timestamptz,
  verified_by       uuid references users(id),   -- holder or org admin who verified
  verification_notes text
);

-- Historical lineage entries for the "Knowledge Lineage" timeline
create table knowledge_lineage_entries (
  id                uuid primary key default gen_random_uuid(),
  knowledge_id      uuid not null references knowledge(id) on delete cascade,
  person_name       text not null,       -- may or may not map to a platform user
  person_user_id    uuid references users(id),
  era_label         text,                 -- "1948", "1974", "2026" — free text to allow approx dates
  role_description  text,                 -- "originator", "apprentice of Pa' Datu", etc.
  order_index       int not null default 0
);

-- ------------------------------------------------------------
-- 9. CULTURAL CONSENT (access control, ties to knowledge.consent_level)
-- ------------------------------------------------------------

create table consent_grants (
  id                uuid primary key default gen_random_uuid(),
  knowledge_id      uuid not null references knowledge(id) on delete cascade,
  grantee_user_id   uuid references users(id),          -- specific person granted extra access
  grantee_org_id    uuid references organizations(id),  -- or a whole org/community
  access_level      consent_level not null,
  granted_by        uuid not null references users(id), -- holder or org admin
  granted_at        timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 10. INDEXES
-- ------------------------------------------------------------

create index idx_knowledge_category on knowledge(category);
create index idx_knowledge_consent on knowledge(consent_level);
create index idx_dna_nodes_knowledge on knowledge_dna_nodes(knowledge_id);
create index idx_dna_nodes_type on knowledge_dna_nodes(node_type);
create index idx_risk_snapshots_knowledge on knowledge_risk_snapshots(knowledge_id, computed_at desc);
create index idx_progress_user on user_learning_progress(user_id);
create index idx_apprenticeships_knowledge on apprenticeships(knowledge_id);
create index idx_apprenticeships_status on apprenticeships(status);
create index idx_lineage_knowledge on knowledge_lineage_entries(knowledge_id, order_index);

-- ------------------------------------------------------------
-- 11. VIEW: current risk per knowledge (latest snapshot only)
-- ------------------------------------------------------------

create view v_knowledge_current_risk as
select distinct on (knowledge_id)
  knowledge_id, known_practitioners, apprentice_count, documentation_pct, risk_level, computed_at
from knowledge_risk_snapshots
order by knowledge_id, computed_at desc;

-- ------------------------------------------------------------
-- 12. ROW LEVEL SECURITY (enable + example policy sketch)
-- ------------------------------------------------------------
-- Enable RLS on sensitive tables; actual policies are written in Supabase
-- using auth.uid() mapped through users.auth_user_id.

alter table knowledge enable row level security;
alter table knowledge_dna_nodes enable row level security;

-- Example (adjust to Supabase auth.uid() helper in real project):
-- create policy "public knowledge is readable by everyone"
--   on knowledge for select
--   using (consent_level = 'public');
--
-- create policy "restricted knowledge readable by grantees or admins"
--   on knowledge for select
--   using (
--     consent_level != 'public' and (
--       exists (select 1 from consent_grants cg
--               join users u on u.id = cg.grantee_user_id
--               where cg.knowledge_id = knowledge.id and u.auth_user_id = auth.uid())
--       or exists (select 1 from users u where u.auth_user_id = auth.uid() and u.role = 'admin')
--     )
--   );
