'use client';

import { Icons } from '@/components/icons/icons';
import { Section } from '@/components/section';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

const contactInfo = [
  {
    title: 'Email Us',
    description: 'Our team typically responds within 24 hours',
    value: 'hello@Folio.ai',
    href: 'mailto:hello@Folio.ai',
  },
  {
    title: 'Live Chat',
    description: 'Available Monday to Friday, 9am-6pm EST',
    value: 'Start a conversation',
    href: '#',
  },
  {
    title: 'Office',
    description: 'Visit our headquarters',
    value: 'San Francisco, CA',
    href: '#',
  },
  {
    title: 'Business Hours',
    description: 'We work globally across timezones',
    value: 'Mon-Fri: 9am-6pm EST',
    href: '#',
  },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <>
      {/* Hero Section */}
      <Section className='relative z-0 w-full overflow-hidden bg-dashed px-4 pt-12 pb-12 sm:px-8 sm:pt-16 md:px-16 md:pt-24 lg:pt-32'>
        {/* Background layer */}
        <div className="absolute inset-0 bg-background -z-20" />
        {/* Gradient layer */}
        <div className='z-0 absolute inset-0 h-full w-full pointer-events-none animate-fade-in'>
          <div
            className='pointer-events-none absolute right-0 top-0 h-[400px] w-[450px] sm:h-[500px] sm:w-[550px] md:h-[600px] md:w-[650px] translate-x-1/3 -translate-y-1/3 select-none'
            style={{
              background: 'radial-gradient(ellipse at center, rgba(37, 99, 235, 0.4) 0%, rgba(37, 99, 235, 0.1) 45%, transparent 75%)',
            }}
          />
          <div
            className='pointer-events-none absolute left-0 bottom-0 h-[400px] w-[450px] sm:h-[500px] sm:w-[550px] md:h-[600px] md:w-[650px] -translate-x-1/3 translate-y-1/3 select-none'
            style={{
              background: 'radial-gradient(ellipse at center, rgba(37, 99, 235, 0.3) 0%, rgba(37, 99, 235, 0.1) 45%, transparent 75%)',
            }}
          />
        </div>

        <div className='mx-auto flex flex-col items-center justify-center gap-4 sm:gap-6'>
          <div className='flex flex-col gap-3 sm:gap-4'>
            <h1 className='max-w-xs sm:max-w-lg md:max-w-2xl text-center font-regular text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tighter animate-fade-in-up'>
              Get in Touch
            </h1>
            <p className='max-w-xs sm:max-w-md md:max-w-2xl text-center text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed tracking-tight px-4 sm:px-0 animate-fade-in-up delay-200' style={{ opacity: 0 }}>
              Have questions about querying your data with AI? Want to see a demo? Our team is here to help you get started.
            </p>
          </div>
        </div>
      </Section>

      {/* Contact Form & Info Section */}
      <Section className='py-12 md:py-16 lg:py-20'>
        <div className='grid gap-8 lg:gap-12 lg:grid-cols-2 px-6 md:px-16'>
          {/* Contact Form */}
          <div className='order-2 lg:order-1'>
            <div className='border border-border bg-card/50 backdrop-blur-sm'>
              <div className='p-6'>
                {isSubmitted ? (
                  <div className='flex flex-col items-center justify-center py-12 text-center'>
                    <div className='mb-4 flex h-16 w-16 items-center justify-center bg-primary/10'>
                      <Icons.success className='h-8 w-8 text-primary' />
                    </div>
                    <h3 className='mb-2 text-xl font-semibold'>Message Sent!</h3>
                    <p className='text-muted-foreground max-w-sm'>
                      Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                    </p>
                    <Button
                      className='mt-6'
                      variant='outline'
                      onClick={() => setIsSubmitted(false)}
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className='space-y-6'>
                    <div className='grid gap-4 sm:grid-cols-2'>
                      <div className='space-y-2'>
                        <Label htmlFor='firstName'>First Name</Label>
                        <Input
                          id='firstName'
                          placeholder='John'
                          required
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='lastName'>Last Name</Label>
                        <Input
                          id='lastName'
                          placeholder='Doe'
                          required
                        />
                      </div>
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='email'>Email</Label>
                      <Input
                        id='email'
                        type='email'
                        placeholder='john@company.com'
                        required
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='company'>Company</Label>
                      <Input
                        id='company'
                        placeholder='Acme Inc.'
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='subject'>Subject</Label>
                      <Input
                        id='subject'
                        placeholder='How can we help?'
                        required
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='message'>Message</Label>
                      <Textarea
                        id='message'
                        placeholder='Tell us more about your needs...'
                        className='min-h-[120px]'
                        required
                      />
                    </div>

                    <Button
                      type='submit'
                      size='lg'
                      className='w-full group gap-3'
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Icons.spinner className='h-4 w-4 animate-spin' />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Icons.send className='group-hover:-rotate-12 h-4 w-4 transition-transform' />
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className='order-1 lg:order-2 space-y-6'>
            <div className='space-y-2'>
              <h2 className='text-xl sm:text-2xl md:text-3xl font-medium text-foreground'>
                Let&apos;s Start a Conversation
              </h2>
              <p className='text-muted-foreground'>
                Whether you&apos;re evaluating Folio for your data team, connecting a new warehouse, or exploring how AI can replace your SQL editor, we&apos;d love to hear from you.
              </p>
            </div>

            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-1'>
              {contactInfo.map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  className='group border border-border bg-card/50 p-4 transition-all hover:border-primary/50 hover:bg-card'
                >
                  <div className='space-y-1'>
                    <h3 className='font-medium text-foreground'>{item.title}</h3>
                    <p className='text-sm text-muted-foreground'>{item.description}</p>
                    <p className='text-sm font-medium text-primary'>{item.value}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section className='relative overflow-hidden'>
        <div className='relative z-10 mx-6 md:mx-16 border-l border-r border-border overflow-hidden'>
          <div className='grid gap-8 px-6 py-16 sm:grid-cols-2 md:py-20'>
            <h2 className='text-xl sm:text-2xl md:text-3xl font-medium text-foreground max-w-xl'>
              Ready to ship your first dashboard?
            </h2>

            <div className='flex w-full items-center'>
              <div className='max-w-xl space-y-4'>
                <p className='text-muted-foreground text-sm md:text-base'>
                  Connect your warehouse, ask your first question, and get a chart back before the meeting ends. No SQL required.
                </p>
                <div className='flex flex-row gap-3'>
                  <Button size='lg' className='group gap-4' asChild>
                    <a href='/'>
                      Explore Platform{' '}
                      <Icons.arrowUpRight className='group-hover:-rotate-12 size-4 transition-transform' />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
            {/* Gradient glow */}
            <div className='z-0 absolute inset-0 h-full w-full pointer-events-none animate-fade-in'>
              <div
                className='pointer-events-none absolute right-0 bottom-0 h-[400px] w-[450px] sm:h-[500px] sm:w-[550px] md:h-[600px] md:w-[650px] lg:h-[700px] lg:w-[750px] translate-x-1/2 translate-y-1/2 select-none'
                style={{
                  background: 'radial-gradient(ellipse at center, rgba(37, 99, 235, 0.5) 0%, rgba(37, 99, 235, 0.15) 45%, transparent 75%)',
                }}
              />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
