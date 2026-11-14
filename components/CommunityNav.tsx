"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, Swords, Trophy, Compass } from "lucide-react";
import Header from "./Header";

export default function CommunityNav() {
  const pathname = usePathname();

  const isCommunityRoot = pathname === "/community";
  const backHref = isCommunityRoot ? "/" : "/community";
  const backLabel = isCommunityRoot ? "Dashboard" : "Hub Community";

  const navLinks = [
    { href: "/community", label: "Panoramica", icon: Compass },
    { href: "/community/vota", label: "Vota Carte", icon: Swords },
    { href: "/community/classifica", label: "Classifica", icon: Trophy },
  ];

  return (
    <>
      <Header />
      <div className="bg-slate-800/30 border-b border-slate-700/50 relative z-40">
        <div className="max-w-[1600px] w-full mx-auto py-2.5 px-4 md:px-8 flex flex-wrap justify-between items-center gap-3">
          <Link
            href={backHref}
            className="text-xs sm:text-sm font-semibold text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-1.5 py-1 px-2.5 rounded-lg hover:bg-slate-800"
            title={`Torna a ${backLabel}`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{backLabel}</span>
          </Link>

          {/* Tab di Navigazione Community */}
          <nav
            aria-label="Navigazione Community"
            className="flex items-center gap-1.5 sm:gap-2 bg-slate-950/70 p-1 rounded-xl border border-slate-800 text-xs sm:text-sm font-bold"
          >
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-900/40"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      isActive ? "text-white" : "text-slate-400"
                    }`}
                  />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}
