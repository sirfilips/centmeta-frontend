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

*   **Dashboard Modulare & Ruoli:** Interfaccia a carosello per la consultazione rapida di comandanti e carte in evidenza, tendenze *Hot 7gg*, espansioni recenti e sezioni dedicate alle **Migliori Carte per Ruolo** (*Removal*, *Botti*, *Counterspell*, *Card Draw*, *Scartini*, *Board Wipe*, *Tutori*, *Ramp*).
*   **Ricerca Unificata & Sintassi Scryfall:** Barra di ricerca nella Hero e nelle griglie con autocomplete accessibile (`combobox`/`listbox`), guida rapida integrata e supporto alla sintassi Scryfall (`t:`, `o:`, `id:`, `c:`, `mv`, `kw:`, `is:`, `role:`, logica booleana, `!=` ed espressioni regex protette anti-ReDoS).
*   **Analisi Comandante, Confronto & Appunti Mazzo:** Schede analitiche con composizione, curva del mana e sinergie; strumento **Confronta Lista** (import da Moxfield, MTG Arena e MTGO) e pannello **Appunti Mazzo** client-side persistente in `localStorage` con verifica identità colore, HTML5 Drag & Drop ed export pronto per Moxfield.
*   **Storico Metagame & Stato Sistema:** Grafici interattivi fino a 24 mesi su `/storico` (quote comandanti, volume mazzi, varietà del meta, distribuzione colori) e pagina `/status` per il monitoraggio dell'infrastruttura.
*   **Filtri Condivisibili & Pagine di Errore:** Stato sincronizzato via URL (`?periodo=`, `?view=`, `csort`, `cardsort`, `?search=`) compatibile con la cronologia del browser e pagine di errore personalizzate (`not-found`, `error`, `global-error`).

## Stack Tecnologico

Il progetto è basato sui moderni standard dello sviluppo web frontend:
*   **Framework:** Next.js 14 (architettura App Router)
*   **Libreria UI:** React 18 & TypeScript
*   **Styling:** Tailwind CSS
*   **Iconografia & Font:** Lucide React, Mana Font & `@fontsource` (*Newsreader*, *Plus Jakarta Sans*, *JetBrains Mono*)
*   **Integrazioni API:** Backend FastAPI & Scryfall API (metadati carte)

## Requisiti di Sistema

Per eseguire il progetto in ambiente di sviluppo locale, è necessario aver installato:
*   Node.js (versione 18.17 o superiore; consigliato **Node.js 20 LTS**, utilizzato in CI)
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

# Opzionale: origine pubblica API client-side (vuoto = usa il rewrite /api/*)
NEXT_PUBLIC_API_URL=

# Opzionali: Configurazione Umami Analytics (cookie-free)
NEXT_PUBLIC_UMAMI_WEBSITE_ID=
NEXT_PUBLIC_UMAMI_SCRIPT_URL=
```

5. Avviare il server di sviluppo:
```bash
npm run dev
```

L'applicazione sarà accessibile all'indirizzo `http://localhost:3000`. In sviluppo locale `next.config.js` reindirizza automaticamente le chiamate `/api/*` verso `http://127.0.0.1:8000/api/*`: per popolare dashboard e grafici con dati reali è quindi necessario avere in esecuzione il backend sulla porta `8000`.

## Test e Build

```bash
# Verifica tipi TypeScript
npx tsc --noEmit

# Esecuzione suite di unit test
npm test

# Build di produzione e avvio
npm run build
npm run start
```

## Struttura del Progetto

*   `/app`: Routing Next.js App Router e pagine principali (`/`, `/commander/[nome]`, `/storico`, `/status`, `/about`, `/changelog`, `/legal`), insieme ai file SEO (`sitemap.ts`, `robots.ts`, `manifest.ts`) e ai boundary di errore (`not-found.tsx`, `error.tsx`, `global-error.tsx`).
*   `/components`: Moduli dell'interfaccia utente riutilizzabili (caroselli, grafici storici, modale di confronto, Appunti Mazzo, filtri e menu accessibili).
*   `/utils`: Logiche client/SSR pure, tra cui `mtg.ts`, `scryfallSearch.ts`, `decklistParser.ts`, `notesStorage.ts`, `og.ts` e `useDialogFocus.ts`.
*   `/tests` & `/scripts`: Suite di unit test e runner (`scripts/run-tests.mjs`).
*   `/public`: Risorse statiche, icone PWA, immagine OpenGraph e manifest.

## Conformità alla Privacy

Il frontend di CentMeta è progettato secondo i principi della "Privacy by Design". L'architettura è completamente priva di cookie (cookie-free) e protetta da header HTTP di sicurezza dedicati (`Content-Security-Policy`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `HSTS`). Non sono integrati cookie di profilazione né pixel pubblicitari, e tutti i contenuti inseriti dall'utente negli strumenti locali (**Appunti Mazzo**, **Confronta Lista**, Drag & Drop) restano esclusivamente nel browser (`localStorage`). Per le statistiche aggregate di utilizzo può essere integrato opzionalmente **Umami Analytics** in modalità anonima e senza cookie, in conformità al GDPR.

## Contribuire

Lo sviluppo avviene sul branch `dev`, poi unito su `main` per il rilascio:

1. Apri una issue per segnalare bug o proporre miglioramenti.
2. Lavora su un branch derivato da `dev`.
3. Prima di aprire una Pull Request, verifica che `npx tsc --noEmit`, `npm test` e `npm run build` completino senza errori.

## Licenza, Note Legali e Proprietà Intellettuale

Il codice sorgente è rilasciato sotto licenza open-source [MIT](./LICENSE).

L'architettura del software frontend e il design dell'interfaccia sono proprietà intellettuale di Filippo Zanardi.

Le informazioni letterali e grafiche presentate su questo sito, riguardanti Magic: The Gathering, comprese le immagini delle carte e il testo Oracle, sono di proprietà di Wizards of the Coast, LLC, una consociata di Hasbro, Inc.

**Wizards of the Coast Fan Content Policy:**
CentMeta è un contenuto amatoriale non ufficiale consentito dalle Linee guida sui contenuti amatoriali. Non è approvato né autorizzato da Wizards. Parte dei materiali utilizzati è proprietà di Wizards of the Coast. © Wizards of the Coast LLC.
