import type { Metadata } from "next";

const MAX_CARD_PARAM_LENGTH = 120;
const MAX_CARD_META_CACHE = 500;
const CARD_META_TTL_MS = 60 * 60 * 1000;

interface CachedCardArtMeta {
  exists: boolean;
  artCrop: string;
  artist: string;
  ts: number;
}

const cardArtMetaCache = new Map<string, CachedCardArtMeta>();

export function sanitizeCardQueryParam(
  raw: string | string[] | undefined,
): string | null {
  const first = Array.isArray(raw) ? raw[0] : raw;
  if (typeof first !== "string") return null;
  const cleaned = first.replace(/[\u0000-\u001F\u007F]/g, "").trim();
  if (!cleaned || cleaned.length > MAX_CARD_PARAM_LENGTH) return null;
  return cleaned;
}

/**
 * Restituisce l'URL deterministico di Scryfall per ottenere l'art_crop
 * di una carta o di un comandante (gestendo Partner " / " e carte bifronte " // ").
 */
export function getScryfallArtCropUrl(cardOrCmdName: string): string {
  const primaryFace = cardOrCmdName
    .split(" / ")[0]
    .split(" // ")[0]
    .trim();
  return `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(primaryFace)}&format=image&version=art_crop`;
}

/**
 * Risolve l'URL dell'art_crop, il nome dell'artista e l'esistenza di una carta nel DB
 * interrogando il backend interno (con cache LRU/TTL limitata in memoria per evitare
 * la crescita illimitata della Data Cache di Next.js su query ?card= arbitrarie).
 */
export async function resolveCardArtMeta(
  cardName: string,
): Promise<{ exists: boolean; artCrop: string; artist: string }> {
  const sanitized = sanitizeCardQueryParam(cardName);
  if (!sanitized) {
    return { exists: false, artCrop: "", artist: "" };
  }

  const cacheKey = sanitized.toLowerCase();
  const now = Date.now();
  const cached = cardArtMetaCache.get(cacheKey);
  if (cached && now - cached.ts < CARD_META_TTL_MS) {
    cardArtMetaCache.delete(cacheKey);
    cardArtMetaCache.set(cacheKey, cached);
    return { exists: cached.exists, artCrop: cached.artCrop, artist: cached.artist };
  }

  const fallback = getScryfallArtCropUrl(sanitized);
  const apiUrl = process.env.API_INTERNAL_URL || "http://127.0.0.1:8000";

  try {
    const res = await fetch(
      `${apiUrl}/api/card/details?card_name=${encodeURIComponent(sanitized)}&filtro_tempo=${encodeURIComponent("Tutti i tempi")}`,
      {
        cache: "no-store",
        signal: AbortSignal.timeout(1500),
      },
    );
    if (res.ok) {
      const data = await res.json();
      const artist = typeof data?.artist === "string" ? data.artist : "";
      const hasImages = Array.isArray(data?.images) && data.images.length > 0;
      const exists = (Number(data?.total_decks_global) || 0) > 0 || hasImages;
      const artCrop =
        Array.isArray(data?.art_crops) && data.art_crops.length > 0 && data.art_crops[0]
          ? data.art_crops[0]
          : fallback;

      const entry: CachedCardArtMeta = { exists, artCrop, artist, ts: now };
      cardArtMetaCache.set(cacheKey, entry);
      if (cardArtMetaCache.size > MAX_CARD_META_CACHE) {
        const oldestKey = cardArtMetaCache.keys().next().value;
        if (oldestKey !== undefined) cardArtMetaCache.delete(oldestKey);
      }
      return { exists, artCrop, artist };
    }
  } catch {
    // Fallback silenzioso in caso di backend momentaneamente non raggiungibile
  }

  return { exists: false, artCrop: fallback, artist: "" };
}

/**
 * Costruisce i metadati OpenGraph e Twitter condivisi per una singola carta (?card=...).
 * Restituisce null se il parametro è assente/non valido o la carta non esiste nel backend.
 */
export async function buildCardMetadata(cardName: string): Promise<Metadata | null> {
  const sanitized = sanitizeCardQueryParam(cardName);
  if (!sanitized) return null;

  const { exists, artCrop: cardArtCrop, artist } = await resolveCardArtMeta(sanitized);
  if (!exists) return null;

  const canonicalUrl = `https://centmeta.it/?card=${encodeURIComponent(sanitized)}`;
  const description = `Statistiche di utilizzo, comandanti e sinergie per ${sanitized} in Centurion Commander.`;
  const artCredit = artist
    ? `Art: ${artist} · © Wizards of the Coast`
    : "© Wizards of the Coast";
  const ogDescription = `${description} (${artCredit})`;

  return {
    title: `${sanitized} | Statistiche, Comandanti e Sinergie Centurion`,
    description: `Scopri in quanti mazzi è giocata ${sanitized}, i comandanti principali e le migliori sinergie nel formato Centurion Commander su CentMeta.`,
    robots: {
      index: false,
      follow: true,
    },
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${sanitized} - CentMeta`,
      description: ogDescription,
      url: canonicalUrl,
      siteName: "CentMeta",
      images: [
        {
          url: cardArtCrop,
          width: 626,
          height: 457,
          alt: `Artwork di ${sanitized} (${artCredit})`,
        },
      ],
      locale: "it_IT",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${sanitized} - CentMeta`,
      description: ogDescription,
      images: [cardArtCrop],
    },
  };
}
