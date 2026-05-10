# Azadari Updates Sydney

A mobile-friendly community web app for Sydney's Shia Muslim community to browse upcoming
majalis (Islamic mourning gatherings) during **Muharram / Safar / Rabi al-Awwal 1448 (2026)**.

Built with love and respect for Imam Hussain ibn Ali (a.s.) and the community of Azadars in Sydney.

---

## Features

- Cards view — browse all majalis grouped by date with infinite scroll
- Swipe view — swipe through individual cards (default on mobile)
- Table view — compact tabular layout
- Filters — search by name/venue/speaker, filter by audience (Gents/Ladies/Both), date range
- Mobile filter drawer — collapsible bottom-sheet filter panel on mobile
- Data polling — checks for new majalis every 15 minutes
- Offline cache — last-fetched data persisted to localStorage
- New data toast — notifies when new entries are detected
- Light / dark theme — persisted to localStorage
- Print view — print-friendly table layout

## Tech Stack

| Layer      | Technology                                              |
|------------|-------------------------------------------------------- |
| Framework  | TanStack Start + React 19                               |
| Language   | TypeScript (strict)                                     |
| Styling    | Tailwind CSS v4                                         |
| Data       | TanStack Query v5 + localStorage persist                |
| Animations | Framer Motion                                           |
| Build      | Vite 8                                                  |
| Hosting    | Azure Static Web Apps                                   |
| CI/CD      | GitHub Actions                                          |

## Local Development

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:3000)
npm run dev

# Build for production
npm run build
```

## Contributing

This project follows **Lightweight Gitflow**:

```
main          ← production-stable, never commit directly
feature/<name>  ← new features
fix/<name>      ← bug fixes
chore/<name>    ← maintenance (deps, config, docs)
```

1. Branch off `main`: `git checkout -b feature/my-feature`
2. Commit your changes with descriptive messages
3. Open a PR → merge to `main` → delete the branch

## Deployment

Deployed to Azure Static Web Apps via GitHub Actions.

1. Create an Azure Static Web App resource
2. Add the deployment token to GitHub Secrets as `AZURE_STATIC_WEB_APPS_API_TOKEN`
3. Push to `main` branch to trigger deployment

## Social

- Facebook: https://www.facebook.com/AzadariUpdateSydney
- YouTube: http://www.youtube.com/@azadariupdates-sydney7367

---

*Ya Hussain (a.s.)*
