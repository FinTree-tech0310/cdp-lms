export interface ClientDossierCard {
  id: string;
  clientName: string;
  avatarPresentation: "feminine" | "masculine";
  avatarSeed: string;
  stats: string[];
  clientQuote: string;
  guidanceNote: string;
}

export interface ClientDossierSet {
  id: string;
  dossiers: readonly ClientDossierCard[];
}

const CLIENT_DOSSIER_SET_1: readonly ClientDossierCard[] = [
  {
    id: "cd-1",
    clientName: "Anjali",
    avatarPresentation: "feminine",
    avatarSeed: "client-anjali-71",
    stats: ["Age 71", "Retired", "Account funds monthly living expenses"],
    clientQuote: "I want aggressive growth. I can handle the ups and downs.",
    guidanceNote:
      "Because this account supports current spending, a large drawdown could affect the client's lifestyle before markets have time to recover. Risk tolerance matters, but so does risk capacity. A prudent advisor would want to understand what is driving the request and whether the client has enough stable income or reserves elsewhere before materially increasing risk.",
  },
  {
    id: "cd-2",
    clientName: "Rohan",
    avatarPresentation: "masculine",
    avatarSeed: "client-rohan-34",
    stats: ["Age 34", "High earner", "20+ year horizon, no near-term withdrawals planned"],
    clientQuote: "Just put it all in something safe. I don't want to think about it.",
    guidanceNote:
      "The client's long horizon could support more growth, but willingness to tolerate volatility is also part of suitability. A prudent advisor should explain the long-term cost of an overly conservative allocation and make sure the client understands the trade-off. If the preference remains genuine after that conversation, honoring a more conservative approach can still be reasonable.",
  },
  {
    id: "cd-3",
    clientName: "Priya",
    avatarPresentation: "feminine",
    avatarSeed: "client-priya-52",
    stats: ["Age 52", "8 years from planned retirement", "Currently on track per last review"],
    clientQuote: "I keep seeing recession warnings on the news. Move everything to cash until things calm down.",
    guidanceNote:
      "A full move to cash based mainly on headlines can turn temporary fear into a permanent portfolio decision. With eight years before retirement, the client still has meaningful time to recover from volatility. A prudent advisor would usually explore whether anything in the financial plan has actually changed before making such a large tactical shift.",
  },
  {
    id: "cd-4",
    clientName: "Vikram",
    avatarPresentation: "masculine",
    avatarSeed: "client-vikram-45",
    stats: ["Age 45", "Stable dual-income household", "20-year horizon, 6-month emergency reserve"],
    clientQuote: "I've got two decades before I need this money. I'd like more of the portfolio in growth assets.",
    guidanceNote:
      "The long time horizon, stable income and established emergency reserve all increase the client's capacity to take investment risk. The request is consistent with the surrounding financial context. The advisor should still confirm the client's tolerance for drawdowns, but there may be little reason to push back simply because the allocation becomes more growth-oriented.",
  },
  {
    id: "cd-5",
    clientName: "Kavya",
    avatarPresentation: "feminine",
    avatarSeed: "client-kavya-58",
    stats: ["Age 58", "Executive at a public company", "Significant employer stock already held through equity compensation"],
    clientQuote: "The stock has done incredibly well. I want to keep buying more of my company.",
    guidanceNote:
      "The client's salary, career prospects and a meaningful portion of existing wealth are already tied to the same company. Adding more creates concentration risk even if the stock has performed well recently. A prudent advisor would usually raise diversification before allowing recent performance to drive an even larger exposure.",
  },
  {
    id: "cd-6",
    clientName: "Omar",
    avatarPresentation: "masculine",
    avatarSeed: "client-omar-40",
    stats: ["Age 40", "Retirement plan remains comfortably funded", "$150K gift would not affect near-term goals"],
    clientQuote: "My sister is starting a business. I want to give her $150K from this account, no strings attached.",
    guidanceNote:
      "If the client's own plan remains well funded and the transfer is genuinely intended as a gift, the advisor does not necessarily need to prevent it simply because the recipient is starting a business. The important conversation is about liquidity, tax and estate implications, and making sure the client understands that the money may never come back.",
  },
];

const CLIENT_DOSSIER_SET_2: readonly ClientDossierCard[] = [
  {
    id: "cd-7",
    clientName: "Aisha",
    avatarPresentation: "feminine",
    avatarSeed: "client-aisha-31",
    stats: ["Age 31", "Emergency reserve fully funded", "Retirement contributions already on track"],
    clientQuote: "I'd like to put 5% of my portfolio into a higher-risk technology fund. I know it could fall a lot.",
    guidanceNote:
      "A limited satellite allocation can be compatible with a sound overall plan when core goals and reserves are already funded. The advisor should make sure the client understands the volatility and concentration involved, but a measured allocation to a higher-risk preference does not automatically require pushback.",
  },
  {
    id: "cd-8",
    clientName: "Rajiv",
    avatarPresentation: "masculine",
    avatarSeed: "client-rajiv-63",
    stats: ["Age 63", "Retirement planned in 2 years", "First 4 years of retirement spending already mapped"],
    clientQuote: "I'd like to move some of the money I'll need early in retirement into short-term bonds.",
    guidanceNote:
      "Matching near-term spending needs with more stable assets can reduce the risk of having to sell growth investments during a market decline. The request is connected to a specific liability and time horizon rather than fear alone, which can make a more conservative allocation entirely appropriate.",
  },
  {
    id: "cd-9",
    clientName: "Meera",
    avatarPresentation: "feminine",
    avatarSeed: "client-meera-48",
    stats: ["Age 48", "Inherited portfolio", "One inherited stock represents more than half of invested assets"],
    clientQuote: "That stock belonged to my father. I don't ever want to sell any of it.",
    guidanceNote:
      "The emotional meaning of an inherited asset deserves respect, but allowing one company to dominate the portfolio creates substantial concentration risk. A prudent advisor might explore ways to preserve part of the holding for sentimental reasons while reducing enough exposure to protect the client's broader financial plan.",
  },
  {
    id: "cd-10",
    clientName: "Karan",
    avatarPresentation: "masculine",
    avatarSeed: "client-karan-39",
    stats: ["Age 39", "Two children, college costs more than 10 years away", "Strong cash reserve and stable income"],
    clientQuote: "We're comfortable with volatility. We'd like to increase the long-term portfolio's equity allocation.",
    guidanceNote:
      "The client's goals remain distant, liquidity needs are covered and the household appears capable of absorbing market volatility. A higher equity allocation can be consistent with both the time horizon and stated risk tolerance. The advisor's role is to make sure the household understands the size of potential drawdowns rather than oppose risk automatically.",
  },
  {
    id: "cd-11",
    clientName: "Dev",
    avatarPresentation: "masculine",
    avatarSeed: "client-dev-67",
    stats: ["Age 67", "Recently sold a private business", "Large portion of sale proceeds still sitting in cash"],
    clientQuote: "Markets look expensive. Let's leave all of it in cash until there's a big correction.",
    guidanceNote:
      "Holding appropriate liquidity after a business sale can be sensible, but waiting indefinitely for a specific market entry point introduces its own timing risk. A prudent advisor would usually separate near-term cash needs from long-term capital and discuss a deliberate deployment plan rather than making the entire portfolio dependent on predicting the next correction.",
  },
  {
    id: "cd-12",
    clientName: "Nandini",
    avatarPresentation: "feminine",
    avatarSeed: "client-nandini-56",
    stats: ["Age 56", "Retirement planned in 7 years", "Vacation-home purchase would require borrowing against investments"],
    clientQuote: "Don't sell anything. Let's borrow against the portfolio for the entire vacation home.",
    guidanceNote:
      "Portfolio-backed borrowing can provide flexibility, but leverage introduces interest costs and the possibility of forced action if markets fall sharply. With retirement approaching, financing the entire discretionary purchase this way could add risk at exactly the point when financial flexibility becomes more valuable.",
  },
];

const CLIENT_DOSSIER_SET_3: readonly ClientDossierCard[] = [
  {
    id: "cd-13",
    clientName: "Aditya",
    avatarPresentation: "masculine",
    avatarSeed: "client-aditya-44",
    stats: ["Age 44", "Entrepreneur with variable income", "Planning a business acquisition within 18 months"],
    clientQuote: "I want to keep a bigger cash balance for the next year or two. I may need it quickly for an acquisition.",
    guidanceNote:
      "Cash is not automatically an inefficient allocation when it is tied to a specific near-term use. An uncertain acquisition date and variable income increase the value of liquidity. The advisor should distinguish purposeful reserves from long-term money that may still benefit from remaining invested.",
  },
  {
    id: "cd-14",
    clientName: "Shobha",
    avatarPresentation: "feminine",
    avatarSeed: "client-shobha-73",
    stats: ["Age 73", "Pension covers normal living expenses", "Primary portfolio goal is leaving assets to children and grandchildren"],
    clientQuote: "I don't need most of this money myself. I'd like the long-term portfolio to stay fairly growth-oriented for my family.",
    guidanceNote:
      "Age alone does not determine an appropriate asset allocation. If the client's own spending needs are reliably covered and much of the portfolio is intended for heirs with longer horizons, maintaining meaningful growth exposure can be reasonable. The relevant horizon may extend well beyond the client's own lifetime.",
  },
  {
    id: "cd-15",
    clientName: "Arjun",
    avatarPresentation: "masculine",
    avatarSeed: "client-arjun-36",
    stats: ["Age 36", "Senior executive at a technology company", "Employer stock and unvested equity dominate net worth"],
    clientQuote: "Selling company shares creates a tax bill. I'd rather just keep everything and wait.",
    guidanceNote:
      "Taxes matter, but avoiding taxes at all costs can leave the client dangerously concentrated in the same company that also provides their income. A prudent advisor would normally compare the tax cost of diversification with the financial risk of maintaining an outsized single-stock exposure and consider a staged strategy rather than treating taxes as a reason never to sell.",
  },
  {
    id: "cd-16",
    clientName: "Neha",
    avatarPresentation: "feminine",
    avatarSeed: "client-neha-61",
    stats: ["Age 61", "Recently received a substantial inheritance", "Retirement plan remains funded after paying off mortgage"],
    clientQuote: "I know the mortgage rate is low, but I'd sleep better if we just paid it off.",
    guidanceNote:
      "The mathematically highest-return choice is not always the only reasonable one. If paying off the mortgage does not compromise retirement funding or liquidity, reducing debt may provide meaningful certainty and peace of mind. The advisor should explain the opportunity cost, but the client's preference can still fit a sound plan.",
  },
  {
    id: "cd-17",
    clientName: "Suresh",
    avatarPresentation: "masculine",
    avatarSeed: "client-suresh-50",
    stats: ["Age 50", "Diversified long-term portfolio", "Current allocation remains aligned with financial plan"],
    clientQuote: "This fund was up almost 40% last year. Move a big chunk of my portfolio into it before I miss out.",
    guidanceNote:
      "Recent performance can be psychologically compelling, but it says little about what happens next. Moving a large allocation toward whatever has just performed best can increase concentration and encourage performance chasing. A prudent advisor would usually bring the conversation back to the client's objectives and the role the existing allocation was designed to play.",
  },
  {
    id: "cd-18",
    clientName: "Maya",
    avatarPresentation: "feminine",
    avatarSeed: "client-maya-33",
    stats: ["Age 33", "Planning a home purchase in 12–18 months", "Down-payment money is currently held in low-volatility assets"],
    clientQuote: "The market has been strong. Let's put the house deposit into small-cap stocks until we're ready to buy.",
    guidanceNote:
      "The issue is not the client's age but the short horizon attached to this particular money. A sharp decline shortly before the home purchase could materially change the plan. Funds earmarked for a known near-term liability generally have much less capacity for equity risk than the client's long-term investments.",
  },
];

const CLIENT_DOSSIER_SET_4: readonly ClientDossierCard[] = [
  {
    id: "cd-19",
    clientName: "Ananya",
    avatarPresentation: "feminine",
    avatarSeed: "client-ananya-47",
    stats: ["Age 47", "College tuition begins in 3 years", "Tuition reserve is currently held in short-term bonds"],
    clientQuote: "Tuition keeps getting more expensive. Let's move the whole reserve into high-growth stocks for the next three years.",
    guidanceNote:
      "The desire to keep pace with rising costs is understandable, but this money has a known use and a short recovery window. A market decline near the first tuition payment could create a funding gap at exactly the wrong time. A prudent advisor would usually separate this near-term reserve from assets intended for longer-term growth.",
  },
  {
    id: "cd-20",
    clientName: "Manav",
    avatarPresentation: "masculine",
    avatarSeed: "client-manav-32",
    stats: ["Age 32", "Freelance income varies month to month", "18 months of living expenses currently held in cash"],
    clientQuote: "Eighteen months in cash feels excessive. I'd like to invest six months of it gradually into my long-term portfolio.",
    guidanceNote:
      "Variable income can justify a larger reserve than a salaried household might need, but that does not mean every rupee must remain in cash indefinitely. If twelve months still provides a comfortable buffer and the transferred money is genuinely long term, a gradual investment plan may be consistent with the client's circumstances.",
  },
  {
    id: "cd-21",
    clientName: "Farah",
    avatarPresentation: "feminine",
    avatarSeed: "client-farah-38",
    stats: ["Age 38", "Emergency reserve and retirement plan fully funded", "Core portfolio remains broadly diversified"],
    clientQuote: "I'd like to use 3% of my portfolio for an angel investment. I understand I could lose all of it.",
    guidanceNote:
      "A small, clearly limited allocation to an illiquid opportunity can fit within an otherwise resilient plan. The advisor should verify that the client understands the concentration, valuation and liquidity risks, but the possibility of loss alone does not make every measured speculative allocation unsuitable.",
  },
  {
    id: "cd-22",
    clientName: "Prakash",
    avatarPresentation: "masculine",
    avatarSeed: "client-prakash-62",
    stats: ["Age 62", "Retirement planned in 18 months", "Private fund requires a 10-year capital commitment"],
    clientQuote: "The returns look excellent. Put a large part of my retirement portfolio into this private fund.",
    guidanceNote:
      "Headline return targets do not remove the liquidity and valuation risks of a long private-market commitment. With retirement close, tying up a large part of the portfolio for ten years could reduce the client's ability to fund spending or respond to changing circumstances. The size and illiquidity of the request deserve careful pushback.",
  },
  {
    id: "cd-23",
    clientName: "Diya",
    avatarPresentation: "feminine",
    avatarSeed: "client-diya-41",
    stats: ["Age 41", "Provides ongoing support to aging parents", "Two years of expected care costs have been set aside"],
    clientQuote: "I'd like the care reserve in short-term government securities instead of leaving all of it in a bank account.",
    guidanceNote:
      "The reserve has a defined near-term purpose, and short-term government securities may preserve liquidity while modestly improving the return on idle cash. The advisor should match maturities to expected care needs and explain price or reinvestment risk, but the request itself can be consistent with prudent planning.",
  },
  {
    id: "cd-24",
    clientName: "Sanjay",
    avatarPresentation: "masculine",
    avatarSeed: "client-sanjay-55",
    stats: ["Age 55", "Portfolio remains aligned with retirement plan", "Household spending has exceeded income for 14 months"],
    clientQuote: "Rather than cut spending, let's borrow against the portfolio each month until the market gives us better returns.",
    guidanceNote:
      "Using recurring portfolio debt to cover an ongoing spending gap can turn a budgeting problem into leverage risk. Interest costs may compound while a market decline reduces collateral value. A prudent advisor would usually address the structural cash-flow gap before treating borrowing as a continuing source of income.",
  },
];

const CLIENT_DOSSIER_SET_5: readonly ClientDossierCard[] = [
  {
    id: "cd-25",
    clientName: "Lakshmi",
    avatarPresentation: "feminine",
    avatarSeed: "client-lakshmi-64",
    stats: ["Age 64", "Large estimated tax payment due in 9 months", "Tax funds are currently held in Treasury bills"],
    clientQuote: "Nine months is a long time. Put the tax money into equities until the payment is due.",
    guidanceNote:
      "This money is attached to a known liability with a fixed deadline. The potential gain from a short equity allocation is unlikely to justify the risk of a decline before the tax payment. The client's broader age or risk tolerance does not change the limited risk capacity of funds that are already committed.",
  },
  {
    id: "cd-26",
    clientName: "Kabir",
    avatarPresentation: "masculine",
    avatarSeed: "client-kabir-37",
    stats: ["Age 37", "Founder with irregular business distributions", "Long-term retirement and education goals remain funded"],
    clientQuote: "Business income is unpredictable. I want a larger cash reserve even if it lowers my expected return.",
    guidanceNote:
      "For a client whose income depends on irregular business distributions, additional liquidity can provide resilience and reduce the chance of selling investments at an unfavorable time. The advisor should define an appropriate reserve target, but maximizing expected return is not the only objective when cash flow is uncertain.",
  },
  {
    id: "cd-27",
    clientName: "Pooja",
    avatarPresentation: "feminine",
    avatarSeed: "client-pooja-59",
    stats: ["Age 59", "Owns several rental properties", "Real estate already represents most of household net worth"],
    clientQuote: "Property has always worked for me. Move the rest of my investment portfolio into real-estate funds too.",
    guidanceNote:
      "The client's familiarity with property does not reduce the concentration already present across income, assets and local-market exposure. Moving the liquid portfolio into additional real-estate funds would remove an important source of diversification. A prudent advisor would usually make that combined exposure visible before following the request.",
  },
  {
    id: "cd-28",
    clientName: "Naveen",
    avatarPresentation: "masculine",
    avatarSeed: "client-naveen-43",
    stats: ["Age 43", "Child starts college in 5 years", "Education account is currently ahead of its funding target"],
    clientQuote: "We're ahead of schedule. I'd like to reduce equity risk in the education account gradually from here.",
    guidanceNote:
      "As a known spending date approaches, gradually reducing risk can protect progress already made and lower dependence on market conditions at enrollment. The advisor should coordinate the glide path with the remaining funding need, but the request is connected to a real horizon rather than a reaction to recent headlines.",
  },
  {
    id: "cd-29",
    clientName: "Reshma",
    avatarPresentation: "feminine",
    avatarSeed: "client-reshma-35",
    stats: ["Age 35", "Core goals and emergency reserve are funded", "Impact allocation would be limited to 7% of the portfolio"],
    clientQuote: "I'd accept higher fees and more volatility for a small allocation that supports climate-focused businesses.",
    guidanceNote:
      "A portfolio can reflect a client's values as well as financial objectives when the trade-offs are understood and the allocation is appropriately sized. The advisor should review fees, concentration and liquidity, but a limited impact allocation need not undermine a well-funded and diversified core plan.",
  },
  {
    id: "cd-30",
    clientName: "Ajay",
    avatarPresentation: "masculine",
    avatarSeed: "client-ajay-72",
    stats: ["Age 72", "Medical and care expenses have risen recently", "Current portfolio is the primary source of flexible liquidity"],
    clientQuote: "I want to give half of the portfolio to my grandchildren now. They'll make better use of it than I will.",
    guidanceNote:
      "The client's generosity is meaningful, but an irrevocable gift could sharply reduce the flexibility available for uncertain care costs. A prudent advisor would want updated spending and health-care projections before a transfer of this size and might explore a smaller or staged gift that preserves the client's own financial security.",
  },
];

export const CLIENT_DOSSIER_SETS: readonly ClientDossierSet[] = [
  { id: "cd-set-1", dossiers: CLIENT_DOSSIER_SET_1 },
  { id: "cd-set-2", dossiers: CLIENT_DOSSIER_SET_2 },
  { id: "cd-set-3", dossiers: CLIENT_DOSSIER_SET_3 },
  { id: "cd-set-4", dossiers: CLIENT_DOSSIER_SET_4 },
  { id: "cd-set-5", dossiers: CLIENT_DOSSIER_SET_5 },
];
