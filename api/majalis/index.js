const { app } = require('@azure/functions')

app.http('majalis', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'majalis',
  handler: async (_request, context) => {
    context.log('Proxying majalis API request')

    const response = await fetch('https://d3ma4bqipgu84o.cloudfront.net/api/majalis')

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
