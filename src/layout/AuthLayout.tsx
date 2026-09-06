import { Layout, Typography } from 'antd'
import { Outlet } from 'react-router-dom'

const { Content } = Layout

export function AuthLayout() {
  return (
    <Layout
      style={{
        minHeight: '100%',
        height: '100%',
        width: '100%',
        background:
          'radial-gradient(circle at top left, #dbeafe 0%, transparent 45%), linear-gradient(160deg, #f8fafc 0%, #e2e8f0 100%)',
      }}
    >
      <Content
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          width: '100%',
          height: '100%',
        }}
      >
        <div style={{ width: '100%', maxWidth: 420 }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <span
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: 'linear-gradient(135deg, #38bdf8, #2563eb)',
                color: '#fff',
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                marginBottom: 12,
              }}
            >
              CL
            </span>
            <Typography.Title level={3} style={{ margin: 0 }}>
              Control Luggage
            </Typography.Title>
          </div>
          <Outlet />
        </div>
      </Content>
    </Layout>
  )
}
