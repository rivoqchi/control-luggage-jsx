import {
  App,
  Button,
  Card,
  Empty,
  Image,
  Space,
  Tag,
  Typography,
} from 'antd'
import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { getErrorMessage } from '../api/errors'
import type { Luggage, Photo } from '../api/types'
import {
  useWarehouseAccept,
  useWarehouseCancel,
  useWarehouseDeliverCustomer,
  useWarehouseHandToDriver,
  useWarehouseMedia,
  useWarehouseMine,
  useWarehouseQueue,
  useWarehouseToday,
} from '../hooks/useWarehouse'
import { ImageUploader } from '../upload/ImageUploader'
import { statusColor, statusLabel } from '../utils/labels'
import { mediaSrc } from '../utils/media'

function LuggageCard({
  item,
  actions,
  media,
}: {
  item: Luggage
  actions?: ReactNode
  media?: ReactNode
}) {
  return (
    <Card
      size="small"
      title={
        <Space>
          <Link to={`/luggage/${item.id}`}>{item.tag_number}</Link>
          <Tag color={statusColor[item.status]}>{statusLabel[item.status]}</Tag>
        </Space>
      }
      extra={new Date(item.updated_at).toLocaleString()}
    >
      <Typography.Paragraph type="secondary" style={{ marginBottom: 8 }}>
        {item.customer_phone || item.customer_username || 'Mijoz ko‘rsatilmagan'}
        {item.description ? ` · ${item.description}` : ''}
      </Typography.Paragraph>
      {item.photos && item.photos.length > 0 ? (
        <Image.PreviewGroup>
          <Space wrap style={{ marginBottom: 12 }}>
            {item.photos.slice(0, 4).map((photo) => (
              <Image key={photo.key} src={mediaSrc(photo)} width={56} height={56} style={{ objectFit: 'cover' }} />
            ))}
          </Space>
        </Image.PreviewGroup>
      ) : null}
      {media}
      {actions}
    </Card>
  )
}

function MediaBlock({
  onUpload,
  pending,
}: {
  onUpload: (photos: Photo[]) => void
  pending: boolean
}) {
  const [photos, setPhotos] = useState<Photo[]>([])
  return (
    <Space direction="vertical" style={{ width: '100%', marginBottom: 12 }}>
      <ImageUploader value={photos} onChange={setPhotos} maxCount={8} />
      <Button
        type="dashed"
        disabled={!photos.length || pending}
        loading={pending}
        onClick={() => {
          onUpload(photos)
          setPhotos([])
        }}
      >
        Rasmlarni saqlash
      </Button>
    </Space>
  )
}

function exportCsv(items: Luggage[]) {
  const header = ['tag_number', 'status', 'customer_phone', 'customer_username', 'updated_at']
  const rows = items.map((item) =>
    [
      item.tag_number,
      item.status,
      item.customer_phone ?? '',
      item.customer_username ?? '',
      item.updated_at,
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(','),
  )
  const blob = new Blob([[header.join(','), ...rows].join('\n')], {
    type: 'text/csv;charset=utf-8;',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `warehouse-today-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export function WarehouseQueuePage() {
  const { message } = App.useApp()
  const { data, isLoading, error } = useWarehouseQueue()
  const accept = useWarehouseAccept()

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <Typography.Title level={3} style={{ margin: 0 }}>
        Ombor navbati
      </Typography.Title>
      {error ? <Typography.Text type="danger">{getErrorMessage(error)}</Typography.Text> : null}
      {isLoading ? <Typography.Text>Yuklanmoqda…</Typography.Text> : null}
      {!isLoading && !data?.length ? <Empty description="Navbat bo‘sh" /> : null}
      {data?.map((item) => (
        <LuggageCard
          key={item.id}
          item={item}
          actions={
            <Button
              type="primary"
              loading={accept.isPending}
              onClick={() =>
                accept.mutate(item.id, {
                  onSuccess: () => message.success('Qabul qilindi'),
                  onError: (err) => message.error(getErrorMessage(err)),
                })
              }
            >
              Qabul qilaman
            </Button>
          }
        />
      ))}
    </Space>
  )
}

export function WarehouseMinePage() {
  const { message, modal } = App.useApp()
  const { data, isLoading, error } = useWarehouseMine()
  const deliver = useWarehouseDeliverCustomer()
  const hand = useWarehouseHandToDriver()
  const cancel = useWarehouseCancel()
  const media = useWarehouseMedia()

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <Typography.Title level={3} style={{ margin: 0 }}>
        Joriy buyurtmalar
      </Typography.Title>
      {error ? <Typography.Text type="danger">{getErrorMessage(error)}</Typography.Text> : null}
      {isLoading ? <Typography.Text>Yuklanmoqda…</Typography.Text> : null}
      {!isLoading && !data?.length ? <Empty description="Joriy buyurtma yo‘q" /> : null}
      {data?.map((item) => (
        <LuggageCard
          key={item.id}
          item={item}
          media={
            <MediaBlock
              pending={media.isPending}
              onUpload={(photos) =>
                media.mutate(
                  { id: item.id, photos },
                  {
                    onSuccess: () => message.success('Rasmlar saqlandi'),
                    onError: (err) => message.error(getErrorMessage(err)),
                  },
                )
              }
            />
          }
          actions={
            <Space wrap>
              <Button
                type="primary"
                loading={deliver.isPending}
                onClick={() =>
                  deliver.mutate(item.id, {
                    onSuccess: () => message.success('Mijozga berildi'),
                    onError: (err) => message.error(getErrorMessage(err)),
                  })
                }
              >
                Mijozni o‘ziga
              </Button>
              <Button
                loading={hand.isPending}
                onClick={() =>
                  hand.mutate(item.id, {
                    onSuccess: () => message.success('Haydovchiga yuborildi'),
                    onError: (err) => message.error(getErrorMessage(err)),
                  })
                }
              >
                Haydovchi
              </Button>
              <Button
                danger
                loading={cancel.isPending}
                onClick={() => {
                  modal.confirm({
                    title: 'Buyurtmani bekor qilasizmi?',
                    onOk: () =>
                      cancel.mutateAsync(
                        { id: item.id, note: 'Omborchi bekor qildi' },
                        {
                          onSuccess: () => message.success('Bekor qilindi'),
                          onError: (err) => message.error(getErrorMessage(err)),
                        },
                      ),
                  })
                }}
              >
                O‘chirish
              </Button>
            </Space>
          }
        />
      ))}
    </Space>
  )
}

export function WarehouseTodayPage() {
  const { data, isLoading, error } = useWarehouseToday()
  const [selected, setSelected] = useState<string[]>([])

  const rows = data ?? []

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          Bugungi buyurtmalar
        </Typography.Title>
        <Button
          type="primary"
          disabled={!selected.length && !rows.length}
          onClick={() => {
            const items = selected.length
              ? rows.filter((row) => selected.includes(row.id))
              : rows
            exportCsv(items)
          }}
        >
          CSV yuklab olish
        </Button>
      </Space>
      {error ? <Typography.Text type="danger">{getErrorMessage(error)}</Typography.Text> : null}
      {isLoading ? <Typography.Text>Yuklanmoqda…</Typography.Text> : null}
      {!isLoading && !rows.length ? <Empty description="Bugun yakunlangan ish yo‘q" /> : null}
      {rows.map((item) => {
        const checked = selected.includes(item.id)
        return (
          <Card
            key={item.id}
            size="small"
            onClick={() =>
              setSelected((prev) =>
                checked ? prev.filter((id) => id !== item.id) : [...prev, item.id],
              )
            }
            style={{
              cursor: 'pointer',
              borderColor: checked ? '#1677ff' : undefined,
              background: checked ? '#f0f5ff' : undefined,
            }}
            title={
              <Space>
                <Link to={`/luggage/${item.id}`}>{item.tag_number}</Link>
                <Tag color={statusColor[item.status]}>{statusLabel[item.status]}</Tag>
              </Space>
            }
            extra={checked ? 'Tanlangan' : 'Tanlash'}
          >
            <Typography.Text type="secondary">
              {item.customer_phone || item.customer_username || '—'} ·{' '}
              {new Date(item.updated_at).toLocaleString()}
            </Typography.Text>
          </Card>
        )
      })}
    </Space>
  )
}

export default function WarehousePage() {
  return <WarehouseQueuePage />
}
