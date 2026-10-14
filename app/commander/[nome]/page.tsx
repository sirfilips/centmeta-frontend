import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CentMetaApp from '../../../components/CentMetaApp';

type Props = {
  params: { nome: string };
};

// --- HELPER DI VALIDAZIONE E DECODIFICA ---

// Cache in memoria: Set dei nomi validi e timestamp dell'ultimo aggiornamento
const cache = {
  names: new Set<string>(),
  ts: 0,
};

// TTL della cache: 10 minuti in millisecondi
const CACHE_TTL = 10 * 60 * 1000;

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

/**
 * Verifica se un comandante esiste interrogando il backend interno.
 * Logica FAIL-OPEN: in caso di qualsiasi errore, mancanza di config o timeout, 
 * restituisce `true` per non interrompere il servizio.
 */
async function commanderExists(name: string): Promise<boolean> {
  const apiUrl = process.env.API_INTERNAL_URL;
  
  // Fail-open: se la variabile d'ambiente non è configurata, lascia passare
  if (!apiUrl) {
    return true;
  }

  const now = Date.now();
  
  // Se la cache è ancora valida (e ha elementi), esegui il check in memoria
  if (now - cache.ts < CACHE_TTL && cache.names.size > 0) {
    return cache.names.has(name);
  }

  try {
    // Timeout di 3 secondi per evitare di bloccare il rendering SSR
    const response = await fetch(
      `${apiUrl}/api/commanders?filtro_tempo=${encodeURIComponent('Tutti i tempi')}`,
      {
        cache: 'no-store',
        signal: AbortSignal.timeout(3000)
      }
    );

    if (!response.ok) {
      // Fail-open: API non ok. Usiamo la cache vecchia se c'è, altrimenti passa.
      if (cache.names.size > 0) return cache.names.has(name);
      return true;
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      // Fail-open: Risposta inattesa o DB vuoto (es. manutenzione).
      if (cache.names.size > 0) return cache.names.has(name);
      return true;
    }

    // Costruisci il nuovo Set a parte, senza toccare la cache esistente
    const fresh = new Set<string>();
    for (const item of data) {
      if (item && typeof item.comandante === 'string') {
        fresh.add(item.comandante);
      }
    }

    // Fail-open: se la lista non contiene nomi utilizzabili, non bloccare nulla
    if (fresh.size === 0) {
      if (cache.names.size > 0) return cache.names.has(name);
      return true;
    }

    // Lista valida e popolata: aggiorna la cache e rispondi
    cache.names = fresh;
    cache.ts = now;
    return fresh.has(name);

  } catch (error) {
    // Fail-open: Timeout, backend spento o errore di rete.
    if (cache.names.size > 0) return cache.names.has(name);
    return true;
  }
}


// 1. GENERAZIONE DINAMICA DELLA SEO (Letto da Google, Telegram, WhatsApp)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const commanderName = safeDecode(params.nome);
  
  // Validazione del comandante
  const isValid = await commanderExists(commanderName);
  if (!isValid) {
    notFound();
  }
  
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
export default async function CommanderPage({ params }: Props) {
  const commanderName = safeDecode(params.nome);
  
  // Validazione del comandante
  const isValid = await commanderExists(commanderName);
  if (!isValid) {
    notFound();
  }
  
  // Carica la stessa identica App, ma dicendole di partire già con questo comandante!
  return <CentMetaApp initialCommander={commanderName} />;
}