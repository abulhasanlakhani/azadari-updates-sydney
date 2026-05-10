import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FilterBar from './FilterBar'
import type { FilterState } from '../types/majlis'

interface FilterDrawerProps {
  open: boolean
  onClose: () => void
  filters: FilterState
  onChange: (filters: FilterState) => void
  total: number
  filtered: number
}

export default function FilterDrawer({
  open,
  onClose,
  filters,
  onChange,
  total,
  filtered,
}: FilterDrawerProps) {
  // Lock body scroll while drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-40 bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Sheet */}
          <motion.div
            key="sheet"
            role="dialog"
            aria-modal="true"
            aria-label="Filter majalis"
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl border-t border-[var(--border)] bg-[var(--bg-surface)] px-4 pb-8 pt-4"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            {/* Drag handle */}
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[var(--border)]" aria-hidden="true" />

            {/* Header row */}
            <div className="mb-4 flex items-center justify-between">
              <h2 className="m-0 text-sm font-semibold text-[var(--text)]">Filter Majalis</h2>
              <button
                onClick={onClose}
                className="flex h-7 w-7 items-center justify-center rounded-full text-[var(--text-muted)] hover:bg-[var(--bg-raised)] hover:text-[var(--text)] transition"
                aria-label="Close filters"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <FilterBar
              filters={filters}
              onChange={onChange}
              total={total}
              filtered={filtered}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
