import { client } from './client'
import type { Luggage, LuggageEvent, WorkflowFilter } from './types'

export const workflowApi = {
  list(filter: WorkflowFilter = {}) {
    return client
      .get<Luggage[]>('/workflow', {
        params: {
          q: filter.q || undefined,
          customer: filter.customer || undefined,
          phone: filter.phone || undefined,
          status: filter.status || undefined,
          from: filter.from || undefined,
          to: filter.to || undefined,
        },
      })
      .then((res) => res.data)
  },
  events(id: string) {
    return client.get<LuggageEvent[]>(`/luggage/${id}/events`).then((res) => res.data)
  },
  update(
    id: string,
    body: {
      tag_number?: string
      description?: string
      location?: string
      customer_phone?: string
      customer_username?: string
    },
  ) {
    return client.patch<Luggage>(`/luggage/${id}`, body).then((res) => res.data)
  },
  cancel(id: string, note?: string) {
    return client.post<Luggage>(`/luggage/${id}/cancel`, { note }).then((res) => res.data)
  },
  hardDelete(id: string) {
    return client.delete<{ ok: boolean }>(`/luggage/${id}`).then((res) => res.data)
  },
}
