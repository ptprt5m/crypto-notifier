import {
    getPrices,
    getPreviousPrices,
    savePreviousPrices,
} from './priceService.js'
import { calculatePercentage, formatNumber } from './utils.js'
import { tonAmount, notAmount } from './config.js'
import { sendTelegramMessage } from './telegramBot.js'

export async function checkPrices() {
    const { tonPrice, notPrice } = await getPrices()
    const previousPrices = getPreviousPrices() || { tonPrice, notPrice }

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

    const message = `
TON: ${tonPrice?.toFixed(2)} RUB (${tonChange}%)
NOT: ${notPrice?.toFixed(2)} RUB (${notChange}%)

💰 Total money: ${formatNumber(parseFloat(totalValue))} RUB (${totalChange}%)
    `

    sendTelegramMessage(message)
    savePreviousPrices({ tonPrice, notPrice })
}
