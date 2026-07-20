import type { ReactNode } from 'react';
import { createPageMetadata } from '../../utils/metadata';

export const metadata = createPageMetadata({ title: 'Contact & Customer Support', description: 'Contact Green Store for order support, delivery questions, returns, plant advice, and bulk orders.', path: '/contact' });
export default function Layout({ children }: { children: ReactNode }) { return children; }
