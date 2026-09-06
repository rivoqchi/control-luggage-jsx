const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8081'
const apiPrefix = import.meta.env.VITE_API_PREFIX ?? '/api/v1'
const wsUrl = import.meta.env.VITE_WS_URL ?? 'ws://localhost:8081/api/v1/ws'

export const env = {
  apiBaseUrl,
  apiPrefix,
  wsUrl,
  apiUrl: `${apiBaseUrl}${apiPrefix}`,
}
