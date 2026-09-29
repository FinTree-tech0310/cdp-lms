import type { AnalystNoteScenario } from "../_lib/analyst-note-types";
import { validateAnalystNoteScenarios } from "../_lib/validate-analyst-note-scenarios";

const AUTHORED_ANALYST_NOTE_SCENARIOS = [
  {
    id: "note-1",
    noteContext: "Draft initiation note on Vantage Robotics, a mid-cap industrial automation company. Rating: Buy.",
    lines: [
      { id: "n1-l1", text: "Vantage Robotics reported Q3 revenue of $340M, up 18% year-over-year, driven by strong demand for its warehouse automation systems.", isProblematic: false, reasoning: "A straightforward, factual statement of reported results with a specific, attributable driver — exactly what a research note should contain." },
      { id: "n1-l2", text: "Management noted on the call that order backlog grew to $890M, providing visibility into revenue for the next several quarters.", isProblematic: false, reasoning: "This accurately reports what management stated, with appropriate attribution ('management noted'), rather than presenting it as the analyst's own independent conclusion." },
      { id: "n1-l3", text: "In our view, Vantage is the single best way to gain exposure to the industrial automation theme, and we see no credible reason for investors to consider any alternative in this space.", isProblematic: true, reasoning: "This crosses from analysis into promotional overreach — dismissing all alternatives as lacking 'any credible reason' isn't a supportable claim and reads as advocacy rather than balanced research." },
      { id: "n1-l4", text: "Gross margin expanded 140 basis points year-over-year to 42.3%, which management attributed to improved component sourcing.", isProblematic: false, reasoning: "A specific, sourced data point with clear attribution — well within normal research reporting." },
      { id: "n1-l5", text: "We are raising our price target to $110 from $95, implying 35% upside, based on a modestly higher multiple applied to our updated FY2 EPS estimate.", isProblematic: false, reasoning: "This clearly shows the mechanics behind the target change (multiple and EPS estimate), which is exactly the kind of transparency that supports a valuation change." },
      { id: "n1-l6", text: "This stock is going to be a huge winner, and we'd encourage clients to buy aggressively before the next print.", isProblematic: true, reasoning: "Casual, hype-driven language like 'huge winner' and urging clients to buy 'aggressively' ahead of an unknown future event reads as promotional rather than analytical, regardless of how positive the underlying thesis might genuinely be." },
      { id: "n1-l7", text: "Risks to our thesis include a slowdown in industrial capital expenditure and increased competition from larger, better-capitalized automation players.", isProblematic: false, reasoning: "A balanced risk disclosure is a standard and important part of a credible research note, not a weakness in the thesis." },
      { id: "n1-l8", text: "We maintain our Buy rating and view any pullback in the stock as a buying opportunity for long-term investors.", isProblematic: false, reasoning: "This is a standard, appropriately-hedged framing ('for long-term investors') rather than an unconditional directive, and stays within normal research note conventions." },
    ],
  },
  {
    id: "note-2",
    noteContext: "Draft note on Continental Airways following its Q2 earnings report. Rating: Hold, maintained.",
    lines: [
      { id: "n2-l1", text: "Continental Airways reported Q2 EPS of $1.42, ahead of consensus estimates of $1.35, driven by stronger-than-expected international passenger volumes.", isProblematic: false, reasoning: "Factual, sourced, and specific — a normal way to report a beat." },
      { id: "n2-l2", text: "Fuel costs rose 8% year-over-year, partially offsetting the revenue upside, consistent with broader industry trends this quarter.", isProblematic: false, reasoning: "Balanced context that explains a headwind without overstating or understating its impact." },
      { id: "n2-l3", text: "While near-term results were solid, we continue to believe the long-term trajectory here is exceptionally strong, and investors focusing on this quarter's numbers are likely missing the bigger picture entirely.", isProblematic: true, reasoning: "This is subtler than an obvious hype line, but 'missing the bigger picture entirely' dismisses any reasonable near-term concern without engaging with it — a way of steering readers past legitimate caution rather than addressing it with data." },
      { id: "n2-l4", text: "Management guided full-year capacity growth of 4-5%, in line with our prior estimate.", isProblematic: false, reasoning: "A neutral, factual restatement of guidance with clear attribution." },
      { id: "n2-l5", text: "We note that our firm's investment banking division has an active advisory relationship with Continental Airways, which is disclosed in accordance with firm policy.", isProblematic: false, reasoning: "This is exactly the kind of disclosure that should appear in a note where a banking relationship exists — including it, rather than omitting it, is the compliant and correct thing to do." },
      { id: "n2-l6", text: "We are maintaining our Hold rating, though we would characterize our stance as constructive given the underlying momentum in the business.", isProblematic: false, reasoning: "A Hold with a mildly constructive lean is a normal, honest expression of a genuinely mixed view — this isn't promotional, it's just not neutral to the point of saying nothing." },
      { id: "n2-l7", text: "Given the banking relationship noted above, we would encourage investors to weight our more optimistic commentary somewhat more heavily than the headline rating might suggest.", isProblematic: true, reasoning: "This is a serious compliance concern — explicitly suggesting the rating itself doesn't reflect the analyst's real view, and framing the banking relationship as a reason to trust the bullish commentary more, undermines the entire point of research independence." },
      { id: "n2-l8", text: "We will revisit our estimates following additional detail expected at the company's upcoming investor day next month.", isProblematic: false, reasoning: "A standard, appropriately forward-looking statement about when the note might be updated." },
    ],
  },
  {
    id: "note-3",
    noteContext: "Draft note on Solara Energy, a renewable energy developer, following a competitor's disappointing earnings report. Rating: Buy, maintained.",
    lines: [
      { id: "n3-l1", text: "A key competitor reported weaker-than-expected project completions this quarter, citing permitting delays across several state jurisdictions.", isProblematic: false, reasoning: "A factual, relevant industry data point that provides useful context for the sector." },
      { id: "n3-l2", text: "We do not believe Solara faces the same permitting risk, as the company's current project pipeline is concentrated in jurisdictions with historically faster approval timelines.", isProblematic: false, reasoning: "This is a specific, falsifiable claim about why the risk differs for this company — exactly the kind of differentiated analysis a research note should provide, rather than assuming shared industry risk applies equally everywhere." },
      { id: "n3-l3", text: "That said, we have not independently verified the current status of Solara's pending permits and are relying on the company's most recent public disclosures.", isProblematic: false, reasoning: "This is good practice, not a weakness — being transparent about the limits of the analyst's own verification is exactly the kind of honesty that should appear in research notes, not be edited out." },
      { id: "n3-l4", text: "Given the contrast with the competitor's results, we see this as further confirmation that Solara is the clear category leader with little to no meaningful competition.", isProblematic: true, reasoning: "One competitor's bad quarter for a company-specific reason (permitting delays) doesn't establish 'little to no meaningful competition' industry-wide — this overreaches well beyond what the cited evidence actually supports." },
      { id: "n3-l5", text: "We are maintaining our $62 price target, which implies roughly 18% upside from current levels.", isProblematic: false, reasoning: "A plain, factual statement of the target and implied upside with no embellishment." },
      { id: "n3-l6", text: "Investors who have been hesitant given broader sector concerns should feel reassured that Solara's specific execution has meaningfully de-risked the story relative to peers.", isProblematic: false, reasoning: "This is a genuinely supported, appropriately scoped claim — it's specific to Solara's execution rather than an industry-wide dismissal, and it's a reasonable interpretation of the differentiated permitting point made earlier in the note." },
      { id: "n3-l7", text: "We would also point out that Solara's founder has an excellent personal reputation in the renewable energy industry, which further supports our confidence in the name.", isProblematic: true, reasoning: "A founder's personal reputation isn't a substantive basis for an investment thesis — this is exactly the kind of soft, unverifiable claim that doesn't belong in a data-driven research note, regardless of whether the reputation itself is accurate." },
      { id: "n3-l8", text: "We will continue to monitor permitting timelines across Solara's active project pipeline as a key indicator for our thesis.", isProblematic: false, reasoning: "A clear, appropriate statement of what the analyst will actually track going forward." },
    ],
  },
  {
    id: "note-4",
    noteContext: "Draft note on Meridian Foods following an in-line quarterly report. Rating: Hold, maintained. This note contains no rating change and limited new information.",
    lines: [
      { id: "n4-l1", text: "Meridian Foods reported Q1 revenue of $1.2B, in line with consensus estimates of $1.19B.", isProblematic: false, reasoning: "A neutral, factual statement of an in-line result." },
      { id: "n4-l2", text: "Gross margin came in at 28.4%, roughly flat versus the prior-year period.", isProblematic: false, reasoning: "Factual and unremarkable, appropriately reported without embellishment." },
      { id: "n4-l3", text: "Management maintained full-year guidance, citing stable input costs and consistent demand trends across core product categories.", isProblematic: false, reasoning: "A clear, attributed restatement of management's own commentary." },
      { id: "n4-l4", text: "We see limited new information in this print to meaningfully change our view, and we are maintaining our Hold rating and $34 price target.", isProblematic: false, reasoning: "An honest, appropriately modest statement — not every quarter produces a meaningful update, and saying so plainly is good practice, not a weak note." },
      { id: "n4-l5", text: "The company's private-label segment continues to grow slightly faster than its branded portfolio, consistent with the trend we've noted over the past several quarters.", isProblematic: false, reasoning: "A specific, consistent, trackable observation with no overreach." },
      { id: "n4-l6", text: "We would note that this is a steady, unexciting quarter for a steady, unexciting business, and we don't think that's a bad thing for investors seeking stability.", isProblematic: false, reasoning: "This is candid and slightly informal in tone, but it's an honest characterization rather than a promotional claim — calling a business 'unexciting' is actually the opposite of overreach." },
      { id: "n4-l7", text: "Our checks with regional distributors suggest shelf placement for the company's newer product lines has improved modestly since last quarter, though we'd caution this is based on a small, informal sample rather than systematic data.", isProblematic: false, reasoning: "This is a strong model of how to present softer, less rigorous evidence — sharing it while being explicit about its limitations, rather than presenting an informal check as if it were comprehensive data." },
      { id: "n4-l8", text: "We continue to view Meridian as a reasonable holding for income-oriented investors given its consistent dividend, though we don't see a near-term catalyst for meaningful upside.", isProblematic: false, reasoning: "A balanced, appropriately scoped conclusion that matches a Hold rating — neither talking the stock up nor down beyond what the note's own content supports." },
    ],
  },
] satisfies readonly AnalystNoteScenario[];

validateAnalystNoteScenarios(AUTHORED_ANALYST_NOTE_SCENARIOS);

export const ANALYST_NOTE_SCENARIOS: readonly AnalystNoteScenario[] =
  AUTHORED_ANALYST_NOTE_SCENARIOS;
