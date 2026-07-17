import React from 'react';
import { Play, Eye } from 'lucide-react';

interface HeroBannerProps {
  onRunAll: () => void;
  isRunning: boolean;
  totalTests: number;
  activeSuites: number;
  executionsToday: number;
  passRate: number;
  avgRuntimeMs: number;
  isLoading?: boolean;
}

const formatDuration = (ms: number): string => {
  if (!ms) return '0s';
  if (ms < 1000) return `${ms}ms`;
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor(ms / 60000);
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  const tenths = Math.floor((ms % 1000) / 100);
  return `${seconds}.${tenths}s`;
};

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onRunAll,
  isRunning,
  totalTests,
  activeSuites,
  executionsToday,
  passRate,
  avgRuntimeMs,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 animate-pulse">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2 h-48 bg-slate-100" />
        <div className="flex flex-col gap-3 justify-between">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm h-14 bg-slate-100" />
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm h-14 bg-slate-100" />
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm h-14 bg-slate-100" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Left 2 Columns: Banner Detail */}
      <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
        <div className="space-y-4">
          {/* Pills row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-xs font-semibold text-blue-700 font-sans">
              Release R-42 · staging
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 font-sans">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              ● healthy
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-xl font-bold text-slate-900 md:text-2xl tracking-tight leading-snug">
            {totalTests.toLocaleString()} test cases running across {activeSuites} modules
          </h2>

          {/* Subtext */}
          <p className="text-sm text-slate-500 leading-relaxed max-w-xl">
            Pass rate is hovering around <span className="font-semibold text-emerald-600">{passRate}%</span>. 
            All runs are monitored. Regressions will trigger automated alerts.
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            onClick={onRunAll}
            disabled={isRunning}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 transition-all duration-150"
          >
            <Play className={`h-4 w-4 fill-white ${isRunning ? 'animate-pulse' : ''}`} />
            <span>{isRunning ? 'Running...' : 'Run all'}</span>
          </button>
          
          <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 active:bg-slate-100 transition-all duration-150">
            <Eye className="h-4 w-4 text-slate-500" />
            <span>View release</span>
          </button>
        </div>
      </div>

      {/* Right Column: Hero KPIs stacked list */}
      <div className="flex flex-col gap-3 justify-between">
        {/* KPI 1: Executions Today */}
        <div className="flex flex-col justify-center rounded-xl border border-slate-200 bg-white p-4 shadow-sm h-full hover:border-blue-300 transition-colors">
          <span className="text-xxs font-bold tracking-wider text-slate-400 uppercase">
            EXECUTIONS TODAY
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 tracking-tight">{executionsToday}</span>
            <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-600">
              ▲ 12% vs yesterday
            </span>
          </div>
        </div>

        {/* KPI 2: Pass Rate */}
        <div className="flex flex-col justify-center rounded-xl border border-slate-200 bg-white p-4 shadow-sm h-full hover:border-blue-300 transition-colors">
          <span className="text-xxs font-bold tracking-wider text-slate-400 uppercase">
            PASS RATE
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 tracking-tight">{passRate}%</span>
            <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-600">
              ▲ 2.4% wk-over-wk
            </span>
          </div>
        </div>

        {/* KPI 3: Avg Runtime */}
        <div className="flex flex-col justify-center rounded-xl border border-slate-200 bg-white p-4 shadow-sm h-full hover:border-blue-300 transition-colors">
          <span className="text-xxs font-bold tracking-wider text-slate-400 uppercase">
            AVG RUNTIME
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 tracking-tight">{formatDuration(avgRuntimeMs)}</span>
            <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-600">
              ▼ 8% faster
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
