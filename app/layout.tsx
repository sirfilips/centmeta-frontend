import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import PwaTracker from '../components/PwaTracker';
import './globals.css';
import 'mana-font/css/mana.min.css';

const siteUrl = 'https://centmeta.it';

export const viewport: Viewport = {
  themeColor: '#0f172a', // slate-900 (match con l'Header in alto)
  colorScheme: 'dark',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'CentMeta | Analisi Centurion Commander',
  description: 'Statistiche per il formato di Magic: The Gathering - Centurion Commander.',
  referrer: 'no-referrer',
  appleWebApp: {
    capable: true,
    title: 'CentMeta',
    statusBarStyle: 'black-translucent',
  },
  
  openGraph: {
    title: 'CentMeta | Analisi Centurion Commander',
    description: 'Statistiche per il formato di Magic: The Gathering - Centurion Commander.',
    url: siteUrl, 
    siteName: 'CentMeta',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CentMeta Preview',
      },
    ],
    locale: 'it_IT',
    type: 'website',
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'CentMeta | Analisi Centurion Commander',
    description: 'Statistiche per il formato di Magic: The Gathering - Centurion Commander.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" className="h-full">
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100" suppressHydrationWarning>
        <PwaTracker />
        {children}
        {process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
          <Script
            src={process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL || "https://cloud.umami.is/script.js"}
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}