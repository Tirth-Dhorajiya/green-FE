'use client';

import React from 'react';
import { BASE_URL } from '../services/api';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { motion } from 'framer-motion';
import ConfirmationModal from './ConfirmationModal';
import { productDescriptionText } from '../utils/productDescription';

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  image_url: string;
  stock: number;
}

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [confirmRemove, setConfirmRemove] = React.useState(false);
  const imageUrl = product.image_url 
    ? (product.image_url.startsWith('http') ? product.image_url : `${BASE_URL}${product.image_url}`)
    : 'https://images.unsplash.com/photo-1463320726281-696a485928c7?q=80&w=600&auto=format&fit=crop';
  const descriptionText = productDescriptionText(product.description);

  const handleWishlistToggle = () => {
    if (isWishlisted(product.id)) {
      setConfirmRemove(true);
      return;
    }
    toggleWishlist(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-card rounded-xl p-4 shadow-sm hover:shadow-premium-hover hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-500 group border border-black/5 dark:border-white/5 flex flex-col h-full"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-black/5 dark:bg-white/5 mb-6">
        <Link href={`/products/${product.id}`} className="block w-full h-full">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        </Link>
        <div className="absolute right-3 top-3 flex translate-x-0 flex-col gap-2 opacity-100 transition-all duration-500 md:right-4 md:top-4 md:translate-x-12 md:opacity-0 md:group-hover:translate-x-0 md:group-hover:opacity-100">
          <button
            type="button"
            onClick={handleWishlistToggle}
            className="p-3 bg-white/90 dark:bg-black/70 backdrop-blur-md text-foreground rounded-lg hover:bg-primary hover:text-white transition-colors shadow-premium border border-black/10 dark:border-white/5"
            aria-label={isWishlisted(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={`w-5 h-5 ${isWishlisted(product.id) ? 'fill-current text-primary' : ''}`} />
          </button>
        </div>
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center p-6 text-center">
            <span className="bg-white text-gray-900 px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest shadow-xl">Out of Stock</span>
          </div>
        )}
      </div>

      <div className="px-2 pb-2 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-3 gap-2">
          <div className="flex-grow">
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1 block">
              {product.category}
            </span>
            <Link href={`/products/${product.id}`}>
              <h3 className="line-clamp-2 break-words text-xl font-black leading-tight tracking-tight text-foreground transition-colors hover:text-primary" title={product.name}>
                {product.name}
              </h3>
            </Link>
          </div>
          <span className="text-xl font-black text-foreground shrink-0">
            ₹{parseFloat(product.price).toFixed(2)}
          </span>
        </div>

        <p className="mb-6 line-clamp-3 flex-grow text-sm leading-relaxed text-gray-600 dark:text-gray-400" title={descriptionText || undefined}>
          {descriptionText}
        </p>

        <button
          onClick={() => addToCart(product.id, 1)}
          disabled={product.stock <= 0}
          className="w-full flex items-center justify-center space-x-3 bg-black/5 dark:bg-white/5 hover:bg-primary text-foreground dark:text-white hover:text-white py-4 rounded-lg font-bold text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group/btn shadow-lg hover:shadow-primary/30 border border-black/5 dark:border-white/10"
        >
          <ShoppingCart className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
          <span>Add to Cart</span>
        </button>
      </div>
      <ConfirmationModal
        isOpen={confirmRemove}
        onClose={() => setConfirmRemove(false)}
        onConfirm={() => toggleWishlist(product)}
        title="Remove wishlist item?"
        message={`Remove "${product.name}" from your wishlist?`}
        confirmText="Remove"
        variant="danger"
      />
    </motion.div>


  );
}
