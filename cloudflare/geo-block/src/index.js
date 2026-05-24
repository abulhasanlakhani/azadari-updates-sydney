const BLOCKED_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Azadari Updates Sydney — Region Restricted</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #0a0a0a;
      color: #e8e8e8;
      font-family: Inter, system-ui, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 2rem;
    }
    .box {
      text-align: center;
      max-width: 420px;
    }
    h1 {
      color: #C9A227;
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }
    p {
      color: #9ca3af;
      font-size: 0.95rem;
      line-height: 1.6;
      margin-bottom: 0.75rem;
    }
    .tagline {
      color: #C9A227;
      font-style: italic;
      margin-top: 1.5rem;
    }
  </style>
</head>
<body>
  <div class="box">
    <h1>Azadari Updates Sydney</h1>
    <p>This website is intended for the Shia Muslim community in Sydney, Australia and is only accessible from within Australia.</p>
    <p class="tagline">Ya Hussain (a.s.)</p>
  </div>
</body>
</html>`;

export default {
  async fetch(request, env, ctx) {
    const country = request.cf?.country ?? null;

    if (country !== 'AU') {
      return new Response(BLOCKED_PAGE, {
        status: 403,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-store',
        },
      });
    }

    return fetch(request);
  },
};
