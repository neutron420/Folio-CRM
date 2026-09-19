import type { Metadata } from 'next/types';

export function createMetadata(override: Metadata): Metadata {
  return {
    ...override,
    openGraph: {
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      url: 'https://Folio.ai',
      images: '/banner.png',
      siteName: 'Folio',
      ...override.openGraph,
    },
    twitter: {
      card: 'summary_large_image',
      creator: '@Folio_ai',
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      images: '/banner.png',
      ...override.twitter,
    },
    alternates: {
      canonical: '/',
      types: {
        'application/rss+xml': '/rss.xml',
      },
      ...override.alternates,
    },
  };
}
