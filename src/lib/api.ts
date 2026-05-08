import type { MajalisResponse } from '../types/majlis'

const API_URL = 'https://d3ma4bqipgu84o.cloudfront.net/api/majalis'

export async function fetchMajalis(): Promise<MajalisResponse> {
  const response = await fetch(API_URL)
  if (!response.ok) {
    throw new Error(`Failed to fetch majalis: ${response.status} ${response.statusText}`)
  }
  return response.json() as Promise<MajalisResponse>
}
