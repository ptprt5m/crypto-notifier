import 'dotenv/config'

export const telegramToken = process.env.TELEGRAM_TOKEN as string
export const chatId = process.env.CHAT_ID as string
export const tonAmount = parseFloat(process.env.TON_AMOUNT || '0')
export const notAmount = parseFloat(process.env.NOT_AMOUNT || '0')
