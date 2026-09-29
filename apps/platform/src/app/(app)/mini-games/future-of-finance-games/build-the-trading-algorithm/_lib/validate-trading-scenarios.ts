import type { TradingScenario } from "./trading-types";
import { simulateTradingStrategy } from "./simulate-trading-strategy";
import { ENTRY_RULES, EXIT_RULES } from "./trading-rules";

function fail(message: string): never {
  throw new Error(`Build the Trading Algorithm content error: ${message}`);
}

function nonblank(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function validateTradingScenarios(scenarios: readonly TradingScenario[]): void {
  if (!Array.isArray(scenarios) || scenarios.length === 0) fail("at least one scenario is required.");
  const ids = new Set<string>();
  for (const scenario of scenarios) {
    if (!nonblank(scenario.id)) fail("scenario id must be nonblank.");
    if (ids.has(scenario.id)) fail(`duplicate scenario id ${scenario.id}.`);
    ids.add(scenario.id);
    if (!nonblank(scenario.marketContext)) fail(`${scenario.id} needs marketContext.`);
    if (!nonblank(scenario.scenarioReflection)) fail(`${scenario.id} needs scenarioReflection.`);
    if (!Array.isArray(scenario.pricePoints) || scenario.pricePoints.length === 0) {
      fail(`${scenario.id} needs at least one pricePoint.`);
    }
    let previousDay = 0;
    for (const point of scenario.pricePoints) {
      if (!Number.isSafeInteger(point.day) || point.day <= 0 || point.day <= previousDay) {
        fail(`${scenario.id} days must be positive integers in strictly increasing authored order.`);
      }
      if (!Number.isFinite(point.price) || point.price <= 0) fail(`${scenario.id} day ${point.day} needs positive finite price.`);
      if (!Number.isFinite(point.movingAverage20) || point.movingAverage20 <= 0) {
        fail(`${scenario.id} day ${point.day} needs positive finite movingAverage20.`);
      }
      if (!Number.isFinite(point.rsi14) || point.rsi14 < 0 || point.rsi14 > 100) {
        fail(`${scenario.id} day ${point.day} needs rsi14 between 0 and 100.`);
      }
      previousDay = point.day;
    }
    for (const entryRule of ENTRY_RULES) {
      for (const exitRule of EXIT_RULES) {
        const result = simulateTradingStrategy(scenario.pricePoints, entryRule.id, exitRule.id);
        if (!Number.isFinite(result.totalReturnPercent)
          || (result.worstTradeReturnPercent !== null && !Number.isFinite(result.worstTradeReturnPercent))
          || result.trades.some((trade) => !Number.isFinite(trade.tradeReturnPercent))) {
          fail(`${scenario.id} produces a non-finite backtest return.`);
        }
      }
    }
  }
}
