-- ==============================================================================
-- SKEMA DATABASE SUPABASE - LARAS NUSANTARA
-- Jalankan skrip ini di SQL Editor dashboard Supabase Anda.
-- ==============================================================================

-- 1. Tabel User Progress (Kemajuan Belajar Pelajar)
create table if not exists public.user_progress (
  email text primary key,
  progress jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.user_progress enable row level security;

-- Policy User Progress: Akses via Service Role atau user itu sendiri
create policy "Users can view their own progress"
  on public.user_progress for select
  using (true);

create policy "Users can update their own progress"
  on public.user_progress for insert
  with check (true);

create policy "Users can modify their own progress"
  on public.user_progress for update
  using (true);

create index if not exists user_progress_updated_at_idx
  on public.user_progress (updated_at desc);


-- 2. Tabel Soal Arcade (Arcade Quiz Questions)
create table if not exists public.arcade_questions (
  id serial primary key,
  question text not null,
  hint text,
  category text not null check (category in ('Kosakata', 'Busana', 'Fonetik Dialek')),
  options jsonb not null,
  correct_index integer not null default 0,
  lore text,
  created_at timestamptz not null default now()
);

alter table public.arcade_questions enable row level security;

-- Policy Arcade Questions: Publik dapat membaca soal
create policy "Public read access for arcade_questions"
  on public.arcade_questions for select
  using (true);


-- 3. Tabel Entri Budaya & Etnolinguistik (Kamus / Kurasi Adat)
create table if not exists public.cultural_entries (
  id text primary key,
  term text not null,
  type text not null,
  category text not null,
  ipa text,
  chapter text,
  module text,
  source text,
  informant text,
  status text not null default 'verified' check (status in ('verified', 'pending', 'disputed', 'draft')),
  gating text not null default 'published' check (gating in ('published', 'blocked', 'educational_note')),
  thumbnail text,
  icon text,
  created_at timestamptz not null default now()
);

alter table public.cultural_entries enable row level security;

-- Policy Cultural Entries: Publik dapat membaca entri yang terbit
create policy "Public read access for cultural_entries"
  on public.cultural_entries for select
  using (true);


-- 4. Tabel Modul Belajar (Lessons / Sessions)
create table if not exists public.lessons (
  id integer primary key,
  slug text not null unique,
  title text not null,
  subtitle text,
  region text,
  intro text,
  reward_xp integer not null default 20,
  badge text,
  source jsonb,
  questions jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.lessons enable row level security;

-- Policy Lessons: Publik dapat membaca modul belajar
create policy "Public read access for lessons"
  on public.lessons for select
  using (true);