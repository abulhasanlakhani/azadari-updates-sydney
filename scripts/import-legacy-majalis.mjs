#!/usr/bin/env node
/**
 * One-time import of majalis from the legacy CloudFront API into Supabase.
 *
 * Usage:
 *   SUPABASE_URL=https://<ref>.supabase.co \
 *   SUPABASE_SERVICE_ROLE_KEY=<service-role-key> \
 *   node scripts/import-legacy-majalis.mjs
 *
 * Idempotent: rows are upserted on legacy_id, so re-running is safe.
 * The service-role key bypasses RLS — never ship it to the client; run this
 * locally only.
 */

const LEGACY_API_URL =
  process.env.LEGACY_API_URL ?? 'https://d3ma4bqipgu84o.cloudfront.net/api/majalis'

const SUPABASE_URL = process.env.SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.')
  process.exit(1)
}

console.log(`Fetching legacy majalis from ${LEGACY_API_URL} ...`)
const legacyResponse = await fetch(LEGACY_API_URL)
if (!legacyResponse.ok) {
  console.error(`Legacy API returned ${legacyResponse.status} ${legacyResponse.statusText}`)
  process.exit(1)
}
const { majalis = [] } = await legacyResponse.json()
console.log(`Fetched ${majalis.length} majalis.`)

const rows = majalis.map((m) => ({
  legacy_id: String(m.id),
  owner_id: null, // pre-auth submissions have no owner
  name: m.name,
  contact: m.contact,
  date: m.date,
  time: m.time,
  address: m.address,
  audience: m.audience,
  speaker_notes: m.speakerNotes ?? '',
  created_at: m.createdAt ?? new Date().toISOString(),
}))

if (rows.length === 0) {
  console.log('Nothing to import.')
  process.exit(0)
}

const endpoint = `${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/majalis?on_conflict=legacy_id`
const response = await fetch(endpoint, {
  method: 'POST',
  headers: {
    apikey: SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
    'Content-Type': 'application/json',
    Prefer: 'resolution=merge-duplicates,return=minimal',
  },
  body: JSON.stringify(rows),
})

if (!response.ok) {
  console.error(`Import failed: ${response.status} ${response.statusText}`)
  console.error(await response.text())
  process.exit(1)
}

console.log(`Imported/updated ${rows.length} majalis into Supabase.`)
