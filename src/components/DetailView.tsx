import { ChevronRight, Play, ExternalLink } from 'lucide-react';

export const DetailView: React.FC = () => {
  const kpis = [
    { title: 'TOTAL CASES', value: '290', trend: '↑ 12 this week', isPositive: true },
    { title: 'PASS RATE', value: '82%', trend: '↑ 3.2% compared', isPositive: true },
    { title: 'OPEN DEFECTS', value: '14', trend: '↓ 2 critical', isPositive: false, isCritical: true },
    { title: 'AUTOMATION', value: '68%', trend: '↑ 2.1% coverage', isPositive: true },
    { title: 'AVG RUNTIME', value: '4m 12s', trend: '↑ 8s faster', isPositive: true }
  ];

  const submodules = [
    { name: 'Invoice posting', cases: 42, passRate: 82, defects: 3 },
    { name: 'Purchase orders', cases: 38, passRate: 78, defects: 2 },
    { name: 'Vendor master', cases: 32, passRate: 100, defects: 0 },
    { name: 'GL entries', cases: 52, passRate: 71, defects: 4 },
    { name: 'Bank reconciliation', cases: 18, passRate: 61, defects: 2 },
    { name: 'Currency', cases: 12, passRate: 100, defects: 0 },
    { name: 'Tax calculation', cases: 28, passRate: 74, defects: 3 },
    { name: 'Period close', cases: 36, passRate: 95, defects: 0 }
  ];

  const recentRuns = [
    { id: 'RU-2214', suite: 'Invoice posting - regression', env: 'staging', status: 'FAIL', duration: '04:42', started: '2m ago', owner: 'R. Mehta', avatarColor: 'bg-indigo-100 text-indigo-700' },
    { id: 'RU-2213', suite: 'Vendor master - smoke', env: 'staging', status: 'PASS', duration: '01:15', started: '18m ago', owner: 'L. Park', avatarColor: 'bg-emerald-100 text-emerald-700' },
    { id: 'RU-2212', suite: 'GL entries - full', env: 'staging', status: 'PASS', duration: '07:54', started: '52m ago', owner: 'A. Khan', avatarColor: 'bg-blue-100 text-blue-700' },
    { id: 'RU-2211', suite: 'Period close - e2e', env: 'staging', status: 'FLAKY', duration: '13:38', started: '1h ago', owner: 'J. Diaz', avatarColor: 'bg-amber-100 text-amber-700' },
    { id: 'RU-2210', suite: 'Tax calculation - regression', env: 'qa', status: 'FAIL', duration: '06:12', started: '2h ago', owner: 'R. Mehta', avatarColor: 'bg-indigo-100 text-indigo-700' },
    { id: 'RU-2209', suite: 'Bank reconciliation - smoke', env: 'qa', status: 'PASS', duration: '02:05', started: '3h ago', owner: 'L. Park', avatarColor: 'bg-emerald-100 text-emerald-700' }
  ];

  const openDefects = [
    { id: 'D-3541', title: 'Rounding error on multi-currency invoices', severity: 'CRIT', module: 'Invoice posting', owner: 'R. Mehta', age: '2d' },
    { id: 'D-3539', title: 'PO approval email not triggered', severity: 'HIGH', module: 'Purchase orders', owner: 'A. Khan', age: '4d' },
    { id: 'D-3532', title: 'Tax config override ignored', severity: 'HIGH', module: 'Tax calculation', owner: 'L. Park', age: '5d' },
    { id: 'D-3528', title: 'Period-close lock race condition', severity: 'CRIT', module: 'Period close', owner: 'J. Diaz', age: '7d' },
    { id: 'D-3521', title: 'GL entry FX rate stale', severity: 'MED', module: 'GL entries', owner: 'R. Mehta', age: '9d' }
  ];

  return (
    <div className="space-y-6 text-left font-sans">
      {/* Breadcrumbs & Action Row */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-xxs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <span>Dashboards</span>
            <ChevronRight className="h-3 w-3" />
            <span>Monitoring</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-indigo-600">ERP</span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">ERP Module</h2>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xxs font-bold text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Healthy
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Owned by Payments platform · Last run 2h ago ·{' '}
            <a href="#runbook" className="text-indigo-600 hover:underline inline-flex items-center gap-0.5">
              View runbook <ExternalLink className="h-2.5 w-2.5" />
            </a>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50">
            + Follow
          </button>
          <button className="rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50">
            Report
          </button>
          <button className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md hover:bg-indigo-700">
            <Play className="h-3 w-3 fill-white" />
            <span>View test cases</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {kpis.map((kpi) => (
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
        {/* Execution Timeline (Bar Chart representation) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Execution timeline</h4>
              <p className="text-xxs text-slate-500 font-medium">Daily outcomes · last 18 days</p>
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
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded bg-amber-400" />
                <span className="text-xxs text-slate-500 font-semibold">Flaky</span>
              </div>
            </div>
          </div>

          {/* Simple simulated daily bars */}
          <div className="h-32 flex items-end justify-between gap-1 pt-6 border-b border-slate-100">
            {Array.from({ length: 18 }).map((_, idx) => {
              // Mock heights for passed, flaky, failed
              const passHeight = Math.max(30, 40 + Math.sin(idx) * 20);
              const failHeight = idx % 5 === 0 ? 15 : 0;
              const flakyHeight = idx % 7 === 0 ? 8 : 0;
              return (
                <div key={idx} className="flex-1 flex flex-col justify-end h-full group relative">
                  {failHeight > 0 && <div style={{ height: `${failHeight}%` }} className="bg-rose-500 w-full rounded-t-sm" />}
                  {flakyHeight > 0 && <div style={{ height: `${flakyHeight}%` }} className="bg-amber-400 w-full" />}
                  <div style={{ height: `${passHeight}%` }} className="bg-emerald-500 w-full rounded-t-sm" />
                  
                  {/* Tooltip */}
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-slate-900 text-white text-[10px] rounded px-1.5 py-0.5 whitespace-nowrap z-10 font-mono">
                    Day {idx + 1}: {Math.round(passHeight)}% pass
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between text-xxs text-slate-400 font-semibold uppercase tracking-wider px-1">
            <span>Older</span>
            <span>Newest</span>
          </div>

          {/* Highlights labels */}
          <div className="flex flex-wrap gap-2 pt-2">
            <span className="bg-slate-50 border border-slate-100 text-emerald-600 rounded-md px-2.5 py-1 text-xxs font-bold">
              ↑ Pass trending up
            </span>
            <span className="bg-slate-50 border border-slate-100 text-rose-600 rounded-md px-2.5 py-1 text-xxs font-bold">
              ⚠ 2 regressions - 10d 14h
            </span>
            <span className="bg-slate-50 border border-slate-100 text-amber-600 rounded-md px-2.5 py-1 text-xxs font-bold">
              ! 1 flaky suite
            </span>
          </div>
        </div>

        {/* Automation vs Manual horizontal bars */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-5">
          <h4 className="text-sm font-bold text-slate-900">Automation vs Manual</h4>

          <div className="space-y-4">
            {/* Automation Row */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-800">Automation</span>
                <span className="text-slate-500 font-mono text-xxs">194 cases</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                <div style={{ width: '82%' }} className="bg-emerald-500 h-full" />
                <div style={{ width: '15%' }} className="bg-rose-500 h-full" />
                <div style={{ width: '3%' }} className="bg-amber-400 h-full" />
              </div>
              <div className="text-[10px] text-slate-400 font-semibold">
                122 pass · 70 fail · 2 no result
              </div>
            </div>

            {/* Manual Row */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-800">Manual</span>
                <span className="text-slate-500 font-mono text-xxs">100 cases</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                <div style={{ width: '64%' }} className="bg-emerald-500 h-full" />
                <div style={{ width: '30%' }} className="bg-rose-500 h-full" />
                <div style={{ width: '6%' }} className="bg-amber-400 h-full" />
              </div>
              <div className="text-[10px] text-slate-400 font-semibold">
                64 pass · 30 fail · 6 no result
              </div>
            </div>

            {/* Blocked Row */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-800">Blocked</span>
                <span className="text-slate-500 font-mono text-xxs">2 cases</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                <div style={{ width: '100%' }} className="bg-rose-500 h-full" />
              </div>
              <div className="text-[10px] text-slate-400 font-semibold">
                0 pass · 2 fail · 0 no result
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submodules Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Sub-modules & features</h3>
            <p className="text-xs text-slate-500">Click a card to view test cases</p>
          </div>
          <button className="border border-slate-200 bg-white rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
            Grid ▾
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {submodules.map((sm) => (
            <div key={sm.name} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:border-indigo-400 hover:shadow-md transition-all duration-150 cursor-pointer">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-800 tracking-tight">{sm.name}</span>
                {sm.defects > 0 && (
                  <span className="rounded bg-rose-50 border border-rose-100 text-rose-600 text-xxs font-bold px-1.5 py-0.5">
                    {sm.defects} defects
                  </span>
                )}
              </div>
              <div className="text-xxs text-slate-400 font-semibold mt-1">{sm.cases} total cases</div>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div style={{ width: `${sm.passRate}%` }} className="bg-emerald-500 h-full" />
                </div>
                <span className="text-xxs font-bold text-slate-500 whitespace-nowrap">{sm.passRate}% pass</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Runs Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h4 className="text-sm font-bold text-slate-900">Recent runs</h4>
            <p className="text-xxs text-slate-500 font-medium">Latest execution activity across environments</p>
          </div>
          <button className="text-xxs font-bold uppercase tracking-wider text-indigo-600 hover:text-indigo-700">
            View all
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <th className="py-3 px-5">RUN ID</th>
                <th className="py-3 px-5">SUITE</th>
                <th className="py-3 px-5">ENV</th>
                <th className="py-3 px-5">STATUS</th>
                <th className="py-3 px-5">DURATION</th>
                <th className="py-3 px-5">STARTED</th>
                <th className="py-3 px-5">OWNER</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {recentRuns.map((run) => (
                <tr key={run.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-5 font-semibold text-slate-500 font-mono">{run.id}</td>
                  <td className="py-3 px-5 font-bold text-slate-800">{run.suite}</td>
                  <td className="py-3 px-5">
                    <span className="bg-slate-100 border border-slate-200 text-slate-500 text-[10px] font-bold uppercase px-2 py-0.5 rounded">
                      {run.env}
                    </span>
                  </td>
                  <td className="py-3 px-5">
                    <span
                      className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded border ${
                        run.status === 'PASS'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                          : run.status === 'FAIL'
                          ? 'bg-rose-50 border-rose-200 text-rose-600'
                          : 'bg-amber-50 border-amber-200 text-amber-600'
                      }`}
                    >
                      {run.status === 'PASS' ? '✓ PASS' : run.status === 'FAIL' ? '× FAIL' : '~ FLAKY'}
                    </span>
                  </td>
                  <td className="py-3 px-5 font-mono font-medium text-slate-500">{run.duration}</td>
                  <td className="py-3 px-5 text-slate-400 font-medium">{run.started}</td>
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-2">
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold ${run.avatarColor}`}>
                        {run.owner[0]}
                      </div>
                      <span className="font-semibold text-slate-700">{run.owner}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Open Defects Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h4 className="text-sm font-bold text-slate-900">Open defects</h4>
            <p className="text-xxs text-slate-500 font-medium">14 open · 2 critical</p>
          </div>
          <button className="text-xxs font-bold uppercase tracking-wider text-indigo-600 hover:text-indigo-700">
            View all
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <th className="py-3 px-5">ID</th>
                <th className="py-3 px-5">TITLE</th>
                <th className="py-3 px-5">SEVERITY</th>
                <th className="py-3 px-5">SUB-MODULE</th>
                <th className="py-3 px-5">OWNER</th>
                <th className="py-3 px-5">AGE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {openDefects.map((def) => (
                <tr key={def.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-5 font-semibold text-slate-500 font-mono">{def.id}</td>
                  <td className="py-3 px-5 font-bold text-slate-800">{def.title}</td>
                  <td className="py-3 px-5">
                    <span
                      className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded border ${
                        def.severity === 'CRIT'
                          ? 'bg-rose-50 border-rose-200 text-rose-600'
                          : def.severity === 'HIGH'
                          ? 'bg-amber-50 border-amber-200 text-amber-600'
                          : 'bg-slate-100 border-slate-200 text-slate-600'
                      }`}
                    >
                      {def.severity}
                    </span>
                  </td>
                  <td className="py-3 px-5 font-semibold text-slate-500">{def.module}</td>
                  <td className="py-3 px-5 font-semibold text-slate-700">{def.owner}</td>
                  <td className="py-3 px-5 text-slate-400 font-medium">{def.age}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
