import { title as homeTitle } from '@/app/layout.config';
import { Section } from '@/components/section';
import { createMetadata } from '@/lib/metadata';
import type { Metadata } from 'next';
import Link from 'next/link';

const LAST_UPDATED = 'March 2, 2025';

export default function TermsOfService() {
  return (
    <>
      <Section className='p-4 text-center lg:p-6'>
        <h1 className='mb-2 font-bold text-3xl leading-tight tracking-tighter md:text-4xl'>
          Terms of Service
        </h1>
        <p className='text-muted-foreground text-sm'>
          Last updated: {LAST_UPDATED}
        </p>
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
    title: 'Overview',
    content: (
      <p>
        Folio is an AI-powered data intelligence platform that helps teams connect
        their data warehouses, ask questions in plain English, and ship dashboards
        without writing SQL. By using our platform, you agree to these terms.
      </p>
    ),
  },
  {
    title: 'Service Description',
    content: (
      <div className='space-y-8'>
        <div>
          <h3 className='mb-3 font-medium text-card-foreground text-xl'>
            Data Intelligence Services
          </h3>
          <ul className='ml-4 list-disc space-y-2'>
            <li>
              Our platform provides natural-language query generation, AI-drafted
              SQL, automatic chart selection, and connectors for 20+ data warehouses
              and BI tools.
            </li>
            <li>
              We offer features including saved queries, scheduled dashboards,
              semantic-layer integration (dbt, Cube, LookML), and team collaboration
              surfaces.
            </li>
            <li>
              Queries and dashboard renders are billed on a usage-based model with
              guaranteed uptime SLAs.
            </li>
          </ul>
        </div>
        <div>
          <h3 className='mb-3 font-medium text-card-foreground text-xl'>
            API and Integrations
          </h3>
          <ul className='ml-4 list-disc space-y-2'>
            <li>
              Our platform provides APIs and webhooks for programmatic access to
              queries, chart embeds, and dashboard exports.
            </li>
            <li>
              Users must comply with rate limits and fair usage policies for API access.
            </li>
            <li>
              Third-party integrations are subject to their respective terms of service.
            </li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    title: 'User Responsibilities',
    content: (
      <div className='mt-4 space-y-3 text-muted-foreground'>
        <p>By using our platform, you agree to:</p>
        <ul className='ml-4 list-disc space-y-2'>
          <li>Comply with all applicable laws and regulations.</li>
          <li>Maintain the security of your API keys and warehouse credentials.</li>
          <li>Use generated queries responsibly and review them before running on production data.</li>
          <li>Not use the platform for harmful, deceptive, or malicious purposes.</li>
          <li>Report any security vulnerabilities or misuse promptly.</li>
        </ul>
      </div>
    ),
  },
  {
    title: 'Usage Terms',
    content: (
      <div className='mt-4 space-y-3 text-muted-foreground'>
        <p>Our usage terms include:</p>
        <ul className='ml-4 list-disc space-y-2'>
          <li>Fair usage policies for query volume and API calls.</li>
          <li>99.9% uptime SLA for production dashboards.</li>
          <li>Query history retention based on your plan.</li>
        </ul>
      </div>
    ),
  },
  {
    title: 'Data Policies',
    content: (
      <div className='mt-4 space-y-3 text-muted-foreground'>
        <p>Our data handling policies ensure:</p>
        <ul className='ml-4 list-disc space-y-2'>
          <li>
            Your query results and underlying tables stay in your warehouse — only
            schema metadata is processed by Folio for query generation.
          </li>
          <li>Compliance with GDPR, CCPA, and other data protection regulations.</li>
          <li>Data isolation between customers for all queries and saved views.</li>
          <li>Clear data retention and deletion policies.</li>
        </ul>
      </div>
    ),
  },
  {
    title: 'Contact Information',
    content: (
      <div className='mt-4 space-y-3 text-muted-foreground'>
        <p>
          For any questions or concerns regarding these terms, please reach out
          to our team:
        </p>
        <div className='flex flex-col space-y-2'>
          <Link
            href='/contact'
            className='inline-flex items-center text-fd-primary underline duration-300 hover:text-fd-primary/70'
          >
            Contact Support
          </Link>
        </div>
      </div>
    ),
  },
];

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const description = `Terms of service for ${homeTitle}. Last updated on ${LAST_UPDATED}.`;

  return createMetadata({
    title: 'Terms of Service',
    description,
    openGraph: {
      url: '/terms',
    },
    alternates: {
      canonical: '/terms',
    },
  });
}
