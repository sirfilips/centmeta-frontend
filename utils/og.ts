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
 * Risolve l'URL dell'art_crop di una carta interrogando il backend interno (se configurato)
 * per ottenere l'URL diretto CDN (cards.scryfall.io) dalla cache SQLite;
 * in caso contrario o di fallback, restituisce l'endpoint art_crop di Scryfall.
 */
export async function resolveCardArtCrop(cardName: string): Promise<string> {
  const fallback = getScryfallArtCropUrl(cardName);
  const apiUrl = process.env.API_INTERNAL_URL;
  if (!apiUrl) {
    return fallback;
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
      if (Array.isArray(data?.art_crops) && data.art_crops.length > 0 && data.art_crops[0]) {
        return data.art_crops[0];
      }
    }
  } catch {
    // Fallback silenzioso all'endpoint art_crop di Scryfall
  }

  return fallback;
}

