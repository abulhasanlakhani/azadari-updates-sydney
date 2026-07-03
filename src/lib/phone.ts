/**
 * Australian mobile number helpers.
 *
 * Sign-in is restricted to Australian mobiles (04xx / +614xx). Landlines and
 * 1300/1800 numbers are accepted on the majlis contact field but cannot be
 * used to create an account.
 */

/** Strips everything except digits and a leading '+'. */
function digitsOf(input: string): string {
  return input.replace(/[^\d]/g, '')
}

/**
 * Normalises an Australian mobile number to E.164 (+614xxxxxxxx).
 * Returns null when the input is not a valid AU mobile.
 *
 * Accepted spellings (spaces/dashes/parens ignored):
 *   04xx xxx xxx · +61 4xx xxx xxx · 61 4xx xxx xxx · 4xx xxx xxx
 */
export function normaliseAuMobile(input: string): string | null {
  const digits = digitsOf(input.trim())
  if (digits.startsWith('614') && digits.length === 11) return `+${digits}`
  if (digits.startsWith('04') && digits.length === 10) return `+61${digits.slice(1)}`
  if (digits.startsWith('4') && digits.length === 9) return `+61${digits}`
  return null
}

export function isAuMobile(input: string): boolean {
  return normaliseAuMobile(input) !== null
}

/** Formats an E.164 AU mobile back to the familiar local 04xx xxx xxx form. */
export function formatAuMobileLocal(e164: string): string {
  const normalised = normaliseAuMobile(e164)
  if (!normalised) return e164
  const local = `0${normalised.slice(3)}`
  return `${local.slice(0, 4)} ${local.slice(4, 7)} ${local.slice(7)}`
}
