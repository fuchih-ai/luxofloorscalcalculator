export type ProductType = "8H" | "HybridPlus" | "CloudStep";
export type RoomSize = "small" | "medium" | "large" | "not_sure";
export type LivingCountRaw = 1 | 2 | 3 | "not_sure";
export type StairsBand = "none" | "12_14" | "15_17" | "18_20" | "20_plus";
export type FloorEvenness = "mostly_even" | "little_uneven" | "very_uneven" | "not_sure";
export type FlooringType = "carpet" | "tiles" | "floorboards" | "concrete" | "not_sure";
export type FinishType = "scotia" | "skirting" | "not_sure";

export interface Answers {
  product: ProductType;
  bedroomsCount: number;
  bedroomSize: RoomSize;
  livingCountRaw: LivingCountRaw;
  livingSizeRaw: RoomSize;
  includeKitchen: boolean;
  kitchenSizeRaw: RoomSize;
  includeHallways: boolean;
  stairsBand: StairsBand;
  floorEvenness: FloorEvenness;
  currentFlooring: FlooringType[];
  finishType: FinishType;
  name: string;
  suburb: string;
  mobile: string;
  email: string;
}

export interface CalculationResult {
  roundedArea: number;
  totalMin: number;
  totalMax: number;
  breakdown: {
    baseArea: number;
    materialCost: number;
    installMin: number;
    installMax: number;
    levellingMin: number;
    levellingMax: number;
    removalMin: number;
    removalMax: number;
    edgeMin: number;
    edgeMax: number;
    stairsTotalMin: number;
    stairsTotalMax: number;
    skipBinMin: number;
    skipBinMax: number;
  };
}

export interface SkipBinConfig {
  id: string;
  min: number;
  max: number;
  maxArea: number;
}

export interface LuxoConfig {
  wastageMultiplier: number;
  materialRates: Record<ProductType, number>;
  areaPresets: {
    bedroom: { small: number; medium: number; large: number; wir: number; [key: string]: number };
    living: { small: number; medium: number; large: number; [key: string]: number };
    kitchen: { small: number; medium: number; large: number; [key: string]: number };
    hallway: { small: number; large: number };
    stairs: Record<string, { area: number; steps: number; bullnose: number }>;
  };
  installRate: { min: number; max: number };
  levellingRates: Record<string, { min: number; max: number }>;
  removalRates: Record<string, { min: number; max: number }>;
  edgeRates: Record<string, { min: number; max: number }>;
  stairsCost: {
    labourPerStep: { min: number; max: number };
    bullnosePrice: { min: number; max: number };
  };
  skipBins: SkipBinConfig[];
}