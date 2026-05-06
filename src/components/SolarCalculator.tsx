'use client';

import { useMemo, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

const FT_RATE = 0.1623;
const VAT_RATE = 0.07;
const SERVICE_CHARGE_LOW_USAGE = 8.19;
const SERVICE_CHARGE_NORMAL = 24.62;
const MONTHLY_YIELD_PER_KWP = 120;
const ON_GRID_COST_PER_KWP = 45000;
const HYBRID_COST_PER_KWP = 65000;

type SystemType = 'onGrid' | 'hybrid';

function calculateResidentialBill(units: number) {
  const tiers =
    units <= 150
      ? [
          { limit: 15, rate: 2.3488 },
          { limit: 10, rate: 2.9882 },
          { limit: 10, rate: 3.2405 },
          { limit: 65, rate: 3.6237 },
          { limit: 50, rate: 3.7171 },
          { limit: 250, rate: 4.2218 },
          { limit: Number.POSITIVE_INFINITY, rate: 4.4217 },
        ]
      : [
          { limit: 150, rate: 3.2484 },
          { limit: 250, rate: 4.2218 },
          { limit: Number.POSITIVE_INFINITY, rate: 4.4217 },
        ];

  let remaining = Math.max(0, units);
  let energyCharge = 0;

  for (const tier of tiers) {
    const tierUnits = Math.min(remaining, tier.limit);
    energyCharge += tierUnits * tier.rate;
    remaining -= tierUnits;

    if (remaining <= 0) break;
  }

  const serviceCharge = units <= 150 ? SERVICE_CHARGE_LOW_USAGE : SERVICE_CHARGE_NORMAL;
  const beforeVat = energyCharge + units * FT_RATE + serviceCharge;

  return beforeVat * (1 + VAT_RATE);
}

function formatNumber(value: number, maximumFractionDigits = 0) {
  return new Intl.NumberFormat('th-TH', { maximumFractionDigits }).format(value);
}

export default function SolarCalculator() {
  const { t } = useLanguage();
  const [monthlyUnits, setMonthlyUnits] = useState(600);
  const [daytimePercent, setDaytimePercent] = useState(65);
  const [systemType, setSystemType] = useState<SystemType>('onGrid');

  const result = useMemo(() => {
    const daytimeUnits = monthlyUnits * (daytimePercent / 100);
    const recommendedSize = Math.max(1, Math.ceil((daytimeUnits / MONTHLY_YIELD_PER_KWP) * 10) / 10);
    const monthlyProduction = recommendedSize * MONTHLY_YIELD_PER_KWP;
    const usableSolar = Math.min(daytimeUnits, monthlyProduction);
    const baselineBill = calculateResidentialBill(monthlyUnits);
    const newBill = calculateResidentialBill(Math.max(0, monthlyUnits - usableSolar));
    const monthlySavings = Math.max(0, baselineBill - newBill);
    const costPerKwp = systemType === 'onGrid' ? ON_GRID_COST_PER_KWP : HYBRID_COST_PER_KWP;
    const investment = recommendedSize * costPerKwp;
    const paybackYears = monthlySavings > 0 ? investment / (monthlySavings * 12) : 0;

    return {
      recommendedSize,
      monthlyProduction,
      usableSolar,
      baselineBill,
      newBill,
      monthlySavings,
      investment,
      paybackYears,
    };
  }, [daytimePercent, monthlyUnits, systemType]);

  return (
    <section id="calculator" className="bg-gray-50 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">{t('calculator.title')}</h2>
          <p className="mt-4 text-lg text-gray-600">{t('calculator.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="space-y-8">
              <label className="block">
                <span className="flex items-center justify-between gap-4 font-semibold text-gray-800">
                  {t('calculator.monthlyUsage')}
                  <strong className="text-orange-600">{formatNumber(monthlyUnits)} kWh</strong>
                </span>
                <input
                  type="range"
                  min="100"
                  max="3000"
                  step="50"
                  value={monthlyUnits}
                  onChange={(event) => setMonthlyUnits(Number(event.target.value))}
                  className="mt-4 w-full accent-orange-600"
                />
              </label>

              <label className="block">
                <span className="flex items-center justify-between gap-4 font-semibold text-gray-800">
                  {t('calculator.daytimeUsage')}
                  <strong className="text-orange-600">{daytimePercent}%</strong>
                </span>
                <input
                  type="range"
                  min="30"
                  max="95"
                  step="5"
                  value={daytimePercent}
                  onChange={(event) => setDaytimePercent(Number(event.target.value))}
                  className="mt-4 w-full accent-orange-600"
                />
              </label>

              <div>
                <p className="mb-3 font-semibold text-gray-800">{t('calculator.systemType')}</p>
                <div className="grid grid-cols-2 gap-3">
                  {(['onGrid', 'hybrid'] as SystemType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSystemType(type)}
                      className={`rounded-lg border px-4 py-3 font-bold transition ${
                        systemType === type
                          ? 'border-orange-600 bg-orange-600 text-white'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-orange-300'
                      }`}
                    >
                      {t(`calculator.${type}`)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Result label={t('calculator.recommendedSize')} value={`${result.recommendedSize.toFixed(1)} kWp`} highlight />
              <Result label={t('calculator.investment')} value={`฿${formatNumber(result.investment)}`} highlight />
              <Result label={t('calculator.monthlyProduction')} value={`${formatNumber(result.monthlyProduction)} kWh`} />
              <Result label={t('calculator.usableSolar')} value={`${formatNumber(result.usableSolar)} kWh`} />
              <Result label={t('calculator.baselineBill')} value={`฿${formatNumber(result.baselineBill)}`} />
              <Result label={t('calculator.newBill')} value={`฿${formatNumber(result.newBill)}`} />
              <Result label={t('calculator.monthlySavings')} value={`฿${formatNumber(result.monthlySavings)}`} highlight />
              <Result
                label={t('calculator.payback')}
                value={`${result.paybackYears.toFixed(1)} ${t('calculator.years')}`}
                highlight
              />
            </div>

            <div className="mt-6 rounded-lg bg-orange-50 p-4 text-sm leading-relaxed text-gray-700">
              <p className="font-bold text-gray-900">{t('calculator.assumptionsTitle')}</p>
              <p className="mt-2">{t('calculator.assumptions')}</p>
              <p className="mt-2 text-orange-800">{t('calculator.disclaimer')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Result({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-lg border p-4 ${highlight ? 'border-orange-200 bg-orange-50' : 'border-gray-200 bg-gray-50'}`}>
      <p className="text-sm text-gray-600">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${highlight ? 'text-orange-700' : 'text-gray-900'}`}>{value}</p>
    </div>
  );
}
