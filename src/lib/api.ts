import type { MajalisResponse } from '../types/majlis'

export async function fetchMajalis(): Promise<MajalisResponse> {
  const response = await fetch('/api/majalis')
  if (!response.ok) {
    throw new Error(`Failed to fetch majalis: ${response.status} ${response.statusText}`)
  }
  return response.json() as Promise<MajalisResponse>
}
