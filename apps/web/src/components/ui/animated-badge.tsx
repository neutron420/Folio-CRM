'use client';

import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface AnimatedBadgeProps {
  text: string;
  href?: string;
  className?: string;
}

export function AnimatedBadge({
  text,
  href = '#',
  className,
}: AnimatedBadgeProps) {
  const content = (
    <span className='relative z-10 flex items-center gap-1 px-4 py-1.5 font-medium text-foreground text-sm'>
      {text}
      <ChevronRight className='size-4' />
    </span>
  );

  return (
    <div className={cn('relative inline-flex', className)}>
      {/* Rotating beam border */}
      <div className='-inset-[1px] absolute overflow-hidden rounded-full'>
        <div
          className='absolute inset-0 animate-spin-slow'
          style={{
            background:
              'conic-gradient(from 0deg, transparent 0%, transparent 70%, #3b82f6 85%, #10b981 95%, transparent 100%)',
          }}
        />
      </div>

      {/* Inner background */}
      <div className='relative rounded-full border border-border/50 bg-background'>
        {href ? (
          <Link
            href={href}
            className='block'
            {...(/^https?:\/\//.test(href)
              ? { target: '_blank', rel: 'noopener noreferrer' }
              : {})}
          >
            {content}
          </Link>
        ) : (
          content
        )}
      </div>
    </div>
  );
}
