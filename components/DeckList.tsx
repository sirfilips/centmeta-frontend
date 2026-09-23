import React from 'react';
// Nuove icone importate da lucide-react
import { ExternalLink, Check } from 'lucide-react';

interface DeckListProps {
  loadingDecks: boolean;
  commanderDecks: any[];
  copiedDeck: string | null;
  setCopiedDeck: (val: string | null) => void;
}

export default function DeckList({ loadingDecks, commanderDecks, copiedDeck, setCopiedDeck }: DeckListProps) {
  if (loadingDecks) {
    return (
      <div className="py-24 text-center">
         <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
         <div className="text-slate-500 text-sm font-medium">Recupero liste in corso...</div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      <div className="p-5 border-b border-slate-800 flex justify-between items-center">
        <span className="font-bold text-sm text-slate-200">Elenco mazzi registrati ({commanderDecks.length})</span>
      </div>
      <div className="divide-y divide-slate-800/50 max-h-[800px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {commanderDecks.length === 0 && (
          <div className="p-8 text-center text-slate-500">Nessuna lista trovata per questo periodo.</div>
        )}
        {commanderDecks.map((deck: any, idx: number) => (
          <div key={idx} className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-slate-800/40 transition-colors gap-4">
            <div>
              <div className="text-sm font-semibold text-slate-200 mb-1">
                Mazzo <span className="text-blue-400 font-mono text-xs ml-1 bg-blue-950/50 px-2 py-0.5 rounded border border-blue-900">ID: {deck.id_moxfield}</span>
              </div>
              <div className="text-xs text-slate-500">
                Ultimo agg: {deck.data_aggiornamento ? new Date(deck.data_aggiornamento).toLocaleDateString() : 'N/D'}
              </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button 
                onClick={() => { 
                  navigator.clipboard.writeText(deck.url); 
                  setCopiedDeck(deck.id_moxfield); 
                  setTimeout(() => setCopiedDeck(null), 2000); 
                }}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold px-4 py-2 rounded-lg transition border border-slate-700 flex-1 sm:flex-none text-center flex items-center justify-center gap-1.5"
              >
                {copiedDeck === deck.id_moxfield ? <>Copiato! <Check className="w-3.5 h-3.5 text-emerald-400" strokeWidth={2.5} /></> : 'Copia Link'}
              </button>
              <a href={deck.url} target="_blank" rel="noopener noreferrer" className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition shadow-md flex-1 sm:flex-none text-center flex items-center justify-center gap-1.5">
                Apri <ExternalLink className="w-3.5 h-3.5 opacity-90" strokeWidth={2.5} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}