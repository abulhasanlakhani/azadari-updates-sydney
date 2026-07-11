import type { Majlis } from '../types/majlis'

// Constructing Intl.DateTimeFormat is expensive (locale + timezone data
// resolution), and sydneyNow() runs inside the query select on every list
// render — build the formatter once at module scope and reuse it.
const SYDNEY_FORMATTER = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Australia/Sydney',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
})

// Event dates/times are entered in Sydney local time, so "now" must be
// computed in Australia/Sydney regardless of the visitor's device timezone.
export function sydneyNow(reference: Date = new Date()): { date: string; time: string } {
  const parts = SYDNEY_FORMATTER.formatToParts(reference)

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? ''

  return {
    date: `${get('year')}-${get('month')}-${get('day')}`,
    time: `${get('hour')}:${get('minute')}`,
  }
}

// An event stays "upcoming" for its entire calendar day in Sydney time:
// today's majalis remain listed even after their start time has passed.
export function isUpcoming(m: Pick<Majlis, 'date' | 'time'>, now = sydneyNow()): boolean {
  return m.date >= now.date
}

export function filterUpcoming<T extends Pick<Majlis, 'date' | 'time'>>(
  majalis: T[],
  now = sydneyNow()
): T[] {
  const upcoming = majalis.filter((m) => isUpcoming(m, now))
  // Preserve the input array's identity when nothing was filtered out, so
  // downstream memoisation keyed on reference equality isn't invalidated.
  return upcoming.length === majalis.length ? majalis : upcoming
}
