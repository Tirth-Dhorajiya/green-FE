'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf, Droplets, Sun, Sprout } from 'lucide-react';
import api from '../services/api';
import { endpoints } from '../services/apiConfig';
import ProductCard from '../components/ProductCard';
import Image from 'next/image';
import { ProductGridSkeleton } from '../components/Skeletons';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get(endpoints.products.featured);
        if (res.data.success) {
          if (res.data.products.length > 0) {
            setFeaturedProducts(res.data.products);
          } else {
            const latest = await api.get(`${endpoints.products.list}?limit=4&sortBy=created_at&order=desc`);
            setFeaturedProducts(latest.data.products || []);
          }
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
    <div className="flex flex-col min-h-screen bg-background pt-24 transition-colors duration-300">
      {/* Hero Section v2: Centered Immersive */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden py-20">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero.png"
            alt="Nature Background"
            fill
            priority
            className="w-full h-full object-cover opacity-40 dark:opacity-20 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center space-x-2 bg-primary/15 text-primary px-6 py-2.5 rounded-full text-sm font-bold mb-8 border border-primary/20 backdrop-blur-md">
              <Leaf className="w-4 h-4 animate-bounce" />
              <span>Experience The Botanical Revolution</span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-8 leading-none text-foreground uppercase">
              Nature&apos;s <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">Masterpiece</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
              Curate your personal sanctuary with rare, ethically sourced greenery that breathes life into your modern home.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
              <Link href="/products" className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white px-8 sm:px-12 py-4 sm:py-6 rounded-xl font-black text-base sm:text-xl transition-all duration-300 shadow-2xl shadow-primary/30 flex items-center justify-center group scale-100 hover:scale-105">
                Explore Collection <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link href="/products?category=plants" className="w-full sm:w-auto glass hover:bg-black/5 dark:hover:bg-white/5 text-foreground px-8 sm:px-12 py-4 sm:py-6 rounded-xl font-black text-base sm:text-xl transition-all duration-300 border border-black/10 dark:border-white/10 flex items-center justify-center">
                Shop Plants
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto border-t border-black/5 dark:border-white/10 pt-10">
              {[
                { label: "Active Buyers", val: "12k+" },
                { label: "Plant Varieties", val: "450+" },
                { label: "Global Farms", val: "24" },
                { label: "Care Rating", val: "4.9/5" }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-2xl font-black text-foreground">{stat.val}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Floating Decorative Elements */}
        <div className="absolute top-20 right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-48 h-48 bg-secondary/10 rounded-full blur-3xl animate-pulse" />
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
                className="group bg-card p-10 rounded-xl shadow-sm hover:shadow-premium hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-500 border border-black/5 dark:border-white/5"
              >
                <div className={`w-16 h-16 ${feature.color} rounded-lg flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500`}>
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
              <span className="text-primary font-bold tracking-widest uppercase text-sm">Curated Selection</span>
              <h2 className="text-4xl md:text-5xl font-black text-foreground mt-2 tracking-tight">New Arrivals.</h2>
            </div>
            <Link href="/products" className="inline-flex items-center text-foreground hover:text-primary font-bold text-lg group transition-colors">
              Explore All <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <ProductGridSkeleton count={4} />
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
