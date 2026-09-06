export type PersonNameFields = {
  first_name?: string
  last_name?: string
  username?: string
  phone?: string
}

/** Prefer first + last name; fall back to @username, then phone. */
export function displayName(
  person: PersonNameFields | null | undefined,
  empty = '—',
): string {
  if (!person) return empty
  const full = [person.first_name, person.last_name].filter(Boolean).join(' ').trim()
  if (full) return full
  if (person.username) return `@${person.username}`
  if (person.phone) return person.phone
  return empty
}

export type CustomerFields = {
  customer_first_name?: string
  customer_last_name?: string
  customer_username?: string
  customer_phone?: string
}

export function customerDisplayName(row: CustomerFields, empty = '—'): string {
  return displayName(
    {
      first_name: row.customer_first_name,
      last_name: row.customer_last_name,
      username: row.customer_username,
      phone: row.customer_phone,
    },
    empty,
  )
}

export type ActorFields = {
  actor_first_name?: string
  actor_last_name?: string
  actor_username?: string
  actor_phone?: string
}

export function actorDisplayName(ev: ActorFields, empty = ''): string {
  return displayName(
    {
      first_name: ev.actor_first_name,
      last_name: ev.actor_last_name,
      username: ev.actor_username,
      phone: ev.actor_phone,
    },
    empty,
  )
}

/** Format as dd/mm/yyyy HH:mm (24h). */
export function formatDateTime(value?: string | Date | null, empty = '—'): string {
  if (!value) return empty
  const d = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(d.getTime())) return empty
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = String(d.getFullYear())
  const hh = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${dd}/${mm}/${yyyy} ${hh}:${min}`
}
