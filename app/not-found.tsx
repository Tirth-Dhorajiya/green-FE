import Link from 'next/link';
import { ArrowLeft, Leaf, Search, Sprout } from 'lucide-react';

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[calc(100svh-12rem)] items-center overflow-hidden px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.14),transparent_38rem)]" />
      <div className="pointer-events-none absolute left-[8%] top-[18%] -z-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[12%] right-[8%] -z-10 h-52 w-52 rounded-full bg-emerald-400/10 blur-3xl" />

      <div className="mx-auto grid w-full max-w-5xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="relative mx-auto flex aspect-square w-full max-w-80 items-center justify-center sm:max-w-96">
          <div className="absolute inset-0 rounded-full border border-primary/15 bg-primary/5" />
          <div className="absolute inset-[12%] rounded-full border border-primary/20 bg-card/70 shadow-2xl shadow-primary/10 backdrop-blur-xl" />
          <Leaf className="absolute left-[12%] top-[24%] h-9 w-9 -rotate-12 text-primary/45" aria-hidden="true" />
          <Sprout className="absolute bottom-[20%] right-[10%] h-11 w-11 rotate-12 text-primary/40" aria-hidden="true" />
          <div className="relative text-center">
            <p className="bg-gradient-to-br from-primary via-emerald-300 to-primary bg-clip-text text-[6.5rem] font-black leading-none tracking-tighter text-transparent sm:text-[8rem]">
              404
            </p>
            <p className="mt-2 text-xs font-black uppercase tracking-[0.25em] text-gray-500 dark:text-gray-400">
              Lost in the garden
            </p>
          </div>
        </div>

        <div className="text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-primary">
            <Search className="h-4 w-4" aria-hidden="true" />
            Page not found
          </span>
          <h1 className="mt-6 text-3xl font-black tracking-tight text-foreground sm:text-5xl">
            This path hasn&apos;t grown yet.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-gray-600 dark:text-gray-400 sm:text-base lg:mx-0">
            The page may have moved, the address may be incorrect, or the product is no longer available. You can return home or continue exploring our collection.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <Link
              href="/"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-black text-white shadow-lg shadow-primary/20 transition hover:bg-primary-dark"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Return Home
            </Link>
            <Link
              href="/products"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-primary/25 bg-card px-6 py-3 text-sm font-black text-foreground transition hover:border-primary hover:text-primary"
            >
              Browse Products
            </Link>
          </div>

          <p className="mt-6 text-xs font-bold text-gray-500 dark:text-gray-500">
            Looking for seasonal guidance?{' '}
            <Link href="/what-to-grow-now" className="text-primary underline-offset-4 hover:underline">
              See what to grow now
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
