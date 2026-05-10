import { useState, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useFilteredMajalis, useMajalis } from '../hooks/useMajalis'
import FilterBar from '../components/FilterBar'
import FilterDrawer from '../components/FilterDrawer'
import SwipeView from '../components/SwipeView'
import ListView from '../components/ListView'
import TableView from '../components/TableView'
import SkeletonCards from '../components/SkeletonCards'
import PrintButton from '../components/PrintButton'
import type { FilterState } from '../types/majlis'

export const Route = createFileRoute('/')({ component: HomePage })

const DEFAULT_FILTERS: FilterState = {
  audience: 'All',
  dateFrom: '',
  dateTo: '',
  search: '',
}

type ViewMode = 'swipe' | 'cards' | 'table'

function HomePage() {
  // Default to swipe on mobile, cards on desktop — resolved after mount to avoid SSR mismatch
  const [viewMode, setViewMode] = useState<ViewMode>('cards')

  useEffect(() => {
    if (window.innerWidth < 640) setViewMode('swipe')
  }, [])

  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Count active filters for the badge
  const activeFilterCount = [
    filters.audience !== 'All',
    !!filters.dateFrom,
    !!filters.dateTo,
    !!filters.search,
  ].filter(Boolean).length

  const allQuery = useMajalis()
  const { data: filtered, isLoading, isError, refetch, isFetching } = useFilteredMajalis(filters)

  const total = allQuery.data?.length ?? 0
  const filteredCount = filtered?.length ?? 0

  const printedAt = new Date().toLocaleDateString('en-AU', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  const isListMode = viewMode === 'cards' || viewMode === 'table'

  return (
    <main className="page-wrap px-4 py-8">
      {/* Print-only section — always table layout regardless of screen view */}
      <div className="print-only" style={{ display: 'none' }}>
        <div style={{ borderBottom: '2px solid #a07c1a', paddingBottom: '10px', marginBottom: '14px' }}>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#1a1a1a' }}>
            Azadari Updates Sydney — Majalis 1448
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#555' }}>
            Printed: {printedAt} &nbsp;·&nbsp; {filteredCount} majalis listed
          </p>
        </div>
        <TableView majalis={filtered ?? []} />
      </div>

      {/* Page header (screen only) */}
      <div className="no-print mb-8 text-center">
        <div className="flex justify-center mb-4">
          <img
            src="/assets/logo.png"
            alt=""
            aria-hidden="true"
            className="h-16 w-16 rounded-full object-cover opacity-90"
          />
        </div>
        <h1 className="m-0 text-2xl font-bold text-[var(--text)] sm:text-3xl">
          Majalis — Muharram 1448
        </h1>
        <p className="m-0 mt-2 text-sm text-[var(--text-muted)]">
          Upcoming majalis in Sydney
        </p>
        {isFetching && !isLoading && (
          <p className="mt-1 text-xs text-[var(--gold)] opacity-70 animate-pulse">
            Checking for updates…
          </p>
        )}
      </div>

      {/* Filters — inline on desktop, drawer on mobile */}
      <div className="no-print mb-6">
        {/* Desktop: always visible */}
        <div className="hidden sm:block rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-4">
          <FilterBar
            filters={filters}
            onChange={setFilters}
            total={total}
            filtered={filteredCount}
          />
        </div>

        {/* Mobile: filter button + active count badge */}
        <div className="flex items-center justify-between sm:hidden">
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition"
            aria-label="Open filters"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <line x1="4" y1="6" x2="20" y2="6"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
              <line x1="11" y1="18" x2="13" y2="18"/>
            </svg>
            Filters
            {activeFilterCount > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[var(--gold)] text-[10px] font-bold text-[#0a0a0a]">
                {activeFilterCount}
              </span>
            )}
          </button>
          <p className="text-xs text-[var(--text-muted)]">
            <span className="text-[var(--gold)] font-medium">{filteredCount}</span> of {total} majalis
          </p>
        </div>

        {/* Mobile bottom sheet drawer */}
        <FilterDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          filters={filters}
          onChange={setFilters}
          total={total}
          filtered={filteredCount}
        />
      </div>

      {/* View toggle + print button (screen only) */}
      {/* On mobile: stacks vertically. On sm+: single row. */}
      <div className="no-print mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex rounded-lg border border-[var(--border)] overflow-hidden self-start">
          {/* Cards */}
          <button
            onClick={() => setViewMode('cards')}
            aria-pressed={viewMode === 'cards'}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium whitespace-nowrap transition ${
              viewMode === 'cards'
                ? 'bg-[rgba(201,162,39,0.15)] text-[var(--gold)]'
                : 'bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {/* LayoutList: thumbnail block + text lines per row */}
              <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
              <path d="M14 4h7M14 9h5M14 15h7M14 20h5"/>
            </svg>
            Cards
          </button>
          {/* Table */}
          <button
            onClick={() => setViewMode('table')}
            aria-pressed={viewMode === 'table'}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium whitespace-nowrap transition border-l border-[var(--border)] ${
              viewMode === 'table'
                ? 'bg-[rgba(201,162,39,0.15)] text-[var(--gold)]'
                : 'bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {/* Table2: grid with header row + column divider */}
              <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"/>
            </svg>
            Table
          </button>
          {/* Swipe */}
          <button
            onClick={() => setViewMode('swipe')}
            aria-pressed={viewMode === 'swipe'}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium whitespace-nowrap transition border-l border-[var(--border)] ${
              viewMode === 'swipe'
                ? 'bg-[rgba(201,162,39,0.15)] text-[var(--gold)]'
                : 'bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {/* Layers: stacked cards suggesting a swipeable deck */}
              <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/>
              <path d="m6.08 9.5-3.5 1.6a1 1 0 0 0 0 1.81l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9a1 1 0 0 0 0-1.83l-3.5-1.59"/>
            </svg>
            Swipe
          </button>
        </div>

        {/* Print button — own row on mobile, inline on sm+ */}
        {isListMode && !isLoading && !isError && (
          <PrintButton position="top" />
        )}
      </div>

      {/* Content (screen only — print-only section above handles print) */}
      {isLoading ? (
        <SkeletonCards count={6} />
      ) : isError ? (
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <p className="text-sm text-[var(--text-muted)]">Could not load majalis. Please check your connection.</p>
          <button
            onClick={() => refetch()}
            className="chip active text-sm px-4 py-2"
          >
            Try Again
          </button>
        </div>
      ) : viewMode === 'cards' ? (
        <>
          <ListView majalis={filtered ?? []} />
          {filteredCount > 0 && (
            <div className="no-print mt-8">
              <PrintButton position="bottom" />
            </div>
          )}
        </>
      ) : viewMode === 'table' ? (
        <>
          <TableView majalis={filtered ?? []} />
          {filteredCount > 0 && (
            <div className="no-print mt-8">
              <PrintButton position="bottom" />
            </div>
          )}
        </>
      ) : (
        <SwipeView majalis={filtered ?? []} />
      )}
    </main>
  )
}
