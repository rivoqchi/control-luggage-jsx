import { App, DatePicker, Drawer, Input, Select, Space, Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { Dayjs } from 'dayjs'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { getErrorMessage } from '../api/errors'
import { workflowStatuses, type Luggage, type LuggageStatus } from '../api/types'
import { LuggageTimeline } from '../components/LuggageTimeline'
import { useLuggageEvents, useWorkflowList } from '../hooks/useWorkflow'
import { statusColor, statusLabel } from '../utils/labels'
import { customerDisplayName, formatDateTime } from '../utils/person'

const { RangePicker } = DatePicker

export default function WorkflowPage() {
  const { message } = App.useApp()
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<LuggageStatus | undefined>()
  const [range, setRange] = useState<[Dayjs, Dayjs] | null>(null)
  const [selectedId, setSelectedId] = useState<string | undefined>()

  const filter = useMemo(
    () => ({
      q: q.trim() || undefined,
      status,
      from: range?.[0]?.startOf('day').toISOString(),
      to: range?.[1]?.endOf('day').toISOString(),
    }),
    [q, range, status],
  )

  const { data, isLoading, isFetching, error } = useWorkflowList(filter)
  const events = useLuggageEvents(selectedId)
  const selected = data?.find((row) => row.id === selectedId)

  const columns: ColumnsType<Luggage> = [
    {
      title: 'Tag',
      dataIndex: 'tag_number',
      render: (value: string, row) => <Link to={`/luggage/${row.id}`}>{value}</Link>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (value: LuggageStatus) => (
        <Tag color={statusColor[value]}>{statusLabel[value]}</Tag>
      ),
    },
    {
      title: 'Mijoz',
      key: 'customer',
      render: (_, row) => customerDisplayName(row),
    },
    {
      title: 'Yaratilgan',
      dataIndex: 'created_at',
      render: (value: string) => formatDateTime(value),
    },
    {
      title: 'Yangilangan',
      dataIndex: 'updated_at',
      render: (value: string) => formatDateTime(value),
    },
  ]

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <Typography.Title level={3} style={{ margin: 0 }}>
        Ish jarayoni
      </Typography.Title>

      <Space wrap>
        <Input.Search
          allowClear
          placeholder="Tag / telefon / username"
          style={{ width: 280 }}
          onSearch={setQ}
          onChange={(e) => {
            if (!e.target.value) setQ('')
          }}
        />
        <Select
          allowClear
          placeholder="Status"
          style={{ width: 220 }}
          value={status}
          onChange={setStatus}
          options={workflowStatuses.map((item) => ({
            value: item,
            label: statusLabel[item],
          }))}
        />
        <RangePicker
          onChange={(values) => {
            if (!values || !values[0] || !values[1]) {
              setRange(null)
              return
            }
            setRange([values[0], values[1]])
          }}
        />
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
        pagination={{ pageSize: 20 }}
        onRow={(row) => ({
          onClick: () => setSelectedId(row.id),
          style: { cursor: 'pointer' },
        })}
        locale={{ emptyText: 'Natija topilmadi' }}
      />

      <Drawer
        width={480}
        open={Boolean(selectedId)}
        onClose={() => setSelectedId(undefined)}
        title={selected ? selected.tag_number : 'Jarayon'}
        extra={
          selected ? (
            <Tag color={statusColor[selected.status]}>{statusLabel[selected.status]}</Tag>
          ) : null
        }
      >
        {selected ? (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
              <Typography.Text type="secondary">Mijoz</Typography.Text>
              <div>{customerDisplayName(selected)}</div>
            </div>
            <div>
              <Typography.Text type="secondary">Tavsif</Typography.Text>
              <div>{selected.description || '—'}</div>
            </div>
            <div>
              <Typography.Title level={5}>Timeline</Typography.Title>
              {events.error ? (
                <Typography.Text type="danger">
                  {getErrorMessage(events.error)}
                </Typography.Text>
              ) : (
                <LuggageTimeline events={events.data ?? []} loading={events.isLoading} />
              )}
            </div>
            <ButtonLink id={selected.id} onError={(text) => message.error(text)} />
          </Space>
        ) : null}
      </Drawer>
    </Space>
  )
}

function ButtonLink({ id, onError }: { id: string; onError: (text: string) => void }) {
  return (
    <Link to={`/luggage/${id}`} onClick={() => onError('')}>
      To‘liq sahifa
    </Link>
  )
}
