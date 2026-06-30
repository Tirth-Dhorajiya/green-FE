'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Heart, User, Menu, X, LogOut, LayoutDashboard, Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart, cartCount } = useCart();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
  }, [pathname]);

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 transition-all duration-300">
      <div className="glass rounded-2xl shadow-premium px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-black text-primary tracking-tighter flex items-center group">
              <span className="bg-primary text-white p-1 rounded-lg mr-2 group-hover:rotate-12 transition-transform duration-300">
                <Leaf className="w-5 h-5" />
              </span>
              GREEN<span className="text-primary-light">STORE</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              href="/"
              className={`text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-300 ${isActive('/') ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-foreground/70 dark:text-gray-300 hover:text-primary dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'}`}
            >
              Home
            </Link>
            <Link
              href="/products"
              className={`text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-300 ${isActive('/products') ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-foreground/70 dark:text-gray-300 hover:text-primary dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'}`}
            >
              Shop
            </Link>
          </div>

          {/* Icons */}
          <div className="hidden md:flex items-center space-x-2">
            <ThemeToggle />
            <Link href="/wishlist" className={`p-2 rounded-xl transition-all duration-300 ${isActive('/wishlist') ? 'bg-primary/20 text-primary' : 'text-foreground/60 dark:text-gray-400 hover:text-primary dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'}`}>
              <Heart className="w-5 h-5" />
            </Link>
            <Link href="/cart" className={`p-2 rounded-xl transition-all duration-300 relative ${isActive('/cart') ? 'bg-primary/20 text-primary' : 'text-foreground/60 dark:text-gray-400 hover:text-primary dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'}`}>
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-primary text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            <div className="h-6 w-[1px] bg-black/10 dark:bg-white/10 mx-2" />

            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={`flex items-center space-x-2 p-1.5 rounded-xl transition-all duration-300 focus:outline-none ${isProfileOpen ? 'bg-primary/10' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isActive('/profile') || isActive('/admin') ? 'bg-primary text-white' : 'bg-primary/20 text-primary'}`}>
                    <User className="w-5 h-5" />
                  </div>
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-56 glass rounded-2xl shadow-premium py-2 border border-black/5 dark:border-white/10 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-black/5 dark:border-white/5">
                        <p className="text-sm font-bold text-foreground truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                      </div>

                      <div className="p-1">
                        {user.role === 'admin' && (
                          <Link href="/admin" className="flex items-center px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors">
                            <LayoutDashboard className="w-4 h-4 mr-3 text-primary" /> Admin Dashboard
                          </Link>
                        )}

                        <Link href="/profile" className="flex items-center px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors">
                          <User className="w-4 h-4 mr-3 text-primary" /> Profile & Orders
                        </Link>

                        <button
                          onClick={() => { logout(); setIsProfileOpen(false); }}
                          className="flex items-center w-full px-3 py-2 text-sm text-red-400 hover:bg-red-400/10 rounded-lg transition-colors mt-1"
                        >
                          <LogOut className="w-4 h-4 mr-3" /> Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link href="/login" className="bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 shadow-sm hover:shadow-md">
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-foreground/70 dark:text-gray-300 hover:text-primary dark:hover:text-white transition-colors focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0, y: -20 }}
            animate={{ height: 'auto', opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -20 }}
            className="md:hidden overflow-hidden mt-2"
          >
            <div className="glass rounded-2xl shadow-premium p-4 space-y-2">
              <Link
                href="/"
                className={`block px-4 py-3 rounded-xl text-base font-bold transition-all ${isActive('/') ? 'bg-primary text-white shadow-lg' : 'text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'}`}
              >
                Home
              </Link>
              <Link
                href="/products"
                className={`block px-4 py-3 rounded-xl text-base font-bold transition-all ${pathname.startsWith('/products') ? 'bg-primary text-white shadow-lg' : 'text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'}`}
              >
                Shop
              </Link>
              <Link
                href="/cart"
                className={`block px-4 py-3 rounded-xl text-base font-bold transition-all ${isActive('/cart') ? 'bg-primary text-white shadow-lg' : 'text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'}`}
              >
                Cart ({cartCount})
              </Link>
              {user ? (
                <>
                  <div className="h-[1px] bg-white/5 my-2" />
                  <Link href="/profile" className="block px-4 py-3 rounded-xl text-base font-bold text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all">Profile</Link>
                  {user.role === 'admin' && (
                    <Link href="/admin" className="block px-4 py-3 rounded-xl text-base font-bold text-primary hover:bg-white/5 transition-all">Admin Dashboard</Link>
                  )}
                  <button onClick={logout} className="block w-full text-left px-4 py-3 rounded-xl text-base font-bold text-red-400 hover:bg-red-400/10 transition-all">Logout</button>
                </>
              ) : (
                <Link href="/login" className="block px-4 py-3 rounded-xl text-base font-bold bg-primary text-white text-center shadow-sm">Login</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>


  );
}
