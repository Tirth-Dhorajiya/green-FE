import type { ReactNode } from 'react';
import { createPageMetadata } from '../../utils/metadata';

export const metadata = createPageMetadata({ title: 'Terms & Conditions', description: 'Review the Green Store terms for accounts, products, payments, delivery, returns, and reviews.', path: '/terms-and-conditions' });
export default function Layout({ children }: { children: ReactNode }) { return children; }
