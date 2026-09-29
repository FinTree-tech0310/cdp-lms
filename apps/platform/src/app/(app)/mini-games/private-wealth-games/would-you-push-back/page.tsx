import type { Metadata } from "next";

import { WouldYouPushBack } from "./WouldYouPushBack";

export const metadata: Metadata = {
  title: "Would You Push Back? | Private Wealth Mini-Games",
  description: "Respond to rapid client requests with considered advisor judgment.",
};

export default function WouldYouPushBackPage() {
  return <WouldYouPushBack />;
}
