export interface Majlis {
  id: string
  name: string
  email: string
  contact: string
  date: string // YYYY-MM-DD
  time: string // HH:mm
  address: string
  audience: 'Gents' | 'Ladies' | 'Both'
  speakerNotes: string
  createdAt: string // ISO 8601
}

export interface MajalisResponse {
  majalis: Majlis[]
}

export type AudienceFilter = 'All' | 'Gents' | 'Ladies' | 'Both'

export interface FilterState {
  audience: AudienceFilter
  dateFrom: string
  dateTo: string
  search: string
}
