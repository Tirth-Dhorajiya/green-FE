'use client';

import { useEffect, useRef, useState } from 'react';
import { getImageProps } from 'next/image';
import Link from 'next/link';
import { ArrowRight, Leaf, Sprout } from 'lucide-react';
import { animate, motion, useInView, useReducedMotion, type Variants } from 'framer-motion';

const heroItem: Variants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  },
};

const heroContainer: Variants = {
  hidden: {},
  visible: { transition: { delayChildren: 0.12, staggerChildren: 0.13 } },
};

function ResponsiveHeroBackground() {
  const { props: mobileImage } = getImageProps({
    src: '/hero-mobile.webp',
    alt: '',
    width: 941,
    height: 1672,
    quality: 84,
    sizes: '100vw',
  });
  const { props: desktopImage } = getImageProps({
    src: '/hero.webp',
    alt: 'Indoor botanical collection in a modern greenhouse',
    fill: true,
    priority: true,
    quality: 75,
    sizes: '100vw',
  });

  return (
    <picture className="absolute inset-0 block h-full w-full">
      <source media="(max-width: 639px)" srcSet={mobileImage.srcSet} sizes={mobileImage.sizes} />
      {/* A picture element ensures the browser downloads only the matching hero asset. */}
      <img {...desktopImage} alt="Indoor botanical collection in a modern greenhouse" className="absolute inset-0 h-full w-full object-cover object-center opacity-55 dark:opacity-45 sm:opacity-75 sm:dark:opacity-75 lg:opacity-100 lg:dark:opacity-100" />
    </picture>
  );
}

const headlineContainer: Variants = {
  hidden: {},
  visible: { transition: { delayChildren: 0.1, staggerChildren: 0.16 } },
};

const headlineLine: Variants = {
  hidden: { opacity: 0, y: 80, rotateX: -18, filter: 'blur(12px)' },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
};

function AnimatedStat({
  label,
  value,
  suffix = '',
  decimals = 0,
  delay,
}: {
  label: string;
  value: number;
  suffix?: string;
  decimals?: number;
  delay: number;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { once: true, margin: '-40px' });
  const reduceMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduceMotion) {
      setDisplayValue(value);
      return;
    }

    const controls = animate(0, value, {
      duration: 1.35,
      delay,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: setDisplayValue,
    });
    return () => controls.stop();
  }, [delay, inView, reduceMotion, value]);

  return (
    <motion.div
      ref={rootRef}
      variants={heroItem}
      whileHover={reduceMotion ? undefined : { y: -5, scale: 1.04 }}
        className="h-full rounded-lg sm:rounded-xl"
    >
      <div
        className="hero-stat flex h-full min-h-20 flex-col items-center justify-center overflow-hidden rounded-lg border border-black/5 bg-card px-2 py-3 text-center shadow-lg shadow-primary/5 dark:border-white/10 sm:min-h-24 sm:rounded-xl sm:bg-white/35 sm:px-3 sm:py-3 sm:backdrop-blur-md sm:dark:bg-white/[0.035] lg:min-h-20 lg:border-white/10 lg:bg-black/20 lg:py-2 lg:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] lg:backdrop-blur-md lg:dark:bg-black/20"
        style={{ animationDelay: `${delay}s` }}
      >
        <p className="hero-stat-value text-xl font-black tabular-nums text-foreground sm:text-2xl lg:text-3xl">
          {decimals ? displayValue.toFixed(decimals) : Math.round(displayValue)}{suffix}
        </p>
        <p className="relative z-10 mt-1.5 text-[8px] font-bold uppercase tracking-[0.11em] text-gray-500 dark:text-gray-400 sm:mt-2 sm:text-[10px] sm:tracking-[0.16em]">{label}</p>
      </div>
    </motion.div>
  );
}

export default function HomeHero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative flex min-h-[calc(100svh-5rem)] items-center justify-center overflow-hidden py-7 sm:min-h-[calc(100svh-6rem)] sm:py-8 lg:h-[calc(100svh-6rem)] lg:min-h-0 lg:py-4">
      <div className="absolute inset-0 z-0">
        <motion.div
          className="absolute inset-[-4%]"
          animate={reduceMotion ? undefined : { scale: [1.03, 1.09, 1.03], x: ['0%', '-1.2%', '0%'], y: ['0%', '1%', '0%'] }}
          transition={{ duration: 18, ease: 'easeInOut', repeat: Infinity }}
        >
          <ResponsiveHeroBackground />
        </motion.div>
        <div className="hero-aurora absolute inset-0 opacity-40 lg:opacity-20" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,22,15,0.70)_0%,rgba(5,22,15,0.38)_46%,rgba(5,22,15,0.76)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_18%,rgba(3,18,12,0.24)_72%,rgba(3,18,12,0.52)_100%)]" />
        <div className="hero-corner-vignette pointer-events-none absolute inset-0 hidden lg:block" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
        <motion.div
          className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] rounded-full border border-primary/10"
          style={{ x: '-50%', y: '-50%' }}
          animate={reduceMotion ? undefined : { rotate: 360, scale: [0.92, 1.05, 0.92], opacity: [0.25, 0.55, 0.25] }}
          transition={{ rotate: { duration: 32, ease: 'linear', repeat: Infinity }, scale: { duration: 8, ease: 'easeInOut', repeat: Infinity }, opacity: { duration: 8, ease: 'easeInOut', repeat: Infinity } }}
          aria-hidden="true"
        />
      </div>

      <div className="pointer-events-none absolute inset-0 z-[5] hidden sm:block" aria-hidden="true">
        <motion.div className="absolute left-[6%] top-[24%] text-primary/25" animate={reduceMotion ? undefined : { y: [0, -18, 0], rotate: [-12, 8, -12] }} transition={{ duration: 7, ease: 'easeInOut', repeat: Infinity }}><Leaf className="h-8 w-8" /></motion.div>
        <motion.div className="absolute right-[7%] top-[38%] text-primary/20" animate={reduceMotion ? undefined : { y: [0, 20, 0], rotate: [10, -10, 10] }} transition={{ duration: 8.5, delay: 0.7, ease: 'easeInOut', repeat: Infinity }}><Sprout className="h-9 w-9" /></motion.div>
        <motion.div className="absolute bottom-[14%] left-[9%] text-primary/20" animate={reduceMotion ? undefined : { x: [0, 16, 0], y: [0, -10, 0], rotate: [0, 14, 0] }} transition={{ duration: 9, delay: 1.2, ease: 'easeInOut', repeat: Infinity }}><Leaf className="h-7 w-7" /></motion.div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-3 text-center sm:px-6 lg:px-8">
        <motion.div variants={heroContainer} initial={reduceMotion ? false : 'hidden'} animate="visible" className="mx-auto max-w-5xl">
          <motion.div variants={heroItem} className="living-float mb-4 inline-flex max-w-full items-center justify-center space-x-2 rounded-full border border-primary/30 bg-card px-3 py-2 text-[10px] font-bold text-primary sm:mb-5 sm:bg-emerald-950/75 sm:px-5 sm:py-2 sm:text-xs sm:backdrop-blur-md lg:mb-4">
            <Leaf className="h-3.5 w-3.5 shrink-0 animate-bounce sm:h-4 sm:w-4" />
            <span className="leading-4 sm:leading-5">Experience The Botanical Revolution</span>
          </motion.div>

          <motion.h1 variants={headlineContainer} className="hero-headline relative mb-4 text-[clamp(2.35rem,12vw,3rem)] font-black uppercase leading-[0.9] tracking-tighter sm:mb-5 sm:text-6xl md:text-7xl lg:mb-3 lg:text-[clamp(4rem,6.2vw,6.5rem)]">
            <span className="block overflow-hidden pb-[0.08em] [perspective:800px]">
              <motion.span variants={headlineLine} className="hero-headline-nature block text-foreground">Nature&apos;s</motion.span>
            </span>
            <span className="relative block overflow-hidden pb-[0.1em] [perspective:800px]">
              <motion.span variants={headlineLine} className="hero-gradient-text hero-masterpiece block bg-gradient-to-r from-primary via-emerald-300 to-primary bg-clip-text text-transparent">
                Masterpiece
              </motion.span>
            </span>
            <motion.span
              aria-hidden="true"
              className="hero-title-accent mx-auto mt-2 block h-1 rounded-full bg-gradient-to-r from-transparent via-primary to-transparent sm:mt-3 lg:mt-2"
              initial={reduceMotion ? false : { opacity: 0, scaleX: 0 }}
              animate={{ opacity: 0.75, scaleX: 1 }}
              transition={{ delay: 1.25, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            />
          </motion.h1>

          <motion.p variants={heroItem} className="mx-auto mb-5 max-w-sm text-sm font-medium leading-relaxed text-gray-300 sm:mb-6 sm:max-w-2xl sm:text-lg md:text-xl lg:mb-5 lg:max-w-3xl lg:text-lg">
            Curate your personal sanctuary with rare, ethically sourced greenery that breathes life into your modern home.
          </motion.p>

          <motion.div variants={heroItem} className="grid grid-cols-2 items-center justify-center gap-2.5 sm:flex sm:gap-4 lg:gap-5">
            <Link href="/products" className="living-cta group flex min-h-12 items-center justify-center rounded-xl bg-primary px-3 py-3 text-xs font-black text-white shadow-2xl shadow-primary/30 transition-all duration-300 hover:scale-105 hover:bg-primary-dark sm:w-auto sm:px-9 sm:py-3.5 sm:text-base lg:min-w-56">
              Explore <span className="hidden min-[360px]:inline">&nbsp;Collection</span><ArrowRight className="ml-1.5 h-4 w-4 shrink-0 transition-transform group-hover:translate-x-2 sm:ml-3 sm:h-6 sm:w-6" />
            </Link>
            <Link href="/products?category=plants" className="hero-secondary-cta group flex min-h-12 items-center justify-center rounded-xl border border-white/10 bg-emerald-950/75 px-3 py-3 text-xs font-black text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/70 hover:bg-primary/25 hover:text-emerald-50 hover:shadow-[0_14px_35px_rgba(16,185,129,0.24)] active:translate-y-0 sm:w-auto sm:px-9 sm:py-3.5 sm:text-base lg:min-w-48">
              Shop Plants
              <ArrowRight className="ml-2 h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>

          <motion.div variants={heroItem} className="mx-auto mt-7 grid max-w-4xl auto-rows-fr grid-cols-2 items-stretch gap-2 border-t border-black/5 pt-4 dark:border-white/10 sm:mt-8 sm:gap-4 sm:pt-4 md:grid-cols-4 md:gap-5 lg:mt-5 lg:gap-2 lg:border-0 lg:p-0">
            {[
              { label: 'Active Buyers', value: 12, suffix: 'k+', decimals: 0 },
              { label: 'Plant Varieties', value: 450, suffix: '+', decimals: 0 },
              { label: 'Global Farms', value: 24, suffix: '', decimals: 0 },
              { label: 'Care Rating', value: 4.9, suffix: '/5', decimals: 1 },
            ].map((stat, index) => <AnimatedStat key={stat.label} {...stat} delay={0.45 + index * 0.12} />)}
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute right-10 top-20 h-32 w-32 animate-pulse rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-20 left-10 h-48 w-48 animate-pulse rounded-full bg-secondary/10 blur-3xl [animation-delay:1s]" />
    </section>
  );
}
