import type { ThesisDefenseScenario } from "../_lib/thesis-defense-types";
import { validateThesisDefenseScenarios } from "../_lib/validate-thesis-defense";

const AUTHORED_THESIS_DEFENSE_SCENARIOS = [
  {
    id: "td-1",
    stockContext: "CloudMetrics Inc. is a mid-cap SaaS company that has struggled with thin margins for years despite strong revenue growth.",
    ratingSummary: "Buy rating, $95 price target. Thesis: a shift toward higher-margin enterprise contracts and reduced customer-acquisition spend will drive significant margin expansion over the next 18 months.",
    questions: [
      { id: "td1-q1", questionNumber: 1, pmQuestionText: "Walk me through why margins actually expand here. What's the specific driver?", options: [
        { id: "td1-q1-a", label: "The mix of enterprise contracts, which carry roughly 15 points higher gross margin, has grown from 30% to 45% of new bookings over the last three quarters — that shift alone drives most of the projected expansion.", scoreImpact: 3, pmReaction: "That's a specific, trackable driver — good. I'll want to see if that mix shift actually holds up in the next print." },
        { id: "td1-q1-b", label: "Management has a strong track record of execution, and I believe they'll figure out how to get margins up as the company matures.", scoreImpact: -3, pmReaction: "That's not an analysis, that's a hope. I need a mechanism, not a character reference." },
        { id: "td1-q1-c", label: "It's a combination of several factors including operating leverage, pricing, and cost discipline that should play out over time.", scoreImpact: -1, pmReaction: "That's vague enough to mean almost anything. Which of those actually moves the needle, and by how much?" },
      ]},
      { id: "td1-q2", questionNumber: 2, pmQuestionText: "What if the enterprise sales cycle takes longer than expected and that mix shift stalls out?", options: [
        { id: "td1-q2-a", label: "Honestly, if that mix shift stalls, a meaningful chunk of my margin thesis breaks — I'd need to see at least two more quarters of stalled mix before conceding that, but I'm watching it closely.", scoreImpact: 3, pmReaction: "I appreciate you naming the actual risk to your own thesis instead of dismissing it. That's the right instinct." },
        { id: "td1-q2-b", label: "That's a fair risk, but I'm confident management will find other ways to expand margins even if that specific driver slows down.", scoreImpact: -2, pmReaction: "You're hand-waving past the exact risk I asked about. What are those 'other ways,' specifically?" },
        { id: "td1-q2-c", label: "Enterprise sales cycles are always a risk for any SaaS company, so this isn't unique to CloudMetrics.", scoreImpact: -3, pmReaction: "That's true of every SaaS company on earth and tells me nothing about this one. You didn't answer the question." },
      ]},
      { id: "td1-q3", questionNumber: 3, pmQuestionText: "The stock already ran up 20% this quarter. Isn't a lot of this margin story already priced in?", options: [
        { id: "td1-q3-a", label: "Some of it is, which is exactly why my price target only implies about 12% further upside from here rather than a much larger number — the run-up is partially, not fully, reflecting the thesis.", scoreImpact: 3, pmReaction: "Good — you're accounting for where the stock already sits rather than ignoring it. That's a mature way to think about it." },
        { id: "td1-q3-b", label: "The stock still has plenty of room to run regardless of the recent move — I don't think the run-up changes my thesis at all.", scoreImpact: -2, pmReaction: "You're dismissing a legitimate valuation question instead of engaging with it. That's a red flag in how you think about entry points." },
        { id: "td1-q3-c", label: "I hadn't really factored the recent run-up into my target directly, but I still believe in the long-term story.", scoreImpact: -1, pmReaction: "So your price target doesn't actually account for where the stock is today. That's a real gap." },
      ]},
      { id: "td1-q4", questionNumber: 4, pmQuestionText: "If you're wrong about this, what's the first sign we'd see?", options: [
        { id: "td1-q4-a", label: "A slowdown in the enterprise-mix percentage in the quarterly bookings disclosure, or gross margin coming in flat quarter-over-quarter despite revenue growth — either would tell me the thesis is breaking before the stock necessarily reacts.", scoreImpact: 3, pmReaction: "That's exactly the kind of leading indicator I want an analyst watching. Good." },
        { id: "td1-q4-b", label: "I'd probably notice if the stock started underperforming the sector, and I'd reassess from there.", scoreImpact: -2, pmReaction: "Waiting for the stock price to tell you you're wrong means you're always late. I want a fundamental signal, not a price signal." },
        { id: "td1-q4-c", label: "I'm fairly confident in the thesis, so I haven't really mapped out what would prove it wrong.", scoreImpact: -3, pmReaction: "Every thesis needs a clear falsification point. Not having one at all is a serious gap." },
      ]},
    ],
    thresholdHigh: 8, thresholdLow: -2,
    endingConvinced: "The PM leaves the meeting genuinely persuaded — not just by the thesis itself, but by how clearly you understood its own weak points and what would prove it wrong. They tell you they're comfortable sizing up the position based on this conversation.",
    endingSkeptical: "The PM isn't dismissing the thesis outright, but leaves with real reservations — some of your answers were solid, others left gaps they're not fully comfortable with. They'll keep the position small until you can address the weaker points directly.",
    endingUnconvinced: "The PM leaves unconvinced. Too many answers relied on confidence rather than substance, and you couldn't clearly articulate what would prove the thesis wrong. They pass on the position for now and suggest you come back with a tighter case.",
  },
  {
    id: "td-2",
    stockContext: "Harlow & Fitch is a legacy department store chain. You've published a Sell rating while most of the Street remains neutral to positive.",
    ratingSummary: "Sell rating, $18 price target (versus a $27 current price). Thesis: declining mall foot traffic and market-share loss to e-commerce will compress both revenue and margins faster than the Street currently expects.",
    questions: [
      { id: "td2-q1", questionNumber: 1, pmQuestionText: "You're well below consensus here. What are you seeing that other analysts aren't?", options: [
        { id: "td2-q1-a", label: "Foot traffic data from three independent mall-tracking sources all show a 12-15% year-over-year decline at the company's top 20 locations by revenue — that's a bigger drop than what's baked into consensus same-store-sales estimates.", scoreImpact: 3, pmReaction: "That's a real, specific data source, not just a vibe. I want to know how you're getting that data and how reliable it's been historically." },
        { id: "td2-q1-b", label: "I just think department stores are a dying business model in general, and the market hasn't fully priced that in yet.", scoreImpact: -3, pmReaction: "That's a narrative, not a variant view backed by anything specific to this company right now. Give me something concrete." },
        { id: "td2-q1-c", label: "Management's own commentary on the last call sounded less confident than usual, which made me think the trends are worse than they're letting on.", scoreImpact: -1, pmReaction: "Reading tone into a call is fine as a supporting detail, but it's thin as your primary evidence for being this far below consensus." },
      ]},
      { id: "td2-q2", questionNumber: 2, pmQuestionText: "The company just announced a cost-cutting program. Doesn't that offset some of the revenue pressure you're modeling?", options: [
        { id: "td2-q2-a", label: "It helps margins in the near term, but most of the cuts are in corporate overhead, not store-level costs — so it doesn't address the actual foot-traffic problem, it just buys a couple quarters of better-looking margins before the top-line issue reasserts itself.", scoreImpact: 3, pmReaction: "Good — you've actually looked at where the cuts are coming from instead of just netting them against your model generically." },
        { id: "td2-q2-b", label: "Cost cuts rarely work out the way management promises, so I'm skeptical it'll matter much either way.", scoreImpact: -2, pmReaction: "That's a general skepticism, not an actual assessment of this specific program. What did they actually announce?" },
        { id: "td2-q2-c", label: "I'll need to update my model once we see the actual cost savings materialize in a future quarter.", scoreImpact: -1, pmReaction: "That's fair as a caveat, but I'm asking what you think right now, today, with the information you already have." },
      ]},
      { id: "td2-q3", questionNumber: 3, pmQuestionText: "If the stock rallies 15% on a short squeeze or a surprise good quarter, does that change your thesis?", options: [
        { id: "td2-q3-a", label: "Not the thesis itself — the structural foot-traffic decline doesn't reverse because of one good quarter or technical positioning — but I'd revisit my price target and timing if a rally like that happened, since entry point matters even when the long-term view is right.", scoreImpact: 3, pmReaction: "Good — you're separating the thesis from the stock's short-term price action, which a lot of analysts fail to do." },
        { id: "td2-q3-b", label: "No, I'd stick with my target regardless — a short-term rally doesn't change the fundamentals.", scoreImpact: -1, pmReaction: "That's directionally fine, but a flat refusal to revisit anything regardless of price action is its own kind of rigidity." },
        { id: "td2-q3-c", label: "That would make me nervous and I'd probably want to reconsider the rating entirely.", scoreImpact: -3, pmReaction: "You're letting short-term price action override a thesis built on multi-quarter structural data. That's exactly backwards." },
      ]},
      { id: "td2-q4", questionNumber: 4, pmQuestionText: "What would actually make you wrong here?", options: [
        { id: "td2-q4-a", label: "If the foot-traffic data I'm tracking reverses for two consecutive quarters, or if e-commerce sales growth actually starts pulling meaningfully from competitors rather than this specific chain, I'd need to seriously revisit the thesis.", scoreImpact: 3, pmReaction: "That's a clear, checkable falsification condition. Exactly what I want to hear." },
        { id: "td2-q4-b", label: "I suppose if the whole retail sector rallies, that would put pressure on the short thesis regardless of company-specific fundamentals.", scoreImpact: -2, pmReaction: "A sector-wide rally isn't a reason your specific thesis is wrong, it's just market noise. I asked what would prove your view incorrect." },
        { id: "td2-q4-c", label: "I'm fairly confident in the structural decline story, so I don't see much that would change my mind in the near term.", scoreImpact: -3, pmReaction: "An analyst who can't imagine being wrong is an analyst I don't trust to update when the data changes." },
      ]},
    ],
    thresholdHigh: 8, thresholdLow: -3,
    endingConvinced: "The PM is persuaded the variant view is well-supported, not just contrarian for its own sake. They agree to initiate a short position sized meaningfully, and ask you to keep tracking the foot-traffic data closely as your key monitoring metric.",
    endingSkeptical: "The PM sees real substance in parts of your thesis but isn't fully sold — some of your reasoning leaned on general skepticism rather than specific evidence. They'll start with a small position and want to revisit after the next print.",
    endingUnconvinced: "The PM isn't convinced this is a well-supported variant view rather than just a hunch about a struggling industry. They pass on the short and suggest you come back once you've tightened the specific, checkable evidence behind it.",
  },
  {
    id: "td-3",
    stockContext: "Nexcore Semiconductor is entering a new product cycle after two disappointing years. You've published a Buy rating based on the upcoming chip launch.",
    ratingSummary: "Buy rating, $140 price target (versus $95 current price). Thesis: the new chip architecture launching next quarter will meaningfully take market share from the company's largest competitor.",
    questions: [
      { id: "td3-q1", questionNumber: 1, pmQuestionText: "Product cycle bets in semiconductors are notoriously hard to call correctly. Why should I trust this one?", options: [
        { id: "td3-q1-a", label: "The company's publicly disclosed architecture data points to roughly 30% better performance per watt than the competitor's current-generation chip, and two major OEMs have already announced designs using the new platform — enough evidence for me to model meaningful, though not dominant, share gains.", scoreImpact: 3, pmReaction: "That's specific and checkable. I like that you're combining product evidence with actual customer adoption rather than relying on launch hype." },
        { id: "td3-q1-b", label: "This management team has a great track record, and I trust they've built something genuinely competitive this time.", scoreImpact: -3, pmReaction: "Track record is context, not evidence for this specific product. I need something about the actual chip." },
        { id: "td3-q1-c", label: "The timing lines up well with the competitor's own product cycle slowing down, so the conditions seem favorable.", scoreImpact: -1, pmReaction: "That's a reasonable contextual point, but it's not actually evidence that this specific product is good enough to take share." },
      ]},
      { id: "td3-q2", questionNumber: 2, pmQuestionText: "What if the competitor responds with an aggressive price cut the moment this launches?", options: [
        { id: "td3-q2-a", label: "The product's expected performance-per-watt advantage gives Nexcore some room to absorb a competitor price cut, especially for customers where power efficiency drives real operating costs. But I still model slower share gains under that scenario rather than assuming pricing won't matter.", scoreImpact: 3, pmReaction: "Good — you've already accounted for a competitive response instead of assuming the launch happens uncontested." },
        { id: "td3-q2-b", label: "A price war would hurt the competitor more than it hurts Nexcore, so I'm not too worried about that scenario.", scoreImpact: -2, pmReaction: "That might be true, but you haven't actually told me why, or how it affects your specific share-gain assumption." },
        { id: "td3-q2-c", label: "That's a risk, but I think the product is strong enough on its own that pricing won't matter much.", scoreImpact: -1, pmReaction: "You're asserting pricing doesn't matter without really engaging with why. Customers generally do care about price." },
      ]},
      { id: "td3-q3", questionNumber: 3, pmQuestionText: "Your price target implies the stock nearly re-rates to the sector's top multiple. Is that realistic?", options: [
        { id: "td3-q3-a", label: "It's aggressive, which is why I've flagged it as dependent on the share-gain thesis actually playing out over the next two quarters — if the early sales data comes in below my expectations, I'd revise the target down meaningfully rather than defend the multiple regardless of results.", scoreImpact: 3, pmReaction: "I like that the target isn't a fixed anchor — you've tied it explicitly to a checkpoint you'll actually revisit." },
        { id: "td3-q3-b", label: "If the product performs as well as I expect, that multiple is fully justified, so I'm comfortable with the target as is.", scoreImpact: -1, pmReaction: "That's circular — the target is justified if your thesis is right, which is exactly what we're trying to stress-test here." },
        { id: "td3-q3-c", label: "I based the target on where similar product-cycle stories have traded historically, so I think it's a reasonable comparison.", scoreImpact: -2, pmReaction: "Which historical comparisons, specifically, and were those companies actually similar in competitive position? That's doing a lot of unexamined work in your target." },
      ]},
      { id: "td3-q4", questionNumber: 4, pmQuestionText: "What's the earliest data point that would tell us if this thesis is playing out or not?", options: [
        { id: "td3-q4-a", label: "Channel checks and early sell-through data typically show up within 4-6 weeks of launch, well before the next earnings report — I'd be watching those closely as the first real signal, rather than waiting for the official quarterly numbers.", scoreImpact: 3, pmReaction: "Exactly the kind of leading indicator that lets us act before the market fully catches up either way. Good." },
        { id: "td3-q4-b", label: "We'll probably get a decent read from the next earnings call and management's commentary on early demand.", scoreImpact: -1, pmReaction: "That's the obvious, lagging answer. Is there really nothing earlier than the next earnings report?" },
        { id: "td3-q4-c", label: "I think we'll just have to wait and see how the market reacts once the product is out and reviewed.", scoreImpact: -3, pmReaction: "'Wait and see' isn't a monitoring plan. I need to know what you're actually going to track." },
      ]},
    ],
    thresholdHigh: 8, thresholdLow: -3,
    endingConvinced: "The PM is convinced the thesis is grounded in real, checkable evidence rather than a hopeful narrative about a product cycle. They agree to build a position ahead of the launch and want your channel-check data flagged the moment it's available.",
    endingSkeptical: "The PM finds some of your reasoning genuinely solid, but a few answers leaned on optimism rather than evidence. They'll take a smaller starter position and wait for early sell-through data before committing further.",
    endingUnconvinced: "The PM isn't convinced this rises above a hopeful bet on a product cycle. Too many answers relied on trusting management or general favorable conditions rather than specific evidence. They pass for now.",
  },
] satisfies readonly ThesisDefenseScenario[];

validateThesisDefenseScenarios(AUTHORED_THESIS_DEFENSE_SCENARIOS);
export const THESIS_DEFENSE_SCENARIOS: readonly ThesisDefenseScenario[] = AUTHORED_THESIS_DEFENSE_SCENARIOS;
