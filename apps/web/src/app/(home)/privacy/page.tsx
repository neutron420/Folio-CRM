import { title as homeTitle } from '@/app/layout.config';
import { InlineLink } from '@/components/inline-link';
import { Section } from '@/components/section';
import { createMetadata } from '@/lib/metadata';
import type { Metadata } from 'next';

const LAST_UPDATED = 'March 2, 2025';

export default function PrivacyPolicy() {
  return (
    <>
      <Section className='p-4 text-center lg:p-6'>
        <h1 className='mb-2 font-bold text-3xl leading-tight tracking-tighter md:text-4xl'>
          Privacy Policy
        </h1>
        <div className='flex items-center justify-center gap-2'>
          <p className='text-muted-foreground text-sm'>
            Last updated: {LAST_UPDATED}
          </p>
          <span className='text-muted-foreground text-sm'>•</span>
          <InlineLink href='/terms' className='text-sm'>
            Terms of Service
          </InlineLink>
        </div>
      </Section>
      <Section>
        <div className='grid divide-y divide-dashed divide-border'>
          {sections.map((section) => (
            <div key={section.title} className='group p-6 transition-all'>
              <h2 className='mb-4 font-semibold text-xl tracking-tight'>
                {section.title}
              </h2>
              <div className='prose prose-sm prose-zinc dark:prose-invert max-w-none'>
                {section.content}
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}

const sections = [
  {
    title: 'Our Commitment to Privacy',
    content: (
      <p>
        At Folio, we take your privacy seriously. Our data intelligence platform
        is designed so that your warehouse data, query results, and saved views stay
        protected — only the minimum schema metadata Folio needs to generate SQL
        ever leaves your environment.
      </p>
    ),
  },
  {
    title: 'Data Collection and Usage',
    content: (
      <ul className='ml-4 list-disc space-y-2'>
        <li>
          We collect essential information to provide and improve the service,
          including account details, saved queries, and dashboard configurations.
        </li>
        <li>
          Your warehouse credentials and query results are processed securely and
          never shared with third parties without explicit consent.
        </li>
        <li>
          Anonymous usage analytics help us improve query generation accuracy and
          platform performance.
        </li>
      </ul>
    ),
  },
  {
    title: 'Your Warehouse Data',
    content: (
      <p>
        Query results and underlying tables stay in your warehouse. Folio sends only
        schema metadata (table names, column names, types) to its AI provider for
        query generation — never row-level data. We implement strict isolation
        between customers so your saved queries remain private.
      </p>
    ),
  },
  {
    title: 'Data Security',
    content: (
      <ul className='ml-4 list-disc space-y-2'>
        <li>All data is encrypted in transit (TLS 1.3) and at rest (AES-256).</li>
        <li>We implement regular security audits, penetration testing, and SOC 2 compliance.</li>
        <li>
          Warehouse credentials are stored using industry-standard vault encryption
          with optional Bring-Your-Own-Key on Enterprise plans.
        </li>
      </ul>
    ),
  },
  {
    title: 'Your Rights and Controls',
    content: (
      <ul className='ml-4 list-disc space-y-2'>
        <li>Access and export your saved queries and dashboard configurations at any time.</li>
        <li>Control your privacy settings, API access, and warehouse connection permissions.</li>
        <li>Request complete data deletion upon account closure.</li>
      </ul>
    ),
  },
  {
    title: 'Contact Us',
    content: (
      <p>
        If you have any questions about your privacy or how we handle your data,
        please contact us at privacy@Folio.ai or through our support channels.
      </p>
    ),
  },
  {
    title: 'Updates to This Policy',
    content: (
      <p>
        We may update this privacy policy periodically to reflect changes in our services.
        Users will be notified of any significant changes through the platform and email.
      </p>
    ),
  },
];

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const description = `Privacy Policy for ${homeTitle}. Last updated on ${LAST_UPDATED}.`;

  return createMetadata({
    title: 'Privacy Policy',
    description,
    openGraph: {
      url: '/privacy',
    },
    alternates: {
      canonical: '/privacy',
    },
  });
}
