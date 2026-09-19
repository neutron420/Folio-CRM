'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Section } from '@/components/section';
import Image, { type StaticImageData } from 'next/image';

import ClaudeLight from '@/public/images/logos/light/claude.svg';
import NeonLight from '@/public/images/logos/light/neon.svg';
import NextjsLight from '@/public/images/logos/light/nextjs.svg';
import OpenAILight from '@/public/images/logos/light/openai.svg';
import VercelLight from '@/public/images/logos/light/vercel.svg';

import ClaudeDark from '@/public/images/logos/dark/claude.svg';
import NeonDark from '@/public/images/logos/dark/neon.svg';
import NextjsDark from '@/public/images/logos/dark/nextjs.svg';
import OpenAIDark from '@/public/images/logos/dark/openai.svg';
import VercelDark from '@/public/images/logos/dark/vercel.svg';

interface Logo {
  name: string;
  id: number;
  light: StaticImageData;
  dark: StaticImageData;
}

// Define logo sets - each set contains unique logos that display together.
const logoSets: Logo[][] = [
  // Set 1
  [
    { name: 'Vercel', id: 1, light: VercelLight, dark: VercelDark },
    { name: 'OpenAI', id: 2, light: OpenAILight, dark: OpenAIDark },
    { name: 'Claude', id: 3, light: ClaudeLight, dark: ClaudeDark },
    { name: 'Next.js', id: 4, light: NextjsLight, dark: NextjsDark },
    { name: 'Neon', id: 5, light: NeonLight, dark: NeonDark },
  ],
  // Set 2 - shuffled order
  [
    { name: 'Claude', id: 3, light: ClaudeLight, dark: ClaudeDark },
    { name: 'Neon', id: 5, light: NeonLight, dark: NeonDark },
    { name: 'Vercel', id: 1, light: VercelLight, dark: VercelDark },
    { name: 'OpenAI', id: 2, light: OpenAILight, dark: OpenAIDark },
    { name: 'Next.js', id: 4, light: NextjsLight, dark: NextjsDark },
  ],
  // Set 3 - different order
  [
    { name: 'Next.js', id: 4, light: NextjsLight, dark: NextjsDark },
    { name: 'Vercel', id: 1, light: VercelLight, dark: VercelDark },
    { name: 'Neon', id: 5, light: NeonLight, dark: NeonDark },
    { name: 'Claude', id: 3, light: ClaudeLight, dark: ClaudeDark },
    { name: 'OpenAI', id: 2, light: OpenAILight, dark: OpenAIDark },
  ],
];

interface LogoItemProps {
  logo: Logo;
  index: number;
}

const LogoItem: React.FC<LogoItemProps> = React.memo(({ logo, index }) => {
  return (
    <motion.div
      className="relative h-8 w-20 sm:h-10 sm:w-24 md:h-12 md:w-28 flex items-center justify-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.05,
        duration: 0.4,
        ease: 'easeOut',
      }}
    >
      {/* Light mode logo */}
      <Image
        src={logo.light}
        alt={logo.name}
        className="h-6 w-20 sm:h-7 sm:w-24 md:h-8 md:w-28 object-contain dark:hidden"
        width={112}
        height={32}
      />
      {/* Dark mode logo */}
      <Image
        src={logo.dark}
        alt={logo.name}
        className="h-6 w-20 sm:h-7 sm:w-24 md:h-8 md:w-28 object-contain hidden dark:block"
        width={112}
        height={32}
      />
    </motion.div>
  );
});

LogoItem.displayName = 'LogoItem';

function LogoCarousel() {
  const [currentSetIndex, setCurrentSetIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentSetIndex((prev) => (prev + 1) % logoSets.length);
    }, 3000); // Switch entire set every 3 seconds

    return () => clearInterval(intervalId);
  }, []);

  const currentSet = logoSets[currentSetIndex] ?? logoSets[0]!;

  return (
    <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-8 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSetIndex}
          className="flex items-center justify-center gap-4 sm:gap-6 md:gap-8"
          initial={{ y: '40%', opacity: 0, filter: 'blur(10px)' }}
          animate={{
            y: '0%',
            opacity: 1,
            filter: 'blur(0px)',
            transition: {
              type: 'spring',
              stiffness: 260,
              damping: 25,
              mass: 1,
              staggerChildren: 0.05,
            },
          }}
          exit={{
            y: '-40%',
            opacity: 0,
            filter: 'blur(8px)',
            transition: {
              type: 'tween',
              ease: 'easeIn',
              duration: 0.3,
            },
          }}
        >
          {currentSet.map((logo, index) => (
            <LogoItem key={`${currentSetIndex}-${logo.id}`} logo={logo} index={index} />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export const Customers = ({
  count,
}: {
  count: number;
}) => {
  const closest = Math.floor(count / 50) * 50;

  return (
    <Section className="relative flex flex-col items-center justify-between gap-8 p-6 py-10 sm:flex-row sm:gap-12 md:py-12">
      <p className="text-muted-foreground text-center sm:text-left sm:max-w-xs">
        {closest}+ companies trust Folio to query their data without writing SQL.
      </p>
      <div className="flex-1 flex items-center justify-center sm:justify-end">
        <LogoCarousel />
      </div>
    </Section>
  );
};
