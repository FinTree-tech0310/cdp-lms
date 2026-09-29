import type { OrderBookScenario } from "../_lib/order-book-types";

export const orderBookScenarios: OrderBookScenario[] = [
  {
    id: "rob-1",
    marketContext:
      "A mid-cap stock's order book during a normal, low-volatility trading session.",
    currentPrice: 48.5,
    sellOrders: [
      { price: 48.55, size: 15 },
      { price: 48.65, size: 18 },
      { price: 48.8, size: 22 },
      { price: 49.0, size: 280 },
    ],
    buyOrders: [
      { price: 48.45, size: 260 },
      { price: 48.3, size: 20 },
      { price: 48.15, size: 17 },
      { price: 48.0, size: 19 },
    ],
    questionText:
      "A 200-unit market sell order comes in. Based on the displayed book, what would happen first?",
    answerOptions: [
      "It would execute against the buy side and be absorbed entirely by the 260-unit bid at $48.45",
      "It would move through several thin buy-side levels before reaching meaningful depth",
      "It would execute against the sell side and encounter the large ask at $49.00",
    ],
    correctInterpretation:
      "It would execute against the buy side and be absorbed entirely by the 260-unit bid at $48.45",
    explanation:
      "A market sell order executes against resting buy orders. The best displayed bid at $48.45 contains 260 units of depth, which is enough to absorb the full 200-unit sell order in this simplified snapshot without requiring the order to move into the lower bid levels.",
    depthDescriptionForScreenReaders:
      "The current price is $48.50. The sell side has relatively thin orders at $48.55, $48.65, and $48.80, followed by a much larger 280-unit sell level at $49.00. The buy side has a large 260-unit buy level immediately below the current price at $48.45, followed by much smaller orders at $48.30, $48.15, and $48.00.",
  },
  {
    id: "rob-2",
    marketContext:
      "A small-cap stock's order book shortly after a company announcement, with unusually light overall trading interest.",
    currentPrice: 12.2,
    sellOrders: [
      { price: 12.22, size: 8 },
      { price: 12.25, size: 6 },
      { price: 12.3, size: 9 },
      { price: 12.4, size: 7 },
    ],
    buyOrders: [
      { price: 12.18, size: 7 },
      { price: 12.15, size: 5 },
      { price: 12.1, size: 6 },
      { price: 12.0, size: 8 },
    ],
    questionText:
      "A 20-unit market order is placed on either side of this book. What does the displayed depth imply about execution?",
    answerOptions: [
      "A 20-unit order would be absorbed entirely at the best displayed price on either side",
      "A 20-unit order would need to consume multiple visible price levels whether it were a market buy or a market sell",
      "Only a 20-unit market sell would consume multiple levels; a market buy would remain at the best ask",
    ],
    correctInterpretation:
      "A 20-unit order would need to consume multiple visible price levels whether it were a market buy or a market sell",
    explanation:
      "The displayed depth is thin on both sides. A 20-unit market buy would consume the 8 units at $12.22 and 6 at $12.25 before reaching the $12.30 ask. A 20-unit market sell would consume 7 units at $12.18, 5 at $12.15, and 6 at $12.10 before reaching the $12.00 bid. In either direction, the order must move through multiple displayed price levels rather than being absorbed at the best price.",
    depthDescriptionForScreenReaders:
      "The current price is $12.20. The sell side has only 8 units at $12.22, 6 at $12.25, 9 at $12.30, and 7 at $12.40. The buy side is similarly thin, with 7 units at $12.18, 5 at $12.15, 6 at $12.10, and 8 at $12.00. Neither side contains a large concentration of displayed depth.",
  },
  {
    id: "rob-3",
    marketContext:
      "A large-cap stock's order book during a period of heavy institutional accumulation interest.",
    currentPrice: 210.0,
    sellOrders: [
      { price: 210.05, size: 40 },
      { price: 210.15, size: 45 },
      { price: 210.3, size: 38 },
      { price: 210.5, size: 42 },
    ],
    buyOrders: [
      { price: 209.95, size: 350 },
      { price: 209.8, size: 310 },
      { price: 209.6, size: 290 },
      { price: 209.4, size: 330 },
    ],
    questionText:
      "What does the overall shape of this book suggest about the balance of displayed buy-side versus sell-side depth right now?",
    answerOptions: [
      "The two sides are roughly balanced in total displayed depth",
      "The buy side carries substantially more displayed depth than the sell side across the visible levels",
      "The sell side carries substantially more displayed depth than the buy side across the visible levels",
    ],
    correctInterpretation:
      "The buy side carries substantially more displayed depth than the sell side across the visible levels",
    explanation:
      "Every visible buy-side level contains roughly seven to nine times the size of the corresponding sell-side level, so the displayed book is meaningfully imbalanced toward resting buy depth. That describes the liquidity visible in this snapshot only — it is not a prediction that the stock's price must rise, and displayed orders can be changed or cancelled quickly.",
    depthDescriptionForScreenReaders:
      "The current price is $210.00. The sell side shows moderate and fairly even depth of 40, 45, 38, and 42 units across its visible levels. The buy side shows much larger depth of 350, 310, 290, and 330 units across its visible levels, roughly seven to nine times the sell-side size at similar distances from the current price.",
  },
  {
    id: "rob-4",
    marketContext:
      "A mid-cap stock's order book moments after a 300-unit buy order at $64.95 was cancelled.",
    currentPrice: 65.0,
    sellOrders: [
      { price: 65.05, size: 30 },
      { price: 65.15, size: 25 },
      { price: 65.3, size: 28 },
      { price: 65.5, size: 200 },
    ],
    buyOrders: [
      { price: 64.95, size: 22 },
      { price: 64.85, size: 18 },
      { price: 64.7, size: 20 },
      { price: 64.5, size: 24 },
    ],
    questionText:
      "An 80-unit market sell order arrives now. Compared with the book before the 300-unit bid at $64.95 was cancelled, how has its execution path changed?",
    answerOptions: [
      "Almost nothing has changed — the remaining buy-side depth would still absorb the order at essentially the same price level",
      "The order would now consume several thin buy-side levels, creating substantially more immediate execution impact than when the 300-unit bid was present",
      "The order would now execute against the sell side because the large buy order was cancelled",
    ],
    correctInterpretation:
      "The order would now consume several thin buy-side levels, creating substantially more immediate execution impact than when the 300-unit bid was present",
    explanation:
      "Before the cancellation, a 300-unit bid at $64.95 could have absorbed an 80-unit market sell order entirely at that first displayed buy level. After the cancellation, only 22 units remain at $64.95, followed by 18 at $64.85 and 20 at $64.70, so the same 80-unit sell order would continue into the $64.50 level. Removing the large bid therefore changes the immediate execution path from one deep level to several thinner levels. This describes execution against the displayed book, not a prediction of what the stock must do next.",
    depthDescriptionForScreenReaders:
      "The current price is $65.00. A 300-unit buy order that had been resting at $64.95 was cancelled before this snapshot. The remaining buy side now contains only 22 units at $64.95, 18 at $64.85, 20 at $64.70, and 24 at $64.50. The sell side contains 30, 25, and 28 units near the current price, followed by a larger 200-unit sell level at $65.50.",
  },
  {
    id: "rob-5",
    marketContext:
      "A mid-cap stock's order book showing an unusually thin sell-side level inside an otherwise reasonably deep displayed book.",
    currentPrice: 33.0,
    sellOrders: [
      { price: 33.05, size: 45 },
      { price: 33.15, size: 3 },
      { price: 33.3, size: 50 },
      { price: 33.5, size: 40 },
    ],
    buyOrders: [
      { price: 32.95, size: 42 },
      { price: 32.85, size: 38 },
      { price: 32.7, size: 44 },
      { price: 32.55, size: 40 },
    ],
    questionText:
      "A 50-unit market buy order arrives. Based on the displayed sell-side depth, what would happen?",
    answerOptions: [
      "The entire order would be absorbed by the 45-unit sell level at $33.05",
      "It would consume the 45 units at $33.05, clear the thin 3-unit level at $33.15, and reach the $33.30 sell level",
      "It would execute against the buy side because the visible bids contain substantial depth",
    ],
    correctInterpretation:
      "It would consume the 45 units at $33.05, clear the thin 3-unit level at $33.15, and reach the $33.30 sell level",
    explanation:
      "A market buy consumes resting sell orders starting from the lowest available ask. The first level provides 45 units, leaving 5 units of the order unfilled. The next sell level at $33.15 contains only 3 units, so it is cleared immediately, leaving 2 units to execute at $33.30. The unusually thin middle level therefore allows the order to reach the next price level with very little additional size once the first ask has been consumed.",
    depthDescriptionForScreenReaders:
      "The current price is $33.00. The sell side contains 45 units at $33.05, then an unusually thin level of only 3 units at $33.15, followed by 50 units at $33.30 and 40 at $33.50. The buy side contains consistently substantial depth of 42, 38, 44, and 40 units across its visible levels.",
  },
];
