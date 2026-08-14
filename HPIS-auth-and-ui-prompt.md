# HPIS Phase 2: Real Authentication + Professional Enterprise UI
### Paste this into your coding agent in Antigravity (it has the Supabase MCP server connected — use it for every Supabase step below, don't hand-write config the MCP tools can generate). This is a follow-on to the Phase 1 hygiene/honesty spec — do that first if you haven't.

---

## Part A — Replace the fake role switcher with real Supabase Auth

Right now roles are selected client-side (a dropdown swaps a demo user object). That is not authentication, it's a costume change — anyone can open devtools and become SUPER_ADMIN. Here is what "real" looks like, matched to what your own schema already half-describes (`server/prisma/schema.prisma` already has `User.supabaseId` sitting unused — this closes that gap):

### A1. Supabase project setup (use the MCP server for all of this)
1. Use the Supabase MCP tools to create/confirm the project, and enable **Email/Password** auth. Add **Magic Link** as a secondary option (professional org platforms commonly offer both).
2. Create a `profiles` table linked 1:1 to `auth.users`:
   ```sql
   create table profiles (
     id uuid references auth.users(id) primary key,
     full_name text not null,
     role text not null default 'VIEWER'
       check (role in ('SUPER_ADMIN','PROGRAM_MANAGER','PROTECTION_OFFICER',
                        'CASE_WORKER','DATA_OFFICER','FIELD_OFFICER','AUDITOR','VIEWER')),
     mfa_enabled boolean not null default false,
     created_at timestamptz not null default now()
   );
   ```
   This mirrors your existing Prisma `Role` enum exactly — 8 roles, no more, no fewer. Don't invent new roles; wire up the ones you already designed.
3. Use a Postgres trigger (`on auth.users insert`) to auto-create the matching `profiles` row, defaulting new signups to `VIEWER` — nobody self-assigns a privileged role by signing up.
4. **Enable Row Level Security on every table** (`Person`, `Case`, `FamilyLink`, `AuditLog`, everything). This is the actual mechanism that makes RBAC real instead of decorative — the database enforces it even if a frontend check is ever bypassed. Write policies per role, e.g.:
   ```sql
   -- Example: only case workers+ can insert cases; viewers can only select
   create policy "case_insert_by_role" on "Case"
     for insert
     using (
       (select role from profiles where id = auth.uid())
         in ('SUPER_ADMIN','PROGRAM_MANAGER','PROTECTION_OFFICER','CASE_WORKER')
     );
   ```
   Write the full matrix in Part A2 below before writing policies, so every table's policy is derived from one source of truth instead of improvised per-table.

### A2. Define the permission matrix once, in `docs/rbac-matrix.md`, then implement from it

Your docs never actually specified what each of the 8 roles can do — only their names. Fix that first, then implement against it. Suggested matrix (adjust based on your own judgment of the domain, but keep it this concrete):

| Role | View cases | Create/edit cases | Delete/archive | View family links | Run matching | View audit log | Manage users | Export data |
|---|---|---|---|---|---|---|---|---|
| SUPER_ADMIN | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| PROGRAM_MANAGER | ✅ | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ | ✅ |
| PROTECTION_OFFICER | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |
| CASE_WORKER | assigned only | ✅ (assigned) | ❌ | assigned only | ❌ | ❌ | ❌ | ❌ |
| DATA_OFFICER | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ |
| FIELD_OFFICER | assigned only | ✅ (create, offline) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| AUDITOR | ✅ (read-only) | ❌ | ❌ | ✅ (read-only) | ❌ | ✅ | ❌ | ❌ |
| VIEWER | ✅ (read-only, non-sensitive fields) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

This table is the single source of truth. Your RLS policies (database), your Express middleware (API), and your frontend route guards (UI) must all be generated from this table, not three independently-guessed versions of it. This consistency is exactly what a technical reviewer will test by trying to break it.

### A3. Backend
- Replace the current unused `SUPABASE_SECRET_KEY` reference with a real JWT verification middleware using Supabase's JWT secret, validating the token on every request and attaching `req.user = { id, role }` from the `profiles` lookup.
- Every Express route re-checks role server-side even though RLS also protects the database — defense in depth, not redundancy. A reviewer will specifically try calling the API directly with a low-privilege token to see if the frontend was the only gate. Don't let it be.

### A4. Frontend
- Real login page (email/password + magic link), real session persistence via Supabase client, real logout, real "forgot password" flow.
- Route guards that redirect unauthenticated users to `/login` and unauthorized users to a proper "Access restricted" page (not a blank screen or console error).
- Remove the role-switcher dropdown entirely. If you want reviewers to be able to explore all 8 roles without you creating 8 real accounts for them, add a clearly-labeled **"View demo credentials"** panel on the login page listing seeded demo accounts (`viewer.demo@hpis.example` / etc.) — real accounts, real login, just pre-seeded. That's honest; a client-side costume switch is not.

---

## Part B — A genuinely professional, modern UI (researched, not guessed)

I looked at what UNICEF's own enterprise design system actually says, since that's a real, public reference point for exactly this audience — internal humanitarian platforms with heavy data and complex forms. Their stated principles: **accessible for all regardless of disability; "as little design as possible — less, but better"; consistent visual style, labeling, layouts and process across the platform.** That's the register to aim for — this is the opposite of a flashy marketing site. The organizations you're targeting (ICRC, UNHCR, UNICEF, UNDP, IOM) run internal tools that look calm, dense-but-organized, high-contrast, and utterly unflashy — think **Stripe's dashboard, Linear, or an airline ops console**, not a startup landing page. Gradients, glassmorphism, bouncy animations, and neon accents read as "hackathon demo," which is the exact opposite of what you want.

### B1. Design direction to actually implement
Work through this as a real design pass, not a component-by-component patch:

- **Palette:** one deep institutional primary (navy/slate blue or forest, not black), one neutral gray scale with real contrast steps (not just #fff/#000), one restrained accent color used *only* for primary actions and status (e.g., a muted teal or amber), and explicit semantic colors for status (case open/closed/urgent, sync pending/failed). Name 5–6 exact hex values before writing any CSS — don't let the agent free-associate colors per-component.
- **Typography:** a clean, highly-legible sans serif for UI text (Inter, IBM Plex Sans, or similar enterprise-grade choice — IBM Plex is a genuinely good fit here since IBM designed it for exactly this kind of institutional software), with a real type scale (not five components each inventing their own font-size). Confirm it renders Amharic (Ge'ez script) cleanly too, since your `i18n.ts` already supports it — test the font pairing with real Amharic text, not just Latin placeholder text.
- **Layout:** persistent left sidebar navigation (role-aware — a VIEWER doesn't see an "Audit Log" nav item at all, not a greyed-out one), a top bar with org identity + user session, and a dense-but-scannable main content area using real data tables and cards, not oversized marketing-style whitespace.
- **Density and restraint:** enterprise humanitarian software displays a lot of structured information. Resist the urge to add hero sections, big illustrations, or marketing copy anywhere inside the authenticated app — that belongs on a public landing page only, if at all. Inside the app, every pixel should be doing informational work.
- **States:** design real empty states, loading states, and error states for every view (not just the happy path) — this is one of the fastest tells between "built by someone who's shipped software" and "demo that only works when everything goes right."
- **Accessibility:** visible keyboard focus rings, proper contrast ratios (WCAG AA minimum), semantic HTML, and full functionality without a mouse. This is a stated, real requirement in UNICEF's own guidelines, not a nice-to-have.
- **One signature moment, not fifteen.** Pick exactly one place to show craft — e.g., the case-matching results view with a well-designed confidence-score visualization, or the audit-log timeline. Keep everything else disciplined and quiet around it. A page trying to impress in every corner reads as AI-generated; a page that's calm everywhere except one well-executed moment reads as designed by people who know what they're doing.

### B2. What to explicitly avoid
- Purple-to-blue gradients on buttons/headers
- Glassmorphism / frosted blur panels
- Bouncy/spring page-load animations on every element
- Stock "teamwork" photography or generic illustration packs
- Emoji as icons (use a real icon set — Lucide or Phosphor, consistent throughout)
- Anything that would look at home on a SaaS pricing page — this is internal operations software for a serious institution, not a product marketing site

### B3. Before/after check
Once built, ask: if you removed your name and the ICRC-adjacent framing, would this be mistaken for an internal tool at Stripe, an airline, or a bank's ops team? If it still looks like "student portfolio project" or "AI hackathon demo," go back to B1 and tighten the palette/type/density — the fix is almost always *removing* decoration, not adding more.

---

## Part C — Definition of done for this phase

- [ ] Supabase Auth live: real signup/login/logout/session, no client-side role switcher
- [ ] `profiles` table + auto-create trigger + RLS enabled on every sensitive table
- [ ] `docs/rbac-matrix.md` exists and is the single source of truth for DB policies, API middleware, and frontend guards
- [ ] Backend independently re-validates role on every protected route (not relying on frontend alone)
- [ ] Demo credentials panel replaces the old role-switch dropdown, clearly labeled as seeded demo accounts
- [ ] Palette, type scale, and layout are defined once as design tokens and applied consistently — not per-component improvisation
- [ ] Every view has designed empty/loading/error states
- [ ] Keyboard navigation and visible focus states work throughout
- [ ] Amharic text renders cleanly in the chosen typeface
- [ ] Nothing in the UI would look out of place in an internal enterprise ops tool at a serious institution

When both this and Phase 1 are checked off, you'll have a project that survives the two things reviewers actually test: **trying to break the access control**, and **judging the UI in the first eight seconds.** That combination — genuinely enforced RBAC plus a restrained, institutional UI — is a rare pairing in student portfolios, and it's the pairing that actually matches what these organizations hire for.
