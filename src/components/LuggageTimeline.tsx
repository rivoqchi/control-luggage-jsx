import { Image, Space, Tag, Timeline, Typography } from 'antd'

import type { LuggageEvent } from '../api/types'
import { eventActionLabel, statusLabel } from '../utils/labels'
import { mediaSrc } from '../utils/media'
import { actorDisplayName, formatDateTime } from '../utils/person'

type Props = {
  events: LuggageEvent[]
  loading?: boolean
}

export function LuggageTimeline({ events, loading }: Props) {
  if (loading) {
    return <Typography.Text type="secondary">Timeline yuklanmoqda…</Typography.Text>
  }
  if (!events.length) {
    return <Typography.Text type="secondary">Hali jarayon yozuvi yo‘q</Typography.Text>
  }

  return (
    <Timeline
      items={events.map((ev) => {
        const actor = actorDisplayName(ev)
        return {
          children: (
            <Space direction="vertical" size={4} style={{ width: '100%' }}>
              <Space wrap>
                <Typography.Text strong>
                  {eventActionLabel[ev.action] ?? ev.action}
                </Typography.Text>
                <Typography.Text type="secondary">
                  {formatDateTime(ev.created_at)}
                </Typography.Text>
              </Space>
              {actor ? (
                <Typography.Text type="secondary">{actor}</Typography.Text>
              ) : null}
              {(ev.from_status || ev.to_status) && (
                <Space>
                  {ev.from_status ? <Tag>{statusLabel[ev.from_status]}</Tag> : null}
                  {ev.from_status && ev.to_status ? <span>→</span> : null}
                  {ev.to_status ? <Tag color="blue">{statusLabel[ev.to_status]}</Tag> : null}
                </Space>
              )}
              {ev.note ? <Typography.Text>{ev.note}</Typography.Text> : null}
              {ev.photos && ev.photos.length > 0 ? (
                <Image.PreviewGroup>
                  <Space wrap>
                    {ev.photos.map((photo) => (
                      <Image
                        key={photo.key}
                        src={mediaSrc(photo)}
                        width={64}
                        height={64}
                        style={{ objectFit: 'cover' }}
                      />
                    ))}
                  </Space>
                </Image.PreviewGroup>
              ) : null}
              {ev.files && ev.files.length > 0 ? (
                <Space direction="vertical" size={0}>
                  {ev.files.map((file) => (
                    <Typography.Link
                      key={file.key}
                      href={mediaSrc(file) || undefined}
                      target="_blank"
                    >
                      {file.name || file.key}
                    </Typography.Link>
                  ))}
                </Space>
              ) : null}
            </Space>
          ),
        }
      })}
    />
  )
}
