"use client";

import { useRef } from "react";
import type { FC, ReactNode } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import type { MotionValue } from "motion/react";

import { cn } from "@/lib/utils";

interface TextRevealByWordProps {
  text: string;
  className?: string;
  author?: string;
  role?: string;
  company?: string;
}

const TextRevealByWord: FC<TextRevealByWordProps> = ({
  text,
  className,
  author,
  role,
  company,
}) => {
  const targetRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });
  const words = text.split(" ");

  return (
    <div ref={targetRef} className={cn("relative h-[200vh]", className)}>
      <div
        className={
          "sticky max-w-4xl top-0 mx-auto flex flex-col h-[100vh] items-center justify-center bg-transparent"
        }
      >
        <p
          className={
            "flex flex-wrap p-5 text-xl justify-center text-center font-medium text-black/20 dark:text-white/20 sm:text-3xl md:p-8 md:text-[2rem] lg:p-10 lg:text-[2.5rem] xl:text-[3.1rem]"
          }
        >
          {words.map((word, i) => {
            const start = i / words.length;
            const end = start + 0.03;
            return (
              <Word key={i} progress={scrollYProgress} range={[start, end]}>
                {word}
              </Word>
            );
          })}
        </p>
        {author && (
          <div className="mt-8 flex flex-col items-center gap-1">
            <p className="text-sm sm:text-base font-semibold text-muted-foreground">
              {author}
            </p>
            {role && company && (
              <p className="text-xs sm:text-sm text-muted-foreground/70">
                {role} · {company}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

interface WordProps {
  children: ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
}

const Word: FC<WordProps> = ({ children, progress, range }) => {
  const opacity = useTransform(progress, range, [0, 1]);
  return (
    <span className="xl:lg-3 relative mx-1 lg:mx-2.5">
      <span className={"absolute opacity-30"}>{children}</span>
      <motion.span
        style={{ opacity: opacity }}
        className={"text-black dark:text-white"}
      >
        {children}
      </motion.span>
    </span>
  );
};

export { TextRevealByWord };
