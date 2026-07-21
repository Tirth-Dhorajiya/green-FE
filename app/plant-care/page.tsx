import Link from 'next/link';
import { Droplets, Leaf, Scissors, ShieldCheck, Sprout, Sun } from 'lucide-react';
import Reveal from '../../components/Reveal';

const careGuides = [
  {
    title: 'Water With Control',
    icon: Droplets,
    body: 'Check the top inch of soil before watering. Most indoor plants prefer deep watering followed by a short dry period.',
  },
  {
    title: 'Match Light Needs',
    icon: Sun,
    body: 'Bright indirect light works for many houseplants. Rotate pots weekly so each side grows evenly.',
  },
  {
    title: 'Refresh Soil',
    icon: Sprout,
    body: 'Use airy soil for tropical plants and faster-draining blends for succulents, herbs, and planters with limited drainage.',
  },
  {
    title: 'Prune Cleanly',
    icon: Scissors,
    body: 'Remove yellow leaves and weak stems with clean scissors to redirect energy into healthy new growth.',
  },
];

const quickChecks = [
  'Yellow leaves often mean overwatering or poor drainage.',
  'Brown tips usually point to dry air, inconsistent watering, or salt buildup.',
  'Slow growth can mean low light, compacted soil, or a plant resting in winter.',
  'Pests spread fast, so isolate new plants for a few days before placing them near others.',
];

export default function PlantCarePage() {
  return (
    <main className="bg-background">
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 items-center">
          <Reveal>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-primary mb-4">Plant Care Guide</p>
            <h1 className="mb-6 text-3xl font-black tracking-tight text-foreground sm:text-4xl md:text-6xl">
              Keep every plant looking store-fresh.
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-8 max-w-2xl">
              Simple care rules for watering, light, soil, pruning, and early problem spotting.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/what-to-grow-now" className="bg-primary text-white px-6 py-3 rounded-lg font-black hover:bg-primary-dark transition">
                Find What to Grow Now
              </Link>
              <Link href="/products" className="bg-primary text-white px-6 py-3 rounded-lg font-black hover:bg-primary-dark transition">
                Shop Easy-Care Plants
              </Link>
              <Link href="/contact" className="border border-primary/20 text-primary px-6 py-3 rounded-lg font-black hover:bg-primary/10 transition">
                Ask For Help
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="motion-surface bg-card border border-black/5 dark:border-white/10 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="motion-icon w-11 h-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Leaf className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-black text-foreground">Weekly Routine</h2>
                <p className="text-sm text-gray-500">10 minutes per shelf</p>
              </div>
            </div>
            <div className="space-y-4">
              {['Check soil moisture', 'Wipe dusty leaves', 'Rotate toward light', 'Inspect stems and undersides'].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-lg bg-black/5 dark:bg-white/5 px-4 py-3">
                  <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                  <span className="font-bold text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-black/5 dark:border-white/10 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {careGuides.map(({ title, icon: Icon, body }, index) => (
              <Reveal key={title} delay={index * 0.07} className="h-full">
                <article className="motion-surface h-full bg-card border border-black/5 dark:border-white/10 rounded-xl p-6 shadow-sm">
                <div className="motion-icon w-11 h-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-black text-foreground mb-3">{title}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-8">
          <Reveal>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-primary mb-3">Troubleshooting</p>
            <h2 className="text-3xl font-black text-foreground">Quick plant checks</h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-4">
            {quickChecks.map((check, index) => (
              <Reveal key={check} delay={index * 0.06} className="motion-surface rounded-lg border border-black/5 dark:border-white/10 bg-card p-5 text-gray-600 dark:text-gray-400 font-medium">
                {check}
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
