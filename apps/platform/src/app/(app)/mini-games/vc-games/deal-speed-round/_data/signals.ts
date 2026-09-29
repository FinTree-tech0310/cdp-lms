export interface DealSignal {
  id: string;
  text: string;
}

export const DEAL_SIGNALS: readonly DealSignal[] = [
  { id: "signal-01", text: "Founder has done this before" },
  { id: "signal-02", text: "Revenue flat for 6 months" },
  { id: "signal-03", text: "Hot sector, no clear moat" },
  { id: "signal-04", text: "Two co-founders, no vesting cliff" },
  { id: "signal-05", text: "Customer retention above 90%" },
  { id: "signal-06", text: "Burn rate doubled in a quarter" },
  { id: "signal-07", text: "First-time founder, strong domain expertise" },
  { id: "signal-08", text: "Competitor just raised a mega-round" },
  { id: "signal-09", text: "No paying customers yet, huge waitlist" },
  { id: "signal-10", text: "Team of five, no technical co-founder" },
  { id: "signal-11", text: "Gross margins under 10%" },
  { id: "signal-12", text: "Product live for 18 months, still pre-revenue" },
  { id: "signal-13", text: "Founder walked away from a big-tech job for this" },
  { id: "signal-14", text: "Market size shrinking year over year" },
  { id: "signal-15", text: "Churn under 2% monthly" },
  { id: "signal-16", text: "Raised a huge round, no updated metrics since" },
  { id: "signal-17", text: "Solo founder, no co-founder at all" },
  { id: "signal-18", text: "Big enterprise logo signed as first customer" },
  { id: "signal-19", text: "Founder previously shut down a startup" },
  { id: "signal-20", text: "Regulatory approval still pending" },
  { id: "signal-21", text: "3x revenue growth quarter over quarter" },
  { id: "signal-22", text: "CAC has tripled in six months" },
  { id: "signal-23", text: "Advisory board full of industry veterans" },
  { id: "signal-24", text: "No clear path to profitability discussed" },
  { id: "signal-25", text: "Founder demoed the product live, it broke" },
  { id: "signal-26", text: "International expansion before proving one market" },
  { id: "signal-27", text: "Runway under 3 months" },
  { id: "signal-28", text: "Patent pending on core technology" },
  { id: "signal-29", text: "Team all remote, never met in person" },
  { id: "signal-30", text: "Founder answered every hard question directly" },
];
