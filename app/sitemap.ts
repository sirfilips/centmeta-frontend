import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://centmeta.it';
  const apiUrl = process.env.API_INTERNAL_URL || 'http://127.0.0.1:8000';

  // 1. Le rotte principali e statiche
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/storico`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/changelog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/status`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/legal`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];

  try {
    // 2. Interroghiamo il backend per ottenere tutti i comandanti
    const res = await fetch(`${apiUrl}/api/commanders?filtro_tempo=${encodeURIComponent('Tutti i tempi')}`, {
      next: { revalidate: 86400 }, // La cache di Next.js si aggiorna ogni 24 ore
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) throw new Error('Backend non raggiungibile');
    const commanders = await res.json();
    if (!Array.isArray(commanders)) throw new Error('Risposta comandanti non valida');

    // 3. Generiamo un URL per ogni singolo comandante valido
    const commanderRoutes = commanders
      .filter((cmd: any) => cmd && typeof cmd.comandante === 'string' && cmd.comandante.trim().length > 0)
      .map((cmd: any) => ({
        url: `${baseUrl}/commander/${encodeURIComponent(cmd.comandante)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));

    return [...routes, ...commanderRoutes];
  } catch (error) {
    console.error("Errore sitemap:", error);
    return routes; // Se il backend dorme, indicizza almeno le rotte statiche
  }
}
