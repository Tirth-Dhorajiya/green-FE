'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { BASE_URL } from '../../services/api';
import { CartSkeleton } from '../../components/Skeletons';
import ConfirmationModal from '../../components/ConfirmationModal';

const fallbackImage = 'https://images.unsplash.com/photo-1463320726281-696a485928c7?q=80&w=600&auto=format&fit=crop';
const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
});

export default function Cart() {
  const { cart, subtotal, loading, updateQuantity, removeFromCart } = useCart();
  const [removeItem, setRemoveItem] = React.useState<typeof cart[number] | null>(null);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (loading && cart.length === 0) return <CartSkeleton />;

  if (cart.length === 0) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-4 py-12 text-center sm:px-6 sm:py-20 lg:px-8">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 sm:mb-6 sm:h-24 sm:w-24">
          <ShoppingBag className="h-8 w-8 text-primary sm:h-12 sm:w-12" />
        </div>
        <h1 className="mb-3 text-2xl font-black text-foreground sm:mb-4 sm:text-3xl">Your cart is empty</h1>
        <p className="mx-auto mb-7 max-w-md text-sm leading-relaxed text-gray-500 dark:text-gray-400 sm:mb-8 sm:text-base">
          You haven&apos;t added anything yet. Discover our premium plants, seeds, and gardening tools.
        </p>
        <Link href="/products" className="rounded-xl bg-primary px-7 py-3.5 text-sm font-black text-white shadow-lg shadow-primary/20 transition hover:bg-primary-dark sm:px-8">
          Start Shopping
        </Link>
      </section>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-12 lg:px-8">
      <header className="mb-5 flex items-end justify-between gap-3 sm:mb-8">
        <div>
          <p className="mb-1 text-[10px] font-black uppercase tracking-[0.18em] text-primary sm:text-xs">Your selection</p>
          <h1 className="text-2xl font-black text-foreground sm:text-4xl">Shopping Cart</h1>
          <p className="mt-1 text-xs font-bold text-gray-500 dark:text-gray-400">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
        </div>
        <Link href="/products" className="shrink-0 rounded-full border border-primary/30 px-3 py-2 text-xs font-black text-primary transition hover:bg-primary hover:text-white sm:hidden">
          Add more
        </Link>
      </header>

      <div className="flex flex-col gap-5 lg:flex-row lg:gap-12">
        <section aria-label="Cart items" className="min-w-0 flex-1 space-y-3 sm:space-y-5">
          {cart.map((item) => {
            const unitPrice = Number(item.price);
            const imageUrl = item.image_url
              ? (item.image_url.startsWith('http') ? item.image_url : `${BASE_URL}${item.image_url}`)
              : fallbackImage;

            return (
              <motion.article
                key={item.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex min-w-0 gap-3 rounded-2xl border border-black/5 bg-card p-3 shadow-sm dark:border-white/10 sm:gap-6 sm:p-6"
              >
                <Link href={`/products/${item.product_id}`} className="relative h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-black/5 dark:bg-white/5 sm:h-32 sm:w-32" aria-label={`View ${item.name}`}>
                  <Image src={imageUrl} alt={item.name} fill sizes="(max-width: 639px) 96px, 128px" className="object-cover" />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex min-w-0 items-start justify-between gap-2">
                    <div className="min-w-0">
                      <Link href={`/products/${item.product_id}`}>
                        <h2 className="line-clamp-2 text-sm font-black leading-snug text-foreground transition hover:text-primary sm:text-lg">{item.name}</h2>
                      </Link>
                      <p className="mt-1 text-xs font-bold text-gray-500 dark:text-gray-400 sm:text-sm">{currencyFormatter.format(unitPrice)} each</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setRemoveItem(item)}
                      disabled={loading}
                      aria-label={`Remove ${item.name} from cart`}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-400 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-auto flex flex-col items-start gap-2 pt-3 min-[380px]:flex-row min-[380px]:items-end min-[380px]:justify-between">
                    <div className="flex h-9 items-center rounded-lg border border-black/5 bg-black/5 dark:border-white/10 dark:bg-white/5 sm:h-10">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1 || loading}
                        aria-label={`Decrease ${item.name} quantity`}
                        className="flex h-full w-9 items-center justify-center text-gray-400 transition hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 sm:w-10"
                      >
                        <Minus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </button>
                      <span className="w-7 text-center text-sm font-black text-foreground sm:w-9">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock || loading}
                        aria-label={`Increase ${item.name} quantity`}
                        className="flex h-full w-9 items-center justify-center text-gray-400 transition hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 sm:w-10"
                      >
                        <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </button>
                    </div>
                    <p className="text-sm font-black text-primary min-[380px]:text-right sm:text-lg">{currencyFormatter.format(unitPrice * item.quantity)}</p>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </section>

        <aside className="w-full shrink-0 lg:w-96">
          <div className="rounded-2xl border border-black/5 bg-card p-4 shadow-sm dark:border-white/10 sm:p-8 lg:sticky lg:top-24">
            <h2 className="mb-5 text-lg font-black text-foreground sm:mb-6 sm:text-xl">Order Summary</h2>

            <div className="mb-5 space-y-3 text-sm text-gray-500 dark:text-gray-400 sm:mb-6 sm:space-y-4">
              <div className="flex justify-between gap-4">
                <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                <span className="shrink-0 font-bold text-foreground">{currencyFormatter.format(subtotal)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Shipping</span>
                <span className="font-bold text-primary">Free</span>
              </div>
              <div className="flex items-start justify-between gap-4">
                <span>Tax</span>
                <span className="max-w-[60%] text-right font-bold text-foreground">Calculated at checkout</span>
              </div>
            </div>

            <div className="mb-5 border-t border-black/5 pt-4 dark:border-white/10 sm:mb-8">
              <div className="flex items-center justify-between gap-3">
                <span className="font-black text-foreground sm:text-lg">Total</span>
                <span className="text-xl font-black text-primary sm:text-2xl">{currencyFormatter.format(subtotal)}</span>
              </div>
            </div>

            <Link href="/checkout" className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-black text-white shadow-lg shadow-primary/20 transition hover:bg-primary-dark sm:h-14">
              Proceed to Checkout
              <ArrowRight className="h-5 w-5" />
            </Link>

            <div className="mt-5 text-center sm:mt-6">
              <Link href="/products" className="text-sm font-bold text-primary hover:text-primary-dark hover:underline">Continue Shopping</Link>
            </div>
          </div>
        </aside>
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
