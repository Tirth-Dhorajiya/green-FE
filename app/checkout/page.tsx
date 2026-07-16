'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '../../services/api';
import { endpoints } from '../../services/apiConfig';
import toast from 'react-hot-toast';
import { CreditCard, CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Script from 'next/script';
import { motion } from 'framer-motion';

declare global {
  interface Window {
    Razorpay?: new (options: any) => { open: () => void };
  }
}

export default function Checkout() {
  const { cart, subtotal, fetchCart } = useCart();
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [shippingAddress, setShippingAddress] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
  });

  useEffect(() => {
    if (user) {
      const [firstName = '', ...lastNameParts] = user.name.split(' ');
      const savedAddress = user.address || {};
      const [savedFirstName = firstName, ...savedLastNameParts] = (savedAddress.name || user.name).split(' ');
      setShippingAddress((current) => ({
        ...current,
        firstName: savedFirstName,
        lastName: savedLastNameParts.join(' ') || lastNameParts.join(' '),
        address: savedAddress.address || current.address,
        city: savedAddress.city || current.city,
        postalCode: savedAddress.postalCode || current.postalCode,
      }));
    }
  }, [user]);

  useEffect(() => {
    setAppliedCoupon(null);
  }, [subtotal]);

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Enter a coupon code');
      return;
    }

    try {
      const res = await api.post(endpoints.coupons.validate, {
        code: couponCode,
        subtotal,
      });
      setAppliedCoupon({
        code: res.data.coupon.code,
        discount: Number(res.data.coupon.discount),
      });
      toast.success('Coupon applied');
    } catch (error: any) {
      setAppliedCoupon(null);
      toast.error(error.response?.data?.message || 'Coupon could not be applied');
    }
  };

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
    if (!window.Razorpay) {
      toast.error('Payment checkout is still loading. Please try again.');
      return;
    }

    try {
      setIsSubmitting(true);
      const shippingPayload = {
        name: `${shippingAddress.firstName} ${shippingAddress.lastName}`.trim(),
        address: shippingAddress.address,
        city: shippingAddress.city,
        postalCode: shippingAddress.postalCode,
      };

      const res = await api.post(endpoints.payments.razorpayOrder, {
        shipping_address: shippingPayload,
        coupon_code: appliedCoupon?.code,
      });

      const razorpayOrder = res.data.order;
      const payment = new window.Razorpay({
        key: res.data.key,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'Green Store',
        description: 'Plant store order payment',
        order_id: razorpayOrder.id,
        prefill: {
          name: shippingPayload.name,
          email: user?.email,
        },
        handler: async (response: any) => {
          try {
            const verifyRes = await api.post(endpoints.payments.razorpayVerify, response);
            if (verifyRes.data.success) {
              setOrderSuccess(true);
              await fetchCart();
              toast.success('Payment verified and order placed!');
            }
          } catch (error: any) {
            toast.error(error.response?.data?.message || 'Payment verification failed');
          } finally {
            setIsSubmitting(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsSubmitting(false);
            toast.error('Payment cancelled');
          },
        },
      });

      payment.open();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Checkout failed');
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
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1">
          <div className="bg-card rounded-lg p-6 md:p-8 shadow-sm border border-black/5 dark:border-white/10 mb-8">
            <h2 className="text-xl font-bold text-foreground mb-6">Shipping Information</h2>
            <form id="checkout-form" onSubmit={handleCheckout} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-1">First Name</label>
                  <input type="text" required value={shippingAddress.firstName} onChange={(event) => setShippingAddress({ ...shippingAddress, firstName: event.target.value })} className="w-full px-4 py-2 border border-black/10 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none bg-black/5 dark:bg-white/5 text-foreground" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-1">Last Name</label>
                  <input type="text" required value={shippingAddress.lastName} onChange={(event) => setShippingAddress({ ...shippingAddress, lastName: event.target.value })} className="w-full px-4 py-2 border border-black/10 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none bg-black/5 dark:bg-white/5 text-foreground" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground/70 mb-1">Address</label>
                <input type="text" required value={shippingAddress.address} onChange={(event) => setShippingAddress({ ...shippingAddress, address: event.target.value })} className="w-full px-4 py-2 border border-black/10 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none bg-black/5 dark:bg-white/5 text-foreground" placeholder="123 Green St" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-1">City</label>
                  <input type="text" required value={shippingAddress.city} onChange={(event) => setShippingAddress({ ...shippingAddress, city: event.target.value })} className="w-full px-4 py-2 border border-black/10 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none bg-black/5 dark:bg-white/5 text-foreground" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-1">Postal Code</label>
                  <input type="text" required value={shippingAddress.postalCode} onChange={(event) => setShippingAddress({ ...shippingAddress, postalCode: event.target.value })} className="w-full px-4 py-2 border border-black/10 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none bg-black/5 dark:bg-white/5 text-foreground" />
                </div>
              </div>
            </form>
          </div>

          <div className="bg-card rounded-lg p-6 md:p-8 shadow-sm border border-black/5 dark:border-white/10">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-primary" /> Payment
            </h2>
            <div className="p-4 border border-black/10 dark:border-white/10 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400 text-sm italic">Payment is processed securely through Razorpay. Your order is created after payment verification.</p>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-96 shrink-0">
          <div className="bg-card rounded-lg p-6 shadow-sm border border-black/5 dark:border-white/10 sticky top-24">
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
              {appliedCoupon && (
                <div className="flex justify-between text-primary">
                  <span>Coupon ({appliedCoupon.code})</span>
                  <span className="font-medium">-${appliedCoupon.discount.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="mb-6 flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(event) => setCouponCode(event.target.value.toUpperCase())}
                placeholder="Coupon code"
                className="min-w-0 flex-1 px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-sm font-bold outline-none"
              />
              <button
                type="button"
                onClick={applyCoupon}
                className="px-4 py-3 rounded-xl bg-primary/10 text-primary text-sm font-black hover:bg-primary/20 transition"
              >
                Apply
              </button>
            </div>
            
            <div className="border-t border-black/5 dark:border-white/10 pt-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-foreground">Total</span>
                <span className="text-2xl font-extrabold text-primary">${Math.max(0, subtotal - (appliedCoupon?.discount || 0)).toFixed(2)}</span>
              </div>
            </div>
            
            <button 
              form="checkout-form"
              type="submit"
              disabled={isSubmitting || cart.length === 0}
              className="w-full flex items-center justify-center space-x-2 bg-primary hover:bg-primary-dark text-white py-4 rounded-xl font-bold transition shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              {isSubmitting ? 'Processing...' : 'Pay with Razorpay'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
