'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { BASE_URL } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { ProductGridSkeleton } from '../../components/Skeletons';
import ConfirmationModal from '../../components/ConfirmationModal';

const fallbackImage = 'https://images.unsplash.com/photo-1463320726281-696a485928c7?q=80&w=600&auto=format&fit=crop';

const getImageUrl = (imageUrl?: string) => {
  if (!imageUrl) return fallbackImage;
  return imageUrl.startsWith('http') ? imageUrl : `${BASE_URL}${imageUrl}`;
};

export default function WishlistPage() {
  const { wishlist, loading, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [removeProduct, setRemoveProduct] = useState<typeof wishlist[number] | null>(null);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
        <section className="min-h-[45vh] flex flex-col items-center justify-center text-center bg-card rounded-lg border border-black/5 dark:border-white/10 p-10">
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
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {wishlist.map((product) => (
            <article key={product.id} className="bg-card rounded-lg border border-black/5 dark:border-white/10 overflow-hidden shadow-sm">
              <Link href={`/products/${product.id}`} className="relative block aspect-[4/3] bg-black/5 dark:bg-white/5">
                <Image
                  src={getImageUrl(product.thumbnail_url || product.image_url)}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </Link>
              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-1">{product.category}</p>
                    <Link href={`/products/${product.id}`} className="text-xl font-black text-foreground hover:text-primary transition">
                      {product.name}
                    </Link>
                  </div>
                  <p className="text-xl font-black text-primary">₹{parseFloat(product.price).toFixed(2)}</p>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-6">{product.description || 'Saved product'}</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => addToCart(product.id, 1)}
                    disabled={product.stock <= 0}
                    className="flex-1 inline-flex cursor-pointer items-center justify-center gap-2 bg-primary text-white px-4 py-3 rounded-xl font-black hover:bg-primary-dark transition disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setRemoveProduct(product)}
                    className="w-full cursor-pointer sm:w-12 h-12 inline-flex items-center justify-center rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
      <ConfirmationModal
        isOpen={!!removeProduct}
        onClose={() => setRemoveProduct(null)}
        onConfirm={async () => {
          if (removeProduct) await removeFromWishlist(removeProduct.id);
        }}
        title="Remove wishlist item?"
        message={removeProduct ? `Remove "${removeProduct.name}" from your wishlist?` : 'Remove this item from your wishlist?'}
        confirmText="Remove"
        variant="danger"
      />
    </main>
  );
}
