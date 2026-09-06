import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

import type { Luggage } from '../api/types'
import { useAuth } from '../auth/AuthProvider'
import { queryKeys } from '../hooks/queryKeys'
import { luggageSocket } from './wsClient'

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

export function useLuggageSocket() {
  const queryClient = useQueryClient()
  const { user, accessToken } = useAuth()

  useEffect(() => {
    if (!user || !accessToken) {
      luggageSocket.disconnect()
      return
    }

    return luggageSocket.connect(accessToken, (event) => {
      const item = event.data
      queryClient.setQueryData(queryKeys.luggage.detail(item.id), item)
      queryClient.setQueriesData<Luggage[]>(
        { queryKey: queryKeys.luggage.lists() },
        (old) => upsertLuggage(old, item),
      )
      void queryClient.invalidateQueries({ queryKey: queryKeys.warehouse.all })
      void queryClient.invalidateQueries({ queryKey: queryKeys.driver.all })
      void queryClient.invalidateQueries({ queryKey: queryKeys.workflow.all })
      void queryClient.invalidateQueries({ queryKey: queryKeys.luggage.events(item.id) })
    })
  }, [accessToken, queryClient, user])
}
