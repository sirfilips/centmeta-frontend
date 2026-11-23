import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CentMetaApp from '../../../components/CentMetaApp';
import {
  buildCardMetadata,
  getScryfallArtCropUrl,
  sanitizeCardQueryParam,
} from '../../../utils/og';

type Props = {
  params: { nome: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

// --- HELPER DI VALIDAZIONE E DECODIFICA ---

// Cache in memoria: Set dei nomi validi, mappa art_crop, mappa artisti e timestamp dell'ultimo aggiornamento
const cache = {
  names: new Set<string>(),
  artCrops: new Map<string, string>(),
  artists: new Map<string, string>(),
  ts: 0,
};

// TTL della cache: 10 minuti in millisecondi
const CACHE_TTL = 10 * 60 * 1000;
let pendingRefresh: Promise<boolean> | null = null;

/**
 * Decodifica in modo sicuro l'URL. Se è malformato (es. %E0%A4%A), invoca il 404
 * invece di causare un Error 500.
 */
function safeDecode(encoded: string): string {
  try {
    return decodeURIComponent(encoded);
  } catch (e) {
    notFound();
  }
}

function safeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

async function refreshCommandersCache(): Promise<boolean> {
  const apiUrl = process.env.API_INTERNAL_URL || 'http://127.0.0.1:8000';
  try {
    // Timeout di 3 secondi per evitare di bloccare il rendering SSR
    const response = await fetch(
      `${apiUrl}/api/commanders?filtro_tempo=${encodeURIComponent('Tutti i tempi')}`,
      {
        cache: 'no-store',
        signal: AbortSignal.timeout(3000),
      },
    );

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) {
      return false;
    }

    // Costruisci il nuovo Set, la mappa art_crop e la mappa artisti a parte, senza toccare la cache esistente
    const fresh = new Set<string>();
    const freshArtCrops = new Map<string, string>();
    const freshArtists = new Map<string, string>();
    for (const item of data) {
      if (item && typeof item.comandante === 'string') {
        fresh.add(item.comandante);
        if (Array.isArray(item.art_crops) && item.art_crops.length > 0 && item.art_crops[0]) {
          freshArtCrops.set(item.comandante, item.art_crops[0]);
        }
        if (typeof item.artist === 'string' && item.artist.trim()) {
          freshArtists.set(item.comandante, item.artist.trim());
        }
      }
    }

    if (fresh.size === 0) {
      return false;
    }

    cache.names = fresh;
    cache.artCrops = freshArtCrops;
    cache.artists = freshArtists;
    cache.ts = Date.now();
    return true;
  } catch {
    return false;
  }
}

/**
 * Verifica se un comandante esiste interrogando il backend interno.
 * Deduplica eventuali refresh concorrenti (es. generateMetadata + CommanderPage).
 * Logica FAIL-OPEN: in caso di errore o timeout restituisce `true` per non interrompere il servizio.
 */
async function commanderExists(name: string): Promise<boolean> {
  const now = Date.now();

  if (now - cache.ts < CACHE_TTL && cache.names.size > 0) {
    return cache.names.has(name);
  }

  if (!pendingRefresh) {
    pendingRefresh = refreshCommandersCache().finally(() => {
      pendingRefresh = null;
    });
  }

  const refreshed = await pendingRefresh;
  if (refreshed || cache.names.size > 0) {
    return cache.names.has(name);
  }
  return true;
}


// 1. GENERAZIONE DINAMICA DELLA SEO (Letto da Google, Telegram, WhatsApp)
export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const commanderName = safeDecode(params.nome);
  
  // Validazione del comandante
  const isValid = await commanderExists(commanderName);
  if (!isValid) {
    notFound();
  }

  // Se nel link è presente anche il parametro ?card=... valido, mostra la preview della carta
  const cardName = sanitizeCardQueryParam(searchParams?.card);
  if (cardName) {
    const cardMeta = await buildCardMetadata(cardName);
    if (cardMeta) return cardMeta;
  }

  const commanderArtCrop =
    cache.artCrops.get(commanderName) || getScryfallArtCropUrl(commanderName);
  const commanderArtist = cache.artists.get(commanderName) || '';
  const artCredit = commanderArtist
    ? `Art: ${commanderArtist} · © Wizards of the Coast`
    : '© Wizards of the Coast';
  const ogDescription = `Analisi statistica e liste mazzi per ${commanderName}. (${artCredit})`;
  
  const encodedCommanderName = encodeURIComponent(commanderName);
  const canonicalUrl = `https://centmeta.it/commander/${encodedCommanderName}`;

  return {
    title: `${commanderName} — Centurion Commander | Liste, Sinergie e Statistiche`,
    description: `Analisi statistica completa per ${commanderName} in Magic: The Gathering Centurion Commander (1v1). Curva di mana, composizione media, sinergie e liste mazzi dalla community.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${commanderName} - CentMeta`,
      description: ogDescription,
      url: canonicalUrl,
      siteName: 'CentMeta',
      images: [
        {
          url: commanderArtCrop,
          width: 626,
          height: 457,
          alt: `Analisi per ${commanderName} (${artCredit})`,
        },
      ],
      locale: 'it_IT',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${commanderName} - CentMeta`,
      description: ogDescription,
      images: [commanderArtCrop],
    },
  };
}

// 2. RENDERIZZAZIONE DELLA PAGINA PER L'UTENTE
export default async function CommanderPage({ params }: Props) {
  const commanderName = safeDecode(params.nome);
  
  // Validazione del comandante
  const isValid = await commanderExists(commanderName);
  if (!isValid) {
    notFound();
  }
  
  const encodedCommanderName = encodeURIComponent(commanderName);
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://centmeta.it',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: commanderName,
        item: `https://centmeta.it/commander/${encodedCommanderName}`,
      },
    ],
  };

  // Carica la stessa identica App, ma dicendole di partire già con questo comandante!
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }}
      />
      <CentMetaApp initialCommander={commanderName} />
    </>
  );
}
