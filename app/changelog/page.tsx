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

        {/* Blocco Versione v2.0.1 (NUOVA) */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 sm:p-10 lg:p-14 shadow-2xl relative isolate overflow-hidden mb-12 space-y-12 lg:space-y-16">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-600 z-10"></div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/80 pb-6 gap-2">
            <h2 className="text-2xl lg:text-3xl font-bold text-emerald-400 flex items-center gap-3">
              v2.0.1 - Quality of Life, Desktop UI e Fix Visivi
            </h2>
            <span className="text-sm lg:text-base bg-emerald-900/30 text-emerald-300 px-4 py-1.5 rounded-full font-bold w-fit border border-emerald-500/30">
              21 Settembre 2026
            </span>
          </div>
          
          <div className="space-y-10 lg:space-y-12">
            
            {/* Sezione Interattività */}
            <div>
              <h3 className="text-lg lg:text-xl font-bold text-slate-200 mb-5 border-l-4 border-teal-500 pl-4">
                Interattività e Analitica
              </h3>
              <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-300 leading-relaxed">
                <li className="flex gap-3"><span className="text-teal-500 font-bold">•</span> <div><strong className="text-slate-200">Filtri Dinamici per Tipologia:</strong> La barra della "Composizione Media" è ora completamente interattiva. Cliccando sui segmenti colorati o sulle etichette sottostanti (es. "Creature" o "Istantanei"), la pagina scorrerà automaticamente impostando il filtro corrispondente sulle carte.</div></li>
                <li className="flex gap-3"><span className="text-teal-500 font-bold">•</span> <div><strong className="text-slate-200">Ordinamento Intelligente:</strong> L'ordine dei colori nella barra e delle etichette testuali è ora sincronizzato in base alla reale frequenza delle carte. Inoltre, la categoria "Terre" viene costantemente forzata in ultima posizione per non distorcere visivamente l'analisi delle altre tipologie.</div></li>
              </ul>
            </div>

            {/* Sezione UI Desktop */}
            <div>
              <h3 className="text-lg lg:text-xl font-bold text-slate-200 mb-5 border-l-4 border-indigo-400 pl-4">
                Design e Ottimizzazione Desktop
              </h3>
              <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-300 leading-relaxed">
                <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span> <div><strong className="text-slate-200">Hero Section Espansa:</strong> Riprogettata l'intestazione principale per sfruttare al meglio gli schermi larghi (PC/Desktop). Introdotta un'illuminazione ambientale (glow) di sfondo e un gradiente dinamico per conferire maggiore profondità tridimensionale al sito.</div></li>
                <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span> <div><strong className="text-slate-200">Coerenza Iconografica:</strong> Il pulsante "Torna in alto" (Scroll to Top) è stato aggiornato, sostituendo il carattere testuale con l'iconografia ufficiale <i>lucide-react</i> per uniformità con il resto della piattaforma.</div></li>
              </ul>
            </div>

            {/* Sezione Bug Fixes */}
            <div>
              <h3 className="text-lg lg:text-xl font-bold text-slate-200 mb-5 border-l-4 border-rose-400 pl-4">
                Correzioni Visive (Bug Fixes)
              </h3>
              <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-300 leading-relaxed">
                <li className="flex gap-3"><span className="text-rose-400 font-bold">•</span> <div><strong className="text-slate-200">Fix Sbordamento WebKit:</strong> Risolta una storica criticità di rendering sui browser Apple/WebKit. L'immagine di sfondo sfocata della carta analizzata non "sbrodola" più al di fuori dei bordi arrotondati del contenitore principale.</div></li>
                <li className="flex gap-3"><span className="text-rose-400 font-bold">•</span> <div><strong className="text-slate-200">Allineamento Caroselli:</strong> Ricalcolate millimetricamente le posizioni delle frecce di scorrimento laterale dei caroselli per essere sempre centrate rispetto agli artwork delle carte.</div></li>
                <li className="flex gap-3"><span className="text-rose-400 font-bold">•</span> <div><strong className="text-slate-200">Z-Index e Tagli Immagini:</strong> Eliminato l'effetto "taglio" (clipping) che colpiva la sommità delle carte durante l'animazione di ingrandimento col mouse. Corretto inoltre l'ordine di sovrapposizione (z-index) in modo che i comandanti <i>Partner</i> non vengano coperti dalle carte adiacenti al passaggio del cursore.</div></li>
              </ul>
            </div>

          </div>
        </div>

        {/* Blocco Versione v2.0.0 */}
        <div className="bg-slate-900/20 border border-slate-800/60 rounded-3xl p-6 sm:p-10 lg:p-14 shadow-lg relative isolate overflow-hidden opacity-90 hover:opacity-100 transition-opacity mb-12 space-y-12 lg:space-y-16">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-600 z-10"></div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/80 pb-6 gap-2">
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-400 flex items-center gap-3 group-hover:text-blue-400 transition-colors">
              v2.0.0 - Architettura Dinamica, SEO e Social
            </h2>
            <span className="text-sm lg:text-base bg-slate-900/50 text-slate-400 px-4 py-1.5 rounded-full font-medium w-fit border border-slate-800">
              16 Settembre 2026
            </span>
          </div>
          
          <div className="space-y-10 lg:space-y-12">
            
            {/* Sezione Motori di Ricerca */}
            <div>
              <h3 className="text-lg lg:text-xl font-bold text-slate-300 mb-5 border-l-4 border-slate-600 pl-4">
                Visibilità e Motori di Ricerca (SEO)
              </h3>
              <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-400 leading-relaxed">
                <li className="flex gap-3"><span className="text-slate-500 font-bold">•</span> <div><strong className="text-slate-300">Indicizzazione Globale:</strong> CentMeta è ora ufficialmente ottimizzato per essere scansionato e indicizzato dai principali motori di ricerca come Google, Bing, Ecosia e DuckDuckGo.</div></li>
                <li className="flex gap-3"><span className="text-slate-500 font-bold">•</span> <div><strong className="text-slate-300">Mappe del Sito e Gerarchia:</strong> Implementata la generazione automatica delle Sitemap e perfezionata la gerarchia dei titoli delle pagine, permettendo agli algoritmi di ricerca di capire istantaneamente di cosa parla ogni analisi.</div></li>
              </ul>
            </div>

            {/* Sezione Social */}
            <div>
              <h3 className="text-lg lg:text-xl font-bold text-slate-300 mb-5 border-l-4 border-slate-600 pl-4">
                Condivisione Social e Link
              </h3>
              <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-400 leading-relaxed">
                <li className="flex gap-3"><span className="text-slate-500 font-bold">•</span> <div><strong className="text-slate-300">Anteprime Avanzate:</strong> Condividendo il link di un comandante su WhatsApp, Discord, Telegram o Facebook, ora appariranno automaticamente il logo del sito, il nome specifico del mazzo e una breve descrizione dedicata.</div></li>
                <li className="flex gap-3"><span className="text-slate-500 font-bold">•</span> <div><strong className="text-slate-300">Link Puliti e Diretti:</strong> Gli indirizzi web del sito sono stati riscritti in un formato definitivo e super leggibile (es. <i>/commander/Phelia</i>), facilitando il salvataggio nei preferiti e la navigazione tra le pagine.</div></li>
              </ul>
            </div>

            {/* Sezione Estetica */}
            <div>
              <h3 className="text-lg lg:text-xl font-bold text-slate-300 mb-5 border-l-4 border-slate-600 pl-4">
                Perfezionamenti Estetici (UI/UX)
              </h3>
              <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-400 leading-relaxed">
                <li className="flex gap-3"><span className="text-slate-500 font-bold">•</span> <div><strong className="text-slate-300">Layout Carte su Mobile:</strong> Risolto un problema visivo che creava fastidiosi spazi vuoti irregolari sotto le carte sugli schermi degli smartphone, garantendo ora una griglia compatta e perfettamente proporzionata.</div></li>
                <li className="flex gap-3"><span className="text-slate-500 font-bold">•</span> <div><strong className="text-slate-300">Schermata Iniziale:</strong> Snellita l'intestazione principale (Hero Section) della dashboard per renderla meno invasiva, più moderna e concentrata sui contenuti statistici.</div></li>
              </ul>
            </div>

          </div>
        </div>

        {/* Blocco Versione v1.5.1 */}
        <div className="bg-slate-900/10 border border-slate-800/40 rounded-3xl p-6 sm:p-10 lg:p-14 shadow-sm relative isolate overflow-hidden opacity-75 hover:opacity-100 transition-opacity mb-12 space-y-12 lg:space-y-16">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-600 to-slate-800 z-10"></div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/50 pb-6 gap-2">
            <h2 className="text-xl lg:text-2xl font-bold text-slate-500 flex items-center gap-3">
              v1.5.1 - Ottimizzazione Analitica e Revisione UX
            </h2>
            <span className="text-xs lg:text-sm bg-slate-900/50 text-slate-500 px-4 py-1.5 rounded-full font-medium w-fit border border-slate-800">
              14 Settembre 2026
            </span>
          </div>
          
          <div className="space-y-10 lg:space-y-12">
            
            <div>
              <h3 className="text-lg font-bold text-slate-400 mb-5 border-l-4 border-slate-700 pl-4">
                Nuove Metriche Analitiche
              </h3>
              <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-500 leading-relaxed">
                <li className="flex gap-3"><span className="text-slate-600 font-bold">•</span> <div><strong className="text-slate-400">Composizione Media del Mazzo:</strong> Integrato un nuovo diagramma a barre proporzionale che illustra istantaneamente la distribuzione delle tipologie di carte (Creature, Istantanei, Terre, ecc.) per ciascun comandante.</div></li>
                <li className="flex gap-3"><span className="text-slate-600 font-bold">•</span> <div><strong className="text-slate-400">Valori Assoluti e Differenziali:</strong> Aggiunta la visibilità della frequenza assoluta di utilizzo (numero totale di mazzi) accanto ai valori percentuali. Implementata la metrica del delta incrementale positivo (+X) per la vista delle carte in tendenza.</div></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-400 mb-5 border-l-4 border-slate-700 pl-4">
                Infrastruttura e Prestazioni
              </h3>
              <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-500 leading-relaxed">
                <li className="flex gap-3"><span className="text-slate-600 font-bold">•</span> <div><strong className="text-slate-400">Motore SQL Nativo:</strong> Riscrittura architetturale delle logiche di estrazione dati. I calcoli massivi (join e aggregazioni) sono stati demandati interamente al livello database (SQLite), bypassando l'elaborazione in-memory di Pandas, con un incremento prestazionale fino all'80%.</div></li>
                <li className="flex gap-3"><span className="text-slate-600 font-bold">•</span> <div><strong className="text-slate-400">Indicizzazione del Database:</strong> Implementata la generazione automatica di indici SQL strutturati all'avvio del server, eliminando i Full Table Scan durante la navigazione temporale.</div></li>
                <li className="flex gap-3"><span className="text-slate-600 font-bold">•</span> <div><strong className="text-slate-400">Connection Pooling HTTP:</strong> Ottimizzate le latenze di rete verso i provider di terze parti (Scryfall) sfruttando sessioni TLS persistenti, riducendo i tempi di risoluzione delle immagini in cache miss.</div></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-400 mb-5 border-l-4 border-slate-700 pl-4">
                Interfaccia Utente e Mobile
              </h3>
              <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-500 leading-relaxed">
                <li className="flex gap-3"><span className="text-slate-600 font-bold">•</span> <div><strong className="text-slate-400">Loader Asincrono Globale:</strong> Integrato un sistema di feedback visivo persistente per notificare all'utente le transazioni di rete in corso, supportato da un overlay di transizione opacizzante sulla scheda di analisi.</div></li>
                <li className="flex gap-3"><span className="text-slate-600 font-bold">•</span> <div><strong className="text-slate-400">Revisione Cromatica (Soft Dark):</strong> Migrazione dell'infrastruttura di stili verso una palette desaturata (Pastel Navy) volta a ridurre l'affaticamento visivo e massimizzare il contrasto degli elementi in evidenza.</div></li>
                <li className="flex gap-3"><span className="text-slate-600 font-bold">•</span> <div><strong className="text-slate-400">Ristrutturazione Layout Mobile:</strong> Ottimizzata la scheda analitica del comandante per dispositivi smartphone. Riorganizzati i widget statistici in un flusso verticale compatto e introdotto un meccanismo a comparsa (toggle) per la consultazione del testo Oracle.</div></li>
                <li className="flex gap-3"><span className="text-slate-600 font-bold">•</span> <div><strong className="text-slate-400">Snellimento Intestazione:</strong> Riduzione dell'impronta verticale dell'Header su schermi ridotti, con ridimensionamento dinamico del logo e compattazione degli indicatori statistici globali.</div></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-400 mb-5 border-l-4 border-slate-700 pl-4">
                Correzioni e Stabilità (Bug Fixes)
              </h3>
              <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-500 leading-relaxed">
                <li className="flex gap-3"><span className="text-slate-600 font-bold">•</span> <div><strong className="text-slate-400">Persistenza del Focus:</strong> Risolta una criticità architetturale nel processo di rendering React che causava la chiusura involontaria della tastiera mobile e la perdita del focus durante la digitazione nella barra di ricerca.</div></li>
                <li className="flex gap-3"><span className="text-slate-600 font-bold">•</span> <div><strong className="text-slate-400">Posizionamento Viewport (Scroll):</strong> Corretto un difetto di navigazione interno alle Single Page Application; ora la selezione di una carta o comandante forza fluidamente il riposizionamento della visuale all'apice della finestra.</div></li>
                <li className="flex gap-3"><span className="text-slate-600 font-bold">•</span> <div><strong className="text-slate-400">Motore di Calcolo delle Terre:</strong> Perfezionato l'algoritmo di elaborazione backend (Python/SQLite) per riconoscere e sommare dinamicamente copie multiple di una singola carta, garantendo metriche perfette per le Terre Base.</div></li>
              </ul>
            </div>

          </div>
        </div>

        {/* Blocco Versione v1.5 */}
        <div className="bg-slate-900/5 border border-slate-800/20 rounded-3xl p-6 sm:p-10 lg:p-14 shadow-none relative isolate overflow-hidden opacity-50 hover:opacity-100 transition-opacity space-y-12 lg:space-y-16">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-800 to-slate-900 z-10"></div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/30 pb-6 gap-2">
            <h2 className="text-lg lg:text-xl font-bold text-slate-600 flex items-center gap-3">
              v1.5 - Aggiornamento Interfaccia e Funzionalità
            </h2>
            <span className="text-xs bg-slate-900/30 text-slate-600 px-4 py-1.5 rounded-full font-medium w-fit border border-slate-800/50">
              13 Settembre 2026
            </span>
          </div>
          
          <div className="space-y-10 lg:space-y-12">
            
            <div>
              <h3 className="text-base font-bold text-slate-500 mb-5 border-l-4 border-slate-800 pl-4">
                Nuove Funzionalità
              </h3>
              <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-600 leading-relaxed">
                <li className="flex gap-3"><span className="text-slate-700 font-bold">•</span> <div><strong className="text-slate-500">Dashboard modulare:</strong> Sostituzione della griglia statica con componenti a carosello orizzontale, ottimizzati per una consultazione più rapida dei dati principali.</div></li>
                <li className="flex gap-3"><span className="text-slate-700 font-bold">•</span> <div><strong className="text-slate-500">Metriche "Hot (7gg)":</strong> Introduzione di nuove sezioni analitiche dedicate a comandanti e carte con il maggiore indice di crescita negli ultimi 7 giorni.</div></li>
                <li className="flex gap-3"><span className="text-slate-700 font-bold">•</span> <div><strong className="text-slate-500">Indicatori di classificazione:</strong> Aggiunta di indicatori grafici (▲, ▼, NEW) per il monitoraggio dinamico delle variazioni di posizione in classifica rispetto al periodo temporale precedente.</div></li>
                <li className="flex gap-3"><span className="text-slate-700 font-bold">•</span> <div><strong className="text-slate-500">Filtro temporale predefinito:</strong> L'intervallo temporale "Ultimi 30 giorni" è ora impostato come visualizzazione di default all'inizializzazione dell'applicativo.</div></li>
              </ul>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-500 mb-5 border-l-4 border-slate-800 pl-4">
                Interfaccia Utente e Ottimizzazioni
              </h3>
              <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-600 leading-relaxed">
                <li className="flex gap-3"><span className="text-slate-700 font-bold">•</span> <div><strong className="text-slate-500">Gestione layout carte speciali:</strong> Migliorata la resa visiva dei comandanti Partner tramite un layout diagonale interattivo. Ottimizzata la visualizzazione delle carte bifronte limitando l'anteprima al solo fronte principale.</div></li>
                <li className="flex gap-3"><span className="text-slate-700 font-bold">•</span> <div><strong className="text-slate-500">Accessibilità Liste Mazzi:</strong> Riorganizzazione dell'accesso alle liste complete della community tramite un elemento di navigazione dedicato nella scheda statistica del comandante.</div></li>
                <li className="flex gap-3"><span className="text-slate-700 font-bold">•</span> <div><strong className="text-slate-500">Selettori di classificazione:</strong> Integrato un interruttore rapido nelle viste estese per alternare agevolmente tra l'ordinamento assoluto ("Top") e quello di tendenza ("Hot").</div></li>
              </ul>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-500 mb-5 border-l-4 border-slate-800 pl-4">
                Navigazione e Strumenti di Ricerca
              </h3>
              <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-600 leading-relaxed">
                <li className="flex gap-3"><span className="text-slate-700 font-bold">•</span> <div><strong className="text-slate-500">Filtri di colore cumulativi:</strong> Implementata la multi-selezione per le identità di colore, consentendo query più precise per le combinazioni multicolore.</div></li>
                <li className="flex gap-3"><span className="text-slate-700 font-bold">•</span> <div><strong className="text-slate-500">Supporto multi-scheda:</strong> Abilitato il comportamento nativo del browser per l'apertura degli elementi in nuove schede tramite clic centrale (rotellina del mouse) o modificatori da tastiera (Ctrl/Cmd + Clic).</div></li>
                <li className="flex gap-3"><span className="text-slate-700 font-bold">•</span> <div><strong className="text-slate-500">URL state-driven:</strong> Sincronizzazione in tempo reale degli indirizzi web con i parametri di ricerca attivi. Questo aggiornamento garantisce la piena compatibilità con la cronologia del browser (funzioni Avanti/Indietro) e la condivisibilità dei link filtrati.</div></li>
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