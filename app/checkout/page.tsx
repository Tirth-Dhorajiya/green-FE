'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { CreditCard, CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Checkout() {
  const { cart, subtotal, fetchCart } = useCart();
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      toast.error('Please login to checkout');
      router.push('/login');
    }
    if (cart.length === 0 && !orderSuccess && !loading) {
      router.push('/cart');
    }
  }, [user, loading, cart, orderSuccess, router]);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const res = await api.post('/orders');
      if (res.data.success) {
        setOrderSuccess(true);
        await fetchCart(); // this will empty the cart state
        toast.success('Order placed successfully!');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Checkout failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 text-center">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6"
        >
          <CheckCircle className="w-12 h-12 text-primary" />
        </motion.div>
        <h2 className="text-4xl font-extrabold text-foreground mb-4">Order Successful!</h2>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8">
          Thank you for your purchase. We'll send you a confirmation email with your order details and tracking information shortly.
        </p>
        <div className="flex gap-4">
          <Link href="/profile" className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-dark transition shadow-lg shadow-primary/20">
            View Order
          </Link>
          <Link href="/products" className="bg-card text-primary border border-primary/20 px-8 py-3 rounded-xl font-bold hover:bg-primary/5 transition">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/cart" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary mb-8 transition">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Cart
      </Link>

      <h1 className="text-3xl font-extrabold text-foreground mb-8">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1">
          <div className="bg-card rounded-2xl p-6 md:p-8 shadow-sm border border-black/5 dark:border-white/10 mb-8">
            <h2 className="text-xl font-bold text-foreground mb-6">Shipping Information</h2>
            <form id="checkout-form" onSubmit={handleCheckout} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-1">First Name</label>
                  <input type="text" required className="w-full px-4 py-2 border border-black/10 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none bg-black/5 dark:bg-white/5 text-foreground" defaultValue={user?.name.split(' ')[0] || ''} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-1">Last Name</label>
                  <input type="text" required className="w-full px-4 py-2 border border-black/10 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none bg-black/5 dark:bg-white/5 text-foreground" defaultValue={user?.name.split(' ')[1] || ''} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground/70 mb-1">Address</label>
                <input type="text" required className="w-full px-4 py-2 border border-black/10 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none bg-black/5 dark:bg-white/5 text-foreground" placeholder="123 Green St" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-1">City</label>
                  <input type="text" required className="w-full px-4 py-2 border border-black/10 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none bg-black/5 dark:bg-white/5 text-foreground" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-1">Postal Code</label>
                  <input type="text" required className="w-full px-4 py-2 border border-black/10 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none bg-black/5 dark:bg-white/5 text-foreground" />
                </div>
              </div>
            </form>
          </div>

          <div className="bg-card rounded-2xl p-6 md:p-8 shadow-sm border border-black/5 dark:border-white/10">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-primary" /> Payment
            </h2>
            <div className="p-4 border border-black/10 dark:border-white/10 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400 text-sm italic">For this demo, payment processing is simulated. Clicking "Place Order" will create the order directly.</p>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-96 shrink-0">
          <div className="bg-card rounded-2xl p-6 shadow-sm border border-black/5 dark:border-white/10 sticky top-24">
            <h2 className="text-xl font-bold text-foreground mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{item.quantity} x {item.name}</span>
                  <span className="font-medium text-foreground">${(item.quantity * parseFloat(item.price)).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-black/5 dark:border-white/10 pt-4 space-y-3 text-gray-500 dark:text-gray-400 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-foreground">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-medium text-primary">Free</span>
              </div>
            </div>
            
            <div className="border-t border-black/5 dark:border-white/10 pt-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-foreground">Total</span>
                <span className="text-2xl font-extrabold text-primary">${subtotal.toFixed(2)}</span>
              </div>
            </div>
            
            <button 
              form="checkout-form"
              type="submit"
              disabled={isSubmitting || cart.length === 0}
              className="w-full flex items-center justify-center space-x-2 bg-primary hover:bg-primary-dark text-white py-4 rounded-xl font-bold transition shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              {isSubmitting ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
