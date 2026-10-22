-- =============================================================================
-- FIX 13: KONTEN SERVER (Pola Platform Konten ala Duolingo, Skala LARAS)
-- Skema tabel content_sessions dan content_entries
-- =============================================================================

-- 1. Tabel content_sessions
create table if not exists public.content_sessions (
  id text primary key,
  title text not null,
  payload jsonb not null,
  status text not null default 'published' check (status in ('draft', 'published')),
  version int not null default 1,
  created_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indeks pada status untuk query cepat
create index if not exists content_sessions_status_idx
  on public.content_sessions (status);

create index if not exists content_sessions_updated_at_idx
  on public.content_sessions (updated_at desc);

-- RLS: aktifkan dan tolak akses langsung anon/authenticated (akses lewat service role di API server)
alter table public.content_sessions enable row level security;
revoke all on table public.content_sessions from anon, authenticated;

-- 2. Tabel content_entries (korpus CMS admin)
create table if not exists public.content_entries (
  id text primary key,
  kind text not null,
  payload jsonb not null,
  status text not null default 'published' check (status in ('draft', 'published')),
  updated_at timestamptz not null default now()
);

-- Indeks pada status untuk query cepat
create index if not exists content_entries_status_idx
  on public.content_entries (status);

-- RLS: aktifkan dan tolak akses langsung anon/authenticated
alter table public.content_entries enable row level security;
revoke all on table public.content_entries from anon, authenticated;
