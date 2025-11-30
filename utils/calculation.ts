import { Answers, CalculationResult, LuxoConfig, FlooringType } from "../types";

export function calculateEstimate(answers: Answers, config: LuxoConfig): CalculationResult {
  const {
    product,
    bedroomsCount,
    bedroomSize,
    livingCountRaw,
    livingSizeRaw,
    includeKitchen,
    kitchenSizeRaw,
    includeHallways,
    stairsBand,
    floorEvenness,
    currentFlooring,
    finishType,
  } = answers;

  // --- Bedrooms ---
  const bedPreset = config.areaPresets.bedroom;
  const bedSize = bedPreset[bedroomSize] || 0;
  const bedroomsArea = bedroomsCount * bedSize;
  const wirArea = bedroomsCount * bedPreset.wir;
  const totalBedroomsArea = bedroomsArea + wirArea;

  // --- Living count inference ---
  let livingCount: number;
  if (livingCountRaw === "not_sure") {
    if (bedroomsCount <= 2) livingCount = 1;
    else if (bedroomsCount === 3) livingCount = 2;
    else livingCount = 2;
  } else {
    livingCount = livingCountRaw;
  }
  if (bedroomsCount >= 4 && livingCount === 1) livingCount = 2;

  // --- Living size inference ---
  let livingSize: string;
  if (livingSizeRaw === "not_sure") {
    if (bedroomsCount <= 2) livingSize = "small";
    else if (bedroomsCount === 3) livingSize = "medium";
    else livingSize = "large";
  } else {
    livingSize = livingSizeRaw;
  }

  const livingPreset = config.areaPresets.living;
  const livingBase = livingPreset[livingSize] || 0;
  const totalLivingArea = livingCount * livingBase;

  // --- Kitchen area ---
  let kitchenArea = 0;
  if (includeKitchen) {
    let kitchenSize: string;
    if (kitchenSizeRaw === "not_sure") {
      if (bedroomsCount <= 2) kitchenSize = "small";
      else if (bedroomsCount === 3) kitchenSize = "medium";
      else kitchenSize = "large";
    } else {
      kitchenSize = kitchenSizeRaw;
    }
    const kitchenPreset = config.areaPresets.kitchen;
    kitchenArea = kitchenPreset[kitchenSize] || 0;
  }

  // --- Hallways ---
  let hallwayArea = 0;
  if (includeHallways) {
    const hallwayPreset = config.areaPresets.hallway;
    hallwayArea = bedroomsCount <= 3 ? hallwayPreset.small : hallwayPreset.large;
  }

  // --- Stairs ---
  const stairCfg = config.areaPresets.stairs[stairsBand] || config.areaPresets.stairs.none;
  const stairsArea = stairCfg.area;
  const stairSteps = stairCfg.steps;
  const bullnoseCount = stairCfg.bullnose;

  // --- Base & billable area ---
  const baseArea = totalBedroomsArea + totalLivingArea + kitchenArea + hallwayArea + stairsArea;
  const billableArea = baseArea * config.wastageMultiplier;
  const roundedArea = Math.round(billableArea);

  // --- Material ---
  const materialRate = config.materialRates[product] || 0;
  const materialCost = billableArea * materialRate;

  // --- Install ---
  const installMin = billableArea * config.installRate.min;
  const installMax = billableArea * config.installRate.max;

  // --- Levelling ---
  const levCfg = config.levellingRates[floorEvenness] || config.levellingRates.not_sure;
  const levellingMin = billableArea * levCfg.min;
  const levellingMax = billableArea * levCfg.max;

  // --- Removal ---
  let removalMin = 0;
  let removalMax = 0;
  const types: FlooringType[] = [];

  if (currentFlooring.includes("carpet")) types.push("carpet");
  if (currentFlooring.includes("tiles")) types.push("tiles");
  if (currentFlooring.includes("floorboards")) types.push("floorboards");
  if (currentFlooring.includes("concrete")) types.push("concrete");

  if (types.length === 0 && currentFlooring.includes("not_sure")) {
    // 40% tiles, 40% floorboards, 20% carpet
    const blend = [
      { type: "tiles", share: 0.4 },
      { type: "floorboards", share: 0.4 },
      { type: "carpet", share: 0.2 },
    ];
    blend.forEach(({ type, share }) => {
      const rate = config.removalRates[type];
      const area = billableArea * share;
      removalMin += area * rate.min;
      removalMax += area * rate.max;
    });
  } else if (types.length > 0) {
    const share = 1 / types.length;
    types.forEach((type) => {
      const rate = config.removalRates[type];
      const area = billableArea * share;
      removalMin += area * rate.min;
      removalMax += area * rate.max;
    });
  }

  // --- Edge finish ---
  let edgeMin = 0;
  let edgeMax = 0;
  if (finishType === "scotia") {
    edgeMin = billableArea * config.edgeRates.scotia.min;
    edgeMax = billableArea * config.edgeRates.scotia.max;
  } else if (finishType === "skirting") {
    edgeMin = billableArea * config.edgeRates.skirting.min;
    edgeMax = billableArea * config.edgeRates.skirting.max;
  } else {
    // not sure: use safe range from scotia.min to skirting.max
    edgeMin = billableArea * config.edgeRates.scotia.min;
    edgeMax = billableArea * config.edgeRates.skirting.max;
  }

  // --- Stairs cost ---
  const stairMin = stairSteps * config.stairsCost.labourPerStep.min;
  const stairMax = stairSteps * config.stairsCost.labourPerStep.max;
  const bullnoseMin = bullnoseCount * config.stairsCost.bullnosePrice.min;
  const bullnoseMax = bullnoseCount * config.stairsCost.bullnosePrice.max;
  const stairsTotalMin = stairMin + bullnoseMin;
  const stairsTotalMax = stairMax + bullnoseMax;

  // --- Skip bin ---
  let skipBinMin = 0;
  let skipBinMax = 0;
  const needsSkip =
    currentFlooring.includes("tiles") ||
    currentFlooring.includes("floorboards") ||
    currentFlooring.includes("not_sure");

  if (needsSkip) {
    const bin = config.skipBins.find((b) => billableArea <= b.maxArea) || config.skipBins[config.skipBins.length - 1];
    skipBinMin = bin.min;
    skipBinMax = bin.max;
  }

  // --- Totals ---
  const totalMin =
    materialCost +
    installMin +
    levellingMin +
    removalMin +
    edgeMin +
    stairsTotalMin +
    skipBinMin;

  const totalMax =
    materialCost +
    installMax +
    levellingMax +
    removalMax +
    edgeMax +
    stairsTotalMax +
    skipBinMax;

  return {
    roundedArea,
    totalMin: Math.round(totalMin),
    totalMax: Math.round(totalMax),
    breakdown: {
      baseArea: Math.round(baseArea),
      materialCost: Math.round(materialCost),
      installMin: Math.round(installMin),
      installMax: Math.round(installMax),
      levellingMin: Math.round(levellingMin),
      levellingMax: Math.round(levellingMax),
      removalMin: Math.round(removalMin),
      removalMax: Math.round(removalMax),
      edgeMin: Math.round(edgeMin),
      edgeMax: Math.round(edgeMax),
      stairsTotalMin: Math.round(stairsTotalMin),
      stairsTotalMax: Math.round(stairsTotalMax),
      skipBinMin: Math.round(skipBinMin),
      skipBinMax: Math.round(skipBinMax),
    },
  };
}