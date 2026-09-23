import type { Metadata } from 'next';
import './globals.css';

const siteUrl = 'https://centmeta.it';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'CentMeta | Analisi Commander',
  description: 'Statistiche per il formato Centurion Commander.',
  
  // Il blocco "icons" è stato rimosso intenzionalmente! 
  // Next.js troverà da solo "icon.png" e "apple-icon.png" dentro la cartella app/
  
  // Anteprima per WhatsApp, Telegram, Facebook
  openGraph: {
    title: 'CentMeta | Analisi Commander',
    description: 'Statistiche per il formato Centurion Commander.',
    url: siteUrl, 
    siteName: 'CentMeta',
    images: [
      {
        url: '/og-image.png', // Questa sta in public/, quindi il percorso va specificato
        width: 1200,
        height: 630,
        alt: 'CentMeta Preview',
      },
    ],
    locale: 'it_IT',
    type: 'website',
  },
  
  // Anteprima per Twitter/X
  twitter: {
    card: 'summary_large_image',
    title: 'CentMeta | Analisi Commander',
    description: 'Statistiche per il formato Centurion Commander.',
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