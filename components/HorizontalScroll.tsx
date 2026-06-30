'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

export default function HorizontalScroll({ children, title }: { children: React.ReactNode, title?: string }) {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  });

  // Smooth the scroll progress for a more "viscous" feel
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Main horizontal movement
  const x = useTransform(smoothProgress, [0, 1], ["0%", "-70%"]);
  
  // Background parallax movement
  const bgX = useTransform(smoothProgress, [0, 1], ["10%", "-10%"]);
  
  // Dynamic skew effect based on scroll velocity (simulated via progress delta)
  const skewX = useTransform(smoothProgress, [0, 0.5, 1], ["-2deg", "0deg", "2deg"]);

  return (
    <section ref={targetRef} className="relative h-[500vh] bg-background overflow-hidden">
      {/* Background Decor */}
      <motion.div 
        style={{ x: bgX }}
        className="absolute inset-0 z-0 opacity-10 pointer-events-none"
      >
        <div className="absolute top-1/4 left-0 text-[30vw] font-black text-primary leading-none uppercase select-none">
          Botanical
        </div>
        <div className="absolute bottom-1/4 right-0 text-[30vw] font-black text-secondary leading-none uppercase select-none">
          Portfolio
        </div>
      </motion.div>

      <div className="sticky top-0 h-screen flex flex-col items-start justify-center overflow-hidden">
        {title && (
          <motion.div 
            style={{ x: useTransform(smoothProgress, [0, 1], ["50%", "-50%"]) }}
            className="absolute top-1/2 left-0 -translate-y-1/2 z-0 pointer-events-none"
          >
             <h2 className="text-[25vw] font-black text-foreground/5 uppercase tracking-tighter whitespace-nowrap">
               {title}
             </h2>
          </motion.div>
        )}

        <motion.div 
          style={{ x, skewX }} 
          className="flex gap-40 px-[20vw] z-10"
        >
          {children}
        </motion.div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-20 left-10 md:left-20 right-10 md:right-20 h-px bg-foreground/10 z-20">
        <motion.div 
          style={{ scaleX: smoothProgress }}
          className="h-full bg-primary origin-left"
        />
      </div>
    </section>
  );
}
