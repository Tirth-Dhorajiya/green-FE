import type { Metadata } from 'next';
import { siteConfig } from './siteConfig';

export const createPageMetadata = ({
  title,
  description,
  path,
  noIndex = false,
}: {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
}): Metadata => ({
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    url: path,
    title,
    description,
    images: [{ url: '/hero.webp', width: 1920, height: 1072, alt: `${siteConfig.name} botanical collection` }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/hero.webp'],
  },
  robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
});
