'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';
import { endpoints } from '../services/apiConfig';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface CartItem {
  id: string;
  product_id: string;
  name: string;
  price: string;
  quantity: number;
  image_url: string;
  stock: number;
}

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  subtotal: number;
  loading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  updateQuantity: (cartId: string, quantity: number) => Promise<void>;
  removeFromCart: (cartId: string) => Promise<void>;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user, token } = useAuth();

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    if (user && token) {
      fetchCart();
    } else {
      clearCart();
    }
  }, [user, token]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await api.get(endpoints.cart.list);
      if (res.data.success) {
        setCart(res.data.cart || []);
        setSubtotal(res.data.subtotal || 0);
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: string, quantity: number = 1) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }
    try {
      setLoading(true);
      const res = await api.post(endpoints.cart.add, { product_id: productId, quantity });
      if (res.data.success) {
        toast.success('Added to cart!');
        await fetchCart();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartId: string, quantity: number) => {
    try {
      setLoading(true);
      const res = await api.put(endpoints.cart.item(cartId), { quantity });
      if (res.data.success) {
        await fetchCart();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update quantity');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (cartId: string) => {
    try {
      setLoading(true);
      const res = await api.delete(endpoints.cart.item(cartId));
      if (res.data.success) {
        toast.success('Item removed from cart');
        await fetchCart();
      }
    } catch (error: any) {
      toast.error('Failed to remove item');
    } finally {
      setLoading(false);
    }
  };

  const clearCart = () => {
    setCart([]);
    setSubtotal(0);
  };

  return (
    <CartContext.Provider
      value={{ cart, cartCount, subtotal, loading, fetchCart, addToCart, updateQuantity, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
