'use client';

import React from 'react';
import { BASE_URL } from '../services/api';
import Link from 'next/link';
import { ShoppingCart, ArrowUpRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  image_url: string;
  stock: number;
}

export default function ProductCardV2({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const imageUrl = product.image_url 
    ? (product.image_url.startsWith('http') ? product.image_url : `${BASE_URL}${product.image_url}`)
    : 'https://images.unsplash.com/photo-1463320726281-696a485928c7?q=80&w=600&auto=format&fit=crop';

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col bg-white dark:bg-black/20 rounded-[3rem] overflow-hidden border border-black/5 dark:border-white/5 hover:border-primary/20 transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)]"
    >
      {/* Visual Area */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <Link href={`/products/${product.id}`} className="block w-full h-full">
          <img
            src={imageUrl}
            alt={product.name}
            className="object-cover w-full h-full scale-100 group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
          />
        </Link>
        
        {/* Category Badge */}
        <div className="absolute top-6 left-6">
          <span className="px-4 py-1.5 rounded-full bg-white/80 dark:bg-black/60 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-primary border border-white/20">
            {product.category}
          </span>
        </div>

        {/* Floating Action */}
        <div className="absolute top-6 right-6">
          <Link 
            href={`/products/${product.id}`}
            className="w-12 h-12 rounded-full bg-white/90 dark:bg-black/90 backdrop-blur-md flex items-center justify-center text-foreground hover:bg-primary hover:text-white transition-all duration-500 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 shadow-2xl"
          >
            <ArrowUpRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Quick Add Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
           <button
             onClick={() => addToCart(product.id, 1)}
             disabled={product.stock <= 0}
             className="w-full h-14 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center space-x-3 shadow-2xl shadow-primary/40 active:scale-95 transition-all"
           >
             <ShoppingCart className="w-4 h-4" />
             <span>Instant Purchase</span>
           </button>
        </div>

        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center px-10 text-center">
            <span className="text-xl font-black uppercase tracking-[0.3em] text-foreground opacity-30">Sold Out</span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-10 flex flex-col items-center text-center">
        <h3 className="text-3xl font-black text-foreground tracking-tighter mb-2 group-hover:text-primary transition-colors duration-500 uppercase">
          {product.name}
        </h3>
        <p className="text-gray-400 dark:text-gray-500 text-sm mb-6 font-medium leading-relaxed line-clamp-2 max-w-[80%]">
          {product.description}
        </p>
        <div className="flex items-center gap-4">
           <div className="h-[1px] w-8 bg-black/10 dark:bg-white/10" />
           <span className="text-2xl font-black text-primary tracking-tight">
             ${parseFloat(product.price).toFixed(2)}
           </span>
           <div className="h-[1px] w-8 bg-black/10 dark:bg-white/10" />
        </div>
      </div>

      {/* Decorative Gradient */}
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-700" />
    </motion.div>
  );
}
