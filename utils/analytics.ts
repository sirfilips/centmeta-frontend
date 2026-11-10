'use client';

/**
 * Helper sicuro per tracciare eventi personalizzati con Umami Analytics.
 * Funziona solo lato client e ignora silenziosamente gli errori se l'adblocker blocca Umami.
 */
export function trackEvent(
  eventName: string,
  eventData?: Record<string, string | number | boolean | null | undefined>
) {
  if (typeof window !== 'undefined' && (window as any).umami) {
    try {
      if (eventData) {
        (window as any).umami.track(eventName, eventData);
      } else {
        (window as any).umami.track(eventName);
      }
    } catch {
      // Ignora silenziosamente errori di tracciamento o blocco script
    }
  }
}
