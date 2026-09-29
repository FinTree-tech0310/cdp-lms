export interface CompsCandidate {
  id: string;
  name: string;
  industry: string;
  revenueSize: string;
  geography: string;
  businessModelLine: string;
  shouldInclude: boolean;
  reasoning: string;
}

export interface CompsScenario {
  id: string;
  screeningBrief: string;
  targetCompany: {
    name: string;
    industry: string;
    revenueSize: string;
    geography: string;
    businessModelLine: string;
  };
  candidates: CompsCandidate[];
}

export const compsScenarios: CompsScenario[] = [
  {
    id: "comps-1",
    screeningBrief:
      "Prioritize enterprise subscription-software companies with similar scale and customer economics (enterprise customers, seat/subscription-based pricing). Geography matters, but business-model and customer-economics similarity matter more than an exact geographic match.",
    targetCompany: {
      name: "Flowstate",
      industry: "Enterprise SaaS",
      revenueSize: "$300M revenue",
      geography: "United States",
      businessModelLine:
        "Cloud-based project management software sold via subscription to enterprise customers.",
    },
    candidates: [
      {
        id: "c1-1",
        name: "Ridgeline Cloud Works",
        industry: "Enterprise SaaS",
        revenueSize: "$280M revenue",
        geography: "United States",
        businessModelLine:
          "Subscription project management software sold to enterprise customers.",
        shouldInclude: true,
        reasoning:
          "Matches on industry, scale, geography, and customer economics — a near-ideal comp.",
      },
      {
        id: "c1-2",
        name: "Bramwell Retail Co",
        industry: "Consumer Retail",
        revenueSize: "$310M revenue",
        geography: "United States",
        businessModelLine: "E-commerce apparel retailer.",
        shouldInclude: false,
        reasoning:
          "Revenue size is a close match, but the business model and industry are entirely different — similar scale alone doesn't make a comp.",
      },
      {
        id: "c1-3",
        name: "Nordcastle Software",
        industry: "Enterprise SaaS",
        revenueSize: "$30M revenue",
        geography: "United Kingdom",
        businessModelLine:
          "Subscription HR software sold to enterprise customers.",
        shouldInclude: false,
        reasoning:
          "Right industry, right customer type, and right pricing model, but roughly 10x smaller than the target — too far outside the brief's emphasis on similar scale.",
      },
      {
        id: "c1-4",
        name: "Solstice Systems",
        industry: "Enterprise SaaS",
        revenueSize: "$340M revenue",
        geography: "Germany",
        businessModelLine:
          "Subscription supply-chain software sold to enterprise customers.",
        shouldInclude: true,
        reasoning:
          "Different country, but the brief explicitly treats geography as secondary — scale, business model, and customer economics all line up well.",
      },
      {
        id: "c1-5",
        name: "Ferrowatt Industrial",
        industry: "Industrial Equipment",
        revenueSize: "$290M revenue",
        geography: "United States",
        businessModelLine:
          "Manufactures and sells industrial equipment hardware.",
        shouldInclude: false,
        reasoning:
          "Matches on revenue and geography, but it's a hardware manufacturer, not a subscription software business — the business model is fundamentally different.",
      },
      {
        id: "c1-6",
        name: "PixelForge Games",
        industry: "Consumer Mobile Gaming",
        revenueSize: "$270M revenue",
        geography: "United States",
        businessModelLine:
          "Mobile games monetized through in-app purchases.",
        shouldInclude: false,
        reasoning:
          "Close on revenue and geography, but its economics are mass-consumer and purchase-driven rather than enterprise subscription-based — a very different revenue model.",
      },
      {
        id: "c1-7",
        name: "Anchorlane Technologies",
        industry: "Enterprise SaaS",
        revenueSize: "$310M revenue",
        geography: "Canada",
        businessModelLine:
          "Subscription workflow and project-management software sold primarily to enterprise customers on a seat-based pricing model.",
        shouldInclude: true,
        reasoning:
          "The geography differs, but the brief makes that secondary. Scale, enterprise customer base, software model, and seat-based subscription economics are all closely aligned with the target.",
      },
      {
        id: "c1-8",
        name: "Vesper Analytics",
        industry: "Enterprise SaaS",
        revenueSize: "$295M revenue",
        geography: "United States",
        businessModelLine:
          "Cloud analytics software sold to enterprise customers through annual seat-based subscriptions.",
        shouldInclude: true,
        reasoning:
          "A strong match on scale, enterprise customer economics, subscription pricing, and software business model, even though the specific product category differs from project management.",
      },
    ],
  },
  {
    id: "comps-2",
    screeningBrief:
      "Prioritize companies with similar distribution-channel exposure (grocery/retail) and revenue scale. The exact food sub-category matters less than how the product actually reaches consumers and at what scale.",
    targetCompany: {
      name: "Harvest & Co.",
      industry: "Packaged Foods",
      revenueSize: "$850M revenue",
      geography: "United States",
      businessModelLine:
        "Mid-tier snack foods sold primarily through grocery and retail channels.",
    },
    candidates: [
      {
        id: "c2-1",
        name: "Golden Pantry Foods",
        industry: "Packaged Foods (Cereal)",
        revenueSize: "$780M revenue",
        geography: "United States",
        businessModelLine:
          "Cereal products sold through grocery and retail channels.",
        shouldInclude: true,
        reasoning:
          "Different sub-category (cereal vs. snacks), but the brief treats that as secondary — channel and scale match well.",
      },
      {
        id: "c2-2",
        name: "Cobblestone Beverages",
        industry: "Beverages",
        revenueSize: "$900M revenue",
        geography: "United States",
        businessModelLine:
          "Beverages sold through grocery and retail channels.",
        shouldInclude: true,
        reasoning:
          "A different category entirely, but the same distribution model and comparable scale — exactly what the brief prioritizes.",
      },
      {
        id: "c2-3",
        name: "TinRoof Direct",
        industry: "Packaged Foods (Snacks)",
        revenueSize: "$820M revenue",
        geography: "United States",
        businessModelLine:
          "Snack foods sold exclusively via direct-to-consumer subscription boxes, with no retail presence.",
        shouldInclude: false,
        reasoning:
          "Same category and nearly identical revenue, but it has no grocery/retail distribution at all — a fundamentally different channel from the target.",
      },
      {
        id: "c2-4",
        name: "Bellwether Micro Snacks",
        industry: "Packaged Foods (Snacks)",
        revenueSize: "$40M revenue",
        geography: "United States",
        businessModelLine:
          "Snack foods sold through regional grocery chains.",
        shouldInclude: false,
        reasoning:
          "Right category and right channel, but roughly 20x smaller — too far off in scale to be a meaningful comp.",
      },
      {
        id: "c2-5",
        name: "Continental Foods Group",
        industry: "Diversified Packaged Foods",
        revenueSize: "$9B revenue",
        geography: "Global",
        businessModelLine:
          "Diversified packaged foods conglomerate sold through grocery and retail worldwide.",
        shouldInclude: false,
        reasoning:
          "Right channel, but over 10x larger — a global conglomerate isn't comparable in scale to a mid-sized single-category player.",
      },
      {
        id: "c2-6",
        name: "Northstar Restaurant Holdings",
        industry: "Restaurants",
        revenueSize: "$860M revenue",
        geography: "United States",
        businessModelLine: "Fast-casual restaurant chain.",
        shouldInclude: false,
        reasoning:
          "Revenue is almost an exact match, but restaurants use a dine-in distribution model rather than retail/grocery — the close scale match is a coincidence, not a real comp signal.",
      },
      {
        id: "c2-7",
        name: "Meadowlane Organic Snacks",
        industry: "Packaged Foods (Organic Snacks)",
        revenueSize: "$790M revenue",
        geography: "United States",
        businessModelLine:
          "Organic snack foods, roughly 85% sold through grocery/retail and 15% through a direct-to-consumer subscription arm.",
        shouldInclude: true,
        reasoning:
          "Predominantly the same distribution channel as the target, with only a minor D2C component — close enough on scale and category to include.",
      },
      {
        id: "c2-8",
        name: "Palisade Wholesale Club",
        industry: "Retail / Wholesale Club",
        revenueSize: "$870M revenue",
        geography: "United States",
        businessModelLine:
          "Operates a chain of grocery and wholesale-club retail stores.",
        shouldInclude: false,
        reasoning:
          "This is a retailer that sells food products, not a food producer itself — matching revenue and 'grocery/retail' language on paper doesn't make it a comparable company; it's a channel, not a peer.",
      },
    ],
  },
  {
    id: "comps-3",
    screeningBrief:
      "For community banks, prioritize similar asset size AND a shared regional/regulatory operating environment. Unlike most industries, local economic conditions and regulatory regime matter as much as — or more than — business model similarity, since a community bank's performance is closely tied to its local market.",
    targetCompany: {
      name: "Ledgerstone Community Bank",
      industry: "Community Banking",
      revenueSize: "$4.2B total assets",
      geography: "US Midwest",
      businessModelLine:
        "Traditional branch-based community bank focused on small business and consumer lending.",
    },
    candidates: [
      {
        id: "c3-1",
        name: "Prairie Trust Bank",
        industry: "Community Banking",
        revenueSize: "$3.9B total assets",
        geography: "US Midwest",
        businessModelLine:
          "Branch-based community bank focused on small business and consumer lending.",
        shouldInclude: true,
        reasoning:
          "Close on asset size, same region and regulatory environment, and the same core business — a strong comp.",
      },
      {
        id: "c3-2",
        name: "Cascade Ridge Bank",
        industry: "Community Banking",
        revenueSize: "$4.5B total assets",
        geography: "US Pacific Northwest",
        businessModelLine:
          "Branch-based community bank focused on small business and consumer lending.",
        shouldInclude: false,
        reasoning:
          "Asset size is nearly a perfect match, but the brief specifically calls out regional/regulatory environment as critical for banks — a different region means different local economic exposure, even with identical size and business model.",
      },
      {
        id: "c3-3",
        name: "Ironwood Global Bank",
        industry: "Global Banking",
        revenueSize: "$180B total assets",
        geography: "Global",
        businessModelLine:
          "Multinational bank with operations across dozens of countries, including some Midwest US branches.",
        shouldInclude: false,
        reasoning:
          "Having some presence in the same region doesn't matter when the scale is over 40x larger — a global bank isn't a comp for a community bank regardless of geographic overlap.",
      },
      {
        id: "c3-4",
        name: "Meadow Community Trust",
        industry: "Community Banking",
        revenueSize: "$4.0B total assets",
        geography: "US Midwest",
        businessModelLine:
          "Branch-based community bank focused on small business and consumer lending.",
        shouldInclude: true,
        reasoning:
          "Near-identical match on size, region, and business model.",
      },
      {
        id: "c3-5",
        name: "Coastal Fintech Lending",
        industry: "Digital Lending",
        revenueSize: "$4.1B loans originated",
        geography: "US Midwest",
        businessModelLine: "Online-only lender with no physical branches.",
        shouldInclude: false,
        reasoning:
          "Same approximate scale and same region, but a branchless digital lender has a fundamentally different cost structure and regulatory profile from a traditional community bank.",
      },
      {
        id: "c3-6",
        name: "Sunridge Savings & Loan",
        industry: "Community Banking (Thrift)",
        revenueSize: "$4.3B total assets",
        geography: "US Midwest",
        businessModelLine:
          "Branch-based savings institution focused on consumer and mortgage lending.",
        shouldInclude: true,
        reasoning:
          "A slightly different charter type, but close enough in size, region, and core lending focus to be a reasonable comp.",
      },
      {
        id: "c3-7",
        name: "Highland Community Bank",
        industry: "Community Banking",
        revenueSize: "$4.1B total assets",
        geography: "US Southeast",
        businessModelLine:
          "Branch-based community bank focused on small business and consumer lending.",
        shouldInclude: false,
        reasoning:
          "Same size and same business model as the target, but a different region — reinforcing that for banks specifically, regional/regulatory environment can outweigh an otherwise excellent match.",
      },
      {
        id: "c3-8",
        name: "Bramblewood Insurance Group",
        industry: "Insurance",
        revenueSize: "$4.0B total assets",
        geography: "US Midwest",
        businessModelLine: "Regional insurance provider.",
        shouldInclude: false,
        reasoning:
          "Matches almost exactly on size and region, but insurance is a fundamentally different industry from banking — size and geography alone are never sufficient without the right business type.",
      },
    ],
  },
  {
    id: "comps-4",
    screeningBrief:
      "Prioritize companies with similar end-market exposure (aerospace/industrial equipment) and a comparable margin profile. Revenue size can vary more widely than in a typical comp set — scale differences are common in this fragmented industry, so end-market and margin similarity matter most.",
    targetCompany: {
      name: "Vantage Precision Components",
      industry: "Specialty Industrial Manufacturing",
      revenueSize: "$620M revenue",
      geography: "United States",
      businessModelLine:
        "Manufactures precision components for aerospace and industrial equipment end-markets, with mid-teens EBITDA margins.",
    },
    candidates: [
      {
        id: "c4-1",
        name: "Halcyon Aerostructures",
        industry: "Specialty Industrial Manufacturing",
        revenueSize: "$410M revenue",
        geography: "United States",
        businessModelLine:
          "Aerospace structural components, mid-teens EBITDA margins.",
        shouldInclude: true,
        reasoning:
          "Notably smaller in revenue, but the brief explicitly deprioritizes size here — end-market and margin profile both match well.",
      },
      {
        id: "c4-2",
        name: "Ferro Dynamics",
        industry: "Specialty Industrial Manufacturing",
        revenueSize: "$1.1B revenue",
        geography: "United States",
        businessModelLine:
          "Aerospace and industrial equipment components, mid-teens EBITDA margins.",
        shouldInclude: true,
        reasoning:
          "Nearly double the target's revenue, but size matters less here — end-market and margins are a strong match.",
      },
      {
        id: "c4-3",
        name: "Cobalt Automotive Parts",
        industry: "Specialty Industrial Manufacturing",
        revenueSize: "$600M revenue",
        geography: "United States",
        businessModelLine:
          "Automotive parts manufacturer, high-single-digit EBITDA margins.",
        shouldInclude: false,
        reasoning:
          "Revenue is almost identical to the target, but the end-market and margin profile are both meaningfully different — the close revenue match is coincidental.",
      },
      {
        id: "c4-4",
        name: "Trestlewood Building Products",
        industry: "Specialty Industrial Manufacturing",
        revenueSize: "$615M revenue",
        geography: "United States",
        businessModelLine:
          "Construction and building-materials manufacturer, mid-single-digit EBITDA margins.",
        shouldInclude: false,
        reasoning:
          "Revenue is nearly a perfect match, but the end-market is wrong and margins are significantly lower — exactly the trap the brief warns against by de-emphasizing revenue size.",
      },
      {
        id: "c4-5",
        name: "Apex Turbine Systems",
        industry: "Specialty Industrial Manufacturing",
        revenueSize: "$580M revenue",
        geography: "United States",
        businessModelLine:
          "Aerospace and defense turbine components, high-teens EBITDA margins.",
        shouldInclude: true,
        reasoning:
          "Strong match on end-market and margin profile, with revenue reasonably close as well — one of the better comps in the set.",
      },
      {
        id: "c4-6",
        name: "Meridian Industrial Holdings",
        industry: "Diversified Industrial Conglomerate",
        revenueSize: "$8B revenue",
        geography: "Global",
        businessModelLine:
          "Diversified conglomerate across dozens of end-markets; aerospace represents roughly 5% of total revenue.",
        shouldInclude: false,
        reasoning:
          "Technically has aerospace exposure, but it's a tiny sliver of a massive, unrelated business — not a meaningful comp despite nominally touching the right end-market.",
      },
      {
        id: "c4-7",
        name: "Sterling Fastener Corp",
        industry: "Specialty Industrial Manufacturing",
        revenueSize: "$340M revenue",
        geography: "United States",
        businessModelLine:
          "Aerospace and industrial fasteners, low-double-digit EBITDA margins.",
        shouldInclude: true,
        reasoning:
          "Smaller in revenue, which the brief says matters less here, and margins are in a reasonably comparable range for the same end-market.",
      },
      {
        id: "c4-8",
        name: "Brackenfield Chemicals",
        industry: "Specialty Chemicals",
        revenueSize: "$590M revenue",
        geography: "United States",
        businessModelLine:
          "Supplies chemical inputs used in industrial equipment manufacturing, high-teens EBITDA margins.",
        shouldInclude: false,
        reasoning:
          "Revenue and margins look attractive on paper, but this company supplies inputs to manufacturers like the target rather than competing in the same end-market itself — a supplier isn't a comp for the company it supplies.",
      },
    ],
  },
];
