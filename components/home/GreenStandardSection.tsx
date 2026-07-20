'use client';

import { Droplets, Leaf, Sprout } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  { icon: Leaf, title: 'Premium Plants', desc: 'Sourced from the finest growers globally.', color: 'bg-green-500/10 text-green-400' },
  { icon: Sprout, title: 'Rare Seeds', desc: '98% germination rate guaranteed.', color: 'bg-emerald-500/10 text-emerald-400' },
  { icon: Droplets, title: 'Smart Care', desc: 'Free care guides with every purchase.', color: 'bg-blue-500/10 text-blue-400' },
];

export default function GreenStandardSection() {
  return (
    <section className="relative overflow-hidden py-8 sm:py-14">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="mb-7 text-center sm:mb-16">
          <h2 className="living-section-title mb-3 text-2xl font-black tracking-tight text-foreground sm:mb-4 sm:text-3xl md:text-5xl">The Green Standard.</h2>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-gray-500 dark:text-gray-400 sm:text-base">We don&apos;t just sell plants; we provide a complete botanical experience designed for modern living.</p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:gap-6 md:grid-cols-3 lg:gap-10">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`living-feature-card living-feature-card-${index + 1} group grid grid-cols-[auto_1fr] items-center gap-x-4 rounded-xl border border-black/5 bg-card p-4 shadow-sm transition-all duration-500 hover:bg-black/5 hover:shadow-premium dark:border-white/5 dark:hover:bg-white/5 sm:block sm:p-8 lg:p-10`}
            >
              <div className={`living-feature-icon row-span-2 flex h-12 w-12 items-center justify-center rounded-lg sm:mb-8 sm:h-16 sm:w-16 ${feature.color} transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110`}>
                <feature.icon className="living-icon h-6 w-6 sm:h-8 sm:w-8" />
              </div>
              <h3 className="mb-1 text-base font-black text-foreground sm:mb-4 sm:text-2xl">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400 sm:text-base">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
