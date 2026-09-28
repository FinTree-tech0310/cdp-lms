-- 0006: Expinars page catalog
--
-- Adds the session columns the /expinars page renders (recording duration,
-- live audience count, track filter, study hint) and seeds the sessions
-- from the design. Catalog content only — shared by every user, no
-- per-user state (that lives in 0004/0005 territory).
--
-- Phase (live / upcoming / recorded) is derived by the app from
-- starts_at + duration_seconds, so no status column is needed: the live
-- session below rolls into Recorded on its own once the hour is up.

alter table public.expinar_events
  add column if not exists duration_seconds integer,
  add column if not exists viewers           integer,
  add column if not exists track             text,
  add column if not exists hint              text;

-- The seeded desk session joins the track filter.
update public.expinar_events
   set track = 'Equity Research'
 where id = 'exp-demo-1'
   and track is null;

update public.expinar_events
   set duration_seconds = 3600
 where id = 'exp-demo-1'
   and duration_seconds is null;

do $$
declare
  next_saturday timestamptz;
begin
  -- Next Saturday 18:00 (date_trunc('week') is Monday), rolling a week if
  -- today is already past it.
  next_saturday := date_trunc('week', now()) + interval '5 days' + interval '18 hours';

  if next_saturday <= now() then
    next_saturday := next_saturday + interval '7 days';
  end if;

  insert into public.expinar_events
    (id, title, detail, join_note, speaker, speaker_role, starts_at,
     duration_seconds, viewers, track, hint)
  values
    -- Live now: started 20 minutes ago, 60-minute session, so it is on air
    -- when the page first opens and becomes a recording afterwards.
    ('exp-ipo-live',
     'How an IPO Comes Together',
     'From filing to first trade: how the book gets built, who signs off at each step, and where the analyst sits through it all.',
     'The join link opens 10 minutes before the start.',
     'Meera Iyer', 'Director, Capital Markets',
     now() - interval '20 minutes', 3600, 142, 'Investment Banking', null),

    ('exp-mna-deal',
     'Inside a Live M&A Deal',
     'A deal team walks through a live mandate — teasers, diligence, valuation debates and the weekend the term sheet lands.',
     'The join link opens 10 minutes before the start.',
     'Rohan Malhotra', 'Vice President, M&A Advisory',
     next_saturday, 3600, null, 'Investment Banking', null),

    ('exp-bank-boutique',
     'Global Bank or Boutique?',
     'Two bankers compare life at a bulge-bracket desk and a specialist shop — deal sizes, learning curves and exit options.',
     'The join link opens 10 minutes before the start.',
     'Sana Qureshi', 'Associate, Advisory Firm',
     date_trunc('day', next_saturday + interval '14 days') + interval '11 hours',
     3600, null, 'Investment Banking', null),

    -- Recordings (past starts_at → the app lists them under Recorded).
    ('exp-first-year',
     'My First Year as an IB Analyst',
     'An honest walk through year one: the work that actually lands on your desk, the hours, and what nobody tells you before you start.',
     'The join link opens 10 minutes before the start.',
     'Ishita Banerjee', 'Analyst, Investment Banking',
     date_trunc('day', now() - interval '14 days') + interval '10 hours',
     3130, null, 'Investment Banking', 'Best after Module 3'),

    ('exp-ai-work',
     'How AI Is Changing Analyst Work',
     'Where models already touch the analyst workflow — and the skills that matter more because of it.',
     'The join link opens 10 minutes before the start.',
     'Vikram Sethi', 'Vice President, Investment Banking',
     date_trunc('day', now() - interval '9 days') + interval '10 hours',
     2855, null, 'Investment Banking', 'Best after Module 11'),

    ('exp-myths',
     'Myths About Investment Banking',
     'Seven career myths, taken one by one, from people who lived through them.',
     'The join link opens 10 minutes before the start.',
     'Ananya Rao', 'Director, Investment Banking',
     date_trunc('day', now() - interval '5 days') + interval '10 hours',
     2300, null, 'Investment Banking', null)
  on conflict (id) do nothing;
end $$;

comment on table public.expinar_events is
  'Shared Expinar catalog. App derives live/upcoming/recorded from starts_at + duration_seconds; /expinars falls back to a code catalog when this table is empty.';
