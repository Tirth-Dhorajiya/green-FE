import type { ReactNode } from 'react';
import { createPageMetadata } from '../../utils/metadata';

export const metadata = createPageMetadata({ title: 'Shopping Cart', description: 'Review items in your Green Store shopping cart.', path: '/cart', noIndex: true });
export default function Layout({ children }: { children: ReactNode }) { return children; }
