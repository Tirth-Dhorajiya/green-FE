'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '../../services/api';
import { endpoints } from '../../services/apiConfig';
import toast from 'react-hot-toast';
import { Leaf } from 'lucide-react';

type Step = 'email' | 'otp' | 'password';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [devOtp, setDevOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const sendOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setIsSubmitting(true);
      const res = await api.post(endpoints.auth.sendOtp, { email, purpose: 'password_reset' });
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
      const res = await api.post(endpoints.auth.verifyOtp, { email, purpose: 'password_reset', otp });
      setResetToken(res.data.token);
      setStep('password');
      toast.success('OTP verified');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'OTP verification failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setIsSubmitting(true);
      await api.post(endpoints.auth.resetPassword, { email, password, resetToken });
      toast.success('Password reset successful');
      router.push('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Password reset failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100svh-5rem)] items-center justify-center bg-premium-gradient px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <div className="glass w-full max-w-md rounded-xl border border-black/5 p-6 shadow-premium dark:border-white/10 sm:p-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 bg-primary/15 text-primary px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest mb-6 border border-primary/20">
            <Leaf className="w-4 h-4" />
            <span>Green Store</span>
          </Link>
          <h1 className="text-3xl font-black text-foreground mb-2">Reset Password</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Verify your email with OTP before setting a new password.</p>
        </div>

        {step === 'email' && (
          <form onSubmit={sendOtp} className="space-y-5">
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 px-5 py-4 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-gray-500" placeholder="name@example.com" />
            <button disabled={isSubmitting} className="w-full py-4 rounded-lg bg-primary text-white font-black hover:bg-primary-dark disabled:opacity-50">
              {isSubmitting ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={verifyOtp} className="space-y-5">
            <p className="text-sm text-gray-600 dark:text-gray-400">OTP sent to <span className="font-bold text-foreground">{email}</span>.</p>
            {devOtp && <p className="text-sm text-primary font-bold">Development OTP: {devOtp}</p>}
            <input value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} className="w-full rounded-lg border border-black/5 bg-black/5 px-3 py-4 text-center text-xl font-black tracking-[0.28em] text-foreground outline-none placeholder:text-gray-500 focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/5 sm:px-5 sm:text-2xl sm:tracking-[0.4em]" placeholder="000000" />
            <button disabled={isSubmitting || otp.length !== 6} className="w-full py-4 rounded-lg bg-primary text-white font-black hover:bg-primary-dark disabled:opacity-50">
              {isSubmitting ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        )}

        {step === 'password' && (
          <form onSubmit={resetPassword} className="space-y-5">
            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 px-5 py-4 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-gray-500" placeholder="New password" />
            <button disabled={isSubmitting} className="w-full py-4 rounded-lg bg-primary text-white font-black hover:bg-primary-dark disabled:opacity-50">
              {isSubmitting ? 'Saving...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
