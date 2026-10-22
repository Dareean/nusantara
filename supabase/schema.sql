create table if not exists public.user_progress (
  email text primary key,
  progress jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.user_progress enable row level security;

revoke all on table public.user_progress from anon, authenticated;

create index if not exists user_progress_updated_at_idx
  on public.user_progress (updated_at desc);

-- Tabel content_sessions (Fix 13: Konten Server)
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

create index if not exists content_sessions_status_idx
  on public.content_sessions (status);

create index if not exists content_sessions_updated_at_idx
  on public.content_sessions (updated_at desc);

alter table public.content_sessions enable row level security;
revoke all on table public.content_sessions from anon, authenticated;

-- Tabel content_entries (Fix 13: Korpus CMS)
create table if not exists public.content_entries (
  id text primary key,
  kind text not null,
  payload jsonb not null,
  status text not null default 'published' check (status in ('draft', 'published')),
  updated_at timestamptz not null default now()
);

create index if not exists content_entries_status_idx
  on public.content_entries (status);

alter table public.content_entries enable row level security;
revoke all on table public.content_entries from anon, authenticated;