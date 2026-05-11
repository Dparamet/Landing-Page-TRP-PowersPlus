export type SystemType = 'onGrid' | 'hybrid';
export type RoofProfile = 'conservative' | 'standard' | 'strong';

export const calculatorAssumptions = {
  ftRate: 0.1623,
  vatRate: 0.07,
  onGridCostPerKwp: 45000,
  hybridCostPerKwp: 65000,
  lowUsageServiceCharge: 8.19,
  normalServiceCharge: 24.62,
};

const monthlyYieldByRoofProfile: Record<RoofProfile, number> = {
  conservative: 105,
  standard: 120,
  strong: 135,
};

export type SolarEstimateInput = {
  monthlyUnits: number;
  daytimePercent: number;
  systemType: SystemType;
  roofProfile?: RoofProfile;
};

const lowUsageTiers = [
  { limit: 15, rate: 2.3488 },
  { limit: 10, rate: 2.9882 },
  { limit: 10, rate: 3.2405 },
  { limit: 65, rate: 3.6237 },
  { limit: 50, rate: 3.7171 },
  { limit: 250, rate: 4.2218 },
  { limit: Number.POSITIVE_INFINITY, rate: 4.4217 },
];

const standardUsageTiers = [
  { limit: 150, rate: 3.2484 },
  { limit: 250, rate: 4.2218 },
  { limit: Number.POSITIVE_INFINITY, rate: 4.4217 },
];

export function calculateResidentialBill(units: number) {
  const normalizedUnits = Math.max(0, units);
  const tiers = normalizedUnits <= 150 ? lowUsageTiers : standardUsageTiers;
  let remaining = normalizedUnits;
  let energyCharge = 0;

  for (const tier of tiers) {
    const tierUnits = Math.min(remaining, tier.limit);
    energyCharge += tierUnits * tier.rate;
    remaining -= tierUnits;
    if (remaining <= 0) break;
  }

  const serviceCharge =
    normalizedUnits <= 150
      ? calculatorAssumptions.lowUsageServiceCharge
      : calculatorAssumptions.normalServiceCharge;
  const beforeVat = energyCharge + normalizedUnits * calculatorAssumptions.ftRate + serviceCharge;

  return beforeVat * (1 + calculatorAssumptions.vatRate);
}

export function getMonthlyYield(roofProfile: RoofProfile) {
  return monthlyYieldByRoofProfile[roofProfile];
}

function roundUpToInstallStep(sizeKwp: number) {
  return Math.max(1, Math.ceil(sizeKwp * 2) / 2);
}

function getTargetSolarUnits(monthlyUnits: number, daytimeUnits: number, systemType: SystemType) {
  if (systemType === 'onGrid') return daytimeUnits;

  const nightUnits = Math.max(0, monthlyUnits - daytimeUnits);
  return daytimeUnits + nightUnits * 0.45;
}

function getUsableSolar(monthlyUnits: number, daytimeUnits: number, monthlyProduction: number, systemType: SystemType) {
  if (systemType === 'onGrid') return Math.min(daytimeUnits, monthlyProduction);

  return Math.min(monthlyUnits, monthlyProduction * 0.9);
}

export function estimateSolarSystem({
  monthlyUnits,
  daytimePercent,
  systemType,
  roofProfile = 'standard',
}: SolarEstimateInput) {
  const daytimeUnits = monthlyUnits * (daytimePercent / 100);
  const monthlyYieldPerKwp = getMonthlyYield(roofProfile);
  const targetSolarUnits = getTargetSolarUnits(monthlyUnits, daytimeUnits, systemType);
  const recommendedSize = roundUpToInstallStep(targetSolarUnits / monthlyYieldPerKwp);
  const monthlyProduction = recommendedSize * monthlyYieldPerKwp;
  const usableSolar = getUsableSolar(monthlyUnits, daytimeUnits, monthlyProduction, systemType);
  const baselineBill = calculateResidentialBill(monthlyUnits);
  const newBill = calculateResidentialBill(Math.max(0, monthlyUnits - usableSolar));
  const monthlySavings = Math.max(0, baselineBill - newBill);
  const costPerKwp =
    systemType === 'onGrid'
      ? calculatorAssumptions.onGridCostPerKwp
      : calculatorAssumptions.hybridCostPerKwp;
  const investment = recommendedSize * costPerKwp;
  const paybackYears = monthlySavings > 0 ? investment / (monthlySavings * 12) : 0;
  const billReductionPercent = baselineBill > 0 ? (monthlySavings / baselineBill) * 100 : 0;

  return {
    daytimeUnits,
    monthlyYieldPerKwp,
    recommendedSize,
    monthlyProduction,
    usableSolar,
    baselineBill,
    newBill,
    monthlySavings,
    investment,
    paybackYears,
    costPerKwp,
    billReductionPercent,
  };
}

export function formatEstimateNumber(value: number, locale: 'th' | 'en', maximumFractionDigits = 0) {
  return new Intl.NumberFormat(locale === 'th' ? 'th-TH' : 'en-US', { maximumFractionDigits }).format(value);
}
