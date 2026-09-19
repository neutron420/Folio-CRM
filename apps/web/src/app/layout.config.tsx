import { Icons } from '@/components/icons/icons';
import type { LinkItemType } from 'fumadocs-ui/layouts/links';
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

export const title = 'Folio CRM';
export const description =
  'Folio CRM is the enterprise-grade collaborative Kanban & CRM platform. Sub-millisecond card reordering, live multi-client sync, and modular workspaces.';
export const owner = 'Folio CRM';

export const baseOptions: BaseLayoutProps = {
  nav: {
    title,
  },
  githubUrl: 'https://github.com/ruixenui/ruixen.com',
};

export const linkItems: LinkItemType[] = [
  {
    text: 'Features',
    url: '/#features',
    active: 'url',
  },
  {
    text: 'Testimonials',
    url: '/#testimonials',
    active: 'url',
  },
  {
    text: 'FAQ',
    url: '/#faq',
    active: 'url',
  },
  {
    icon: <Icons.phone />,
    text: 'Contact',
    url: '/contact',
    active: 'url',
  },
];

export const postsPerPage = 5;
