"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FblthpEasterEgg from "../components/FblthpEasterEgg";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Errore applicativo CentMeta:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans flex flex-col">
      <Header />

      <main className="flex-grow max-w-[1150px] w-full mx-auto px-4 md:px-8 pt-12 pb-24 flex flex-col justify-center">
        <div className="max-w-2xl">
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-rose-400 font-bold">
            Errore imprevisto
          </span>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-white tracking-wide mt-2">
            Qualcosa è andato storto
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed mt-4 pb-8 border-b border-slate-700/70">
            Si è verificato un errore durante il caricamento di questa vista.
            Puoi riprovare subito oppure tornare alla dashboard principale.
          </p>

          <div className="pt-7">
            <FblthpEasterEgg variant="error" />
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-7">
            <button
              type="button"
              onClick={() => reset()}
              className="bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 hover:text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-full transition-all border border-blue-500/30 inline-flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Riprova
            </button>
            <Link
              href="/"
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-full transition-all border border-slate-700 inline-flex items-center gap-2"
            >
              Torna alla Dashboard
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
