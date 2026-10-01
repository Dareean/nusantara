create table if not exists public.user_progress (
  email text primary key,
  progress jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.user_progress enable row level security;

revoke all on table public.user_progress from anon, authenticated;

create index if not exists user_progress_updated_at_idx
  on public.user_progress (updated_at desc);