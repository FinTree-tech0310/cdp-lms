export interface PricePoint {
  day: number;
  price: number;
  movingAverage20: number;
  rsi14: number;
}

export interface TradingScenario {
  id: string;
  marketContext: string;
  pricePoints: PricePoint[];
  scenarioReflection: string;
}

export type EntryRuleId = "priceBelowMA20" | "rsiOversold" | "priceBreakoutAboveMA20" | "rsiOverbought";
export type ExitRuleId = "takeProfit8pct" | "stopLoss4pct" | "rsiOverboughtExit" | "maxHold10Days";
export type TradeExitReason = ExitRuleId | "endOfPeriod";

export interface CompletedTrade {
  entryDay: number;
  entryPrice: number;
  exitDay: number;
  exitPrice: number;
  tradeReturnPercent: number;
  exitReason: TradeExitReason;
  forcedExitAtEndOfPeriod: boolean;
}

export type StrategyTraceEvent =
  | { type: "entry"; ruleId: EntryRuleId }
  | { type: "exit"; ruleId: ExitRuleId }
  | { type: "forcedExitAtEndOfPeriod" };

export interface StrategyTracePoint extends PricePoint {
  events: StrategyTraceEvent[];
}

export interface SimulationResult {
  trades: CompletedTrade[];
  trace: StrategyTracePoint[];
  numberOfTrades: number;
  totalReturnPercent: number;
  worstTradeReturnPercent: number | null;
}

export interface TradingResultSnapshot extends SimulationResult {
  scenarioId: string;
  marketContext: string;
  selectedEntryRuleId: EntryRuleId;
  selectedExitRuleId: ExitRuleId;
  selectedEntryRuleLabel: string;
  selectedExitRuleLabel: string;
  pricePoints: PricePoint[];
  scenarioReflection: string;
}
