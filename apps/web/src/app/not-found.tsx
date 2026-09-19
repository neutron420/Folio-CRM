import { Icons } from '@/components/icons/icons';
import { Header } from '@/components/sections/header';
import { Button } from '@/components/ui/button';
import { createMetadata } from '@/lib/metadata';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { getLinks } from 'fumadocs-ui/layouts/shared';
import type { Metadata } from 'next';
import Link from 'next/link';
import { baseOptions, linkItems } from './layout.config';

export default function NotFound() {
  return (
    <HomeLayout
      {...baseOptions}
      links={linkItems}
      nav={{
        component: (
          <Header
            finalLinks={getLinks(linkItems, baseOptions.githubUrl)}
            {...baseOptions}
          />
        ),
      }}
      className='pt-0'
    >
      <main className='flex flex-1'>
        <div className='container relative mx-auto flex min-h-full flex-1 items-center justify-center border-border border-x border-b border-dashed overflow-hidden'>
          {/* Gradient effects */}
          <div className='absolute inset-0 pointer-events-none'>
            <div
              className='absolute right-0 top-0 h-[400px] w-[450px] translate-x-1/3 -translate-y-1/3'
              style={{
                background: 'radial-gradient(ellipse at center, rgba(37, 99, 235, 0.3) 0%, rgba(37, 99, 235, 0.08) 45%, transparent 75%)',
              }}
            />
            <div
              className='absolute left-0 bottom-0 h-[400px] w-[450px] -translate-x-1/3 translate-y-1/3'
              style={{
                background: 'radial-gradient(ellipse at center, rgba(37, 99, 235, 0.25) 0%, rgba(37, 99, 235, 0.08) 45%, transparent 75%)',
              }}
            />
          </div>

          <div className='relative z-10 flex flex-col items-center justify-center px-6 py-16 text-center'>
            {/* 404 Number */}
            <div className='mb-6'>
              <h1 className='font-bold text-8xl sm:text-9xl md:text-[12rem] tracking-tighter text-foreground/10 select-none'>
                404
              </h1>
            </div>

            {/* Message */}
            <div className='-mt-12 sm:-mt-16 md:-mt-20 space-y-3'>
              <h2 className='font-semibold text-2xl sm:text-3xl md:text-4xl tracking-tight text-foreground'>
                Page Not Found
              </h2>
              <p className='max-w-md text-muted-foreground text-sm sm:text-base'>
                The page you&apos;re looking for doesn&apos;t exist or has been moved.
                Let&apos;s get you back on track.
              </p>
            </div>

            {/* Action Buttons */}
            <div className='mt-8 flex flex-col sm:flex-row gap-3'>
              <Button size='lg' className='group gap-3' asChild>
                <Link href='/'>
                  <Icons.home className='h-4 w-4' />
                  Back to Home
                </Link>
              </Button>
              <Button size='lg' variant='outline' className='group gap-3 bg-muted/50' asChild>
                <Link href='/contact'>
                  Contact Support
                  <Icons.arrowUpRight className='group-hover:-rotate-12 h-4 w-4 transition-transform' />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </HomeLayout>
  );
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const description = 'The page you are looking for could not be found. Let us help you get back on track.';

  return createMetadata({
    title: 'Not Found',
    description,
  });
}
