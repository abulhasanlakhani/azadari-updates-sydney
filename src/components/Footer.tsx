const FACEBOOK_URL = 'https://www.facebook.com/AzadariUpdateSydney'
const YOUTUBE_URL = 'https://www.youtube.com/@azadariupdates-sydney7367'

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-[var(--border)] bg-[var(--bg-surface)] px-4 py-10 text-[var(--text-muted)]">
      <div className="page-wrap flex flex-col items-center gap-6">
        {/* Logo block */}
        <div className="flex flex-col items-center gap-2">
          <img
            src="/assets/logo.png"
            alt="Azadari Updates Sydney"
            className="h-12 w-12 rounded-full object-cover opacity-80"
          />
          <p className="m-0 text-sm font-medium text-[var(--text)]">Azadari Updates Sydney</p>
          <p className="m-0 text-xs text-center max-w-xs leading-relaxed">
            For the love of Imam Hussain (a.s.) — Muharram 1448 / 2026
          </p>
        </div>

        {/* Social links */}
        <div className="flex items-center gap-4">
          <a
            href={FACEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="flex items-center gap-2 text-xs text-[var(--text-muted)] transition hover:text-[var(--gold)]"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
              <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.027 4.388 11.02 10.125 11.927v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.696 4.533-4.696 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.93-1.956 1.874v2.25h3.328l-.532 3.49h-2.796v8.437C19.612 23.093 24 18.1 24 12.073z"/>
            </svg>
            Facebook
          </a>
          <span className="text-[var(--border)]">|</span>
          <a
            href={YOUTUBE_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            className="flex items-center gap-2 text-xs text-[var(--text-muted)] transition hover:text-[var(--gold)]"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            YouTube
          </a>
        </div>

        <div className="gold-rule" />

        <p className="m-0 text-xs text-center opacity-50">
          Community app — not affiliated with any organisation
        </p>
      </div>
    </footer>
  )
}
