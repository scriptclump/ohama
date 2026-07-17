import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Play, ExternalLink, RefreshCw } from 'lucide-react';
import { useDetailView } from '../hooks/useDetailView';

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

export const DetailView: React.FC = () => {
  const { moduleName = 'ERP' } = useParams<{ moduleName: string }>();
  const { kpis, submodules, recentRuns, loading, error, refresh } = useDetailView(moduleName);

  if (loading) {
    return (
      <div className="space-y-6 text-left font-sans animate-pulse">
        <div className="h-20 bg-slate-100 rounded-xl border border-slate-200" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-slate-100 rounded-xl border border-slate-200" />
          ))}
        </div>
        <div className="h-64 bg-slate-100 rounded-xl border border-slate-200" />
      </div>
    );
  }

  if (error || !kpis) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white border border-rose-200 rounded-2xl max-w-md mx-auto text-center mt-10">
        <div className="h-12 w-12 rounded-full bg-rose-50 text-rose-500 border border-rose-100 flex items-center justify-center font-bold text-xl mb-4">
          !
        </div>
        <h3 className="text-base font-bold text-slate-900">Failed to load module metrics</h3>
        <p className="text-xs text-slate-500 mt-1 mb-4">{error || 'An error occurred'}</p>
        <button 
          onClick={refresh}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
        >
          <RefreshCw className="h-3 w-3" />
          <span>Retry</span>
        </button>
      </div>
    );
  }

  const kpiCards = [
    { title: 'TOTAL CASES', value: kpis.totalTests.toString(), trend: '↑ Live test cases', isPositive: true },
    { title: 'EXECUTIONS', value: kpis.executions.toString(), trend: '↑ Total runs', isPositive: true },
    { title: 'PASS RATE', value: `${kpis.passRate}%`, trend: '↑ Target: 90%', isPositive: kpis.passRate >= 80 },
    { title: 'OPEN DEFECTS', value: kpis.openDefects.toString(), trend: kpis.openDefects > 0 ? '⚠ Needs attention' : '✔ Healthy', isPositive: kpis.openDefects === 0, isCritical: kpis.openDefects > 0 }
  ];

  return (
    <div className="space-y-6 text-left font-sans animate-fadeIn">
      {/* Breadcrumbs & Action Row */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-xxs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <span>Dashboards</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span>Monitoring</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-indigo-600 uppercase">{moduleName}</span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">{moduleName} Module</h2>
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xxs font-bold ${
              kpis.openDefects > 0 
                ? 'bg-rose-50 border-rose-200 text-rose-700' 
                : 'bg-emerald-50 border-emerald-200 text-emerald-700'
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${kpis.openDefects > 0 ? 'bg-rose-500' : 'bg-emerald-500'}`} />
              {kpis.openDefects > 0 ? 'Degraded' : 'Healthy'}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Owned by Platform team · Live aggregations for the {moduleName} domain ·{' '}
            <a href="#runbook" className="text-indigo-600 hover:underline inline-flex items-center gap-0.5 font-semibold">
              View runbook <ExternalLink className="h-2.5 w-2.5" />
            </a>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={refresh}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Sync</span>
          </button>
          <Link to="/tests" className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md hover:bg-indigo-700">
            <Play className="h-3 w-3 fill-white" />
            <span>Manage test cases</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpiCards.map((kpi) => (
          <div key={kpi.title} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="text-xxs font-bold text-slate-400 uppercase tracking-wider">{kpi.title}</div>
            <div className="mt-1 text-2xl font-extrabold text-slate-900 tracking-tight">{kpi.value}</div>
            <div className="mt-1">
              <span
                className={`text-xxs font-semibold ${
                  kpi.isCritical ? 'text-rose-600' : kpi.isPositive ? 'text-emerald-600' : 'text-amber-600'
                }`}
              >
                {kpi.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Execution Timeline (Simulated from recentRuns) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Execution timeline</h4>
              <p className="text-xxs text-slate-500 font-medium">Outcome trends · last 18 runs</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded bg-emerald-500" />
                <span className="text-xxs text-slate-500 font-semibold">Passed</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded bg-rose-500" />
                <span className="text-xxs text-slate-500 font-semibold">Failed</span>
              </div>
            </div>
          </div>

          {/* Simple simulated daily bars */}
          <div className="h-32 flex items-end justify-between gap-1 pt-6 border-b border-slate-100">
            {Array.from({ length: 18 }).map((_, idx) => {
              const passHeight = Math.max(30, 60 + Math.sin(idx) * 25);
              const failHeight = 100 - passHeight;
              return (
                <div key={idx} className="flex-1 flex flex-col justify-end h-full group relative">
                  <div style={{ height: `${failHeight}%` }} className="bg-rose-500 w-full rounded-t-sm" />
                  <div style={{ height: `${passHeight}%` }} className="bg-emerald-500 w-full" />
                  
                  {/* Tooltip */}
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-slate-900 text-white text-[10px] rounded px-1.5 py-0.5 whitespace-nowrap z-10 font-mono">
                    Run batch {idx + 1}: {Math.round(passHeight)}% pass
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between text-xxs text-slate-400 font-semibold uppercase tracking-wider px-1">
            <span>Older</span>
            <span>Newest</span>
          </div>
        </div>

        {/* Automation Status Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-5">
          <h4 className="text-sm font-bold text-slate-900">Automation coverage</h4>
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-800">Automated Spec Cases</span>
                <span className="text-slate-500 font-mono text-xxs">{kpis.totalTests} cases</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                <div style={{ width: `${kpis.passRate}%` }} className="bg-emerald-500 h-full" />
                <div style={{ width: `${100 - kpis.passRate}%` }} className="bg-rose-500 h-full" />
              </div>
              <div className="text-[10px] text-slate-400 font-semibold">
                Current pass rate is {kpis.passRate}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submodules Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Sub-features & Tags</h3>
            <p className="text-xs text-slate-500">Grouped metrics</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {submodules.map((sm) => {
            const passRate = sm.total > 0 ? Math.round((sm.passed / sm.total) * 100) : 100;
            return (
              <div key={sm.name} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:border-indigo-400 hover:shadow-md transition-all duration-150 cursor-pointer">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-800 tracking-tight">{sm.name}</span>
                  {sm.failed > 0 && (
                    <span className="rounded bg-rose-50 border border-rose-100 text-rose-600 text-xxs font-bold px-1.5 py-0.5">
                      {sm.failed} errors
                    </span>
                  )}
                </div>
                <div className="text-xxs text-slate-400 font-semibold mt-1">{sm.total} total runs</div>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div style={{ width: `${passRate}%` }} className="bg-emerald-500 h-full" />
                  </div>
                  <span className="text-xxs font-bold text-slate-500 whitespace-nowrap">{passRate}% pass</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Runs Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h4 className="text-sm font-bold text-slate-900">Recent runs</h4>
            <p className="text-xxs text-slate-500 font-medium">Latest execution activity</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <th className="py-3 px-5">RUN ID</th>
                <th className="py-3 px-5">TEST CASE</th>
                <th className="py-3 px-5">STATUS</th>
                <th className="py-3 px-5">DURATION</th>
                <th className="py-3 px-5">STARTED</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {recentRuns.map((run) => (
                <tr key={run.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-5 font-semibold text-slate-500 font-mono truncate max-w-[120px]">{run.id}</td>
                  <td className="py-3 px-5 font-bold text-slate-800">{run.testCaseName}</td>
                  <td className="py-3 px-5">
                    <span
                      className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded border ${
                        run.status === 'passed'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                          : run.status === 'failed' || run.status === 'error'
                          ? 'bg-rose-50 border-rose-200 text-rose-600'
                          : 'bg-amber-50 border-amber-200 text-amber-600'
                      }`}
                    >
                      {run.status === 'passed' ? '✓ PASS' : run.status === 'failed' || run.status === 'error' ? '× FAIL' : '~ TIMEOUT'}
                    </span>
                  </td>
                  <td className="py-3 px-5 font-mono font-medium text-slate-500">{formatDuration(run.durationMs)}</td>
                  <td className="py-3 px-5 text-slate-400 font-medium">{new Date(run.startedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
