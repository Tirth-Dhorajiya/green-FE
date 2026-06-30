import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white pt-24 pb-12 overflow-hidden relative border-t border-white/5">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-20">
          <div className="md:col-span-4">
            <Link href="/" className="text-3xl font-black text-white tracking-tighter mb-8 block group">
              GREEN<span className="text-primary group-hover:text-primary-light transition-colors">STORE</span>.
            </Link>
            <p className="text-gray-400 text-lg leading-relaxed mb-10">
              Cultivating beautiful living spaces through premium botanical collections since 2024.
            </p>
            <div className="flex space-x-4">
              {['FB', 'TW', 'IG', 'LI'].map((social) => (
                <a key={social} href="#" className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-sm font-bold hover:bg-primary transition-all border border-white/10 hover:border-primary">
                  {social}
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Shop</h4>
            <ul className="space-y-4">
              <li><a href="/products?category=plants" className="text-gray-400 hover:text-white transition-colors font-medium">Plants</a></li>
              <li><a href="/products?category=seeds" className="text-gray-400 hover:text-white transition-colors font-medium">Seeds</a></li>
              <li><a href="/products?category=tools" className="text-gray-400 hover:text-white transition-colors font-medium">Tools</a></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Company</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors font-medium">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors font-medium">Contact</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors font-medium">Privacy</a></li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Newsletter</h4>
            <p className="text-gray-400 mb-8 leading-relaxed">Join 10k+ plant lovers and get exclusive tips and deals.</p>
            <div className="relative group">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-white/5 border border-white/10 text-white px-6 py-5 rounded-[1.5rem] focus:outline-none focus:border-primary transition-all pr-36" 
              />
              <button className="absolute right-2 top-2 bottom-2 bg-primary hover:bg-primary-dark px-6 rounded-2xl text-sm font-black transition-all shadow-lg hover:shadow-primary/30">
                JOIN
              </button>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 text-sm font-medium">&copy; {new Date().getFullYear()} Green Store. Crafted with passion.</p>
          <div className="flex space-x-8 text-gray-500 text-sm font-medium">
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
