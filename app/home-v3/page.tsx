'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { ArrowRight, Leaf, Sprout, ShoppingCart, Star } from 'lucide-react';
import api from '../../services/api';
import ThreeDCard from '../../components/ThreeDCard';
import SmoothScroll from '../../components/SmoothScroll';
import GrainOverlay from '../../components/GrainOverlay';
import HorizontalScroll from '../../components/HorizontalScroll';

export default function HomeV3() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { scrollY } = useScroll();

  // Mouse Tracking for Bio-Sphere
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - 100);
      mouseY.set(e.clientY - 100);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products?limit=6&sortBy=created_at&order=desc');
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

  const localProducts = [
    { id: 1, name: "Desert Rose", price: 45, image: "/Gemini_Generated_Image_ihuvaihuvaihuvai.png" },
    { id: 2, name: "Emerald Fern", price: 32, image: "/Gemini_Generated_Image_vlhxxxvlhxxxvlhx.png" },
    { id: 3, name: "Mystic Palm", price: 58, image: "/Gemini_Generated_Image_vwzbmtvwzbmtvwzb.png" },
    { id: 4, name: "Classic Monstera", price: 89, image: "/hero.png" },
  ];

  return (
    <SmoothScroll>
      <div className="flex flex-col min-h-screen bg-background overflow-x-hidden selection:bg-primary selection:text-white">
        <GrainOverlay />
        
        {/* Floating Bio-Sphere (Mouse Follower) */}
        <motion.div 
          style={{ x: springX, y: springY }}
          className="fixed w-[200px] h-[200px] rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 blur-3xl pointer-events-none z-0 mix-blend-screen"
        />

        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1 className="text-[12vw] md:text-[15vw] font-black leading-[0.8] tracking-tighter text-foreground uppercase mb-12">
                Pure <br /> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500">Nature</span>
              </h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-end max-w-5xl mx-auto text-left">
                <p className="text-xl md:text-2xl text-gray-500 font-medium max-w-sm">
                  Merging digital craftsmanship with botanical life. Experience the next dimension of greenery.
                </p>
                <div className="flex justify-start md:justify-end">
                   <Link href="/products" className="group flex items-center space-x-4 bg-foreground text-background px-10 py-6 rounded-full text-xl font-black hover:bg-primary transition-colors duration-500">
                     <span>Explore Store</span>
                     <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-500" />
                   </Link>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Scroll Indicator */}
          <div className="absolute bottom-10 left-10 flex flex-col items-start space-y-4">
             <div className="w-[1px] h-20 bg-foreground/20" />
             <span className="text-[10px] font-black uppercase tracking-widest opacity-40 [writing-mode:vertical-lr]">Scroll Down</span>
          </div>
        </section>

        {/* Vertical Immersive Showcase */}
        <section className="py-40 bg-background relative z-10">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-32">
               <motion.span 
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 className="text-primary font-black uppercase tracking-[0.5em] text-sm mb-6 block"
               >
                 The Collection
               </motion.span>
               <h2 className="text-[10vw] font-black text-foreground leading-none tracking-tighter uppercase">
                 Curated <br /> Specimens.
               </h2>
            </div>

            <div className="space-y-40">
              {[...localProducts, ...localProducts].map((product, i) => (
                <motion.div
                  key={`${product.id}-${i}`}
                  initial={{ opacity: 0, y: 100, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: false, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className={`flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-20`}
                >
                  <div className="w-full lg:w-3/5">
                    <ThreeDCard>
                      <div className="relative rounded-[4rem] overflow-hidden shadow-3xl border border-white/5 glass group">
                        {/* Number Indicator */}
                        <div className="absolute top-10 left-10 z-20 mix-blend-difference">
                          <span className="text-9xl font-black text-white/10">{(i + 1).toString().padStart(2, '0')}</span>
                        </div>

                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full aspect-[4/3] object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      </div>
                    </ThreeDCard>
                  </div>

                  <div className="w-full lg:w-2/5 space-y-8">
                    <div className="space-y-4">
                      <p className="text-primary font-bold tracking-widest uppercase">Species 0{product.id}</p>
                      <h3 className="text-5xl md:text-7xl font-black text-foreground tracking-tighter uppercase">{product.name}</h3>
                    </div>
                    <p className="text-xl text-gray-500 leading-relaxed">
                      A rare masterpiece of biological symmetry. This specimen has been ethically sourced and curated for the most demanding botanical enthusiasts.
                    </p>
                    <div className="flex items-center space-x-8 pt-6">
                      <span className="text-4xl font-black text-foreground">${product.price}</span>
                      <button className="bg-primary text-white px-10 py-5 rounded-full font-black text-lg hover:scale-105 transition-transform shadow-xl shadow-primary/20">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 3D Immersive Product Grid */}
        <section className="py-40 bg-background relative z-10">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-24">
               <h2 className="text-5xl md:text-8xl font-black text-foreground mb-4 uppercase tracking-tighter">Selected Collection</h2>
               <p className="text-gray-500 font-bold tracking-widest uppercase">Depth. Texture. Life.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {localProducts.slice(0, 3).map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                >
                  <ThreeDCard>
                    <div className="glass rounded-[3rem] p-8 border border-white/5 hover:border-primary/20 transition-colors group text-center">
                      <div className="relative aspect-square rounded-3xl overflow-hidden mb-8 shadow-xl">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      </div>
                      <h3 className="text-2xl font-black text-foreground mb-2">{product.name}</h3>
                      <p className="text-primary font-bold text-lg mb-6">${product.price}</p>
                      <button className="w-full py-4 rounded-2xl bg-black/5 dark:bg-white/5 font-bold hover:bg-primary hover:text-white transition-all">
                        Quick View
                      </button>
                    </div>
                  </ThreeDCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* About Dimension Section */}
        <section className="py-40 bg-background/50 relative z-10">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="order-2 lg:order-1">
                 <ThreeDCard>
                   <div className="relative rounded-[4rem] overflow-hidden shadow-3xl border border-white/10 glass p-4">
                      <img 
                        src="/hero.png" 
                        alt="3D Botanical" 
                        className="w-full rounded-[3rem] aspect-square object-cover"
                      />
                   </div>
                 </ThreeDCard>
              </div>
              
              <div className="order-1 lg:order-2 space-y-8">
                <span className="text-primary font-black uppercase tracking-widest">About Dimension</span>
                <h2 className="text-6xl md:text-8xl font-black text-foreground leading-none tracking-tighter uppercase">
                  Immersive <br /> Living.
                </h2>
                <p className="text-xl text-gray-500 leading-relaxed max-w-lg">
                  Every plant in our collection is treated as a masterpiece of biological engineering. We bridge the gap between pixels and petals.
                </p>
                <div className="pt-10 flex space-x-10">
                   <div>
                     <p className="text-4xl font-black text-foreground">500+</p>
                     <p className="text-xs font-bold uppercase text-gray-400">Specimens</p>
                   </div>
                   <div className="h-10 w-px bg-white/10" />
                   <div>
                     <p className="text-4xl font-black text-foreground">24/7</p>
                     <p className="text-xs font-bold uppercase text-gray-400">Care Support</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Link */}
        <section className="py-20 text-center border-t border-white/5">
           <Link href="/" className="text-foreground/40 hover:text-primary transition-colors font-bold uppercase tracking-widest text-xs">
             Back to Standard Version
           </Link>
        </section>
      </div>
    </SmoothScroll>
  );
}
