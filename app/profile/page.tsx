'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import api, { BASE_URL } from '../../services/api';
import { endpoints } from '../../services/apiConfig';
import { Package, User, ChevronRight, Save, X, Truck, CreditCard, MapPin, Download, Ban, LogOut, LayoutGrid, Heart, ShoppingCart, RotateCcw, CircleHelp } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { ProfileSkeleton, SkeletonBlock } from '../../components/Skeletons';
import ConfirmationModal from '../../components/ConfirmationModal';
import OrderReturns from '../../components/OrderReturns';

const orderSteps = ['pending', 'processing', 'shipped', 'delivered'];
const currencyFormatter = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 });
const money = (value: string | number | undefined) => currencyFormatter.format(Number(value || 0));
const dateTime = (value: string | undefined) => value ? new Date(value).toLocaleString() : '-';

function downloadReceipt(order: any) {
  const address = order.shipping_address || {};
  const lines = [
    'Green Store Receipt',
    `Order: #${order.id.slice(0, 8)}`,
    `Date: ${dateTime(order.created_at)}`,
    `Status: ${order.status}`,
    `Payment: ${order.payment_status}`,
    '',
    'Items:',
    ...(order.items || []).map((item: any) => `${item.quantity} x ${item.product_name} @ ${money(item.price)} = ${money(item.quantity * Number(item.price))}`),
    '',
    `Subtotal: ${money(order.subtotal_price || order.total_price)}`,
    `Coupon: ${order.coupon_code || '-'}`,
    `Discount: -${money(order.discount_amount || 0)}`,
    `Total: ${money(order.total_price)}`,
    '',
    'Shipping:',
    [address.name, address.phone, address.address, address.landmark, address.city, address.state, address.postalCode, address.country].filter(Boolean).join(', '),
    '',
    `Razorpay payment: ${order.razorpay_payment_id || '-'}`,
  ];
  const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `green-store-order-${order.id.slice(0, 8)}.txt`;
  link.click();
  URL.revokeObjectURL(url);
}

function ShipmentTracking({ shipments, compact = false }: { shipments?: any[]; compact?: boolean }) {
  if (!shipments?.length) return null;
  const visibleShipments = shipments.filter((shipment) => shipment.status !== 'failed');
  if (!visibleShipments.length) return null;

  return (
    <div className={compact ? 'mt-5 space-y-3' : 'mt-6 space-y-4'}>
      {visibleShipments.map((shipment) => (
        <div key={shipment.id} className="rounded-xl border border-primary/10 bg-primary/5 p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">Delhivery shipment</p>
              {!compact && <p className="text-xs text-gray-500 dark:text-gray-400">Reference: {shipment.provider_reference}</p>}
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-primary">
              {String(shipment.status).replaceAll('_', ' ')}
            </span>
          </div>
          <div className="grid gap-3">
            {shipment.packages?.map((pkg: any) => (
              <div key={pkg.id} className="rounded-xl border border-black/5 bg-card p-3 dark:border-white/10">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-black text-foreground">Parcel {pkg.sequence}</p>
                    <p className="text-sm font-bold text-primary">AWB: {pkg.waybill || 'Pending'}</p>
                    {!compact && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{pkg.contents}</p>}
                  </div>
                  <div className="text-right text-xs">
                    <p className="font-black capitalize text-foreground">{String(pkg.status).replaceAll('_', ' ')}</p>
                    {pkg.estimated_delivery_date && <p className="mt-1 text-gray-500">ETA {new Date(pkg.estimated_delivery_date).toLocaleDateString()}</p>}
                  </div>
                </div>
                {(pkg.status_description || pkg.status_location) && (
                  <p className="mt-3 text-xs font-medium text-gray-600 dark:text-gray-400">
                    {[pkg.status_description, pkg.status_location].filter(Boolean).join(' · ')}
                  </p>
                )}
                {!compact && !!pkg.events?.length && (
                  <div className="mt-4 space-y-3 border-t border-black/5 pt-4 dark:border-white/10">
                    {pkg.events.map((event: any) => (
                      <div key={event.id} className="relative pl-5 text-xs before:absolute before:left-0 before:top-1.5 before:h-2 before:w-2 before:rounded-full before:bg-primary">
                        <p className="font-black text-foreground">{event.status}</p>
                        <p className="text-gray-500 dark:text-gray-400">{dateTime(event.occurred_at)}{event.location ? ` · ${event.location}` : ''}</p>
                        {event.instructions && <p className="mt-1 text-gray-500 dark:text-gray-400">{event.instructions}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function OrderDetailsModal({ order, onClose, onCancel, onChanged }: { order: any; onClose: () => void; onCancel: (order: any) => void; onChanged: () => Promise<void> }) {
  const address = order.shipping_address || {};
  const activeStep = order.status === 'cancelled' ? -1 : orderSteps.indexOf(order.status);
  const canCancel = ['pending', 'processing'].includes(order.status);

  return (
    <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true">
      <div className="max-h-[96dvh] w-full max-w-5xl overflow-y-auto rounded-t-3xl border border-black/10 bg-background shadow-2xl dark:border-white/10 sm:max-h-[92dvh] sm:rounded-3xl">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-black/5 bg-background/95 p-4 backdrop-blur dark:border-white/10 sm:gap-4 sm:p-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-primary">Order details</p>
            <h2 className="text-2xl font-black text-foreground">#{order.id.slice(0, 8)}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{dateTime(order.created_at)}</p>
          </div>
          <button onClick={onClose} className="cursor-pointer rounded-full bg-black/5 dark:bg-white/10 p-3 text-foreground hover:bg-primary hover:text-white transition" aria-label="Close order details">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 p-3 sm:space-y-6 sm:p-5">
          <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
            <div className="rounded-xl bg-card border border-black/5 dark:border-white/10 p-3 sm:rounded-2xl sm:p-4">
              <p className="text-xs font-black uppercase text-gray-500">Total</p>
              <strong className="text-lg text-primary sm:text-2xl">{money(order.total_price)}</strong>
            </div>
            <div className="rounded-xl bg-card border border-black/5 dark:border-white/10 p-3 sm:rounded-2xl sm:p-4">
              <p className="text-xs font-black uppercase text-gray-500">Order</p>
              <strong className="capitalize text-foreground">{order.status}</strong>
            </div>
            <div className="rounded-xl bg-card border border-black/5 dark:border-white/10 p-3 sm:rounded-2xl sm:p-4">
              <p className="text-xs font-black uppercase text-gray-500">Payment</p>
              <strong className="capitalize text-foreground">{order.payment_status}</strong>
            </div>
            <div className="rounded-xl bg-card border border-black/5 dark:border-white/10 p-3 sm:rounded-2xl sm:p-4">
              <p className="text-xs font-black uppercase text-gray-500">Coupon</p>
              <strong className="text-foreground">{order.coupon_code || 'None'}</strong>
            </div>
          </div>

          <section className="rounded-2xl bg-card border border-black/5 dark:border-white/10 p-3 sm:p-5">
            <h3 className="font-black text-foreground mb-5 flex items-center gap-2"><Truck className="w-5 h-5 text-primary" /> Tracking</h3>
            {order.status === 'cancelled' ? (
              <div className="rounded-xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-4 font-bold">This order is cancelled.</div>
            ) : (
              <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
                {orderSteps.map((step, index) => (
                  <div key={step} className={`rounded-xl border p-3 sm:p-4 ${index <= activeStep ? 'border-primary bg-primary/10 text-primary' : 'border-black/5 dark:border-white/10 text-gray-500'}`}>
                    <p className="font-black capitalize">{step}</p>
                    <p className="text-xs mt-1">
                      {order.status_history?.find((item: any) => item.to_status === step)?.created_at
                        ? dateTime(order.status_history.find((item: any) => item.to_status === step).created_at)
                        : index <= activeStep ? 'Completed' : 'Waiting'}
                    </p>
                  </div>
                ))}
              </div>
            )}
            {!order.shipments?.length && (order.courier_name || order.tracking_number || order.estimated_delivery_date) && (
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                <p><strong>Courier:</strong> {order.courier_name || '-'}</p>
                <p><strong>Tracking:</strong> {order.tracking_number || '-'}</p>
                <p><strong>ETA:</strong> {order.estimated_delivery_date ? new Date(order.estimated_delivery_date).toLocaleDateString() : '-'}</p>
              </div>
            )}
            <ShipmentTracking shipments={order.shipments} />
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-5">
            <section className="rounded-2xl bg-card border border-black/5 dark:border-white/10 p-3 sm:p-5">
              <h3 className="font-black text-foreground mb-4">Items</h3>
              <div className="space-y-4">
                {order.items?.map((item: any) => (
                  <div key={item.id} className="flex min-w-0 items-start gap-3 sm:gap-4">
                    <Image
                      src={item.image_url ? (item.image_url.startsWith('http') ? item.image_url : `${BASE_URL}${item.image_url}`) : 'https://images.unsplash.com/photo-1463320726281-696a485928c7?q=80&w=200&auto=format&fit=crop'}
                      alt={item.product_name}
                      width={64}
                      height={64}
                      className="h-14 w-14 shrink-0 rounded-xl object-cover sm:h-16 sm:w-16"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="break-words font-bold text-foreground">{item.product_name}</h4>
                      <p className="text-sm text-gray-500">Qty: {item.quantity} x {money(item.price)}</p>
                    </div>
                    <strong className="shrink-0 text-sm sm:text-base">{money(item.quantity * Number(item.price))}</strong>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-5">
              <div className="rounded-2xl bg-card border border-black/5 dark:border-white/10 p-5">
                <h3 className="font-black text-foreground mb-3 flex items-center gap-2"><MapPin className="w-5 h-5 text-primary" /> Delivery address</h3>
                <p className="font-bold">{address.name || '-'}</p>
                <p className="text-sm text-gray-500">{address.phone || '-'}</p>
                <p className="text-sm text-gray-500">{[address.address, address.landmark, address.city, address.state, address.postalCode, address.country].filter(Boolean).join(', ') || '-'}</p>
              </div>
              <div className="rounded-2xl bg-card border border-black/5 dark:border-white/10 p-5">
                <h3 className="font-black text-foreground mb-3 flex items-center gap-2"><CreditCard className="w-5 h-5 text-primary" /> Payment</h3>
                <p className="text-sm"><strong>Provider:</strong> {order.payment_provider || '-'}</p>
                <p className="text-sm break-all"><strong>Reference:</strong> {order.payment_reference || '-'}</p>
                <p className="text-sm break-all"><strong>Razorpay:</strong> {order.razorpay_payment_id || '-'}</p>
                <div className="mt-4 border-t border-black/5 dark:border-white/10 pt-3 space-y-2 text-sm">
                  <div className="flex justify-between"><span>Subtotal</span><strong>{money(order.subtotal_price || order.total_price)}</strong></div>
                  <div className="flex justify-between"><span>Discount</span><strong>-{money(order.discount_amount || 0)}</strong></div>
                  <div className="flex justify-between text-lg text-primary"><span>Total</span><strong>{money(order.total_price)}</strong></div>
                </div>
              </div>
            </section>
          </div>

          <OrderReturns order={order} onChanged={onChanged} />

          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={() => downloadReceipt(order)} className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-white px-5 py-3 font-black hover:bg-primary-dark transition">
              <Download className="w-4 h-4" /> Download Receipt
            </button>
            {canCancel && (
              <button onClick={() => onCancel(order)} className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-5 py-3 font-black hover:bg-red-100 dark:hover:bg-red-900/30 transition">
                <Ban className="w-4 h-4" /> Cancel Order
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AccountActionCard({ icon: Icon, title, description, onClick }: { icon: React.ComponentType<{ className?: string }>; title: string; description: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="group flex min-h-28 w-full items-start gap-4 rounded-2xl border border-black/5 bg-card p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg dark:border-white/10 sm:min-h-32 sm:p-5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-white sm:h-12 sm:w-12">
        <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
      </div>
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2 text-base font-black text-foreground group-hover:text-primary">
          {title}<ChevronRight className="h-4 w-4 shrink-0 text-gray-500 transition group-hover:translate-x-1 group-hover:text-primary" />
        </span>
        <span className="mt-1.5 block text-xs leading-relaxed text-gray-500 dark:text-gray-400 sm:text-sm">{description}</span>
      </span>
    </button>
  );
}

function ProfileField({
  label,
  value,
  onChange,
  type = 'text',
  inputMode,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: React.HTMLInputTypeAttribute;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  autoComplete?: string;
}) {
  return (
    <label className="block text-sm font-black text-foreground/70">
      {label}
      <input
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-12 w-full rounded-xl border border-black/10 bg-background px-4 text-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 dark:border-white/10"
      />
    </label>
  );
}

export default function Profile() {
  const { user, loading, logout, checkAuth } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<'overview' | 'orders' | 'returns' | 'account'>('overview');
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [cancelOrder, setCancelOrder] = useState<any>(null);
  const [profileForm, setProfileForm] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: 'India',
    postalCode: '',
    landmark: '',
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        phone: user.address?.phone || '',
        address: user.address?.address || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        country: user.address?.country || 'India',
        postalCode: user.address?.postalCode || '',
        landmark: user.address?.landmark || '',
      });
    }
  }, [user]);

  const fetchOrders = useCallback(async () => {
    try {
      setLoadingOrders(true);
      const res = await api.get(endpoints.orders.mine);
      if (res.data.success) {
        setOrders(res.data.orders);
        setSelectedOrder((current: any) => current ? res.data.orders.find((order: any) => order.id === current.id) || current : current);
      }
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setLoadingOrders(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user, fetchOrders]);

  useEffect(() => {
    if (!selectedOrder) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedOrder(null);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [selectedOrder]);

  if (loading || !user) {
    return <ProfileSkeleton />;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400';
      case 'processing': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400';
      case 'shipped': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400';
      case 'delivered': return 'bg-primary/10 text-primary';
      case 'cancelled': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400';
      default: return 'bg-black/5 dark:bg-white/5 text-foreground';
    }
  };

  const saveProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setProfileSaving(true);
      await api.put(endpoints.auth.updateMe, {
        name: profileForm.name,
        address: {
          name: profileForm.name,
          phone: profileForm.phone,
          address: profileForm.address,
          city: profileForm.city,
          state: profileForm.state,
          country: profileForm.country,
          postalCode: profileForm.postalCode,
          landmark: profileForm.landmark,
        },
      });
      await checkAuth();
      toast.success('Profile updated');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Unable to update profile');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!cancelOrder) return;
    try {
      const res = await api.put(endpoints.orders.cancel(cancelOrder.id), { note: 'Cancelled by customer' });
      setOrders((current: any[]) => current.map((order) => order.id === cancelOrder.id ? res.data.order : order));
      setSelectedOrder(res.data.order);
      toast.success(res.data.message || 'Order cancelled');
      await fetchOrders();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Unable to cancel order');
    } finally {
      setCancelOrder(null);
    }
  };

  const openOrderHistory = () => {
    setActiveSection('orders');
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        document.getElementById('order-history')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  };

  const openReturnHistory = () => {
    setActiveSection('returns');
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        document.getElementById('return-history')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  };

  const ordersWithReturns = orders.filter((order) => order.returns?.length || order.refunds?.length);

  return (
    <div className="mx-auto max-w-screen-2xl px-3 py-4 sm:px-6 sm:py-10 lg:px-10 xl:px-12">
      <header className="mb-5 sm:mb-8">
        <p className="mb-1 text-[10px] font-black uppercase tracking-[0.2em] text-primary sm:text-xs">Customer dashboard</p>
        <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-4xl">My Account</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage your details, deliveries, returns, and receipts.</p>
      </header>

      <div className="grid min-w-0 gap-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8 xl:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="min-w-0 lg:self-start lg:sticky lg:top-24">
          <div className="rounded-2xl border border-black/5 bg-card p-4 shadow-sm dark:border-white/10 sm:p-5 lg:p-6">
            <div className="flex min-w-0 items-center gap-3 lg:flex-col lg:text-center">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 lg:h-20 lg:w-20 lg:rounded-full">
                <User className="h-7 w-7 text-primary lg:h-10 lg:w-10" />
              </div>
              <div className="min-w-0">
                <h2 className="truncate text-lg font-black text-foreground lg:mt-3 lg:text-xl">{user.name}</h2>
                <p className="truncate text-xs text-gray-500 dark:text-gray-400 lg:mt-1 lg:text-sm">{user.email}</p>
              </div>
            </div>

            <nav aria-label="Account sections" className="mt-4 grid grid-cols-2 gap-2 lg:mt-6 lg:grid-cols-1">
              <button
                type="button"
                onClick={() => setActiveSection('overview')}
                className={`flex h-11 items-center justify-center gap-1.5 rounded-xl px-2 text-xs font-black transition lg:h-12 lg:justify-between lg:px-4 lg:text-sm ${activeSection === 'overview' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-background text-foreground hover:bg-primary/10 hover:text-primary'}`}
              >
                <span className="flex min-w-0 items-center gap-2"><LayoutGrid className="h-4 w-4 shrink-0 lg:h-5 lg:w-5" /> <span className="truncate">Overview</span></span>
                <ChevronRight className="hidden h-4 w-4 lg:block" />
              </button>
              <button
                type="button"
                onClick={() => setActiveSection('orders')}
                className={`flex h-11 items-center justify-center gap-1.5 rounded-xl px-2 text-xs font-black transition lg:h-12 lg:justify-between lg:px-4 lg:text-sm ${activeSection === 'orders' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-background text-foreground hover:bg-primary/10 hover:text-primary'}`}
              >
                <span className="flex min-w-0 items-center gap-2"><Package className="h-4 w-4 shrink-0 lg:h-5 lg:w-5" /> Orders</span>
                <ChevronRight className="hidden h-4 w-4 lg:block" />
              </button>
              <button
                type="button"
                onClick={() => setActiveSection('account')}
                className={`flex h-11 items-center justify-center gap-1.5 rounded-xl px-2 text-xs font-black transition lg:h-12 lg:justify-between lg:px-4 lg:text-sm ${activeSection === 'account' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-background text-foreground hover:bg-primary/10 hover:text-primary'}`}
              >
                <span className="flex min-w-0 items-center gap-2"><MapPin className="h-4 w-4 shrink-0 lg:h-5 lg:w-5" /> Account</span>
                <ChevronRight className="hidden h-4 w-4 lg:block" />
              </button>
              <button
                type="button"
                onClick={openReturnHistory}
                className={`flex h-11 items-center justify-center gap-1.5 rounded-xl px-2 text-xs font-black transition lg:h-12 lg:justify-between lg:px-4 lg:text-sm ${activeSection === 'returns' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-background text-foreground hover:bg-primary/10 hover:text-primary'}`}
              >
                <span className="flex min-w-0 items-center gap-2"><RotateCcw className="h-4 w-4 shrink-0 lg:h-5 lg:w-5" /> <span className="truncate">Returns</span></span>
                <ChevronRight className="hidden h-4 w-4 lg:block" />
              </button>
              <button
                type="button"
                onClick={() => setLogoutOpen(true)}
                className="col-span-2 flex h-11 items-center justify-center gap-2 rounded-xl text-sm font-black text-red-400 transition hover:bg-red-500/10 lg:col-span-1 lg:mt-2 lg:justify-start lg:px-4"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </nav>
          </div>
        </aside>

        <main className="min-w-0">
          {activeSection === 'overview' ? (
            <div className="space-y-4 sm:space-y-6">
              <section className="overflow-hidden rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/15 via-card to-card p-5 shadow-sm sm:p-7">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-primary">Welcome back</p>
                <div className="mt-1 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
                  <div>
                    <h2 className="text-2xl font-black text-foreground sm:text-3xl">{user.name || 'Customer'}</h2>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">Quickly manage purchases, delivery details, saved products, returns, and support.</p>
                  </div>
                  <button type="button" onClick={() => router.push('/products')} className="h-11 w-full rounded-xl bg-primary px-5 text-sm font-black text-white shadow-lg shadow-primary/20 transition hover:bg-primary-dark sm:w-auto">Continue shopping</button>
                </div>
              </section>

              <section>
                <div className="mb-3 sm:mb-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-primary">Your account</p>
                  <h2 className="text-xl font-black text-foreground sm:text-2xl">What would you like to manage?</h2>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  <AccountActionCard icon={Package} title="Your Orders" description="Track packages, view order details, download receipts, or cancel eligible orders." onClick={openOrderHistory} />
                  <AccountActionCard icon={User} title="Profile Information" description="Update your name, phone number, and personal account details." onClick={() => setActiveSection('account')} />
                  <AccountActionCard icon={MapPin} title="Delivery Address" description="Manage the address and landmark used to prefill checkout." onClick={() => setActiveSection('account')} />
                  <AccountActionCard icon={Heart} title="Your Wishlist" description="View products you saved and move them to your shopping cart." onClick={() => router.push('/wishlist')} />
                  <AccountActionCard icon={ShoppingCart} title="Shopping Cart" description="Review quantities, totals, and products waiting for checkout." onClick={() => router.push('/cart')} />
                  <AccountActionCard icon={RotateCcw} title="Returns & Refunds" description="View all return requests, refund records, replacements, and their latest status." onClick={openReturnHistory} />
                  <AccountActionCard icon={CircleHelp} title="Help & Support" description="Get help with an order, delivery, payment, return, or product." onClick={() => router.push('/contact')} />
                </div>
              </section>
            </div>
          ) : activeSection === 'returns' ? (
            <section id="return-history" className="scroll-mt-24 rounded-2xl border border-black/5 bg-card p-3 shadow-sm dark:border-white/10 sm:scroll-mt-28 sm:p-6 xl:p-8">
              <div className="mb-5 border-b border-black/5 pb-5 dark:border-white/10 sm:mb-7">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-primary">Post-purchase support</p>
                <h2 className="text-xl font-black text-foreground sm:text-2xl">Returns & Refunds</h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">All return requests and refund activity across your orders.</p>
              </div>

              {loadingOrders ? (
                <div className="space-y-3">{[1, 2].map((item) => <SkeletonBlock key={item} className="h-48 w-full rounded-2xl" />)}</div>
              ) : ordersWithReturns.length > 0 ? (
                <div className="space-y-3 sm:space-y-5">
                  {ordersWithReturns.map((order: any) => (
                    <article key={order.id} className="overflow-hidden rounded-2xl border border-black/5 bg-background/40 dark:border-white/10">
                      <div className="flex items-start justify-between gap-3 border-b border-black/5 p-3 dark:border-white/10 sm:items-center sm:p-5">
                        <div className="min-w-0">
                          <p className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-500">Order #{order.id.slice(0, 8)}</p>
                          <p className="mt-1 text-xs font-bold text-foreground sm:text-sm">{new Date(order.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                        </div>
                        <span className={`shrink-0 rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-wider sm:text-xs ${getStatusColor(order.status)}`}>{order.status}</span>
                      </div>

                      <div className="space-y-3 p-3 sm:p-5">
                        {order.returns?.map((request: any) => (
                          <div key={request.id} className="rounded-xl border border-primary/15 bg-primary/5 p-3 sm:p-4">
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="break-all text-[10px] font-black uppercase tracking-[0.14em] text-primary">{request.request_number || 'Return request'}</p>
                                <p className="mt-1 text-sm font-black capitalize text-foreground">{String(request.status).replaceAll('_', ' ')}</p>
                              </div>
                              <span className="rounded-full bg-card px-2.5 py-1 text-[9px] font-black uppercase text-primary sm:text-[10px]">{request.preferred_resolution || 'Review'}</span>
                            </div>
                            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Requested {dateTime(request.created_at)}</p>
                            {!!request.items?.length && <p className="mt-1 text-xs font-bold text-foreground">{request.items.length} affected {request.items.length === 1 ? 'item' : 'items'}</p>}
                          </div>
                        ))}

                        {order.refunds?.map((refund: any) => (
                          <div key={refund.id} className="flex flex-col gap-2 rounded-xl border border-amber-500/15 bg-amber-500/5 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
                            <div className="min-w-0">
                              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-amber-500">Refund</p>
                              <p className="text-sm font-black text-foreground">{money(Number(refund.amount_paise || 0) / 100)}</p>
                              <p className="break-all text-xs text-gray-500">{refund.razorpay_refund_id || refund.receipt || 'Provider reference pending'}</p>
                            </div>
                            <span className="self-start rounded-full bg-card px-3 py-1 text-[10px] font-black uppercase text-amber-500 sm:self-center">{refund.status}</span>
                          </div>
                        ))}

                        <div className="grid grid-cols-2 gap-2 pt-1 sm:flex">
                          <button type="button" onClick={() => setSelectedOrder(order)} className="h-11 rounded-xl bg-primary px-3 text-xs font-black text-white transition hover:bg-primary-dark sm:px-5 sm:text-sm">View details</button>
                          <button type="button" onClick={() => downloadReceipt(order)} className="h-11 rounded-xl bg-primary/10 px-3 text-xs font-black text-primary transition hover:bg-primary/20 sm:px-5 sm:text-sm">Receipt</button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl bg-background/50 p-5 text-center">
                  <RotateCcw className="mb-4 h-12 w-12 text-primary/35" />
                  <h3 className="mb-2 text-lg font-black text-foreground">No returns or refunds</h3>
                  <p className="mb-6 max-w-md text-sm text-gray-500 dark:text-gray-400">When you request a return or receive a refund, its status will appear here.</p>
                  <button type="button" onClick={openOrderHistory} className="rounded-xl bg-primary px-6 py-3 text-sm font-black text-white shadow-lg shadow-primary/20 transition hover:bg-primary-dark">View your orders</button>
                </div>
              )}
            </section>
          ) : activeSection === 'account' ? (
            <form onSubmit={saveProfile} className="rounded-2xl border border-black/5 bg-card p-4 shadow-sm dark:border-white/10 sm:p-6 xl:p-8">
              <div className="mb-6 flex items-start gap-3 border-b border-black/5 pb-5 dark:border-white/10">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><User className="h-5 w-5" /></div>
                <div>
                  <h2 className="text-xl font-black text-foreground sm:text-2xl">Profile & delivery address</h2>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">These details are used to prefill checkout.</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <ProfileField label="Full name" value={profileForm.name} onChange={(value) => setProfileForm({ ...profileForm, name: value })} autoComplete="name" />
                <ProfileField label="Phone" value={profileForm.phone} onChange={(value) => setProfileForm({ ...profileForm, phone: value })} type="tel" inputMode="tel" autoComplete="tel" />
                <label className="block text-sm font-black text-foreground/70 sm:col-span-2">
                  Street address
                  <textarea rows={3} value={profileForm.address} onChange={(event) => setProfileForm({ ...profileForm, address: event.target.value })} autoComplete="street-address" className="mt-2 w-full resize-y rounded-xl border border-black/10 bg-background px-4 py-3 text-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 dark:border-white/10" />
                </label>
                <ProfileField label="City" value={profileForm.city} onChange={(value) => setProfileForm({ ...profileForm, city: value })} autoComplete="address-level2" />
                <ProfileField label="State" value={profileForm.state} onChange={(value) => setProfileForm({ ...profileForm, state: value })} autoComplete="address-level1" />
                <ProfileField label="Postal code" value={profileForm.postalCode} onChange={(value) => setProfileForm({ ...profileForm, postalCode: value })} inputMode="numeric" autoComplete="postal-code" />
                <ProfileField label="Country" value={profileForm.country} onChange={(value) => setProfileForm({ ...profileForm, country: value })} autoComplete="country-name" />
                <div className="sm:col-span-2">
                  <ProfileField label="Landmark (optional)" value={profileForm.landmark} onChange={(value) => setProfileForm({ ...profileForm, landmark: value })} />
                </div>
              </div>

              <div className="mt-6 flex justify-end border-t border-black/5 pt-5 dark:border-white/10">
                <button type="submit" disabled={profileSaving} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-black text-white shadow-lg shadow-primary/20 transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
                  <Save className="h-4 w-4" /> {profileSaving ? 'Saving…' : 'Save changes'}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              <section id="order-history" className="scroll-mt-24 rounded-2xl border border-black/5 bg-card p-3 shadow-sm dark:border-white/10 sm:scroll-mt-28 sm:p-6 xl:p-8">
                <div className="mb-4 flex items-end justify-between gap-3 sm:mb-7">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-primary">Purchases</p>
                    <h2 className="text-xl font-black text-foreground sm:text-2xl">Order History</h2>
                  </div>
                  <button type="button" onClick={fetchOrders} disabled={loadingOrders} className="text-xs font-black text-primary hover:underline disabled:opacity-50">Refresh</button>
                </div>

                {loadingOrders ? (
                  <div className="space-y-3 sm:space-y-5">{[1, 2, 3].map((item) => <SkeletonBlock key={item} className="h-44 w-full rounded-2xl" />)}</div>
                ) : orders.length > 0 ? (
                  <div className="space-y-3 sm:space-y-5">
                    {orders.map((order: any) => (
                      <motion.article
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={order.id}
                        className="min-w-0 overflow-hidden rounded-2xl border border-black/5 bg-background/40 transition hover:border-primary/20 hover:shadow-md dark:border-white/10"
                      >
                        <div className="flex items-start justify-between gap-3 border-b border-black/5 p-3 dark:border-white/10 sm:items-center sm:p-5">
                          <div className="min-w-0">
                            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-500">Order #{order.id.slice(0, 8)}</p>
                            <p className="mt-1 text-xs font-bold text-foreground sm:text-sm">{new Date(order.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                          </div>
                          <div className="flex shrink-0 flex-col items-end gap-1.5">
                            <span className={`rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-wider sm:text-xs ${getStatusColor(order.status)}`}>{order.status}</span>
                            <p className="text-sm font-black text-primary sm:text-lg">{money(order.total_price)}</p>
                          </div>
                        </div>

                        <div className="p-3 sm:p-5">
                          <div className="grid gap-2 xl:grid-cols-2">
                            {order.items?.map((item: any) => (
                              <div key={item.id} className="flex min-w-0 items-center gap-3 rounded-xl bg-card p-2.5 sm:p-3">
                                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-black/5 bg-black/5 dark:border-white/10 dark:bg-white/5 sm:h-14 sm:w-14">
                                  <Image src={item.image_url ? (item.image_url.startsWith('http') ? item.image_url : `${BASE_URL}${item.image_url}`) : 'https://images.unsplash.com/photo-1463320726281-696a485928c7?q=80&w=200&auto=format&fit=crop'} alt={item.product_name} width={56} height={56} className="h-full w-full object-cover" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h3 className="line-clamp-1 text-sm font-black text-foreground">{item.product_name}</h3>
                                  <p className="text-xs text-gray-500">Qty {item.quantity} x {money(item.price)}</p>
                                </div>
                                <strong className="shrink-0 text-xs text-foreground sm:text-sm">{money(item.quantity * Number(item.price))}</strong>
                              </div>
                            ))}
                          </div>

                          {!order.shipments?.length && (order.courier_name || order.tracking_number || order.estimated_delivery_date) && (
                            <div className="mt-3 rounded-xl border border-primary/10 bg-primary/5 p-3 text-xs text-foreground sm:text-sm">
                              <p className="font-black text-primary">{order.courier_name || 'Shipment'} · {order.tracking_number || 'Tracking pending'}</p>
                              {order.estimated_delivery_date && <p className="mt-1 text-gray-500">Estimated delivery: {new Date(order.estimated_delivery_date).toLocaleDateString()}</p>}
                            </div>
                          )}
                          <ShipmentTracking shipments={order.shipments} compact />
                          {!!order.returns?.length && <div className="mt-3 rounded-xl border border-primary/10 bg-primary/5 p-3 text-xs font-bold capitalize text-primary">{order.returns.length} return request{order.returns.length === 1 ? '' : 's'} · Latest: {String(order.returns[0].status).replaceAll('_', ' ')}</div>}

                          <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                            <button onClick={() => setSelectedOrder(order)} className="h-11 rounded-xl bg-primary px-3 text-xs font-black text-white transition hover:bg-primary-dark sm:px-5 sm:text-sm">View details</button>
                            <button onClick={() => downloadReceipt(order)} className="h-11 rounded-xl bg-primary/10 px-3 text-xs font-black text-primary transition hover:bg-primary/20 sm:px-5 sm:text-sm">Receipt</button>
                            {['pending', 'processing'].includes(order.status) && (
                              <button onClick={() => setCancelOrder(order)} className="col-span-2 h-11 rounded-xl bg-red-500/10 px-3 text-xs font-black text-red-400 transition hover:bg-red-500/20 sm:px-5 sm:text-sm">Cancel order</button>
                            )}
                          </div>
                        </div>
                      </motion.article>
                    ))}
                  </div>
                ) : (
                  <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl bg-background/50 p-5 text-center">
                    <Package className="mb-4 h-12 w-12 text-primary/35" />
                    <h3 className="mb-2 text-lg font-black text-foreground">No orders yet</h3>
                    <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">Your purchases and delivery updates will appear here.</p>
                    <button onClick={() => router.push('/products')} className="rounded-xl bg-primary px-6 py-3 text-sm font-black text-white shadow-lg shadow-primary/20 transition hover:bg-primary-dark">Start Shopping</button>
                  </div>
                )}
              </section>
            </div>
          )}
        </main>
      </div>
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onCancel={(order) => setCancelOrder(order)}
          onChanged={fetchOrders}
        />
      )}
      <ConfirmationModal
        isOpen={!!cancelOrder}
        onClose={() => setCancelOrder(null)}
        onConfirm={handleCancelOrder}
        title="Cancel order?"
        message={cancelOrder ? `Cancel order #${cancelOrder.id.slice(0, 8)}? Paid orders may need admin refund processing.` : 'Cancel this order?'}
        confirmText="Cancel order"
        variant="danger"
      />
      <ConfirmationModal
        isOpen={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={logout}
        title="Logout?"
        message="You will need to sign in again before checking out or viewing your orders."
        confirmText="Logout"
        variant="warning"
      />
    </div>
  );
}
