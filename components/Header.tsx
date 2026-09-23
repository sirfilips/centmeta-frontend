import Image from 'next/image';
import { ExternalLink } from 'lucide-react'; // <-- Nuova icona per i link esterni

interface HeaderProps {
  filtroTempo: string;
  setFiltroTempo: (val: string) => void;
  onReset: () => void;
  totalDecks?: number;
  lastUpdated?: string | null;
}

export default function Header({ filtroTempo, setFiltroTempo, onReset, totalDecks, lastUpdated }: HeaderProps) {
  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return 'N/D';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateStr;
    }
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 py-3 md:py-4 px-4 md:px-8 flex flex-col lg:flex-row justify-between items-center shadow-lg gap-3 relative z-50">
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 cursor-pointer text-center sm:text-left w-full sm:w-auto" onClick={onReset}>
        
        {/* Logo rimpicciolito su mobile (w-36) e ripristinato su schermi più grandi */}
        <div className="w-36 sm:w-48 lg:w-56 flex-shrink-0">
          <Image 
            src="/logo.png" 
            alt="CentMeta Logo" 
            width={300} 
            height={100} 
            priority
            className="w-full h-auto object-contain mx-auto"
          />
        </div>
        
        {/* Badge statistiche con font e padding ridotti su mobile per non andare a capo inutilmente */}
        <div className="flex flex-row flex-wrap justify-center items-center gap-1.5 sm:gap-2 text-xs text-slate-400 sm:border-l sm:border-slate-700/60 sm:pl-4">
          {totalDecks !== undefined && (
            <div className="bg-slate-800/80 text-blue-400 px-2 py-0.5 md:px-2.5 md:py-1 rounded-md font-bold border border-slate-700/60 text-[10px] md:text-[11px]">
              {totalDecks} mazzi
            </div>
          )}
          {lastUpdated && (
            <div className="text-slate-400 text-[10px] md:text-[11px] bg-slate-950/50 px-2 py-0.5 md:px-2.5 md:py-1 rounded-md border border-slate-800">
              Aggiornato: <span className="text-slate-200 font-medium">{formatDate(lastUpdated)}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 justify-center lg:justify-end w-full lg:w-auto mt-1 lg:mt-0">
        <a 
          href="https://www.centurioncommander.eu/it/home-ita/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] md:text-xs font-bold px-3 py-1.5 md:py-2 rounded-lg transition-colors border border-slate-700 flex items-center gap-1.5 shadow-sm group"
        >
          <span>Sito Ufficiale Centurion</span>
          {/* Sostituita la freccia di testo con l'icona SVG */}
          <ExternalLink className="w-3 h-3 md:w-3.5 md:h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" strokeWidth={2.5} />
        </a>
        
        <select
          value={filtroTempo}
          onChange={(e) => setFiltroTempo(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 md:py-2.5 text-xs md:text-sm font-semibold w-full sm:w-56 focus:outline-none focus:border-blue-500 text-slate-200 shadow-inner"
        >
          <option value="Ultimi 7 giorni">Ultimi 7 giorni</option>
          <option value="Ultimi 30 giorni">Ultimi 30 giorni</option>
          <option value="Ultimi 3 mesi">Ultimi 3 mesi</option>
          <option value="Ultimi 6 mesi">Ultimi 6 mesi</option>
          <option value="Ultimo anno">Ultimo anno</option>
          <option value="Tutti i tempi">Tutti i tempi</option>
        </select>
      </div>
    </header>
  );
}