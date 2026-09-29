import type { Metadata } from "next";

import { Counteroffer } from "./Counteroffer";

export const metadata: Metadata = {
  title: "Counteroffer | Investment Banking Mini-Games",
  description:
    "Negotiate a three-round sell-side deal while balancing buyer acceptability and seller terms.",
};

export default function CounterofferPage() {
  return <Counteroffer />;
}
