import {
  BadgeCheck,
  Calendar,
  ChevronsUpDown,
  Copy,
  Globe,
  Zap,
} from 'lucide-react';
import Image from 'next/image';
import type { ReactNode } from 'react';
import { SiGooglemeet } from 'react-icons/si';

import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Shared bits                                                               */
/* -------------------------------------------------------------------------- */

function DotBg() {
  return (
    <div
      aria-hidden
      className='pointer-events-none absolute inset-0 text-foreground/[0.06] [background-image:radial-gradient(currentColor_1px,transparent_1px)] [background-size:14px_14px]'
    />
  );
}

function FeatureCard({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'relative flex min-h-[540px] flex-col overflow-hidden rounded-2xl border border-border bg-background',
        className,
      )}
    >
      <DotBg />
      <div className='relative p-8'>
        <h3 className='font-semibold text-foreground text-lg leading-tight'>
          {title}
        </h3>
        <p className='mt-2 text-base text-foreground/75 leading-relaxed'>
          {description}
        </p>
      </div>
      <div className='relative flex-1'>{children}</div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Card 1 — Workflow Automation (ported from pro.ruixen.com elements page)   */
/* -------------------------------------------------------------------------- */

const WorkflowStatusBadge = ({
  label,
  variant = 'completed',
  className,
}: {
  label: string;
  variant?: 'triggered' | 'completed' | 'in-progress';
  className?: string;
}) => {
  if (variant === 'in-progress') {
    return (
      <div
        className={cn(
          'flex h-5 items-center gap-1 rounded-md border border-blue-500/40 bg-blue-500/10 px-1.5',
          className,
        )}
      >
        <svg
          width='12'
          height='12'
          viewBox='0 0 12 12'
          fill='none'
          aria-hidden='true'
        >
          <title>in progress</title>
          <circle
            cx='6'
            cy='6'
            r='4'
            className='stroke-blue-600 dark:stroke-blue-400'
            strokeWidth='1.5'
            strokeDasharray='6 4'
            strokeLinecap='round'
          />
        </svg>
        <span className='font-medium text-[11px] text-blue-700 dark:text-blue-400'>
          {label}
        </span>
      </div>
    );
  }
  return (
    <div
      className={cn(
        'flex h-5 items-center gap-1 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-1.5',
        className,
      )}
    >
      <svg
        width='12'
        height='12'
        viewBox='0 0 12 12'
        fill='none'
        aria-hidden='true'
      >
        <title>{variant === 'triggered' ? 'triggered' : 'completed'}</title>
        <path
          d='M3 5.727 3.742 6.9c.442.699.663 1.048.947 1.17a1 1 0 0 0 .778.007c.286-.118.512-.464.965-1.156L9 3'
          className='stroke-emerald-600 dark:stroke-emerald-400'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
      <span className='font-medium text-[11px] text-emerald-700 dark:text-emerald-400'>
        {label}
      </span>
    </div>
  );
};

const WorkflowGlyph = ({
  kind,
}: {
  kind: 'db' | 'switch' | 'run' | 'slack' | 'mixmax';
}) => (
  <svg
    width='20'
    height='20'
    viewBox='0 0 20 20'
    fill='none'
    aria-hidden='true'
  >
    <title>{kind}</title>
    {kind === 'slack' ? (
      <>
        <rect
          x='0.5'
          y='0.5'
          width='19'
          height='19'
          rx='5.5'
          className='fill-card stroke-border'
        />
        <rect x='3.5' y='3.5' width='6' height='3' rx='1.5' fill='#36C5F0' />
        <rect x='13.5' y='3.5' width='3' height='6' rx='1.5' fill='#ECB22E' />
        <rect x='10.5' y='13.5' width='6' height='3' rx='1.5' fill='#2EB67D' />
        <rect x='3.5' y='10.5' width='3' height='6' rx='1.5' fill='#E01E5A' />
      </>
    ) : kind === 'mixmax' ? (
      <>
        <rect
          x='0.5'
          y='0.5'
          width='19'
          height='19'
          rx='5.5'
          className='fill-violet-500/15 stroke-violet-500/30'
        />
        <path
          d='M5 14 L7 6 L10 11 L13 6 L15 14'
          className='stroke-violet-600 dark:stroke-violet-400'
          strokeWidth='1.5'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </>
    ) : (
      <rect
        x='0.5'
        y='0.5'
        width='19'
        height='19'
        rx='5.5'
        className='fill-blue-500/15 stroke-blue-500/30'
      />
    )}
    {kind === 'db' && (
      <>
        <ellipse
          cx='10'
          cy='6.5'
          rx='4'
          ry='1.5'
          className='stroke-blue-500'
          strokeWidth='1.2'
        />
        <path
          d='M6 6.5v7c0 .8 1.8 1.5 4 1.5s4-.7 4-1.5v-7'
          className='stroke-blue-500'
          strokeWidth='1.2'
          strokeLinecap='round'
        />
        <path
          d='M6 10c0 .8 1.8 1.5 4 1.5s4-.7 4-1.5'
          className='stroke-blue-500'
          strokeWidth='1.2'
          strokeLinecap='round'
        />
      </>
    )}
    {kind === 'switch' && (
      <>
        <path
          d='M7 14.67V10.17a1.5 1.5 0 0 1 1.5-1.5 1.5 1.5 0 0 0 1.5-1.5V5.33M7 14.67 8.67 13M7 14.67 5.33 13'
          className='stroke-blue-500'
          strokeWidth='1.2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M13 14.67V10.17a1.5 1.5 0 0 0-1.5-1.5 1.5 1.5 0 0 1-1.5-1.5V5.33M13 14.67 11.33 13M13 14.67 14.67 13'
          className='stroke-blue-500'
          strokeWidth='1.2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </>
    )}
    {kind === 'run' && (
      <path
        d='M8.25 10 6.4 5.9c-.13-.28.18-.56.45-.41L14.7 10l-7.85 4.5c-.27.16-.58-.12-.45-.4L8.25 10ZM8.25 10H14.7'
        className='stroke-blue-500'
        strokeWidth='1.2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    )}
  </svg>
);

const WorkflowNodeCard = ({
  icon,
  title,
  tag,
  description,
  active = false,
}: {
  icon: ReactNode;
  title: string;
  tag: string;
  description: string;
  active?: boolean;
}) => (
  <div
    className={cn(
      'relative h-full w-full overflow-hidden rounded-xl bg-card shadow-black/5 shadow-sm',
      active
        ? 'border border-emerald-500/40 ring-1 ring-emerald-500/10'
        : 'border border-border',
    )}
  >
    <div className='relative flex h-full flex-col px-3 py-2.5'>
      <div className='flex items-center justify-between gap-2'>
        <div className='flex min-w-0 items-center gap-x-1.5'>
          {icon}
          <p className='truncate font-semibold text-[15px] text-foreground tracking-tight'>
            {title}
          </p>
        </div>
        <span className='inline-flex shrink-0 items-center rounded-md border border-border bg-muted/50 px-1.5 py-px font-normal text-[11px] text-muted-foreground'>
          {tag}
        </span>
      </div>
      <hr className='mt-2 mb-auto border-border' />
      <p className='overflow-hidden text-ellipsis whitespace-nowrap text-[12px] text-muted-foreground'>
        {description}
      </p>
    </div>
  </div>
);

function WorkflowAutomation() {
  return (
    <div className='pointer-events-none relative flex h-full w-full select-none items-center justify-center overflow-hidden bg-background'>
      {/* Dot pattern background */}
      <svg
        className='absolute inset-0 h-full w-full text-foreground/[0.06] dark:text-foreground/[0.08]'
        aria-hidden='true'
      >
        <title>workflow grid</title>
        <defs>
          <pattern
            id='workflow-dot-pattern'
            width='10'
            height='10'
            patternUnits='userSpaceOnUse'
          >
            <rect x='5.5' y='5.5' width='1' height='1' fill='currentColor' />
          </pattern>
        </defs>
        <rect width='100%' height='100%' fill='url(#workflow-dot-pattern)' />
      </svg>

      <div
        className='relative h-[216px] w-[480px] max-w-full shrink-0 overflow-hidden xl:h-[324px] xl:w-[720px]'
        style={{
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0%, black 24%, black 100%)',
          maskImage:
            'linear-gradient(to right, transparent 0%, black 24%, black 100%)',
        }}
      >
        <div
          className='origin-top-left scale-[0.6] xl:scale-[0.9]'
          style={{ width: 800, height: 360 }}
        >
          {/* Connector overlay */}
          <svg
            className='pointer-events-none absolute inset-0 h-full w-full'
            viewBox='0 0 800 360'
            fill='none'
            aria-hidden='true'
          >
            <title>workflow connectors</title>

            {/* Faded low-value branch (Slack → up to Low value) */}
            <path
              d='M 360 180 H 400 C 410 180 420 170 420 160 V 80 C 420 70 430 60 440 60 H 480'
              className='stroke-border'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
              opacity='0.5'
            />

            {/* Trigger → Slack (off-screen-left enters from the masked zone) */}
            <path
              d='M 40 180 H 120'
              className='stroke-emerald-500/60'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            {/* Arrow into Slack (right-pointing chevron at Slack left edge) */}
            <path
              d='M 116 176 L 120 180 L 116 184'
              className='stroke-emerald-500/60'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />

            {/* Slack → High value (active, down-curve) */}
            <path
              d='M 360 180 H 400 C 410 180 420 190 420 200 V 260 C 420 270 430 280 440 280 H 480'
              className='stroke-emerald-500/60'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            {/* Arrow into High value (right-pointing chevron at High value left edge) */}
            <path
              d='M 476 276 L 480 280 L 476 284'
              className='stroke-emerald-500/60'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />

            {/* High value → Plus (dashed horizontal) */}
            <line
              x1='725'
              y1='280'
              x2='750'
              y2='280'
              className='stroke-border'
              strokeWidth='1.2'
              strokeDasharray='2 3'
              strokeLinecap='round'
            />
          </svg>

          {/* Slack Card (mid-left) */}
          <div
            className='absolute'
            style={{ top: 140, left: 120, width: 240, height: 80 }}
          >
            <WorkflowStatusBadge
              label='Completed'
              className='-top-6 absolute right-0'
            />
            <WorkflowNodeCard
              active
              icon={<WorkflowGlyph kind='slack' />}
              title='Post Message to Slack'
              tag='Slack'
              description='Sends a message to your Slack channel.'
            />
          </div>

          {/* Branch labels (vertically centered on each branch's middle V segment at x=420) */}
          <div
            className='-translate-x-1/2 -translate-y-1/2 absolute flex h-5 items-center justify-center rounded-md border border-emerald-500/40 bg-background px-1.5'
            style={{ top: 230, left: 420 }}
          >
            <span className='whitespace-nowrap font-medium text-[11px] text-emerald-700 dark:text-emerald-400'>
              Anomaly detected
            </span>
          </div>
          <div
            className='-translate-x-1/2 -translate-y-1/2 absolute flex h-5 items-center justify-center rounded-md border border-border bg-background px-1.5 opacity-60'
            style={{ top: 130, left: 420 }}
          >
            <span className='whitespace-nowrap font-medium text-[11px] text-muted-foreground'>
              Normal range
            </span>
          </div>

          {/* Active branch terminal: High value (bottom-right) */}
          <div
            className='absolute'
            style={{ top: 240, left: 480, width: 240, height: 80 }}
          >
            <WorkflowStatusBadge
              label='In progress'
              variant='in-progress'
              className='-top-6 absolute right-0'
            />
            <WorkflowNodeCard
              active
              icon={<WorkflowGlyph kind='mixmax' />}
              title='Alert revenue team'
              tag='Slack'
              description='Posts the chart and a summary to #revenue.'
            />
          </div>

          {/* Faded branch terminal: Low value (top-right) */}
          <div
            className='absolute opacity-60'
            style={{ top: 20, left: 480, width: 240, height: 80 }}
          >
            <WorkflowNodeCard
              icon={<WorkflowGlyph kind='mixmax' />}
              title='Log to history'
              tag='Webhook'
              description='Records the run for monthly reporting.'
            />
          </div>

          {/* Connector dots (now anchored on card right-edges instead of bottoms) */}
          <svg
            className='pointer-events-none absolute inset-0 h-full w-full'
            viewBox='0 0 800 360'
            fill='none'
            aria-hidden='true'
          >
            <title>connector dots</title>
            {/* Trigger entry (off-screen-left, in the faded zone) */}
            <circle
              cx='40'
              cy='180'
              r='5'
              className='fill-card stroke-emerald-500/60'
              strokeWidth='1.5'
            />
            {/* Slack right edge */}
            <circle
              cx='360'
              cy='180'
              r='5'
              className='fill-card stroke-emerald-500/60'
              strokeWidth='1.5'
            />
            {/* High value right edge */}
            <circle
              cx='720'
              cy='280'
              r='5'
              className='fill-card stroke-emerald-500/60'
              strokeWidth='1.5'
            />
            {/* Low value right edge (faded) */}
            <circle
              cx='720'
              cy='60'
              r='5'
              className='fill-card stroke-border'
              strokeWidth='1.5'
              opacity='0.6'
            />
          </svg>

          {/* Plus button (anchored right of active branch end) */}
          <div
            className='absolute flex items-center justify-center'
            style={{ top: 250, left: 720, width: 60, height: 60 }}
          >
            <div className='absolute inset-0 rounded-full bg-blue-500/10' />
            <div className='absolute inset-2 rounded-full bg-blue-500/20' />
            <div className='relative flex size-7 items-center justify-center rounded-full bg-blue-500/70 text-white shadow-sm'>
              <svg
                width='14'
                height='14'
                viewBox='0 0 14 14'
                fill='none'
                aria-hidden='true'
              >
                <title>add step</title>
                <path
                  d='M7 3v8M3 7h8'
                  stroke='currentColor'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WorkflowAutomationCard() {
  return (
    <FeatureCard
      title='Your workflow, your views'
      description='Shape Folio CRM around how your team works. Search, filter, and sort boards without digging through spreadsheets.'
      className='lg:col-span-2'
    >
      <WorkflowAutomation />
    </FeatureCard>
  );
}

/* -------------------------------------------------------------------------- */
/*  Card 2 — Guest Feedback                                                   */
/* -------------------------------------------------------------------------- */

function GuestFeedbackCard() {
  return (
    <FeatureCard
      title='One source of truth'
      description='Keep everyone working from the same customer data.'
    >
      <div className='absolute inset-0 flex flex-col items-center justify-center pb-28'>
        {/* Top icon — Google Meet */}
        <div className='relative z-10 flex size-16 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-border/60'>
          <SiGooglemeet className='size-8' />
        </div>

        {/* Connecting line */}
        <div className='relative z-10 h-12 w-px bg-foreground/20' />

        {/* Bottom icon area with rings + avatar */}
        <div className='relative flex items-center justify-center'>
          {/* Concentric dashed rings (centered on icon) */}
          <div className='-translate-x-1/2 -translate-y-1/2 pointer-events-none absolute top-1/2 left-1/2 size-32 rounded-full border border-foreground/20 border-dashed' />
          <div className='-translate-x-1/2 -translate-y-1/2 pointer-events-none absolute top-1/2 left-1/2 size-44 rounded-full border border-foreground/15 border-dashed' />
          <div className='-translate-x-1/2 -translate-y-1/2 pointer-events-none absolute top-1/2 left-1/2 size-56 rounded-full border border-foreground/10 border-dashed' />

          {/* Bottom icon — data source */}
          <div className='relative flex size-16 items-center justify-center rounded-2xl bg-zinc-900 shadow-md'>
            <Zap
              className='size-7 text-emerald-400'
              fill='currentColor'
              strokeWidth={0}
            />
            {/* Avatar overlapping bottom-right */}
            <div className='-right-1 -bottom-1 absolute size-6 rounded-full bg-gradient-to-br from-rose-300 to-pink-400 shadow ring-2 ring-background' />
          </div>
        </div>
      </div>
    </FeatureCard>
  );
}

/* -------------------------------------------------------------------------- */
/*  Card 3 — Product Card Carousel                                            */
/* -------------------------------------------------------------------------- */

const PRODUCT_CARD_PALETTE = {
  red: { bg: '#FFEBEB', border: '#FFDCDB', stroke: '#772322' },
  yellow: { bg: '#FFF3CC', border: '#FFEBAD', stroke: '#705500' },
  blue: { bg: '#DAF4FC', border: '#C3EDF9', stroke: '#0A5A70' },
  green: { bg: '#DDF9E4', border: '#C7F4D3', stroke: '#075A39' },
  purple: { bg: '#F5F0FF', border: '#E8DDFE', stroke: '#4711BB' },
  pink: { bg: '#FEECF1', border: '#FDDDE7', stroke: '#6F065D' },
  gray: { bg: '#F4F5F6', border: '#E6E7EA', stroke: '#75777C' },
} as const;

type ProductCardColor = keyof typeof PRODUCT_CARD_PALETTE;

const PRODUCT_CARD_ITEMS: {
  text: string;
  color: ProductCardColor;
  ty: number;
  scale: number;
  opacity: number;
}[] = [
    {
      text: 'Build executive dashboard',
      color: 'gray',
      ty: -414,
      scale: 0.6,
      opacity: 0,
    },
    {
      text: 'Forecast Q2 revenue',
      color: 'red',
      ty: -354.5,
      scale: 0.7,
      opacity: 0.25,
    },
    {
      text: 'Find churn risk customers',
      color: 'yellow',
      ty: -268,
      scale: 0.8,
      opacity: 0.5,
    },
    {
      text: 'Compare regional sales',
      color: 'blue',
      ty: -163.5,
      scale: 0.9,
      opacity: 0.75,
    },
    {
      text: 'Top 10 products by revenue',
      color: 'green',
      ty: -50,
      scale: 1,
      opacity: 1,
    },
    {
      text: 'Track signup funnel drop-off',
      color: 'purple',
      ty: 63.5,
      scale: 0.9,
      opacity: 0.75,
    },
    {
      text: 'Detect order anomalies',
      color: 'pink',
      ty: 168,
      scale: 0.8,
      opacity: 0.5,
    },
    {
      text: 'Audit data quality issues',
      color: 'green',
      ty: 254.5,
      scale: 0.7,
      opacity: 0.25,
    },
  ];

function ProductCardCarousel() {
  const pillShadow =
    '0 10.85px 21.7px -4.34px rgba(28,40,64,0.08), 0 6.51px 6.51px -6.51px rgba(28,40,64,0.08), 0 4.34px 4.34px -4.34px rgba(28,40,64,0.12)';

  return (
    <div className='pointer-events-none relative h-full w-full select-none overflow-hidden rounded-xl'>
      <div className='absolute inset-0 flex items-center justify-center'>
        <div className='relative w-[251px] overflow-visible'>
          <svg
            width='1'
            height='400'
            className='-translate-y-1/2 absolute top-1/2 left-0 h-[400px] text-border'
            aria-hidden='true'
          >
            <title>left rail</title>
            <line
              x1='0.5'
              y1='0'
              x2='0.5'
              y2='100%'
              stroke='currentColor'
              strokeDasharray='4 6'
              strokeLinecap='round'
            />
          </svg>
          <svg
            width='1'
            height='400'
            className='-translate-y-1/2 absolute top-1/2 right-0 h-[400px] text-border'
            aria-hidden='true'
          >
            <title>right rail</title>
            <line
              x1='0.5'
              y1='0'
              x2='0.5'
              y2='100%'
              stroke='currentColor'
              strokeDasharray='4 6'
              strokeLinecap='round'
            />
          </svg>
        </div>
      </div>
      {PRODUCT_CARD_ITEMS.map((card) => {
        const theme = PRODUCT_CARD_PALETTE[card.color];
        return (
          <div
            key={card.text}
            className='absolute top-1/2 left-1/2 flex w-[251px] items-center gap-2 rounded-[12px] border bg-card p-2'
            style={{
              borderColor: 'rgba(46,50,56,0.07)',
              boxShadow: pillShadow,
              opacity: card.opacity,
              transform: `translate(-50%, ${card.ty}%) scale(${card.scale})`,
            }}
          >
            <div
              className='flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[8px] border'
              style={{ backgroundColor: theme.bg, borderColor: theme.border }}
            >
              <svg
                width='12'
                height='12'
                viewBox='0 0 12 12'
                fill='none'
                aria-hidden='true'
              >
                <title>workflow</title>
                <rect
                  x='1.25'
                  y='1.25'
                  width='4'
                  height='4'
                  rx='1.5'
                  stroke={theme.stroke}
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <rect
                  x='6.75'
                  y='6.75'
                  width='4'
                  height='4'
                  rx='2'
                  stroke={theme.stroke}
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M2 7.25V8.00084C2 9.10541 2.89543 10.0008 4 10.0008H4.75'
                  stroke={theme.stroke}
                  strokeLinecap='round'
                />
                <path
                  d='M10 4.75L10 3.99916C10 2.89459 9.10457 1.99916 8 1.99916L7.25 1.99916'
                  stroke={theme.stroke}
                  strokeLinecap='round'
                />
              </svg>
            </div>
            <span className='overflow-hidden text-ellipsis whitespace-nowrap font-normal text-[14px] text-foreground tracking-[-0.02em]'>
              {card.text}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function ProductCardCarouselCard() {
  return (
    <FeatureCard
      title='Companies, organized'
      description='Everything about your accounts, right where you need it.'
    >
      <ProductCardCarousel />
    </FeatureCard>
  );
}

/* -------------------------------------------------------------------------- */
/*  Card 4 — Web Search Chat (ported from pro.ruixen.com elements page)       */
/* -------------------------------------------------------------------------- */

function WebSearchChatCard() {
  return (
    <FeatureCard
      title='Every interaction, connected'
      description='Keep customer history and activity in context.'
    >
      <div
        className='pointer-events-none relative flex h-full w-full select-none items-center justify-center overflow-hidden bg-background p-8'
        style={{
          WebkitMaskImage:
            'linear-gradient(to bottom, black 55%, transparent 95%)',
          maskImage: 'linear-gradient(to bottom, black 55%, transparent 95%)',
        }}
      >
        <svg
          aria-hidden='true'
          className='pointer-events-none absolute inset-0 h-full w-full text-border opacity-60 dark:opacity-30'
        >
          <defs>
            <pattern
              id='web-search-chat-dots'
              x='0'
              y='0'
              width='12'
              height='12'
              patternUnits='userSpaceOnUse'
            >
              <circle cx='1' cy='1' r='0.8' fill='currentColor' />
            </pattern>
          </defs>
          <rect width='100%' height='100%' fill='url(#web-search-chat-dots)' />
        </svg>

        <div className='relative w-full max-w-xs space-y-4'>
          {/* User question */}
          <div className='flex justify-end'>
            <div className='max-w-[85%] rounded-l-xl rounded-tr-xl rounded-br-sm bg-muted px-3.5 py-2.5 text-foreground text-sm leading-5 shadow-sm ring-1 ring-border/50'>
              summarize the latest news about Acme Corp
            </div>
          </div>

          {/* Searched web tab */}
          <div className='flex w-fit items-center gap-2 rounded-xl border border-border/50 bg-card px-2.5 py-1.5 shadow-sm'>
            <Globe className='size-3.5 shrink-0 text-muted-foreground' />
            <div className='text-xs leading-none'>
              <span className='text-muted-foreground'>Searched web:</span>{' '}
              <span className='font-semibold text-foreground'>5 results</span>
            </div>
            <div className='-space-x-1 flex items-center'>
              <div className='flex size-4 items-center justify-center rounded-sm bg-zinc-900 ring-2 ring-card'>
                <span className='font-bold text-[7px] text-white'>X</span>
              </div>
              <div className='flex size-4 items-center justify-center rounded-sm bg-sky-500 ring-2 ring-card'>
                <span className='font-bold text-[7px] text-white'>in</span>
              </div>
              <div className='flex size-4 items-center justify-center rounded-sm bg-orange-500 ring-2 ring-card'>
                <span className='font-bold text-[7px] text-white'>N</span>
              </div>
              <div className='flex size-4 items-center justify-center rounded-sm bg-muted text-muted-foreground ring-2 ring-card'>
                <span className='font-bold text-[8px]'>2</span>
              </div>
            </div>
          </div>

          {/* Assistant heading */}
          <p className='font-medium text-foreground text-sm leading-5'>
            Here&apos;s the quick rundown:
          </p>

          {/* Multi-paragraph answer */}
          <div className='space-y-3 text-foreground text-xs leading-relaxed'>
            <p>
              Acme closed a $40M Series B led by Sequoia, funding a European
              expansion and a new agent SDK shipping next quarter.
            </p>
            <p>Their CTO previewed multi-tenant architecture for enterprise.</p>
          </div>
        </div>
      </div>
    </FeatureCard>
  );
}

/* -------------------------------------------------------------------------- */
/*  Card 5 — Workflow Timeline (ported from pro.ruixen.com elements page)     */
/* -------------------------------------------------------------------------- */

function WorkflowTimelineCard() {
  return (
    <FeatureCard
      title='Know what’s next'
      description='Stay on top of relationships and follow-ups as they happen.'
    >
      <div className='pointer-events-none relative flex h-full w-full select-none items-center justify-center overflow-hidden bg-background p-4'>
        <svg
          aria-hidden='true'
          className='pointer-events-none absolute inset-0 h-full w-full text-border opacity-60 dark:opacity-30'
        >
          <defs>
            <pattern
              id='workflow-timeline-dots'
              x='0'
              y='0'
              width='10'
              height='10'
              patternUnits='userSpaceOnUse'
            >
              <rect x='4.5' y='4.5' width='1' height='1' fill='currentColor' />
            </pattern>
          </defs>
          <rect
            width='100%'
            height='100%'
            fill='url(#workflow-timeline-dots)'
          />
        </svg>

        <div className='relative w-full max-w-[340px]'>
          <div className='relative pl-12'>
            {/* Vertical dashed trunk */}
            <div className='absolute top-0 bottom-0 left-6 border-foreground/15 border-l border-dashed' />

            {/* Event 1 — Calendar */}
            <div className='relative'>
              <div className='-left-9 absolute top-0 z-10 flex size-6 items-center justify-center rounded-md bg-blue-100 ring-1 ring-blue-200/60 dark:bg-blue-950/40 dark:ring-blue-900/40'>
                <Calendar
                  className='size-3 text-blue-600 dark:text-blue-400'
                  strokeWidth={2.5}
                />
              </div>

              <div className='space-y-1.5'>
                <div className='flex items-center gap-1.5 pl-1 text-[11px]'>
                  <Image
                    src='/avatar-images/avatar-02.jpg'
                    alt=''
                    width={16}
                    height={16}
                    className='size-4 shrink-0 rounded-full object-cover'
                  />
                  <span className='min-w-0 truncate text-muted-foreground'>
                    <span className='font-semibold text-foreground'>
                      Sofia Rivera
                    </span>{' '}
                    pinned a chart
                  </span>
                  <span className='ml-auto shrink-0 whitespace-nowrap text-[10px] text-muted-foreground/70'>
                    1 hour ago
                  </span>
                </div>

                <div className='ml-1 rounded-md border border-border bg-card p-2.5 shadow-sm'>
                  <div className='flex items-center justify-between'>
                    <span className='inline-flex items-center gap-0.5 rounded-md bg-emerald-100 px-1.5 py-px font-medium text-[10px] text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'>
                      <BadgeCheck className='size-2.5' strokeWidth={3} />
                      Published
                    </span>
                    <div className='-space-x-1 flex'>
                      <span className='flex size-4 items-center justify-center rounded-full bg-blue-500 font-bold text-[8px] text-white ring-2 ring-card'>
                        R
                      </span>
                      <span className='flex size-4 items-center justify-center rounded-full bg-amber-500 font-bold text-[8px] text-white ring-2 ring-card'>
                        E
                      </span>
                    </div>
                  </div>
                  <p className='mt-1.5 font-semibold text-[11px] text-foreground leading-snug'>
                    Revenue by region – Q3 review
                  </p>
                  <p className='mt-0.5 text-[10px] text-muted-foreground'>
                    Pinned to #revenue
                  </p>
                </div>

                <div className='relative pt-1'>
                  <div className='-left-6 absolute top-0 h-1/2 w-6 rounded-bl-full border-foreground/15 border-b border-l border-dashed' />
                  <div className='flex items-center gap-1 text-[10px] text-muted-foreground'>
                    <ChevronsUpDown className='size-2.5 shrink-0' />
                    Show 4 more events
                  </div>
                </div>
              </div>
            </div>

            <div className='h-3' />

            {/* Event 2 — Copy */}
            <div className='relative'>
              <div className='-left-9 absolute top-0 z-10 flex size-6 items-center justify-center rounded-md bg-blue-100 ring-1 ring-blue-200/60 dark:bg-blue-950/40 dark:ring-blue-900/40'>
                <Copy
                  className='size-3 text-blue-600 dark:text-blue-400'
                  strokeWidth={2.5}
                />
              </div>

              <div className='space-y-1.5'>
                <div className='flex items-center gap-1.5 pl-1 text-[11px]'>
                  <Image
                    src='/avatar-images/avatar-04.jpg'
                    alt=''
                    width={16}
                    height={16}
                    className='size-4 shrink-0 rounded-full object-cover'
                  />
                  <span className='inline-flex min-w-0 items-center gap-1 truncate text-muted-foreground'>
                    <span className='shrink-0 font-semibold text-foreground'>
                      Nicole Smith
                    </span>
                    <span className='shrink-0'>saved</span>
                    <span className='inline-flex size-3.5 shrink-0 items-center justify-center rounded-sm bg-violet-600 font-bold text-[8px] text-white'>
                      Q
                    </span>
                    <span className='shrink-0 font-semibold text-foreground'>
                      Top 10 customers
                    </span>
                    <span className='shrink-0'>as a view</span>
                  </span>
                  <span className='ml-auto shrink-0 whitespace-nowrap text-[10px] text-muted-foreground/70'>
                    5 hours ago
                  </span>
                </div>

                <div className='relative pt-1'>
                  <div className='-left-6 absolute top-0 h-1/2 w-6 rounded-bl-full border-foreground/15 border-b border-l border-dashed' />
                  <div className='flex items-center gap-1 text-[10px] text-muted-foreground'>
                    <ChevronsUpDown className='size-2.5 shrink-0' />
                    Show all saved queries
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FeatureCard>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section                                                                   */
/* -------------------------------------------------------------------------- */

export default function Bento() {
  return (
    <section className='py-20 md:py-28'>
      <div className='mx-auto max-w-7xl px-6 lg:px-8'>
        <div className='grid items-end gap-8 md:grid-cols-2 md:gap-12'>
          <h2 className='text-balance font-bold text-4xl text-foreground tracking-tight md:text-5xl'>
            Everything you need to manage customer relationships
          </h2>
          <p className='max-w-md text-base text-muted-foreground leading-relaxed'>
            Keep your companies, contacts, conversations, and customer activity connected in one simple workspace.
          </p>
        </div>

        <div className='mt-14 grid grid-cols-1 gap-5 lg:grid-cols-3'>
          <WorkflowAutomationCard />
          <ProductCardCarouselCard />
          <GuestFeedbackCard />
          <WebSearchChatCard />
          <WorkflowTimelineCard />
        </div>
      </div>
    </section>
  );
}
