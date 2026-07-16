'use client';

import React from 'react';
import { DollarSign, ShoppingBag, Package, Users } from 'lucide-react';

interface AdminStatsProps {
  stats: any;
}

export default function AdminStats({ stats }: AdminStatsProps) {
  if (!stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-40 bg-black/5 dark:bg-white/5 animate-pulse rounded-xl" />)}
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-4xl font-black text-foreground mb-12 tracking-tight">Business Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="bg-card p-8 rounded-xl shadow-sm border border-black/5 dark:border-white/5 hover:shadow-premium-hover transition-all">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest text-xs">Revenue</h3>
            <div className="p-3 bg-green-500/10 rounded-lg"><DollarSign className="w-6 h-6 text-green-500" /></div>
          </div>
          <p className="text-4xl font-black text-foreground tracking-tighter">${stats.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-card p-8 rounded-xl shadow-sm border border-black/5 dark:border-white/5 hover:shadow-premium-hover transition-all">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest text-xs">Active Orders</h3>
            <div className="p-3 bg-blue-500/10 rounded-lg"><ShoppingBag className="w-6 h-6 text-blue-500" /></div>
          </div>
          <p className="text-4xl font-black text-foreground tracking-tighter">{stats.totalOrders}</p>
        </div>
        <div className="bg-card p-8 rounded-xl shadow-sm border border-black/5 dark:border-white/5 hover:shadow-premium-hover transition-all">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest text-xs">Total Items</h3>
            <div className="p-3 bg-orange-500/10 rounded-lg"><Package className="w-6 h-6 text-orange-500" /></div>
          </div>
          <p className="text-4xl font-black text-foreground tracking-tighter">{stats.totalProducts}</p>
        </div>
        <div className="bg-card p-8 rounded-xl shadow-sm border border-black/5 dark:border-white/5 hover:shadow-premium-hover transition-all">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest text-xs">Customers</h3>
            <div className="p-3 bg-purple-500/10 rounded-lg"><Users className="w-6 h-6 text-purple-500" /></div>
          </div>
          <p className="text-4xl font-black text-foreground tracking-tighter">{stats.totalUsers}</p>
        </div>
      </div>
    </div>
  );
}
