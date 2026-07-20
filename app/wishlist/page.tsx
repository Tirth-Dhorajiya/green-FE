'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import ProductCardV2 from '../../components/ProductCardV2';
import { ProductGridSkeleton } from '../../components/Skeletons';
import { useWishlist } from '../../context/WishlistContext';

export default function WishlistPage() {
  const { wishlist, loading } = useWishlist();

  return (
    <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-2">Saved items</p>
          <h1 className="text-3xl md:text-4xl font-black text-foreground">Wishlist</h1>
        </div>
        <Link href="/products" className="bg-primary text-white px-5 py-3 rounded-xl font-black hover:bg-primary-dark transition">
          Continue Shopping
        </Link>
      </div>

      {loading ? (
        <ProductGridSkeleton count={6} />
      ) : wishlist.length === 0 ? (
        <section className="motion-surface min-h-[45vh] flex flex-col items-center justify-center text-center bg-card rounded-lg border border-black/5 dark:border-white/10 p-10">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <Heart className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-black text-foreground mb-3">No wishlist items yet</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mb-8">
            Save products you like from the shop page and they will appear here.
          </p>
          <Link href="/products" className="bg-primary text-white px-6 py-3 rounded-xl font-black hover:bg-primary-dark transition">
            Browse Products
          </Link>
        </section>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-12 xl:gap-16">
          {wishlist.map((product) => (
            <ProductCardV2 key={product.id} product={product} />
          ))}
        </section>
      )}
    </main>
  );
}
