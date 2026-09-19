'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

type FAQItem = { question: string; answer: string };

type FAQGroup = {
  id: string;
  label: string;
  items: FAQItem[];
};

const faqGroups: FAQGroup[] = [
  {
    id: 'general',
    label: 'General',
    items: [
      {
        question: 'What is Folio CRM?',
        answer:
          'Folio CRM is an enterprise-grade real-time collaborative Kanban & pipeline platform designed with Clean Architecture, sub-millisecond drag-and-drop, and live multi-client synchronization.',
      },
      {
        question: 'Who is Folio CRM for?',
        answer:
          'Folio CRM is built for engineering, product, and client teams that need high-throughput task management, real-time board collaboration, and structured customer pipelines.',
      },
      {
        question: 'How is Folio CRM different from a traditional CRM?',
        answer:
          'Folio CRM provides sub-millisecond card reordering via floating-point fractional indexing, native WebSockets for instant multi-user board synchronization, multi-tenant RBAC, and direct cloud storage file attachments.',
      },
      {
        question: 'Can I manage projects, boards, and tasks in Folio CRM?',
        answer:
          'Yes. Folio CRM supports hierarchical multi-tenancy across Workspaces, Projects, Boards, Columns, and Tasks with labels, checklists, and assignees.',
      },
      {
        question: 'Can my whole team collaborate in real time on Folio CRM?',
        answer:
          'Yes. Folio CRM utilizes high-speed native WebSockets with selective room multicasting so board movements, updates, and comments sync across all users with zero latency.',
      },
    ],
  },
  {
    id: 'data-organization',
    label: 'Data & Organization',
    items: [
      {
        question: 'Can I customize Folio CRM to fit my team workflow?',
        answer:
          'Yes. Folio CRM lets you configure custom workspaces, boards, workflow columns, priority levels, labels, and task dependencies.',
      },
      {
        question: 'Can I create custom fields and labels?',
        answer:
          'Yes. Custom taxonomy labels and metadata tags let you categorize cards, bugs, features, and client milestones effortlessly.',
      },
      {
        question: 'Can I create custom views?',
        answer:
          'Yes. Filter and sort by priority, due date, sprint, assignee, or custom tags to focus on the work that matters most.',
      },
      {
        question: 'Can I search and filter across workspaces?',
        answer:
          'Yes. Fast trigram and full-text search make it simple to query tasks, comments, and members instantly across entire workspaces.',
      },
      {
        question: 'Can I attach files and specifications to cards?',
        answer:
          'Yes. Folio CRM supports direct-to-cloud file attachments (AWS S3 / Cloudflare R2) using secure presigned HMAC-SHA256 URLs up to 50MB.',
      },
    ],
  },
  {
    id: 'integrations',
    label: 'Architecture & Integrations',
    items: [
      {
        question: 'What tech stack powers Folio CRM?',
        answer:
          'Folio CRM is engineered with a Next.js 15 (React 19) App Router frontend, a high-speed Bun TypeScript HTTP & WebSocket backend, Prisma ORM, and Neon Serverless PostgreSQL.',
      },
      {
        question: 'How does real-time drag-and-drop work without database lag?',
        answer:
          'Folio CRM uses 64-bit IEEE 754 floating-point fractional indexing to calculate midpoint positions in O(1) time with automated atomic rebalancing if items cluster.',
      },
      {
        question: 'Can Folio CRM replace our fragmented tools and spreadsheets?',
        answer:
          'Yes. Folio CRM unifies real-time Kanban boards, sprint scoping, team activities, threaded discussions, and pipeline management in one unified interface.',
      },
    ],
  },
  {
    id: 'teams-workflow',
    label: 'Teams & Permissions',
    items: [
      {
        question: 'What access control levels does Folio CRM offer?',
        answer:
          'Folio CRM features fail-closed hierarchical Role-Based Access Control (RBAC) with OWNER, ADMIN, MEMBER, and VIEWER roles across all workspaces.',
      },
      {
        question: 'How does Folio CRM keep distributed teams aligned?',
        answer:
          'Live WebSocket event streams, automated audit logging on every card mutation, and real-time in-app notifications ensure full visibility for every team member.',
      },
      {
        question: 'Can I use Folio CRM for both software sprints and sales pipelines?',
        answer:
          'Yes. Folio CRM is designed flexibly for Agile sprint tracking, product roadmaps, and client deal pipelines.',
      },
    ],
  },
  {
    id: 'security',
    label: 'Security & Auth',
    items: [
      {
        question: 'How does authentication and session security work?',
        answer:
          'Folio CRM uses strictly passwordless OAuth 2.0 (Google & GitHub) with 256-bit cryptographically secure session tokens stored as SHA-256 hashes in PostgreSQL.',
      },
    ],
  },
  {
    id: 'getting-started',
    label: 'Getting Started',
    items: [
      {
        question: 'How do I get started with Folio CRM?',
        answer:
          'Simply sign in with Google or GitHub, create your first workspace, spin up a Kanban board, and invite your team members.',
      },
      {
        question: 'Do I need complex infrastructure to run Folio CRM?',
        answer:
          'No. Folio CRM is optimized for Turborepo and containerized with Docker for turnkey deployment locally or to any modern cloud environment.',
      },
    ],
  },
  {
    id: 'support',
    label: 'Support',
    items: [
      {
        question: 'Is support and documentation available?',
        answer:
          'Yes. Comprehensive documentation, API guides, and email support are available at support@foliocrm.com.',
      },
    ],
  },
];

export default function FAQs() {
  const [activeId, setActiveId] = useState<string>('general');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 },
    );

    for (const group of faqGroups) {
      const el = document.getElementById(group.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className='bg-background py-16 md:py-24'>
      <div className='mx-auto max-w-7xl px-6 lg:px-8'>
        <div className='grid items-end gap-8 md:grid-cols-2 md:gap-12'>
          <h2 className='font-semibold text-4xl text-foreground'>FAQs</h2>
          <p className='max-w-md text-balance text-lg text-muted-foreground'>
            Everything you need to know about Folio. Can&apos;t find what
            you&apos;re looking for? Reach out to our{' '}
            <Link
              href='#'
              className='font-medium text-foreground hover:underline'
            >
              support team
            </Link>{' '}
            for assistance.
          </p>
        </div>

        <div className='@container mt-6 grid md:mt-20 md:grid-cols-5'>
          <nav
            aria-label='FAQ categories'
            className='md:-mt-3 sticky top-0 z-10 h-fit max-md:flex max-md:justify-center max-md:bg-foreground/2 max-md:p-2 max-md:backdrop-blur md:top-12 md:col-span-2 md:block'
          >
            {faqGroups.map((group) => {
              const isActive = activeId === group.id;
              return (
                <button
                  key={group.id}
                  type='button'
                  aria-current={isActive ? 'true' : undefined}
                  className={cn(
                    'block w-fit cursor-pointer py-2 text-left text-sm transition-colors max-md:px-2 md:py-1.5',
                    isActive
                      ? 'font-medium text-foreground'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                  onClick={() => {
                    setActiveId(group.id);
                    document.getElementById(group.id)?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start',
                    });
                  }}
                >
                  {group.label}
                </button>
              );
            })}
          </nav>

          <div className='space-y-12 max-md:mt-6 md:col-span-3'>
            {faqGroups.map((group) => (
              <div
                key={group.id}
                id={group.id}
                data-faq-group={group.id}
                className='scroll-mt-20 space-y-4'
              >
                <h3 className='pl-6 font-semibold text-foreground text-lg'>
                  {group.label}
                </h3>
                <Accordion
                  type='single'
                  collapsible
                  className='-space-y-1'
                  defaultValue={
                    group.id === 'general' ? 'general-0' : undefined
                  }
                >
                  {group.items.map((item, index) => (
                    <AccordionItem
                      key={`${group.id}-${index}`}
                      value={`${group.id}-${index}`}
                      className='peer rounded-xl border-none px-6 py-1 data-[state=open]:border-none data-[state=open]:bg-card data-[state=open]:shadow-black/[0.065] data-[state=open]:shadow-sm data-[state=open]:ring-1 data-[state=open]:ring-border'
                    >
                      <AccordionTrigger className='cursor-pointer rounded-none border-b py-4 text-base transition-none hover:no-underline data-[state=open]:border-transparent'>
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className='text-base text-muted-foreground'>
                          {item.answer}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export { FAQs as FAQ };
