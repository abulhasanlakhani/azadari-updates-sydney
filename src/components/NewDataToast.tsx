import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQueryClient } from '@tanstack/react-query'
import { MAJALIS_QUERY_KEY } from '../hooks/useMajalis'

/** Shows a subtle toast when new majalis entries are detected after a background refetch */
export default function NewDataToast() {
  const queryClient = useQueryClient()
  const [visible, setVisible] = useState(false)
  const prevCount = useRef<number | null>(null)

  useEffect(() => {
    return queryClient.getQueryCache().subscribe((event) => {
      if (
        event.type === 'updated' &&
        event.action.type === 'success' &&
        JSON.stringify(event.query.queryKey) === JSON.stringify(MAJALIS_QUERY_KEY)
      ) {
        const data = event.action.data as { majalis: unknown[] } | undefined
        const newCount = data?.majalis?.length ?? 0
        if (prevCount.current !== null && newCount > prevCount.current) {
          setVisible(true)
          setTimeout(() => setVisible(false), 5000)
        }
        prevCount.current = newCount
      }
    })
  }, [queryClient])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full border border-[var(--gold)] bg-[var(--bg-surface)] px-4 py-2 text-xs text-[var(--gold)] shadow-lg"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--gold)] animate-pulse" />
          New majalis added — pull to refresh
          <button
            onClick={() => setVisible(false)}
            className="ml-1 opacity-60 hover:opacity-100 transition"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
