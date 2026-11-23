import type { Metadata } from "next";

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
 * Risolve l'URL dell'art_crop e il nome dell'artista di una carta interrogando il backend interno (se configurato)
 * per ottenere l'URL diretto CDN (cards.scryfall.io) dalla cache SQLite;
 * in caso contrario o di fallback, restituisce l'endpoint art_crop di Scryfall.
 */
export async function resolveCardArtMeta(cardName: string): Promise<{ artCrop: string; artist: string }> {
  const fallback = getScryfallArtCropUrl(cardName);
  const apiUrl = process.env.API_INTERNAL_URL || "http://127.0.0.1:8000";
  if (!apiUrl) {
    return { artCrop: fallback, artist: "" };
  }

  try {
    const res = await fetch(
      `${apiUrl}/api/card/details?card_name=${encodeURIComponent(cardName)}&filtro_tempo=${encodeURIComponent("Tutti i tempi")}`,
      {
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(1500),
      },
    );
    if (res.ok) {
      const data = await res.json();
      const artist = typeof data?.artist === "string" ? data.artist : "";
      if (Array.isArray(data?.art_crops) && data.art_crops.length > 0 && data.art_crops[0]) {
        return { artCrop: data.art_crops[0], artist };
      }
      return { artCrop: fallback, artist };
    }
  } catch {
    // Fallback silenzioso all'endpoint art_crop di Scryfall
  }

  return { artCrop: fallback, artist: "" };
}

/**
 * Risolve l'URL dell'art_crop di una carta interrogando il backend interno (se configurato).
 */
export async function resolveCardArtCrop(cardName: string): Promise<string> {
  const { artCrop } = await resolveCardArtMeta(cardName);
  return artCrop;
}

/**
 * Costruisce i metadati OpenGraph e Twitter condivisi per una singola carta (?card=...).
 */
export async function buildCardMetadata(cardName: string): Promise<Metadata> {
  const { artCrop: cardArtCrop, artist } = await resolveCardArtMeta(cardName);
  const canonicalUrl = `https://centmeta.it/?card=${encodeURIComponent(cardName)}`;
  const description = `Statistiche di utilizzo, comandanti e sinergie per ${cardName} in Centurion Commander.`;
  const artCredit = artist
    ? `Art: ${artist} · © Wizards of the Coast`
    : "© Wizards of the Coast";
  const ogDescription = `${description} (${artCredit})`;

  return {
    title: `${cardName} | Statistiche, Comandanti e Sinergie Centurion`,
    description: `Scopri in quanti mazzi è giocata ${cardName}, i comandanti principali e le migliori sinergie nel formato Centurion Commander su CentMeta.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${cardName} - CentMeta`,
      description: ogDescription,
      url: canonicalUrl,
      siteName: "CentMeta",
      images: [
        {
          url: cardArtCrop,
          width: 626,
          height: 457,
          alt: `Artwork di ${cardName} (${artCredit})`,
        },
      ],
      locale: "it_IT",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${cardName} - CentMeta`,
      description: ogDescription,
      images: [cardArtCrop],
    },
  };
}
