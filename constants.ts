import { LuxoConfig } from "./types";

export const LUXO_CONFIG: LuxoConfig = {
  wastageMultiplier: 1.1,

  materialRates: {
    "8H": 35,
    HybridPlus: 45,
    CloudStep: 55,
  },

  areaPresets: {
    bedroom: { small: 10, medium: 13, large: 17, wir: 2 },
    living: { small: 18, medium: 25, large: 32 },
    kitchen: { small: 8, medium: 12, large: 16 },
    hallway: { small: 8, large: 12 },
    stairs: {
      none: { area: 0, steps: 0, bullnose: 0 },
      "12_14": { area: 4.5, steps: 13, bullnose: 1 },
      "15_17": { area: 5.0, steps: 16, bullnose: 1 },
      "18_20": { area: 5.5, steps: 19, bullnose: 2 },
      "20_plus": { area: 6.0, steps: 21, bullnose: 3 },
    },
  },

  installRate: { min: 30, max: 40 },

  levellingRates: {
    mostly_even: { min: 10, max: 15 },
    little_uneven: { min: 12, max: 20 },
    very_uneven: { min: 20, max: 35 },
    not_sure: { min: 10, max: 18 },
  },

  removalRates: {
    carpet: { min: 5, max: 7 },
    tiles: { min: 30, max: 45 },
    floorboards: { min: 8, max: 12 },
    concrete: { min: 0, max: 0 },
  },

  edgeRates: {
    scotia: { min: 6, max: 8 },
    skirting: { min: 12, max: 16 },
  },

  stairsCost: {
    labourPerStep: { min: 60, max: 80 },
    bullnosePrice: { min: 50, max: 65 },
  },

  skipBins: [
    { id: "2m", min: 424, max: 504, maxArea: 60 },
    { id: "3m", min: 504, max: 604, maxArea: 120 },
    { id: "4m", min: 604, max: 824, maxArea: 180 },
    { id: "6m", min: 824, max: 900, maxArea: 9999 },
  ],
};