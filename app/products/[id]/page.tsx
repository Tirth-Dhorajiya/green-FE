'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import api, { BASE_URL } from '../../../services/api';
import { useCart } from '../../../context/CartContext';
import { ShoppingCart, Heart, ArrowLeft, ShieldCheck, Truck, RotateCcw, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductImage {
  url: string;
  is_default: boolean;
  is_thumbnail: boolean;
}

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeIdx, setActiveIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        if (res.data.success) {
          const p = res.data.product;
          setProduct(p);
          // Set initial active image based on default flag
          const defaultIdx = (p.images ?? []).findIndex((img: any) => img.is_default);
          setActiveIdx(defaultIdx >= 0 ? defaultIdx : 0);
        }
      } catch {
        toast.error('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-24 flex justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
    </div>
  );

  if (!product) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <h2 className="text-2xl font-bold mb-4">Product not found</h2>
      <Link href="/products" className="text-primary hover:underline">Return to products</Link>
    </div>
  );

  // Build gallery from images JSONB or fall back to image_url
  let rawImages: ProductImage[] = [];
  try {
    const imgs = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
    if (Array.isArray(imgs) && imgs.length > 0) {
      rawImages = imgs;
    } else if (product.image_url) {
      rawImages = [{ url: product.image_url, is_default: true, is_thumbnail: true }];
    }
  } catch (e) {
    if (product.image_url) {
      rawImages = [{ url: product.image_url, is_default: true, is_thumbnail: true }];
    }
  }

  const gallery = rawImages.map(img => ({
    ...img,
    url: img.url.startsWith('http') ? img.url : `${BASE_URL}${img.url}`,
  }));

  const activeUrl = gallery[activeIdx]?.url ?? 'https://images.unsplash.com/photo-1463320726281-696a485928c7?q=80&w=1200&auto=format&fit=crop';

  const prev = () => setActiveIdx(i => (i - 1 + gallery.length) % gallery.length);
  const next = () => setActiveIdx(i => (i + 1) % gallery.length);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/products" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary mb-8 transition">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Shop
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* ── Gallery ── */}
        <div className="flex flex-col gap-4">
          {/* Main image */}
          <div className="relative aspect-square bg-black/5 dark:bg-white/5 rounded-3xl overflow-hidden group border border-black/5 dark:border-white/10">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeIdx}
                src={activeUrl}
                alt={product.name}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>

            {gallery.length > 1 && (
              <>
                <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 dark:bg-black/70 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition hover:bg-primary hover:text-white">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 dark:bg-black/70 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition hover:bg-primary hover:text-white">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            <button
              onClick={() => setLightboxOpen(true)}
              className="absolute top-4 right-4 p-2 bg-white/80 dark:bg-black/60 rounded-xl opacity-0 group-hover:opacity-100 transition hover:bg-primary hover:text-white"
            >
              <ZoomIn className="w-5 h-5" />
            </button>

            {product.stock <= 0 && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                <span className="text-2xl font-black uppercase tracking-widest text-foreground opacity-40">Sold Out</span>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {gallery.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIdx(i)}
                  className={`flex-none w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${i === activeIdx ? 'border-primary shadow-lg shadow-primary/20 scale-105' : 'border-transparent hover:border-primary/40'}`}
                >
                  <img src={img.url} alt={`thumb-${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Product Info ── */}
        <div className="flex flex-col">
          <div className="mb-8">
            <div className="flex justify-between items-start mb-3">
              <span className="text-sm font-black text-primary uppercase tracking-widest">{product.category}</span>
              {product.stock > 0 ? (
                <span className="bg-primary/10 text-primary text-xs px-3 py-1 rounded-full font-bold">In Stock ({product.stock})</span>
              ) : (
                <span className="bg-red-100 dark:bg-red-900/30 text-red-600 text-xs px-3 py-1 rounded-full font-bold">Out of Stock</span>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 tracking-tight">{product.name}</h1>
            <p className="text-3xl font-bold text-foreground">${parseFloat(product.price).toFixed(2)}</p>
          </div>

          <div className="prose prose-green dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 mb-8">
            <p>{product.description}</p>
          </div>

          <div className="mt-auto space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center border-2 border-black/5 dark:border-white/10 rounded-xl bg-card w-32 h-14 shrink-0">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="flex-1 h-full flex items-center justify-center text-gray-500 hover:text-primary transition">-</button>
                <span className="w-10 text-center font-bold text-lg text-foreground">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="flex-1 h-full flex items-center justify-center text-gray-500 hover:text-primary transition">+</button>
              </div>

              <button
                onClick={() => addToCart(product.id, quantity)}
                disabled={product.stock <= 0}
                className="flex-1 flex items-center justify-center space-x-2 bg-primary hover:bg-primary-dark text-white h-14 rounded-xl font-bold text-lg transition duration-300 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>

              <button className="h-14 w-14 shrink-0 flex items-center justify-center bg-primary/10 text-primary hover:bg-primary/20 rounded-xl transition border border-primary/20">
                <Heart className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-black/5 dark:border-white/10">
              {[
                { icon: Truck, title: 'Free Shipping', sub: 'On orders over $50' },
                { icon: RotateCcw, title: 'Easy Returns', sub: '30 days return policy' },
                { icon: ShieldCheck, title: 'Secure Payment', sub: '100% secure checkout' },
              ].map(({ icon: Icon, title, sub }) => (
                <div key={title} className="flex items-start">
                  <Icon className="w-6 h-6 text-primary mr-3 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">{title}</h4>
                    <p className="text-xs text-gray-500 mt-1">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <motion.img
              key={activeIdx}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              src={activeUrl}
              alt={product.name}
              className="max-w-full max-h-full object-contain rounded-2xl"
              onClick={e => e.stopPropagation()}
            />
            {gallery.length > 1 && (
              <>
                <button onClick={e => { e.stopPropagation(); prev(); }}
                  className="absolute left-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition">
                  <ChevronLeft className="w-7 h-7" />
                </button>
                <button onClick={e => { e.stopPropagation(); next(); }}
                  className="absolute right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition">
                  <ChevronRight className="w-7 h-7" />
                </button>
              </>
            )}
            <button onClick={() => setLightboxOpen(false)} className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition">
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
