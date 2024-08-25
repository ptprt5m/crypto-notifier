import { getPrices, getPreviousPrices } from './priceService.js'
import { calculatePercentage, formatNumber } from './utils.js'
import { tonAmount, notAmount } from './config.js'
import { sendTelegramMessage } from './telegramBot.js'

export async function emergencyCheck() {
    const { tonPrice, notPrice } = await getPrices()
    const previousPrices = getPreviousPrices()

    if (!previousPrices) return

    const tonChange = calculatePercentage(tonPrice, previousPrices.tonPrice)
    const notChange = calculatePercentage(notPrice, previousPrices.notPrice)

    const totalValue = (tonPrice! * tonAmount + notPrice! * notAmount).toFixed(
        2,
    )
    const previousTotalValue = (
        (previousPrices.tonPrice || 0) * tonAmount +
        (previousPrices.notPrice || 0) * notAmount
    ).toFixed(2)
    const totalChange = calculatePercentage(
        parseFloat(totalValue),
        parseFloat(previousTotalValue),
    )

    if (
        Math.abs(parseFloat(tonChange)) >= 30 ||
        Math.abs(parseFloat(notChange)) >= 30
    ) {
        const emergencyMessage = `
❗️Emergency Alert:
TON: ${tonPrice?.toFixed(2)} RUB (${tonChange}%)
NOT: ${notPrice?.toFixed(2)} RUB (${notChange}%)

💰 Total money: ${formatNumber(parseFloat(totalValue))} RUB (${totalChange}%)
        `
        sendTelegramMessage(emergencyMessage)
    }
}
