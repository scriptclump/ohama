import React from 'react';
import { Play, Eye, ArrowUpRight, TrendingUp, Clock } from 'lucide-react';

interface HeroBannerProps {
  onRunAll: () => void;
  isRunning: boolean;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onRunAll, isRunning }) => {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Left 2 Columns: Banner Detail */}
      <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
        <div className="space-y-4">
          {/* Pills row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
              Release 2.42 - staging
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              Healthy
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-xl font-bold text-slate-900 md:text-2xl tracking-tight leading-snug">
            2,847 test cases running across 7 modules
          </h2>

          {/* Subtext */}
          <p className="text-sm text-slate-500 leading-relaxed max-w-xl">
            Pass rate is up <span className="font-semibold text-emerald-600">3.6%</span> week-over-week. 
            2 regressions detected in <span className="font-medium text-slate-700">Invoice posting</span> this morning — owner teams have been notified.
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
            <span className="text-2xl font-bold text-slate-900 tracking-tight">592</span>
            <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-600">
              <ArrowUpRight className="h-3 w-3" />
              12% vs yesterday
            </span>
          </div>
        </div>

        {/* KPI 2: Pass Rate */}
        <div className="flex flex-col justify-center rounded-xl border border-slate-200 bg-white p-4 shadow-sm h-full hover:border-blue-300 transition-colors">
          <span className="text-xxs font-bold tracking-wider text-slate-400 uppercase">
            PASS RATE
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 tracking-tight">82.4%</span>
            <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-600">
              <TrendingUp className="h-3.5 w-3.5" />
              3.6% wk over wk
            </span>
          </div>
        </div>

        {/* KPI 3: Avg Runtime */}
        <div className="flex flex-col justify-center rounded-xl border border-slate-200 bg-white p-4 shadow-sm h-full hover:border-blue-300 transition-colors">
          <span className="text-xxs font-bold tracking-wider text-slate-400 uppercase">
            AVG RUNTIME
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 tracking-tight">4m 12s</span>
            <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-600">
              <Clock className="h-3.5 w-3.5" />
              8s faster
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
