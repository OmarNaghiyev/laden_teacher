-- Схема БД. Выполнить один раз в Supabase Studio -> SQL Editor.

create table if not exists public.applications (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),

  name          text not null,
  contact       text not null,

  status        text not null,
  grade         smallint,

  studied_before boolean not null default false,
  studied_details text,

  level         text not null,

  goal          text not null,
  goal_other    text,

  format        text not null,

  preferred_time text,
  comment        text,

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

-- weekday: 1 = понедельник ... 7 = воскресенье (ISO)
create table if not exists public.availability (
  id          uuid primary key default gen_random_uuid(),
  weekday     smallint not null,
  start_time  time not null,
  end_time    time not null,
  mode        text not null default 'both',
  note        text,
  created_at  timestamptz not null default now(),

  constraint availability_weekday_chk check (weekday between 1 and 7),
  constraint availability_time_chk    check (end_time > start_time),
  constraint availability_mode_chk    check (mode in ('online', 'offline', 'both'))
);

create index if not exists availability_weekday_idx
  on public.availability (weekday, start_time);

-- RLS. Вся работа с БД идёт с сервера, это второй контур защиты.
alter table public.applications enable row level security;
alter table public.availability enable row level security;

drop policy if exists "anon can insert applications" on public.applications;
create policy "anon can insert applications"
  on public.applications for insert to anon
  with check (true);

drop policy if exists "anon can read availability" on public.availability;
create policy "anon can read availability"
  on public.availability for select to anon
  using (true);

-- Админке нужно читать заявки, менять их статус и писать availability.
-- Вариант по умолчанию: задать SUPABASE_SERVICE_ROLE_KEY — он обходит RLS,
-- и anon-ключ остаётся с минимальными правами.
--
-- Если работать только с anon-ключом, доп. права ниже:
--
-- create policy "anon can read applications"
--   on public.applications for select to anon using (true);
-- create policy "anon can update applications"
--   on public.applications for update to anon using (true) with check (true);
-- create policy "anon can write availability"
--   on public.availability for all to anon using (true) with check (true);
