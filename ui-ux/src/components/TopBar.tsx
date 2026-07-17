import React from 'react';

interface TopBarProps {
  activeScreen?: string;
  setActiveScreen?: (screen: string) => void;
  isLoggedIn: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  isLoggedIn
}) => {
  return (
    <div className="w-full h-14 bg-white border-b border-slate-200 text-slate-900 flex items-center justify-between px-6 z-50 sticky top-0 font-sans shadow-sm">
      {/* Brand & Logo Info */}
      <div className="flex items-center gap-3">
        {/* Logo Icon Box */}
        <div className="flex h-7 w-7 items-center justify-center rounded bg-indigo-650 text-white font-bold text-sm">
          ✢
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-sm font-extrabold tracking-tight">Omaha</span>
          <span className="text-xxs text-slate-400 font-medium font-mono">- hi-fi</span>
        </div>
        {/* Version Pill */}
        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xxs font-semibold text-slate-650 border border-slate-200">
          v1.0
        </span>
      </div>

      {/* Flow/Meta Indicator (Top Right) */}
      <div className="flex items-center gap-2.5 text-xxs font-semibold tracking-wide text-slate-500 uppercase">
        {isLoggedIn ? (
          <span className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50/50 border border-emerald-100 px-2 py-0.5 rounded-full">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Session Active
          </span>
        ) : (
          <span className="text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full">Logged Out</span>
        )}
      </div>
    </div>
  );
};

