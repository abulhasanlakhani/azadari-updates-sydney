import { useState } from 'react'
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { z } from 'zod'
import { useAuth } from '../lib/AuthContext'
import { isAuMobile } from '../lib/phone'

const SearchSchema = z.object({
  // Only allow internal paths so the redirect can't point off-site
  redirect: z
    .string()
    .optional()
    .transform((v) => (v && v.startsWith('/') && !v.startsWith('//') ? v : undefined)),
})

export const Route = createFileRoute('/signin')({
  validateSearch: SearchSchema,
  component: SignInPage,
})

type Step = 'phone' | 'code'

function SignInPage() {
  const { enabled, session, requestOtp, verifyOtp } = useAuth()
  const { redirect } = Route.useSearch()
  const navigate = useNavigate()

  const [step, setStep] = useState<Step>('phone')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const destination = redirect ?? '/'

  const sendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!isAuMobile(phone)) {
      setError('Please enter a valid Australian mobile number (04xx xxx xxx).')
      return
    }
    setBusy(true)
    try {
      await requestOtp(phone)
      setStep('code')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send the code. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  const confirmCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!/^\d{6}$/.test(code.trim())) {
      setError('Please enter the 6-digit code from the SMS.')
      return
    }
    setBusy(true)
    try {
      await verifyOtp(phone, code)
      navigate({ to: destination })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid or expired code. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="page-wrap px-4 py-8">
      <div className="mx-auto max-w-md">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <img
              src="/assets/logo.png"
              alt=""
              aria-hidden="true"
              className="h-16 w-16 rounded-full object-cover opacity-90"
            />
          </div>
          <h1 className="m-0 text-2xl font-bold text-[var(--text)] sm:text-3xl">Sign In</h1>
          <p className="m-0 mt-2 text-sm text-[var(--text-muted)]">
            Use your Australian mobile number — we'll text you a one-time code.
            No password needed.
          </p>
          <div className="gold-rule mx-auto mt-4" />
        </div>

        {!enabled ? (
          <div className="card p-6 text-center space-y-3">
            <p className="m-0 text-sm text-[var(--text)]">
              Sign-in is not available right now.
            </p>
            <p className="m-0 text-xs text-[var(--text-muted)]">
              You can still browse all majalis without an account.
            </p>
            <Link to="/" className="chip active inline-block px-5 py-2 text-sm no-underline">
              Browse Majalis
            </Link>
          </div>
        ) : session ? (
          <div className="card p-6 text-center space-y-3 fade-in">
            <p className="m-0 text-sm text-[var(--text)]">
              You're signed in — venue locations and contact numbers are now visible.
            </p>
            <div className="flex justify-center gap-2">
              <Link to="/" className="chip active px-5 py-2 text-sm no-underline">
                Browse Majalis
              </Link>
              <Link to="/add" className="chip px-5 py-2 text-sm no-underline">
                Add a Majlis
              </Link>
            </div>
          </div>
        ) : step === 'phone' ? (
          <form onSubmit={sendCode} noValidate className="card p-6 sm:p-8 space-y-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="phone" className="text-sm font-medium text-[var(--text)]">
                Mobile Number <span className="text-[var(--gold)]" aria-hidden="true">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="04xx xxx xxx"
                autoComplete="tel"
                inputMode="tel"
                maxLength={20}
                autoFocus
                className="field w-full"
                aria-invalid={!!error}
                aria-describedby={error ? 'err-signin' : undefined}
              />
              <p className="m-0 text-xs text-[var(--text-muted)]">
                Australian mobiles only. Signing in for the first time creates your account.
              </p>
            </div>

            {error && (
              <p id="err-signin" className="text-xs text-red-400" role="alert">{error}</p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="chip active w-full px-6 py-2.5 text-sm font-semibold disabled:opacity-50"
            >
              {busy ? 'Sending code…' : 'Send Code'}
            </button>
          </form>
        ) : (
          <form onSubmit={confirmCode} noValidate className="card p-6 sm:p-8 space-y-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="otp" className="text-sm font-medium text-[var(--text)]">
                Verification Code <span className="text-[var(--gold)]" aria-hidden="true">*</span>
              </label>
              <input
                id="otp"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="6-digit code"
                autoComplete="one-time-code"
                inputMode="numeric"
                maxLength={6}
                autoFocus
                className="field w-full text-center tracking-[0.5em]"
                aria-invalid={!!error}
                aria-describedby={error ? 'err-signin' : undefined}
              />
              <p className="m-0 text-xs text-[var(--text-muted)]">
                We sent a code to <span className="text-[var(--text)]">{phone}</span>.
              </p>
            </div>

            {error && (
              <p id="err-signin" className="text-xs text-red-400" role="alert">{error}</p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="chip active w-full px-6 py-2.5 text-sm font-semibold disabled:opacity-50"
            >
              {busy ? 'Verifying…' : 'Verify & Sign In'}
            </button>

            <button
              type="button"
              onClick={() => { setStep('phone'); setCode(''); setError(null) }}
              className="block w-full text-center text-xs text-[var(--text-muted)] hover:text-[var(--gold)] bg-transparent border-0 cursor-pointer"
            >
              Use a different number or resend the code
            </button>
          </form>
        )}
      </div>
    </main>
  )
}
