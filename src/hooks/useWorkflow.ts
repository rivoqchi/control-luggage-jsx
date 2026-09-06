import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { WorkflowFilter } from '../api/types'
import { workflowApi } from '../api/workflow'
import { queryKeys } from './queryKeys'

export function useWorkflowList(filter: WorkflowFilter) {
  return useQuery({
    queryKey: queryKeys.workflow.list(filter),
    queryFn: () => workflowApi.list(filter),
  })
}

export function useLuggageEvents(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.luggage.events(id ?? ''),
    queryFn: () => workflowApi.events(id!),
    enabled: Boolean(id),
  })
}

export function useUpdateLuggage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      ...body
    }: {
      id: string
      tag_number?: string
      description?: string
      location?: string
      customer_phone?: string
      customer_username?: string
    }) => workflowApi.update(id, body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.luggage.all })
      void qc.invalidateQueries({ queryKey: queryKeys.workflow.all })
    },
  })
}

export function useCancelLuggage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, note }: { id: string; note?: string }) => workflowApi.cancel(id, note),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.luggage.all })
      void qc.invalidateQueries({ queryKey: queryKeys.workflow.all })
    },
  })
}
