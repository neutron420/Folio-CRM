'use client';

import { cn } from '@/lib/utils';
import * as React from 'react';

export interface AutoScrollingCarouselItem {
  name: string;
  logo?: React.ReactNode;
  href?: string;
}

export interface AutoScrollingClientCarouselProps {
  title?: string;
  clients?: AutoScrollingCarouselItem[];
  /** Seconds for one full scroll cycle. Lower = faster. */
  speed?: number;
  className?: string;
}

const defaultClients: AutoScrollingCarouselItem[] = [
  { name: 'Vercel' },
  { name: 'Linear' },
  { name: 'Stripe' },
  { name: 'Notion' },
  { name: 'Figma' },
  { name: 'Raycast' },
  { name: 'Loom' },
  { name: 'Pitch' },
];

function Ribbon({
  items,
  speed,
  reverse,
}: {
  items: AutoScrollingCarouselItem[];
  speed: number;
  reverse: boolean;
}) {
  const tripled = [...items, ...items, ...items];

  return (
    <div
      className='overflow-hidden py-4'
      style={{
        maskImage:
          'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
        WebkitMaskImage:
          'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
      }}
    >
      <div
        className='flex w-max items-center'
        style={{
          animation: `auto-scroll-ribbon ${speed}s linear infinite`,
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      >
        {tripled.map((client, i) => (
          <div
            key={`${client.name}-${i}`}
            className='flex shrink-0 items-center justify-center pl-14 sm:pl-16'
            style={{
              filter: 'grayscale(1)',
              transition:
                'filter 0.4s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.filter = 'grayscale(0)';
              e.currentTarget.style.transform = 'scale(1.06) translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = 'grayscale(1)';
              e.currentTarget.style.transform = 'scale(1) translateY(0)';
            }}
          >
            {client.href ? (
              <a
                href={client.href}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center'
                aria-label={client.name}
              >
                {client.logo || (
                  <span className='select-none whitespace-nowrap font-semibold text-foreground text-xl tracking-tight'>
                    {client.name}
                  </span>
                )}
              </a>
            ) : (
              <span className='inline-flex items-center'>
                {client.logo || (
                  <span className='select-none whitespace-nowrap font-semibold text-foreground text-xl tracking-tight'>
                    {client.name}
                  </span>
                )}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function AutoScrollingClientCarousel({
  title = 'Trusted by leading teams',
  clients = defaultClients,
  speed = 35,
  className,
}: AutoScrollingClientCarouselProps) {
  const reversed = React.useMemo(() => [...clients].reverse(), [clients]);

  return (
    <section className={cn('py-16 md:py-24', className)}>
      <div className='mx-auto max-w-5xl px-6'>
        {title && (
          <p className='mb-8 text-center font-medium text-muted-foreground text-sm uppercase tracking-wider'>
            {title}
          </p>
        )}

        <div className='space-y-2'>
          <Ribbon items={clients} speed={speed} reverse={false} />
          <Ribbon items={reversed} speed={speed * 1.15} reverse={true} />
        </div>
      </div>
    </section>
  );
}
