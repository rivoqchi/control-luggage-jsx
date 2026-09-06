import { client } from './client'
import type { FileAttachment, Luggage, Photo } from './types'

export const driverApi = {
  queue() {
    return client.get<Luggage[]>('/driver/queue').then((res) => res.data)
  },
  mine() {
    return client.get<Luggage[]>('/driver/mine').then((res) => res.data)
  },
  accept(id: string) {
    return client.post<Luggage>(`/driver/${id}/accept`).then((res) => res.data)
  },
  deliver(id: string) {
    return client.post<Luggage>(`/driver/${id}/deliver`).then((res) => res.data)
  },
  addMedia(id: string, photos: Photo[], files: FileAttachment[] = []) {
    return client.post<Luggage>(`/driver/${id}/media`, { photos, files }).then((res) => res.data)
  },
}
