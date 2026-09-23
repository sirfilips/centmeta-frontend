'use client';
import React from 'react';
import Image from 'next/image';
import Footer from '../../components/Footer';
import ScrollToTop from '../../components/ScrollToTop';

export default function Legal() {
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
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-3 tracking-tight">Privacy e Note Legali</h1>
          <p className="text-base lg:text-lg text-slate-400">Informazioni sul trattamento dei dati, copyright e termini di utilizzo di CentMeta.</p>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 sm:p-10 lg:p-14 shadow-2xl relative isolate overflow-hidden space-y-12 lg:space-y-16">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-600 z-10"></div>
          
          {/* Sezione Privacy e GDPR */}
          <section>
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-200 mb-5 border-l-4 border-blue-500 pl-4">
              Informativa sulla Privacy (GDPR)
            </h2>
            <div className="space-y-5 text-sm md:text-base lg:text-lg text-slate-300 leading-relaxed">
              <p>
                CentMeta è un progetto indipendente e open-source. La tutela della privacy degli utenti è per noi una priorità assoluta e operiamo nel pieno rispetto del Regolamento Generale sulla Protezione dei Dati (UE 2016/679).
              </p>
              <ul className="list-disc pl-5 space-y-3 text-slate-400 mt-4">
                <li><strong className="text-slate-200">Dati Personali:</strong> Il sito non richiede registrazione, non raccoglie dati anagrafici, e-mail o informazioni personali sensibili in alcuna forma.</li>
                <li><strong className="text-slate-200">Cookie e Tracciamento:</strong> Non facciamo alcun uso di cookie di profilazione, cookie pubblicitari o strumenti di tracciamento di terze parti (come Google Analytics o Pixel vari). Per questo motivo non è richiesto, né visualizzato, alcun banner per il consenso dei cookie (Cookie Law).</li>
                <li><strong className="text-slate-200">Log di Sistema:</strong> Al solo fine di garantire la sicurezza, prevenire attacchi informatici (es. DDoS) e mantenere la stabilità dell&apos;infrastruttura di rete, i server registrano temporaneamente log tecnici di connessione (come gli indirizzi IP e l&apos;User-Agent). Questi dati sono strettamente funzionali all&apos;erogazione del servizio, non vengono incrociati con altre banche dati e vengono sovrascritti automaticamente a cicli regolari.</li>
              </ul>
            </div>
          </section>

          {/* Sezione Proprietà Intellettuale */}
          <section>
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-200 mb-5 border-l-4 border-purple-500 pl-4">
              Proprietà Intellettuale
            </h2>
            <div className="space-y-4 text-sm md:text-base lg:text-lg text-slate-300 leading-relaxed">
              <p>
                <strong className="text-slate-200">Autore:</strong> L&apos;infrastruttura backend (Python/FastAPI), l&apos;algoritmo di elaborazione dati, il codice sorgente frontend (Next.js/React) e il marchio &quot;CentMeta&quot; sono stati interamente ideati e sviluppati da Filippo Zanardi.
              </p>
              <p>
                Fatti salvi i diritti legati ai contenuti di gioco (come indicato nella Policy ufficiale WotC in calce), l&apos;architettura del software e il design dell&apos;interfaccia sono proprietà intellettuale del suo autore.
              </p>
            </div>
          </section>

          {/* Sezione API ed Esterni */}
          <section>
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-200 mb-5 border-l-4 border-orange-500 pl-4">
              Terze Parti e Fonti dei Dati
            </h2>
            <div className="space-y-4 text-sm md:text-base lg:text-lg text-slate-300 leading-relaxed">
              <p>
                Le liste dei mazzi analizzate sulla piattaforma vengono estratte direttamente dalle <strong className="text-slate-200">liste pubbliche di Moxfield</strong>, servizio con cui CentMeta non ha alcuna affiliazione ufficiale.
              </p>
              <p>
                I dati tecnici relativi alle carte (Testo Oracle, Costo di Mana, Identità di Colore e Immagini in alta definizione) sono forniti tramite le API pubbliche di <a href="https://scryfall.com" target="_blank" rel="noopener noreferrer" className="text-slate-200 hover:text-blue-400 underline decoration-slate-600 underline-offset-2 transition-colors">Scryfall</a>, che ringraziamo per l&apos;immenso contributo fornito alla community.
              </p>
              <p>
                I dati statistici elaborati derivano da informazioni pubbliche, rielaborate unicamente per scopi statistici, informativi e comunitari per il formato Commander Centurion.
              </p>
            </div>
          </section>

          {/* Sezione Formato Centurion */}
          <section>
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-200 mb-5 border-l-4 border-yellow-500 pl-4">
              Formato Centurion Commander
            </h2>
            <div className="space-y-4 text-sm md:text-base lg:text-lg text-slate-300 leading-relaxed">
              <p>
                Il termine &quot;Centurion&quot; è utilizzato su questa piattaforma in senso strettamente descrittivo e nominativo, al solo fine di indicare il formato di gioco oggetto delle analisi statistiche.
              </p>
              <p>
                CentMeta è un progetto indipendente e <strong className="text-slate-200">non è affiliato, supportato o riconosciuto ufficialmente</strong> dal Comitato Centurion Commander.
              </p>
            </div>
          </section>

          {/* Sezione WotC Ufficiale */}
          <section>
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-200 mb-5 border-l-4 border-emerald-500 pl-4">
              Wizards of the Coast Fan Content Policy
            </h2>
            <div className="space-y-6 text-sm md:text-base lg:text-lg text-slate-300 leading-relaxed bg-slate-900/50 p-6 lg:p-8 rounded-2xl border border-slate-800 shadow-inner">
              <p className="italic">
                CentMeta è un contenuto amatoriale non ufficiale consentito dalle Linee guida sui contenuti amatoriali. Non è approvato né autorizzato da Wizards. Parte dei materiali utilizzati è proprietà di Wizards of the Coast. © Wizards of the Coast LLC.
              </p>
              <hr className="border-slate-800/80" />
              <p className="italic">
                CentMeta is unofficial Fan Content permitted under the Fan Content Policy. Not approved/endorsed by Wizards. Portions of the materials used are property of Wizards of the Coast. ©Wizards of the Coast LLC.
              </p>
            </div>
          </section>

        </div>
      </div>

      <Footer />
      <ScrollToTop />
    </main>
  );
}