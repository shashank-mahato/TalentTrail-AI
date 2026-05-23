-- TalentTrail AI real resume intelligence schema.
-- Run this in Supabase SQL Editor before using the production workflow.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text,
  target_role text,
  resume_profile jsonb default '{}'::jsonb,
  preferences jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists resume_documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  file_name text,
  file_path text,
  mime_type text,
  source_type text check (source_type in ('upload', 'manual_text')),
  extracted_text text,
  parse_status text default 'pending',
  error_message text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists resume_analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  resume_document_id uuid references resume_documents(id) on delete set null,
  resume_file_path text,
  resume_text text,
  extracted_profile jsonb not null default '{}'::jsonb,
  editable_profile jsonb not null default '{}'::jsonb,
  career_result jsonb not null default '{}'::jsonb,
  roadmap jsonb not null default '{}'::jsonb,
  missions jsonb not null default '[]'::jsonb,
  resume_feedback jsonb not null default '[]'::jsonb,
  interview_questions jsonb not null default '[]'::jsonb,
  career_twin jsonb not null default '[]'::jsonb,
  job_search_links jsonb not null default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists career_trails (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  resume_analysis_id uuid references resume_analyses(id) on delete cascade,
  name text default 'Career Trail',
  target_role text,
  status text default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists career_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  resume_analysis_id uuid references resume_analyses(id) on delete cascade,
  readiness_score int check (readiness_score between 0 and 100),
  best_fit_role text,
  result jsonb not null default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists roadmaps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  resume_analysis_id uuid references resume_analyses(id) on delete cascade,
  target_role text,
  roadmap jsonb not null default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists missions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  roadmap_id uuid references roadmaps(id) on delete cascade,
  week_number int,
  day_number int,
  title text not null,
  description text,
  skill_focus text,
  estimated_time text,
  proof_required text,
  expected_output text,
  difficulty text,
  status text default 'pending' check (status in ('pending', 'in_progress', 'submitted', 'reviewed', 'completed')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists proof_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  mission_id uuid references missions(id) on delete set null,
  title text not null,
  proof_type text,
  proof_url text,
  file_path text,
  notes text,
  review_status text default 'pending',
  review jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists resume_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  resume_analysis_id uuid references resume_analyses(id) on delete cascade,
  feedback jsonb not null default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists interview_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  resume_analysis_id uuid references resume_analyses(id) on delete cascade,
  target_role text,
  question text,
  answer text,
  score int,
  feedback jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists saved_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  external_id text,
  job_title text not null,
  company text,
  location text,
  url text not null,
  source text,
  match_score int,
  raw jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists agent_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  agent_name text not null,
  status text default 'pending' check (status in ('pending', 'running', 'completed', 'failed')),
  output jsonb,
  error_message text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  body text,
  type text,
  read_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'profiles',
    'resume_documents',
    'resume_analyses',
    'career_trails',
    'career_results',
    'roadmaps',
    'missions',
    'proof_items',
    'resume_feedback',
    'interview_sessions',
    'saved_jobs',
    'agent_runs',
    'notifications'
  ]
  loop
    execute format('alter table %I enable row level security', table_name);
    execute format('drop trigger if exists set_%I_updated_at on %I', table_name, table_name);
    execute format(
      'create trigger set_%I_updated_at before update on %I for each row execute function public.set_updated_at()',
      table_name,
      table_name
    );
  end loop;
end $$;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'profiles',
    'resume_documents',
    'resume_analyses',
    'career_trails',
    'career_results',
    'roadmaps',
    'missions',
    'proof_items',
    'resume_feedback',
    'interview_sessions',
    'saved_jobs',
    'agent_runs',
    'notifications'
  ]
  loop
    execute format('drop policy if exists "%s select own rows" on %I', table_name, table_name);
    execute format('drop policy if exists "%s insert own rows" on %I', table_name, table_name);
    execute format('drop policy if exists "%s update own rows" on %I', table_name, table_name);
    execute format('drop policy if exists "%s delete own rows" on %I', table_name, table_name);

    execute format('create policy "%s select own rows" on %I for select using (auth.uid() = user_id)', table_name, table_name);
    execute format('create policy "%s insert own rows" on %I for insert with check (auth.uid() = user_id)', table_name, table_name);
    execute format('create policy "%s update own rows" on %I for update using (auth.uid() = user_id) with check (auth.uid() = user_id)', table_name, table_name);
    execute format('create policy "%s delete own rows" on %I for delete using (auth.uid() = user_id)', table_name, table_name);
  end loop;
end $$;

insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', false),
       ('proof-files', 'proof-files', false)
on conflict (id) do nothing;

drop policy if exists "Users can read own resume files" on storage.objects;
drop policy if exists "Users can upload own resume files" on storage.objects;
drop policy if exists "Users can update own resume files" on storage.objects;
drop policy if exists "Users can delete own resume files" on storage.objects;
drop policy if exists "Users can read own proof files" on storage.objects;
drop policy if exists "Users can upload own proof files" on storage.objects;
drop policy if exists "Users can update own proof files" on storage.objects;
drop policy if exists "Users can delete own proof files" on storage.objects;

create policy "Users can read own resume files"
on storage.objects for select
using (bucket_id = 'resumes' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can upload own resume files"
on storage.objects for insert
with check (bucket_id = 'resumes' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can update own resume files"
on storage.objects for update
using (bucket_id = 'resumes' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can delete own resume files"
on storage.objects for delete
using (bucket_id = 'resumes' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can read own proof files"
on storage.objects for select
using (bucket_id = 'proof-files' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can upload own proof files"
on storage.objects for insert
with check (bucket_id = 'proof-files' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can update own proof files"
on storage.objects for update
using (bucket_id = 'proof-files' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can delete own proof files"
on storage.objects for delete
using (bucket_id = 'proof-files' and (storage.foldername(name))[1] = auth.uid()::text);
