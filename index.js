require('dotenv').config()
const schedule = require('node-schedule')
const TelegramBot = require('node-telegram-bot-api')
const fs = require('fs')

const telegramToken = process.env.TELEGRAM_TOKEN
const chatId = process.env.CHAT_ID
const tonAmount = parseFloat(process.env.TON_AMOUNT) || 0
const notAmount = parseFloat(process.env.NOT_AMOUNT) || 0

const bot = new TelegramBot(telegramToken, { polling: false })

async function getPrices() {
    const fetch = (await import('node-fetch')).default
    const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=the-open-network,notcoin&vs_currencies=rub',
    )
    const data = await response.json()
    const tonPrice = data['the-open-network']?.rub || null
    const notPrice = data.notcoin?.rub || null
    return { tonPrice, notPrice }
}

function savePreviousPrices(prices) {
    fs.writeFileSync('prices.json', JSON.stringify(prices))
}

function getPreviousPrices() {
    if (fs.existsSync('prices.json')) {
        const data = fs.readFileSync('prices.json')
        return JSON.parse(data)
    }
    return null
}

function calculatePercentage(current, previous) {
    if (previous === 0) return '0.00'
    return (((current - previous) / previous) * 100).toFixed(2)
}

function sendTelegramMessage(message) {
    bot.sendMessage(chatId, message)
}

function formatNumber(value) {
    const number = parseFloat(value)
    if (isNaN(number)) return 'N/A'
    return number.toLocaleString('ru-RU', { minimumFractionDigits: 0 })
}

async function checkPrices() {
    const { tonPrice, notPrice } = await getPrices()
    const previousPrices = getPreviousPrices() || { tonPrice, notPrice }

    const tonChange = calculatePercentage(tonPrice, previousPrices.tonPrice)
    const notChange = calculatePercentage(notPrice, previousPrices.notPrice)

    const totalValue = (tonPrice * tonAmount + notPrice * notAmount).toFixed(2)
    const previousTotalValue = (
        (previousPrices.tonPrice || 0) * tonAmount +
        (previousPrices.notcoin || 0) * notAmount
    ).toFixed(2)
    const totalChange = calculatePercentage(totalValue, previousTotalValue)

    const message = `
TON: ${tonPrice.toFixed(2)} RUB (${tonChange}%)
NOT: ${notPrice.toFixed(2)} RUB (${notChange}%)

💰 Total money: ${formatNumber(totalValue)} RUB (${totalChange}%)
        `

    sendTelegramMessage(message)

    savePreviousPrices({ tonPrice, notPrice })
}

async function emergencyCheck() {
    const { tonPrice, notPrice } = await getPrices()
    const previousPrices = getPreviousPrices()

    if (!previousPrices) return

    const tonChange = calculatePercentage(tonPrice, previousPrices.tonPrice)
    const notChange = calculatePercentage(notPrice, previousPrices.notPrice)

    const totalValue = (tonPrice * tonAmount + notPrice * notAmount).toFixed(2)
    const previousTotalValue = (
        (previousPrices.tonPrice || 0) * tonAmount +
        (previousPrices.notcoin || 0) * notAmount
    ).toFixed(2)
    const totalChange = calculatePercentage(totalValue, previousTotalValue)

    if (Math.abs(tonChange) >= 30 || Math.abs(notChange) >= 30) {
        const emergencyMessage = `
❗️Emergency Alert:
TON: ${tonPrice.toFixed(2)} RUB (${tonChange}%)
NOT: ${notPrice.toFixed(2)} RUB (${notChange}%)

💰 Total money: ${formatNumber(totalValue)} RUB (${totalChange}%)
        `
        sendTelegramMessage(emergencyMessage)
    }
}

async function sendTestMessage() {
    try {
        const { tonPrice, notPrice } = await getPrices()
        if (tonPrice === null || notPrice === null) {
            console.error('Failed to get prices. Skipping test message.')
            return
        }
        const previousPrices = getPreviousPrices() || { tonPrice, notPrice }

        const tonChange = calculatePercentage(tonPrice, previousPrices.tonPrice)
        const notChange = calculatePercentage(notPrice, previousPrices.notPrice)

        const totalValue = (
            tonPrice * tonAmount +
            notPrice * notAmount
        ).toFixed(2)
        const previousTotalValue = (
            (previousPrices.tonPrice || 0) * tonAmount +
            (previousPrices.notcoin || 0) * notAmount
        ).toFixed(2)
        const totalChange = calculatePercentage(totalValue, previousTotalValue)

        await bot.sendMessage(
            chatId,
            `
Test message:
TON: ${tonPrice.toFixed(2)} RUB (${tonChange}%)
NOT: ${notPrice.toFixed(2)} RUB (${notChange}%)

💰 Total money: ${formatNumber(totalValue)} RUB (${totalChange}%)
            `,
        )
        console.log('Тестовое сообщение отправлено.')
    } catch (error) {
        console.error('Ошибка при отправке тестового сообщения:', error)
    }
}

schedule.scheduleJob('0 8 * * *', async function () {
    await checkPrices()
})

schedule.scheduleJob('0 22 * * *', async function () {
    await checkPrices()
})

schedule.scheduleJob('*/20 * * * *', async function () {
    await emergencyCheck()
})

sendTestMessage()
