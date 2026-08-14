# Security Controls

> **Implementation status:** Partially implemented
> Last verified against code: 2026-08-12

## Implemented

- server-side RBAC on every protected endpoint (minimal implementation)
- request validation with Zod or equivalent (minimal implementation)
- parameterized database access through Prisma
- no secrets in frontend code
- audit logging for sensitive access, exports and permission changes (minimal implementation)

## Planned (Target Design)

- Strong password policy
- Argon2id or platform-supported secure password hashing
- MFA/TOTP capability
- session expiration and revocation
- secure headers with Helmet
- rate limiting and request size limits
- safe production errors without stack traces

Sensitive fields should be encrypted selectively with authenticated encryption such as AES-256-GCM. Passwords must be hashed, never encrypted.
