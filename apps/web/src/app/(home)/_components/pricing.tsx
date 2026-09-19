'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type BillingPeriod = 'monthly' | 'annually';

interface PricingPlan {
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  features: string[];
  highlighted?: boolean;
  cta: string;
  ctaLink: string;
  includesFrom?: string;
}

const plans: PricingPlan[] = [
  {
    name: 'Free',
    description: 'Perfect for exploring workflow automation',
    monthlyPrice: 0,
    annualPrice: 0,
    features: [
      '100 workflow executions/month',
      '5 active workflows',
      'Core integrations',
      'Community support',
    ],
    cta: 'Start Free',
    ctaLink: '#',
  },
  {
    name: 'Pro',
    description: 'For teams automating critical business processes',
    monthlyPrice: 29,
    annualPrice: 24,
    features: [
      '5,000 executions/month',
      'Unlimited workflows',
      'All 100+ integrations',
      'AI model access (GPT-4, Claude)',
      'Version history',
      'Priority support',
      'Custom webhooks',
      'Team collaboration',
      'Advanced analytics',
    ],
    highlighted: true,
    cta: 'Start Free Trial',
    ctaLink: '#',
    includesFrom: 'Everything in Free, plus:',
  },
  {
    name: 'Business',
    description: 'For organizations with complex automation needs',
    monthlyPrice: 99,
    annualPrice: 79,
    features: [
      '50,000 executions/month',
      'Unlimited team members',
      'Custom AI model integration',
      'SSO & SAML',
      'Audit logs',
      'Dedicated support',
      'SLA guarantee',
      'On-premise deployment',
      'Custom integrations',
    ],
    cta: 'Contact Sales',
    ctaLink: '#',
    includesFrom: 'Everything in Pro, plus:',
  },
];

const enterpriseFeatures = [
  'Unlimited workflow executions',
  'Dedicated infrastructure',
  'Custom AI model training',
  'Advanced security & compliance',
  'White-label options',
  'Custom SLA',
  '24/7 premium support',
  'Dedicated success manager',
  'Custom contract terms',
];

const Pricing = () => {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('annually');

  return (
    <section>
      {/* Top border */}
      <div className="border-t border-dashed border-border" />

      <div className="px-6 sm:px-8 lg:px-12 py-16 md:py-24">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold md:text-4xl lg:text-5xl lg:tracking-tight">
            Simple pricing, powerful automation
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-balance text-lg">
            Start free, scale as you grow. Pay only for the workflow executions you use.
          </p>

          {/* Billing Toggle */}
          <div className="my-12">
            <div className="bg-foreground/5 relative mx-auto grid w-fit grid-cols-2 rounded-full p-1">
              <div
                aria-hidden="true"
                className={cn(
                  'bg-card ring-foreground/5 pointer-events-none absolute inset-1 w-1/2 rounded-full border border-transparent shadow ring-1 transition-transform duration-500 ease-in-out',
                  billingPeriod === 'annually' ? 'translate-x-full' : 'translate-x-0'
                )}
              />
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={cn(
                  'relative block h-8 w-24 rounded-full text-sm transition-colors',
                  billingPeriod === 'monthly'
                    ? 'text-foreground font-medium'
                    : 'text-foreground/75 hover:opacity-75'
                )}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('annually')}
                className={cn(
                  'relative block h-8 w-24 rounded-full text-sm transition-colors',
                  billingPeriod === 'annually'
                    ? 'text-foreground font-medium'
                    : 'text-foreground/75 hover:opacity-75'
                )}
              >
                Annually
              </button>
            </div>
            <div className="mt-3 text-center text-xs">
              <span className="text-primary font-medium">Save 25%</span> On Annual Billing
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="@container">
          <div className="rounded-lg border">
            <div className="grid md:grid-cols-3">
              {plans.map((plan, index) => (
                <div
                  key={plan.name}
                  className={cn(
                    'row-span-4 grid grid-rows-subgrid gap-8 p-8',
                    plan.highlighted &&
                      'ring-border bg-card md:my-2 md:mx-0.5 shadow-xl shadow-black/5 ring-1 backdrop-blur rounded-lg',
                    index === 0 && 'md:border-r border-b md:border-b-0',
                    index === 2 && 'md:border-l border-t md:border-t-0'
                  )}
                >
                  {/* Plan Name & Description */}
                  <div className="self-end">
                    <h3 className="tracking-tight text-lg font-medium">{plan.name}</h3>
                    <p className="text-muted-foreground mt-1 text-balance text-sm">
                      {plan.description}
                    </p>
                  </div>

                  {/* Price */}
                  <div>
                    <span className="text-3xl font-semibold">
                      ${billingPeriod === 'annually' ? plan.annualPrice : plan.monthlyPrice}
                    </span>
                    <div className="text-muted-foreground text-sm">Per month</div>
                  </div>

                  {/* CTA Button */}
                  <Link
                    href={plan.ctaLink}
                    className={cn(
                      'cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring h-9 px-4 py-2 w-full',
                      plan.highlighted
                        ? 'shadow-md border-[0.5px] border-white/10 shadow-black/15 bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'shadow-sm shadow-black/10 border border-transparent bg-card ring-1 ring-foreground/10 duration-200 hover:bg-muted/50 dark:ring-foreground/15 dark:hover:bg-muted/50'
                    )}
                  >
                    {plan.cta}
                  </Link>

                  {/* Features List */}
                  <ul role="list" className="space-y-3 text-sm">
                    {plan.includesFrom && (
                      <li className="font-medium">{plan.includesFrom}</li>
                    )}
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="text-muted-foreground size-3" strokeWidth={3.5} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Enterprise Section */}
          <div className="rounded-lg border mt-6">
            <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x">
              <div className="space-y-6 p-8">
                <div className="self-end">
                  <h3 className="tracking-tight text-lg font-medium">Enterprise</h3>
                  <p className="text-muted-foreground mt-1 text-balance text-sm">
                    For organizations requiring dedicated infrastructure, custom integrations, and enterprise-grade security.
                  </p>
                </div>
                <Link
                  href="#"
                  className="cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring shadow-sm shadow-black/10 border border-transparent bg-card ring-1 ring-foreground/10 duration-200 hover:bg-muted/50 dark:ring-foreground/15 dark:hover:bg-muted/50 h-9 px-4 py-2"
                >
                  Contact Sales
                </Link>
              </div>
              <div className="col-span-2 p-8">
                <ul
                  role="list"
                  className="grid md:grid-cols-2 gap-x-14 gap-y-3 text-sm"
                >
                  {enterpriseFeatures.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="text-muted-foreground size-3" strokeWidth={3.5} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
