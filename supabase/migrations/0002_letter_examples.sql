-- ============================================================
-- Migration 0002 — Lesson examples (super-admin managed)
-- Run this in the Supabase SQL editor on an existing project.
-- Safe to run more than once (idempotent).
--
-- Adds letter_content.examples — example words per letter, shown to both
-- students and teachers in the lesson view ("Misollar" section).
-- ============================================================

alter table public.letter_content
  add column if not exists examples text;
