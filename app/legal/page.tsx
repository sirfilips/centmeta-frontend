import React from 'react';
import type { Metadata } from 'next';
import { ShieldCheck } from 'lucide-react';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import ScrollToTop from '../../components/ScrollToTop';
import { BackToDashboardLink } from '../../components/SubpageHeader';

export const metadata: Metadata = {
  title: 'Privacy e Note Legali | CentMeta',
  description: 'Informativa sulla privacy (GDPR), proprietà intellettuale, fonti dei dati e Wizards of the Coast Fan Content Policy per CentMeta.',
  alternates: {
    canonical: 'https://centmeta.it/legal',
  },
};

export default function Legal() {
  return (
    <main className="min-h-screen bg-slate-900 text-slate-200 font-sans flex flex-col">
      <Header />

      <div className="flex-grow pb-24 max-w-[1150px] w-full mx-auto px-4 md:px-8 mt-10">
        <BackToDashboardLink />

        <div className="border-b border-slate-700/70 pb-6 mb-10 space-y-1.5">
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-blue-400 font-bold inline-flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> Trasparenza e Normativa
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-wide">
            Privacy e Note Legali
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            Informazioni sul trattamento dei dati, copyright e termini di utilizzo di CentMeta.
          </p>
        </div>

        <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl md:rounded-3xl p-6 sm:p-10 lg:p-14 shadow-xl relative isolate overflow-hidden space-y-12 lg:space-y-16">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-600 z-10"></div>
          
          {/* Sezione Privacy e GDPR */}
          <section>
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-200 mb-5 border-l-4 border-blue-500 pl-4">
              Informativa sulla Privacy (GDPR)
            </h2>
            <div className="space-y-5 text-sm md:text-base lg:text-lg text-slate-300 leading-relaxed">
              <p className="text-xs sm:text-sm text-slate-400">
                Ultimo aggiornamento: 20 novembre 2026
              </p>
              <p>
                CentMeta è un progetto indipendente. La tutela della privacy degli utenti è per noi una priorità assoluta e operiamo nel rispetto del Regolamento Generale sulla Protezione dei Dati (Regolamento UE 2016/679 – GDPR), del Codice italiano in materia di protezione dei dati personali (D.Lgs. 196/2003, come modificato dal D.Lgs. 101/2018, incluso l&apos;art. 122) e delle Linee guida cookie e altri strumenti di tracciamento del Garante per la protezione dei dati personali del 10 giugno 2021.
              </p>
              <ul className="list-disc pl-5 space-y-3 text-slate-400 mt-4">
                <li>
                  <strong className="text-slate-200">Titolare del Trattamento:</strong> Filippo Zanardi (Italia). L&apos;utente può contattare il titolare per qualsiasi richiesta relativa ai dati personali e per esercitare tutti i diritti elencati in questa sezione all&apos;indirizzo e-mail: <a href="mailto:privacy@centmeta.it" className="text-blue-400 hover:underline">privacy@centmeta.it</a>.
                </li>
                <li>
                  <strong className="text-slate-200">Dati Personali Trattati:</strong> Il sito non richiede registrazione, non raccoglie dati anagrafici, e-mail, recapiti o categorie particolari di dati personali in alcuna forma, fatta eccezione per i dati tecnici di connessione descritti di seguito e per gli identificativi pubblici dei mazzi acquisiti da Moxfield. A ulteriore tutela della riservatezza, l&apos;infrastruttura di analisi estrae unicamente la composizione tecnica dei mazzi (carte e comandanti), insieme all&apos;identificativo pubblico e alla data di aggiornamento, astenendosi dal salvare i nomi assegnati ai mazzi o i profili dei rispettivi creatori.
                </li>
                <li>
                  <strong className="text-slate-200">Cookie, Memoria Locale e Statistiche (Art. 122 D.Lgs. 196/2003):</strong> CentMeta è completamente privo di cookie (cookie-free): non utilizziamo cookie tecnici o di profilazione, cookie pubblicitari, pixel di tracciamento né <code className="text-blue-300 text-xs bg-slate-800 px-1.5 py-0.5 rounded">sessionStorage</code>.
                  <ul className="list-disc pl-5 space-y-1.5 mt-2">
                    <li>
                      <strong className="text-slate-200">Memoria locale tecnica (<code className="text-blue-300 text-xs bg-slate-800 px-1.5 py-0.5 rounded">localStorage</code>):</strong> ai sensi dell&apos;art. 122, comma 1, del D.Lgs. 196/2003, il sito impiega esclusivamente la chiave tecnica <code className="text-blue-300 text-xs bg-slate-800 px-1.5 py-0.5 rounded">centmeta_notes_v1</code> (persistente fino alla cancellazione da parte dell&apos;utente), necessaria per consentire la funzionalità facoltativa degli <strong className="text-slate-200">Appunti Mazzo</strong> (salvataggio in locale delle carte e del comandante annotati). Sia gli <strong className="text-slate-200">Appunti Mazzo</strong> sia lo strumento <strong className="text-slate-200">Confronta Lista</strong> operano interamente all&apos;interno del browser dell&apos;utente: nessun dato o lista inserita in tali funzioni viene trasmesso al server di CentMeta, a Umami Analytics o a soggetti terzi, ed è eliminabile in qualsiasi momento svuotando gli appunti o cancellando i dati del sito dal browser.
                    </li>
                    <li>
                      <strong className="text-slate-200">Statistiche aggregate (Umami Analytics):</strong> per comprendere l&apos;affluenza in forma aggregata e anonima, utilizziamo Umami Analytics su Umami Cloud (Umami Software, Inc., Stati Uniti), configurato senza cookie, senza scrittura in <code className="text-blue-300 text-xs bg-slate-800 px-1.5 py-0.5 rounded">localStorage</code>/<code className="text-blue-300 text-xs bg-slate-800 px-1.5 py-0.5 rounded">sessionStorage</code> e senza memorizzazione di indirizzi IP. Umami Software, Inc. agisce come responsabile del trattamento (art. 28 GDPR) con conservazione dei dati analitici nella regione UE (Francoforte); eventuali trattamenti o instradamenti tecnici verso paesi extra-UE da parte di Umami e dei suoi sub-responsabili avvengono sulla base del Data Processing Agreement di Umami, che incorpora le Clausole Contrattuali Standard della Commissione europea (maggiori informazioni nell&apos;<a href="https://umami.is/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">informativa sulla privacy di Umami</a>).
                    </li>
                  </ul>
                </li>
                <li>
                  <strong className="text-slate-200">Infrastruttura Server (Self-Hosted in Italia), Cloudflare Tunnel e Dominio:</strong>
                  <ul className="list-disc pl-5 space-y-1.5 mt-2">
                    <li>
                      <strong className="text-slate-200">Hosting privato in Italia (Liguria):</strong> il server applicativo (VPS personale) e i relativi database SQLite sono ospitati fisicamente in <strong className="text-slate-200">Italia (Liguria)</strong> su infrastruttura privata gestita direttamente dal Titolare del Trattamento, senza archiviazione dei database presso provider cloud terzi.
                    </li>
                    <li>
                      <strong className="text-slate-200">Log di sistema e sicurezza:</strong> al solo fine di garantire la sicurezza, prevenire attacchi informatici e mantenere la stabilità del servizio, l&apos;infrastruttura di rete può trattare temporaneamente log tecnici di connessione (indirizzi IP e User-Agent) conservati per un massimo di 30 giorni, dopodiché vengono eliminati automaticamente. Il processo applicativo backend non registra log di accesso su file o console (<code className="text-blue-300 text-xs bg-slate-800 px-1.5 py-0.5 rounded">--no-access-log</code>) e l&apos;eventuale limitazione dei tentativi verso l&apos;endpoint amministrativo avviene esclusivamente in memoria RAM volatile mediante hash crittografico giornaliero SHA-256 non persistito su disco.
                    </li>
                    <li>
                      <strong className="text-slate-200">Cloudflare Tunnel (<code className="text-blue-300 text-xs bg-slate-800 px-1.5 py-0.5 rounded">cloudflared</code>):</strong> l&apos;esposizione sicura del sito su rete HTTPS, l&apos;instradamento cifrato verso il server locale e la protezione da attacchi informatici (es. DDoS, WAF) avvengono tramite <strong className="text-slate-200">Cloudflare Tunnel</strong> gestito da Cloudflare, Inc. (Stati Uniti), che agisce come responsabile del trattamento (art. 28 GDPR) e tratta l&apos;indirizzo IP e i dati tecnici di connessione in transito. Il trasferimento verso gli Stati Uniti avviene sulla base della decisione di adeguatezza della Commissione europea sul EU-US Data Privacy Framework, cui Cloudflare aderisce, e in subordine delle Clausole Contrattuali Standard incluse nel Data Processing Addendum di Cloudflare (<a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">informativa sulla privacy di Cloudflare</a>).
                    </li>
                    <li>
                      <strong className="text-slate-200">Dominio e DNS (OVHcloud):</strong> il nome a dominio <code className="text-blue-300 text-xs bg-slate-800 px-1.5 py-0.5 rounded">centmeta.it</code> e i relativi servizi DNS autoritativi sono registrati e gestiti tramite <strong className="text-slate-200">OVHcloud</strong> (OVH SAS / OVH S.r.l., Unione Europea).
                    </li>
                  </ul>
                </li>
                <li>
                  <strong className="text-slate-200">Connessioni Dirette a CDN di Terze Parti (Scryfall):</strong> Per visualizzare le illustrazioni delle carte e le icone delle espansioni, il browser dell&apos;utente effettua richieste dirette ai server e alla CDN di <strong className="text-slate-200">Scryfall, LLC</strong> (Stati Uniti: <code className="text-blue-300 text-xs bg-slate-800 px-1.5 py-0.5 rounded">cards.scryfall.io</code>, <code className="text-blue-300 text-xs bg-slate-800 px-1.5 py-0.5 rounded">svgs.scryfall.io</code>, <code className="text-blue-300 text-xs bg-slate-800 px-1.5 py-0.5 rounded">api.scryfall.com</code>). Ciò comporta la trasmissione tecnica dell&apos;indirizzo IP e dello User-Agent del dispositivo verso Scryfall; il sito applica l&apos;header <code className="text-blue-300 text-xs bg-slate-800 px-1.5 py-0.5 rounded">Referrer-Policy: no-referrer</code> affinché non venga trasmessa l&apos;URL specifica della pagina consultata. Per ulteriori dettagli sul trattamento svolto da Scryfall rimandiamo all&apos;<a href="https://scryfall.com/docs/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">informativa sulla privacy di Scryfall</a>.
                </li>
                <li>
                  <strong className="text-slate-200">Base Giuridica e Natura del Conferimento:</strong> I trattamenti svolti da CentMeta si fondano sul legittimo interesse del titolare (art. 6, par. 1, lett. f GDPR), per ciascuna delle seguenti finalità:
                  <ul className="list-disc pl-5 space-y-1.5 mt-2">
                    <li>
                      <strong className="text-slate-200">Log tecnici di connessione e Cloudflare Tunnel:</strong> garantire la sicurezza, l&apos;integrità e la stabilità del servizio.
                    </li>
                    <li>
                      <strong className="text-slate-200">Statistiche aggregate di affluenza (Umami):</strong> misurare le visite in forma aggregata, senza cookie e senza IP memorizzato.
                    </li>
                    <li>
                      <strong className="text-slate-200">Visualizzazione risorse visive (CDN Scryfall):</strong> mostrare le immagini ufficiali delle carte e i simboli delle espansioni.
                    </li>
                    <li>
                      <strong className="text-slate-200">Liste mazzi pubbliche da Moxfield:</strong> produzione di statistiche aggregate sul formato.
                    </li>
                  </ul>
                  <p className="mt-2">
                    Ai sensi dell&apos;art. 13, par. 2, lett. e) GDPR, la trasmissione dei dati tecnici di connessione (es. indirizzo IP) è necessaria per il funzionamento dei protocolli Internet e per la sicurezza dell&apos;infrastruttura: la mancata comunicazione impedisce l&apos;accesso alle pagine del sito. L&apos;utilizzo della memoria locale (<code className="text-blue-300 text-xs bg-slate-800 px-1.5 py-0.5 rounded">localStorage</code>) per gli Appunti Mazzo è invece interamente facoltativo e può essere disabilitato nelle impostazioni del browser senza limitare la consultazione delle statistiche. Non vengono prese decisioni automatizzate né viene svolta alcuna attività di profilazione (art. 22 GDPR).
                  </p>
                </li>
                <li>
                  <strong className="text-slate-200">Diritti dell&apos;Interessato:</strong> Ai sensi degli artt. 15–22 del GDPR, l&apos;utente ha il diritto di chiedere l&apos;accesso ai propri dati personali, la rettifica, la cancellazione, la limitazione del trattamento, l&apos;opposizione al trattamento e, ove applicabile, la portabilità dei dati. Le richieste vanno inviate a <a href="mailto:privacy@centmeta.it" className="text-blue-400 hover:underline">privacy@centmeta.it</a>. Rispondiamo alle richieste entro 30 giorni dalla ricezione. L&apos;utente ha inoltre il diritto di presentare reclamo al Garante per la protezione dei dati personali (<a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">www.garanteprivacy.it</a>).
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
                <strong className="text-slate-200">Autore e Paternità:</strong> L&apos;infrastruttura backend (Python/FastAPI), l&apos;algoritmo di elaborazione dati, il codice sorgente frontend (Next.js/React) e il marchio &quot;CentMeta&quot; sono stati interamente ideati e sviluppati da Filippo Zanardi.
              </p>
              <p>
                <strong className="text-slate-200">Licenza Software (MIT):</strong> Il codice sorgente del progetto è open source e distribuito con licenza <strong className="text-slate-100">MIT</strong>. I repository di sviluppo sono liberamente consultabili su GitHub:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
                <li>
                  <a 
                    href="https://github.com/sirfilips/centmeta-frontend" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-400 hover:underline font-medium"
                  >
                    Frontend Next.js (GitHub)
                  </a>
                </li>
                <li>
                  <a 
                    href="https://github.com/sirfilips/centmeta-backend" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-400 hover:underline font-medium"
                  >
                    Backend FastAPI &amp; Worker analitico (GitHub)
                  </a>
                </li>
              </ul>
              <p>
                Fatti salvi i diritti legati ai contenuti di gioco (come indicato nella Policy ufficiale WotC in calce), l&apos;architettura del software e il design dell&apos;interfaccia sono proprietà intellettuale del suo autore. Il marchio e l&apos;identità visiva di CentMeta non possono essere utilizzati per contraddistinguere servizi terzi o generare confusione nella community.
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
                Le liste dei mazzi analizzate derivano da liste rese pubbliche dai rispettivi autori su Moxfield, servizio con cui CentMeta non ha alcuna affiliazione ufficiale. Di ciascun mazzo vengono conservati solo l&apos;identificativo pubblico (<code className="text-blue-300 text-xs bg-slate-800 px-1.5 py-0.5 rounded">id_moxfield</code>), il comandante, la data di aggiornamento e l&apos;elenco delle carte; poiché l&apos;identificativo pubblico del mazzo può ricondurre al profilo dell&apos;autore su Moxfield, esso può costituire un dato personale indiretto. Gli autori non vengono informati singolarmente (art. 14, par. 5, lett. b GDPR): la misura adottata è la presente informativa pubblica, insieme alla possibilità di ottenere la rimozione su richiesta. La raccolta dei dati avviene tramite un accesso concordato con Moxfield, nel rispetto del limite di frequenza da loro indicato.
              </p>
              <p>
                <strong className="text-slate-200">Conservazione delle liste e lista di esclusione (Blacklist):</strong> I dati tecnici dei mazzi pubblici sono conservati finché il mazzo resta pubblico su Moxfield. Qualora una lista venga cancellata o resa privata su Moxfield, essa viene rimossa automaticamente dal database attivo alla prima sincronizzazione notturna utile (ore 23:00), fatta salva la copia tecnica di sicurezza (<code className="text-blue-300 text-xs bg-slate-800 px-1.5 py-0.5 rounded">centurion.db.bak</code>) sovrascritta ogni 24 ore. CentMeta è e resterà gratuito per tutti gli utenti. Chi non desidera che un proprio mazzo sia incluso nelle statistiche può scrivere a <a href="mailto:privacy@centmeta.it" className="text-blue-400 hover:underline">privacy@centmeta.it</a> per chiederne la rimozione (artt. 17 e 21 GDPR); le richieste vengono evase entro 30 giorni dalla ricezione. In caso di richiesta di rimozione, la lista viene cancellata dal database statistico e il solo identificativo <code className="text-blue-300 text-xs bg-slate-800 px-1.5 py-0.5 rounded">id_moxfield</code> (unitamente alla data di rimozione) viene conservato in una lista tecnica interna di esclusione (<em>blacklist / suppression list</em>) al solo fine di impedire che il crawler notturno reimporti automaticamente il mazzo nei cicli successivi (art. 17, par. 3, lett. b e art. 21 GDPR).
              </p>
              <p>
                I dati tecnici relativi alle carte (Testo Oracle, Costo di Mana, Identità di Colore e Immagini in alta definizione) sono forniti tramite le API pubbliche di <a href="https://scryfall.com" target="_blank" rel="noopener noreferrer" className="text-slate-200 hover:text-blue-400 underline decoration-slate-600 underline-offset-2 transition-colors">Scryfall</a>, che ringraziamo per l&apos;immenso contributo fornito alla community, pur non avendo noi alcuna affiliazione ufficiale con il loro servizio.
              </p>
              <p>
                L&apos;iconografia utilizzata per i simboli del mana e i tipi di carta proviene dal pacchetto vettoriale <a href="https://mana.andrewgioia.com/" target="_blank" rel="noopener noreferrer" className="text-slate-200 hover:text-blue-400 underline decoration-slate-600 underline-offset-2 transition-colors">Mana Font</a>, creato e mantenuto da Andrew Gioia.
              </p>
              <p>
                I dati statistici elaborati derivano da informazioni pubbliche, rielaborate unicamente per scopi statistici, informativi e comunitari per il formato Centurion Commander.
              </p>
              <p>
                CentMeta accetta donazioni volontarie (tramite Ko-fi) per coprire i costi di hosting e manutenzione. L&apos;accesso a tutte le statistiche resta gratuito per tutti gli utenti, senza funzionalità, dati o contenuti riservati a chi effettua una donazione.
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
