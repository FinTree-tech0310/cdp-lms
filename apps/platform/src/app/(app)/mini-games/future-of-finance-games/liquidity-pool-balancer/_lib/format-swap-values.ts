const amountFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const inputFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 10,
});

export function formatSwapAmount(value: number): string {
  return inputFormatter.format(value);
}

export function formatOutputAmount(value: number): string {
  return amountFormatter.format(value);
}

export function formatPriceImpact(value: number): string {
  return amountFormatter.format(value);
}
