'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import ProductCardV2 from '../ProductCardV2';
import { ProductGridSkeleton } from '../Skeletons';

export type FeaturedProduct = {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  image_url: string;
  thumbnail_url?: string;
  stock: number;
};

export default function FeaturedProductsSection({ products, loading }: { products: FeaturedProduct[]; loading: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [canScroll, setCanScroll] = useState(false);

  const updateCanScroll = useCallback(() => {
    const track = trackRef.current;
    setCanScroll(Boolean(track && track.scrollWidth > track.clientWidth + 2));
  }, []);

  useEffect(() => {
    updateCanScroll();
    const track = trackRef.current;
    if (!track) return;

    const resizeObserver = new ResizeObserver(updateCanScroll);
    resizeObserver.observe(track);
    return () => resizeObserver.disconnect();
  }, [products.length, updateCanScroll]);

  const moveCarousel = useCallback((direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;

    const cards = Array.from(track.children) as HTMLElement[];
    if (!cards.length) return;

    const maxScrollLeft = track.scrollWidth - track.clientWidth;
    if (direction === 1 && track.scrollLeft >= maxScrollLeft - 4) {
      track.scrollTo({ left: 0, behavior: 'smooth' });
      return;
    }
    if (direction === -1 && track.scrollLeft <= 4) {
      track.scrollTo({ left: maxScrollLeft, behavior: 'smooth' });
      return;
    }

    const firstCardOffset = cards[0].offsetLeft;
    const cardOffsets = cards.map((card) => card.offsetLeft - firstCardOffset);

    const currentIndex = cardOffsets.reduce((closestIndex, cardOffset, index) => (
      Math.abs(cardOffset - track.scrollLeft) < Math.abs(cardOffsets[closestIndex] - track.scrollLeft)
        ? index
        : closestIndex
    ), 0);
    const nextIndex = direction === 1
      ? (currentIndex + 1) % cards.length
      : (currentIndex - 1 + cards.length) % cards.length;

    track.scrollTo({ left: cardOffsets[nextIndex], behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (loading || isPaused || !canScroll || reducedMotion) return;

    const timer = window.setInterval(() => moveCarousel(1), 4500);
    return () => window.clearInterval(timer);
  }, [canScroll, isPaused, loading, moveCarousel]);

  return (
    <section className="py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4 sm:mb-12 md:mb-16">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-primary sm:text-sm sm:font-bold sm:tracking-widest">Curated Selection</span>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-foreground sm:mt-2 sm:text-4xl md:text-5xl">Featured Products.</h2>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            {!loading && products.length > 1 && (
              <div className="flex items-center gap-2" aria-label="Featured product navigation">
                <button
                  type="button"
                  onClick={() => moveCarousel(-1)}
                  disabled={!canScroll}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/25 bg-card text-primary shadow-sm transition hover:border-primary hover:bg-primary hover:text-white disabled:cursor-default disabled:opacity-35 sm:h-11 sm:w-11"
                  aria-label="Previous featured product"
                >
                  <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => moveCarousel(1)}
                  disabled={!canScroll}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/25 bg-card text-primary shadow-sm transition hover:border-primary hover:bg-primary hover:text-white disabled:cursor-default disabled:opacity-35 sm:h-11 sm:w-11"
                  aria-label="Next featured product"
                >
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
            )}
            <Link href="/products" className="group hidden shrink-0 items-center rounded-full text-sm font-black text-foreground transition-colors hover:text-primary sm:inline-flex sm:text-base">
              Explore All
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {loading ? (
          <ProductGridSkeleton count={4} compactOnMobile />
        ) : (
          <div
            ref={trackRef}
            className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-3 [scrollbar-width:none] sm:gap-6 sm:pb-4 xl:gap-8 [&::-webkit-scrollbar]:hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocusCapture={() => setIsPaused(true)}
            onBlurCapture={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false);
            }}
            onPointerDown={() => setIsPaused(true)}
            onPointerUp={() => setIsPaused(false)}
            onPointerCancel={() => setIsPaused(false)}
            aria-label="Featured products"
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="min-w-0 shrink-0 snap-start basis-[calc((100%-0.75rem)/2)] md:basis-[calc((100%-3rem)/3)] xl:basis-[calc((100%-6rem)/4)]"
              >
                <ProductCardV2 product={product} compactOnMobile />
              </div>
            ))}
          </div>
        )}

        {!loading && (
          <Link href="/products" className="mt-3 inline-flex items-center text-sm font-black text-primary sm:hidden">
            Explore all products
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Link>
        )}
      </div>
    </section>
  );
}
