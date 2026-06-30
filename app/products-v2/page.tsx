'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '../../services/api';
import ProductCardV2 from '../../components/ProductCardV2';
import { Search, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import GrainOverlay from '../../components/GrainOverlay';

function ProductsV2Content() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'created_at');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (search) params.set('search', search);
    if (sortBy) params.set('sortBy', sortBy);
    router.push(`/products-v2?${params.toString()}`, { scroll: false });
  }, [category, search, sortBy]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ sortBy, order: 'desc', limit: '20' });
      if (category) params.append('category', category);
      if (search) params.append('search', search);
      const res = await api.get(`/products?${params.toString()}`);
      if (res.data.success) setProducts(res.data.products);
    } catch (error) {
      console.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['plants', 'seeds', 'tools', 'other'];

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] selection:bg-primary selection:text-white">
      <GrainOverlay />

      {/* Modern Filter Bar */}
      <div className="pt-8 px-6 lg:px-12">
        <div className="max-w-screen-2xl mx-auto">
          <div className="glass rounded-[2rem] shadow-premium p-3 flex flex-col md:flex-row items-center justify-between border border-white/20 dark:border-white/5 gap-4">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto px-2">
              <button
                onClick={() => setCategory('')}
                className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${!category ? 'bg-primary text-white' : 'hover:bg-black/5 dark:hover:bg-white/5 text-gray-500'}`}
              >
                All Items
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${category === cat ? 'bg-primary text-white' : 'hover:bg-black/5 dark:hover:bg-white/5 text-gray-500'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex flex-1 items-center max-w-md w-full px-4">
              <div className="relative w-full group">
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="SEARCH COLLECTION..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent w-full pl-8 pr-2 py-2 text-[10px] font-black tracking-widest outline-none border-b border-transparent focus:border-primary/30 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center bg-black/5 dark:bg-white/5 rounded-2xl px-4 py-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mr-4">Sort By</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-xs font-black uppercase tracking-widest outline-none cursor-pointer text-foreground"
                >
                  <option value="created_at">Latest</option>
                  <option value="price_low">Price: Low</option>
                  <option value="price_high">Price: High</option>
                  <option value="name">Alpha</option>
                </select>
              </div>
              <button className="p-3 bg-black/5 dark:bg-white/5 rounded-2xl hover:bg-black/10 transition">
                <SlidersHorizontal className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <main className="px-6 lg:px-12 py-20 min-h-[60vh]">
        <div className="max-w-screen-2xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="aspect-[3/4] bg-black/5 dark:bg-white/5 animate-pulse rounded-[3rem]" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1 }
                }
              }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 lg:gap-16"
            >
              {products.map((product: any) => (
                <ProductCardV2 key={product.id} product={product} />
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-40">
              <h2 className="text-4xl font-black text-gray-300 uppercase tracking-widest mb-6">No Specimens Found</h2>
              <button
                onClick={() => { setCategory(''); setSearch(''); }}
                className="text-primary font-black uppercase tracking-widest hover:underline"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Floating Counter */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-40">
        <div className="bg-black text-white px-8 py-4 rounded-full font-black text-xs uppercase tracking-[0.3em] shadow-2xl flex items-center gap-6">
          <span>Showing {products.length} Items</span>
          <div className="w-[1px] h-4 bg-white/20" />
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-primary transition-colors">Back to Top</button>
        </div>
      </div>
    </div>
  );
}

export default function ProductsV2() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ProductsV2Content />
    </Suspense>
  );
}
