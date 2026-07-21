import { Suspense } from 'react';
import { CalendarDays, MapPin, ShoppingBag, Sprout } from 'lucide-react';
import GrowingPlanner from '../../components/growing/GrowingPlanner';
import { createPageMetadata } from '../../utils/metadata';

export const metadata = createPageMetadata({
  title: 'What to Grow Now in India',
  description: 'Choose your Indian city, month and growing space to discover suitable vegetables, herbs, flowers, seeds and garden tools.',
  path: '/what-to-grow-now',
});

const faqs = [
  { question: 'Are the recommendations live weather forecasts?', answer: 'No. They are seasonal home-gardening guidance. Unusual heat, rainfall, elevation and local conditions can shift the best sowing window.' },
  { question: 'Do I need an account?', answer: 'No account is needed to use or share the planner. Sign in only if you want to save a growing plan.' },
  { question: 'Why is my city not listed?', answer: 'The planner includes a curated list of major Indian cities. If yours is unavailable, choose the closest matching climate region manually.' },
];

export default function WhatToGrowNowPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: '/' },
      { '@type': 'ListItem', position: 2, name: 'What to Grow Now', item: '/what-to-grow-now' },
    ],
  };

  return <main className="min-h-screen bg-background">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />
    <section className="relative overflow-hidden px-4 pb-10 pt-12 text-center sm:pb-14 sm:pt-18">
      <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
      <div className="relative mx-auto max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary sm:text-xs">India-aware seasonal guide</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-foreground sm:text-5xl lg:text-6xl">What should you grow now?</h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-400 sm:text-lg">Turn your city, space and available month into a practical shortlist—then shop matching seeds, plants, planters and tools already available in Green Store.</p>
      </div>
    </section>

    <Suspense fallback={<div className="mx-auto min-h-[520px] max-w-7xl animate-pulse px-4"><div className="h-96 rounded-2xl bg-white/5" /></div>}><GrowingPlanner /></Suspense>

    <section className="border-y border-white/10 bg-card/40 py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="mb-8 text-center"><p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">How it works</p><h2 className="mt-2 text-2xl font-black text-foreground sm:text-4xl">From location to a useful shortlist</h2></div><div className="grid gap-4 md:grid-cols-3">{[[MapPin, 'Choose your conditions', 'Select a supported city or region, month and growing space.'], [CalendarDays, 'Check the seasonal guide', 'We compare your choices with reviewed, versioned home-gardening data.'], [ShoppingBag, 'Find live products', 'Matching seeds, plants and useful tools use current catalog prices and stock.']].map(([Icon, title, body]) => { const ItemIcon = Icon as typeof Sprout; return <article key={String(title)} className="rounded-2xl border border-white/10 bg-card p-6"><ItemIcon className="h-7 w-7 text-primary" /><h3 className="mt-4 text-lg font-black text-foreground">{String(title)}</h3><p className="mt-2 text-sm leading-6 text-gray-400">{String(body)}</p></article>; })}</div></div>
    </section>

    <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20"><div className="text-center"><p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Good to know</p><h2 className="mt-2 text-2xl font-black text-foreground sm:text-4xl">Growing guide questions</h2></div><div className="mt-8 space-y-3">{faqs.map((faq) => <details key={faq.question} className="group rounded-xl border border-white/10 bg-card"><summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 font-black text-foreground">{faq.question}<span className="text-primary transition group-open:rotate-45">+</span></summary><p className="border-t border-white/10 px-5 py-4 text-sm leading-7 text-gray-400">{faq.answer}</p></details>)}</div><p className="mt-8 rounded-xl border border-amber-400/20 bg-amber-400/10 p-4 text-xs leading-6 text-amber-100">This planner offers general Indian home-gardening guidance, not a live agricultural forecast. Local elevation, microclimate, unusual rain and heat can change actual sowing performance.</p></section>
  </main>;
}
