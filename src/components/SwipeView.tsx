import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Majlis } from '../types/majlis'
import MajlisCard from './MajlisCard'

interface SwipeViewProps {
  majalis: Majlis[]
}

const SWIPE_THRESHOLD = 60

export default function SwipeView({ majalis }: SwipeViewProps) {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const dragStartX = useRef(0)

  if (majalis.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-[var(--text-muted)]">
        <p className="text-sm">No majalis match your filters.</p>
      </div>
    )
  }

  const go = (dir: number) => {
    const next = index + dir
    if (next < 0 || next >= majalis.length) return
    setDirection(dir)
    setIndex(next)
  }

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -300 : 300, opacity: 0 }),
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Counter */}
      <p className="text-xs text-[var(--text-muted)]">
        <span className="text-[var(--gold)] font-semibold">{index + 1}</span> / {majalis.length}
      </p>

      {/* Card area */}
      <div
        className="relative w-full max-w-md overflow-hidden"
        style={{ minHeight: 280 }}
        onTouchStart={(e) => { dragStartX.current = e.touches[0].clientX }}
        onTouchEnd={(e) => {
          const delta = e.changedTouches[0].clientX - dragStartX.current
          if (delta < -SWIPE_THRESHOLD) go(1)
          else if (delta > SWIPE_THRESHOLD) go(-1)
        }}
      >
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={majalis[index].id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.22, ease: 'easeInOut' }}
          >
            <MajlisCard majlis={majalis[index]} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => go(-1)}
          disabled={index === 0}
          aria-label="Previous majlis"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-muted)] transition hover:border-[var(--gold)] hover:text-[var(--gold)] disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>

        {/* Dots */}
        <div className="flex items-center gap-1.5">
          {majalis.slice(Math.max(0, index - 2), Math.min(majalis.length, index + 3)).map((_, i) => {
            const realIndex = Math.max(0, index - 2) + i
            return (
              <button
                key={realIndex}
                onClick={() => { setDirection(realIndex > index ? 1 : -1); setIndex(realIndex) }}
                aria-label={`Go to majlis ${realIndex + 1}`}
                className="rounded-full transition-all"
                style={{
                  width: realIndex === index ? 20 : 6,
                  height: 6,
                  background: realIndex === index ? 'var(--gold)' : 'var(--border)',
                }}
              />
            )
          })}
        </div>

        <button
          onClick={() => go(1)}
          disabled={index === majalis.length - 1}
          aria-label="Next majlis"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-muted)] transition hover:border-[var(--gold)] hover:text-[var(--gold)] disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
