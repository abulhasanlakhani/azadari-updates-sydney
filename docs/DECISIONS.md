# Architecture Decision Records — Azadari Updates Sydney

## ADR-001: Client-Side Only Architecture (Option 1)

**Date**: May 2026  
**Status**: Accepted

### Context
Three architecture options were evaluated:
1. Azure SWA + TanStack Query CSR (client only)
2. Azure Container Apps + Redis + SSE (server + real-time push)
3. Azure SWA + Azure Functions + Table Storage proxy (hybrid)

### Decision
Option 1 — client-side only with TanStack Query polling.

### Rationale
- App is seasonal (Muharram/Safar/Rabi al-Awwal 1448 only, ~3 months)
- Dataset is small (~50 entries maximum)
- Community app — zero budget, no revenue
- Azure SWA free tier is sufficient
- No authentication required
- Server-side filtering adds no value at this scale
- Real-time push (SSE/WebSocket) is overkill for a polling-friendly dataset

### Consequences
- No backend infrastructure to maintain
- Data freshness relies on 5-minute polling (acceptable for this use case)
- All filtering is client-side in memory

---

## ADR-002: Caching Strategy

**Date**: May 2026  
**Status**: Accepted

- TanStack Query `staleTime: 3 minutes` — data shown immediately from cache
- TanStack Query `refetchInterval: 5 minutes` — background polling while app is open
- `@tanstack/react-query-persist-client` + `createSyncStoragePersister` → localStorage
- Cache key: `azadari-updates-sydney-cache`
- Cache TTL: 24 hours (`gcTime`)

---

## ADR-003: Design Tone — Solemn / Mourning

**Date**: May 2026  
**Status**: Accepted

### Decision
Dark, dignified, minimal UI. Zero festive or decorative elements.

### Rationale
This app is for Azadari — the mourning of Imam Hussain ibn Ali (a.s.) and the tragedy of Karbala.
The design must reflect the sanctity and solemnity of the occasion. The gold accent (#C9A227)
is used sparingly as a sacred accent, not as celebration.

### Palette
- Background: #0a0a0a / #1a1a1a
- Text: #e8e8e8 / #9ca3af
- Gold (sacred): #C9A227
- Crimson (secondary, sparse): #7f1d1d

---

## ADR-004: Animations — Subtle Functional Only

**Date**: May 2026  
**Status**: Accepted

Animations are permitted only to improve UX clarity, not for decoration:
- Card swipe transitions (Framer Motion, 220ms ease-in-out)
- Page/list fade-in (300ms)
- Toast slide-up (250ms)
- Skeleton loading shimmer
- All `prefers-reduced-motion` media query respected globally

No spring physics, no bounce, no decorative particle effects.

---

## ADR-005: Views — Swipe Cards + List

**Date**: May 2026  
**Status**: Accepted

Two views are available via toggle:
- **List view** (default): Grouped by date, multi-column grid on larger screens
- **Swipe view**: One card at a time, swipeable on mobile (touch + button nav)

---

## ADR-006: Deployment — Azure Static Web Apps

**Date**: May 2026  
**Status**: Pending (Azure not yet connected)

- Platform: Azure Static Web Apps (Free tier)
- CI/CD: GitHub Actions
- Output dir: `dist/`
- No SSR — pure SPA with client-side routing

---

## ADR-007: Scope Limitation — 2026 / 1448 Only

**Date**: May 2026  
**Status**: Accepted

This application is scoped to Islamic year 1448 (approximately 2026 Gregorian).
The API data itself is time-bound. The app will be decommissioned after the
Rabi al-Awwal 1448 season concludes.
