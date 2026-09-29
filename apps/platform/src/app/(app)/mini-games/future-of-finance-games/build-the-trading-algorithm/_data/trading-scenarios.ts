import type { TradingScenario } from "../_lib/trading-types";

export const tradingScenarios: TradingScenario[] = [
  {
    id: "bta-1",

    marketContext:
      "A stock in a sustained uptrend following a positive product announcement, with price spending most of the period above its recent moving average.",

    pricePoints: [
      { day: 1, price: 90, movingAverage20: 92, rsi14: 45 },
      { day: 2, price: 92, movingAverage20: 92, rsi14: 50 },
      { day: 3, price: 95, movingAverage20: 91, rsi14: 55 },
      { day: 4, price: 99, movingAverage20: 91, rsi14: 62 },
      { day: 5, price: 104, movingAverage20: 91, rsi14: 70 },
      { day: 6, price: 108, movingAverage20: 92, rsi14: 74 },
      { day: 7, price: 110, movingAverage20: 93, rsi14: 68 },
      { day: 8, price: 107, movingAverage20: 94, rsi14: 60 },
      { day: 9, price: 112, movingAverage20: 95, rsi14: 65 },
      { day: 10, price: 118, movingAverage20: 97, rsi14: 70 },
      { day: 11, price: 121, movingAverage20: 99, rsi14: 68 },
      { day: 12, price: 119, movingAverage20: 101, rsi14: 60 },
      { day: 13, price: 125, movingAverage20: 103, rsi14: 66 },
      { day: 14, price: 128, movingAverage20: 106, rsi14: 69 },
      { day: 15, price: 130, movingAverage20: 109, rsi14: 65 },
    ],

    scenarioReflection:
      "This period developed into a persistent uptrend. Price moved more than 5% above its supplied moving average on multiple days, while RSI never entered the below-35 oversold zone and exceeded 70 only briefly. The regime therefore generated repeated breakout-style entry signals but essentially no weakness-based entries. The backtest shows how strongly the opportunities available to a fixed rule depend on which conditions the market actually produces.",
  },

  {
    id: "bta-2",

    marketContext:
      "A volatile, mean-reverting stock repeatedly swinging around a relatively stable moving average, followed by a sharp late-period rally and reversal.",

    pricePoints: [
      { day: 1, price: 50, movingAverage20: 50, rsi14: 50 },
      { day: 2, price: 46, movingAverage20: 50, rsi14: 38 },
      { day: 3, price: 42, movingAverage20: 49, rsi14: 30 },
      { day: 4, price: 45, movingAverage20: 49, rsi14: 42 },
      { day: 5, price: 48, movingAverage20: 49, rsi14: 50 },
      { day: 6, price: 51, movingAverage20: 49, rsi14: 58 },
      { day: 7, price: 46, movingAverage20: 49, rsi14: 40 },
      { day: 8, price: 44, movingAverage20: 49, rsi14: 34 },
      { day: 9, price: 47, movingAverage20: 49, rsi14: 46 },
      { day: 10, price: 49, movingAverage20: 49, rsi14: 55 },
      { day: 11, price: 43, movingAverage20: 48, rsi14: 33 },
      { day: 12, price: 40, movingAverage20: 48, rsi14: 25 },
      { day: 13, price: 44, movingAverage20: 48, rsi14: 40 },
      { day: 14, price: 48, movingAverage20: 48, rsi14: 52 },
      { day: 15, price: 52, movingAverage20: 48, rsi14: 62 },
      { day: 16, price: 55, movingAverage20: 49, rsi14: 68 },
      { day: 17, price: 58, movingAverage20: 49, rsi14: 72 },
      { day: 18, price: 54, movingAverage20: 49, rsi14: 55 },
      { day: 19, price: 50, movingAverage20: 50, rsi14: 45 },
      { day: 20, price: 47, movingAverage20: 50, rsi14: 38 },
    ],

    scenarioReflection:
      "This market repeatedly moved from weakness back toward its moving average before a stronger late-period rally briefly pushed both price and RSI into elevated territory. Oversold conditions appeared several times, while the more momentum-oriented entry conditions arrived much later. Because the market changed character during the period, the same fixed entry and exit rules could produce very different sequences depending on when they became active.",
  },

  {
    id: "bta-3",

    marketContext:
      "A stock in a sustained decline following weak earnings guidance, followed by a partial rebound late in the period after the initial selloff became deeply extended.",

    pricePoints: [
      { day: 1, price: 100, movingAverage20: 100, rsi14: 50 },
      { day: 2, price: 95, movingAverage20: 99, rsi14: 40 },
      { day: 3, price: 90, movingAverage20: 98, rsi14: 30 },
      { day: 4, price: 86, movingAverage20: 97, rsi14: 22 },
      { day: 5, price: 84, movingAverage20: 96, rsi14: 20 },
      { day: 6, price: 80, movingAverage20: 95, rsi14: 15 },
      { day: 7, price: 78, movingAverage20: 94, rsi14: 18 },
      { day: 8, price: 75, movingAverage20: 93, rsi14: 15 },
      { day: 9, price: 71, movingAverage20: 92, rsi14: 12 },
      { day: 10, price: 68, movingAverage20: 90, rsi14: 10 },
      { day: 11, price: 64, movingAverage20: 88, rsi14: 8 },
      { day: 12, price: 66, movingAverage20: 86, rsi14: 20 },
      { day: 13, price: 70, movingAverage20: 85, rsi14: 30 },
      { day: 14, price: 74, movingAverage20: 84, rsi14: 38 },
      { day: 15, price: 78, movingAverage20: 83, rsi14: 45 },
    ],

    scenarioReflection:
      "The first part of this period is a persistent decline: price remains materially below its moving average and RSI repeatedly falls into deeply oversold territory. A rebound begins late in the sample, but price still finishes below the supplied moving average. This regime creates many weakness-based entry signals while producing no overbought or upside-breakout entries, demonstrating how a fixed trigger can remain active for a long time when a trend becomes unusually extended.",
  },

  {
    id: "bta-4",

    marketContext:
      "A stable, low-volatility stock trading in an unusually narrow band for an extended period, with no significant news or catalyst.",

    pricePoints: [
      { day: 1, price: 50.0, movingAverage20: 50.0, rsi14: 50 },
      { day: 2, price: 50.5, movingAverage20: 50.0, rsi14: 51 },
      { day: 3, price: 49.8, movingAverage20: 50.0, rsi14: 49 },
      { day: 4, price: 50.2, movingAverage20: 50.0, rsi14: 50 },
      { day: 5, price: 50.6, movingAverage20: 50.1, rsi14: 52 },
      { day: 6, price: 49.9, movingAverage20: 50.1, rsi14: 48 },
      { day: 7, price: 50.3, movingAverage20: 50.1, rsi14: 50 },
      { day: 8, price: 50.7, movingAverage20: 50.2, rsi14: 51 },
      { day: 9, price: 50.1, movingAverage20: 50.2, rsi14: 49 },
      { day: 10, price: 50.4, movingAverage20: 50.2, rsi14: 50 },
      { day: 11, price: 50.8, movingAverage20: 50.3, rsi14: 52 },
      { day: 12, price: 50.2, movingAverage20: 50.3, rsi14: 49 },
      { day: 13, price: 50.5, movingAverage20: 50.3, rsi14: 50 },
      { day: 14, price: 50.9, movingAverage20: 50.4, rsi14: 51 },
      { day: 15, price: 50.3, movingAverage20: 50.4, rsi14: 49 },
    ],

    scenarioReflection:
      "Very little changed during this period. Price stayed close to its moving average and RSI remained near neutral throughout. None of the four fixed entry conditions used in this game occurs anywhere in the supplied period, so every rule pairing produces an empty trade log. That is a valid deterministic outcome: a systematic strategy can simply remain inactive when its stated conditions never appear.",
  },
];
