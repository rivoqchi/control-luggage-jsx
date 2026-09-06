import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { App as AntdApp, ConfigProvider } from 'antd'
import { BrowserRouter } from 'react-router-dom'

import { AuthProvider } from './auth/AuthProvider'
import { AppRoutes } from './routes'
import { antdTheme } from './theme/antd'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

export default function App() {
  return (
    <ConfigProvider theme={antdTheme}>
      <AntdApp
        style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
        message={{
          duration: 3,
          maxCount: 3,
          styles: {
            list: {
              top: 'auto',
              bottom: 0,
              flexDirection: 'column-reverse',
            },
          },
        }}
      >
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </AuthProvider>
        </QueryClientProvider>
      </AntdApp>
    </ConfigProvider>
  )
}
