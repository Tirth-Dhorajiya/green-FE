import type { ReactNode } from 'react';
import { createPageMetadata } from '../../utils/metadata';

export const metadata = createPageMetadata({ title: 'Privacy Policy', description: 'Learn how Green Store collects, uses, protects, and retains customer and order information.', path: '/privacy-policy' });
export default function Layout({ children }: { children: ReactNode }) { return children; }
