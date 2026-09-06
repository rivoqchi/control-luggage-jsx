import { Alert, Button, Image, Select, Space, Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { getErrorMessage } from '../api/errors'
import { workflowStatuses, type Luggage, type LuggageStatus } from '../api/types'
import { useAuth } from '../auth/AuthProvider'
import { useLuggageList } from '../hooks/useLuggageList'
import { statusColor, statusLabel } from '../utils/labels'
import { mediaSrc } from '../utils/media'
import { formatDateTime } from '../utils/person'

export default function LuggageListPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const isCustomer = user?.role === 'customer'
  const [status, setStatus] = useState<LuggageStatus | undefined>()
  const { data, error } = useLuggageList(status)

  const columns: ColumnsType<Luggage> = [
    {
      title: 'Tag',
      dataIndex: 'tag_number',
      render: (value: string, row) => <Link to={`/luggage/${row.id}`}>{value}</Link>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (value: LuggageStatus) => <Tag color={statusColor[value]}>{statusLabel[value]}</Tag>,
    },
    { title: 'Joy', dataIndex: 'location', render: (value?: string) => value || '—' },
    {
      title: 'Rasmlar',
      dataIndex: 'photos',
      render: (photos?: Luggage['photos']) => {
        const src = photos?.length ? mediaSrc(photos[0]) : ''
        return src ? (
          <Image src={src} width={40} height={40} style={{ objectFit: 'cover' }} preview={false} />
        ) : (
          '—'
        )
      },
    },
    {
      title: 'Fayllar',
      dataIndex: 'files',
      render: (files?: Luggage['files']) => (files?.length ? files.length : '—'),
    },
    {
      title: 'Yaratilgan',
      dataIndex: 'created_at',
      render: (value: string) => formatDateTime(value),
    },
  ]

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
        <Space>
          <Typography.Title level={4} style={{ margin: 0 }}>
            {isCustomer ? 'Buyurtmalarim' : 'Yuklar'}
          </Typography.Title>
        </Space>
        <Space>
          <Select
            allowClear
            placeholder="Status"
            style={{ width: 180 }}
            value={status}
            onChange={(value) => setStatus(value)}
            options={workflowStatuses.map((item) => ({
              value: item,
              label: statusLabel[item],
            }))}
          />
          {!isCustomer && (
            <Button type="primary" onClick={() => navigate('/luggage/new')}>
              Yangi yuk
            </Button>
          )}
        </Space>
      </Space>

      {error && <Alert type="error" message={getErrorMessage(error)} showIcon />}

      <Table<Luggage>
        rowKey="id"
        columns={columns}
        dataSource={data ?? []}
        loading={false}
        pagination={false}
        locale={{ emptyText: isCustomer ? 'Buyurtmalar yo‘q' : 'Yuklar yo‘q' }}
        style={{ width: '100%' }}
        onRow={(row) => ({
          onClick: () => navigate(`/luggage/${row.id}`),
          style: { cursor: 'pointer' },
        })}
      />
    </Space>
  )
}
