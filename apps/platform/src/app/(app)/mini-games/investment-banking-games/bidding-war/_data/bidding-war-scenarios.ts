import type { BiddingWarScenario } from "../_lib/bidding-war-types";

export const biddingWarScenarios: BiddingWarScenario[] = [
  {
    id: "bw-1",
    assetName: "SignalForge",
    dealContext:
      "Your client, a large enterprise software company, is bidding for SignalForge, a workflow-automation SaaS business that would fill an important product gap in its platform. The strategic fit is real, and management believes there are meaningful cross-sell opportunities — but another software buyer is also pushing hard in the auction. Your client has approved a firm maximum bid and expects you to stay disciplined even if the competitive process heats up.",
    assetReferenceValue: 128,
    learnerMaxAuthorizedBid: 145,
    startingBid: 90,
    minIncrement: 5,
    bidStep: 1,
    competitorMaxBid: 124,
    competitorBidSchedule: [100, 112, 120],
    maxRounds: 3,
    outcomeCompetitorDropped:
      "The competing bidder declines to top your latest offer. SignalForge is yours if your client proceeds at the price you submitted.",
    endingWonReasonable:
      "You won SignalForge while keeping the purchase price within your team's internal valuation benchmark. The auction became competitive, but you captured the strategic asset without letting the desire to win override the economics your client had underwritten.",
    endingWonOverpaid:
      "You won SignalForge — but at a price above your team's internal valuation benchmark. The strategic rationale is still there, yet your client is now relying on more aggressive synergy assumptions to justify the acquisition. You won the auction, but made the investment case harder to defend.",
    endingLostToCompetitor:
      "The competing bidder retained the lead once your remaining bidding room was exhausted. SignalForge went elsewhere. Your client lost a strategically useful asset, but you respected the limits of the mandate rather than inventing additional value simply because another bidder kept raising the price.",
    endingWalkedAway:
      "You chose to leave the auction while you still had authorization to continue. The competing bidder ultimately secured SignalForge. Your client preserved its capital and avoided being pulled deeper into a competitive process, though it also gave up the chance to test how close the rival was to its own limit.",
  },
  {
    id: "bw-2",
    assetName: "Atlas Motion Components",
    dealContext:
      "Your client is an industrial equipment manufacturer pursuing Atlas Motion Components, a specialized maker of precision motion-control systems. Owning Atlas would bring an important supplier in-house and create meaningful procurement and cross-selling synergies. A rival strategic buyer sees many of the same benefits, making the auction increasingly competitive. Your client's investment committee has approved a ceiling, but management is highly motivated to win.",
    assetReferenceValue: 230,
    learnerMaxAuthorizedBid: 260,
    startingBid: 160,
    minIncrement: 10,
    bidStep: 5,
    competitorMaxBid: 225,
    competitorBidSchedule: [180, 200, 220],
    maxRounds: 3,
    outcomeCompetitorDropped:
      "The rival strategic buyer decides the economics no longer justify another increase and withdraws from the process. Your latest bid becomes the winning offer.",
    endingWonReasonable:
      "You secured Atlas Motion Components at a price that remained within your client's underwriting benchmark. The acquisition still captures the supplier and strategic synergies management wanted without requiring the deal team to stretch the valuation case beyond what it originally supported.",
    endingWonOverpaid:
      "You secured Atlas Motion Components, but the final bid exceeded the value supported by your client's underwriting. Management got the strategic asset it wanted, yet the acquisition now needs unusually strong synergy realization to earn an acceptable return. Competitive pressure turned a good strategic idea into a much more demanding investment.",
    endingLostToCompetitor:
      "The rival buyer finished the auction in the lead after your client's bidding capacity was exhausted. Atlas went to the competitor. Losing a strategically attractive asset is frustrating, but the investment committee's authorization existed precisely to prevent auction momentum from replacing valuation discipline.",
    endingWalkedAway:
      "You exited the Atlas auction while your client still had room to raise. The rival ultimately acquired the business. Walking away protected capital and stopped the auction from dictating your valuation, although management will have to pursue the strategic opportunity another way.",
  },
  {
    id: "bw-3",
    assetName: "SunHarbor Renewables Portfolio",
    dealContext:
      "Your client, an infrastructure investment fund, is bidding for SunHarbor, a portfolio of contracted solar and battery-storage assets. The portfolio offers predictable long-term cash flows and is a strong fit with the fund's mandate, which has attracted another large infrastructure investor into the process. Because returns are highly sensitive to entry valuation, your investment committee has given the deal team a strict maximum authorization.",
    assetReferenceValue: 520,
    learnerMaxAuthorizedBid: 555,
    startingBid: 450,
    minIncrement: 10,
    bidStep: 5,
    competitorMaxBid: 515,
    competitorBidSchedule: [470, 495, 510],
    maxRounds: 3,
    outcomeCompetitorDropped:
      "The competing infrastructure fund declines to make another bid. Your latest offer is now the highest remaining proposal for SunHarbor.",
    endingWonReasonable:
      "You won SunHarbor without pushing the purchase price beyond the fund's internal valuation benchmark. The auction tightened the expected return, but the investment case remains consistent with the economics originally approved by the investment committee.",
    endingWonOverpaid:
      "You won the SunHarbor portfolio, but the final price exceeded the fund's internal valuation benchmark. The assets still generate attractive contracted cash flows, yet paying more upfront compresses the return your investors can expect. The auction was won; the investment economics became weaker.",
    endingLostToCompetitor:
      "The competing fund remained in front when your available bidding capacity ran out. SunHarbor was awarded elsewhere. The loss is disappointing, but infrastructure returns are especially sensitive to entry price — maintaining discipline protected your fund from winning an asset at economics it had not approved.",
    endingWalkedAway:
      "You voluntarily stepped out while additional bidding capacity remained. The rival investor ultimately won SunHarbor. Your fund gave up a high-quality portfolio but preserved the return discipline behind its original valuation rather than allowing scarcity to dictate the price.",
  },
  {
    id: "bw-4",
    assetName: "Crescent Ambulatory Network",
    dealContext:
      "Your client, a national healthcare services platform, is bidding for Crescent Ambulatory Network, a regional group of outpatient centers that would give it immediate scale in an attractive new market. Comparable regional platforms rarely come to market, which has drawn another strategic buyer into the auction. Management strongly wants the footprint, but the board has approved only a modest amount of room above the deal team's valuation.",
    assetReferenceValue: 98,
    learnerMaxAuthorizedBid: 102,
    startingBid: 70,
    minIncrement: 4,
    bidStep: 1,
    competitorMaxBid: 100,
    competitorBidSchedule: [82, 92, 100, 100],
    maxRounds: 4,
    outcomeCompetitorDropped:
      "The competing healthcare buyer decides not to increase its offer again. Your client's latest bid is now the winning proposal for Crescent.",
    endingWonReasonable:
      "You secured Crescent while remaining within the valuation supported by your deal team's analysis. Your client gained the regional platform it wanted without allowing the scarcity of the asset to push the acquisition beyond the economics originally underwritten.",
    endingWonOverpaid:
      "You won Crescent, but scarcity pressure pushed the final bid above your team's valuation benchmark. Management achieved its geographic-expansion goal, yet the higher entry price reduces the financial cushion in the deal. The strategic rationale survived; the economics became less forgiving.",
    endingLostToCompetitor:
      "The competing buyer held the lead when your client's remaining authorization could no longer support another valid raise. Crescent went to the rival. Your team respected the board-approved ceiling rather than treating a strategically attractive asset as valuable at any price.",
    endingWalkedAway:
      "You chose to withdraw while another authorized bid was still available. The rival buyer ultimately secured Crescent. Your client lost a scarce regional platform, but you prevented competitive pressure from automatically becoming a reason to keep paying more.",
  },
];
