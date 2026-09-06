import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import { authApi } from '../api/auth'
import type { SessionUser, TokenPair, User } from '../api/types'
import { tokenStorage } from './tokenStorage'

type AuthContextValue = {
  user: SessionUser | null
  accessToken: string | null
  ready: boolean
  setSession: (user: User, tokens: TokenPair) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function toSession(user: User): SessionUser {
  return {
    id: user.id,
    email: user.email,
    phone: user.phone,
    first_name: user.first_name,
    last_name: user.last_name,
    username: user.username,
    role: user.role,
    duty: user.duty,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(() => tokenStorage.getAccess())
  const [ready, setReady] = useState(false)

  const logout = useCallback(() => {
    tokenStorage.clear()
    setUser(null)
    setAccessToken(null)
  }, [])

  const setSession = useCallback((nextUser: User, tokens: TokenPair) => {
    tokenStorage.setTokens(tokens)
    setUser(toSession(nextUser))
    setAccessToken(tokens.access_token)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function boot() {
      if (!tokenStorage.getAccess() && !tokenStorage.getRefresh()) {
        if (!cancelled) {
          setReady(true)
        }
        return
      }

      try {
        const me = await authApi.me()
        if (!cancelled) {
          setUser({
            id: me.user_id,
            email: me.email,
            phone: me.phone,
            first_name: me.first_name,
            last_name: me.last_name,
            username: me.username,
            role: me.role,
            duty: me.duty,
          })
          setAccessToken(tokenStorage.getAccess())
        }
      } catch {
        tokenStorage.clear()
        if (!cancelled) {
          setUser(null)
          setAccessToken(null)
        }
      } finally {
        if (!cancelled) {
          setReady(true)
        }
      }
    }

    void boot()
    return () => {
      cancelled = true
    }
  }, [])

  const value = useMemo(
    () => ({ user, accessToken, ready, setSession, logout }),
    [accessToken, logout, ready, setSession, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return ctx
}
