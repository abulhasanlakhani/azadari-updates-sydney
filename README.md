# Azadari Updates Sydney

A mobile-friendly community web app for Sydney's Shia Muslim community to browse upcoming
majalis (Islamic mourning gatherings) during **Muharram / Safar / Rabi al-Awwal 1448 (2026)**.

Built with love and respect for Imam Hussain ibn Ali (a.s.) and the community of Azadars in Sydney.

---

## Features

- List view — browse all majalis grouped by date
- Swipe view — swipe through individual cards on mobile
- Filters — search by speaker/name/venue, filter by audience (Gents/Ladies/Both), date range
- Live polling — checks for new majalis every 5 minutes
- Offline cache — last-fetched data persisted to localStorage
- New data toast — notifies when new entries are detected

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
