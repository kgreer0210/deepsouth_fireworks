# AGENTS.md

## Cursor Cloud specific instructions

Deep South Fireworks is a single Next.js 16 (App Router, JavaScript) application backed by
Supabase (Postgres + Auth + Realtime). There is no separate backend service to run — the
Next.js dev server is the only service.

### Running the app
- Dev server: `npm run dev` (Next.js on http://localhost:3000). This is the command to use during development.
- Production build check: `npm run build`; serve with `npm run start`.
- The app has no automated test suite (`package.json` defines no `test` script).

### Required environment variables (Supabase)
The app cannot build or serve without Supabase credentials, because the request proxy
(`proxy.js` → `utils/supabase/middleware.js`) creates a Supabase client on **every** request.
With these unset, both `next build` (page-data collection) and `next dev` (any request) fail with
`@supabase/ssr: Your project's URL and API key are required to create a Supabase client!`.

- `NEXT_PUBLIC_SUPABASE_URL` — e.g. `https://<project-ref>.supabase.co` (project ref is in `.mcp.json`).
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — the project's publishable anon key.
- `NEXT_PUBLIC_SITE_URL` — optional; only used by the password-reset redirect in `app/login/actions.js` (defaults are fine for local dev, e.g. `http://localhost:3000`).

These are read from the process environment (injected Cloud Agent secrets) or a local,
gitignored `.env.local`. `NEXT_PUBLIC_*` values are inlined at build time, so a fresh `next build`
must run with them present.

### Lint caveat (pre-existing)
`npm run lint` runs `next lint`, which was **removed in Next.js 16**. It currently fails with
`Invalid project directory provided, no such directory: .../lint` and there is no ESLint flat
config in the repo. Linting is not runnable as-scripted; this is a repository issue, not an
environment one.

### Auth / data notes
- Login uses Supabase email+password (`signInWithPassword`). Exercising the app end to end
  requires a valid Supabase project and a test user; unauthenticated requests redirect to `/login`.
- Data access uses raw Supabase queries in `app/data/` plus RPC functions
  (`insert_show_inventory`, `update_show_inventory`). Realtime hooks keep tables in sync.
