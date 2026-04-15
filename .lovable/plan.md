

# LitigeAI — Phase 1: Foundation Build Plan

## What This Phase Delivers
The complete design system, Supabase client, authentication context, routing with protected routes, and the app shell — everything needed before building individual pages.

## Design Decisions (Confirmed)
- **Layout**: Concept 2 + Concept 4 hybrid (Split Hero structure with Bold Afrocentric dark/gold visual identity)
- **Typography**: DM Serif Display (headings) + Plus Jakarta Sans (body) + JetBrains Mono (code) — loaded via Google Fonts
- **Colors**: Ink Black `#0D0D0D`, Amber Gold `#D4A017`, Platinum `#F2F2F0`, Steel `#6B7280`, Risk Red `#C0392B`, Risk Amber `#E67E22`, Risk Green `#27AE60`

## Files to Create/Modify

### 1. Update `index.html`
- Title and meta tags to "LitigeAI"
- Add Google Fonts: DM Serif Display, Plus Jakarta Sans, JetBrains Mono

### 2. Update `src/index.css`
- Full CSS custom properties for all brand colors (HSL format)
- Font family variables
- Dark mode disabled (app uses its own dark surfaces intentionally)

### 3. Update `tailwind.config.ts`
- Extend colors: `ink`, `gold`, `platinum`, `steel`, `risk-red`, `risk-amber`, `risk-green`
- Extend fontFamily: `heading`, `body`, `mono`
- Card shadow utility

### 4. Create `src/lib/supabase.ts`
- Supabase client using `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` env vars

### 5. Create `src/contexts/AuthContext.tsx`
- AuthProvider with session state, loading state
- `onAuthStateChange` listener (set up before `getSession`)
- Sign up (with profile creation), sign in, sign out, demo login
- Profile fetch from `profiles` table
- `useAuth` hook

### 6. Create `src/components/ProtectedRoute.tsx`
- Redirects to `/login` if not authenticated
- Shows loading spinner while checking session

### 7. Create `src/components/layout/Layout.tsx`
- Fixed 240px Ink Black sidebar with navigation items + icons
- Active item: 3px Amber Gold left border, gold text
- Top navbar: LitigeAI wordmark, user name, notification bell
- Platinum content area, scrollable
- Collapsible sidebar using shadcn Sidebar component

### 8. Update `src/App.tsx`
- Wrap with AuthProvider
- All routes per spec: `/`, `/login`, `/signup`, `/dashboard`, `/regulatory-feed`, `/contract-auditor`, `/document-vault`, `/document-vault/:id`, `/trial-prep`, `/settings`
- Protected routes wrapped with ProtectedRoute + Layout
- Placeholder page components for routes not yet built

### 9. Create placeholder pages
- `src/pages/Landing.tsx` (shell only — full build in Phase 3)
- `src/pages/Login.tsx` (shell only — full build in Phase 4)
- `src/pages/Signup.tsx` (shell only)
- `src/pages/Dashboard.tsx` (shell only)
- Plus remaining placeholders for all protected routes

## Technical Notes
- Supabase connection will use Lovable Cloud (no external Supabase project needed initially)
- The Express backend from the spec is not applicable — AI features will use Supabase Edge Functions or Lovable AI Gateway later
- Database tables and RLS policies will be set up via Lovable Cloud migrations when we reach those features
- No packages need installing — `react-router-dom`, `@supabase/supabase-js`, and `lucide-react` are either already present or will be added

