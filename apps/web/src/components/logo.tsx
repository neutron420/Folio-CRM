import Image from 'next/image';

import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <Image
      src='/logo.png'
      alt='Folio'
      width={64}
      height={64}
      className={cn('size-7 object-contain dark:invert', className)}
    />
  );
}
