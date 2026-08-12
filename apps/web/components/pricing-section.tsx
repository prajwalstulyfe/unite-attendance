'use client';

import { useState } from 'react';
import { CheckCircle2, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { usePortalUrls } from '@/lib/use-portal-urls';

interface PricingTier {
  range: string;
  regularPrice: number;
  launchPrice: number;
  perEmployee: string;
  popular?: boolean;
  tagline: string;
}

const PRICING_TIERS: PricingTier[] = [
  {
    range: 'Up to 10 Employees',
    regularPrice: 499,
    launchPrice: 375,
    perEmployee: '₹37.50 / emp',
    tagline: 'For small teams and micro businesses',
  },
  {
    range: '11 – 25 Employees',
    regularPrice: 999,
    launchPrice: 749,
    perEmployee: '₹30.00 / emp',
    tagline: 'For growing offices & retail stores',
  },
  {
    range: '26 – 50 Employees',
    regularPrice: 1499,
    launchPrice: 1125,
    perEmployee: '₹22.50 / emp',
    tagline: 'For mid-size companies & departments',
  },
  {
    range: '51 – 100 Employees',
    regularPrice: 2499,
    launchPrice: 1875,
    perEmployee: '₹18.75 / emp',
    popular: true,
    tagline: 'Most popular for multi-branch organizations',
  },
  {
    range: '101 – 200 Employees',
    regularPrice: 3999,
    launchPrice: 2999,
    perEmployee: '₹15.00 / emp',
    tagline: 'For expanding enterprises & institutes',
  },
  {
    range: '201 – 500 Employees',
    regularPrice: 6999,
    launchPrice: 5249,
    perEmployee: '₹10.50 / emp',
    tagline: 'For factories & large corporate hubs',
  },
  {
    range: '501 – 1,000 Employees',
    regularPrice: 11999,
    launchPrice: 8999,
    perEmployee: '₹9.00 / emp',
    tagline: 'For university campuses & large workforces',
  },
];

export function PricingSection() {
  const urls = usePortalUrls();
  const [selectedTierIdx, setSelectedTierIdx] = useState<number>(3); // Default to 51-100 tier (Popular)

  const activeTier = PRICING_TIERS[selectedTierIdx] || PRICING_TIERS[3]!;

  return (
    <section
      id='pricing'
      className='py-20 px-6 md:px-12 bg-zinc-50 dark:bg-zinc-950 transition-colors relative overflow-hidden'>
      <div className='max-w-5xl mx-auto space-y-12'>
        {/* Section Header */}
        <div className='text-center space-y-3 max-w-4xl mx-auto'>
          <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold shadow-sm'>
            <Sparkles className='h-3.5 w-3.5 text-emerald-500' /> Special Launch Offer — Flat 25% OFF All Tiers
          </div>
          <h2 className='text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight'>
            Transparent Pricing Built for Global Scale
          </h2>
          <p className='text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-medium max-w-2xl mx-auto'>
            Pay only for your active employee count. Start with a 14-day free trial — no credit card charged.
          </p>
        </div>

        {/* Tier Selector Dropdown / Pills for Mobile & Desktop */}
        <div className='bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-4 sm:p-6 shadow-xl max-w-4xl mx-auto space-y-5'>
          <div className='flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3'>
            <span className='text-xs font-extrabold uppercase tracking-wider text-zinc-500'>
              Select Employee Strength
            </span>
            <span className='text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1'>
              <ShieldCheck className='h-3.5 w-3.5' /> 14-Day Free Trial
            </span>
          </div>

          <div className='grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2'>
            {PRICING_TIERS.map((tier, idx) => (
              <button
                key={tier.range}
                onClick={() => setSelectedTierIdx(idx)}
                className={`p-2.5 rounded-2xl text-left transition-all cursor-pointer border relative flex flex-col justify-between ${
                  selectedTierIdx === idx ?
                    'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/30 scale-105 z-10'
                  : 'bg-zinc-50 dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}>
                {tier.popular && (
                  <span
                    className={`absolute -top-2 right-1 px-1.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider ${
                      selectedTierIdx === idx ? 'bg-amber-400 text-zinc-950' : 'bg-indigo-600 text-white'
                    }`}>
                    Popular
                  </span>
                )}
                <div>
                  <p className='text-[10px] font-bold leading-tight'>{tier.range.replace(' Employees', '')}</p>
                  <p
                    className={`text-[10px] font-semibold mt-0.5 ${selectedTierIdx === idx ? 'text-indigo-100' : 'text-zinc-500'}`}>
                    ₹{tier.launchPrice}/mo
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Active Selected Tier Card Detail */}
          <div className='bg-linear-to-br from-indigo-900/10 via-purple-900/5 to-transparent border border-indigo-500/30 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4'>
            <div className='space-y-1 text-center sm:text-left w-full sm:w-auto'>
              <div className='flex flex-wrap items-center gap-2 justify-center sm:justify-start'>
                <h3 className='text-base sm:text-lg font-bold text-zinc-900 dark:text-white'>{activeTier.range}</h3>
                {activeTier.popular && (
                  <span className='px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-600 dark:text-amber-400 border border-amber-400/30 text-[9px] font-black uppercase tracking-wider'>
                    Most Popular
                  </span>
                )}
              </div>
              <p className='text-xs text-zinc-500 dark:text-zinc-400 font-medium'>{activeTier.tagline}</p>
              <p className='text-xs text-emerald-600 dark:text-emerald-400 font-bold'>
                Effective Rate: {activeTier.perEmployee}
              </p>
            </div>

            <div className='flex flex-col sm:flex-row items-center gap-4 text-center sm:text-right w-full sm:w-auto'>
              <div>
                <div className='flex items-baseline justify-center sm:justify-end gap-1.5'>
                  <span className='text-xs text-zinc-400 line-through font-bold'>₹{activeTier.regularPrice}</span>
                  <span className='text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight'>
                    ₹{activeTier.launchPrice}
                  </span>
                  <span className='text-xs text-zinc-500 font-bold'>/ month</span>
                </div>
                <p className='text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5'>
                  Launch Offer: 25% OFF Billed Monthly
                </p>
              </div>

              <a
                href={`${urls.admin}/register`}
                className='w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer'>
                Start Free Trial <ArrowRight className='h-3.5 w-3.5' />
              </a>
            </div>
          </div>
        </div>

        {/* Enterprise & Custom Quote Block */}
        <div className='bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 max-w-4xl mx-auto'>
          <div className='space-y-1 text-center md:text-left'>
            <span className='text-[10px] font-black uppercase text-purple-600 dark:text-purple-400 tracking-wider'>
              Large Enterprise (1,001+ Employees)
            </span>
            <h4 className='text-sm sm:text-base font-extrabold text-zinc-900 dark:text-white'>
              Need Custom Deployment or Dedicated SLA?
            </h4>
            <p className='text-xs text-zinc-500 font-medium'>
              Custom multi-city cluster deployments with dedicated account manager and priority support.
            </p>
          </div>
          <a
            href={`${urls.admin}/register`}
            className='px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-bold transition-all shrink-0 cursor-pointer'>
            Contact Sales
          </a>
        </div>

        {/* Included Features Across All Tiers */}
        <div className='max-w-4xl mx-auto space-y-4 pt-2'>
          <h3 className='text-center text-xs font-bold text-zinc-500 uppercase tracking-widest'>
            Included Free in Every Plan
          </h3>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3'>
            {[
              'Multi-Branch & Dept Support',
              'Dynamic TOTP Pass Scanning',
              'Role-Based Manager Access',
              'Shift & Grace Period Rules',
              '1-Click PDF & CSV Exports',
              '100% Cloud Access (No PC App)',
              'Mobile App & Kiosk Web PWA',
              'Audit Log & Audit Trail',
            ].map((feat) => (
              <div
                key={feat}
                className='flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800'>
                <CheckCircle2 className='h-3.5 w-3.5 text-emerald-500 shrink-0' />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
