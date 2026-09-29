import type {
  BuyerRoundTier,
  CounterofferScenario,
  LeverId,
  NegotiationLever,
  SellerStrongTermOperator,
} from "./counteroffer-types";

const REQUIRED_LEVER_IDS: readonly LeverId[] = [
  "price",
  "earnoutMonths",
  "governance",
];
const REQUIRED_TIERS: readonly BuyerRoundTier[] = [
  "dealbreaker",
  "skeptical",
  "cautious",
  "warming",
];
const REQUIRED_OPERATORS: readonly SellerStrongTermOperator[] = [
  ">=", "<=", ">", "<", "==",
];

function requireText(value: string, field: string) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Counteroffer content error: ${field} must be non-empty.`);
  }
}

function requireFinite(value: number, field: string) {
  if (!Number.isFinite(value)) {
    throw new Error(`Counteroffer content error: ${field} must be a finite number.`);
  }
}

function validateLever(lever: NegotiationLever, scenarioId: string) {
  const prefix = `scenario "${scenarioId}", lever "${lever.id}"`;
  requireText(lever.label, `${prefix} label`);
  [
    "min",
    "max",
    "step",
    "buyerAcceptableMin",
    "buyerAcceptableMax",
    "buyerIdealValue",
    "startingLearnerValue",
  ].forEach((field) => requireFinite(lever[field as keyof NegotiationLever] as number, `${prefix} ${field}`));

  if (lever.step <= 0) throw new Error(`Counteroffer content error: ${prefix} step must be greater than zero.`);
  if (
    lever.min > lever.startingLearnerValue
    || lever.startingLearnerValue > lever.max
    || lever.min > lever.buyerAcceptableMin
    || lever.buyerAcceptableMin > lever.buyerIdealValue
    || lever.buyerIdealValue > lever.buyerAcceptableMax
    || lever.buyerAcceptableMax > lever.max
  ) {
    throw new Error(`Counteroffer content error: ${prefix} has invalid range ordering.`);
  }

  if (
    lever.id === "governance"
    && (lever.min !== 0 || lever.max !== 2 || lever.step !== 1)
  ) {
    throw new Error("Counteroffer content error: governance must use min 0, max 2, and step 1.");
  }

  if (lever.id === "governance") {
    if (!lever.options || lever.options.length !== 3) {
      throw new Error("Counteroffer content error: governance must contain exactly 3 options.");
    }
    const optionValues = lever.options.map((option) => option.value).sort();
    if (optionValues.join(",") !== "0,1,2") {
      throw new Error("Counteroffer content error: governance option values must be exactly 0, 1, and 2.");
    }
    lever.options.forEach((option, index) => {
      requireText(option.label, `${prefix} option ${index} label`);
    });
  } else if (lever.options !== undefined) {
    throw new Error(`Counteroffer content error: ${prefix} must not define governance options.`);
  }
}

export function validateCounterofferScenarios(
  scenarios: readonly CounterofferScenario[],
) {
  if (scenarios.length === 0) {
    throw new Error("Counteroffer content error: at least one scenario is required.");
  }

  const scenarioIds = new Set<string>();
  for (const scenario of scenarios) {
    requireText(scenario.id, "scenario id");
    if (scenarioIds.has(scenario.id)) {
      throw new Error(`Counteroffer content error: duplicate scenario id "${scenario.id}".`);
    }
    scenarioIds.add(scenario.id);
    requireText(scenario.dealContext, `scenario "${scenario.id}" dealContext`);
    requireText(scenario.sellerStrongTermsNote, `scenario "${scenario.id}" sellerStrongTermsNote`);
    requireText(scenario.endingDealClosedStrong, `scenario "${scenario.id}" endingDealClosedStrong`);
    requireText(scenario.endingDealClosedModest, `scenario "${scenario.id}" endingDealClosedModest`);
    requireText(scenario.endingDealFellThrough, `scenario "${scenario.id}" endingDealFellThrough`);
    if (scenario.levers.length !== 3) {
      throw new Error(`Counteroffer content error: scenario "${scenario.id}" must contain exactly 3 levers.`);
    }
    const leverIds = scenario.levers.map((lever) => lever.id);
    if (!REQUIRED_LEVER_IDS.every((id) => leverIds.filter((item) => item === id).length === 1)) {
      throw new Error(`Counteroffer content error: scenario "${scenario.id}" must contain each required lever exactly once.`);
    }
    scenario.levers.forEach((lever) => validateLever(lever, scenario.id));

    for (const leverId of REQUIRED_LEVER_IDS) {
      const lever = scenario.levers.find((item) => item.id === leverId);
      const preferredValue = scenario.sellerPreferredValues[leverId];
      requireFinite(preferredValue, `scenario "${scenario.id}" sellerPreferredValues.${leverId}`);
      if (!lever || preferredValue < lever.min || preferredValue > lever.max) {
        throw new Error(`Counteroffer content error: scenario "${scenario.id}" sellerPreferredValues.${leverId} must be within the lever range.`);
      }
    }

    if (scenario.sellerStrongTermsRules.length === 0) {
      throw new Error(`Counteroffer content error: scenario "${scenario.id}" needs at least one sellerStrongTermsRule.`);
    }
    for (const [index, rule] of scenario.sellerStrongTermsRules.entries()) {
      const lever = scenario.levers.find((item) => item.id === rule.leverId);
      if (!lever) {
        throw new Error(`Counteroffer content error: scenario "${scenario.id}" seller rule ${index} references an unknown lever.`);
      }
      if (!REQUIRED_OPERATORS.includes(rule.operator)) {
        throw new Error(`Counteroffer content error: scenario "${scenario.id}" seller rule ${index} has an invalid operator.`);
      }
      requireFinite(rule.value, `scenario "${scenario.id}" seller rule ${index} value`);
      if (rule.value < lever.min || rule.value > lever.max) {
        throw new Error(`Counteroffer content error: scenario "${scenario.id}" seller rule ${index} value must be within the lever range.`);
      }
    }

    if (scenario.rounds.length !== 3) {
      throw new Error(`Counteroffer content error: scenario "${scenario.id}" must contain exactly 3 rounds.`);
    }
    for (const roundNumber of [1, 2, 3] as const) {
      const matchingRounds = scenario.rounds.filter((round) => round.roundNumber === roundNumber);
      if (matchingRounds.length !== 1) {
        throw new Error(`Counteroffer content error: scenario "${scenario.id}" must contain round ${roundNumber} exactly once.`);
      }
      const round = matchingRounds[0];
      if (round.buyerContextNote !== undefined) {
        requireText(round.buyerContextNote, `scenario "${scenario.id}", round ${roundNumber} buyerContextNote`);
      }
      if (round.responses.length !== 4) {
        throw new Error(`Counteroffer content error: scenario "${scenario.id}", round ${roundNumber} must contain exactly 4 responses.`);
      }
      for (const tier of REQUIRED_TIERS) {
        const matchingResponses = round.responses.filter((response) => response.tierId === tier);
        if (matchingResponses.length !== 1) {
          throw new Error(`Counteroffer content error: scenario "${scenario.id}", round ${roundNumber} must contain one ${tier} response.`);
        }
        requireText(matchingResponses[0].responseText, `scenario "${scenario.id}", round ${roundNumber}, ${tier} responseText`);
      }
    }
  }
}
