import { describe, expect, it } from 'vitest'
import { formatAuMobileLocal, isAuMobile, normaliseAuMobile } from './phone'

describe('normaliseAuMobile', () => {
  it('normalises local 04 numbers', () => {
    expect(normaliseAuMobile('0412 345 678')).toBe('+61412345678')
    expect(normaliseAuMobile('0412-345-678')).toBe('+61412345678')
    expect(normaliseAuMobile('0412345678')).toBe('+61412345678')
  })

  it('normalises +61 and 61 prefixed numbers', () => {
    expect(normaliseAuMobile('+61 412 345 678')).toBe('+61412345678')
    expect(normaliseAuMobile('61412345678')).toBe('+61412345678')
    expect(normaliseAuMobile('+61412345678')).toBe('+61412345678')
  })

  it('normalises bare 4xx numbers', () => {
    expect(normaliseAuMobile('412 345 678')).toBe('+61412345678')
  })

  it('rejects landlines and service numbers', () => {
    expect(normaliseAuMobile('02 9876 5432')).toBeNull()
    expect(normaliseAuMobile('+61 2 9876 5432')).toBeNull()
    expect(normaliseAuMobile('1300 123 456')).toBeNull()
    expect(normaliseAuMobile('1800 123 456')).toBeNull()
  })

  it('rejects non-Australian and malformed numbers', () => {
    expect(normaliseAuMobile('+44 7911 123456')).toBeNull()
    expect(normaliseAuMobile('0412 345 67')).toBeNull()
    expect(normaliseAuMobile('0412 345 6789')).toBeNull()
    expect(normaliseAuMobile('')).toBeNull()
    expect(normaliseAuMobile('not a number')).toBeNull()
  })
})

describe('isAuMobile', () => {
  it('mirrors normaliseAuMobile', () => {
    expect(isAuMobile('0412 345 678')).toBe(true)
    expect(isAuMobile('02 9876 5432')).toBe(false)
  })
})

describe('formatAuMobileLocal', () => {
  it('formats E.164 back to local form', () => {
    expect(formatAuMobileLocal('+61412345678')).toBe('0412 345 678')
  })

  it('returns input unchanged when not an AU mobile', () => {
    expect(formatAuMobileLocal('+44 7911 123456')).toBe('+44 7911 123456')
  })
})
