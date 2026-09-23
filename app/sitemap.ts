import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://centmeta.it';

  // 1. La rotta principale (Homepage)
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];

  try {
    // 2. Interroghiamo il backend per ottenere tutti i comandanti
    const res = await fetch(`${baseUrl}/api/commanders?filtro_tempo=Tutti i tempi`, { 
        next: { revalidate: 86400 } // La cache di Next.js si aggiorna ogni 24 ore
    });
    
    if (!res.ok) throw new Error('Backend non raggiungibile');
    const commanders = await res.json();

    // 3. Generiamo un URL per ogni singolo comandante
    const commanderRoutes = commanders.map((cmd: any) => ({
      url: `${baseUrl}/commander/${encodeURIComponent(cmd.comandante)}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    return [...routes, ...commanderRoutes];
  } catch (error) {
    console.error("Errore sitemap:", error);
    return routes; // Se il backend dorme, indicizza almeno la home
  }
}