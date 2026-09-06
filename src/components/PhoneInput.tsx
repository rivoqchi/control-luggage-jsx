import { Input, Space } from 'antd'
import type { ChangeEvent } from 'react'

import { sanitizeLocalPhone, UZ_PHONE_PREFIX } from '../utils/phone'

type Props = {
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
  id?: string
}

/** +998 qismi fixed; foydalanuvchi faqat 9 raqam yozadi */
export function PhoneInput({ value = '', onChange, disabled, id }: Props) {
  return (
    <Space.Compact style={{ width: '100%' }}>
      <Input
        disabled
        value={UZ_PHONE_PREFIX}
        style={{ width: 72, textAlign: 'center', flex: 'none' }}
      />
      <Input
        id={id}
        disabled={disabled}
        inputMode="numeric"
        maxLength={9}
        placeholder="901234567"
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          onChange?.(sanitizeLocalPhone(e.target.value))
        }}
        autoComplete="tel-national"
        style={{ flex: 1 }}
      />
    </Space.Compact>
  )
}
