# HPIS - Humanitarian Protection & Information Security Platform

**Disclaimer:** Independent portfolio project. HPIS is not affiliated with, endorsed by, or connected to the International Committee of the Red Cross (ICRC) or any other organization. All people, cases, locations, organizations, and records are completely fictional and created solely for demonstration purposes.

HPIS is an internship-ready portfolio prototype for secure humanitarian information management. It demonstrates case management, family-link workflows, referrals, data quality, role-based access control, cryptographic auditability, privacy-by-design, offline field operations, operational analytics, service mapping, and responsible decision support using synthetic data.

## Features

- **Operational Dashboard**: Real-time case, referral, data-quality and security indicators
- **Protection Case Lifecycle**: `NEW -> ASSESSMENT -> INVESTIGATION -> REFERRAL -> FOLLOW_UP -> RESOLVED -> ARCHIVED`
- **Family-link & Missing-person Workflow**: Deterministic potential-match scoring using Levenshtein distance
- **Role-based Access Control (RBAC)**: Backend and frontend enforcement across 8 distinct institutional roles (`SUPER_ADMIN`, `PROGRAM_MANAGER`, `PROTECTION_OFFICER`, `CASE_WORKER`, `DATA_OFFICER`, `FIELD_OFFICER`, `AUDITOR`, `VIEWER`)
- **Multi-Factor Authentication (MFA / TOTP)**: Native Supabase Auth TOTP enrollment and challenge flows with Super Admin posture monitoring
- **Field-Level Encryption**: Application-layer AES-256-GCM encryption for sensitive case summaries and restricted identifiers at rest
- **Humanitarian Informed Consent**: Purpose limitation and consent lifecycle tracking on case dossiers per ICRC Professional Standards
- **Security & Privacy Centers**: Immutable audit trails (client inserts disabled), data inventory, retention rules, and emergency privacy redaction mode
- **Interoperability**: HXL-tagged CSV data exports
- **Offline Field Mode**: PWA interface demonstrating store-and-forward synchronization queue for remote field work
- **Services Map**: OpenStreetMap integration for fictional service points
- **Internationalization**: English and Amharic interface switching for core navigation

## Technology Stack

- **Frontend**: React 18 + TypeScript, Vite, Recharts, Leaflet, Lucide Icons, TailwindCSS
- **Backend**: Node.js/Express API with rate limiting, PostgreSQL, Prisma ORM, Supabase Auth
- **Testing**: Vitest, Supertest (comprehensive frontend and backend test suites)
- **CI/CD**: GitHub Actions automated build, lint, and test pipeline (Node 20+)

## Local Setup

### Frontend
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend API
```bash
cd server
npm install
npx prisma generate
npx prisma db push
npm run dev
```

## Verification

```bash
# Frontend Unit & RBAC Tests
npm test

# Backend Security & API Tests
cd server
npm test

# Production Build Check
npm run build
```

## Demo Accounts & Evaluation Flag

For ease of evaluation, the login page features one-click role switching across all 8 institutional roles:
- `admin@hpis.demo` (`admin.demo@hpis.example`) - `SUPER_ADMIN`
- `manager@hpis.demo` (`manager.demo@hpis.example`) - `PROGRAM_MANAGER`
- `protection@hpis.demo` (`officer.demo@hpis.example`) - `PROTECTION_OFFICER`
- `caseworker@hpis.demo` (`worker.demo@hpis.example`) - `CASE_WORKER`
- `data@hpis.demo` (`data.demo@hpis.example`) - `DATA_OFFICER`
- `field@hpis.demo` (`field.demo@hpis.example`) - `FIELD_OFFICER`
- `auditor@hpis.demo` (`auditor.demo@hpis.example`) - `AUDITOR`
- `viewer@hpis.demo` (`viewer.demo@hpis.example`) - `VIEWER`

> **Note on `VITE_DEMO_MODE`:** The client-side demo fallback is explicitly gated behind the `VITE_DEMO_MODE=true` environment variable. In real production deployments, `VITE_DEMO_MODE` defaults to `false`, requiring all authentication attempts to validate against live Supabase Auth and PostgreSQL `profiles` records.

## Documentation

Comprehensive architecture and security documentation is available in the `docs/` folder:
- `api.md`: API endpoints, rate limiting, and authentication middleware
- `database.md`: Schema, data access patterns, and Prisma models
- `interoperability.md`: HXL support and external integration targets
- `privacy.md`: Data minimization, consent tracking, and emergency privacy mode
- `security.md`: Cryptographic controls, AES-256-GCM encryption, and MFA
- `threat-model.md`: Detailed threat mitigations and verification matrix
- `offline-sync.md`: Local-first offline mode and conflict resolution targets

## Prototype Scope & Production Considerations

This repository is an enterprise-grade portfolio prototype demonstrating production-style engineering patterns. 

**What is fully shipped & verified:**
- Real authentication via Supabase Auth + JWT validation
- Fail-closed startup security validation
- Authoritative database-level RBAC role enforcement (no token role trust)
- PostgreSQL Row Level Security (RLS) on all tables
- Immutable append-only audit logging with client inserts disabled
- Application-layer AES-256-GCM field-level encryption for sensitive attributes
- Native TOTP Multi-Factor Authentication (MFA)
- Informed consent tracking and purpose limitation
- Express rate limiting on write endpoints

**Future production enhancements for deployment at scale:**
- KMS/Vault-managed automated key rotation for field encryption keys
- WebAuthn / FIDO2 hardware security keys
- IndexedDB CRDT synchronization engine for disconnected field devices
