import type { ModelUpdateScenario } from "../_lib/model-update-types";
import { validateModelUpdateScenarios } from "../_lib/validate-model-update-scenarios";

export const MODEL_UPDATE_SCENARIOS: readonly ModelUpdateScenario[] = [
  {
    id: "mur-1",
    triggerEvent: "A major customer representing roughly 15% of revenue announces it will not renew its contract at the end of this quarter, citing an in-house alternative it has built internally.",
    financialUnit: "$M",
    priorPeriodActuals: { revenue: 800, opex: 420 },
    assumptions: [
      {
        id: "revenueGrowthRate", label: "Revenue Growth Rate", unit: "%",
        min: -15, max: 15, step: 0.5, startingValue: 8, referenceValue: -6, toleranceAmount: 1.5,
        revisionEvidence: "The departing customer represents roughly 15% of current revenue, and no replacement contract or offsetting new business has been announced.",
        reasoning: "Losing 15% of revenue outright is a meaningfully larger hit than the prior 8% growth assumption can absorb — a straightforward way to approximate the impact is roughly subtracting that lost revenue share from the growth rate, landing around -6% rather than continued growth.",
      },
      {
        id: "grossMarginPercent", label: "Gross Margin", unit: "%",
        min: 20, max: 60, step: 0.5, startingValue: 38, referenceValue: 38, toleranceAmount: 1,
        revisionEvidence: "The announcement contains no change to pricing, product mix, supplier costs, or the unit economics of the customers that remain.",
        reasoning: "There's no information here suggesting the company's cost structure or pricing on remaining customers changes — losing one customer doesn't inherently affect the margin earned on the business that remains, so this assumption is left unchanged.",
      },
      {
        id: "opexGrowthRate", label: "Opex Growth Rate", unit: "%",
        min: -15, max: 15, step: 0.5, startingValue: 6, referenceValue: 6, toleranceAmount: 1,
        revisionEvidence: "Management has not announced layoffs, spending reductions, hiring changes, or another immediate operating-cost response to the customer loss.",
        reasoning: "Nothing in the trigger event suggests an immediate change to spending plans — cost structure typically doesn't adjust instantly to a revenue loss, so this stays at the original assumption for this forecast period.",
      },
    ],
    resultSummary: "Only one of the three assumptions actually needed to move here — the customer loss is purely a revenue-line event with no immediate read-through to margins or costs. It's a good reminder not to reflexively adjust every assumption just because news arrived; only revise what the evidence actually supports.",
  },
  {
    id: "mur-2",
    triggerEvent: "A key raw material input the company relies on has seen a sustained 25% price increase due to a global supply shortage, with no clear resolution expected this year.",
    financialUnit: "$M",
    priorPeriodActuals: { revenue: 600, opex: 250 },
    assumptions: [
      {
        id: "revenueGrowthRate", label: "Revenue Growth Rate", unit: "%",
        min: -15, max: 15, step: 0.5, startingValue: 7, referenceValue: 7, toleranceAmount: 1,
        revisionEvidence: "The news concerns input costs only. There is no indication yet of weaker customer demand, lost volume, or a change in sales expectations.",
        reasoning: "A cost-side shock doesn't directly change how much customers are buying — absent any information about the company passing costs through via price increases that could affect demand, top-line growth is left unchanged.",
      },
      {
        id: "grossMarginPercent", label: "Gross Margin", unit: "%",
        min: 20, max: 60, step: 0.5, startingValue: 44, referenceValue: 36, toleranceAmount: 1.5,
        revisionEvidence: "The affected raw material is a meaningful production input, its cost has risen 25%, and the shortage is expected to persist through the forecast period.",
        reasoning: "A sustained, unresolved 25% increase in a key input cost hits gross margin directly and significantly — an 8-point compression reflects that this isn't a minor, temporary blip but a real structural cost increase the company will likely absorb, at least in the near term.",
      },
      {
        id: "opexGrowthRate", label: "Opex Growth Rate", unit: "%",
        min: -15, max: 15, step: 0.5, startingValue: 5, referenceValue: 5, toleranceAmount: 1,
        revisionEvidence: "The cost increase is tied to a raw material used in production. No change to corporate overhead, sales spending, R&D, or other operating expenses has been announced.",
        reasoning: "Raw material costs typically sit within cost of goods sold, not operating expenses — this line generally shouldn't move in response to a materials cost shock, since it's a different part of the cost structure entirely.",
      },
    ],
    resultSummary: "This scenario isolates gross margin as the assumption that actually mattered — it's worth noticing that a cost shock doesn't automatically mean cutting revenue growth too, since customers buying the product is a separate question from what it costs to produce it. Conflating the two is a common modeling mistake.",
  },
  {
    id: "mur-3",
    triggerEvent: "Management announces a company-wide restructuring, including a hiring freeze and a targeted 10% reduction in corporate headcount, aimed at improving profitability over the next two quarters.",
    financialUnit: "$M",
    priorPeriodActuals: { revenue: 900, opex: 480 },
    assumptions: [
      {
        id: "revenueGrowthRate", label: "Revenue Growth Rate", unit: "%",
        min: -15, max: 15, step: 0.5, startingValue: 5, referenceValue: 3, toleranceAmount: 1.5,
        revisionEvidence: "The restructuring includes a company-wide hiring freeze, limiting planned headcount additions during the forecast period even though the announced reductions are concentrated in corporate roles.",
        reasoning: "A hiring freeze and headcount reduction can modestly slow growth if it touches sales or customer-facing roles, so a small trim to the growth assumption is reasonable — but this isn't a demand-side shock, so the reduction should be modest, not dramatic.",
      },
      {
        id: "grossMarginPercent", label: "Gross Margin", unit: "%",
        min: 20, max: 60, step: 0.5, startingValue: 40, referenceValue: 40, toleranceAmount: 1,
        revisionEvidence: "The announced restructuring is focused on corporate headcount and overhead rather than manufacturing costs, supplier pricing, or product economics.",
        reasoning: "This is described as a corporate restructuring focused on overhead, not a change to production costs or unit economics — gross margin is left unchanged since nothing here touches cost of goods sold.",
      },
      {
        id: "opexGrowthRate", label: "Opex Growth Rate", unit: "%",
        min: -15, max: 15, step: 0.5, startingValue: 7, referenceValue: -8, toleranceAmount: 1.5,
        revisionEvidence: "Management is targeting a 10% reduction in corporate headcount alongside an immediate hiring freeze, with the stated objective of lowering the operating-cost base over the next two quarters.",
        reasoning: "This is the assumption the news is directly about — a hiring freeze plus a 10% headcount cut in corporate roles should show up as a real, negative revision to operating expense growth, not just a minor tweak, since it's the explicit target of the announcement.",
      },
    ],
    resultSummary: "Here, opex is clearly the primary lever, with only a small secondary effect on revenue growth — worth noticing that a restructuring aimed at cost savings can still modestly hurt growth through reduced hiring capacity even though gross margin was untouched. Real news events often ripple into more than one place, just unevenly.",
  },
  {
    id: "mur-4",
    triggerEvent: "A new, well-funded competitor launches a directly competing product at a 20% lower price point, and the company issues no immediate response or commentary.",
    financialUnit: "$M",
    priorPeriodActuals: { revenue: 700, opex: 350 },
    assumptions: [
      {
        id: "revenueGrowthRate", label: "Revenue Growth Rate", unit: "%",
        min: -15, max: 15, step: 0.5, startingValue: 9, referenceValue: 2, toleranceAmount: 1.5,
        revisionEvidence: "The new entrant is well funded, directly targets the same customers, and is pricing its competing product 20% below the company's current offer.",
        reasoning: "A well-funded competitor undercutting price by 20% with no company response is a real threat to both new customer growth and possibly retention — a substantial cut to the growth assumption reflects that this is a serious, not minor, competitive threat.",
      },
      {
        id: "grossMarginPercent", label: "Gross Margin", unit: "%",
        min: 20, max: 60, step: 0.5, startingValue: 46, referenceValue: 41, toleranceAmount: 1.5,
        revisionEvidence: "The competitor's 20% price discount creates meaningful pressure on the company's ability to maintain current pricing if it needs to defend customer retention, although management has not yet announced its response.",
        reasoning: "If the company eventually needs to respond competitively — most likely by matching some of that pricing pressure to retain customers — that would compress margin even before any official announcement, so a meaningful reduction here reflects the likely defensive response, not just the immediate news itself.",
      },
      {
        id: "opexGrowthRate", label: "Opex Growth Rate", unit: "%",
        min: -15, max: 15, step: 0.5, startingValue: 6, referenceValue: 6, toleranceAmount: 1,
        revisionEvidence: "The company has not announced additional marketing, sales, R&D, hiring, restructuring, or another explicit spending response to the competitive launch.",
        reasoning: "There's no indication yet of any specific spending response, like increased marketing or R&D investment — since the company hasn't even issued commentary, this assumption is left at its original level rather than guessing at a specific reactive spending plan.",
      },
    ],
    resultSummary: "This is the most severe scenario of the four — both revenue growth and margin needed real downward revisions, since a credible pricing threat plausibly hits both new customer acquisition and the company's ability to defend its own pricing. Notice, though, that opex was still left unchanged — even a serious threat shouldn't be modeled as touching every line item by default; only revise what the specific evidence actually supports.",
  },
];

validateModelUpdateScenarios(MODEL_UPDATE_SCENARIOS);
