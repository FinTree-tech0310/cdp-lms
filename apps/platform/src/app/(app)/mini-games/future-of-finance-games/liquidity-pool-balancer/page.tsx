import type { Metadata } from "next";
import { LiquidityPoolBalancer } from "./LiquidityPoolBalancer";

export const metadata: Metadata = {
  title: "Liquidity Pool Balancer | Future of Finance Mini-Games",
  description: "Balance a treasury swap's output requirement and price impact in a simplified liquidity pool.",
};

export default function LiquidityPoolBalancerPage() {
  return <LiquidityPoolBalancer />;
}
