import type { FutureFinanceGame } from "../_data/games";

import styles from "../future-of-finance-games.module.css";

export function FutureFinanceCardArt({ art }: { art: FutureFinanceGame["art"] }) {
  return (
    <span className={styles.cardArt} aria-hidden="true">
      <svg viewBox="0 0 180 125" fill="none" xmlns="http://www.w3.org/2000/svg">
        {art === "signals" ? (
          <>
            <rect x="18" y="12" width="84" height="28" rx="7" fill="#fff5e8" stroke="#11131a" strokeWidth="3" />
            <rect x="25" y="49" width="84" height="28" rx="7" fill="#e9ecff" stroke="#11131a" strokeWidth="3" />
            <rect x="17" y="86" width="84" height="28" rx="7" fill="#fff5e8" stroke="#11131a" strokeWidth="3" />
            <path d="M109 62h21m0 0 17-36m-17 36 22 36" stroke="#11131a" strokeWidth="4" strokeLinecap="round" />
            <circle cx="130" cy="62" r="9" fill="#f8dc03" stroke="#11131a" strokeWidth="3" />
            <circle cx="151" cy="23" r="7" fill="#e9ecff" stroke="#11131a" strokeWidth="3" />
            <circle cx="157" cy="102" r="7" fill="#e9ecff" stroke="#11131a" strokeWidth="3" />
          </>
        ) : null}
        {art === "depth" ? (
          <>
            <path d="M12 110h38V87h28V62h23" stroke="#11131a" strokeWidth="5" strokeLinejoin="round" />
            <path d="M168 110h-38V79h-20V52h-9" stroke="#11131a" strokeWidth="5" strokeLinejoin="round" />
            <path d="M12 110h38V87h28V62h23v48H12Z" fill="#f8dc03" stroke="#11131a" strokeWidth="3" />
            <path d="M168 110h-38V79h-20V52h-9v58h67Z" fill="#e9ecff" stroke="#11131a" strokeWidth="3" />
            <path d="M101 22v93" stroke="#11131a" strokeWidth="3" strokeDasharray="5 6" />
          </>
        ) : null}
        {art === "contract" ? (
          <>
            <rect x="31" y="12" width="118" height="102" rx="11" fill="#fff5e8" stroke="#11131a" strokeWidth="4" />
            <path d="M50 38h72M50 54h47M50 70h62M50 86h44" stroke="#11131a" strokeWidth="5" strokeLinecap="round" />
            <rect x="44" y="77" width="61" height="18" rx="4" fill="#f8dc03" fillOpacity=".45" stroke="#11131a" strokeWidth="2" />
            <circle cx="137" cy="86" r="15" fill="#e9ecff" stroke="#11131a" strokeWidth="3" />
          </>
        ) : null}
        {art === "pool" ? (
          <>
            <path d="M24 35h48v60a23 23 0 0 1-48 0V35Zm84 0h48v60a23 23 0 0 1-48 0V35Z" fill="#fff5e8" stroke="#11131a" strokeWidth="4" />
            <path d="M25 76h46m38-14h46" stroke="#f8dc03" strokeWidth="21" />
            <path d="M74 55c16-16 25-16 39 0m-7-7 7 7-7 8" stroke="#11131a" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </>
        ) : null}
        {art === "rules" ? (
          <>
            <rect x="15" y="13" width="84" height="25" rx="6" fill="#fff5e8" stroke="#11131a" strokeWidth="3" />
            <rect x="31" y="50" width="84" height="25" rx="6" fill="#e9ecff" stroke="#11131a" strokeWidth="3" />
            <rect x="47" y="87" width="84" height="25" rx="6" fill="#f8dc03" stroke="#11131a" strokeWidth="3" />
            <path d="M99 25h39v74h-7m7-38h21" stroke="#11131a" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="159" cy="61" r="7" fill="#fff5e8" stroke="#11131a" strokeWidth="3" />
          </>
        ) : null}
      </svg>
    </span>
  );
}
