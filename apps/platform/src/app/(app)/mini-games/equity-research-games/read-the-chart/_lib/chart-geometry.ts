import type { ChartPricePoint } from "./read-the-chart-types";

export const CHART_VIEWBOX = {
  width: 900,
  height: 360,
  left: 48,
  right: 852,
  top: 44,
  bottom: 292,
} as const;

export interface ChartCoordinate extends ChartPricePoint {
  x: number;
  y: number;
}

export interface ChartGeometry {
  coordinates: ChartCoordinate[];
  pathData: string;
  earningsMarkerX: number;
  minRelativeDay: number;
  maxRelativeDay: number;
  displayMinPrice: number;
  displayMaxPrice: number;
}

function roundCoordinate(value: number): number {
  return Math.round(value * 100) / 100;
}

export function createChartGeometry(
  pricePoints: readonly ChartPricePoint[],
): ChartGeometry {
  if (pricePoints.length === 0) {
    throw new Error("Read the Chart geometry requires at least one price point.");
  }

  const sortedPoints = [...pricePoints].sort(
    (left, right) => left.relativeDay - right.relativeDay,
  );

  let minPrice = sortedPoints[0].price;
  let maxPrice = sortedPoints[0].price;
  for (const point of sortedPoints) {
    minPrice = Math.min(minPrice, point.price);
    maxPrice = Math.max(maxPrice, point.price);
  }

  const minRelativeDay = sortedPoints[0].relativeDay;
  const maxRelativeDay = sortedPoints.at(-1)?.relativeDay ?? minRelativeDay;
  const daySpan = Math.max(maxRelativeDay - minRelativeDay, 1);
  const priceSpan = maxPrice - minPrice;
  const referencePrice = Math.max(Math.abs((minPrice + maxPrice) / 2), 1);
  const safeFallbackPadding = Math.max(referencePrice * 0.01, 0.01);
  const pricePadding = Math.max(priceSpan * 0.1, safeFallbackPadding);
  const displayMinPrice = minPrice - pricePadding;
  const displayMaxPrice = maxPrice + pricePadding;
  const displayPriceSpan = displayMaxPrice - displayMinPrice;
  const chartWidth = CHART_VIEWBOX.right - CHART_VIEWBOX.left;
  const chartHeight = CHART_VIEWBOX.bottom - CHART_VIEWBOX.top;

  const xForDay = (relativeDay: number) =>
    CHART_VIEWBOX.left
    + ((relativeDay - minRelativeDay) / daySpan) * chartWidth;
  const yForPrice = (price: number) =>
    CHART_VIEWBOX.top
    + ((displayMaxPrice - price) / displayPriceSpan) * chartHeight;

  const coordinates = sortedPoints.map((point) => ({
    ...point,
    x: roundCoordinate(xForDay(point.relativeDay)),
    y: roundCoordinate(yForPrice(point.price)),
  }));
  const pathData = coordinates
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  return {
    coordinates,
    pathData,
    earningsMarkerX: roundCoordinate(xForDay(0)),
    minRelativeDay,
    maxRelativeDay,
    displayMinPrice,
    displayMaxPrice,
  };
}
