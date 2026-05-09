import { useState, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useFilteredMajalis, useMajalis } from '../hooks/useMajalis'
import FilterBar from '../components/FilterBar'
import SwipeView from '../components/SwipeView'
import ListView from '../components/ListView'
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

type ViewMode = 'swipe' | 'list'

function HomePage() {
  // Default to swipe on mobile, list on desktop — resolved after mount to avoid SSR mismatch
  const [viewMode, setViewMode] = useState<ViewMode>('list')

  useEffect(() => {
    if (window.innerWidth < 640) setViewMode('swipe')
  }, [])

  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)

  const allQuery = useMajalis()
  const { data: filtered, isLoading, isError, refetch, isFetching } = useFilteredMajalis(filters)

  const total = allQuery.data?.length ?? 0

  const printedAt = new Date().toLocaleDateString('en-AU', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
  const filteredCount = filtered?.length ?? 0

  return (
    <main className="page-wrap px-4 py-8">
      {/* Print-only header — hidden on screen, shown when printing */}
      <div className="print-only" style={{ display: 'none', marginBottom: '16px' }}>
        <div style={{ borderBottom: '2px solid #a07c1a', paddingBottom: '10px', marginBottom: '10px' }}>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#1a1a1a' }}>
            Azadari Updates Sydney — Majalis 1448
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#555' }}>
            Printed: {printedAt} &nbsp;·&nbsp; {filteredCount} majalis listed
          </p>
        </div>
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

      {/* Filters (screen only) */}
      <div className="no-print mb-6 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-4">
        <FilterBar
          filters={filters}
          onChange={setFilters}
          total={total}
          filtered={filteredCount}
        />
      </div>

      {/* View toggle + print button (screen only) */}
      <div className="no-print mb-5 flex items-center justify-between gap-3">
        <div className="flex rounded-lg border border-[var(--border)] overflow-hidden">
          <button
            onClick={() => setViewMode('list')}
            aria-pressed={viewMode === 'list'}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition ${
              viewMode === 'list'
                ? 'bg-[rgba(201,162,39,0.15)] text-[var(--gold)]'
                : 'bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
              <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
            List
          </button>
          <button
            onClick={() => setViewMode('swipe')}
            aria-pressed={viewMode === 'swipe'}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition border-l border-[var(--border)] ${
              viewMode === 'swipe'
                ? 'bg-[rgba(201,162,39,0.15)] text-[var(--gold)]'
                : 'bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <rect x="2" y="3" width="20" height="18" rx="2"/><path d="m9 8 5 4-5 4"/>
            </svg>
            Swipe
          </button>
        </div>

        {/* Print button — top, list view only */}
        {viewMode === 'list' && !isLoading && !isError && (
          <PrintButton position="top" />
        )}
      </div>

      {/* Content */}
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
      ) : viewMode === 'list' ? (
        <>
          <ListView majalis={filtered ?? []} />
          {/* Print button — bottom, list view only */}
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
