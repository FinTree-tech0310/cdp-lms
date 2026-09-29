import type { EntryRuleId, ExitRuleId, PricePoint } from "./trading-types";

export interface RuleDefinition<Id extends string> {
  id: Id;
  label: string;
  condition: string;
}

export const ENTRY_RULES: readonly RuleDefinition<EntryRuleId>[] = [
  { id: "priceBelowMA20", label: "PRICE MORE THAN 5% BELOW MA20", condition: "Enter when price < MA20 × 0.95." },
  { id: "rsiOversold", label: "RSI BELOW 35", condition: "Enter when RSI14 < 35." },
  { id: "priceBreakoutAboveMA20", label: "PRICE MORE THAN 5% ABOVE MA20", condition: "Enter when price > MA20 × 1.05." },
  { id: "rsiOverbought", label: "RSI ABOVE 70", condition: "Enter when RSI14 > 70." },
];

export const EXIT_RULES: readonly RuleDefinition<ExitRuleId>[] = [
  { id: "takeProfit8pct", label: "TAKE PROFIT AT +8%", condition: "Exit when price ≥ entry price × 1.08." },
  { id: "stopLoss4pct", label: "STOP LOSS AT -4%", condition: "Exit when price ≤ entry price × 0.96." },
  { id: "rsiOverboughtExit", label: "EXIT WHEN RSI > 70", condition: "Exit when RSI14 > 70." },
  { id: "maxHold10Days", label: "MAXIMUM HOLD: 10 DAYS", condition: "Exit when current day − entry day ≥ 10." },
];

export function evaluateEntryRule(ruleId: EntryRuleId, point: PricePoint): boolean {
  switch (ruleId) {
    case "priceBelowMA20": return point.price < point.movingAverage20 * 0.95;
    case "rsiOversold": return point.rsi14 < 35;
    case "priceBreakoutAboveMA20": return point.price > point.movingAverage20 * 1.05;
    case "rsiOverbought": return point.rsi14 > 70;
  }
}

export function evaluateExitRule(
  ruleId: ExitRuleId,
  point: PricePoint,
  position: { entryDay: number; entryPrice: number },
): boolean {
  switch (ruleId) {
    case "takeProfit8pct": return point.price >= position.entryPrice * 1.08;
    case "stopLoss4pct": return point.price <= position.entryPrice * 0.96;
    case "rsiOverboughtExit": return point.rsi14 > 70;
    case "maxHold10Days": return point.day - position.entryDay >= 10;
  }
}

export function entryRuleLabel(id: EntryRuleId): string {
  return ENTRY_RULES.find((rule) => rule.id === id)!.label;
}

export function exitRuleLabel(id: ExitRuleId): string {
  return EXIT_RULES.find((rule) => rule.id === id)!.label;
}
