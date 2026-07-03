import { describe, expect, it } from 'vitest'
import { isUpcoming, sydneyNow } from './upcoming'

describe('sydneyNow', () => {
  it('converts a UTC instant to Sydney local date/time', () => {
    // 2026-07-03 14:30 UTC = 2026-07-04 00:30 AEST (UTC+10, no DST in July)
    expect(sydneyNow(new Date('2026-07-03T14:30:00Z'))).toEqual({
      date: '2026-07-04',
      time: '00:30',
    })
    // 2026-01-15 14:30 UTC = 2026-01-16 01:30 AEDT (UTC+11 during DST)
    expect(sydneyNow(new Date('2026-01-15T14:30:00Z'))).toEqual({
      date: '2026-01-16',
      time: '01:30',
    })
  })

  it('formats midnight as 00, not 24', () => {
    // 2026-07-03 14:00 UTC = 2026-07-04 00:00 AEST
    expect(sydneyNow(new Date('2026-07-03T14:00:00Z')).time).toBe('00:00')
  })
})

describe('isUpcoming', () => {
  const now = { date: '2026-07-03', time: '19:30' }

  it('keeps events on a future date', () => {
    expect(isUpcoming({ date: '2026-07-04', time: '00:00' }, now)).toBe(true)
  })

  it('drops events on a past date', () => {
    expect(isUpcoming({ date: '2026-07-02', time: '23:59' }, now)).toBe(false)
  })

  it('keeps events later today, including ones starting right now', () => {
    expect(isUpcoming({ date: '2026-07-03', time: '19:31' }, now)).toBe(true)
    expect(isUpcoming({ date: '2026-07-03', time: '19:30' }, now)).toBe(true)
  })

  it('drops events earlier today', () => {
    expect(isUpcoming({ date: '2026-07-03', time: '19:29' }, now)).toBe(false)
  })
})
