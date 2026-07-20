import type { ReactNode } from 'react';
import { createPageMetadata } from '../../utils/metadata';

export const metadata = createPageMetadata({
  title: 'Shop Plants, Seeds, Planters & Garden Tools',
  description: 'Explore Green Store plants, seeds, planters, and gardening tools with secure payments and tracked delivery.',
  path: '/products',
});

export default function ProductsLayout({ children }: { children: ReactNode }) {
  return children;
}
