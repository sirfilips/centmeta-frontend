import { Metadata } from 'next';
import CentMetaApp from '../components/CentMetaApp';

// 1. GENERAZIONE METADATI DELLA HOME (Letti dai bot di Telegram, Google, WhatsApp)
export const metadata: Metadata = {
  title: 'CentMeta | Analisi Statistiche Centurion Commander',
  description: 'Scopri le carte più giocate, i comandanti in tendenza e le migliori liste per il formato Centurion Commander.',
  alternates: {
    canonical: 'https://centmeta.it',
  },
  openGraph: {
    title: 'CentMeta | Analisi Centurion Commander',
    description: 'Statistiche, top carte e liste community per il formato Centurion Commander.',
    url: 'https://centmeta.it',
    siteName: 'CentMeta',
    images: [
      {
        url: 'https://centmeta.it/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Anteprima Dashboard CentMeta',
      },
    ],
    locale: 'it_IT',
    type: 'website',
  },
};

// 2. RENDERIZZAZIONE DELLA PAGINA PER L'UTENTE
export default function Home() {
  // Carica l'app di base, il comandante iniziale sarà "Tutti i mazzi" per default
  return <CentMetaApp />;
}