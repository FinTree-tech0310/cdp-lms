import styles from "../liquidity-pool-balancer.module.css";

export function LiquidityPoolIllustration() {
  return (
    <svg className={styles.illustration} viewBox="0 0 440 350" aria-hidden="true" focusable="false">
      <rect x="30" y="35" width="380" height="280" rx="28" fill="#fff5e8" stroke="#11131a" strokeWidth="4" />
      <path d="M93 175h80m94 0h80" stroke="#11131a" strokeWidth="5" strokeLinecap="round" />
      <path d="m156 161 18 14-18 14m128-28-18 14 18 14" fill="none" stroke="#11131a" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="91" cy="175" r="35" fill="#f8dc03" stroke="#11131a" strokeWidth="4" />
      <circle cx="348" cy="175" r="35" fill="#e9ecff" stroke="#11131a" strokeWidth="4" />
      <rect x="170" y="107" width="100" height="136" rx="21" fill="#1ed2f4" stroke="#11131a" strokeWidth="4" />
      <rect x="185" y="127" width="70" height="29" rx="8" fill="#e9ecff" />
      <rect x="185" y="168" width="70" height="54" rx="8" fill="#fff5e8" />
      <path d="M198 195h44" stroke="#f8dc03" strokeWidth="7" strokeLinecap="round" />
      <path d="M75 258h88m114 0h88" stroke="#11131a" strokeWidth="4" strokeLinecap="round" opacity=".55" />
    </svg>
  );
}
