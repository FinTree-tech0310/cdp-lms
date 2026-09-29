import type { VcDecision } from "../../_lib/decision-controls";

export interface PitchCard {
  id: string;
  fictionalName: string;
  description: string;
  stats: string[];
  realName: string;
  outcome: string;
  outcomeType: "success" | "failure" | "quiet";
  referenceDecision: Exclude<VcDecision, "maybe">;
}

export interface PitchSet {
  id: string;
  cards: PitchCard[];
}

export const PITCH_SETS: readonly PitchSet[] = [
  {
    id: "set-1",
    cards: [
      {
        id: "s1-c3",
        fictionalName: "FreshCart Direct",
        description:
          "An online grocery delivery service promising 30-minute delivery windows, built around a network of company-owned automated warehouses. Plan was to expand into 26 cities within 18 months, ahead of proving the model was profitable in even one.",
        stats: [
          "Founded late 1990s",
          "IPO raised over $1B",
          "Built $35M automated warehouses per city",
        ],
        realName: "Webvan",
        outcome:
          "The company burned through over $1 billion pursuing rapid expansion before proving unit economics worked. It filed for bankruptcy just 18 months after its IPO — one of the largest dot-com collapses in history.",
        outcomeType: "failure",
        referenceDecision: "fund",
      },
      {
        id: "s1-c2",
        fictionalName: "Nestway",
        description:
          "A location-based check-in app where users could log where they were, share plans with friends, and post photos. Founders noticed almost nobody used the check-in or planning features — but the photo-sharing feature was getting heavy, repeated use.",
        stats: ["Founded 2010", "2-person founding team", "$500K seed round"],
        realName: "Instagram (originally Burbn)",
        outcome:
          "The founders stripped out everything except photos, filters, comments, and likes. Two years after launch, with 13 employees, it was acquired by Facebook for $1 billion.",
        outcomeType: "success",
        referenceDecision: "fund",
      },
      {
        id: "s1-c4",
        fictionalName: "ShortReel",
        description:
          "A mobile-first streaming service producing high-budget short-form shows (10-minute episodes) for on-the-go viewing, backed by major Hollywood studios and led by veteran entertainment executives.",
        stats: ["Founded 2018", "Raised $1.75B pre-launch", "Launched with 175 original shows"],
        realName: "Quibi",
        outcome:
          "Despite the massive funding and star-studded content, the service failed to attract subscribers after launch. It shut down just six months after launching, returning $350M of remaining cash to investors.",
        outcomeType: "failure",
        referenceDecision: "fund",
      },
      {
        id: "s1-c5",
        fictionalName: "Campfire Ops",
        description:
          "A web-design consultancy that built an internal project-management tool to organize its own client work. The founders turned that internal tool into a standalone product, then turned down over 100 investment offers from VCs and private equity firms over the following two decades.",
        stats: [
          "Founded 1999",
          "Never took outside VC funding",
          "Still independent, tens of millions in annual profit",
        ],
        realName: "Basecamp (37signals)",
        outcome:
          "The company deliberately stayed small — fewer than 80 employees — and has remained profitable and independent for over 25 years, never selling and never chasing hypergrowth.",
        outcomeType: "quiet",
        referenceDecision: "fund",
      },
      {
        id: "s1-c1",
        fictionalName: "Podline",
        description:
          "A podcasting platform built by two Silicon Valley founders, right as a bigger player was about to dominate the podcast space. Team quietly built a side feature letting users post short status updates — and that side feature started getting more use than the podcasting product itself.",
        stats: [
          "Founded 2005",
          "Small early-stage team",
          "Seed funding returned to investors mid-pivot",
        ],
        realName: "Twitter (originally Odeo)",
        outcome:
          "The founders returned their $5M in seed funding to investors rather than force a failing podcasting product forward, then rebuilt around the side feature. It became one of the most influential communication platforms in the world.",
        outcomeType: "success",
        referenceDecision: "fund",
      },
    ],
  },
  {
    id: "set-2",
    cards: [
      {
        id: "s2-c2",
        fictionalName: "StayNest",
        description:
          "An online marketplace where ordinary people could rent spare rooms, couches, or empty apartments to travelers. Early usage was concentrated in a few cities, the idea required strangers to trust one another inside their homes, and investors questioned whether people sleeping on air mattresses could ever become a market large enough to challenge hotels.",
        stats: [
          "Founded 2008",
          "Marketplace connecting hosts and travelers",
          "Early traction concentrated in a handful of cities",
        ],
        realName: "Airbnb",
        outcome:
          "Union Square Ventures considered the company but passed. Fred Wilson later admitted they focused too much on the strange early product — air mattresses on apartment floors — and not enough on what the founders could eventually build. Airbnb went on to become a global accommodation marketplace and became a public company in 2020.",
        outcomeType: "success",
        referenceDecision: "pass",
      },
      {
        id: "s2-c1",
        fictionalName: "VitaDrop",
        description:
          "A health-tech startup claiming its compact proprietary machines could run a wide range of laboratory tests from only a tiny finger-prick of blood. The company secured major retail partnerships and attracted prominent investors, but remained unusually secretive about how its core technology worked and gave outsiders very limited opportunities to independently validate it.",
        stats: ["Founded 2003", "Valued at ~$9B at peak", "Raised $700M+ from investors"],
        realName: "Theranos",
        outcome:
          "GV founder Bill Maris said his firm examined Theranos and chose not to invest after its life-sciences diligence raised concerns about the technology. Theranos later collapsed after investigations found major problems with its blood-testing claims. The company dissolved in 2018, and founder Elizabeth Holmes was later convicted of defrauding investors.",
        outcomeType: "failure",
        referenceDecision: "pass",
      },
      {
        id: "s2-c3",
        fictionalName: "PureSqueeze",
        description:
          "A Wi-Fi-connected home juicing machine that used proprietary produce packs, priced at several hundred dollars, backed by well-known Silicon Valley venture firms as a health-tech hardware bet.",
        stats: ["Founded 2013", "Raised $120M from top-tier VCs", "Original device priced at $699"],
        realName: "Juicero",
        outcome:
          "A media investigation revealed that the proprietary produce packs could be squeezed by hand without using the expensive machine. Despite raising about $120M from major investors, Juicero shut down in 2017, roughly a year and a half after launching its product.",
        outcomeType: "failure",
        referenceDecision: "fund",
      },
      {
        id: "s2-c5",
        fictionalName: "VoltForge",
        description:
          "A startup attempting to build high-performance electric cars at a time when electric vehicles were widely viewed as impractical. Its first product was an expensive sports car, manufacturing required enormous amounts of capital, and the economics looked troubling because the company was losing money on the vehicles it planned to sell.",
        stats: [
          "Founded 2003",
          "First product was a premium electric sports car",
          "Capital-intensive manufacturing model",
        ],
        realName: "Tesla",
        outcome:
          "Bessemer Venture Partners' Byron Deeter met the Tesla team and test-drove the Roadster in 2006 but passed on investing, in part because he was uncomfortable with the company's negative margins. Tesla later went public in 2010 and grew into one of the world's most valuable automobile companies.",
        outcomeType: "success",
        referenceDecision: "pass",
      },
      {
        id: "s2-c4",
        fictionalName: "Localboard",
        description:
          "A simple, text-based online bulletin board for local classifieds and community postings, started as a side project by a software engineer while he kept his day job. The founder repeatedly resisted outside pressure to raise venture capital, aggressively monetize the service, or turn it into a conventional high-growth technology company.",
        stats: [
          "Founded mid-1990s",
          "Never raised traditional VC funding",
          "Operated with an unusually small team",
        ],
        realName: "Craigslist",
        outcome:
          "Craigslist never produced the IPO or giant venture exit normally expected from a technology startup. Instead, it remained independent, lightly monetized and profitable for decades with a remarkably small organization. It became a valuable business without following the normal venture-capital growth playbook.",
        outcomeType: "quiet",
        referenceDecision: "pass",
      },
    ],
  },
  {
    id: "set-3",
    cards: [
      {
        id: "s3-c1",
        fictionalName: "Pawtique",
        description:
          "An online retailer selling pet food, toys, and supplies directly to consumers during the dot-com boom. The company spent heavily on brand awareness, offered discounts and convenient delivery, and attracted backing from Amazon. Its widely recognized sock-puppet mascot became one of the best-known advertising characters of the era, even as the economics of shipping bulky, low-margin pet products remained difficult.",
        stats: [
          "Commercial operations began 1999",
          "IPO sold $82.5M of stock in Feb 2000",
          "Amazon was a major early investor",
        ],
        realName: "Pets.com",
        outcome:
          "The business burned through cash while struggling with high fulfillment costs and weak economics. After failing to secure additional financing or a buyer, its board approved a wind-down in November 2000, only months after its IPO. The web store stopped taking orders on November 10, 2000, and the company was subsequently dissolved.",
        outcomeType: "failure",
        referenceDecision: "fund",
      },
      {
        id: "s3-c3",
        fictionalName: "FriendSpace",
        description:
          "An early social network built around personal profiles, friends, photos, blogs, and music. It became one of the biggest destinations on the internet and was especially influential among musicians and younger users. A major media conglomerate acquired its parent company while the network was still growing rapidly, betting that social networking would become a major advertising platform.",
        stats: [
          "Parent company acquired for $580M in 2005",
          "Reached hundreds of millions of registered users",
          "Sold again for about $35M in 2011",
        ],
        realName: "MySpace",
        outcome:
          "MySpace remained culturally important for years, but Facebook eventually overtook it in global usage and advertisers followed the audience. News Corp, which had acquired MySpace's parent Intermix Media for $580 million, ultimately sold the struggling social network for roughly $35 million in 2011. The brand continued under new ownership, but its position and economic value had fallen dramatically.",
        outcomeType: "failure",
        referenceDecision: "fund",
      },
      {
        id: "s3-c2",
        fictionalName: "IndexForge",
        description:
          "Two Stanford graduate students built a new search engine that ranked web pages partly by analyzing how other pages linked to them. At the time, internet users already had established search engines and large web portals to choose from, making another search company look like a crowded bet. The founders initially worked from university rooms before moving into a rented garage.",
        stats: [
          "Company officially formed in 1998",
          "2 Stanford graduate-student founders",
          "First major outside check: $100K",
        ],
        realName: "Google",
        outcome:
          "Bessemer Venture Partners had an extraordinary early opportunity to meet the founders. Partner David Cowan's friend was renting her garage to Larry Page and Sergey Brin and repeatedly offered to introduce them, but Cowan passed on the opportunity. Google later became the dominant global search business, went public in 2004, and grew into one of the world's largest technology companies.",
        outcomeType: "success",
        referenceDecision: "pass",
      },
      {
        id: "s3-c5",
        fictionalName: "NovaExchange",
        description:
          "A rapidly growing cryptocurrency exchange built for active traders, offering spot and derivatives trading through a polished platform. The company attracted major institutional investors, signed high-profile sponsorship deals, and presented itself as one of the most sophisticated businesses in the crypto industry. Behind the growth, however, its governance was unusually concentrated and some experienced investors were uncomfortable with the oversight structure.",
        stats: [
          "Founded 2019",
          "Valued at $32B in Jan 2022",
          "Raised more than $2B from major investors",
        ],
        realName: "FTX",
        outcome:
          "Crypto investor Katie Haun later said she chose not to invest in FTX because its lack of proper governance was a major red flag. Other prominent investors did invest. In November 2022, a rush of customer withdrawals exposed a massive liquidity crisis and FTX filed for Chapter 11 bankruptcy. Founder Sam Bankman-Fried was later convicted of fraud. In this case, walking away from an apparently spectacular growth company was the right investment decision.",
        outcomeType: "failure",
        referenceDecision: "pass",
      },
      {
        id: "s3-c4",
        fictionalName: "TuneMeet",
        description:
          "A website originally conceived around video dating, where users would upload clips introducing themselves and describing the kind of partner they wanted to meet. The founders became so desperate for dating videos that they reportedly offered women on Craigslist $20 to upload one, but received no takers. They abandoned the dating restriction and instead allowed people to upload almost any kind of video.",
        stats: [
          "Founded Feb 2005",
          "3 co-founders with PayPal backgrounds",
          "First official upload: 'Me at the zoo', about 19 seconds",
        ],
        realName: "YouTube",
        outcome:
          "Opening the service to general video transformed the company. User-generated videos spread rapidly and YouTube became one of the fastest-growing sites on the web. Google agreed to acquire YouTube in October 2006 for $1.65 billion in stock and completed the acquisition that November, less than two years after the company was founded.",
        outcomeType: "success",
        referenceDecision: "fund",
      },
    ],
  },
];
