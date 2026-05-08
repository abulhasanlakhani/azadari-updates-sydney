import { Link } from '@tanstack/react-router'

const FACEBOOK_URL = 'https://www.facebook.com/AzadariUpdateSydney'
const YOUTUBE_URL = 'http://www.youtube.com/@azadariupdates-sydney7367'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--header-bg)] backdrop-blur-md">
      <div className="page-wrap flex items-center justify-between gap-4 px-4 py-3">
        {/* Logo + Brand */}
        <Link to="/" className="flex items-center gap-3 no-underline group">
          <img
            src="/assets/logo.png"
            alt="Azadari Updates Sydney"
            className="h-10 w-10 rounded-full object-cover opacity-90 transition group-hover:opacity-100"
          />
          <div className="hidden sm:block">
            <p className="m-0 text-sm font-semibold leading-tight text-[var(--text)]">
              Azadari Updates
            </p>
            <p className="m-0 text-xs text-[var(--text-muted)]">Sydney</p>
          </div>
        </Link>

        {/* Social links */}
        <div className="flex items-center gap-1">
          <a
            href={FACEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Azadari Updates Sydney on Facebook"
            className="rounded-lg p-2 text-[var(--text-muted)] transition hover:bg-[var(--bg-surface)] hover:text-[var(--gold)]"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
              <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.027 4.388 11.02 10.125 11.927v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.696 4.533-4.696 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.93-1.956 1.874v2.25h3.328l-.532 3.49h-2.796v8.437C19.612 23.093 24 18.1 24 12.073z"/>
            </svg>
          </a>
          <a
            href={YOUTUBE_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Azadari Updates Sydney on YouTube"
            className="rounded-lg p-2 text-[var(--text-muted)] transition hover:bg-[var(--bg-surface)] hover:text-[var(--gold)]"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </a>
        </div>
      </div>
    </header>
  )
}
