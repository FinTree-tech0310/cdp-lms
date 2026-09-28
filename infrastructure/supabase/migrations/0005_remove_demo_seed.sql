-- ============================================================
-- CDP learning-space — drop the synthetic per-user starting state
-- Run against your Supabase project (SQL editor or supabase db push).
-- Idempotent — safe to run more than once.
--
-- Until now every account was born on day 12 with 3 of 8 Equity
-- modules done, 1 of 7 IB, 2 quizzes, 2 badges, career-fit 15% and
-- 12 days of streak history. This migration removes that picture:
--   1. nothing is seeded on signup any more,
--   2. the rows the seeds already wrote are zeroed.
-- Every number on the dashboard is then only what the learner did.
--
-- Shared catalog (tracks, modules, badges, expinar event) is kept —
-- that is reference data, not user progress.
-- ============================================================

-- ---------- 1. Stop seeding on signup ----------
drop trigger if exists provision_demo_dashboard on auth.users;
drop trigger if exists provision_demo_activity on auth.users;

drop function if exists public.provision_demo_dashboard_trigger();
drop function if exists public.provision_demo_dashboard(uuid);
drop function if exists public.provision_demo_activity_on_signup();
drop function if exists public.provision_demo_activity(uuid);

-- ---------- 2. Zero what the seeds already wrote ----------

-- Program: back to day 1 with no Expinar day markers.
update public.program_progress
set current_day   = 1,
    expinar_days  = '{}'::int[],
    started_at    = current_date,
    updated_at    = now();

-- Tracks: nothing completed. Day-gated tracks stay locked; the rest
-- reset to "Started" (open, not begun).
update public.track_progress
set completed_modules = 0,
    status            = case when status = 'locked' then 'locked' else 'started' end,
    updated_at        = now();

-- Video lessons: forget the seeded watch history entirely.
delete from public.module_progress;

-- Quizzes: drop only the two seeded attempts (real quiz ids — including
-- syllabus quizzes like 'ib-2-quiz' — are left alone).
delete from public.quiz_attempts
where quiz_id in ('quiz-er-1', 'quiz-er-2');

-- Badges: drop only the two seeded awards.
delete from public.user_badges
where badge_id in ('badge-first-step', 'badge-quiz-ace');

-- Career-fit: nothing earned yet (the UI falls back to its own copy).
update public.career_fit_report
set progress_percent = 0,
    blurb            = '',
    updated_at       = now();

-- Streak + activity charts: clear the seeded 12-day window. Real minutes
-- start accruing again as soon as lectures are watched.
delete from public.learning_activity;
