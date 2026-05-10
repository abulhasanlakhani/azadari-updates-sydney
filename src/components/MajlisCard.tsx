import type { Majlis } from '../types/majlis'

interface MajlisCardProps {
  majlis: Majlis
  index?: number
}

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-AU', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatTime(timeStr: string) {
  const [h, m] = timeStr.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${String(m).padStart(2, '0')} ${ampm}`
}

function AudienceBadge({ audience }: { audience: Majlis['audience'] }) {
  const cls =
    audience === 'Gents' ? 'badge-gents' :
    audience === 'Ladies' ? 'badge-ladies' : 'badge-both'
  return <span className={`badge ${cls}`}>{audience}</span>
}

export default function MajlisCard({ majlis, index = 0 }: MajlisCardProps) {
  return (
    <article
      className="card p-5 fade-in"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Row 1: date + badge */}
      <div className="flex items-center justify-between gap-2 mb-1">
        <p className="m-0 text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider">
          {formatDate(majlis.date)}
        </p>
        <AudienceBadge audience={majlis.audience} />
      </div>
      {/* Row 2: organiser name — full width, no badge competing */}
      <h3 className="m-0 text-base font-semibold text-[var(--text)] leading-snug mb-3">
        {majlis.name || 'Majlis'}
      </h3>

      {/* Gold divider */}
      <div className="gold-rule mb-3" />

      {/* Time & Address */}
      <div className="space-y-1.5 text-sm text-[var(--text-muted)]">
        <div className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-[var(--gold)] opacity-70" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          <span>{formatTime(majlis.time)}</span>
        </div>
        <div className="flex items-start gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 mt-0.5 text-[var(--gold)] opacity-70" aria-hidden="true">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          <span className="leading-snug">{majlis.address}</span>
        </div>
      </div>

      {/* Speaker notes */}
      {majlis.speakerNotes && (
        <div className="mt-3 pt-3 border-t border-[var(--border)]">
          <p className="m-0 text-xs text-[var(--text-muted)]">
            <span className="text-[var(--gold)] font-medium">Speaker: </span>
            {majlis.speakerNotes}
          </p>
        </div>
      )}

      {/* Contact */}
      {majlis.contact && (
        <div className="mt-2">
          <p className="m-0 text-xs text-[var(--text-muted)] opacity-60">
            Contact: {majlis.contact}
          </p>
        </div>
      )}
    </article>
  )
}
