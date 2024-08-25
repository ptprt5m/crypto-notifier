export function calculatePercentage(
    current: number | null,
    previous: number | null,
): string {
    if (previous === null || previous === 0) return '0.00'
    return (((current! - previous) / previous) * 100).toFixed(2)
}

export function formatNumber(value: number | null): string {
    return value !== null
        ? value.toLocaleString('ru-RU', { minimumFractionDigits: 0 })
        : 'N/A'
}
