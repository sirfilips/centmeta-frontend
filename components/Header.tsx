"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ExternalLink,
  ChevronDown,
  Trophy,
  Flame,
  Coffee,
  Sparkles,
  TrendingUp,
  Menu,
  X,
  Info,
  Activity,
  History,
  ShieldCheck,
  Compass,
  Layers,
} from "lucide-react";
import { trackEvent } from "../utils/analytics";

interface HeaderProps {
  filtroTempo?: string;
  setFiltroTempo?: (val: string) => void;
  onReset?: () => void;
  totalDecks?: number;
  lastUpdated?: string | null;
  onNavigate?: (
    mode: "commanders" | "cards",
    tab: string,
    sort: "top" | "hot" | "expansions",
    expCode?: string,
    roleKey?: string
  ) => void;
}

type DropdownKey = "commanders" | "cards" | "info" | null;

export default function Header({
  filtroTempo,
  setFiltroTempo,
  onReset,
  totalDecks,
  lastUpdated,
  onNavigate,
}: HeaderProps) {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const [openDropdown, setOpenDropdown] = useState<DropdownKey>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        setOpenDropdown(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "N/D";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("it-IT", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const periodParam =
    filtroTempo && filtroTempo !== "Ultimi 30 giorni"
      ? `&periodo=${encodeURIComponent(filtroTempo)}`
      : "";

  const handleNavClick = (
    mode: "commanders" | "cards",
    sort: "top" | "hot" | "expansions",
    roleKey?: string
  ) => {
    setOpenDropdown(null);
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(mode, "Top Cards", sort, undefined, roleKey);
    } else if (mode === "commanders") {
      router.push(`/?view=commanders&csort=${sort}${periodParam}`);
    } else {
      const roleQuery = roleKey ? `&role=${encodeURIComponent(roleKey)}` : "";
      router.push(`/?view=cards&tab=Top+Cards&cardsort=${sort}${roleQuery}${periodParam}`);
    }
  };

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    mode: "commanders" | "cards",
    sort: "top" | "hot" | "expansions",
    roleKey?: string
  ) => {
    if (!onNavigate || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey) {
      setOpenDropdown(null);
      setMobileMenuOpen(false);
      return;
    }
    e.preventDefault();
    handleNavClick(mode, sort, roleKey);
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey) return;
    e.preventDefault();
    setMobileMenuOpen(false);
    if (onReset) {
      onReset();
    } else {
      router.push("/");
    }
  };

  const toggleDropdown = (menu: Exclude<DropdownKey, null>) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const isStoricoActive = pathname === "/storico";
  const isInfoActive = ["/about", "/status", "/changelog", "/legal"].includes(
    pathname
  );

  return (
    <header className="bg-slate-900 border-b border-slate-800 py-2 md:py-3 px-3 md:px-6 xl:px-8 shadow-md relative z-[100]">
      <div className="flex flex-wrap justify-between items-center lg:grid lg:grid-cols-[auto_1fr_auto] xl:grid-cols-[1fr_auto_1fr] gap-y-2.5 lg:gap-4">
        {/* 1. LATO SINISTRO: Logo */}
        <div className="flex justify-start items-center shrink-0">
          <a
            href="/"
            onClick={handleLogoClick}
            className="block w-28 md:w-32 xl:w-44 transition-transform hover:scale-105"
            title="Torna alla Dashboard"
          >
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

        {/* 2. LATO DESTRO: Controlli (e Statistiche Desktop) */}
        <div className="flex flex-col items-end shrink-0 lg:col-start-3">
          <div className="flex flex-row items-center justify-end gap-1.5 md:gap-2">
            {filtroTempo !== undefined && setFiltroTempo !== undefined && (
              <select
                value={filtroTempo}
                onChange={(e) => {
                  trackEvent("Cambio Periodo Temporale", {
                    periodo: e.target.value,
                  });
                  setFiltroTempo(e.target.value);
                }}
                className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 text-[11px] md:text-xs font-semibold w-[104px] sm:w-28 xl:w-36 focus:outline-none focus:border-blue-500 text-slate-200 shadow-inner cursor-pointer hover:bg-slate-800 transition-colors"
              >
                <option value="Ultimi 7 giorni">7 giorni</option>
                <option value="Ultimi 30 giorni">30 giorni</option>
                <option value="Ultimi 3 mesi">3 mesi</option>
                <option value="Ultimi 6 mesi">6 mesi</option>
                <option value="Ultimo anno">Ultimo anno</option>
                <option value="Tutti i tempi">Tutti i tempi</option>
              </select>
            )}

            <a
              href="https://ko-fi.com/centmeta"
              data-umami-event="Click Ko-fi Header"
              target="_blank"
              rel="noopener noreferrer"
              title="Supporta CentMeta su Ko-fi"
              className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 hover:text-amber-400 px-2 sm:px-2.5 py-1.5 rounded-lg transition-colors border border-amber-500/30 flex items-center justify-center gap-1.5 shadow-sm group h-[28px] md:h-[30px]"
            >
              <Coffee className="w-3.5 h-3.5 md:w-4 md:h-4" strokeWidth={2.5} />
              <span className="hidden sm:inline text-[11px] md:text-xs font-bold">
                Supporta
              </span>
            </a>

            <a
              href="https://www.centurioncommander.eu/it/home-ita/"
              data-umami-event="Click Sito Centurion"
              target="_blank"
              rel="noopener noreferrer"
              title="Sito Ufficiale Centurion"
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg transition-colors border border-slate-700 flex items-center justify-center shadow-sm group h-[28px] md:h-[30px]"
            >
              <ExternalLink
                className="w-3.5 h-3.5 md:w-4 md:h-4 opacity-70 group-hover:opacity-100 transition-opacity"
                strokeWidth={2.5}
              />
            </a>

            <a
              href="https://github.com/sirfilips"
              data-umami-event="Click GitHub Header"
              target="_blank"
              rel="noopener noreferrer"
              title="Codice sorgente su GitHub"
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg transition-colors border border-slate-700 flex items-center justify-center shadow-sm group h-[28px] md:h-[30px]"
            >
              <svg
                role="img"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-3.5 h-3.5 md:w-4 md:h-4 opacity-70 group-hover:opacity-100 transition-opacity"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
          </div>

          {/* STATISTICHE DESKTOP */}
          <div className="hidden lg:flex items-center gap-2 mt-1.5 text-[10px] text-slate-400">
            {totalDecks !== undefined && (
              <span className="text-blue-400 font-bold bg-blue-950/30 px-1.5 rounded border border-blue-900/30">
                {totalDecks} mazzi
              </span>
            )}
            {lastUpdated && (
              <span>Aggiornato: {formatDate(lastUpdated)}</span>
            )}
          </div>
        </div>

        {/* 3. CENTRO: Navigazione Desktop + Barra Mobile */}
        <div className="flex flex-row justify-between lg:justify-center items-center w-full lg:w-auto lg:col-start-2 lg:row-start-1 min-w-0">
          {/* Menu Desktop (>= lg) */}
          <nav
            className="hidden lg:flex items-center gap-3.5 xl:gap-6 z-50 whitespace-nowrap"
            aria-label="Navigazione principale"
          >
            {/* Comandanti */}
            <div
              className="relative group"
              onMouseEnter={() => setOpenDropdown("commanders")}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                type="button"
                onClick={() => toggleDropdown("commanders")}
                className="flex items-center gap-1 text-slate-300 hover:text-white font-bold text-sm xl:text-base py-1 transition-colors"
              >
                Comandanti{" "}
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-300 ${
                    openDropdown === "commanders" ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-52 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl transition-all duration-200 origin-top z-[110] ${
                  openDropdown === "commanders"
                    ? "opacity-100 scale-100 visible"
                    : "opacity-0 scale-95 invisible"
                }`}
              >
                <div className="py-1.5 flex flex-col">
                  <a
                    href={`/?view=commanders&csort=top${periodParam}`}
                    onClick={(e) => handleLinkClick(e, "commanders", "top")}
                    data-umami-event="Header Menu - Top Comandanti"
                    className="flex items-center gap-2.5 text-left px-4 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors border-b border-slate-700/50"
                  >
                    <Trophy className="w-4 h-4 text-blue-400" /> Top Comandanti
                  </a>
                  <a
                    href={`/?view=commanders&csort=hot${periodParam}`}
                    onClick={(e) => handleLinkClick(e, "commanders", "hot")}
                    data-umami-event="Header Menu - Hot Comandanti"
                    className="flex items-center gap-2.5 text-left px-4 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                  >
                    <Flame className="w-4 h-4 text-orange-500" /> Hot (7 Giorni)
                  </a>
                </div>
              </div>
            </div>

            {/* Carte */}
            <div
              className="relative group"
              onMouseEnter={() => setOpenDropdown("cards")}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                type="button"
                onClick={() => toggleDropdown("cards")}
                className="flex items-center gap-1 text-slate-300 hover:text-white font-bold text-sm xl:text-base py-1 transition-colors"
              >
                Carte{" "}
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-300 ${
                    openDropdown === "cards" ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-52 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl transition-all duration-200 origin-top z-[110] ${
                  openDropdown === "cards"
                    ? "opacity-100 scale-100 visible"
                    : "opacity-0 scale-95 invisible"
                }`}
              >
                <div className="py-1.5 flex flex-col">
                  <a
                    href={`/?view=cards&tab=Top+Cards&cardsort=top${periodParam}`}
                    onClick={(e) => handleLinkClick(e, "cards", "top")}
                    data-umami-event="Header Menu - Top Carte"
                    className="flex items-center gap-2.5 text-left px-4 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors border-b border-slate-700/50"
                  >
                    <Trophy className="w-4 h-4 text-blue-400" /> Top Carte
                  </a>
                  <a
                    href={`/?view=cards&tab=Top+Cards&cardsort=hot${periodParam}`}
                    onClick={(e) => handleLinkClick(e, "cards", "hot")}
                    data-umami-event="Header Menu - Hot Carte"
                    className="flex items-center gap-2.5 text-left px-4 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors border-b border-slate-700/50"
                  >
                    <Flame className="w-4 h-4 text-orange-500" /> Hot (7 Giorni)
                  </a>
                  <a
                    href={`/?view=cards&tab=Top+Cards&cardsort=expansions${periodParam}`}
                    onClick={(e) => handleLinkClick(e, "cards", "expansions")}
                    data-umami-event="Header Menu - Ultime Espansioni"
                    className="flex items-center gap-2.5 text-left px-4 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors border-b border-slate-700/50"
                  >
                    <Sparkles className="w-4 h-4 text-purple-400" /> Ultime Espansioni
                  </a>
                  <a
                    href={`/?view=cards&tab=Top+Cards&cardsort=top&role=removal${periodParam}`}
                    onClick={(e) => handleLinkClick(e, "cards", "top", "removal")}
                    data-umami-event="Header Menu - Carte per Ruolo"
                    className="flex items-center gap-2.5 text-left px-4 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                  >
                    <Layers className="w-4 h-4 text-rose-400" /> Carte per Ruolo
                  </a>
                </div>
              </div>
            </div>

            {/* Storico Metagame (Link diretto di primo livello) */}
            <Link
              href="/storico"
              data-umami-event="Header Menu - Storico Metagame"
              className={`flex items-center gap-1.5 font-bold text-sm xl:text-base py-1 transition-colors whitespace-nowrap ${
                isStoricoActive
                  ? "text-blue-400"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Storico
            </Link>

            {/* Info & Progetto */}
            <div
              className="relative group"
              onMouseEnter={() => setOpenDropdown("info")}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                type="button"
                onClick={() => toggleDropdown("info")}
                className={`flex items-center gap-1 font-bold text-sm xl:text-base py-1 transition-colors ${
                  isInfoActive
                    ? "text-blue-400"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                Info{" "}
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-300 ${
                    openDropdown === "info" ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl transition-all duration-200 origin-top z-[110] ${
                  openDropdown === "info"
                    ? "opacity-100 scale-100 visible"
                    : "opacity-0 scale-95 invisible"
                }`}
              >
                <div className="py-1.5 flex flex-col">
                  <Link
                    href="/about"
                    onClick={() => setOpenDropdown(null)}
                    data-umami-event="Header Menu - Il Progetto"
                    className="flex items-center gap-2.5 text-left px-4 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors border-b border-slate-700/50"
                  >
                    <Compass className="w-4 h-4 text-blue-400" /> Il Progetto
                  </Link>
                  <Link
                    href="/status"
                    onClick={() => setOpenDropdown(null)}
                    data-umami-event="Header Menu - Stato Sistema"
                    className="flex items-center gap-2.5 text-left px-4 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors border-b border-slate-700/50"
                  >
                    <Activity className="w-4 h-4 text-emerald-400" /> Stato del Sistema
                  </Link>
                  <Link
                    href="/changelog"
                    onClick={() => setOpenDropdown(null)}
                    data-umami-event="Header Menu - Changelog"
                    className="flex items-center gap-2.5 text-left px-4 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors border-b border-slate-700/50"
                  >
                    <History className="w-4 h-4 text-purple-400" /> Changelog
                  </Link>
                  <Link
                    href="/legal"
                    onClick={() => setOpenDropdown(null)}
                    data-umami-event="Header Menu - Note Legali"
                    className="flex items-center gap-2.5 text-left px-4 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-slate-400" /> Privacy & Legali
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          {/* Barra Mobile (< lg): Hamburger + Accesso rapido Storico + Statistiche */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const next = !mobileMenuOpen;
                setMobileMenuOpen(next);
                if (next) trackEvent("Header - Apri Menu Mobile");
              }}
              aria-expanded={mobileMenuOpen}
              aria-label="Apri menu di navigazione"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition"
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4 text-blue-400" />
              ) : (
                <Menu className="w-4 h-4 text-blue-400" />
              )}
              <span>Menu</span>
            </button>

            <Link
              href="/storico"
              data-umami-event="Header Menu Mobile - Storico"
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold border transition ${
                isStoricoActive
                  ? "bg-blue-600/25 border-blue-500/50 text-blue-300"
                  : "bg-slate-800/70 border-slate-700/70 text-slate-300 hover:text-white"
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>Storico</span>
            </Link>
          </div>

          <div className="flex lg:hidden flex-col items-end text-[9px] sm:text-[10px] text-slate-400 leading-tight">
            {totalDecks !== undefined && (
              <span className="text-blue-400 font-bold bg-blue-950/30 px-1.5 rounded border border-blue-900/30 mb-0.5">
                {totalDecks} mazzi
              </span>
            )}
            {lastUpdated && (
              <span>Aggiornato: {formatDate(lastUpdated)}</span>
            )}
          </div>
        </div>
      </div>

      {/* DRAWER MOBILE ESPANDIBILE */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 pt-3 border-t border-slate-800 space-y-4 pb-2 animate-fade-in">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 px-1 mb-1.5">
              Esplora Meta
            </p>
            <div className="grid grid-cols-2 gap-2">
              <a
                href={`/?view=commanders&csort=top${periodParam}`}
                onClick={(e) => handleLinkClick(e, "commanders", "top")}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/60 text-xs font-semibold text-slate-200"
              >
                <Trophy className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                Top Comandanti
              </a>
              <a
                href={`/?view=commanders&csort=hot${periodParam}`}
                onClick={(e) => handleLinkClick(e, "commanders", "hot")}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/60 text-xs font-semibold text-slate-200"
              >
                <Flame className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                Hot Comandanti
              </a>
              <a
                href={`/?view=cards&tab=Top+Cards&cardsort=top${periodParam}`}
                onClick={(e) => handleLinkClick(e, "cards", "top")}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/60 text-xs font-semibold text-slate-200"
              >
                <Trophy className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                Top Carte
              </a>
              <a
                href={`/?view=cards&tab=Top+Cards&cardsort=hot${periodParam}`}
                onClick={(e) => handleLinkClick(e, "cards", "hot")}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/60 text-xs font-semibold text-slate-200"
              >
                <Flame className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                Hot Carte
              </a>
              <a
                href={`/?view=cards&tab=Top+Cards&cardsort=expansions${periodParam}`}
                onClick={(e) => handleLinkClick(e, "cards", "expansions")}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/60 text-xs font-semibold text-slate-200"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                Ultime Espansioni
              </a>
              <a
                href={`/?view=cards&tab=Top+Cards&cardsort=top&role=removal${periodParam}`}
                onClick={(e) => handleLinkClick(e, "cards", "top", "removal")}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/60 text-xs font-semibold text-slate-200"
              >
                <Layers className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                Carte per Ruolo
              </a>
              <Link
                href="/storico"
                onClick={() => setMobileMenuOpen(false)}
                className={`col-span-2 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-semibold ${
                  isStoricoActive
                    ? "bg-blue-600/20 border-blue-500/50 text-blue-300"
                    : "bg-slate-800/70 border-slate-700/60 text-slate-200"
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                Storico Meta
              </Link>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 px-1 mb-1.5">
              Info & Progetto
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold ${
                  pathname === "/about"
                    ? "bg-blue-600/20 border-blue-500/50 text-blue-300"
                    : "bg-slate-800/70 border-slate-700/60 text-slate-200"
                }`}
              >
                <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                Il Progetto
              </Link>
              <Link
                href="/status"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold ${
                  pathname === "/status"
                    ? "bg-blue-600/20 border-blue-500/50 text-blue-300"
                    : "bg-slate-800/70 border-slate-700/60 text-slate-200"
                }`}
              >
                <Activity className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                Stato Sistema
              </Link>
              <Link
                href="/changelog"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold ${
                  pathname === "/changelog"
                    ? "bg-blue-600/20 border-blue-500/50 text-blue-300"
                    : "bg-slate-800/70 border-slate-700/60 text-slate-200"
                }`}
              >
                <History className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                Changelog
              </Link>
              <Link
                href="/legal"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold ${
                  pathname === "/legal"
                    ? "bg-blue-600/20 border-blue-500/50 text-blue-300"
                    : "bg-slate-800/70 border-slate-700/60 text-slate-200"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                Privacy & Legali
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
