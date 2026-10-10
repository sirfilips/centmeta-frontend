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
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 flex items-center justify-center gap-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30 px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-sm hover:shadow-amber-500/10 whitespace-nowrap"
          >
            <Coffee className="w-4 h-4" strokeWidth={2.5} />
            Supportami su Ko-fi
          </a>
        </div>

        {/* Link Utili */}
        <div className="flex flex-wrap justify-center gap-4 pb-2">
          <a 
            href="/status" 
            className="text-sm font-bold text-slate-300 hover:text-blue-400 transition-all bg-slate-900/50 border border-slate-800 hover:border-blue-900/50 px-6 py-2.5 rounded-xl shadow-sm"
          >
            Stato del Sistema
          </a>
          <a 
            href="/changelog" 
            className="text-sm font-bold text-slate-300 hover:text-blue-400 transition-all bg-slate-900/50 border border-slate-800 hover:border-blue-900/50 px-6 py-2.5 rounded-xl shadow-sm"
          >
            Changelog
          </a>
          <a 
            href="/legal" 
            className="text-sm font-bold text-slate-300 hover:text-blue-400 transition-all bg-slate-900/50 border border-slate-800 hover:border-blue-900/50 px-6 py-2.5 rounded-xl shadow-sm"
          >
            Privacy & Note Legali
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