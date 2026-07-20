import type { ReactNode } from 'react';
import { createPageMetadata } from '../../utils/metadata';

export const metadata = createPageMetadata({ title: 'Create Account', description: 'Create your Green Store customer account.', path: '/register', noIndex: true });
export default function Layout({ children }: { children: ReactNode }) { return children; }
