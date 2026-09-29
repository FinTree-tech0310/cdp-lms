-- ============================================================
-- CDP learning-space — mini-games progress & scores
-- Run against your Supabase project (SQL editor or supabase db push).
-- The /mini-games pages keep results on this device until the table
-- exists, then syncs with it — see /api/mini-games/progress.
--
-- One row per user + hub + game. The 26 ported mini-games each report
-- a finished run (plays / best score / last outcome), which powers the
-- catalogue cards on /mini-games.
-- Idempotent — safe to run more than once.
-- ============================================================

create table if not exists public.mini_game_progress (
  user_id          uuid not null references auth.users (id) on delete cascade,
  hub              text not null,   -- 'investment-banking-games', 'vc-games', ...
  game_id          text not null,   -- slug: 'the-comps-screen', 'panic-call', ...
  plays            int  not null default 1 check (plays >= 0),
  -- Numeric score when the game reports one (0..100 style or raw points);
  -- null for games whose result is only an ending/outcome label.
  best_score       int,
  last_score       int,
  last_outcome     text,            -- authored ending id, e.g. 'convinced'
  best_streak      int check (best_streak is null or best_streak >= 0),
  completed_runs   int not null default 0 check (completed_runs >= 0),
  first_played_at  timestamptz not null default now(),
  last_played_at   timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  primary key (user_id, hub, game_id)
);

create index if not exists mini_game_progress_user_idx
  on public.mini_game_progress (user_id, hub);

alter table public.mini_game_progress enable row level security;

drop policy if exists "own_rows" on public.mini_game_progress;
create policy "own_rows" on public.mini_game_progress
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
