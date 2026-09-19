import CTA from '../_components/cta';
import Pricing from '../_components/pricing';

export default function PricingPage() {
  return (
    <div className="container mx-auto">
      {/* Outer border - continuous dashed line */}
      <div className="border-x border-dashed border-border">
        {/* Inner border with gap - continuous dashed line */}
        <div className="mx-3 sm:mx-4 lg:mx-6 border-x border-dashed border-border">

          {/* Header */}
          <div className="pt-24 pb-12 md:pt-32 md:pb-16 px-6 sm:px-8 lg:px-12">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-balance text-4xl font-bold md:text-5xl lg:text-6xl lg:tracking-tight">
                Pricing that scales with you
              </h1>
              <p className="text-muted-foreground mx-auto mt-6 max-w-xl text-balance text-lg">
                Start free with 100 queries a month. Upgrade as your team&apos;s data needs grow.
              </p>
            </div>
          </div>

          {/* Pricing Section */}
          <Pricing />

          {/* CTA Section */}
          <CTA />

        </div>
      </div>
    </div>
  );
}
