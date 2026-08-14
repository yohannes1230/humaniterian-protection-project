# Role-Based Access Control (RBAC) Matrix

This document is the **single source of truth** for all database Row-Level Security (RLS) policies, Express backend API middleware, and frontend route guards across the HPIS platform.

---

## 1. Permission Matrix

| Role | View Cases | Create Cases | Edit Cases | Delete / Archive | View Family Links | Run Matching | View Audit Log | Manage Users | Export Data (HXL) |
|---|---|---|---|---|---|---|---|---|---|
| **SUPER_ADMIN** | ✅ All | ✅ Yes | ✅ All | ✅ Yes | ✅ All | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **PROGRAM_MANAGER** | ✅ All | ❌ No | ❌ No | ❌ No | ✅ All | ❌ No | ✅ Yes | ❌ No | ✅ Yes |
| **PROTECTION_OFFICER**| ✅ All | ✅ Yes | ✅ All | ❌ No | ✅ All | ✅ Yes | ❌ No | ❌ No | ❌ No |
| **CASE_WORKER** | 🔒 Assigned Only | ✅ Yes | 🔒 Assigned Only | ❌ No | 🔒 Assigned Only | ❌ No | ❌ No | ❌ No | ❌ No |
| **DATA_OFFICER** | ✅ All | ❌ No | ❌ No | ❌ No | ✅ All | ✅ Yes | ❌ No | ❌ No | ✅ Yes |
| **FIELD_OFFICER** | 🔒 Assigned Only | ✅ Yes (Offline/Draft) | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No |
| **AUDITOR** | 👁️ Read-only (All) | ❌ No | ❌ No | ❌ No | 👁️ Read-only | ❌ No | ✅ Yes | ❌ No | ❌ No |
| **VIEWER** | 👁️ Read-only (Redacted) | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No |

---

## 2. Enforcement Architecture (Defense-in-Depth)

1. **Database Layer (Row-Level Security - RLS)**:
   - Enforced by PostgreSQL via `supabase/migrations/20260815000000_hpis_auth_and_rls.sql`.
   - Uses `public.profiles.role` joined against `auth.uid()` to determine access.
   - Prevents unauthorized access even if the API layer or client is bypassed.

2. **API Backend Layer (Express Middleware)**:
   - Validates the incoming Supabase JWT token on every protected request.
   - Queries the verified `profiles` table to extract the user's authoritative role.
   - Re-checks required permissions on each endpoint (`requireRole([...])`) before running controllers.
   - Records an immutable audit log entry in `AuditLog` for every write and high-privilege read.

3. **Frontend Layer (Route Guards & Navigation)**:
   - Dynamic role-aware navigation: Forbidden modules are completely removed from the navigation bar (not just greyed out).
   - Route guard intercepts unauthorized navigation attempts and renders a dedicated `<AccessDenied role={role} path={path} />` view.
   - Emergency Privacy Mode redacts person identifying information (PII) from viewports on demand.

---

## 3. Seeded Demo Accounts

All demo accounts use password: `demo1234`

- `admin.demo@hpis.example` &rarr; `SUPER_ADMIN`
- `manager.demo@hpis.example` &rarr; `PROGRAM_MANAGER`
- `officer.demo@hpis.example` &rarr; `PROTECTION_OFFICER`
- `worker.demo@hpis.example` &rarr; `CASE_WORKER`
- `data.demo@hpis.example` &rarr; `DATA_OFFICER`
- `field.demo@hpis.example` &rarr; `FIELD_OFFICER`
- `auditor.demo@hpis.example` &rarr; `AUDITOR`
- `viewer.demo@hpis.example` &rarr; `VIEWER`
