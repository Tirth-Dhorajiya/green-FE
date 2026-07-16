'use client';

import React from 'react';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from 'next-themes';
import { WishlistProvider } from '../context/WishlistContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Return early if not mounted to prevent hydration mismatch and script tag warnings
  if (!mounted) {
    return (
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Toaster position="top-right" />
            {children}
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Toaster position="top-right" />
            {children}
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

