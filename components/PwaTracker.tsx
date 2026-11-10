'use client';

import { useEffect } from 'react';
import { trackEvent } from '../utils/analytics';

/**
 * Monitora il ciclo di vita della PWA e invia eventi anonimi a Umami:
 * 1. "PWA Installata": quando l'utente completa l'installazione tramite browser o prompt nativo.
 * 2. "PWA Apertura Standalone": quando l'applicazione viene lanciata direttamente dalla schermata Home (iOS o Android).
 * 3. "PWA Prompt Idoneo": quando il browser segnala l'idoneità all'installazione (Chrome/Edge/Android).
 */
export default function PwaTracker() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Evento nativo di installazione completata (Chrome/Edge/Android)
    const handleAppInstalled = () => {
      trackEvent('PWA Installata');
    };

    // 2. Rilevamento disponibilità del prompt di installazione (una volta per sessione)
    const handleBeforeInstallPrompt = () => {
      try {
        const sessionKey = 'cm_pwa_prompt_eligible';
        if (!sessionStorage.getItem(sessionKey)) {
          sessionStorage.setItem(sessionKey, '1');
          trackEvent('PWA Prompt Idoneo');
        }
      } catch {
        // Silenzioso se sessionStorage è bloccato
      }
    };

    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 3. Rilevamento apertura da Home Screen in modalità standalone (iOS / Android / Desktop PWA)
    try {
      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true ||
        document.referrer.includes('android-app://');

      if (isStandalone) {
        const sessionKey = 'cm_pwa_standalone_tracked';
        if (!sessionStorage.getItem(sessionKey)) {
          sessionStorage.setItem(sessionKey, '1');
          const isIOS = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
          trackEvent('PWA Apertura Standalone', {
            platform: isIOS ? 'ios' : 'android_or_desktop',
          });
        }
      }
    } catch {
      // Silenzioso
    }

    return () => {
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  return null;
}
