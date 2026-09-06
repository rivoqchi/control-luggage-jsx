import { InboxOutlined } from '@ant-design/icons'
import { App, Upload } from 'antd'
import type { UploadFile, UploadProps } from 'antd'
import { useMemo, useState } from 'react'

import { getErrorMessage } from '../api/errors'
import type { Photo } from '../api/types'
import { uploadApi } from '../api/upload'

const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])

type Props = {
  value?: Photo[]
  onChange?: (photos: Photo[]) => void
  maxCount?: number
}

export function ImageUploader({ value = [], onChange, maxCount = 6 }: Props) {
  const { message } = App.useApp()
  const [uploading, setUploading] = useState<UploadFile[]>([])

  const fileList: UploadFile[] = useMemo(
    () => [
      ...value.map((photo) => ({
        uid: photo.key,
        name: photo.key,
        status: 'done' as const,
        url: photo.url,
      })),
      ...uploading,
    ],
    [uploading, value],
  )

  const customRequest: UploadProps['customRequest'] = async (options) => {
    const { file, onSuccess, onError, onProgress } = options
    const raw = file as File
    const uid = `${raw.name}-${raw.size}-${Date.now()}`

    setUploading((current) => [
      ...current,
      { uid, name: raw.name, status: 'uploading', percent: 0 },
    ])

    try {
      const photo = await uploadApi.uploadImage(raw, (percent) => {
        onProgress?.({ percent })
        setUploading((current) =>
          current.map((item) => (item.uid === uid ? { ...item, percent } : item)),
        )
      })
      setUploading((current) => current.filter((item) => item.uid !== uid))
      onChange?.([...value, photo])
      onSuccess?.(photo)
    } catch (err) {
      setUploading((current) => current.filter((item) => item.uid !== uid))
      const text = getErrorMessage(err)
      message.error(text)
      onError?.(err as Error)
    }
  }

  return (
    <Upload.Dragger
      multiple
      maxCount={maxCount}
      listType="picture"
      accept="image/jpeg,image/png,image/webp"
      fileList={fileList}
      customRequest={customRequest}
      beforeUpload={(file) => {
        if (!allowedTypes.has(file.type)) {
          message.error('Faqat JPEG, PNG yoki WEBP')
          return Upload.LIST_IGNORE
        }
        return true
      }}
      onRemove={(file) => {
        setUploading((current) => current.filter((item) => item.uid !== file.uid))
        onChange?.(value.filter((photo) => photo.key !== file.uid))
      }}
    >
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">Rasmni shu yerga tashlang yoki bosing</p>
      <p className="ant-upload-hint">JPEG, PNG, WEBP. Avval preview, keyin R2 ga yuklanadi.</p>
    </Upload.Dragger>
  )
}
