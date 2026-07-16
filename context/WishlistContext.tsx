'use client';

import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { endpoints } from '../services/apiConfig';
import { useAuth } from './AuthContext';

export interface WishlistProduct {
  id: string;
  name: string;
  description?: string;
  price: string;
  category: string;
  image_url?: string;
  thumbnail_url?: string;
  stock: number;
}

interface WishlistContextType {
  wishlist: WishlistProduct[];
  wishlistCount: number;
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (product: WishlistProduct) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);
const STORAGE_KEY = 'green_wishlist';

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistProduct[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setWishlist(JSON.parse(stored));
    } catch {
      setWishlist([]);
    }
  }, []);

  useEffect(() => {
    const loadServerWishlist = async () => {
      if (!user) return;

      try {
        const res = await api.get(endpoints.wishlist.list);
        if (res.data.success) {
          setWishlist(res.data.wishlist || []);
        }
      } catch {
        toast.error('Unable to load wishlist');
      }
    };

    loadServerWishlist();
  }, [user]);

  useEffect(() => {
    if (!user) localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
  }, [wishlist, user]);

  const wishlistIds = useMemo(() => new Set(wishlist.map((item) => item.id)), [wishlist]);

  const isWishlisted = (productId: string) => wishlistIds.has(productId);

  const toggleWishlist = async (product: WishlistProduct) => {
    if (user) {
      try {
        if (wishlistIds.has(product.id)) {
          const res = await api.delete(endpoints.wishlist.item(product.id));
          setWishlist(res.data.wishlist || []);
          toast.success('Removed from wishlist');
        } else {
          const res = await api.post(endpoints.wishlist.add, { product_id: product.id });
          setWishlist(res.data.wishlist || []);
          toast.success('Added to wishlist');
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Wishlist update failed');
      }
      return;
    }

    setWishlist((current) => {
      if (current.some((item) => item.id === product.id)) {
        toast.success('Removed from wishlist');
        return current.filter((item) => item.id !== product.id);
      }

      toast.success('Added to wishlist');
      return [product, ...current];
    });
  };

  const removeFromWishlist = async (productId: string) => {
    if (user) {
      try {
        const res = await api.delete(endpoints.wishlist.item(productId));
        setWishlist(res.data.wishlist || []);
        toast.success('Removed from wishlist');
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Unable to remove wishlist item');
      }
      return;
    }

    setWishlist((current) => current.filter((item) => item.id !== productId));
    toast.success('Removed from wishlist');
  };

  return (
    <WishlistContext.Provider value={{ wishlist, wishlistCount: wishlist.length, isWishlisted, toggleWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
}
