-- ============================================================
--  Arabic Education Center — Supabase schema
--  Run this in the Supabase SQL editor (one time).
-- ============================================================

-- ---------- USER PROFILES ----------------------------------
create table if not exists public.user_profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  role        text not null default 'student'
              check (role in ('super_admin','teacher','student')),
  full_name   text,
  email       text,
  teacher_id  uuid references public.user_profiles(id) on delete set null, -- student -> owning teacher
  created_by  uuid references public.user_profiles(id) on delete set null,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ---------- STUDENT PROGRESS (unlock track) ----------------
-- One row per (student, letter). status drives the lock UI.
create table if not exists public.student_progress (
  id           uuid primary key default gen_random_uuid(),
  student_id   uuid not null references public.user_profiles(id) on delete cascade,
  letter_id    int  not null,                 -- 1..28 (matches src/data/letters.js)
  status       text not null default 'locked'
               check (status in ('locked','current','done')),
  completed_at timestamptz,
  created_at   timestamptz not null default now(),
  unique (student_id, letter_id)
);

-- ---------- HOMEWORK ---------------------------------------
create table if not exists public.homework (
  id            uuid primary key default gen_random_uuid(),
  teacher_id    uuid not null references public.user_profiles(id) on delete cascade,
  student_id    uuid not null references public.user_profiles(id) on delete cascade,
  letter_id     int,                          -- optional link to a letter/lesson
  title         text not null,
  instructions  text,
  allowed_types text[] not null default '{text,image,audio}', -- which submission types are allowed
  due_date      date,
  created_at    timestamptz not null default now()
);

-- ---------- HOMEWORK SUBMISSIONS ---------------------------
create table if not exists public.homework_submissions (
  id                 uuid primary key default gen_random_uuid(),
  homework_id        uuid not null references public.homework(id) on delete cascade,
  student_id         uuid not null references public.user_profiles(id) on delete cascade,
  content_text       text,
  file_url           text,                    -- image / screenshot (homework-images bucket)
  audio_url          text,                    -- voice recording (homework-audio bucket)
  time_spent_seconds int  not null default 0, -- how long the student worked
  started_at         timestamptz,
  submitted_at       timestamptz,
  status             text not null default 'in_progress'
                     check (status in ('in_progress','submitted','graded')),
  teacher_grade      text,
  teacher_feedback   text,
  graded_at          timestamptz,
  unique (homework_id, student_id)
);

-- ---------- INDEXES ----------------------------------------
create index if not exists idx_profiles_teacher on public.user_profiles(teacher_id);
create index if not exists idx_progress_student on public.student_progress(student_id);
create index if not exists idx_homework_student on public.homework(student_id);
create index if not exists idx_homework_teacher on public.homework(teacher_id);
create index if not exists idx_submissions_hw    on public.homework_submissions(homework_id);

-- ---------- LETTER CONTENT (admin-editable) ----------------
-- Per-letter overrides edited by the super-admin. The fixed structure
-- (Arabic char, forms, makhraj diagram, quiz) stays in src/data/letters.js;
-- these fields override the editable text/media at runtime.
create table if not exists public.letter_content (
  letter_id   int primary key check (letter_id between 1 and 28),
  description text,
  video_url   text,
  audio_url   text,                                -- pronunciation recording (lesson-audio bucket)
  examples    text,                                -- example words shown in the lesson
  form_note   text,
  extra_note  text,
  updated_at  timestamptz not null default now(),
  updated_by  uuid references public.user_profiles(id) on delete set null
);

-- Add columns for existing installs (no-op if already present).
alter table public.letter_content add column if not exists audio_url text;
alter table public.letter_content add column if not exists examples  text;

alter table public.letter_content enable row level security;

drop policy if exists "letter_content read"  on public.letter_content;
drop policy if exists "letter_content admin"  on public.letter_content;

-- Any signed-in user can read content; only super-admins can write it.
create policy "letter_content read" on public.letter_content
  for select to authenticated using (true);

create policy "letter_content admin" on public.letter_content
  for all using (public.is_super_admin()) with check (public.is_super_admin());

-- ============================================================
--  Helper: is the current user a super_admin?
-- ============================================================
create or replace function public.is_super_admin()
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from public.user_profiles
    where id = auth.uid() and role = 'super_admin'
  );
$$;

-- Helper: teacher_id of a given student
create or replace function public.owning_teacher(p_student uuid)
returns uuid language sql security definer stable as $$
  select teacher_id from public.user_profiles where id = p_student;
$$;

-- ============================================================
--  Auto-create profile row on signup
--  (role/full_name/teacher_id passed via auth metadata)
-- ============================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.user_profiles (id, email, role, full_name, teacher_id, created_by)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'student'),
    new.raw_user_meta_data->>'full_name',
    nullif(new.raw_user_meta_data->>'teacher_id','')::uuid,
    nullif(new.raw_user_meta_data->>'created_by','')::uuid
  );

  -- Seed letter 1 as the current lesson for new students
  if coalesce(new.raw_user_meta_data->>'role','student') = 'student' then
    insert into public.student_progress (student_id, letter_id, status)
    values (new.id, 1, 'current')
    on conflict (student_id, letter_id) do nothing;
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
--  Mark current letter done -> unlock next letter
-- ============================================================
create or replace function public.mark_letter_done(p_student uuid, p_letter int)
returns void language plpgsql security definer as $$
begin
  update public.student_progress
     set status = 'done', completed_at = now()
   where student_id = p_student and letter_id = p_letter;

  if p_letter < 28 then
    insert into public.student_progress (student_id, letter_id, status)
    values (p_student, p_letter + 1, 'current')
    on conflict (student_id, letter_id)
      do update set status = 'current'
      where public.student_progress.status = 'locked';
  end if;
end;
$$;

-- ============================================================
--  Row Level Security
-- ============================================================
alter table public.user_profiles         enable row level security;
alter table public.student_progress      enable row level security;
alter table public.homework              enable row level security;
alter table public.homework_submissions  enable row level security;

-- ----- user_profiles -----
drop policy if exists "profiles self read"        on public.user_profiles;
drop policy if exists "profiles admin all"        on public.user_profiles;
drop policy if exists "profiles teacher students" on public.user_profiles;
drop policy if exists "profiles self update"      on public.user_profiles;

create policy "profiles self read" on public.user_profiles
  for select using (id = auth.uid());

create policy "profiles admin all" on public.user_profiles
  for all using (public.is_super_admin()) with check (public.is_super_admin());

-- teacher can read their own students
create policy "profiles teacher students" on public.user_profiles
  for select using (teacher_id = auth.uid());

create policy "profiles self update" on public.user_profiles
  for update using (id = auth.uid());

-- ----- student_progress -----
drop policy if exists "progress student own"   on public.student_progress;
drop policy if exists "progress teacher view"  on public.student_progress;
drop policy if exists "progress teacher write" on public.student_progress;

create policy "progress student own" on public.student_progress
  for select using (student_id = auth.uid());

create policy "progress teacher view" on public.student_progress
  for select using (public.owning_teacher(student_id) = auth.uid());

create policy "progress teacher write" on public.student_progress
  for all using (public.owning_teacher(student_id) = auth.uid())
  with check (public.owning_teacher(student_id) = auth.uid());

-- ----- homework -----
drop policy if exists "homework student read"  on public.homework;
drop policy if exists "homework teacher all"   on public.homework;

create policy "homework student read" on public.homework
  for select using (student_id = auth.uid());

create policy "homework teacher all" on public.homework
  for all using (teacher_id = auth.uid()) with check (teacher_id = auth.uid());

-- ----- homework_submissions -----
drop policy if exists "subs student own"     on public.homework_submissions;
drop policy if exists "subs teacher view"    on public.homework_submissions;
drop policy if exists "subs teacher grade"   on public.homework_submissions;

create policy "subs student own" on public.homework_submissions
  for all using (student_id = auth.uid()) with check (student_id = auth.uid());

create policy "subs teacher view" on public.homework_submissions
  for select using (
    exists (select 1 from public.homework h
            where h.id = homework_id and h.teacher_id = auth.uid())
  );

create policy "subs teacher grade" on public.homework_submissions
  for update using (
    exists (select 1 from public.homework h
            where h.id = homework_id and h.teacher_id = auth.uid())
  );

-- ============================================================
--  Storage buckets (run once; ignore errors if they exist)
-- ============================================================
insert into storage.buckets (id, name, public)
values ('homework-images','homework-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('homework-audio','homework-audio', true)
on conflict (id) do nothing;

-- Lesson pronunciation recordings uploaded by the super-admin.
insert into storage.buckets (id, name, public)
values ('lesson-audio','lesson-audio', true)
on conflict (id) do nothing;

-- Only super-admins manage lesson audio; everyone can read it.
drop policy if exists "lesson audio admin" on storage.objects;
create policy "lesson audio admin" on storage.objects
  for all to authenticated
  using (bucket_id = 'lesson-audio' and public.is_super_admin())
  with check (bucket_id = 'lesson-audio' and public.is_super_admin());

drop policy if exists "lesson audio read" on storage.objects;
create policy "lesson audio read" on storage.objects
  for select using (bucket_id = 'lesson-audio');

-- Authenticated users can upload to their own folder (<uid>/...)
drop policy if exists "hw images upload" on storage.objects;
create policy "hw images upload" on storage.objects
  for insert to authenticated
  with check (
    bucket_id in ('homework-images','homework-audio')
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "hw images read" on storage.objects;
create policy "hw images read" on storage.objects
  for select to authenticated
  using (bucket_id in ('homework-images','homework-audio'));

-- ============================================================
--  Bootstrap the first super admin (run AFTER creating the
--  auth user, replacing the email below):
--
--  update public.user_profiles set role = 'super_admin'
--   where email = 'admin@arabic-center.uz';
-- ============================================================
