import type { Metadata } from "next";

import { PanicCall } from "./PanicCall";

export const metadata: Metadata = {
  title: "Panic Call | Private Wealth Mini-Games",
  description: "Navigate a high-emotion client call during market stress.",
};

export default function PanicCallPage() {
  return <PanicCall />;
}
