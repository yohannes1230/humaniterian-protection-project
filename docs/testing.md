# Testing

Current automated coverage:

- deterministic potential-match scoring

Target coverage:

- authentication and MFA
- authorization and RBAC
- case status transitions
- audit logging
- validation
- data-quality scoring
- encryption helper
- offline sync conflicts
- Playwright E2E for login, dashboard, case creation, referrals, family-link flow, access denial and synchronization

Security testing should include IDOR, authorization bypass, sensitive data exposure, invalid input, XSS and rate-limiting checks.
