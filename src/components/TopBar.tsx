import React from 'react';

interface TopBarProps {
  activeScreen: string; // 'login' | 'dashboard' | 'detail' | 'test-cases'
  setActiveScreen: (screen: string) => void;
  isLoggedIn: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeScreen,
  setActiveScreen,
  isLoggedIn
}) => {
  const tabs = [
    { id: 'login', label: '1 · Login' },
    { id: 'dashboard', label: '2 · Dashboard' },
    { id: 'detail', label: '3 · Detail' },
    { id: 'test-cases', label: '4 · Test cases' }
  ];

  return (
    <div className="w-full h-14 bg-slate-900 border-b border-slate-800 text-white flex items-center justify-between px-6 z-50 sticky top-0 font-sans">
      {/* Brand & Logo Info */}
      <div className="flex items-center gap-3">
        {/* Logo Icon Box */}
        <div className="flex h-7 w-7 items-center justify-center rounded bg-indigo-600 text-white font-bold text-sm">
          ✢
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-sm font-extrabold tracking-tight">Omaha</span>
          <span className="text-xxs text-slate-500 font-medium font-mono">- hi-fi</span>
        </div>
        {/* Version Pill */}
        <span className="rounded bg-slate-800 px-1.5 py-0.5 text-xxs font-semibold text-slate-400 border border-slate-700">
          v1.0
        </span>
      </div>

      {/* Navigation Tabs (Top Center) */}
      <nav className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
        {tabs.map((tab) => {
          const isActive = activeScreen === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveScreen(tab.id)}
              className={`
                rounded-md px-3.5 py-1 text-xs font-semibold tracking-wide transition-all duration-150
                ${isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                }
              `}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Flow/Meta Indicator (Top Right) */}
      <div className="hidden md:flex items-center gap-2.5 text-xxs font-semibold tracking-wide text-slate-500 uppercase">
        {isLoggedIn ? (
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Session Active
          </span>
        ) : (
          <span className="text-slate-500">Logged Out</span>
        )}
        <span className="text-slate-700">|</span>
        <span>Flow: Login → Dashboard → Detail → Tests</span>
      </div>
    </div>
  );
};
