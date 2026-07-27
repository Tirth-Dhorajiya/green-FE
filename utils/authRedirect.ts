const DEFAULT_RETURN_PATH = '/';

export function getCurrentReturnPath(fallback = '/products') {
  if (typeof window === 'undefined') return fallback;

  const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  return currentPath.startsWith('/login') ? fallback : currentPath;
}

export function createLoginUrl(returnPath: string) {
  return `/login?redirect=${encodeURIComponent(returnPath)}`;
}

export function getSafeReturnPath(value: string | null, fallback = DEFAULT_RETURN_PATH) {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return fallback;

  try {
    const baseUrl = 'https://greenstore.local';
    const resolvedUrl = new URL(value, baseUrl);

    if (resolvedUrl.origin !== baseUrl || resolvedUrl.pathname === '/login') {
      return fallback;
    }

    return `${resolvedUrl.pathname}${resolvedUrl.search}${resolvedUrl.hash}`;
  } catch {
    return fallback;
  }
}
