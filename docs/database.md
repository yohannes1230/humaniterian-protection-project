# Database Design

> **Implementation status:** Partially implemented
> Last verified against code: 2026-08-12

Target database: PostgreSQL with Prisma.

## Implemented Tables

- `users` (Role is an enum, not a separate table)
- `persons`
- `cases`
- `case_notes`
- `family_links`
- `referrals`
- `audit_logs`
- `security_events`
- `service_points`

## Planned Tables (Target Design)

- `roles`
- `permissions`
- `user_roles`
- `role_permissions`
- `person_identifiers`
- `case_assignments`
- `case_documents`
- `missing_person_cases`
- `potential_matches`
- `match_reviews`
- `services`
- `service_locations`
- `data_quality_issues`
- `retention_policies`
- `offline_sync_queue`
- `ai_requests`
- `ai_reviews`

Requirements:

- UUID primary keys
- foreign keys and indexes on status, priority, region, user and timestamp fields
- soft deletion where appropriate
- append-oriented audit records
- selected sensitive-field encryption using keys from environment secrets
