import schedule from 'node-schedule'

import { checkPrices } from './priceChecker.js'
import { emergencyCheck } from './emergencyChecker.js'
import { sendTelegramMessage } from './telegramBot.js'
import { getPrices, getPreviousPrices } from './priceService.js'
import { calculatePercentage, formatNumber } from './utils.js'
import { tonAmount, notAmount } from './config.js'

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
            (previousPrices.notPrice || 0) * notAmount
        ).toFixed(2)
        const totalChange = calculatePercentage(
            parseFloat(totalValue),
            parseFloat(previousTotalValue),
        )

        await sendTelegramMessage(
            `
Test message:
TON: ${tonPrice.toFixed(2)} RUB (${tonChange}%)
NOT: ${notPrice.toFixed(2)} RUB (${notChange}%)

💰 Total money: ${formatNumber(parseFloat(totalValue))} RUB (${totalChange}%)
            `,
        )
        console.log('Test message sent successfully.')
    } catch (error) {
        console.error('Error sending test message:', error)
    }
}

schedule.scheduleJob('0 8 * * *', async () => {
    await checkPrices()
})

schedule.scheduleJob('0 22 * * *', async () => {
    await checkPrices()
})

schedule.scheduleJob('*/20 * * * *', async () => {
    await emergencyCheck()
})

sendTestMessage()
