import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Green Store - Premium Plants & Gardening Tools',
    short_name: 'Green Store',
    description: 'Shop premium plants, seeds, planters, and gardening tools.',
    start_url: '/',
    display: 'standalone',
    background_color: '#111d17',
    theme_color: '#111d17',
    icons: [{ src: '/favicon.ico', sizes: '256x256', type: 'image/x-icon' }],
  };
}
