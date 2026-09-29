import type {
  InvestorArchetype,
  InvestorMatchScenario,
  InvestorOffer,
} from "../_data/investor-match-scenarios";
import { selectUnseenItem, updateSeenItemIds } from "../../_lib/select-unseen-item";

function ordersMatch(left: readonly InvestorArchetype[], right: readonly InvestorArchetype[]) {
  return left.length === right.length && left.every((archetype, index) => archetype === right[index]);
}

export function shuffleOffers(
  offers: readonly InvestorOffer[],
  previousOrder: readonly InvestorArchetype[] = [],
): InvestorOffer[] {
  const shuffled = [...offers];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  if (
    shuffled.length > 1 &&
    ordersMatch(
      shuffled.map((offer) => offer.archetype),
      previousOrder,
    )
  ) {
    const firstOffer = shuffled.shift();
    if (firstOffer) shuffled.push(firstOffer);
  }

  return shuffled;
}

export function selectInvestorMatchScenario(
  scenarios: readonly InvestorMatchScenario[],
  recentScenarioIds: readonly string[],
): InvestorMatchScenario {
  return selectUnseenItem(
    scenarios,
    recentScenarioIds,
    "Investor Match requires at least one scenario.",
  );
}

export function updateRecentInvestorMatchIds(
  recentScenarioIds: readonly string[],
  scenarioId: string,
  scenarioCount: number,
): string[] {
  return updateSeenItemIds(recentScenarioIds, scenarioId, scenarioCount);
}
