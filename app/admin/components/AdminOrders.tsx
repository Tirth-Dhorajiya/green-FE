'use client';

import React from 'react';

interface AdminOrdersProps {
  orders: any[];
  onUpdateStatus: (id: string, status: string) => void;
}

export default function AdminOrders({ orders, onUpdateStatus }: AdminOrdersProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-4xl font-black text-foreground mb-12 tracking-tight">Order Fulfilment</h1>
      <div className="bg-card rounded-[2.5rem] shadow-sm border border-black/5 dark:border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead className="bg-black/5 dark:bg-white/5 border-b border-black/5 dark:border-white/5">
              <tr>
                <th className="px-8 py-6 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Order Ref</th>
                <th className="px-8 py-6 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Customer</th>
                <th className="px-8 py-6 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Timestamp</th>
                <th className="px-8 py-6 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Revenue</th>
                <th className="px-8 py-6 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition duration-300">
                  <td className="px-8 py-6 font-black text-foreground text-xs uppercase opacity-50">{order.id.slice(0, 8)}...</td>
                  <td className="px-8 py-6">
                     <div className="flex flex-col">
                       <span className="font-bold text-foreground">{order.user_name}</span>
                       <span className="text-xs text-gray-400">{order.user_email}</span>
                     </div>
                  </td>
                  <td className="px-8 py-6 text-gray-500 font-medium">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="px-8 py-6 font-black text-foreground">${parseFloat(order.total_price).toFixed(2)}</td>
                  <td className="px-8 py-6">
                    <select 
                      value={order.status}
                      onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                      className={`text-xs font-black uppercase tracking-widest rounded-xl border-none px-4 py-2 outline-none appearance-none cursor-pointer transition ${
                        order.status === 'delivered' ? 'bg-green-500/10 text-green-500' :
                        order.status === 'cancelled' ? 'bg-red-500/10 text-red-500' :
                        'bg-orange-500/10 text-orange-500'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
