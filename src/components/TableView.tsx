import type { Majlis } from '../types/majlis'

interface TableViewProps {
  majalis: Majlis[]
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

export default function TableView({ majalis }: TableViewProps) {
  if (majalis.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-[var(--text-muted)]">
        <p className="text-sm">No majalis match your filters.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
      <table className="w-full min-w-[700px] text-sm border-collapse">
        <thead>
          <tr className="border-b border-[var(--border)] bg-[var(--bg-raised)]">
            <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider whitespace-nowrap">Date</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider whitespace-nowrap">Time</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider whitespace-nowrap">Name / Organiser</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider whitespace-nowrap">Audience</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider whitespace-nowrap">Address</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider whitespace-nowrap">Speaker</th>
          </tr>
        </thead>
        <tbody>
          {majalis.map((majlis, i) => (
            <tr
              key={majlis.id}
              className={`border-b border-[var(--border)] transition-colors hover:bg-[var(--bg-raised)] ${
                i % 2 === 0 ? 'bg-[var(--bg-surface)]' : 'bg-[var(--bg-base)]'
              }`}
            >
              <td className="px-4 py-3 text-[var(--text)] whitespace-nowrap font-medium">
                {formatDate(majlis.date)}
              </td>
              <td className="px-4 py-3 text-[var(--text)] whitespace-nowrap">
                {formatTime(majlis.time)}
              </td>
              <td className="px-4 py-3 text-[var(--text)] font-medium">
                {majlis.name || '—'}
              </td>
              <td className="px-4 py-3">
                <AudienceBadge audience={majlis.audience} />
              </td>
              <td className="px-4 py-3 text-[var(--text-muted)] max-w-[220px]">
                {majlis.address}
              </td>
              <td className="px-4 py-3 text-[var(--text-muted)]">
                {majlis.speakerNotes || <span className="opacity-40">—</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
