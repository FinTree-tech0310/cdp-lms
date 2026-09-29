import type { Metadata } from "next";
import { ModelUpdateReflex } from "./ModelUpdateReflex";

export const metadata: Metadata = {
  title: "Model Update Reflex | Equity Research Mini-Games",
  description: "Revise forecast assumptions as new information arrives and follow their effects through a financial model.",
};
export default function ModelUpdateReflexPage() { return <ModelUpdateReflex />; }
