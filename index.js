const config = require('./config.js');
const bot = new TelegramBot(config.telegramToken, { polling: false });
