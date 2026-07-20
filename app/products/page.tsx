'use client';

import React, { Suspense, useCallback, useDeferredValue, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown, Search, SlidersHorizontal, X } from 'lucide-react';
import api from '../../services/api';
import { endpoints } from '../../services/apiConfig';
import ProductCardV2 from '../../components/ProductCardV2';
import { ProductGridSkeleton } from '../../components/Skeletons';

interface ShopProduct {
  id: string;
  name: string;
  description?: string;
  price: string;
  category: string;
  image_url?: string;
  thumbnail_url?: string;
  stock: number;
}

const categories = ['plants', 'seeds', 'tools', 'planters', 'other'];
const sortOptions = [
  { value: 'created_at', label: 'Latest arrivals' },
  { value: 'price_low', label: 'Price: low to high' },
  { value: 'price_high', label: 'Price: high to low' },
  { value: 'name', label: 'Name: A to Z' },
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const deferredSearch = useDeferredValue(search.trim());
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'created_at');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [stockStatus, setStockStatus] = useState(searchParams.get('stockStatus') || '');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [mobileSelectOpen, setMobileSelectOpen] = useState<'category' | 'sort' | null>(null);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [draftMinPrice, setDraftMinPrice] = useState(minPrice);
  const [draftMaxPrice, setDraftMaxPrice] = useState(maxPrice);
  const [draftStockStatus, setDraftStockStatus] = useState(stockStatus);

  const fetchProducts = useCallback(async (page = 1, append = false) => {
    try {
      if (append) setLoadingMore(true);
      else setLoading(true);
      const sortMap: Record<string, { sortBy: string; order: string }> = {
        created_at: { sortBy: 'created_at', order: 'desc' },
        price_low: { sortBy: 'price', order: 'asc' },
        price_high: { sortBy: 'price', order: 'desc' },
        name: { sortBy: 'name', order: 'asc' },
      };
      const selectedSort = sortMap[sortBy] || sortMap.created_at;
      const params = new URLSearchParams({ ...selectedSort, limit: '20', page: String(page) });
      if (category) params.append('category', category);
      if (deferredSearch) params.append('search', deferredSearch);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (stockStatus) params.append('stockStatus', stockStatus);
      const response = await api.get(`${endpoints.products.list}?${params.toString()}`);
      if (response.data.success) {
        const receivedProducts = response.data.products || [];
        setProducts((existing) => append ? [...existing, ...receivedProducts] : receivedProducts);
        setTotalCount(Number(response.data.totalCount ?? receivedProducts.length));
        setCurrentPage(page);
      }
    } catch {
      console.error('Failed to fetch products');
      if (!append) {
        setProducts([]);
        setTotalCount(0);
      }
    } finally {
      if (append) setLoadingMore(false);
      else setLoading(false);
    }
  }, [category, deferredSearch, maxPrice, minPrice, sortBy, stockStatus]);

  useEffect(() => {
    fetchProducts(1, false);
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (deferredSearch) params.set('search', deferredSearch);
    if (sortBy !== 'created_at') params.set('sortBy', sortBy);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (stockStatus) params.set('stockStatus', stockStatus);
    const query = params.toString();
    router.replace(query ? `/products?${query}` : '/products', { scroll: false });
  }, [category, deferredSearch, fetchProducts, maxPrice, minPrice, router, sortBy, stockStatus]);

  useEffect(() => {
    if (!isMobileFiltersOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMobileFiltersOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [isMobileFiltersOpen]);

  const selectedSortLabel = sortOptions.find((option) => option.value === sortBy)?.label || 'Latest arrivals';
  const activeFilterCount = [minPrice, maxPrice, stockStatus].filter(Boolean).length;
  const hasAnyFilter = Boolean(category || search || minPrice || maxPrice || stockStatus);

  const openMobileFilters = () => {
    setDraftMinPrice(minPrice);
    setDraftMaxPrice(maxPrice);
    setDraftStockStatus(stockStatus);
    setIsMobileFiltersOpen(true);
  };

  const applyMobileFilters = () => {
    setMinPrice(draftMinPrice);
    setMaxPrice(draftMaxPrice);
    setStockStatus(draftStockStatus);
    setIsMobileFiltersOpen(false);
  };

  const resetFilters = () => {
    setCategory('');
    setSearch('');
    setMinPrice('');
    setMaxPrice('');
    setStockStatus('');
    setDraftMinPrice('');
    setDraftMaxPrice('');
    setDraftStockStatus('');
  };

  return (
    <div className="min-h-screen bg-background selection:bg-primary selection:text-white">
      <header className="px-3 pt-3 sm:px-6 sm:pt-8 lg:px-12">
        <div className="mx-auto max-w-screen-2xl rounded-2xl border border-black/10 bg-card p-3 shadow-sm dark:border-white/10 sm:p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="min-w-0 px-1 sm:px-0">
              <p className="mb-1 text-[9px] font-black uppercase tracking-[0.2em] text-primary sm:text-[10px]">Shop Collection</p>
              <h1 className="text-xl font-black tracking-tight text-foreground sm:text-2xl">Find your next green companion</h1>
            </div>

            <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_210px] xl:max-w-3xl">
              <div className="relative rounded-xl border border-primary/30 bg-card transition focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10">
                <label htmlFor="product-search" className="sr-only">Search products</label>
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
                <input
                  id="product-search"
                  type="search"
                  enterKeyHint="search"
                  placeholder="Search plants, seeds, tools..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="h-12 w-full rounded-xl border-0 bg-transparent pl-10 pr-10 text-sm font-bold text-foreground outline-none placeholder:font-medium sm:h-14 sm:pl-12 sm:text-base"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    aria-label="Clear search"
                    className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-gray-400 hover:bg-primary/10 hover:text-primary"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="relative hidden md:block">
                <button
                  type="button"
                  onClick={() => setIsSortOpen((open) => !open)}
                  className="flex h-14 w-full items-center justify-between gap-3 rounded-xl border border-black/10 bg-card px-4 text-sm font-black text-foreground transition hover:border-primary/40 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 dark:border-white/10"
                  aria-haspopup="listbox"
                  aria-expanded={isSortOpen}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <SlidersHorizontal className="h-4 w-4 shrink-0 text-primary" />
                    <span className="truncate">{selectedSortLabel}</span>
                  </span>
                  <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
                </button>

                {isSortOpen && (
                  <div role="listbox" className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-full overflow-hidden rounded-xl border border-primary/20 bg-card shadow-premium">
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
                        className={`w-full px-4 py-3 text-left text-sm font-bold transition ${sortBy === option.value ? 'bg-primary text-white' : 'text-foreground hover:bg-primary/10 hover:text-primary'}`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="-mx-1 mt-5 hidden gap-2 overflow-x-auto px-1 pb-1 md:flex [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {[{ value: '', label: 'All' }, ...categories.map((item) => ({ value: item, label: item }))].map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => setCategory(item.value)}
                className={`shrink-0 rounded-full border px-3.5 py-2 text-[10px] font-black uppercase tracking-[0.12em] transition sm:rounded-lg sm:px-4 sm:text-xs ${category === item.value ? 'border-primary bg-primary text-white shadow-sm shadow-primary/20' : 'border-black/10 bg-card text-foreground hover:border-primary/40 hover:bg-primary/10 hover:text-primary dark:border-white/10'}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="mt-3 space-y-2 md:hidden">
            <MobileSelect
              id="mobile-category-select"
              label="Category"
              value={category}
              options={[{ value: '', label: 'All products' }, ...categories.map((item) => ({ value: item, label: item }))]}
              isOpen={mobileSelectOpen === 'category'}
              onToggle={() => setMobileSelectOpen((open) => open === 'category' ? null : 'category')}
              onChange={(value) => {
                setCategory(value);
                setMobileSelectOpen(null);
              }}
            />

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={openMobileFilters}
                className="relative flex h-11 items-center justify-center gap-2 rounded-xl border border-black/10 bg-background text-xs font-black text-foreground dark:border-white/10"
              >
                <SlidersHorizontal className="h-4 w-4 text-primary" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] text-white">{activeFilterCount}</span>
                )}
              </button>
              <MobileSelect
                id="mobile-sort-select"
                value={sortBy}
                options={sortOptions}
                isOpen={mobileSelectOpen === 'sort'}
                onToggle={() => setMobileSelectOpen((open) => open === 'sort' ? null : 'sort')}
                onChange={(value) => {
                  setSortBy(value);
                  setMobileSelectOpen(null);
                }}
              />
            </div>
          </div>

          <div className="mt-5 hidden grid-cols-1 gap-3 md:grid md:grid-cols-2 lg:grid-cols-[1fr_1fr_220px_auto]">
            <PriceInput label="Min price" value={minPrice} placeholder="0" onChange={setMinPrice} />
            <PriceInput label="Max price" value={maxPrice} placeholder="Any" onChange={setMaxPrice} />
            <StockSelect value={stockStatus} onChange={setStockStatus} />
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex h-12 self-end items-center justify-center gap-2 rounded-xl border border-black/10 bg-card px-4 text-sm font-black text-foreground transition hover:border-primary/40 hover:bg-primary/10 hover:text-primary dark:border-white/10"
            >
              <X className="h-4 w-4" /> Reset
            </button>
          </div>
        </div>
      </header>

      <main className="min-h-[60vh] px-3 pb-10 pt-5 sm:px-6 sm:py-12 lg:px-12 lg:py-16">
        <div className="mx-auto max-w-screen-2xl">
          <div className="mb-4 flex items-center justify-between sm:mb-6">
            <p aria-live="polite" className="text-xs font-bold text-gray-500 dark:text-gray-400">
              {loading
                ? 'Loading collection…'
                : totalCount === products.length
                  ? `${totalCount} ${totalCount === 1 ? 'product' : 'products'}`
                  : `Showing ${products.length} of ${totalCount} products`}
            </p>
            {hasAnyFilter && (
              <button type="button" onClick={resetFilters} className="text-xs font-black text-primary hover:underline md:hidden">Clear all</button>
            )}
          </div>

          {loading ? (
            <ProductGridSkeleton count={8} compactOnMobile />
          ) : products.length > 0 ? (
            <>
              <section aria-label="Shop products" className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 lg:gap-8 xl:grid-cols-4 xl:gap-12">
                {products.map((product) => <ProductCardV2 key={product.id} product={product} compactOnMobile />)}
              </section>
              {products.length < totalCount && (
                <div className="mt-8 flex flex-col items-center gap-3 sm:mt-12">
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400">Showing {products.length} of {totalCount} products</p>
                  <button
                    type="button"
                    disabled={loadingMore}
                    onClick={() => fetchProducts(currentPage + 1, true)}
                    className="h-12 min-w-44 rounded-xl border border-primary/40 bg-card px-6 text-sm font-black text-primary transition hover:bg-primary hover:text-white disabled:cursor-wait disabled:opacity-60"
                  >
                    {loadingMore ? 'Loading…' : 'Load more products'}
                  </button>
                </div>
              )}
            </>
          ) : (
            <section className="rounded-2xl border border-black/10 bg-card px-5 py-16 text-center dark:border-white/10 sm:py-24">
              <Search className="mx-auto mb-4 h-10 w-10 text-primary/60" />
              <h2 className="mb-3 text-xl font-black text-foreground sm:text-3xl">No products found</h2>
              <p className="mx-auto mb-6 max-w-md text-sm text-gray-500 dark:text-gray-400">Try another search or remove some filters to see more of the collection.</p>
              <button onClick={resetFilters} className="rounded-xl bg-primary px-5 py-3 text-sm font-black text-white transition hover:bg-primary-dark">Reset all filters</button>
            </section>
          )}
        </div>
      </main>

      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-[80] md:hidden" role="presentation">
          <button type="button" aria-label="Close filters" onClick={() => setIsMobileFiltersOpen(false)} className="absolute inset-0 bg-black/65 backdrop-blur-sm" />
          <section role="dialog" aria-modal="true" aria-labelledby="mobile-filter-title" className="menu-enter absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto rounded-t-3xl border-t border-white/10 bg-card p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-[0_-24px_70px_rgba(0,0,0,0.45)]">
            <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-gray-500/40" />
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-primary">Refine collection</p>
                <h2 id="mobile-filter-title" className="text-xl font-black text-foreground">Filters</h2>
              </div>
              <button type="button" onClick={() => setIsMobileFiltersOpen(false)} aria-label="Close filters" className="flex h-10 w-10 items-center justify-center rounded-full bg-background text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <PriceInput label="Min price" value={draftMinPrice} placeholder="₹0" onChange={setDraftMinPrice} />
              <PriceInput label="Max price" value={draftMaxPrice} placeholder="Any" onChange={setDraftMaxPrice} />
            </div>
            <div className="mt-4">
              <StockSelect value={draftStockStatus} onChange={setDraftStockStatus} />
            </div>

            <div className="mt-7 grid grid-cols-[1fr_2fr] gap-3">
              <button
                type="button"
                onClick={() => {
                  setDraftMinPrice('');
                  setDraftMaxPrice('');
                  setDraftStockStatus('');
                }}
                className="h-12 rounded-xl border border-black/10 font-black text-foreground dark:border-white/10"
              >
                Reset
              </button>
              <button type="button" onClick={applyMobileFilters} className="h-12 rounded-xl bg-primary font-black text-white shadow-lg shadow-primary/20">
                Apply filters
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function PriceInput({ label, value, placeholder, onChange }: { label: string; value: string; placeholder: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">{label}</span>
      <input
        type="number"
        min="0"
        inputMode="decimal"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-xl border border-black/10 bg-background px-4 text-sm font-black text-foreground outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 dark:border-white/10"
      />
    </label>
  );
}

function StockSelect({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">Availability</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="h-12 w-full rounded-xl border border-black/10 bg-background px-4 text-sm font-black text-foreground outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 dark:border-white/10">
        <option value="">All products</option>
        <option value="in_stock">In stock</option>
        <option value="out_of_stock">Out of stock</option>
      </select>
    </label>
  );
}

function MobileSelect({
  id,
  label,
  value,
  options,
  isOpen,
  onToggle,
  onChange,
}: {
  id: string;
  label?: string;
  value: string;
  options: { value: string; label: string }[];
  isOpen: boolean;
  onToggle: () => void;
  onChange: (value: string) => void;
}) {
  const selectedLabel = options.find((option) => option.value === value)?.label || options[0]?.label;

  return (
    <div className="relative">
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={onToggle}
        className={`flex h-11 w-full items-center rounded-xl border bg-background pl-3 pr-10 text-xs font-black text-foreground opacity-100 outline-none transition ${isOpen ? 'border-primary ring-2 ring-primary/10' : 'border-black/10 dark:border-white/10'} ${label ? 'justify-between' : 'justify-center'}`}
      >
        {label && <span className="shrink-0 text-[10px] uppercase tracking-[0.12em] text-primary">{label}</span>}
        <span className={`min-w-0 truncate capitalize ${label ? 'ml-4 text-right' : ''}`}>{selectedLabel}</span>
        <ChevronDown className={`pointer-events-none absolute right-3 h-4 w-4 shrink-0 text-primary transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <button type="button" aria-label="Close dropdown" onClick={onToggle} className="fixed inset-0 z-[55] cursor-default" />
          <div role="listbox" aria-labelledby={id} className="mobile-menu-solid menu-enter absolute left-0 right-0 top-[calc(100%+0.4rem)] z-[60] max-h-64 overflow-y-auto rounded-xl border border-primary/30 p-1.5 shadow-[0_20px_55px_rgba(0,0,0,0.55)]">
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value || 'all'}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => onChange(option.value)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-bold capitalize transition ${isSelected ? 'bg-primary text-white' : 'text-foreground hover:bg-primary/10 hover:text-primary'}`}
                >
                  {option.label}
                  {isSelected && <span aria-hidden="true" className="h-2 w-2 rounded-full bg-white" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-background px-3 py-5 sm:px-6 lg:px-12"><ProductGridSkeleton count={8} compactOnMobile /></main>}>
      <ProductsContent />
    </Suspense>
  );
}
