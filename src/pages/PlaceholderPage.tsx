import { Card, Typography } from 'antd'

type Props = {
  title: string
  description?: string
}

export function PlaceholderPage({ title, description }: Props) {
  return (
    <Card style={{ width: '100%', minHeight: '100%' }}>
      <Typography.Title level={3} style={{ marginTop: 0 }}>
        {title}
      </Typography.Title>
      <Typography.Paragraph type="secondary">
        {description ?? 'Bu bo‘lim tez orada to‘ldiriladi.'}
      </Typography.Paragraph>
    </Card>
  )
}
