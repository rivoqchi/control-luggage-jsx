import { client } from './client'
import type { AuthPayload, MePayload } from './types'

export const authApi = {
  login(input: { phone?: string; email?: string; username?: string; password: string }) {
    return client.post<AuthPayload>('/auth/login', input).then((res) => res.data)
  },
  register(input: {
    phone?: string
    email?: string
    password: string
    role?: string
  }) {
    return client.post<AuthPayload>('/auth/register', input).then((res) => res.data)
  },
  me() {
    return client.get<MePayload>('/auth/me').then((res) => res.data)
  },
}
