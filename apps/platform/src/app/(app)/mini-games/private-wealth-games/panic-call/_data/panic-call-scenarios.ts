export interface PanicCallScenario {
  id: string;
  clientAvatarSeed: string;
  clientName: string;
  marketContext: string;
  panicMessage: string;
  declineOutcome: string;
  responses: {
    holdAndReassure: { outcome: string };
    partialRebalance: { outcome: string };
    executeSell: { outcome: string };
  };
}

export const PANIC_CALL_SCENARIOS: readonly PanicCallScenario[] = [
  {
    id: "pc-1",
    clientAvatarSeed: "client-robert-68",
    clientName: "Robert",
    marketContext:
      "Broad markets dropped 12% over the past week amid recession fears, with no company-specific news involved.",
    panicMessage:
      "I can't watch this anymore. Sell everything. I don't care what it costs, I just want to stop the bleeding.",
    declineOutcome:
      "Robert couldn't reach you and grew more anxious over the weekend. By Monday he'd called another advisor for a second opinion. He didn't make a major portfolio change, but you spent the next month rebuilding confidence in a relationship that had suddenly felt less dependable.",
    responses: {
      holdAndReassure: {
        outcome:
          "Markets recovered most of the decline within four months, and Robert's portfolio ended the year above where it started. Staying invested worked financially, but the conversation also exposed how uncomfortable he was with the portfolio's existing volatility. The plan survived; his confidence in it needed more work.",
      },
      partialRebalance: {
        outcome:
          "Moving 15% into more conservative holdings gave Robert something tangible to feel safer about. He participated in most of the recovery, though the portfolio finished slightly behind where it would have if nothing changed. More importantly, his anxiety fell enough that he stayed committed to the revised plan.",
      },
      executeSell: {
        outcome:
          "Robert felt immediate relief after moving entirely to cash. Markets then recovered, and he waited five months before feeling comfortable enough to reinvest. He eventually re-entered near where he'd originally sold, turning a temporary decline into a permanent loss without gaining lasting peace of mind.",
      },
    },
  },
  {
    id: "pc-2",
    clientAvatarSeed: "client-diane-62",
    clientName: "Diane",
    marketContext:
      "Markets dropped 9% over two weeks. Diane is planning to downsize her home in 18 months and expects to need roughly $80K from this account for the move.",
    panicMessage:
      "With the house move coming up, I'm terrified this money won't be there when I need it. I want out of everything right now.",
    declineOutcome:
      "Diane couldn't reach you and called her bank instead. She moved the entire investment account into a savings product before anyone separated the $80K she actually needed soon from the rest of her long-term retirement assets.",
    responses: {
      holdAndReassure: {
        outcome:
          "Markets recovered within three months, so Diane ultimately had enough for the move. But the result depended on fortunate timing. The $80K had a real near-term purpose, and leaving all of it exposed meant taking market risk with money she could not easily postpone using.",
      },
      partialRebalance: {
        outcome:
          "You moved the $80K needed for the home transition into cash-equivalent holdings and left the longer-term retirement assets invested. Diane's move proceeded without market risk attached to the required funds, while most of the portfolio still participated in the recovery.",
      },
      executeSell: {
        outcome:
          "Diane felt completely protected heading into the move, but she also liquidated assets she did not expect to touch for another decade or more. That long-term portion missed the recovery, creating a cost unrelated to the actual housing need.",
      },
    },
  },
  {
    id: "pc-3",
    clientAvatarSeed: "client-marcus-45",
    clientName: "Marcus",
    marketContext:
      "Marcus holds a concentrated position in one company. The stock dropped 35% this week after the company disclosed an accounting investigation — this is company-specific, not a broad market decline.",
    panicMessage:
      "This isn't like a normal dip, is it? I want out of this stock entirely, today.",
    declineOutcome:
      "Marcus couldn't reach you, reviewed the company's disclosure himself and sold the position later that day. He acted without your input, but his decision was based on a real company-specific development rather than general market panic. The larger issue was that you weren't part of an important portfolio decision when he wanted advice.",
    responses: {
      holdAndReassure: {
        outcome:
          "The investigation deepened over the following months and the stock fell another 40% before the company eventually restructured. Treating the decline like ordinary market volatility proved costly because the underlying facts had genuinely changed.",
      },
      partialRebalance: {
        outcome:
          "Selling half the position reduced Marcus's exposure while leaving some upside if the situation stabilized. The stock eventually fell further, so the remaining position still lost value, but the damage was materially smaller than if he had stayed fully invested.",
      },
      executeSell: {
        outcome:
          "Marcus avoided most of the subsequent decline. The company later settled the investigation and the stock partially recovered, though nowhere near its previous level. In this case, a full exit was defensible because the risk came from new company-specific information rather than market emotion alone.",
      },
    },
  },
  {
    id: "pc-4",
    clientAvatarSeed: "client-yuki-31",
    clientName: "Yuki",
    marketContext:
      "Broad markets dropped 10% over three trading days on macroeconomic headlines. Yuki is 31, has a stable job and has never experienced a major market decline as an investor.",
    panicMessage:
      "Is this normal? Everyone online is saying to get out now before it gets worse. What do I do?",
    declineOutcome:
      "Yuki couldn't reach you and spent the evening reading investing forums. The next morning she moved a large portion of her account into cash based mostly on advice from strangers rather than her own long-term plan.",
    responses: {
      holdAndReassure: {
        outcome:
          "Markets recovered within two months. With more than three decades before retirement, the decline became a small event in Yuki's long-term record. Walking her through the size of previous declines and the role of her time horizon did more to calm her than simply telling her not to worry.",
      },
      partialRebalance: {
        outcome:
          "Moving part of the portfolio into cash reduced Yuki's anxiety, but the change also reduced her participation in the strongest part of the recovery. For a client with decades before needing the money, the compromise created a measurable long-term cost mainly to relieve short-term fear.",
      },
      executeSell: {
        outcome:
          "Yuki felt safer immediately, but she locked in the decline and remained hesitant to re-enter while markets recovered. The emotional relief was real, but so was the long-term cost of abandoning a strategy built for a much longer horizon.",
      },
    },
  },
  {
    id: "pc-5",
    clientAvatarSeed: "client-samuel-54",
    clientName: "Samuel",
    marketContext:
      "Markets dropped 14% amid broader economic uncertainty. Samuel was unexpectedly laid off three days ago and does not know how long his job search will take.",
    panicMessage:
      "Between losing my job and watching this account drop, I feel like I need to get everything into cash just to feel safe right now.",
    declineOutcome:
      "Samuel couldn't reach you immediately, so he spoke with the firm's service team and moved enough money into cash to cover several months of expenses. The immediate liquidity problem was addressed, but he later told you he wished he'd been able to talk through the bigger portfolio decision with you directly during an unusually stressful week.",
    responses: {
      holdAndReassure: {
        outcome:
          "Markets recovered within a few months, but Samuel's job search lasted nearly five months. Because no additional liquidity had been created, he eventually had to sell some investments to cover expenses. Staying fully invested protected the long-term allocation, but it underestimated a real change in his short-term cash needs.",
      },
      partialRebalance: {
        outcome:
          "You moved roughly six months of expenses into cash and left the rest invested. Samuel's job search lasted five months, and the reserve covered the gap without forcing additional portfolio sales. Most of the portfolio still participated in the market recovery.",
      },
      executeSell: {
        outcome:
          "Samuel moved completely to cash and felt far more secure. He found a new job after seven weeks, much sooner than feared. The full liquidation turned out to be more defensive than necessary and reduced his participation in the subsequent market recovery, though the emotional value of certainty during unemployment was real.",
      },
    },
  },
  {
    id: "pc-6",
    clientAvatarSeed: "client-asha-57",
    clientName: "Asha",
    marketContext:
      "A rapid rise in interest rates pushed Asha's high-quality bond fund down 8%. Her equity holdings are relatively stable, and she has no planned withdrawals from the bond allocation for at least five years.",
    panicMessage:
      "I thought bonds were supposed to be safe. They're losing money too. Sell them before this gets worse.",
    declineOutcome:
      "Asha left you a voicemail and decided not to make any changes until she could speak with you the following morning. Her portfolio was unchanged, although she spent an anxious evening wondering whether the fixed-income part of her plan had stopped working.",
    responses: {
      holdAndReassure: {
        outcome:
          "Asha kept the bond allocation. As older holdings matured and the portfolio reinvested at higher yields, income improved and much of the price decline gradually recovered. The experience helped her understand that high-quality bonds can fluctuate even when their long-term role remains intact.",
      },
      partialRebalance: {
        outcome:
          "You shortened part of the bond portfolio's duration, reducing sensitivity to further rate increases while keeping most of the fixed-income allocation in place. Rates stabilized soon afterward, so the change provided some comfort but also reduced some of the benefit when longer-term bonds later recovered.",
      },
      executeSell: {
        outcome:
          "Asha sold the bond fund after the decline and moved to cash. She avoided some additional short-term volatility, but when yields stabilized she missed both the subsequent price recovery and the higher income available from staying invested in the bond market.",
      },
    },
  },
  {
    id: "pc-7",
    clientAvatarSeed: "client-eleanor-66",
    clientName: "Eleanor",
    marketContext:
      "Eleanor retired six months ago. Broad markets are down 15%, but she already holds roughly two years of planned living expenses in cash and short-term reserves outside her growth portfolio.",
    panicMessage:
      "I'm retired now. I can't earn this money back anymore. Shouldn't we just sell the stocks before retirement gets ruined?",
    declineOutcome:
      "Eleanor couldn't reach you that afternoon but decided to wait because her next several months of spending were already covered by cash reserves. She still wanted reassurance, but the existing liquidity plan kept her from feeling forced to act immediately.",
    responses: {
      holdAndReassure: {
        outcome:
          "Eleanor continued funding expenses from the reserve while leaving the growth portfolio invested. Markets recovered over the following year, and she never needed to sell equities during the decline. The cash buffer did exactly what it had been designed to do.",
      },
      partialRebalance: {
        outcome:
          "You reduced equity exposure modestly even though two years of spending were already protected. Eleanor felt safer, but the portfolio participated less fully in the recovery. The change was not disastrous, though it duplicated protection that the existing cash reserve already provided.",
      },
      executeSell: {
        outcome:
          "Eleanor eliminated most of her equity exposure and felt immediate relief. The portfolio became much less volatile, but after the market recovered she faced a different concern: whether the now-conservative allocation could support a retirement that might last several decades.",
      },
    },
  },
  {
    id: "pc-8",
    clientAvatarSeed: "client-leon-49",
    clientName: "Leon",
    marketContext:
      "Markets fell 17%, and Leon has a large margin loan secured against his investment portfolio. The decline has pushed the account close to the brokerage firm's maintenance threshold.",
    panicMessage:
      "They're telling me I could get a margin call if this drops much more. Sell whatever you need to sell. I don't want them liquidating it for me.",
    declineOutcome:
      "Leon couldn't reach you and contacted the brokerage directly. He deposited some outside cash and sold a small portion of the portfolio to increase the account's cushion. The immediate margin risk was reduced, though the broader question of why the portfolio carried so much leverage remained unresolved.",
    responses: {
      holdAndReassure: {
        outcome:
          "Markets fell further before recovering. Leon's account crossed the maintenance threshold, and the brokerage sold positions automatically at depressed prices. The portfolio eventually recovered, but he participated with fewer assets because leverage had removed his ability to simply wait.",
      },
      partialRebalance: {
        outcome:
          "You sold enough holdings to materially reduce the margin balance while keeping the rest of the portfolio invested. Leon still absorbed losses from the downturn, but the account stayed above maintenance requirements and avoided forced liquidation during the worst part of the decline.",
      },
      executeSell: {
        outcome:
          "Leon sold enough of the portfolio to repay the margin loan completely. He gave up more market exposure than was strictly necessary and participated less in the recovery, but he permanently removed the leverage that had turned an ordinary market decline into a potential forced-sale problem.",
      },
    },
  },
];
