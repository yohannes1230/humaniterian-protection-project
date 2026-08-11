# Architecture

HPIS is designed as a defense-in-depth humanitarian information-management platform.

```mermaid
flowchart LR
  User[Authorized user] --> Web[React PWA]
  Web --> Auth[Authentication and MFA]
  Web --> Sync[Offline sync queue]
  Auth --> API[Node/Express API]
  API --> RBAC[Server-side RBAC]
  RBAC --> DB[(PostgreSQL)]
  API --> Audit[Append-oriented audit logs]
  API --> Security[Security events]
  DB --> Analytics[Operational analytics]
```

The current implementation is a local React prototype with synthetic data. The intended production version separates UI, API, database, authentication, audit, encryption and offline synchronization.

## Principles

- Use synthetic data for all demos.
- Minimize identifying data collection.
- Enforce RBAC server-side in production.
- Record meaningful audit events without storing unnecessary sensitive metadata.
- Keep AI assistive only, with human review required.
- Support field workflows where connectivity can be intermittent.
