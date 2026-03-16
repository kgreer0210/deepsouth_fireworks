# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

No test suite is configured.

## Tech Stack

- **Framework:** Next.js 14 (App Router) with JavaScript (not TypeScript)
- **Database/Auth:** Supabase (PostgreSQL + Auth + Realtime)
- **UI:** shadcn/ui (Radix UI) + Material UI + Tailwind CSS
- **Forms:** React Hook Form + Zod
- **Tables:** TanStack React Table
- **Notifications:** Sonner (toast)
- **Error Tracking:** Sentry

## Architecture

### App Router Structure

Uses Next.js App Router with a hybrid Server/Client Component pattern. The root layout (`app/layout.js`) wraps everything with a sidebar and Sonner toaster.

Main routes: `/` (inventory overview), `/inventory/item/[inventory_id]`, `/shows`, `/shows/[id]`, `/login`, `/logout`, `/auth/confirm`.

### Supabase Integration

Three Supabase client variants depending on context:
- `utils/supabase/server.js` — Server Components and Server Actions
- `utils/supabase/client.js` — Client Components
- `utils/supabase/middleware.js` — Middleware session refresh

`middleware.js` runs on every request to refresh sessions and protect routes.

### Data Layer

`app/data/` contains server-side data fetching functions (not an ORM — raw Supabase queries). Key tables:
- `inventory` — fireworks items (inventory_id, name, quantity, price, category, case_weight, items_per_case, video_url)
- `shows` — shows/events
- `show_inventory` — junction table linking shows to inventory

Two Supabase RPC functions are used: `insert_show_inventory` and `update_show_inventory`.

### Real-time Updates

Custom hooks `useRealTimeInventory.js` and `useRealTimeShows.js` subscribe to Supabase Realtime channels for INSERT/UPDATE/DELETE events, keeping the UI in sync without page refreshes.

### Feature Modules

**Inventory** (`app/inventory/`, `app/page.jsx`):
- Home page shows the main inventory table with real-time updates
- Individual item pages at `/inventory/item/[inventory_id]`
- Server actions in `item/editItemAction.js`
- Overview cards in `app/inventory/overview/` (totals, YTD usage)

**Shows** (`app/shows/`):
- Tabbed list of upcoming/past shows
- Individual show detail with inventory assignment, print view, and video player
- `manageShowInventory.jsx` handles assigning inventory items to shows

### Path Aliases

`@/*` maps to the project root. Use `@/components/...`, `@/lib/utils`, `@/utils/supabase/...`.

### Styling Conventions

Tailwind with CSS variable-based color system (HSL format). Dark mode via `class` strategy. Use the `cn()` utility from `@/lib/utils` for conditional class merging (combines `clsx` + `tailwind-merge`).
