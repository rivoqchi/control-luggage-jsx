import {
  CarOutlined,
  DashboardOutlined,
  HistoryOutlined,
  InboxOutlined,
  ProfileOutlined,
  ProjectOutlined,
  ScheduleOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Avatar, Dropdown, Layout, Menu, Space, Typography } from 'antd'
import type { ReactNode } from 'react'
import { useMemo } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import { useAuth } from '../auth/AuthProvider'
import { useLuggageSocket } from '../realtime/useLuggageSocket'
import { displayName } from '../utils/person'

const { Header, Content } = Layout

export function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  useLuggageSocket()

  const navItems = useMemo(() => {
    const isCustomer = user?.role === 'customer'
    const items: { key: string; icon: ReactNode; label: string }[] = []

    if (isCustomer) {
      items.push({ key: '/luggage', icon: <InboxOutlined />, label: 'Buyurtmalarim' })
      return items
    }

    items.push({ key: '/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' })
    if (user?.role === 'admin') {
      items.push({ key: '/users', icon: <TeamOutlined />, label: 'Foydalanuvchilar' })
    }
    items.push({ key: '/plan', icon: <ProjectOutlined />, label: 'Plan' })
    if (user?.role === 'admin' || user?.role === 'staff') {
      items.push({ key: '/workflow', icon: <ScheduleOutlined />, label: 'Ish jarayoni' })
      items.push({ key: '/history', icon: <HistoryOutlined />, label: 'Tarix' })
    }
    if (
      user?.role === 'admin' ||
      user?.duty === 'warehouse' ||
      user?.duty === 'boss'
    ) {
      items.push({ key: '/warehouse', icon: <InboxOutlined />, label: 'Ombor navbati' })
      if (user?.duty === 'warehouse' || user?.role === 'admin') {
        items.push({ key: '/warehouse/mine', icon: <InboxOutlined />, label: 'Joriy buyurtmalar' })
        items.push({ key: '/warehouse/today', icon: <InboxOutlined />, label: 'Bugungi buyurtmalar' })
      }
    }
    if (
      user?.role === 'admin' ||
      user?.duty === 'driver' ||
      user?.duty === 'boss'
    ) {
      items.push({ key: '/driver', icon: <CarOutlined />, label: 'Haydovchi navbati' })
      if (user?.duty === 'driver' || user?.role === 'admin') {
        items.push({ key: '/driver/mine', icon: <CarOutlined />, label: 'Mening yetkazmalarim' })
      }
    }
    return items
  }, [user])

  const homePath = user?.role === 'customer' ? '/luggage' : '/dashboard'
  const selected =
    navItems.find((item) => location.pathname === item.key || location.pathname.startsWith(`${item.key}/`))
      ?.key ?? homePath

  return (
    <Layout
      style={{
        minHeight: '100%',
        height: '100%',
        width: '100%',
        background: '#f4f6f8',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header
        style={{
          background: '#0f172a',
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          paddingInline: 20,
          width: '100%',
          position: 'sticky',
          top: 0,
          zIndex: 20,
          flexShrink: 0,
        }}
      >
        <button
          type="button"
          onClick={() => navigate(homePath)}
          style={{
            border: 0,
            background: 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: 0,
          }}
        >
          <span
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #38bdf8, #2563eb)',
              color: '#fff',
              fontWeight: 800,
              letterSpacing: 0.5,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
            }}
          >
            CL
          </span>
          <Typography.Text style={{ color: '#fff', fontWeight: 600 }}>
            Control Luggage
          </Typography.Text>
        </button>

        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[selected]}
          onClick={({ key }) => navigate(key)}
          items={navItems}
          style={{
            flex: 1,
            minWidth: 0,
            background: 'transparent',
            borderBottom: 'none',
          }}
        />

        <Dropdown
          menu={{
            items: [
              {
                key: 'profile',
                icon: <ProfileOutlined />,
                label: 'Profil',
                onClick: () => navigate('/profile'),
              },
              {
                key: 'logout',
                icon: <UserOutlined />,
                label: 'Chiqish',
                onClick: logout,
              },
            ],
          }}
          placement="bottomRight"
        >
          <Space style={{ cursor: 'pointer', color: '#fff' }}>
            <Avatar size="small" icon={<UserOutlined />} style={{ background: '#2563eb' }} />
            <Typography.Text style={{ color: '#e2e8f0' }}>
              {displayName(user, user?.phone || user?.email || 'Profil')}
            </Typography.Text>
          </Space>
        </Dropdown>
      </Header>

      <Content
        style={{
          padding: 24,
          width: '100%',
          maxWidth: '100%',
          flex: 1,
          minHeight: 0,
          boxSizing: 'border-box',
        }}
      >
        <Outlet />
      </Content>
    </Layout>
  )
}
