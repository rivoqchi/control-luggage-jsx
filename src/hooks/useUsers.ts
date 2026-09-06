import { useQuery } from '@tanstack/react-query'

import { usersApi, type UsersFilter } from '../api/users'
import { queryKeys } from './queryKeys'

export function useUsers(filter: UsersFilter) {
  return useQuery({
    queryKey: queryKeys.users.list(filter),
    queryFn: () => usersApi.list(filter),
  })
}
