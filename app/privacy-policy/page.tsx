const privacySections = [
  {
    title: 'Information we collect',
    body: [
      'Account details such as name, email address, saved delivery address, and login information.',
      'Order details such as products purchased, quantities, payment status, coupon usage, and delivery information.',
      'Support and review content you submit through contact forms, product reviews, or account features.',
      'Basic technical information such as device, browser, IP address, and site usage data needed for security and service improvement.',
    ],
  },
  {
    title: 'How we use your information',
    body: [
      'To create accounts, process orders, manage carts and wishlists, and provide order history.',
      'To arrange delivery, handle returns or support requests, and send important account or order updates.',
      'To protect the store from fraud, abuse, unauthorized access, and payment misuse.',
      'To improve products, site performance, customer support, and shopping experience.',
    ],
  },
  {
    title: 'Payments',
    body: [
      'Payments are processed through third-party payment providers. Green Store does not store full card, UPI, or bank account details on its servers.',
      'We may store payment references, provider names, payment status, and transaction identifiers to verify orders and support refunds or disputes.',
    ],
  },
  {
    title: 'Sharing of information',
    body: [
      'We share only the information needed with delivery partners, payment processors, hosting providers, email providers, and support tools.',
      'We do not sell customer personal information.',
      'We may disclose information if required by law, legal process, fraud prevention, or platform security requirements.',
    ],
  },
  {
    title: 'Data security and retention',
    body: [
      'We use reasonable technical and organizational safeguards to protect customer data.',
      'Order, payment reference, and account records may be retained for business, tax, legal, fraud-prevention, and support purposes.',
      'You can request account updates or deletion by contacting support, subject to records we must keep for legal or operational reasons.',
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-background">
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-primary mb-4">Legal / Privacy</p>
        <h1 className="mb-6 text-3xl font-black tracking-tight text-foreground sm:text-4xl md:text-6xl">Privacy Policy</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl">
          This policy explains how Green Store collects, uses, protects, and shares customer information when you use our website, create an account, place orders, or contact support.
        </p>
        <p className="mt-5 text-sm font-bold text-gray-600 dark:text-gray-400">Last updated: July 9, 2026</p>
      </section>

      <section className="border-y border-black/5 dark:border-white/10 bg-card/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-5">
          {privacySections.map((section) => (
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
          <h2 className="text-xl font-black text-foreground mb-3">Contact</h2>
          <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
            For privacy questions, account updates, or data requests, contact us at{' '}
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
