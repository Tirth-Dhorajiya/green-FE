'use client';

export function SkeletonBlock({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-black/5 dark:bg-white/5 ${className}`} />;
}

export function ProductCardSkeleton({ compactOnMobile = false }: { compactOnMobile?: boolean }) {
  return (
    <article className={`rounded-xl border border-black/5 bg-card shadow-sm dark:border-white/10 ${compactOnMobile ? 'p-2 sm:p-4' : 'p-4'}`}>
      <SkeletonBlock className={`w-full ${compactOnMobile ? 'aspect-square sm:aspect-[4/5]' : 'aspect-[4/5]'}`} />
      <div className={`${compactOnMobile ? 'mt-3 sm:mt-5' : 'mt-5'} space-y-3`}>
        <SkeletonBlock className="h-3 w-20" />
        <SkeletonBlock className="h-5 w-4/5" />
        <SkeletonBlock className={compactOnMobile ? 'hidden h-4 w-1/2 sm:block' : 'h-4 w-1/2'} />
        <SkeletonBlock className={compactOnMobile ? 'h-10 w-full sm:h-11' : 'h-11 w-full'} />
      </div>
    </article>
  );
}

export function ProductGridSkeleton({ count = 8, compactOnMobile = false }: { count?: number; compactOnMobile?: boolean }) {
  return (
    <div className={`grid sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 xl:grid-cols-4 ${compactOnMobile ? 'grid-cols-2 gap-3 sm:gap-6' : 'grid-cols-1 gap-6'}`}>
      {Array.from({ length: count }).map((_, index) => <ProductCardSkeleton key={index} compactOnMobile={compactOnMobile} />)}
    </div>
  );
}

export function CartSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-12 lg:px-8">
      <SkeletonBlock className="mb-6 h-8 w-44 sm:mb-8 sm:h-10 sm:w-56" />
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
        <div className="flex-1 space-y-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex gap-3 rounded-xl border border-black/5 bg-card p-3 shadow-sm dark:border-white/10 sm:gap-6 sm:p-6">
              <SkeletonBlock className="h-28 w-24 shrink-0 sm:h-32 sm:w-32" />
              <div className="min-w-0 flex-1 space-y-3 sm:space-y-4">
                <SkeletonBlock className="h-6 w-3/5" />
                <SkeletonBlock className="h-4 w-24" />
                <SkeletonBlock className="h-10 w-full sm:w-64" />
              </div>
            </div>
          ))}
        </div>
        <SkeletonBlock className="h-80 w-full lg:w-96" />
      </div>
    </div>
  );
}

export function ProductDetailsSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <SkeletonBlock className="mb-8 h-5 w-32" />
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="space-y-4">
          <SkeletonBlock className="aspect-square w-full" />
          <div className="flex gap-3">
            {[1, 2, 3, 4].map((item) => <SkeletonBlock key={item} className="h-20 w-20" />)}
          </div>
        </div>
        <div className="space-y-6">
          <SkeletonBlock className="h-4 w-24" />
          <SkeletonBlock className="h-14 w-4/5" />
          <SkeletonBlock className="h-9 w-32" />
          <SkeletonBlock className="h-24 w-full" />
          <div className="flex flex-col gap-4 sm:flex-row">
            <SkeletonBlock className="h-14 w-full sm:w-32" />
            <SkeletonBlock className="h-14 flex-1" />
            <SkeletonBlock className="h-14 w-full sm:w-14" />
          </div>
        </div>
      </div>
      <SkeletonBlock className="mt-16 h-72 w-full" />
    </div>
  );
}

export function FormPageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <SkeletonBlock className="mb-8 h-5 w-32" />
      <div className="flex flex-col gap-12 lg:flex-row">
        <div className="flex-1 space-y-6 rounded-lg border border-black/5 bg-card p-6 dark:border-white/10 md:p-8">
          <SkeletonBlock className="h-7 w-56" />
          <div className="grid gap-4 sm:grid-cols-2">
            {[1, 2, 3, 4].map((item) => <SkeletonBlock key={item} className="h-12 w-full" />)}
          </div>
          <SkeletonBlock className="h-24 w-full" />
        </div>
        <SkeletonBlock className="h-96 w-full lg:w-96" />
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-screen-2xl px-3 py-4 sm:px-6 sm:py-10 lg:px-10 xl:px-12">
      <SkeletonBlock className="mb-5 h-16 w-64 sm:mb-8 sm:h-20 sm:w-80" />
      <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8">
        <SkeletonBlock className="h-44 w-full lg:h-72" />
        <div className="min-w-0 space-y-4 sm:space-y-6">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
            {[1, 2, 3, 4].map((item) => <SkeletonBlock key={item} className="h-28 w-full" />)}
          </div>
          <div className="space-y-3 rounded-2xl border border-black/5 bg-card p-3 dark:border-white/10 sm:p-6">
            <SkeletonBlock className="h-10 w-48" />
            {[1, 2, 3].map((item) => <SkeletonBlock key={item} className="h-44 w-full" />)}
          </div>
        </div>
      </div>
    </div>
  );
}
