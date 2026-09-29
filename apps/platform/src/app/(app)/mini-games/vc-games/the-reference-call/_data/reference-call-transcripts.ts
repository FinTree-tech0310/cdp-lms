export interface TranscriptLine {
  id: string;
  speaker: string;
  text: string;
  isRedFlag: boolean;
  whyItMatters?: string;
}

export interface ReferenceCallTranscript {
  id: string;
  founderName: string;
  referenceContext: string;
  diligenceFocus: string;
  lines: TranscriptLine[];
}

export const REFERENCE_CALL_TRANSCRIPTS: readonly ReferenceCallTranscript[] = [
  {
    id: "call-1",
    founderName: "the founder of Verdant Foods",
    referenceContext:
      "You're speaking with a former colleague who worked alongside the founder as an early hire at a logistics startup.",
    diligenceFocus:
      "Understand her management style, judgment under pressure, ability to delegate, and treatment of her team.",
    lines: [
      { id: "c1-l1", speaker: "You (VC)", text: "How did you first come to work with her?", isRedFlag: false },
      { id: "c1-l2", speaker: "Reference", text: "We were both early hires at the same logistics startup.", isRedFlag: false },
      { id: "c1-l3", speaker: "You (VC)", text: "What was she like as a manager?", isRedFlag: false },
      { id: "c1-l4", speaker: "Reference", text: "Genuinely great. Clear about priorities, gave real feedback.", isRedFlag: false },
      { id: "c1-l5", speaker: "You (VC)", text: "Did she handle pressure well?", isRedFlag: false },
      { id: "c1-l6", speaker: "Reference", text: "Better than most. I watched her stay calm during a really bad outage that could've lost us a major client.", isRedFlag: false },
      { id: "c1-l7", speaker: "You (VC)", text: "Any blind spots you noticed?", isRedFlag: false },
      { id: "c1-l8", speaker: "Reference", text: "She can be slow to delegate. Wants to own too much herself sometimes.", isRedFlag: false },
      { id: "c1-l9", speaker: "You (VC)", text: "Would that be a problem at scale, in your view?", isRedFlag: false },
      { id: "c1-l10", speaker: "Reference", text: "Possibly, but she's self-aware about it — she actually brought it up in her own review before I did.", isRedFlag: false },
      { id: "c1-l11", speaker: "You (VC)", text: "Did you ever see her take credit for someone else's work?", isRedFlag: false },
      { id: "c1-l12", speaker: "Reference", text: "Never. If anything she over-credits her team publicly.", isRedFlag: false },
      { id: "c1-l13", speaker: "You (VC)", text: "Anything you'd want us to know before we invest?", isRedFlag: false },
      { id: "c1-l14", speaker: "Reference", text: "Just that I'd invest myself if I had the check size for it.", isRedFlag: false },
    ],
  },
  {
    id: "call-2",
    founderName: "the founder of Northline",
    referenceContext:
      "You're speaking with a former colleague who worked closely with the founder for about two years.",
    diligenceFocus:
      "Understand his management style, team retention, and transparency around company performance.",
    lines: [
      { id: "c2-l1", speaker: "You (VC)", text: "How long did you two work together?", isRedFlag: false },
      { id: "c2-l2", speaker: "Reference", text: "About two years, at my last company.", isRedFlag: false },
      { id: "c2-l3", speaker: "You (VC)", text: "What was he like to work with day to day?", isRedFlag: false },
      { id: "c2-l4", speaker: "Reference", text: "Oh, incredibly driven. Always the first one in the office.", isRedFlag: false },
      { id: "c2-l5", speaker: "You (VC)", text: "How did the team feel about his management style?", isRedFlag: false },
      { id: "c2-l6", speaker: "Reference", text: "You know, everyone has their own way of doing things.", isRedFlag: true, whyItMatters: "A vague deflection instead of a direct answer about management style often signals discomfort with something specific the reference doesn't want to say outright." },
      { id: "c2-l7", speaker: "You (VC)", text: "Did anyone leave the team while he was leading it?", isRedFlag: false },
      { id: "c2-l8", speaker: "Reference", text: "A couple of people moved on, but that happens everywhere.", isRedFlag: true, whyItMatters: "Minimizing turnover with 'that happens everywhere' avoids answering whether the departures were related to him specifically." },
      { id: "c2-l9", speaker: "You (VC)", text: "Would you work with him again?", isRedFlag: false },
      { id: "c2-l10", speaker: "Reference", text: "Absolutely, without hesitation.", isRedFlag: false },
      { id: "c2-l11", speaker: "You (VC)", text: "Was he transparent with the team about company performance?", isRedFlag: false },
      { id: "c2-l12", speaker: "Reference", text: "He always painted a pretty optimistic picture, let's say.", isRedFlag: true, whyItMatters: "'Optimistic picture' is a soft way of implying the reference didn't fully trust the information being shared with the team." },
      { id: "c2-l13", speaker: "You (VC)", text: "Anything you'd flag for us before we make a decision?", isRedFlag: false },
      { id: "c2-l14", speaker: "Reference", text: "Just do your own homework on the financials, that's all I'll say.", isRedFlag: true, whyItMatters: "This is the clearest signal in the whole call — a direct, if indirect, warning to dig deeper before committing." },
    ],
  },
  {
    id: "call-3",
    founderName: "the founder of Pallet & Co.",
    referenceContext:
      "You're speaking with a former direct report who worked under the founder for about a year and a half.",
    diligenceFocus:
      "Understand her technical judgment, how she credits team contributions, and her response to difficult feedback.",
    lines: [
      { id: "c3-l1", speaker: "You (VC)", text: "What was your role relative to hers on the team?", isRedFlag: false },
      { id: "c3-l2", speaker: "Reference", text: "I reported directly to her for about a year and a half.", isRedFlag: false },
      { id: "c3-l3", speaker: "You (VC)", text: "How would you describe her technical judgment?", isRedFlag: false },
      { id: "c3-l4", speaker: "Reference", text: "Strong. She made some tough architecture calls early that paid off later.", isRedFlag: false },
      { id: "c3-l5", speaker: "You (VC)", text: "Did she ever present ideas that weren't originally hers as her own?", isRedFlag: false },
      { id: "c3-l6", speaker: "Reference", text: "Actually, yes — a redesign I proposed got presented to the board as her initiative. I let it go at the time.", isRedFlag: true, whyItMatters: "A direct, specific admission of the founder taking credit for someone else's work is a meaningful integrity and leadership signal." },
      { id: "c3-l7", speaker: "You (VC)", text: "Did you ever raise that with her afterward?", isRedFlag: false },
      { id: "c3-l8", speaker: "Reference", text: "Once. She got pretty defensive and said the board cared about the result, not who originally came up with it.", isRedFlag: true, whyItMatters: "The response matters as much as the original incident. Dismissing attribution concerns rather than acknowledging them suggests the behavior may reflect a broader leadership attitude." },
      { id: "c3-l9", speaker: "You (VC)", text: "How was she with the rest of the team day to day?", isRedFlag: false },
      { id: "c3-l10", speaker: "Reference", text: "Genuinely well-liked. People wanted to work for her.", isRedFlag: false },
      { id: "c3-l11", speaker: "You (VC)", text: "Did the credit issue affect team morale at all?", isRedFlag: false },
      { id: "c3-l12", speaker: "Reference", text: "Not that I noticed — I don't think most people knew.", isRedFlag: false },
      { id: "c3-l13", speaker: "You (VC)", text: "Would you still recommend her as a founder to back?", isRedFlag: false },
      { id: "c3-l14", speaker: "Reference", text: "I would, honestly. It bothered me, but it's not who she is overall.", isRedFlag: false },
      { id: "c3-l15", speaker: "You (VC)", text: "Anything else worth flagging?", isRedFlag: false },
      { id: "c3-l16", speaker: "Reference", text: "No, that's really the one thing that stuck with me.", isRedFlag: false },
    ],
  },
  {
    id: "call-4",
    founderName: "the founder of Ridgeline Health",
    referenceContext:
      "You're speaking with a former compliance lead who reported directly to the founder.",
    diligenceFocus:
      "Understand how the founder balances speed, process, and regulatory responsibility under pressure.",
    lines: [
      { id: "c4-l1", speaker: "You (VC)", text: "How closely did you work with him on the compliance side?", isRedFlag: false },
      { id: "c4-l2", speaker: "Reference", text: "Very closely. I was the compliance lead reporting into him.", isRedFlag: false },
      { id: "c4-l3", speaker: "You (VC)", text: "Did he take regulatory requirements seriously?", isRedFlag: false },
      { id: "c4-l4", speaker: "Reference", text: "Mostly, yes. He respected the process for the big things.", isRedFlag: false },
      { id: "c4-l5", speaker: "You (VC)", text: "What about the smaller things?", isRedFlag: false },
      { id: "c4-l6", speaker: "Reference", text: "There was a data-handling policy update he pushed us to launch ahead of, before the full review was actually signed off.", isRedFlag: true, whyItMatters: "Shipping ahead of a compliance sign-off in a health-data context is a specific, material corner cut — not a vague culture complaint." },
      { id: "c4-l7", speaker: "You (VC)", text: "Did that cause any actual issues?", isRedFlag: false },
      { id: "c4-l8", speaker: "Reference", text: "Nothing came of it that I know of, but it easily could have.", isRedFlag: false },
      { id: "c4-l9", speaker: "You (VC)", text: "Was that a one-time thing or a pattern?", isRedFlag: false },
      { id: "c4-l10", speaker: "Reference", text: "I'd call it a pattern under deadline pressure specifically, not a general habit.", isRedFlag: true, whyItMatters: "The reference is explicitly confirming this isn't isolated — it's a recurring behavior under pressure, which is exactly the condition a growing company will face often." },
      { id: "c4-l11", speaker: "You (VC)", text: "How did the rest of the team respond to that kind of pressure?", isRedFlag: false },
      { id: "c4-l12", speaker: "Reference", text: "Mixed. Some pushed back, some just went along with it.", isRedFlag: false },
      { id: "c4-l13", speaker: "You (VC)", text: "Did he listen when people pushed back?", isRedFlag: false },
      { id: "c4-l14", speaker: "Reference", text: "Eventually, usually. Not always in the moment.", isRedFlag: false },
      { id: "c4-l15", speaker: "You (VC)", text: "Anything else you think we should know?", isRedFlag: false },
      { id: "c4-l16", speaker: "Reference", text: "Just that speed mattered more to him than process, more often than I was comfortable with.", isRedFlag: true, whyItMatters: "A former compliance lead explicitly saying the founder repeatedly prioritized speed over process reinforces that the earlier incidents were part of a meaningful operating pattern." },
    ],
  },
  {
    id: "call-5",
    founderName: "the founder of Kettlewell",
    referenceContext:
      "You're speaking with a former co-founder who built and later shut down an earlier company with her.",
    diligenceFocus:
      "Understand how she handled financing uncertainty, team communication, and responsibility during a shutdown.",
    lines: [
      { id: "c5-l1", speaker: "You (VC)", text: "How did you two meet?", isRedFlag: false },
      { id: "c5-l2", speaker: "Reference", text: "We were co-founders at a company before this one, actually.", isRedFlag: false },
      { id: "c5-l3", speaker: "You (VC)", text: "How did that company end?", isRedFlag: false },
      { id: "c5-l4", speaker: "Reference", text: "It didn't work out. We ran out of runway and shut it down.", isRedFlag: false },
      { id: "c5-l5", speaker: "You (VC)", text: "Was there any tension between you two around how that ended?", isRedFlag: false },
      { id: "c5-l6", speaker: "Reference", text: "Some. She kept telling us a bridge round was basically done even after the lead investor had gone quiet for weeks.", isRedFlag: true, whyItMatters: "Continuing to present uncertain financing as effectively secured can distort how employees make career and operational decisions. It raises a transparency question worth investigating." },
      { id: "c5-l7", speaker: "You (VC)", text: "Did that affect your relationship afterward?", isRedFlag: false },
      { id: "c5-l8", speaker: "Reference", text: "We talked it through eventually. I don't hold the company failing against her.", isRedFlag: false },
      { id: "c5-l9", speaker: "You (VC)", text: "How did she communicate once it was clear the money wasn't coming?", isRedFlag: false },
      { id: "c5-l10", speaker: "Reference", text: "She waited until we had about two weeks of cash left before telling the whole team how close we were to shutting down.", isRedFlag: true, whyItMatters: "Waiting until only weeks of cash remain before telling employees materially limits their ability to plan. In a founder reference, that is a concrete transparency and judgment concern." },
      { id: "c5-l11", speaker: "You (VC)", text: "How did she view that decision afterward?", isRedFlag: false },
      { id: "c5-l12", speaker: "Reference", text: "She later admitted she waited too long and apologized to the team for it.", isRedFlag: false },
      { id: "c5-l13", speaker: "You (VC)", text: "Would you work with her again despite that?", isRedFlag: false },
      { id: "c5-l14", speaker: "Reference", text: "Possibly. She's learned a lot since then, and failure itself isn't what worries me.", isRedFlag: false },
      { id: "c5-l15", speaker: "You (VC)", text: "Anything else you'd want us to weigh carefully?", isRedFlag: false },
      { id: "c5-l16", speaker: "Reference", text: "No. Those communication decisions are the main thing I'd want you to understand.", isRedFlag: false },
    ],
  },
  {
    id: "call-6",
    founderName: "the founder of Circuit Bloom",
    referenceContext:
      "You're speaking with the founder's former co-founder, who worked with him during the company's early months.",
    diligenceFocus:
      "Understand how the co-founder relationship ended and how the founder handled ownership and difficult disagreements.",
    lines: [
      { id: "c6-l1", speaker: "You (VC)", text: "What was your working relationship with him?", isRedFlag: false },
      { id: "c6-l2", speaker: "Reference", text: "I was his co-founder for about 8 months before I left.", isRedFlag: false },
      { id: "c6-l3", speaker: "You (VC)", text: "What led to you leaving?", isRedFlag: false },
      { id: "c6-l4", speaker: "Reference", text: "We had different views on how fast to grow the team.", isRedFlag: false },
      { id: "c6-l5", speaker: "You (VC)", text: "Was there more to it than that?", isRedFlag: false },
      { id: "c6-l6", speaker: "Reference", text: "I'd rather not get into the specifics, if that's alright.", isRedFlag: true, whyItMatters: "A co-founder who left declining to explain why — especially after volunteering a soft, incomplete reason first — is a meaningful gap in the picture, not neutral discretion." },
      { id: "c6-l7", speaker: "You (VC)", text: "That's fair. Do you think he's grown since then?", isRedFlag: false },
      { id: "c6-l8", speaker: "Reference", text: "I genuinely don't know. We haven't stayed in close touch.", isRedFlag: false },
      { id: "c6-l9", speaker: "You (VC)", text: "Was the equity split resolved cleanly when you left?", isRedFlag: false },
      { id: "c6-l10", speaker: "Reference", text: "It took longer and more back-and-forth than I expected, but it got resolved eventually.", isRedFlag: true, whyItMatters: "A drawn-out, contentious co-founder equity exit is a concrete governance signal worth understanding directly, not brushing past." },
      { id: "c6-l11", speaker: "You (VC)", text: "Would you be comfortable if we asked him directly about the circumstances?", isRedFlag: false },
      { id: "c6-l12", speaker: "Reference", text: "Sure, that's fine. I just don't want to be the one characterizing it.", isRedFlag: false },
      { id: "c6-l13", speaker: "You (VC)", text: "Understood. Anything positive from your time working together you'd want us to know?", isRedFlag: false },
      { id: "c6-l14", speaker: "Reference", text: "He's genuinely talented. The early product decisions were mostly his, and they were good ones.", isRedFlag: false },
    ],
  },
  {
    id: "call-7",
    founderName: "the founder of Solace Labs",
    referenceContext:
      "You're speaking with a former colleague who saw the founder work directly with customers and engineering.",
    diligenceFocus:
      "Understand how she sets customer expectations, coordinates product commitments, and aligns sales with engineering.",
    lines: [
      { id: "c7-l1", speaker: "You (VC)", text: "How would you describe her as a communicator with customers?", isRedFlag: false },
      { id: "c7-l2", speaker: "Reference", text: "Excellent, honestly. Customers loved talking to her directly.", isRedFlag: false },
      { id: "c7-l3", speaker: "You (VC)", text: "Did she ever promise something to a customer that the product couldn't actually do yet?", isRedFlag: false },
      { id: "c7-l4", speaker: "Reference", text: "There was a case where she told a big prospect a feature was 'basically ready' when it was still a few months out.", isRedFlag: true, whyItMatters: "Overstating product readiness to close a deal is a specific credibility risk that can become especially damaging under sales pressure." },
      { id: "c7-l5", speaker: "You (VC)", text: "How did that play out with the customer?", isRedFlag: false },
      { id: "c7-l6", speaker: "Reference", text: "They were frustrated at the delay, but stayed a customer in the end.", isRedFlag: false },
      { id: "c7-l7", speaker: "You (VC)", text: "Did the team know she'd made that commitment?", isRedFlag: false },
      { id: "c7-l8", speaker: "Reference", text: "Not initially. Engineering found out after the customer sent over a contract draft with the feature listed in it.", isRedFlag: true, whyItMatters: "Making product commitments before the team responsible for delivering them is aware creates execution and trust risk. The issue isn't enthusiasm alone — it's committing the company without internal alignment." },
      { id: "c7-l9", speaker: "You (VC)", text: "Did that happen more than once?", isRedFlag: false },
      { id: "c7-l10", speaker: "Reference", text: "Honestly, I think that was the only time it went that far. She usually reins it in.", isRedFlag: false },
      { id: "c7-l11", speaker: "You (VC)", text: "How does she handle it when she's told something isn't realistic?", isRedFlag: false },
      { id: "c7-l12", speaker: "Reference", text: "She listens, to be fair. She just gets excited talking to customers and sometimes gets ahead of herself.", isRedFlag: false },
      { id: "c7-l13", speaker: "You (VC)", text: "Would you say that's improved over time?", isRedFlag: false },
      { id: "c7-l14", speaker: "Reference", text: "Yes, noticeably, especially after that one situation.", isRedFlag: false },
    ],
  },
  {
    id: "call-8",
    founderName: "the founder of Amberline",
    referenceContext:
      "You're speaking with a close contact who has known the founder for about four years, since before the company began.",
    diligenceFocus:
      "Understand how he makes decisions under strain, handles team conflict, and uses support around him.",
    lines: [
      { id: "c8-l1", speaker: "You (VC)", text: "How long have you known him?", isRedFlag: false },
      { id: "c8-l2", speaker: "Reference", text: "About four years now, since before he started the company.", isRedFlag: false },
      { id: "c8-l3", speaker: "You (VC)", text: "Has he mentioned how he's holding up personally through this raise process?", isRedFlag: false },
      { id: "c8-l4", speaker: "Reference", text: "He's mentioned it's been a lot. I think the last few months have been rough on him.", isRedFlag: false },
      { id: "c8-l5", speaker: "You (VC)", text: "Do you think that's affected his decision-making?", isRedFlag: false },
      { id: "c8-l6", speaker: "Reference", text: "A bit, maybe. He's made a couple of calls recently that seemed more reactive than usual.", isRedFlag: true, whyItMatters: "A close contact directly observing a shift toward reactive decision-making under strain is worth taking seriously, not dismissing as normal founder stress." },
      { id: "c8-l7", speaker: "You (VC)", text: "Can you give an example?", isRedFlag: false },
      { id: "c8-l8", speaker: "Reference", text: "He let go of someone pretty abruptly after a disagreement — out of character for him, from what I've seen before.", isRedFlag: true, whyItMatters: "An out-of-character, abrupt personnel decision is a concrete data point, not vague concern — worth understanding the specifics of directly." },
      { id: "c8-l9", speaker: "You (VC)", text: "Do you think he has support around him right now?", isRedFlag: false },
      { id: "c8-l10", speaker: "Reference", text: "Some. I worry he's not always great at asking for it when he needs it.", isRedFlag: false },
      { id: "c8-l11", speaker: "You (VC)", text: "Has this affected the product or team otherwise?", isRedFlag: false },
      { id: "c8-l12", speaker: "Reference", text: "Not that I've seen directly — the product's still moving well.", isRedFlag: false },
      { id: "c8-l13", speaker: "You (VC)", text: "Is this something you'd expect to pass once the raise is behind him?", isRedFlag: false },
      { id: "c8-l14", speaker: "Reference", text: "Probably, honestly. He's been through stretches like this before and come out fine.", isRedFlag: false },
    ],
  },
  {
    id: "call-9",
    founderName: "the founder of Marlow Systems",
    referenceContext:
      "You're speaking with a former team member who helped prepare materials for the founder's previous fundraise.",
    diligenceFocus:
      "Understand the prior round's structure and how she communicated its terms and progress with investors.",
    lines: [
      { id: "c9-l1", speaker: "You (VC)", text: "How involved were you in her last fundraise?", isRedFlag: false },
      { id: "c9-l2", speaker: "Reference", text: "Fairly involved — I was on the team helping prep materials.", isRedFlag: false },
      { id: "c9-l3", speaker: "You (VC)", text: "Do you know how the previous round was actually structured?", isRedFlag: false },
      { id: "c9-l4", speaker: "Reference", text: "As far as I know, yes, roughly.", isRedFlag: false },
      { id: "c9-l5", speaker: "You (VC)", text: "She told us the last round was entirely priced equity. Does that match what you remember?", isRedFlag: false },
      { id: "c9-l6", speaker: "Reference", text: "Hm — I actually remember part of it being structured as a convertible note, not straight equity. Could be misremembering though.", isRedFlag: true, whyItMatters: "A direct contradiction between what the founder told the investor and what someone close to the actual fundraise remembers is worth resolving before proceeding, not glossing over." },
      { id: "c9-l7", speaker: "You (VC)", text: "Would anyone else on your side have a clearer memory of that?", isRedFlag: false },
      { id: "c9-l8", speaker: "Reference", text: "Possibly our old finance contractor, but I'm not sure you'd be able to reach him easily.", isRedFlag: false },
      { id: "c9-l9", speaker: "You (VC)", text: "Setting that aside — how transparent was she generally with investors during that round?", isRedFlag: false },
      { id: "c9-l10", speaker: "Reference", text: "Pretty transparent, from what I saw. That specific detail is really the only thing that gave me pause just now.", isRedFlag: false },
      { id: "c9-l11", speaker: "You (VC)", text: "Did investors from that round raise any concerns afterward?", isRedFlag: false },
      { id: "c9-l12", speaker: "Reference", text: "Not that reached me, no.", isRedFlag: false },
      { id: "c9-l13", speaker: "You (VC)", text: "Anything else about the fundraising process worth mentioning?", isRedFlag: false },
      { id: "c9-l14", speaker: "Reference", text: "No, that's really the only thing that stood out to me just now.", isRedFlag: false },
    ],
  },
  {
    id: "call-10",
    founderName: "the founder of Thistle & Vane",
    referenceContext:
      "You're speaking with a former direct report who experienced the founder's management firsthand.",
    diligenceFocus:
      "Understand her approach to ownership, accountability, pressured decisions, and candid performance feedback.",
    lines: [
      { id: "c10-l1", speaker: "You (VC)", text: "What was it like reporting to her directly?", isRedFlag: false },
      { id: "c10-l2", speaker: "Reference", text: "Honestly one of the better managers I've had. She gave a lot of ownership early.", isRedFlag: false },
      { id: "c10-l3", speaker: "You (VC)", text: "How did she handle mistakes on the team?", isRedFlag: false },
      { id: "c10-l4", speaker: "Reference", text: "Really well, actually. I broke a production system once and she focused entirely on fixing it, not blaming anyone.", isRedFlag: false },
      { id: "c10-l5", speaker: "You (VC)", text: "Did she take responsibility publicly when things went wrong at her level?", isRedFlag: false },
      { id: "c10-l6", speaker: "Reference", text: "Every time I saw it happen, yes — including in front of our board once.", isRedFlag: false },
      { id: "c10-l7", speaker: "You (VC)", text: "How did she make decisions under real time pressure?", isRedFlag: false },
      { id: "c10-l8", speaker: "Reference", text: "Calmly. She'd rather make a fast, reversible call than freeze the team waiting for certainty.", isRedFlag: false },
      { id: "c10-l9", speaker: "You (VC)", text: "Did people ever leave the team on bad terms?", isRedFlag: false },
      { id: "c10-l10", speaker: "Reference", text: "One person did, but it was a values mismatch that honestly wasn't really about her.", isRedFlag: false },
      { id: "c10-l11", speaker: "You (VC)", text: "Was she straightforward with you about your own performance?", isRedFlag: false },
      { id: "c10-l12", speaker: "Reference", text: "Very. Sometimes uncomfortably so, but I always trusted what she told me.", isRedFlag: false },
      { id: "c10-l13", speaker: "You (VC)", text: "Anything at all you'd flag for us before we invest?", isRedFlag: false },
      { id: "c10-l14", speaker: "Reference", text: "Genuinely nothing comes to mind. I'd back her again without hesitation.", isRedFlag: false },
    ],
  },
];
