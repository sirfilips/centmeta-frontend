/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

function extractOrigin(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  try {
    const parsed = new URL(rawUrl.trim());
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return parsed.origin;
    }
  } catch {
    // URL relativo o non valido: nessuna origine esterna da aggiungere
  }
  return null;
}

const umamiOrigin = extractOrigin(process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL);
const apiOrigin = extractOrigin(process.env.NEXT_PUBLIC_API_URL);

const scriptSrc = [
  "'self'",
  "'unsafe-inline'",
  ...(!isProd ? ["'unsafe-eval'"] : []),
  'https://cloud.umami.is',
  ...(umamiOrigin && umamiOrigin !== 'https://cloud.umami.is' ? [umamiOrigin] : []),
].join(' ');

const connectSrc = [
  "'self'",
  'https://cloud.umami.is',
  'https://api-gateway.umami.dev',
  ...(umamiOrigin && umamiOrigin !== 'https://cloud.umami.is' ? [umamiOrigin] : []),
  ...(apiOrigin ? [apiOrigin] : []),
].join(' ');

const cspDirectives = [
  "default-src 'self'",
  `script-src ${scriptSrc}`,
  `connect-src ${connectSrc}`,
  "img-src 'self' data: blob: https://cards.scryfall.io https://svgs.scryfall.io https://api.scryfall.com",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isProd ? ['upgrade-insecure-requests'] : []),
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: cspDirectives },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'no-referrer' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=(), interest-cohort=()',
  },
  ...(isProd
    ? [{ key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' }]
    : []),
];

const nextConfig = {
  poweredByHeader: false,
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:8000/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
