export const UZ_PHONE_PREFIX = '+998'

/** Faqat 9 ta lokal raqam: 901234567 */
export function sanitizeLocalPhone(value: string): string {
  return value.replace(/\D/g, '').slice(0, 9)
}

/** +998901234567 */
export function toFullPhone(local9: string): string {
  const local = sanitizeLocalPhone(local9)
  return `${UZ_PHONE_PREFIX}${local}`
}

export function isValidUzLocalPhone(local9: string): boolean {
  return sanitizeLocalPhone(local9).length === 9
}

/** Parol = telefon oxirgi 4 raqami */
export function passwordFromPhone(fullOrLocal: string): string {
  const digits = fullOrLocal.replace(/\D/g, '')
  if (digits.length < 4) {
    return digits
  }
  return digits.slice(-4)
}
