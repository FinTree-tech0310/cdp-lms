export type ApproachTag = "disciplined" | "reactive";

export interface TimelineStopOption {
  id: string;
  label: string;
  approachTag: ApproachTag;
  immediateConsequence: string;
}

export interface TimelineStop {
  id: string;
  stopLabel: string;
  yearMarker: string;
  storyBeat: string;
  options: readonly TimelineStopOption[];
}

export interface ClientTimelineScenario {
  id: string;
  clientAvatarSeed: string;
  clientName: string;
  introText: string;
  stops: readonly TimelineStop[];
  endingMostlyDisciplined: string;
  endingMostlyReactive: string;
}

export const CLIENT_TIMELINE_SCENARIOS: readonly ClientTimelineScenario[] = [
  {
    id: "ct-1",
    clientAvatarSeed: "client-elena-voss",
    clientName: "Elena Voss",
    introText:
      "Elena opened her first investment account at 29, shortly after a promotion gave her meaningful disposable income for the first time. You've advised her ever since.",
    stops: [
      {
        id: "ct1-stop1",
        stopLabel: "Market Downturn",
        yearMarker: "Year 3",
        storyBeat:
          "Three years in, markets fall 22% over several months. It is Elena's first serious downturn as an investor, and she asks whether she should stop her monthly contributions until things feel more stable.",
        options: [
          {
            id: "ct1-s1-a",
            label:
              "Keep contributing on schedule while the long-term plan remains unchanged",
            approachTag: "disciplined",
            immediateConsequence:
              "Elena kept contributing even though watching her account fluctuate felt uncomfortable. The decision gave her no immediate emotional relief, but her long-term investment process stayed intact.",
          },
          {
            id: "ct1-s1-b",
            label: "Pause contributions until markets feel more stable",
            approachTag: "reactive",
            immediateConsequence:
              "Elena felt immediate relief after pausing the contributions. Nothing dramatic happened that day — she simply stepped away from the investment schedule until she felt safer.",
          },
        ],
      },
      {
        id: "ct1-stop2",
        stopLabel: "Inheritance",
        yearMarker: "Year 11",
        storyBeat:
          "Elena receives a $180,000 inheritance. A friend recently made a large gain in one technology stock, and Elena is tempted to put a substantial portion of the inheritance into that single company rather than treat the money as part of her existing plan.",
        options: [
          {
            id: "ct1-s2-a",
            label:
              "Integrate the inheritance into her diversified long-term allocation",
            approachTag: "disciplined",
            immediateConsequence:
              "Elena agreed, although she admitted it would be difficult watching from the sidelines if her friend's stock continued climbing.",
          },
          {
            id: "ct1-s2-b",
            label:
              "Allocate 40% of the inheritance to the single stock she is excited about",
            approachTag: "reactive",
            immediateConsequence:
              "The stock climbed another 15% over the next two months. Elena was thrilled and felt that taking the concentrated bet had immediately validated her instinct.",
          },
        ],
      },
      {
        id: "ct1-stop3",
        stopLabel: "Approaching Retirement",
        yearMarker: "Year 24",
        storyBeat:
          "Elena is now 53 and hopes to retire in roughly a decade. Her portfolio has grown substantially and still carries a growth-heavy allocation that suited her younger years. She has not raised the subject of changing it.",
        options: [
          {
            id: "ct1-s3-a",
            label:
              "Proactively discuss gradually reducing risk as retirement gets closer",
            approachTag: "disciplined",
            immediateConsequence:
              "Elena was surprised because the portfolio had been performing well, but after reviewing the shorter horizon she agreed to begin adjusting gradually.",
          },
          {
            id: "ct1-s3-b",
            label:
              "Leave the allocation unchanged because it has performed well and she hasn't requested a change",
            approachTag: "reactive",
            immediateConsequence:
              "Nothing immediately felt wrong. Elena remained comfortable and the portfolio continued participating fully in the market's growth for the time being.",
          },
        ],
      },
    ],
    endingMostlyDisciplined:
      "Across decades, your advice tended to keep Elena's long-term plan in control even when the emotionally easier choice pointed somewhere else. Not every decision felt satisfying in the moment, but the pattern reduced the chance that one exciting market move or one frightening headline could determine the outcome of a goal that took decades to build.",
    endingMostlyReactive:
      "Across Elena's timeline, short-term comfort and recent market experience repeatedly carried more weight than the long-term plan. Some of those choices felt rewarding immediately, but the pattern left more of her future dependent on timing, concentration and emotion than the original strategy was designed to tolerate.",
  },
  {
    id: "ct-2",
    clientAvatarSeed: "client-david-okafor",
    clientName: "David Okafor",
    introText:
      "David has been a client for more than 15 years, beginning when he and his wife first started planning simultaneously for their children's education and their own retirement.",
    stops: [
      {
        id: "ct2-stop1",
        stopLabel: "Sudden Job Loss",
        yearMarker: "Year 4",
        storyBeat:
          "David is laid off unexpectedly. He has four months of expenses saved but has no idea how long the job search will take. He asks whether he should immediately stop retirement contributions and move a large amount of invested money into cash.",
        options: [
          {
            id: "ct2-s1-a",
            label:
              "Build a cash-runway plan first, then adjust contributions only as needed",
            approachTag: "disciplined",
            immediateConsequence:
              "Having an actual runway number gave David something concrete to work with. The uncertainty did not disappear, but the financial response became tied to a plan rather than fear.",
          },
          {
            id: "ct2-s1-b",
            label:
              "Move a large portion of retirement savings into cash immediately, just in case",
            approachTag: "reactive",
            immediateConsequence:
              "David felt safer immediately after increasing cash. The decision removed some uncertainty, although the amount moved was based more on fear than on a defined spending requirement.",
          },
        ],
      },
      {
        id: "ct2-stop2",
        stopLabel: "New Job, Strong Market",
        yearMarker: "Year 5",
        storyBeat:
          "David finds a new job after three months. Markets have been climbing steadily, and seeing recent gains makes him eager to increase risk quickly so he doesn't feel left behind.",
        options: [
          {
            id: "ct2-s2-a",
            label:
              "Return toward the intended allocation through a deliberate reinvestment plan",
            approachTag: "disciplined",
            immediateConsequence:
              "David found the measured approach frustrating while markets were rising, but his investment decisions were again tied to the allocation he had originally planned around.",
          },
          {
            id: "ct2-s2-b",
            label:
              "Increase market exposure immediately to try to catch up on recent gains",
            approachTag: "reactive",
            immediateConsequence:
              "Markets continued rising for several months, and David initially felt that acting aggressively had been exactly the right response.",
          },
        ],
      },
      {
        id: "ct2-stop3",
        stopLabel: "College Approaching",
        yearMarker: "Year 12",
        storyBeat:
          "David's oldest child starts college in two years. The dedicated education account is short of the expected cost, and David suggests simply using retirement assets later if tuition exceeds what has been saved.",
        options: [
          {
            id: "ct2-s3-a",
            label:
              "Adjust current savings now to address the education shortfall before tuition is due",
            approachTag: "disciplined",
            immediateConsequence:
              "David temporarily redirected some cash flow toward the education goal. It reduced what he could save elsewhere for a while, but the funding gap became smaller and more predictable.",
          },
          {
            id: "ct2-s3-b",
            label:
              "Wait and use retirement assets later if the education account falls short",
            approachTag: "reactive",
            immediateConsequence:
              "David avoided changing anything immediately. The funding shortfall remained a future problem, which made the present plan feel easier to maintain.",
          },
        ],
      },
    ],
    endingMostlyDisciplined:
      "Your advice usually converted uncertainty into a plan before making major financial moves. Across employment changes, strong markets and competing family goals, David's decisions were more often tied to what the household actually needed than to whatever felt most urgent at that particular moment.",
    endingMostlyReactive:
      "David's timeline repeatedly turned temporary pressure into immediate portfolio action or delayed problems that required planning. Some choices felt reassuring at first, but the overall pattern made long-term goals more dependent on market timing and future flexibility than they needed to be.",
  },
  {
    id: "ct-3",
    clientAvatarSeed: "client-priya-desai",
    clientName: "Priya Desai",
    introText:
      "Priya came to you after a divorce settlement left her managing a substantial investment portfolio independently for the first time in her adult life.",
    stops: [
      {
        id: "ct3-stop1",
        stopLabel: "Post-Divorce Settlement",
        yearMarker: "Year 1",
        storyBeat:
          "Priya's settlement includes a portfolio heavily concentrated in her former spouse's employer stock. She is emotionally exhausted from the divorce and would prefer not to make another major decision for a while.",
        options: [
          {
            id: "ct3-s1-a",
            label:
              "Create a gradual diversification plan instead of leaving the concentration unattended",
            approachTag: "disciplined",
            immediateConsequence:
              "Priya agreed to the staged plan even though she would have preferred to postpone another difficult financial conversation.",
          },
          {
            id: "ct3-s1-b",
            label:
              "Leave the portfolio unchanged until Priya feels emotionally ready to revisit it",
            approachTag: "reactive",
            immediateConsequence:
              "Priya appreciated having one fewer decision to make. The concentrated position remained untouched for the time being.",
          },
        ],
      },
      {
        id: "ct3-stop2",
        stopLabel: "Company Volatility",
        yearMarker: "Year 3",
        storyBeat:
          "The former employer's stock falls sharply after disappointing earnings. Priya finds the connection to that chapter of her life emotionally exhausting and wants to eliminate whatever exposure she still has immediately, regardless of price.",
        options: [
          {
            id: "ct3-s2-a",
            label:
              "Use a planned exit process rather than making an all-at-once decision during the drop",
            approachTag: "disciplined",
            immediateConsequence:
              "Priya found the staged approach emotionally less satisfying because she wanted the entire position gone, but it separated the investment decision from the urge for immediate closure.",
          },
          {
            id: "ct3-s2-b",
            label:
              "Sell the entire remaining position immediately at the current price",
            approachTag: "reactive",
            immediateConsequence:
              "Priya felt immediate relief after removing the position. The emotional burden disappeared faster than the uncertainty about whether the timing had been favorable.",
          },
        ],
      },
      {
        id: "ct3-stop3",
        stopLabel: "Remarriage & New Goals",
        yearMarker: "Year 8",
        storyBeat:
          "Priya remarries. Her new spouse has separate investment accounts managed by another advisor with a noticeably different risk approach. Priya wonders whether there is any reason to coordinate when the accounts remain legally separate.",
        options: [
          {
            id: "ct3-s3-a",
            label:
              "Coordinate both portfolios around their shared household goals while keeping ownership separate",
            approachTag: "disciplined",
            immediateConsequence:
              "The coordination required an awkward first conversation and additional planning work, but Priya could finally see how the two portfolios interacted at the household level.",
          },
          {
            id: "ct3-s3-b",
            label:
              "Continue managing Priya's portfolio independently because the accounts are legally separate",
            approachTag: "reactive",
            immediateConsequence:
              "The arrangement remained simple and avoided additional coordination. Each advisor continued making decisions without a complete view of the other half of the household portfolio.",
          },
        ],
      },
    ],
    endingMostlyDisciplined:
      "Your advice generally helped Priya separate emotionally difficult moments from the financial structure underneath them. Over time, the emphasis stayed on reducing unintended concentration and making decisions in the context of her broader household goals rather than treating each account or life event in isolation.",
    endingMostlyReactive:
      "Across Priya's timeline, emotional relief and administrative simplicity often won over broader portfolio coordination. Individual decisions solved an immediate discomfort, but the overall pattern left more concentration, timing risk and household-level inconsistency to address later.",
  },
  {
    id: "ct-4",
    clientAvatarSeed: "client-walter-simmons",
    clientName: "Walter Simmons",
    introText:
      "Walter retired at 65 with a portfolio designed to support him for the rest of his life. You've advised him through the years when that retirement plan moved from a projection on paper to something he actually had to live through.",
    stops: [
      {
        id: "ct4-stop1",
        stopLabel: "Early Retirement Downturn",
        yearMarker: "Year 2 of Retirement",
        storyBeat:
          "Two years after retiring, markets fall sharply. Walter's plan includes a cash reserve for periods like this, but living through the decline feels very different from discussing one hypothetically. He asks whether he should withdraw a full year's living expenses from investments immediately.",
        options: [
          {
            id: "ct4-s1-a",
            label:
              "Use the existing cash reserve and keep the planned investment withdrawal schedule",
            approachTag: "disciplined",
            immediateConsequence:
              "Walter remained nervous about the account balance, but his near-term spending continued normally from the reserve built for exactly this situation.",
          },
          {
            id: "ct4-s1-b",
            label:
              "Withdraw the full year's expenses immediately so the cash is safely in hand",
            approachTag: "reactive",
            immediateConsequence:
              "Walter felt noticeably safer once the year's spending was sitting in cash. The emotional uncertainty fell even though the withdrawal required selling more investments during the decline.",
          },
        ],
      },
      {
        id: "ct4-stop2",
        stopLabel: "Health Event",
        yearMarker: "Year 6 of Retirement",
        storyBeat:
          "Walter has a health scare that creates an unexpected $40,000 expense. He can cover the specific cost, but the experience leaves him wanting to move a much larger portion of the remaining portfolio into cash 'just to be safe.'",
        options: [
          {
            id: "ct4-s2-a",
            label:
              "Fund the specific expense from reserves while keeping the remaining long-term allocation intact",
            approachTag: "disciplined",
            immediateConsequence:
              "The immediate medical expense was fully covered, although Walter still felt emotionally exposed keeping the rest of his long-term portfolio invested.",
          },
          {
            id: "ct4-s2-b",
            label:
              "Build a much larger cash allocation than the specific expense requires",
            approachTag: "reactive",
            immediateConsequence:
              "Walter felt considerably calmer with the larger cash balance, even though much of that money no longer had a defined near-term purpose.",
          },
        ],
      },
      {
        id: "ct4-stop3",
        stopLabel: "Estate Planning",
        yearMarker: "Year 14 of Retirement",
        storyBeat:
          "Walter is now 79. Two grandchildren have been born since he last updated his estate documents, but he mentions this only briefly before turning the conversation back to recent market news.",
        options: [
          {
            id: "ct4-s3-a",
            label:
              "Prioritize reviewing the outdated estate plan before returning to the market discussion",
            approachTag: "disciplined",
            immediateConsequence:
              "Walter agreed to address the documents, although he was mildly disappointed that part of the meeting went toward administrative planning instead of the market topic he found more interesting.",
          },
          {
            id: "ct4-s3-b",
            label:
              "Follow Walter's agenda and focus the meeting on the market news he wants to discuss",
            approachTag: "reactive",
            immediateConsequence:
              "The meeting felt easy and Walter left satisfied, having spent the time discussing exactly what was on his mind.",
          },
        ],
      },
    ],
    endingMostlyDisciplined:
      "Across retirement, your advice usually kept Walter's long-term spending plan and broader family goals ahead of whatever felt most urgent in the moment. That consistency helped preserve flexibility through changing markets, unexpected expenses and the less exciting planning work that becomes increasingly important later in life.",
    endingMostlyReactive:
      "Walter's timeline repeatedly favored immediate reassurance and the topic that felt most pressing that day. Each decision was understandable on its own, but together they gradually weakened the connection between his portfolio, his long-term spending needs and the family planning responsibilities that became more important with age.",
  },
];
