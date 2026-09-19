'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { SankeyDataCard } from './sankey-data-card';

// ─── Data ────────────────────────────────────────────────────────────────────

const KEY_INSIGHTS = [
  {
    title: 'Strong upward momentum',
    description:
      'AAPL gained +12.4% over the last 30 days, outperforming the S&P 500 by 8.2 percentage points',
  },
  {
    title: 'Revenue beat expectations',
    description:
      'Q3 revenue of $94.9B exceeded analyst consensus of $89.3B — a 6.3% surprise driven by Services and iPhone segments',
  },
  {
    title: 'Institutional accumulation',
    description:
      'Net institutional buying increased by 2.1M shares this quarter, with Vanguard and BlackRock adding to positions',
  },
  {
    title: 'Technical breakout confirmed',
    description:
      'Price broke above the 200-day moving average with volume 2.3x the 20-day average — a historically bullish signal',
  },
] as const;

const FULL_TEXT = `Based on your connected PostgreSQL database, here's the analysis for AAPL:

**Apple Inc. (AAPL) — Performance Summary**
**Key metrics from your portfolio database:**`;

const TYPING_SPEED = 25;

// ─── Chat Content Component ─────────────────────────────────────────────────

// ─── Demo step timeline (with typing) ───────────────────────────────────────
// Step 0:  Landing state
// Step 1:  Cursor moves to "Attach DB" on the input
// Step 2:  Dialog opens, cursor at PostgreSQL
// Step 3:  PG selected, cursor → DB Name (typing)
// Steps 4-9: Typing through fields
// Step 10: cursor → Test Connection
// Step 11: Connected, cursor → Connect
// Step 12: Dialog closes, question types into input
// Step 13: Question typed, send ready
// Step 14: Transition to chat mode

const FIELD_TARGETS = [
  'portfolio_db', // field 0: DB Name (step 3)
  '192.168.1.42', // field 1: Host (step 4)
  '5432', // field 2: Port (step 5)
  'analytics_rw', // field 3: Username (step 6)
  '••••••••••', // field 4: Password (step 7)
  'public', // field 5: Schema (step 8)
];

const QUESTION_TEXT = 'Analyze AAPL performance from my portfolio database';
const QUESTION_TYPE_SPEED = 35;
const TYPE_SPEED = 50;
const FIELD_PAUSE = 250;

function computeDelays(): number[] {
  let t = 600; // step 1: cursor → Attach DB
  const delays = [t];
  t += 600; // step 2: dialog opens, cursor → PostgreSQL
  delays.push(t);
  t += 350; // step 3: PG selected, cursor → DB Name
  delays.push(t);
  for (let i = 0; i < FIELD_TARGETS.length; i++) {
    t += (FIELD_TARGETS[i]?.length ?? 0) * TYPE_SPEED + FIELD_PAUSE;
    delays.push(t); // steps 4-9
  }
  t += 1200; // step 10: testing
  delays.push(t);
  t += 400; // step 11: connect click
  delays.push(t);
  t += 400; // step 12: dialog closes → question typing
  delays.push(t);
  t += QUESTION_TEXT.length * QUESTION_TYPE_SPEED + 200; // step 13: question typed
  delays.push(t);
  t += 500; // step 14: chat mode
  delays.push(t);
  return delays;
}

const STEP_DELAYS = computeDelays();

// Cursor positions inside the dialog (steps 2-11)
// Cursor positions (px) within the 460px-wide dialog card. Calibrated for
// the current 4-chip Database Type row (single line, ~18px tall). If chips
// wrap to a second line again, every Y after step 2 needs +24.
const DIALOG_CURSOR_POS = [
  { x: 56, y: 84 }, // 2: PostgreSQL pill
  { x: 220, y: 135 }, // 3: DB Name input
  { x: 184, y: 191 }, // 4: Host input
  { x: 404, y: 191 }, // 5: Port input
  { x: 118, y: 247 }, // 6: Username input
  { x: 324, y: 247 }, // 7: Password input
  { x: 220, y: 303 }, // 8: Schema input
  { x: 318, y: 351 }, // 9: Test Connection btn
  { x: 409, y: 351 }, // 10: Connect btn
  { x: 409, y: 351 }, // 11: Connect btn (click)
];

export function ChatContent() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = STEP_DELAYS.map((delay, i) =>
      setTimeout(() => setStep(i + 1), delay),
    );
    return () => {
      for (const t of timers) clearTimeout(t);
    };
  }, []);

  const showDialog = step >= 2 && step <= 11;
  const isChatting = step >= 14;
  const showOnboarding = step < 12;
  const showCursorOnAttach = step === 1;

  return (
    <div className='relative flex h-full w-full flex-col items-center justify-end overflow-hidden lg:justify-center'>
      {/* ── Heading — centered above input, exits on send ── */}
      <AnimatePresence initial={false} mode='popLayout'>
        {showOnboarding && (
          <motion.div
            key='onboarding'
            className='absolute bottom-[50%] mx-auto w-full max-w-[720px] px-6 sm:bottom-[55%] md:bottom-[58%] lg:relative lg:bottom-auto'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            layout='position'
            layoutId='onboarding'
            transition={{ layout: { duration: 0 } }}
          >
            {/* Top-right icons */}
            <div className='absolute top-0 right-6 flex items-center gap-2'>
              <div className='flex size-7 items-center justify-center text-muted-foreground'>
                <svg
                  role='presentation'
                  className='size-4'
                  viewBox='0 0 16 16'
                  fill='none'
                >
                  <path
                    d='M11.3 1.5l3.2 3.2-9 9H2.3v-3.2l9-9z'
                    stroke='currentColor'
                    strokeWidth='1.2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </div>
              <div className='flex size-7 items-center justify-center rounded-full bg-foreground'>
                <span className='font-medium text-background text-xs'>G</span>
              </div>
            </div>
            <h2 className='mb-2 text-center font-medium text-foreground text-lg tracking-tight sm:mb-3 sm:text-xl md:mb-4 md:text-2xl lg:text-3xl'>
              Ask about your data
            </h2>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Conversation — appears after send ── */}
      <AnimatePresence initial={false} mode='popLayout'>
        {isChatting && (
          <motion.div
            key='conversation'
            className='w-full max-w-[720px] flex-1 overflow-hidden px-3 sm:px-6'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div
              ref={scrollContainerRef}
              className='scrollbar-none h-full overflow-y-auto px-px [mask-image:linear-gradient(to_bottom,transparent,black_24px,black_100%)]'
            >
              <ChatConversation scrollContainerRef={scrollContainerRef} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Input — layout-animated from center to bottom ── */}
      <motion.div
        className='relative inset-x-0 bottom-0 z-10 mx-auto w-full max-w-[720px] px-3 sm:px-6'
        layout='position'
        layoutId='chat-input-container'
        transition={{
          layout: { duration: isChatting ? 0.35 : 0, ease: 'easeInOut' },
        }}
      >
        <UnifiedInput step={step} showCursorOnAttach={showCursorOnAttach} />

        {/* Action pills — only before typing starts */}
        <AnimatePresence initial={false} mode='popLayout'>
          {!isChatting && step < 12 && (
            <motion.div
              key='pills'
              className='hidden sm:block'
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <ActionPillsSection />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Dialog overlay ── */}
      {showDialog && <ConnectDatabaseDialog step={step} />}
    </div>
  );
}

// ─── Unified Input + Action Pills ───────────────────────────────────────────

const ACTION_PILLS = [
  { label: 'Explore', icon: ExploreIcon },
  { label: 'Analyze', icon: AnalyzeIcon },
  { label: 'Visualize', icon: VisualizeIcon },
  { label: 'Compare', icon: CompareIcon },
  { label: 'Trends', icon: TrendsIcon },
];

const ACTION_PILLS_ROW2 = [
  { label: 'Insights', icon: InsightsIcon },
  { label: 'Explain', icon: ExplainIcon },
];

function UnifiedInput({
  step,
  showCursorOnAttach,
}: {
  step: number;
  showCursorOnAttach?: boolean;
}) {
  const isTypingQ = step >= 12 && step < 14;
  const isSendReady = step >= 13;
  const isChatting = step >= 14;

  // Type question character by character
  const [typedQ, setTypedQ] = useState('');
  const qInterval = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => {
    if (!isTypingQ || isSendReady) return;
    let count = 0;
    qInterval.current = setInterval(() => {
      count++;
      if (count <= QUESTION_TEXT.length) {
        setTypedQ(QUESTION_TEXT.slice(0, count));
      } else {
        clearInterval(qInterval.current);
      }
    }, QUESTION_TYPE_SPEED);
    return () => clearInterval(qInterval.current);
  }, [isTypingQ, isSendReady]);

  const inputText = isSendReady ? QUESTION_TEXT : isTypingQ ? typedQ : '';
  const showPlaceholder = !isTypingQ && !isChatting;
  const hasText = inputText.length > 0;

  return (
    <div className='shrink-0 py-0.5 sm:py-2'>
      <div
        className={`flex flex-col rounded-xl border bg-card transition-all duration-200 sm:rounded-3xl ${
          isTypingQ
            ? 'border-[#266DF0] shadow-[0px_4px_16px_rgba(38,109,240,0.08)]'
            : 'border-border shadow-[0px_4px_16px_rgba(0,0,0,0.04)]'
        }`}
      >
        {/* Input area */}
        <div className='px-2 pt-1 pb-0 sm:px-4 sm:pt-3 sm:pb-2'>
          {showPlaceholder || isChatting ? (
            <span className='font-medium text-[10px] text-muted-foreground leading-3 sm:text-sm sm:leading-5'>
              {isChatting ? 'Ask your data anything...' : 'Ask Folio'}
            </span>
          ) : (
            <span className='font-medium text-[10px] text-foreground leading-3 sm:text-sm sm:leading-5'>
              {inputText}
              {isTypingQ && !isSendReady && (
                <span className='ml-px inline-block h-[10px] w-[1px] animate-pulse bg-[#266DF0] align-middle sm:h-[14px] sm:w-[1.5px]' />
              )}
            </span>
          )}
        </div>
        {/* Bottom bar */}
        <div className='relative flex items-center justify-between px-1.5 pb-1.5 sm:px-3 sm:pb-3'>
          {/* Attach DB pill */}
          <div
            className={`flex items-center gap-1 rounded-full border py-0.5 pr-1.5 pl-1.5 transition-all duration-200 sm:gap-1.5 sm:py-1 sm:pr-2.5 sm:pl-2 ${
              showCursorOnAttach
                ? 'border-[#266DF0] bg-[#266DF0]/5'
                : 'border-border'
            }`}
          >
            <span className='scale-75 sm:scale-100'>
              <DatabaseLinkIcon />
            </span>
            <span className='font-medium text-[10px] text-foreground leading-3 sm:text-xs sm:leading-4'>
              Attach DB
            </span>
            <svg
              role='presentation'
              className='size-2.5 text-muted-foreground sm:size-3'
              viewBox='0 0 12 12'
              fill='none'
            >
              <path
                d='M3 4.5l3 3 3-3'
                stroke='currentColor'
                strokeWidth='1.2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
            {/* Animated cursor on Attach DB */}
            {showCursorOnAttach && (
              <div className='pointer-events-none absolute bottom-[6px] left-[90px] z-50'>
                <svg
                  role='presentation'
                  className='-scale-x-100 h-5 w-5 drop-shadow-md'
                  viewBox='0 0 16 16'
                  fill='currentColor'
                  stroke='currentColor'
                  strokeWidth='0.5'
                >
                  <path
                    d='M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z'
                    className='fill-[#266DF0] stroke-[#1E5FD9]'
                  />
                </svg>
              </div>
            )}
          </div>
          {/* Send button */}
          <div
            className={`flex size-5 items-center justify-center rounded-full transition-all duration-200 sm:size-8 ${
              hasText || isSendReady
                ? 'bg-[#266DF0] shadow-[0px_2px_4px_rgba(15,107,233,0.3)]'
                : 'bg-muted'
            }`}
          >
            <svg
              role='presentation'
              className='size-3 text-white sm:size-4'
              viewBox='0 0 14 14'
              fill='none'
            >
              <path
                d='M7 11V3M7 3l3.5 3.5M7 3L3.5 6.5'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionPillsSection() {
  return (
    <div className='flex flex-col items-center gap-2 pt-2 pb-4'>
      <div className='flex flex-wrap items-center justify-center gap-2'>
        {ACTION_PILLS.map((pill) => (
          <ActionPill
            key={pill.label}
            label={pill.label}
            icon={<pill.icon />}
          />
        ))}
      </div>
      <div className='flex flex-wrap items-center justify-center gap-2'>
        {ACTION_PILLS_ROW2.map((pill) => (
          <ActionPill
            key={pill.label}
            label={pill.label}
            icon={<pill.icon />}
          />
        ))}
      </div>
    </div>
  );
}

function ActionPill({
  label,
  icon,
}: {
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <div className='flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5'>
      <span className='text-muted-foreground'>{icon}</span>
      <span className='font-medium text-foreground text-sm leading-5'>
        {label}
      </span>
    </div>
  );
}

// ─── Action Pill Icons ──────────────────────────────────────────────────────

function ExploreIcon() {
  return (
    <svg role='presentation' className='size-4' viewBox='0 0 16 16' fill='none'>
      <ellipse
        cx='8'
        cy='5'
        rx='5'
        ry='2'
        stroke='currentColor'
        strokeWidth='1.1'
      />
      <path
        d='M3 5v3c0 1.1 2.24 2 5 2s5-.9 5-2V5'
        stroke='currentColor'
        strokeWidth='1.1'
      />
      <path
        d='M3 8v3c0 1.1 2.24 2 5 2s5-.9 5-2V8'
        stroke='currentColor'
        strokeWidth='1.1'
      />
    </svg>
  );
}

function AnalyzeIcon() {
  return (
    <svg role='presentation' className='size-4' viewBox='0 0 16 16' fill='none'>
      <rect
        x='2'
        y='2'
        width='12'
        height='12'
        rx='2'
        stroke='currentColor'
        strokeWidth='1.1'
      />
      <path d='M2 6h12M6 6v8M10 6v8' stroke='currentColor' strokeWidth='1.1' />
    </svg>
  );
}

function VisualizeIcon() {
  return (
    <svg role='presentation' className='size-4' viewBox='0 0 16 16' fill='none'>
      <rect
        x='2'
        y='8'
        width='2.5'
        height='5'
        rx='0.5'
        stroke='currentColor'
        strokeWidth='1'
      />
      <rect
        x='6.75'
        y='5'
        width='2.5'
        height='8'
        rx='0.5'
        stroke='currentColor'
        strokeWidth='1'
      />
      <rect
        x='11.5'
        y='3'
        width='2.5'
        height='10'
        rx='0.5'
        stroke='currentColor'
        strokeWidth='1'
      />
    </svg>
  );
}

function CompareIcon() {
  return (
    <svg role='presentation' className='size-4' viewBox='0 0 16 16' fill='none'>
      <path
        d='M2 12l4-5 3 3 5-7'
        stroke='currentColor'
        strokeWidth='1.2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

function TrendsIcon() {
  return (
    <svg role='presentation' className='size-4' viewBox='0 0 16 16' fill='none'>
      <path
        d='M2 11l3-3 3 2 6-6'
        stroke='currentColor'
        strokeWidth='1.2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M10 4h4v4'
        stroke='currentColor'
        strokeWidth='1.2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

function InsightsIcon() {
  return (
    <svg role='presentation' className='size-4' viewBox='0 0 16 16' fill='none'>
      <circle cx='7' cy='7' r='4' stroke='currentColor' strokeWidth='1.2' />
      <path
        d='M10 10l3.5 3.5'
        stroke='currentColor'
        strokeWidth='1.2'
        strokeLinecap='round'
      />
    </svg>
  );
}

function ExplainIcon() {
  return (
    <svg role='presentation' className='size-4' viewBox='0 0 16 16' fill='none'>
      <path
        d='M8 2a4 4 0 0 1 4 4c0 1.5-.8 2.4-1.5 3-.5.4-.5.6-.5 1v.5H6V10c0-.4 0-.6-.5-1C4.8 8.4 4 7.5 4 6a4 4 0 0 1 4-4z'
        stroke='currentColor'
        strokeWidth='1.1'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M6 13h4M7 14.5h2'
        stroke='currentColor'
        strokeWidth='1.1'
        strokeLinecap='round'
      />
    </svg>
  );
}

function ChatConversation({
  scrollContainerRef,
}: {
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [displayedText, setDisplayedText] = useState('');
  const [showCard, setShowCard] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [visibleInsights, setVisibleInsights] = useState(0);
  const charIndex = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (charIndex.current < FULL_TEXT.length) {
        charIndex.current += 1;
        setDisplayedText(FULL_TEXT.slice(0, charIndex.current));
      } else {
        clearInterval(interval);
        setTimeout(() => setShowCard(true), 300);
        setTimeout(() => setShowInsights(true), 800);
      }
    }, TYPING_SPEED);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!showInsights) return;
    if (visibleInsights >= KEY_INSIGHTS.length) return;

    const timer = setTimeout(() => {
      setVisibleInsights((prev) => prev + 1);
    }, 200);

    return () => clearTimeout(timer);
  }, [showInsights, visibleInsights]);

  // Auto-scroll within the container only (not the page)
  // biome-ignore lint/correctness/useExhaustiveDependencies: state values used as intentional scroll triggers
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [displayedText, showCard, showInsights, visibleInsights]);

  return (
    <div className='flex flex-col gap-4'>
      {/* User message */}
      <div className='mt-3 flex justify-end sm:mt-6'>
        <div className='flex rounded-lg bg-muted px-2 py-0.5 sm:py-1'>
          <span className='font-medium text-[11px] text-muted-foreground leading-4 tracking-[-0.22px] sm:text-sm sm:leading-5 sm:tracking-[-0.28px]'>
            Analyze AAPL performance from my portfolio database
          </span>
        </div>
      </div>

      {/* AI response */}
      <div className='flex max-w-[85%] flex-col gap-3'>
        {/* Typed text */}
        <div className='flex flex-col gap-3'>
          <FormattedText text={displayedText} />
        </div>

        {/* Sankey data card */}
        {showCard && <SankeyDataCard />}

        {/* Key insights */}
        {showInsights && (
          <div className='flex flex-col gap-1'>
            <span className='font-semibold text-[11px] text-foreground leading-4 sm:text-sm sm:leading-5'>
              Key insights:
            </span>
            <ol className='flex flex-col'>
              {KEY_INSIGHTS.slice(0, visibleInsights).map((insight, index) => (
                <li key={insight.title} className='flex flex-col'>
                  <span className='text-[11px] leading-4 sm:text-sm sm:leading-5'>
                    <span className='font-medium text-foreground'>
                      {index + 1}.{' '}
                    </span>
                    <span className='font-semibold text-foreground'>
                      {insight.title} -{' '}
                    </span>
                    <span className='font-medium text-foreground'>
                      {insight.description}
                    </span>
                    {index === KEY_INSIGHTS.length - 1 && (
                      <span className='ml-px inline-block h-[0.9em] w-[2px] bg-[#266DF0] align-middle' />
                    )}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}

function FormattedText({ text }: { text: string }) {
  const parts = text.split(/(\*\*.*?\*\*)/g);

  return (
    <>
      {parts.map((part) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <span
              key={part}
              className='font-semibold text-[11px] text-foreground leading-4 sm:text-sm sm:leading-5'
            >
              {part.slice(2, -2)}
            </span>
          );
        }
        if (part.trim()) {
          return (
            <span
              key={part}
              className='font-medium text-[11px] text-foreground leading-4 sm:text-sm sm:leading-5'
            >
              {part}
            </span>
          );
        }
        return null;
      })}
    </>
  );
}

function RecentQueries() {
  return (
    <div className='mt-4 flex w-full flex-col'>
      {/* Header */}
      <div className='mb-3 flex items-center justify-between'>
        <span className='ml-2 font-medium text-muted-foreground text-sm leading-5 tracking-[-0.14px]'>
          Recent Queries
        </span>
        <div className='flex items-center gap-1'>
          <span className='font-medium text-muted-foreground text-xs leading-4'>
            PostgreSQL
          </span>
          <div className='flex size-5 items-center justify-center rounded-md'>
            <div className='size-1.5 rounded-full bg-[#0FC27B]' />
          </div>
        </div>
      </div>

      {/* Query items */}
      <QueryItem
        name='TSLA quarterly earnings trend'
        time='3 min ago'
        status='completed'
      />
      <QueryItem
        name='Portfolio sector allocation'
        time='12 min ago'
        status='completed'
      />
      <ActiveQueryItem />
    </div>
  );
}

function QueryItem({
  name,
  time,
  status,
}: {
  name: string;
  time: string;
  status: string;
}) {
  return (
    <div className='rounded-[10px] p-[2px]'>
      <div className='flex items-center justify-between gap-3 rounded-[10px] py-1.5 pr-2.5 pl-1.5'>
        <div className='flex items-center gap-1.5'>
          <div className='flex size-5 min-w-5 shrink-0 items-center justify-center rounded-md'>
            <svg
              role='presentation'
              className='size-3.5 text-muted-foreground'
              viewBox='0 0 14 14'
              fill='none'
            >
              <path
                d='M4.5 5.25h5M4.5 7.75h3'
                stroke='currentColor'
                strokeWidth='1.1'
                strokeLinecap='round'
              />
              <rect
                x='1.5'
                y='1.5'
                width='11'
                height='11'
                rx='3'
                stroke='currentColor'
                strokeWidth='1.1'
              />
            </svg>
          </div>
          <span className='font-medium text-foreground text-sm leading-5 tracking-[-0.14px] opacity-40'>
            {name}
          </span>
        </div>
        <span className='font-medium text-muted-foreground text-xs leading-4'>
          {time}
        </span>
      </div>
    </div>
  );
}

function ActiveQueryItem() {
  return (
    <div className='rounded-[14px] bg-card p-[2px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.06),0px_1px_3px_0px_rgba(0,0,0,0.10)]'>
      <div className='flex items-center justify-between gap-3 rounded-[10px] py-1.5 pr-2.5 pl-1.5'>
        <div className='flex items-center gap-1.5'>
          <div className='flex size-5 min-w-5 shrink-0 items-center justify-center rounded-md'>
            <svg
              role='presentation'
              className='size-3.5 text-[#266DF0]'
              viewBox='0 0 14 14'
              fill='none'
            >
              <path
                d='M4.5 5.25h5M4.5 7.75h3'
                stroke='currentColor'
                strokeWidth='1.1'
                strokeLinecap='round'
              />
              <rect
                x='1.5'
                y='1.5'
                width='11'
                height='11'
                rx='3'
                stroke='currentColor'
                strokeWidth='1.1'
              />
            </svg>
          </div>
          <span className='font-medium text-foreground text-sm leading-5 tracking-[-0.14px]'>
            AAPL performance analysis
          </span>
        </div>
        <span className='inline-flex items-center gap-1 rounded-md bg-[#DDF9E4] px-1.5 py-0.5 font-medium text-[#075A39] text-xs ring-1 ring-[#C7F4D3] dark:bg-emerald-400/15 dark:text-emerald-300 dark:ring-emerald-400/30'>
          Live
        </span>
      </div>

      {/* Query details */}
      <div className='px-2.5 pb-2'>
        <div className='flex flex-col gap-1.5'>
          <div className='rounded-lg bg-muted px-2.5 py-2 font-mono text-[11px] text-foreground leading-4'>
            <span className='text-[#266DF0]'>SELECT</span> ticker, close_price,
            volume, pct_change
            <br />
            <span className='text-[#266DF0]'>FROM</span> stock_holdings
            <br />
            <span className='text-[#266DF0]'>WHERE</span> ticker ={' '}
            <span className='text-[#0FC27B]'>{"'AAPL'"}</span>
            <br />
            <span className='text-[#266DF0]'>ORDER BY</span> date{' '}
            <span className='text-[#266DF0]'>DESC</span>
            <br />
            <span className='text-[#266DF0]'>LIMIT</span> 30;
          </div>
          <div className='flex items-center gap-2'>
            <span className='font-medium text-muted-foreground text-xs leading-4'>
              Rows returned
            </span>
            <span className='rounded-[5px] border border-border bg-muted px-[3px] font-medium text-[11px] text-muted-foreground leading-4'>
              30
            </span>
            <span className='font-medium text-muted-foreground text-xs leading-4'>
              Execution
            </span>
            <span className='rounded-[5px] border border-border bg-muted px-[3px] font-medium text-[11px] text-muted-foreground leading-4'>
              24ms
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Icons ──────────────────────────────────────────────────────────────────

function DatabaseLinkIcon() {
  return (
    <svg
      role='presentation'
      width='16'
      height='16'
      viewBox='0 0 16 16'
      fill='none'
    >
      <ellipse
        cx='8'
        cy='4'
        rx='5'
        ry='2'
        stroke='currentColor'
        strokeWidth='1.2'
      />
      <path
        d='M3 4v3c0 1.1 2.24 2 5 2s5-.9 5-2V4'
        stroke='currentColor'
        strokeWidth='1.2'
      />
      <path
        d='M3 7v3c0 1.1 2.24 2 5 2s5-.9 5-2V7'
        stroke='currentColor'
        strokeWidth='1.2'
      />
    </svg>
  );
}

// ─── Connect Database Dialog ────────────────────────────────────────────────

const DB_TYPES = ['PostgreSQL', 'MySQL', 'DynamoDB', 'CSV / Excel'];

function ConnectDatabaseDialog({ step }: { step: number }) {
  // Dialog steps: 2=PostgreSQL, 3=DB Name, 4-8=fields, 9=Test, 10-11=Connect
  const cursorIdx = Math.min(step - 2, DIALOG_CURSOR_POS.length - 1);
  const pos = DIALOG_CURSOR_POS[cursorIdx] ?? { x: 200, y: 150 };

  // Typing animation state — types characters one by one per field
  const [typed, setTyped] = useState<string[]>(FIELD_TARGETS.map(() => ''));
  const activeField = step >= 3 && step <= 8 ? step - 3 : -1;
  const typingInterval = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => {
    if (activeField < 0) return;
    const target = FIELD_TARGETS[activeField] ?? '';
    let count = 0;

    typingInterval.current = setInterval(() => {
      count++;
      if (count <= target.length) {
        setTyped((prev) => {
          const next = [...prev];
          next[activeField] = target.slice(0, count);
          return next;
        });
      } else {
        clearInterval(typingInterval.current);
      }
    }, TYPE_SPEED);

    return () => clearInterval(typingInterval.current);
  }, [activeField]);

  // For fields the cursor has already passed, show full value
  const fieldVal = (idx: number) => {
    if (step >= idx + 4) return FIELD_TARGETS[idx]; // fully filled
    if (activeField === idx) return typed[idx]; // currently typing
    return ''; // not yet reached
  };

  const pgSelected = step >= 3;
  const isTesting = step === 9;
  const isConnected = step >= 10;
  const isTypingField = activeField >= 0;

  return (
    <div className='absolute inset-0 z-20 flex items-center justify-center bg-black/15 backdrop-blur-[1px] dark:bg-black/50'>
      <div className='relative mx-2 w-full max-w-[460px] origin-center scale-[0.55] overflow-visible rounded-xl border border-border bg-card shadow-[0px_8px_30px_rgba(0,0,0,0.12)] sm:scale-[0.72] md:scale-[0.88] lg:scale-100 dark:shadow-[0px_8px_30px_rgba(0,0,0,0.6)]'>
        {/* Animated cursor */}
        <div
          className='pointer-events-none absolute z-50 transition-all duration-300 ease-out'
          style={{ left: pos.x, top: pos.y }}
        >
          <svg
            role='presentation'
            className='-translate-x-[2px] -translate-y-[2px] -scale-x-100 h-5 w-5 drop-shadow-md'
            viewBox='0 0 16 16'
            fill='currentColor'
            stroke='currentColor'
            strokeWidth='0.5'
          >
            <path
              d='M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z'
              className='fill-[#266DF0] stroke-[#1E5FD9]'
            />
          </svg>
        </div>

        {/* Header */}
        <div className='flex items-center justify-between border-border border-b px-4 py-2.5'>
          <div className='flex items-center gap-2'>
            <div className='flex size-6 items-center justify-center rounded-md bg-[#266DF0]/10 text-[#266DF0]'>
              <DatabaseLinkIcon />
            </div>
            <span className='font-semibold text-[13px] text-foreground leading-5'>
              Connect Database
            </span>
          </div>
          <div className='flex size-5 items-center justify-center rounded text-muted-foreground'>
            <svg
              role='presentation'
              className='size-3'
              viewBox='0 0 14 14'
              fill='none'
            >
              <path
                d='M3.5 3.5l7 7M10.5 3.5l-7 7'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
              />
            </svg>
          </div>
        </div>

        {/* Form */}
        <div className='flex flex-col gap-2.5 px-4 py-3'>
          <DialogField label='Database Type'>
            <div className='flex flex-wrap gap-1.5'>
              {DB_TYPES.map((type) => (
                <span
                  key={type}
                  className={`rounded border px-2.5 py-0.5 font-medium text-[11px] leading-4 transition-all duration-200 ${
                    type === 'PostgreSQL' && pgSelected
                      ? 'border-[#266DF0] bg-[#266DF0]/5 text-[#266DF0]'
                      : 'border-border text-muted-foreground'
                  }`}
                >
                  {type}
                </span>
              ))}
            </div>
          </DialogField>

          <DialogField label='Database Name'>
            <DialogInput
              placeholder='e.g. production_analytics'
              value={fieldVal(0)}
              typing={activeField === 0}
            />
          </DialogField>

          <div className='grid grid-cols-[1fr_80px] gap-2'>
            <DialogField label='Host'>
              <DialogInput
                placeholder='localhost or IP'
                value={fieldVal(1)}
                typing={activeField === 1}
              />
            </DialogField>
            <DialogField label='Port'>
              <DialogInput
                placeholder='5432'
                value={fieldVal(2)}
                typing={activeField === 2}
              />
            </DialogField>
          </div>

          <div className='grid grid-cols-2 gap-2'>
            <DialogField label='Username'>
              <DialogInput
                placeholder='db_user'
                value={fieldVal(3)}
                typing={activeField === 3}
              />
            </DialogField>
            <DialogField label='Password'>
              <DialogInput
                placeholder='••••••••'
                value={fieldVal(4)}
                typing={activeField === 4}
              />
            </DialogField>
          </div>

          <DialogField label='Schema / DB Name'>
            <DialogInput
              placeholder='public'
              value={fieldVal(5)}
              typing={activeField === 5}
            />
          </DialogField>
        </div>

        {/* Footer */}
        <div className='flex items-center justify-between border-border border-t px-4 py-2.5'>
          <div className='flex items-center gap-1.5'>
            {isConnected && (
              <>
                <div className='size-1.5 rounded-full bg-[#0FC27B]' />
                <span className='font-medium text-[#0FC27B] text-[11px]'>
                  Connected
                </span>
              </>
            )}
          </div>
          <div className='flex items-center gap-2'>
            <span
              className={`rounded border px-2.5 py-1 font-medium text-[11px] leading-4 shadow-sm transition-all duration-200 ${
                isTesting
                  ? 'border-[#266DF0] bg-[#266DF0] text-white'
                  : 'border-[#266DF0] bg-card text-[#266DF0]'
              }`}
            >
              {isTesting ? 'Testing...' : 'Test Connection'}
            </span>
            <span
              className={`rounded px-3.5 py-1 font-medium text-[11px] leading-4 transition-all duration-200 ${
                isConnected
                  ? 'bg-[#0FC27B] text-white shadow-[0px_1px_2px_rgba(0,0,0,0.15)]'
                  : 'bg-[#266DF0] text-white shadow-[0px_1px_2px_rgba(15,107,233,0.3)]'
              }`}
            >
              {isConnected ? 'Connected!' : 'Connect'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DialogField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className='flex flex-col gap-0.5'>
      <span className='font-medium text-[11px] text-foreground leading-4'>
        {label}
      </span>
      {children}
    </div>
  );
}

function DialogInput({
  placeholder,
  value,
  typing,
}: {
  placeholder: string;
  value?: string;
  typing?: boolean;
}) {
  const hasValue = value && value.length > 0;
  return (
    <div
      className={`flex h-7 items-center rounded border px-2 ${
        typing
          ? 'border-[#266DF0] bg-card ring-2 ring-[#266DF0]/10'
          : hasValue
            ? 'border-border bg-card'
            : 'border-border bg-muted'
      }`}
    >
      <span
        className={`text-[11px] ${hasValue ? 'text-foreground' : 'text-muted-foreground'}`}
      >
        {hasValue ? value : placeholder}
      </span>
      {typing && (
        <span className='ml-px inline-block h-3 w-[1.5px] animate-pulse bg-[#266DF0]' />
      )}
    </div>
  );
}
