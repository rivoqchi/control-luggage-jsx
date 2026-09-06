import { App, Button, Card, Empty, Image, Space, Tag, Typography } from 'antd'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { getErrorMessage } from '../api/errors'
import type { Photo } from '../api/types'
import {
  useDriverAccept,
  useDriverDeliver,
  useDriverMedia,
  useDriverMine,
  useDriverQueue,
} from '../hooks/useDriver'
import { ImageUploader } from '../upload/ImageUploader'
import { statusColor, statusLabel } from '../utils/labels'
import { mediaSrc } from '../utils/media'

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

export function DriverQueuePage() {
  const { message } = App.useApp()
  const { data, isLoading, error } = useDriverQueue()
  const accept = useDriverAccept()

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <Typography.Title level={3} style={{ margin: 0 }}>
        Haydovchi navbati
      </Typography.Title>
      {error ? <Typography.Text type="danger">{getErrorMessage(error)}</Typography.Text> : null}
      {isLoading ? <Typography.Text>Yuklanmoqda…</Typography.Text> : null}
      {!isLoading && !data?.length ? <Empty description="Navbat bo‘sh" /> : null}
      {data?.map((item) => (
        <Card
          key={item.id}
          size="small"
          title={
            <Space>
              <Link to={`/luggage/${item.id}`}>{item.tag_number}</Link>
              <Tag color={statusColor[item.status]}>{statusLabel[item.status]}</Tag>
            </Space>
          }
        >
          <Typography.Paragraph type="secondary">
            {item.customer_phone || item.customer_username || '—'}
          </Typography.Paragraph>
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
        </Card>
      ))}
    </Space>
  )
}

export function DriverMinePage() {
  const { message } = App.useApp()
  const { data, isLoading, error } = useDriverMine()
  const deliver = useDriverDeliver()
  const media = useDriverMedia()

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <Typography.Title level={3} style={{ margin: 0 }}>
        Mening yetkazmalarim
      </Typography.Title>
      {error ? <Typography.Text type="danger">{getErrorMessage(error)}</Typography.Text> : null}
      {isLoading ? <Typography.Text>Yuklanmoqda…</Typography.Text> : null}
      {!isLoading && !data?.length ? <Empty description="Faol yetkazma yo‘q" /> : null}
      {data?.map((item) => (
        <Card
          key={item.id}
          size="small"
          title={
            <Space>
              <Link to={`/luggage/${item.id}`}>{item.tag_number}</Link>
              <Tag color={statusColor[item.status]}>{statusLabel[item.status]}</Tag>
            </Space>
          }
        >
          {item.photos && item.photos.length > 0 ? (
            <Image.PreviewGroup>
              <Space wrap style={{ marginBottom: 12 }}>
                {item.photos.slice(0, 4).map((photo) => (
                  <Image
                    key={photo.key}
                    src={mediaSrc(photo)}
                    width={56}
                    height={56}
                    style={{ objectFit: 'cover' }}
                  />
                ))}
              </Space>
            </Image.PreviewGroup>
          ) : null}
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
          <Button
            type="primary"
            loading={deliver.isPending}
            onClick={() =>
              deliver.mutate(item.id, {
                onSuccess: () => message.success('Mijozga topshirildi'),
                onError: (err) => message.error(getErrorMessage(err)),
              })
            }
          >
            Topshirdim
          </Button>
        </Card>
      ))}
    </Space>
  )
}

export default function DriverPage() {
  return <DriverQueuePage />
}
