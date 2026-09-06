import { client } from './client'
import type { FileAttachment, Luggage, Photo } from './types'

export const warehouseApi = {
  queue() {
    return client.get<Luggage[]>('/warehouse/queue').then((res) => res.data)
  },
  mine() {
    return client.get<Luggage[]>('/warehouse/mine').then((res) => res.data)
  },
  today() {
    return client.get<Luggage[]>('/warehouse/today').then((res) => res.data)
  },
  accept(id: string) {
    return client.post<Luggage>(`/warehouse/${id}/accept`).then((res) => res.data)
  },
  deliverCustomer(id: string) {
    return client.post<Luggage>(`/warehouse/${id}/deliver-customer`).then((res) => res.data)
  },
  handToDriver(id: string) {
    return client.post<Luggage>(`/warehouse/${id}/hand-to-driver`).then((res) => res.data)
  },
  cancel(id: string, note?: string) {
    return client.post<Luggage>(`/warehouse/${id}/cancel`, { note }).then((res) => res.data)
  },
  addMedia(id: string, photos: Photo[], files: FileAttachment[] = []) {
    return client
      .post<Luggage>(`/warehouse/${id}/media`, { photos, files })
      .then((res) => res.data)
  },
}
