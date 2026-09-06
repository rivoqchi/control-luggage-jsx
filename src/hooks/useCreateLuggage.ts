import { useMutation, useQueryClient } from '@tanstack/react-query'

import { luggageApi } from '../api/luggage'
import { queryKeys } from './queryKeys'

export function useCreateLuggage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: luggageApi.create,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.luggage.lists() })
    },
  })
}
