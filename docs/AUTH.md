# Authentication Setup — Supabase Phone OTP

The app uses [Supabase](https://supabase.com) for passwordless sign-in with
Australian mobile numbers (SMS one-time codes) and for majalis storage.

## What auth changes

| Capability                    | Anonymous | Signed in (phone verified) |
|-------------------------------|-----------|----------------------------|
| Browse majalis list           | ✅        | ✅                         |
| See venue address & contact   | ❌ hidden | ✅                         |
| Submit a new majlis           | ❌        | ✅                         |
| Edit / delete majalis         | ❌        | ❌ (deliberately disabled for now) |

Hiding address/contact is enforced **in the database** with Postgres
column-level grants — the anonymous API role cannot select those columns at
all — not just hidden in the UI. Every majlis records an `owner_id`, so
per-owner edit/delete can be enabled later with two RLS policies.

Until the Supabase env vars are configured, the app automatically falls back
to the read-only legacy API (`/api/majalis`) so browsing keeps working, and
sign-in/submissions show a friendly "unavailable" notice.

## 1. Create the Supabase project

1. Create a project at [database.new](https://database.new) (free tier is fine).
2. Note the **Project URL** and **anon (public) key** from *Settings → API*.

## 2. Apply the database migration

Either paste `supabase/migrations/20260703000000_majalis_auth.sql` into the
SQL editor in the dashboard, or with the [Supabase CLI](https://supabase.com/docs/guides/cli):

```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

This creates `public.majalis` with:

- public read of non-sensitive columns only (`id`, `name`, `date`, `time`,
  `audience`, `speaker_notes`, `created_at`)
- full read for the `authenticated` role (adds `contact`, `address`)
- insert restricted to signed-in users inserting as themselves
- no update/delete grants or policies (admin edits happen in the dashboard)

## 3. Configure phone auth (Twilio)

Supabase sends OTP SMS through a provider you connect. Twilio is the default
choice:

1. Create a [Twilio](https://www.twilio.com) account and a **Verify Service**
   (Verify handles OTP delivery/expiry and is cheaper than raw SMS for OTP).
2. In Supabase: *Authentication → Sign In / Up → Phone* — enable **Phone
   provider**, select **Twilio Verify**, and paste the Account SID, Auth
   Token, and Verify Service SID.
3. Recommended hardening (same page / Auth settings):
   - OTP expiry: 300 seconds
   - Rate limits: keep the defaults (they stop SMS-pumping abuse)
   - Leave "Enable phone confirmations" ON so numbers must be verified.

Costs: expect roughly AU$0.05–0.10 per verification SMS to Australian
mobiles. There is no monthly fee at this scale.

> The app only ever sends Australian mobiles (`+614xxxxxxxx`) to Supabase —
> input is validated and normalised client-side (`src/lib/phone.ts`).
> As a belt-and-braces measure you can also restrict Twilio Verify to the
> AU region in the Twilio console (Verify → Settings → Geo permissions).

## 4. Environment variables

Local development — create `.env`:

```bash
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
```

Production — the site is statically built, so these must exist at **build
time**. Add them as GitHub Actions secrets (`VITE_SUPABASE_URL`,
`VITE_SUPABASE_ANON_KEY`); the workflow already passes them to `pnpm build`.

The anon key is designed to be public — access control lives in RLS and the
column grants, not in the key.

## 5. Import existing majalis (one-time)

Existing events live in the legacy CloudFront API. Import them:

```bash
SUPABASE_URL=https://<your-project-ref>.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=<service-role-key> \
node scripts/import-legacy-majalis.mjs
```

- Idempotent — rows upsert on `legacy_id`, safe to re-run.
- The **service role key** bypasses RLS. Run this locally only; never put it
  in the client, the repo, or CI.

## 6. Smoke test

1. `pnpm dev`, open http://localhost:3000 — list should load; addresses and
   contact numbers replaced by "Sign in to view".
2. Header → **Sign In** → enter your AU mobile → receive SMS → enter code.
3. Addresses/contacts now visible; **Add Majlis** shows the form and a
   submission appears in the list immediately.
4. Sign out — the sensitive fields disappear again.
