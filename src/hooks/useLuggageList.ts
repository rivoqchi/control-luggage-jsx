import { useQuery } from '@tanstack/react-query'

import { luggageApi } from '../api/luggage'
import type { LuggageStatus } from '../api/types'
import { queryKeys } from './queryKeys'

export function useLuggageList(status?: LuggageStatus) {
  return useQuery({
    queryKey: queryKeys.luggage.list(status),
    queryFn: () => luggageApi.list(status),
  })
}
