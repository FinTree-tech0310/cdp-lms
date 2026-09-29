import {
  INVESTOR_ARCHETYPE_DETAILS,
  INVESTOR_OFFER_DETAIL_ROWS,
  type InvestorArchetype,
  type InvestorOffer,
} from "../_data/investor-match-scenarios";
import styles from "../investor-match.module.css";

interface InvestorOfferCardProps {
  offer: InvestorOffer;
  onChoose: (archetype: InvestorArchetype) => void;
}

export function InvestorOfferCard({ offer, onChoose }: InvestorOfferCardProps) {
  const details = INVESTOR_ARCHETYPE_DETAILS[offer.archetype];

  return (
    <button
      type="button"
      className={styles.offerCard}
      data-archetype={offer.archetype}
      data-investor-offer
      aria-label={`Choose ${details.title}`}
      onClick={() => onChoose(offer.archetype)}
    >
      <span className={styles.offerType}>Investor profile</span>
      <h2>{details.title}</h2>
      <p className={styles.offerSummary}>{details.summary}</p>
      <dl className={styles.offerDetails}>
        {INVESTOR_OFFER_DETAIL_ROWS.map((row) => (
          <div key={row.key}>
            <dt>{row.label}</dt>
            <dd>{offer.terms[row.key]}</dd>
          </div>
        ))}
      </dl>
      <span className={styles.chooseLabel}>Take this offer <span aria-hidden="true">→</span></span>
    </button>
  );
}
