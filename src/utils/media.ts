import type { FileAttachment, Photo } from '../api/types'

/** Prefer API-enriched signed/public URL; fall back to key only if it already looks like a URL. */
export function mediaSrc(item: Pick<Photo, 'url' | 'key'> | Pick<FileAttachment, 'url' | 'key'> | undefined): string {
  if (!item) return ''
  const url = (item.url ?? '').trim()
  if (url) return url
  const key = (item.key ?? '').trim()
  if (key.startsWith('http://') || key.startsWith('https://')) return key
  return ''
}
