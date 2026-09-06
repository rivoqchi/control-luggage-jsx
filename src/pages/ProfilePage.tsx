import { Card, Descriptions, Typography } from 'antd'

import { useAuth } from '../auth/AuthProvider'
import { dutyLabel, roleLabel } from '../utils/labels'
import { displayName } from '../utils/person'

export default function ProfilePage() {
  const { user } = useAuth()

  return (
    <Card style={{ width: '100%', minHeight: '100%' }}>
      <Typography.Title level={3} style={{ marginTop: 0 }}>
        Profil
      </Typography.Title>
      <Descriptions column={1} bordered size="small">
        <Descriptions.Item label="Ism">{displayName(user)}</Descriptions.Item>
        <Descriptions.Item label="Telefon">{user?.phone || '—'}</Descriptions.Item>
        <Descriptions.Item label="Email">{user?.email || '—'}</Descriptions.Item>
        <Descriptions.Item label="Rol">
          {user ? roleLabel[user.role] : '—'}
        </Descriptions.Item>
        <Descriptions.Item label="Vazifa">
          {user?.duty ? dutyLabel[user.duty] : '—'}
        </Descriptions.Item>
        <Descriptions.Item label="ID">{user?.id || '—'}</Descriptions.Item>
      </Descriptions>
    </Card>
  )
}
