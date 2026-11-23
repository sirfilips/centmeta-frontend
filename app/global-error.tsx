"use client";

import { useEffect } from "react";
import "./globals.css";
import FblthpEasterEgg from "../components/FblthpEasterEgg";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Errore critico CentMeta:", error);
  }, [error]);

  return (
    <html lang="it" className="h-full">
      <body className="min-h-full flex flex-col bg-slate-900 text-slate-200 font-sans antialiased">
        <header className="border-b border-slate-800/80">
          <div className="max-w-[1150px] w-full mx-auto px-4 md:px-8 h-16 flex items-center">
            <a href="/" className="text-xl font-bold text-white tracking-wide">
              CentMeta
            </a>
          </div>
        </header>

        <main className="flex-grow max-w-[1150px] w-full mx-auto px-4 md:px-8 pt-12 pb-24 flex flex-col justify-center">
          <div className="max-w-2xl">
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-rose-400 font-bold">
              Errore critico
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-wide mt-2">
              Impossibile caricare l&apos;applicazione
            </h1>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed mt-4 pb-8 border-b border-slate-700/70">
              Si è verificato un problema inatteso nel rendering della pagina.
              Ricarica la vista oppure torna alla home.
            </p>

            <div className="pt-7">
              <FblthpEasterEgg variant="error" />
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-7">
              <button
                type="button"
                onClick={() => reset()}
                className="bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 hover:text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-full transition-all border border-blue-500/30"
              >
                Riprova
              </button>
              <a
                href="/"
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-full transition-all border border-slate-700"
              >
                Torna alla Home
              </a>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
