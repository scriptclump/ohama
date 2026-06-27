import React, { useState } from 'react';
import { Calendar, ChevronDown, MoreHorizontal } from 'lucide-react';

// ==========================================
// 1. Donut Chart Component (Execution Results)
// ==========================================
export const ExecutionResults: React.FC = () => {
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);

  const data = [
    { label: 'Passed', count: 2108, percentage: 82.9, color: '#10B981', hoverColor: '#059669', dotColor: 'bg-emerald-500' },
    { label: 'Failed', count: 312, percentage: 12.3, color: '#EF4444', hoverColor: '#DC2626', dotColor: 'bg-rose-500' },
    { label: 'No result', count: 88, percentage: 3.5, color: '#94A3B8', hoverColor: '#64748B', dotColor: 'bg-slate-400' },
    { label: 'Execution error', count: 34, percentage: 1.3, color: '#475569', hoverColor: '#334155', dotColor: 'bg-slate-600' }
  ];

  // SVG calculations for segmented ring
  let cumulativePercent = 0;

  const segments = data.map((d) => {
    const startPercent = cumulativePercent;
    cumulativePercent += d.percentage;
    
    // Circular calculations for stroke-dasharray
    const radius = 35;
    const circumference = 2 * Math.PI * radius;
    const strokeDash = (d.percentage / 100) * circumference;
    const strokeOffset = circumference - (startPercent / 100) * circumference;

    return {
      ...d,
      radius,
      circumference,
      strokeDash,
      strokeOffset,
    };
  });

  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 leading-tight">Execution results</h3>
          <p className="text-xxs text-slate-500">Outcome distribution · last 7 days</p>
        </div>
        <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-6 flex flex-col items-center justify-center gap-6 sm:flex-row">
        {/* SVG Donut */}
        <div className="relative flex h-40 w-40 items-center justify-center">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
            {/* Background ring */}
            <circle
              cx="50"
              cy="50"
              r="35"
              fill="transparent"
              stroke="#F1F5F9"
              strokeWidth="9"
            />
            {/* Segments */}
            {segments.map((seg) => (
              <circle
                key={seg.label}
                cx="50"
                cy="50"
                r={seg.radius}
                fill="transparent"
                stroke={hoveredSegment === seg.label ? seg.hoverColor : seg.color}
                strokeWidth={hoveredSegment === seg.label ? '11' : '9'}
                strokeDasharray={seg.strokeDash}
                strokeDashoffset={seg.strokeOffset}
                strokeLinecap="round"
                className="transition-all duration-200 cursor-pointer"
                onMouseEnter={() => setHoveredSegment(seg.label)}
                onMouseLeave={() => setHoveredSegment(null)}
              />
            ))}
          </svg>

          {/* Inner Text Label */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-bold tracking-tight text-slate-900">82%</span>
            <span className="text-3xs font-bold tracking-wider text-slate-400 uppercase">
              PASS RATE
            </span>
          </div>
        </div>

        {/* Legend list */}
        <div className="flex-1 space-y-2.5 w-full">
          {data.map((item) => (
            <div 
              key={item.label}
              className={`flex items-center justify-between rounded-lg p-1.5 transition-colors duration-150 ${
                hoveredSegment === item.label ? 'bg-slate-50' : ''
              }`}
              onMouseEnter={() => setHoveredSegment(item.label)}
              onMouseLeave={() => setHoveredSegment(null)}
            >
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${item.dotColor}`} />
                <span className="text-xs font-medium text-slate-600">{item.label}</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xs font-semibold text-slate-800">{item.count.toLocaleString()}</span>
                <span className="text-xxs text-slate-400 font-medium">{item.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. Stacked Bar Chart Component (Execution Trend)
// ==========================================
export const ExecutionTrend: React.FC = () => {
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);

  const dailyData = [
    { passed: 150, failed: 25, noResult: 15, error: 5, date: '08/02' },
    { passed: 180, failed: 30, noResult: 12, error: 3, date: '09/02' },
    { passed: 220, failed: 45, noResult: 15, error: 8, date: '10/02' },
    { passed: 145, failed: 20, noResult: 8, error: 2, date: '11/02' },
    { passed: 145, failed: 25, noResult: 10, error: 5, date: '12/02' },
    { passed: 125, failed: 15, noResult: 5, error: 1, date: '13/02' },
    { passed: 145, failed: 20, noResult: 8, error: 2, date: '14/02' },
    { passed: 175, failed: 35, noResult: 12, error: 4, date: '15/02' },
    { passed: 175, failed: 30, noResult: 10, error: 3, date: '16/02' },
    { passed: 220, failed: 50, noResult: 18, error: 8, date: '17/02' },
    { passed: 175, failed: 35, noResult: 15, error: 5, date: '18/02' },
    { passed: 195, failed: 40, noResult: 12, error: 4, date: '19/02' },
    { passed: 200, failed: 45, noResult: 14, error: 6, date: '20/02' }
  ];

  const maxVal = 350;

  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 leading-tight">Execution results by day</h3>
          <p className="text-xxs text-slate-500">Stacked outcomes across all suites</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xxs font-semibold text-slate-700 bg-white hover:bg-slate-50 active:bg-slate-100 transition-all"
          >
            <span>By suite</span>
            <ChevronDown className="h-3 w-3 text-slate-500" />
          </button>
          <button className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>


      {/* Legend markers */}
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded bg-emerald-500" />
          <span className="text-xxs font-medium text-slate-500">Passed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded bg-rose-500" />
          <span className="text-xxs font-medium text-slate-500">Failed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded bg-slate-300" />
          <span className="text-xxs font-medium text-slate-500">No result</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded bg-slate-600" />
          <span className="text-xxs font-medium text-slate-500">Execution error</span>
        </div>
      </div>

      {/* Bar Plot */}
      <div className="relative mt-6 flex flex-1 items-end h-[160px] border-b border-slate-200 pb-2">
        {/* Y Axis Guide Lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          <div className="border-t border-slate-100 w-full" />
          <div className="border-t border-dashed border-slate-200 w-full" />
          <div className="border-t border-dashed border-slate-200 w-full" />
          <div className="w-full" /> {/* Bottom axis */}
        </div>

        {/* Y Axis Labels */}
        <div className="absolute -left-6 inset-y-0 flex flex-col justify-between text-4xs font-bold text-slate-400 select-none pr-1 pointer-events-none h-full pt-[2px]">
          <span>350</span>
          <span>270</span>
          <span>125</span>
          <span>0</span>
        </div>

        {/* Bars Container */}
        <div className="relative z-10 flex w-full justify-around items-end h-full px-2 gap-1.5">
          {dailyData.map((d, index) => {
            const total = d.passed + d.failed + d.noResult + d.error;
            const passedHeight = (d.passed / maxVal) * 100;
            const failedHeight = (d.failed / maxVal) * 100;
            const noResultHeight = (d.noResult / maxVal) * 100;
            const errorHeight = (d.error / maxVal) * 100;

            return (
              <div 
                key={d.date} 
                className="relative flex flex-col items-center flex-1 group cursor-pointer"
                onMouseEnter={() => setActiveTooltip(index)}
                onMouseLeave={() => setActiveTooltip(null)}
              >
                {/* Stacked bar segments */}
                <div className="w-full rounded-md overflow-hidden flex flex-col justify-end h-[140px] gap-[1px]">
                  <div style={{ height: `${errorHeight}%` }} className="bg-slate-600 w-full" />
                  <div style={{ height: `${noResultHeight}%` }} className="bg-slate-300 w-full" />
                  <div style={{ height: `${failedHeight}%` }} className="bg-rose-500 w-full" />
                  <div style={{ height: `${passedHeight}%` }} className="bg-emerald-500 w-full" />
                </div>

                {/* X Axis Label */}
                <span className="absolute -bottom-6 text-3xs font-semibold text-slate-400 whitespace-nowrap mt-1 select-none scale-90">
                  {d.date}
                </span>

                {/* Interactive Tooltip popup */}
                {activeTooltip === index && (
                  <div className="absolute bottom-full mb-2 z-30 flex w-36 flex-col rounded-lg bg-slate-900 p-2 text-3xs font-medium text-white shadow-xl">
                    <div className="border-b border-slate-800 pb-1 mb-1 font-bold">{d.date} Run Summary</div>
                    <div className="flex justify-between text-emerald-400"><span>Passed:</span> <span>{d.passed}</span></div>
                    <div className="flex justify-between text-rose-400"><span>Failed:</span> <span>{d.failed}</span></div>
                    <div className="flex justify-between text-slate-300"><span>No Result:</span> <span>{d.noResult}</span></div>
                    <div className="flex justify-between text-slate-400"><span>Error:</span> <span>{d.error}</span></div>
                    <div className="border-t border-slate-800 mt-1 pt-1 flex justify-between font-bold text-white">
                      <span>Total:</span> <span>{total}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {/* Padding space for X Axis Labels */}
      <div className="h-4" />
    </div>
  );
};

// ==========================================
// 3. Scope By Module Component (BugsByModule)
// ==========================================
export const BugsByModule: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  const modules = [
    { name: 'ERP', total: 200, passed: 155, failed: 45 },
    { name: 'Accounts Payable', total: 200, passed: 146, failed: 54 },
    { name: 'Accounts Receivable', total: 200, passed: 160, failed: 40 },
    { name: 'Fixed Assets', total: 100, passed: 70, failed: 30 },
  ];

  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 leading-tight">Scope by module</h3>
          <p className="text-xxs text-slate-500">Click a module to drill into detail</p>
        </div>
        <div className="flex gap-2.5 text-xxs font-bold text-slate-400 select-none">
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded bg-emerald-500" />
            <span>PASSED</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded bg-rose-500" />
            <span>FAILED</span>
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-3.5">
        {modules.map((m) => {
          const passPercent = (m.passed / m.total) * 100;
          const failPercent = (m.failed / m.total) * 100;
          const isSelected = selectedModule === m.name;

          return (
            <div 
              key={m.name} 
              onClick={() => setSelectedModule(isSelected ? null : m.name)}
              className={`group flex flex-col gap-1 cursor-pointer p-1 rounded-lg transition-all duration-150 ${
                isSelected ? 'bg-slate-50 ring-1 ring-slate-200' : 'hover:bg-slate-50/50'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">
                  {m.name}
                </span>
                <span className="font-medium text-slate-400">{m.total}</span>
              </div>
              
              {/* Stacked Track */}
              <div className="relative h-2 w-full rounded-full bg-slate-100 overflow-hidden flex">
                <div style={{ width: `${passPercent}%` }} className="bg-emerald-500 h-full rounded-l-full" />
                <div style={{ width: `${failPercent}%` }} className="bg-rose-500 h-full rounded-r-full" />
              </div>

              {isSelected && (
                <div className="flex justify-between items-center text-3xs font-medium text-slate-500 mt-0.5 px-0.5 animate-fadeIn">
                  <span>Passed: {m.passed} ({Math.round(passPercent)}%)</span>
                  <span>Failed: {m.failed} ({Math.round(failPercent)}%)</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ==========================================
// 4. Automation vs Manual Component
// ==========================================
export const AutomationVsManual: React.FC = () => {
  const modules = [
    { name: 'Accounts Payable', percent: 27, auto: 54, manual: 146 },
    { name: 'ERP', percent: 67, auto: 155, manual: 95 },
    { name: 'Fixed Assets', percent: 70, auto: 70, manual: 30 },
    { name: 'General Ledger', percent: 88, auto: 88, manual: 12 },
    { name: 'Procurement', percent: 56, auto: 40, manual: 35 },
  ];

  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 leading-tight">Automation vs Manual</h3>
          <p className="text-xxs text-slate-500">Coverage split by module</p>
        </div>
        <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* Legend */}
      <div className="mt-3 flex gap-4 text-xxs font-bold text-slate-400 uppercase select-none">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-blue-600" />
          <span>Automated</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-slate-300" />
          <span>Manual</span>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {modules.map((m) => {
          return (
            <div key={m.name} className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">{m.name}</span>
                <span className="font-semibold text-blue-700">{m.percent}% auto</span>
              </div>
              
              {/* Split Track */}
              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden flex">
                <div style={{ width: `${m.percent}%` }} className="bg-blue-600 h-full rounded-l-full" />
                <div style={{ width: `${100 - m.percent}%` }} className="bg-slate-300 h-full rounded-r-full" />
              </div>

              {/* Counts details */}
              <div className="flex items-center justify-between text-3xs font-medium text-slate-400 px-0.5">
                <span>Auto: {m.auto}</span>
                <span>Manual: {m.manual}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ==========================================
// 5. Execution Activity Heatmap Component
// ==========================================
export const ExecutionActivity: React.FC = () => {
  // Generate mock heatmap cells: 18 weeks * 7 days = 126 cells
  // We'll define a set of values representing different levels of test run activity
  const weeks = 18;
  const daysPerWeek = 7;
  
  // Levels: 0 (light gray), 1 (light green), 2 (mid green), 3 (dark green), 4 (intense green)
  const cellLevels = [
    1, 2, 4, 3, 1, 0, 0,
    3, 1, 1, 2, 2, 1, 0,
    0, 2, 1, 3, 2, 3, 1,
    2, 0, 1, 0, 1, 2, 1,
    1, 2, 0, 2, 2, 1, 0,
    0, 1, 2, 1, 3, 1, 1,
    2, 3, 1, 2, 2, 0, 1,
    1, 2, 4, 3, 1, 0, 2,
    0, 1, 1, 2, 2, 1, 0,
    3, 2, 1, 3, 2, 3, 1,
    2, 0, 1, 0, 1, 2, 1,
    1, 2, 0, 2, 2, 1, 3,
    0, 1, 2, 1, 3, 1, 1,
    2, 3, 1, 2, 2, 0, 1,
    1, 2, 4, 3, 1, 2, 1,
    3, 2, 1, 1, 2, 2, 1,
    1, 2, 4, 3, 0, 1, 2,
    0, 1, 1, 2, 2, 1, 0
  ];

  // Helper class for color assignment
  const getLevelColor = (lvl: number) => {
    switch(lvl) {
      case 1: return 'bg-emerald-100 hover:ring-1 hover:ring-emerald-300';
      case 2: return 'bg-emerald-300 hover:ring-1 hover:ring-emerald-500';
      case 3: return 'bg-emerald-500 hover:ring-1 hover:ring-emerald-700';
      case 4: return 'bg-emerald-700 hover:ring-1 hover:ring-emerald-900';
      default: return 'bg-slate-100 hover:ring-1 hover:ring-slate-300';
    }
  };

  const getRunsCount = (lvl: number) => {
    switch(lvl) {
      case 1: return '1 - 50 runs';
      case 2: return '51 - 100 runs';
      case 3: return '101 - 180 runs';
      case 4: return '180+ runs';
      default: return '0 runs';
    }
  };

  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 leading-tight">Execution activity</h3>
          <p className="text-xxs text-slate-500">Daily run volume · last 18 weeks</p>
        </div>
        <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xxs font-semibold text-slate-700 bg-white hover:bg-slate-50 active:bg-slate-100 transition-all">
          <Calendar className="h-3.5 w-3.5 text-slate-500" />
          <span>Calendar</span>
        </button>
      </div>

      <div className="mt-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
        {/* Heatmap Grid */}
        <div className="flex gap-[3px] overflow-x-auto pb-2 select-none w-full max-w-2xl">
          {/* Day of week labels */}
          <div className="grid grid-rows-7 gap-[3px] text-4xs font-bold text-slate-400 pr-1.5 select-none h-[95px] pt-[2px]">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>

          {/* Weekly Columns */}
          {Array.from({ length: weeks }).map((_, wIdx) => (
            <div key={wIdx} className="grid grid-rows-7 gap-[3px] h-[95px]">
              {Array.from({ length: daysPerWeek }).map((_, dIdx) => {
                const index = wIdx * daysPerWeek + dIdx;
                const lvl = cellLevels[index] || 0;
                return (
                  <div
                    key={dIdx}
                    title={`Week ${wIdx + 1}, Day ${dIdx + 1}: ${getRunsCount(lvl)}`}
                    className={`h-2.5 w-2.5 rounded-[1.5px] cursor-pointer transition-all duration-100 ${getLevelColor(lvl)}`}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {/* Heatmap Summary Info & Scale */}
        <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-end gap-4 shrink-0 w-full md:w-auto">
          {/* Summary */}
          <div className="text-left md:text-right">
            <h4 className="text-sm font-bold text-slate-900 leading-tight">14,284 runs</h4>
            <p className="text-xxs text-slate-500">Peak: Mon 10 Feb · 218 runs</p>
          </div>

          {/* Scale */}
          <div className="flex items-center gap-1 text-xxs font-medium text-slate-500">
            <span>Less</span>
            <div className="flex gap-[2px]">
              <span className="h-2 w-2 rounded-[1px] bg-slate-100" />
              <span className="h-2 w-2 rounded-[1px] bg-emerald-100" />
              <span className="h-2 w-2 rounded-[1px] bg-emerald-300" />
              <span className="h-2 w-2 rounded-[1px] bg-emerald-500" />
              <span className="h-2 w-2 rounded-[1px] bg-emerald-700" />
            </div>
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
};
