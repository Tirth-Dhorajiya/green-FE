import type { MetadataRoute } from 'next';
import { API_BASE_URL } from '../services/apiConfig';
import { absoluteUrl } from '../utils/siteConfig';

type SitemapProduct = { id: string; updated_at?: string; created_at?: string };

const publicRoutes = [
  ['', 1, 'daily'],
  ['/products', 0.9, 'daily'],
  ['/plant-care', 0.7, 'monthly'],
  ['/what-to-grow-now', 0.8, 'monthly'],
  ['/faq', 0.6, 'monthly'],
  ['/contact', 0.5, 'monthly'],
  ['/privacy-policy', 0.3, 'yearly'],
  ['/terms-and-conditions', 0.3, 'yearly'],
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = publicRoutes.map(([path, priority, changeFrequency]) => ({
    url: absoluteUrl(path || '/'),
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));

  try {
    const response = await fetch(`${API_BASE_URL}/products?limit=1000&sortBy=created_at&order=desc`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return routes;
    const data = await response.json() as { products?: SitemapProduct[] };
    routes.push(...(data.products || []).map((product) => ({
      url: absoluteUrl(`/products/${product.id}`),
      lastModified: product.updated_at || product.created_at ? new Date(product.updated_at || product.created_at!) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })));
  } catch {
    // Keep static URLs available when the catalog API is temporarily unavailable.
  }

  return routes;
}
