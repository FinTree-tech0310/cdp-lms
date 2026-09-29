import type { ChartScenario } from "../_lib/read-the-chart-types";
import { validateChartScenarios } from "../_lib/validate-chart-scenarios";

const AUTHORED_CHART_SCENARIOS = [
  {
    id: "chart-1",
    companyContext:
      "A mid-cap software company reports quarterly results after months of steady investor optimism.",
    reportedQuarterResult: "beat",
    reportedQuarterNote:
      "Reported revenue and earnings came in above consensus expectations for the quarter.",
    pricePoints: [
      { relativeDay: -5, price: 60 },
      { relativeDay: -4, price: 60.5 },
      { relativeDay: -3, price: 61 },
      { relativeDay: -2, price: 61 },
      { relativeDay: -1, price: 61.5 },
      { relativeDay: 0, price: 62 },
      { relativeDay: 1, price: 71 },
      { relativeDay: 2, price: 73 },
      { relativeDay: 3, price: 74 },
      { relativeDay: 4, price: 75 },
      { relativeDay: 5, price: 76 },
    ],
    correctOutcome: "beatAndRaised",
    explanation:
      "A sharp, sustained jump immediately after earnings that keeps climbing over the following days is the classic signature of good news on both fronts. The market isn't just reacting to a strong reported quarter — it is re-rating the stock because the forward outlook improved as well.",
    movementDescriptionForScreenReaders:
      "The price was flat to slightly rising before earnings, then jumped sharply upward immediately after the earnings release and continued climbing steadily over the following days.",
  },
  {
    id: "chart-2",
    companyContext:
      "An industrial equipment maker reports results after a quarter where investors were watching order backlogs closely.",
    reportedQuarterResult: "beat",
    reportedQuarterNote:
      "The company reported quarterly revenue and earnings above consensus expectations.",
    pricePoints: [
      { relativeDay: -5, price: 34 },
      { relativeDay: -4, price: 34 },
      { relativeDay: -3, price: 34.5 },
      { relativeDay: -2, price: 34 },
      { relativeDay: -1, price: 33.5 },
      { relativeDay: 0, price: 34 },
      { relativeDay: 1, price: 37 },
      { relativeDay: 2, price: 33 },
      { relativeDay: 3, price: 29 },
      { relativeDay: 4, price: 27.5 },
      { relativeDay: 5, price: 27 },
    ],
    correctOutcome: "beatAndCut",
    explanation:
      "The first trading reaction after earnings reflects enthusiasm about the headline beat, but the sharp reversal over the following days shows that the forward outlook ultimately mattered more. Once investors digested the weaker guidance, the value of the quarter that had already happened was overwhelmed by concern about what comes next.",
    movementDescriptionForScreenReaders:
      "The price was roughly flat before earnings, jumped upward immediately after the release, then reversed sharply and declined over the following days, eventually ending well below where it started.",
  },
  {
    id: "chart-3",
    companyContext:
      "A consumer goods company reports quarterly results amid growing concerns about weakening demand in its category.",
    reportedQuarterResult: "miss",
    reportedQuarterNote:
      "Quarterly revenue and earnings came in below consensus expectations.",
    pricePoints: [
      { relativeDay: -5, price: 45 },
      { relativeDay: -4, price: 44 },
      { relativeDay: -3, price: 43.5 },
      { relativeDay: -2, price: 43 },
      { relativeDay: -1, price: 42.5 },
      { relativeDay: 0, price: 42 },
      { relativeDay: 1, price: 36 },
      { relativeDay: 2, price: 34 },
      { relativeDay: 3, price: 33 },
      { relativeDay: 4, price: 32 },
      { relativeDay: 5, price: 31.5 },
    ],
    correctOutcome: "missedAndCut",
    explanation:
      "A decline heading into earnings followed by a sharp drop and sustained weakness afterward is a strong negative signal. Investors were already becoming cautious before the release, and the combination of a quarterly miss and weaker forward guidance reinforced those concerns rather than resetting expectations upward.",
    movementDescriptionForScreenReaders:
      "The price was already drifting downward before earnings, then dropped sharply immediately after the release and continued declining over the following days.",
  },
  {
    id: "chart-4",
    companyContext:
      "A specialty retailer reports results after a difficult prior quarter had already lowered expectations considerably.",
    reportedQuarterResult: "miss",
    reportedQuarterNote:
      "The reported quarter still came in below consensus expectations despite already-low expectations going into the release.",
    pricePoints: [
      { relativeDay: -5, price: 20 },
      { relativeDay: -4, price: 19.5 },
      { relativeDay: -3, price: 19 },
      { relativeDay: -2, price: 18.5 },
      { relativeDay: -1, price: 18 },
      { relativeDay: 0, price: 18 },
      { relativeDay: 1, price: 16 },
      { relativeDay: 2, price: 19 },
      { relativeDay: 3, price: 22 },
      { relativeDay: 4, price: 24 },
      { relativeDay: 5, price: 25 },
    ],
    correctOutcome: "missedAndRaised",
    explanation:
      "The initial decline after the miss makes sense, but the strong reversal and sustained climb afterward shows that investors ultimately cared more about the improved forward outlook. A raised guide can outweigh a weak historical quarter, especially when expectations were already depressed before the release.",
    movementDescriptionForScreenReaders:
      "The price was declining before earnings, fell further immediately after the release, then reversed direction and climbed strongly over the following days, eventually ending well above where it started.",
  },
  {
    id: "chart-5",
    companyContext:
      "A large, stable telecommunications company reports quarterly results with no major surprises expected by the market.",
    reportedQuarterResult: "inline",
    reportedQuarterNote:
      "Revenue and earnings were approximately in line with consensus expectations.",
    pricePoints: [
      { relativeDay: -5, price: 55 },
      { relativeDay: -4, price: 55.2 },
      { relativeDay: -3, price: 54.8 },
      { relativeDay: -2, price: 55.1 },
      { relativeDay: -1, price: 55 },
      { relativeDay: 0, price: 55 },
      { relativeDay: 1, price: 55.3 },
      { relativeDay: 2, price: 54.9 },
      { relativeDay: 3, price: 55.2 },
      { relativeDay: 4, price: 55 },
      { relativeDay: 5, price: 55.1 },
    ],
    correctOutcome: "inlineNoSurprise",
    explanation:
      "Minor, directionless movement both before and after earnings — with no sustained move either way — is consistent with a release that gave investors little reason to change their expectations. When reported results and the outlook broadly match what the market already expected, there may simply be very little new information to price in.",
    movementDescriptionForScreenReaders:
      "The price stayed essentially flat both before and after earnings, with only small fluctuations and no sustained move in either direction.",
  },
  {
    id: "chart-6",
    companyContext:
      "A fast-growing cloud infrastructure company reports results after weeks of rising investor anticipation ahead of the print.",
    reportedQuarterResult: "beat",
    reportedQuarterNote:
      "The company reported quarterly results above consensus expectations.",
    pricePoints: [
      { relativeDay: -5, price: 88 },
      { relativeDay: -4, price: 90 },
      { relativeDay: -3, price: 92 },
      { relativeDay: -2, price: 94 },
      { relativeDay: -1, price: 96 },
      { relativeDay: 0, price: 98 },
      { relativeDay: 1, price: 100 },
      { relativeDay: 2, price: 101 },
      { relativeDay: 3, price: 101.5 },
      { relativeDay: 4, price: 102 },
      { relativeDay: 5, price: 102 },
    ],
    correctOutcome: "beatAndRaised",
    explanation:
      "This looks different from the dramatic jump of a typical positive surprise because expectations had already been building before earnings. The stock continues higher after the release, but the move is modest and eventually levels off. Strong results and stronger guidance can still produce a restrained reaction when investors had already anticipated much of the good news.",
    movementDescriptionForScreenReaders:
      "The price climbed steadily for several days before earnings, continued rising modestly after the earnings release, then leveled off at a higher level.",
  },
  {
    id: "chart-7",
    companyContext:
      "A healthcare services company reports quarterly results that draw an initially enthusiastic reaction from the market.",
    reportedQuarterResult: "beat",
    reportedQuarterNote:
      "Reported quarterly revenue and earnings came in above consensus expectations.",
    pricePoints: [
      { relativeDay: -5, price: 40 },
      { relativeDay: -4, price: 40 },
      { relativeDay: -3, price: 40.5 },
      { relativeDay: -2, price: 40 },
      { relativeDay: -1, price: 40 },
      { relativeDay: 0, price: 40 },
      { relativeDay: 1, price: 46 },
      { relativeDay: 2, price: 45 },
      { relativeDay: 3, price: 41 },
      { relativeDay: 4, price: 38 },
      { relativeDay: 5, price: 37 },
    ],
    correctOutcome: "beatAndCut",
    explanation:
      "The initial post-earnings jump reflects enthusiasm about the headline beat, but the multi-day fade shows that enthusiasm did not survive a fuller review of the outlook. As analysts and investors absorbed the weaker guidance, the stock gave back the entire initial move and eventually fell below its pre-earnings level.",
    movementDescriptionForScreenReaders:
      "The price was flat before earnings, jumped sharply immediately after the release, then declined over the following days and eventually fell below where it started.",
  },
  {
    id: "chart-8",
    companyContext:
      "An automotive parts supplier reports quarterly results during a period of broader concern about the industry's near-term demand.",
    reportedQuarterResult: "miss",
    reportedQuarterNote:
      "The company reported quarterly results below consensus expectations.",
    pricePoints: [
      { relativeDay: -5, price: 28 },
      { relativeDay: -4, price: 27.8 },
      { relativeDay: -3, price: 27.5 },
      { relativeDay: -2, price: 27.3 },
      { relativeDay: -1, price: 27 },
      { relativeDay: 0, price: 26.8 },
      { relativeDay: 1, price: 26 },
      { relativeDay: 2, price: 24.5 },
      { relativeDay: 3, price: 23 },
      { relativeDay: 4, price: 21.5 },
      { relativeDay: 5, price: 20 },
    ],
    correctOutcome: "missedAndCut",
    explanation:
      "Unlike a single dramatic selloff, this is a slower deterioration. The stock was already weakening before the release and then continued falling at an accelerating pace afterward. That pattern is consistent with a quarterly miss followed by a weaker outlook that causes analysts to keep revising their expectations downward over subsequent days.",
    movementDescriptionForScreenReaders:
      "The price was already declining slowly before earnings, weakened further immediately after the release, then declined at an accelerating pace over the following days.",
  },
] satisfies readonly ChartScenario[];

validateChartScenarios(AUTHORED_CHART_SCENARIOS);

export const CHART_SCENARIOS: readonly ChartScenario[] =
  AUTHORED_CHART_SCENARIOS;
