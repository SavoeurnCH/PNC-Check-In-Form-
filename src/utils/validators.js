/** Small, dependency-free validation helpers shared by the check-in form steps. */

export const isRequired = (value) =>
  typeof value === 'string' ? value.trim().length > 0 : value !== null && value !== undefined

/** Loose phone/contact check: at least 6 digits, optionally with +, spaces or dashes. */
export const isValidContact = (value) => /^[+\d][\d\s-]{5,}$/.test(String(value ?? '').trim())

export const isValidEmail = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value ?? '').trim())
