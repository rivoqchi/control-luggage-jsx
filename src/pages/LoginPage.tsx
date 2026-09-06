import { App, Button, Card, Form, Input, Segmented } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getErrorMessage } from '../api/errors'
import { PhoneInput } from '../components/PhoneInput'
import { useLogin } from '../hooks/useAuthMutations'
import {
  isValidUzLocalPhone,
  passwordFromPhone,
  sanitizeLocalPhone,
  toFullPhone,
} from '../utils/phone'

type LoginMode = 'phone' | 'username'

type PhoneLoginValues = {
  localPhone: string
  password: string
}

type UsernameLoginValues = {
  username: string
  password: string
}

function homePathForRole(role?: string) {
  return role === 'customer' ? '/luggage' : '/dashboard'
}

export default function LoginPage() {
  const { message } = App.useApp()
  const navigate = useNavigate()
  const login = useLogin()
  const [mode, setMode] = useState<LoginMode>('phone')
  const [phoneForm] = Form.useForm<PhoneLoginValues>()
  const [usernameForm] = Form.useForm<UsernameLoginValues>()

  return (
    <Card title="Kirish">
      <Segmented<LoginMode>
        block
        value={mode}
        onChange={setMode}
        options={[
          { label: 'Telefon', value: 'phone' },
          { label: 'Telegram username', value: 'username' },
        ]}
        style={{ marginBottom: 16 }}
      />

      {mode === 'phone' ? (
        <Form<PhoneLoginValues>
          form={phoneForm}
          layout="vertical"
          initialValues={{ localPhone: '', password: '' }}
          onValuesChange={(changed) => {
            if ('localPhone' in changed) {
              const cleaned = sanitizeLocalPhone(changed.localPhone || '')
              phoneForm.setFieldsValue({
                password: cleaned.length >= 4 ? passwordFromPhone(cleaned) : '',
              })
            }
          }}
          onFinish={(values) => {
            if (!isValidUzLocalPhone(values.localPhone)) {
              message.error('Telefon raqam 9 ta raqamdan iborat bo‘lishi kerak')
              return
            }
            const phone = toFullPhone(values.localPhone)
            const password = values.password || passwordFromPhone(phone)
            login.mutate(
              { phone, password },
              {
                onSuccess: (payload) =>
                  navigate(homePathForRole(payload.user.role), { replace: true }),
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

          <Form.Item
            name="password"
            label="Parol"
            rules={[{ required: true, message: 'Parol kiriting' }]}
          >
            <Input.Password autoComplete="current-password" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block disabled={login.isPending}>
            Kirish
          </Button>
        </Form>
      ) : (
        <Form<UsernameLoginValues>
          form={usernameForm}
          layout="vertical"
          initialValues={{ username: '', password: '0000' }}
          onFinish={(values) => {
            const username = values.username.trim().replace(/^@+/, '')
            if (!username) {
              message.error('Telegram username kiriting')
              return
            }
            login.mutate(
              { username, password: values.password || '0000' },
              {
                onSuccess: (payload) =>
                  navigate(homePathForRole(payload.user.role), { replace: true }),
                onError: (err) => message.error(getErrorMessage(err)),
              },
            )
          }}
        >
          <Form.Item
            name="username"
            label="Telegram username"
            rules={[{ required: true, message: 'Username kiriting' }]}
            getValueFromEvent={(e) => String(e?.target?.value ?? '').replace(/^@+/, '')}
          >
            <Input prefix="@" placeholder="username" autoComplete="username" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Parol"
            extra="Telefon bo‘lmasa default: 0000"
            rules={[{ required: true, message: 'Parol kiriting' }]}
          >
            <Input.Password autoComplete="current-password" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block disabled={login.isPending}>
            Kirish
          </Button>
        </Form>
      )}
    </Card>
  )
}
