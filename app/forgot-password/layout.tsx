import type { ReactNode } from 'react';
import { createPageMetadata } from '../../utils/metadata';

export const metadata = createPageMetadata({ title: 'Reset Password', description: 'Reset your Green Store account password.', path: '/forgot-password', noIndex: true });
export default function Layout({ children }: { children: ReactNode }) { return children; }
