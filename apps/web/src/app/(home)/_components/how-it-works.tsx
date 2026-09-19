import { Settings } from 'lucide-react';
import Image from 'next/image';

import { cn } from '@/lib/utils';

function SlackLogo() {
  return (
    <svg
      aria-hidden='true'
      width='22'
      height='22'
      viewBox='0 0 28 28'
      fill='none'
    >
      <path
        d='M6.5 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0 0h5v2.5a2.5 2.5 0 1 1-5 0V11z'
        fill='#36C5F0'
      />
      <path
        d='M17 6.5a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0zm0 0v5h-2.5a2.5 2.5 0 1 1 0-5H17z'
        fill='#2EB67D'
      />
      <path
        d='M21.5 17a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zm0 0h-5v-2.5a2.5 2.5 0 1 1 5 0V17z'
        fill='#ECB22E'
      />
      <path
        d='M11 21.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zm0 0v-5h2.5a2.5 2.5 0 1 1 0 5H11z'
        fill='#E01E5A'
      />
    </svg>
  );
}

function LoomLogo() {
  return (
    <svg
      aria-hidden='true'
      width='22'
      height='22'
      viewBox='0 0 28 28'
      fill='none'
    >
      <g stroke='#7C3AED' strokeWidth='1.8' strokeLinecap='round'>
        <circle cx='14' cy='14' r='2.6' fill='#7C3AED' />
        <line x1='14' y1='3.5' x2='14' y2='7.5' />
        <line x1='14' y1='20.5' x2='14' y2='24.5' />
        <line x1='3.5' y1='14' x2='7.5' y2='14' />
        <line x1='20.5' y1='14' x2='24.5' y2='14' />
        <line x1='6.5' y1='6.5' x2='9.5' y2='9.5' />
        <line x1='18.5' y1='18.5' x2='21.5' y2='21.5' />
        <line x1='6.5' y1='21.5' x2='9.5' y2='18.5' />
        <line x1='18.5' y1='9.5' x2='21.5' y2='6.5' />
      </g>
    </svg>
  );
}

function ToggleSwitch({ on }: { on: boolean }) {
  return (
    <div
      className={cn(
        'relative inline-flex h-3.5 w-6 shrink-0 items-center rounded-full transition-colors',
        on ? 'bg-blue-500' : 'bg-zinc-300 dark:bg-zinc-700',
      )}
    >
      <span
        className={cn(
          'inline-block size-2.5 rounded-full bg-white shadow-sm transition-transform',
          on ? 'translate-x-3' : 'translate-x-0.5',
        )}
      />
    </div>
  );
}

function NotionLogo() {
  return (
    <div
      aria-hidden='true'
      className='flex h-[22px] w-[22px] items-center justify-center font-bold font-serif text-[18px] text-foreground leading-none'
    >
      N
    </div>
  );
}

function AskIllustration() {
  return (
    <div
      aria-hidden='true'
      className='pointer-events-none relative flex h-40 w-full select-none items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-muted/20 via-blue-50/20 to-muted/20 dark:from-muted/10 dark:via-blue-950/10 dark:to-muted/10'
    >
      <div
        className='relative flex w-full max-w-[270px] flex-col items-center'
        style={{ height: 145 }}
      >
        {/* Card 1 — Wei Chen (widest, top, front) */}
        <div className='-translate-x-1/2 absolute top-0 left-1/2 z-[3] flex w-[265px] items-center gap-2 rounded-lg border border-border/40 bg-white px-2.5 py-2 shadow-lg dark:bg-card'>
          <div className='relative shrink-0'>
            <div className='size-7 overflow-hidden rounded-full bg-gradient-to-br from-neutral-300 to-neutral-400 dark:from-neutral-500 dark:to-neutral-600'>
              <svg
                aria-hidden='true'
                className='size-full p-1 text-neutral-100'
                viewBox='0 0 24 24'
                fill='currentColor'
              >
                <path d='M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v1.2c0 .7.5 1.2 1.2 1.2h16.8c.7 0 1.2-.5 1.2-1.2v-1.2c0-3.2-6.4-4.8-9.6-4.8z' />
              </svg>
            </div>
            <div className='-top-0.5 -right-0.5 absolute flex size-3.5 items-center justify-center rounded-full bg-blue-500 text-white'>
              <svg
                aria-hidden='true'
                width='7'
                height='7'
                viewBox='0 0 24 24'
                fill='currentColor'
              >
                <path d='M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.4l-6.8 4.8 2.4-7.2-6-4.8h7.6z' />
              </svg>
            </div>
          </div>
          <div className='min-w-0 flex-1'>
            <p className='truncate text-[11px] text-foreground leading-tight'>
              <span className='font-semibold'>Wei Chen</span> joined to{' '}
              <span className='font-semibold'>Final Presentation</span>
            </p>
            <p className='mt-0.5 truncate text-[9px] text-muted-foreground'>
              8 min ago · Orixcreative Dribbble
            </p>
          </div>
        </div>

        {/* Card 2 — Matthew Johnson (medium, behind card 1) */}
        <div className='-translate-x-1/2 absolute top-[32px] left-1/2 z-[2] flex w-[240px] items-center gap-2 rounded-lg border border-border/40 bg-white px-2.5 py-2 shadow-md dark:bg-card'>
          <div className='relative shrink-0'>
            <div className='size-7 overflow-hidden rounded-full bg-gradient-to-br from-neutral-600 to-neutral-800 dark:from-neutral-400 dark:to-neutral-500'>
              <svg
                aria-hidden='true'
                className='size-full p-1 text-neutral-300'
                viewBox='0 0 24 24'
                fill='currentColor'
              >
                <path d='M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v1.2c0 .7.5 1.2 1.2 1.2h16.8c.7 0 1.2-.5 1.2-1.2v-1.2c0-3.2-6.4-4.8-9.6-4.8z' />
              </svg>
            </div>
            <div className='-right-0.5 -bottom-0.5 absolute flex size-3.5 items-center justify-center rounded-full bg-green-500 ring-[1.5px] ring-white dark:ring-card'>
              <svg
                aria-hidden='true'
                width='6'
                height='6'
                viewBox='0 0 24 24'
                fill='white'
              >
                <path d='M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z' />
              </svg>
            </div>
          </div>
          <div className='min-w-0 flex-1'>
            <p className='font-semibold text-[11px] text-foreground leading-tight'>
              Matthew Johnson
            </p>
            <p className='mt-0.5 truncate text-[9px] text-muted-foreground'>
              Content Writer · @orixcreat...
            </p>
          </div>
          <div className='shrink-0 text-muted-foreground/40'>
            <svg
              aria-hidden='true'
              width='12'
              height='12'
              viewBox='0 0 24 24'
              fill='currentColor'
            >
              <circle cx='12' cy='5' r='1.5' />
              <circle cx='12' cy='12' r='1.5' />
              <circle cx='12' cy='19' r='1.5' />
            </svg>
          </div>
        </div>

        {/* Card 3 — Terry Lipshutz (narrowest, back/bottom) */}
        <div className='-translate-x-1/2 absolute top-[66px] left-1/2 z-[1] flex w-[215px] items-center gap-2 rounded-lg border border-border/40 bg-white px-2.5 py-2 shadow-sm dark:bg-card'>
          <div className='relative shrink-0'>
            <div className='flex size-7 items-center justify-center rounded-full bg-white ring-1 ring-border/40 dark:bg-card'>
              <svg
                aria-hidden='true'
                width='15'
                height='11'
                viewBox='0 0 24 18'
                fill='none'
              >
                <rect
                  x='0.5'
                  y='0.5'
                  width='23'
                  height='17'
                  rx='2'
                  fill='white'
                  stroke='#E5E7EB'
                />
                <path
                  d='M2 2l10 7 10-7'
                  stroke='#EA4335'
                  strokeWidth='1.8'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M2 2v14'
                  stroke='#4285F4'
                  strokeWidth='1.8'
                  strokeLinecap='round'
                />
                <path
                  d='M22 2v14'
                  stroke='#34A853'
                  strokeWidth='1.8'
                  strokeLinecap='round'
                />
                <path
                  d='M2 16h4'
                  stroke='#FBBC05'
                  strokeWidth='1.8'
                  strokeLinecap='round'
                />
                <path
                  d='M18 16h4'
                  stroke='#FBBC05'
                  strokeWidth='1.8'
                  strokeLinecap='round'
                />
              </svg>
            </div>
          </div>
          <div className='min-w-0 flex-1'>
            <p className='font-semibold text-[11px] text-foreground leading-tight'>
              Terry Lipshutz
            </p>
            <p className='mt-0.5 truncate text-[9px] text-muted-foreground'>
              Approved the design of the iOS app...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function InsightsIllustration() {
  return (
    <div
      aria-hidden='true'
      className='pointer-events-none relative flex h-40 w-full select-none items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-muted/20 via-blue-50/20 to-muted/20 dark:from-muted/10 dark:via-blue-950/10 dark:to-muted/10'
    >
      <div
        className='relative w-full max-w-[340px]'
        style={{ height: 160 }}
      >
        {/* Left card — Loom (full content, peeks out on left ~75px) */}
        <div className='absolute top-2.5 left-0 z-[1] w-[185px] rounded-xl border border-border/40 bg-white p-3 shadow-md dark:bg-card'>
          <div className='flex items-center justify-between'>
            <LoomLogo />
            <ToggleSwitch on={true} />
          </div>
          <p className='mt-1.5 font-semibold text-[11px] text-foreground leading-tight'>
            Loom
          </p>
          <p className='mt-0.5 text-[9.5px] text-muted-foreground leading-snug'>
            For conducting virtual meetings and interviews.
          </p>
          <div className='mt-2 flex w-full items-center justify-center gap-1 rounded-md border border-border/60 px-2 py-1 font-medium text-[10px] text-foreground'>
            <Settings aria-hidden='true' className='size-2.5' />
            Manage
          </div>
        </div>

        {/* Right card — Notion (full content, peeks out on right ~75px) */}
        <div className='absolute top-2.5 right-0 z-[1] w-[185px] rounded-xl border border-border/40 bg-white p-3 shadow-md dark:bg-card'>
          <div className='flex items-center justify-between'>
            <NotionLogo />
            <ToggleSwitch on={false} />
          </div>
          <p className='mt-1.5 font-semibold text-[11px] text-foreground leading-tight'>
            Notion
          </p>
          <p className='mt-0.5 text-[9.5px] text-muted-foreground leading-snug'>
            For docs, wikis, and shared team knowledge.
          </p>
          <div className='mt-2 flex w-full items-center justify-center gap-1 rounded-md border border-border/60 px-2 py-1 font-medium text-[10px] text-foreground'>
            <Settings aria-hidden='true' className='size-2.5' />
            Manage
          </div>
        </div>

        {/* Middle card — Slack (prominent, foreground, taller to cover side joints) */}
        <div className='-translate-x-1/2 absolute top-0 left-1/2 z-[3] flex h-[150px] w-[195px] flex-col rounded-xl border border-border/40 bg-white p-3 shadow-lg dark:bg-card'>
          <div className='flex items-center justify-between'>
            <SlackLogo />
            <ToggleSwitch on={true} />
          </div>
          <p className='mt-1.5 font-semibold text-[12px] text-foreground leading-tight'>
            Slack
          </p>
          <p className='mt-0.5 text-[10px] text-muted-foreground leading-snug'>
            For team communication and real-time collaboration.
          </p>
          <div className='mt-auto flex w-full items-center justify-center gap-1 rounded-md border border-border/60 px-2 py-1 font-medium text-[10.5px] text-foreground'>
            <Settings aria-hidden='true' className='size-3' />
            Manage
          </div>
        </div>
      </div>
    </div>
  );
}

function ShareIllustration() {
  return (
    <div
      aria-hidden='true'
      className='pointer-events-none relative flex h-52 w-full select-none items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-muted/20 via-blue-50/20 to-muted/20 p-4 dark:from-muted/10 dark:via-blue-950/10 dark:to-muted/10'
    >
      <div className='relative w-full max-w-[260px] space-y-2.5'>
        {/* User question — right-aligned chat bubble */}
        <div className='flex justify-end'>
          <div className='rounded-l-xl rounded-tr-xl rounded-br-sm bg-muted px-3 py-1.5 text-[11px] text-foreground leading-snug shadow-sm ring-1 ring-border/50'>
            draft a follow-up to the customer call
          </div>
        </div>

        {/* Assistant lead-in */}
        <p className='text-[11px] text-foreground leading-snug'>
          Got a draft ready.
          <br />
          Polish the tone before sending:
        </p>

        {/* Email draft card */}
        <div className='max-w-[92%] rounded-lg border border-border/50 bg-card shadow-sm'>
          <div className='px-2.5 py-1.5'>
            <div className='flex items-center justify-between gap-2'>
              <span className='text-[9px] text-muted-foreground'>
                Customer follow-up
              </span>
              <div className='-space-x-1 flex items-center'>
                <Image
                  src='/avatar-images/avatar-01.jpg'
                  alt=''
                  width={16}
                  height={16}
                  className='size-4 rounded-full object-cover ring-2 ring-card'
                />
                <Image
                  src='/avatar-images/avatar-02.jpg'
                  alt=''
                  width={16}
                  height={16}
                  className='size-4 rounded-full object-cover ring-2 ring-card'
                />
                <Image
                  src='/avatar-images/avatar-03.jpg'
                  alt=''
                  width={16}
                  height={16}
                  className='size-4 rounded-full object-cover ring-2 ring-card'
                />
                <div className='flex size-4 items-center justify-center rounded-full bg-muted font-medium text-[8px] text-muted-foreground ring-2 ring-card'>
                  +2
                </div>
              </div>
            </div>
            <p className='mt-1 truncate font-semibold text-[11px] text-foreground leading-tight'>
              Following up on our discovery call
            </p>
            <p className='mt-0.5 truncate text-[9px] text-muted-foreground leading-tight'>
              Hi Marcus, great chatting earlier today...
            </p>
          </div>
        </div>

        {/* Suggested action */}
        <div className='space-y-1'>
          <span className='font-medium text-[9px] text-muted-foreground'>
            Suggested action
          </span>
          <div className='flex items-center gap-1.5'>
            <svg
              aria-hidden='true'
              width='10'
              height='10'
              viewBox='0 0 14 14'
              fill='none'
              className='size-2.5 shrink-0 text-muted-foreground'
            >
              <path
                d='M2.5 2.5C2.22386 2.5 2 2.72386 2 3V6.5C2 7.88071 3.11929 9 4.5 9H9.29297L7.64648 10.6465L7.58203 10.7246C7.45387 10.9187 7.47562 11.1827 7.64648 11.3535C7.81735 11.5244 8.08131 11.5461 8.27539 11.418L8.35352 11.3535L10.8535 8.85352C10.9473 8.75975 11 8.63261 11 8.5C11 8.40056 10.9704 8.30419 10.916 8.22266L10.8535 8.14648L8.35352 5.64648C8.15825 5.45122 7.84175 5.45122 7.64648 5.64648C7.45122 5.84175 7.45122 6.15825 7.64648 6.35352L9.29297 8H4.5C3.67157 8 3 7.32843 3 6.5V3C3 2.72391 2.77607 2.50009 2.5 2.5Z'
                fill='currentColor'
              />
            </svg>
            <span className='font-medium text-[10px] text-muted-foreground'>
              Attach pricing one-pager
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

type Step = {
  title: string;
  description: string;
  illustration: React.ReactNode;
  illustrationWrapperClass: string;
};

const STEPS: Step[] = [
  {
    title: 'Know your customers',
    description:
      'Companies, contacts, and everything you know about them, organized in one place. Find what you need without digging through spreadsheets.',
    illustration: <AskIllustration />,
    illustrationWrapperClass: 'w-full self-center',
  },
  {
    title: 'Keep every interaction connected',
    description:
      'Every WhatsApp message, call, and note sits alongside the customer it belongs to. Nothing important gets lost between conversations.',
    illustration: <InsightsIllustration />,
    illustrationWrapperClass: 'self-center',
  },
  {
    title: 'Turn information into action',
    description:
      'Your team gets the context to follow up, move deals forward, and build stronger relationships. Nobody has to ask where a deal stands.',
    illustration: <ShareIllustration />,
    illustrationWrapperClass: 'mx-auto w-full self-center',
  },
];

export default function HowItWorks() {
  return (
    <section className='py-16 sm:py-20 md:py-28'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <p className='font-mono text-[11px] text-muted-foreground uppercase tracking-[0.2em]'>
          How it works
        </p>

        <div className='mt-6 grid items-end gap-6 md:grid-cols-2 md:gap-12'>
          <h2 className='text-balance font-bold text-3xl text-foreground tracking-tight sm:text-4xl md:text-5xl'>
            Your entire customer workflow, in one place
          </h2>
          <p className='max-w-md text-base text-muted-foreground leading-relaxed'>
            Keep customer data, relationships, activities, and conversations connected — so your team always knows what’s happening and what to do next.
          </p>
        </div>

        <div className='mx-auto mt-10 overflow-hidden rounded-2xl border border-transparent bg-card/50 shadow-black/5 shadow-md ring-1 ring-border sm:mt-14'>
          <div className='grid divide-border max-md:divide-y md:grid-cols-3 md:divide-x md:divide-y-0'>
            {STEPS.map((step) => (
              <div
                key={step.title}
                className='row-span-2 grid grid-rows-subgrid gap-6 p-6 sm:gap-8 sm:p-8'
              >
                <div className={step.illustrationWrapperClass}>
                  {step.illustration}
                </div>
                <div className='relative z-10 mx-auto max-w-sm text-center'>
                  <h3 className='text-balance font-semibold'>{step.title}</h3>
                  <p className='mt-3 text-balance text-muted-foreground'>
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
