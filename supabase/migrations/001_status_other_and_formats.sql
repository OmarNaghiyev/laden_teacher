-- Добавляет status = 'other' и разбивает format на 4 варианта
-- (индивидуально/группа x очно/онлайн).
-- Выполнить в Supabase Studio -> SQL Editor на уже созданной базе.

alter table public.applications
  drop constraint if exists applications_status_chk;

alter table public.applications
  add constraint applications_status_chk
  check (status in ('pupil', 'student', 'adult', 'other'));

alter table public.applications
  drop constraint if exists applications_format_chk;

-- Старые значения переносим на очный вариант.
update public.applications set format = 'individual_offline' where format = 'individual';
update public.applications set format = 'group_offline'      where format = 'group';

alter table public.applications
  add constraint applications_format_chk
  check (format in ('individual_offline', 'individual_online',
                    'group_offline', 'group_online'));
