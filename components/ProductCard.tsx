import React from 'react';
import { BASE_URL } from '../services/api';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { motion } from 'framer-motion';
import ConfirmationModal from './ConfirmationModal';

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
            sizes="(max-width: 768px) 100vw, 25vw"
            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        </Link>
        <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
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
              <h3 className="text-xl font-black text-foreground hover:text-primary transition-colors line-clamp-1 tracking-tight leading-tight">
                {product.name}
              </h3>
            </Link>
          </div>
          <span className="text-xl font-black text-foreground shrink-0">
            ₹{parseFloat(product.price).toFixed(2)}
          </span>
        </div>

        <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-2 leading-relaxed flex-grow">
          {product.description}
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
