import { useMutation } from '@tanstack/react-query'

import { authApi } from '../api/auth'
import { useAuth } from '../auth/AuthProvider'

export function useLogin() {
  const { setSession } = useAuth()

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (payload) => {
      setSession(payload.user, payload.tokens)
    },
  })
}

export function useRegister() {
  const { setSession } = useAuth()

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (payload) => {
      setSession(payload.user, payload.tokens)
    },
  })
}
