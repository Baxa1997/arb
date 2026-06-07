-- ============================================================
-- Migration 0001 — Lesson pronunciation audio (super-admin managed)
-- Run this in the Supabase SQL editor on an existing project.
-- Safe to run more than once (idempotent).
--
-- Adds:
--   1. letter_content.audio_url  — the voice recording per letter
--   2. lesson-audio storage bucket + policies
--      (super-admin uploads, everyone can read)
-- ============================================================

-- 1. Column for the pronunciation recording.
alter table public.letter_content
  add column if not exists audio_url text;

-- 2. Public bucket for lesson audio.
insert into storage.buckets (id, name, public)
values ('lesson-audio', 'lesson-audio', true)
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
