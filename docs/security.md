# Security Controls

Target controls:

- Strong password policy
- Argon2id or platform-supported secure password hashing
- MFA/TOTP capability
- session expiration and revocation
- server-side RBAC on every protected endpoint
- request validation with Zod or equivalent
- parameterized database access through Prisma
- secure headers with Helmet
- rate limiting and request size limits
- safe production errors without stack traces
- no secrets in frontend code
- audit logging for sensitive access, exports and permission changes

Sensitive fields should be encrypted selectively with authenticated encryption such as AES-256-GCM. Passwords must be hashed, never encrypted.
