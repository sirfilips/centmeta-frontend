import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://centmeta.it';
  const apiUrl = process.env.API_INTERNAL_URL || baseUrl;

  // 1. Le rotte principali e statiche
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
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
    {
      url: `${baseUrl}/community`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/community/vota`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/community/classifica`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];

  try {
    // 2. Interroghiamo il backend per ottenere tutti i comandanti
    const res = await fetch(`${apiUrl}/api/commanders?filtro_tempo=${encodeURIComponent('Tutti i tempi')}`, { 
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
    return routes; // Se il backend dorme, indicizza almeno le rotte statiche
  }
}
