export const roles = ['admin', 'staff', 'customer'] as const
export type Role = (typeof roles)[number]

export const staffDuties = ['warehouse', 'seller', 'driver', 'boss'] as const
export type StaffDuty = (typeof staffDuties)[number]

export const luggageStatuses = [
  'received',
  'stored',
  'ready',
  'delivered',
  'sent_to_warehouse',
  'warehouse_accepted',
  'handed_to_driver',
  'with_driver',
  'cancelled',
] as const
export type LuggageStatus = (typeof luggageStatuses)[number]

/** Active workflow statuses shown in UI filters (legacy kept in type). */
export const workflowStatuses = [
  'sent_to_warehouse',
  'warehouse_accepted',
  'handed_to_driver',
  'with_driver',
  'delivered',
  'cancelled',
] as const

export const sources = ['web', 'telegram', 'staff'] as const
export type Source = (typeof sources)[number]

export type TokenPair = {
  access_token: string
  refresh_token: string
  expires_in: number
}

export type User = {
  id: string
  email: string
  phone?: string
  first_name?: string
  last_name?: string
  username?: string
  role: Role
  duty?: StaffDuty
  blocked: boolean
  telegram_id?: number
  last_login_at?: string
  created_at: string
  updated_at: string
}

export type SessionUser = {
  id: string
  email: string
  phone?: string
  first_name?: string
  last_name?: string
  username?: string
  role: Role
  duty?: StaffDuty
}

export type AuthPayload = {
  user: User
  tokens: TokenPair
}

export type MePayload = {
  user_id: string
  email: string
  phone?: string
  first_name?: string
  last_name?: string
  username?: string
  role: Role
  duty?: StaffDuty
}

export type Photo = {
  key: string
  url: string
  telegram_file_id?: string
  uploaded: string
}

export type FileAttachment = {
  key: string
  url?: string
  name?: string
  telegram_file_id?: string
  uploaded: string
}

export type Luggage = {
  id: string
  tag_number: string
  owner_id?: string
  staff_id?: string
  warehouse_staff_id?: string
  driver_id?: string
  status: LuggageStatus
  description?: string
  customer_phone?: string
  customer_username?: string
  customer_first_name?: string
  customer_last_name?: string
  photos?: Photo[]
  files?: FileAttachment[]
  location?: string
  source: Source
  warehouse_accepted_at?: string
  completed_at?: string
  created_at: string
  updated_at: string
}

export type LuggageEvent = {
  id: string
  luggage_id: string
  actor_id?: string
  actor_first_name?: string
  actor_last_name?: string
  actor_username?: string
  actor_phone?: string
  action: string
  from_status?: LuggageStatus
  to_status?: LuggageStatus
  note?: string
  photos?: Photo[]
  files?: FileAttachment[]
  created_at: string
}

export type CreateLuggageInput = {
  tag_number: string
  owner_id?: string
  description?: string
  location?: string
  source: Source
  photos?: Photo[]
}

export type PresignResult = {
  upload_url: string
  key: string
  public_url: string
  expires_in: number
}

export type LuggageStatusEvent = {
  type: 'luggage.status'
  data: Luggage
}

export type ApiBody<T> = {
  data?: T
  error?: string
}

export type WorkflowFilter = {
  q?: string
  customer?: string
  phone?: string
  status?: LuggageStatus
  from?: string
  to?: string
}
