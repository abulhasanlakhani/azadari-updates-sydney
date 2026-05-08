import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useFilteredMajalis, useMajalis } from '../hooks/useMajalis'
import FilterBar from '../components/FilterBar'
import SwipeView from '../components/SwipeView'
import ListView from '../components/ListView'
import SkeletonCards from '../components/SkeletonCards'
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
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const [viewMode, setViewMode] = useState<ViewMode>('list')

  const allQuery = useMajalis()
  const { data: filtered, isLoading, isError, refetch, isFetching } = useFilteredMajalis(filters)

  const total = allQuery.data?.length ?? 0

  return (
    <main className="page-wrap px-4 py-8">
      {/* Page header */}
      <div className="mb-8 text-center">
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

      {/* Filters */}
      <div className="mb-6 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-4">
        <FilterBar
          filters={filters}
          onChange={setFilters}
          total={total}
          filtered={filtered?.length ?? 0}
        />
      </div>

      {/* View toggle */}
      <div className="mb-5 flex items-center justify-between">
        <p className="m-0 text-xs text-[var(--text-muted)] uppercase tracking-widest font-medium">
          {viewMode === 'list' ? 'List View' : 'Card View'}
        </p>
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
        <ListView majalis={filtered ?? []} />
      ) : (
        <SwipeView majalis={filtered ?? []} />
      )}
    </main>
  )
}
