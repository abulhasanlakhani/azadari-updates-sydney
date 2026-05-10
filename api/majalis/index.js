const { app } = require('@azure/functions')

const UPSTREAM_URL = process.env.MAJALIS_API_URL ?? 'https://d3ma4bqipgu84o.cloudfront.net/api/majalis'

const ALLOWED_ORIGINS = [
  'https://victorious-ocean-03bbb1e00.7.azurestaticapps.net',
  'http://localhost:3000',
  'http://localhost:4173',
]

app.http('majalis', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'majalis',
  handler: async (request, context) => {
    context.log('Proxying majalis API request')

    // Reject requests not originating from the known app origin
    const origin = request.headers.get('origin') ?? ''
    if (origin && !ALLOWED_ORIGINS.includes(origin)) {
      return {
        status: 403,
        body: JSON.stringify({ error: 'Forbidden' }),
        headers: { 'Content-Type': 'application/json' },
      }
    }

    const response = await fetch(UPSTREAM_URL)

    if (!response.ok) {
      return {
        status: response.status,
        body: JSON.stringify({ error: 'Upstream API error' }),
        headers: { 'Content-Type': 'application/json' },
      }
    }

    const data = await response.json()

    // Strip PII fields that have no use in the UI before sending to client
    const sanitised = {
      majalis: (data.majalis ?? []).map(({ email: _email, ...rest }) => rest),
    }

    return {
      status: 200,
      jsonBody: sanitised,
    }
  },
})
