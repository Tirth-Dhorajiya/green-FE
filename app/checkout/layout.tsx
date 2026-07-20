import type { ReactNode } from 'react';
import { createPageMetadata } from '../../utils/metadata';

export const metadata = createPageMetadata({ title: 'Secure Checkout', description: 'Complete your Green Store order securely.', path: '/checkout', noIndex: true });
export default function Layout({ children }: { children: ReactNode }) { return children; }
