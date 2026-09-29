import styles from "../build-the-trading-algorithm.module.css";

export function TradingIllustration() {
  return (
    <svg className={styles.illustration} viewBox="0 0 480 390" role="img" aria-label="A set of rule cards feeding into a simple backtest report">
      <rect x="46" y="38" width="388" height="314" rx="24" fill="#fff5e8" stroke="#11131a" strokeWidth="5" />
      <rect x="76" y="72" width="136" height="82" rx="13" fill="#e9ecff" stroke="#11131a" strokeWidth="4" />
      <rect x="268" y="72" width="136" height="82" rx="13" fill="#e9ecff" stroke="#11131a" strokeWidth="4" />
      <text x="92" y="103" fill="#293cd3" fontFamily="sans-serif" fontSize="16" fontWeight="800">ENTRY</text>
      <text x="284" y="103" fill="#293cd3" fontFamily="sans-serif" fontSize="16" fontWeight="800">EXIT</text>
      <path d="M92 122h90M284 122h90" stroke="#11131a" strokeWidth="5" strokeLinecap="round" />
      <path d="M215 114h46" stroke="#f4622a" strokeWidth="8" strokeLinecap="round" />
      <path d="m247 103 14 11-14 11" fill="none" stroke="#f4622a" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="76" y="188" width="328" height="128" rx="14" fill="white" stroke="#11131a" strokeWidth="4" />
      <path d="M96 227h287M96 259h287M96 291h287" stroke="#11131a" strokeOpacity=".24" strokeWidth="3" />
      <circle cx="119" cy="211" r="8" fill="#f4622a" />
      <circle cx="254" cy="244" r="8" fill="#293cd3" />
      <path d="M119 211h74l61 33h95" fill="none" stroke="#11131a" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
