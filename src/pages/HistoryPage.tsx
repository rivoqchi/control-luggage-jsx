import { Button, DatePicker, Drawer, Image, Input, Select, Space, Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { Dayjs } from 'dayjs'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { getErrorMessage } from '../api/errors'
import { workflowStatuses, type Luggage, type LuggageStatus } from '../api/types'
import { LuggageTimeline } from '../components/LuggageTimeline'
import { useLuggageEvents, useWorkflowList } from '../hooks/useWorkflow'
import { statusColor, statusLabel } from '../utils/labels'
import { mediaSrc } from '../utils/media'
import { customerDisplayName, formatDateTime } from '../utils/person'

const { RangePicker } = DatePicker

export default function HistoryPage() {
  const [customer, setCustomer] = useState('')
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState<LuggageStatus | undefined>()
  const [range, setRange] = useState<[Dayjs, Dayjs] | null>(null)
  const [applied, setApplied] = useState({ customer: '', phone: '' })
  const [selectedId, setSelectedId] = useState<string | undefined>()

  const filter = useMemo(
    () => ({
      customer: applied.customer || undefined,
      phone: applied.phone || undefined,
      status,
      from: range?.[0]?.startOf('day').toISOString(),
      to: range?.[1]?.endOf('day').toISOString(),
    }),
    [applied, range, status],
  )

  const { data, isLoading, isFetching, error } = useWorkflowList(filter)
  const events = useLuggageEvents(selectedId)
  const selected = data?.find((row) => row.id === selectedId)

  const applyFilters = () => {
    setApplied({
      customer: customer.trim(),
      phone: phone.trim(),
    })
  }

  const resetFilters = () => {
    setCustomer('')
    setPhone('')
    setStatus(undefined)
    setRange(null)
    setApplied({ customer: '', phone: '' })
  }

  const columns: ColumnsType<Luggage> = [
    {
      title: 'Tag',
      dataIndex: 'tag_number',
      width: 100,
      render: (value: string, row) => <Link to={`/luggage/${row.id}`}>{value}</Link>,
    },
    {
      title: 'Mijoz',
      key: 'customer',
      render: (_, row) => customerDisplayName(row),
    },
    {
      title: 'Telefon',
      dataIndex: 'customer_phone',
      render: (value?: string) => value || '—',
    },
    {
      title: 'Username',
      dataIndex: 'customer_username',
      render: (value?: string) => (value ? `@${value}` : '—'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (value: LuggageStatus) => <Tag color={statusColor[value]}>{statusLabel[value]}</Tag>,
    },
    {
      title: 'Rasmlar',
      dataIndex: 'photos',
      width: 90,
      render: (photos?: Luggage['photos']) => {
        const src = mediaSrc(photos?.[0])
        if (!src) return '—'
        return <Image src={src} width={44} height={44} style={{ objectFit: 'cover' }} preview={false} />
      },
    },
    {
      title: 'Sana',
      dataIndex: 'created_at',
      render: (value: string) => formatDateTime(value),
    },
  ]

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <div>
        <Typography.Title level={3} style={{ margin: 0 }}>
          Tarix
        </Typography.Title>
      </div>

      <Space wrap align="end">
        <div>
          <Typography.Text type="secondary" style={{ display: 'block', marginBottom: 4, fontSize: 12 }}>
            Mijoz (ism / username)
          </Typography.Text>
          <Input
            allowClear
            placeholder="Ism yoki @username"
            style={{ width: 220 }}
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            onPressEnter={applyFilters}
          />
        </div>
        <div>
          <Typography.Text type="secondary" style={{ display: 'block', marginBottom: 4, fontSize: 12 }}>
            Telefon
          </Typography.Text>
          <Input
            allowClear
            placeholder="+998..."
            style={{ width: 180 }}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onPressEnter={applyFilters}
          />
        </div>
        <div>
          <Typography.Text type="secondary" style={{ display: 'block', marginBottom: 4, fontSize: 12 }}>
            Sana
          </Typography.Text>
          <RangePicker
            value={range}
            onChange={(values) => {
              if (!values || !values[0] || !values[1]) {
                setRange(null)
                return
              }
              setRange([values[0], values[1]])
            }}
          />
        </div>
        <div>
          <Typography.Text type="secondary" style={{ display: 'block', marginBottom: 4, fontSize: 12 }}>
            Status
          </Typography.Text>
          <Select
            allowClear
            placeholder="Barchasi"
            style={{ width: 200 }}
            value={status}
            onChange={setStatus}
            options={workflowStatuses.map((item) => ({
              value: item,
              label: statusLabel[item],
            }))}
          />
        </div>
        <Button type="primary" onClick={applyFilters}>
          Qidirish
        </Button>
        <Button onClick={resetFilters}>Tozalash</Button>
        {isFetching && !isLoading ? <Typography.Text type="secondary">Yangilanmoqda…</Typography.Text> : null}
      </Space>

      {error ? (
        <Typography.Text type="danger">{getErrorMessage(error)}</Typography.Text>
      ) : null}

      <Table<Luggage>
        rowKey="id"
        loading={isLoading}
        columns={columns}
        dataSource={data ?? []}
        pagination={{ pageSize: 20, showTotal: (total) => `Jami: ${total}` }}
        onRow={(row) => ({
          onClick: () => setSelectedId(row.id),
          style: { cursor: 'pointer' },
        })}
        locale={{ emptyText: 'Buyurtma topilmadi' }}
        scroll={{ x: 900 }}
      />

      <Drawer
        title={selected ? selected.tag_number : 'Buyurtma'}
        open={Boolean(selectedId)}
        onClose={() => setSelectedId(undefined)}
        width={420}
        destroyOnClose
      >
        {selected ? (
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Typography.Text type="secondary">Mijoz</Typography.Text>
              <div>{customerDisplayName(selected)}</div>
              <div>{selected.customer_phone || '—'}</div>
              <div>{selected.customer_username ? `@${selected.customer_username}` : ''}</div>
            </div>
            <div>
              <Typography.Text type="secondary">Status</Typography.Text>
              <div>
                <Tag color={statusColor[selected.status]}>{statusLabel[selected.status]}</Tag>
              </div>
            </div>
            <div>
              <Typography.Text type="secondary">Yaratilgan</Typography.Text>
              <div>{formatDateTime(selected.created_at)}</div>
            </div>
            {selected.photos && selected.photos.length > 0 ? (
              <Image.PreviewGroup>
                <Space wrap>
                  {selected.photos.map((photo) => {
                    const src = mediaSrc(photo)
                    return src ? <Image key={photo.key} src={src} width={88} /> : null
                  })}
                </Space>
              </Image.PreviewGroup>
            ) : null}
            {selected.files && selected.files.length > 0 ? (
              <Space direction="vertical" size={4}>
                <Typography.Text type="secondary">Fayllar</Typography.Text>
                {selected.files.map((file) => {
                  const href = mediaSrc(file)
                  return (
                    <Typography.Link key={file.key} href={href || undefined} target="_blank" disabled={!href}>
                      {file.name || file.key}
                    </Typography.Link>
                  )
                })}
              </Space>
            ) : null}
            <Button type="link" style={{ padding: 0 }}>
              <Link to={`/luggage/${selected.id}`}>To‘liq ochish</Link>
            </Button>
            <LuggageTimeline events={events.data ?? []} loading={events.isLoading} />
          </Space>
        ) : null}
      </Drawer>
    </Space>
  )
}
