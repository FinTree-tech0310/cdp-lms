import { evaluateEntryRule, evaluateExitRule } from "./trading-rules";
import type { CompletedTrade, EntryRuleId, ExitRuleId, PricePoint, SimulationResult, StrategyTracePoint } from "./trading-types";

export function simulateTradingStrategy(
  pricePoints: readonly PricePoint[],
  entryRuleId: EntryRuleId,
  exitRuleId: ExitRuleId,
): SimulationResult {
  const trades: CompletedTrade[] = [];
  const trace: StrategyTracePoint[] = pricePoints.map((point) => ({ ...point, events: [] }));
  let position: { entryDay: number; entryPrice: number } | null = null;

  for (const point of trace) {
    if (position === null) {
      if (evaluateEntryRule(entryRuleId, point)) {
        position = { entryDay: point.day, entryPrice: point.price };
        point.events.push({ type: "entry", ruleId: entryRuleId });
      }
      continue;
    }

    if (evaluateExitRule(exitRuleId, point, position)) {
      trades.push({
        entryDay: position.entryDay,
        entryPrice: position.entryPrice,
        exitDay: point.day,
        exitPrice: point.price,
        tradeReturnPercent: ((point.price - position.entryPrice) / position.entryPrice) * 100,
        exitReason: exitRuleId,
        forcedExitAtEndOfPeriod: false,
      });
      point.events.push({ type: "exit", ruleId: exitRuleId });
      position = null;
    }
  }

  if (position !== null) {
    const finalPoint = trace.at(-1);
    if (!finalPoint) throw new Error("Trading simulation requires at least one price point.");
    trades.push({
      entryDay: position.entryDay,
      entryPrice: position.entryPrice,
      exitDay: finalPoint.day,
      exitPrice: finalPoint.price,
      tradeReturnPercent: ((finalPoint.price - position.entryPrice) / position.entryPrice) * 100,
      exitReason: "endOfPeriod",
      forcedExitAtEndOfPeriod: true,
    });
    finalPoint.events.push({ type: "forcedExitAtEndOfPeriod" });
  }

  return {
    trades,
    trace,
    numberOfTrades: trades.length,
    totalReturnPercent: trades.reduce((sum, trade) => sum + trade.tradeReturnPercent, 0),
    worstTradeReturnPercent: trades.length === 0
      ? null
      : trades.reduce((worst, trade) => Math.min(worst, trade.tradeReturnPercent), Infinity),
  };
}
