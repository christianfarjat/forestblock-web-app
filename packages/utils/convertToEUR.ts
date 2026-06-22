export function convertToEUR(
  totalCost: number,
  currency?: string,
  extraData?: any // eslint-disable-line @typescript-eslint/no-explicit-any
): number {
  if (!totalCost || !currency) return 0;

  if (currency.toUpperCase() === "EUR") {
    return totalCost;
  }

  if (currency.toUpperCase() === "USD") {
    const exchangeRate = extraData?.exchangeRate ?? 1;
    return totalCost * exchangeRate;
  }

  return totalCost;
}
