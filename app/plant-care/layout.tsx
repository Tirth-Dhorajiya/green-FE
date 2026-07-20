import type { ReactNode } from 'react';
import { createPageMetadata } from '../../utils/metadata';

export const metadata = createPageMetadata({ title: 'Plant Care Guide', description: 'Practical guidance for watering, light, soil, pruning, pests, and healthy indoor plant growth.', path: '/plant-care' });
export default function Layout({ children }: { children: ReactNode }) { return children; }
