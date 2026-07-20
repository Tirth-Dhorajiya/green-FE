const termsSections = [
  {
    title: 'Use of the website',
    body: [
      'You agree to provide accurate account, delivery, and payment information.',
      'You are responsible for keeping your login details secure and for activity under your account.',
      'You must not misuse the website, attempt unauthorized access, scrape protected data, or interfere with store operations.',
    ],
  },
  {
    title: 'Products and availability',
    body: [
      'Product images, descriptions, size, color, and plant appearance are shown as accurately as possible, but natural products may vary.',
      'Stock availability, pricing, offers, and product listings may change without notice.',
      'We may limit, cancel, or refuse orders where stock, pricing, payment, fraud, or delivery issues occur.',
    ],
  },
  {
    title: 'Orders and payments',
    body: [
      'Orders are confirmed only after successful payment verification and order creation.',
      'Payment processing may be handled by third-party payment providers under their own terms and security policies.',
      'If payment is successful but order creation fails, contact support with your payment reference for verification.',
    ],
  },
  {
    title: 'Shipping, returns, and cancellations',
    body: [
      'Delivery timelines are estimates and may vary due to location, stock condition, weather, courier delays, or operational issues.',
      'Live plants and perishable items may have stricter return rules than tools, planters, or non-perishable items.',
      'Cancellation, replacement, refund, or return requests are reviewed based on order status, product type, and proof of issue.',
    ],
  },
  {
    title: 'Reviews and user content',
    body: [
      'Product reviews should be honest, relevant, and respectful.',
      'We may hide or remove reviews that are abusive, misleading, spam, unrelated, or violate store policies.',
      'By submitting a review, you allow Green Store to display it on product and marketing pages.',
    ],
  },
  {
    title: 'Limitation of liability',
    body: [
      'Green Store is not responsible for plant damage caused by improper care, unsuitable environment, delayed unpacking, or misuse after delivery.',
      'To the fullest extent allowed by law, our liability is limited to the value of the affected order or product.',
      'These terms may be updated from time to time. Continued use of the website means you accept the updated terms.',
    ],
  },
];

export default function TermsAndConditionsPage() {
  return (
    <main className="bg-background">
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-primary mb-4">Legal / Terms</p>
        <h1 className="mb-6 text-3xl font-black tracking-tight text-foreground sm:text-4xl md:text-6xl">Terms & Conditions</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl">
          These terms apply when you browse Green Store, create an account, place an order, submit reviews, or use customer support features.
        </p>
        <p className="mt-5 text-sm font-bold text-gray-600 dark:text-gray-400">Last updated: July 9, 2026</p>
      </section>

      <section className="border-y border-black/5 dark:border-white/10 bg-card/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-5">
          {termsSections.map((section) => (
            <article key={section.title} className="bg-card rounded-xl border border-black/5 dark:border-white/10 p-6 md:p-8 shadow-sm">
              <h2 className="text-2xl font-black text-foreground mb-5">{section.title}</h2>
              <ul className="space-y-3 text-gray-700 dark:text-gray-400 leading-relaxed">
                {section.body.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full bg-primary shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-xl border border-primary/20 bg-primary/10 p-6 md:p-8">
          <h2 className="text-xl font-black text-foreground mb-3">Questions about these terms?</h2>
          <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
            Contact support at{' '}
            <a href="mailto:support@greenstore.com" className="break-all font-black text-primary hover:underline">
              support@greenstore.com
            </a>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
