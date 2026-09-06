import { env } from '../config/env'
import type { LuggageStatusEvent } from '../api/types'

type Listener = (event: LuggageStatusEvent) => void

class LuggageSocket {
  private socket: WebSocket | null = null
  private listener: Listener | null = null
  private token: string | null = null
  private retries = 0
  private timer: number | null = null
  private closedByUs = false

  connect(token: string, listener: Listener): () => void {
    this.disconnect()
    this.token = token
    this.listener = listener
    this.closedByUs = false
    this.retries = 0
    this.open()
    return () => {
      this.closedByUs = true
      this.listener = null
      this.disconnect()
    }
  }

  private open() {
    if (!this.token) {
      return
    }
    const url = `${env.wsUrl}?token=${encodeURIComponent(this.token)}`
    const socket = new WebSocket(url)
    this.socket = socket

    socket.onopen = () => {
      this.retries = 0
    }

    socket.onmessage = (event) => {
      try {
        const parsed = JSON.parse(String(event.data)) as LuggageStatusEvent
        if (parsed?.type === 'luggage.status' && parsed.data) {
          this.listener?.(parsed)
        }
      } catch {
        // ignore malformed frames
      }
    }

    socket.onclose = () => {
      if (this.closedByUs) {
        return
      }
      const delay = Math.min(1000 * 2 ** this.retries, 15_000)
      this.retries += 1
      this.timer = window.setTimeout(() => this.open(), delay)
    }
  }

  disconnect() {
    if (this.timer != null) {
      window.clearTimeout(this.timer)
      this.timer = null
    }
    const socket = this.socket
    this.socket = null
    socket?.close()
  }
}

export const luggageSocket = new LuggageSocket()
