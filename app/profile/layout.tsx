import type { ReactNode } from 'react';
import { createPageMetadata } from '../../utils/metadata';

export const metadata = createPageMetadata({ title: 'Account & Orders', description: 'Manage your Green Store profile, orders, shipping, returns, and refunds.', path: '/profile', noIndex: true });
export default function Layout({ children }: { children: ReactNode }) { return children; }
