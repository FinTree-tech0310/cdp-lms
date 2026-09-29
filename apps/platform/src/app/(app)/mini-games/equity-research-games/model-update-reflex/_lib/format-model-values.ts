import { decimalPlaces } from "./assumption-values";

const financialNumber = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0, maximumFractionDigits: 1,
});

export function formatFinancialValue(value: number, unit: string): string {
  const magnitude = financialNumber.format(Math.abs(value));
  const sign = value < 0 && Number(magnitude.replaceAll(",", "")) !== 0 ? "-" : "";
  // Currency-symbol units such as $M wrap the number. Other authored units
  // remain literal rather than guessing a currency or scaling the actuals.
  const currency = unit.match(/^([$€£¥₹])(.*)$/u);
  return currency
    ? `${sign}${currency[1]}${magnitude}${currency[2]}`
    : `${sign}${magnitude} ${unit}`;
}

export function formatAssumptionValue(
  value: number,
  driver: { unit: string; min: number; step: number },
): string {
  const precision = Math.min(20, Math.max(decimalPlaces(driver.min), decimalPlaces(driver.step), decimalPlaces(value)));
  const number = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: precision, minimumFractionDigits: 0,
  }).format(Object.is(value, -0) ? 0 : value);
  return `${number}${driver.unit === "%" ? "" : " "}${driver.unit}`;
}
