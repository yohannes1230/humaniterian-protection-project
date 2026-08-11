# Database Design

Target database: PostgreSQL with Prisma.

Core tables:

- `users`
- `roles`
- `permissions`
- `user_roles`
- `role_permissions`
- `persons`
- `person_identifiers`
- `cases`
- `case_assignments`
- `case_notes`
- `case_documents`
- `family_link_cases`
- `missing_person_cases`
- `potential_matches`
- `match_reviews`
- `referrals`
- `services`
- `service_locations`
- `audit_logs`
- `security_events`
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
