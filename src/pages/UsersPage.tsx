import { StopOutlined, UnlockOutlined } from '@ant-design/icons'
import {
  App,
  Button,
  Descriptions,
  Input,
  Select,
  Skeleton,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

import { getErrorMessage } from '../api/errors'
import { roles, staffDuties, type Role, type StaffDuty, type User } from '../api/types'
import { useAuth } from '../auth/AuthProvider'
import { useBlockUser, useUpdateUserRole } from '../hooks/useUserMutations'
import { useUsers } from '../hooks/useUsers'
import { dutyLabel, roleLabel } from '../utils/labels'
import { displayName, formatDateTime } from '../utils/person'

function SmoothExpandPanel({
  expanded,
  children,
}: {
  expanded: boolean
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!expanded) {
      setOpen(false)
      return
    }

    let cancelled = false
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!cancelled) setOpen(true)
      })
    })
    return () => {
      cancelled = true
      cancelAnimationFrame(id)
    }
  }, [expanded])

  return (
    <div className={`users-expand-panel${open ? ' is-open' : ''}`}>
      <div className="users-expand-panel__inner">{children}</div>
    </div>
  )
}

type RoleFilter = Role | 'all'
type BlockedFilter = 'all' | 'active' | 'blocked'

const SUPER_ADMIN_PHONE = '+998947932005'

function isSuperAdmin(user: User) {
  return user.phone === SUPER_ADMIN_PHONE
}

export default function UsersPage() {
  const { message } = App.useApp()
  const { user: me } = useAuth()
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all')
  const [blockedFilter, setBlockedFilter] = useState<BlockedFilter>('all')
  const [query, setQuery] = useState('')

  const filter = useMemo(
    () => ({
      role: roleFilter === 'all' ? undefined : roleFilter,
      blocked:
        blockedFilter === 'all' ? undefined : blockedFilter === 'blocked',
      q: query.trim() || undefined,
    }),
    [blockedFilter, query, roleFilter],
  )

  const { data, isLoading, error } = useUsers(filter)
  const updateRole = useUpdateUserRole()
  const blockUser = useBlockUser()

  if (me && me.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  const saveRole = (row: User, role: Role, duty?: StaffDuty) => {
    if (role === 'staff' && !duty) {
      message.warning('Xodim uchun vazifa tanlang')
      return
    }
    updateRole.mutate(
      { id: row.id, role, duty },
      {
        onSuccess: () => message.success('Rol yangilandi'),
        onError: (err) => message.error(getErrorMessage(err)),
      },
    )
  }

  const columns: ColumnsType<User> = [
    {
      title: 'Telefon',
      dataIndex: 'phone',
      render: (value?: string) => value || '—',
    },
    {
      title: 'Ism',
      key: 'name',
      render: (_, row) => displayName(row),
    },
    {
      title: 'Rol',
      dataIndex: 'role',
      width: 160,
      render: (value: Role, row) => (
        <Select
          value={value}
          style={{ width: '100%' }}
          disabled={updateRole.isPending || row.id === me?.id || isSuperAdmin(row)}
          options={roles.map((role) => ({
            value: role,
            label: roleLabel[role],
          }))}
          onClick={(e) => e.stopPropagation()}
          onChange={(role) => {
            if (role === 'staff') {
              saveRole(row, role, row.duty ?? 'warehouse')
              return
            }
            saveRole(row, role)
          }}
        />
      ),
    },
    {
      title: 'Xodimning vazifasi',
      dataIndex: 'duty',
      width: 180,
      render: (value: StaffDuty | undefined, row) => {
        if (row.role !== 'staff') {
          return <Typography.Text type="secondary">—</Typography.Text>
        }
        return (
          <Select
            value={value}
            placeholder="Vazifa"
            style={{ width: '100%' }}
            disabled={updateRole.isPending || row.id === me?.id || isSuperAdmin(row)}
            options={staffDuties.map((duty) => ({
              value: duty,
              label: dutyLabel[duty],
            }))}
            onClick={(e) => e.stopPropagation()}
            onChange={(duty) => saveRole(row, 'staff', duty)}
          />
        )
      },
    },
    {
      title: 'Holat',
      dataIndex: 'blocked',
      width: 130,
      render: (blocked: boolean, row) =>
        isSuperAdmin(row) ? (
          <Tag color="purple">Super Admin</Tag>
        ) : blocked ? (
          <Tag color="red">Bloklangan</Tag>
        ) : (
          <Tag color="green">Faol</Tag>
        ),
    },
    {
      title: 'Ro‘yxat',
      dataIndex: 'created_at',
      render: (value: string) => formatDateTime(value),
    },
  ]

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <Typography.Title level={3} style={{ margin: 0 }}>
        Foydalanuvchilar
      </Typography.Title>

      <Space wrap style={{ width: '100%' }}>
        <Select
          value={roleFilter}
          style={{ width: 160 }}
          onChange={setRoleFilter}
          options={[
            { value: 'all', label: 'Barcha rollar' },
            { value: 'customer', label: 'Mijoz' },
            { value: 'staff', label: 'Xodim' },
            { value: 'admin', label: 'Admin' },
          ]}
        />
        <Select
          value={blockedFilter}
          style={{ width: 160 }}
          onChange={setBlockedFilter}
          options={[
            { value: 'all', label: 'Barcha holat' },
            { value: 'active', label: 'Faol' },
            { value: 'blocked', label: 'Bloklangan' },
          ]}
        />
        <Input.Search
          allowClear
          placeholder="Telefon / ism qidirish"
          style={{ width: 260 }}
          onSearch={setQuery}
          onChange={(e) => {
            if (!e.target.value) setQuery('')
          }}
        />
      </Space>

      {error ? (
        <Typography.Text type="danger">{getErrorMessage(error)}</Typography.Text>
      ) : null}

      {isLoading ? (
        <Skeleton active paragraph={{ rows: 8 }} />
      ) : (
        <Table<User>
          className="users-table"
          rowKey="id"
          columns={columns}
          dataSource={data ?? []}
          pagination={{ pageSize: 20 }}
          style={{ width: '100%' }}
          expandable={{
            expandedRowRender: (row, _index, _indent, expanded) => (
              <SmoothExpandPanel expanded={expanded}>
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <Descriptions size="small" bordered column={1}>
                    <Descriptions.Item label="Vazifa">
                      {row.duty ? dutyLabel[row.duty] : '—'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Oxirgi kirish">
                      {formatDateTime(row.last_login_at)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Telegram">
                      {row.username ? `@${row.username}` : row.telegram_id || '—'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Email">{row.email || '—'}</Descriptions.Item>
                    <Descriptions.Item label="Yangilangan">
                      {formatDateTime(row.updated_at)}
                    </Descriptions.Item>
                    <Descriptions.Item label="ID">{row.id}</Descriptions.Item>
                  </Descriptions>

                  <Space>
                    {isSuperAdmin(row) ? (
                      <Typography.Text type="secondary">
                        Super admin o‘zgartirilmaydi
                      </Typography.Text>
                    ) : row.blocked ? (
                      <Button
                        icon={<UnlockOutlined />}
                        disabled={blockUser.isPending || row.id === me?.id}
                        onClick={() => {
                          blockUser.mutate(
                            { id: row.id, blocked: false },
                            {
                              onSuccess: () => message.success('Blokdan chiqarildi'),
                              onError: (err) => message.error(getErrorMessage(err)),
                            },
                          )
                        }}
                      >
                        Blokdan chiqarish
                      </Button>
                    ) : (
                      <Button
                        danger
                        icon={<StopOutlined />}
                        disabled={blockUser.isPending || row.id === me?.id}
                        onClick={() => {
                          blockUser.mutate(
                            { id: row.id, blocked: true },
                            {
                              onSuccess: () => message.success('Foydalanuvchi bloklandi'),
                              onError: (err) => message.error(getErrorMessage(err)),
                            },
                          )
                        }}
                      >
                        Bloklash
                      </Button>
                    )}
                  </Space>
                </Space>
              </SmoothExpandPanel>
            ),
          }}
          locale={{ emptyText: 'Foydalanuvchilar yo‘q' }}
        />
      )}
    </Space>
  )
}
