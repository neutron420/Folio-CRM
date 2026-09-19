import { Icons } from '@/components/icons/icons';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type React from 'react';

export default function CTA(): React.ReactElement {
  return (
    <section className='relative overflow-hidden'>
      {/* Top border */}
      <div className='border-t border-dashed border-border' />

      <div className='relative z-10 px-6 sm:px-8 lg:px-12 py-20 md:py-28 lg:py-32'>
        <div className='grid gap-8 sm:grid-cols-2'>
          <h2 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium text-foreground max-w-xl'>
            From question to dashboard in minutes
          </h2>

          <div className='flex w-full items-center'>
            <div className='max-w-xl space-y-4'>
              <p className='text-muted-foreground text-sm md:text-base'>
                Join thousands of teams using Folio to query their warehouse,
                ship dashboards, and answer data questions in plain English — no SQL required.
              </p>
              <div className='flex flex-row gap-3'>
                <Button size='lg' className='group gap-4' asChild>
                  <Link href='/contact'>
                    Start Free{' '}
                    <Icons.arrowUpRight className='group-hover:-rotate-12 size-4 transition-transform' />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Gradient glow - CSS only, no JS animation */}
        <div className='z-0 absolute inset-0 h-full w-full pointer-events-none animate-fade-in'>
          <div
            className='pointer-events-none absolute right-0 bottom-0 h-[400px] w-[450px] sm:h-[500px] sm:w-[550px] md:h-[600px] md:w-[650px] lg:h-[700px] lg:w-[750px] translate-x-1/2 translate-y-1/2 select-none'
            style={{
              background: 'radial-gradient(ellipse at center, rgba(37, 99, 235, 0.5) 0%, rgba(37, 99, 235, 0.15) 45%, transparent 75%)',
            }}
          />
        </div>
      </div>
    </section>
  );
}
