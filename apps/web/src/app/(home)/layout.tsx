import type { ReactNode } from 'react';

import { HeroHeader } from '@/components/hero-header';
import { SiteFooter } from '@/components/site-footer';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <HeroHeader />
      <main className='flex min-h-screen flex-col'>{children}</main>
      <SiteFooter />
    </>
  );
};

export default Layout;
