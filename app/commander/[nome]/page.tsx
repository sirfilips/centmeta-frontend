import { Metadata } from 'next';
import CentMetaApp from '../../../components/CentMetaApp';

type Props = {
  params: { nome: string };
};

// 1. GENERAZIONE DINAMICA DELLA SEO (Letto da Google, Telegram, WhatsApp)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const commanderName = decodeURIComponent(params.nome);
  
  return {
    title: `${commanderName} | Top Carte, Sinergie e Liste Centurion`,
    description: `Analisi statistica completa per il comandante ${commanderName} nel formato Centurion Commander. Scopri la curva di mana, la composizione media e le migliori carte per il deckbuilding.`,
    alternates: {
      canonical: `https://centmeta.it/commander/${params.nome}`,
    },
    openGraph: {
      title: `${commanderName} - CentMeta`,
      description: `Analisi statistica e liste mazzi per ${commanderName}.`,
      url: `https://centmeta.it/commander/${params.nome}`,
      siteName: 'CentMeta',
      images: [
        {
          url: 'https://centmeta.it/og-image.png',
          width: 1200,
          height: 630,
          alt: `Analisi per ${commanderName}`,
        },
      ],
      locale: 'it_IT',
      type: 'website',
    }
  };
}

// 2. RENDERIZZAZIONE DELLA PAGINA PER L'UTENTE
export default function CommanderPage({ params }: Props) {
  const commanderName = decodeURIComponent(params.nome);
  
  // Carica la stessa identica App, ma dicendole di partire già con questo comandante!
  return <CentMetaApp initialCommander={commanderName} />;
}