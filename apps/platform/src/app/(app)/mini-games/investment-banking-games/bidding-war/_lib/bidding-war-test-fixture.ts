import type { BiddingWarScenario } from "./bidding-war-types";

export const biddingWarTestScenario: BiddingWarScenario = {
  id: "test-1",
  assetName: "Test Asset (TEST DATA — placeholder only)",
  dealContext: "TEST DATA — placeholder deal context only.",
  assetReferenceValue: 140,
  learnerMaxAuthorizedBid: 150,
  startingBid: 100,
  minIncrement: 5,
  bidStep: 1,
  competitorMaxBid: 135,
  competitorBidSchedule: [110, 120, 130],
  maxRounds: 3,
  outcomeCompetitorDropped: "TEST DATA — placeholder competitor-dropped text.",
  endingWonReasonable: "TEST DATA — placeholder ending only.",
  endingWonOverpaid: "TEST DATA — placeholder ending only.",
  endingLostToCompetitor: "TEST DATA — placeholder ending only.",
  endingWalkedAway: "TEST DATA — placeholder ending only.",
};
