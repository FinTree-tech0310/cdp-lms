import type { TradingScenario } from "./trading-types";

export const tradingTestFixture: TradingScenario = {
  id: "test-1",
  marketContext: "TEST DATA — placeholder market context only.",
  pricePoints: [
    { day: 1, price: 100, movingAverage20: 105, rsi14: 40 },
    { day: 2, price: 98, movingAverage20: 105, rsi14: 32 },
    { day: 3, price: 101, movingAverage20: 104, rsi14: 45 },
    { day: 4, price: 106, movingAverage20: 103, rsi14: 50 },
    { day: 5, price: 104, movingAverage20: 103, rsi14: 48 },
    { day: 6, price: 103, movingAverage20: 102, rsi14: 46 },
    { day: 7, price: 105, movingAverage20: 102, rsi14: 47 },
    { day: 8, price: 107, movingAverage20: 101, rsi14: 49 },
  ],
  scenarioReflection: "TEST DATA — placeholder reflection only.",
};
