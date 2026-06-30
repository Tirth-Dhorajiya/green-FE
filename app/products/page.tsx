'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '../../services/api';
import ProductCard from '../../components/ProductCard';
import { Search, Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Filters State
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'created_at');
  const [order, setOrder] = useState(searchParams.get('order') || 'desc');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
    // Update URL params
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (search) params.set('search', search);
    if (sortBy) params.set('sortBy', sortBy);
    if (order) params.set('order', order);
    if (page > 1) params.set('page', page.toString());
    
    router.push(`/products?${params.toString()}`, { scroll: false });
  }, [category, search, sortBy, order, page]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        sortBy,
        order
      });
      if (category) params.append('category', category);
      if (search) params.append('search', search);

      const res = await api.get(`/products?${params.toString()}`);
      if (res.data.success) {
        setProducts(res.data.products);
        setTotalPages(res.data.totalPages);
        setTotalCount(res.data.totalCount);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const clearFilters = () => {
    setCategory('');
    setSearch('');
    setSortBy('created_at');
    setOrder('desc');
    setPage(1);
  };

  const categories = ['plants', 'seeds', 'tools', 'other'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-2">Shop Our Collection</h1>
          <p className="text-gray-500 dark:text-gray-400">Showing {totalCount} products</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-64">
            <input 
              type="text" 
              placeholder="Search products..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-primary bg-card text-foreground"
            />
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          </form>
          
          <button 
            className="md:hidden p-2.5 bg-black/5 dark:bg-white/5 rounded-xl text-foreground"
            onClick={() => setIsMobileFiltersOpen(true)}
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Desktop Sidebar Filters */}
        <div className="hidden md:block w-64 shrink-0">
          <div className="bg-card p-6 rounded-2xl shadow-sm border border-black/5 dark:border-white/10 sticky top-24">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-foreground">Filters</h2>
              {(category || search) && (
                <button onClick={clearFilters} className="text-sm text-red-500 hover:underline">Clear all</button>
              )}
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wider">Categories</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => {setCategory(''); setPage(1);}}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition ${category === '' ? 'bg-primary/10 text-primary font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5'}`}
                >
                  All Categories
                </button>
                {categories.map(c => (
                  <button 
                    key={c}
                    onClick={() => {setCategory(c); setPage(1);}}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition capitalize ${category === c ? 'bg-primary/10 text-primary font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wider">Sort By</h3>
              <select 
                value={`${sortBy}-${order}`}
                onChange={(e) => {
                  const [s, o] = e.target.value.split('-');
                  setSortBy(s);
                  setOrder(o);
                  setPage(1);
                }}
                className="w-full p-2.5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              >
                <option value="created_at-desc" className="bg-card">Newest First</option>
                <option value="price-asc" className="bg-card">Price: Low to High</option>
                <option value="price-desc" className="bg-card">Price: High to Low</option>
                <option value="name-asc" className="bg-card">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-card p-4 rounded-2xl animate-pulse border border-black/5 dark:border-white/5">
                  <div className="bg-black/5 dark:bg-white/5 aspect-[4/3] rounded-xl mb-4"></div>
                  <div className="h-4 bg-black/5 dark:bg-white/5 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-black/5 dark:bg-white/5 rounded w-1/2 mb-4"></div>
                  <div className="h-10 bg-black/5 dark:bg-white/5 rounded-xl w-full mt-auto"></div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-12 space-x-2">
                  <button 
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    className="px-4 py-2 border border-black/10 dark:border-white/10 rounded-lg text-sm font-medium text-foreground hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium flex items-center justify-center transition ${page === i + 1 ? 'bg-primary text-white shadow-md' : 'border border-black/10 dark:border-white/10 text-foreground hover:bg-black/5 dark:hover:bg-white/5'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button 
                    disabled={page === totalPages}
                    onClick={() => setPage(p => p - 1)}
                    className="px-4 py-2 border border-black/10 dark:border-white/10 rounded-lg text-sm font-medium text-foreground hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="bg-card rounded-2xl p-12 text-center border border-black/5 dark:border-white/10 flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">No products found</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">We couldn't find any products matching your current filters. Try adjusting your search or clearing filters.</p>
              <button 
                onClick={clearFilters}
                className="bg-primary text-white px-6 py-2.5 rounded-xl font-medium hover:bg-primary-dark transition"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Modal */}
      <AnimatePresence>
        {isMobileFiltersOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFiltersOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-4/5 max-w-sm bg-card z-50 p-6 overflow-y-auto md:hidden shadow-2xl border-l border-black/5 dark:border-white/10"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-foreground">Filters</h2>
                <button onClick={() => setIsMobileFiltersOpen(false)} className="p-2 bg-black/5 dark:bg-white/5 rounded-full text-gray-500">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-8">
                <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">Categories</h3>
                <div className="space-y-2">
                  <button 
                    onClick={() => {setCategory(''); setPage(1); setIsMobileFiltersOpen(false);}}
                    className={`block w-full text-left px-4 py-3 rounded-xl text-base transition ${category === '' ? 'bg-primary/10 text-primary font-bold border border-primary/20' : 'text-gray-600 dark:text-gray-400 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-transparent'}`}
                  >
                    All Categories
                  </button>
                  {categories.map(c => (
                    <button 
                      key={c}
                      onClick={() => {setCategory(c); setPage(1); setIsMobileFiltersOpen(false);}}
                      className={`block w-full text-left px-4 py-3 rounded-xl text-base transition capitalize ${category === c ? 'bg-primary/10 text-primary font-bold border border-primary/20' : 'text-gray-600 dark:text-gray-400 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-transparent'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">Sort By</h3>
                <select 
                  value={`${sortBy}-${order}`}
                  onChange={(e) => {
                    const [s, o] = e.target.value.split('-');
                    setSortBy(s);
                    setOrder(o);
                    setPage(1);
                    setIsMobileFiltersOpen(false);
                  }}
                  className="w-full p-3.5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                >
                  <option value="created_at-desc" className="bg-card">Newest First</option>
                  <option value="price-asc" className="bg-card">Price: Low to High</option>
                  <option value="price-desc" className="bg-card">Price: High to Low</option>
                  <option value="name-asc" className="bg-card">Name: A to Z</option>
                </select>
              </div>

              {(category || search) && (
                <button 
                  onClick={() => {clearFilters(); setIsMobileFiltersOpen(false);}} 
                  className="w-full py-3.5 border-2 border-red-100 text-red-600 rounded-xl font-semibold hover:bg-red-50 transition"
                >
                  Clear all filters
                </button>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div></div>}>
      <ProductsContent />
    </Suspense>
  );
}
