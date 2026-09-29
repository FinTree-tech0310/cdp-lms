import type { OrderBookLevel } from "../_lib/order-book-types";
import {
  BOOK_VIEW,
  createOrderBookGeometry,
  formatBookPrice,
  formatBookSize,
} from "../_lib/order-book-geometry";
import styles from "../read-the-order-book.module.css";

interface OrderBookChartProps {
  idPrefix: string;
  currentPrice: number;
  sellOrders: readonly OrderBookLevel[];
  buyOrders: readonly OrderBookLevel[];
  depthDescriptionForScreenReaders: string;
}

export function OrderBookChart({
  idPrefix,
  currentPrice,
  sellOrders,
  buyOrders,
  depthDescriptionForScreenReaders,
}: OrderBookChartProps) {
  const geometry = createOrderBookGeometry(currentPrice, sellOrders, buyOrders);
  const headingId = `${idPrefix}-chart-title`;
  const descriptionId = `${idPrefix}-depth-description`;

  return (
    <figure className={styles.chartFigure} aria-labelledby={headingId} aria-describedby={descriptionId}>
      <div className={styles.chartHeading}>
        <div>
          <p className={styles.eyebrow}>Displayed liquidity</p>
          <h2 id={headingId}>Order-book depth</h2>
        </div>
        <p className={styles.currentPriceReadout}>
          Current price <strong>{formatBookPrice(currentPrice)}</strong>
        </p>
      </div>
      <p className={styles.mobileChartHint}>Scroll the chart sideways to see every size.</p>
      <div className={styles.chartScroll} role="region" aria-label="Scrollable order-book chart" tabIndex={0}>
        <svg
          className={styles.orderBookSvg}
          viewBox={`0 0 ${BOOK_VIEW.width} ${geometry.height}`}
          aria-hidden="true"
          focusable="false"
        >
          <text x={BOOK_VIEW.priceX} y="33" className={styles.chartSideLabel}>SELL ORDERS</text>
          <text x={BOOK_VIEW.priceX} y="52" className={styles.chartColumnLabel}>PRICE</text>
          <text x={BOOK_VIEW.sizeX} y="52" className={styles.chartColumnLabel}>SIZE</text>
          {geometry.sellRows.map((level) => (
            <g key={level.price}>
              <text x={BOOK_VIEW.priceX} y={level.y + 6} className={styles.chartNumber}>
                {formatBookPrice(level.price)}
              </text>
              <rect
                x={BOOK_VIEW.barX}
                y={level.y - 13}
                width={level.barWidth}
                height="26"
                rx="5"
                className={styles.sellBar}
              />
              <text x={BOOK_VIEW.sizeX} y={level.y + 6} className={styles.chartNumber}>
                {formatBookSize(level.size)}
              </text>
            </g>
          ))}
          <line
            x1={BOOK_VIEW.priceX}
            x2={BOOK_VIEW.width - BOOK_VIEW.priceX}
            y1={geometry.separatorY}
            y2={geometry.separatorY}
            className={styles.currentPriceLine}
          />
          <rect
            x="295"
            y={geometry.separatorY - 15}
            width="310"
            height="30"
            rx="8"
            className={styles.currentPricePlate}
          />
          <text x="450" y={geometry.separatorY + 6} textAnchor="middle" className={styles.currentPriceLabel}>
            CURRENT PRICE {formatBookPrice(geometry.currentPrice)}
          </text>
          {geometry.buyRows.map((level) => (
            <g key={level.price}>
              <text x={BOOK_VIEW.priceX} y={level.y + 6} className={styles.chartNumber}>
                {formatBookPrice(level.price)}
              </text>
              <rect
                x={BOOK_VIEW.barX}
                y={level.y - 13}
                width={level.barWidth}
                height="26"
                rx="5"
                className={styles.buyBar}
              />
              <text x={BOOK_VIEW.sizeX} y={level.y + 6} className={styles.chartNumber}>
                {formatBookSize(level.size)}
              </text>
            </g>
          ))}
          <text x={BOOK_VIEW.priceX} y={geometry.height - 24} className={styles.chartSideLabel}>
            BUY ORDERS
          </text>
        </svg>
      </div>
      <figcaption id={descriptionId} className={styles.srOnly}>
        {depthDescriptionForScreenReaders}
      </figcaption>
      <div className={styles.srOnly}>
        <p>Sell orders, nearest to current price first:</p>
        <ol>
          {sellOrders.map((level) => (
            <li key={level.price}>{`Price ${formatBookPrice(level.price)}, size ${formatBookSize(level.size)}`}</li>
          ))}
        </ol>
        <p>{`Current price: ${formatBookPrice(currentPrice)}`}</p>
        <p>Buy orders, nearest to current price first:</p>
        <ol>
          {buyOrders.map((level) => (
            <li key={level.price}>{`Price ${formatBookPrice(level.price)}, size ${formatBookSize(level.size)}`}</li>
          ))}
        </ol>
      </div>
    </figure>
  );
}
