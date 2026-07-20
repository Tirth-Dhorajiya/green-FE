import type { ReactNode } from 'react';
import { createPageMetadata } from '../../utils/metadata';

export const metadata = createPageMetadata({ title: 'Frequently Asked Questions', description: 'Answers about Green Store delivery, payments, coupons, plant care, returns, and refunds.', path: '/faq' });
export default function Layout({ children }: { children: ReactNode }) { return children; }
