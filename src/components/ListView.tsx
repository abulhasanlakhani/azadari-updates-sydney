import { useState, useEffect, useRef } from 'react'
import type { Majlis } from '../types/majlis'
import MajlisCard from './MajlisCard'

const PAGE_SIZE = 15

interface ListViewProps {
  majalis: Majlis[]
}

export default function ListView({ majalis }: ListViewProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const sentinelRef = useRef<HTMLDivElement>(null)

  // Reset to first page whenever the list changes (filter applied)
  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [majalis])

  // IntersectionObserver — load next page when sentinel enters viewport
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, majalis.length))
        }
      },
      { rootMargin: '200px' } // trigger 200px before sentinel is visible
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [majalis.length])

  if (majalis.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-[var(--text-muted)]">
        <p className="text-sm">No majalis match your filters.</p>
      </div>
    )
  }

  const visible = majalis.slice(0, visibleCount)
  const hasMore = visibleCount < majalis.length

  // Group visible slice by date
  const grouped = visible.reduce<Record<string, Majlis[]>>((acc, m) => {
    if (!acc[m.date]) acc[m.date] = []
    acc[m.date].push(m)
    return acc
  }, {})

  return (
    <div className="space-y-8">
      {Object.entries(grouped).map(([date, items]) => {
        const [year, month, day] = date.split('-').map(Number)
        const label = new Date(year, month - 1, day).toLocaleDateString('en-AU', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
        return (
          <section key={date}>
            <div className="flex items-center gap-3 mb-3">
              <div className="gold-rule" />
              <h2 className="m-0 text-xs font-semibold uppercase tracking-widest text-[var(--gold)]">
                {label}
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((m, i) => (
                <MajlisCard key={m.id} majlis={m} index={i} />
              ))}
            </div>
          </section>
        )
      })}

      {/* Sentinel — observed to trigger next page load */}
      <div ref={sentinelRef} aria-hidden="true" />

      {/* Loading indicator while more items remain */}
      {hasMore && (
        <div className="flex justify-center py-4">
          <span className="text-xs text-[var(--text-muted)] animate-pulse">Loading more…</span>
        </div>
      )}
    </div>
  )
}
