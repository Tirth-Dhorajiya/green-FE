'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf, Droplets, Sun, Sprout } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products?limit=4&sortBy=created_at&order=desc');
        if (res.data.success) {
          setFeaturedProducts(res.data.products);
        }
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="lg:w-1/2 text-center lg:text-left"
            >
              <div className="inline-flex items-center space-x-2 bg-primary/20 text-primary-light px-4 py-2 rounded-full text-sm font-bold mb-6 border border-primary/20">
                <Sprout className="w-4 h-4" />
                <span>New Collection 2024 is Live!</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-8xl font-black tracking-tight mb-8 leading-[1.1] text-foreground">
                Bring the <br /> 
                <span className="text-primary italic">Wild</span> Inside.
              </h1>
              <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-lg leading-relaxed">
                Transform your living space with our hand-picked selection of botanical treasures. Expertly grown, carefully delivered.
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <Link href="/products" className="bg-primary hover:bg-primary-dark text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-primary/20 flex items-center group">
                  Start Shopping <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/products?category=plants" className="bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-foreground border border-black/5 dark:border-white/10 px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 shadow-sm">
                  View Catalogue
                </Link>
              </div>
              
              <div className="mt-12 flex items-center justify-center lg:justify-start space-x-8 text-gray-500">
                <div>
                  <p className="text-2xl font-black text-foreground">50k+</p>
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">Happy Clients</p>
                </div>
                <div className="w-[1px] h-8 bg-black/5 dark:bg-white/10" />
                <div>
                  <p className="text-2xl font-black text-foreground">200+</p>
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Plant Species</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="lg:w-1/2 relative"
            >
              <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700">
                <img
                  src="https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=1000&auto=format&fit=crop"
                  alt="Hero Plant"
                  className="w-full h-full object-cover aspect-[4/5]"
                />
              </div>
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10" />
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-secondary/20 rounded-full blur-3xl -z-10" />
              
              <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 -left-12 glass p-4 rounded-2xl shadow-premium z-20 hidden md:block"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary-light">
                    <Leaf className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Rare Monstera</p>
                    <p className="text-[10px] text-gray-500">In Stock Now</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-foreground mb-4 tracking-tight">The Green Standard.</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">We don&apos;t just sell plants; we provide a complete botanical experience designed for modern living.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { icon: Leaf, title: "Premium Plants", desc: "Sourced from the finest growers globally.", color: "bg-green-500/10 text-green-400" },
              { icon: Sprout, title: "Rare Seeds", desc: "98% germination rate guaranteed.", color: "bg-emerald-500/10 text-emerald-400" },
              { icon: Droplets, title: "Smart Care", desc: "Free care guides with every purchase.", color: "bg-blue-500/10 text-blue-400" }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group bg-card p-10 rounded-[2.5rem] shadow-sm hover:shadow-premium hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-500 border border-black/5 dark:border-white/5"
              >
                <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-foreground mb-4">{feature.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-6 text-center md:text-left">
            <div>
              <span className="text-primary-light font-bold tracking-widest uppercase text-sm">Curated Selection</span>
              <h2 className="text-4xl md:text-5xl font-black text-foreground mt-2 tracking-tight">New Arrivals.</h2>
            </div>
            <Link href="/products" className="inline-flex items-center text-foreground hover:text-primary font-bold text-lg group transition-colors">
              Explore All <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-card p-6 rounded-[2rem] shadow-sm animate-pulse">
                  <div className="bg-black/5 dark:bg-white/5 aspect-[4/5] rounded-2xl mb-6"></div>
                  <div className="h-4 bg-black/5 dark:bg-white/5 rounded-full w-3/4 mb-3"></div>
                  <div className="h-4 bg-black/5 dark:bg-white/5 rounded-full w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {featuredProducts.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>


  );
}
