import styles from "../equity-research-games.module.css";

interface EquityResearchHubArtProps {
  gameId: "game-1" | "game-2" | "game-3" | "game-4" | "game-5";
}

function ReadChartArt() {
  return (
    <svg viewBox="0 0 250 150" focusable="false">
      <g className={styles.artPaper}>
        <rect x="28" y="13" width="205" height="124" rx="15" />
        <path d="M49 37h66M49 51h43" />
        <path d="M49 73h164M49 98h164M49 122h164" opacity=".18" />
        <path
          className={styles.artPriceLine}
          d="M49 79 73 75 97 80 121 72 132 74 150 105 171 115 193 112 214 123"
        />
        <path className={styles.artEarningsMarker} d="M132 62v68" />
        <circle cx="132" cy="74" r="5" className={styles.artPoint} />
        <circle cx="150" cy="105" r="5" className={styles.artPoint} />
      </g>
      <g className={styles.artNote}>
        <path d="M8 22h68a9 9 0 0 1 9 9v30a9 9 0 0 1-9 9H45L32 81l2-11H8a9 9 0 0 1-9-9V31a9 9 0 0 1 9-9Z" />
        <path d="M15 39h53M15 52h39" />
      </g>
    </svg>
  );
}

function ThesisDefenseArt() {
  return (
    <svg viewBox="0 0 250 150" focusable="false">
      <g className={styles.artOutline}>
        <circle cx="45" cy="43" r="19" fill="var(--orange)" />
        <path d="M16 100V85a29 29 0 0 1 58 0v15" fill="var(--cream)" />
        <circle cx="205" cy="43" r="19" fill="var(--cream)" />
        <path d="M176 100V85a29 29 0 0 1 58 0v15" fill="var(--indigo)" />
        <path d="M30 104h190l-20 29H50Z" fill="var(--cream)" />
        <path d="M55 133v10m140-10v10" />
        <rect x="94" y="14" width="64" height="66" rx="7" fill="var(--lavender)" transform="rotate(8 126 47)" />
        <path d="M108 32h29m-29 14h35m-35 14h19" />
        <path d="m84 70-12 12m94-12 12 12" stroke="var(--orange)" />
      </g>
    </svg>
  );
}

function NoteEditorArt() {
  return (
    <svg viewBox="0 0 250 150" focusable="false">
      <g className={styles.artOutline}>
        <path d="M44 10h112l28 28v102H44Z" fill="var(--cream)" />
        <path d="M156 10v28h28" fill="var(--lavender)" />
        <path d="M66 34h58m-58 21h92m-92 22h77m-77 22h91m-91 22h62" />
        <path d="M59 70h92v15H59Z" fill="var(--orange)" fillOpacity=".25" stroke="var(--orange)" />
        <path d="m65 109 6-6 6 6m-6-6v15" stroke="var(--orange)" />
        <g transform="rotate(32 194 79)">
          <rect x="185" y="19" width="18" height="96" rx="3" fill="var(--orange)" />
          <path d="m185 115 9 20 9-20Z" fill="var(--cream)" />
          <path d="M185 35h18m-9 8v60" />
        </g>
      </g>
    </svg>
  );
}

function ModelUpdateArt() {
  return (
    <svg viewBox="0 0 250 150" focusable="false">
      <g className={styles.artOutline}>
        <rect x="10" y="20" width="95" height="110" rx="12" fill="var(--cream)" />
        <path d="M28 46h59M28 75h59M28 104h59" />
        <circle cx="43" cy="46" r="8" fill="var(--orange)" />
        <circle cx="73" cy="75" r="8" fill="var(--orange)" />
        <circle cx="54" cy="104" r="8" fill="var(--orange)" />
        <path d="M105 75h27m0 0V30h15m-15 45h15m-15 0v45h15" />
        <rect x="147" y="14" width="89" height="32" rx="7" fill="var(--lavender)" />
        <rect x="147" y="59" width="89" height="32" rx="7" fill="var(--cream)" />
        <rect x="147" y="104" width="89" height="32" rx="7" fill="var(--indigo)" />
        <path d="M163 30h55m-55 45h37" />
        <path d="M163 120h55" stroke="var(--cream)" />
      </g>
    </svg>
  );
}

function VariantPerceptionArt() {
  return (
    <svg viewBox="0 0 250 150" focusable="false">
      <g className={styles.artOutline}>
        <rect x="15" y="62" width="67" height="76" rx="8" fill="var(--cream)" transform="rotate(-8 48 100)" />
        <rect x="49" y="52" width="67" height="86" rx="8" fill="var(--lavender)" />
        <path d="M63 74h39m-39 17h30m-30 17h36" />
        <path d="M116 95h22V41h18" stroke="var(--orange)" strokeWidth="6" />
        <rect x="157" y="12" width="77" height="97" rx="8" fill="var(--cream)" />
        <path d="M173 32h44m-44 17h31m-31 18h44m-44 18h36" />
        <circle cx="175" cy="115" r="24" fill="var(--orange)" />
        <path d="m192 132 13 11" stroke="var(--cream)" strokeWidth="8" />
        <path d="M162 115h26m-13-13v26" stroke="var(--cream)" />
      </g>
    </svg>
  );
}

const GAME_ART = {
  "game-1": ReadChartArt,
  "game-2": ThesisDefenseArt,
  "game-3": NoteEditorArt,
  "game-4": ModelUpdateArt,
  "game-5": VariantPerceptionArt,
};

export function EquityResearchHubArt({
  gameId,
}: EquityResearchHubArtProps) {
  const Illustration = GAME_ART[gameId];
  return (
    <span className={styles.cardArt} aria-hidden="true">
      <Illustration />
    </span>
  );
}
