const valueFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 });

export function formatTradingValue(value: number): string {
  return valueFormatter.format(value);
}

export function formatTradeReturn(value: number): string {
  return `${value > 0 ? "+" : ""}${formatTradingValue(value)}%`;
}
