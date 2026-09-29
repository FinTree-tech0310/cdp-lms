import type { Metadata } from "next";

import { BiddingWar } from "./BiddingWar";

export const metadata: Metadata = {
  title: "Bidding War | Investment Banking Mini-Games",
  description: "Navigate a competitive auction without losing valuation discipline.",
};

export default function BiddingWarPage() {
  return <BiddingWar />;
}
