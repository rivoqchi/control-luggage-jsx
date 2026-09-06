import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { FileAttachment, Photo } from '../api/types'
import { warehouseApi } from '../api/warehouse'
import { queryKeys } from './queryKeys'

function invalidateWarehouse(qc: ReturnType<typeof useQueryClient>) {
  void qc.invalidateQueries({ queryKey: queryKeys.warehouse.all })
  void qc.invalidateQueries({ queryKey: queryKeys.luggage.all })
  void qc.invalidateQueries({ queryKey: queryKeys.workflow.all })
  void qc.invalidateQueries({ queryKey: queryKeys.driver.all })
}

export function useWarehouseQueue() {
  return useQuery({
    queryKey: queryKeys.warehouse.queue(),
    queryFn: warehouseApi.queue,
  })
}

export function useWarehouseMine() {
  return useQuery({
    queryKey: queryKeys.warehouse.mine(),
    queryFn: warehouseApi.mine,
  })
}

export function useWarehouseToday() {
  return useQuery({
    queryKey: queryKeys.warehouse.today(),
    queryFn: warehouseApi.today,
  })
}

export function useWarehouseAccept() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => warehouseApi.accept(id),
    onSuccess: () => invalidateWarehouse(qc),
  })
}

export function useWarehouseDeliverCustomer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => warehouseApi.deliverCustomer(id),
    onSuccess: () => invalidateWarehouse(qc),
  })
}

export function useWarehouseHandToDriver() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => warehouseApi.handToDriver(id),
    onSuccess: () => invalidateWarehouse(qc),
  })
}

export function useWarehouseCancel() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, note }: { id: string; note?: string }) => warehouseApi.cancel(id, note),
    onSuccess: () => invalidateWarehouse(qc),
  })
}

export function useWarehouseMedia() {
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
    }) => warehouseApi.addMedia(id, photos, files ?? []),
    onSuccess: () => invalidateWarehouse(qc),
  })
}
