'use client';
import React from 'react';
import Image from 'next/image';
import Footer from '../../components/Footer';
import ScrollToTop from '../../components/ScrollToTop';

export default function Changelog() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      
      {/* Header Allineato al Contenuto */}
      <header className="bg-slate-900 border-b border-slate-800 shadow-lg relative z-50">
        <div className="max-w-[1000px] w-full mx-auto py-3 md:py-4 px-4 md:px-8 flex justify-center sm:justify-start">
          <a href="/" className="w-36 sm:w-48 cursor-pointer hover:opacity-80 transition-opacity">
            <Image 
              src="/logo.png" 
              alt="CentMeta Logo" 
              width={300} 
              height={100} 
              priority
              className="w-full h-auto object-contain"
            />
          </a>
        </div>
      </header>

      <div className="flex-grow pb-24 max-w-[1000px] w-full mx-auto px-4 md:px-8 mt-12">
        
        <a href="/" className="text-sm md:text-base font-bold text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-2 mb-10 w-fit">
          ← Torna alla Dashboard
        </a>

        <div className="mb-12">
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-3 tracking-tight">Note di Rilascio</h1>
          <p className="text-base lg:text-lg text-slate-400">Cronologia degli aggiornamenti, ottimizzazioni e nuove funzionalità di CentMeta.</p>
        </div>

        {/* Blocco Versione v2.5.0 (NUOVA) */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 sm:p-10 lg:p-14 shadow-2xl relative isolate overflow-hidden mb-12 space-y-12 lg:space-y-16">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-600 z-10"></div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/80 pb-6 gap-2">
            <h2 className="text-2xl lg:text-3xl font-bold text-amber-400 flex items-center gap-3">
              v2.5.0 - Official Moxfield API, Privacy & Backend Hardening
            </h2>
            <span className="text-sm lg:text-base bg-amber-900/30 text-amber-300 px-4 py-1.5 rounded-full font-bold w-fit border border-amber-500/30">
              23 Settembre 2026
            </span>
          </div>
          
          <div className="space-y-10 lg:space-y-12">
            
            {/* Sezione Moxfield & API */}
            <div>
              <h3 className="text-lg lg:text-xl font-bold text-slate-200 mb-5 border-l-4 border-orange-500 pl-4">
                Integrazione Ufficiale Moxfield
              </h3>
              <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-300 leading-relaxed">
                <li className="flex gap-3"><span className="text-orange-500 font-bold">•</span> <div><strong className="text-slate-200">Accesso Autorizzato:</strong> CentMeta ha ottenuto l'autorizzazione ufficiale dal team di Moxfield per l'interrogazione delle loro API pubbliche, rendendo la raccolta dati 100% conforme ai loro Termini di Servizio (ToS).</div></li>
                <li className="flex gap-3"><span className="text-orange-500 font-bold">•</span> <div><strong className="text-slate-200">Rate Limiting Globale:</strong> Abbandonato il framework di scraping parallelo (cloudscraper) a favore di un estrattore sequenziale (requests) guidato da un rate limiter matematico basato su <code>time.monotonic()</code>, che garantisce il rispetto assoluto delle frequenze di connessione concordate.</div></li>
                <li className="flex gap-3"><span className="text-orange-500 font-bold">•</span> <div><strong className="text-slate-200">Gestione Retry e Backoff:</strong> Il motore di download è stato irrobustito con logiche di attesa incrementale in caso di colli di bottiglia (Status 429) e un sistema di *fail-safe* che previene scritture sul database locale in caso di instabilità di rete.</div></li>
              </ul>
            </div>

            {/* Sezione Privacy e GDPR */}
            <div>
              <h3 className="text-lg lg:text-xl font-bold text-slate-200 mb-5 border-l-4 border-blue-400 pl-4">
                Privacy, GDPR e Compliance
              </h3>
              <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-300 leading-relaxed">
                <li className="flex gap-3"><span className="text-blue-400 font-bold">•</span> <div><strong className="text-slate-200">Data Minimization:</strong> Lo schema del database è stato completamente anonimizzato. Non viene più salvato il "nome" assegnato al mazzo dal creatore. Il sistema conserva esclusivamente l'identificativo alfanumerico pubblico, il comandante e le liste delle carte.</div></li>
                <li className="flex gap-3"><span className="text-blue-400 font-bold">•</span> <div><strong className="text-slate-200">Pagina Legale Ristrutturata:</strong> Pubblicata una sezione "Privacy e Note Legali" esaustiva che definisce ruoli, titolarità (inclusa la gestione dei log tramite Cloudflare) e procedure GDPR (Art. 17 e 21).</div></li>
                <li className="flex gap-3"><span className="text-blue-400 font-bold">•</span> <div><strong className="text-slate-200">Canale di Contatto Ufficiale:</strong> Attivato un indirizzo email dedicato alle comunicazioni legali ed esercizio dei diritti privacy (privacy@centmeta.it) ospitato su server OVHcloud europei e con instradamento protetto.</div></li>
              </ul>
            </div>

            {/* Sezione GitHub & Security */}
            <div>
              <h3 className="text-lg lg:text-xl font-bold text-slate-200 mb-5 border-l-4 border-purple-400 pl-4">
                Sicurezza Infrastrutturale
              </h3>
              <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-300 leading-relaxed">
                <li className="flex gap-3"><span className="text-purple-400 font-bold">•</span> <div><strong className="text-slate-200">Gestione Segreti (Dotenv):</strong> Implementazione del pattern `Environment Variables` per iniettare l'API Key (User-Agent) di Moxfield a runtime tramite servizio systemd, separando il codice sorgente dalle credenziali.</div></li>
                <li className="flex gap-3"><span className="text-purple-400 font-bold">•</span> <div><strong className="text-slate-200">Blindatura Repository:</strong> Ottimizzati i file <code>.gitignore</code> sia per il comparto Next.js che FastAPI, garantendo l'assoluta esclusione di database SQLite, log di sistema e chiavi ambientali dai push su GitHub.</div></li>
              </ul>
            </div>

          </div>
        </div>

        {/* Blocco Versione v2.0.1 */}
        <div className="bg-slate-900/20 border border-slate-800/60 rounded-3xl p-6 sm:p-10 lg:p-14 shadow-lg relative isolate overflow-hidden opacity-90 hover:opacity-100 transition-opacity mb-12 space-y-12 lg:space-y-16">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-600 z-10"></div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/80 pb-6 gap-2">
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-400 flex items-center gap-3 group-hover:text-emerald-400 transition-colors">
              v2.0.1 - Quality of Life, Desktop UI e Fix Visivi
            </h2>
            <span className="text-sm lg:text-base bg-slate-900/50 text-slate-400 px-4 py-1.5 rounded-full font-medium w-fit border border-slate-800">
              21 Settembre 2026
            </span>
          </div>
          
          <div className="space-y-10 lg:space-y-12">
            
            {/* Sezione Interattività */}
            <div>
              <h3 className="text-lg lg:text-xl font-bold text-slate-300 mb-5 border-l-4 border-slate-600 pl-4">
                Interattività e Analitica
              </h3>
              <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-400 leading-relaxed">
                <li className="flex gap-3"><span className="text-slate-500 font-bold">•</span> <div><strong className="text-slate-300">Filtri Dinamici per Tipologia:</strong> La barra della "Composizione Media" è ora completamente interattiva. Cliccando sui segmenti colorati o sulle etichette sottostanti (es. "Creature" o "Istantanei"), la pagina scorrerà automaticamente impostando il filtro corrispondente sulle carte.</div></li>
                <li className="flex gap-3"><span className="text-slate-500 font-bold">•</span> <div><strong className="text-slate-300">Ordinamento Intelligente:</strong> L'ordine dei colori nella barra e delle etichette testuali è ora sincronizzato in base alla reale frequenza delle carte. Inoltre, la categoria "Terre" viene costantemente forzata in ultima posizione per non distorcere visivamente l'analisi delle altre tipologie.</div></li>
              </ul>
            </div>

            {/* Sezione UI Desktop */}
            <div>
              <h3 className="text-lg lg:text-xl font-bold text-slate-300 mb-5 border-l-4 border-slate-600 pl-4">
                Design e Ottimizzazione Desktop
              </h3>
              <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-400 leading-relaxed">
                <li className="flex gap-3"><span className="text-slate-500 font-bold">•</span> <div><strong className="text-slate-300">Hero Section Espansa:</strong> Riprogettata l'intestazione principale per sfruttare al meglio gli schermi larghi (PC/Desktop). Introdotta un'illuminazione ambientale (glow) di sfondo e un gradiente dinamico per conferire maggiore profondità tridimensionale al sito.</div></li>
                <li className="flex gap-3"><span className="text-slate-500 font-bold">•</span> <div><strong className="text-slate-300">Coerenza Iconografica:</strong> Il pulsante "Torna in alto" (Scroll to Top) è stato aggiornato, sostituendo il carattere testuale con l'iconografia ufficiale <i>lucide-react</i> per uniformità con il resto della piattaforma.</div></li>
              </ul>
            </div>

            {/* Sezione Bug Fixes */}
            <div>
              <h3 className="text-lg lg:text-xl font-bold text-slate-300 mb-5 border-l-4 border-slate-600 pl-4">
                Correzioni Visive (Bug Fixes)
              </h3>
              <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-400 leading-relaxed">
                <li className="flex gap-3"><span className="text-slate-500 font-bold">•</span> <div><strong className="text-slate-300">Fix Sbordamento WebKit:</strong> Risolta una storica criticità di rendering sui browser Apple/WebKit. L'immagine di sfondo sfocata della carta analizzata non "sbrodola" più al di fuori dei bordi arrotondati del contenitore principale.</div></li>
                <li className="flex gap-3"><span className="text-slate-500 font-bold">•</span> <div><strong className="text-slate-300">Allineamento Caroselli:</strong> Ricalcolate millimetricamente le posizioni delle frecce di scorrimento laterale dei caroselli per essere sempre centrate rispetto agli artwork delle carte.</div></li>
                <li className="flex gap-3"><span className="text-slate-500 font-bold">•</span> <div><strong className="text-slate-300">Z-Index e Tagli Immagini:</strong> Eliminato l'effetto "taglio" (clipping) che colpiva la sommità delle carte durante l'animazione di ingrandimento col mouse. Corretto inoltre l'ordine di sovrapposizione (z-index) in modo che i comandanti <i>Partner</i> non vengano coperti dalle carte adiacenti al passaggio del cursore.</div></li>
              </ul>
            </div>

          </div>
        </div>

        {/* Blocco Versione v2.0.0 */}
        <div className="bg-slate-900/10 border border-slate-800/40 rounded-3xl p-6 sm:p-10 lg:p-14 shadow-sm relative isolate overflow-hidden opacity-75 hover:opacity-100 transition-opacity mb-12 space-y-12 lg:space-y-16">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-600 z-10"></div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/80 pb-6 gap-2">
            <h2 className="text-xl lg:text-2xl font-bold text-slate-500 flex items-center gap-3">
              v2.0.0 - Architettura Dinamica, SEO e Social
            </h2>
            <span className="text-xs lg:text-sm bg-slate-900/50 text-slate-500 px-4 py-1.5 rounded-full font-medium w-fit border border-slate-800">
              16 Settembre 2026
            </span>
          </div>
          
          <div className="space-y-10 lg:space-y-12">
            
            {/* Sezione Motori di Ricerca */}
            <div>
              <h3 className="text-lg font-bold text-slate-400 mb-5 border-l-4 border-slate-700 pl-4">
                Visibilità e Motori di Ricerca (SEO)
              </h3>
              <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-500 leading-relaxed">
                <li className="flex gap-3"><span className="text-slate-600 font-bold">•</span> <div><strong className="text-slate-400">Indicizzazione Globale:</strong> CentMeta è ora ufficialmente ottimizzato per essere scansionato e indicizzato dai principali motori di ricerca come Google, Bing, Ecosia e DuckDuckGo.</div></li>
                <li className="flex gap-3"><span className="text-slate-600 font-bold">•</span> <div><strong className="text-slate-400">Mappe del Sito e Gerarchia:</strong> Implementata la generazione automatica delle Sitemap e perfezionata la gerarchia dei titoli delle pagine, permettendo agli algoritmi di ricerca di capire istantaneamente di cosa parla ogni analisi.</div></li>
              </ul>
            </div>

            {/* Sezione Social */}
            <div>
              <h3 className="text-lg font-bold text-slate-400 mb-5 border-l-4 border-slate-700 pl-4">
                Condivisione Social e Link
              </h3>
              <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-500 leading-relaxed">
                <li className="flex gap-3"><span className="text-slate-600 font-bold">•</span> <div><strong className="text-slate-400">Anteprime Avanzate:</strong> Condividendo il link di un comandante su WhatsApp, Discord, Telegram o Facebook, ora appariranno automaticamente il logo del sito, il nome specifico del mazzo e una breve descrizione dedicata.</div></li>
                <li className="flex gap-3"><span className="text-slate-600 font-bold">•</span> <div><strong className="text-slate-400">Link Puliti e Diretti:</strong> Gli indirizzi web del sito sono stati riscritti in un formato definitivo e super leggibile (es. <i>/commander/Phelia</i>), facilitando il salvataggio nei preferiti e la navigazione tra le pagine.</div></li>
              </ul>
            </div>

            {/* Sezione Estetica */}
            <div>
              <h3 className="text-lg font-bold text-slate-400 mb-5 border-l-4 border-slate-700 pl-4">
                Perfezionamenti Estetici (UI/UX)
              </h3>
              <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-500 leading-relaxed">
                <li className="flex gap-3"><span className="text-slate-600 font-bold">•</span> <div><strong className="text-slate-400">Layout Carte su Mobile:</strong> Risolto un problema visivo che creava fastidiosi spazi vuoti irregolari sotto le carte sugli schermi degli smartphone, garantendo ora una griglia compatta e perfettamente proporzionata.</div></li>
                <li className="flex gap-3"><span className="text-slate-600 font-bold">•</span> <div><strong className="text-slate-400">Schermata Iniziale:</strong> Snellita l'intestazione principale (Hero Section) della dashboard per renderla meno invasiva, più moderna e concentrata sui contenuti statistici.</div></li>
              </ul>
            </div>

          </div>
        </div>

        {/* Blocco Versione v1.5.1 */}
        <div className="bg-slate-900/5 border border-slate-800/20 rounded-3xl p-6 sm:p-10 lg:p-14 shadow-none relative isolate overflow-hidden opacity-50 hover:opacity-100 transition-opacity mb-12 space-y-12 lg:space-y-16">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-600 to-slate-800 z-10"></div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/50 pb-6 gap-2">
            <h2 className="text-lg lg:text-xl font-bold text-slate-600 flex items-center gap-3">
              v1.5.1 - Ottimizzazione Analitica e Revisione UX
            </h2>
            <span className="text-xs bg-slate-900/30 text-slate-600 px-4 py-1.5 rounded-full font-medium w-fit border border-slate-800/50">
              14 Settembre 2026
            </span>
          </div>
          
          <div className="space-y-10 lg:space-y-12">
            
            <div>
              <h3 className="text-base font-bold text-slate-500 mb-5 border-l-4 border-slate-800 pl-4">
                Nuove Metriche Analitiche
              </h3>
              <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-600 leading-relaxed">
                <li className="flex gap-3"><span className="text-slate-700 font-bold">•</span> <div><strong className="text-slate-500">Composizione Media del Mazzo:</strong> Integrato un nuovo diagramma a barre proporzionale che illustra istantaneamente la distribuzione delle tipologie di carte (Creature, Istantanei, Terre, ecc.) per ciascun comandante.</div></li>
                <li className="flex gap-3"><span className="text-slate-700 font-bold">•</span> <div><strong className="text-slate-500">Valori Assoluti e Differenziali:</strong> Aggiunta la visibilità della frequenza assoluta di utilizzo (numero totale di mazzi) accanto ai valori percentuali. Implementata la metrica del delta incrementale positivo (+X) per la vista delle carte in tendenza.</div></li>
              </ul>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-500 mb-5 border-l-4 border-slate-800 pl-4">
                Infrastruttura e Prestazioni
              </h3>
              <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-600 leading-relaxed">
                <li className="flex gap-3"><span className="text-slate-700 font-bold">•</span> <div><strong className="text-slate-500">Motore SQL Nativo:</strong> Riscrittura architetturale delle logiche di estrazione dati. I calcoli massivi (join e aggregazioni) sono stati demandati interamente al livello database (SQLite), bypassando l'elaborazione in-memory di Pandas, con un incremento prestazionale fino all'80%.</div></li>
                <li className="flex gap-3"><span className="text-slate-700 font-bold">•</span> <div><strong className="text-slate-500">Indicizzazione del Database:</strong> Implementata la generazione automatica di indici SQL strutturati all'avvio del server, eliminando i Full Table Scan durante la navigazione temporale.</div></li>
                <li className="flex gap-3"><span className="text-slate-700 font-bold">•</span> <div><strong className="text-slate-500">Connection Pooling HTTP:</strong> Ottimizzate le latenze di rete verso i provider di terze parti (Scryfall) sfruttando sessioni TLS persistenti, riducendo i tempi di risoluzione delle immagini in cache miss.</div></li>
              </ul>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-500 mb-5 border-l-4 border-slate-800 pl-4">
                Interfaccia Utente e Mobile
              </h3>
              <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-600 leading-relaxed">
                <li className="flex gap-3"><span className="text-slate-700 font-bold">•</span> <div><strong className="text-slate-500">Loader Asincrono Globale:</strong> Integrato un sistema di feedback visivo persistente per notificare all'utente le transazioni di rete in corso, supportato da un overlay di transizione opacizzante sulla scheda di analisi.</div></li>
                <li className="flex gap-3"><span className="text-slate-700 font-bold">•</span> <div><strong className="text-slate-500">Revisione Cromatica (Soft Dark):</strong> Migrazione dell'infrastruttura di stili verso una palette desaturata (Pastel Navy) volta a ridurre l'affaticamento visivo e massimizzare il contrasto degli elementi in evidenza.</div></li>
                <li className="flex gap-3"><span className="text-slate-700 font-bold">•</span> <div><strong className="text-slate-500">Ristrutturazione Layout Mobile:</strong> Ottimizzata la scheda analitica del comandante per dispositivi smartphone. Riorganizzati i widget statistici in un flusso verticale compatto e introdotto un meccanismo a comparsa (toggle) per la consultazione del testo Oracle.</div></li>
                <li className="flex gap-3"><span className="text-slate-700 font-bold">•</span> <div><strong className="text-slate-500">Snellimento Intestazione:</strong> Riduzione dell'impronta verticale dell'Header su schermi ridotti, con ridimensionamento dinamico del logo e compattazione degli indicatori statistici globali.</div></li>
              </ul>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-500 mb-5 border-l-4 border-slate-800 pl-4">
                Correzioni e Stabilità (Bug Fixes)
              </h3>
              <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-600 leading-relaxed">
                <li className="flex gap-3"><span className="text-slate-700 font-bold">•</span> <div><strong className="text-slate-500">Persistenza del Focus:</strong> Risolta una criticità architetturale nel processo di rendering React che causava la chiusura involontaria della tastiera mobile e la perdita del focus durante la digitazione nella barra di ricerca.</div></li>
                <li className="flex gap-3"><span className="text-slate-700 font-bold">•</span> <div><strong className="text-slate-500">Posizionamento Viewport (Scroll):</strong> Corretto un difetto di navigazione interno alle Single Page Application; ora la selezione di una carta o comandante forza fluidamente il riposizionamento della visuale all'apice della finestra.</div></li>
                <li className="flex gap-3"><span className="text-slate-700 font-bold">•</span> <div><strong className="text-slate-500">Motore di Calcolo delle Terre:</strong> Perfezionato l'algoritmo di elaborazione backend (Python/SQLite) per riconoscere e sommare dinamicamente copie multiple di una singola carta, garantendo metriche perfette per le Terre Base.</div></li>
              </ul>
            </div>

          </div>
        </div>

      </div>

      <Footer />
      <ScrollToTop />
    </main>
  );
}