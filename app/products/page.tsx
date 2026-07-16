'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '../../services/api';
import { endpoints } from '../../services/apiConfig';
import ProductCardV2 from '../../components/ProductCardV2';
import { ChevronDown, Search, SlidersHorizontal, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { ProductGridSkeleton } from '../../components/Skeletons';

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'created_at');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [stockStatus, setStockStatus] = useState(searchParams.get('stockStatus') || '');
  const [isSortOpen, setIsSortOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (search) params.set('search', search);
    if (sortBy) params.set('sortBy', sortBy);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (stockStatus) params.set('stockStatus', stockStatus);
    router.push(`/products?${params.toString()}`, { scroll: false });
  }, [category, search, sortBy, minPrice, maxPrice, stockStatus]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const sortMap: Record<string, { sortBy: string; order: string }> = {
        created_at: { sortBy: 'created_at', order: 'desc' },
        price_low: { sortBy: 'price', order: 'asc' },
        price_high: { sortBy: 'price', order: 'desc' },
        name: { sortBy: 'name', order: 'asc' },
      };
      const selectedSort = sortMap[sortBy] || sortMap.created_at;
      const params = new URLSearchParams({ ...selectedSort, limit: '20' });
      if (category) params.append('category', category);
      if (search) params.append('search', search);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (stockStatus) params.append('stockStatus', stockStatus);
      const res = await api.get(`${endpoints.products.list}?${params.toString()}`);
      if (res.data.success) setProducts(res.data.products);
    } catch (error) {
      console.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['plants', 'seeds', 'tools', 'planters', 'other'];
  const sortOptions = [
    { value: 'created_at', label: 'Latest' },
    { value: 'price_low', label: 'Price: Low' },
    { value: 'price_high', label: 'Price: High' },
    { value: 'name', label: 'Name' },
  ];
  const selectedSortLabel = sortOptions.find((option) => option.value === sortBy)?.label || 'Latest';
  const resetFilters = () => {
    setCategory('');
    setSearch('');
    setMinPrice('');
    setMaxPrice('');
    setStockStatus('');
  };

  return (
    <div className="min-h-screen bg-background selection:bg-primary selection:text-white">

      <div className="pt-8 px-4 sm:px-6 lg:px-12">
        <div className="max-w-screen-2xl mx-auto">
          <div className="bg-card border border-black/10 dark:border-white/10 rounded-xl shadow-sm p-4 sm:p-5">
            <div className="flex flex-col xl:flex-row gap-5 xl:items-center xl:justify-between">
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-1">Shop Collection</p>
                <h1 className="text-2xl font-black text-foreground tracking-tight">Find your next green companion</h1>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_180px] gap-3 w-full xl:max-w-3xl">
                <div className="relative rounded-xl border border-primary/40 bg-card shadow-[0_14px_30px_-24px_rgba(6,78,59,0.7)] transition focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10">
                  <label htmlFor="product-search" className="sr-only">Search products</label>
                  <div className="pointer-events-none absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Search className="w-4 h-4" />
                  </div>
                  <input
                    id="product-search"
                    type="search"
                    placeholder="Search plants, seeds, tools..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-14 w-full rounded-xl border-0 bg-transparent pl-16 pr-24 text-base font-black text-foreground placeholder:text-gray-600 dark:placeholder:text-gray-400 outline-none"
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-lg bg-primary px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-white shadow-sm shadow-primary/20">
                    Search
                  </span>
                </div>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsSortOpen((open) => !open)}
                    className="w-full h-14 cursor-pointer rounded-xl border border-black/10 dark:border-white/10 bg-card pl-4 pr-4 text-sm font-black text-foreground outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition flex items-center justify-between gap-3"
                    aria-haspopup="listbox"
                    aria-expanded={isSortOpen}
                  >
                    <span className="flex items-center gap-3 min-w-0">
                      <SlidersHorizontal className="w-4 h-4 text-primary shrink-0" />
                      <span className="truncate">{selectedSortLabel}</span>
                    </span>
                    <span className="flex items-center gap-2 text-xs font-black text-foreground">
                      Sort
                      <ChevronDown className={`w-4 h-4 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
                    </span>
                  </button>

                  {isSortOpen && (
                    <div
                      role="listbox"
                      className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-full overflow-hidden rounded-lg border border-primary/20 bg-card shadow-premium"
                    >
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          role="option"
                          aria-selected={sortBy === option.value}
                          onClick={() => {
                            setSortBy(option.value);
                            setIsSortOpen(false);
                          }}
                          className={`w-full cursor-pointer px-4 py-3 text-left text-sm font-bold transition ${
                            sortBy === option.value
                              ? 'bg-primary text-white'
                              : 'text-foreground hover:bg-primary/10 hover:text-primary'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
              {[{ value: '', label: 'All Items' }, ...categories.map((cat) => ({ value: cat, label: cat }))].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setCategory(item.value)}
                  className={`shrink-0 cursor-pointer rounded-lg border px-4 py-2 text-xs font-black uppercase tracking-[0.14em] transition ${
                    category === item.value
                      ? 'border-primary bg-primary text-white shadow-sm shadow-primary/20'
                      : 'border-black/10 dark:border-white/10 bg-card text-foreground hover:border-primary/40 hover:text-primary hover:bg-primary/10'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_220px_auto] gap-3">
              <label className="block">
                <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.16em] text-gray-600 dark:text-gray-400">Min price</span>
                <input
                  type="number"
                  min="0"
                  inputMode="decimal"
                  value={minPrice}
                  onChange={(event) => setMinPrice(event.target.value)}
                  placeholder="0"
                  className="h-12 w-full rounded-xl border border-black/10 dark:border-white/10 bg-card px-4 text-sm font-black text-foreground outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.16em] text-gray-600 dark:text-gray-400">Max price</span>
                <input
                  type="number"
                  min="0"
                  inputMode="decimal"
                  value={maxPrice}
                  onChange={(event) => setMaxPrice(event.target.value)}
                  placeholder="Any"
                  className="h-12 w-full rounded-xl border border-black/10 dark:border-white/10 bg-card px-4 text-sm font-black text-foreground outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.16em] text-gray-600 dark:text-gray-400">Stock</span>
                <select
                  value={stockStatus}
                  onChange={(event) => setStockStatus(event.target.value)}
                  className="h-12 w-full rounded-xl border border-black/10 dark:border-white/10 bg-card px-4 text-sm font-black text-foreground outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
                >
                  <option value="">All stock</option>
                  <option value="in_stock">In stock</option>
                  <option value="out_of_stock">Out of stock</option>
                </select>
              </label>
              <button
                type="button"
                onClick={resetFilters}
                className="h-12 cursor-pointer self-end rounded-xl border border-black/10 dark:border-white/10 bg-card px-4 text-sm font-black text-foreground hover:border-primary/40 hover:text-primary hover:bg-primary/10 transition inline-flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <main className="px-4 sm:px-6 lg:px-12 py-14 sm:py-20 min-h-[60vh]">
        <div className="max-w-screen-2xl mx-auto">
          {loading ? (
            <ProductGridSkeleton count={8} />
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
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-12 xl:gap-16"
            >
              {products.map((product: any) => (
                <ProductCardV2 key={product.id} product={product} />
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-40">
              <h2 className="text-4xl font-black text-gray-600 dark:text-gray-400 uppercase tracking-widest mb-6">No Specimens Found</h2>
              <button
                onClick={resetFilters}
                className="cursor-pointer text-primary font-black uppercase tracking-widest hover:underline"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Floating Counter */}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-background px-4 py-20 sm:px-6 lg:px-12"><ProductGridSkeleton count={8} /></main>}>
      <ProductsContent />
    </Suspense>
  );
}
