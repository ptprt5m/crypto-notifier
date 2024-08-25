import TelegramBot from 'node-telegram-bot-api'
import { telegramToken, chatId } from './config.js'

export const bot = new TelegramBot(telegramToken, { polling: false })

export function sendTelegramMessage(message: string) {
    bot.sendMessage(chatId, message)
}
