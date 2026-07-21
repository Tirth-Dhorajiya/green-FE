import Link from 'next/link';
import { ArrowRight, CalendarDays, MapPin, Sprout } from 'lucide-react';
import Reveal from '../Reveal';

export default function GrowNowCtaSection() {
  return (
    <section className="px-3 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Reveal className="relative mx-auto max-w-7xl overflow-hidden rounded-2xl border border-primary/20 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.22),transparent_24rem)] p-5 shadow-premium sm:p-8 lg:p-12">
        <div className="absolute -bottom-20 -right-16 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
        <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary sm:text-xs">Seasonal garden assistant</p>
            <h2 className="mt-2 max-w-3xl text-2xl font-black tracking-tight text-foreground sm:text-4xl">Not sure what to sow this month?</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">Choose your Indian city, available space and experience to get a practical shortlist with matching products currently in stock.</p>
            <div className="mt-5 flex flex-wrap gap-2 text-[11px] font-black text-gray-300">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-background px-3 py-2"><MapPin className="h-3.5 w-3.5 text-primary" /> Region-aware</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-background px-3 py-2"><CalendarDays className="h-3.5 w-3.5 text-primary" /> Month-specific</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-background px-3 py-2"><Sprout className="h-3.5 w-3.5 text-primary" /> Beginner-friendly</span>
            </div>
          </div>
          <Link href="/what-to-grow-now" className="inline-flex h-13 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-black text-white shadow-lg shadow-primary/25 transition hover:-translate-y-0.5 hover:bg-primary-dark">
            Find what to grow <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
