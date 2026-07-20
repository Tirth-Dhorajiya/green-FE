import type { ReactNode } from 'react';
import { createPageMetadata } from '../../utils/metadata';

export const metadata = createPageMetadata({ title: 'Wishlist', description: 'View your saved Green Store products.', path: '/wishlist', noIndex: true });
export default function Layout({ children }: { children: ReactNode }) { return children; }
