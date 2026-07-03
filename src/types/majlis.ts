import { z } from 'zod'

export const MajlisSchema = z.object({
  id: z.string(),
  name: z.string(),
  // contact and address are only readable by signed-in users — Postgres
  // column-level grants withhold them from anonymous reads, so they arrive
  // as null when browsing logged out.
  contact: z.string().nullish(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected YYYY-MM-DD'),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Expected HH:mm'),
  address: z.string().nullish(),
  audience: z.enum(['Gents', 'Ladies', 'Both']),
  speakerNotes: z.string(),
  createdAt: z.string(),
  ownerId: z.string().nullish(),
})

export const MajalisResponseSchema = z.object({
  majalis: z.array(MajlisSchema),
})

export type Majlis = z.infer<typeof MajlisSchema>
export type MajalisResponse = z.infer<typeof MajalisResponseSchema>

export type AudienceFilter = 'All' | 'Gents' | 'Ladies' | 'Both'

export interface FilterState {
  audience: AudienceFilter
  dateFrom: string
  dateTo: string
  search: string
}
