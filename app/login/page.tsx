'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { endpoints } from '../../services/apiConfig';
import toast from 'react-hot-toast';
import { Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.post(endpoints.auth.login, { email, password });
      if (res.data.success) {
        login(res.data.token, res.data.user);
        router.push('/');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 bg-premium-gradient">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full"
      >
        <div className="glass rounded-xl p-10 shadow-premium border border-black/5 dark:border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/20 rounded-full blur-3xl -z-10" />
          
          <div className="text-center mb-10">
            <Link href="/" className="inline-flex items-center space-x-2 bg-primary/15 text-primary px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-primary/20">
              <Leaf className="w-4 h-4" />
              <span>Green Store</span>
            </Link>
            <h2 className="text-4xl font-black text-foreground tracking-tight mb-3">Welcome Back.</h2>
            <p className="text-gray-700 dark:text-gray-400 font-medium">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-primary hover:underline font-bold transition-all">
                Sign up for free
              </Link>
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-black text-gray-700 dark:text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 px-6 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-foreground placeholder:text-gray-400 dark:placeholder:text-gray-600"
                  placeholder="name@example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-700 dark:text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 px-6 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-foreground placeholder:text-gray-400 dark:placeholder:text-gray-600"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-5 w-5 text-primary border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 rounded-lg focus:ring-primary/20 transition-all cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-3 block text-sm text-gray-700 dark:text-gray-400 font-bold cursor-pointer">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link href="/forgot-password" className="text-primary-dark dark:text-primary hover:text-primary font-black underline-offset-4 hover:underline transition-colors">
                  Forgot?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center py-5 px-4 border border-transparent text-sm font-black rounded-lg text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all shadow-xl hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Sign In'
              )}
            </button>

          </form>
        </div>
      </motion.div>
    </div>


  );
}
