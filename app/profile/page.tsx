'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import api, { BASE_URL } from '../../services/api';
import { endpoints } from '../../services/apiConfig';
import { Package, User, Clock, ChevronRight, Save, X, Truck, CreditCard, MapPin, Download, Ban } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { ProfileSkeleton, SkeletonBlock } from '../../components/Skeletons';
import ConfirmationModal from '../../components/ConfirmationModal';

const orderSteps = ['pending', 'processing', 'shipped', 'delivered'];
const money = (value: string | number | undefined) => `₹${Number(value || 0).toFixed(2)}`;
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

function OrderDetailsModal({ order, onClose, onCancel }: { order: any; onClose: () => void; onCancel: (order: any) => void }) {
  const address = order.shipping_address || {};
  const activeStep = order.status === 'cancelled' ? -1 : orderSteps.indexOf(order.status);
  const canCancel = ['pending', 'processing'].includes(order.status);

  return (
    <div className="fixed inset-0 z-[120] bg-black/60 p-0 sm:p-4 flex items-end sm:items-center justify-center" role="dialog" aria-modal="true">
      <div className="bg-background w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl border border-black/10 dark:border-white/10 shadow-2xl">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-black/5 dark:border-white/10 bg-background/95 backdrop-blur p-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-primary">Order details</p>
            <h2 className="text-2xl font-black text-foreground">#{order.id.slice(0, 8)}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{dateTime(order.created_at)}</p>
          </div>
          <button onClick={onClose} className="cursor-pointer rounded-full bg-black/5 dark:bg-white/10 p-3 text-foreground hover:bg-primary hover:text-white transition" aria-label="Close order details">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="rounded-2xl bg-card border border-black/5 dark:border-white/10 p-4">
              <p className="text-xs font-black uppercase text-gray-500">Total</p>
              <strong className="text-2xl text-primary">{money(order.total_price)}</strong>
            </div>
            <div className="rounded-2xl bg-card border border-black/5 dark:border-white/10 p-4">
              <p className="text-xs font-black uppercase text-gray-500">Order</p>
              <strong className="capitalize text-foreground">{order.status}</strong>
            </div>
            <div className="rounded-2xl bg-card border border-black/5 dark:border-white/10 p-4">
              <p className="text-xs font-black uppercase text-gray-500">Payment</p>
              <strong className="capitalize text-foreground">{order.payment_status}</strong>
            </div>
            <div className="rounded-2xl bg-card border border-black/5 dark:border-white/10 p-4">
              <p className="text-xs font-black uppercase text-gray-500">Coupon</p>
              <strong className="text-foreground">{order.coupon_code || 'None'}</strong>
            </div>
          </div>

          <section className="rounded-2xl bg-card border border-black/5 dark:border-white/10 p-5">
            <h3 className="font-black text-foreground mb-5 flex items-center gap-2"><Truck className="w-5 h-5 text-primary" /> Tracking</h3>
            {order.status === 'cancelled' ? (
              <div className="rounded-xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-4 font-bold">This order is cancelled.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                {orderSteps.map((step, index) => (
                  <div key={step} className={`rounded-xl border p-4 ${index <= activeStep ? 'border-primary bg-primary/10 text-primary' : 'border-black/5 dark:border-white/10 text-gray-500'}`}>
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
            <section className="rounded-2xl bg-card border border-black/5 dark:border-white/10 p-5">
              <h3 className="font-black text-foreground mb-4">Items</h3>
              <div className="space-y-4">
                {order.items?.map((item: any) => (
                  <div key={item.id} className="flex gap-4">
                    <Image
                      src={item.image_url ? (item.image_url.startsWith('http') ? item.image_url : `${BASE_URL}${item.image_url}`) : 'https://images.unsplash.com/photo-1463320726281-696a485928c7?q=80&w=200&auto=format&fit=crop'}
                      alt={item.product_name}
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-foreground">{item.product_name}</h4>
                      <p className="text-sm text-gray-500">Qty: {item.quantity} x {money(item.price)}</p>
                    </div>
                    <strong>{money(item.quantity * Number(item.price))}</strong>
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

export default function Profile() {
  const { user, loading, logout, checkAuth } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
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

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get(endpoints.orders.mine);
        if (res.data.success) {
          setOrders(res.data.orders);
        }
      } catch (error) {
        console.error('Failed to fetch orders', error);
      } finally {
        setLoadingOrders(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

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
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Unable to cancel order');
    } finally {
      setCancelOrder(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Profile Sidebar */}
        <div className="w-full md:w-80 shrink-0">
          <div className="bg-card rounded-lg p-8 shadow-sm border border-black/5 dark:border-white/10 text-center sticky top-24">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-1">{user.name}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{user.email}</p>
            
            <div className="space-y-3">
              <button className="w-full cursor-pointer flex items-center justify-between px-4 py-3 bg-primary/10 text-primary rounded-xl font-medium">
                <span className="flex items-center"><Package className="w-5 h-5 mr-3" /> Orders</span>
                <ChevronRight className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setLogoutOpen(true)}
                className="w-full cursor-pointer flex items-center justify-between px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded-xl font-medium transition"
              >
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <form onSubmit={saveProfile} className="bg-card rounded-lg p-6 md:p-8 shadow-sm border border-black/5 dark:border-white/10 mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
              <User className="w-6 h-6 mr-3 text-primary" /> Profile & Address
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <label className="block text-sm font-bold text-foreground/70">
                Full Name
                <input value={profileForm.name} onChange={(event) => setProfileForm({ ...profileForm, name: event.target.value })} className="mt-2 w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 outline-none" />
              </label>
              <label className="block text-sm font-bold text-foreground/70">
                Phone
                <input value={profileForm.phone} onChange={(event) => setProfileForm({ ...profileForm, phone: event.target.value })} className="mt-2 w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 outline-none" />
              </label>
              <label className="block text-sm font-bold text-foreground/70">
                City
                <input value={profileForm.city} onChange={(event) => setProfileForm({ ...profileForm, city: event.target.value })} className="mt-2 w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 outline-none" />
              </label>
              <label className="block text-sm font-bold text-foreground/70">
                State
                <input value={profileForm.state} onChange={(event) => setProfileForm({ ...profileForm, state: event.target.value })} className="mt-2 w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 outline-none" />
              </label>
              <label className="block text-sm font-bold text-foreground/70 md:col-span-2">
                Address
                <input value={profileForm.address} onChange={(event) => setProfileForm({ ...profileForm, address: event.target.value })} className="mt-2 w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 outline-none" />
              </label>
              <label className="block text-sm font-bold text-foreground/70">
                Postal Code
                <input value={profileForm.postalCode} onChange={(event) => setProfileForm({ ...profileForm, postalCode: event.target.value })} className="mt-2 w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 outline-none" />
              </label>
              <label className="block text-sm font-bold text-foreground/70">
                Country
                <input value={profileForm.country} onChange={(event) => setProfileForm({ ...profileForm, country: event.target.value })} className="mt-2 w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 outline-none" />
              </label>
              <label className="block text-sm font-bold text-foreground/70 md:col-span-2">
                Landmark
                <input value={profileForm.landmark} onChange={(event) => setProfileForm({ ...profileForm, landmark: event.target.value })} className="mt-2 w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 outline-none" />
              </label>
            </div>
            <button type="submit" disabled={profileSaving} className="mt-6 inline-flex cursor-pointer items-center gap-2 bg-primary text-white px-5 py-3 rounded-xl font-black hover:bg-primary-dark transition disabled:cursor-not-allowed disabled:opacity-60">
              <Save className="w-4 h-4" /> {profileSaving ? 'Saving...' : 'Save Profile'}
            </button>
          </form>

          <div className="bg-card rounded-lg p-6 md:p-8 shadow-sm border border-black/5 dark:border-white/10">
            <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center">
              <Clock className="w-6 h-6 mr-3 text-primary" /> Order History
            </h2>

            {loadingOrders ? (
               <div className="space-y-5">
                 {[1, 2, 3].map((item) => <SkeletonBlock key={item} className="h-40 w-full" />)}
               </div>
            ) : orders.length > 0 ? (
              <div className="space-y-6">
                {orders.map((order: any) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={order.id} 
                    className="border border-black/5 dark:border-white/10 rounded-lg p-6 hover:shadow-md transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4 pb-6 border-b border-black/5 dark:border-white/10">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider font-bold">Ref: {order.id.slice(0, 8)}</p>
                        <p className="font-semibold text-foreground">{new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                      <div className="flex flex-col sm:items-end gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                        <p className="font-extrabold text-lg text-foreground">₹{parseFloat(order.total_price).toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {order.items?.map((item: any) => (
                        <div key={item.id} className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="w-16 h-16 bg-black/5 dark:bg-white/5 rounded-lg overflow-hidden shrink-0 border border-black/5 dark:border-white/10">
                            <Image
                              src={item.image_url ? (item.image_url.startsWith('http') ? item.image_url : `${BASE_URL}${item.image_url}`) : 'https://images.unsplash.com/photo-1463320726281-696a485928c7?q=80&w=200&auto=format&fit=crop'}
                              alt={item.product_name}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 w-full">
                            <h4 className="font-semibold text-foreground">{item.product_name}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Qty: {item.quantity} × ₹{parseFloat(item.price).toFixed(2)}</p>
                          </div>
                          <div className="font-bold text-foreground sm:text-right">
                            ₹{(item.quantity * parseFloat(item.price)).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                    {!order.shipments?.length && (order.courier_name || order.tracking_number || order.estimated_delivery_date) && (
                      <div className="mt-5 rounded-xl bg-primary/5 border border-primary/10 p-4 text-sm text-foreground">
                        <p className="font-black mb-1">Tracking</p>
                        <p>Courier: {order.courier_name || '-'}</p>
                        <p>Tracking number: {order.tracking_number || '-'}</p>
                        <p>Estimated delivery: {order.estimated_delivery_date ? new Date(order.estimated_delivery_date).toLocaleDateString() : '-'}</p>
                      </div>
                    )}
                    <ShipmentTracking shipments={order.shipments} compact />
                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                      <button onClick={() => setSelectedOrder(order)} className="cursor-pointer rounded-xl bg-primary text-white px-5 py-3 font-black hover:bg-primary-dark transition">
                        View Details
                      </button>
                      <button onClick={() => downloadReceipt(order)} className="cursor-pointer rounded-xl bg-primary/10 text-primary px-5 py-3 font-black hover:bg-primary/20 transition">
                        Download Receipt
                      </button>
                      {['pending', 'processing'].includes(order.status) && (
                        <button onClick={() => setCancelOrder(order)} className="cursor-pointer rounded-xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-5 py-3 font-black hover:bg-red-100 dark:hover:bg-red-900/30 transition">
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-200 dark:text-gray-700 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-foreground mb-2">No orders yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">When you place orders, they will appear here.</p>
                <button onClick={() => router.push('/products')} className="cursor-pointer bg-primary text-white px-6 py-2.5 rounded-xl font-medium hover:bg-primary-dark transition shadow-lg shadow-primary/20">
                  Start Shopping
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onCancel={(order) => setCancelOrder(order)}
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
