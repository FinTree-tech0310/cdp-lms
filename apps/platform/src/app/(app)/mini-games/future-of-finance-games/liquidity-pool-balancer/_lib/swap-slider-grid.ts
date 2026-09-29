type SliderGrid = { sliderMin: number; sliderMax: number; sliderStep: number };
const GRID_EPSILON = 1e-9;

function decimalPlaces(value: number): number {
  const [coefficient, exponent = "0"] = String(value).toLowerCase().split("e");
  return Math.max(0, (coefficient.split(".")[1]?.length ?? 0) - Number(exponent));
}

export function sliderValueAt(grid: SliderGrid, index: number): number {
  const precision = Math.min(100, Math.max(decimalPlaces(grid.sliderMin), decimalPlaces(grid.sliderStep)));
  return Number((grid.sliderMin + index * grid.sliderStep).toFixed(precision));
}

export function normalizeSwapAmount(grid: SliderGrid, requested: number): number {
  const lastIndex = Math.floor((grid.sliderMax - grid.sliderMin) / grid.sliderStep + GRID_EPSILON);
  const index = Math.max(0, Math.min(lastIndex, Math.round((requested - grid.sliderMin) / grid.sliderStep)));
  return sliderValueAt(grid, index);
}

export function isSliderValueReachable(grid: SliderGrid, value: number): boolean {
  if (!Number.isFinite(value) || value < grid.sliderMin || value > grid.sliderMax) return false;
  const index = (value - grid.sliderMin) / grid.sliderStep;
  return Number.isFinite(index) && Math.abs(index - Math.round(index)) <= GRID_EPSILON;
}

export function hasSelectableValueInRange(grid: SliderGrid, rangeMin: number, rangeMax: number): boolean {
  const firstIndex = Math.max(0, Math.ceil((rangeMin - grid.sliderMin) / grid.sliderStep - GRID_EPSILON));
  const candidate = sliderValueAt(grid, firstIndex);
  return candidate >= grid.sliderMin && candidate <= grid.sliderMax && candidate >= rangeMin - GRID_EPSILON && candidate <= rangeMax + GRID_EPSILON;
}
