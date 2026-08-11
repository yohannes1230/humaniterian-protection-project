# HPIS - Humanitarian Protection & Information Security Platform

HPIS is an independent portfolio prototype for secure humanitarian information management. It demonstrates case management, family-link workflows, referrals, data quality, role-based access control, auditability, privacy-by-design, offline field operations, operational analytics, service mapping and responsible AI assistance using synthetic data only.

**Disclaimer:** Independent portfolio project. HPIS is not affiliated with, endorsed by, or connected to the International Committee of the Red Cross (ICRC). All people, cases, locations, organizations and records are fictional and created solely for demonstration purposes.

## Features

- Operational dashboard with case, referral, data-quality and security indicators
- Protection case lifecycle: `NEW -> ASSESSMENT -> INVESTIGATION -> REFERRAL -> FOLLOW_UP -> RESOLVED -> ARCHIVED`
- Family-link and missing-person workflow with deterministic potential-match scoring
- Role-aware navigation for admin, manager, protection, case worker, data, field, auditor and viewer roles
- Security center, audit center and emergency privacy mode
- Privacy center covering data inventory, retention, pseudonymization and access accountability
- Offline field mode as a PWA with a synchronization queue demonstration
- Humanitarian services map using OpenStreetMap and fictional service points
- English and Amharic interface switching for core navigation
- Responsible AI assistant in deterministic demo mode

## Technology Stack

- React 19 + TypeScript
- Vite
- Recharts
- Leaflet/OpenStreetMap
- PWA service worker
- Vitest

The target production architecture is documented as React + TypeScript frontend, Node.js/Express API, PostgreSQL, Prisma, RBAC middleware, audit logging, application-level encryption for selected sensitive fields, and IndexedDB-backed offline synchronization.

## Local Setup

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite.

## Verification

```bash
npm run build
npm test
```

## Demo Accounts

The app includes role switching in the top bar:

- `admin@hpis.demo` - `SUPER_ADMIN`
- `manager@hpis.demo` - `PROGRAM_MANAGER`
- `protection@hpis.demo` - `PROTECTION_OFFICER`
- `caseworker@hpis.demo` - `CASE_WORKER`
- `data@hpis.demo` - `DATA_OFFICER`
- `field@hpis.demo` - `FIELD_OFFICER`
- `auditor@hpis.demo` - `AUDITOR`

## Documentation

See `docs/` for architecture, API, database, privacy, threat model, offline sync, testing and deployment notes.

## Limitations

This is a runnable portfolio prototype, not a production humanitarian system. The current build uses synthetic client-side data. Production use would require a hardened backend, real authentication, server-side authorization, encrypted persistence, operational governance, security review and legal/privacy review.
