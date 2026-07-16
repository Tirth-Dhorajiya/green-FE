'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import api, { BASE_URL } from '../../services/api';
import { endpoints } from '../../services/apiConfig';
import { Package, User, Clock, ChevronRight, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, loading, logout, checkAuth } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    address: '',
    city: '',
    postalCode: '',
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
        address: user.address?.address || '',
        city: user.address?.city || '',
        postalCode: user.address?.postalCode || '',
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
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
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
          address: profileForm.address,
          city: profileForm.city,
          postalCode: profileForm.postalCode,
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
              <button className="w-full flex items-center justify-between px-4 py-3 bg-primary/10 text-primary rounded-xl font-medium">
                <span className="flex items-center"><Package className="w-5 h-5 mr-3" /> Orders</span>
                <ChevronRight className="w-5 h-5" />
              </button>
              <button 
                onClick={logout}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded-xl font-medium transition"
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
                City
                <input value={profileForm.city} onChange={(event) => setProfileForm({ ...profileForm, city: event.target.value })} className="mt-2 w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 outline-none" />
              </label>
              <label className="block text-sm font-bold text-foreground/70 md:col-span-2">
                Address
                <input value={profileForm.address} onChange={(event) => setProfileForm({ ...profileForm, address: event.target.value })} className="mt-2 w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 outline-none" />
              </label>
              <label className="block text-sm font-bold text-foreground/70">
                Postal Code
                <input value={profileForm.postalCode} onChange={(event) => setProfileForm({ ...profileForm, postalCode: event.target.value })} className="mt-2 w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 outline-none" />
              </label>
            </div>
            <button type="submit" disabled={profileSaving} className="mt-6 inline-flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-xl font-black hover:bg-primary-dark transition disabled:opacity-60">
              <Save className="w-4 h-4" /> {profileSaving ? 'Saving...' : 'Save Profile'}
            </button>
          </form>

          <div className="bg-card rounded-lg p-6 md:p-8 shadow-sm border border-black/5 dark:border-white/10">
            <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center">
              <Clock className="w-6 h-6 mr-3 text-primary" /> Order History
            </h2>

            {loadingOrders ? (
               <div className="flex justify-center py-12">
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
                        <p className="font-extrabold text-lg text-foreground">${parseFloat(order.total_price).toFixed(2)}</p>
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
                            <p className="text-sm text-gray-500 dark:text-gray-400">Qty: {item.quantity} × ${parseFloat(item.price).toFixed(2)}</p>
                          </div>
                          <div className="font-bold text-foreground sm:text-right">
                            ${(item.quantity * parseFloat(item.price)).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-200 dark:text-gray-700 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-foreground mb-2">No orders yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">When you place orders, they will appear here.</p>
                <button onClick={() => router.push('/products')} className="bg-primary text-white px-6 py-2.5 rounded-xl font-medium hover:bg-primary-dark transition shadow-lg shadow-primary/20">
                  Start Shopping
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
