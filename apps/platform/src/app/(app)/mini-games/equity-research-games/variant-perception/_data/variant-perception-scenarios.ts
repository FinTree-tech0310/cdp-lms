import type { VariantPerceptionScenario } from "../_lib/variant-perception-types";
import { validateVariantScenarios } from "../_lib/validate-variant-scenarios";
export const VARIANT_PERCEPTION_SCENARIOS: readonly VariantPerceptionScenario[] = [{
  id: "vp-3",
  setupContext: "The Street is broadly neutral on Corvus Biotech ahead of a major clinical trial readout, with most analysts waiting for the data before taking a firm stance. Your own review of the trial design raises a concern that patient dropout patterns could make the primary endpoint harder to hit than consensus expects — but the company has disclosed only limited interim detail, so your conclusion depends on assumptions you cannot independently verify.",
  options: [
    {
      optionId: "publishBold",
      outcome: "You published a high-conviction note warning that the trial was likely to miss its primary endpoint. When the data arrived, the endpoint was met cleanly and the dropout issue you had focused on proved immaterial. The stock rallied sharply, and clients questioned why you had presented an inference built on incomplete information with so much certainty. The problem wasn't that you considered a non-consensus risk — it was that your published conviction ran well ahead of the evidence available at the time.",
    },
    {
      optionId: "publishSoftened",
      outcome: "You published the dropout concern as a specific scenario risk rather than making it the centerpiece of your call. The trial ultimately met its primary endpoint and the issue did not materially affect the result. Your caution turned out not to be predictive, but the note aged reasonably well because you clearly separated a plausible risk from a conclusion you could not yet support with enough evidence.",
    },
    {
      optionId: "stayConsensus",
      outcome: "You decided the available evidence wasn't strong enough to justify moving away from your neutral stance before the trial data arrived. The study later met its primary endpoint cleanly and the dropout concern proved immaterial. You didn't distinguish yourself with a differentiated call, but you also avoided turning an interesting but under-supported hypothesis into a published conviction that the evidence did not yet justify.",
    },
  ],
}];
validateVariantScenarios(VARIANT_PERCEPTION_SCENARIOS);
