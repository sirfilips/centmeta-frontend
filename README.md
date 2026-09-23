# CentMeta - Frontend

CentMeta è un'applicazione web indipendente e open-source dedicata all'analisi statistica e al monitoraggio del metagame per il formato Centurion Commander di Magic: The Gathering. 

Questo repository contiene esclusivamente il codice sorgente del frontend, progettato per offrire un'interfaccia utente fluida, reattiva e priva di tracciamento (cookie-free).

## Funzionalità Principali

*   **Dashboard Modulare:** Interfaccia a carosello per la consultazione rapida delle metriche globali, con evidenza sui comandanti e sulle carte in maggiore ascesa (metrica "Hot 7gg").
*   **Analisi Dettagliata:** Schede analitiche per singolo comandante comprendenti distribuzioni statistiche (composizione del mazzo, curva del mana) e tassi di sinergia delle carte.
*   **Filtri Dinamici e Navigazione:** Motore di ricerca avanzato con filtri cumulativi per identità di colore e tipologia. Gestione dello stato tramite URL per garantire la condivisibilità dei parametri di ricerca e la compatibilità con la navigazione del browser.
*   **Design Responsivo:** Layout ottimizzato per dispositivi mobili con interfacce a comparsa, affiancato da un'esperienza desktop arricchita da elementi visivi di profondità.

## Stack Tecnologico

Il progetto è basato sui moderni standard dello sviluppo web frontend:
*   **Framework:** Next.js (architettura App Router)
*   **Libreria UI:** React
*   **Styling:** Tailwind CSS
*   **Iconografia:** Lucide React
*   **Integrazioni API:** Scryfall API (metadati carte)

## Requisiti di Sistema

Per eseguire il progetto in ambiente di sviluppo locale, è necessario aver installato:
*   Node.js (versione 18.0 o superiore consigliata)
*   npm (Node Package Manager)

## Installazione e Avvio

1. Clonare il repository in locale:
```bash
git clone https://github.com/siriflips/centmeta-frontend.git
```

2. Accedere alla directory del progetto:
```bash
cd centmeta-frontend
```

3. Installare le dipendenze:
```bash
npm install
```

4. Avviare il server di sviluppo:
```bash
npm run dev
```

L'applicazione sarà accessibile all'indirizzo `http://localhost:3000`.

## Struttura del Progetto

*   `/app`: Contiene le logiche di routing di Next.js e le pagine principali.
*   `/components`: Moduli dell'interfaccia utente riutilizzabili (pulsanti, grafici, layout carte).
*   `/public`: Risorse statiche come immagini, loghi e file di configurazione client-side.
*   `/utils`: Funzioni di supporto, formattazione dati e logiche di interazione.

## Conformità alla Privacy

Il frontend di CentMeta è progettato secondo i principi della "Privacy by Design". L'architettura è completamente priva di cookie (cookie-free). Non sono integrati tracker di terze parti, pixel pubblicitari o strumenti di profilazione utente, rendendo l'applicazione intrinsecamente conforme alle normative GDPR in materia di consenso.

## Note Legali e Proprietà Intellettuale

L'architettura del software frontend e il design dell'interfaccia sono proprietà intellettuale di Filippo Zanardi.

Le informazioni letterali e grafiche presentate su questo sito, riguardanti Magic: The Gathering, comprese le immagini delle carte e il testo Oracle, sono di proprietà di Wizards of the Coast, LLC, una consociata di Hasbro, Inc. 

**Wizards of the Coast Fan Content Policy:**
CentMeta è un contenuto amatoriale non ufficiale consentito dalle Linee guida sui contenuti amatoriali. Non è approvato né autorizzato da Wizards. Parte dei materiali utilizzati è proprietà di Wizards of the Coast. © Wizards of the Coast LLC.
