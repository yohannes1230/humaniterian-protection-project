-- ==============================================================================
-- HPIS Seeded Demo Accounts (8 Roles)
-- Password for all demo accounts: demo1234
-- ==============================================================================

-- 1. Seed demo accounts in auth.users (if using local Supabase CLI)
-- For Supabase instance, accounts can be registered and assigned their profile roles:

insert into public.profiles (id, full_name, role, mfa_enabled)
values
  ('00000000-0000-0000-0000-000000000001', 'System Administrator', 'SUPER_ADMIN', true),
  ('00000000-0000-0000-0000-000000000002', 'Abebe Bikila (Program Mgr)', 'PROGRAM_MANAGER', false),
  ('00000000-0000-0000-0000-000000000003', 'Sara Tefera (Protection Off.)', 'PROTECTION_OFFICER', false),
  ('00000000-0000-0000-0000-000000000004', 'Dawit Kebede (Case Worker)', 'CASE_WORKER', false),
  ('00000000-0000-0000-0000-000000000005', 'Hiwot Haile (Data Officer)', 'DATA_OFFICER', false),
  ('00000000-0000-0000-0000-000000000006', 'Yonas Girma (Field Officer)', 'FIELD_OFFICER', false),
  ('00000000-0000-0000-0000-000000000007', 'Helen Assefa (Compliance Auditor)', 'AUDITOR', true),
  ('00000000-0000-0000-0000-000000000008', 'Observer Account (Viewer)', 'VIEWER', false)
on conflict (id) do update set
  full_name = excluded.full_name,
  role = excluded.role,
  mfa_enabled = excluded.mfa_enabled;
