import type { OrderBookLevel } from "./order-book-types";

export const BOOK_VIEW = {
  width: 900,
  priceX: 64,
  barX: 220,
  barWidth: 460,
  sizeX: 752,
  top: 64,
  rowHeight: 56,
  separatorGap: 12,
  bottom: 68,
} as const;

export interface BookRowGeometry extends OrderBookLevel {
  y: number;
  barWidth: number;
}

export interface OrderBookGeometry {
  currentPrice: number;
  maxDepth: number;
  separatorY: number;
  height: number;
  sellRows: BookRowGeometry[];
  buyRows: BookRowGeometry[];
}

export function getMaxDepth(
  sellOrders: readonly OrderBookLevel[],
  buyOrders: readonly OrderBookLevel[],
): number {
  return Math.max(...sellOrders.map(({ size }) => size), ...buyOrders.map(({ size }) => size));
}

export function proportionalBarWidth(size: number, maxDepth: number, availableWidth: number): number {
  return (size / maxDepth) * availableWidth;
}

export function createOrderBookGeometry(
  currentPrice: number,
  sellOrders: readonly OrderBookLevel[],
  buyOrders: readonly OrderBookLevel[],
): OrderBookGeometry {
  const maxDepth = getMaxDepth(sellOrders, buyOrders);
  const separatorY = BOOK_VIEW.top + sellOrders.length * BOOK_VIEW.rowHeight;
  return {
    currentPrice,
    maxDepth,
    separatorY,
    height: separatorY + buyOrders.length * BOOK_VIEW.rowHeight + BOOK_VIEW.separatorGap * 2 + BOOK_VIEW.bottom,
    sellRows: sellOrders.map((level, index) => ({
      ...level,
      y: separatorY - (index + 0.5) * BOOK_VIEW.rowHeight - BOOK_VIEW.separatorGap,
      barWidth: proportionalBarWidth(level.size, maxDepth, BOOK_VIEW.barWidth),
    })),
    buyRows: buyOrders.map((level, index) => ({
      ...level,
      y: separatorY + (index + 0.5) * BOOK_VIEW.rowHeight + BOOK_VIEW.separatorGap,
      barWidth: proportionalBarWidth(level.size, maxDepth, BOOK_VIEW.barWidth),
    })),
  };
}

export function formatBookPrice(price: number): string {
  return price.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 20,
  });
}

export function formatBookSize(size: number): string {
  return size.toLocaleString("en-US", { maximumFractionDigits: 20 });
}
