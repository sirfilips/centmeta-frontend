import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FblthpEasterEgg from "../components/FblthpEasterEgg";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans flex flex-col">
      <Header />

      <main className="flex-grow max-w-[1150px] w-full mx-auto px-4 md:px-8 pt-12 pb-24 flex flex-col justify-center">
        <div className="max-w-2xl">
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-blue-400 font-bold">
            Errore 404
          </span>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-white tracking-wide mt-2">
            Pagina non trovata
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed mt-4 pb-8 border-b border-slate-700/70">
            Il comandante o la pagina che stai cercando non esiste oppure non è
            più presente nel database CentMeta.
          </p>

          <div className="pt-7">
            <FblthpEasterEgg variant="404" />
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-7">
            <Link
              href="/"
              className="bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 hover:text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-full transition-all border border-blue-500/30 inline-flex items-center gap-2 group"
            >
              <ArrowLeft
                className="w-4 h-4 transition-transform group-hover:-translate-x-1"
                strokeWidth={2.5}
              />
              Torna alla Dashboard
            </Link>
            <Link
              href="/?view=commanders"
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-full transition-all border border-slate-700 inline-flex items-center gap-2"
            >
              Esplora i Comandanti
            </Link>
            <Link
              href="/storico"
              className="text-xs sm:text-sm text-slate-400 hover:text-slate-200 px-2 py-2 transition-colors"
            >
              Storico Metagame →
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
