import { useQuery } from '@tanstack/react-query'
import { fetchMajalis } from '../lib/api'
import type { Majlis, FilterState } from '../types/majlis'

export const MAJALIS_QUERY_KEY = ['majalis'] as const

export function useMajalis() {
  return useQuery({
    queryKey: MAJALIS_QUERY_KEY,
    queryFn: fetchMajalis,
    select: (data) => data.majalis,
  })
}

export function useFilteredMajalis(filters: FilterState) {
  const query = useMajalis()

  const filtered = (query.data ?? []).filter((m: Majlis) => {
    if (filters.audience !== 'All' && m.audience !== filters.audience) return false
    if (filters.dateFrom && m.date < filters.dateFrom) return false
    if (filters.dateTo && m.date > filters.dateTo) return false
    if (filters.search) {
      const term = filters.search.toLowerCase()
      const inSpeaker = m.speakerNotes.toLowerCase().includes(term)
      const inName = m.name.toLowerCase().includes(term)
      const inAddress = m.address.toLowerCase().includes(term)
      if (!inSpeaker && !inName && !inAddress) return false
    }
    return true
  })

  // Sort ascending by date then time
  const sorted = [...filtered].sort((a, b) => {
    const dateCompare = a.date.localeCompare(b.date)
    if (dateCompare !== 0) return dateCompare
    return a.time.localeCompare(b.time)
  })

  return { ...query, data: sorted }
}
