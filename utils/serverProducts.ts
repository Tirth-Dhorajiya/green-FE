import 'server-only';
import type { FeaturedProduct } from '../components/home/FeaturedProductsSection';
import { API_BASE_URL } from '../services/apiConfig';

type ProductResponse = {
  success?: boolean;
  products?: FeaturedProduct[];
};

const fetchProducts = async (query: string): Promise<FeaturedProduct[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products?${query}`, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return [];
    const data = await response.json() as ProductResponse;
    return data.success === false ? [] : data.products || [];
  } catch {
    return [];
  }
};

export const getFeaturedProducts = async () => {
  const featured = await fetchProducts('featured=true&limit=10&sortBy=created_at&order=desc');
  if (featured.length) return featured;
  return fetchProducts('limit=10&sortBy=created_at&order=desc');
};
