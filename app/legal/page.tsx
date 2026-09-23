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
                CentMeta è un progetto indipendente. La tutela della privacy degli utenti è per noi una priorità assoluta e operiamo nel pieno rispetto del Regolamento Generale sulla Protezione dei Dati (UE 2016/679).
              </p>
              <ul className="list-disc pl-5 space-y-3 text-slate-400 mt-4">
                <li>
                  <strong className="text-slate-200">Titolare del Trattamento:</strong> Filippo Zanardi. L&apos;utente può contattare il titolare per qualsiasi richiesta relativa ai dati personali e per esercitare tutti i diritti elencati in questa sezione all&apos;indirizzo e-mail: <a href="mailto:privacy@centmeta.it" className="text-blue-400 hover:underline">privacy@centmeta.it</a>.
                </li>
                <li>
                  <strong className="text-slate-200">Dati Personali:</strong> Il sito non richiede registrazione, non raccoglie dati anagrafici, e-mail o informazioni personali sensibili in alcuna forma, fatta eccezione per i log tecnici descritti di seguito. A ulteriore tutela della riservatezza degli utenti, l&apos;infrastruttura di analisi estrae unicamente la composizione tecnica dei mazzi (carte e comandanti), insieme all&apos;identificativo pubblico e alla data di aggiornamento, astenendosi rigorosamente dal salvare i nomi assegnati ai mazzi dai rispettivi creatori.
                </li>
                <li>
                  <strong className="text-slate-200">Cookie e Tracciamento:</strong> Non facciamo alcun uso di cookie di profilazione, cookie pubblicitari o strumenti di tracciamento di terze parti (come Google Analytics o Pixel vari). Per questo motivo non è richiesto, né visualizzato, alcun banner per il consenso dei cookie (Cookie Law).
                </li>
                <li>
                  <strong className="text-slate-200">Base Giuridica del Trattamento:</strong> Il trattamento dei log tecnici di connessione avviene in base al legittimo interesse del titolare (art. 6, par. 1, lett. f GDPR), al solo scopo di garantire la sicurezza e la stabilità del servizio. Precisiamo che non vengono prese decisioni automatizzate né viene svolta alcuna attività di profilazione (art. 22 GDPR).
                </li>
                <li>
                  <strong className="text-slate-200">Log di Sistema:</strong> Al solo fine di garantire la sicurezza, prevenire attacchi informatici (es. DDoS) e mantenere la stabilità dell&apos;infrastruttura di rete, i server registrano temporaneamente log tecnici di connessione (come gli indirizzi IP e l&apos;User-Agent). Questi dati sono strettamente funzionali all&apos;erogazione del servizio, non vengono incrociati con altre banche dati e i log sono conservati per un massimo di 30 giorni, dopodiché vengono eliminati automaticamente. I log non vengono utilizzati per scopi di marketing o statistico e non sono accessibili a terzi, fatto salvo Cloudflare in qualità di responsabile del trattamento.
                </li>
                <li>
                  <strong className="text-slate-200">Cloudflare:</strong> Il traffico del sito è gestito tramite Cloudflare, Inc. (Stati Uniti), che agisce come responsabile del trattamento e può trattare l&apos;indirizzo IP e i dati tecnici di connessione per finalità di sicurezza e protezione dell&apos;infrastruttura (es. prevenzione attacchi DDoS). Il trasferimento verso gli Stati Uniti avviene sulla base della decisione di adeguatezza della Commissione europea sul EU-US Data Privacy Framework, cui Cloudflare aderisce, e in subordine delle Clausole Contrattuali Standard incluse nel Data Processing Addendum di Cloudflare. Per maggiori informazioni, rimandiamo all&apos;<a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">informativa sulla privacy di Cloudflare</a>.
                </li>
                <li>
                  <strong className="text-slate-200">Diritti dell&apos;Interessato:</strong> Ai sensi degli artt. 15–21 del GDPR, l&apos;utente ha il diritto di chiedere l&apos;accesso ai propri dati personali, la rettifica, la cancellazione, la limitazione del trattamento, l&apos;opposizione al trattamento e la portabilità dei dati. Le richieste vanno inviate a <a href="mailto:privacy@centmeta.it" className="text-blue-400 hover:underline">privacy@centmeta.it</a>. L&apos;utente ha inoltre il diritto di presentare reclamo al Garante per la protezione dei dati personali (<a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">www.garanteprivacy.it</a>).
                </li>
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
                Le liste dei mazzi analizzate derivano da liste rese pubbliche dai rispettivi autori su Moxfield, servizio con cui CentMeta non ha alcuna affiliazione ufficiale. Di ciascun mazzo vengono conservati solo l&apos;identificativo pubblico, il comandante, la data di aggiornamento e l&apos;elenco delle carte. La raccolta automatizzata dei dati è al momento sospesa in attesa di un accordo con Moxfield. Chi non desidera che un proprio mazzo sia incluso nelle statistiche può scrivere a privacy@centmeta.it per chiederne la rimozione (artt. 17 e 21 GDPR).
              </p>
              <p>
                I dati tecnici relativi alle carte (Testo Oracle, Costo di Mana, Identità di Colore e Immagini in alta definizione) sono forniti tramite le API pubbliche di <a href="https://scryfall.com" target="_blank" rel="noopener noreferrer" className="text-slate-200 hover:text-blue-400 underline decoration-slate-600 underline-offset-2 transition-colors">Scryfall</a>, che ringraziamo per l&apos;immenso contributo fornito alla community.
              </p>
              <p>
                I dati statistici elaborati derivano da informazioni pubbliche, rielaborate unicamente per scopi statistici, informativi e comunitari per il formato Centurion Commander.
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

          {/* Sezione Esclusione di Responsabilità */}
          <section>
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-200 mb-5 border-l-4 border-rose-500 pl-4">
              Esclusione di Responsabilità
            </h2>
            <div className="space-y-4 text-sm md:text-base lg:text-lg text-slate-300 leading-relaxed">
              <p>
                Le statistiche pubblicate su CentMeta sono fornite a scopo informativo, così come sono, senza garanzia di accuratezza, completezza o aggiornamento.
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