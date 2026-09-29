import type { SmartContractScenario } from "../_lib/smart-contract-types";

export const smartContractScenarios: SmartContractScenario[] = [
  {
    id: "sca-1",
    functionContext:
      "This withdrawal function is supposed to let a user withdraw only the funds recorded in their own contract balance.",
    lines: [
      {
        id: "sca1-l1",
        lineNumber: 1,
        code: "function withdraw(amount) {",
        isVulnerableLine: false,
        lineExplanation:
          "This only begins the withdrawal function and does not itself create the vulnerability.",
      },
      {
        id: "sca1-l2",
        lineNumber: 2,
        code: "  require(balance[user] >= amount)",
        isVulnerableLine: false,
        lineExplanation:
          "Checking that the user has enough recorded balance is appropriate. The problem occurs later in the ordering of the external interaction and the state update.",
      },
      {
        id: "sca1-l3",
        lineNumber: 3,
        code: "  sendFunds(user, amount)",
        isVulnerableLine: true,
        lineExplanation:
          "This external interaction happens while the contract still records the user's old balance. External execution can occur before the internal balance is reduced, making this the vulnerable interaction point.",
      },
      {
        id: "sca1-l4",
        lineNumber: 4,
        code: "  balance[user] = balance[user] - amount",
        isVulnerableLine: false,
        lineExplanation:
          "Reducing the balance is necessary, but it happens after the external transfer. Moving this state update before the external interaction would remove the dangerous ordering.",
      },
      {
        id: "sca1-l5",
        lineNumber: 5,
        code: "  recordWithdrawal(user, amount)",
        isVulnerableLine: false,
        lineExplanation:
          "Recording the completed withdrawal is bookkeeping and is not the source of the vulnerability.",
      },
      {
        id: "sca1-l6",
        lineNumber: 6,
        code: "}",
        isVulnerableLine: false,
        lineExplanation:
          "The closing line has no executable behavior.",
      },
    ],
    vulnerableLineId: "sca1-l3",
    vulnerabilityTypeOptions: [
      { id: "reentrancy", label: "Reentrancy" },
      { id: "missingAccessControl", label: "Missing Access Control" },
      { id: "uncheckedExternalCall", label: "Unchecked External Call" },
      { id: "integerOverflow", label: "Integer Overflow" },
      { id: "unsafeOracleDependency", label: "Unsafe Oracle Dependency" },
    ],
    correctTypeId: "reentrancy",
    feedbackByOption: {
      reentrancy:
        "This is a reentrancy-style ordering flaw. The contract performs an external transfer before reducing the user's recorded balance, so external execution can occur while the old state is still in place.",
      missingAccessControl:
        "The issue is not primarily who is allowed to call the function. The contract checks the user's recorded balance; the dangerous part is that it interacts externally before updating that balance.",
      uncheckedExternalCall:
        "The external call is central to the problem, but the scenario is not about ignoring whether that call succeeded. The vulnerability comes from allowing the external interaction to happen before the contract updates its own state.",
      integerOverflow:
        "The subtraction is not the vulnerability being demonstrated here. The critical issue is the ordering between the external transfer and the later balance update.",
      unsafeOracleDependency:
        "No external price or oracle value is used in this function. The flaw comes from state and external-call ordering rather than market data.",
    },
  },
  {
    id: "sca-2",
    functionContext:
      "This protocol function changes the fee charged to all users. Only an authorized administrator or governance process is supposed to be able to change that global setting.",
    lines: [
      {
        id: "sca2-l1",
        lineNumber: 1,
        code: "function setProtocolFee(newFee) {",
        isVulnerableLine: false,
        lineExplanation:
          "The function declaration establishes the operation but does not itself enforce or violate authorization.",
      },
      {
        id: "sca2-l2",
        lineNumber: 2,
        code: "  require(newFee <= MAX_FEE)",
        isVulnerableLine: false,
        lineExplanation:
          "This limits how large the fee may become, but it says nothing about who is permitted to change it.",
      },
      {
        id: "sca2-l3",
        lineNumber: 3,
        code: "  protocolFee = newFee",
        isVulnerableLine: true,
        lineExplanation:
          "This line performs a privileged global state change even though no authorization check has established that the caller is allowed to make it.",
      },
      {
        id: "sca2-l4",
        lineNumber: 4,
        code: "  recordFeeUpdate(newFee)",
        isVulnerableLine: false,
        lineExplanation:
          "Recording the new fee does not fix or cause the authorization problem. The privileged state change has already occurred.",
      },
      {
        id: "sca2-l5",
        lineNumber: 5,
        code: "}",
        isVulnerableLine: false,
        lineExplanation:
          "The closing line contains no security decision.",
      },
    ],
    vulnerableLineId: "sca2-l3",
    vulnerabilityTypeOptions: [
      { id: "missingAccessControl", label: "Missing Access Control" },
      { id: "reentrancy", label: "Reentrancy" },
      { id: "uncheckedExternalCall", label: "Unchecked External Call" },
      { id: "unsafeOracleDependency", label: "Unsafe Oracle Dependency" },
    ],
    correctTypeId: "missingAccessControl",
    feedbackByOption: {
      missingAccessControl:
        "This is a missing-access-control problem. The function constrains the fee value but never establishes that the caller is authorized before changing a protocol-wide setting.",
      reentrancy:
        "There is no external interaction in this function that can re-enter the contract. The problem is that the sensitive fee-setting operation is available without a caller-authorization check.",
      uncheckedExternalCall:
        "The function does not make an external call. Its weakness is that a privileged state change is performed without verifying who requested it.",
      unsafeOracleDependency:
        "No price feed or market-data source is involved. The security issue is authorization over a sensitive protocol setting.",
    },
  },
  {
    id: "sca-3",
    functionContext:
      "This function pays a user's accrued reward. The contract should reduce the recorded reward and successfully deliver the payment before treating the payout as complete.",
    lines: [
      {
        id: "sca3-l1",
        lineNumber: 1,
        code: "function payReward(user, amount) {",
        isVulnerableLine: false,
        lineExplanation:
          "This simply begins the reward-payment function.",
      },
      {
        id: "sca3-l2",
        lineNumber: 2,
        code: "  require(rewardDue[user] >= amount)",
        isVulnerableLine: false,
        lineExplanation:
          "Checking that the requested reward is actually owed is appropriate.",
      },
      {
        id: "sca3-l3",
        lineNumber: 3,
        code: "  rewardDue[user] = rewardDue[user] - amount",
        isVulnerableLine: false,
        lineExplanation:
          "Updating internal state before the external interaction avoids the classic external-call-before-state-update ordering problem.",
      },
      {
        id: "sca3-l4",
        lineNumber: 4,
        code: "  externalSend(user, amount)   // success result ignored",
        isVulnerableLine: true,
        lineExplanation:
          "The function performs the external payment but ignores whether it succeeded. Execution continues as if payment completed even if the send failed.",
      },
      {
        id: "sca3-l5",
        lineNumber: 5,
        code: "  recordRewardPaid(user, amount)",
        isVulnerableLine: false,
        lineExplanation:
          "Recording the reward as paid becomes misleading if the preceding send failed, but the root problem is the unchecked external-call result on line 4.",
      },
      {
        id: "sca3-l6",
        lineNumber: 6,
        code: "}",
        isVulnerableLine: false,
        lineExplanation:
          "The closing line does not introduce the vulnerability.",
      },
    ],
    vulnerableLineId: "sca3-l4",
    vulnerabilityTypeOptions: [
      { id: "uncheckedExternalCall", label: "Unchecked External Call" },
      { id: "reentrancy", label: "Reentrancy" },
      { id: "missingAccessControl", label: "Missing Access Control" },
      { id: "integerOverflow", label: "Integer Overflow" },
      { id: "unsafeOracleDependency", label: "Unsafe Oracle Dependency" },
    ],
    correctTypeId: "uncheckedExternalCall",
    feedbackByOption: {
      uncheckedExternalCall:
        "This is an unchecked-external-call problem. The contract sends the payment but ignores the operation's success result, so it can continue recording the reward as paid even when delivery failed.",
      reentrancy:
        "An external call exists, but the contract has already reduced the internal reward balance before making it. The issue being demonstrated is that the call's success or failure is ignored, not that state remains stale during the interaction.",
      missingAccessControl:
        "The scenario does not center on unauthorized callers changing privileged state. The defect is in how the contract handles the outcome of the external payment.",
      integerOverflow:
        "The reward subtraction is not the issue being demonstrated. The contract's error is proceeding without verifying that the external transfer succeeded.",
      unsafeOracleDependency:
        "No oracle or external price data is used. The relevant external dependency is the payment call, whose result is not checked.",
    },
  },
  {
    id: "sca-4",
    functionContext:
      "This lending function estimates how much a user may borrow from the current value of deposited collateral. The valuation should not depend blindly on a single manipulable or stale market reading.",
    lines: [
      {
        id: "sca4-l1",
        lineNumber: 1,
        code: "function calculateBorrowLimit(user) {",
        isVulnerableLine: false,
        lineExplanation:
          "This declares the calculation function and does not itself introduce the risk.",
      },
      {
        id: "sca4-l2",
        lineNumber: 2,
        code: "  collateral = collateralBalance[user]",
        isVulnerableLine: false,
        lineExplanation:
          "Reading the user's deposited collateral amount is necessary input for the calculation.",
      },
      {
        id: "sca4-l3",
        lineNumber: 3,
        code: '  price = spotPriceFromSinglePool("TOKEN/USD")',
        isVulnerableLine: true,
        lineExplanation:
          "The function treats one pool's instantaneous spot price as authoritative without any authored freshness, aggregation, or manipulation-resistance check.",
      },
      {
        id: "sca4-l4",
        lineNumber: 4,
        code: "  collateralValue = collateral * price",
        isVulnerableLine: false,
        lineExplanation:
          "This arithmetic uses the price supplied on line 3. The multiplication is not the root problem; the trustworthiness of the price input is.",
      },
      {
        id: "sca4-l5",
        lineNumber: 5,
        code: "  return collateralValue * 0.70",
        isVulnerableLine: false,
        lineExplanation:
          "Applying a collateral factor is normal risk logic, but it cannot compensate for an unreliable price source upstream.",
      },
      {
        id: "sca4-l6",
        lineNumber: 6,
        code: "}",
        isVulnerableLine: false,
        lineExplanation:
          "The closing line contains no relevant security behavior.",
      },
    ],
    vulnerableLineId: "sca4-l3",
    vulnerabilityTypeOptions: [
      { id: "unsafeOracleDependency", label: "Unsafe Oracle Dependency" },
      { id: "integerOverflow", label: "Integer Overflow" },
      { id: "missingAccessControl", label: "Missing Access Control" },
      { id: "reentrancy", label: "Reentrancy" },
      { id: "uncheckedExternalCall", label: "Unchecked External Call" },
    ],
    correctTypeId: "unsafeOracleDependency",
    feedbackByOption: {
      unsafeOracleDependency:
        "This is an unsafe-oracle-dependency problem. A lending decision is being based directly on one instantaneous pool price without safeguards around how representative, fresh, or manipulation-resistant that value is.",
      integerOverflow:
        "Although the function multiplies collateral by price, the scenario does not establish unsafe arithmetic behavior. The security concern comes from trusting the price input itself.",
      missingAccessControl:
        "This function calculates a value rather than performing a privileged administrative change. The relevant risk is the reliability of the market-data source.",
      reentrancy:
        "No external transfer or callback-sensitive state sequence is present. The dangerous dependency is the unprotected spot-price input.",
      uncheckedExternalCall:
        "The issue is not an ignored success/failure result from an external payment. The function accepts a single spot-market value as a trustworthy valuation input without sufficient safeguards.",
    },
  },
  {
    id: "sca-5",
    functionContext:
      "This simplified legacy token-sale contract uses fixed-width unsigned arithmetic that does not automatically revert on overflow. A buyer chooses how many tokens to purchase, and the function calculates the required payment.",
    lines: [
      {
        id: "sca5-l1",
        lineNumber: 1,
        code: "function buyTokens(tokenAmount) {",
        isVulnerableLine: false,
        lineExplanation:
          "The function declaration itself does not create the arithmetic risk.",
      },
      {
        id: "sca5-l2",
        lineNumber: 2,
        code: "  require(tokenAmount > 0)",
        isVulnerableLine: false,
        lineExplanation:
          "This rejects an empty purchase but does not place an upper bound on the multiplication performed next.",
      },
      {
        id: "sca5-l3",
        lineNumber: 3,
        code: "  totalCost = tokenAmount * pricePerToken   // unchecked fixed-width arithmetic",
        isVulnerableLine: true,
        lineExplanation:
          "In the legacy arithmetic model stated for this scenario, a sufficiently large multiplication can exceed the fixed-width range and wrap to an incorrect smaller value.",
      },
      {
        id: "sca5-l4",
        lineNumber: 4,
        code: "  require(paymentProvided >= totalCost)",
        isVulnerableLine: false,
        lineExplanation:
          "This payment check is logically reasonable, but it relies on totalCost already being correct. It cannot protect the sale if line 3 produced a wrapped value.",
      },
      {
        id: "sca5-l5",
        lineNumber: 5,
        code: "  transferTokens(user, tokenAmount)",
        isVulnerableLine: false,
        lineExplanation:
          "The token delivery uses the requested amount. The root issue is that the required payment may have been miscalculated before this point.",
      },
      {
        id: "sca5-l6",
        lineNumber: 6,
        code: "}",
        isVulnerableLine: false,
        lineExplanation:
          "The closing line has no arithmetic effect.",
      },
    ],
    vulnerableLineId: "sca5-l3",
    vulnerabilityTypeOptions: [
      { id: "integerOverflow", label: "Integer Overflow" },
      { id: "uncheckedExternalCall", label: "Unchecked External Call" },
      { id: "missingAccessControl", label: "Missing Access Control" },
      { id: "unsafeOracleDependency", label: "Unsafe Oracle Dependency" },
      { id: "reentrancy", label: "Reentrancy" },
    ],
    correctTypeId: "integerOverflow",
    feedbackByOption: {
      integerOverflow:
        "This scenario explicitly uses legacy fixed-width arithmetic without automatic overflow protection. The multiplication that calculates totalCost can exceed that numeric range and wrap to an incorrect value, undermining the payment check that follows.",
      uncheckedExternalCall:
        "No external call result is being ignored on the vulnerable line. The failure comes from the unchecked fixed-width multiplication used to calculate the payment requirement.",
      missingAccessControl:
        "The buyer is supposed to be allowed to call this purchase function. The defect is not caller authorization; it is unsafe arithmetic in the cost calculation.",
      unsafeOracleDependency:
        "The price variable is used as an input, but the scenario does not describe an oracle or unreliable market feed. The explicitly stated risk is that the multiplication itself can overflow in this legacy arithmetic model.",
      reentrancy:
        "There is no external-call-before-state-update sequence here. The vulnerability occurs during the arithmetic calculation before token delivery.",
    },
  },
];
