import type {
  AuctionRoundHistory,
  BiddingWarOutcome,
  BiddingWarScenario,
  RaiseResolution,
} from "./bidding-war-types";

const EPSILON = 1e-9;

export function getMinimumLegalRaise(
  currentLeadingBid: number,
  minIncrement: number,
) {
  return currentLeadingBid + minIncrement;
}

export function hasLegalRaise(
  scenario: BiddingWarScenario,
  currentLeadingBid: number,
) {
  return getMinimumLegalRaise(currentLeadingBid, scenario.minIncrement)
    <= scenario.learnerMaxAuthorizedBid;
}

export function respectsBidStep(
  bid: number,
  minimumLegalRaise: number,
  bidStep: number,
) {
  const steps = (bid - minimumLegalRaise) / bidStep;
  return Math.abs(steps - Math.round(steps)) < EPSILON;
}

export function isLegalLearnerBid(
  scenario: BiddingWarScenario,
  currentLeadingBid: number,
  bid: number,
) {
  const minimumLegalRaise = getMinimumLegalRaise(
    currentLeadingBid,
    scenario.minIncrement,
  );
  return Number.isFinite(bid)
    && bid >= minimumLegalRaise
    && bid <= scenario.learnerMaxAuthorizedBid
    && respectsBidStep(bid, minimumLegalRaise, scenario.bidStep);
}

export function resolveLearnerRaise(
  scenario: BiddingWarScenario,
  currentRoundIndex: number,
  currentLeadingBid: number,
  newBid: number,
): RaiseResolution {
  if (
    currentRoundIndex < 0
    || currentRoundIndex >= scenario.maxRounds
    || !isLegalLearnerBid(scenario, currentLeadingBid, newBid)
  ) {
    throw new Error("Bidding War resolution error: learner bid is not legal.");
  }

  const scheduledCompetitorFloor = scenario.competitorBidSchedule[currentRoundIndex];
  const requiredCounter = Math.max(
    scheduledCompetitorFloor,
    newBid + scenario.minIncrement,
  );

  if (requiredCounter > scenario.competitorMaxBid) {
    const history = Object.freeze({
      roundNumber: currentRoundIndex + 1,
      leadingBidBeforeAction: currentLeadingBid,
      learnerAction: "raise" as const,
      learnerBid: newBid,
      competitorDropped: true,
    });
    return {
      kind: "competitor-dropped",
      history,
      winningBid: newBid,
      finalOutcome: newBid <= scenario.assetReferenceValue
        ? "won-reasonable"
        : "won-overpaid",
    };
  }

  const history = Object.freeze({
    roundNumber: currentRoundIndex + 1,
    leadingBidBeforeAction: currentLeadingBid,
    learnerAction: "raise" as const,
    learnerBid: newBid,
    competitorBid: requiredCounter,
    competitorDropped: false,
  });
  const roundLimitReached = currentRoundIndex + 1 >= scenario.maxRounds;
  const budgetExhausted = !hasLegalRaise(scenario, requiredCounter);
  const forcedOutReason = roundLimitReached
    ? "round-limit" as const
    : budgetExhausted
      ? "budget" as const
      : null;

  return {
    kind: "competitor-countered",
    history,
    competitorBid: requiredCounter,
    forcedOutReason,
  };
}

export function createWalkAwayHistory(
  currentRoundIndex: number,
  currentLeadingBid: number,
): AuctionRoundHistory {
  return Object.freeze({
    roundNumber: currentRoundIndex + 1,
    leadingBidBeforeAction: currentLeadingBid,
    learnerAction: "walk-away",
    competitorDropped: false,
  });
}

export function getOutcomeCopy(
  scenario: BiddingWarScenario,
  outcome: BiddingWarOutcome,
) {
  switch (outcome) {
    case "won-reasonable": return scenario.endingWonReasonable;
    case "won-overpaid": return scenario.endingWonOverpaid;
    case "lost-to-competitor": return scenario.endingLostToCompetitor;
    case "walked-away": return scenario.endingWalkedAway;
  }
}
