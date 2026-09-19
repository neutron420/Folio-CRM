"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

// Context for InlineCitation
interface InlineCitationContextValue {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const InlineCitationContext = React.createContext<InlineCitationContextValue | null>(null);

function useInlineCitationContext() {
  const context = React.useContext(InlineCitationContext);
  if (!context) {
    throw new Error("InlineCitation components must be used within an InlineCitation provider");
  }
  return context;
}

// Context for Carousel
interface CarouselContextValue {
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  totalItems: number;
  setTotalItems: React.Dispatch<React.SetStateAction<number>>;
}

const CarouselContext = React.createContext<CarouselContextValue | null>(null);

function useCarouselContext() {
  const context = React.useContext(CarouselContext);
  if (!context) {
    throw new Error("Carousel components must be used within a Carousel provider");
  }
  return context;
}

// Main InlineCitation wrapper
function InlineCitation({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <InlineCitationContext.Provider value={{ isOpen, setIsOpen }}>
      <span className={cn("relative inline", className)}>{children}</span>
    </InlineCitationContext.Provider>
  );
}

// The highlighted citation text
function InlineCitationText({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-0.5 rounded",
        className
      )}
    >
      {children}
    </span>
  );
}

// Card container
function InlineCitationCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { isOpen } = useInlineCitationContext();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "absolute left-0 top-full z-50 mt-2 w-72 rounded-lg border bg-popover p-3 shadow-lg",
            className
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Trigger button showing source count
function InlineCitationCardTrigger({
  sources,
  className,
}: {
  sources: string[];
  className?: string;
}) {
  const { isOpen, setIsOpen } = useInlineCitationContext();

  return (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className={cn(
        "ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-500 px-1.5 text-[10px] font-medium text-white hover:bg-blue-600 transition-colors",
        className
      )}
    >
      {sources.length}
    </button>
  );
}

// Card body
function InlineCitationCardBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("", className)}>{children}</div>;
}

// Carousel wrapper
function InlineCitationCarousel({
  children,
  className,
  autoPlay = false,
  autoPlayInterval = 3000,
}: {
  children: React.ReactNode;
  className?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [totalItems, setTotalItems] = React.useState(0);

  // Auto-play functionality
  React.useEffect(() => {
    if (!autoPlay || totalItems === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalItems);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, totalItems]);

  return (
    <CarouselContext.Provider value={{ currentIndex, setCurrentIndex, totalItems, setTotalItems }}>
      <div className={cn("", className)}>{children}</div>
    </CarouselContext.Provider>
  );
}

// Carousel header with controls
function InlineCitationCarouselHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-1 mb-2", className)}>
      {children}
    </div>
  );
}

// Previous button
function InlineCitationCarouselPrev({ className }: { className?: string }) {
  const { currentIndex, setCurrentIndex, totalItems } = useCarouselContext();

  return (
    <button
      onClick={() => setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems)}
      className={cn(
        "flex h-6 w-6 items-center justify-center rounded hover:bg-muted transition-colors",
        className
      )}
    >
      <ChevronLeft className="size-4" />
    </button>
  );
}

// Next button
function InlineCitationCarouselNext({ className }: { className?: string }) {
  const { currentIndex, setCurrentIndex, totalItems } = useCarouselContext();

  return (
    <button
      onClick={() => setCurrentIndex((prev) => (prev + 1) % totalItems)}
      className={cn(
        "flex h-6 w-6 items-center justify-center rounded hover:bg-muted transition-colors",
        className
      )}
    >
      <ChevronRight className="size-4" />
    </button>
  );
}

// Index indicator
function InlineCitationCarouselIndex({ className }: { className?: string }) {
  const { currentIndex, totalItems } = useCarouselContext();

  return (
    <span className={cn("text-xs text-muted-foreground ml-auto", className)}>
      {currentIndex + 1} / {totalItems}
    </span>
  );
}

// Carousel content wrapper
function InlineCitationCarouselContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { setTotalItems, currentIndex } = useCarouselContext();
  const childrenArray = React.Children.toArray(children);

  React.useEffect(() => {
    setTotalItems(childrenArray.length);
  }, [childrenArray.length, setTotalItems]);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {childrenArray[currentIndex]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// Carousel item
function InlineCitationCarouselItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("", className)}>{children}</div>;
}

// Source display
function InlineCitationSource({
  title,
  url,
  description,
  className,
}: {
  title: string;
  url: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1", className)}>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
      >
        {title}
        <ExternalLink className="size-3" />
      </a>
      {description && (
        <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>
      )}
      <p className="text-[10px] text-muted-foreground/70 truncate">{url}</p>
    </div>
  );
}

export {
  InlineCitation,
  InlineCitationCard,
  InlineCitationCardBody,
  InlineCitationCardTrigger,
  InlineCitationCarousel,
  InlineCitationCarouselContent,
  InlineCitationCarouselHeader,
  InlineCitationCarouselIndex,
  InlineCitationCarouselItem,
  InlineCitationCarouselNext,
  InlineCitationCarouselPrev,
  InlineCitationSource,
  InlineCitationText,
};
