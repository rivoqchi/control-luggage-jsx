import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'

import { env } from '../config/env'
import { tokenStorage } from '../auth/tokenStorage'
import { ApiError } from './errors'
import type { ApiBody, TokenPair } from './types'

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean }

const client = axios.create({
  baseURL: env.apiUrl,
  headers: { 'Content-Type': 'application/json' },
})

const refreshClient = axios.create({
  baseURL: env.apiUrl,
  headers: { 'Content-Type': 'application/json' },
})

let refreshPromise: Promise<string | null> | null = null

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = tokenStorage.getRefresh()
  if (!refreshToken) {
    return null
  }

  const response = await refreshClient.post<ApiBody<TokenPair>>('/auth/refresh', {
    refresh_token: refreshToken,
  })
  const tokens = response.data.data
  if (!tokens?.access_token) {
    return null
  }
  tokenStorage.setTokens(tokens)
  return tokens.access_token
}

function startRefresh(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken()
      .catch(() => null)
      .finally(() => {
        refreshPromise = null
      })
  }
  return refreshPromise
}

client.interceptors.request.use((config) => {
  const token = tokenStorage.getAccess()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

client.interceptors.response.use(
  (response) => {
    const body = response.data as ApiBody<unknown>
    if (body && typeof body === 'object' && 'data' in body) {
      response.data = body.data
    }
    return response
  },
  async (error: AxiosError<ApiBody<unknown>>) => {
    const original = error.config as RetryConfig | undefined
    const status = error.response?.status ?? 0
    const message = error.response?.data?.error ?? error.message ?? 'request failed'
    const url = original?.url ?? ''

    if (status === 401 && original && !original._retry && !url.includes('/auth/refresh')) {
      original._retry = true
      const nextToken = await startRefresh()
      if (nextToken) {
        original.headers.Authorization = `Bearer ${nextToken}`
        return client(original)
      }
      tokenStorage.clear()
    }

    throw new ApiError(status, message)
  },
)

export { client }
