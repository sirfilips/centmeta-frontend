import type { Metadata } from 'next';
import './globals.css';
import 'mana-font/css/mana.min.css';

const siteUrl = 'https://centmeta.it';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'CentMeta | Analisi Centurion Commander',
  description: 'Statistiche per il formato di Magic: The Gathering - Centurion Commander.',
  
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
        {children}
      </body>
    </html>
  );
}