'use client';

import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

const SHOW_AFTER_PX = 320;

export default function ScrollToTopButton() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let animationFrame = 0;
    let isScheduled = false;

    const updateScrollState = () => {
      const scrollTop = window.scrollY;
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollableHeight > 0
        ? Math.min(100, Math.max(0, (scrollTop / scrollableHeight) * 100))
        : 0;

      setScrollProgress(progress);
      setIsVisible(scrollTop >= SHOW_AFTER_PX);
      isScheduled = false;
    };

    const handleScroll = () => {
      if (isScheduled) return;
      isScheduled = true;
      animationFrame = window.requestAnimationFrame(updateScrollState);
    };

    updateScrollState();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  const scrollToTop = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll back to top"
      title="Back to top"
      className={`fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom))] right-3 z-50 grid size-11 place-items-center rounded-full p-[2px] shadow-xl shadow-black/25 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background motion-reduce:transition-none sm:bottom-6 sm:right-6 sm:size-12 lg:bottom-8 lg:right-8 lg:size-14 ${
        isVisible
          ? 'translate-y-0 scale-100 opacity-100'
          : 'pointer-events-none translate-y-4 scale-90 opacity-0'
      }`}
      style={{
        background: `conic-gradient(rgb(16 185 129) ${scrollProgress}%, rgb(16 185 129 / 0.18) ${scrollProgress}%)`,
      }}
    >
      <span className="grid h-full w-full place-items-center rounded-full border border-white/10 bg-[#102019]/95 text-primary backdrop-blur-md transition-colors hover:bg-primary hover:text-white">
        <ArrowUp className="size-4 sm:size-5" strokeWidth={2.5} aria-hidden="true" />
      </span>
    </button>
  );
}
