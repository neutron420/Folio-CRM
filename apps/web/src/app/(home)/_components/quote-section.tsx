'use client';

import { DotPattern } from '@/components/ui/dot-pattern';
import { TextRevealByWord } from '@/components/ui/text-reveal';

interface QuoteSectionProps {
  quote?: string;
  author?: string;
  role?: string;
  company?: string;
}

export function QuoteSection({
  quote = "The moment I logged in, I realized this was the future of intelligent workflow automation.",
  author = "William Smith",
  role = "Head of Technical Operations",
  company = "GreenTech Solutions",
}: QuoteSectionProps) {
  return (
    <div
      className="border-x relative z-10"
      style={{
        WebkitMaskImage: "linear-gradient(to bottom, transparent, black 40%)",
        maskImage: "linear-gradient(to bottom, transparent, black 40%)"
      }}
    >
      <div
        className="sticky mx-4 border-0 top-10"
        style={{ marginTop: "-65vh" }}
      >
        <DotPattern
          width={24}
          height={24}
          cx={1}
          cy={1}
          cr={1}
          className="opacity-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)]"
        />
        <TextRevealByWord
          text={`"${quote}"`}
          author={author}
          role={role}
          company={company}
        />
      </div>
    </div>
  );
}
