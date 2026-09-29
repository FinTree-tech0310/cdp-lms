export type LeverId = "price" | "earnoutMonths" | "governance";

export type BuyerRoundTier =
  | "dealbreaker"
  | "skeptical"
  | "cautious"
  | "warming";

export type FinalEndingType =
  | "closed-strong"
  | "closed-modest"
  | "fell-through";

export type SellerStrongTermOperator = ">=" | "<=" | ">" | "<" | "==";

export interface SellerStrongTermRule {
  leverId: LeverId;
  operator: SellerStrongTermOperator;
  value: number;
}

export interface SellerPreferredValues {
  price: number;
  earnoutMonths: number;
  governance: number;
}

export interface GovernanceOption {
  value: 0 | 1 | 2;
  label: string;
}

export interface NegotiationLever {
  id: LeverId;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  buyerAcceptableMin: number;
  buyerAcceptableMax: number;
  buyerIdealValue: number;
  startingLearnerValue: number;
  options?: GovernanceOption[];
}

export interface RoundResponseTier {
  tierId: BuyerRoundTier;
  responseText: string;
}

export interface NegotiationRound {
  roundNumber: 1 | 2 | 3;
  buyerContextNote?: string;
  responses: RoundResponseTier[];
}

export interface CounterofferScenario {
  id: string;
  dealContext: string;
  sellerPreferredValues: SellerPreferredValues;
  sellerStrongTermsNote: string;
  sellerStrongTermsRules: SellerStrongTermRule[];
  levers: NegotiationLever[];
  rounds: NegotiationRound[];
  endingDealClosedStrong: string;
  endingDealClosedModest: string;
  endingDealFellThrough: string;
}

export type LeverValues = Record<LeverId, number>;

export type BuyerLeverEvaluation =
  | { status: "dealbreaker"; score: null }
  | { status: "acceptable"; score: number };

export interface SubmittedRoundSnapshot {
  readonly roundNumber: 1 | 2 | 3;
  readonly submittedValues: Readonly<LeverValues>;
  readonly buyerLeverEvaluations: Readonly<
    Record<LeverId, BuyerLeverEvaluation>
  >;
  readonly buyerAvgScore: number | null;
  readonly buyerTier: BuyerRoundTier;
  readonly buyerResponseText: string;
  readonly governanceLabel: string;
}
