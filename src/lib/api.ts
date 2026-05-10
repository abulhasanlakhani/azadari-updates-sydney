import { MajalisResponseSchema } from '../types/majlis'
import type { MajalisResponse } from '../types/majlis'

export async function fetchMajalis(): Promise<MajalisResponse> {
  const response = await fetch('/api/majalis')
  if (!response.ok) {
    throw new Error(`Failed to fetch majalis: ${response.status} ${response.statusText}`)
  }
  const json = await response.json()
  return MajalisResponseSchema.parse(json)
}
