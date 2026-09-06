import { App, Button, Card, Form, Input } from 'antd'
import { useNavigate } from 'react-router-dom'

import { getErrorMessage } from '../api/errors'
import type { Photo } from '../api/types'
import { useCreateLuggage } from '../hooks/useCreateLuggage'
import { ImageUploader } from '../upload/ImageUploader'

type FormValues = {
  tag_number: string
  description?: string
  location?: string
  photos?: Photo[]
}

export default function LuggageCreatePage() {
  const { message } = App.useApp()
  const navigate = useNavigate()
  const create = useCreateLuggage()

  return (
    <Card title="Yangi yuk">
      <Form<FormValues>
        layout="vertical"
        onFinish={(values) => {
          create.mutate(
            {
              tag_number: values.tag_number,
              description: values.description,
              location: values.location,
              source: 'web',
              photos: values.photos ?? [],
            },
            {
              onSuccess: (item) => {
                message.success('Yuk yaratildi')
                navigate(`/luggage/${item.id}`)
              },
              onError: (err) => message.error(getErrorMessage(err)),
            },
          )
        }}
      >
        <Form.Item name="tag_number" label="Tag raqami" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="location" label="Joy">
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Tavsif">
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item name="photos" label="Rasmlar">
          <ImageUploader />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={create.isPending}>
          Saqlash
        </Button>
      </Form>
    </Card>
  )
}
