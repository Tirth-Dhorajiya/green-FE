'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';
import { BASE_URL } from '../../services/api';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { CartSkeleton } from '../../components/Skeletons';
import ConfirmationModal from '../../components/ConfirmationModal';

export default function Cart() {
  const { cart, subtotal, loading, updateQuantity, removeFromCart } = useCart();
  const [removeItem, setRemoveItem] = React.useState<typeof cart[number] | null>(null);

  if (loading && cart.length === 0) {
    return <CartSkeleton />;
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-12 h-12 text-primary" />
        </div>
        <h2 className="text-3xl font-extrabold text-foreground mb-4">Your cart is empty</h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8">Looks like you haven't added anything to your cart yet. Discover our premium plants and tools.</p>
        <Link href="/products" className="cursor-pointer bg-primary text-white px-8 py-3.5 rounded-xl font-bold hover:bg-primary-dark transition shadow-lg shadow-primary/20">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-8">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Cart Items */}
        <div className="flex-1 space-y-6">
          {cart.map((item) => (
            <motion.div 
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-card rounded-lg p-4 sm:p-6 shadow-sm border border-black/5 dark:border-white/10 flex flex-col sm:flex-row items-center gap-6"
            >
              <div className="w-full sm:w-32 h-32 shrink-0 bg-black/5 dark:bg-white/5 rounded-xl overflow-hidden">
                <Image
                  src={item.image_url ? (item.image_url.startsWith('http') ? item.image_url : `${BASE_URL}${item.image_url}`) : 'https://images.unsplash.com/photo-1463320726281-696a485928c7?q=80&w=600&auto=format&fit=crop'} 
                  alt={item.name} 
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 flex flex-col sm:flex-row justify-between w-full gap-4">
                <div className="space-y-1">
                  <Link href={`/products/${item.product_id}`}>
                    <h3 className="text-lg font-bold text-foreground hover:text-primary transition">{item.name}</h3>
                  </Link>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">₹{parseFloat(item.price).toFixed(2)}</p>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4 sm:gap-6 w-full sm:w-auto">
                  <div className="flex items-center border border-black/5 dark:border-white/10 rounded-lg bg-black/5 dark:bg-white/5">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1 || loading}
                      className="cursor-pointer p-2 text-gray-500 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50 transition"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-medium text-foreground">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock || loading}
                      className="cursor-pointer p-2 text-gray-500 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50 transition"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="text-left sm:text-right flex flex-row sm:flex-col items-center sm:items-end justify-between gap-2">
                    <span className="text-lg font-bold text-foreground">
                      ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
                    </span>
                    <button 
                      onClick={() => setRemoveItem(item)}
                      disabled={loading}
                      className="cursor-pointer text-red-500 hover:text-red-700 p-1 bg-red-50 hover:bg-red-100 rounded-md transition disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-96 shrink-0">
          <div className="bg-card rounded-lg p-6 sm:p-8 shadow-sm border border-black/5 dark:border-white/10 sticky top-24">
            <h2 className="text-xl font-bold text-foreground mb-6">Order Summary</h2>
            
            <div className="space-y-4 text-gray-500 dark:text-gray-400 mb-6">
              <div className="flex justify-between">
                <span>Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                <span className="font-medium text-foreground">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-medium text-primary">Free</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span className="font-medium text-foreground">Calculated at checkout</span>
              </div>
            </div>
            
            <div className="border-t border-black/5 dark:border-white/10 pt-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-foreground">Total</span>
                <span className="text-2xl font-extrabold text-primary">₹{subtotal.toFixed(2)}</span>
              </div>
            </div>
            
            <Link 
              href="/checkout"
              className="w-full cursor-pointer flex items-center justify-center space-x-2 bg-primary hover:bg-primary-dark text-white py-4 rounded-xl font-bold transition shadow-lg shadow-primary/20"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500 mb-2">or</p>
              <Link href="/products" className="text-primary hover:text-primary-dark font-semibold text-sm">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
      <ConfirmationModal
        isOpen={!!removeItem}
        onClose={() => setRemoveItem(null)}
        onConfirm={async () => {
          if (removeItem) await removeFromCart(removeItem.id);
        }}
        title="Remove item?"
        message={removeItem ? `Remove "${removeItem.name}" from your cart?` : 'Remove this item from your cart?'}
        confirmText="Remove"
        variant="danger"
      />
    </div>
  );
}
