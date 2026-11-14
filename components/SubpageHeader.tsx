import React from 'react';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';

export function SubpageHeader() {
  return (
    <header className="bg-slate-900 border-b border-slate-800 shadow-lg relative z-50">
      <div className="max-w-[1000px] w-full mx-auto py-3 md:py-4 px-4 md:px-8 flex justify-center sm:justify-start">
        <a href="/" className="w-36 sm:w-48 cursor-pointer hover:opacity-80 transition-opacity">
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
    </header>
  );
}

export function BackToDashboardLink() {
  return (
    <a
      href="/"
      className="mb-8 bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 hover:text-white text-xs md:text-sm font-bold px-5 py-2.5 rounded-full transition-all duration-300 shadow-md border border-blue-500/30 inline-flex items-center gap-2 w-fit group"
    >
      <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" strokeWidth={2.5} />
      Torna alla Dashboard
    </a>
  );
}

