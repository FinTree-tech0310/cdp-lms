import type { Metadata } from "next";

import { InvestorMatch } from "./InvestorMatch";

export const metadata: Metadata = {
  title: "Investor Match | The Deal Room",
  description: "Choose an investor as a founder and explore the trade-offs six months later.",
};

export default function InvestorMatchPage() {
  return <InvestorMatch />;
}
