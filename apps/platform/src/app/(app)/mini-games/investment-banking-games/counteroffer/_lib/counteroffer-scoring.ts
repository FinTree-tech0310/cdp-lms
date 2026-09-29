import type {
  BuyerLeverEvaluation,
  BuyerRoundTier,
  CounterofferScenario,
  FinalEndingType,
  LeverId,
  LeverValues,
  NegotiationLever,
  SellerStrongTermRule,
  SubmittedRoundSnapshot,
} from "./counteroffer-types";

const LEVER_IDS: readonly LeverId[] = ["price", "earnoutMonths", "governance"];

function clampScore(score: number) {
  return Math.min(100, Math.max(0, score));
}

export function evaluateBuyerLever(
  lever: NegotiationLever,
  value: number,
): BuyerLeverEvaluation {
  if (value < lever.buyerAcceptableMin || value > lever.buyerAcceptableMax) {
    return { status: "dealbreaker", score: null };
  }

  if (value === lever.buyerIdealValue) {
    return { status: "acceptable", score: 100 };
  }

  if (value < lever.buyerIdealValue) {
    const lowerSpan = lever.buyerIdealValue - lever.buyerAcceptableMin;
    const score = lowerSpan === 0
      ? 100
      : 100 - ((lever.buyerIdealValue - value) / lowerSpan) * 100;
    return { status: "acceptable", score: clampScore(score) };
  }

  const upperSpan = lever.buyerAcceptableMax - lever.buyerIdealValue;
  const score = upperSpan === 0
    ? 100
    : 100 - ((value - lever.buyerIdealValue) / upperSpan) * 100;
  return { status: "acceptable", score: clampScore(score) };
}

export function evaluateBuyerRound(
  levers: readonly NegotiationLever[],
  values: LeverValues,
) {
  const evaluations = Object.fromEntries(
    levers.map((lever) => [lever.id, evaluateBuyerLever(lever, values[lever.id])]),
  ) as Record<LeverId, BuyerLeverEvaluation>;

  if (LEVER_IDS.some((id) => evaluations[id].status === "dealbreaker")) {
    return { evaluations, avgScore: null, tier: "dealbreaker" as const };
  }

  const avgScore = LEVER_IDS.reduce((total, id) => {
    const evaluation = evaluations[id];
    return total + (evaluation.status === "acceptable" ? evaluation.score : 0);
  }, 0) / LEVER_IDS.length;

  const tier: BuyerRoundTier = avgScore < 40
    ? "skeptical"
    : avgScore <= 70
      ? "cautious"
      : "warming";

  return { evaluations, avgScore, tier };
}

export function evaluateSellerStrongTermRule(
  rule: SellerStrongTermRule,
  values: LeverValues,
) {
  const submittedValue = values[rule.leverId];
  switch (rule.operator) {
    case ">=": return submittedValue >= rule.value;
    case "<=": return submittedValue <= rule.value;
    case ">": return submittedValue > rule.value;
    case "<": return submittedValue < rule.value;
    case "==": return submittedValue === rule.value;
  }
}

export function evaluateSellerStrongTerms(
  rules: readonly SellerStrongTermRule[],
  values: LeverValues,
) {
  return rules.every((rule) => evaluateSellerStrongTermRule(rule, values));
}

export function deriveFinalEnding(
  roundThreeTier: BuyerRoundTier,
  sellerStrongTermsRules: readonly SellerStrongTermRule[],
  roundThreeValues: LeverValues,
): FinalEndingType {
  if (roundThreeTier === "dealbreaker" || roundThreeTier === "skeptical") {
    return "fell-through";
  }

  return evaluateSellerStrongTerms(sellerStrongTermsRules, roundThreeValues)
    ? "closed-strong"
    : "closed-modest";
}

export function createRoundSnapshot(
  scenario: CounterofferScenario,
  roundNumber: 1 | 2 | 3,
  values: LeverValues,
): SubmittedRoundSnapshot {
  const buyer = evaluateBuyerRound(scenario.levers, values);
  const round = scenario.rounds.find((item) => item.roundNumber === roundNumber);
  const response = round?.responses.find((item) => item.tierId === buyer.tier);
  if (!response) {
    throw new Error(`Counteroffer content error: missing ${buyer.tier} response for round ${roundNumber}.`);
  }

  const governanceLever = scenario.levers.find((lever) => lever.id === "governance");
  const governanceLabel = governanceLever?.options?.find(
    (option) => option.value === values.governance,
  )?.label;
  if (!governanceLabel) {
    throw new Error("Counteroffer content error: missing governance option label.");
  }

  const submittedValues = Object.freeze({ ...values });
  const buyerLeverEvaluations = Object.freeze({ ...buyer.evaluations });

  return Object.freeze({
    roundNumber,
    submittedValues,
    buyerLeverEvaluations,
    buyerAvgScore: buyer.avgScore,
    buyerTier: buyer.tier,
    buyerResponseText: response.responseText,
    governanceLabel,
  });
}
