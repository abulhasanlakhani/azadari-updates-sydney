import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 3 * 60 * 1000,       // 3 min — data considered fresh
      gcTime: 24 * 60 * 60 * 1000,    // 24 hr — keep in localStorage cache
      refetchInterval: 5 * 60 * 1000, // 5 min — background polling
      refetchIntervalInBackground: false,
      retry: 2,
    },
  },
})

export const persister = createSyncStoragePersister({
  storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  key: 'azadari-updates-sydney-cache',
})

export { PersistQueryClientProvider }
