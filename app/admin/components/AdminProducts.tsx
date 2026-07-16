'use client';

import React from 'react';
import { BASE_URL } from '../../../services/api';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface AdminProductsProps {
  products: any[];
  onAdd: () => void;
  onEdit: (product: any) => void;
  onDelete: (id: string) => void;
}

export default function AdminProducts({ products, onAdd, onEdit, onDelete }: AdminProductsProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-black text-foreground tracking-tight">Product Inventory</h1>
        <button 
          onClick={onAdd}
          className="bg-primary text-white px-8 py-4 rounded-lg font-black text-lg hover:bg-primary-dark flex items-center transition shadow-2xl shadow-primary/20 hover:scale-105"
        >
          <Plus className="w-6 h-6 mr-2" /> Add Specimen
        </button>
      </div>
      
      <div className="bg-card rounded-xl shadow-sm border border-black/5 dark:border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead className="bg-black/5 dark:bg-white/5 border-b border-black/5 dark:border-white/5">
              <tr>
                <th className="px-8 py-6 text-left text-xs font-black text-gray-600 dark:text-gray-400 uppercase tracking-widest">Product Info</th>
                <th className="px-8 py-6 text-left text-xs font-black text-gray-600 dark:text-gray-400 uppercase tracking-widest">Category</th>
                <th className="px-8 py-6 text-left text-xs font-black text-gray-600 dark:text-gray-400 uppercase tracking-widest">Valuation</th>
                <th className="px-8 py-6 text-left text-xs font-black text-gray-600 dark:text-gray-400 uppercase tracking-widest">Stock</th>
                <th className="px-8 py-6 text-right text-xs font-black text-gray-600 dark:text-gray-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              {products.map((product) => {
                const finalImageUrl = product.image_url 
                  ? (product.image_url.startsWith('http') ? product.image_url : `${BASE_URL}${product.image_url}`)
                  : 'https://images.unsplash.com/photo-1463320726281-696a485928c7?q=80&w=100&auto=format&fit=crop';
                
                return (
                  <tr key={product.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition duration-300">
                    <td className="px-8 py-6">
                      <div className="flex items-center">
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-black/5 dark:bg-white/5 mr-4 border border-black/5">
                          <img src={finalImageUrl} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="font-bold text-lg text-foreground tracking-tight">{product.name}</div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest bg-primary/10 text-primary">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-8 py-6 font-bold text-lg text-foreground">${parseFloat(product.price).toFixed(2)}</td>
                    <td className="px-8 py-6">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${product.stock > 10 ? 'bg-green-500' : product.stock > 0 ? 'bg-orange-500' : 'bg-red-500'} animate-pulse`} />
                        <span className="font-bold text-foreground">{product.stock} Units</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-3">
                        <button onClick={() => onEdit(product)} className="p-3 bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white rounded-lg transition duration-300"><Edit className="w-5 h-5" /></button>
                        <button onClick={() => onDelete(product.id)} className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition duration-300"><Trash2 className="w-5 h-5" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
