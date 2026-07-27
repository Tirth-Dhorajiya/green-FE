'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import AmbientBotanicalMotion from '@/components/layout/AmbientBotanicalMotion';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import PageTransition from '@/components/layout/PageTransition';
import ScrollToTopButton from '@/components/ui/ScrollToTopButton';

const AUTH_ROUTES = new Set(['/login', '/register']);

export default function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAuthRoute = AUTH_ROUTES.has(pathname);

  return (
    <>
      {!isAuthRoute && (
        <>
          <Navbar />
          <AmbientBotanicalMotion />
        </>
      )}
      <main className={`min-w-0 flex-grow overflow-x-clip ${isAuthRoute ? '' : 'pt-20 sm:pt-24'}`}>
        <PageTransition>{children}</PageTransition>
      </main>
      {!isAuthRoute && (
        <>
          <ScrollToTopButton />
          <Footer />
        </>
      )}
    </>
  );
}
