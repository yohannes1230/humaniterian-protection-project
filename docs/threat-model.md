# Threat Model

| Threat | Likelihood | Impact | Severity | Mitigation | Residual Risk |
| --- | --- | --- | --- | --- | --- |
| Stolen credentials | Medium | High | High | MFA, rate limiting, session revocation | Medium |
| Unauthorized access | Medium | Critical | Critical | Server-side RBAC, audit logs | Medium |
| Database breach | Low | Critical | Critical | least privilege, selected encryption, backups | Medium |
| Insider misuse | Medium | Critical | Critical | auditability, restricted exports, privacy mode | Medium |
| Data export abuse | Medium | High | High | permission controls, export logging | Medium |
| Lost field device | Medium | High | High | offline encryption target, session expiry | Medium |
| Network interception | Medium | High | High | HTTPS/TLS, secure cookies | Low |
| Malicious input | Medium | High | High | validation, sanitization, ORM, CSP | Low |
| Duplicate records | Medium | Medium | Medium | data-quality checks, human merge review | Low |
| Connectivity loss | High | Medium | High | PWA, sync queue, conflict resolution | Medium |
| AI misuse | Medium | High | High | demo mode, human review, no autonomous decisions | Medium |
