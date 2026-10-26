import React from 'react';

export const handleNav = (e: React.MouseEvent, callback: () => void) => {
  // Se l'utente usa rotella, CTRL+Click, CMD+Click, Shift+Click o Alt+Click, lascia fare al browser
  if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
  
  // Altrimenti, previene il ricaricamento della pagina e usa la navigazione veloce di React
  e.preventDefault();
  callback();
};
