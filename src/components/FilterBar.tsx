import type { FilterState, AudienceFilter } from '../types/majlis'

interface FilterBarProps {
  filters: FilterState
  onChange: (filters: FilterState) => void
  total: number
  filtered: number
}

const AUDIENCE_OPTIONS: AudienceFilter[] = ['All', 'Gents', 'Ladies', 'Both']

export default function FilterBar({ filters, onChange, total, filtered }: FilterBarProps) {
  const set = (partial: Partial<FilterState>) => onChange({ ...filters, ...partial })

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
          onChange={(e) => set({ search: e.target.value })}
          className="field w-full pl-9"
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
              onClick={() => set({ audience: opt })}
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
            onChange={(e) => set({ dateFrom: e.target.value })}
            className="field text-xs"
            aria-label="From date"
          />
          <span className="text-xs text-[var(--text-muted)]">to</span>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => set({ dateTo: e.target.value })}
            className="field text-xs"
            aria-label="To date"
          />
        </div>
      </div>

      {/* Result count */}
      <p className="m-0 text-xs text-[var(--text-muted)]">
        Showing <span className="text-[var(--gold)] font-medium">{filtered}</span> of {total} majalis
        {filters.audience !== 'All' && <> · <span className="text-[var(--text)]">{filters.audience}</span></>}
      </p>
    </div>
  )
}
