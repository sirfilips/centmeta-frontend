"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, Sparkles, Trophy, Compass } from "lucide-react";

export default function CommunityNav() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/community", label: "Panoramica", icon: Compass },
    { href: "/community/vota", label: "Vota Carte", icon: Sparkles },
    { href: "/community/classifica", label: "Classifica", icon: Trophy },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 shadow-lg relative z-50">
      <div className="max-w-[1200px] w-full mx-auto py-3 px-4 md:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        
        {/* Logo e Torna Indietro */}
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
          <Link
            href="/"
            className="w-32 sm:w-40 cursor-pointer hover:opacity-85 transition-opacity"
            title="Torna alla Dashboard CentMeta"
          >
            <Image
              src="/logo.png"
              alt="CentMeta Logo"
              width={260}
              height={80}
              priority
              className="w-full h-auto object-contain"
            />
          </Link>

          <Link
            href="/"
            className="text-xs sm:text-sm font-semibold text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-1.5 py-1 px-2.5 rounded-lg hover:bg-slate-800"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Dashboard</span>
          </Link>
        </div>

        {/* Tab di Navigazione Community */}
        <nav className="flex items-center gap-1.5 sm:gap-2 bg-slate-950/70 p-1 rounded-xl border border-slate-800 text-xs sm:text-sm font-bold">
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
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

      </div>
    </header>
  );
}
