import { useRef } from 'react'
import type { FilterState, AudienceFilter } from '../types/majlis'
import { analytics } from '../lib/analytics'

interface FilterBarProps {
  filters: FilterState
  onChange: (filters: FilterState) => void
  onClear: () => void
  total: number
  filtered: number
}

const AUDIENCE_OPTIONS: AudienceFilter[] = ['All', 'Gents', 'Ladies', 'Both']

function hasActiveFilters(filters: FilterState) {
  return (
    filters.audience !== 'All' ||
    !!filters.dateFrom ||
    !!filters.dateTo ||
    !!filters.search
  )
}

export default function FilterBar({ filters, onChange, onClear, total, filtered }: FilterBarProps) {
  const set = (partial: Partial<FilterState>) => onChange({ ...filters, ...partial })
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dateTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleSearch = (value: string) => {
    set({ search: value })
    if (searchTimer.current) clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(() => {
      if (value.trim()) analytics.filterSearch(value.trim())
    }, 800)
  }

  const handleDateFrom = (value: string) => {
    set({ dateFrom: value })
    if (dateTimer.current) clearTimeout(dateTimer.current)
    dateTimer.current = setTimeout(() => {
      analytics.filterDateRange(value, filters.dateTo)
    }, 600)
  }

  const handleDateTo = (value: string) => {
    set({ dateTo: value })
    if (dateTimer.current) clearTimeout(dateTimer.current)
    dateTimer.current = setTimeout(() => {
      analytics.filterDateRange(filters.dateFrom, value)
    }, 600)
  }

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-[var(--text-muted)]">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
        </span>
        <input
          type="search"
          placeholder="Search by speaker, name or venue…"
          value={filters.search}
          onChange={(e) => handleSearch(e.target.value)}
          className="field w-full pl-9!"
          aria-label="Search majalis"
        />
      </div>

      {/* Audience chips + date range */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Audience filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {AUDIENCE_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => { set({ audience: opt }); analytics.filterAudience(opt) }}
              className={`chip ${filters.audience === opt ? 'active' : ''}`}
              aria-pressed={filters.audience === opt}
            >
              {opt}
            </button>
          ))}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Date range */}
        <div className="flex items-center gap-2 flex-wrap">
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => handleDateFrom(e.target.value)}
            className="field text-xs"
            aria-label="From date"
          />
          <span className="text-xs text-[var(--text-muted)]">to</span>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => handleDateTo(e.target.value)}
            className="field text-xs"
            aria-label="To date"
          />
        </div>
      </div>

      {/* Result count + clear filters */}
      <div className="flex items-center justify-between">
        <p className="m-0 text-xs text-[var(--text-muted)]">
          Showing <span className="text-[var(--gold)] font-medium">{filtered}</span> of {total} majalis
          {filters.audience !== 'All' && <> · <span className="text-[var(--text)]">{filters.audience}</span></>}
        </p>
        {hasActiveFilters(filters) && (
          <button
            onClick={() => { analytics.filterClear(); onClear() }}
            className="text-xs text-[var(--gold)] underline underline-offset-2 hover:opacity-75 transition"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  )
}
