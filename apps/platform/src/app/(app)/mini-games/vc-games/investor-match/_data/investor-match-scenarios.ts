export type InvestorArchetype = "fast" | "patient" | "network";

export interface InvestorOfferTerms {
  amount: string;
  timeline: string;
  relationship: string;
}

export interface InvestorOutcome {
  benefit: string;
  tradeoff: string;
}

export interface InvestorOffer {
  archetype: InvestorArchetype;
  terms: InvestorOfferTerms;
  outcome: InvestorOutcome;
}

export interface InvestorMatchScenario {
  id: string;
  founderContext: string;
  offers: readonly InvestorOffer[];
}

export const INVESTOR_OFFER_DETAIL_ROWS: readonly {
  key: keyof InvestorOfferTerms;
  label: string;
}[] = [
  { key: "amount", label: "Money" },
  { key: "timeline", label: "Timing" },
  { key: "relationship", label: "Relationship" },
];

export const INVESTOR_ARCHETYPE_DETAILS: Record<
  InvestorArchetype,
  { title: string; summary: string }
> = {
  fast: {
    title: "Growth Partner",
    summary: "Largest check · quickest close · board involvement",
  },
  patient: {
    title: "Independent Partner",
    summary: "Mid-sized check · longer process · minimal involvement",
  },
  network: {
    title: "Network Partner",
    summary: "Smallest check · focused introductions · minimal governance",
  },
};

export const INVESTOR_MATCH_SCENARIOS: readonly InvestorMatchScenario[] = [
  {
    id: "scenario-1",
    founderContext:
      "Two competitors in your consumer-app category just raised large rounds and are racing to lock in users first. You need to grow quickly without losing your voice in the company or committing to growth you cannot sustain.",
    offers: [
      {
        archetype: "fast",
        terms: {
          amount: "$3M",
          timeline: "Closes in 2 weeks",
          relationship: "Board seat + hiring veto; aggressive user-growth targets",
        },
        outcome: {
          benefit: "You out-marketed both competitors within a quarter and grabbed the early lead.",
          tradeoff:
            "The growth targets pulled you into costly ad spending, and the board now wants that pace maintained even as acquisition costs climb.",
        },
      },
      {
        archetype: "patient",
        terms: {
          amount: "$1.1M",
          timeline: "Closes in 6 weeks",
          relationship: "No board seat; founder retains full decision control",
        },
        outcome: {
          benefit:
            "You kept full control, grew deliberately, and built healthier unit economics than your better-funded competitors.",
          tradeoff:
            "One competitor pulled meaningfully ahead on user numbers while you followed the slower path.",
        },
      },
      {
        archetype: "network",
        terms: {
          amount: "$800K",
          timeline: "Closes in 4 weeks",
          relationship: "No board seat; influencer and app-store introductions",
        },
        outcome: {
          benefit:
            "An app-store feature secured through the introductions produced a meaningful visibility spike.",
          tradeoff:
            "The spike could not fully offset your competitors' larger advertising budgets, leaving you competitive but not clearly ahead.",
        },
      },
    ],
  },
  {
    id: "scenario-2",
    founderContext:
      "Your enterprise product is strong, but deals keep stalling in security and procurement reviews. As a first-time founder, you need credibility and sales capacity without accepting expectations that ignore long enterprise buying cycles.",
    offers: [
      {
        archetype: "fast",
        terms: {
          amount: "$4M",
          timeline: "Closes in 3 weeks",
          relationship: "Board seat + hiring veto; rapid revenue expectations",
        },
        outcome: {
          benefit: "The larger investment gave you substantial runway to keep pursuing enterprise deals.",
          tradeoff:
            "Quarterly targets kept slipping against unavoidable sales cycles, creating persistent tension with a board expecting consumer-style speed.",
        },
      },
      {
        archetype: "patient",
        terms: {
          amount: "$1.3M",
          timeline: "Closes in 2 months",
          relationship: "No board seat; minimal check-ins and no timeline pressure",
        },
        outcome: {
          benefit:
            "You closed your first two enterprise deals on a realistic timeline without pressure to force premature decisions.",
          tradeoff:
            "The smaller check prevented an additional sales hire, and a closely tracked deal went to a better-resourced competitor.",
        },
      },
      {
        archetype: "network",
        terms: {
          amount: "$700K",
          timeline: "Closes in 5 weeks",
          relationship: "No board seat; introductions at 4 target enterprise accounts",
        },
        outcome: {
          benefit:
            "Two introductions became qualified pipeline and one closed within the quarter, directly easing your procurement bottleneck.",
          tradeoff:
            "The smallest check leaves less operating runway, so another fundraising process will begin sooner.",
        },
      },
    ],
  },
  {
    id: "scenario-3",
    founderContext:
      "Your physical product has real demand, but growth requires an expensive manufacturing commitment. You need enough inventory to win distribution without tying up the company in stock that customers may not buy.",
    offers: [
      {
        archetype: "fast",
        terms: {
          amount: "$5M",
          timeline: "Closes in 3 weeks",
          relationship: "Board seat + operational veto; aggressive first production run",
        },
        outcome: {
          benefit:
            "The capital funded a large manufacturing order and helped you beat a competitor to retail shelf space.",
          tradeoff:
            "The board pushed production beyond what early demand supported, leaving significant cash tied up in unsold inventory.",
        },
      },
      {
        archetype: "patient",
        terms: {
          amount: "$1.5M",
          timeline: "Closes in 2 months",
          relationship: "No board seat; founder controls production volume",
        },
        outcome: {
          benefit: "Your conservative production run matched demand closely and sold through cleanly.",
          tradeoff:
            "A larger competitor used the window to secure the retail shelf space you wanted for the next run.",
        },
      },
      {
        archetype: "network",
        terms: {
          amount: "$900K",
          timeline: "Closes in 4 weeks",
          relationship: "No board seat; introductions to 2 lower-cost manufacturers",
        },
        outcome: {
          benefit:
            "A supplier introduction meaningfully improved your margin on every unit you could afford to produce.",
          tradeoff:
            "The smaller investment did not provide enough capital for the larger production run needed to capture more shelf space.",
        },
      },
    ],
  },
  {
    id: "scenario-4",
    founderContext:
      "Your healthtech product needs regulatory approval before launch, and the process is expensive and unpredictable. You need enough capital and specialist support to reach approval without compromising the clinical approach you believe is right.",
    offers: [
      {
        archetype: "fast",
        terms: {
          amount: "$4.5M",
          timeline: "Closes in 3 weeks",
          relationship: "Board seat + clinical veto; startup-style milestone expectations",
        },
        outcome: {
          benefit: "The larger investment comfortably covered the company's regulatory costs.",
          tradeoff:
            "Board pressure for firm launch dates created repeated conflict around clinical decisions and a process whose timing could not be guaranteed.",
        },
      },
      {
        archetype: "patient",
        terms: {
          amount: "$1.4M",
          timeline: "Closes in 2 months",
          relationship: "No board seat; founder controls clinical and launch decisions",
        },
        outcome: {
          benefit: "You retained full control over every clinical decision and protected the approach you believed in.",
          tradeoff:
            "The smaller budget required cuts partway through approval, stretching an already unpredictable timeline.",
        },
      },
      {
        archetype: "network",
        terms: {
          amount: "$750K",
          timeline: "Closes in 5 weeks",
          relationship: "No board seat; introductions to 2 regulatory specialists",
        },
        outcome: {
          benefit:
            "The introduced consultants caught a submission issue early that likely would have caused a costly delay.",
          tradeoff:
            "The smallest check could not fully fund the approval process, requiring another round before launch.",
        },
      },
    ],
  },
  {
    id: "scenario-5",
    founderContext:
      "Your two-person team has early traction, but demand is already exceeding its capacity and neither founder has hired before. You need experienced people quickly without sacrificing hiring quality or leaving the company short of growth capital.",
    offers: [
      {
        archetype: "fast",
        terms: {
          amount: "$3.5M",
          timeline: "Closes in 2 weeks",
          relationship: "Board seat + senior-hire veto; rapid headcount targets",
        },
        outcome: {
          benefit:
            "You hired quickly and had enough capital to compete for experienced candidates while demand accelerated.",
          tradeoff:
            "Pressure to prioritize pace over fit contributed to two failed senior hires that took significant time to unwind.",
        },
      },
      {
        archetype: "patient",
        terms: {
          amount: "$1M",
          timeline: "Closes in 6 weeks",
          relationship: "No board seat; founder controls hiring pace and decisions",
        },
        outcome: {
          benefit: "You hired deliberately, and every early team member performed well in the role.",
          tradeoff:
            "Demand exceeded team capacity during the slower hiring period, leaving meaningful growth on the table.",
        },
      },
      {
        archetype: "network",
        terms: {
          amount: "$650K",
          timeline: "Closes in 4 weeks",
          relationship: "No board seat; introductions to 5 experienced candidates",
        },
        outcome: {
          benefit:
            "Three introductions became strong hires who ramped quickly and directly addressed the founders' lack of hiring experience.",
          tradeoff:
            "The smallest check leaves limited cushion if demand and headcount costs rise faster than expected.",
        },
      },
    ],
  },
];
