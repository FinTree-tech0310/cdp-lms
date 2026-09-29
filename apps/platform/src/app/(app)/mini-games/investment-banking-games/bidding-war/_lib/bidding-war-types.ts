export type BiddingWarOutcome =
  | "won-reasonable"
  | "won-overpaid"
  | "lost-to-competitor"
  | "walked-away";

export type ForcedOutReason = "budget" | "round-limit";

export interface BiddingWarScenario {
  id: string;
  assetName: string;
  dealContext: string;
  assetReferenceValue: number;
  learnerMaxAuthorizedBid: number;
  startingBid: number;
  minIncrement: number;
  bidStep: number;
  competitorMaxBid: number;
  competitorBidSchedule: number[];
  maxRounds: number;
  outcomeCompetitorDropped: string;
  endingWonReasonable: string;
  endingWonOverpaid: string;
  endingLostToCompetitor: string;
  endingWalkedAway: string;
}

export interface AuctionRoundHistory {
  readonly roundNumber: number;
  readonly leadingBidBeforeAction: number;
  readonly learnerAction: "raise" | "walk-away";
  readonly learnerBid?: number;
  readonly competitorBid?: number;
  readonly competitorDropped: boolean;
}

export type RaiseResolution =
  | {
      kind: "competitor-dropped";
      history: AuctionRoundHistory;
      winningBid: number;
      finalOutcome: "won-reasonable" | "won-overpaid";
    }
  | {
      kind: "competitor-countered";
      history: AuctionRoundHistory;
      competitorBid: number;
      forcedOutReason: ForcedOutReason | null;
    };
