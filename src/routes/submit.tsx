import { createFileRoute } from '@tanstack/react-router'
import SubmitForm from '../components/SubmitForm'

export const Route = createFileRoute('/submit')({ component: SubmitPage })

function SubmitPage() {
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

        <SubmitForm />
      </div>
    </main>
  )
}
