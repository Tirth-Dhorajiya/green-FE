'use client';

import Link from 'next/link';
import { ArrowRight, Heart } from 'lucide-react';
import ProductCardV2 from '../../components/ProductCardV2';
import { ProductGridSkeleton } from '../../components/Skeletons';
import { useWishlist } from '../../context/WishlistContext';

export default function WishlistPage() {
  const { wishlist, loading } = useWishlist();

  return (
    <main className="mx-auto max-w-screen-2xl px-3 py-4 sm:px-6 sm:py-12 lg:px-12">
      <div className="mb-6 flex items-end justify-between gap-3 sm:mb-10 sm:items-center">
        <div>
          <p className="mb-1 text-[10px] font-black uppercase tracking-[0.18em] text-primary sm:mb-2 sm:text-xs sm:tracking-[0.2em]">Saved items</p>
          <div className="flex items-baseline gap-2">
            <h1 className="text-2xl font-black text-foreground sm:text-3xl md:text-4xl">Wishlist</h1>
            {!loading && wishlist.length > 0 && <span className="text-xs font-bold text-gray-500">({wishlist.length})</span>}
          </div>
        </div>
        <Link href="/products" className="inline-flex shrink-0 items-center rounded-full border border-primary/30 px-3 py-2 text-xs font-black text-primary transition hover:bg-primary hover:text-white sm:rounded-xl sm:border-0 sm:bg-primary sm:px-5 sm:py-3 sm:text-white sm:hover:bg-primary-dark">
          <span className="sm:hidden">Shop</span><span className="hidden sm:inline">Continue Shopping</span>
          <ArrowRight className="ml-1.5 h-4 w-4" />
        </Link>
      </div>

      {loading ? (
        <ProductGridSkeleton count={6} compactOnMobile />
      ) : wishlist.length === 0 ? (
        <section className="motion-surface flex min-h-[50vh] flex-col items-center justify-center rounded-2xl border border-black/5 bg-card p-5 text-center dark:border-white/10 sm:p-10">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 sm:mb-6 sm:h-20 sm:w-20">
            <Heart className="h-8 w-8 text-primary sm:h-10 sm:w-10" />
          </div>
          <h2 className="mb-3 text-xl font-black text-foreground sm:text-2xl">No wishlist items yet</h2>
          <p className="mb-6 max-w-md text-sm leading-relaxed text-gray-500 dark:text-gray-400 sm:mb-8 sm:text-base">
            Save products you like from the shop page and they will appear here.
          </p>
          <Link href="/products" className="bg-primary text-white px-6 py-3 rounded-xl font-black hover:bg-primary-dark transition">
            Browse Products
          </Link>
        </section>
      ) : (
        <section className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 lg:gap-8 xl:grid-cols-4 xl:gap-12">
          {wishlist.map((product) => (
            <ProductCardV2 key={product.id} product={product} compactOnMobile />
          ))}
        </section>
      )}
    </main>
  );
}
