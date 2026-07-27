import React from 'react';
import Link from 'next/link';
import { Leaf } from 'lucide-react';

const socialLinks = [
  {
    label: 'Facebook',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
        <path d="M14 8h3V4h-3c-3.3 0-5 2-5 5v2H6v4h3v5h4v-5h3l1-4h-4V9c0-.7.3-1 1-1z" />
      </svg>
    ),
  },
  {
    label: 'Twitter',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
        <path d="M18.9 3h3.1l-6.8 7.8L23.2 21h-6.3l-4.9-6.3L6.4 21H3.3l7.3-8.4L2.9 3h6.5l4.4 5.7L18.9 3zm-1.1 16.2h1.7L8.5 4.7H6.7l11.1 14.5z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="4" y="4" width="16" height="16" rx="5" />
        <circle cx="12" cy="12" r="3.5" />
        <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
        <path d="M6.5 8.8H3.2V21h3.3V8.8zM4.9 3C3.8 3 3 3.8 3 4.8s.8 1.8 1.9 1.8 1.9-.8 1.9-1.8S6 3 4.9 3zM21 14.1c0-3.3-1.8-5.5-4.6-5.5-1.7 0-2.8.9-3.3 1.8V8.8H9.9V21h3.3v-6.3c0-1.7.8-2.8 2.2-2.8 1.3 0 2.1.9 2.1 2.8V21H21v-6.9z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-black/5 bg-card pb-6 pt-10 text-foreground dark:border-white/5 dark:bg-slate-950 dark:text-white sm:pb-10 sm:pt-20 lg:pt-24">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-black/10 to-transparent dark:via-white/10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-10 grid grid-cols-2 gap-x-6 gap-y-8 sm:mb-14 sm:grid-cols-2 sm:gap-10 md:mb-20 md:grid-cols-12 md:gap-8 lg:gap-16">
          <div className="col-span-2 md:col-span-4">
            <Link href="/" className="group mb-4 inline-flex items-center sm:mb-8" aria-label="Green Store home">
              <span className="rounded-lg bg-primary p-2.5 text-white shadow-lg shadow-primary/20 transition-transform duration-300 group-hover:rotate-12 sm:p-3">
                <Leaf className="h-6 w-6 sm:h-7 sm:w-7" />
              </span>
            </Link>
            <p className="mb-6 max-w-md text-sm leading-relaxed text-gray-600 dark:text-gray-400 sm:mb-10 sm:text-lg">
              Cultivating beautiful living spaces through premium botanical collections since 2024.
            </p>
            <div className="flex gap-2.5 sm:gap-4">
              {socialLinks.map(({ label, icon }) => (
                <a key={label} href="#" aria-label={label} className="flex h-10 w-10 items-center justify-center rounded-lg border border-black/10 bg-black/5 transition-all hover:-translate-y-1 hover:border-primary hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary/20 dark:border-white/10 dark:bg-white/5 sm:h-12 sm:w-12">
                  {icon}
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <h4 className="mb-4 text-xs font-black uppercase tracking-widest text-foreground dark:text-white sm:mb-8">Shop</h4>
            <ul className="space-y-3 sm:space-y-4">
              <li><Link href="/products?category=plants" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors font-medium">Plants</Link></li>
              <li><Link href="/products?category=seeds" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors font-medium">Seeds</Link></li>
              <li><Link href="/products?category=tools" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors font-medium">Tools</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="mb-4 text-xs font-black uppercase tracking-widest text-foreground dark:text-white sm:mb-8">Company</h4>
            <ul className="space-y-3 sm:space-y-4">
              <li><Link href="/plant-care" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors font-medium">Plant Care</Link></li>
              <li><Link href="/what-to-grow-now" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors font-medium">What to Grow Now</Link></li>
              <li><Link href="/faq" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors font-medium">FAQ</Link></li>
              <li><Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors font-medium">Contact</Link></li>
              <li><Link href="/privacy-policy" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors font-medium">Privacy</Link></li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-4">
            <h4 className="mb-4 text-xs font-black uppercase tracking-widest text-foreground dark:text-white sm:mb-8">Newsletter</h4>
            <p className="mb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400 sm:mb-8 sm:text-base">Join 10k+ plant lovers and get exclusive tips and deals.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="min-w-0 flex-1 rounded-lg border border-black/10 bg-black/5 px-4 py-3.5 text-sm text-foreground placeholder:text-gray-500 transition-all focus:border-primary focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white sm:px-6 sm:py-4 sm:text-base"
              />
              <button className="rounded-lg bg-primary px-6 py-3.5 text-sm font-black shadow-lg transition-all hover:bg-primary-dark hover:shadow-primary/30 sm:py-4">
                JOIN
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-black/5 pt-6 text-center dark:border-white/5 sm:pt-10 md:flex-row md:text-left">
          <p className="text-gray-600 dark:text-gray-500 text-sm font-medium">&copy; {new Date().getFullYear()} Green Store. Crafted with passion.</p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm font-medium text-gray-600 dark:text-gray-500">
            <Link href="/terms-and-conditions" className="hover:text-primary dark:hover:text-white transition-colors">Terms</Link>
            <Link href="/privacy-policy" className="hover:text-primary dark:hover:text-white transition-colors">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
