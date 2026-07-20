'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { BASE_URL } from '../services/api';
import ConfirmationModal from './ConfirmationModal';

interface Product {
  id: string;
  name: string;
  description?: string;
  price: string;
  category: string;
  image_url?: string;
  thumbnail_url?: string;
  stock: number;
}

const fallbackImage = 'https://images.unsplash.com/photo-1463320726281-696a485928c7?q=80&w=600&auto=format&fit=crop';

export default function ProductCardV2({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [confirmRemove, setConfirmRemove] = React.useState(false);
  const wishlisted = isWishlisted(product.id);
  const stock = Number(product.stock);
  const isOutOfStock = stock <= 0;
  const isLowStock = stock > 0 && stock <= 5;
  const rawImageUrl = product.thumbnail_url || product.image_url;
  const imageUrl = rawImageUrl
    ? (rawImageUrl.startsWith('http') ? rawImageUrl : `${BASE_URL}${rawImageUrl}`)
    : fallbackImage;
  const numericPrice = Number(product.price);
  const formattedPrice = Number.isFinite(numericPrice)
    ? new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
      }).format(numericPrice)
    : product.price;

  const handleWishlistToggle = () => {
    if (wishlisted) {
      setConfirmRemove(true);
      return;
    }
    toggleWishlist(product);
  };

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="group flex h-full flex-col rounded-2xl border border-black/10 bg-card p-3 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_24px_60px_-28px_rgba(6,78,59,0.45)] dark:border-white/10"
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-black/5 dark:bg-white/5">
          <Link href={`/products/${product.id}`} className="block h-full w-full" aria-label={`View ${product.name}`}>
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 25vw"
              className={`h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105 ${isOutOfStock ? 'grayscale-[35%]' : ''}`}
            />
            <span className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/35 to-transparent opacity-70" />
          </Link>

          <div className="absolute left-3 top-3 flex items-center gap-2">
            <span className="rounded-full border border-white/50 bg-white/90 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-primary shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-black/70">
              {product.category}
            </span>
            {isOutOfStock && (
              <span className="rounded-full bg-gray-900/85 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-white backdrop-blur-md">
                Sold out
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleWishlistToggle}
            className={`absolute right-3 top-3 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border shadow-lg backdrop-blur-md transition-all duration-300 active:scale-90 ${
              wishlisted
                ? 'border-primary bg-primary text-white'
                : 'border-white/50 bg-white/90 text-gray-800 hover:border-primary hover:bg-primary hover:text-white dark:border-white/10 dark:bg-black/70 dark:text-white'
            }`}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            aria-pressed={wishlisted}
          >
            <Heart className={`h-5 w-5 ${wishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>

        <div className="flex flex-1 flex-col px-2 pb-2 pt-5">
          <div className="mb-3 flex items-start justify-between gap-4">
            <Link href={`/products/${product.id}`} className="min-w-0">
              <h3 className="line-clamp-2 text-lg font-black leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary">
                {product.name}
              </h3>
            </Link>
            <span className="shrink-0 text-lg font-black tracking-tight text-primary">
              {formattedPrice}
            </span>
          </div>

          <p className="mb-5 line-clamp-2 flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            {product.description || 'A thoughtfully selected product for your green space.'}
          </p>

          {(isOutOfStock || isLowStock) && (
            <div className="mb-3 flex items-center gap-2 text-xs font-bold">
              <span className={`h-2 w-2 rounded-full ${isOutOfStock ? 'bg-gray-400' : 'bg-amber-500'}`} />
              <span className={isLowStock ? 'text-amber-600 dark:text-amber-400' : 'text-gray-600 dark:text-gray-400'}>
                {isOutOfStock ? 'Currently unavailable' : `Only ${stock} left in stock`}
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={() => addToCart(product.id, 1)}
            disabled={isOutOfStock}
            className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-black text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:bg-primary-dark hover:shadow-primary/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none dark:disabled:bg-white/10 dark:disabled:text-gray-500"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
          </button>
        </div>
      </motion.article>

      <ConfirmationModal
        isOpen={confirmRemove}
        onClose={() => setConfirmRemove(false)}
        onConfirm={() => toggleWishlist(product)}
        title="Remove wishlist item?"
        message={`Remove "${product.name}" from your wishlist?`}
        confirmText="Remove"
        variant="danger"
      />
    </>
  );
}
