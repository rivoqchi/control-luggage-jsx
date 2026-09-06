export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

const errorMessages: Record<string, string> = {
  not_registered:
    "Siz do‘kon mijoz yoki xodimi bo‘lishingiz kerak. Avval Telegram bot orqali /start qilib ro‘yxatdan o‘ting.",
  blocked: "Sizning akkauntingiz bloklangan.",
  'invalid credentials': 'Telefon yoki parol noto‘g‘ri.',
  'invalid input': 'Ma’lumotlar noto‘g‘ri kiritildi.',
  unauthorized: 'Avtorizatsiya talab qilinadi.',
  forbidden: 'Ruxsat yo‘q.',
  conflict: 'Bu ma’lumot allaqachon mavjud.',
  'not found': 'Topilmadi.',
}

export function getErrorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    return errorMessages[err.message] ?? err.message
  }
  if (err instanceof Error) {
    return errorMessages[err.message] ?? err.message
  }
  return 'Xatolik yuz berdi'
}
