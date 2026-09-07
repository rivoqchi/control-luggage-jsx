import { client } from './client'
import type { Role, StaffDuty, User } from './types'

export type UsersFilter = {
  role?: Role
  blocked?: boolean
  q?: string
}

export type UpdateUserInput = {
  phone?: string
  email?: string
  first_name?: string
  last_name?: string
  username?: string
  role: Role
  duty?: StaffDuty
  blocked: boolean
}

export const usersApi = {
  list(filter: UsersFilter = {}) {
    return client
      .get<User[]>('/users/', {
        params: {
          role: filter.role,
          blocked: filter.blocked,
          q: filter.q || undefined,
        },
      })
      .then((res) => res.data)
  },
  update(id: string, body: UpdateUserInput) {
    return client
      .patch<User>(`/users/${id}`, {
        ...body,
        duty: body.role === 'staff' ? body.duty : undefined,
      })
      .then((res) => res.data)
  },
  updateRole(id: string, role: Role, duty?: StaffDuty) {
    return client
      .patch<User>(`/users/${id}/role`, { role, duty: role === 'staff' ? duty : undefined })
      .then((res) => res.data)
  },
  setBlocked(id: string, blocked: boolean) {
    return client.patch<User>(`/users/${id}/block`, { blocked }).then((res) => res.data)
  },
}
