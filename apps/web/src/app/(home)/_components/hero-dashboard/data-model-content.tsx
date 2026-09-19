// ─── Data ────────────────────────────────────────────────────────────────────

type StatusColor = 'purple' | 'green' | 'blue' | 'orange' | 'teal' | 'yellow';
type SignalType = 'bullish' | 'neutral' | 'bearish' | 'strong-buy';

interface Stock {
  ticker: string;
  sector: string;
  queries: string[];
  sentiment: string;
  sentimentColor: StatusColor;
  marketCap: string;
  capColor: StatusColor;
  signal: SignalType;
  logoBg: string;
}

const STATUS_COLORS: Record<StatusColor, string> = {
  purple:
    'border-[#EDE5FE] bg-[#F8F5FF] text-[#6B3FA0] dark:border-purple-400/20 dark:bg-purple-400/10 dark:text-purple-300',
  green:
    'border-[#D4F4DC] bg-[#EDFAF0] text-[#1A7A4C] dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300',
  blue: 'border-[#DEEAFF] bg-[#EEF3FF] text-[#2D5BB2] dark:border-blue-400/20 dark:bg-blue-400/10 dark:text-blue-300',
  orange:
    'border-[#FFE8D4] bg-[#FFF4EB] text-[#9A5A1A] dark:border-orange-400/20 dark:bg-orange-400/10 dark:text-orange-300',
  teal: 'border-[#D1F0F9] bg-[#E8F7FC] text-[#1A7A8A] dark:border-teal-400/20 dark:bg-teal-400/10 dark:text-teal-300',
  yellow:
    'border-[#FFEEBD] bg-[#FFF8E0] text-[#8A6A00] dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300',
};

const STOCKS: Stock[] = [
  {
    ticker: 'AAPL',
    sector: 'Technology',
    queries: ['Revenue Trend', 'EPS Forecast'],
    sentiment: 'Bullish',
    sentimentColor: 'green',
    marketCap: '$3.07T',
    capColor: 'purple',
    signal: 'strong-buy',
    logoBg: 'bg-black',
  },
  {
    ticker: 'MSFT',
    sector: 'Technology',
    queries: ['Azure Growth'],
    sentiment: 'Bullish',
    sentimentColor: 'green',
    marketCap: '$2.89T',
    capColor: 'purple',
    signal: 'bullish',
    logoBg: 'bg-blue-600',
  },
  {
    ticker: 'GOOGL',
    sector: 'Communication',
    queries: ['Ad Revenue Q3', 'Cloud Margins'],
    sentiment: 'Neutral',
    sentimentColor: 'blue',
    marketCap: '$1.92T',
    capColor: 'green',
    signal: 'neutral',
    logoBg: 'bg-red-500',
  },
  {
    ticker: 'AMZN',
    sector: 'Consumer Cyclical',
    queries: ['AWS Margins'],
    sentiment: 'Bullish',
    sentimentColor: 'green',
    marketCap: '$1.87T',
    capColor: 'green',
    signal: 'bullish',
    logoBg: 'bg-orange-500',
  },
  {
    ticker: 'NVDA',
    sector: 'Semiconductors',
    queries: ['GPU Demand', 'AI Revenue'],
    sentiment: 'Bullish',
    sentimentColor: 'green',
    marketCap: '$1.78T',
    capColor: 'green',
    signal: 'strong-buy',
    logoBg: 'bg-emerald-600',
  },
  {
    ticker: 'TSLA',
    sector: 'Automotive',
    queries: ['Delivery Numbers', 'Margin Pressure'],
    sentiment: 'Bearish',
    sentimentColor: 'orange',
    marketCap: '$785B',
    capColor: 'teal',
    signal: 'bearish',
    logoBg: 'bg-red-600',
  },
  {
    ticker: 'META',
    sector: 'Technology',
    queries: ['Metaverse Spend'],
    sentiment: 'Neutral',
    sentimentColor: 'blue',
    marketCap: '$1.24T',
    capColor: 'green',
    signal: 'neutral',
    logoBg: 'bg-blue-500',
  },
  {
    ticker: 'JPM',
    sector: 'Financial',
    queries: ['Net Interest Income', 'Credit Risk'],
    sentiment: 'Bullish',
    sentimentColor: 'green',
    marketCap: '$574B',
    capColor: 'teal',
    signal: 'bullish',
    logoBg: 'bg-blue-800',
  },
  {
    ticker: 'V',
    sector: 'Financial',
    queries: ['Payment Volume'],
    sentiment: 'Bullish',
    sentimentColor: 'green',
    marketCap: '$521B',
    capColor: 'teal',
    signal: 'bullish',
    logoBg: 'bg-indigo-600',
  },
  {
    ticker: 'JNJ',
    sector: 'Healthcare',
    queries: ['Pipeline Analysis'],
    sentiment: 'Neutral',
    sentimentColor: 'blue',
    marketCap: '$382B',
    capColor: 'yellow',
    signal: 'neutral',
    logoBg: 'bg-red-700',
  },
  {
    ticker: 'WMT',
    sector: 'Consumer Staples',
    queries: ['Same-Store Sales'],
    sentiment: 'Bullish',
    sentimentColor: 'green',
    marketCap: '$438B',
    capColor: 'yellow',
    signal: 'bullish',
    logoBg: 'bg-blue-700',
  },
  {
    ticker: 'DIS',
    sector: 'Entertainment',
    queries: ['Streaming Subs', 'Parks Revenue'],
    sentiment: 'Bearish',
    sentimentColor: 'orange',
    marketCap: '$168B',
    capColor: 'orange',
    signal: 'bearish',
    logoBg: 'bg-blue-400',
  },
  {
    ticker: 'CRM',
    sector: 'Technology',
    queries: ['ARR Growth', 'AI Integration'],
    sentiment: 'Bullish',
    sentimentColor: 'green',
    marketCap: '$246B',
    capColor: 'yellow',
    signal: 'bullish',
    logoBg: 'bg-sky-500',
  },
];

const SIGNAL_CONFIG: Record<
  SignalType,
  { label: string; dotColor: string; icon: 'bolt' | 'dot' }
> = {
  'strong-buy': {
    label: 'Strong Buy',
    dotColor: 'text-emerald-500',
    icon: 'bolt',
  },
  bullish: { label: 'Bullish', dotColor: 'text-emerald-500', icon: 'dot' },
  neutral: { label: 'Neutral', dotColor: 'text-blue-500', icon: 'dot' },
  bearish: { label: 'Bearish', dotColor: 'text-orange-400', icon: 'dot' },
};

// ─── Icons ───────────────────────────────────────────────────────────────────

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      role='presentation'
      className={className ?? 'size-4'}
      viewBox='0 0 16 16'
      fill='none'
    >
      <path
        d='M4 6l4 4 4-4'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

function DotsIcon() {
  return (
    <svg role='presentation' className='size-4' viewBox='0 0 16 16' fill='none'>
      <circle cx='4' cy='8' r='1.2' fill='currentColor' />
      <circle cx='8' cy='8' r='1.2' fill='currentColor' />
      <circle cx='12' cy='8' r='1.2' fill='currentColor' />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      role='presentation'
      className='size-3.5'
      viewBox='0 0 14 14'
      fill='none'
    >
      <path
        d='M7 1v12M1 7h12'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
      />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg
      role='presentation'
      className='size-3.5'
      viewBox='0 0 14 14'
      fill='none'
    >
      <path d='M7.5 1L3 8h4l-1 5 5-7H7l.5-5z' fill='currentColor' />
    </svg>
  );
}

function AiBadge() {
  return (
    <span className='ml-1 inline-flex items-center rounded-[4px] border border-border bg-muted px-1 py-px font-medium text-[10px] text-muted-foreground leading-none lg:text-[10px]'>
      AI
    </span>
  );
}

function SortIcon() {
  return (
    <svg
      role='presentation'
      className='size-3.5'
      viewBox='0 0 14 14'
      fill='none'
    >
      <path
        d='M3 5l4-3 4 3M3 9l4 3 4-3'
        stroke='currentColor'
        strokeWidth='1.2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatusPill({ label, color }: { label: string; color: StatusColor }) {
  return (
    <span
      className={`inline-flex items-center rounded-lg border px-2 py-0.5 font-medium text-[11px] leading-none lg:text-xs ${STATUS_COLORS[color]}`}
    >
      {label}
    </span>
  );
}

function DomainPill({ domain }: { domain: string }) {
  return (
    <span className='inline-flex min-w-0 max-w-full items-center overflow-hidden rounded-lg border border-[#B8D0FF] bg-card px-2 py-0.5 font-medium text-[#407FF2] text-[11px] leading-none lg:text-xs dark:border-blue-400/25 dark:bg-blue-400/10 dark:text-blue-300'>
      <span className='truncate'>{domain}</span>
    </span>
  );
}

function SignalIndicator({ type }: { type: SignalType }) {
  const config = SIGNAL_CONFIG[type];
  return (
    <span className='inline-flex items-center gap-1 text-[11px] text-foreground lg:text-xs'>
      {config.icon === 'bolt' ? (
        <span className={config.dotColor}>
          <BoltIcon />
        </span>
      ) : (
        <span
          className={`inline-block size-2 rounded-full ${
            type === 'bullish'
              ? 'bg-emerald-500'
              : type === 'neutral'
                ? 'bg-blue-500'
                : 'bg-orange-400'
          }`}
        />
      )}
      {config.label}
    </span>
  );
}

function CompanyLogo({ name, bg }: { name: string; bg: string }) {
  return (
    <span
      className={`inline-flex size-4 shrink-0 items-center justify-center rounded-[5px] font-bold text-[8px] text-white ${bg}`}
    >
      {name.charAt(0)}
    </span>
  );
}

function HeaderCell({
  children,
  last = false,
}: { children: React.ReactNode; last?: boolean }) {
  return (
    <div
      className={`flex items-center gap-1 px-2 font-medium text-[11px] text-muted-foreground lg:px-3 lg:text-xs ${last ? 'border-border border-b' : 'border-border border-r border-b'}`}
    >
      {children}
    </div>
  );
}

function Cell({
  children,
  last = false,
  highlighted = false,
}: { children: React.ReactNode; last?: boolean; highlighted?: boolean }) {
  return (
    <div
      className={`flex min-w-0 items-center overflow-hidden px-2 text-[11px] text-foreground lg:px-3 lg:text-sm ${last ? 'border-border border-b' : 'border-border border-r border-b'} ${highlighted ? 'bg-muted/40' : ''}`}
    >
      {children}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function DataModelContent() {
  return (
    <div className='flex h-full w-full flex-col overflow-hidden bg-card'>
      {/* Top toolbar */}
      <div className='flex shrink-0 items-center justify-between border-border border-b px-2 py-1 sm:px-3 sm:py-2 lg:px-4'>
        <button
          type='button'
          className='flex items-center gap-1 font-semibold text-[11px] text-foreground leading-4 sm:text-sm sm:leading-5'
        >
          Stock Analysis
          <ChevronDownIcon className='size-3.5 text-muted-foreground' />
        </button>
        <div className='flex items-center gap-2'>
          <button
            type='button'
            className='flex items-center gap-1 rounded-md border border-border px-2 py-1 font-medium text-[11px] text-foreground lg:text-xs'
          >
            Query builder
          </button>
          <button
            type='button'
            className='flex items-center gap-1 rounded-md border border-border px-2 py-1 font-medium text-[11px] text-foreground lg:text-xs'
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Filter bar — hidden on mobile to save height */}
      <div className='hidden shrink-0 items-center gap-2 border-border border-b px-3 py-1.5 sm:flex lg:px-4'>
        <span className='flex items-center gap-1 rounded-md border border-border bg-muted px-2 py-0.5 font-medium text-[11px] text-foreground lg:text-xs'>
          <SortIcon />
          Sorted by Market cap
        </span>
        <span className='flex items-center gap-1 rounded-md border border-border bg-muted px-2 py-0.5 font-medium text-[11px] text-foreground lg:text-xs'>
          Sector filter 5
          <button
            type='button'
            className='text-muted-foreground hover:text-foreground'
          >
            <DotsIcon />
          </button>
        </span>
        <button
          type='button'
          className='flex items-center gap-1 rounded-md border border-border border-dashed px-2 py-0.5 font-medium text-[11px] text-muted-foreground lg:text-xs'
        >
          <PlusIcon />
        </button>
      </div>

      {/* Data table — horizontally scrollable so columns don't clip off the right on narrow viewports */}
      <div className='scrollbar-none flex-1 overflow-x-auto overflow-y-auto'>
        <div className='grid min-w-[640px] auto-rows-[24px] grid-cols-[120px_minmax(80px,1fr)_minmax(120px,1.5fr)_minmax(80px,1fr)_120px_120px] sm:auto-rows-[28px] md:auto-rows-[32px] lg:min-w-0 lg:auto-rows-[36px] lg:grid-cols-[204px_minmax(136px,1fr)_minmax(204px,1.5fr)_minmax(136px,1fr)_204px_204px]'>
          {/* Header row */}
          <HeaderCell>
            <span className='inline-flex size-4 shrink-0 items-center justify-center rounded-md border border-border bg-card' />
            <span className='ml-1'>Ticker</span>
          </HeaderCell>
          <HeaderCell>Sector</HeaderCell>
          <HeaderCell>Recent queries</HeaderCell>
          <HeaderCell>
            Sentiment <AiBadge />
          </HeaderCell>
          <HeaderCell>
            Market Cap <AiBadge />
          </HeaderCell>
          <HeaderCell last>Signal</HeaderCell>

          {/* Data rows */}
          {STOCKS.map((stock) => (
            <StockRow key={`stock-${stock.ticker}`} stock={stock} />
          ))}

          {/* Footer row */}
          <Cell>
            <span className='font-medium text-[11px] text-muted-foreground lg:text-xs'>
              2,847 records
            </span>
          </Cell>
          <Cell>
            <span className='text-[11px] text-muted-foreground lg:text-xs'>
              Add calculation
            </span>
          </Cell>
          <Cell>
            <span className='text-[11px] text-muted-foreground lg:text-xs'>
              Add calculation
            </span>
          </Cell>
          <Cell>
            <span className='text-[11px] text-muted-foreground lg:text-xs'>
              Add calculation
            </span>
          </Cell>
          <Cell>
            <span className='text-[11px] text-muted-foreground lg:text-xs'>
              Add calculation
            </span>
          </Cell>
          <Cell last>
            <span className='text-[11px] text-muted-foreground lg:text-xs'>
              Add calculation
            </span>
          </Cell>
        </div>
      </div>
    </div>
  );
}

// ─── Row Component ───────────────────────────────────────────────────────────

function StockRow({ stock }: { stock: Stock }) {
  return (
    <>
      {/* Ticker with selection circle */}
      <Cell>
        <span className='flex items-center gap-1.5 truncate'>
          <span className='inline-flex size-4 shrink-0 items-center justify-center rounded-md border border-border bg-card' />
          <CompanyLogo name={stock.ticker} bg={stock.logoBg} />
          <span className='truncate font-medium text-[11px] text-foreground underline decoration-border underline-offset-2 lg:text-sm'>
            {stock.ticker}
          </span>
        </span>
      </Cell>

      {/* Sector */}
      <Cell>
        <DomainPill domain={stock.sector} />
      </Cell>

      {/* Recent queries */}
      <Cell>
        <span className='flex items-center gap-1 overflow-hidden'>
          {stock.queries.map((query) => (
            <span
              key={`query-${stock.ticker}-${query}`}
              className='shrink-0 truncate rounded-lg border border-border bg-muted px-2 py-0.5 font-medium text-[11px] text-foreground lg:text-xs'
            >
              {query}
            </span>
          ))}
        </span>
      </Cell>

      {/* Sentiment */}
      <Cell highlighted>
        <StatusPill label={stock.sentiment} color={stock.sentimentColor} />
      </Cell>

      {/* Market Cap */}
      <Cell highlighted>
        <StatusPill label={stock.marketCap} color={stock.capColor} />
      </Cell>

      {/* Signal */}
      <Cell last>
        <SignalIndicator type={stock.signal} />
      </Cell>
    </>
  );
}
