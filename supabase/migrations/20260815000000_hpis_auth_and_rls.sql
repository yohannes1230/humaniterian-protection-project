-- ==============================================================================
-- HPIS Phase 2: Supabase Authentication, Profiles & Row Level Security (RLS)
-- Single Source of Truth: docs/rbac-matrix.md
-- ==============================================================================

-- 1. Create profiles table linked 1:1 to auth.users
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text not null,
  role text not null default 'VIEWER'
    check (role in (
      'SUPER_ADMIN',
      'PROGRAM_MANAGER',
      'PROTECTION_OFFICER',
      'CASE_WORKER',
      'DATA_OFFICER',
      'FIELD_OFFICER',
      'AUDITOR',
      'VIEWER'
    )),
  mfa_enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Trigger to auto-provision profiles on new auth.users signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    'VIEWER' -- Default role is always VIEWER; privileged roles must be explicitly granted by SUPER_ADMIN
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Helper function to get the current authenticated user's role
create or replace function public.current_user_role()
returns text as $$
  select role from public.profiles where id = auth.uid();
$$ language sql stable security definer;

-- 3. Enable Row Level Security on all application tables
alter table if exists public.profiles enable row level security;
alter table if exists public."Person" enable row level security;
alter table if exists public."Case" enable row level security;
alter table if exists public."CaseNote" enable row level security;
alter table if exists public."FamilyLink" enable row level security;
alter table if exists public."Referral" enable row level security;
alter table if exists public."AuditLog" enable row level security;
alter table if exists public."SecurityEvent" enable row level security;
alter table if exists public."ServicePoint" enable row level security;

-- ==============================================================================
-- 4. RLS Policies per docs/rbac-matrix.md
-- ==============================================================================

-- --- PROFILES POLICIES ---
create policy "profiles_select" on public.profiles
  for select using (
    id = auth.uid() or public.current_user_role() = 'SUPER_ADMIN'
  );

create policy "profiles_update" on public.profiles
  for update using (
    public.current_user_role() = 'SUPER_ADMIN'
  );

-- --- CASE POLICIES ---
-- View cases:
-- SUPER_ADMIN, PROGRAM_MANAGER, PROTECTION_OFFICER, DATA_OFFICER, AUDITOR, VIEWER (all)
-- CASE_WORKER, FIELD_OFFICER (assigned only)
create policy "case_select" on public."Case"
  for select using (
    public.current_user_role() in ('SUPER_ADMIN','PROGRAM_MANAGER','PROTECTION_OFFICER','DATA_OFFICER','AUDITOR','VIEWER')
    or (public.current_user_role() in ('CASE_WORKER','FIELD_OFFICER') and "assignedToId" = auth.uid()::text)
  );

-- Create cases:
-- SUPER_ADMIN, PROTECTION_OFFICER, CASE_WORKER, FIELD_OFFICER
create policy "case_insert" on public."Case"
  for insert with check (
    public.current_user_role() in ('SUPER_ADMIN','PROTECTION_OFFICER','CASE_WORKER','FIELD_OFFICER')
  );

-- Edit cases:
-- SUPER_ADMIN, PROTECTION_OFFICER, CASE_WORKER (assigned only)
create policy "case_update" on public."Case"
  for update using (
    public.current_user_role() in ('SUPER_ADMIN','PROTECTION_OFFICER')
    or (public.current_user_role() = 'CASE_WORKER' and "assignedToId" = auth.uid()::text)
  );

-- Delete/Archive cases:
-- SUPER_ADMIN only
create policy "case_delete" on public."Case"
  for delete using (
    public.current_user_role() = 'SUPER_ADMIN'
  );

-- --- PERSON POLICIES ---
create policy "person_select" on public."Person"
  for select using (
    public.current_user_role() in ('SUPER_ADMIN','PROGRAM_MANAGER','PROTECTION_OFFICER','DATA_OFFICER','AUDITOR')
    or (public.current_user_role() in ('CASE_WORKER','FIELD_OFFICER') and exists (
      select 1 from public."Case" c where c."personId" = public."Person".id and c."assignedToId" = auth.uid()::text
    ))
    or (public.current_user_role() = 'VIEWER') -- VIEWER receives pseudonymized projection
  );

create policy "person_insert_update" on public."Person"
  for all using (
    public.current_user_role() in ('SUPER_ADMIN','PROTECTION_OFFICER','CASE_WORKER','FIELD_OFFICER')
  );

-- --- FAMILY LINK POLICIES ---
-- View family links:
-- SUPER_ADMIN, PROGRAM_MANAGER, PROTECTION_OFFICER, DATA_OFFICER, AUDITOR (all)
-- CASE_WORKER (assigned only)
-- FIELD_OFFICER, VIEWER (none)
create policy "family_link_select" on public."FamilyLink"
  for select using (
    public.current_user_role() in ('SUPER_ADMIN','PROGRAM_MANAGER','PROTECTION_OFFICER','DATA_OFFICER','AUDITOR')
    or (public.current_user_role() = 'CASE_WORKER' and exists (
      select 1 from public."Case" c where c.id = public."FamilyLink"."caseId" and c."assignedToId" = auth.uid()::text
    ))
  );

create policy "family_link_modify" on public."FamilyLink"
  for all using (
    public.current_user_role() in ('SUPER_ADMIN','PROTECTION_OFFICER','DATA_OFFICER')
  );

-- --- AUDIT LOG POLICIES ---
-- View audit logs:
-- SUPER_ADMIN, PROGRAM_MANAGER, AUDITOR
create policy "audit_log_select" on public."AuditLog"
  for select using (
    public.current_user_role() in ('SUPER_ADMIN','PROGRAM_MANAGER','AUDITOR')
  );

-- Insert audit logs:
-- All authenticated users / service role can insert
create policy "audit_log_insert" on public."AuditLog"
  for insert with check (
    auth.role() = 'authenticated'
  );

-- --- SERVICE POINT POLICIES ---
create policy "service_point_read" on public."ServicePoint"
  for select using (true);

create policy "service_point_write" on public."ServicePoint"
  for all using (
    public.current_user_role() in ('SUPER_ADMIN','PROGRAM_MANAGER')
  );
