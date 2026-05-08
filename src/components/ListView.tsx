import type { Majlis } from '../types/majlis'
import MajlisCard from './MajlisCard'

interface ListViewProps {
  majalis: Majlis[]
}

export default function ListView({ majalis }: ListViewProps) {
  if (majalis.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-[var(--text-muted)]">
        <p className="text-sm">No majalis match your filters.</p>
      </div>
    )
  }

  // Group by date
  const grouped = majalis.reduce<Record<string, Majlis[]>>((acc, m) => {
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
    </div>
  )
}
