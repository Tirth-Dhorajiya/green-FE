import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { API_BASE_URL, ASSET_BASE_URL } from '../../../services/apiConfig';
import { productDescriptionText } from '../../../utils/productDescription';
import { absoluteUrl, siteConfig } from '../../../utils/siteConfig';

type Product = {
  id: string;
  name: string;
  description?: string;
  price: string | number;
  category?: string;
  stock?: number;
  image_url?: string;
  thumbnail_url?: string;
  updated_at?: string;
};

const getProduct = async (id: string): Promise<Product | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${encodeURIComponent(id)}`, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return null;
    const data = await response.json() as { success?: boolean; product?: Product };
    return data.success === false ? null : data.product || null;
  } catch {
    return null;
  }
};

const productImage = (product: Product) => {
  const image = product.thumbnail_url || product.image_url;
  if (!image) return absoluteUrl('/hero.webp');
  if (/^https?:\/\//i.test(image)) return image;
  return new URL(image, `${ASSET_BASE_URL}/`).toString();
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) {
    return {
      title: 'Product',
      description: 'View product details at Green Store.',
      robots: { index: false, follow: false },
    };
  }

  const description = productDescriptionText(product.description).slice(0, 160)
    || `Buy ${product.name} from Green Store with secure payment and tracked delivery.`;
  const path = `/products/${product.id}`;
  const image = productImage(product);

  return {
    title: product.name,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      locale: siteConfig.locale,
      siteName: siteConfig.name,
      url: path,
      title: product.name,
      description,
      images: [{ url: image, alt: product.name }],
    },
    twitter: { card: 'summary_large_image', title: product.name, description, images: [image] },
  };
}

export default async function ProductLayout({ children, params }: { children: ReactNode; params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) return children;

  const description = productDescriptionText(product.description).slice(0, 300)
    || `Buy ${product.name} from Green Store.`;
  const productUrl = absoluteUrl(`/products/${product.id}`);
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        '@id': `${productUrl}#product`,
        name: product.name,
        description,
        image: [productImage(product)],
        sku: product.id,
        category: product.category,
        brand: { '@type': 'Brand', name: siteConfig.name },
        offers: {
          '@type': 'Offer',
          url: productUrl,
          priceCurrency: 'INR',
          price: Number(product.price).toFixed(2),
          availability: Number(product.stock || 0) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          itemCondition: 'https://schema.org/NewCondition',
          seller: { '@type': 'Organization', name: siteConfig.name },
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.url },
          { '@type': 'ListItem', position: 2, name: 'Products', item: absoluteUrl('/products') },
          { '@type': 'ListItem', position: 3, name: product.name, item: productUrl },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
      {children}
    </>
  );
}
