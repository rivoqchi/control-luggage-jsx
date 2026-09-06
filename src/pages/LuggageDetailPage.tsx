import { Alert, App, Card, Descriptions, Image, Select, Space, Tag, Typography } from 'antd'
import { useParams } from 'react-router-dom'

import { getErrorMessage } from '../api/errors'
import { workflowStatuses, type LuggageStatus } from '../api/types'
import { useAuth } from '../auth/AuthProvider'
import { LuggageTimeline } from '../components/LuggageTimeline'
import { useLuggageDetail } from '../hooks/useLuggageDetail'
import { useUpdateStatus } from '../hooks/useUpdateStatus'
import { useLuggageEvents } from '../hooks/useWorkflow'
import { statusColor, statusLabel } from '../utils/labels'
import { mediaSrc } from '../utils/media'
import { customerDisplayName, formatDateTime } from '../utils/person'

export default function LuggageDetailPage() {
  const { id } = useParams()
  const { message } = App.useApp()
  const { user } = useAuth()
  const { data, isLoading, error } = useLuggageDetail(id)
  const events = useLuggageEvents(id)
  const updateStatus = useUpdateStatus()
  const canUpdate = user?.role === 'staff' || user?.role === 'admin'

  if (isLoading) {
    return null
  }

  if (error) {
    return <Alert type="error" message={getErrorMessage(error)} showIcon />
  }

  if (!data) {
    return <Alert type="warning" message="Yuk topilmadi" showIcon />
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Typography.Title level={4} style={{ margin: 0 }}>
        {data.tag_number}
      </Typography.Title>

      <Descriptions bordered column={1} size="small">
        <Descriptions.Item label="Status">
          <Space>
            <Tag color={statusColor[data.status]}>{statusLabel[data.status]}</Tag>
            {canUpdate && (
              <Select<LuggageStatus>
                value={data.status}
                style={{ width: 220 }}
                loading={updateStatus.isPending}
                options={workflowStatuses.map((item) => ({
                  value: item,
                  label: statusLabel[item],
                }))}
                onChange={(status) => {
                  updateStatus.mutate(
                    { id: data.id, status },
                    {
                      onSuccess: () => message.success('Status yangilandi'),
                      onError: (err) => message.error(getErrorMessage(err)),
                    },
                  )
                }}
              />
            )}
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="Mijoz">
          {customerDisplayName(data)}
        </Descriptions.Item>
        <Descriptions.Item label="Joy">{data.location || '—'}</Descriptions.Item>
        <Descriptions.Item label="Tavsif">{data.description || '—'}</Descriptions.Item>
        <Descriptions.Item label="Manba">{data.source}</Descriptions.Item>
        <Descriptions.Item label="Yaratilgan">
          {formatDateTime(data.created_at)}
        </Descriptions.Item>
      </Descriptions>

      {data.photos && data.photos.length > 0 && (
        <Image.PreviewGroup>
          <Space wrap>
            {data.photos.map((photo) => (
              <Image key={photo.key} src={mediaSrc(photo)} width={120} />
            ))}
          </Space>
        </Image.PreviewGroup>
      )}

      {data.files && data.files.length > 0 && (
        <Card title="Fayllar / video" size="small">
          <Space direction="vertical" size={4}>
            {data.files.map((file) => {
              const href = mediaSrc(file)
              return (
                <Typography.Link key={file.key} href={href || undefined} target="_blank" disabled={!href}>
                  {file.name || file.key}
                </Typography.Link>
              )
            })}
          </Space>
        </Card>
      )}

      <Card title="Ish jarayoni (timeline)" size="small">
        <LuggageTimeline events={events.data ?? []} loading={events.isLoading} />
      </Card>
    </Space>
  )
}
