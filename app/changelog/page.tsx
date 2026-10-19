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

        {/* Blocco Versione v3.0.0 (NUOVA) */}
        <div className="bg-slate-900/50 border border-slate-700/60 rounded-3xl p-6 sm:p-10 lg:p-14 shadow-2xl relative isolate overflow-hidden mb-12 space-y-12 lg:space-y-16">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 z-10"></div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-700/80 pb-6 gap-2">
            <h2 className="text-2xl lg:text-3xl font-bold text-emerald-400 flex items-center gap-3">
              v3.0.0 - Architettura B-Tree, Decoupling Cache & Deep Linking
            </h2>
            <span className="text-sm lg:text-base bg-emerald-900/30 text-emerald-300 px-4 py-1.5 rounded-full font-bold w-fit border border-emerald-500/30">
              19 Ottobre 2026
            </span>
          </div>
          
          <div className="space-y-10 lg:space-y-12">
            
            {/* Sezione Database & Query Performance */}
            <div>
              <h3 className="text-lg lg:text-xl font-bold text-slate-200 mb-5 border-l-4 border-emerald-500 pl-4">
                Prestazioni Database e Ricerca Indicizzata B-Tree
              </h3>
              <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-300 leading-relaxed">
                <li className="flex gap-3"><span className="text-emerald-500 font-bold">•</span> <div><strong className="text-slate-200">Range Scan Diretto su B-Tree SQLite:</strong> Riscritte integralmente le interrogazioni temporali sul database, sostituendo la valutazione runtime <code>datetime(data_aggiornamento)</code> con filtri lessicografici ISO-8601 conformi (<code>strftime('%Y-%m-%dT%H:%M:%S', 'now', ...)</code>). L'ottimizzatore di SQLite passa così da una scansione lineare dell'intera tabella (<code>SCAN</code>) a una ricerca per intervallo B-Tree a tempo logaritmico (<code>SEARCH USING INDEX</code>), abbattendo drasticamente i tempi di esecuzione e l'occupazione CPU sul server.</div></li>
                <li className="flex gap-3"><span className="text-emerald-500 font-bold">•</span> <div><strong className="text-slate-200">Copertura Completa Indici:</strong> Verificata e consolidata la topologia degli indici sulle tabelle <code>decks</code> e <code>deck_cards</code>, garantendo tempi di aggregazione sub-millisecondo e scalabilità architetturale a prova di futuro con l'aumentare dei mazzi archiviati.</div></li>
              </ul>
            </div>

            {/* Sezione Cache & Memoria */}
            <div>
              <h3 className="text-lg lg:text-xl font-bold text-slate-200 mb-5 border-l-4 border-teal-500 pl-4">
                Architettura Cache e Gestione Memoria (Decoupled Pagination)
              </h3>
              <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-300 leading-relaxed">
                <li className="flex gap-3"><span className="text-teal-500 font-bold">•</span> <div><strong className="text-slate-200">Disaccoppiamento Cache dalla Paginazione:</strong> Riorganizzata la memorizzazione in memoria nell'endpoint delle statistiche mazzo. La cache memorizza ora l'aggregato completo per intervallo temporale e comandante; la paginazione (<code>offset</code> e <code>limit</code>) viene eseguita istantaneamente tramite slicing in memoria nello strato endpoint. Questo azzera i cache-miss quando l'utente naviga tra le pagine dei mazzi o cambia ordinamento, eliminando query ridondanti al database.</div></li>
                <li className="flex gap-3"><span className="text-teal-500 font-bold">•</span> <div><strong className="text-slate-200">Pre-warming Deferito e Flessibile:</strong> Ottimizzata la procedura di preriscaldamento cache all'avvio dell'applicazione. Il warm-up viene avviato in background con un ritardo controllato per consentire al server FastAPI di aprire immediatamente le porte HTTP e accettare connessioni senza bloccare l'infrastruttura.</div></li>
              </ul>
            </div>

            {/* Sezione Deep Linking & UX */}
            <div>
              <h3 className="text-lg lg:text-xl font-bold text-slate-200 mb-5 border-l-4 border-cyan-400 pl-4">
                Navigazione, Deep Linking e Sincronizzazione Temporale
              </h3>
              <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-300 leading-relaxed">
                <li className="flex gap-3"><span className="text-cyan-400 font-bold">•</span> <div><strong className="text-slate-200">Sincronizzazione Bidirezionale dell'Intervallo (<code>?periodo=</code>):</strong> L'intervallo temporale selezionato dall'utente è ora sincronizzato direttamente nei parametri dell'URL. Il filtro persiste con precisione al ricaricamento del browser (F5), alla navigazione nella cronologia e al clic sul pulsante "Riprova" in caso di disconnessioni di rete.</div></li>
                <li className="flex gap-3"><span className="text-cyan-400 font-bold">•</span> <div><strong className="text-slate-200">Deep Linking Comandanti Fuori Finestra:</strong> Risolta l'anomalia di condivisione dei link per comandanti presenti in archi temporali estesi (es. 3 o 6 mesi) ma privi di liste negli ultimi 30 giorni: condividendo l'URL, chi riceve il collegamento atterra direttamente sul periodo corretto senza visualizzare schermate con zero mazzi.</div></li>
                <li className="flex gap-3"><span className="text-cyan-400 font-bold">•</span> <div><strong className="text-slate-200">Disaccoppiamento Ordinamenti e Retrocompatibilità:</strong> Separati chiaramente i parametri URL per l'ordinamento dei comandanti (<code>csort</code>) e delle carte (<code>cardsort</code>), preservando piena retrocompatibilità con i link precedentemente condivisi.</div></li>
                <li className="flex gap-3"><span className="text-cyan-400 font-bold">•</span> <div><strong className="text-slate-200">Empty State Interattivo Integrato:</strong> Sviluppato un componente unificato per le ricerche senza risultati con contatore di clic, citazioni a rotazione di Fblthp e pulsante di ripristino rapido dei filtri con icone SVG native tramite <code>lucide-react</code>.</div></li>
              </ul>
            </div>

            {/* Sezione Hardening, Backup & Toolchain */}
            <div>
              <h3 className="text-lg lg:text-xl font-bold text-slate-200 mb-5 border-l-4 border-indigo-400 pl-4">
                Hardening Sicurezza, Backup Preventivo & Toolchain
              </h3>
              <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-300 leading-relaxed">
                <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span> <div><strong className="text-slate-200">Protezione Amministrativa con Header Segreto:</strong> Blindato l'endpoint di rimozione mazzi (<code>/api/admin/remove-deck</code>), migrando la chiave di sicurezza dall'URL all'header HTTP <code>X-Admin-Secret</code>, occultando l'endpoint dalla documentazione OpenAPI pubblica e mascherando i messaggi di errore interni.</div></li>
                <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span> <div><strong className="text-slate-200">Backup Preventivo Snapshot pre-scrittura:</strong> Introdotta nello scraper notturno la generazione di una copia snapshot (<code>centurion.db.bak</code>) tramite <code>sqlite3.backup()</code> prima dell'avvio della transazione di aggiornamento/rimozione, garantendo un punto di ripristino coerente in caso di anomalie di sistema.</div></li>
                <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span> <div><strong className="text-slate-200">Resilienza Metadati Scryfall (Fail-Safe):</strong> Integrata una politica di tolleranza ai guasti: rallentamenti o rate limit transitori verso le API Scryfall non provocano più l'esclusione accidentale dei comandanti censiti dal catalogo.</div></li>
                <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span> <div><strong className="text-slate-200">Modernizzazione Toolchain TypeScript:</strong> Aggiornata la risoluzione dei moduli in <code>tsconfig.json</code> a <code>moduleResolution: "bundler"</code>, eliminando gli avvisi di deprecazione e garantendo piena compatibilità con TypeScript 6 e 7.</div></li>
              </ul>
            </div>

          </div>
        </div>

        {/* Blocco Versione v2.8.0 */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 sm:p-10 lg:p-14 shadow-xl relative isolate overflow-hidden mb-12 space-y-12 lg:space-y-16 opacity-90 hover:opacity-100 transition-opacity">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-purple-700 z-10"></div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/80 pb-6 gap-2">
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-400 flex items-center gap-3 group-hover:text-violet-400 transition-colors">
              v2.8.0 - Concorrenza Database & Resilienza Scraper
            </h2>
            <span className="text-sm lg:text-base bg-slate-900/50 text-slate-400 px-4 py-1.5 rounded-full font-medium w-fit border border-slate-800">
              09 Ottobre 2026
            </span>
          </div>
          
          <div className="space-y-10 lg:space-y-12">
            
            {/* Sezione Concorrenza SQLite */}
            <div>
              <h3 className="text-lg lg:text-xl font-bold text-slate-300 mb-5 border-l-4 border-slate-600 pl-4">
                Concorrenza e Zero Downtime
              </h3>
              <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-400 leading-relaxed">
                <li className="flex gap-3"><span className="text-slate-500 font-bold">•</span> <div><strong className="text-slate-300">Abilitazione WAL Mode (Write-Ahead Logging):</strong> Il database SQLite è stato migrato al protocollo WAL. Questa architettura consente ora l'accesso simultaneo di infiniti lettori mentre lo scraper notturno esegue operazioni di scrittura, eliminando i colli di bottiglia e garantendo zero tempi di inattività (downtime) durante l'allineamento dei dati.</div></li>
                <li className="flex gap-3"><span className="text-slate-500 font-bold">•</span> <div><strong className="text-slate-300">Risoluzione Timestamp:</strong> Affinata l'estrazione dell'orario di ultimo aggiornamento esposto nella dashboard di monitoraggio, integrando la lettura del file temporaneo WAL per restituire un riscontro temporale sempre sincronizzato al secondo.</div></li>
              </ul>
            </div>

            {/* Sezione Resilienza Scraper */}
            <div>
              <h3 className="text-lg lg:text-xl font-bold text-slate-300 mb-5 border-l-4 border-slate-600 pl-4">
                Resilienza dell'Estrattore Dati
              </h3>
              <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-400 leading-relaxed">
                <li className="flex gap-3"><span className="text-slate-500 font-bold">•</span> <div><strong className="text-slate-300">Prevenzione da Eliminazioni Massive:</strong> Introdotto un rigoroso meccanismo di salvaguardia (safety check). Qualora l'API di Moxfield restituisse anomalie o timeout estesi durante la paginazione, il sistema preserverà l'integrità del database locale, interrompendo la sincronizzazione e impedendo l'eliminazione accidentale dei mazzi.</div></li>
                <li className="flex gap-3"><span className="text-slate-500 font-bold">•</span> <div><strong className="text-slate-300">Ottimizzazione Dry-Run:</strong> L'ambiente di test isolato (dry-run) è stato blindato. È ora possibile avviare simulazioni di allineamento e leggere file JSON storici senza alcun rischio di alterare le tabelle SQL in produzione.</div></li>
              </ul>
            </div>

            {/* Sezione Thread Safety */}
            <div>
              <h3 className="text-lg lg:text-xl font-bold text-slate-300 mb-5 border-l-4 border-slate-600 pl-4">
                Sicurezza in Memoria e Thread-Safety
              </h3>
              <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-400 leading-relaxed">
                <li className="flex gap-3"><span className="text-slate-500 font-bold">•</span> <div><strong className="text-slate-300">Cache Scryfall Isolato:</strong> Ristrutturata l'architettura di scrittura dei file temporanei sfruttando il PID (Process ID) e il Thread ID univoci. Due thread concorrenti non potranno mai più sovrascrivere lo stesso blocco JSON in memoria, azzerando le probabilità di corruzione dei dati.</div></li>
                <li className="flex gap-3"><span className="text-slate-500 font-bold">•</span> <div><strong className="text-slate-300">Negative Cache Dinamica:</strong> Rivista la logica di memorizzazione temporanea delle carte mancanti. Un errore transitorio (timeout o 429) dai server di Scryfall non causerà più l'occultamento di una carta per 24 ore: l'API riproverà in modo proattivo al caricamento successivo.</div></li>
              </ul>
            </div>

          </div>
        </div>

        {/* Blocco Versione v2.7.0 */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 sm:p-10 lg:p-14 shadow-xl relative isolate overflow-hidden mb-12 space-y-12 lg:space-y-16 opacity-90 hover:opacity-100 transition-opacity">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-rose-700 z-10"></div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/80 pb-6 gap-2">
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-400 flex items-center gap-3 group-hover:text-red-400 transition-colors">
              v2.7.0 - Monitoraggio Servizi, GDPR Oblio & Fix UX
            </h2>
            <span className="text-sm lg:text-base bg-slate-900/50 text-slate-400 px-4 py-1.5 rounded-full font-medium w-fit border border-slate-800">
              04 Ottobre 2026
            </span>
          </div>
          
          <div className="space-y-10 lg:space-y-12">
            
            {/* Sezione Stato Servizi */}
            <div>
              <h3 className="text-lg lg:text-xl font-bold text-slate-300 mb-5 border-l-4 border-slate-600 pl-4">
                Dashboard "Stato del Sistema" (Uptime Monitoring)
              </h3>
              <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-400 leading-relaxed">
                <li className="flex gap-3"><span className="text-slate-500 font-bold">•</span> <div><strong className="text-slate-300">Monitoraggio API 24/7:</strong> Introdotta una nuova dashboard pubblica dedicata al monitoraggio dello stato di salute in tempo reale di Moxfield e Scryfall. L'infrastruttura backend interroga periodicamente gli endpoint esterni garantendo piena trasparenza operativa.</div></li>
                <li className="flex gap-3"><span className="text-slate-500 font-bold">•</span> <div><strong className="text-slate-300">Cronologia Visiva (48 Ore):</strong> Sviluppata un'interfaccia a segmenti per monitorare lo storico degli ultimi due giorni, facilitando l'individuazione di picchi di latenza o interruzioni temporanee dei servizi esterni.</div></li>
                <li className="flex gap-3"><span className="text-slate-500 font-bold">•</span> <div><strong className="text-slate-300">Trasparenza di Allineamento:</strong> La piattaforma espone ora l'orario certificato in cui l'ecosistema locale è stato sincronizzato per l'ultima volta con le fonti pubbliche.</div></li>
              </ul>
            </div>

            {/* Sezione GDPR & Sicurezza */}
            <div>
              <h3 className="text-lg lg:text-xl font-bold text-slate-300 mb-5 border-l-4 border-slate-600 pl-4">
                Integrità Dati e Diritto all'Oblio (GDPR)
              </h3>
              <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-400 leading-relaxed">
                <li className="flex gap-3"><span className="text-slate-500 font-bold">•</span> <div><strong className="text-slate-300">Infrastruttura di Blacklisting:</strong> Sviluppata un'architettura backend per la gestione dell'Oblio Permanente. I mazzi rimossi per conformità privacy sono esclusi dai cicli di scraping futuri e disaccoppiati in modo irreversibile dall'aggregazione.</div></li>
              </ul>
            </div>

            {/* Sezione Fix UX */}
            <div>
              <h3 className="text-lg lg:text-xl font-bold text-slate-300 mb-5 border-l-4 border-slate-600 pl-4">
                User Experience e Navigazione
              </h3>
              <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-400 leading-relaxed">
                <li className="flex gap-3"><span className="text-slate-500 font-bold">•</span> <div><strong className="text-slate-300">Ripristino Middle-Click:</strong> Ristrutturata l'architettura del menù di navigazione (Header) tramite elementi semantici. Le operazioni di apertura in background (Middle-Click o Ctrl/Cmd + Clic) sono ora supportate nativamente.</div></li>
              </ul>
            </div>

          </div>
        </div>

        {/* Blocco Versione v2.6.0 */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 sm:p-10 lg:p-14 shadow-xl relative isolate overflow-hidden mb-12 space-y-12 lg:space-y-16 opacity-90 hover:opacity-100 transition-opacity">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-600 z-10"></div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/80 pb-6 gap-2">
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-400 flex items-center gap-3 group-hover:text-amber-400 transition-colors">
              v2.6.0 - Filtri Avanzati, Mana Font & Navigazione
            </h2>
            <span className="text-sm lg:text-base bg-slate-900/50 text-slate-400 px-4 py-1.5 rounded-full font-medium w-fit border border-slate-800">
              27 Settembre 2026
            </span>
          </div>
          
          <div className="space-y-10 lg:space-y-12">
            
            {/* Sezione Filtri ed Exact Match */}
            <div>
              <h3 className="text-lg lg:text-xl font-bold text-slate-300 mb-5 border-l-4 border-slate-600 pl-4">
                Filtraggio Cromatico (Exact Match)
              </h3>
              <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-400 leading-relaxed">
                <li className="flex gap-3"><span className="text-slate-500 font-bold">•</span> <div><strong className="text-slate-300">Query Restrittive (AND):</strong> Implementata una logica di filtro rigorosa basata sull'identità di colore. Il sistema estrae esclusivamente le carte corrispondenti all'esatta combinazione cromatica richiesta, bloccando sovrapposizioni non desiderate.</div></li>
                <li className="flex gap-3"><span className="text-slate-500 font-bold">•</span> <div><strong className="text-slate-300">Estensione Dashboard:</strong> Il meccanismo di classificazione cromatica è stato esteso alle dashboard riepilogative, permettendo analisi verticali sulle tendenze dei Comandanti.</div></li>
              </ul>
            </div>

            {/* Sezione Design */}
            <div>
              <h3 className="text-lg lg:text-xl font-bold text-slate-300 mb-5 border-l-4 border-slate-600 pl-4">
                Integrazione Design Ufficiale
              </h3>
              <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-400 leading-relaxed">
                <li className="flex gap-3"><span className="text-slate-500 font-bold">•</span> <div><strong className="text-slate-300">Libreria Mana Font:</strong> Deprecata la simbologia testuale a favore del pacchetto vettoriale standard di mercato (Mana Font), garantendo uniformità estetica e professionale nell'esposizione delle tipologie di carte.</div></li>
              </ul>
            </div>

            {/* Sezione Bug Fixes e Storia */}
            <div>
              <h3 className="text-lg lg:text-xl font-bold text-slate-300 mb-5 border-l-4 border-slate-600 pl-4">
                Routing e Stato Applicativo
              </h3>
              <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-400 leading-relaxed">
                <li className="flex gap-3"><span className="text-slate-500 font-bold">•</span> <div><strong className="text-slate-300">Risoluzione Disallineamenti di Stato:</strong> Sistemata l'interazione con l'History API del browser. Il meccanismo di gestione dello stato React previene ora conflitti URL durante la navigazione regressiva o l'apertura asincrona di viste.</div></li>
              </ul>
            </div>

          </div>
        </div>


        {/* Blocco Versione v2.5.0 */}
        <div className="bg-slate-900/20 border border-slate-800/60 rounded-3xl p-6 sm:p-10 lg:p-14 shadow-lg relative isolate overflow-hidden opacity-75 hover:opacity-100 transition-opacity mb-12 space-y-12 lg:space-y-16">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-600 z-10"></div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/80 pb-6 gap-2">
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-500 flex items-center gap-3 group-hover:text-emerald-400 transition-colors">
              v2.5.0 - Official Moxfield API, Privacy & Backend Hardening
            </h2>
            <span className="text-xs lg:text-sm bg-slate-900/50 text-slate-500 px-4 py-1.5 rounded-full font-medium w-fit border border-slate-800">
              23 Settembre 2026
            </span>
          </div>
          
          <div className="space-y-10 lg:space-y-12">
            
            {/* Sezione Moxfield & API */}
            <div>
              <h3 className="text-lg lg:text-xl font-bold text-slate-400 mb-5 border-l-4 border-slate-700 pl-4">
                Compliance API Moxfield
              </h3>
              <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-500 leading-relaxed">
                <li className="flex gap-3"><span className="text-slate-600 font-bold">•</span> <div><strong className="text-slate-400">Rate Limiting Globale:</strong> Abbandonato il framework di scraping parallelo a favore di un estrattore sequenziale governato da un rate limiter esatto, garantendo piena conformità ai Termini di Servizio (ToS).</div></li>
                <li className="flex gap-3"><span className="text-slate-600 font-bold">•</span> <div><strong className="text-slate-400">Gestione Retry e Backoff:</strong> Introdotti meccanismi di tolleranza all'errore (fault tolerance) volti a mitigare l'impatto di instabilità di rete, preservando lo stato consistente del database.</div></li>
              </ul>
            </div>

            {/* Sezione Privacy e GDPR */}
            <div>
              <h3 className="text-lg lg:text-xl font-bold text-slate-400 mb-5 border-l-4 border-slate-700 pl-4">
                Adeguamento Privacy e Data Minimization
              </h3>
              <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-500 leading-relaxed">
                <li className="flex gap-3"><span className="text-slate-600 font-bold">•</span> <div><strong className="text-slate-400">Minimizzazione Dati:</strong> Ottimizzata l'impronta di stoccaggio espellendo campi metadati non necessari e focalizzandosi solo sugli identificativi operativi essenziali per le metriche.</div></li>
                <li className="flex gap-3"><span className="text-slate-600 font-bold">•</span> <div><strong className="text-slate-400">Ecosistema Legale:</strong> Formalizzate le policy di gestione dati in accordo alla normativa vigente e attivato il canale istituzionale protetto dedicato alle questioni di conformità.</div></li>
              </ul>
            </div>

            {/* Sezione GitHub & Security */}
            <div>
              <h3 className="text-lg lg:text-xl font-bold text-slate-400 mb-5 border-l-4 border-slate-700 pl-4">
                Isolamento Credenziali
              </h3>
              <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-500 leading-relaxed">
                <li className="flex gap-3"><span className="text-slate-600 font-bold">•</span> <div><strong className="text-slate-400">Environment Injection:</strong> Disaccoppiate le credenziali e l'API Key (User-Agent) di Moxfield dalla base di codice, delegandone l'iniezione a livello di servizio di sistema (systemd).</div></li>
              </ul>
            </div>

          </div>
        </div>

        {/* Blocco Versione v2.0.1 */}
        <div className="bg-slate-900/10 border border-slate-800/40 rounded-3xl p-6 sm:p-10 lg:p-14 shadow-sm relative isolate overflow-hidden opacity-50 hover:opacity-100 transition-opacity mb-12 space-y-12 lg:space-y-16">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-600 z-10"></div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/80 pb-6 gap-2">
            <h2 className="text-xl lg:text-2xl font-bold text-slate-600 flex items-center gap-3 group-hover:text-blue-400 transition-colors">
              v2.0.1 - Quality of Life, Desktop UI e Fix Visivi
            </h2>
            <span className="text-xs lg:text-sm bg-slate-900/50 text-slate-600 px-4 py-1.5 rounded-full font-medium w-fit border border-slate-800">
              21 Settembre 2026
            </span>
          </div>
          
          <div className="space-y-10 lg:space-y-12">
            
            {/* Sezione Interattività */}
            <div>
              <h3 className="text-lg lg:text-xl font-bold text-slate-500 mb-5 border-l-4 border-slate-800 pl-4">
                Funzionalità e Aggiornamenti Interfaccia
              </h3>
              <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-600 leading-relaxed">
                <li className="flex gap-3"><span className="text-slate-700 font-bold">•</span> <div><strong className="text-slate-500">Composizione Dinamica:</strong> La componente a barra delle tipologie è ora interattiva, facilitando il filtraggio rapido della lista carte tramite interazione diretta col diagramma.</div></li>
                <li className="flex gap-3"><span className="text-slate-700 font-bold">•</span> <div><strong className="text-slate-500">Ottimizzazione Desktop:</strong> Ampliamento della Hero Section per ambienti desktop e risoluzione di bug visivi legati al sistema WebKit (clipping e sovrapposizioni z-index errate in fase di ingrandimento).</div></li>
              </ul>
            </div>

          </div>
        </div>

        {/* Blocco Versione v2.0.0 */}
        <div className="bg-slate-900/5 border border-slate-800/20 rounded-3xl p-6 sm:p-10 lg:p-14 shadow-none relative isolate overflow-hidden opacity-40 hover:opacity-100 transition-opacity mb-12 space-y-12 lg:space-y-16">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-600 to-slate-800 z-10"></div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/50 pb-6 gap-2">
            <h2 className="text-lg lg:text-xl font-bold text-slate-600 flex items-center gap-3">
              v2.0.0 - Architettura Dinamica, SEO e Social
            </h2>
            <span className="text-xs bg-slate-900/30 text-slate-600 px-4 py-1.5 rounded-full font-medium w-fit border border-slate-800/50">
              16 Settembre 2026
            </span>
          </div>
          
          <div className="space-y-10 lg:space-y-12">
            
            <div>
              <h3 className="text-base font-bold text-slate-500 mb-5 border-l-4 border-slate-800 pl-4">
                Ottimizzazione Motori di Ricerca (SEO) e Social
              </h3>
              <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-600 leading-relaxed">
                <li className="flex gap-3"><span className="text-slate-700 font-bold">•</span> <div><strong className="text-slate-500">Indicizzazione Strutturata:</strong> Implementata sitemap dinamica e gerarchia avanzata dei tag per migliorare l'esposizione sui motori di ricerca mainstream.</div></li>
                <li className="flex gap-3"><span className="text-slate-700 font-bold">•</span> <div><strong className="text-slate-500">Social Graph:</strong> Supporto nativo ai protocolli di Open Graph per arricchire l'anteprima dei link su canali di messaggistica e social network.</div></li>
              </ul>
            </div>

          </div>
        </div>

        {/* Blocco Versione v1.5.1 */}
        <div className="bg-slate-900/5 border border-slate-800/20 rounded-3xl p-6 sm:p-10 lg:p-14 shadow-none relative isolate overflow-hidden opacity-30 hover:opacity-100 transition-opacity mb-12 space-y-12 lg:space-y-16">
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
                Migrazione Architetturale e Migliorie Analitiche
              </h3>
              <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-600 leading-relaxed">
                <li className="flex gap-3"><span className="text-slate-700 font-bold">•</span> <div><strong className="text-slate-500">Dismissione Pandas:</strong> Riscrittura completa dei meccanismi di elaborazione backend per abbattere i consumi di memoria. L'aggregazione statistica è ora integralmente off-boardata al motore SQLite nativo.</div></li>
                <li className="flex gap-3"><span className="text-slate-700 font-bold">•</span> <div><strong className="text-slate-500">Gestione Anomalie UX Mobile:</strong> Sistemati bug di ritenzione focus su tastiera mobile e aggiunte rappresentazioni grafiche proporzionali per una rapida consultazione analitica in ambiente compatto.</div></li>
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