# Azadari Updates Sydney — Copilot Instructions

## Project Purpose
A mobile-friendly community web app for Sydney's Shia Muslim community to browse upcoming majalis
(Islamic mourning gatherings) during Muharram, Safar, and Rabi al-Awwal 1448 (2026).

## Stack
- **Framework**: TanStack Start (React 19, TypeScript)
- **Styling**: Tailwind CSS v4 (utility-first, CSS custom properties for tokens)
- **Data fetching**: TanStack Query v5 with `@tanstack/react-query-persist-client` + localStorage
- **Animations**: Framer Motion (subtle only — 150–300ms, ease-in-out)
- **Build**: Vite 8

## API
- Endpoint: `https://d3ma4bqipgu84o.cloudfront.net/api/majalis`
- Returns `{ majalis: Majlis[] }`
- Fields: id, name, email, contact, date (YYYY-MM-DD), time (HH:mm), address, audience, speakerNotes, createdAt
- No auth required. Client-side filtering only.
- Polling: every 5 minutes. staleTime: 3 minutes. Cache persisted to localStorage.

## Design System — STRICTLY SOLEMN / MOURNING AESTHETIC
This app is for Azadari — mourning for Imam Hussain (a.s.). **Do NOT make it look festive or decorative.**

### Colours (CSS variables in `src/styles.css`)
```
--bg-base:    #0a0a0a  (page background)
--bg-surface: #1a1a1a  (cards, panels)
--bg-raised:  #222222  (hover states, inputs)
--border:     #2a2a2a
--text:       #e8e8e8
--text-muted: #9ca3af
--gold:       #C9A227  (sacred gold — from logo, NOT festive)
--crimson:    #7f1d1d  (secondary, very sparse use only)
--header-bg:  rgba(10,10,10,0.92)
```

### Typography
- Font: Inter (Google Fonts)
- Headings: font-bold, text-[var(--text)]
- Body: text-sm, text-[var(--text-muted)]
- Accents: text-[var(--gold)]

### Animation Rules
- Duration: 150–300ms, ease-in-out ONLY
- No spring, no bounce, no decorative effects
- Respect `prefers-reduced-motion` (already handled in global CSS)
- Use Framer Motion for: card swipe transitions, page fade-in, toast in/out
- Use Tailwind transition for: hover/tap states

## Logo
- Location: `public/assets/logo.png`
- This is the Panja (Hand of Abbas a.s.) — treat with utmost respect
- Never stretch, crop unevenly, or use as decorative element
- Use as `<img>` with alt="Azadari Updates Sydney" and object-cover rounded-full

## Social Links
- Facebook: https://www.facebook.com/AzadariUpdateSydney
- YouTube: http://www.youtube.com/@azadariupdates-sydney7367
- These appear in both Header and Footer

## File Structure
```
src/
  components/
    Header.tsx          — sticky nav with logo + social icons
    Footer.tsx          — bottom section with logo + social links
    FilterBar.tsx       — search + audience chips + date range
    MajlisCard.tsx      — individual majlis display card
    SwipeView.tsx       — Framer Motion swipe card UX
    ListView.tsx        — grouped-by-date list UX
    SkeletonCards.tsx   — loading placeholders
    NewDataToast.tsx    — toast for newly detected majalis
  hooks/
    useMajalis.ts       — TanStack Query hooks + client-side filtering
  lib/
    api.ts              — fetchMajalis() function
    queryClient.ts      — QueryClient + persister setup
  types/
    majlis.ts           — TypeScript types for API data
  routes/
    __root.tsx          — HTML shell + QueryClientProvider wrapper
    index.tsx           — main page (filters + view toggle + results)
```

## Coding Conventions
- TypeScript strict mode
- Named exports for hooks/utils, default exports for components/routes
- No `any` types — use proper interfaces
- Tailwind inline classes preferred; global CSS only for reusable patterns (`.card`, `.chip`, `.badge`, `.field`, `.skeleton`)
- All user-facing text should be respectful and dignified

## What NOT to do
- Do not add decorative gradients, glows, or festive animations
- Do not add bright/vivid colours outside the defined palette
- Do not add features unrelated to browsing/filtering majalis
- Do not add authentication or user accounts
- Do not add backend or server-side logic — this is a CSR SPA
- Do not stretch or misuse the Panja logo

## Deployment
- Platform: Azure Static Web Apps (Free tier)
- CI/CD: GitHub Actions (`.github/workflows/azure-static-web-apps.yml`)
- No SSR, no server functions — pure CSR SPA

## Seasonal Context
This app is relevant only during Muharram/Safar/Rabi al-Awwal 1448 (approximately May–July 2026).
It will be decommissioned after the season.
