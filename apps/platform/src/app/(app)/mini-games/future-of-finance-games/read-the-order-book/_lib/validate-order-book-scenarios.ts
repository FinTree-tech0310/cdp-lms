import type { OrderBookLevel, OrderBookScenario } from "./order-book-types";

function fail(message: string): never {
  throw new Error(`Read the Order Book content error: ${message}`);
}

function requireText(value: unknown, field: string): void {
  if (typeof value !== "string" || !value.trim()) fail(`${field} must be non-empty.`);
}

function requirePositiveFinite(value: unknown, field: string): void {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    fail(`${field} must be a positive finite number.`);
  }
}

function validateSide(
  levels: unknown,
  side: "sell" | "buy",
  scenarioId: string,
  currentPrice: number,
): void {
  if (!Array.isArray(levels) || levels.length === 0) {
    fail(`${scenarioId} needs at least one ${side} order.`);
  }
  const seenPrices = new Set<number>();
  let previousPrice = currentPrice;
  for (const [index, level] of (levels as OrderBookLevel[]).entries()) {
    const name = `${scenarioId} ${side} order ${index + 1}`;
    if (!level || typeof level !== "object") fail(`${name} is invalid.`);
    requirePositiveFinite(level.price, `${name} price`);
    requirePositiveFinite(level.size, `${name} size`);
    if (seenPrices.has(level.price)) fail(`${name} duplicates a ${side} price.`);
    seenPrices.add(level.price);
    if (side === "sell" && level.price <= currentPrice) fail(`${name} price must be above currentPrice.`);
    if (side === "buy" && level.price >= currentPrice) fail(`${name} price must be below currentPrice.`);
    if (index > 0 && side === "sell" && level.price <= previousPrice) {
      fail(`${scenarioId} sell orders must be nearest-first with increasing prices.`);
    }
    if (index > 0 && side === "buy" && level.price >= previousPrice) {
      fail(`${scenarioId} buy orders must be nearest-first with decreasing prices.`);
    }
    previousPrice = level.price;
  }
}

export function validateOrderBookScenarios(scenarios: readonly OrderBookScenario[]): void {
  if (!Array.isArray(scenarios) || scenarios.length === 0) fail("At least one scenario is required.");
  const seenIds = new Set<string>();
  for (const scenario of scenarios) {
    if (!scenario || typeof scenario !== "object") fail("Invalid scenario.");
    requireText(scenario.id, "Scenario ID");
    if (seenIds.has(scenario.id)) fail(`Duplicate scenario ID: ${scenario.id}.`);
    seenIds.add(scenario.id);
    requireText(scenario.marketContext, `${scenario.id} marketContext`);
    requirePositiveFinite(scenario.currentPrice, `${scenario.id} currentPrice`);
    validateSide(scenario.sellOrders, "sell", scenario.id, scenario.currentPrice);
    validateSide(scenario.buyOrders, "buy", scenario.id, scenario.currentPrice);
    requireText(scenario.questionText, `${scenario.id} questionText`);
    if (!Array.isArray(scenario.answerOptions) || ![3, 4].includes(scenario.answerOptions.length)) {
      fail(`${scenario.id} answerOptions must contain exactly 3 or 4 options.`);
    }
    for (const [index, option] of scenario.answerOptions.entries()) {
      requireText(option, `${scenario.id} answer option ${index + 1}`);
    }
    if (new Set(scenario.answerOptions).size !== scenario.answerOptions.length) {
      fail(`${scenario.id} answerOptions must be unique.`);
    }
    requireText(scenario.correctInterpretation, `${scenario.id} correctInterpretation`);
    if (!scenario.answerOptions.includes(scenario.correctInterpretation)) {
      fail(`${scenario.id} correctInterpretation must match one answer option.`);
    }
    requireText(scenario.explanation, `${scenario.id} explanation`);
    requireText(
      scenario.depthDescriptionForScreenReaders,
      `${scenario.id} depthDescriptionForScreenReaders`,
    );
  }
}
