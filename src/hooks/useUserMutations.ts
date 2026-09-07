import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { Role, StaffDuty } from '../api/types'
import { usersApi, type UpdateUserInput } from '../api/users'
import { queryKeys } from './queryKeys'

export function useUpdateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateUserInput & { id: string }) => usersApi.update(id, body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.users.all })
    },
  })
}

export function useUpdateUserRole() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, role, duty }: { id: string; role: Role; duty?: StaffDuty }) =>
      usersApi.updateRole(id, role, duty),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.users.all })
    },
  })
}

export function useBlockUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, blocked }: { id: string; blocked: boolean }) =>
      usersApi.setBlocked(id, blocked),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.users.all })
    },
  })
}
