import React from 'react';

const TrendIndicator = ({ trend, delta }: { trend?: number | string | null, delta?: number | null }) => {
  if (delta !== undefined && delta !== null) {
    if (delta > 0) return <span className="text-[10px] bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded font-bold tracking-wide">+{delta}</span>;
    return null;
  }
  
  // Se è "Tutti i tempi", nasconde l'indicatore
  if (trend === "") return null; 
  
  if (trend === null || trend === undefined) return <span className="text-blue-400 text-[11px] font-black tracking-wider">NEW</span>;
  if (typeof trend === 'number' && trend > 0) return <span className="text-emerald-400 text-[11px] font-bold flex items-center">▲ {trend}</span>;
  if (typeof trend === 'number' && trend < 0) return <span className="text-red-400 text-[11px] font-bold flex items-center">▼ {Math.abs(trend)}</span>;
  
  return <span className="text-slate-500 text-[11px] font-bold flex items-center">━</span>;
};

export default TrendIndicator;