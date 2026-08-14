# Threat Model

> **Implementation status:** Partially implemented
> Last verified against code: 2026-08-12

| Threat | Likelihood | Impact | Severity | Mitigation | Mitigation status | Residual Risk |
| --- | --- | --- | --- | --- | --- | --- |
| Stolen credentials | Medium | High | High | MFA, rate limiting, session revocation | Planned | Medium |
| Unauthorized access | Medium | Critical | Critical | Server-side RBAC, audit logs | Implemented | Medium |
| Database breach | Low | Critical | Critical | least privilege, selected encryption, backups | Planned | Medium |
| Insider misuse | Medium | Critical | Critical | auditability, restricted exports, privacy mode | Partial | Medium |
| Data export abuse | Medium | High | High | permission controls, export logging | Planned | Medium |
| Lost field device | Medium | High | High | offline encryption target, session expiry | Planned | Medium |
| Network interception | Medium | High | High | HTTPS/TLS, secure cookies | Planned | Low |
| Malicious input | Medium | High | High | validation, sanitization, ORM, CSP | Partial | Low |
| Duplicate records | Medium | Medium | Medium | data-quality checks, human merge review | Planned | Low |
| Connectivity loss | High | Medium | High | PWA, sync queue, conflict resolution | Planned | Medium |
| AI misuse | Medium | High | High | demo mode, human review, no autonomous decisions | Partial | Medium |
