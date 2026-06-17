import React from 'react';
import { RefreshCw, Share2, Menu } from 'lucide-react';

interface HeaderProps {
  timeframe: string;
  setTimeframe: (timeframe: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  timeframe,
  setTimeframe,
  onRefresh,
  isRefreshing,
  onToggleSidebar
}) => {
  const timeframes = ['1d', '7d', '30d', '90d'];

  return (
    <header className="flex flex-col gap-4 border-b border-slate-200 bg-white px-6 py-4 md:flex-row md:items-center md:justify-between lg:h-20 lg:px-8">
      {/* Title & Mobile Trigger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 active:bg-slate-100 lg:hidden transition-colors"
          aria-label="Toggle Sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl font-sans">
            Monitoring
          </h1>
          <p className="mt-0.5 text-xs text-slate-500 font-sans md:text-sm">
            Live overview of test execution and project health across your stack.
          </p>
        </div>
      </div>

      {/* Controls: Time Range & Action Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Timeframe Selector Pill */}
        <div className="flex rounded-lg bg-slate-100 p-0.5 border border-slate-200">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`
                rounded-md px-3.5 py-1 text-xs font-semibold tracking-wide transition-all duration-150
                ${timeframe === tf
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'
                }
              `}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 active:bg-slate-100 disabled:opacity-50 transition-all"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-slate-500 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          {/* Share Button */}
          <button
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 active:bg-slate-100 transition-all"
          >
            <Share2 className="h-3.5 w-3.5 text-slate-500" />
            <span>Share</span>
          </button>
        </div>
      </div>
    </header>
  );
};
