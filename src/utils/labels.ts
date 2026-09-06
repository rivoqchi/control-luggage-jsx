import type { LuggageStatus, Role, StaffDuty } from '../api/types'

export const statusLabel: Record<LuggageStatus, string> = {
  received: 'Qabul qilindi',
  stored: 'Saqlanmoqda',
  ready: 'Tayyor',
  delivered: 'Topshirildi',
  sent_to_warehouse: 'Omborga yuborilgan',
  warehouse_accepted: 'Omborda qabul qilindi',
  handed_to_driver: 'Haydovchiga berildi',
  with_driver: 'Haydovchida',
  cancelled: 'Bekor qilindi',
}

export const statusColor: Record<LuggageStatus, string> = {
  received: 'blue',
  stored: 'gold',
  ready: 'green',
  delivered: 'default',
  sent_to_warehouse: 'purple',
  warehouse_accepted: 'cyan',
  handed_to_driver: 'orange',
  with_driver: 'geekblue',
  cancelled: 'red',
}

export const roleLabel: Record<Role, string> = {
  admin: 'Admin',
  staff: 'Xodim',
  customer: 'Mijoz',
}

export const dutyLabel: Record<StaffDuty, string> = {
  warehouse: 'Omborchi',
  seller: 'Sotuvchi',
  driver: 'Haydovchi',
  boss: 'Boshliq',
}

export const eventActionLabel: Record<string, string> = {
  created: 'Yaratildi',
  warehouse_accepted: 'Omborchi qabul qildi',
  media_added: 'Media qo‘shildi',
  handed_to_driver: 'Haydovchiga yuborildi',
  driver_accepted: 'Haydovchi qabul qildi',
  delivered: 'Topshirildi',
  cancelled: 'Bekor qilindi',
  edited: 'Tahrirlandi',
  status_changed: 'Status o‘zgardi',
  deleted: 'O‘chirildi',
}
