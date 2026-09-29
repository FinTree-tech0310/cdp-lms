import { simulateTradingStrategy } from "./simulate-trading-strategy";
import { entryRuleLabel, exitRuleLabel } from "./trading-rules";
import type { EntryRuleId, ExitRuleId, TradingResultSnapshot, TradingScenario } from "./trading-types";

export function createTradingResultSnapshot(
  scenario: TradingScenario,
  selectedEntryRuleId: EntryRuleId,
  selectedExitRuleId: ExitRuleId,
): TradingResultSnapshot {
  const result = simulateTradingStrategy(scenario.pricePoints, selectedEntryRuleId, selectedExitRuleId);
  return {
    scenarioId: scenario.id,
    marketContext: scenario.marketContext,
    selectedEntryRuleId,
    selectedExitRuleId,
    selectedEntryRuleLabel: entryRuleLabel(selectedEntryRuleId),
    selectedExitRuleLabel: exitRuleLabel(selectedExitRuleId),
    pricePoints: scenario.pricePoints.map((point) => ({ ...point })),
    trades: result.trades.map((trade) => ({ ...trade })),
    trace: result.trace.map((point) => ({ ...point, events: point.events.map((event) => ({ ...event })) })),
    numberOfTrades: result.numberOfTrades,
    totalReturnPercent: result.totalReturnPercent,
    worstTradeReturnPercent: result.worstTradeReturnPercent,
    scenarioReflection: scenario.scenarioReflection,
  };
}
