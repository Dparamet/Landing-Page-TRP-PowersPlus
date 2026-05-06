'use client';

import { useMemo, useState } from 'react';
import { calculatorAssumptions } from '@/data/siteContent';
import { useLanguage } from '@/context/LanguageContext';

type SystemType = 'onGrid' | 'hybrid';

const {
  ftRate,
  vatRate,
  monthlyYieldPerKwp,
  onGridCostPerKwp,
  hybridCostPerKwp,
  lowUsageServiceCharge,
  normalServiceCharge,
} = calculatorAssumptions;

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

  const serviceCharge = units <= 150 ? lowUsageServiceCharge : normalServiceCharge;
  const beforeVat = energyCharge + units * ftRate + serviceCharge;

  return beforeVat * (1 + vatRate);
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
    const recommendedSize = Math.max(1, Math.ceil((daytimeUnits / monthlyYieldPerKwp) * 10) / 10);
    const monthlyProduction = recommendedSize * monthlyYieldPerKwp;
    const usableSolar = Math.min(daytimeUnits, monthlyProduction);
    const baselineBill = calculateResidentialBill(monthlyUnits);
    const newBill = calculateResidentialBill(Math.max(0, monthlyUnits - usableSolar));
    const monthlySavings = Math.max(0, baselineBill - newBill);
    const costPerKwp = systemType === 'onGrid' ? onGridCostPerKwp : hybridCostPerKwp;
    const investment = recommendedSize * costPerKwp;
    const paybackYears = monthlySavings > 0 ? investment / (monthlySavings * 12) : 0;

    return {
      daytimeUnits,
      recommendedSize,
      monthlyProduction,
      usableSolar,
      baselineBill,
      newBill,
      monthlySavings,
      investment,
      paybackYears,
      costPerKwp,
    };
  }, [daytimePercent, monthlyUnits, systemType]);

  const activeDescription =
    systemType === 'onGrid' ? t('calculator.onGridDescription') : t('calculator.hybridDescription');

  return (
    <section id="calculator" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <span className="inline-flex rounded-full bg-[#fff7ed] px-4 py-2 text-sm font-bold text-[#b85c00]">
            {t('nav.calculator')}
          </span>
          <h2 className="mt-5 text-3xl font-black text-[#12345f] md:text-4xl">{t('calculator.title')}</h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">{t('calculator.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.88fr_1.12fr]">
          <div className="rounded-lg border border-slate-200 bg-[#f8fafc] p-6 shadow-sm">
            <div className="grid grid-cols-2 gap-3">
              {(['onGrid', 'hybrid'] as SystemType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSystemType(type)}
                  aria-pressed={systemType === type}
                  className={`rounded-lg border px-4 py-4 text-left font-bold transition ${
                    systemType === type
                      ? 'border-[#12345f] bg-[#12345f] text-white shadow-lg shadow-slate-100'
                      : 'border-slate-200 bg-white text-slate-700 hover:-translate-y-0.5 hover:border-[#f08a24] hover:text-[#b85c00]'
                  }`}
                >
                  {t(`calculator.${type}`)}
                </button>
              ))}
            </div>

            <p className="mt-4 rounded-lg border border-blue-100 bg-white p-4 text-sm leading-relaxed text-slate-700">
              {activeDescription}
            </p>

            <div className="mt-8 space-y-8">
              <RangeInput
                label={t('calculator.monthlyUsage')}
                value={`${formatNumber(monthlyUnits)} kWh`}
                min={100}
                max={3000}
                step={50}
                currentValue={monthlyUnits}
                onChange={setMonthlyUnits}
              />
              <RangeInput
                label={t('calculator.daytimeUsage')}
                value={`${daytimePercent}%`}
                min={30}
                max={95}
                step={5}
                currentValue={daytimePercent}
                onChange={setDaytimePercent}
              />
            </div>

            <div className="mt-8 rounded-lg border border-slate-200 bg-white p-5 text-slate-700">
              <p className="font-bold text-[#12345f]">{t('calculator.formulaTitle')}</p>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed">
                <li>{t('calculator.formulaSolar')}</li>
                <li>{t('calculator.formulaSavings')}</li>
                <li>{t('calculator.formulaPayback')}</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
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

            <div className="mt-6 rounded-lg border border-orange-100 bg-[#fff7ed] p-5 text-sm leading-relaxed text-slate-700">
              <p className="font-bold text-[#182230]">{t('calculator.assumptionsTitle')}</p>
              <p className="mt-2">{t('calculator.assumptions')}</p>
              <p className="mt-2 font-semibold text-[#b85c00]">{t('calculator.disclaimer')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function RangeInput({
  label,
  value,
  min,
  max,
  step,
  currentValue,
  onChange,
}: {
  label: string;
  value: string;
  min: number;
  max: number;
  step: number;
  currentValue: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="flex items-center justify-between gap-4 font-semibold text-[#182230]">
        {label}
        <strong className="rounded-full bg-white px-3 py-1 text-[#b85c00] shadow-sm">{value}</strong>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={currentValue}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-4 w-full accent-[#f08a24]"
      />
    </label>
  );
}

function Result({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div
      className={`rounded-lg border p-4 transition hover:-translate-y-0.5 hover:shadow-md ${
        highlight ? 'border-orange-200 bg-[#fff7ed]' : 'border-slate-200 bg-[#f8fafc]'
      }`}
    >
      <p className="text-sm text-slate-600">{label}</p>
      <p className={`mt-2 text-2xl font-black ${highlight ? 'text-[#b85c00]' : 'text-[#182230]'}`}>{value}</p>
    </div>
  );
}
