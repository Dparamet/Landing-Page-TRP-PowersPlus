import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  calculateResidentialBill,
  estimateSolarSystem,
  formatEstimateNumber,
  getMonthlyYield,
} from '../src/lib/solarEstimator.ts';

describe('solar estimator', () => {
  it('uses the low-usage residential tariff and service charge for 150 kWh or less', () => {
    const bill = calculateResidentialBill(150);

    assert.equal(Number(bill.toFixed(2)), 590.05);
  });

  it('uses the standard residential tariff and service charge above 150 kWh', () => {
    const bill = calculateResidentialBill(600);

    assert.equal(Number(bill.toFixed(2)), 2727.48);
  });

  it('estimates an on-grid system from daytime usage and caps usable solar at daytime units', () => {
    const result = estimateSolarSystem({
      monthlyUnits: 600,
      daytimePercent: 65,
      systemType: 'onGrid',
      roofProfile: 'standard',
    });

    assert.equal(result.recommendedSize, 3.5);
    assert.equal(result.monthlyProduction, 420);
    assert.equal(result.usableSolar, 390);
    assert.equal(result.investment, 157500);
    assert.equal(Number(result.paybackYears.toFixed(1)), 7.0);
  });

  it('prices hybrid systems with higher cost and usable night-shifted energy', () => {
    const onGrid = estimateSolarSystem({
      monthlyUnits: 600,
      daytimePercent: 65,
      systemType: 'onGrid',
      roofProfile: 'standard',
    });
    const hybrid = estimateSolarSystem({
      monthlyUnits: 600,
      daytimePercent: 65,
      systemType: 'hybrid',
      roofProfile: 'standard',
    });

    assert.equal(hybrid.recommendedSize, 4.5);
    assert.equal(hybrid.usableSolar, 486);
    assert.equal(hybrid.investment, 292500);
    assert.ok(hybrid.monthlySavings > onGrid.monthlySavings);
    assert.ok(hybrid.paybackYears > onGrid.paybackYears);
  });

  it('adjusts production by practical Thailand roof and sun profiles', () => {
    assert.equal(getMonthlyYield('conservative'), 105);
    assert.equal(getMonthlyYield('standard'), 120);
    assert.equal(getMonthlyYield('strong'), 135);
  });

  it('formats numbers for Thai and English visitors', () => {
    assert.equal(formatEstimateNumber(1234567, 'th'), '1,234,567');
    assert.equal(formatEstimateNumber(1234567, 'en'), '1,234,567');
  });
});
