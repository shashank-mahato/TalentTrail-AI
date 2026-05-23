create extension if not exists pgcrypto;

create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  name text,
  degree text,
  year text,
  branch text,
  current_skills text,
  target_role text,
  time_per_day text,
  confidence_level text,
  resume_text text,
  interests text,
  learning_style text,
  created_at timestamp with time zone default now()
);

create table if not exists career_results (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid,
  readiness_score int,
  career_summary text,
  recommended_roles jsonb,
  skill_gaps jsonb,
  first_mission jsonb,
  next_steps jsonb,
  created_at timestamp with time zone default now()
);

create table if not exists roadmaps (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid,
  target_role text,
  roadmap jsonb,
  created_at timestamp with time zone default now()
);

create table if not exists resume_feedback (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid,
  original_bullet text,
  improved_bullet text,
  score_before int,
  score_after int,
  explanation text,
  tips jsonb,
  created_at timestamp with time zone default now()
);

create table if not exists interview_sessions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid,
  target_role text,
  question text,
  answer text,
  score int,
  feedback text,
  improvement_tip text,
  sample_answer text,
  created_at timestamp with time zone default now()
);
