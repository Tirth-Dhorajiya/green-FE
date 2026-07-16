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

type Step = 'email' | 'otp' | 'password';

export default function Register() {
  const [step, setStep] = useState<Step>('email');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [verificationToken, setVerificationToken] = useState('');
  const [devOtp, setDevOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const sendOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error('Name and email are required');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.post(endpoints.auth.sendOtp, { email, purpose: 'register' });
      setDevOtp(res.data.devOtp || '');
      setStep('otp');
      toast.success('OTP sent to your email');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Unable to send OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifyOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setIsSubmitting(true);
      const res = await api.post(endpoints.auth.verifyOtp, { email, purpose: 'register', otp });
      setVerificationToken(res.data.token);
      setStep('password');
      toast.success('Email verified');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'OTP verification failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const createAccount = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.post(endpoints.auth.register, {
        name,
        email,
        password,
        emailVerificationToken: verificationToken,
      });
      if (res.data.success) {
        login(res.data.token, res.data.user);
        router.push('/');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background transition-colors">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full space-y-8 bg-card p-10 rounded-xl shadow-xl border border-black/5 dark:border-white/10"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Leaf className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-extrabold text-foreground mb-2">Create an account</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-primary hover:text-primary-dark transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        {step === 'email' && (
          <form className="space-y-5" onSubmit={sendOtp}>
            <label className="block text-sm font-medium text-foreground/70">
              Full Name
              <input value={name} onChange={(e) => setName(e.target.value)} className="mt-2 block w-full px-4 py-3 border border-black/10 dark:border-white/10 text-foreground bg-black/5 dark:bg-white/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition" placeholder="John Doe" />
            </label>
            <label className="block text-sm font-medium text-foreground/70">
              Email address
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 block w-full px-4 py-3 border border-black/10 dark:border-white/10 text-foreground bg-black/5 dark:bg-white/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition" placeholder="you@example.com" />
            </label>
            <button type="submit" disabled={isSubmitting} className="w-full py-3.5 px-4 text-sm font-black rounded-lg text-white bg-primary hover:bg-primary-dark transition shadow-lg shadow-primary/20 disabled:opacity-50">
              {isSubmitting ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        )}

        {step === 'otp' && (
          <form className="space-y-5" onSubmit={verifyOtp}>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Enter the 6-digit OTP sent to <span className="font-bold text-foreground">{email}</span>.
              {devOtp && <p className="mt-2 text-primary font-bold">Development OTP: {devOtp}</p>}
            </div>
            <input value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} className="block w-full px-4 py-3 border border-black/10 dark:border-white/10 text-center text-2xl tracking-[0.4em] font-black text-foreground bg-black/5 dark:bg-white/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition" placeholder="000000" />
            <button type="submit" disabled={isSubmitting || otp.length !== 6} className="w-full py-3.5 px-4 text-sm font-black rounded-lg text-white bg-primary hover:bg-primary-dark transition shadow-lg shadow-primary/20 disabled:opacity-50">
              {isSubmitting ? 'Verifying...' : 'Verify Email'}
            </button>
            <button type="button" onClick={() => setStep('email')} className="w-full text-sm font-bold text-gray-500 hover:text-primary">
              Change email
            </button>
          </form>
        )}

        {step === 'password' && (
          <form className="space-y-5" onSubmit={createAccount}>
            <label className="block text-sm font-medium text-foreground/70">
              Create Password
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 block w-full px-4 py-3 border border-black/10 dark:border-white/10 text-foreground bg-black/5 dark:bg-white/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition" placeholder="Minimum 6 characters" />
            </label>
            <button type="submit" disabled={isSubmitting} className="w-full py-3.5 px-4 text-sm font-black rounded-lg text-white bg-primary hover:bg-primary-dark transition shadow-lg shadow-primary/20 disabled:opacity-50">
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
