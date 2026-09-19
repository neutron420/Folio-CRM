import { description, owner } from '@/app/layout.config';
import { InlineLink } from '@/components/inline-link';
import { Logo } from '@/components/logo';
import { cn } from '@/lib/utils';
import { FaGithub, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';
import { HiOutlineMail } from 'react-icons/hi';
import { ActiveLink } from '../active-link';

export function Footer() {
  return (
    <footer
      className={cn(
        'container mx-auto flex flex-col gap-4',
        'border-border border-b border-dashed',
        'gap-12 px-8 py-16',
      )}
    >
      {/* Top Section - Brand and Social */}
      <div className='grid gap-8 lg:grid-cols-2'>
        <div className='flex flex-col items-start gap-4'>
          <div className='flex items-center gap-2.5'>
            <Logo className='size-12' />
            <span className='font-semibold text-foreground text-xl'>Folio</span>
          </div>
          <p className='max-w-md text-muted-foreground text-sm'>
            {description}
          </p>
          <div className='mt-2 flex gap-4'>
            <InlineLink
              href='https://twitter.com'
              className='text-muted-foreground transition-colors hover:text-foreground'
            >
              <FaXTwitter className='size-5' />
            </InlineLink>
            <InlineLink
              href='https://linkedin.com'
              className='text-muted-foreground transition-colors hover:text-foreground'
            >
              <FaLinkedinIn className='size-5' />
            </InlineLink>
            <InlineLink
              href='https://github.com'
              className='text-muted-foreground transition-colors hover:text-foreground'
            >
              <FaGithub className='size-5' />
            </InlineLink>
            <InlineLink
              href='mailto:hello@Folio.ai'
              className='text-muted-foreground transition-colors hover:text-foreground'
            >
              <HiOutlineMail className='size-5' />
            </InlineLink>
          </div>
        </div>
      </div>

      {/* Links Section */}
      <div
        className={cn(
          'grid gap-8 text-muted-foreground text-sm sm:grid-cols-2 lg:grid-cols-4',
        )}
      >
        <div className='flex flex-col gap-4'>
          <p className='font-medium text-foreground'>Platform</p>
          <ul className='flex flex-col gap-3'>
            <li>
              <ActiveLink href={'/'}>Workflow Builder</ActiveLink>
            </li>
            <li>
              <ActiveLink href={'/'}>Integrations</ActiveLink>
            </li>
            <li>
              <ActiveLink href={'/'}>Templates</ActiveLink>
            </li>
            <li>
              <ActiveLink href={'/pricing'}>Pricing</ActiveLink>
            </li>
          </ul>
        </div>

        <div className='flex flex-col gap-4'>
          <p className='font-medium text-foreground'>Company</p>
          <ul className='flex flex-col gap-3'>
            <li>
              <ActiveLink href={'/'}>About</ActiveLink>
            </li>
            <li>
              <ActiveLink href={'/'}>Careers</ActiveLink>
            </li>
            <li>
              <ActiveLink href={'/'}>Blog</ActiveLink>
            </li>
            <li>
              <ActiveLink href={'/contact'}>Contact</ActiveLink>
            </li>
          </ul>
        </div>

        <div className='flex flex-col gap-4'>
          <p className='font-medium text-foreground'>Resources</p>
          <ul className='flex flex-col gap-3'>
            <li>
              <ActiveLink href={'/'}>Documentation</ActiveLink>
            </li>
            <li>
              <ActiveLink href={'/'}>Tutorials</ActiveLink>
            </li>
            <li>
              <ActiveLink href={'/'}>API Reference</ActiveLink>
            </li>
            <li>
              <ActiveLink href={'/'}>Community</ActiveLink>
            </li>
          </ul>
        </div>

        <div className='flex flex-col gap-4'>
          <p className='font-medium text-foreground'>Legal</p>
          <ul className='flex flex-col gap-3'>
            <li>
              <ActiveLink href={'/privacy'}>Privacy Policy</ActiveLink>
            </li>
            <li>
              <ActiveLink href={'/terms'}>Terms of Service</ActiveLink>
            </li>
            <li>
              <ActiveLink href={'/'}>Cookie Policy</ActiveLink>
            </li>
            <li>
              <ActiveLink href={'/'}>Security</ActiveLink>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Section - Copyright */}
      <div className='border-border border-t border-dashed pt-8'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <p className='text-muted-foreground text-sm'>
            &copy; {new Date().getFullYear()} {owner}. All rights reserved.
          </p>
          <p className='text-muted-foreground text-sm'>
            Making data intelligence accessible.
          </p>
        </div>
      </div>
    </footer>
  );
}
