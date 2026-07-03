import { useEffect } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import SubmitForm from '../components/SubmitForm'
import { analytics } from '../lib/analytics'
import { useAuth } from '../lib/AuthContext'

export const Route = createFileRoute('/add')({ component: AddMajlisPage })

function AddMajlisPage() {
  const { enabled, loading, session } = useAuth()

  useEffect(() => {
    if (session) analytics.submitMajlisStart()
  }, [session])

  return (
    <main className="page-wrap px-4 py-8">
      <div className="mx-auto max-w-2xl">
        {/* Page heading */}
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <img
              src="/assets/logo.png"
              alt=""
              aria-hidden="true"
              className="h-16 w-16 rounded-full object-cover opacity-90"
            />
          </div>
          <h1 className="m-0 text-2xl font-bold text-[var(--text)] sm:text-3xl">
            Add a Majlis
          </h1>
          <p className="m-0 mt-2 text-sm text-[var(--text-muted)]">
            Submit majlis details for the Azadari Updates Sydney calendar 1448
          </p>
          <div className="gold-rule mx-auto mt-4" />
        </div>

        {!enabled ? (
          <div className="card p-6 text-center space-y-3">
            <p className="m-0 text-sm text-[var(--text)]">
              Submissions are temporarily unavailable.
            </p>
            <p className="m-0 text-xs text-[var(--text-muted)]">
              You can still browse all majalis in the meantime.
            </p>
            <Link to="/" className="chip active inline-block px-5 py-2 text-sm no-underline">
              Browse Majalis
            </Link>
          </div>
        ) : loading ? null : !session ? (
          <div className="card p-6 sm:p-8 text-center space-y-4">
            <p className="m-0 text-sm text-[var(--text)]">
              Please sign in to submit a majlis.
            </p>
            <p className="m-0 text-xs text-[var(--text-muted)]">
              We verify submitters with a one-time SMS code to keep the calendar
              trustworthy. All you need is an Australian mobile number.
            </p>
            <Link
              to="/signin"
              search={{ redirect: '/add' }}
              className="chip active inline-block px-6 py-2.5 text-sm font-semibold no-underline"
            >
              Sign In to Continue
            </Link>
          </div>
        ) : (
          <SubmitForm />
        )}
      </div>
    </main>
  )
}
