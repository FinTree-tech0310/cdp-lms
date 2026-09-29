import type { FraudTriageScenarioSet } from "../_lib/fraud-triage-types";

export const fraudTriageScenarioSets: FraudTriageScenarioSet[] = [
  {
    id: "fst-1",
    setContext: "End of day review queue for the fraud and risk team.",
    transactions: [
      {
        id: "fst1-t1",
        signals: [
          { label: "Transaction Amount", value: "$3,800" },
          { label: "Device", value: "Recognized device, used for 2+ years" },
          {
            label: "Location",
            value:
              "Purchase made while account holder is on a pre-registered international trip",
          },
          { label: "Merchant Category", value: "Hotel" },
        ],
        recommendedAction: "approve",
        feedbackByAction: {
          approve:
            "A large amount and a foreign location look alarming at first glance, but the customer proactively registered this trip, the device is long-trusted, and hotel charges of this size are unremarkable while traveling. Every signal that matters here actually supports approval — this is a case where the surface-level numbers shouldn't override the fuller context.",
          stepUpVerify:
            "The foreign location and large amount may initially look unusual, but both are already explained by the pre-registered trip and the long-trusted device. Requiring another verification step would add customer friction even though the available context has already resolved the apparent anomaly.",
          blockEscalate:
            "Blocking this transaction would overweight the dollar amount and foreign location while ignoring the strongest contextual signals: the trip was registered in advance, the device has been trusted for years, and the hotel purchase fits that travel pattern. The evidence supports normal activity rather than escalation.",
        },
      },
      {
        id: "fst1-t2",
        signals: [
          { label: "Transaction Amount", value: "$1.00" },
          {
            label: "Merchant Category",
            value: "Unfamiliar small online merchant",
          },
          {
            label: "Velocity",
            value:
              "6 similar $1.00 charges attempted across different merchants in the last 10 minutes",
          },
          {
            label: "Card Status",
            value: "Card added to a new digital wallet 20 minutes ago",
          },
        ],
        recommendedAction: "blockEscalate",
        feedbackByAction: {
          approve:
            "Approving would focus too heavily on the tiny $1 amount and miss the behavioral pattern. Six similar charges across different merchants within minutes, immediately after the card was added to a new digital wallet, strongly resembles card testing and creates a meaningful risk of larger fraud following.",
          stepUpVerify:
            "Step-Up Verification recognizes that something is wrong, but the rapid multi-merchant testing pattern immediately after a new wallet enrollment is already a strong fraud signal. A lighter authentication check is not proportionate to a pattern suggesting the card itself may be compromised.",
          blockEscalate:
            "A $1 charge sounds harmless, but this exact pattern — tiny repeated charges across many merchants right after a card is added to a new wallet — is the classic signature of 'card testing,' where a stolen card number is being validated before a much larger fraudulent charge is attempted. The small amount is precisely what makes this dangerous if missed.",
        },
      },
      {
        id: "fst1-t3",
        signals: [
          { label: "Transaction Amount", value: "$260" },
          { label: "Device", value: "Recognized device" },
          {
            label: "Login Behavior",
            value:
              "Password reset 5 minutes before this purchase, from a new device that was never used",
          },
          { label: "Location", value: "Matches account's usual city" },
        ],
        recommendedAction: "stepUpVerify",
        feedbackByAction: {
          approve:
            "Approving would ignore the most important sequence in the signals: a password reset was followed almost immediately by a purchase after activity from a previously unseen device. The normal amount and familiar location do not fully resolve that account-takeover concern.",
          stepUpVerify:
            "The amount and location look completely normal, but a password reset followed almost immediately by a purchase is a common account-takeover pattern — even with a familiar location, this sequence deserves a verification step before the purchase clears, rather than being waved through on amount alone.",
          blockEscalate:
            "Blocking outright would go further than the available evidence supports. The purchase amount is ordinary, the location matches the customer's usual city, and there are still legitimate explanations for the password-reset sequence, so additional authentication is the proportionate next step before escalating further.",
        },
      },
      {
        id: "fst1-t4",
        signals: [
          { label: "Transaction Amount", value: "$45" },
          { label: "Merchant Category", value: "Grocery store" },
          { label: "Device", value: "Recognized device" },
          { label: "Account Age", value: "4 years, no prior flags" },
        ],
        recommendedAction: "approve",
        feedbackByAction: {
          approve:
            "Nothing here is unusual in any dimension — familiar device, routine merchant type, an account with a long clean history. This is what a genuinely unremarkable transaction looks like, and treating it with extra suspicion would just create friction with no real risk reduction.",
          stepUpVerify:
            "Step-Up Verification would introduce unnecessary friction without a meaningful signal to justify it. The device is recognized, the merchant category is routine, and the account has four years of clean history.",
          blockEscalate:
            "Blocking and escalating this purchase would treat an entirely normal transaction as suspicious despite every supplied signal pointing toward established legitimate behavior. There is no authored risk indicator here strong enough to justify that intervention.",
        },
      },
      {
        id: "fst1-t5",
        signals: [
          { label: "Transaction Amount", value: "$9,400" },
          { label: "Device", value: "Unrecognized device" },
          {
            label: "Location",
            value:
              "IP address in a different country than the billing address, with no prior travel history on file",
          },
          { label: "Account Age", value: "Account created 2 days ago" },
        ],
        recommendedAction: "blockEscalate",
        feedbackByAction: {
          approve:
            "Approving would overlook several independent signals pointing in the same direction: the account is only two days old, the device is unfamiliar, the IP location conflicts with the billing country without travel history, and the transaction is large. Taken together, that is substantially more concerning than any one signal alone.",
          stepUpVerify:
            "Step-Up Verification acknowledges the risk, but the combination is already unusually strong: a brand-new account, unfamiliar device, unexplained geographic mismatch, and a $9,400 transaction. A lighter check does not reflect how many independent risk indicators are aligned here.",
          blockEscalate:
            "Every signal here points the same direction — a brand-new account, an unfamiliar device, a geographic mismatch with no travel history to explain it, and a large amount. When multiple independent risk signals align this cleanly, escalation is the right call, not a lighter verification step.",
        },
      },
      {
        id: "fst1-t6",
        signals: [
          { label: "Transaction Amount", value: "$620" },
          { label: "Merchant Category", value: "Electronics retailer" },
          { label: "Device", value: "Recognized device" },
          {
            label: "Velocity",
            value:
              "3rd purchase from this merchant category in the last 2 days",
          },
        ],
        recommendedAction: "stepUpVerify",
        feedbackByAction: {
          approve:
            "Approving outright would ignore the behavioral change in the account. A third electronics purchase in two days is not proof of fraud, but the sudden concentration in one category is unusual enough to justify confirming that the customer is really making the purchases.",
          stepUpVerify:
            "Nothing here is individually alarming, but a sudden cluster of same-category purchases in a short window is a mild but real pattern shift worth a light verification step — not because any single transaction looks wrong, but because the change in behavior itself is the signal worth checking.",
          blockEscalate:
            "Blocking would treat a modest behavior shift as if it were already strong evidence of fraud. The device is recognized and there are no other severe signals, so verification is enough to investigate the unusual purchase pattern without prematurely stopping the transaction.",
        },
      },
    ],
  },

  {
    id: "fst-2",
    setContext:
      "Morning risk queue after an overnight batch of flagged transactions.",
    transactions: [
      {
        id: "fst2-t1",
        signals: [
          { label: "Transaction Amount", value: "$15,000" },
          {
            label: "Merchant Category",
            value: "Wire transfer to a previously-used recipient",
          },
          { label: "Device", value: "Recognized device" },
          {
            label: "Account History",
            value:
              "Account has sent similar-sized wires to this same recipient monthly for the past year",
          },
        ],
        recommendedAction: "approve",
        feedbackByAction: {
          approve:
            "The large dollar amount is the only thing that looks notable, but this is a well-established recurring pattern to a known recipient. Flagging every large transaction regardless of established history would create unnecessary friction on completely routine account activity.",
          stepUpVerify:
            "The $15,000 amount may look significant in isolation, but the account has sent similar-sized wires to this same recipient every month for a year from a recognized device. Additional authentication would add friction to a strongly established normal pattern.",
          blockEscalate:
            "Blocking would treat size alone as sufficient evidence of fraud while ignoring the transaction history. The recipient is known, the amount is consistent with prior wires, and the device is recognized, so the contextual evidence strongly supports routine activity.",
        },
      },
      {
        id: "fst2-t2",
        signals: [
          { label: "Transaction Amount", value: "$28" },
          { label: "Merchant Category", value: "Subscription service" },
          { label: "Device", value: "Unrecognized device" },
          {
            label: "Login Behavior",
            value:
              "Successful login using credentials that appeared in a recent public data breach list",
          },
        ],
        recommendedAction: "blockEscalate",
        feedbackByAction: {
          approve:
            "Approving would ignore two unusually specific account-takeover signals: the login used credentials known to appear in a public breach and came from an unfamiliar device. The small $28 purchase does not make the underlying account compromise less serious.",
          stepUpVerify:
            "Step-Up Verification is more cautious than approval, but the combination of breached credentials and an unfamiliar device already points strongly toward compromised account access. The risk concerns the account itself, not merely this $28 transaction, so escalation is warranted.",
          blockEscalate:
            "The transaction amount is trivial, but credentials matching a known breach list combined with an unfamiliar device is a strong, specific account-takeover signal — the low dollar amount doesn't reduce the risk that the account itself has been compromised and could be used for larger fraud next.",
        },
      },
      {
        id: "fst2-t3",
        signals: [
          { label: "Transaction Amount", value: "$310" },
          { label: "Merchant Category", value: "Airline" },
          { label: "Device", value: "Unrecognized device" },
          {
            label: "Context",
            value:
              "Customer contacted support yesterday about an upcoming trip and mentioned using a new phone",
          },
        ],
        recommendedAction: "approve",
        feedbackByAction: {
          approve:
            "An unrecognized device is normally worth a second look, but there's a specific, verifiable explanation already on file — the customer told support directly about the new phone in advance. Ignoring that context and flagging this anyway would be treating a resolved question as if it were still open.",
          stepUpVerify:
            "The unfamiliar device would normally justify verification, but the customer already told support about the new phone before this transaction. That existing context resolves the device change, so another authentication step would duplicate a question the account history has already answered.",
          blockEscalate:
            "Blocking would treat the unfamiliar device as unexplained even though the customer proactively documented the new phone with support. The airline purchase also fits the stated upcoming trip, so escalation would disregard the available legitimate context.",
        },
      },
      {
        id: "fst2-t4",
        signals: [
          { label: "Transaction Amount", value: "$1,900" },
          { label: "Merchant Category", value: "Electronics retailer" },
          { label: "Device", value: "Recognized device" },
          {
            label: "Shipping Address",
            value:
              "Shipping to an address never used on this account before, different from the billing address",
          },
        ],
        recommendedAction: "stepUpVerify",
        feedbackByAction: {
          approve:
            "Approving outright would overlook the first-time shipping address on a sizeable electronics purchase. The recognized device is reassuring, but the new destination creates enough account-takeover or resale-fraud risk that the customer should be verified before the transaction proceeds.",
          stepUpVerify:
            "A familiar device and a plausible purchase category make this look mostly normal, but a first-time shipping address on a sizeable electronics order is a specific pattern associated with account takeover for resale fraud — worth a verification step even without other red flags present.",
          blockEscalate:
            "Blocking immediately would be stronger than the evidence justifies. The device is recognized and the merchant category is plausible, while the new shipping address is the main unresolved concern. Verification can test that concern without treating the transaction as confirmed fraud.",
        },
      },
      {
        id: "fst2-t5",
        signals: [
          { label: "Transaction Amount", value: "$85" },
          { label: "Merchant Category", value: "Coffee shop" },
          { label: "Device", value: "Recognized device" },
          { label: "Location", value: "Matches usual city" },
        ],
        recommendedAction: "approve",
        feedbackByAction: {
          approve:
            "A small, routine purchase with every signal pointing toward normal account activity — there's no meaningful risk signal here to act on, and treating this with suspicion would be friction with no corresponding benefit.",
          stepUpVerify:
            "There is no meaningful unresolved signal that calls for additional authentication. The amount is small, the device is recognized, the purchase is routine, and the location matches the customer's normal city.",
          blockEscalate:
            "Blocking this transaction would create a severe response without any supplied evidence of unusual behavior. Every visible signal is consistent with the customer's normal activity.",
        },
      },
      {
        id: "fst2-t6",
        signals: [
          { label: "Transaction Amount", value: "$2,200" },
          { label: "Merchant Category", value: "Gift card purchase" },
          { label: "Device", value: "Unrecognized device" },
          {
            label: "Velocity",
            value: "First transaction on this account in 8 months",
          },
        ],
        recommendedAction: "blockEscalate",
        feedbackByAction: {
          approve:
            "Approving would ignore the combination of a long-dormant account, an unfamiliar device, and a large gift-card purchase. Gift cards can be converted or resold quickly, so the surrounding account behavior makes this substantially more concerning than an ordinary purchase.",
          stepUpVerify:
            "Verification recognizes some uncertainty, but the combination of an account suddenly becoming active after eight months, an unfamiliar device, and a $2,200 gift-card purchase creates a strong enough cash-out pattern to justify stopping and escalating the transaction rather than relying on a lighter check.",
          blockEscalate:
            "Large gift card purchases are a common fraud cash-out method because stored value can be transferred or resold quickly. Combined with a long-dormant account suddenly becoming active on an unfamiliar device, this pattern warrants Block & Escalate rather than a lighter verification step.",
        },
      },
    ],
  },

  {
    id: "fst-3",
    setContext:
      "Weekend risk queue, typically lower volume but higher proportion of travel-related flags.",
    transactions: [
      {
        id: "fst3-t1",
        signals: [
          { label: "Transaction Amount", value: "$540" },
          { label: "Merchant Category", value: "Car rental" },
          { label: "Device", value: "Recognized device" },
          {
            label: "Location",
            value:
              "Different state than billing address, matches a flight booking made on this account last week",
          },
        ],
        recommendedAction: "approve",
        feedbackByAction: {
          approve:
            "The out-of-state location is fully explained by a flight booking already on record for this account — this is a normal travel pattern with clear supporting evidence, not an unexplained geographic anomaly.",
          stepUpVerify:
            "The location difference may initially appear unusual, but the account already contains a flight booking that explains why the customer is out of state, and the device is recognized. Additional verification would add friction despite the travel context already resolving the anomaly.",
          blockEscalate:
            "Blocking would ignore the strongest contextual evidence: the customer has a flight booking matching the out-of-state activity and is using a recognized device. The location is different from billing, but it is not unexplained.",
        },
      },
      {
        id: "fst3-t2",
        signals: [
          { label: "Transaction Amount", value: "$63" },
          { label: "Merchant Category", value: "Ride-share" },
          { label: "Device", value: "Unrecognized device" },
          {
            label: "Account History",
            value:
              "Three prior chargebacks disputed as fraudulent in the last 6 months",
          },
        ],
        recommendedAction: "stepUpVerify",
        feedbackByAction: {
          approve:
            "Approving outright would ignore the combination of an unfamiliar device and three recent chargebacks that the customer disputed as fraudulent. The purchase itself is modest, but the account's recent fraud history raises the baseline risk enough to justify confirming the customer's identity.",
          stepUpVerify:
            "The amount is modest and the merchant category is unremarkable on its own, but a recent history of disputed fraudulent chargebacks on this account raises the baseline risk enough that an unfamiliar device deserves a verification step, even for a small purchase.",
          blockEscalate:
            "Blocking immediately would overstate what the current transaction shows. The amount and ride-share merchant are ordinary, and the main concerns are the unfamiliar device plus elevated historical risk. Verification is a proportionate way to resolve whether the legitimate customer is present.",
        },
      },
      {
        id: "fst3-t3",
        signals: [
          { label: "Transaction Amount", value: "$7,100" },
          { label: "Merchant Category", value: "Jewelry" },
          { label: "Device", value: "Unrecognized device" },
          {
            label: "Location",
            value:
              "IP geolocation inconsistent with device's stated time zone settings",
          },
        ],
        recommendedAction: "blockEscalate",
        feedbackByAction: {
          approve:
            "Approving would ignore several mutually reinforcing risk signals: a $7,100 jewelry purchase, an unfamiliar device, and inconsistent location/time-zone information. The combination is significantly more concerning than any single unusual detail.",
          stepUpVerify:
            "Step-Up Verification would recognize some risk, but the large, readily resellable purchase combined with an unfamiliar device and inconsistent location signals creates a sufficiently strong pattern to justify stopping and escalating the transaction rather than relying only on additional authentication.",
          blockEscalate:
            "A large, easily-resellable purchase category combined with an unfamiliar device and a technical inconsistency between the connection's location and the device's own settings — often a sign of location-masking — is a strong enough combination of signals to escalate rather than simply verify.",
        },
      },
      {
        id: "fst3-t4",
        signals: [
          { label: "Transaction Amount", value: "$19" },
          { label: "Merchant Category", value: "Streaming service" },
          { label: "Device", value: "Recognized device" },
          {
            label: "Account History",
            value:
              "Recurring monthly charge, same amount for 14 consecutive months",
          },
        ],
        recommendedAction: "approve",
        feedbackByAction: {
          approve:
            "A long-running, unchanged recurring subscription charge on a familiar device is about as low-risk as a transaction can look — there's no reasonable basis here for anything beyond approval.",
          stepUpVerify:
            "Additional authentication would create friction without an unresolved risk signal. The charge has repeated at the same amount for fourteen months and is occurring on a recognized device.",
          blockEscalate:
            "Blocking a fourteen-month recurring subscription on a familiar device would disregard one of the clearest normal-behavior patterns in the queue. Nothing supplied suggests the account or transaction has changed.",
        },
      },
      {
        id: "fst3-t5",
        signals: [
          { label: "Transaction Amount", value: "$430" },
          { label: "Merchant Category", value: "Electronics retailer" },
          { label: "Device", value: "Recognized device" },
          {
            label: "Velocity",
            value:
              "5th purchase attempt in 20 minutes, prior 4 were declined for insufficient funds",
          },
        ],
        recommendedAction: "stepUpVerify",
        feedbackByAction: {
          approve:
            "Approving would overlook the unusual velocity: this is the fifth purchase attempt in twenty minutes after four declines. A legitimate customer may simply be retrying, but the rapid repetition is enough of a pattern change that identity should be confirmed before another attempt clears.",
          stepUpVerify:
            "The device is familiar, which is reassuring, but repeated rapid-fire purchase attempts right after declines can indicate either a legitimate customer retrying a purchase or a compromised account probing what will go through — the familiar device tips this toward verification rather than immediate escalation, but it shouldn't be approved outright either.",
          blockEscalate:
            "Blocking immediately would treat ambiguous behavior as confirmed fraud. The repeated attempts are concerning, but the device is recognized and a legitimate customer retrying after insufficient-funds declines remains plausible, making verification the more proportionate next step.",
        },
      },
      {
        id: "fst3-t6",
        signals: [
          { label: "Transaction Amount", value: "$1,050" },
          { label: "Merchant Category", value: "Concert ticket resale" },
          { label: "Device", value: "Unrecognized device" },
          {
            label: "Context",
            value:
              "Customer recently reported their previous phone as lost and completed identity re-verification with support 2 days ago",
          },
        ],
        recommendedAction: "approve",
        feedbackByAction: {
          approve:
            "An unrecognized device would normally be a real concern, but the customer already went through a formal identity re-verification process with support days earlier for exactly this reason — that verification already did the work a step-up check would otherwise be trying to do.",
          stepUpVerify:
            "The unfamiliar device normally supports additional authentication, but the customer recently reported the old phone lost and already completed formal identity re-verification with support. Repeating essentially the same control would add friction without resolving a new uncertainty.",
          blockEscalate:
            "Blocking would disregard the documented explanation for the new device and the completed identity re-verification. The device change is not unexplained account behavior; it directly follows the customer's reported lost phone and verified recovery process.",
        },
      },
    ],
  },

  {
    id: "fst-4",
    setContext:
      "Mid-week queue following a spike in reported phishing attempts across the platform.",
    transactions: [
      {
        id: "fst4-t1",
        signals: [
          { label: "Transaction Amount", value: "$310" },
          { label: "Merchant Category", value: "Utility bill payment" },
          { label: "Device", value: "Recognized device" },
          {
            label: "Account History",
            value:
              "Same payee, same approximate amount, paid monthly for 3 years",
          },
        ],
        recommendedAction: "approve",
        feedbackByAction: {
          approve:
            "A routine recurring bill payment with a long, consistent history — nothing about this transaction deviates from years of established normal behavior.",
          stepUpVerify:
            "Additional authentication is not supported by the supplied evidence. The device is recognized and the same payee has received approximately the same payment every month for three years.",
          blockEscalate:
            "Blocking this payment would ignore years of consistent transaction history and a recognized device. Nothing about the current utility payment departs from the customer's established pattern.",
        },
      },
      {
        id: "fst4-t2",
        signals: [
          { label: "Transaction Amount", value: "$40" },
          {
            label: "Merchant Category",
            value: "Peer-to-peer money transfer",
          },
          { label: "Device", value: "Recognized device" },
          {
            label: "Context",
            value:
              "Transfer initiated 3 minutes after account received an email matching a known phishing template, and recipient is a new, never-used contact",
          },
        ],
        recommendedAction: "blockEscalate",
        feedbackByAction: {
          approve:
            "Approving would ignore the combination that makes this transaction concerning: it follows almost immediately after a known phishing-pattern email and sends money to a recipient the account has never used before. The small dollar amount does not resolve the possibility that the customer is currently being manipulated.",
          stepUpVerify:
            "Step-Up Verification may confirm that the real customer is present, but that does not address the core risk here: the customer may themselves be acting under active phishing or social-engineering pressure. Because the suspicious event and new recipient suggest the manipulation may still be unfolding, the transfer should be stopped and escalated for review.",
          blockEscalate:
            "The amount is small, but the timing relative to a known phishing pattern and a brand-new recipient together strongly suggest the account holder may currently be actively being manipulated into sending money — this deserves escalation specifically because the underlying situation is likely still unfolding, not because of the dollar amount at stake.",
        },
      },
      {
        id: "fst4-t3",
        signals: [
          { label: "Transaction Amount", value: "$2,750" },
          {
            label: "Merchant Category",
            value: "Home improvement retailer",
          },
          { label: "Device", value: "Recognized device" },
          {
            label: "Context",
            value:
              "Customer mentioned an ongoing renovation project in a support chat two weeks ago",
          },
        ],
        recommendedAction: "approve",
        feedbackByAction: {
          approve:
            "A large purchase in a plausible, contextually-supported category from a trusted device — there's a specific, verifiable reason for this spending pattern already on record, not just a coincidental large amount.",
          stepUpVerify:
            "The $2,750 amount is substantial, but the customer already mentioned an ongoing renovation project and is purchasing from a home-improvement retailer on a recognized device. The contextual evidence explains the purchase, so additional authentication would add friction without resolving a meaningful unknown.",
          blockEscalate:
            "Blocking would focus on the purchase size while ignoring both the trusted device and the customer's prior support conversation about an active renovation. The spending has a specific explanation already present in the account context.",
        },
      },
      {
        id: "fst4-t4",
        signals: [
          { label: "Transaction Amount", value: "$95" },
          {
            label: "Merchant Category",
            value: "Online gaming platform",
          },
          { label: "Device", value: "Unrecognized device" },
          {
            label: "Login Behavior",
            value:
              "Login occurred immediately after a password change requested via an email link, not through the account's usual recovery flow",
          },
        ],
        recommendedAction: "stepUpVerify",
        feedbackByAction: {
          approve:
            "Approving outright would ignore a meaningful account-takeover sequence: the password was changed through an unusual recovery path and a purchase followed immediately from an unfamiliar device. The modest amount does not remove the need to verify that the legitimate customer is in control.",
          stepUpVerify:
            "The unusual password-change path followed immediately by a purchase on an unfamiliar device creates a credible account-takeover signal. There is still enough uncertainty that Step-Up Verification is the right next control: verify that the legitimate customer is present before allowing the transaction, and escalate if that verification fails.",
          blockEscalate:
            "Blocking immediately would treat the suspicious sequence as conclusive before attempting to resolve who is actually controlling the account. The unusual password change and unfamiliar device justify strong verification, but the available signals do not yet require treating the transaction as confirmed fraud.",
        },
      },
      {
        id: "fst4-t5",
        signals: [
          { label: "Transaction Amount", value: "$6,300" },
          {
            label: "Merchant Category",
            value: "Cryptocurrency exchange transfer",
          },
          { label: "Device", value: "Unrecognized device" },
          { label: "Account Age", value: "Account created 6 hours ago" },
        ],
        recommendedAction: "blockEscalate",
        feedbackByAction: {
          approve:
            "Approving would ignore the combined exposure created by a six-hour-old account, an unfamiliar device, and a $6,300 transfer to a cryptocurrency exchange. Each signal can have a legitimate explanation, but together they create enough uncertainty around rapid fund movement that allowing the transfer without review would be too permissive.",
          stepUpVerify:
            "Step-Up Verification would address whether someone can authenticate to the account, but the combination of a brand-new account, unfamiliar device, large amount, and rapid movement of funds creates enough loss exposure that the transfer should be stopped while the activity is reviewed rather than released immediately after a lighter check.",
          blockEscalate:
            "A six-hour-old account, an unfamiliar device, and a $6,300 transfer to a cryptocurrency exchange create multiple independent risk signals around rapid movement of funds. Any one of these could have a legitimate explanation, but together they create enough uncertainty and potential loss exposure to justify blocking the transaction and escalating it for review before the funds leave the platform.",
        },
      },
    ],
  },
];
