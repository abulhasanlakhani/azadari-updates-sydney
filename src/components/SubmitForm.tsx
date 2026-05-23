import { useState } from 'react'

const SUBMISSION_URL = 'https://d3ma4bqipgu84o.cloudfront.net/api/submission'
const AUDIENCE_OPTIONS = ['Gents', 'Ladies', 'Both'] as const
const DATE_MIN = '2026-06-15'
const DATE_MAX = '2026-08-24'

const NAME_PATTERN = /^(?=.{2,80}$)[a-z]+(?:[ '.-][a-z]+)*$/i
const PHONE_PATTERN =
  /^(?:(?:\+61|61)\s?[2-478](?:[\s-]?\d){8}|0[2-478](?:[\s-]?\d){8}|(?:\+61|61)\s?4(?:[\s-]?\d){8}|04(?:[\s-]?\d){8}|1300(?:[\s-]?\d){6}|1800(?:[\s-]?\d){6})$/
const ADDRESS_PATTERN =
  /^(?=.*\d)(?=.*\b(?:nsw|new south wales|vic|victoria|qld|queensland|sa|south australia|wa|western australia|tas|tasmania|act|australian capital territory|nt|northern territory)\b|.*\b\d{4}\b)[a-z0-9][a-z0-9\s,.'\/-]{7,}$/i

interface FormValues {
  name: string
  contact: string
  date: string
  time: string
  address: string
  audience: string
  speakerNotes: string
}

interface FieldErrors {
  name?: string
  contact?: string
  date?: string
  time?: string
  address?: string
  audience?: string
}

const EMPTY: FormValues = {
  name: '',
  contact: '',
  date: '',
  time: '',
  address: '',
  audience: '',
  speakerNotes: '',
}

function validate(values: FormValues): FieldErrors {
  const errors: FieldErrors = {}
  if (!NAME_PATTERN.test(values.name.trim()))
    errors.name = 'Please enter a valid full name.'
  if (!PHONE_PATTERN.test(values.contact.trim()))
    errors.contact = 'Please enter a valid Australian contact number.'
  if (!values.date || values.date < DATE_MIN || values.date > DATE_MAX)
    errors.date = 'Please select a date between 15 Jun and 24 Aug 2026.'
  if (!values.time.trim())
    errors.time = 'Please select the majlis time.'
  if (!ADDRESS_PATTERN.test(values.address.trim()))
    errors.address = 'Please enter a valid Australian address with street details and state or postcode.'
  if (!values.audience)
    errors.audience = 'Please select the audience.'
  return errors
}

function formatDate(value: string) {
  if (!value) return ''
  return new Intl.DateTimeFormat('en-AU', {
    weekday: 'short', day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date(`${value}T00:00:00`))
}

function formatTime(value: string) {
  if (!value) return ''
  const [h, m] = value.split(':')
  const d = new Date()
  d.setHours(Number(h), Number(m), 0, 0)
  return new Intl.DateTimeFormat('en-AU', { hour: 'numeric', minute: '2-digit' }).format(d)
}

type Status = 'idle' | 'submitting' | 'success' | 'error'

export default function SubmitForm() {
  const [values, setValues] = useState<FormValues>(EMPTY)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [touched, setTouched] = useState<Partial<Record<keyof FormValues, boolean>>>({})
  const [status, setStatus] = useState<Status>('idle')
  const [submitted, setSubmitted] = useState<FormValues | null>(null)

  const set = (field: keyof FormValues, value: string) => {
    const next = { ...values, [field]: value }
    setValues(next)
    if (touched[field]) {
      setErrors(validate(next))
    }
  }

  const blur = (field: keyof FormValues) => {
    setTouched((t) => ({ ...t, [field]: true }))
    setErrors(validate(values))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const allTouched = Object.fromEntries(
      Object.keys(EMPTY).map((k) => [k, true])
    ) as Record<keyof FormValues, boolean>
    setTouched(allTouched)
    const errs = validate(values)
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setStatus('submitting')
    try {
      const res = await fetch(SUBMISSION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(values),
      })
      if (!res.ok) throw new Error('Submission failed')
      setSubmitted(values)
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  const reset = () => {
    setValues(EMPTY)
    setErrors({})
    setTouched({})
    setStatus('idle')
    setSubmitted(null)
  }

  if (status === 'success' && submitted) {
    return (
      <div className="card p-6 sm:p-8 space-y-5 text-center fade-in">
        {/* Success icon */}
        <div className="flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(201,162,39,0.12)] border border-[rgba(201,162,39,0.3)]">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="var(--gold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 6 9 17l-5-5"/>
            </svg>
          </div>
        </div>

        <div>
          <p className="m-0 text-xs font-semibold uppercase tracking-widest text-[var(--gold)] mb-1">
            Submitted Successfully
          </p>
          <h2 className="m-0 text-xl font-bold text-[var(--text)]">
            Majlis details captured
          </h2>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            Your majlis has been submitted to the Azadari Updates Sydney calendar.
          </p>
        </div>

        {/* Summary */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-base)] p-4 text-left space-y-3">
          {[
            ['Name', submitted.name],
            ['Date', formatDate(submitted.date)],
            ['Time', formatTime(submitted.time)],
            ['Contact', submitted.contact],
            ['Address', submitted.address],
            ['Audience', submitted.audience],
            ...(submitted.speakerNotes.trim() ? [['Speaker / Notes', submitted.speakerNotes]] : []),
          ].map(([label, value]) => (
            <div key={label} className="flex flex-col sm:flex-row sm:gap-4">
              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)] sm:w-32 shrink-0">
                {label}
              </span>
              <span className="text-sm text-[var(--text)]">{value}</span>
            </div>
          ))}
        </div>

        <button
          onClick={reset}
          className="chip active px-5 py-2 text-sm"
        >
          Submit Another Majlis
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="card p-6 sm:p-8 space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Name */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium text-[var(--text)]">
            Name <span className="text-[var(--gold)]" aria-hidden="true">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={values.name}
            onChange={(e) => set('name', e.target.value)}
            onBlur={() => blur('name')}
            placeholder="Enter full name"
            autoComplete="name"
            className={`field w-full ${touched.name && errors.name ? 'border-[var(--crimson)]!' : ''}`}
            aria-invalid={touched.name && !!errors.name}
            aria-describedby={errors.name ? 'err-name' : undefined}
          />
          {touched.name && errors.name && (
            <p id="err-name" className="text-xs text-red-400" role="alert">{errors.name}</p>
          )}
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact" className="text-sm font-medium text-[var(--text)]">
            Contact Number <span className="text-[var(--gold)]" aria-hidden="true">*</span>
          </label>
          <input
            id="contact"
            type="tel"
            value={values.contact}
            onChange={(e) => set('contact', e.target.value)}
            onBlur={() => blur('contact')}
            placeholder="+61 ..."
            autoComplete="tel"
            inputMode="tel"
            className={`field w-full ${touched.contact && errors.contact ? 'border-[var(--crimson)]!' : ''}`}
            aria-invalid={touched.contact && !!errors.contact}
            aria-describedby={errors.contact ? 'err-contact' : undefined}
          />
          {touched.contact && errors.contact && (
            <p id="err-contact" className="text-xs text-red-400" role="alert">{errors.contact}</p>
          )}
        </div>

        {/* Date */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="date" className="text-sm font-medium text-[var(--text)]">
            Majlis Date <span className="text-[var(--gold)]" aria-hidden="true">*</span>
          </label>
          <input
            id="date"
            type="date"
            value={values.date}
            onChange={(e) => set('date', e.target.value)}
            onBlur={() => blur('date')}
            min={DATE_MIN}
            max={DATE_MAX}
            className={`field w-full ${touched.date && errors.date ? 'border-[var(--crimson)]!' : ''}`}
            aria-invalid={touched.date && !!errors.date}
            aria-describedby={errors.date ? 'err-date' : undefined}
          />
          {touched.date && errors.date && (
            <p id="err-date" className="text-xs text-red-400" role="alert">{errors.date}</p>
          )}
        </div>

        {/* Time */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="time" className="text-sm font-medium text-[var(--text)]">
            Majlis Time <span className="text-[var(--gold)]" aria-hidden="true">*</span>
          </label>
          <input
            id="time"
            type="time"
            value={values.time}
            onChange={(e) => set('time', e.target.value)}
            onBlur={() => blur('time')}
            className={`field w-full ${touched.time && errors.time ? 'border-[var(--crimson)]!' : ''}`}
            aria-invalid={touched.time && !!errors.time}
            aria-describedby={errors.time ? 'err-time' : undefined}
          />
          {touched.time && errors.time && (
            <p id="err-time" className="text-xs text-red-400" role="alert">{errors.time}</p>
          )}
        </div>

        {/* Address — full width */}
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label htmlFor="address" className="text-sm font-medium text-[var(--text)]">
            Address <span className="text-[var(--gold)]" aria-hidden="true">*</span>
          </label>
          <input
            id="address"
            type="text"
            value={values.address}
            onChange={(e) => set('address', e.target.value)}
            onBlur={() => blur('address')}
            placeholder="Street address, suburb, postcode"
            autoComplete="street-address"
            className={`field w-full ${touched.address && errors.address ? 'border-[var(--crimson)]!' : ''}`}
            aria-invalid={touched.address && !!errors.address}
            aria-describedby={errors.address ? 'err-address' : undefined}
          />
          {touched.address && errors.address && (
            <p id="err-address" className="text-xs text-red-400" role="alert">{errors.address}</p>
          )}
        </div>

        {/* Audience */}
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-[var(--text)]" id="audience-label">
            Audience <span className="text-[var(--gold)]" aria-hidden="true">*</span>
          </span>
          <div className="flex gap-2" role="radiogroup" aria-labelledby="audience-label">
            {AUDIENCE_OPTIONS.map((opt) => (
              <label key={opt} className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="audience"
                  value={opt}
                  checked={values.audience === opt}
                  onChange={() => set('audience', opt)}
                  onBlur={() => blur('audience')}
                  className="accent-[var(--gold)]"
                />
                <span className="text-sm text-[var(--text-muted)]">{opt}</span>
              </label>
            ))}
          </div>
          {touched.audience && errors.audience && (
            <p id="err-audience" className="text-xs text-red-400" role="alert">{errors.audience}</p>
          )}
        </div>

        {/* Speaker / Notes — full width */}
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label htmlFor="speakerNotes" className="text-sm font-medium text-[var(--text)]">
            Speaker / Notes
            <span className="ml-2 text-xs font-normal text-[var(--text-muted)]">(optional)</span>
          </label>
          <textarea
            id="speakerNotes"
            rows={4}
            value={values.speakerNotes}
            onChange={(e) => set('speakerNotes', e.target.value)}
            placeholder="Optional speaker name or any helpful notes"
            className="field w-full resize-y"
          />
        </div>
      </div>

      {/* Error summary */}
      {status === 'error' && (
        <p className="rounded-lg border border-[var(--crimson)] bg-[rgba(127,29,29,0.1)] px-4 py-3 text-sm text-red-400" role="alert">
          Submission failed. Please check your connection and try again.
        </p>
      )}

      {/* Footer row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-1">
        <p className="m-0 text-xs text-[var(--text-muted)]">
          Fields marked <span className="text-[var(--gold)]">*</span> are required.
        </p>
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="chip active px-6 py-2.5 text-sm font-semibold disabled:opacity-50"
        >
          {status === 'submitting' ? 'Submitting…' : 'Submit Majlis'}
        </button>
      </div>
    </form>
  )
}
