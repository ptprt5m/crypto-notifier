import fs from 'fs'

interface Prices {
    tonPrice: number | null
    notPrice: number | null
}

interface ApiResponse {
    'the-open-network'?: { rub: number }
    notcoin?: { rub: number }
}

export async function getPrices(): Promise<Prices> {
    const fetch = (await import('node-fetch')).default
    const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=the-open-network,notcoin&vs_currencies=rub',
    )
    const data: ApiResponse = (await response.json()) as ApiResponse

    return {
        tonPrice: data['the-open-network']?.rub || null,
        notPrice: data.notcoin?.rub || null,
    }
}

export function savePreviousPrices(prices: Prices) {
    fs.writeFileSync('prices.json', JSON.stringify(prices))
}

export function getPreviousPrices(): Prices | null {
    if (fs.existsSync('prices.json')) {
        const data = fs.readFileSync('prices.json', 'utf8')
        return JSON.parse(data)
    }
    return null
}
