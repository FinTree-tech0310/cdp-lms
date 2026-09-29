import type { CounterofferScenario } from "../_lib/counteroffer-types";

export const counterofferScenarios: CounterofferScenario[] = [
  {
    id: "co-1",
    dealContext: "BrightPath Software's founders are selling to a larger strategic acquirer looking to fold BrightPath's product into its existing platform. The founders want to maximize upfront value and move on quickly — a long earn-out or ongoing board obligations would tie them to a company they're ready to leave behind.",
    sellerPreferredValues: { price: 145, earnoutMonths: 6, governance: 0 },
    sellerStrongTermsNote: "For BrightPath's founders, a strong outcome means keeping price at $125M or above, limiting the earn-out to 15 months or less, and avoiding a board seat for the acquirer.",
    sellerStrongTermsRules: [
      { leverId: "price", operator: ">=", value: 125 },
      { leverId: "earnoutMonths", operator: "<=", value: 15 },
      { leverId: "governance", operator: "<=", value: 1 },
    ],
    levers: [
      { id: "price", label: "Purchase Price", unit: "$M", min: 50, max: 200, step: 1, buyerAcceptableMin: 90, buyerAcceptableMax: 130, buyerIdealValue: 105, startingLearnerValue: 160 },
      { id: "earnoutMonths", label: "Earn-out Length", unit: "months", min: 0, max: 36, step: 1, buyerAcceptableMin: 12, buyerAcceptableMax: 30, buyerIdealValue: 18, startingLearnerValue: 3 },
      {
        id: "governance", label: "Governance", unit: "", min: 0, max: 2, step: 1,
        buyerAcceptableMin: 0, buyerAcceptableMax: 2, buyerIdealValue: 1, startingLearnerValue: 0,
        options: [
          { value: 0, label: "No Board Involvement" },
          { value: 1, label: "Observer Rights" },
          { value: 2, label: "Board Seat" },
        ],
      },
    ],
    rounds: [
      {
        roundNumber: 1,
        buyerContextNote: "The acquirer's corporate development team opens by noting they've done this kind of deal many times before and expect the process to move quickly if terms are reasonable.",
        responses: [
          { tierId: "dealbreaker", responseText: "This is well outside what we can justify internally. We'd need to see a materially different structure before continuing this conversation." },
          { tierId: "skeptical", responseText: "We appreciate the proposal, but honestly, this feels aggressive relative to what we typically see for a business at this stage. We'll need real movement before round two." },
          { tierId: "cautious", responseText: "This is closer to workable than we expected. There's still distance between us, but we're willing to keep talking." },
          { tierId: "warming", responseText: "This is a reasonable opening position — closer to our own thinking than most sellers start at. We're optimistic we can find alignment quickly." },
        ],
      },
      {
        roundNumber: 2,
        responses: [
          { tierId: "dealbreaker", responseText: "This package is still outside what we can justify internally. We'd need materially more workable terms to keep moving." },
          { tierId: "skeptical", responseText: "We're not yet comfortable with this package. There is still meaningful distance between these terms and what we can support internally." },
          { tierId: "cautious", responseText: "This is within a range we can work with. There are still tradeoffs to resolve, but we see a path to final terms." },
          { tierId: "warming", responseText: "This is close to where we can get comfortable. We're prepared to move toward final terms." },
        ],
      },
      {
        roundNumber: 3,
        responses: [
          { tierId: "dealbreaker", responseText: "We've gone back and forth enough to know this isn't going to close on terms we can accept." },
          { tierId: "skeptical", responseText: "We appreciate the effort, but this still isn't quite where we need to be to move forward with confidence." },
          { tierId: "cautious", responseText: "We can work with this. It's not everything either side wanted, but it's a deal we're comfortable signing." },
          { tierId: "warming", responseText: "This works well for us. We're ready to move to final documentation." },
        ],
      },
    ],
    endingDealClosedStrong: "The deal closed on strong terms for BrightPath. The founders secured a high purchase price with a short earn-out and no ongoing board obligations — largely exiting on their own terms, which was their top priority going in.",
    endingDealClosedModest: "The deal closed, but on more modest terms than BrightPath's founders originally hoped for. They got a fair outcome overall, though a longer earn-out, lower price, or greater ongoing involvement means the exit came with more compromise than they'd wanted.",
    endingDealFellThrough: "After three rounds without meaningful convergence, the acquirer walked away from the table. BrightPath's founders will need to restart the process with a new buyer, having lost real time and leverage in the process.",
  },
  {
    id: "co-2",
    dealContext: "The Ferro family has run their industrial manufacturing business for three generations and is ready for a full, clean exit. They care most about walking away entirely — no lingering obligations, no earn-out tying their payout to results they won't control. The buyer, a strategic acquirer integrating Ferro's operations into a larger platform, wants meaningful board involvement during the transition to protect its investment.",
    sellerPreferredValues: { price: 110, earnoutMonths: 0, governance: 0 },
    sellerStrongTermsNote: "The Ferro family's ideal is a completely clean exit, but given the buyer's transition requirements, a strong negotiated outcome means preserving at least a $72M price, keeping the earn-out to 10 months or less, and limiting governance to observer-level involvement rather than a board seat.",
    sellerStrongTermsRules: [
      { leverId: "price", operator: ">=", value: 72 },
      { leverId: "earnoutMonths", operator: "<=", value: 10 },
      { leverId: "governance", operator: "<=", value: 1 },
    ],
    levers: [
      { id: "price", label: "Purchase Price", unit: "$M", min: 30, max: 120, step: 1, buyerAcceptableMin: 50, buyerAcceptableMax: 85, buyerIdealValue: 62, startingLearnerValue: 100 },
      { id: "earnoutMonths", label: "Earn-out Length", unit: "months", min: 0, max: 36, step: 1, buyerAcceptableMin: 6, buyerAcceptableMax: 24, buyerIdealValue: 12, startingLearnerValue: 0 },
      {
        id: "governance", label: "Governance", unit: "", min: 0, max: 2, step: 1,
        buyerAcceptableMin: 1, buyerAcceptableMax: 2, buyerIdealValue: 2, startingLearnerValue: 0,
        options: [
          { value: 0, label: "No Ongoing Role" },
          { value: 1, label: "Transition Observer Rights" },
          { value: 2, label: "Board Seat During Transition" },
        ],
      },
    ],
    rounds: [
      {
        roundNumber: 1,
        buyerContextNote: "The acquirer's integration lead makes clear that a hands-off transition isn't something they're comfortable with, given how operationally intertwined this business will become with their existing plants.",
        responses: [
          { tierId: "dealbreaker", responseText: "A clean, no-involvement exit isn't something we can agree to for a business this operationally critical to us. We'd need a very different structure." },
          { tierId: "skeptical", responseText: "We understand the family's position, but walking away entirely isn't realistic for a deal this size from our side. Let's keep talking." },
          { tierId: "cautious", responseText: "This is more workable than we expected. We're still going to need some ongoing involvement, but the gap is manageable." },
          { tierId: "warming", responseText: "This is a thoughtful proposal that takes our integration concerns seriously. We're encouraged." },
        ],
      },
      {
        roundNumber: 2,
        responses: [
          { tierId: "dealbreaker", responseText: "This package still doesn't give us enough protection around the transition to sign off internally." },
          { tierId: "skeptical", responseText: "We're not comfortable enough with the transition structure yet. We need a package that gives us more certainty around ongoing involvement." },
          { tierId: "cautious", responseText: "This is a reasonable middle ground. We can see a path to a final structure from here." },
          { tierId: "warming", responseText: "This addresses our core integration concerns well. We're ready to move toward closing." },
        ],
      },
      {
        roundNumber: 3,
        responses: [
          { tierId: "dealbreaker", responseText: "After three rounds, we don't think we're going to reach something workable here." },
          { tierId: "skeptical", responseText: "We appreciate the family's patience, but this still doesn't give us the comfort we need to close." },
          { tierId: "cautious", responseText: "This works for us. It's a compromise on both sides, but one we're willing to sign." },
          { tierId: "warming", responseText: "This gives us exactly the transition confidence we needed. Let's finalize the paperwork." },
        ],
      },
    ],
    endingDealClosedStrong: "The deal closed on strong terms. The Ferro family preserved a strong price and limited the earn-out while giving the acquirer only the transition involvement needed to get comfortable — a negotiated exit that protected the family's priorities without losing the buyer.",
    endingDealClosedModest: "The deal closed, but the Ferro family accepted more compromise than they'd wanted for a truly clean exit — whether through price, earn-out length, or greater ongoing involvement. It's a workable transaction, just not the walk-away outcome they initially hoped to preserve.",
    endingDealFellThrough: "The buyer walked away after three rounds without reaching a workable structure. The Ferro family will need to decide whether to hold out for a buyer more willing to accept a hands-off transition, or reconsider their own priorities for the next negotiation.",
  },
  {
    id: "co-3",
    dealContext: "Meridian Retail Group is under real financial pressure — a lender covenant deadline is approaching, and the board needs a deal to close soon. The buyer, a private equity turnaround firm, knows this and is negotiating accordingly. Meridian's leadership wants enough time and price to give their turnaround plan a real chance to prove out.",
    sellerPreferredValues: { price: 55, earnoutMonths: 20, governance: 1 },
    sellerStrongTermsNote: "Given Meridian's balance-sheet pressure, a strong outcome means preserving a purchase price above $45M and at least a 10-month earn-out horizon so leadership has a meaningful chance to prove the turnaround plan. Closing certainty matters more here than retaining governance rights.",
    sellerStrongTermsRules: [
      { leverId: "price", operator: ">", value: 45 },
      { leverId: "earnoutMonths", operator: ">=", value: 10 },
    ],
    levers: [
      { id: "price", label: "Purchase Price", unit: "$M", min: 20, max: 80, step: 1, buyerAcceptableMin: 30, buyerAcceptableMax: 50, buyerIdealValue: 35, startingLearnerValue: 65 },
      { id: "earnoutMonths", label: "Earn-out Length", unit: "months", min: 0, max: 36, step: 1, buyerAcceptableMin: 0, buyerAcceptableMax: 12, buyerIdealValue: 6, startingLearnerValue: 24 },
      {
        id: "governance", label: "Governance", unit: "", min: 0, max: 2, step: 1,
        buyerAcceptableMin: 0, buyerAcceptableMax: 1, buyerIdealValue: 0, startingLearnerValue: 2,
        options: [
          { value: 0, label: "Buyer Operational Control" },
          { value: 1, label: "Shared Oversight" },
          { value: 2, label: "Seller Veto Rights" },
        ],
      },
    ],
    rounds: [
      {
        roundNumber: 1,
        buyerContextNote: "The turnaround firm's lead partner notes they're aware of the covenant timeline and would prefer a fast, clean close over a drawn-out negotiation.",
        responses: [
          { tierId: "dealbreaker", responseText: "Given the timeline pressure you're under, this isn't a realistic starting point. We'd encourage you to reconsider before the covenant deadline gets closer." },
          { tierId: "skeptical", responseText: "We understand wanting to protect value here, but this doesn't reflect the urgency of your situation. We need a package we can justify quickly." },
          { tierId: "cautious", responseText: "This is more reasonable than we expected given the pressure you're under. We're willing to keep working toward something." },
          { tierId: "warming", responseText: "This is a pragmatic opening position given your timeline. We're ready to move quickly." },
        ],
      },
      {
        roundNumber: 2,
        responses: [
          { tierId: "dealbreaker", responseText: "With the deadline approaching, this package is still too far from something we can execute in time." },
          { tierId: "skeptical", responseText: "This remains difficult to justify given the time pressure. We need terms that better reflect the execution risk and urgency." },
          { tierId: "cautious", responseText: "This is workable within the remaining timeline. We think it can be finalized before the deadline." },
          { tierId: "warming", responseText: "This gives us the speed and certainty we need. We're ready to move toward a fast close." },
        ],
      },
      {
        roundNumber: 3,
        responses: [
          { tierId: "dealbreaker", responseText: "We don't think we can close this in time on these terms, and we're not willing to extend further." },
          { tierId: "skeptical", responseText: "Given how close the deadline is, this still isn't enough to move forward confidently." },
          { tierId: "cautious", responseText: "Given the time pressure on both sides, this works. Let's move to finalize before the deadline." },
          { tierId: "warming", responseText: "This is exactly what we needed to move fast. We can close well ahead of your deadline." },
        ],
      },
    ],
    endingDealClosedStrong: "The deal closed on strong terms, and closed fast — Meridian preserved a price and earn-out structure that gave leadership meaningful room to execute the turnaround plan while still avoiding the covenant deadline.",
    endingDealClosedModest: "The deal closed ahead of the covenant deadline, but on tighter terms than Meridian's leadership wanted — a lower price, shorter earn-out, or both left less room for the turnaround plan to fully play out.",
    endingDealFellThrough: "With the covenant deadline now imminent and no deal in place, Meridian's board is facing a much harder set of options — a rushed sale at worse terms, or a difficult conversation with their lender.",
  },
  {
    id: "co-4",
    dealContext: "Alderbrook Health Partners is a physician-owned clinic network being acquired by a larger healthcare services roll-up. For the physician-owners, price matters less than retaining real influence over clinical decisions after the sale — the acquirer, meanwhile, wants full operational control to standardize processes across its growing portfolio of clinics.",
    sellerPreferredValues: { price: 120, earnoutMonths: 12, governance: 2 },
    sellerStrongTermsNote: "For Alderbrook's physician-owners, the defining priority is preserving meaningful influence over clinical decisions. A strong outcome therefore requires at least shared clinical governance, even if achieving that means compromising on price or earn-out length.",
    sellerStrongTermsRules: [{ leverId: "governance", operator: ">=", value: 1 }],
    levers: [
      { id: "price", label: "Purchase Price", unit: "$M", min: 40, max: 150, step: 1, buyerAcceptableMin: 70, buyerAcceptableMax: 110, buyerIdealValue: 85, startingLearnerValue: 140 },
      { id: "earnoutMonths", label: "Earn-out Length", unit: "months", min: 0, max: 36, step: 1, buyerAcceptableMin: 12, buyerAcceptableMax: 36, buyerIdealValue: 24, startingLearnerValue: 12 },
      {
        id: "governance", label: "Clinical Governance", unit: "", min: 0, max: 2, step: 1,
        buyerAcceptableMin: 0, buyerAcceptableMax: 1, buyerIdealValue: 0, startingLearnerValue: 2,
        options: [
          { value: 0, label: "Acquirer Clinical Control" },
          { value: 1, label: "Shared Clinical Governance" },
          { value: 2, label: "Physician Control / Veto Rights" },
        ],
      },
    ],
    rounds: [
      {
        roundNumber: 1,
        buyerContextNote: "The roll-up's acquisitions lead is direct about wanting standardized operational control across all of its acquired clinics, with limited exceptions.",
        responses: [
          { tierId: "dealbreaker", responseText: "Retaining this level of clinical governance isn't compatible with how we operate across our portfolio. We'd need a very different structure to continue." },
          { tierId: "skeptical", responseText: "We understand the physicians' concerns, but this level of ongoing involvement isn't something we typically agree to. Let's keep discussing." },
          { tierId: "cautious", responseText: "This is more flexible than our standard structure, and we're willing to explore it further." },
          { tierId: "warming", responseText: "This is closer to workable than most physician groups propose. We're open to continuing on this basis." },
        ],
      },
      {
        roundNumber: 2,
        responses: [
          { tierId: "dealbreaker", responseText: "This structure still preserves more seller control than fits our integration model." },
          { tierId: "skeptical", responseText: "We're not yet comfortable with how much operating independence this structure preserves." },
          { tierId: "cautious", responseText: "This is a workable compromise. We can see a path to final terms from here." },
          { tierId: "warming", responseText: "This gives us the operational clarity we need. We're ready to move toward final terms." },
        ],
      },
      {
        roundNumber: 3,
        responses: [
          { tierId: "dealbreaker", responseText: "After three rounds, this still doesn't fit how we integrate acquired practices. We don't think we can close this." },
          { tierId: "skeptical", responseText: "We appreciate the physicians' flexibility, but we're still not fully comfortable with this structure." },
          { tierId: "cautious", responseText: "This works for us. It's a genuine compromise, but one we can operate with." },
          { tierId: "warming", responseText: "This gives us exactly the structure we can work with. Let's move to finalize the agreement." },
        ],
      },
    ],
    endingDealClosedStrong: "The deal closed on strong terms for Alderbrook's physicians — they preserved meaningful, ongoing influence over clinical decisions, which mattered more to them than maximizing price, while giving the acquirer enough operational control to complete the transaction.",
    endingDealClosedModest: "The deal closed, but the physicians gave up more clinical control than they'd hoped in exchange for getting the transaction done. The economics may still be workable, but the outcome trades away the priority they cared about most.",
    endingDealFellThrough: "The roll-up walked away after three rounds without reaching agreement on governance structure. Alderbrook's physicians will need to decide whether to seek a buyer more willing to preserve clinical independence, or reconsider how much control they're willing to trade for a deal.",
  },
];
