interface PrintButtonProps {
  position?: 'top' | 'bottom'
}

export default function PrintButton({ position = 'top' }: PrintButtonProps) {
  return (
    <div
      className={`no-print flex ${position === 'top' ? 'justify-end' : 'justify-center'}`}
    >
      <button
        onClick={() => window.print()}
        aria-label="Print or save as PDF"
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-muted)] transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
      >
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 6 2 18 2 18 9"/>
          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
          <rect x="6" y="14" width="12" height="8"/>
        </svg>
        Print / Save as PDF
      </button>
    </div>
  )
}
