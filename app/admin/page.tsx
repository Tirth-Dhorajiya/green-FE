'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '../../services/api';
import { LayoutDashboard, Package, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';

// Modular Components
import AdminStats from './components/AdminStats';
import AdminProducts from './components/AdminProducts';
import AdminOrders from './components/AdminOrders';
import ProductModal from '../../components/ProductModal';
import ConfirmationModal from '../../components/ConfirmationModal';

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Data states
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  
  // Modal states
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  
  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'admin') {
        toast.error('Access denied');
        router.push('/');
      } else {
        fetchStats();
      }
    }
  }, [user, loading, router]);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/stats');
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch stats', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products?limit=100');
      if (res.data.success) setProducts(res.data.products);
    } catch (error) {
      toast.error('Failed to load products');
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await api.get('/admin/orders?limit=100');
      if (res.data.success) setOrders(res.data.orders);
    } catch (error) {
      toast.error('Failed to load orders');
    }
  };

  useEffect(() => {
    if (activeTab === 'products') fetchProducts();
    if (activeTab === 'orders') fetchOrders();
  }, [activeTab]);

  const handleDeleteClick = (id: string) => {
    setProductToDelete(id);
    setIsConfirmModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await api.delete(`/products/${productToDelete}`);
      toast.success('Product removed from inventory');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const handleEditClick = (product: any) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleAddClick = () => {
    setSelectedProduct(null);
    setIsProductModalOpen(true);
  };

  const handleUpdateOrderStatus = async (id: string, status: string) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (loading || !user || user.role !== 'admin') {
    return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-160px)] bg-background transition-colors duration-300">
      {/* Admin Sidebar */}
      <div className="w-full md:w-64 bg-sidebar border-r border-black/5 dark:border-white/10 shrink-0">
        <div className="p-8 border-b border-black/5 dark:border-white/10">
          <h2 className="text-2xl font-black text-foreground flex items-center tracking-tighter">
            <LayoutDashboard className="w-6 h-6 mr-2 text-primary" /> PANEL
          </h2>
        </div>
        <nav className="p-6 space-y-3">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center px-6 py-4 rounded-2xl font-bold transition-all duration-300 ${activeTab === 'dashboard' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-500 hover:bg-black/5 dark:hover:bg-white/5'}`}
          >
            <LayoutDashboard className="w-5 h-5 mr-3" /> Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center px-6 py-4 rounded-2xl font-bold transition-all duration-300 ${activeTab === 'products' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-500 hover:bg-black/5 dark:hover:bg-white/5'}`}
          >
            <Package className="w-5 h-5 mr-3" /> Inventory
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center px-6 py-4 rounded-2xl font-bold transition-all duration-300 ${activeTab === 'orders' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-500 hover:bg-black/5 dark:hover:bg-white/5'}`}
          >
            <ShoppingBag className="w-5 h-5 mr-3" /> Orders
          </button>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8 lg:p-12 overflow-y-auto">
        {activeTab === 'dashboard' && <AdminStats stats={stats} />}
        
        {activeTab === 'products' && (
          <AdminProducts 
            products={products} 
            onAdd={handleAddClick} 
            onEdit={handleEditClick} 
            onDelete={handleDeleteClick} 
          />
        )}

        {activeTab === 'orders' && (
          <AdminOrders 
            orders={orders} 
            onUpdateStatus={handleUpdateOrderStatus} 
          />
        )}

        {/* Global Modals */}
        <ProductModal 
          isOpen={isProductModalOpen} 
          onClose={() => setIsProductModalOpen(false)} 
          onSuccess={fetchProducts}
          product={selectedProduct}
        />

        <ConfirmationModal 
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={confirmDelete}
          title="Remove Specimen?"
          message="This action will permanently delete this product from your inventory. This cannot be undone."
          confirmText="Delete Product"
          variant="danger"
        />
      </div>
    </div>
  );
}
