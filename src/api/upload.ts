import axios from 'axios'

import { client } from './client'
import type { Photo, PresignResult } from './types'

export const uploadApi = {
  presign(input: { filename: string; content_type: string }) {
    return client.post<PresignResult>('/upload/presign', input).then((res) => res.data)
  },
  async putToR2(uploadUrl: string, file: File, onProgress?: (percent: number) => void) {
    await axios.put(uploadUrl, file, {
      headers: { 'Content-Type': file.type },
      onUploadProgress: (event) => {
        if (!onProgress || !event.total) {
          return
        }
        onProgress(Math.round((event.loaded / event.total) * 100))
      },
    })
  },
  async uploadImage(file: File, onProgress?: (percent: number) => void): Promise<Photo> {
    const presign = await uploadApi.presign({
      filename: file.name,
      content_type: file.type,
    })
    await uploadApi.putToR2(presign.upload_url, file, onProgress)
    return {
      key: presign.key,
      url: presign.public_url,
      uploaded: new Date().toISOString(),
    }
  },
}
