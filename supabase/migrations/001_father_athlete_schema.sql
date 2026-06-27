-- Father Athlete OS MVP schema
-- Safe baseline: every public table has RLS enabled and owner-scoped policies.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create table if not exists public.workout_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  workout_date date not null,
  session_key text not null,
  duration_minutes integer not null default 20,
  perceived_effort integer check (perceived_effort between 1 and 10),
  notes text,
  created_at timestamptz not null default now(),
  unique (user_id, workout_date)
);

alter table public.workout_completions enable row level security;

drop policy if exists "completions_select_own" on public.workout_completions;
create policy "completions_select_own"
  on public.workout_completions for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "completions_insert_own" on public.workout_completions;
create policy "completions_insert_own"
  on public.workout_completions for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "completions_update_own" on public.workout_completions;
create policy "completions_update_own"
  on public.workout_completions for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create table if not exists public.exercise_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  exercise_id text not null,
  difficulty text check (difficulty in ('too_easy', 'right', 'too_hard')),
  created_at timestamptz not null default now()
);

alter table public.exercise_feedback enable row level security;

drop policy if exists "feedback_select_own" on public.exercise_feedback;
create policy "feedback_select_own"
  on public.exercise_feedback for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "feedback_insert_own" on public.exercise_feedback;
create policy "feedback_insert_own"
  on public.exercise_feedback for insert
  to authenticated
  with check ((select auth.uid()) = user_id);
