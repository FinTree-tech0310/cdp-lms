export interface PushBackRequest {
  id: string;
  clientAvatarSeed: string;
  clientName: string;
  message: string;
  guidanceNote: string;
}

export interface PushBackSet {
  id: string;
  requests: readonly PushBackRequest[];
}

export const PUSH_BACK_SETS: readonly PushBackSet[] = [
  {
    id: "set-1",
    requests: [
      {
        id: "wypb-1-1",
        clientAvatarSeed: "client-a1",
        clientName: "Ananya",
        message: "I got a raise. Can we increase my monthly investment by $500?",
        guidanceNote:
          "A higher contribution tied to a genuine increase in income is usually a healthy planning move, assuming cash flow and other priorities remain covered. The advisor's role is mainly to confirm the new amount fits the broader plan rather than create unnecessary friction.",
      },
      {
        id: "wypb-1-2",
        clientAvatarSeed: "client-a2",
        clientName: "Rohan",
        message: "I need $20K for renovations. Can we break my CD before it matures?",
        guidanceNote:
          "The renovation may be entirely reasonable, but breaking a CD can carry a known penalty and there may be cheaper sources of liquidity. This is a good example of a request where understanding the cost and alternatives matters more than reflexively saying yes or no.",
      },
      {
        id: "wypb-1-3",
        clientAvatarSeed: "client-a3",
        clientName: "Meera",
        message: "A robo-advisor charges less. Can you match the fee or should I move?",
        guidanceNote:
          "Fee scrutiny is legitimate. A useful response is transparent about what the client pays, what services they actually receive, and whether those services still justify the difference. Defensiveness is less useful than an honest value conversation.",
      },
      {
        id: "wypb-1-4",
        clientAvatarSeed: "client-a4",
        clientName: "Vikram",
        message: "Can you send me last quarter's performance summary and what drove the changes?",
        guidanceNote:
          "This is normal, engaged client behavior. Clear performance reporting and an explanation of what drove results are core parts of good client service; there is little reason to resist the request.",
      },
      {
        id: "wypb-1-5",
        clientAvatarSeed: "client-a5",
        clientName: "Kavya",
        message: "I've never used my umbrella policy. Let's cancel it and save the premium.",
        guidanceNote:
          "Insurance protects against low-frequency, high-impact events, so never having made a claim does not mean the coverage has had no value. Before cancelling, the advisor should help the client compare the premium with the liability exposure the policy is designed to protect.",
      },
      {
        id: "wypb-1-6",
        clientAvatarSeed: "client-a6",
        clientName: "Arjun",
        message: "My emergency fund earns too little. Put all of it in a five-year CD.",
        guidanceNote:
          "Emergency money exists primarily for access, not maximum yield. Locking the entire reserve into a long maturity can create a liquidity problem when the cash is actually needed. Higher yield may make sense for part of the reserve, but accessibility still matters.",
      },
    ],
  },
  {
    id: "set-2",
    requests: [
      {
        id: "wypb-2-1",
        clientAvatarSeed: "client-b1",
        clientName: "Karan",
        message: "Can we rebalance automatically every quarter so I don't have to watch it?",
        guidanceNote:
          "A disciplined rebalancing process can reduce emotional trading and keep risk aligned with the portfolio's intended allocation. The exact frequency and tax consequences still matter, but the underlying request is reasonable.",
      },
      {
        id: "wypb-2-2",
        clientAvatarSeed: "client-b2",
        clientName: "Priya",
        message: "Can we put part of this month's savings into a 529 for my daughter?",
        guidanceNote:
          "Education saving is a normal planning goal. The key is making sure the contribution fits alongside retirement, liquidity and other priorities, but there is nothing inherently problematic about directing part of current savings toward a defined education goal.",
      },
      {
        id: "wypb-2-3",
        clientAvatarSeed: "client-b3",
        clientName: "Rahul",
        message: "The market's been rough. Can we review whether my allocation still fits?",
        guidanceNote:
          "Requesting a review is very different from demanding a panic-driven portfolio change. Revisiting assumptions, risk capacity and goals after market stress is exactly the kind of conversation an advisor should encourage.",
      },
      {
        id: "wypb-2-4",
        clientAvatarSeed: "client-b4",
        clientName: "Neha",
        message: "Should we convert part of my traditional IRA to a Roth this year?",
        guidanceNote:
          "A Roth conversion can be valuable, but the answer depends on current and expected future tax rates, available cash for taxes and the rest of the client's plan. This is usually a calculation-and-planning conversation rather than an automatic yes or no.",
      },
      {
        id: "wypb-2-5",
        clientAvatarSeed: "client-b5",
        clientName: "Siddharth",
        message: "Sell this ETF for the tax loss, then buy the same one back tomorrow.",
        guidanceNote:
          "Tax-loss harvesting can be useful, but immediately repurchasing the same or substantially identical security can create wash-sale issues and undermine the intended tax benefit. The objective may still be achievable using an appropriate replacement exposure.",
      },
      {
        id: "wypb-2-6",
        clientAvatarSeed: "client-b6",
        clientName: "Aisha",
        message: "My portfolio crossed $1 million. I don't think I need disability insurance anymore.",
        guidanceNote:
          "Portfolio size alone does not determine whether disability coverage is still useful. The relevant questions include future earnings, spending needs, dependents and whether existing assets could comfortably replace income after a long-term loss of earning capacity.",
      },
    ],
  },
  {
    id: "set-3",
    requests: [
      {
        id: "wypb-3-1",
        clientAvatarSeed: "client-c1",
        clientName: "Nandini",
        message: "My daughter changed her last name. Can you update her beneficiary designation?",
        guidanceNote:
          "Keeping beneficiary records current is routine but important administration. The advisor should verify the required documentation and make the update accurately rather than turn a straightforward maintenance request into an investment debate.",
      },
      {
        id: "wypb-3-2",
        clientAvatarSeed: "client-c2",
        clientName: "Aditya",
        message: "Can we set up a recurring monthly donation to a charity I support?",
        guidanceNote:
          "Regular charitable giving can be incorporated into a financial plan like any other intentional cash-flow goal. The advisor can help determine the most efficient funding method while respecting that the underlying decision reflects the client's own priorities.",
      },
      {
        id: "wypb-3-3",
        clientAvatarSeed: "client-c3",
        clientName: "Isha",
        message: "My portfolio feels light on international stocks. Can we increase that allocation?",
        guidanceNote:
          "This is a reasonable portfolio question, but 'feels light' should be tested against the actual target allocation, objectives and existing exposures. The right response may be an adjustment, no change, or a smaller rebalance after reviewing the numbers.",
      },
      {
        id: "wypb-3-4",
        clientAvatarSeed: "client-c4",
        clientName: "Sameer",
        message: "I'd like more dividend-paying stocks because I prefer regular cash flow.",
        guidanceNote:
          "A preference for income can be valid, but dividends are only one part of total return and concentrating too heavily on dividend payers can change sector and diversification exposures. The request deserves discussion rather than automatic acceptance or rejection.",
      },
      {
        id: "wypb-3-5",
        clientAvatarSeed: "client-c5",
        clientName: "Diya",
        message: "Another advisor says options will boost returns. Move the portfolio into that strategy.",
        guidanceNote:
          "Options can serve legitimate purposes, but moving an entire portfolio into an options-driven strategy because of a broad promise of higher returns materially changes the risk profile. The specific strategy, downside exposure and role in the overall plan need to be understood first.",
      },
      {
        id: "wypb-3-6",
        clientAvatarSeed: "client-c6",
        clientName: "Rajiv",
        message:
          "Rates are high. Let's borrow against my home and invest the money in private credit.",
        guidanceNote:
          "This introduces leverage into the client's household balance sheet to fund an illiquid investment. The headline yield should be weighed against borrowing costs, credit risk, liquidity and the possibility that the investment and financing behave badly at the same time.",
      },
    ],
  },
];
