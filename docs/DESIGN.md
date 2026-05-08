# Design System — Azadari Updates Sydney

## Philosophy

This is an app for Azadari — the commemoration of the martyrdom of Imam Hussain ibn Ali (a.s.)
at Karbala. The design must be **solemn, dignified, and respectful**.

**Do not** make it look like a social app, event ticketing platform, or festive website.
**Do** keep it dark, minimal, and functional.

---

## Colour Palette

| Token             | Value             | Use                                      |
|-------------------|-------------------|------------------------------------------|
| `--bg-base`       | `#0a0a0a`         | Page background                          |
| `--bg-surface`    | `#1a1a1a`         | Cards, panels, header                    |
| `--bg-raised`     | `#222222`         | Hover states, inputs, raised elements    |
| `--border`        | `#2a2a2a`         | All borders                              |
| `--text`          | `#e8e8e8`         | Primary text                             |
| `--text-muted`    | `#9ca3af`         | Secondary text, labels                   |
| `--gold`          | `#C9A227`         | Sacred gold — accents, active states     |
| `--gold-dim`      | `#a07c1a`         | Gold hover state                         |
| `--crimson`       | `#7f1d1d`         | Secondary accent — use very sparingly    |
| `--header-bg`     | `rgba(10,10,10,0.92)` | Frosted header background            |

Gold `#C9A227` was extracted from the Azadari Updates Sydney logo.

---

## Typography

- **Font family**: Inter (Google Fonts CDN)
- **Headings**: `font-bold`, `text-[var(--text)]`
- **Body / description**: `text-sm`, `text-[var(--text-muted)]`
- **Accent labels**: `text-xs uppercase tracking-widest font-semibold text-[var(--gold)]`
- **No decorative fonts** — Inter only for consistency and readability

---

## Spacing & Layout

- Max content width: `min(1120px, calc(100% - 2rem))` via `.page-wrap`
- Card gap: `gap-3` (12px)
- Section gap: `space-y-8`
- Mobile: single column. Tablet+: 2-col grid. Desktop: 3-col grid.

---

## Components

### `.card`
Dark surface card with a subtle gold border on hover.
```css
background: var(--bg-surface);
border: 1px solid var(--border);
border-radius: 0.75rem;
```

### `.chip`
Filter chip for audience selection.
```css
border-radius: 9999px;
background: var(--bg-surface);
/* .active: gold background tint + gold border + gold text */
```

### `.badge`
Audience indicator on majlis cards.
- Gents: blue tint (`#60a5fa`)
- Ladies: pink tint (`#f9a8d4`)
- Both: gold tint (`var(--gold)`)

### `.field`
Dark input / date picker.
```css
background: var(--bg-surface);
border: 1px solid var(--border);
/* focus: gold border */
```

### `.skeleton`
Loading placeholder using CSS shimmer animation.
```css
animation: shimmer 1.6s ease-in-out infinite;
```

### `.gold-rule`
A 2.5rem × 2px gold horizontal rule used as a visual divider.

---

## Animation Rules

| Context             | Library       | Duration  | Easing        |
|---------------------|---------------|-----------|---------------|
| Card swipe in/out   | Framer Motion | 220ms     | ease-in-out   |
| Page/list fade-in   | CSS animation | 300ms     | ease          |
| Toast slide-up      | Framer Motion | 250ms     | ease-out      |
| Skeleton shimmer    | CSS animation | 1600ms    | ease-in-out   |
| Hover/tap states    | Tailwind      | 180ms     | ease          |

**All animations** are suppressed when `prefers-reduced-motion: reduce` is set (via global CSS rule).

**Never use**: spring physics, bounce, decorative particles, gradient wipes, or any animation
that draws attention to itself rather than aiding navigation.

---

## Logo Usage

The logo is the **Panja** (Hand of Abbas ibn Ali a.s.) — a sacred symbol in Azadari.

- Always rendered as `<img>` with proper alt text
- Always displayed with `rounded-full` and `object-cover`
- Never stretched, distorted, recoloured, or used as a background element
- Minimum display size: 40×40px
- Never used in decorative contexts

---

## Accessibility

- All icon-only buttons have `aria-label`
- All decorative SVGs have `aria-hidden="true"`
- Loading states use semantic `role="status"` or skeleton placeholders
- Toast uses `role="status" aria-live="polite"`
- Colour contrast: gold on dark background meets WCAG AA for large text
