'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeProvider, setActiveProvider] = useState<'google' | 'github' | 'slack' | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleGoogleLogin = () => {
    try {
      setIsLoading(true);
      setActiveProvider('google');
      setErrorMsg('');
      window.location.href = 'http://localhost:4000/api/v1/auth/google';
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg('Google sign-in was cancelled or failed. Please try again.');
      setIsLoading(false);
      setActiveProvider(null);
    }
  };

  const handleGithubLogin = () => {
    try {
      setIsLoading(true);
      setActiveProvider('github');
      setErrorMsg('');
      window.location.href = 'http://localhost:4000/api/v1/auth/github';
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg('GitHub sign-in was cancelled or failed. Please try again.');
      setIsLoading(false);
      setActiveProvider(null);
    }
  };

  const handleSlackLogin = () => {
    try {
      setIsLoading(true);
      setActiveProvider('slack');
      setErrorMsg('');
      window.location.href = 'http://localhost:4000/api/v1/auth/slack';
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg('Slack sign-in was cancelled or failed. Please try again.');
      setIsLoading(false);
      setActiveProvider(null);
    }
  };

  return (
    <div className='min-h-screen bg-[#f3f4f6] dark:bg-neutral-900 flex items-center justify-center transition-colors duration-200'>
      <div className='bg-[#f3f4f6] dark:bg-neutral-950 w-screen min-h-screen md:h-screen p-4 sm:p-6 md:p-4 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden border border-neutral-200/50 dark:border-neutral-800/50 gap-4 md:gap-3'>
        
        {/* ========================================================================= */}
        {/* LEFT ARTWORK HERO CONTAINER (Ditto Minifolio: rounded-[10px], Sunset Flame) */}
        {/* ========================================================================= */}
        <div className='hidden md:flex md:w-1/2 md:h-full rounded-[10px] bg-[#0a0402] text-white p-8 md:p-12 flex-col justify-between relative overflow-hidden select-none z-10'>
          
          {/* Sunset Flame Gradient */}
          <div
            className='absolute inset-0 pointer-events-none'
            style={{
              background:
                'linear-gradient(to bottom, #0a0402 0%, #2b0d02 18%, #c23c0a 42%, #f0821f 60%, #fbc48a 78%, #fdf3e7 94%)',
            }}
          />

          {/* Central Warm Orange Glow */}
          <div className='absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-orange-500/40 blur-[110px] pointer-events-none' />

          {/* Bottom Ambient White Glow */}
          <div className='absolute left-[15%] bottom-[8%] w-[260px] h-[260px] rounded-full bg-white/15 blur-[100px] pointer-events-none' />

          {/* Stipple / Dot Texture */}
          <div
            className='absolute inset-0 opacity-[0.06] mix-blend-overlay pointer-events-none'
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)',
              backgroundSize: '3px 3px',
            }}
          />

          {/* Artwork Top Bar */}
          <div className='relative z-10 flex items-center justify-between'>
            <span className='text-[12px] text-white/50 font-medium tracking-tight'>
              @foliocrm
            </span>
            <div className='flex items-center gap-2.5 text-[10px] uppercase tracking-[0.25em] text-white/50 font-medium'>
              <span>© 2026</span>
            </div>
          </div>

          {/* Artwork Hero Title */}
          <div className='relative z-10 max-w-md'>
            <h2
              className='text-4xl lg:text-5xl leading-[1.05] tracking-[-0.035em] text-white !font-normal'
              style={{
                fontFamily: 'var(--font-tiempos), Georgia, serif',
                fontWeight: 400,
              }}
            >
              Organize boards,
              <br />
              zero{' '}
              <span className='italic font-light text-white/90'>friction.</span>
            </h2>
            <p className='mt-4 text-sm text-white/70 font-semibold leading-relaxed max-w-[280px]'>
              Enterprise-grade real-time collaborative Kanban, sub-millisecond card reordering, and automated team pipelines.
            </p>
          </div>

          {/* Artwork Bottom Divider */}
          <div className='relative z-10 space-y-3'>
            <div className='h-px w-full bg-white/15' />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT LOGIN FORM CONTAINER (Ditto Minifolio: Crisp Rectangular Buttons)    */}
        {/* ========================================================================= */}
        <div className='flex-1 min-h-[calc(100vh-2rem)] md:min-h-0 md:h-full flex flex-col justify-between p-4 sm:p-8 md:p-14 relative z-10'>
          
          {/* Top Bar: Brand Logo & Back to workspace */}
          <div className='flex justify-between items-center w-full z-20'>
            <Link href='/' className='flex items-center gap-2 select-none group'>
              <Logo className='size-8 group-hover:scale-105 transition-transform' />
              <span
                className='text-xl font-bold tracking-tight text-neutral-900 dark:text-white'
                style={{ fontFamily: 'var(--font-tiempos), Georgia, serif' }}
              >
                Folio<span className='text-neutral-500 font-normal text-xs ml-1 uppercase tracking-wider'></span>
              </span>
            </Link>

            <div className='flex items-center gap-3'>
              <Link
                href='/'
                className='text-xs text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors font-medium select-none'
              >
                Back to workspace
              </Link>
            </div>
          </div>

          {/* Form Box in Center */}
          <div className='w-full max-w-[380px] mx-auto my-auto py-8'>
            <h1
              className='text-3xl sm:text-4xl md:text-[2.25rem] leading-[1.1] tracking-[-0.035em] text-neutral-900 dark:text-white !font-normal'
              style={{
                fontFamily: 'var(--font-tiempos), Georgia, serif',
                fontWeight: 400,
                letterSpacing: '-0.035em',
                lineHeight: 1.1,
              }}
            >
              Sign in to your workspace
            </h1>
            <p className='mt-3 text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-normal'>
              Check your team boards, tasks, and project velocity in real time.
            </p>

            {/* Error Message if any */}
            {errorMsg && (
              <div className='mt-4 p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs text-center font-medium'>
                {errorMsg}
              </div>
            )}

            {/* Google Login Button: Zero curve, completely rectangular */}
            <button
              type='button'
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className='mt-8 sm:mt-10 w-full flex items-center justify-center gap-3 py-3.5 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 font-medium text-sm rounded-none cursor-pointer border border-transparent transition-colors duration-150 disabled:opacity-50 select-none shadow-xs'
            >
              {isLoading && activeProvider === 'google' ? (
                <Loader2 className='w-4.5 h-4.5 animate-spin text-zinc-400' />
              ) : (
                <svg
                  className='w-4.5 h-4.5 shrink-0'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                    fill='#4285F4'
                  />
                  <path
                    d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                    fill='#34A853'
                  />
                  <path
                    d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z'
                    fill='#FBBC05'
                  />
                  <path
                    d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z'
                    fill='#EA4335'
                  />
                </svg>
              )}
              Continue with Google
            </button>

            {/* GitHub Login Button: Zero curve, completely rectangular */}
            <button
              type='button'
              onClick={handleGithubLogin}
              disabled={isLoading}
              className='mt-3 w-full flex items-center justify-center gap-3 py-3.5 bg-transparent hover:bg-neutral-200/50 dark:hover:bg-neutral-900 text-neutral-800 dark:text-neutral-200 font-medium text-sm rounded-none cursor-pointer border border-neutral-300 dark:border-neutral-800 transition-colors duration-150 disabled:opacity-50 select-none shadow-xs'
            >
              {isLoading && activeProvider === 'github' ? (
                <Loader2 className='w-4.5 h-4.5 animate-spin text-zinc-400' />
              ) : (
                <svg className='w-4.5 h-4.5 shrink-0 fill-current' viewBox='0 0 24 24'>
                  <path d='M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z' />
                </svg>
              )}
              Continue with GitHub
            </button>

            {/* Slack Login Button: Zero curve, completely rectangular */}
            <button
              type='button'
              onClick={handleSlackLogin}
              disabled={isLoading}
              className='mt-3 w-full flex items-center justify-center gap-3 py-3.5 bg-transparent hover:bg-neutral-200/50 dark:hover:bg-neutral-900 text-neutral-800 dark:text-neutral-200 font-medium text-sm rounded-none cursor-pointer border border-neutral-300 dark:border-neutral-800 transition-colors duration-150 disabled:opacity-50 select-none shadow-xs'
            >
              {isLoading && activeProvider === 'slack' ? (
                <Loader2 className='w-4.5 h-4.5 animate-spin text-zinc-400' />
              ) : (
                <svg
                  className='w-4.5 h-4.5 shrink-0'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z'
                    fill='#E01E5A'
                  />
                  <path
                    d='M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z'
                    fill='#36C5F0'
                  />
                  <path
                    d='M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312z'
                    fill='#2EB67D'
                  />
                  <path
                    d='M15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.527 2.527 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z'
                    fill='#ECB22E'
                  />
                </svg>
              )}
              Continue with Slack
            </button>
          </div>

          {/* Bottom Copyright */}
          <p className='text-[11px] text-neutral-400 dark:text-neutral-600 text-center select-none pt-4'>
            © 2026 Folio CRM
          </p>
        </div>

      </div>
    </div>
  );
}
