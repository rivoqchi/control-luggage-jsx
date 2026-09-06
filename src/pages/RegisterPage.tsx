import { App, Button, Card, Form, Typography } from 'antd'
import { Link, useNavigate } from 'react-router-dom'

import { getErrorMessage } from '../api/errors'
import { PhoneInput } from '../components/PhoneInput'
import { useRegister } from '../hooks/useAuthMutations'
import {
  isValidUzLocalPhone,
  passwordFromPhone,
  toFullPhone,
} from '../utils/phone'

type RegisterValues = {
  localPhone: string
}

export default function RegisterPage() {
  const { message } = App.useApp()
  const navigate = useNavigate()
  const register = useRegister()

  return (
    <Card title="Ro‘yxatdan o‘tish">
      <Typography.Paragraph type="secondary" style={{ marginTop: 0 }}>
        Telefon raqamingizni yozing. Oxirgi 4 ta raqam avtomatik parol bo‘ladi.
      </Typography.Paragraph>
      <Form<RegisterValues>
        layout="vertical"
        onFinish={(values) => {
          if (!isValidUzLocalPhone(values.localPhone)) {
            message.error('Telefon raqam 9 ta raqamdan iborat bo‘lishi kerak')
            return
          }
          const phone = toFullPhone(values.localPhone)
          register.mutate(
            {
              phone,
              password: passwordFromPhone(phone),
              role: 'customer',
            },
            {
              onSuccess: () => navigate('/dashboard', { replace: true }),
              onError: (err) => message.error(getErrorMessage(err)),
            },
          )
        }}
      >
        <Form.Item
          name="localPhone"
          label="Telefon raqam"
          rules={[
            { required: true, message: 'Telefon raqam kiriting' },
            {
              validator: async (_, value) => {
                if (!value || isValidUzLocalPhone(value)) return
                throw new Error('9 ta raqam kiriting')
              },
            },
          ]}
        >
          <PhoneInput />
        </Form.Item>
        <Button type="primary" htmlType="submit" block loading={register.isPending}>
          Ro‘yxatdan o‘tish
        </Button>
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <Link to="/login">Kirish</Link>
        </div>
      </Form>
    </Card>
  )
}
