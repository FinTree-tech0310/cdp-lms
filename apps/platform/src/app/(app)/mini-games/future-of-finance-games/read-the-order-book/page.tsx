import type { Metadata } from "next";

import { ReadTheOrderBook } from "./ReadTheOrderBook";

export const metadata: Metadata = {
  title: "Read the Order Book | Future of Finance Mini-Games",
  description: "Interpret displayed order-book depth and immediate execution conditions.",
};

export default function ReadTheOrderBookPage() {
  return <ReadTheOrderBook />;
}
