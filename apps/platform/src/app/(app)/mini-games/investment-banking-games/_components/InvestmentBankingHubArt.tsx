import type { InvestmentBankingGameSlug } from "../_data/games";
import styles from "../investment-banking-games.module.css";

const INK = "#11131a";
const ORANGE = "#f8dc03";
const INDIGO = "#1ed2f4";
const LAVENDER = "#e9ecff";
const CREAM = "#fff5e8";
const WHITE = "#ffffff";

interface InvestmentBankingHubArtProps {
  game: InvestmentBankingGameSlug;
}

function CompsScreenArt() {
  return (
    <svg viewBox="-4 -12 278 192" role="img" aria-label="An analyst worksheet screening companies into a comp set">
      <g transform="translate(61 -4) rotate(7 93 80)" stroke={INK} strokeWidth="3.5" strokeLinejoin="round">
        <rect x="35" y="8" width="142" height="138" rx="8" fill={WHITE} />
        <path d="M58 8V-3h96V8" fill={ORANGE} />
        <path d="M54 34h104M54 51h104M54 68h104M54 85h104M54 102h104" fill="none" />
        <path d="M99 34v68M135 34v68" fill="none" strokeWidth="2.5" />
        <circle cx="67" cy="42" r="4" fill={INDIGO} />
        <circle cx="67" cy="59" r="4" fill={ORANGE} />
        <circle cx="67" cy="76" r="4" fill={INDIGO} />
        <path d="m148 116 7 7 14-19" fill="none" stroke={INDIGO} strokeWidth="5" strokeLinecap="round" />
      </g>
      <g transform="translate(13 100) rotate(-8 55 32)" stroke={INK} strokeWidth="3.5" strokeLinejoin="round">
        <rect width="112" height="61" rx="10" fill={LAVENDER} />
        <rect x="13" y="14" width="43" height="11" rx="3" fill={INDIGO} />
        <path d="M13 37h82M13 48h58" />
      </g>
      <g transform="translate(151 112) rotate(5 49 27)" stroke={INK} strokeWidth="3.5" strokeLinejoin="round">
        <rect width="98" height="54" rx="10" fill={CREAM} />
        <path d="m15 16 12 12M27 16 15 28" stroke={ORANGE} strokeWidth="5" strokeLinecap="round" />
        <path d="M40 18h42M40 31h29" />
      </g>
    </svg>
  );
}

function CounterofferArt() {
  return (
    <svg viewBox="-4 -12 278 192" role="img" aria-label="A negotiation worksheet with changing deal terms and response notes">
      <g transform="translate(65 15) rotate(-5 80 73)" stroke={INK} strokeWidth="3.5" strokeLinejoin="round">
        <rect x="22" width="147" height="145" rx="9" fill={WHITE} />
        <path d="M45 25h76M45 37h101" />
        <path d="M45 61h101M45 88h101M45 115h101" strokeWidth="2.5" />
        <circle cx="76" cy="61" r="8" fill={ORANGE} />
        <circle cx="125" cy="88" r="8" fill={INDIGO} />
        <circle cx="99" cy="115" r="8" fill={ORANGE} />
        <rect x="60" y="132" width="71" height="22" rx="6" fill={INDIGO} />
      </g>
      <g transform="translate(6 18) rotate(-8 50 30)" stroke={INK} strokeWidth="3.5" strokeLinejoin="round">
        <path d="M8 8h83a9 9 0 0 1 9 9v31a9 9 0 0 1-9 9H46L29 70l3-13H8a9 9 0 0 1-9-9V17A9 9 0 0 1 8 8Z" fill={LAVENDER} />
        <path d="M17 26h60M17 39h43" />
      </g>
      <g transform="translate(172 100) rotate(8 42 27)" stroke={INK} strokeWidth="3.5" strokeLinejoin="round">
        <path d="M7 3h71a8 8 0 0 1 8 8v27a8 8 0 0 1-8 8H56l4 13-18-13H7a8 8 0 0 1-8-8V11A8 8 0 0 1 7 3Z" fill={ORANGE} />
        <path d="M18 20h51M18 31h34" stroke={WHITE} />
      </g>
    </svg>
  );
}

function BiddingWarArt() {
  return (
    <svg viewBox="-4 -12 278 192" role="img" aria-label="Competing bids rising through an auction process">
      <path d="M41 150h192" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <g transform="translate(30 83) rotate(-8 50 35)" stroke={INK} strokeWidth="3.5" strokeLinejoin="round">
        <rect width="100" height="69" rx="11" fill={CREAM} />
        <path d="M15 18h36M15 31h67" />
        <text x="15" y="57" fill={INDIGO} stroke="none" fontSize="21" fontWeight="900">$42</text>
      </g>
      <g transform="translate(93 50) rotate(4 53 39)" stroke={INK} strokeWidth="3.5" strokeLinejoin="round">
        <rect width="106" height="78" rx="11" fill={LAVENDER} />
        <path d="M15 19h42M15 33h73" />
        <text x="15" y="63" fill={ORANGE} stroke="none" fontSize="25" fontWeight="900">$48</text>
      </g>
      <g transform="translate(161 13) rotate(9 49 42)" stroke={INK} strokeWidth="3.5" strokeLinejoin="round">
        <rect width="98" height="84" rx="11" fill={ORANGE} />
        <path d="M14 20h40M14 34h66" stroke={WHITE} />
        <text x="14" y="67" fill={WHITE} stroke="none" fontSize="27" fontWeight="900">$55</text>
      </g>
      <path d="m222 12 13-5-4 14" fill={WHITE} stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M184 111c24-4 39-18 47-40" fill="none" stroke={INK} strokeWidth="3.5" strokeDasharray="7 7" />
    </svg>
  );
}

function FootballFieldArt() {
  return (
    <svg viewBox="-4 -12 278 192" role="img" aria-label="A valuation football field with horizontal ranges">
      <g transform="translate(28 12) rotate(3 108 73)" stroke={INK} strokeWidth="3.5" strokeLinejoin="round">
        <rect width="218" height="146" rx="11" fill={WHITE} />
        <path d="M25 27h98M25 41h168" />
        <path d="M48 58v70M87 58v70M126 58v70M165 58v70M204 58v70" strokeWidth="2" opacity=".28" />
        <path d="M39 74h68" stroke={ORANGE} strokeWidth="12" strokeLinecap="round" />
        <circle cx="72" cy="74" r="7" fill={INK} />
        <path d="M79 96h98" stroke={INDIGO} strokeWidth="12" strokeLinecap="round" />
        <circle cx="128" cy="96" r="7" fill={INK} />
        <path d="M113 118h79" stroke={ORANGE} strokeWidth="12" strokeLinecap="round" />
        <circle cx="153" cy="118" r="7" fill={INK} />
      </g>
      <g transform="translate(3 110) rotate(-7 41 25)" stroke={INK} strokeWidth="3.5" strokeLinejoin="round">
        <rect width="82" height="50" rx="9" fill={LAVENDER} />
        <path d="M14 15h52M14 27h34M14 38h43" />
      </g>
    </svg>
  );
}

function AllNighterArt() {
  return (
    <svg viewBox="-4 -12 278 192" role="img" aria-label="A late-night deal team work queue with deadlines arriving">
      <g transform="translate(54 49)" stroke={INK} strokeWidth="3.5" strokeLinejoin="round">
        <rect width="169" height="102" rx="11" fill={LAVENDER} />
        <rect x="13" y="13" width="143" height="67" rx="5" fill={WHITE} />
        <path d="M29 29h61M29 43h106M29 57h82" />
        <circle cx="141" cy="29" r="7" fill={ORANGE} />
        <path d="m43 102-13 16h163l-17-16" fill={CREAM} />
      </g>
      <g transform="translate(5 6) rotate(-8 47 39)" stroke={INK} strokeWidth="3.5" strokeLinejoin="round">
        <rect width="95" height="78" rx="10" fill={ORANGE} />
        <path d="M14 18h44M14 31h65M14 44h53" stroke={WHITE} />
        <path d="M14 61h27" stroke={INK} strokeWidth="7" />
      </g>
      <g transform="translate(189 2) rotate(8 37 37)" stroke={INK} strokeWidth="3.5" strokeLinejoin="round">
        <circle cx="37" cy="37" r="35" fill={CREAM} />
        <path d="M37 13v25l17 10" fill="none" strokeLinecap="round" />
        <circle cx="37" cy="37" r="5" fill={INDIGO} />
      </g>
      <path d="M20 151c19 9 38 11 57 6" fill="none" stroke={ORANGE} strokeWidth="5" strokeLinecap="round" strokeDasharray="2 10" />
    </svg>
  );
}

export function InvestmentBankingHubArt({ game }: InvestmentBankingHubArtProps) {
  const art = {
    "the-comps-screen": <CompsScreenArt />,
    counteroffer: <CounterofferArt />,
    "bidding-war": <BiddingWarArt />,
    "football-field-builder": <FootballFieldArt />,
    "the-all-nighter": <AllNighterArt />,
  }[game];

  return (
    <span className={styles.cardArt} aria-hidden="true">
      {art}
    </span>
  );
}
