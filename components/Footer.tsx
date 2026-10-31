import { Coffee } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 py-10 px-6 text-center text-slate-400 text-xs mt-auto">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* SEZIONE DONAZIONI */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-sm mx-auto max-w-3xl">
          <div className="text-left space-y-1.5 flex-1">
            <h3 className="text-base font-bold text-slate-300">Supporta CentMeta</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Il sito è gratuito e senza pubblicità. Se lo trovi utile, un piccolo contributo per mantenere attivi i server è davvero apprezzato!
            </p>
          </div>
          <a
            href="https://ko-fi.com/centmeta"
            data-umami-event="Click Ko-fi Footer"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 flex items-center justify-center gap-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30 px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-sm hover:shadow-amber-500/10 whitespace-nowrap"
          >
            <Coffee className="w-4 h-4" strokeWidth={2.5} />
            Supportami su Ko-fi
          </a>
        </div>

        {/* Link Utili */}
        <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2.5 text-xs sm:text-sm font-semibold pb-2">
          <a 
            href="/community" 
            className="text-slate-400 hover:text-blue-400 transition-colors"
          >
            Community
          </a>
          <span className="text-slate-700 hidden sm:inline" aria-hidden="true">•</span>
          <a 
            href="/about" 
            className="text-slate-400 hover:text-blue-400 transition-colors"
          >
            Il Progetto
          </a>
          <span className="text-slate-700 hidden sm:inline" aria-hidden="true">•</span>
          <a 
            href="/status" 
            className="text-slate-400 hover:text-blue-400 transition-colors"
          >
            Stato del Sistema
          </a>
          <span className="text-slate-700 hidden sm:inline" aria-hidden="true">•</span>
          <a 
            href="/changelog" 
            className="text-slate-400 hover:text-blue-400 transition-colors"
          >
            Changelog
          </a>
          <span className="text-slate-700 hidden sm:inline" aria-hidden="true">•</span>
          <a 
            href="/legal" 
            className="text-slate-400 hover:text-blue-400 transition-colors"
          >
            Privacy & Note Legali
          </a>
          <span className="text-slate-700 hidden sm:inline" aria-hidden="true">•</span>
          <a 
            href="https://github.com/sirfilips" 
            data-umami-event="Click GitHub Footer"
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 shrink-0">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            GitHub
          </a>
        </div>

        {/* Crediti e Boilerplate Legale */}
        <div className="pt-6 border-t border-slate-800/60 space-y-4">
          
          <div className="text-[10px] text-slate-500 leading-relaxed max-w-3xl mx-auto space-y-1.5">
            <p>
              CentMeta è un contenuto amatoriale non ufficiale consentito dalle Linee guida sui contenuti amatoriali. Non è approvato né autorizzato da Wizards. Parte dei materiali utilizzati è proprietà di Wizards of the Coast. © Wizards of the Coast LLC.
            </p>
            <p>
              CentMeta is unofficial Fan Content permitted under the Fan Content Policy. Not approved/endorsed by Wizards. Portions of the materials used are property of Wizards of the Coast. ©Wizards of the Coast LLC.
            </p>
          </div>

          <p className="text-sm font-bold text-slate-300 pt-2">
            CentMeta © {currentYear} — Sviluppato da Filippo Zanardi.<br className="sm:hidden" /> Dati provenienti da liste pubbliche su Moxfield e API di Scryfall.
          </p>

        </div>

      </div>
    </footer>
  );
}
