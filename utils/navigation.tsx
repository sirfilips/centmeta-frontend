import React from 'react';

export const handleNav = (e: React.MouseEvent, callback: () => void) => {
  // Se l'utente usa rotella, CTRL+Click o CMD+Click, lascia che il browser apra la nuova scheda nativamente
  if (e.button === 1 || e.ctrlKey || e.metaKey) return;
  
  // Altrimenti, previene il ricaricamento della pagina e usa la navigazione veloce di React
  e.preventDefault();
  callback();
};