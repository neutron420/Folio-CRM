'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import { Logo } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const menuItems = [
  { name: 'Features', href: '#features' },
  { name: 'Solution', href: '#solution' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'About', href: '#about' },
];

export function HeroHeader() {
  const [menuState, setMenuState] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header>
      <nav
        data-state={menuState && 'active'}
        className='fixed z-20 w-full px-2'
      >
        <div
          className={cn(
            'mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12',
            isScrolled &&
              'max-w-4xl rounded-2xl border bg-background/50 backdrop-blur-lg lg:px-5',
          )}
        >
          <div className='relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4'>
            <div className='flex w-full justify-between lg:w-auto'>
              <Link
                href='/'
                aria-label='Folio CRM home'
                className='flex items-center gap-2'
              >
                <Logo className='size-8' />
                <span className='font-semibold text-foreground text-sm'>
                  Folio CRM
                </span>
              </Link>

              <button
                type='button'
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState ? 'Close Menu' : 'Open Menu'}
                className='-m-2.5 -mr-4 relative z-20 block cursor-pointer p-2.5 lg:hidden'
              >
                <Menu className='m-auto size-6 duration-200 in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0' />
                <X className='-rotate-180 absolute inset-0 m-auto size-6 scale-0 opacity-0 duration-200 in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100' />
              </button>
            </div>

            <div className='absolute inset-0 m-auto hidden size-fit lg:block'>
              <ul className='flex gap-8 text-sm'>
                {menuItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className='block text-muted-foreground duration-150 hover:text-accent-foreground'
                    >
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className='mb-6 hidden w-full flex-wrap items-stretch justify-end gap-6 rounded-3xl border bg-background p-6 shadow-2xl shadow-zinc-300/20 in-data-[state=active]:block md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:items-center lg:gap-6 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none lg:in-data-[state=active]:flex dark:shadow-none dark:lg:bg-transparent'>
              <div className='lg:hidden'>
                <ul className='space-y-6 text-base'>
                  {menuItems.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        onClick={() => setMenuState(false)}
                        className='block text-muted-foreground duration-150 hover:text-accent-foreground'
                      >
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className='flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto'>
                <ThemeToggle className='self-start sm:self-auto' />
                <Button
                  asChild
                  variant='outline'
                  size='sm'
                  className={cn('w-full sm:w-auto', isScrolled && 'lg:hidden')}
                >
                  <Link href='/login' onClick={() => setMenuState(false)}>
                    <span>Login</span>
                  </Link>
                </Button>
                <Button
                  asChild
                  size='sm'
                  className={cn('w-full sm:w-auto', isScrolled && 'lg:hidden')}
                >
                  <Link href='/login' onClick={() => setMenuState(false)}>
                    <span>Sign Up</span>
                  </Link>
                </Button>
                <Button
                  asChild
                  size='sm'
                  className={cn('hidden', isScrolled && 'lg:inline-flex')}
                >
                  <Link href='/login'>
                    <span>Get Started</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
