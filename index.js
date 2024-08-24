require('dotenv').config();

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: false });
