import type { ReactNode } from 'react';
import { createPageMetadata } from '../../utils/metadata';

export const metadata = createPageMetadata({ title: 'Sign In', description: 'Sign in to your Green Store account.', path: '/login', noIndex: true });
export default function Layout({ children }: { children: ReactNode }) { return children; }
