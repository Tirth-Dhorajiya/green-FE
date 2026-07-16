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
    <footer className="bg-card text-foreground dark:bg-slate-950 dark:text-white pt-24 pb-12 overflow-hidden relative border-t border-black/5 dark:border-white/5">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-black/10 to-transparent dark:via-white/10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-20">
          <div className="md:col-span-4">
            <Link href="/" className="mb-8 inline-flex items-center group" aria-label="Green Store home">
              <span className="bg-primary text-white p-3 rounded-lg group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-primary/20">
                <Leaf className="w-7 h-7" />
              </span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-10">
              Cultivating beautiful living spaces through premium botanical collections since 2024.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map(({ label, icon }) => (
                <a key={label} href="#" aria-label={label} className="w-12 h-12 bg-black/5 dark:bg-white/5 rounded-lg flex items-center justify-center hover:bg-primary hover:text-white transition-all border border-black/10 dark:border-white/10 hover:border-primary">
                  {icon}
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-foreground dark:text-white font-black uppercase tracking-widest text-xs mb-8">Shop</h4>
            <ul className="space-y-4">
              <li><Link href="/products?category=plants" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors font-medium">Plants</Link></li>
              <li><Link href="/products?category=seeds" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors font-medium">Seeds</Link></li>
              <li><Link href="/products?category=tools" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors font-medium">Tools</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-foreground dark:text-white font-black uppercase tracking-widest text-xs mb-8">Company</h4>
            <ul className="space-y-4">
              <li><Link href="/plant-care" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors font-medium">Plant Care</Link></li>
              <li><Link href="/faq" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors font-medium">FAQ</Link></li>
              <li><Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors font-medium">Contact</Link></li>
              <li><Link href="/privacy-policy" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors font-medium">Privacy</Link></li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <h4 className="text-foreground dark:text-white font-black uppercase tracking-widest text-xs mb-8">Newsletter</h4>
            <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">Join 10k+ plant lovers and get exclusive tips and deals.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="min-w-0 flex-1 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-foreground dark:text-white placeholder:text-gray-500 px-6 py-4 rounded-lg focus:outline-none focus:border-primary transition-all"
              />
              <button className="bg-primary hover:bg-primary-dark px-6 py-4 rounded-lg text-sm font-black transition-all shadow-lg hover:shadow-primary/30">
                JOIN
              </button>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-black/5 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-600 dark:text-gray-500 text-sm font-medium">&copy; {new Date().getFullYear()} Green Store. Crafted with passion.</p>
          <div className="flex space-x-8 text-gray-600 dark:text-gray-500 text-sm font-medium">
            <Link href="/terms-and-conditions" className="hover:text-primary dark:hover:text-white transition-colors">Terms</Link>
            <Link href="/privacy-policy" className="hover:text-primary dark:hover:text-white transition-colors">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
