export type FutureFinanceGame = {
  slug: string;
  title: string;
  domain: string;
  available: boolean;
  art: "signals" | "depth" | "contract" | "pool" | "rules";
};

export const FUTURE_FINANCE_GAMES: readonly FutureFinanceGame[] = [
  {
    slug: "fraud-signal-triage",
    title: "Fraud Signal Triage",
    domain: "Payments and fraud risk",
    available: true,
    art: "signals",
  },
  {
    slug: "read-the-order-book",
    title: "Read the Order Book",
    domain: "Market microstructure",
    available: true,
    art: "depth",
  },
  {
    slug: "smart-contract-audit",
    title: "Smart Contract Audit",
    domain: "Blockchain and technical risk",
    available: true,
    art: "contract",
  },
  {
    slug: "liquidity-pool-balancer",
    title: "Liquidity Pool Balancer",
    domain: "DeFi and automated markets",
    available: true,
    art: "pool",
  },
  {
    slug: "build-the-trading-algorithm",
    title: "Build the Trading Algorithm",
    domain: "Algorithmic trading",
    available: true,
    art: "rules",
  },
];
