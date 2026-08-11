# Deployment

Recommended production-style deployment:

- Frontend: Vercel or Netlify
- Backend: Render, Railway, Fly.io or similar
- Database: managed PostgreSQL or Supabase
- HTTPS everywhere
- environment secrets managed by the deployment provider
- migrations run through a controlled deployment step

Required environment variables are listed in `.env.example`.

Do not deploy with demo credentials, hardcoded secrets or real humanitarian data.
