import HomeHero from '../components/home/HomeHero';
import GreenStandardSection from '../components/home/GreenStandardSection';
import FeaturedProductsSection from '../components/home/FeaturedProductsSection';
import GrowNowCtaSection from '../components/home/GrowNowCtaSection';
import { getFeaturedProducts } from '../utils/serverProducts';

export const revalidate = 300;

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <div className="flex min-h-screen flex-col bg-background transition-colors duration-300">
      <HomeHero />
      <GreenStandardSection />
      <GrowNowCtaSection />
      <FeaturedProductsSection products={featuredProducts} loading={false} />
    </div>
  );
}
