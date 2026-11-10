import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CentMeta | Analisi Centurion Commander',
    short_name: 'CentMeta',
    description: 'Statistiche e metagame per il formato di Magic: The Gathering - Centurion Commander.',
    start_url: '/',
    display: 'standalone',
    background_color: '#020617', // slate-950
    theme_color: '#0f172a',      // slate-900 (colore dell'Header)
    icons: [
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}

