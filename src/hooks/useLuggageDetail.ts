import { useQuery } from '@tanstack/react-query'

import { luggageApi } from '../api/luggage'
import { queryKeys } from './queryKeys'

export function useLuggageDetail(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.luggage.detail(id ?? ''),
    queryFn: () => luggageApi.get(id!),
    enabled: Boolean(id),
  })
}
