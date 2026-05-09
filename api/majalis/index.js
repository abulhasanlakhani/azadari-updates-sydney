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
    return {
      status: 200,
      jsonBody: data,
    }
  },
})
