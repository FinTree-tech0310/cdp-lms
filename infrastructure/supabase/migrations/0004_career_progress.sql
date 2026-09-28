-- ============================================================
-- CDP learning-space — career syllabus progress
-- Run against your Supabase project (SQL editor or supabase db push).
-- The careers page keeps progress on this device until the table
-- exists, then syncs with it — see /api/careers/[careerId]/progress.
--
-- Per-item watched/taken state for the /careers syllabus
-- ("Career in Investment Banking"), plus the credit ledger that
-- stops a lecture from being counted towards today's learning
-- minutes twice.
-- Idempotent — safe to run more than once.
-- ============================================================

create table if not exists public.career_progress (
  user_id          uuid not null references auth.users (id) on delete cascade,
  career_id        text not null,              -- 'investment-banking', ...
  section_id       text not null,              -- 'ib-2'
  item_id          text not null,              -- 'ib-2-l4' / 'ib-2-quiz'
  item_kind        text not null check (item_kind in ('lecture', 'quiz')),
  completed        boolean not null default false,
  -- Seconds already credited to learning_activity for this item; a
  -- watched → unwatched → watched loop must not double-bill the clock.
  credited_seconds int not null default 0 check (credited_seconds >= 0),
  completed_at     timestamptz,
  updated_at       timestamptz not null default now(),
  primary key (user_id, career_id, item_id)
);

create index if not exists career_progress_user_career_idx
  on public.career_progress (user_id, career_id);

alter table public.career_progress enable row level security;

drop policy if exists "own_rows" on public.career_progress;
create policy "own_rows" on public.career_progress
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
