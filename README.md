# HPIS - Humanitarian Protection & Information Security Platform

**Disclaimer:** Independent portfolio project. HPIS is not affiliated with, endorsed by, or connected to the International Committee of the Red Cross (ICRC) or any other organization. All people, cases, locations, organizations, and records are completely fictional and created solely for demonstration purposes.

HPIS is an internship-worthy portfolio prototype for secure humanitarian information management. It demonstrates case management, family-link workflows, referrals, data quality, role-based access control, auditability, privacy-by-design, offline field operations, operational analytics, service mapping, and responsible AI assistance using synthetic data only.

## Screenshots

*(Screenshots can be placed here. Add images to the `/screenshots` directory)*
- `screenshots/dashboard.png`
- `screenshots/cases.png`
- `screenshots/security.png`

## Features

- **Operational Dashboard**: Case, referral, data-quality and security indicators
- **Protection Case Lifecycle**: `NEW -> ASSESSMENT -> INVESTIGATION -> REFERRAL -> FOLLOW_UP -> RESOLVED -> ARCHIVED`
- **Family-link & Missing-person Workflow**: Deterministic potential-match scoring using Levenshtein distance
- **Role-based Access Control (RBAC)**: Backend and frontend enforcement for 7 distinct roles (e.g. `PROTECTION_OFFICER`, `AUDITOR`)
- **Security & Privacy Centers**: Audit trails, data inventory, retention rules, and an emergency privacy mode
- **Interoperability**: HXL-tagged CSV data exports
- **Offline Field Mode**: PWA interface demonstrating a synchronization queue for offline field work
- **Services Map**: OpenStreetMap integration for fictional service points
- **Internationalization**: English and Amharic interface switching for core navigation

## Technology Stack

- **Frontend**: React 19 + TypeScript, Vite, Recharts, Leaflet
- **Backend**: Node.js/Express API, PostgreSQL, Prisma
- **Testing**: Vitest, Supertest (Frontend & Backend coverage)
- **CI/CD**: GitHub Actions workflows

## Local Setup

### Frontend
```bash
npm install
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
# Frontend
npm run build
npm test

# Backend
cd server
npm test
```

## Demo Accounts

The app includes a role switcher in the top bar to test UI and API restrictions:
- `admin@hpis.demo` - `SUPER_ADMIN`
- `manager@hpis.demo` - `PROGRAM_MANAGER`
- `protection@hpis.demo` - `PROTECTION_OFFICER`
- `caseworker@hpis.demo` - `CASE_WORKER`
- `data@hpis.demo` - `DATA_OFFICER`
- `field@hpis.demo` - `FIELD_OFFICER`
- `auditor@hpis.demo` - `AUDITOR`

## Documentation

Comprehensive architecture documentation is available in the `docs/` folder:
- `api.md`: API endpoints and authentication
- `database.md`: Schema and data access patterns
- `interoperability.md`: HXL support and external integration targets
- `privacy.md`: Data minimization and emergency privacy mode
- `security.md`: Audit logs and access control
- `threat-model.md`: Known threats and mitigations
- `offline-sync.md`: Local-first offline mode targets

## What I'd build next

If I were to continue expanding this prototype into a full production system, I would focus on:

1. **End-to-End Encryption (E2EE)**: Implement client-side encryption (using WebCrypto API) for highly sensitive fields (e.g., case summaries, names) so the backend only stores ciphertext.
2. **True Offline Sync**: Replace the demo queue with a robust IndexedDB implementation (e.g., RxDB or WatermelonDB) resolving CRDT conflicts server-side.
3. **Advanced Identity Resolution**: Expand the `nameScore` matching engine to use Jaro-Winkler alongside geographic and temporal proximity heuristics.
4. **Biometric Integration Targets**: Add API stubs and documentation for connecting specialized deduplication or biometric systems (ensuring no biometric data touches this application itself).
5. **Mobile-First UX Optimization**: Refine the responsive design specifically for low-end tablets and phones often used in field settings.
6. **CPIMS+/GBVIMS+ Integrations**: Flesh out the `interoperability.md` by building a live sync adapter for one of the standard CPIMS+ instance endpoints.

## Limitations

This is a runnable portfolio prototype, not a production humanitarian system. The current build uses mostly synthetic client-side data mixed with a prototype local backend. Production use would require a hardened backend, real authentication (e.g., OIDC), server-side authorization, encrypted persistence, rigorous operational governance, and comprehensive security/legal/privacy reviews.
