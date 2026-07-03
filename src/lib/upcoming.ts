import type { Majlis } from '../types/majlis'

// Event dates/times are entered in Sydney local time, so "now" must be
// computed in Australia/Sydney regardless of the visitor's device timezone.
export function sydneyNow(reference: Date = new Date()): { date: string; time: string } {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Australia/Sydney',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(reference)

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? ''

  return {
    date: `${get('year')}-${get('month')}-${get('day')}`,
    time: `${get('hour')}:${get('minute')}`,
  }
}

export function isUpcoming(m: Pick<Majlis, 'date' | 'time'>, now = sydneyNow()): boolean {
  if (m.date !== now.date) return m.date > now.date
  return m.time >= now.time
}
