# API Specification

Base path: `/api/v1`

Authentication:

- `POST /auth/login`
- `POST /auth/logout`
- `POST /auth/refresh`
- `POST /auth/mfa/verify`
- `GET /auth/me`

Cases:

- `GET /cases`
- `POST /cases`
- `GET /cases/:id`
- `PATCH /cases/:id`
- `POST /cases/:id/assign`
- `POST /cases/:id/notes`
- `POST /cases/:id/referrals`
- `POST /cases/:id/archive`

Family link:

- `GET /family-links`
- `POST /family-links`
- `GET /family-links/:id`
- `PATCH /family-links/:id`
- `POST /family-links/:id/matches`
- `POST /matches/:id/review`

Security, privacy and sync:

- `GET /audit-logs`
- `GET /security-events`
- `GET /privacy/datasets`
- `POST /privacy/access-requests`
- `POST /sync/push`
- `POST /sync/pull`
- `GET /sync/status`

Error response:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request."
  }
}
```
