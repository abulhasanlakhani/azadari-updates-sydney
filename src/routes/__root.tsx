import React, { lazy, Suspense } from 'react'
import { HeadContent, Scripts, createRootRoute, Link } from '@tanstack/react-router'
import { PersistQueryClientProvider, persister, queryClient } from '../lib/queryClient'
import { ThemeProvider } from '../lib/ThemeContext'
import { AuthProvider } from '../lib/AuthContext'
import Footer from '../components/Footer'
import Header from '../components/Header'
import NewDataToast from '../components/NewDataToast'

// Runs before React hydration to prevent flash of wrong theme
const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('azadari-theme');document.documentElement.setAttribute('data-theme',t==='light'?'light':'dark');}catch(e){}})();`

const GTM_ID = 'GTM-KLZZ28LK'
const GTM_SCRIPT = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`

// Devtools are lazy-loaded in development only — fully tree-shaken in production
const DevTools = import.meta.env.DEV
  ? lazy(() =>
      Promise.all([
        import('@tanstack/react-devtools'),
        import('@tanstack/react-router-devtools'),
      ]).then(([{ TanStackDevtools }, { TanStackRouterDevtoolsPanel }]) => ({
        default: () => (
          <TanStackDevtools
            config={{ position: 'bottom-right' }}
            plugins={[{ name: 'Tanstack Router', render: <TanStackRouterDevtoolsPanel /> }]}
          />
        ),
      }))
    )
  : () => null

import appCss from '../styles.css?url'

function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground">Page not found.</p>
      <Link to="/" className="text-primary underline underline-offset-4">
        Back to home
      </Link>
    </main>
  )
}

const SITE_URL = 'https://azadariupdatessydney.com'
const SITE_NAME = 'Azadari Updates Sydney'
const SITE_TITLE = 'Azadari Updates Sydney | Majalis Schedule Muharram 1448 – Sydney NSW'
const SITE_DESCRIPTION =
  'Browse upcoming majalis (Islamic mourning gatherings) in Sydney, NSW, Australia for Muharram 1448 / 2026. Azadari events for the Shia Muslim community in Sydney — schedules, venues, and speakers.'
const OG_IMAGE = `${SITE_URL}/assets/logo.png`

const JSON_LD = JSON.stringify([
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: 'en-AU',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    sameAs: [
      'https://www.facebook.com/AzadariUpdateSydney',
      'http://www.youtube.com/@azadariupdates-sydney7367',
    ],
  },
])

export const Route = createRootRoute({
  notFoundComponent: NotFound,
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: SITE_TITLE },
      { name: 'description', content: SITE_DESCRIPTION },
      {
        name: 'keywords',
        content:
          'Azadari Sydney, majalis Sydney, Muharram 2026 Australia, Shia Muslim Sydney, Muharram Sydney NSW, Azadari Updates Sydney, Islamic events Sydney, Muharram 1448, majalis NSW, Imam Hussain Sydney, Safar majalis Sydney',
      },
      { name: 'robots', content: 'index, follow' },
      // Geo targeting (Bing + legacy crawlers)
      { name: 'geo.region', content: 'AU-NSW' },
      { name: 'geo.placename', content: 'Sydney, NSW, Australia' },
      { name: 'geo.position', content: '-33.8688;151.2093' },
      { name: 'ICBM', content: '-33.8688, 151.2093' },
      // Open Graph
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: SITE_NAME },
      { property: 'og:title', content: SITE_TITLE },
      { property: 'og:description', content: SITE_DESCRIPTION },
      { property: 'og:url', content: SITE_URL },
      { property: 'og:image', content: OG_IMAGE },
      { property: 'og:locale', content: 'en_AU' },
      // Twitter Card
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: SITE_TITLE },
      { name: 'twitter:description', content: SITE_DESCRIPTION },
      { name: 'twitter:image', content: OG_IMAGE },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/assets/logo.png' },
      { rel: 'canonical', href: SITE_URL },
    ],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON_LD,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        {/* GTM must load as early as possible in <head> */}
        <script dangerouslySetInnerHTML={{ __html: GTM_SCRIPT }} />
        {/* Prevent flash of wrong theme before React hydrates */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="font-sans antialiased [overflow-wrap:anywhere]">
        {/* GTM noscript fallback — must be first element in <body> */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{ persister }}
        >
          <AuthProvider>
            <ThemeProvider>
              <Header />
              {children}
              <Footer />
              <NewDataToast />
            </ThemeProvider>
          </AuthProvider>
          {import.meta.env.DEV && (
            <Suspense fallback={null}>
              <DevTools />
            </Suspense>
          )}
        </PersistQueryClientProvider>
        <Scripts />
      </body>
    </html>
  )
}
