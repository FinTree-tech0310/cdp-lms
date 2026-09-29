import type { BiddingWarScenario } from "./bidding-war-types";

function requireText(value: string, field: string) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Bidding War content error: ${field} must be non-empty.`);
  }
}

function requireFinite(value: number, field: string) {
  if (!Number.isFinite(value)) {
    throw new Error(`Bidding War content error: ${field} must be a finite number.`);
  }
}

export function validateBiddingWarScenarios(
  scenarios: readonly BiddingWarScenario[],
) {
  if (scenarios.length === 0) {
    throw new Error("Bidding War content error: at least one scenario is required.");
  }

  const ids = new Set<string>();
  for (const scenario of scenarios) {
    requireText(scenario.id, "scenario id");
    if (ids.has(scenario.id)) {
      throw new Error(`Bidding War content error: duplicate scenario id "${scenario.id}".`);
    }
    ids.add(scenario.id);
    requireText(scenario.assetName, `scenario "${scenario.id}" assetName`);
    requireText(scenario.dealContext, `scenario "${scenario.id}" dealContext`);
    requireText(scenario.outcomeCompetitorDropped, `scenario "${scenario.id}" outcomeCompetitorDropped`);
    requireText(scenario.endingWonReasonable, `scenario "${scenario.id}" endingWonReasonable`);
    requireText(scenario.endingWonOverpaid, `scenario "${scenario.id}" endingWonOverpaid`);
    requireText(scenario.endingLostToCompetitor, `scenario "${scenario.id}" endingLostToCompetitor`);
    requireText(scenario.endingWalkedAway, `scenario "${scenario.id}" endingWalkedAway`);

    const numericFields = [
      "assetReferenceValue",
      "learnerMaxAuthorizedBid",
      "startingBid",
      "minIncrement",
      "bidStep",
      "competitorMaxBid",
      "maxRounds",
    ] as const;
    numericFields.forEach((field) => requireFinite(scenario[field], `scenario "${scenario.id}" ${field}`));

    if (scenario.assetReferenceValue <= 0) throw new Error(`Bidding War content error: scenario "${scenario.id}" assetReferenceValue must be positive.`);
    if (scenario.learnerMaxAuthorizedBid <= 0) throw new Error(`Bidding War content error: scenario "${scenario.id}" learnerMaxAuthorizedBid must be positive.`);
    if (scenario.startingBid < 0) throw new Error(`Bidding War content error: scenario "${scenario.id}" startingBid cannot be negative.`);
    if (scenario.minIncrement <= 0 || scenario.bidStep <= 0) throw new Error(`Bidding War content error: scenario "${scenario.id}" increments must be positive.`);
    if (scenario.competitorMaxBid <= scenario.startingBid) throw new Error(`Bidding War content error: scenario "${scenario.id}" competitorMaxBid must exceed startingBid.`);
    if (!Number.isInteger(scenario.maxRounds) || scenario.maxRounds < 1) throw new Error(`Bidding War content error: scenario "${scenario.id}" maxRounds must be an integer of at least 1.`);
    if (scenario.startingBid + scenario.minIncrement > scenario.learnerMaxAuthorizedBid) throw new Error(`Bidding War content error: scenario "${scenario.id}" must begin with a legal learner raise.`);
    if (scenario.competitorBidSchedule.length < scenario.maxRounds) throw new Error(`Bidding War content error: scenario "${scenario.id}" schedule must cover every round.`);

    let previousFloor = -Infinity;
    scenario.competitorBidSchedule.slice(0, scenario.maxRounds).forEach((floor, index) => {
      requireFinite(floor, `scenario "${scenario.id}" schedule entry ${index}`);
      if (floor <= scenario.startingBid || floor > scenario.competitorMaxBid) {
        throw new Error(`Bidding War content error: scenario "${scenario.id}" schedule entry ${index} is outside its allowed range.`);
      }
      if (floor < previousFloor) {
        throw new Error(`Bidding War content error: scenario "${scenario.id}" schedule must be non-decreasing.`);
      }
      previousFloor = floor;
    });
  }
}
