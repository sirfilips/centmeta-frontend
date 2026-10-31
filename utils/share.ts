'use client';

/**
 * Condivide un URL usando la Web Share API su dispositivi mobili compatibili,
 * oppure lo copia negli appunti con fallback per contesti HTTP non sicuri.
 * Restituisce `true` se l'URL è stato copiato negli appunti (così il chiamante
 * può mostrare il badge "Link copiato!"), `false` se gestito dal menu nativo o annullato.
 */
export async function shareOrCopyUrl(options: {
  title: string;
  text: string;
  url: string;
}): Promise<boolean> {
  if (typeof window === "undefined") return false;

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile && navigator.share) {
    try {
      await navigator.share(options);
      return false;
    } catch {
      return false;
    }
  }

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(options.url);
      return true;
    }
  } catch {
    // Fallback al textarea temporaneo
  }

  try {
    const textArea = document.createElement("textarea");
    textArea.value = options.url;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    return true;
  } catch {
    return false;
  }
}

