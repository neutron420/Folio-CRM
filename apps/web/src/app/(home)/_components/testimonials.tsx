import { Plus } from 'lucide-react';

import {
  type Testimonial,
  TestimonialCard,
} from '@/components/ui/testimonial-card';

const testimonials: Testimonial[] = [
  {
    name: 'Sarah Chen',
    designation: 'Product Manager · Vercel',
    profile: '/avatar-images/avatar-01.jpg',
    title: 'Cut our analyst queue in half',
    content:
      "Every team used to have three tickets sitting in the analyst queue. Folio's plain-English layer means PMs and ops can pull their own numbers, and the SQL it generates is clean enough to trust. Our data team got their afternoons back.",
  },
  {
    name: 'Marcus Webb',
    designation: 'Founder · Resona',
    profile: '/avatar-images/avatar-02.jpg',
    title: 'Self-serve actually works now',
    content:
      "We tried Looker. We tried Metabase. Both required someone on the team to maintain semantic models. Folio just connects to the warehouse and our investors can ask 'what's MRR by cohort' in Slack and get a chart back.",
  },
  {
    name: 'Priya Anand',
    designation: 'Head of Engineering · Hatch',
    profile: '/avatar-images/avatar-05.jpg',
    title: 'Dashboards write themselves',
    content:
      'I keep checking if our dashboards are real because they just… keep updating. Folio drafts the chart, the query, and the right visualization in one pass. We spent zero engineer hours on the latest exec dashboard.',
  },
  {
    name: 'Diego Ramirez',
    designation: 'Designer · Northbeam',
    profile: '/avatar-images/avatar-03.jpg',
    title: 'Charts I would actually ship',
    content:
      "Most BI tools produce charts you'd never put in front of a customer. Folio's defaults are clean enough that I drop them straight into pitch decks. The 'why this chart type' AI nudge is genuinely smart, not gimmicky.",
  },
  {
    name: 'Aisha Khalid',
    designation: 'Customer Success Lead · Lattice',
    profile: '/avatar-images/avatar-01.jpg',
    title: 'Answers in Slack, not tickets',
    content:
      "Half my job used to be writing ad-hoc data requests for CSMs. Now they ask Folio in Slack — 'renewal rate for accounts over $50K' — and get the answer with the SQL attached, in case they want to verify. Tickets to the data team dropped 70%.",
  },
  {
    name: 'Tom Vasquez',
    designation: 'CTO · Ledgerline',
    profile: '/avatar-images/avatar-04.jpg',
    title: 'Replaced four tools',
    content:
      'We dropped Mode, Hex, a homegrown SQL UI, and an internal chatbot we never finished. All four. Onboarding the team took about an hour and nobody has asked for the old stack back, which says everything.',
  },
  {
    name: "James O'Brien",
    designation: 'Engineering Manager · Atlas',
    profile: '/avatar-images/avatar-03.jpg',
    title: 'Connected in twenty minutes',
    content:
      "Plugged Folio into Postgres and BigQuery, granted read-only, and we had the first dashboard the same afternoon. Onboarding took less time than reading the docs would've.",
  },
  {
    name: 'Yuki Tanaka',
    designation: 'Product Designer · Beam Studio',
    profile: '/avatar-images/avatar-05.jpg',
    title: 'Adapts to our team',
    content:
      "What I appreciate is that Folio doesn't force one query language on us. PMs ask in English, analysts review the SQL, engineers wire the dashboard into our app. Same tool, three workflows, all coherent.",
  },
  {
    name: 'Olivia Park',
    designation: 'Growth Lead · Stride',
    profile: '/avatar-images/avatar-01.jpg',
    title: 'Decisions in minutes, not days',
    content:
      'Our growth experiments used to wait two days for the data team to write the lift query. Now I ask Folio, get the chart, get the explanation in plain English, and decide before standup ends. Cycle time on experiments dropped 70%.',
  },
  {
    name: 'Rashid Mansour',
    designation: 'Head of Product · Helmsley',
    profile: '/avatar-images/avatar-04.jpg',
    title: 'Our best executive surface',
    content:
      "The 'explain this chart' AI is the underrated feature. Execs read the visualization and the one-sentence summary together. Board prep used to take a week of analyst time. Now it's a half-day.",
  },
  {
    name: 'Emma Thornton',
    designation: 'Founder · Nimbus',
    profile: '/avatar-images/avatar-05.jpg',
    title: 'Cancelled three tools',
    content:
      'Was paying $2.4K/mo for a BI stack that did half of what Folio does on its own. Cancelled everything, switched, and used the savings to hire a part-time analyst who actually spends her time on modeling.',
  },
  {
    name: 'Anil Reddy',
    designation: 'VP Engineering · Pinch',
    profile: '/avatar-images/avatar-02.jpg',
    title: 'AI explanations saved us hours',
    content:
      "The AI explanation layer is the underrated piece. Charts used to bounce back from stakeholders with 'what does this actually mean?' Now Folio drafts the takeaway alongside the visualization. Slack threads about charts went down to almost zero.",
  },
];

function AddTestimonialPlaceholder() {
  return (
    <div
      aria-hidden='true'
      className='my-4 flex h-44 break-inside-avoid items-center justify-center rounded-3xl border-2 border-border border-dashed bg-transparent'
    >
      <Plus className='size-7 text-muted-foreground/40' />
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className='py-20 md:py-28'>
      <div className='mx-auto max-w-7xl px-6 lg:px-8'>
        <div className='grid items-end gap-8 md:grid-cols-2 md:gap-12'>
          <h2 className='text-balance font-bold text-4xl text-foreground tracking-tight md:text-5xl'>
            Loved by teams that ship fast
          </h2>
          <p className='max-w-md text-base text-muted-foreground leading-relaxed'>
            From growing engineering startups to busy product teams, Folio CRM keeps boards, tasks, and pipelines organized and everyone on the same page.
          </p>
        </div>

        <div className='mt-14 columns-1 gap-6 md:columns-2 lg:columns-4'>
          {testimonials.map((t) => (
            <TestimonialCard key={t.name} testimonial={t} />
          ))}
          <AddTestimonialPlaceholder />
        </div>
      </div>
    </section>
  );
}
