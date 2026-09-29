import type { Metadata } from "next";
import { BuildTheTradingAlgorithm } from "./BuildTheTradingAlgorithm";

export const metadata: Metadata = {
  title: "Build the Trading Algorithm | Future of Finance Mini-Games",
  description: "Choose fixed trading rules and inspect their deterministic backtest on an authored market period.",
};

export default function BuildTheTradingAlgorithmPage() {
  return <BuildTheTradingAlgorithm />;
}
