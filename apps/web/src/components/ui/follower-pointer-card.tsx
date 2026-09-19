'use client';

import {
  AnimatePresence,
  motion,
  type MotionValue,
  useMotionValue,
} from 'motion/react';
import * as React from 'react';

import { cn } from '@/lib/utils';

interface FollowerPointerCardProps {
  children: React.ReactNode;
  className?: string;
  title?: React.ReactNode;
}

export function FollowerPointerCard({
  children,
  className,
  title,
}: FollowerPointerCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const ref = React.useRef<HTMLDivElement>(null);
  const [rect, setRect] = React.useState<DOMRect | null>(null);
  const [isInside, setIsInside] = React.useState(false);

  React.useEffect(() => {
    const updateRect = () => {
      if (ref.current) {
        setRect(ref.current.getBoundingClientRect());
      }
    };
    updateRect();
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, { passive: true });
    return () => {
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (rect) {
      x.set(e.clientX - rect.left);
      y.set(e.clientY - rect.top);
    }
  };

  return (
    <div
      ref={ref}
      onMouseLeave={() => setIsInside(false)}
      onMouseEnter={() => setIsInside(true)}
      onMouseMove={handleMouseMove}
      style={{ cursor: 'none' }}
      className={cn('relative', className)}
    >
      <AnimatePresence>
        {isInside && <FollowPointer x={x} y={y} title={title} />}
      </AnimatePresence>
      {children}
    </div>
  );
}

function FollowPointer({
  x,
  y,
  title,
}: {
  x: MotionValue<number>;
  y: MotionValue<number>;
  title?: React.ReactNode;
}) {
  return (
    <motion.div
      className='pointer-events-none absolute z-50 h-4 w-4'
      style={{ top: y, left: x }}
      initial={{ scale: 1, opacity: 1 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
    >
      <svg
        viewBox='0 0 16 16'
        className='-translate-x-[12px] -translate-y-[10px] -rotate-[70deg] h-6 w-6 fill-blue-500 stroke-blue-600'
        strokeWidth='1'
      >
        <path d='M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z' />
      </svg>
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        className='min-w-max whitespace-nowrap rounded-full bg-blue-500 px-2 py-1 font-medium text-[11px] text-white shadow-lg'
      >
        {title || 'Anna'}
      </motion.div>
    </motion.div>
  );
}
