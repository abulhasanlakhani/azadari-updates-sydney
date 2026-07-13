import { MajalisResponseSchema, MajlisSchema } from '../types/majlis'
import type { Majlis, MajalisResponse } from '../types/majlis'
import { getSupabase, isSupabaseConfigured } from './supabase'

/** Row shape of the public.majalis table (snake_case, sensitive columns optional). */
interface MajlisRow {
  id: string
  name: string
  date: string
  time: string
  audience: string
  speaker_notes: string
  created_at: string
  // Only selectable by authenticated users — column-level grants in Postgres
  contact?: string
  address?: string
  owner_id?: string | null
}

function rowToMajlis(row: MajlisRow): Majlis {
  return MajlisSchema.parse({
    id: row.id,
    name: row.name,
    contact: row.contact ?? null,
    date: row.date,
    // Postgres time columns serialise as HH:mm:ss — keep the app's HH:mm shape
    time: row.time.slice(0, 5),
    address: row.address ?? null,
    audience: row.audience,
    speakerNotes: row.speaker_notes,
    createdAt: row.created_at,
    ownerId: row.owner_id ?? null,
  })
}

// Anon may only read the non-sensitive columns; asking for more is rejected
// by Postgres, so the column list is chosen per auth state.
const PUBLIC_COLUMNS = 'id, name, date, time, audience, speaker_notes, created_at'
const FULL_COLUMNS = `${PUBLIC_COLUMNS}, contact, address, owner_id`

export async function fetchMajalis(): Promise<MajalisResponse> {
  if (!isSupabaseConfigured) return fetchMajalisLegacy()

  const supabase = getSupabase()
  const { data: sessionData } = await supabase.auth.getSession()
  const columns = sessionData.session ? FULL_COLUMNS : PUBLIC_COLUMNS

  const { data, error } = await supabase
    .from('majalis')
    .select(columns)
    .order('date', { ascending: true })
    .order('time', { ascending: true })

  if (error) throw new Error(`Failed to fetch majalis: ${error.message}`)
  return { majalis: (data as unknown as MajlisRow[]).map(rowToMajlis) }
}

/** Read-only fallback to the old proxied API until Supabase is configured. */
async function fetchMajalisLegacy(): Promise<MajalisResponse> {
  const response = await fetch('/api/majalis')
  if (!response.ok) {
    throw new Error(`Failed to fetch majalis: ${response.status} ${response.statusText}`)
  }
  const json = await response.json()
  return MajalisResponseSchema.parse(json)
}

export interface MajlisInput {
  name: string
  contact: string
  date: string
  time: string
  address: string
  audience: string
  speakerNotes: string
}

/**
 * Inserts a majlis owned by the signed-in user. Row Level Security rejects
 * the write unless the caller is authenticated and owner_id matches auth.uid().
 */
export async function createMajlis(input: MajlisInput, ownerId: string): Promise<Majlis> {
  const { data, error } = await getSupabase()
    .from('majalis')
    .insert({
      name: input.name,
      contact: input.contact,
      date: input.date,
      time: input.time,
      address: input.address,
      audience: input.audience,
      speaker_notes: input.speakerNotes,
      owner_id: ownerId,
    })
    .select(FULL_COLUMNS)
    .single()

  if (error) throw new Error(`Failed to submit majlis: ${error.message}`)
  return rowToMajlis(data as unknown as MajlisRow)
}
