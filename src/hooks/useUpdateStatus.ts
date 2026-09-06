import { useMutation, useQueryClient } from '@tanstack/react-query'

import { luggageApi } from '../api/luggage'
import type { Luggage, LuggageStatus } from '../api/types'
import { queryKeys } from './queryKeys'

function upsertLuggage(list: Luggage[] | undefined, item: Luggage): Luggage[] | undefined {
  if (!list) {
    return list
  }
  const index = list.findIndex((row) => row.id === item.id)
  if (index === -1) {
    return [item, ...list]
  }
  const next = list.slice()
  next[index] = item
  return next
}

export function useUpdateStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: LuggageStatus }) =>
      luggageApi.updateStatus(id, status),
    onSuccess: (item) => {
      queryClient.setQueryData(queryKeys.luggage.detail(item.id), item)
      queryClient.setQueriesData<Luggage[]>(
        { queryKey: queryKeys.luggage.lists() },
        (old) => upsertLuggage(old, item),
      )
    },
  })
}
