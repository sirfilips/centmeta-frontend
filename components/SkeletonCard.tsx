export default function SkeletonCard() {
  return (
    <div className="flex flex-col items-center animate-pulse">
      <div className="w-full h-80 bg-slate-800/40 rounded-xl mb-3"></div>
      <div className="w-3/4 h-3 bg-slate-700/50 rounded mb-1.5"></div>
      <div className="w-1/2 h-3 bg-slate-700/50 rounded"></div>
    </div>
  );
}