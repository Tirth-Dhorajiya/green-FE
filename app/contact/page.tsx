'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { Clock, Headphones, Mail, MapPin, MessageSquare, PackageCheck, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { endpoints } from '../../services/apiConfig';
import Reveal from '../../components/Reveal';

const supportOptions = [
  {
    title: 'Order Support',
    body: 'Questions about payment, delivery, returns, or order status.',
    icon: PackageCheck,
  },
  {
    title: 'Plant Advice',
    body: 'Send care symptoms, light conditions, and watering routine for guidance.',
    icon: MessageSquare,
  },
  {
    title: 'Bulk Orders',
    body: 'Planters, gifting, office greens, and custom gardening kits.',
    icon: Headphones,
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    topic: 'Order Support',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const submitContact = async (event: FormEvent) => {
    event.preventDefault();
    try {
      setSubmitting(true);
      const res = await api.post(endpoints.contact.submit, form);
      toast.success(res.data.message || 'Message sent');
      setForm({ name: '', email: '', topic: 'Order Support', message: '' });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Unable to send message');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="bg-background">
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10">
          <Reveal>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-primary mb-4">Contact / Support</p>
            <h1 className="mb-6 text-3xl font-black tracking-tight text-foreground sm:text-4xl md:text-6xl">
              We are here for orders and plant care.
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
              Reach out for delivery updates, product help, plant care questions, or business orders.
            </p>

            <div className="space-y-4">
              <div className="motion-surface flex gap-4 rounded-xl bg-card border border-black/5 dark:border-white/10 p-5">
                <Mail className="w-6 h-6 text-primary shrink-0" />
                <div>
                  <h2 className="font-black text-foreground">Email</h2>
                  <a href="mailto:support@greenstore.com" className="break-all text-gray-600 hover:text-primary dark:text-gray-400">support@greenstore.com</a>
                </div>
              </div>
              <div className="motion-surface flex gap-4 rounded-xl bg-card border border-black/5 dark:border-white/10 p-5">
                <Phone className="w-6 h-6 text-primary shrink-0" />
                <div>
                  <h2 className="font-black text-foreground">Phone</h2>
                  <a href="tel:+910000000000" className="text-gray-600 dark:text-gray-400 hover:text-primary">+91 00000 00000</a>
                </div>
              </div>
              <div className="motion-surface flex gap-4 rounded-xl bg-card border border-black/5 dark:border-white/10 p-5">
                <Clock className="w-6 h-6 text-primary shrink-0" />
                <div>
                  <h2 className="font-black text-foreground">Hours</h2>
                  <p className="text-gray-600 dark:text-gray-400">Mon-Sat, 10:00 AM - 7:00 PM</p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="motion-surface rounded-xl border border-black/5 bg-card p-5 shadow-sm dark:border-white/10 sm:p-6 md:p-8">
            <h2 className="text-2xl font-black text-foreground mb-6">Send a message</h2>
            <form className="space-y-4" onSubmit={submitContact}>
              <div className="grid sm:grid-cols-2 gap-4">
                <label className="block text-sm font-bold text-foreground/70">
                  Name
                  <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required className="mt-2 w-full rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20" placeholder="Your name" />
                </label>
                <label className="block text-sm font-bold text-foreground/70">
                  Email
                  <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required className="mt-2 w-full rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20" placeholder="you@example.com" />
                </label>
              </div>
              <label className="block text-sm font-bold text-foreground/70">
                Topic
                <select value={form.topic} onChange={(event) => setForm({ ...form, topic: event.target.value })} className="mt-2 w-full rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20">
                  <option>Order Support</option>
                  <option>Plant Care</option>
                  <option>Product Question</option>
                  <option>Bulk Order</option>
                </select>
              </label>
              <label className="block text-sm font-bold text-foreground/70">
                Message
                <textarea rows={6} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} required minLength={10} className="mt-2 w-full rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 resize-none" placeholder="Tell us how we can help" />
              </label>
              <button type="submit" disabled={submitting} className="living-cta w-full bg-primary hover:bg-primary-dark text-white rounded-lg py-4 font-black transition disabled:opacity-60">
                {submitting ? 'Sending...' : 'Submit Request'}
              </button>
            </form>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-black/5 dark:border-white/10 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid md:grid-cols-3 gap-5">
            {supportOptions.map(({ title, body, icon: Icon }, index) => (
              <Reveal key={title} delay={index * 0.07} className="motion-surface bg-card rounded-xl border border-black/5 dark:border-white/10 p-6">
                <Icon className="motion-icon w-7 h-7 text-primary mb-4" />
                <h2 className="font-black text-foreground mb-2">{title}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{body}</p>
              </Reveal>
            ))}
          </div>
          <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-3 text-gray-600 dark:text-gray-400">
            <MapPin className="w-5 h-5 text-primary" />
            <span>Green Store Support Center, India</span>
            <Link href="/profile" className="sm:ml-auto text-primary font-black hover:underline">View Orders</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
