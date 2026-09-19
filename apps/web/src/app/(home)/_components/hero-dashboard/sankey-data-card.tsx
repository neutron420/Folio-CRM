'use client';

import { Sankey, Tooltip } from 'recharts';

interface SankeyData {
  nodes: { name: string }[];
  links: { source: number; target: number; value: number }[];
}

interface SankeyDataCardProps {
  letter?: string;
  title?: string;
  subtitle?: string;
  totalValue?: string;
  trend?: string;
  sourcePill?: string;
  data?: SankeyData;
}

// AAPL FY24 revenue flow ($ in B, simplified)
const DEFAULT_SANKEY_DATA: SankeyData = {
  nodes: [
    { name: 'iPhone' },
    { name: 'Services' },
    { name: 'Mac' },
    { name: 'Wearables' },
    { name: 'iPad' },
    { name: 'Revenue' },
    { name: 'COGS' },
    { name: 'OpEx' },
    { name: 'Net Income' },
  ],
  links: [
    { source: 0, target: 5, value: 201 },
    { source: 1, target: 5, value: 96 },
    { source: 2, target: 5, value: 30 },
    { source: 3, target: 5, value: 37 },
    { source: 4, target: 5, value: 27 },
    { source: 5, target: 6, value: 211 },
    { source: 5, target: 7, value: 60 },
    { source: 5, target: 8, value: 120 },
  ],
};

const NODE_COLORS = [
  '#266DF0',
  '#9162F9',
  '#0FC27B',
  '#FB84A7',
  '#FFD03D',
  '#242629',
  '#FD9038',
  '#A27AFA',
  '#0FC27B',
];

interface SankeyNodeProps {
  x: number;
  y: number;
  width: number;
  height: number;
  index: number;
  payload: { name: string; sourceLinks?: unknown[] };
  containerWidth: number;
}

function SankeyNode({
  x,
  y,
  width,
  height,
  index,
  payload,
  containerWidth,
}: SankeyNodeProps) {
  const isSink = !payload.sourceLinks || payload.sourceLinks.length === 0;
  const labelOnRight = isSink || x + width > containerWidth - 80;
  const color = NODE_COLORS[index % NODE_COLORS.length];

  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={color} rx={2} />
      <text
        x={labelOnRight ? x + width + 6 : x - 6}
        y={y + height / 2}
        textAnchor={labelOnRight ? 'start' : 'end'}
        dominantBaseline='middle'
        fontSize={10}
        fontWeight={500}
        className='fill-foreground'
      >
        {payload.name}
      </text>
    </g>
  );
}

interface SankeyLinkProps {
  sourceX: number;
  targetX: number;
  sourceY: number;
  targetY: number;
  sourceControlX: number;
  targetControlX: number;
  linkWidth: number;
  index: number;
  payload: { source: { sourceNodeIndex?: number }; target: unknown };
}

function SankeyLinkShape({
  sourceX,
  targetX,
  sourceY,
  targetY,
  sourceControlX,
  targetControlX,
  linkWidth,
  payload,
}: SankeyLinkProps) {
  const sourceIdx = payload.source.sourceNodeIndex ?? 0;
  const color = NODE_COLORS[sourceIdx % NODE_COLORS.length];
  const path = `M${sourceX},${sourceY}C${sourceControlX},${sourceY} ${targetControlX},${targetY} ${targetX},${targetY}`;
  return (
    <path
      d={path}
      fill='none'
      stroke={color}
      strokeWidth={Math.max(1, linkWidth)}
      strokeOpacity={0.35}
    />
  );
}

export function SankeyDataCard({
  letter = 'AAPL',
  title = 'Revenue flow analysis',
  subtitle = 'FY24 segment → income · $ in B',
  totalValue = '$391B',
  trend = '+2.0% YoY',
  sourcePill = 'portfolio_db → revenue_segments',
  data = DEFAULT_SANKEY_DATA,
}: SankeyDataCardProps = {}) {
  const width = 440;
  const height = 200;

  return (
    <div className='flex w-full max-w-[460px] overflow-hidden rounded-[10px] border-[0.66px] border-[rgba(56,62,71,0.01)] bg-card shadow-[0px_11.5px_3.3px_0px_rgba(127,135,144,0),0px_7.4px_3.3px_0px_rgba(127,135,144,0.01),0px_4.1px_2.5px_0px_rgba(127,135,144,0.05),0px_1.6px_1.6px_0px_rgba(127,135,144,0.09),0px_0.8px_0.8px_0px_rgba(127,135,144,0.1),0px_0px_0px_1px_rgba(0,0,0,0.04)]'>
      {/* Green status bar */}
      <div className='relative w-[13px] shrink-0'>
        <div className='-translate-x-1/2 absolute top-[10px] right-0 bottom-[10px] left-1/2 ml-1 w-[3px] rounded-full bg-[#0FC27B]' />
      </div>

      <div className='flex min-w-0 flex-1 flex-col p-3'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <div className='flex size-8 items-center justify-center rounded-lg bg-muted'>
              <span className='font-semibold text-foreground text-xs'>
                {letter}
              </span>
            </div>
            <div className='flex flex-col'>
              <span className='font-medium text-foreground text-sm leading-5'>
                {title}
              </span>
              <span className='font-medium text-muted-foreground text-xs leading-4'>
                {subtitle}
              </span>
            </div>
          </div>
          <div className='flex flex-col items-end'>
            <span className='font-semibold text-foreground text-sm leading-5'>
              {totalValue}
            </span>
            <span className='font-medium text-[#0FC27B] text-xs leading-4'>
              {trend}
            </span>
          </div>
        </div>

        {/* Sankey chart */}
        <div className='mt-3 w-full overflow-hidden'>
          <Sankey
            width={width}
            height={height}
            data={data}
            nodePadding={12}
            nodeWidth={8}
            margin={{ top: 5, right: 70, bottom: 5, left: 60 }}
            // biome-ignore lint/suspicious/noExplicitAny: recharts node prop typing
            node={(props: any) => (
              <SankeyNode {...props} containerWidth={width} />
            )}
            // biome-ignore lint/suspicious/noExplicitAny: recharts link prop typing
            link={(props: any) => <SankeyLinkShape {...props} />}
          >
            <Tooltip />
          </Sankey>
        </div>

        {/* Source badge */}
        <div className='mt-2.5 flex items-center gap-1.5'>
          <span className='inline-flex items-center gap-1 rounded-md bg-[#F0F7FF] px-1.5 py-0.5 font-medium text-[#266DF0] text-xs ring-1 ring-[#D6E5FF] dark:bg-blue-400/10 dark:ring-blue-400/30'>
            <DatabaseSmallIcon />
            {sourcePill}
          </span>
        </div>
      </div>
    </div>
  );
}

function DatabaseSmallIcon() {
  return (
    <svg
      role='presentation'
      className='size-3 shrink-0'
      viewBox='0 0 14 14'
      fill='none'
    >
      <ellipse
        cx='7'
        cy='3.5'
        rx='5'
        ry='2'
        stroke='#266DF0'
        strokeWidth='1.1'
      />
      <path
        d='M2 3.5v3.25C2 8.05 4.24 9.25 7 9.25s5-1.2 5-2.5V3.5'
        stroke='#266DF0'
        strokeWidth='1.1'
        strokeLinecap='round'
      />
      <path
        d='M2 6.75V10c0 1.3 2.24 2.5 5 2.5s5-1.2 5-2.5V6.75'
        stroke='#266DF0'
        strokeWidth='1.1'
        strokeLinecap='round'
      />
    </svg>
  );
}
