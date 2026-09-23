export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 py-10 px-6 text-center text-slate-400 text-xs">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Link Utili */}
        <div className="flex flex-wrap justify-center gap-4 pb-2">
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
        <div className="pt-4 border-t border-slate-900 space-y-3">
          
          <div className="text-[10px] text-slate-500 leading-relaxed max-w-3xl mx-auto space-y-1">
            <p>
              CentMeta è un contenuto amatoriale non ufficiale consentito dalle Linee guida sui contenuti amatoriali. Non è approvato né autorizzato da Wizards. Parte dei materiali utilizzati è proprietà di Wizards of the Coast. © Wizards of the Coast LLC.
            </p>
            <p>
              CentMeta is unofficial Fan Content permitted under the Fan Content Policy. Not approved/endorsed by Wizards. Portions of the materials used are property of Wizards of the Coast. ©Wizards of the Coast LLC.
            </p>
          </div>

          <p className="text-sm font-bold text-slate-300 mt-4">
            CentMeta © {currentYear} — Sviluppato da Filippo Zanardi. Dati estratti da Moxfield e forniti dalle API di Scryfall.
          </p>

        </div>

      </div>
    </footer>
  );
}