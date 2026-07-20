export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
export const ASSET_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000';

export const endpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    me: '/auth/me',
    updateMe: '/auth/me',
    sendOtp: '/auth/otp/send',
    verifyOtp: '/auth/otp/verify',
    resetPassword: '/auth/password/reset',
  },
  products: {
    list: '/products',
    featured: '/products?featured=true&limit=4&sortBy=created_at&order=desc',
    detail: (id: string) => `/products/${id}`,
    reviews: (id: string) => `/products/${id}/reviews`,
    featuredStatus: (id: string) => `/products/${id}/featured`,
  },
  cart: {
    list: '/cart',
    add: '/cart',
    item: (id: string) => `/cart/${id}`,
  },
  wishlist: {
    list: '/wishlist',
    add: '/wishlist',
    item: (productId: string) => `/wishlist/${productId}`,
  },
  orders: {
    create: '/orders',
    mine: '/orders/my',
    detail: (id: string) => `/orders/${id}`,
    status: (id: string) => `/orders/${id}/status`,
    cancel: (id: string) => `/orders/${id}/cancel`,
  },
  payments: {
    razorpayOrder: '/payments/razorpay/order',
    razorpayVerify: '/payments/razorpay/verify',
  },
  shipping: {
    serviceability: '/shipping/serviceability',
  },
  coupons: {
    validate: '/coupons/validate',
  },
  contact: {
    submit: '/contact',
  },
};
