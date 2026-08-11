I researched the current ICRC technology/data-management direction again before turning this into a build specification. The project should explicitly align with **Information Technology, Data Management & Analytics, Information Management, privacy-by-design, cybersecurity, offline capability, and humanitarian case workflows**. ICRC's careers site currently lists IT and Data Management & Analytics as distinct job categories, and its Data Management team emphasizes data quality, system support, analytics, dashboards and GIS.

The ICRC's current data-protection framework was revised in 2025, and its RedSafe platform explicitly uses **security and privacy by design**, includes family-link and service-map functionality, and supports certain offline features. In June 2026, an ICRC regional symposium involving participants from Ethiopia specifically discussed cybersecurity, data protection, privacy by design, interoperability and responsible AI in humanitarian action.

So I would build the project below-not a generic NGO CRUD application.

**HPIS - Humanitarian Protection & Information Security Platform**

**Purpose:** An independent portfolio prototype demonstrating how an Information Systems professional can design a secure, privacy-preserving, offline-capable humanitarian information-management platform.

**Important:** This must **not** claim to be an ICRC product or reproduce confidential ICRC systems. Use only synthetic data.

**1\. Product definition**

**Project name**

**HPIS - Humanitarian Protection & Information Security Platform**

**Tagline**

**Secure information management for humanitarian protection and field operations.**

**Portfolio description**

HPIS is an independent humanitarian information-management prototype demonstrating privacy-by-design case management, family-link workflows, referrals, data quality, role-based access control, auditability, offline field operations, analytics and cybersecurity controls using entirely synthetic data.

**Mandatory disclaimer**

Display this in the application footer and README:

**Independent portfolio project. HPIS is not affiliated with, endorsed by, or connected to the International Committee of the Red Cross (ICRC). All people, cases, locations, organizations and records are fictional and created solely for demonstration purposes.**

**2\. The system's main objectives**

The AI must build the application around these objectives:

1. Secure humanitarian case management
2. Protection-sensitive information handling
3. Family-link/missing-person workflow demonstration
4. Referral and assistance coordination
5. Data quality management
6. Role-based access control
7. Privacy-by-design
8. Security monitoring and auditability
9. Offline field operations
10. Operational analytics
11. GIS/service mapping
12. Responsible AI assistance
13. English/Amharic interface
14. Professional documentation and testing

**3\. User roles**

Create these roles:

**SUPER_ADMIN**

Full administrative control.

**PROGRAM_MANAGER**

Can manage operational cases and analytics but cannot manage system security settings.

**PROTECTION_OFFICER**

Can create and manage protection/family-link cases.

**CASE_WORKER**

Can manage assigned cases and notes.

**DATA_OFFICER**

Responsible for data quality, imports, duplicate detection and analytics.

**FIELD_OFFICER**

Designed for mobile/offline field operations.

**AUDITOR**

Read-only access to authorized audit/security information.

**VIEWER**

Restricted dashboard/aggregate information only.

**4\. Core modules**

Build exactly these major modules.

**Module A - Dashboard**

Executive operational dashboard.

Display:

- Active Cases
- High Priority Cases
- Family-Link Cases
- Open Referrals
- Cases Resolved This Month
- Average Resolution Time
- Data Quality Score
- Pending Reviews
- Security Events

Charts:

- Cases by region
- Cases by type
- Cases by status
- Priority distribution
- Referral status
- Resolution trend
- Data-quality trend

Use fictional data only.

**5\. Module B - Case Management**

Main route:

/cases

Features:

- Search
- Filtering
- Sorting
- Pagination
- Create case
- Edit case
- View case
- Assign officer
- Change status
- Change priority
- Add note
- Add referral
- Attach fictional document metadata
- Case history
- Audit history

Case lifecycle:

NEW

↓

ASSESSMENT

↓

INVESTIGATION

↓

REFERRAL

↓

FOLLOW_UP

↓

RESOLVED

↓

ARCHIVED

Priority:

LOW

MEDIUM

HIGH

CRITICAL

Case types:

PROTECTION

FAMILY_SEPARATION

MISSING_PERSON

REFERRAL

ASSISTANCE

HEALTH

PSYCHOSOCIAL_SUPPORT

DETENTION_VISIT

OTHER

**6\. Module C - Person & Identity Management**

Do **not** make the UI unnecessarily expose personally identifiable information.

Person records should support:

- Internal person ID
- pseudonym
- age range
- sex
- region
- last known location
- contact status
- case relationship
- verification status

Avoid unnecessary collection.

Example:

PERSON-ET-000184

rather than automatically showing a person's full identity everywhere.

Implement:

**Pseudonymization**

Example:

Person:

PERSON-ET-000184

Display name:

Person A-184

Authorized roles can access additional fields.

**7\. Module D - Family Link / Missing Person**

This is one of the project's flagship features.

Routes:

/family-links

/family-links/:id

/family-links/new

Features:

- Create tracing request
- Record last known contact
- Record location
- Record family relationship
- Record circumstances
- Add follow-up
- Case status
- Potential matches
- Human verification
- Match history

Statuses:

NEW

UNDER_REVIEW

SEARCHING

POTENTIAL_MATCH

VERIFICATION_REQUIRED

MATCH_CONFIRMED

RESOLVED

CLOSED

**8\. Potential-match engine**

Create a deterministic matching algorithm for synthetic data.

Do NOT claim it is an ICRC algorithm.

Example weighted scoring:

Name similarity 30%

Age compatibility 15%

Location similarity 20%

Date similarity 15%

Other attributes 20%

Output:

Potential Match

Score: 87%

Name similarity: 92%

Location: 90%

Age: 100%

Date: 75%

Other attributes: 82%

But the system must display:

**AI/system suggestion only - authorized human verification required.**

Never automatically confirm a humanitarian identity.

**9\. Module E - Referral Management**

Routes:

/referrals

/referrals/:id

Referral categories:

- Protection
- Medical
- Psychosocial
- Family Link
- Rehabilitation
- Emergency Assistance
- Legal/Information
- Other

Workflow:

PENDING

↓

ACCEPTED

↓

IN_PROGRESS

↓

COMPLETED

Each referral contains:

- Case
- Service
- Receiving organization
- priority
- date
- assigned staff
- status
- follow-up
- outcome

All organizations must be fictional.

**10\. Module F - Humanitarian Services Map**

Route:

/services/map

Use **Leaflet + OpenStreetMap**.

Show fictional service points.

Categories:

- Medical
- Psychosocial
- Protection
- Family Link
- Rehabilitation
- Assistance
- Information

Each marker:

Service Name

Category

Region

Opening Hours

Services

Contact - DEMO

Never place fictional organizations on real sensitive locations in a way that could be mistaken for real humanitarian service information.

Clearly label the map:

DEMONSTRATION DATA - NOT A REAL SERVICE DIRECTORY

This module is conceptually justified because RedSafe includes a humanitarian service map.

**11\. Module G - Data Quality Center**

Route:

/data-quality

This is especially important because ICRC's Data Management & Analytics function explicitly focuses on data quality, system support and turning data into operational insights.

Display:

Overall Data Quality 94%

Completeness 96%

Accuracy 93%

Consistency 91%

Timeliness 95%

Duplicate Rate 2%

Unverified Records 7

Features:

- Missing required fields
- Duplicate detection
- Invalid values
- inconsistent records
- stale records
- duplicate person candidates
- data-quality alerts

**12\. Module H - Security Center**

Route:

/security

Display:

SECURITY OVERVIEW

Security Score 92%

Failed Login Attempts 7

Suspicious Activities 2

Active Sessions 18

Sensitive Exports 4

Permission Changes 3

Critical Events 0

Include:

**Security events**

LOGIN_FAILURE

UNUSUAL_ACCESS

PERMISSION_CHANGE

DATA_EXPORT

ACCOUNT_LOCKED

SESSION_REVOKED

**13\. Module I - Audit Center**

Route:

/audit-logs

Every important action must generate an audit record.

Example:

USER:

caseworker01

ACTION:

VIEW_CASE

RESOURCE:

CASE-000184

TIMESTAMP:

2026-08-11 09:42

RESULT:

SUCCESS

Audit:

- login
- logout
- failed login
- case creation
- case modification
- sensitive record access
- export
- permission change
- user creation
- user deactivation
- security setting change
- synchronization

Audit records should be append-oriented and protected from ordinary user modification.

**14\. Module J - Privacy Center**

Route:

/privacy

Display:

**Data inventory**

Dataset

Purpose

Sensitivity

Retention

Access level

Encryption

Example:

| **Dataset** | **Sensitivity** | **Purpose**     | **Access**    |
| ----------- | --------------- | --------------- | ------------- |
| Cases       | High            | Case management | Authorized    |
| Person data | Critical        | Protection      | Restricted    |
| Analytics   | Medium          | Planning        | Managers      |
| Audit logs  | High            | Accountability  | Admin/Auditor |

Include:

- data minimization
- retention policies
- access requests
- deletion workflow
- pseudonymization
- privacy events
- data-processing notices

Do not claim these are official ICRC policies. The implementation should be described as an **independent demonstration inspired by publicly available humanitarian data-protection principles**. ICRC's own framework emphasizes integrity, confidentiality, availability, dignity and protection of individuals.

**15\. Module K - Offline Field Mode**

This is mandatory.

Build the application as a **Progressive Web App**.

Use:

- Service Worker
- IndexedDB
- offline cache
- local draft storage
- synchronization queue

Field workflow:

ONLINE

↓

Download assigned cases

↓

OFFLINE

↓

Create/update case

↓

Saved locally

↓

ONLINE AGAIN

↓

Sync queue

↓

Server validation

↓

Successful synchronization

Show a visible status:

🟢 Online

or:

🟠 Offline - 3 changes pending

Create an **Offline Center**:

/offline

Display:

Pending changes: 3

Last synchronization: 09:42

Successful: 18

Failed: 0

RedSafe itself supports selected offline functionality, so offline capability is an appropriate humanitarian design consideration rather than a gimmick.

**16\. Module L - Responsible AI Assistant**

Create:

/ai-assistant

Only use synthetic data.

Capabilities:

**Case summary**

Convert fictional case notes into:

- concise summary
- key issues
- missing information

**Data quality assistant**

Identify:

- incomplete fields
- conflicting dates
- duplicate candidates

**Classification assistance**

Suggest:

Case type:

Family Separation

Confidence:

89%

Always display:

**AI-generated suggestion. Human review is required.**

Never allow the AI to:

- make final eligibility decisions
- determine a person's fate
- automatically confirm identity
- automatically close a case
- disclose sensitive data
- make decisions without human approval

The recent ICRC regional cybersecurity/data-protection symposium specifically included responsible AI and privacy-by-design, so responsible rather than flashy AI is the right approach.

**17\. Database architecture**

Use:

**PostgreSQL + Prisma**

Core schema:

users

roles

permissions

user_roles

role_permissions

persons

person_identifiers

cases

case_types

case_statuses

case_assignments

case_notes

case_documents

family_link_cases

missing_person_cases

potential_matches

match_reviews

referrals

services

service_locations

notifications

audit_logs

security_events

login_attempts

sessions

data_quality_issues

data_quality_checks

privacy_records

retention_policies

data_access_requests

offline_sync_queue

ai_requests

ai_reviews

**18\. Important relationships**

**User**

User 1 ─── \* CaseAssignment

User 1 ─── \* AuditLog

User 1 ─── \* SecurityEvent

User \* ─── \* Role

**Case**

Case 1 ─── \* CaseNote

Case 1 ─── \* Referral

Case 1 ─── \* CaseAssignment

Case 1 ─── \* AuditLog

Case 1 ─── 0..1 FamilyLinkCase

**Person**

Person 1 ─── \* Cases

Person 1 ─── \* PersonIdentifiers

**Family link**

FamilyLinkCase 1 ─── \* PotentialMatch

PotentialMatch 1 ─── \* MatchReview

**19\. PostgreSQL requirements**

Use:

- UUID primary keys
- foreign keys
- indexes
- unique constraints
- check constraints
- timestamps
- soft deletion where appropriate
- created_by / updated_by
- status enums

Index:

cases.status

cases.priority

cases.region

cases.created_at

cases.assigned_to

persons.pseudonym

audit_logs.user_id

audit_logs.created_at

security_events.severity

**20\. API specification**

Use REST.

Base:

/api/v1

**Authentication**

POST /auth/login

POST /auth/logout

POST /auth/refresh

POST /auth/mfa/verify

GET /auth/me

**Users**

GET /users

POST /users

GET /users/:id

PATCH /users/:id

DELETE /users/:id

**Cases**

GET /cases

POST /cases

GET /cases/:id

PATCH /cases/:id

DELETE /cases/:id

POST /cases/:id/assign

POST /cases/:id/notes

POST /cases/:id/referrals

POST /cases/:id/archive

**Persons**

GET /persons

POST /persons

GET /persons/:id

PATCH /persons/:id

**Family links**

GET /family-links

POST /family-links

GET /family-links/:id

PATCH /family-links/:id

POST /family-links/:id/matches

GET /family-links/:id/matches

POST /matches/:id/review

**Referrals**

GET /referrals

POST /referrals

GET /referrals/:id

PATCH /referrals/:id

**Services**

GET /services

POST /services

GET /services/:id

PATCH /services/:id

**Analytics**

GET /analytics/overview

GET /analytics/cases

GET /analytics/referrals

GET /analytics/data-quality

GET /analytics/security

**Audit**

GET /audit-logs

GET /security-events

**Privacy**

GET /privacy/datasets

GET /privacy/retention

POST /privacy/access-requests

**Offline synchronization**

POST /sync/push

POST /sync/pull

GET /sync/status

**AI**

POST /ai/case-summary

POST /ai/data-quality

POST /ai/match-analysis

**21\. Security architecture**

The AI must implement **defense in depth**.

**Authentication**

Use secure authentication.

Requirements:

- strong password policy
- password hashing using Argon2id or platform-supported secure hashing
- MFA/TOTP
- session expiration
- refresh-token rotation where applicable
- logout/session revocation
- account lockout/rate limiting

**Authorization**

Every protected endpoint must enforce RBAC **server-side**.

Never rely on:

if (user.role === ...)

only in the frontend.

**22\. API security**

Implement:

- schema validation
- input sanitization
- parameterized queries/Prisma
- rate limiting
- CORS restrictions
- secure headers
- request size limits
- authentication middleware
- authorization middleware
- error handling
- no sensitive data in errors
- no stack traces in production

Use OWASP-oriented security testing.

**23\. Sensitive-data protection**

Use:

**Passwords**

Never encrypt passwords.

Hash them.

**Sensitive fields**

Where appropriate, encrypt:

- personal identifiers
- sensitive contact information
- highly sensitive case attributes

Use authenticated encryption such as AES-256-GCM if implementing application-level encryption.

Never hardcode encryption keys.

Use environment variables/secrets.

**24\. Frontend security**

Never expose:

DATABASE_URL

SERVICE_ROLE_KEY

ENCRYPTION_KEY

JWT_SECRET

in frontend code.

The browser should only receive public/client-safe configuration.

**25\. Environment variables**

Create:

DATABASE_URL=

DIRECT_URL=

SUPABASE_URL=

SUPABASE_ANON_KEY=

AUTH_SECRET=

ENCRYPTION_KEY=

AI_API_KEY=

MAP_TILE_URL=

NODE_ENV=

Create:

.env.example

with empty placeholders.

Never commit:

.env

.env.local

\*.pem

\*.key

secrets.json

Add them to .gitignore.

**26\. UI/UX specification**

The interface should feel like a **professional humanitarian operations platform**, not a student dashboard.

**Visual direction**

Use:

- deep navy
- white
- restrained blue
- neutral gray
- subtle status colors

Avoid excessive gradients.

Avoid giant cards.

Avoid excessive rounded corners.

Avoid gamification.

Avoid flashy animations.

**27\. Layout**

Desktop:

┌──────────────────────────────────────────────┐

│ Topbar │

├──────────────┬───────────────────────────────┤

│ │ │

│ Sidebar │ Main content │

│ │ │

│ Dashboard │ │

│ Cases │ │

│ Family Link │ │

│ Referrals │ │

│ Services │ │

│ Analytics │ │

│ Data Quality │ │

│ Security │ │

│ Privacy │ │

│ Audit Logs │ │

│ Offline │ │

│ AI Assistant │ │

│ Settings │ │

└──────────────┴───────────────────────────────┘

Mobile:

- responsive sidebar
- bottom navigation where appropriate
- large touch targets
- offline status always visible

**28\. Pages**

Build these pages:

/login

/mfa

/dashboard

/cases

/cases/new

/cases/:id

/persons

/persons/:id

/family-links

/family-links/new

/family-links/:id

/referrals

/referrals/:id

/services

/services/map

/analytics

/data-quality

/security

/audit-logs

/privacy

/offline

/ai-assistant

/users

/roles-permissions

/settings

/profile

**29\. Case page design**

Header:

CASE HP-2026-00184

Family Separation

HIGH

UNDER INVESTIGATION

Tabs:

Overview

Person

Notes

Referrals

Family Link

Documents

Timeline

Audit

Right panel:

Assigned Officer

Priority

Region

Created

Last Updated

Do not put all sensitive information into one giant screen.

Use progressive disclosure.

**30\. Accessibility**

Implement:

- WCAG-oriented contrast
- keyboard navigation
- semantic HTML
- accessible labels
- focus states
- ARIA only where necessary
- screen-reader friendly tables
- no color-only status indicators

Example:

Instead of only:

🔴

show:

**Critical**

**31\. English + Amharic**

Implement i18n.

Language selector:

English

አማርኛ

Translation structure:

/locales/en.json

/locales/am.json

Ensure the layout handles Amharic text correctly.

**32\. Synthetic dataset**

Create a seed script generating:

**Users**

50 fictional users.

**Cases**

1,000+ synthetic cases.

**Persons**

1,500 synthetic persons.

**Family-link requests**

**Potential matches**

**Referrals**

**Services**

100 fictional service locations.

**Audit records**

5,000+.

**Security events**

500+.

**Data-quality issues**

250+.

Use realistic Ethiopian regional data:

Addis Ababa

Oromia

Amhara

Tigray

Afar

Somali

Benishangul-Gumuz

Gambela

Harari

Sidama

South Ethiopia

Central Ethiopia

South West Ethiopia

But make clear:

**All records are synthetic.**

Do not use real people.

**33\. Demo accounts**

Seed accounts:

<admin@hpis.demo>

<manager@hpis.demo>

<protection@hpis.demo>

<caseworker@hpis.demo>

<data@hpis.demo>

<field@hpis.demo>

<auditor@hpis.demo>

<viewer@hpis.demo>

Use an obvious demo password supplied through environment variables or seed configuration.

Do not use production-style credentials.

**34\. Testing requirements**

The AI must not say:

"Tests are included."

It must actually create tests.

**Unit tests**

Test:

- authentication
- authorization
- case transitions
- matching algorithm
- validation
- data-quality scoring
- encryption/decryption
- sync conflict handling

**Integration tests**

Test:

- API
- database
- authentication
- RBAC
- audit logging
- offline synchronization

**E2E**

Use Playwright.

Test:

**Login**

Login → MFA → Dashboard

**Case**

Create case → assign → note → referral → resolve

**Family link**

Create case → generate candidates → review match

**Security**

Unauthorized user → denied

**Offline**

Go offline → create case → reconnect → sync

**Audit**

Sensitive action → audit record created

**35\. Security testing**

Include:

- dependency audit
- npm audit
- OWASP-oriented tests
- authentication bypass tests
- authorization tests
- IDOR tests
- SQL injection tests
- XSS tests
- CSRF consideration
- rate-limit tests
- sensitive-information exposure tests
- insecure direct object access tests

Do not add real offensive exploit tooling.

The goal is defensive verification.

**36\. Performance targets**

For the demo:

**Initial page load**

Target:

< 3 seconds on normal broadband

**API**

Typical requests:

< 500ms

**Database**

Indexed common queries.

**Dashboard**

Avoid querying thousands of records individually.

Use aggregate queries/materialized views where appropriate.

**37\. Offline synchronization design**

Use:

sync_queue

Fields:

id

user_id

device_id

operation

entity

entity_id

payload

created_at

attempt_count

status

last_error

Statuses:

PENDING

SYNCING

SUCCESS

FAILED

CONFLICT

Conflict strategy:

Never silently overwrite important data.

Show:

CONFLICT DETECTED

Server version

Local version

\[Review\]

**38\. Disaster recovery demonstration**

Create a documentation page:

/admin/system-health

Show:

Database

Healthy

Backup

Last successful: Today 02:00

Storage

Healthy

API

Healthy

Sync service

Healthy

Do not pretend this is a real production backup service if it isn't.

For the demo, document:

- backup strategy
- recovery point objective
- recovery time objective
- restoration procedure

**39\. CI/CD**

Create GitHub Actions:

.github/workflows/ci.yml

Pipeline:

Install

↓

Lint

↓

Typecheck

↓

Unit tests

↓

Integration tests

↓

Build

↓

Security/dependency checks

Optional:

Deploy preview

**40\. Docker**

Create:

Dockerfile

docker-compose.yml

Services:

frontend

backend

postgres

Development:

docker compose up

Production should preferably use managed PostgreSQL rather than exposing a database container publicly.

**41\. Deployment architecture**

Recommended:

Internet

│

▼

┌──────────────┐

│ Frontend │

│ Vercel/etc. │

└──────┬───────┘

│ HTTPS

▼

┌──────────────┐

│ Backend │

│ Node/Express │

└──────┬───────┘

│

▼

┌──────────────┐

│ PostgreSQL │

│ Supabase/etc │

└──────────────┘

Use:

- HTTPS
- secure environment variables
- production database
- database migrations
- health endpoint
- logging
- monitoring

**42\. Production routes**

Frontend:

/

Backend:

/api/v1

Health:

/api/health

Example response:

{

"status": "healthy",

"version": "1.0.0"

}

**43\. Documentation requirements**

The repository must contain:

README.md

docs/

├── architecture.md

├── database.md

├── api.md

├── security.md

├── threat-model.md

├── privacy-by-design.md

├── data-protection.md

├── offline-sync.md

├── testing.md

├── deployment.md

├── user-guide.md

└── assumptions.md

Also include:

docs/diagrams/

├── architecture.png

├── erd.png

├── dfd-level-0.png

├── dfd-level-1.png

└── security-architecture.png

**44\. Threat model**

Document at least:

| **Threat**               | **Severity** | **Mitigation**                |
| ------------------------ | ------------ | ----------------------------- |
| Stolen credentials       | Critical     | MFA, rate limits              |
| Unauthorized case access | Critical     | RBAC                          |
| Database breach          | Critical     | encryption, least privilege   |
| Insider misuse           | Critical     | audit logs                    |
| Data export abuse        | High         | export permissions            |
| Lost device              | High         | session/device controls       |
| Network interception     | High         | TLS                           |
| Malicious input          | High         | validation                    |
| Duplicate records        | Medium       | matching/data quality         |
| Connectivity loss        | High         | offline mode                  |
| AI misuse                | High         | human review + synthetic data |

**45\. Architecture principles**

The AI must follow:

**Privacy by design**

Not:

security added at the end.

**Least privilege**

Users receive the minimum permissions needed.

**Data minimization**

Do not collect unnecessary information.

**Secure by default**

Sensitive functionality disabled unless authorized.

**Human in the loop**

AI suggestions never become autonomous humanitarian decisions.

**Offline resilience**

Core field workflows remain functional during connectivity loss.

**Auditability**

Sensitive actions are traceable.

**Maintainability**

Clean modular architecture.

**46\. Master AI prompt**

Below is the prompt I recommend giving **Antigravity, Cursor, Replit Agent, Claude Code, or another coding agent**.

**MASTER BUILD PROMPT - HPIS**

You are a senior full-stack engineer, information-systems architect, cybersecurity engineer, UX designer, QA engineer, and DevOps engineer.

Build a complete production-quality portfolio prototype called:

**HPIS - Humanitarian Protection & Information Security Platform**

Tagline:

"Secure information management for humanitarian protection and field operations."

**IMPORTANT PROJECT CONTEXT**

This is an independent portfolio/academic project designed to demonstrate Information Systems, cybersecurity, data management, privacy-by-design, humanitarian workflow modeling, offline-first engineering, analytics, GIS, and responsible AI.

The application is NOT an official ICRC system.

Do NOT claim affiliation, endorsement, partnership, authorization, or ownership by the International Committee of the Red Cross.

Use only fictional/synthetic data.

Display the following disclaimer in the footer and README:

"Independent portfolio project. HPIS is not affiliated with, endorsed by, or connected to the International Committee of the Red Cross (ICRC). All people, cases, locations, organizations and records are fictional and created solely for demonstration purposes."

Do not scrape or use real humanitarian beneficiary information.

**PRIMARY GOAL**

Build a polished, secure, responsive humanitarian information-management platform demonstrating:

1. Humanitarian case management
2. Person and identity management
3. Family-link / missing-person workflow
4. Potential-match assistance
5. Referral management
6. Humanitarian services map
7. Operational analytics
8. Data-quality management
9. Cybersecurity monitoring
10. Audit logging
11. Privacy-by-design
12. Role-based access control
13. Offline field operation
14. Responsible AI assistance
15. English and Amharic localization
16. Professional testing
17. CI/CD
18. Dockerized development
19. Production-ready deployment architecture

The application must be fully functional. Do not create fake buttons, fake APIs, static dashboards pretending to be dynamic, or unfinished placeholder pages.

If a feature cannot be implemented completely, document it clearly rather than pretending it works.

**TECHNOLOGY STACK**

Use the following stack unless the existing environment requires an equivalent:

Frontend:

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- TanStack Query
- React Hook Form
- Zod
- Recharts
- Leaflet
- i18next/react-i18next
- PWA/service worker

Backend:

- Node.js
- TypeScript
- Express
- Prisma

Database:

- PostgreSQL

Authentication:

- Secure application authentication with MFA/TOTP capability.
- Supabase Auth may be used if Supabase is already configured.
- Otherwise implement secure backend authentication.

Testing:

- Vitest/Jest for unit/integration tests
- Playwright for E2E

Infrastructure:

- Docker
- Docker Compose
- GitHub Actions

Use clean modular architecture.

Do not over-engineer the application with unnecessary microservices.

A modular monolith is preferred for this portfolio project.

**DESIGN DIRECTION**

The UI must look like a serious humanitarian operations platform.

Use:

- deep navy
- white
- restrained blue
- neutral gray
- subtle semantic status colors

Avoid:

- excessive gradients
- excessive rounded cards
- gaming aesthetics
- unnecessary animations
- giant hero sections
- excessive glassmorphism
- generic AI-generated dashboard appearance

The interface should feel professional, calm, accessible, operational, and trustworthy.

Responsive requirements:

- desktop
- tablet
- mobile

Support:

- keyboard navigation
- semantic HTML
- accessible labels
- visible focus states
- WCAG-oriented contrast
- screen-reader-friendly tables

Implement:  
English  
Amharic (አማርኛ)

Use a proper i18n architecture rather than hardcoding translated strings throughout components.

**APPLICATION LAYOUT**

Desktop:

Top bar:

- application logo/name
- search
- notifications
- online/offline status
- language selector
- profile menu

Sidebar:

Dashboard  
Cases  
Persons  
Family Link  
Referrals  
Services Map  
Analytics  
Data Quality  
Security Center  
Audit Logs  
Privacy Center  
Offline Center  
AI Assistant  
Users & Roles  
Settings

Mobile:

- responsive navigation
- accessible mobile menu
- persistent online/offline indicator

**USER ROLES**

Create:

SUPER_ADMIN  
PROGRAM_MANAGER  
PROTECTION_OFFICER  
CASE_WORKER  
DATA_OFFICER  
FIELD_OFFICER  
AUDITOR  
VIEWER

Implement server-side RBAC.

Never rely solely on frontend role checks.

Every protected API endpoint must verify authorization on the server.

**PERMISSION MODEL**

Create granular permissions.

Examples:

cases  
cases  
cases  
cases  
cases  
cases

persons  
persons  
persons

family_links  
family_links  
family_links  
family_links

referrals  
referrals  
referrals

analytics

security  
security

audit

privacy  
privacy

users  
roles

ai

offline

Create role-permission mappings in the database.

**DATABASE**

Use PostgreSQL and Prisma.

Use:

- UUID primary keys
- foreign keys
- indexes
- unique constraints
- enum/status values where appropriate
- createdAt
- updatedAt
- createdBy
- updatedBy
- soft deletion where appropriate

Create these core models:

User  
Role  
Permission  
UserRole  
RolePermission

Person  
PersonIdentifier

Case  
CaseType  
CaseStatus  
CaseAssignment  
CaseNote  
CaseDocument

FamilyLinkCase  
MissingPersonCase  
PotentialMatch  
MatchReview

Referral  
Service  
ServiceLocation

Notification

AuditLog  
SecurityEvent  
LoginAttempt  
Session

DataQualityIssue  
DataQualityCheck

PrivacyRecord  
RetentionPolicy  
DataAccessRequest

OfflineSyncItem

AIRequest  
AIReview

Create all appropriate relationships and indexes.

**CASE MANAGEMENT**

Routes:

/cases  
/cases/new  
/cases/

Support:

- search
- filtering
- sorting
- pagination
- create
- edit
- view
- assign
- notes
- referrals
- status changes
- priority changes
- archive
- audit history

Case types:

PROTECTION  
FAMILY_SEPARATION  
MISSING_PERSON  
REFERRAL  
ASSISTANCE  
HEALTH  
PSYCHOSOCIAL_SUPPORT  
DETENTION_VISIT  
OTHER

Statuses:

NEW  
ASSESSMENT  
INVESTIGATION  
REFERRAL  
FOLLOW_UP  
RESOLVED  
ARCHIVED

Priorities:

LOW  
MEDIUM  
HIGH  
CRITICAL

Implement valid state transitions.

Do not allow arbitrary invalid transitions.

**PERSON MANAGEMENT**

Routes:

/persons  
/persons/

Use pseudonymization.

Example:

PERSON-ET-000184

Avoid unnecessarily exposing sensitive information.

Support:

- internal ID
- pseudonym
- age range
- sex
- region
- last known location
- contact status
- verification status
- linked cases

Restrict sensitive fields according to role.

**FAMILY LINK MODULE**

Routes:

/family-links  
/family-links/new  
/family-links/

Features:

- create tracing request
- last known contact
- location
- family relationship
- circumstances
- follow-up
- status
- potential matches
- human verification

Statuses:

NEW  
UNDER_REVIEW  
SEARCHING  
POTENTIAL_MATCH  
VERIFICATION_REQUIRED  
MATCH_CONFIRMED  
RESOLVED  
CLOSED

**POTENTIAL MATCH ENGINE**

Implement a deterministic matching engine for synthetic data.

Suggested weights:

Name similarity: 30%  
Age compatibility: 15%  
Location similarity: 20%  
Date similarity: 15%  
Other attributes: 20%

Return:

- overall score
- component scores
- explanation

Example:

Potential Match  
Score: 87%

Name: 92%  
Location: 90%  
Age: 100%  
Date: 75%  
Other: 82%

Always display:

"System/AI suggestion only. Authorized human verification is required."

Never automatically confirm identity.

**REFERRALS**

Routes:

/referrals  
/referrals/

Categories:

PROTECTION  
MEDICAL  
PSYCHOSOCIAL  
FAMILY_LINK  
REHABILITATION  
EMERGENCY_ASSISTANCE  
LEGAL_INFORMATION  
OTHER

Statuses:

PENDING  
ACCEPTED  
IN_PROGRESS  
COMPLETED

Support:

- case
- service
- fictional organization
- priority
- assigned staff
- status
- follow-up
- outcome

**SERVICES MAP**

Route:

/services/map

Use Leaflet/OpenStreetMap.

Use fictional service locations.

Categories:

Medical  
Psychosocial  
Protection  
Family Link  
Rehabilitation  
Assistance  
Information

Display:

"DEMONSTRATION DATA - NOT A REAL SERVICE DIRECTORY"

Do not present fictional service providers as real organizations.

**DASHBOARD**

Route:

/dashboard

Display live database-driven metrics:

- Active cases
- High priority cases
- Family-link cases
- Open referrals
- Resolved this month
- Average resolution time
- Data quality score
- Pending reviews
- Security events

Charts:

- cases by region
- cases by type
- cases by status
- priority distribution
- referral status
- resolution trend
- data-quality trend

Do not hardcode dashboard values.

**DATA QUALITY CENTER**

Route:

/data-quality

Display:

Overall quality  
Completeness  
Accuracy  
Consistency  
Timeliness  
Duplicate rate  
Unverified records

Implement detection of:

- missing required fields
- duplicate persons
- duplicate cases
- invalid dates
- inconsistent statuses
- stale records
- invalid references

Allow authorized DATA_OFFICER users to review and resolve data-quality issues.

**SECURITY CENTER**

Route:

/security

Display:

Security Score  
Failed Login Attempts  
Suspicious Activities  
Active Sessions  
Sensitive Exports  
Permission Changes  
Critical Events

Security event types:

LOGIN_FAILURE  
UNUSUAL_ACCESS  
PERMISSION_CHANGE  
DATA_EXPORT  
ACCOUNT_LOCKED  
SESSION_REVOKED

Do not expose highly sensitive security information to unauthorized roles.

**AUDIT LOGGING**

Route:

/audit-logs

Create audit events for:

- login
- logout
- failed login
- case creation
- case modification
- sensitive record access
- export
- permission changes
- user creation
- user deactivation
- security changes
- synchronization
- AI-assisted actions

Audit logs should be append-oriented.

Normal users must not be able to modify or delete audit records.

Each log should include:

user  
action  
resource  
resourceId  
timestamp  
IP metadata where appropriate  
user agent metadata where appropriate  
result  
metadata

Do not store sensitive information unnecessarily in audit metadata.

**PRIVACY CENTER**

Route:

/privacy

Display:

- data inventory
- dataset sensitivity
- purpose
- access level
- retention
- encryption status
- privacy events
- access requests
- deletion requests

Implement principles:

- data minimization
- purpose limitation
- least privilege
- pseudonymization
- retention
- secure deletion workflow
- access accountability

Do not claim these settings are official ICRC policy.

Clearly document that this is an independent demonstration inspired by publicly available humanitarian data-protection principles.

**SECURITY ARCHITECTURE**

Implement defense in depth.

Authentication:

- strong passwords
- secure password hashing
- MFA/TOTP capability
- session expiration
- session revocation
- rate limiting
- account lockout protection

API:

- Zod validation
- authorization middleware
- rate limiting
- secure headers
- CORS
- request size limits
- safe error responses
- no production stack traces
- parameterized/database-safe queries

Frontend:  
Never expose:  
DATABASE_URL  
SERVICE_ROLE_KEY  
AUTH_SECRET  
ENCRYPTION_KEY  
AI_API_KEY

Sensitive secrets must remain server-side.

**ENCRYPTION**

Passwords:

- hash only
- never encrypt

Sensitive fields:

- encrypt where appropriate using authenticated encryption such as AES-256-GCM
- keys must come from environment secrets
- never hardcode keys

Create an abstraction:

EncryptionService

with:  
encrypt()  
decrypt()

Do not encrypt every database field unnecessarily.

**SECURITY HEADERS**

Implement secure HTTP headers.

Use an appropriate security middleware such as Helmet.

Configure:

- Content Security Policy where practical
- frame protection
- MIME sniffing protection
- referrer policy
- secure transport headers in production

**OFFLINE-FIRST FIELD MODE**

Build a PWA.

Use:

- service worker
- IndexedDB
- offline cache
- sync queue

Route:

/offline

Display:

Online/offline status  
Pending changes  
Last sync  
Successful sync  
Failed sync  
Conflicts

Offline workflow:

ONLINE  
Download assigned cases  
OFFLINE  
Create/update case  
Store locally  
ONLINE AGAIN  
Synchronize  
Validate  
Commit  
Update local state

Never silently overwrite important data.

If conflict occurs:

Show both versions and require human resolution.

**SYNC DATABASE MODEL**

OfflineSyncItem:

id  
userId  
deviceId  
operation  
entity  
entityId  
payload  
createdAt  
attemptCount  
status  
lastError

Statuses:

PENDING  
SYNCING  
SUCCESS  
FAILED  
CONFLICT

**RESPONSIBLE AI**

Route:

/ai-assistant

Use only synthetic data.

Implement:

1. Case summary assistance
2. Missing-information detection
3. Data-quality assistance
4. Potential-match explanation

Every AI result must display:

"AI-generated suggestion. Human review is required."

AI must never:

- automatically confirm identity
- determine humanitarian eligibility
- close cases automatically
- make irreversible decisions
- disclose private information
- send sensitive real-world data to external AI services

If no AI API key is available, provide a deterministic local demo mode and clearly label it:

"Demo AI mode"

Do not make the application unusable without an AI provider.

**INTERNATIONALIZATION**

Implement:

English  
Amharic

Use:

/locales/en.json  
/locales/am.json

All visible strings must come from translation resources.

**SYNTHETIC DATA**

Create a seed system.

Generate at least:

50 users  
1,000 cases  
1,500 persons  
250 family-link cases  
300 potential matches  
500 referrals  
100 fictional services  
5,000 audit logs  
500 security events  
250 data-quality issues

Use synthetic Ethiopian regional data:

Addis Ababa  
Oromia  
Amhara  
Tigray  
Afar  
Somali  
Benishangul-Gumuz  
Gambela  
Harari  
Sidama  
South Ethiopia  
Central Ethiopia  
South West Ethiopia

Never use real personal data.

Every seed record must be fictional.

**DEMO ACCOUNTS**

Create:

[admin@hpis.demo](mailto:admin@hpis.demo)  
[manager@hpis.demo](mailto:manager@hpis.demo)  
[protection@hpis.demo](mailto:protection@hpis.demo)  
[caseworker@hpis.demo](mailto:caseworker@hpis.demo)  
[data@hpis.demo](mailto:data@hpis.demo)  
[field@hpis.demo](mailto:field@hpis.demo)  
[auditor@hpis.demo](mailto:auditor@hpis.demo)  
[viewer@hpis.demo](mailto:viewer@hpis.demo)

Do not hardcode production credentials.

Use seed/environment configuration for demo passwords.

**REST API**

Base path:

/api/v1

Authentication:

POST /auth/login  
POST /auth/logout  
POST /auth/refresh  
POST /auth/mfa/verify  
GET /auth/me

Users:

GET /users  
POST /users  
GET /users/  
PATCH /users/  
DELETE /users/

Cases:

GET /cases  
POST /cases  
GET /cases/  
PATCH /cases/  
DELETE /cases/  
POST /cases//assign  
POST /cases//notes  
POST /cases//referrals  
POST /cases//archive

Persons:

GET /persons  
POST /persons  
GET /persons/  
PATCH /persons/

Family Link:

GET /family-links  
POST /family-links  
GET /family-links/  
PATCH /family-links/  
POST /family-links//matches  
GET /family-links//matches  
POST /matches//review

Referrals:

GET /referrals  
POST /referrals  
GET /referrals/  
PATCH /referrals/

Services:

GET /services  
POST /services  
GET /services/  
PATCH /services/

Analytics:

GET /analytics/overview  
GET /analytics/cases  
GET /analytics/referrals  
GET /analytics/data-quality  
GET /analytics/security

Audit:

GET /audit-logs  
GET /security-events

Privacy:

GET /privacy/datasets  
GET /privacy/retention  
POST /privacy/access-requests

Sync:

POST /sync/push  
POST /sync/pull  
GET /sync/status

AI:

POST /ai/case-summary  
POST /ai/data-quality  
POST /ai/match-analysis

Health:

GET /api/health

**ERROR HANDLING**

Use consistent API responses.

Success:

{  
"success": true,  
"data": {}  
}

Error:

{  
"success": false,  
"error": {  
"code": "VALIDATION_ERROR",  
"message": "Invalid request."  
}  
}

Never expose stack traces or secrets in production.

**UI PAGES**

Build all of these:

/login  
/mfa  
/dashboard  
/cases  
/cases/new  
/cases/  
/persons  
/persons/  
/family-links  
/family-links/new  
/family-links/  
/referrals  
/referrals/  
/services  
/services/map  
/analytics  
/data-quality  
/security  
/audit-logs  
/privacy  
/offline  
/ai-assistant  
/users  
/roles-permissions  
/settings  
/profile

Every route must be functional.

**CASE DETAIL UI**

Header:

CASE HP-2026-00184  
Case type  
Priority  
Status

Tabs:

Overview  
Person  
Notes  
Referrals  
Family Link  
Documents  
Timeline  
Audit

Show:  
Assigned Officer  
Region  
Created  
Updated

Use progressive disclosure for sensitive information.

**DOCUMENT MANAGEMENT**

Do not implement unsafe arbitrary public file uploads.

For the demo:

- support fictional document metadata
- optionally support controlled uploads
- validate MIME type
- limit file size
- generate safe filenames
- never execute uploaded files
- store outside public web root
- authorize every download

If secure object storage is not configured, use metadata-only demo mode.

**NOTIFICATIONS**

Implement:

- assignment notifications
- referral updates
- security alerts
- data-quality alerts
- synchronization results

Use in-app notifications.

Do not send real-world messages.

**HEALTH MONITORING**

Create:

/admin/system-health

Show:

Database  
API  
Storage  
Sync service  
Last backup status

For demo purposes, do not pretend to have production infrastructure that does not exist.

Clearly distinguish:  
DEMO STATUS  
from  
REAL PRODUCTION MONITORING.

**DATABASE BACKUPS**

Document:

- backup strategy
- recovery point objective
- recovery time objective
- restoration procedure

If using managed PostgreSQL, document the provider's backup capabilities.

Do not claim backups exist unless actually configured.

**TESTING**

Create:

Unit tests  
Integration tests  
E2E tests

Unit tests:

- authentication
- authorization
- case transitions
- matching algorithm
- validation
- data quality scoring
- encryption
- sync conflicts

Integration:

- API
- database
- RBAC
- audit logging
- offline synchronization

Playwright E2E:

1. login
2. MFA flow/demo
3. dashboard
4. create case
5. assign case
6. add note
7. create referral
8. family-link workflow
9. unauthorized access denied
10. audit log created
11. offline case creation
12. reconnect and synchronization

**SECURITY TESTING**

Implement automated tests for:

- authentication bypass
- authorization bypass
- IDOR
- SQL injection protection
- XSS protection
- CSRF considerations
- rate limiting
- sensitive data exposure
- invalid input
- permission escalation
- session revocation

Run dependency security checks.

Use:

npm audit

or equivalent package-manager security audit.

Do not add offensive exploitation tooling.

**PERFORMANCE**

Target:

Typical API response under 500ms during normal demo load.

Initial page load target under 3 seconds on normal broadband.

Use:

- pagination
- indexed queries
- caching
- aggregate queries
- lazy loading
- code splitting

Avoid N+1 database queries.

**DOCKER**

Create:

Dockerfile  
docker-compose.yml

Development services:

frontend  
backend  
postgres

Use health checks.

Provide:

docker compose up

as a simple local development path.

**ENVIRONMENT VARIABLES**

Create:

.env.example

Include:

DATABASE_URL=  
DIRECT_URL=

SUPABASE_URL=  
SUPABASE_ANON_KEY=

AUTH_SECRET=  
ENCRYPTION_KEY=

AI_API_KEY=

MAP_TILE_URL=

NODE_ENV=

Never commit actual secrets.

Add appropriate patterns to .gitignore.

**CI/CD**

Create:

.github/workflows/ci.yml

Pipeline:

Install  
Lint  
Typecheck  
Unit tests  
Integration tests  
Build  
Dependency security check

Do not deploy if tests fail.

**DEPLOYMENT**

Provide production deployment documentation.

Recommended architecture:

Frontend:  
Vercel/Netlify

Backend:  
Render/Railway/Fly.io or equivalent

Database:  
Managed PostgreSQL/Supabase

Use HTTPS.

Use environment secrets.

Run database migrations during deployment safely.

Provide health endpoint:

/api/health

**README**

Write a professional README containing:

1. Project overview
2. Problem statement
3. Objectives
4. Features
5. Architecture
6. Technology stack
7. Database
8. Security
9. Privacy-by-design
10. Offline functionality
11. AI safety
12. Installation
13. Environment variables
14. Database setup
15. Seed instructions
16. Demo accounts
17. Testing
18. Deployment
19. Threat model
20. Limitations
21. Future improvements
22. Disclaimer

Include screenshots after the UI is completed.

**DOCUMENTATION**

Create:

docs/architecture.md  
docs/database.md  
docs/api.md  
docs/security.md  
docs/threat-model.md  
docs/privacy-by-design.md  
docs/data-protection.md  
docs/offline-sync.md  
docs/testing.md  
docs/deployment.md  
docs/user-guide.md  
docs/assumptions.md

Create diagrams:

architecture  
ERD  
DFD level 0  
DFD level 1  
security architecture

Use Mermaid where practical.

**THREAT MODEL**

Document:

stolen credentials  
unauthorized access  
database breach  
insider misuse  
data export abuse  
lost device  
network interception  
malicious input  
duplicate records  
connectivity loss  
AI misuse

For each:

- threat
- likelihood
- impact
- severity
- mitigation
- residual risk

**PRIVACY IMPACT ASSESSMENT**

Create an independent portfolio-level privacy assessment.

Cover:

- purpose
- data categories
- sensitivity
- data minimization
- access
- retention
- security
- offline storage
- synchronization
- AI processing
- risks
- mitigations

Do not claim it is an official ICRC assessment.

**SECURITY SCORE**

Create a transparent demo security score.

Example categories:

Authentication  
Authorization  
Data Protection  
Auditability  
Input Security  
Session Security  
Dependency Security  
Offline Security

Do not make it a fake "certification."

Label:

"HPIS Demonstration Security Posture"

**IMPORTANT DESIGN RULES**

Do not:

- use real humanitarian data
- use real beneficiary information
- use real ICRC operational information
- scrape private systems
- impersonate ICRC
- claim official affiliation
- expose secrets
- hardcode production credentials
- make autonomous humanitarian decisions
- make AI the decision maker
- create fake security claims
- create fake deployment status
- create fake backup status

Do:

- use synthetic data
- clearly label demo functionality
- document assumptions
- implement actual authorization
- implement actual audit logging
- implement actual validation
- implement actual tests
- implement actual offline synchronization
- implement actual database relationships
- implement professional error handling

**DEVELOPMENT PROCESS**

Work in phases.

PHASE 1:  
Project setup  
Architecture  
Database  
Authentication  
Base UI

PHASE 2:  
Case management  
Person management  
Family-link workflow  
Referrals

PHASE 3:  
Analytics  
Data quality  
Services map

PHASE 4:  
Security center  
Audit logs  
Privacy center  
RBAC hardening

PHASE 5:  
PWA  
Offline mode  
Synchronization  
Conflict handling

PHASE 6:  
Responsible AI  
English/Amharic

PHASE 7:  
Testing  
Security testing  
Performance optimization

PHASE 8:  
Docker  
CI/CD  
Deployment  
Documentation

After each phase:

- run tests
- run typecheck
- run lint
- fix errors
- verify database migrations
- verify routes
- verify permissions

Do not proceed while there are known build errors.

**DEFINITION OF DONE**

The project is complete only when:

- application starts successfully
- database migrates successfully
- seed data loads successfully
- authentication works
- role permissions work server-side
- dashboard uses real database queries
- cases CRUD works
- family-link workflow works
- potential matching works
- referrals work
- map works with synthetic data
- data-quality system works
- audit logs work
- security events work
- privacy center works
- offline mode works
- synchronization works
- conflict handling works
- English works
- Amharic works
- AI demo works or graceful demo mode works
- tests pass
- build passes
- Docker works
- CI passes
- README is complete
- architecture documentation is complete
- threat model is complete
- privacy documentation is complete
- deployment documentation is complete
- no real personal data is included
- no secrets are committed
- disclaimer is visible

**FINAL QUALITY REQUIREMENT**

Before declaring completion, behave like a senior code reviewer.

Inspect:

- frontend
- backend
- database schema
- API authorization
- authentication
- security
- privacy
- offline mode
- synchronization
- tests
- deployment
- documentation

Find and fix:

- broken routes
- broken buttons
- missing API calls
- authorization vulnerabilities
- TypeScript errors
- database errors
- UI overflow
- mobile problems
- empty states
- loading states
- error states
- accessibility issues
- inconsistent terminology
- hardcoded data where dynamic data is expected

Do not simply tell me that the project is complete.

Actually verify it.

At the end provide:

1. Final architecture summary
2. Technology stack
3. Database summary
4. Security controls implemented
5. Privacy controls implemented
6. Offline functionality implemented
7. Tests executed and results
8. Deployment instructions
9. Known limitations
10. Demo credentials
11. Exact local URL
12. Exact production URL if deployed

The final application should look and behave like a serious professional Information Systems portfolio project suitable for demonstrating to an international humanitarian organization.

**47\. How I would actually build this with your tools**

Since you've been using **Antigravity, Cursor, Replit, Supabase and GitHub**, don't paste the entire prompt into all three simultaneously.

Use this workflow:

**Step 1 - Antigravity/Cursor**

Use the master prompt to **build locally first**.

Have it create:

frontend

backend

database

docs

tests

Docker

CI

Run everything locally.

**Step 2 - GitHub**

Push the working version.

Repository name:

**humanitarian-protection-information-system**

or shorter:

**HPIS**

**Step 3 - Supabase**

Use Supabase for PostgreSQL/auth if that's the architecture you choose.

Do **not** put the Supabase service-role key in frontend code.

**Step 4 - Replit**

Only after the local application passes tests, use Replit to deploy it.

This avoids the problem you've encountered previously where an AI deployment agent burns usage trying to simultaneously **build + debug + deploy** a broken project.

**48\. One improvement I'd make specifically for your ICRC presentation**

Create a special route:

/demo

This should launch a **controlled 7-minute demonstration scenario**.

It should guide you through:

**1\. New humanitarian case**

↓

**2\. Family-link investigation**

↓

**3\. Potential match**

↓

**4\. Human review**

↓

**5\. Referral**

↓

**6\. Security/audit event**

↓

**7\. Offline field update**

↓

**8\. Synchronization**

↓

**9\. Dashboard analytics**

That gives you a rehearsed story instead of clicking randomly around the system.

**49\. What to show ICRC-and what not to show**

**Show**

**Information Systems**

- architecture
- database
- workflows
- data quality
- analytics

**Cybersecurity**

- RBAC
- MFA
- audit logs
- threat model
- encryption
- security events

**Humanitarian relevance**

- case management
- family-link workflow
- referrals
- offline field work

**Professionalism**

- documentation
- testing
- GitHub
- CI/CD
- deployment

**Don't lead with**

- flashy animations
- AI chatbot
- 3D graphics
- cryptocurrency
- blockchain
- dozens of technologies
- generic CRUD
- "I copied RedSafe"

The ICRC's own public technology work strongly emphasizes **privacy/security by design**, and its data-management career material emphasizes **data quality, system support, analytics and operational decision-making**.

**The strategic reason this project is strong**

Your objective isn't to prove that you can make a React website.

Your objective is to make the interviewer think:

**"This Information Systems graduate understands how technology, data, cybersecurity and humanitarian operations fit together."**

That is much more valuable.

And there is a particularly good timing angle: the ICRC's **June 2026 Nairobi symposium included Ethiopian participants and focused on cybersecurity, data protection, privacy-by-design, interoperability and responsible AI in humanitarian action**. Your project can legitimately demonstrate those exact concepts-without pretending to reproduce ICRC internal systems.

Also, I would monitor the ICRC's **Information Technology, Data Management & Analytics, Archives and Information Management, and Graduates and Students** categories rather than searching only for the exact title "Information Systems Intern."

[ICRC Careers - Current vacancies](https://careers.icrc.org/viewalljobs/?utm_source=chatgpt.com)

[ICRC Data Protection Framework](https://www.icrc.org/en/document/icrc-data-protection-framework?utm_source=chatgpt.com)

[ICRC RedSafe](https://www.icrc.org/en/redsafe?utm_source=chatgpt.com)

**One final recommendation:** don't let the coding agent generate everything in one giant uncontrolled operation. Use the master prompt as the **source specification**, then have Antigravity/Cursor implement it phase-by-phase and test after every phase. That will produce a much more reliable project and substantially reduce the kind of deployment/debugging loops you've encountered with Replit and Supabase before.