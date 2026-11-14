import { Metadata } from 'next';
import CentMetaApp from '../components/CentMetaApp';
import { buildCardMetadata } from '../utils/og';

type HomeProps = {
  searchParams?: { [key: string]: string | string[] | undefined };
};

// 1. GENERAZIONE METADATI DELLA HOME E DELLE CARTE (?card=...)
export async function generateMetadata({ searchParams }: HomeProps): Promise<Metadata> {
  const rawCard = searchParams?.card;
  const cardName = (Array.isArray(rawCard) ? rawCard[0] : rawCard)?.trim();

  if (cardName) {
    return buildCardMetadata(cardName);
  }

  return {
    title: 'CentMeta | Centurion Meta, Liste Mazzi e Metagame MTG',
    description:
      'Analisi completa del metagame Centurion MTG: scopri i migliori mazzi Centurion, liste mazzi aggiornate, comandanti più giocati, sinergie e trend.',
    alternates: {
      canonical: 'https://centmeta.it',
    },
    openGraph: {
      title: 'CentMeta | Centurion Meta, Liste Mazzi e Metagame MTG',
      description:
        'Statistiche sul metagame Centurion MTG, mazzi Centurion, top carte e liste mazzi della community.',
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
    twitter: {
      card: 'summary_large_image',
      title: 'CentMeta | Centurion Meta, Liste Mazzi e Metagame MTG',
      description:
        'Statistiche sul metagame Centurion MTG, mazzi Centurion, top carte e liste mazzi della community.',
      images: ['https://centmeta.it/og-image.png'],
    },
  };
}

// 2. RENDERIZZAZIONE DELLA PAGINA PER L'UTENTE
export default function Home() {
  // Carica l'app di base, il comandante iniziale sarà "Tutti i mazzi" per default
  return <CentMetaApp />;
}
