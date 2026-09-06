import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { FileAttachment, Photo } from '../api/types'
import { driverApi } from '../api/driver'
import { queryKeys } from './queryKeys'

function invalidateDriver(qc: ReturnType<typeof useQueryClient>) {
  void qc.invalidateQueries({ queryKey: queryKeys.driver.all })
  void qc.invalidateQueries({ queryKey: queryKeys.luggage.all })
  void qc.invalidateQueries({ queryKey: queryKeys.workflow.all })
  void qc.invalidateQueries({ queryKey: queryKeys.warehouse.all })
}

export function useDriverQueue() {
  return useQuery({
    queryKey: queryKeys.driver.queue(),
    queryFn: driverApi.queue,
  })
}

export function useDriverMine() {
  return useQuery({
    queryKey: queryKeys.driver.mine(),
    queryFn: driverApi.mine,
  })
}

export function useDriverAccept() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => driverApi.accept(id),
    onSuccess: () => invalidateDriver(qc),
  })
}

export function useDriverDeliver() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => driverApi.deliver(id),
    onSuccess: () => invalidateDriver(qc),
  })
}

export function useDriverMedia() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      photos,
      files,
    }: {
      id: string
      photos: Photo[]
      files?: FileAttachment[]
    }) => driverApi.addMedia(id, photos, files ?? []),
    onSuccess: () => invalidateDriver(qc),
  })
}
