'use client';

import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';

// ─── Data ────────────────────────────────────────────────────────────────────

const BOT_CAPABILITIES = [
  { color: '#266DF0', text: 'Generate interactive charts' },
  { color: '#EF4444', text: 'Create formatted data tables' },
  { color: '#DC2626', text: 'Execute Python code for analysis' },
  { color: '#0FC27B', text: 'Search the web for context' },
];

const SUGGESTION_PILLS = [
  'What tables are in the database and how...',
  'Show the top 10 most rented films with t...',
  'Which customers have spent the most mone...',
  'Plot monthly revenue over time',
];

const THREAD_TEXT =
  'Here are the Top 5 Highest Earning Movies (Music category excluded)';

const INSIGHTS_COUNT = 5;
const PATTERNS_COUNT = 3;

const TABLE_LINES = [
  'Title | Category | Rental Count | Total Revenue',
  '------------------------------------------------',
  'WIFE TURN | Documentary | 31 | 223.69',
  'ZORRO ARK | Comedy | 31 | 214.69',
  'GOODFELLAS SALUTE | Sci-Fi | 31 | 209.69',
];

// ─── Nifty 50 Chart Data ────────────────────────────────────────────────────

const NIFTY_HIGH_LOW = [
  { symbol: 'ITC', high: 528, low: 390, current: 430 },
  { symbol: 'NTPC', high: 450, low: 280, current: 350 },
  { symbol: 'BPCL', high: 370, low: 170, current: 295 },
  { symbol: 'WIPRO', high: 563, low: 380, current: 455 },
  { symbol: 'TATAMTRS', high: 1100, low: 615, current: 850 },
  { symbol: 'ADANIENT', high: 3750, low: 2025, current: 2300 },
  { symbol: 'ICICIBNK', high: 1360, low: 900, current: 1210 },
  { symbol: 'INFY', high: 1960, low: 1320, current: 1495 },
  { symbol: 'HDFCBNK', high: 1880, low: 1365, current: 1650 },
  { symbol: 'BHARTI', high: 1905, low: 1055, current: 1750 },
  { symbol: 'RELIANCE', high: 3217, low: 2220, current: 2900 },
  { symbol: 'TCS', high: 4540, low: 3310, current: 3560 },
];

const NIFTY_DISTANCE = [
  { symbol: 'COALINDIA', pct: 32 },
  { symbol: 'SUNPHARMA', pct: 28 },
  { symbol: 'APOLLOHOSP', pct: 26 },
  { symbol: 'TATASTEEL', pct: 24 },
  { symbol: 'HINDALCO', pct: 22 },
  { symbol: 'JSWSTEEL', pct: 21 },
  { symbol: 'ADANIPORTS', pct: 19 },
  { symbol: 'BAJAJ-AUTO', pct: 17 },
  { symbol: 'TATACONSUM', pct: 15 },
  { symbol: 'RELIANCE', pct: 13 },
  { symbol: 'DIVISLAB', pct: 12 },
  { symbol: 'BHARTIARTL', pct: 10 },
  { symbol: 'ICICIBANK', pct: 9 },
  { symbol: 'EICHERMOTR', pct: 8 },
  { symbol: 'INDUSINDBK', pct: 7 },
  { symbol: 'HEROMOTOCO', pct: 6 },
  { symbol: 'KOTAKBANK', pct: 5 },
  { symbol: 'HINDUNILVR', pct: 4 },
  { symbol: 'LT', pct: 3 },
  { symbol: 'HDFCBANK', pct: 2 },
  { symbol: 'WIPRO', pct: 2 },
  { symbol: 'INFY', pct: 1 },
  { symbol: 'ADANIENT', pct: 1 },
  { symbol: 'ITC', pct: 0 },
];

const NIFTY_MAX_PRICE = 4540;

const TYPING_SPEED = 18;

// ─── Main Component ─────────────────────────────────────────────────────────

export function WorkflowsContent() {
  const threadScrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className='flex h-full w-full overflow-hidden'>
      {/* Channel panel — hidden below lg, side-by-side on lg+ */}
      <div className='hidden min-w-0 flex-col lg:flex lg:flex-1'>
        <ChannelTopBar />
        <ChannelTabBar />
        <div className='scrollbar-none flex-1 overflow-y-auto'>
          <ChannelMessages />
        </div>
        <MessageInputArea />
      </div>

      {/* Thread panel — full width below lg, fixed 44% on lg+ */}
      <div className='flex w-full min-w-0 flex-col lg:w-[44%] lg:border-border lg:border-l'>
        <ThreadHeader />
        <div
          ref={threadScrollRef}
          className='scrollbar-none flex-1 overflow-y-auto overflow-x-hidden'
        >
          <ThreadContent scrollContainerRef={threadScrollRef} />
        </div>
      </div>
    </div>
  );
}

// ─── Channel Top Bar ────────────────────────────────────────────────────────

function ChannelTopBar() {
  return (
    <div className='flex items-center justify-between border-border border-b px-2 pt-1 pb-1 sm:px-3 sm:pt-2 sm:pb-1.5'>
      <div className='flex items-center gap-1 sm:gap-1.5'>
        <TopBarBtn>
          <StarIcon />
        </TopBarBtn>
        <LockIcon />
        <span className='font-bold text-foreground text-xs leading-4 sm:text-sm sm:leading-5'>
          data-insights
        </span>
      </div>
      <div className='hidden items-center gap-1.5 sm:flex'>
        {/* People pill */}
        <div className='flex items-center gap-1 rounded-lg border border-border px-2 py-1'>
          <PeopleIcon />
          <span className='text-muted-foreground text-xs leading-none'>3</span>
        </div>
        {/* Headphones pill */}
        <div className='flex items-center gap-0.5 rounded-lg border border-border px-2 py-1'>
          <HeadphonesIcon />
          <ChevronDownSmIcon />
        </div>
        {/* Individual icons */}
        <TopBarBtn>
          <BellIcon />
        </TopBarBtn>
        <TopBarBtn>
          <SearchIcon />
        </TopBarBtn>
        <TopBarBtn>
          <VerticalDotsIcon />
        </TopBarBtn>
      </div>
    </div>
  );
}

function TopBarBtn({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex size-7 items-center justify-center rounded text-muted-foreground'>
      {children}
    </div>
  );
}

// ─── Channel Tab Bar ────────────────────────────────────────────────────────

function ChannelTabBar() {
  return (
    <div className='flex items-center border-border border-b px-2'>
      <TabItem active>
        <span className='size-[7px] rounded-full bg-[#0FC27B]' />
        Messages
      </TabItem>
      <div className='hidden sm:contents'>
        <TabItem>
          <PlusSmIcon />
          Add canvas
        </TabItem>
        <TabItem>
          <FileTabIcon />
          Files
        </TabItem>
        <div className='ml-0.5 flex size-6 items-center justify-center rounded text-muted-foreground'>
          <PlusSmIcon />
        </div>
      </div>
    </div>
  );
}

function TabItem({
  children,
  active,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <button
      type='button'
      className={cn(
        'flex items-center gap-1 border-b-2 px-2 py-1 font-medium text-[10px] sm:gap-1.5 sm:px-2.5 sm:py-1.5 sm:text-xs',
        active
          ? 'border-foreground text-foreground'
          : 'border-transparent text-muted-foreground',
      )}
    >
      {children}
    </button>
  );
}

// ─── Channel Messages ───────────────────────────────────────────────────────

function ChannelMessages() {
  const [visibleMessages, setVisibleMessages] = useState(0);

  useEffect(() => {
    if (visibleMessages >= 5) return;
    const timer = setTimeout(
      () => setVisibleMessages((p) => p + 1),
      visibleMessages === 0 ? 150 : 400,
    );
    return () => clearTimeout(timer);
  }, [visibleMessages]);

  return (
    <div className='flex flex-col px-4 py-2'>
      {visibleMessages >= 1 && <BotIntroMessage />}
      {visibleMessages >= 2 && <DateDivider />}
      {visibleMessages >= 2 && <SuggestionSection />}
      {visibleMessages >= 2 && <MessageActionsBar />}
      {visibleMessages >= 3 && <BotQueryMessage />}
      {visibleMessages >= 4 && <UserHelloMessage />}
      {visibleMessages >= 5 && <UserQueryMessage />}
    </div>
  );
}

function BotIntroMessage() {
  return (
    <div className='flex gap-2 py-1.5'>
      <BotAvatar />
      <div className='flex min-w-0 flex-1 flex-col gap-0.5'>
        <MessageMeta name='ChatPlotDB' isBot time='2:15 AM' />
        <div className='flex flex-col gap-1.5 text-[11px] text-foreground leading-4 sm:text-sm sm:leading-5'>
          {/* Capabilities with colored dots */}
          <div className='flex flex-col'>
            {BOT_CAPABILITIES.map((cap) => (
              <div key={cap.text} className='flex items-center gap-2'>
                <span>&middot;</span>
                <span
                  className='size-2 shrink-0 rounded-full'
                  style={{ backgroundColor: cap.color }}
                />
                <span>{cap.text}</span>
              </div>
            ))}
          </div>

          {/* Database section */}
          <div className='flex flex-col'>
            <span className='font-semibold'>Database:</span>
            <span>
              &middot; Switch database:{' '}
              <code className='rounded bg-muted px-1 py-px font-mono text-[#266DF0] text-xs'>
                /cpdb-setdb &lt;config_key&gt;
              </code>
            </span>
            <span>
              &middot; Show current database:{' '}
              <code className='rounded bg-muted px-1 py-px font-mono text-[#266DF0] text-xs'>
                /cpdb-setdb
              </code>
            </span>
          </div>

          {/* Dashboards section */}
          <div className='flex flex-col'>
            <span className='font-semibold'>Dashboards:</span>
            <span>
              &middot; View and manage dashboards:{' '}
              <code className='rounded bg-muted px-1 py-px font-mono text-[#266DF0] text-xs'>
                /cpdb-dashboard
              </code>
            </span>
            <span>
              &middot; Type{' '}
              <code className='rounded bg-muted px-1 py-px font-mono text-[#266DF0] text-xs'>
                /cpdb-dashboard help
              </code>{' '}
              for all commands
            </span>
          </div>

          {/* Feedback section */}
          <div className='flex flex-col'>
            <span className='font-semibold'>Feedback:</span>
            <span>
              React with{' '}
              <span className='inline-flex size-4 items-center justify-center rounded bg-muted text-[10px]'>
                +
              </span>{' '}
              or{' '}
              <span className='inline-flex size-4 items-center justify-center rounded bg-muted text-[10px]'>
                -
              </span>{' '}
              on any query result to help improve future responses.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DateDivider() {
  return (
    <div className='my-2 flex items-center gap-3'>
      <div className='h-px flex-1 bg-muted' />
      <button
        type='button'
        className='flex items-center gap-1 rounded-full border border-border bg-card px-3 py-0.5 font-medium text-foreground text-xs leading-4 shadow-sm'
      >
        Wednesday, April 8th
        <ChevronDownSmIcon />
      </button>
      <div className='h-px flex-1 bg-muted' />
    </div>
  );
}

function SuggestionSection() {
  return (
    <div className='mb-1 flex flex-col gap-1.5 pl-10'>
      <span className='font-medium text-muted-foreground text-xs leading-4'>
        Try these questions:
      </span>
      <div className='flex flex-wrap gap-1.5'>
        {SUGGESTION_PILLS.map((pill) => (
          <span
            key={pill}
            className='truncate rounded-full border border-border bg-card px-2.5 py-1 text-[#266DF0] text-xs leading-4'
          >
            {pill}
          </span>
        ))}
      </div>
    </div>
  );
}

function MessageActionsBar() {
  return (
    <div className='my-0.5 flex items-center justify-end gap-px'>
      {[
        EmojiIcon,
        AddReactionIcon,
        ShareIcon,
        BookmarkIcon,
        FilterIcon,
        HorizDotsIcon,
      ].map((Icon, i) => (
        <div
          key={`action-${Icon.name}-${i}`}
          className='flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted'
        >
          <Icon />
        </div>
      ))}
    </div>
  );
}

function BotQueryMessage() {
  return (
    <div className='flex gap-2 py-1.5'>
      <BotAvatar />
      <div className='flex min-w-0 flex-col gap-0.5'>
        <MessageMeta name='ChatPlotDB' isBot time='2:15 AM' />
        <span className='text-[11px] text-foreground leading-4 sm:text-sm sm:leading-5'>
          <span className='font-medium text-[#266DF0]'>@Prakash</span> asked:
          List five users who paid highest
        </span>
        <ThreadReplyIndicator count={3} time='Last reply 4 days ago' />
      </div>
    </div>
  );
}

function UserHelloMessage() {
  return (
    <div className='flex gap-2 py-1.5'>
      <UserAvatar />
      <div className='flex min-w-0 flex-col gap-0.5'>
        <MessageMeta name='Prakash' time='2:15 AM' />
        <span className='text-[11px] text-foreground leading-4 sm:text-sm sm:leading-5'>
          hello
        </span>
      </div>
    </div>
  );
}

function UserQueryMessage() {
  return (
    <div className='flex gap-2 py-1.5'>
      <UserAvatar />
      <div className='flex min-w-0 flex-col gap-0.5'>
        <MessageMeta name='Prakash' time='2:22 AM' />
        <span className='text-[11px] text-foreground leading-4 sm:text-sm sm:leading-5'>
          <span className='font-medium text-[#266DF0]'>@ChatPlotDB</span> tell
          me 5 most earning movies not music and all
        </span>
        <ThreadReplyIndicator count={5} time='Last reply 4 days ago' />
      </div>
    </div>
  );
}

function ThreadReplyIndicator({
  count,
  time,
}: {
  count: number;
  time: string;
}) {
  return (
    <button
      type='button'
      className='mt-0.5 flex w-fit items-center gap-1.5 rounded-md py-0.5 pr-2'
    >
      <img
        src='/avatar-images/avatar-01.jpg'
        alt=''
        className='size-4 shrink-0 rounded object-cover'
      />
      <span className='font-medium text-[#266DF0] text-xs leading-4'>
        {count} replies
      </span>
      <span className='text-muted-foreground text-xs leading-4'>{time}</span>
    </button>
  );
}

// ─── Message Input Area ─────────────────────────────────────────────────────

function MessageInputArea() {
  return (
    <div className='border-border border-t px-3 py-2'>
      <div className='flex flex-col rounded-lg border border-border bg-card'>
        {/* Formatting toolbar — hidden on mobile to save height */}
        <div className='hidden items-center gap-0.5 border-border border-b px-1.5 py-1 sm:flex'>
          <FmtBtn>
            <span className='font-bold text-[11px]'>B</span>
          </FmtBtn>
          <FmtBtn>
            <span className='text-[11px] italic'>I</span>
          </FmtBtn>
          <FmtBtn>
            <span className='text-[11px] underline'>U</span>
          </FmtBtn>
          <FmtBtn>
            <span className='text-[11px] line-through'>S</span>
          </FmtBtn>
          <FmtDivider />
          <FmtBtn>
            <LinkIcon />
          </FmtBtn>
          <FmtBtn>
            <OrderedListIcon />
          </FmtBtn>
          <FmtBtn>
            <UnorderedListIcon />
          </FmtBtn>
          <FmtDivider />
          <FmtBtn>
            <InlineCodeIcon />
          </FmtBtn>
          <FmtBtn>
            <CodeBlockIcon />
          </FmtBtn>
        </div>

        {/* Input field */}
        <div className='px-3 py-2'>
          <div className='flex items-center gap-1'>
            <span className='text-[11px] text-muted-foreground leading-4 sm:text-sm sm:leading-5'>
              Message
            </span>
            <LockIcon />
            <span className='text-[11px] text-muted-foreground leading-4 sm:text-sm sm:leading-5'>
              data-insights
            </span>
          </div>
        </div>

        {/* Bottom toolbar */}
        <div className='flex items-center justify-between px-1.5 py-1'>
          <div className='flex items-center gap-0.5'>
            <FmtBtn>
              <PlusCircleIcon />
            </FmtBtn>
            <FmtBtn>
              <span className='font-semibold text-[11px]'>Aa</span>
            </FmtBtn>
            <FmtBtn>
              <EmojiIcon />
            </FmtBtn>
            <FmtBtn>
              <AtIcon />
            </FmtBtn>
            <FmtBtn>
              <VideoIcon />
            </FmtBtn>
            <FmtBtn>
              <MicIcon />
            </FmtBtn>
            <FmtBtn>
              <AttachIcon />
            </FmtBtn>
            <FmtBtn>
              <ShortcutsIcon />
            </FmtBtn>
          </div>
          <div className='flex items-center gap-px'>
            <div className='flex size-6 items-center justify-center rounded-md bg-[#266DF0]'>
              <SendIcon />
            </div>
            <div className='flex size-5 items-center justify-center rounded text-muted-foreground'>
              <ChevronDownSmIcon />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FmtBtn({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-muted'>
      {children}
    </div>
  );
}

function FmtDivider() {
  return <div className='mx-0.5 h-3.5 w-px bg-muted' />;
}

// ─── Thread Panel ───────────────────────────────────────────────────────────

function ThreadHeader() {
  return (
    <div className='flex items-start justify-between border-border border-b px-4 pt-2 pb-2'>
      <span className='font-semibold text-[11px] text-foreground leading-4 tracking-[-0.14px] sm:text-sm sm:leading-5'>
        Thread
      </span>
      <div className='flex items-center gap-0.5'>
        <div className='flex size-6 items-center justify-center rounded-md text-muted-foreground hover:bg-muted'>
          <FilterIcon />
        </div>
        <div className='flex size-6 items-center justify-center rounded-md text-muted-foreground hover:bg-muted'>
          <VerticalDotsIcon />
        </div>
        <div className='flex size-6 items-center justify-center rounded-md text-muted-foreground hover:bg-muted'>
          <CloseIcon />
        </div>
      </div>
    </div>
  );
}

function ThreadContent({
  scrollContainerRef,
}: {
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [displayedText, setDisplayedText] = useState('');
  const [showInsights, setShowInsights] = useState(false);
  const [visibleInsights, setVisibleInsights] = useState(0);
  const [showPatterns, setShowPatterns] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showChart1, setShowChart1] = useState(false);
  const [showChart2, setShowChart2] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const charIndex = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (charIndex.current < THREAD_TEXT.length) {
        charIndex.current += 1;
        setDisplayedText(THREAD_TEXT.slice(0, charIndex.current));
      } else {
        clearInterval(interval);
        setTimeout(() => setShowInsights(true), 300);
      }
    }, TYPING_SPEED);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!showInsights || visibleInsights >= INSIGHTS_COUNT) return;
    const timer = setTimeout(() => setVisibleInsights((p) => p + 1), 200);
    return () => clearTimeout(timer);
  }, [showInsights, visibleInsights]);

  useEffect(() => {
    if (visibleInsights < INSIGHTS_COUNT) return;
    const timer = setTimeout(() => setShowPatterns(true), 400);
    return () => clearTimeout(timer);
  }, [visibleInsights]);

  useEffect(() => {
    if (!showPatterns) return;
    const timer = setTimeout(() => setShowTable(true), 500);
    return () => clearTimeout(timer);
  }, [showPatterns]);

  useEffect(() => {
    if (!showTable) return;
    const timer = setTimeout(() => setShowActions(true), 400);
    return () => clearTimeout(timer);
  }, [showTable]);

  useEffect(() => {
    if (!showActions) return;
    const timer = setTimeout(() => setShowChart1(true), 600);
    return () => clearTimeout(timer);
  }, [showActions]);

  useEffect(() => {
    if (!showChart1) return;
    const timer = setTimeout(() => setShowChart2(true), 800);
    return () => clearTimeout(timer);
  }, [showChart1]);

  useEffect(() => {
    if (!showChart2) return;
    const timer = setTimeout(() => setShowSaved(true), 600);
    return () => clearTimeout(timer);
  }, [showChart2]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: state values as scroll triggers
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [
    displayedText,
    showInsights,
    visibleInsights,
    showPatterns,
    showTable,
    showActions,
    showChart1,
    showChart2,
    showSaved,
  ]);

  const isTyping = !showSaved;

  return (
    <div className='flex flex-col gap-3 px-4 py-3'>
      {/* Original user message */}
      <div className='flex gap-2'>
        <UserAvatar />
        <div className='flex flex-col gap-0.5'>
          <div className='flex items-center gap-1.5'>
            <span className='font-semibold text-[11px] text-foreground leading-4 sm:text-[13px] sm:leading-5'>
              Prakash
            </span>
            <span className='text-muted-foreground text-xs leading-4'>
              Wednesday at 2:22 AM
            </span>
          </div>
          <span className='text-[11px] text-foreground leading-4 sm:text-sm sm:leading-5'>
            <span className='font-medium text-[#266DF0]'>@ChatPlotDB</span> tell
            me 5 most earning movies not music and all
          </span>
        </div>
      </div>

      {/* Replies divider */}
      <div className='flex items-center gap-2'>
        <span className='whitespace-nowrap font-medium text-[#266DF0] text-xs leading-4'>
          5 replies
        </span>
        <div className='h-px flex-1 bg-muted' />
      </div>

      {/* Bot response */}
      <div className='relative flex gap-2'>
        <BotAvatar />
        <div className='flex min-w-0 flex-1 flex-col gap-1'>
          {/* Message action bar */}
          <div className='-top-1 absolute right-0 z-10 flex items-center gap-px rounded-lg border border-border bg-card p-0.5 shadow-sm'>
            {[EmojiIcon, ShareIcon, BookmarkIcon, HorizDotsIcon].map(
              (Icon, i) => (
                <div
                  key={`thread-action-${Icon.name}-${i}`}
                  className='flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-muted'
                >
                  <Icon />
                </div>
              ),
            )}
          </div>

          <div className='flex items-center gap-1.5'>
            <span className='font-semibold text-[11px] text-foreground leading-4 sm:text-[13px] sm:leading-5'>
              ChatPlotDB
            </span>
            <span className='rounded bg-muted px-[5px] py-px font-medium text-[10px] text-muted-foreground leading-3'>
              APP
            </span>
            <span className='text-muted-foreground text-xs leading-4'>
              Wednesday at 2:22 AM
            </span>
          </div>

          <div className='flex flex-col gap-2 text-[11px] text-foreground leading-4 sm:text-sm sm:leading-5'>
            {/* Typed intro */}
            <span>
              {displayedText.length < THREAD_TEXT.length ? (
                <>
                  {displayedText}
                  <span className='ml-px inline-block h-[14px] w-[2px] animate-pulse bg-[#266DF0] align-middle' />
                </>
              ) : (
                <>
                  Here are the{' '}
                  <span className='font-bold'>
                    Top 5 Highest Earning Movies
                  </span>{' '}
                  (Music category excluded) <Emoji>{'📊'}</Emoji>{' '}
                  <Emoji>{'💰'}</Emoji>
                </>
              )}
            </span>

            {/* Key Insights */}
            {showInsights && <span className='font-bold'>Key Insights:</span>}

            {showInsights && visibleInsights > 0 && (
              <div className='-mt-1 flex flex-col gap-0.5'>
                {/* 1 - Gold medal */}
                {visibleInsights >= 1 && (
                  <InsightLine badge={<Emoji>{'🥇'}</Emoji>}>
                    <B>WIFE TURN</B> (Documentary) leads the pack with{' '}
                    <B>$223.69</B> in total revenue from <B>31 rentals</B>
                  </InsightLine>
                )}
                {visibleInsights >= 2 && (
                  <InsightLine badge={<Emoji>{'🥈'}</Emoji>}>
                    <B>ZORRO ARK</B> (Comedy) comes in second at <B>$214.69</B>,
                    also with <B>31 rentals</B>
                  </InsightLine>
                )}
                {visibleInsights >= 3 && (
                  <InsightLine badge={<Emoji>{'🥉'}</Emoji>}>
                    <B>GOODFELLAS SALUTE</B> (Sci-Fi) earns <B>$209.69</B> —
                    also rented <B>31 times</B>
                  </InsightLine>
                )}
                {visibleInsights >= 4 && (
                  <InsightLine badge={<Emoji>{'4️⃣'}</Emoji>}>
                    <B>SATURDAY LAMBS</B> (Sports) earned <B>$204.72</B> from{' '}
                    <B>28 rentals</B>
                  </InsightLine>
                )}
                {visibleInsights >= 5 && (
                  <InsightLine badge={<Emoji>{'5️⃣'}</Emoji>}>
                    <B>TITANS JERK</B> (Sci-Fi) rounds out the top 5 with{' '}
                    <B>$201.71</B> from <B>29 rentals</B>
                  </InsightLine>
                )}
              </div>
            )}

            {/* Notable Patterns */}
            {showPatterns && (
              <div className='flex flex-col gap-0.5'>
                <span className='font-bold'>Notable Patterns:</span>
                <InsightLine badge={<Emoji>{'📊'}</Emoji>}>
                  The top 3 films all had <B>exactly 31 rentals</B>, but revenue
                  differs due to varying rental rates
                </InsightLine>
                <InsightLine badge={<Emoji>{'🎭'}</Emoji>}>
                  <B>Sci-Fi</B> appears <B>twice</B> in the top 5, making it a
                  strong-performing genre
                </InsightLine>
                <InsightLine badge={<Emoji>{'💰'}</Emoji>}>
                  Revenue range is tight — only <B>~$22 difference</B> between
                  1st and 5th place{' '}
                  <span className='text-muted-foreground'>(edited)</span>
                </InsightLine>
              </div>
            )}

            {/* Table */}
            {showTable && (
              <div className='flex flex-col gap-1'>
                <div className='flex items-center gap-1.5'>
                  <Emoji>{'📁'}</Emoji>
                  <span className='font-semibold text-[10px] sm:text-[13px]'>
                    Top 5 Highest Earning Movies (Excluding Music)
                  </span>
                </div>
                <div className='rounded-lg bg-muted px-3 py-2 font-mono text-[11px] text-foreground leading-[16px]'>
                  {TABLE_LINES.map((line) => (
                    <div key={line}>{line}</div>
                  ))}
                </div>
              </div>
            )}

            {/* See more + action buttons */}
            {showActions && (
              <div className='flex flex-col gap-2'>
                <span className='w-fit cursor-pointer font-medium text-[#266DF0] text-xs leading-4 hover:underline'>
                  See more
                </span>
                <div className='flex flex-col gap-1.5'>
                  <button
                    type='button'
                    className='flex w-fit items-center gap-1.5 rounded-md bg-[#0FC27B] px-3 py-1.5 font-medium text-white text-xs leading-4 shadow-sm'
                  >
                    <Emoji>{'📊'}</Emoji>
                    Save Table to Dashboard
                  </button>
                  <button
                    type='button'
                    className='flex w-fit items-center gap-1.5 rounded-md bg-[#266DF0] px-3 py-1.5 font-medium text-white text-xs leading-4 shadow-sm'
                  >
                    <Emoji>{'📈'}</Emoji>
                    Save Chart to Dashboard
                  </button>
                </div>
              </div>
            )}

            {/* Data table preview */}
            {showChart1 && <NiftyDataTable />}

            {/* Chart 1 — 52-Week High & Low vs Current Price */}
            {showChart1 && (
              <div className='flex flex-col gap-1.5'>
                <div className='flex items-center gap-1.5'>
                  <Emoji>{'📊'}</Emoji>
                  <span className='font-bold text-[10px] sm:text-[13px]'>
                    Nifty 50 — 52-Week High &amp; Low vs Current Price
                  </span>
                </div>
                <div className='flex items-center gap-1'>
                  <span className='text-muted-foreground text-xs'>
                    Nifty 50 — 52-Week High &amp; Low vs Current Price
                  </span>
                  <span className='text-muted-foreground text-xs'>▾</span>
                </div>
                <NiftyHighLowChart />
              </div>
            )}

            {/* Chart 2 — % Distance from 52-Week High */}
            {showChart2 && (
              <div className='flex flex-col gap-1.5'>
                <div className='flex items-center gap-1.5'>
                  <Emoji>{'📊'}</Emoji>
                  <span className='font-bold text-[10px] sm:text-[13px]'>
                    Nifty 50 — % Distance from 52-Week High
                  </span>
                </div>
                <div className='flex items-center gap-1'>
                  <span className='text-muted-foreground text-xs'>
                    Nifty 50 — % Distance from 52-Week High
                  </span>
                  <span className='text-muted-foreground text-xs'>▾</span>
                </div>
                <NiftyDistanceChart />
              </div>
            )}

            {/* Save confirmation */}
            {showSaved && (
              <div className='text-[11px] leading-4 sm:text-sm sm:leading-5'>
                <Emoji>{'✅'}</Emoji> Saved{' '}
                <B>Nifty 50 — % Distance from 52-Week High</B> to dashboard{' '}
                <B>Slack-dashboard</B>
              </div>
            )}

            {/* Cursor */}
            {isTyping && showInsights && (
              <span className='inline-block h-[14px] w-[2px] animate-pulse bg-[#266DF0]' />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Thread helper components ───────────────────────────────────────────────

function B({ children }: { children: React.ReactNode }) {
  return <span className='font-bold'>{children}</span>;
}

function InsightLine({
  badge,
  children,
}: {
  badge: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className='flex items-start gap-1.5'>
      <span className='mt-0.5 shrink-0'>-</span>
      <span className='mt-[2px] shrink-0'>{badge}</span>
      <span>{children}</span>
    </div>
  );
}

function Emoji({ children }: { children: string }) {
  return <span className='text-sm leading-none'>{children}</span>;
}

// ─── Nifty 50 Charts (reporting-tab style) ──────────────────────────────────

function NiftyDataTable() {
  const columns = [
    'Name',
    'Symbol',
    'Sector',
    'Current Price',
    'High 52W',
    'Low 52W',
    'Pct From 52W High',
    'Pct From 52W Low',
  ];
  const rows = [
    ['ITC LTD', 'ITC', 'Fast Moving'],
    ['TATA CONSULTANCY SERV LT', 'TCS', 'Information'],
    ['ADANI ENTERPRISES LIMIT...', 'ADANIENT', 'Metals & Min'],
    ['HDFC LIFE INS CO LTD', 'HDFCLIFE', 'Financial Se'],
    ['BHARAT PETROLEUM CORP LT', 'BPCL', 'Oil, Gas & C'],
    ['CIPLA LTD', 'CIPLA', 'Healthcare'],
  ];

  return (
    <div className='flex flex-col gap-2'>
      {/* Title */}
      <div className='flex flex-col gap-0.5'>
        <div className='flex items-center gap-1.5'>
          <Emoji>{'📋'}</Emoji>
          <span className='font-bold text-[10px] sm:text-[13px]'>
            Nifty 50 — 52-Week High &amp; Low
          </span>
        </div>
        <span className='text-muted-foreground text-xs'>
          48 rows × 9 columns
        </span>
      </div>

      {/* Column badges */}
      <div className='flex flex-wrap items-center gap-1'>
        <span className='font-medium text-foreground text-xs'>Columns:</span>
        {columns.map((col) => (
          <span
            key={col}
            className='rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[#F59E0B] text-[10px] leading-3'
          >
            {col}
          </span>
        ))}
        <span className='text-muted-foreground text-xs'>... +1 more</span>
      </div>

      {/* CSV note */}
      <span className='text-[#F59E0B] text-xs italic'>
        Full data attached as CSV below.
      </span>

      {/* Table dropdown label */}
      <div className='flex items-center gap-1'>
        <span className='text-muted-foreground text-xs'>
          Nifty 50 — 52-Week High &amp; Low
        </span>
        <span className='text-muted-foreground text-xs'>▾</span>
      </div>

      {/* Table preview */}
      <div className='overflow-hidden rounded-lg border border-border'>
        <table className='w-full font-mono text-[10px] leading-4'>
          <thead>
            <tr className='border-border border-b bg-muted'>
              <th className='border-border border-r px-2 py-1.5 text-left font-semibold text-foreground'>
                Name
              </th>
              <th className='border-border border-r px-2 py-1.5 text-left font-semibold text-foreground'>
                Symbol
              </th>
              <th className='px-2 py-1.5 text-left font-semibold text-foreground'>
                Sector
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row[1]}
                className='border-border border-b last:border-b-0'
              >
                <td className='border-border border-r px-2 py-1 text-foreground'>
                  {row[0]}
                </td>
                <td className='border-border border-r px-2 py-1 text-foreground'>
                  {row[1]}
                </td>
                <td className='px-2 py-1 text-foreground'>{row[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function NiftyHighLowChart() {
  return (
    <div className='overflow-hidden rounded-lg border border-border bg-card'>
      {/* Header */}
      <div className='bg-muted px-3 py-2'>
        <span className='font-semibold text-foreground text-xs leading-4'>
          Nifty 50 — 52-Week High &amp; Low vs Current Price
        </span>
      </div>
      {/* Legend */}
      <div className='flex items-center justify-center gap-4 border-border border-b px-3 py-2'>
        <ChartLegendDot color='#0FC27B' label='52W High' />
        <ChartLegendDot color='#EF4444' label='52W Low' />
        <ChartLegendDot color='#266DF0' label='Current Price' />
      </div>
      {/* Chart area */}
      <div className='flex gap-1.5 px-3 pt-3 pb-1.5'>
        {/* Y-axis */}
        <div className='flex w-7 flex-col justify-between text-right'>
          {['4.5K', '3.0K', '1.5K', '0'].map((label) => (
            <span
              key={label}
              className='font-medium text-[9px] text-muted-foreground leading-3'
            >
              {label}
            </span>
          ))}
        </div>
        {/* Bars */}
        <div className='flex flex-1 items-end gap-1'>
          {NIFTY_HIGH_LOW.map((stock) => (
            <div
              key={stock.symbol}
              className='flex flex-1 items-end justify-center gap-[2px]'
              style={{ height: 140 }}
            >
              <div
                className='w-1.5 rounded-t-sm bg-[#0FC27B]'
                style={{
                  height: `${(stock.high / NIFTY_MAX_PRICE) * 100}%`,
                }}
              />
              <div
                className='w-1.5 rounded-t-sm bg-[#EF4444]'
                style={{
                  height: `${(stock.low / NIFTY_MAX_PRICE) * 100}%`,
                }}
              />
              <div
                className='w-1.5 rounded-t-sm bg-[#266DF0]'
                style={{
                  height: `${(stock.current / NIFTY_MAX_PRICE) * 100}%`,
                }}
              />
            </div>
          ))}
        </div>
      </div>
      {/* X-axis labels */}
      <div className='ml-[34px] flex gap-1 px-3 pb-2'>
        {NIFTY_HIGH_LOW.map((stock) => (
          <div key={`x-${stock.symbol}`} className='flex-1 text-center'>
            <span className='font-medium text-[7px] text-muted-foreground leading-[9px]'>
              {stock.symbol}
            </span>
          </div>
        ))}
      </div>
      {/* X-axis title */}
      <div className='border-border border-t px-3 py-1.5 text-center'>
        <span className='font-medium text-[9px] text-muted-foreground'>
          Stock Symbol
        </span>
      </div>
    </div>
  );
}

function NiftyDistanceChart() {
  return (
    <div className='overflow-hidden rounded-lg border border-border bg-card'>
      {/* Header */}
      <div className='bg-muted px-3 py-2'>
        <span className='font-semibold text-foreground text-xs leading-4'>
          Nifty 50 — % Distance from 52-Week High
        </span>
        <div className='mt-0.5 text-[8px] text-muted-foreground leading-3'>
          As of 12 Apr 2026 | Negative = Below High
        </div>
      </div>
      {/* Legend */}
      <div className='flex flex-wrap items-center justify-center gap-x-3 gap-y-1 border-border border-b px-3 py-2'>
        <ChartLegendDot color='#EF4444' label='Deep Correction (>20%)' />
        <ChartLegendDot color='#F97316' label='Moderate (10-20%)' />
        <ChartLegendDot color='#F59E0B' label='Near High (5-10%)' />
        <ChartLegendDot color='#0FC27B' label='At/Near 52W High (<5%)' />
      </div>
      {/* Horizontal bars */}
      <div className='flex flex-col gap-[3px] px-2 py-2'>
        {NIFTY_DISTANCE.map((stock) => (
          <div key={stock.symbol} className='flex items-center gap-1.5'>
            <span className='w-[62px] text-right font-medium text-[8px] text-foreground leading-[10px]'>
              {stock.symbol}
            </span>
            <div className='relative h-2 flex-1 rounded-sm bg-muted'>
              <div
                className='absolute top-0 left-0 h-full rounded-r-sm'
                style={{
                  width: `${Math.min((stock.pct / 35) * 100, 100)}%`,
                  backgroundColor: getDistanceColor(stock.pct),
                }}
              />
            </div>
          </div>
        ))}
      </div>
      {/* X-axis labels */}
      <div
        className='flex justify-between border-border border-t px-2 py-1.5'
        style={{ marginLeft: 70 }}
      >
        {['-35%', '-30%', '-25%', '-20%', '-15%', '-10%', '-5%', '0%'].map(
          (label) => (
            <span
              key={label}
              className='font-medium text-[8px] text-muted-foreground leading-[10px]'
            >
              {label}
            </span>
          ),
        )}
      </div>
    </div>
  );
}

function getDistanceColor(pct: number): string {
  if (pct > 20) return '#EF4444';
  if (pct > 10) return '#F97316';
  if (pct > 5) return '#F59E0B';
  return '#0FC27B';
}

function ChartLegendDot({
  color,
  label,
}: {
  color: string;
  label: string;
}) {
  return (
    <div className='flex items-center gap-1'>
      <span
        className='size-2 rounded-[2px]'
        style={{ backgroundColor: color }}
      />
      <span className='font-medium text-[9px] text-muted-foreground leading-3'>
        {label}
      </span>
    </div>
  );
}

// ─── Shared Sub-components ──────────────────────────────────────────────────

function BotAvatar() {
  return (
    <img
      src='/avatar-images/avatar-02.jpg'
      alt='Bot'
      className='size-7 shrink-0 rounded-lg object-cover shadow-[0_1px_2px_rgba(0,0,0,0.08)]'
    />
  );
}

function UserAvatar() {
  return (
    <img
      src='/avatar-images/avatar-01.jpg'
      alt='User'
      className='size-8 shrink-0 rounded-lg object-cover shadow-[0_1px_2px_rgba(0,0,0,0.08)]'
    />
  );
}

function MessageMeta({
  name,
  isBot,
  time,
}: {
  name: string;
  isBot?: boolean;
  time: string;
}) {
  return (
    <div className='flex items-center gap-1.5'>
      <span className='font-semibold text-[11px] text-foreground leading-4 sm:text-[13px] sm:leading-5'>
        {name}
      </span>
      {isBot && (
        <span className='rounded bg-muted px-[5px] py-px font-medium text-[10px] text-muted-foreground leading-3'>
          APP
        </span>
      )}
      <span className='text-muted-foreground text-xs leading-4'>{time}</span>
    </div>
  );
}

// ─── Icons ──────────────────────────────────────────────────────────────────

function StarIcon() {
  return (
    <svg role='presentation' className='size-4' viewBox='0 0 16 16' fill='none'>
      <path
        d='M8 2l1.8 3.6L14 6.3l-3 2.9.7 4.1L8 11.3 4.3 13.3l.7-4.1-3-2.9 4.2-.7L8 2z'
        stroke='currentColor'
        strokeWidth='1.2'
        strokeLinejoin='round'
        fill='none'
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      role='presentation'
      className='size-3.5'
      viewBox='0 0 14 14'
      fill='none'
    >
      <rect
        x='3'
        y='6'
        width='8'
        height='6'
        rx='1.5'
        stroke='currentColor'
        strokeWidth='1.2'
      />
      <path
        d='M5 6V4.5a2 2 0 0 1 4 0V6'
        stroke='currentColor'
        strokeWidth='1.2'
        strokeLinecap='round'
      />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg role='presentation' className='size-4' viewBox='0 0 16 16' fill='none'>
      <circle cx='6' cy='5.5' r='2' stroke='currentColor' strokeWidth='1.2' />
      <path
        d='M2 13c0-2.2 1.8-4 4-4s4 1.8 4 4'
        stroke='currentColor'
        strokeWidth='1.2'
        strokeLinecap='round'
      />
      <circle
        cx='11'
        cy='5.5'
        r='1.5'
        stroke='currentColor'
        strokeWidth='1.1'
      />
      <path
        d='M11.5 9c1.7.3 3 1.7 3 3.5'
        stroke='currentColor'
        strokeWidth='1.1'
        strokeLinecap='round'
      />
    </svg>
  );
}

function HeadphonesIcon() {
  return (
    <svg role='presentation' className='size-4' viewBox='0 0 16 16' fill='none'>
      <path
        d='M3 10V8a5 5 0 0 1 10 0v2'
        stroke='currentColor'
        strokeWidth='1.2'
        strokeLinecap='round'
      />
      <rect
        x='1.5'
        y='9'
        width='2.5'
        height='4'
        rx='1'
        stroke='currentColor'
        strokeWidth='1.1'
      />
      <rect
        x='12'
        y='9'
        width='2.5'
        height='4'
        rx='1'
        stroke='currentColor'
        strokeWidth='1.1'
      />
    </svg>
  );
}

function ChevronDownSmIcon() {
  return (
    <svg role='presentation' className='size-3' viewBox='0 0 12 12' fill='none'>
      <path
        d='M3 4.5l3 3 3-3'
        stroke='currentColor'
        strokeWidth='1.2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg role='presentation' className='size-4' viewBox='0 0 16 16' fill='none'>
      <path
        d='M8 2a4 4 0 0 0-4 4v2l-1 2h10l-1-2V6a4 4 0 0 0-4-4zM6.5 12a1.5 1.5 0 0 0 3 0'
        stroke='currentColor'
        strokeWidth='1.2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      {/* Ringing lines */}
      <path
        d='M2.5 5.5C2 4 2.5 2.5 3.5 1.5M13.5 5.5c.5-1.5 0-3-1-4'
        stroke='currentColor'
        strokeWidth='1'
        strokeLinecap='round'
      />
    </svg>
  );
}

function SearchIcon() {
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

function VerticalDotsIcon() {
  return (
    <svg role='presentation' className='size-4' viewBox='0 0 16 16' fill='none'>
      <circle cx='8' cy='4' r='1' fill='currentColor' />
      <circle cx='8' cy='8' r='1' fill='currentColor' />
      <circle cx='8' cy='12' r='1' fill='currentColor' />
    </svg>
  );
}

function PlusSmIcon() {
  return (
    <svg role='presentation' className='size-3' viewBox='0 0 12 12' fill='none'>
      <path
        d='M6 2v8M2 6h8'
        stroke='currentColor'
        strokeWidth='1.3'
        strokeLinecap='round'
      />
    </svg>
  );
}

function FileTabIcon() {
  return (
    <svg role='presentation' className='size-3' viewBox='0 0 12 12' fill='none'>
      <path
        d='M3 1.5h4l3 3v6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1z'
        stroke='currentColor'
        strokeWidth='1.1'
        strokeLinejoin='round'
      />
      <path
        d='M7 1.5v3h3'
        stroke='currentColor'
        strokeWidth='1.1'
        strokeLinejoin='round'
      />
    </svg>
  );
}

function EmojiIcon() {
  return (
    <svg role='presentation' className='size-4' viewBox='0 0 16 16' fill='none'>
      <circle cx='8' cy='8' r='5.5' stroke='currentColor' strokeWidth='1.2' />
      <circle cx='6' cy='7' r='0.7' fill='currentColor' />
      <circle cx='10' cy='7' r='0.7' fill='currentColor' />
      <path
        d='M5.5 9.5a3 3 0 0 0 5 0'
        stroke='currentColor'
        strokeWidth='1'
        strokeLinecap='round'
      />
    </svg>
  );
}

function AddReactionIcon() {
  return (
    <svg role='presentation' className='size-4' viewBox='0 0 16 16' fill='none'>
      <circle cx='7' cy='8' r='5' stroke='currentColor' strokeWidth='1.1' />
      <path
        d='M13 3v4M10 5h6'
        stroke='currentColor'
        strokeWidth='1.1'
        strokeLinecap='round'
      />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg role='presentation' className='size-4' viewBox='0 0 16 16' fill='none'>
      <path
        d='M5.5 6.5L10.5 4M5.5 9.5l5-2.5M4.5 7a1.5 1.5 0 1 0 0 2 1.5 1.5 0 0 0 0-2zM10.5 3a1.5 1.5 0 1 0 0 2 1.5 1.5 0 0 0 0-2zM10.5 9a1.5 1.5 0 1 0 0 2 1.5 1.5 0 0 0 0-2z'
        stroke='currentColor'
        strokeWidth='1.1'
      />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg role='presentation' className='size-4' viewBox='0 0 16 16' fill='none'>
      <path
        d='M4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v11l-4-2.5L4 14V3z'
        stroke='currentColor'
        strokeWidth='1.2'
        strokeLinejoin='round'
      />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg role='presentation' className='size-4' viewBox='0 0 16 16' fill='none'>
      <path
        d='M2.5 4.5h11M4.5 8h7M6.5 11.5h3'
        stroke='currentColor'
        strokeWidth='1.2'
        strokeLinecap='round'
      />
    </svg>
  );
}

function HorizDotsIcon() {
  return (
    <svg role='presentation' className='size-4' viewBox='0 0 16 16' fill='none'>
      <circle cx='4' cy='8' r='1' fill='currentColor' />
      <circle cx='8' cy='8' r='1' fill='currentColor' />
      <circle cx='12' cy='8' r='1' fill='currentColor' />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      role='presentation'
      className='size-3.5'
      viewBox='0 0 14 14'
      fill='none'
    >
      <path
        d='M3.5 3.5l7 7M10.5 3.5l-7 7'
        stroke='currentColor'
        strokeWidth='1.4'
        strokeLinecap='round'
      />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg
      role='presentation'
      className='size-3.5'
      viewBox='0 0 14 14'
      fill='none'
    >
      <path
        d='M5.83 8.17a2.5 2.5 0 0 0 3.53 0l1.77-1.77a2.5 2.5 0 0 0-3.54-3.54L6.83 3.59M8.17 5.83a2.5 2.5 0 0 0-3.53 0L2.87 7.6a2.5 2.5 0 0 0 3.54 3.54l.76-.77'
        stroke='currentColor'
        strokeWidth='1.2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

function OrderedListIcon() {
  return (
    <svg
      role='presentation'
      className='size-3.5'
      viewBox='0 0 14 14'
      fill='none'
    >
      <path
        d='M5.5 3.5h6M5.5 7h6M5.5 10.5h6'
        stroke='currentColor'
        strokeWidth='1.2'
        strokeLinecap='round'
      />
      <text x='2' y='5' fill='currentColor' fontSize='4' fontWeight='600'>
        1
      </text>
      <text x='2' y='8.5' fill='currentColor' fontSize='4' fontWeight='600'>
        2
      </text>
      <text x='2' y='12' fill='currentColor' fontSize='4' fontWeight='600'>
        3
      </text>
    </svg>
  );
}

function UnorderedListIcon() {
  return (
    <svg
      role='presentation'
      className='size-3.5'
      viewBox='0 0 14 14'
      fill='none'
    >
      <path
        d='M5.5 3.5h6M5.5 7h6M5.5 10.5h6'
        stroke='currentColor'
        strokeWidth='1.2'
        strokeLinecap='round'
      />
      <circle cx='2.8' cy='3.5' r='0.8' fill='currentColor' />
      <circle cx='2.8' cy='7' r='0.8' fill='currentColor' />
      <circle cx='2.8' cy='10.5' r='0.8' fill='currentColor' />
    </svg>
  );
}

function InlineCodeIcon() {
  return (
    <svg
      role='presentation'
      className='size-3.5'
      viewBox='0 0 14 14'
      fill='none'
    >
      <path
        d='M9 3.5l-4 7M4.5 4.5L2 7l2.5 2.5M9.5 4.5L12 7l-2.5 2.5'
        stroke='currentColor'
        strokeWidth='1.2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

function CodeBlockIcon() {
  return (
    <svg
      role='presentation'
      className='size-3.5'
      viewBox='0 0 14 14'
      fill='none'
    >
      <rect
        x='1.5'
        y='2'
        width='11'
        height='10'
        rx='1.5'
        stroke='currentColor'
        strokeWidth='1.1'
      />
      <path
        d='M5 5.5L3.5 7 5 8.5M9 5.5l1.5 1.5L9 8.5'
        stroke='currentColor'
        strokeWidth='1.1'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

function PlusCircleIcon() {
  return (
    <svg role='presentation' className='size-4' viewBox='0 0 16 16' fill='none'>
      <circle cx='8' cy='8' r='5.5' stroke='currentColor' strokeWidth='1.2' />
      <path
        d='M8 5.5v5M5.5 8h5'
        stroke='currentColor'
        strokeWidth='1.2'
        strokeLinecap='round'
      />
    </svg>
  );
}

function AtIcon() {
  return (
    <svg role='presentation' className='size-4' viewBox='0 0 16 16' fill='none'>
      <circle cx='8' cy='8' r='2.5' stroke='currentColor' strokeWidth='1.1' />
      <path
        d='M10.5 8v1a2 2 0 0 0 4 0V8a6.5 6.5 0 1 0-3 5.5'
        stroke='currentColor'
        strokeWidth='1.1'
        strokeLinecap='round'
      />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg role='presentation' className='size-4' viewBox='0 0 16 16' fill='none'>
      <rect
        x='2'
        y='4'
        width='8'
        height='8'
        rx='1.5'
        stroke='currentColor'
        strokeWidth='1.1'
      />
      <path
        d='M10 7l4-2v6l-4-2'
        stroke='currentColor'
        strokeWidth='1.1'
        strokeLinejoin='round'
      />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg role='presentation' className='size-4' viewBox='0 0 16 16' fill='none'>
      <rect
        x='6'
        y='2'
        width='4'
        height='7'
        rx='2'
        stroke='currentColor'
        strokeWidth='1.1'
      />
      <path
        d='M4 8.5a4 4 0 0 0 8 0M8 12.5v2'
        stroke='currentColor'
        strokeWidth='1.1'
        strokeLinecap='round'
      />
    </svg>
  );
}

function AttachIcon() {
  return (
    <svg role='presentation' className='size-4' viewBox='0 0 16 16' fill='none'>
      <path
        d='M8.5 3.5L4.3 7.7a2.5 2.5 0 0 0 3.5 3.5l4.5-4.5a1.5 1.5 0 0 0-2.1-2.1L5.8 9a.5.5 0 0 0 .7.7l3.5-3.5'
        stroke='currentColor'
        strokeWidth='1.1'
        strokeLinecap='round'
      />
    </svg>
  );
}

function ShortcutsIcon() {
  return (
    <svg role='presentation' className='size-4' viewBox='0 0 16 16' fill='none'>
      <rect
        x='2.5'
        y='2.5'
        width='11'
        height='11'
        rx='2'
        stroke='currentColor'
        strokeWidth='1.1'
      />
      <path
        d='M5.5 8h5M8 5.5v5'
        stroke='currentColor'
        strokeWidth='1.1'
        strokeLinecap='round'
      />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg
      role='presentation'
      className='size-3.5'
      viewBox='0 0 14 14'
      fill='none'
    >
      <path
        d='M6.72461 2.08154C6.91862 1.9537 7.18277 1.97532 7.35352 2.146L10.8535 5.646C11.0487 5.84114 11.0484 6.15774 10.8535 6.35303C10.6583 6.54829 10.3417 6.54829 10.1465 6.35303L7.5 3.70654V11.4995C7.5 11.7756 7.27601 11.9994 7 11.9995C6.72386 11.9995 6.5 11.7757 6.5 11.4995V3.70654L3.85352 6.35303C3.65825 6.54829 3.34175 6.54829 3.14648 6.35303C2.95129 6.15776 2.95125 5.84123 3.14648 5.646L6.64648 2.146L6.72461 2.08154Z'
        fill='white'
      />
    </svg>
  );
}
