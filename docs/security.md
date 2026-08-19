# Security & Cryptographic Controls

> **Implementation status:** Implemented & Verified (Phase 3 Hardened)
> Last verified against code: 2026-08-19

## Implemented Controls

### 1. Authentication & Role-Based Access Control (RBAC)
- **Supabase Auth Integration**: Real user authentication with JWT signing, secure cookie/bearer token handling, and magic link OTP support.
- **Fail-Closed Configuration**: Backend fails closed immediately at startup if `SUPABASE_JWT_SECRET` is not set; no default or hardcoded secrets are accepted.
- **Database-Authoritative Role Verification**: API middleware verifies JWT signatures and queries the PostgreSQL `profiles` table to look up the authoritative role. Unprovisioned identities or forged client claims in JWT payloads are rejected with `401 Unauthorized`.
- **PostgreSQL Row Level Security (RLS)**: Row-level database policies restrict queries at the engine layer across all application tables.

### 2. Multi-Factor Authentication (MFA / TOTP)
- Native TOTP enrollment and challenge verification via Supabase Auth MFA APIs (`supabase.auth.mfa.enroll`, `challenge`, `verify`).
- UI enrollment workflow with QR code generation and manual key recovery in account settings.
- Real-time Super Admin telemetry tracking officer MFA posture across privileged roles.

### 3. Application-Layer Field-Level Encryption
- **AES-256-GCM Authenticated Encryption**: Sensitive fields (`Person.restrictedName` and `Case.summary`) are encrypted at the application layer using Node's standard `crypto` module before persistence in PostgreSQL, and decrypted on authorized read.
- **Key Management**: Encryption keys are supplied via environment variable (`FIELD_ENCRYPTION_KEY`). Key rotation is documented as a known future enhancement.

### 4. Immutable Audit Trail & Telemetry
- Client-side insert permissions on `AuditLog` are disabled via RLS policies.
- Audit records are generated exclusively by backend service-role operations for case lifecycle transitions, exports, notes, and consent grants/revocations.

### 5. Rate Limiting & Abuse Prevention
- Configured with `express-rate-limit` across all `/api/` endpoints and specialized mutation rate limiters on case creation, status updates, and deletions.

### 6. Humanitarian Informed Consent Tracking
- First-class `Consent` tracking model implementing purpose limitation and scope restrictions per ICRC Professional Standards.
- Active consent inspection and officer revocation controls on Case Dossiers.

---

## Planned Future Hardening

- Automated KMS / Vault key rotation for field encryption keys.
- Hardware security key (WebAuthn / FIDO2) support.
- End-to-end client-side encryption (E2EE) for disconnected field devices.
