'use client';

import { useMemo, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import {
  estimateSolarSystem,
  formatEstimateNumber,
  getMonthlyYield,
  type RoofProfile,
  type SystemType,
} from '@/lib/solarEstimator';

const roofProfiles: RoofProfile[] = ['conservative', 'standard', 'strong'];

export default function SolarCalculator() {
  const { t, language } = useLanguage();
  const [monthlyUnits, setMonthlyUnits] = useState(600);
  const [daytimePercent, setDaytimePercent] = useState(65);
  const [systemType, setSystemType] = useState<SystemType>('onGrid');
  const [roofProfile, setRoofProfile] = useState<RoofProfile>('standard');

  const result = useMemo(() => {
    return estimateSolarSystem({ monthlyUnits, daytimePercent, systemType, roofProfile });
  }, [daytimePercent, monthlyUnits, roofProfile, systemType]);

  const activeDescription =
    systemType === 'onGrid' ? t('calculator.onGridDescription') : t('calculator.hybridDescription');
  const reductionLabel = `${result.billReductionPercent.toFixed(0)}%`;

  return (
    <section id="calculator" className="section-reveal bg-transparent py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto mb-10 max-w-3xl text-center reveal-item">
          <span className="inline-flex rounded-full bg-[#fff7ed] px-4 py-2 text-sm font-bold text-[#b85c00]">
            {t('nav.calculator')}
          </span>
          <h2 className="mt-5 text-3xl font-black text-[#12345f] md:text-4xl">{t('calculator.title')}</h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">{t('calculator.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.88fr_1.12fr]">
          <div className="reveal-item rounded-lg border border-slate-200 bg-[#f8fafc] p-6 shadow-sm">
            <p className="mb-4 text-sm font-bold text-[#12345f]">{t('calculator.inputTitle')}</p>
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

            <div className="mt-8 space-y-7">
              <RangeInput
                label={t('calculator.monthlyUsage')}
                value={`${formatEstimateNumber(monthlyUnits, language)} kWh`}
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

            <div className="mt-8">
              <p className="mb-3 text-sm font-bold text-[#12345f]">{t('calculator.roofProfile')}</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {roofProfiles.map((profile) => (
                  <button
                    key={profile}
                    type="button"
                    onClick={() => setRoofProfile(profile)}
                    aria-pressed={roofProfile === profile}
                    className={`rounded-lg border px-3 py-3 text-left text-sm font-bold transition ${
                      roofProfile === profile
                        ? 'border-[#b85c00] bg-[#fff7ed] text-[#b85c00]'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-[#f08a24]'
                    }`}
                  >
                    <span className="block">{t(`calculator.roof.${profile}`)}</span>
                    <span className="mt-1 block text-xs font-semibold text-slate-500">
                      {getMonthlyYield(profile)} kWh/kWp
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="reveal-item rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 rounded-lg border border-orange-100 bg-[#fff7ed] p-5">
              <p className="text-sm font-bold text-[#b85c00]">{t('calculator.decisionSummary')}</p>
              <p className="mt-2 text-2xl font-black text-[#12345f]">
                {result.recommendedSize.toFixed(1)} kWp · {t('calculator.saveAbout')} ฿{formatEstimateNumber(result.monthlySavings, language)} / {t('calculator.month')}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                {t('calculator.afterInstallBill')} ฿{formatEstimateNumber(result.newBill, language)} ({t('calculator.billReduction')} {reductionLabel})
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Result label={t('calculator.recommendedSize')} value={`${result.recommendedSize.toFixed(1)} kWp`} highlight />
              <Result label={t('calculator.monthlyProduction')} value={`${formatEstimateNumber(result.monthlyProduction, language)} kWh`} />
              <Result label={t('calculator.usableSolar')} value={`${formatEstimateNumber(result.usableSolar, language)} kWh`} />
              <Result label={t('calculator.monthlySavings')} value={`฿${formatEstimateNumber(result.monthlySavings, language)}`} highlight />
              <Result label={t('calculator.investment')} value={`฿${formatEstimateNumber(result.investment, language)}`} />
              <Result
                label={t('calculator.payback')}
                value={`${result.paybackYears.toFixed(1)} ${t('calculator.years')}`}
                highlight
              />
            </div>

            <div className="mt-6 rounded-lg border border-orange-100 bg-[#fff7ed] p-5 text-sm leading-relaxed text-slate-700">
              <p className="font-bold text-[#182230]">{t('calculator.assumptionsTitle')}</p>
              <p className="mt-2">
                {t('calculator.assumptionsPrefix')} {result.monthlyYieldPerKwp} kWh/kWp/{t('calculator.month')} · Ft 0.1623 · VAT 7%
              </p>
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
