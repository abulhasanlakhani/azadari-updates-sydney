import React, { lazy, Suspense } from 'react'
import { HeadContent, Scripts, createRootRoute, Link } from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { PersistQueryClientProvider, persister, queryClient } from '../lib/queryClient'
import { ThemeProvider } from '../lib/ThemeContext'
import Footer from '../components/Footer'
import Header from '../components/Header'
import NewDataToast from '../components/NewDataToast'

// Runs before React hydration to prevent flash of wrong theme
const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('azadari-theme');document.documentElement.setAttribute('data-theme',t==='light'?'light':'dark');}catch(e){}})();`

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

export const Route = createRootRoute({
  notFoundComponent: NotFound,
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'description', content: 'Browse upcoming majalis in Sydney for Muharram 1448 / 2026' },
      { title: 'Azadari Updates Sydney' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/assets/logo.png' },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        {/* Prevent flash of wrong theme before React hydrates */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="font-sans antialiased [overflow-wrap:anywhere]">
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{ persister }}
        >
          <ThemeProvider>
            <Header />
            {children}
            <Footer />
            <NewDataToast />
          </ThemeProvider>
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
