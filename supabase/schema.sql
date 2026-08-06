-- =========================================================
--  Ladan / History tutor — Supabase schema
--  Run this once in Supabase Studio -> SQL Editor -> New query
-- =========================================================

-- ---------- 1. Applications (заявки) ----------
create table if not exists public.applications (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),

  name          text not null,
  contact       text not null,

  -- 'pupil' | 'student' | 'adult'
  status        text not null,
  -- 1..11, only for status = 'pupil'
  grade         smallint,

  studied_before boolean not null default false,
  studied_details text,

  -- 'beginner' | 'intermediate' | 'advanced'
  level         text not null,

  -- 'school' | 'exam' | 'self' | 'other'
  goal          text not null,
  goal_other    text,

  -- 'individual' | 'group'
  format        text not null,

  preferred_time text,
  comment        text,

  -- 'pending' | 'processed'
  processing_status text not null default 'pending',

  lang          text not null default 'ru',

  constraint applications_grade_range
    check (grade is null or (grade between 1 and 11)),
  constraint applications_status_chk
    check (status in ('pupil', 'student', 'adult')),
  constraint applications_level_chk
    check (level in ('beginner', 'intermediate', 'advanced')),
  constraint applications_goal_chk
    check (goal in ('school', 'exam', 'self', 'other')),
  constraint applications_format_chk
    check (format in ('individual', 'group')),
  constraint applications_processing_chk
    check (processing_status in ('pending', 'processed'))
);

create index if not exists applications_created_at_idx
  on public.applications (created_at desc);

-- ---------- 2. Availability (свободное время) ----------
create table if not exists public.availability (
  id          uuid primary key default gen_random_uuid(),
  -- 1 = Monday ... 7 = Sunday (ISO)
  weekday     smallint not null,
  start_time  time not null,
  end_time    time not null,
  -- 'online' | 'offline' | 'both'
  mode        text not null default 'both',
  note        text,
  created_at  timestamptz not null default now(),

  constraint availability_weekday_chk check (weekday between 1 and 7),
  constraint availability_time_chk    check (end_time > start_time),
  constraint availability_mode_chk    check (mode in ('online', 'offline', 'both'))
);

create index if not exists availability_weekday_idx
  on public.availability (weekday, start_time);

-- ---------- 3. Row Level Security ----------
-- All database access in this app happens server-side (the keys are never
-- shipped to the browser). RLS is still enabled as a second line of defence.

alter table public.applications enable row level security;
alter table public.availability enable row level security;

-- Anyone (anon role) may submit an application, but may NOT read them back.
drop policy if exists "anon can insert applications" on public.applications;
create policy "anon can insert applications"
  on public.applications for insert to anon
  with check (true);

-- The public availability grid is readable by everyone.
drop policy if exists "anon can read availability" on public.availability;
create policy "anon can read availability"
  on public.availability for select to anon
  using (true);

-- NOTE ON THE ADMIN PANEL
-- The admin panel needs to READ applications, UPDATE their processing status and
-- WRITE availability rows. Pick one of the two options below.
--
-- Option A (recommended): set SUPABASE_SERVICE_ROLE_KEY in the environment.
--   The service_role key bypasses RLS, so no extra policies are needed and the
--   anon key keeps its minimal, write-only-to-applications permissions.
--   Nothing else to run — you are done.
--
-- Option B: use only SUPABASE_ANON_KEY (as in the original spec). Then the anon
--   role needs the extra permissions below. This is acceptable *only* because the
--   anon key never leaves the server in this project, but Option A is safer.
--   Uncomment and run the block below if you choose Option B.
--
-- drop policy if exists "anon can read applications" on public.applications;
-- create policy "anon can read applications"
--   on public.applications for select to anon using (true);
--
-- drop policy if exists "anon can update applications" on public.applications;
-- create policy "anon can update applications"
--   on public.applications for update to anon using (true) with check (true);
--
-- drop policy if exists "anon can write availability" on public.availability;
-- create policy "anon can write availability"
--   on public.availability for all to anon using (true) with check (true);
