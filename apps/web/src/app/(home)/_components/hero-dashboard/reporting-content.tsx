import type React from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface LegendItem {
  id: string;
  label: string;
  color: string;
  outlined?: boolean;
}

interface BarData {
  id: string;
  fill: string;
  stroke?: string;
  pct: number;
}

interface BarGroup {
  month: string;
  bars: BarData[];
}

interface FunnelStage {
  id: string;
  label: string;
  percentage: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const Y_AXIS_LABELS = ['280K', '240K', '200K', '160K', '120K', '80K', '40K'];

const REVENUE_LEGEND: LegendItem[] = [
  { id: 'apr-jun', label: 'Apr - Jun', color: '#F4F5F6', outlined: true },
  { id: 'jul-sep', label: 'Jul - Sep', color: '#D1D3D6' },
  { id: 'starter', label: 'Starter', color: '#FFD03D' },
  { id: 'growth', label: 'Growth', color: '#FB84A7' },
  { id: 'enterprise', label: 'Enterprise', color: '#A27AFA' },
];

// Heights as percentage of max value (Sept Pro Jul-Sep = 289.5 ≈ 100%)
const BAR_GROUPS: BarGroup[] = [
  {
    month: 'July',
    bars: [
      { id: 'jul-1', fill: '#FFEBAD', stroke: '#FFD03D', pct: 14.2 },
      { id: 'jul-2', fill: '#FFD03D', pct: 24.6 },
      { id: 'jul-3', fill: '#FDC4D5', stroke: '#FB84A7', pct: 41.9 },
      { id: 'jul-4', fill: '#FB84A7', pct: 68.1 },
      { id: 'jul-5', fill: '#D6C4FD', stroke: '#A27AFA', pct: 18.7 },
      { id: 'jul-6', fill: '#A27AFA', pct: 35.3 },
    ],
  },
  {
    month: 'August',
    bars: [
      { id: 'aug-1', fill: '#FFEBAD', stroke: '#FFD03D', pct: 15.2 },
      { id: 'aug-2', fill: '#FFD03D', pct: 37.4 },
      { id: 'aug-3', fill: '#FDC4D5', stroke: '#FB84A7', pct: 51.2 },
      { id: 'aug-4', fill: '#FB84A7', pct: 88.9 },
      { id: 'aug-5', fill: '#D6C4FD', stroke: '#A27AFA', pct: 27.7 },
      { id: 'aug-6', fill: '#A27AFA', pct: 48.4 },
    ],
  },
  {
    month: 'September',
    bars: [
      { id: 'sep-1', fill: '#FFEBAD', stroke: '#FFD03D', pct: 20.8 },
      { id: 'sep-2', fill: '#FFD03D', pct: 43.9 },
      { id: 'sep-3', fill: '#FDC4D5', stroke: '#FB84A7', pct: 59.9 },
      { id: 'sep-4', fill: '#FB84A7', pct: 100 },
      { id: 'sep-5', fill: '#D6C4FD', stroke: '#A27AFA', pct: 36.0 },
      { id: 'sep-6', fill: '#A27AFA', pct: 66.0 },
    ],
  },
];

const DONUT_LEGEND: LegendItem[] = [
  { id: 'nlq', label: 'NLQ', color: '#F65385' },
  { id: 'dash', label: 'Dash', color: '#266DF0' },
  { id: 'slack', label: 'Slack', color: '#14AED6' },
  { id: 'api', label: 'API', color: '#DE98E6' },
];

const FUNNEL_STAGES: FunnelStage[] = [
  { id: 'queries', label: 'Queries', percentage: '100%' },
  { id: 'parsed', label: 'Parsed', percentage: '96.8%' },
  { id: 'executed', label: 'Executed', percentage: '89.2%' },
  { id: 'visualized', label: 'Visualized', percentage: '72.4%' },
  { id: 'saved', label: 'Saved', percentage: '34.7%' },
];

// ─── Icons ───────────────────────────────────────────────────────────────────

function RefreshIcon() {
  return (
    <svg
      role='presentation'
      className='size-[7px] lg:size-[14px]'
      width='14'
      height='14'
      viewBox='0 0 14 14'
      fill='none'
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M11.525 4.699c.122 0 .225-.1.225-.228V1.749a.55.55 0 0 1 1.1 0V4.47c0 .731-.592 1.328-1.325 1.328H8.813a.55.55 0 0 1 0-1.1h2.712Z'
        fill='currentColor'
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M6.93 2.3C4.349 2.3 2.25 4.401 2.25 7c0 2.597 2.098 4.7 4.68 4.7a4.676 4.676 0 0 0 4.097-2.426.55.55 0 0 1 .963.531A5.776 5.776 0 0 1 6.93 12.8c-3.194 0-5.78-2.598-5.78-5.8 0-3.201 2.586-5.8 5.78-5.8 2.18 0 4.076 1.21 5.06 2.994a.55.55 0 0 1-.963.532 4.676 4.676 0 0 0-4.096-2.426Z'
        fill='currentColor'
      />
    </svg>
  );
}

function AddReportIcon() {
  return (
    <svg
      role='presentation'
      className='size-[7px] lg:size-[14px]'
      width='14'
      height='14'
      viewBox='0 0 14 14'
      fill='none'
    >
      <path
        d='M7 12.5H5.5c-1.4 0-2.1 0-2.635-.273a2.5 2.5 0 0 1-1.093-1.092C1.5 10.6 1.5 9.9 1.5 8.5v-3c0-1.4 0-2.1.272-2.635a2.5 2.5 0 0 1 1.093-1.093C3.4 1.5 4.1 1.5 5.5 1.5h3c1.4 0 2.1 0 2.635.272a2.5 2.5 0 0 1 1.092 1.093C12.5 3.4 12.5 4.1 12.5 5.5V7M4.46 5.309v4.23M7 4.46v5.078M9.54 7v1M12.5 10.75H9M10.75 9v3.5'
        stroke='#fff'
        strokeWidth='1.1'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

function WorkspacesIcon() {
  return (
    <svg
      role='presentation'
      className='size-1.5 lg:size-3'
      width='12'
      height='12'
      viewBox='0 0 12 12'
      fill='none'
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M0 4.8c0-1.68 0-2.52.327-3.162A3 3 0 0 1 1.638.327C2.28 0 3.12 0 4.8 0h2.4c1.68 0 2.52 0 3.162.327a3 3 0 0 1 1.311 1.311C12 2.28 12 3.12 12 4.8v2.4c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311C9.72 12 8.88 12 7.2 12H4.8c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311C0 9.72 0 8.88 0 7.2V4.8Zm2.494-1.371c0-.517.418-.935.935-.935h1.135c.516 0 .935.418.935.935v1.87a.935.935 0 0 1-.935.935H3.429a.935.935 0 0 1-.935-.935v-1.87Zm4.942 2.337a.935.935 0 0 0-.935.935v1.87c0 .517.419.935.935.935h1.135a.935.935 0 0 0 .936-.935v-1.87a.935.935 0 0 0-.936-.935H7.436ZM6.501 3.43c0-.517.419-.935.935-.935h1.135c.517 0 .936.418.936.935v.402a.935.935 0 0 1-.936.935H7.436a.935.935 0 0 1-.935-.935v-.402ZM3.429 7.234a.935.935 0 0 0-.935.935v.402c0 .517.418.936.935.936h1.135a.935.935 0 0 0 .935-.936V8.17a.935.935 0 0 0-.935-.935H3.429Z'
        fill='#9162F9'
      />
    </svg>
  );
}

function DealsIcon() {
  return (
    <svg
      role='presentation'
      className='h-1.5 w-[6.5px] lg:h-3 lg:w-[13px]'
      width='13'
      height='12'
      viewBox='0 0 13 12'
      fill='none'
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M.827 1.638C.5 2.28.5 3.12.5 4.8v2.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C2.78 12 3.62 12 5.3 12h2.4c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311C12.5 9.72 12.5 8.88 12.5 7.2V4.8c0-1.68 0-2.52-.327-3.162A3 3 0 0 0 10.862.327C10.22 0 9.38 0 7.7 0H5.3C3.62 0 2.78 0 2.138.327A3 3 0 0 0 .827 1.638Zm2.442 5.1V5.262c0-1.034 0-1.551.201-1.946.177-.348.46-.63.807-.807.395-.201.912-.201 1.946-.201h.554c1.034 0 1.55 0 1.946.2.347.178.63.46.807.808.2.395.2.912.2 1.946v1.476c0 1.034 0 1.551-.2 1.946-.177.348-.46.63-.807.807-.395.201-.912.201-1.946.201h-.554c-1.034 0-1.55 0-1.946-.2a1.846 1.846 0 0 1-.807-.808c-.2-.395-.2-.912-.2-1.946Zm3.693-3.23a.462.462 0 0 0-.923 0v.067a1.17 1.17 0 0 0-.762.319 1.105 1.105 0 0 0-.346.8c0 .305.127.593.346.8.218.208.509.321.808.321h.83c.069 0 .13.026.172.066.04.04.06.087.06.132a.182.182 0 0 1-.06.132.249.249 0 0 1-.172.066h-1.32a.462.462 0 1 0 0 .923h.443V7.2a.462.462 0 1 0 .923 0v-.067a1.17 1.17 0 0 0 .762-.32c.219-.208.346-.495.346-.8 0-.305-.127-.592-.346-.8a1.172 1.172 0 0 0-.808-.32h-.83a.249.249 0 0 1-.172-.067.183.183 0 0 1-.06-.132c0-.045.02-.092.06-.132a.249.249 0 0 1 .172-.065h1.301a.462.462 0 0 0 0-.923h-.424v-.066ZM4.192 8.4c0-.255.207-.462.462-.462h3.692a.462.462 0 0 1 0 .923H4.654a.462.462 0 0 1-.462-.461Z'
        fill='#FD9038'
      />
    </svg>
  );
}

function TrendUpIcon() {
  return (
    <svg
      role='presentation'
      width='12'
      height='12'
      viewBox='0 0 12 12'
      fill='none'
      className='mr-px size-1.5 lg:mr-0.5 lg:size-3'
    >
      <path
        d='M3.1715 8.82896L8.82835 3.1721M8.82835 3.1721L8.92937 7.31373M8.82835 3.1721L4.68673 3.07109'
        stroke='#075A39'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function Badge({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <span className='flex items-center gap-x-0.5 text-nowrap rounded-sm border-[0.5px] border-border px-[2.5px] py-[0.5px] pl-[1.5px] font-medium text-[6px] text-foreground leading-[8px] tracking-normal lg:gap-x-1 lg:rounded-lg lg:border lg:px-[5px] lg:py-px lg:pl-[3px] lg:text-[12px] lg:leading-4'>
      {icon}
      <span className='font-medium text-[6px] text-muted-foreground leading-[8px] tracking-normal lg:text-[12px] lg:leading-4'>
        {label}
      </span>
    </span>
  );
}

function LegendDot({ item }: { item: LegendItem }) {
  return (
    <div className='flex items-center gap-x-[3px] lg:gap-x-1.5'>
      <svg
        role='presentation'
        className='size-[5px] overflow-visible lg:size-2.5'
        viewBox='0 0 10 10'
      >
        <rect
          x='0'
          y='0'
          width='100%'
          height='100%'
          rx='4'
          fill={item.color}
          stroke={item.outlined ? '#D1D3D6' : undefined}
          strokeDasharray={item.outlined ? '1.1 2.2' : undefined}
          strokeLinecap='round'
        />
      </svg>
      <span className='font-medium text-[6px] text-muted-foreground leading-[8px] tracking-normal lg:text-[12px] lg:leading-4'>
        {item.label}
      </span>
    </div>
  );
}

function ChartCard({
  title,
  badge,
  children,
}: {
  title: string;
  badge: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className='rounded-md border-[0.5px] border-border bg-card lg:rounded-xl lg:border'>
      <div className='flex items-center gap-x-[4px] px-[5.5px] pt-[4.5px] lg:gap-x-[8px] lg:px-[11px] lg:pt-[9px]'>
        <span className='font-medium text-[7px] leading-[10px] tracking-[-0.14px] lg:text-[14px] lg:leading-5 lg:tracking-[-0.28px]'>
          {title}
        </span>
        {badge}
      </div>
      <div className='mt-[9px] flex w-full lg:mt-[18px]'>{children}</div>
    </div>
  );
}

// ─── Card 1: Revenue Growth Bar Chart ────────────────────────────────────────

function RevenueGrowthCard() {
  return (
    <ChartCard
      title='Query volume by plan tier'
      badge={<Badge icon={<WorkspacesIcon />} label='Plans' />}
    >
      <div className='flex w-full flex-col pb-[20px] lg:pb-[46px]'>
        {/* Legend */}
        <div className='flex items-center gap-x-2 self-center pt-1 lg:gap-x-4 lg:pt-2'>
          {REVENUE_LEGEND.map((item) => (
            <LegendDot key={`bar-legend-${item.id}`} item={item} />
          ))}
        </div>

        {/* Chart with Y-axis labels and bars */}
        <div className='relative grid w-full grid-cols-[auto_1fr] gap-x-[7.5px] gap-y-[9.5px] pt-[14px] pr-[9px] pl-[6.5px] lg:gap-x-[15px] lg:gap-y-[19px] lg:pt-[28px] lg:pr-[18px] lg:pl-[13px]'>
          {Y_AXIS_LABELS.map((label) => (
            <div className='contents' key={`yaxis-row-${label}`}>
              <div className='flex justify-end py-0.5 lg:py-1'>
                <span className='font-medium text-[6px] text-muted-foreground leading-[8px] tracking-normal lg:text-[12px] lg:leading-4'>
                  {label}
                </span>
              </div>
              <svg
                role='presentation'
                className='relative top-[-0.25px] h-[0.5px] w-full self-center overflow-visible lg:top-0 lg:h-px'
              >
                <line
                  className='text-border [stroke-dasharray:2_2.5] [stroke-dashoffset:-0.5] [stroke-width:0.5px] lg:[stroke-dasharray:4_5] lg:[stroke-dashoffset:-1] lg:[stroke-width:1px]'
                  x1='0'
                  y1='0.5'
                  x2='100%'
                  y2='0.5'
                  stroke='currentColor'
                  strokeLinecap='round'
                />
              </svg>
            </div>
          ))}
          <div />
          <div className='h-[0.75px] w-full bg-border lg:h-[1.5px]' />

          {/* Absolutely positioned bar overlay */}
          <div className='absolute inset-0 col-start-2 row-start-1 row-end-[8] pt-[6px] pr-[5px] pb-[0.5px] pl-[5px] lg:pt-[12px] lg:pr-[10px] lg:pb-[1px] lg:pl-[10px]'>
            <div className='relative grid h-full w-full grid-cols-3 gap-x-1.5 sm:gap-x-2.5 lg:gap-x-6'>
              {BAR_GROUPS.map((group) => (
                <div
                  key={`bargroup-${group.month}`}
                  className='relative h-full w-full'
                >
                  <div className='relative flex h-full w-full items-end justify-between overflow-hidden'>
                    {group.bars.map((bar) => (
                      <Bar key={bar.id} bar={bar} />
                    ))}
                  </div>
                  <span className='-translate-x-1/2 absolute bottom-[-14.5px] left-1/2 font-medium text-[6px] text-muted-foreground leading-[8px] tracking-normal lg:bottom-[-29px] lg:text-[12px] lg:leading-4'>
                    {group.month}
                  </span>
                </div>
              ))}

              {/* Floating tooltip */}
              <FloatingTooltip />
            </div>
          </div>
        </div>
      </div>
    </ChartCard>
  );
}

function Bar({ bar }: { bar: BarData }) {
  const isOutlined = Boolean(bar.stroke);
  return (
    <div className='w-[7px] lg:w-[14.7px]' style={{ height: `${bar.pct}%` }}>
      <svg
        role='presentation'
        className='h-full w-full'
        preserveAspectRatio='none'
        viewBox='0 0 14 100'
      >
        <path
          d='M 0.5 100 L 0.5 6.5 A 6 6 0 0 1 6.5 0.5 L 7.5 0.5 A 6 6 0 0 1 13.5 6.5 L 13.5 100 Z'
          fill={bar.fill}
          stroke={bar.stroke}
          strokeDasharray={isOutlined ? '4 4' : undefined}
          strokeDashoffset={isOutlined ? '3' : undefined}
          strokeLinecap='round'
          strokeWidth={isOutlined ? '1' : undefined}
        />
      </svg>
    </div>
  );
}

function FloatingTooltip() {
  return (
    <div className='absolute top-4 left-[58%] z-10 flex min-w-[140px] origin-top-left flex-col gap-y-1 rounded-md border border-border bg-card p-1 shadow-lg lg:top-8 lg:min-w-[280px] lg:gap-y-2 lg:rounded-xl lg:p-2'>
      <div className='flex items-center gap-1 lg:gap-2'>
        <span className='font-medium text-[7px] text-foreground leading-[10px] tracking-[-0.14px] lg:text-[14px] lg:leading-5 lg:tracking-[-0.28px]'>
          Query Volume
        </span>
        <span className='inline-flex items-center text-nowrap rounded-sm border-[#C7F4D3] border-[0.5px] bg-[#DDF9E4] px-[2.5px] py-[0.5px] pl-[3px]! font-medium text-[#075A39] text-[6px] leading-[8px] tracking-normal lg:rounded-lg lg:border lg:px-[5px] lg:py-px lg:text-[12px] lg:leading-4 dark:border-emerald-400/30 dark:bg-emerald-400/15 dark:text-emerald-300'>
          <TrendUpIcon />
          +63%
        </span>
      </div>
      <TooltipRow date='Sep 2025' value='184,291 queries' />
      <svg role='presentation' width='100%' height='1'>
        <line
          x1='0'
          y1='0.5'
          x2='100%'
          y2='0.5'
          className='text-border'
          stroke='currentColor'
          strokeDasharray='3 5'
          strokeLinecap='round'
        />
      </svg>
      <TooltipRow date='Jul 2025' value='112,847 queries' />
    </div>
  );
}

function TooltipRow({ date, value }: { date: string; value: string }) {
  return (
    <div className='flex w-full items-center gap-x-1 lg:gap-x-2'>
      <div className='flex-[0_0_1.5px] self-stretch rounded-full bg-[#FB84A7] lg:flex-[0_0_3px]' />
      <div className='flex flex-col gap-y-[3px] py-0.5 pr-0.5 lg:gap-y-1.5 lg:py-1 lg:pr-1'>
        <span className='font-medium text-[7px] text-muted-foreground leading-[10px] tracking-[-0.14px] lg:text-[14px] lg:leading-5 lg:tracking-[-0.28px]'>
          {date}
        </span>
        <div className='flex items-center gap-x-[3px] lg:gap-x-1.5'>
          <span className='font-medium text-[7px] text-muted-foreground leading-[10px] tracking-[-0.14px] lg:text-[14px] lg:leading-5 lg:tracking-[-0.28px]'>
            Plan
          </span>
          <span className='inline-flex items-center text-nowrap rounded-sm border-[0.5px] border-border bg-muted px-[2.5px] py-[0.5px] font-medium text-[6px] text-muted-foreground leading-[8px] tracking-normal lg:rounded-lg lg:border lg:px-[5px] lg:py-px lg:text-[12px] lg:leading-4'>
            Growth
          </span>
        </div>
        <div className='flex flex-wrap items-center gap-x-[3px] lg:gap-x-1.5'>
          <span className='font-medium text-[7px] text-muted-foreground leading-[10px] tracking-[-0.14px] lg:text-[14px] lg:leading-5 lg:tracking-[-0.28px]'>
            Query Volume
          </span>
          <span className='inline-flex items-center text-nowrap rounded-sm border-[0.5px] border-border bg-muted px-[2.5px] py-[0.5px] font-medium text-[6px] text-muted-foreground leading-[8px] tracking-normal lg:rounded-lg lg:border lg:px-[5px] lg:py-px lg:text-[12px] lg:leading-4'>
            {value}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Card 2: Donut Chart ─────────────────────────────────────────────────────

function ClosedWonDealsCard() {
  return (
    <ChartCard
      title='Queries by access channel'
      badge={<Badge icon={<DealsIcon />} label='Channels' />}
    >
      <div className='relative flex w-full flex-col items-center'>
        {/* Legend */}
        <div className='flex items-center gap-x-2 pt-[3px] lg:gap-x-4 lg:pt-1.5'>
          {DONUT_LEGEND.map((item) => (
            <LegendDot key={`donut-legend-${item.id}`} item={item} />
          ))}
          <div className='flex items-center gap-x-[0.5px] lg:gap-x-px'>
            <svg
              role='presentation'
              className='h-2.5 w-[10.5px] lg:h-5 lg:w-[21px]'
              width='21'
              height='20'
              viewBox='0 0 21 20'
              fill='none'
            >
              <rect x='3.25' y='3' width='6' height='6' rx='2' fill='#A27AFA' />
              <rect
                x='3.25'
                y='11'
                width='6'
                height='6'
                rx='2'
                fill='#266DF0'
              />
              <rect
                x='11.25'
                y='3'
                width='6'
                height='6'
                rx='2'
                fill='#14AED6'
              />
              <rect
                x='11.25'
                y='11'
                width='6'
                height='6'
                rx='2'
                fill='#D1D3D6'
              />
            </svg>
            <span className='font-medium text-[6px] text-muted-foreground leading-[8px] tracking-normal lg:text-[12px] lg:leading-4'>
              +3 more
            </span>
          </div>
        </div>

        {/* Donut chart */}
        <DonutChart />
      </div>
    </ChartCard>
  );
}

function DonutChart() {
  return (
    <svg
      role='presentation'
      className='mt-2 size-[120px] overflow-visible sm:mt-3 sm:size-[140px] md:mt-5 md:size-[180px] lg:mt-8 lg:size-[280px]'
      viewBox='0 0 280 280'
    >
      <path
        d='M 141.18 5.0 A 4 4 0 0 1 145.21 1.10 A 139 139 0 0 1 227.76 247.80 A 4 4 0 0 1 222.18 247.10 L 196.61 213.78 A 4 4 0 0 1 197.30 208.10 A 89 89 0 0 0 144.77 51.13 A 4 4 0 0 1 140.81 47.00 Z'
        fill='#F65385'
      />
      <path
        d='M 220.30 248.52 A 4 4 0 0 1 219.43 254.07 A 139 139 0 0 1 48.17 244.34 A 4 4 0 0 1 47.93 238.73 L 76.57 208.02 A 4 4 0 0 1 82.29 207.75 A 89 89 0 0 0 189.67 213.85 A 4 4 0 0 1 195.32 214.76 Z'
        fill='#266DF0'
      />
      <path
        d='M 46.22 237.11 A 4 4 0 0 1 40.61 237.17 A 139 139 0 0 1 13.67 197.97 A 4 4 0 0 1 15.73 192.75 L 54.39 176.34 A 4 4 0 0 1 59.72 178.42 A 89 89 0 0 0 75.36 201.18 A 4 4 0 0 1 75.40 206.90 Z'
        fill='#FFD03D'
      />
      <path
        d='M 14.83 190.57 A 4 4 0 0 1 9.68 188.34 A 139 139 0 0 1 2.24 158.50 A 4 4 0 0 1 5.74 154.11 L 47.51 149.72 A 4 4 0 0 1 51.99 153.27 A 89 89 0 0 0 56.07 169.60 A 4 4 0 0 1 53.77 174.84 Z'
        fill='#FD9038'
      />
      <path
        d='M 5.51 151.77 A 4 4 0 0 1 1.24 148.13 A 139 139 0 0 1 16.54 76.14 A 4 4 0 0 1 21.93 74.55 L 58.66 94.91 A 4 4 0 0 1 60.30 100.39 A 89 89 0 0 0 51.08 143.77 A 4 4 0 0 1 47.35 148.11 Z'
        fill='#DE98E6'
      />
      <path
        d='M 23.09 72.50 A 4 4 0 0 1 21.67 67.07 A 139 139 0 0 1 47.63 36.13 A 4 4 0 0 1 53.22 36.58 L 80.22 68.76 A 4 4 0 0 1 79.79 74.46 A 89 89 0 0 0 65.00 92.08 A 4 4 0 0 1 59.46 93.50 Z'
        fill='#A27AFA'
      />
      <path
        d='M 55.04 35.09 A 4 4 0 0 1 55.67 29.50 A 139 139 0 0 1 134.79 1.10 A 4 4 0 0 1 138.82 5.01 L 139.19 47.00 A 4 4 0 0 1 135.23 51.13 A 89 89 0 0 0 87.15 68.39 A 4 4 0 0 1 81.47 67.73 Z'
        fill='#14AED6'
      />
    </svg>
  );
}

// ─── Card 3: Sales Pipeline Funnel ───────────────────────────────────────────

function SalesPipelineCard() {
  return (
    <ChartCard
      title='Query processing pipeline'
      badge={<Badge icon={<DealsIcon />} label='Pipeline' />}
    >
      <div className='flex h-[50px] w-full justify-between pt-1 pr-5 pl-4 sm:h-[70px] md:h-[100px] lg:h-[200px] lg:pt-2 lg:pr-10 lg:pl-8'>
        {FUNNEL_STAGES.map((stage) => (
          <div
            key={`funnel-${stage.id}`}
            className='flex flex-col items-center gap-1 lg:gap-2'
          >
            <span className='font-medium text-[6px] text-muted-foreground leading-[8px] tracking-normal lg:text-[12px] lg:leading-4'>
              {stage.label}
            </span>
            <span className='inline-flex items-center text-nowrap rounded-sm border-[0.5px] border-border bg-muted px-[2.5px] py-[0.5px] font-medium text-[6px] text-muted-foreground leading-[8px] tracking-normal lg:rounded-lg lg:border lg:px-[5px] lg:py-px lg:text-[12px] lg:leading-4'>
              {stage.percentage}
            </span>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}

// ─── Card 4: New Signups Cohort ──────────────────────────────────────────────

function NewSignupsCard() {
  return (
    <ChartCard
      title='Active users by onboarding cohort'
      badge={<Badge icon={<WorkspacesIcon />} label='Users' />}
    >
      <div className='flex h-[50px] w-full items-start justify-center pt-1 sm:h-[70px] md:h-[100px] lg:h-[200px] lg:pt-2'>
        <div className='flex items-center gap-x-2.5 lg:gap-x-5'>
          <div className='flex items-center gap-x-0.5 lg:gap-x-1'>
            <svg
              role='presentation'
              className='h-px w-[7px] lg:h-0.5 lg:w-[15px]'
              width='15'
              height='2'
              viewBox='0 0 15 2'
              fill='none'
            >
              <path
                d='M1.75 1h12'
                stroke='#94B9FF'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeDasharray='2 3'
              />
            </svg>
            <span className='font-medium text-[7px] text-muted-foreground leading-[10px] tracking-[-0.14px] lg:text-[14px] lg:leading-5 lg:tracking-[-0.28px]'>
              MAU 2025
            </span>
          </div>
          <div className='flex items-center gap-x-0.5 lg:gap-x-1'>
            <svg
              role='presentation'
              className='h-px w-[7px] lg:h-0.5 lg:w-[15px]'
              width='15'
              height='2'
              viewBox='0 0 15 2'
              fill='none'
            >
              <path
                d='M1.75 1h12'
                stroke='#266DF0'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
            <span className='font-medium text-[7px] text-muted-foreground leading-[10px] tracking-[-0.14px] lg:text-[14px] lg:leading-5 lg:tracking-[-0.28px]'>
              MAU 2026
            </span>
          </div>
        </div>
      </div>
    </ChartCard>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function ReportingContent() {
  return (
    <div className='h-full w-full overflow-hidden bg-card'>
      {/* Top toolbar */}
      <div className='relative z-10 border-border border-b-[0.5px] bg-card lg:border-b'>
        <div className='flex items-center justify-end px-1.5 pt-[5px] pb-[4.5px] lg:px-3 lg:pt-2.5 lg:pb-[9px]'>
          <div className='flex items-center gap-x-1 lg:gap-x-2'>
            <button
              type='button'
              className='flex items-center gap-[3px] rounded-sm bg-card py-0.5 pr-[4.5px] pl-[3px] shadow-[0px_0px_2px_0px_#E0E0E0,0px_2px_4px_-2px_rgba(24,39,75,0.02),0px_4px_4px_-2px_rgba(24,39,75,0.06)] lg:gap-1.5 lg:rounded-lg lg:py-1 lg:pr-[9px] lg:pl-1.5 lg:shadow-[0px_0px_1px_0px_#E0E0E0,0px_1px_2px_-1px_rgba(24,39,75,0.02),0px_2px_2px_-1px_rgba(24,39,75,0.06)]'
            >
              <RefreshIcon />
              <span className='font-medium text-[7px] leading-[10px] tracking-[-0.14px] lg:text-[14px] lg:leading-5 lg:tracking-[-0.28px]'>
                Refresh data
              </span>
            </button>
            <button
              type='button'
              className='flex items-center rounded-sm border-[#2666DC] border-[0.5px] bg-[#266DF0] py-[1.5px] pr-[3.5px] pl-[2.5px] shadow-[0px_1px_2px_-1px_rgba(15,107,233,0.12),0px_1.5px_3px_-1px_rgba(15,107,233,0.08)] lg:rounded-lg lg:border lg:py-[3px] lg:pr-[7px] lg:pl-[5px] lg:shadow-[0px_2px_4px_-2px_rgba(15,107,233,0.12),0px_3px_6px_-2px_rgba(15,107,233,0.08)]'
            >
              <AddReportIcon />
              <span className='ml-1.5 font-medium text-[7px] text-white leading-[10px] tracking-[-0.14px] lg:text-[14px] lg:leading-5 lg:tracking-[-0.28px]'>
                Add report
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Title section + grid */}
      <div className='px-2.5 pt-[6px] pb-1.5 sm:pt-[8px] sm:pb-2 md:pt-[11px] md:pb-2.5 lg:px-5 lg:pt-[22px] lg:pb-5'>
        <div className='flex flex-col gap-[3px] lg:gap-1.5'>
          <span className='font-semibold text-[10px] text-foreground leading-[12px] tracking-[-0.2px] lg:text-[20px] lg:leading-6 lg:tracking-[-0.4px]'>
            Platform Analytics
          </span>
          <span className='hidden font-medium text-[7px] text-muted-foreground leading-[10px] tracking-[-0.14px] sm:block lg:text-[14px] lg:leading-5 lg:tracking-[-0.28px]'>
            Overview of query volume, processing pipeline, user adoption, and
            channel distribution.
          </span>
        </div>

        <div className='mt-2 grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-1.5 lg:mt-4 lg:gap-3'>
          <RevenueGrowthCard />
          <ClosedWonDealsCard />
          <SalesPipelineCard />
          <NewSignupsCard />
        </div>
      </div>
    </div>
  );
}
