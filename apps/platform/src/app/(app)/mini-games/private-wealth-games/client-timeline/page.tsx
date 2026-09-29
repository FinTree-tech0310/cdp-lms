import type { Metadata } from "next";

import { ClientTimeline } from "./ClientTimeline";

export const metadata: Metadata = {
  title: "Client Timeline | Private Wealth Mini-Games",
  description: "Follow one client through three authored financial moments over time.",
};

export default function ClientTimelinePage() {
  return <ClientTimeline />;
}
