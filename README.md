# CentMeta - Frontend

<p align="left">
  <a href="https://centmeta.it"><img src="https://img.shields.io/badge/Website-centmeta.it-3b82f6?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Website" /></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-10b981?style=for-the-badge" alt="License: MIT" /></a>
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js_14-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js 14" /></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 18" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" /></a>
  <a href="https://www.moxfield.com/"><img src="https://img.shields.io/badge/Decklists-Moxfield-582CD6?style=for-the-badge" alt="Moxfield" /></a>
  <a href="https://scryfall.com/"><img src="https://img.shields.io/badge/Cards-Scryfall_API-2B2D42?style=for-the-badge" alt="Scryfall API" /></a>
  <a href="https://github.com/sirfilips/centmeta-backend"><img src="https://img.shields.io/badge/Backend_Repo-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="Backend Repo" /></a>
  <a href="https://ko-fi.com/centmeta"><img src="https://img.shields.io/badge/Support_on-Ko--fi-FF5E5B?style=for-the-badge&logo=kofi&logoColor=white" alt="Support on Ko-fi" /></a>
</p>

CentMeta è un'applicazione web indipendente e open-source dedicata all'analisi statistica e al monitoraggio del metagame per il formato Centurion Commander di Magic: The Gathering. 

Questo repository contiene esclusivamente il codice sorgente del frontend, progettato per offrire un'interfaccia utente fluida, reattiva e priva di cookie di profilazione (cookie-free).

> 🔗 **Repository Backend Correlato**: Il motore analitico, lo scraper per Moxfield e le REST API in FastAPI sono disponibili su [sirfilips/centmeta-backend](https://github.com/sirfilips/centmeta-backend).

## Funzionalità Principali

*   **Dashboard Modulare:** Interfaccia a carosello per la consultazione rapida delle metriche globali, con evidenza sui comandanti e sulle carte in maggiore ascesa (metrica "Hot 7gg").
*   **Ricerca Unificata Hero:** Motore di ricerca istantaneo nella Hero della homepage per trovare comandanti e carte con navigazione da tastiera e filtri rapidi.
*   **Analisi Dettagliata:** Schede analitiche per singolo comandante comprendenti distribuzioni statistiche (composizione del mazzo, curva del mana), tassi di sinergia delle carte e supporto nativo HTML5 Drag & Drop verso il deckbuilder di Moxfield.
*   **Filtri Dinamici e Navigazione:** Motore di ricerca avanzato con filtri cumulativi per identità di colore e tipologia. Gestione dello stato tramite URL (`?periodo=`, `csort`, `cardsort`) per garantire la condivisibilità dei parametri di ricerca e la compatibilità con la navigazione del browser.
*   **Design Responsivo:** Layout ottimizzato per dispositivi mobili con interfacce a comparsa, affiancato da un'esperienza desktop arricchita da elementi visivi di profondità.

## Stack Tecnologico

Il progetto è basato sui moderni standard dello sviluppo web frontend:
*   **Framework:** Next.js 14 (architettura App Router)
*   **Libreria UI:** React 18 & TypeScript
*   **Styling:** Tailwind CSS
*   **Iconografia:** Lucide React & Mana Font
*   **Integrazioni API:** Backend FastAPI & Scryfall API (metadati carte)

## Requisiti di Sistema

Per eseguire il progetto in ambiente di sviluppo locale, è necessario aver installato:
*   Node.js (versione 18.0 o superiore consigliata)
*   npm (Node Package Manager)

## Installazione e Avvio

1. Clonare il repository in locale:
```bash
git clone https://github.com/sirfilips/centmeta-frontend.git
```

2. Accedere alla directory del progetto:
```bash
cd centmeta-frontend
```

3. Installare le dipendenze:
```bash
npm install
```

4. Configurare (opzionalmente) le variabili d'ambiente creando un file `.env.local`:
```env
# URL interno del backend FastAPI per chiamate SSR/SEO (default: http://127.0.0.1:8000)
API_INTERNAL_URL=http://127.0.0.1:8000

# Opzionali: Configurazione Umami Analytics (cookie-free)
NEXT_PUBLIC_UMAMI_WEBSITE_ID=
NEXT_PUBLIC_UMAMI_SCRIPT_URL=
```

5. Avviare il server di sviluppo:
```bash
npm run dev
```

L'applicazione sarà accessibile all'indirizzo `http://localhost:3000`.

## Struttura del Progetto

*   `/app`: Contiene le logiche di routing di Next.js e le pagine principali (`/`, `/commander/[slug]`, `/about`, `/changelog`, `/status`, `/legal`).
*   `/components`: Moduli dell'interfaccia utente riutilizzabili (pulsanti, grafici, layout carte).
*   `/public`: Risorse statiche come immagini, loghi e file di configurazione client-side.
*   `/utils`: Funzioni di supporto, formattazione dati e logiche di interazione (`mtg.ts`).

## Conformità alla Privacy

Il frontend di CentMeta è progettato secondo i principi della "Privacy by Design". L'architettura è completamente priva di cookie (cookie-free). Non sono integrati cookie di profilazione, pixel pubblicitari o strumenti invasivi di tracciamento utente. Per le statistiche aggregate di utilizzo può essere integrato opzionalmente **Umami Analytics** in modalità cookie-free e anonima, rendendo l'applicazione intrinsecamente conforme alle normative GDPR senza necessità di banner per il consenso dei cookie.

## Note Legali e Proprietà Intellettuale

L'architettura del software frontend e il design dell'interfaccia sono proprietà intellettuale di Filippo Zanardi.

Le informazioni letterali e grafiche presentate su questo sito, riguardanti Magic: The Gathering, comprese le immagini delle carte e il testo Oracle, sono di proprietà di Wizards of the Coast, LLC, una consociata di Hasbro, Inc. 

**Wizards of the Coast Fan Content Policy:**
CentMeta è un contenuto amatoriale non ufficiale consentito dalle Linee guida sui contenuti amatoriali. Non è approvato né autorizzato da Wizards. Parte dei materiali utilizzati è proprietà di Wizards of the Coast. © Wizards of the Coast LLC.
