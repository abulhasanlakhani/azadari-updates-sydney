import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { QueryClientProvider } from '@tanstack/react-query'
import { PersistQueryClientProvider, persister, queryClient } from '../lib/queryClient'
import Footer from '../components/Footer'
import Header from '../components/Header'
import NewDataToast from '../components/NewDataToast'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
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
      </head>
      <body className="font-sans antialiased [overflow-wrap:anywhere]">
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{ persister }}
        >
          <Header />
          {children}
          <Footer />
          <NewDataToast />
          <TanStackDevtools
            config={{ position: 'bottom-right' }}
            plugins={[{ name: 'Tanstack Router', render: <TanStackRouterDevtoolsPanel /> }]}
          />
        </PersistQueryClientProvider>
        <Scripts />
      </body>
    </html>
  )
}
