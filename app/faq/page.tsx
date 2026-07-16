import Link from 'next/link';
import { CreditCard, HelpCircle, Leaf, PackageCheck, RefreshCcw, Truck } from 'lucide-react';

const faqGroups = [
  {
    title: 'Delivery',
    icon: Truck,
    items: [
      {
        question: 'How long does delivery take?',
        answer: 'Most orders are prepared quickly after payment verification. Delivery time depends on your location, product availability, weather, and courier handling.',
      },
      {
        question: 'How are live plants packed?',
        answer: 'Plants are packed to reduce movement and moisture stress during transit. Unpack them as soon as possible and keep them in indirect light for the first day.',
      },
      {
        question: 'Can I change my delivery address?',
        answer: 'Contact support as soon as possible. Address changes are possible only before the order is packed or handed to the courier.',
      },
    ],
  },
  {
    title: 'Payments',
    icon: CreditCard,
    items: [
      {
        question: 'Which payment methods are supported?',
        answer: 'Checkout is designed for secure online payment through the configured payment provider. Payment confirmation is required before order creation.',
      },
      {
        question: 'My payment succeeded but I do not see an order. What should I do?',
        answer: 'Contact support with your payment reference, email, and order attempt details. We can verify the payment and help resolve the order.',
      },
      {
        question: 'Can I use coupons?',
        answer: 'Yes. Enter an active coupon code during checkout. The discount applies only if the cart meets coupon rules such as minimum order value or usage limits.',
      },
    ],
  },
  {
    title: 'Plant Care',
    icon: Leaf,
    items: [
      {
        question: 'What should I do after receiving a plant?',
        answer: 'Unpack carefully, check soil moisture, keep it in bright indirect light, and avoid repotting immediately unless needed.',
      },
      {
        question: 'Why are some leaves yellow or bent after shipping?',
        answer: 'Minor stress can happen during transit. Remove damaged leaves, keep care stable, and allow the plant a few days to adjust.',
      },
      {
        question: 'How often should I water my plant?',
        answer: 'Check the top inch of soil first. Watering depends on plant type, pot size, light, temperature, and drainage.',
      },
    ],
  },
  {
    title: 'Refunds & Returns',
    icon: RefreshCcw,
    items: [
      {
        question: 'Can I return a live plant?',
        answer: 'Live plants may have stricter return rules because they are perishable. Contact support quickly with photos and order details if there is an issue.',
      },
      {
        question: 'What if an item arrives damaged?',
        answer: 'Share clear photos of the package and product within the support window. We will review the issue for replacement, refund, or store credit.',
      },
      {
        question: 'When are refunds processed?',
        answer: 'Approved refunds are processed after review. Bank or payment provider timelines may vary after the refund is initiated.',
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <main className="bg-background">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-primary mb-4">Support / FAQ</p>
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 items-start">
          <div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground mb-6">
              Answers before you order.
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
              Quick help for delivery, secure payments, plant care, refunds, and returns.
            </p>
            <Link href="/contact" className="inline-flex bg-primary text-white px-6 py-3 rounded-lg font-black hover:bg-primary-dark transition">
              Contact Support
            </Link>
          </div>

          <div className="rounded-xl border border-primary/20 bg-primary/10 p-6 md:p-8">
            <PackageCheck className="w-8 h-8 text-primary mb-4" />
            <h2 className="text-2xl font-black text-foreground mb-3">Need order-specific help?</h2>
            <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
              Include your order reference, payment reference, registered email, and photos if the product arrived damaged.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-black/5 dark:border-white/10 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid md:grid-cols-2 gap-6">
          {faqGroups.map(({ title, icon: Icon, items }) => (
            <article key={title} className="bg-card rounded-xl border border-black/5 dark:border-white/10 p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-foreground">{title}</h2>
              </div>
              <div className="space-y-5">
                {items.map((item) => (
                  <div key={item.question}>
                    <div className="flex gap-3">
                      <HelpCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <h3 className="font-black text-foreground">{item.question}</h3>
                    </div>
                    <p className="mt-2 pl-8 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.answer}</p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
