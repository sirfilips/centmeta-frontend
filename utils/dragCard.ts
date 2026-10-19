'use client';
import React from 'react';

/**
 * Gestisce l'inizio del trascinamento (drag) di una carta.
 * Configura il dataTransfer per essere compatibile al 100% con Moxfield, Archidekt e Scryfall,
 * consentendo di rilasciare la carta direttamente su un mazzo aperto in Moxfield.
 */
export function handleCardDragStart(
  e: React.DragEvent,
  cardName: string,
  imageUrl?: string
) {
  if (!cardName) return;

  const scryfallSearchUrl = `https://scryfall.com/search?q=%21%22${encodeURIComponent(cardName)}%22`;

  // 1. text/plain: Nome carta (fondamentale per i deckbuilder)
  e.dataTransfer.setData('text/plain', cardName);

  // 2. text/uri-list: URL immagine o link Scryfall
  if (imageUrl) {
    e.dataTransfer.setData('text/uri-list', imageUrl);
  } else {
    e.dataTransfer.setData('text/uri-list', scryfallSearchUrl);
  }

  // 3. text/html: Tag <a> e <img> compatibile con Scryfall ed EDHREC
  const htmlPayload = `<a href="${scryfallSearchUrl}"><img src="${imageUrl || ''}" alt="${cardName}" data-card-name="${cardName}" /></a>`;
  e.dataTransfer.setData('text/html', htmlPayload);

  // 4. custom MTG mime type se supportato
  try {
    e.dataTransfer.setData('application/x-scryfall-card', cardName);
  } catch {
    // Alcuni browser non consentono mime non standard
  }

  e.dataTransfer.effectAllowed = 'copyLink';
}

