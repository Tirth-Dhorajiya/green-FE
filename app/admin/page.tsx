'use client';

import Link from 'next/link';
import { useEffect } from 'react';

const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:5174';

export default function AdminRedirectPage() {
  useEffect(() => {
    window.location.href = ADMIN_URL;
  }, []);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-3xl font-black text-foreground mb-4">Admin panel moved</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
        Inventory, orders, customers, featured items, and reviews are managed in the separate Green Admin app.
      </p>
      <Link href={ADMIN_URL} className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-dark transition">
        Open Admin Panel
      </Link>
    </div>
  );
}
