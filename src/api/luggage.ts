import { client } from './client'
import type { CreateLuggageInput, Luggage, LuggageStatus } from './types'

export const luggageApi = {
  list(status?: LuggageStatus) {
    return client
      .get<Luggage[]>('/luggage/', { params: status ? { status } : undefined })
      .then((res) => res.data)
  },
  get(id: string) {
    return client.get<Luggage>(`/luggage/${id}`).then((res) => res.data)
  },
  create(input: CreateLuggageInput) {
    return client.post<Luggage>('/luggage/', input).then((res) => res.data)
  },
  updateStatus(id: string, status: LuggageStatus) {
    return client.patch<Luggage>(`/luggage/${id}/status`, { status }).then((res) => res.data)
  },
}
