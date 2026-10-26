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
      className="text-sm md:text-base font-bold text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-2 mb-10 w-fit group"
    >
      <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
      Torna alla Dashboard
    </a>
  );
}

