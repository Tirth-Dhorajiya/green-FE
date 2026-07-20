const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const siteConfig = {
  name: 'Green Store',
  shortName: 'Green Store',
  description: 'Shop premium plants, seeds, planters, and gardening tools with secure online payment and tracked delivery across India.',
  url: configuredUrl.replace(/\/$/, ''),
  email: 'support@greenstore.com',
  locale: 'en_IN',
};

export const absoluteUrl = (path = '/') => new URL(path, `${siteConfig.url}/`).toString();
