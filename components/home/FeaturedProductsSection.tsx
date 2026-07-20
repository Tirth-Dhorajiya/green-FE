import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProductCardV2 from '../ProductCardV2';
import { ProductGridSkeleton } from '../Skeletons';

export type FeaturedProduct = {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  image_url: string;
  stock: number;
};

export default function FeaturedProductsSection({ products, loading }: { products: FeaturedProduct[]; loading: boolean }) {
  return (
    <section className="py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4 sm:mb-12 md:mb-16">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-primary sm:text-sm sm:font-bold sm:tracking-widest">Curated Selection</span>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-foreground sm:mt-2 sm:text-4xl md:text-5xl">New Arrivals.</h2>
          </div>
          <Link href="/products" className="group inline-flex shrink-0 items-center rounded-full border border-primary/25 px-3 py-2 text-xs font-black text-primary transition-colors hover:bg-primary hover:text-white sm:border-0 sm:p-0 sm:text-lg sm:text-foreground sm:hover:bg-transparent sm:hover:text-primary">
            <span className="sm:hidden">View all</span><span className="hidden sm:inline">Explore All</span>
            <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1 sm:ml-2 sm:h-5 sm:w-5" />
          </Link>
        </div>

        {loading ? (
          <ProductGridSkeleton count={4} compactOnMobile />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4 lg:gap-10">
            {products.map((product) => <ProductCardV2 key={product.id} product={product} compactOnMobile />)}
          </div>
        )}
      </div>
    </section>
  );
}
