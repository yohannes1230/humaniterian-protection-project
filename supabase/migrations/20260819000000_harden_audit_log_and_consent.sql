-- ==============================================================================
-- HPIS Phase 3 Migration: Harden AuditLog RLS & Add Consent Tracking Model
-- ==============================================================================

-- 1. Harden AuditLog RLS: Drop insecure public client insert policy.
-- Only the backend service role (which bypasses RLS) can write immutable audit log records.
drop policy if exists "audit_log_insert" on public."AuditLog";

-- 2. Create Consent table for Humanitarian Data Protection & Privacy-by-Design
create table if not exists public."Consent" (
  id uuid primary key default gen_random_uuid(),
  "personId" text not null references public."Person"(id) on delete cascade,
  purpose text not null,
  scope text not null,
  "grantedAt" timestamptz not null default now(),
  "revokedAt" timestamptz,
  "grantedByUserId" text not null
);

-- Enable RLS on Consent
alter table if exists public."Consent" enable row level security;

-- 3. RLS Policies for Consent
-- View consents:
-- SUPER_ADMIN, PROGRAM_MANAGER, PROTECTION_OFFICER, DATA_OFFICER, AUDITOR (all)
-- CASE_WORKER, FIELD_OFFICER (assigned to person's case only)
create policy "consent_select" on public."Consent"
  for select using (
    public.current_user_role() in ('SUPER_ADMIN','PROGRAM_MANAGER','PROTECTION_OFFICER','DATA_OFFICER','AUDITOR')
    or (public.current_user_role() in ('CASE_WORKER','FIELD_OFFICER') and exists (
      select 1 from public."Case" c where c."personId" = public."Consent"."personId" and c."assignedToId" = auth.uid()::text
    ))
  );

-- Create / Grant consents:
-- SUPER_ADMIN, PROTECTION_OFFICER, CASE_WORKER
create policy "consent_insert" on public."Consent"
  for insert with check (
    public.current_user_role() in ('SUPER_ADMIN','PROTECTION_OFFICER','CASE_WORKER')
  );

-- Revoke / Update consents:
-- SUPER_ADMIN, PROTECTION_OFFICER only
create policy "consent_update" on public."Consent"
  for update using (
    public.current_user_role() in ('SUPER_ADMIN','PROTECTION_OFFICER')
  );
