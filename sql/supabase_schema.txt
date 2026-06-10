-- 4P3X ExplainFlow OS™ Supabase starter schema
-- Type: full backend setup starter / migration-ready foundation
-- RLS STATUS: ENABLED on all application tables.
-- Execution order: extensions -> tables -> indexes -> functions -> triggers -> RLS -> policies -> verification.

create extension if not exists pgcrypto;

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  plan text not null default 'founder_demo',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null,
  summary text,
  problem text,
  public_benefit text,
  tech_stack text,
  live_url text,
  status text default 'demo_live_ready',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.explanations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  audience text not null,
  output jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.report_packs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  sections jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.evidence_items (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  evidence_type text not null,
  label text not null,
  value text,
  created_at timestamptz not null default now()
);

create table if not exists public.reviewer_notes (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  reviewer_name text,
  note text not null,
  status text default 'open',
  created_at timestamptz not null default now()
);

create index if not exists idx_projects_workspace on public.projects(workspace_id);
create index if not exists idx_explanations_workspace_project on public.explanations(workspace_id, project_id);
create index if not exists idx_reports_workspace_project on public.report_packs(workspace_id, project_id);
create index if not exists idx_evidence_workspace_project on public.evidence_items(workspace_id, project_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_workspaces_updated_at on public.workspaces;
create trigger trg_workspaces_updated_at before update on public.workspaces for each row execute function public.set_updated_at();

drop trigger if exists trg_projects_updated_at on public.projects;
create trigger trg_projects_updated_at before update on public.projects for each row execute function public.set_updated_at();

alter table public.workspaces enable row level security;
alter table public.projects enable row level security;
alter table public.explanations enable row level security;
alter table public.report_packs enable row level security;
alter table public.evidence_items enable row level security;
alter table public.reviewer_notes enable row level security;

create policy "workspace owner can manage workspaces" on public.workspaces for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "workspace owner can manage projects" on public.projects for all using (workspace_id in (select id from public.workspaces where owner_id = auth.uid())) with check (workspace_id in (select id from public.workspaces where owner_id = auth.uid()));
create policy "workspace owner can manage explanations" on public.explanations for all using (workspace_id in (select id from public.workspaces where owner_id = auth.uid())) with check (workspace_id in (select id from public.workspaces where owner_id = auth.uid()));
create policy "workspace owner can manage report packs" on public.report_packs for all using (workspace_id in (select id from public.workspaces where owner_id = auth.uid())) with check (workspace_id in (select id from public.workspaces where owner_id = auth.uid()));
create policy "workspace owner can manage evidence" on public.evidence_items for all using (workspace_id in (select id from public.workspaces where owner_id = auth.uid())) with check (workspace_id in (select id from public.workspaces where owner_id = auth.uid()));
create policy "workspace owner can manage reviewer notes" on public.reviewer_notes for all using (workspace_id in (select id from public.workspaces where owner_id = auth.uid())) with check (workspace_id in (select id from public.workspaces where owner_id = auth.uid()));

-- Verification query
select schemaname, tablename, rowsecurity from pg_tables where schemaname = 'public' and tablename in ('workspaces','projects','explanations','report_packs','evidence_items','reviewer_notes');

-- Rollback note:
-- drop policies first if needed, then drop triggers, then tables in dependent order:
-- reviewer_notes, evidence_items, report_packs, explanations, projects, workspaces.
