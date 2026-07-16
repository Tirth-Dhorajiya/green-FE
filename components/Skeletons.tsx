'use client';

export function SkeletonBlock({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-black/5 dark:bg-white/5 ${className}`} />;
}

export function ProductCardSkeleton() {
  return (
    <article className="rounded-xl border border-black/5 bg-card p-4 shadow-sm dark:border-white/10">
      <SkeletonBlock className="aspect-[4/5] w-full" />
      <div className="mt-5 space-y-3">
        <SkeletonBlock className="h-3 w-20" />
        <SkeletonBlock className="h-5 w-4/5" />
        <SkeletonBlock className="h-4 w-1/2" />
        <SkeletonBlock className="h-11 w-full" />
      </div>
    </article>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => <ProductCardSkeleton key={index} />)}
    </div>
  );
}

export function CartSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <SkeletonBlock className="mb-8 h-10 w-56" />
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
        <div className="flex-1 space-y-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex flex-col gap-6 rounded-lg border border-black/5 bg-card p-4 shadow-sm dark:border-white/10 sm:flex-row sm:p-6">
              <SkeletonBlock className="h-32 w-full sm:w-32" />
              <div className="flex-1 space-y-4">
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
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8 md:flex-row">
        <SkeletonBlock className="h-80 w-full md:w-80" />
        <div className="flex-1 space-y-8">
          <SkeletonBlock className="h-72 w-full" />
          <SkeletonBlock className="h-96 w-full" />
        </div>
      </div>
    </div>
  );
}
