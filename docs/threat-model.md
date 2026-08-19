# Threat Model

> **Implementation status:** Implemented & Verified (Phase 3 Hardened)
> Last verified against code: 2026-08-19

| Threat | Likelihood | Impact | Severity | Mitigation | Mitigation status | Residual Risk |
| --- | --- | --- | --- | --- | --- | --- |
| Stolen credentials | Medium | High | High | Supabase native TOTP MFA, Express rate limiting, session revocation | Implemented | Low |
| Unauthorized access | Medium | Critical | Critical | Server-side RBAC, PostgreSQL Row Level Security (RLS), DB-authoritative profile role check | Implemented | Low |
| Database breach | Low | Critical | Critical | Least privilege RLS, application-layer AES-256-GCM encryption on sensitive fields (`Person.restrictedName`, `Case.summary`) | Implemented (Partial) | Medium |
| Insider misuse | Medium | Critical | Critical | Immutable append-only audit logging (client direct insert disabled), emergency privacy mode, purpose-limited informed consent tracking | Implemented | Low |
| Data export abuse | Medium | High | High | Role-based export controls (Super Admin, Program Mgr, Data Officer only), mandatory cryptographic export audit logging | Implemented | Low |
| Lost field device | Medium | High | High | Offline encryption target, session expiry, emergency screen redaction | Partial | Medium |
| Network interception | Medium | High | High | HTTPS/TLS 1.3, JWT bearer tokens with signature validation, fail-closed startup secret checks | Implemented | Low |
| Malicious input | Medium | High | High | Zod schema validation, Prisma ORM parameterized queries, CSP headers | Implemented | Low |
| Duplicate records | Medium | Medium | Medium | Data-quality checks, deterministic Levenshtein potential-match resolution, human review gates | Implemented | Low |
| Connectivity loss | High | Medium | High | PWA offline capability, store-and-forward sync queue, conflict resolution rules | Implemented | Medium |
| AI misuse | Medium | High | High | Human-in-the-loop decision support only, deterministic heuristics, zero autonomous actions | Implemented | Low |
