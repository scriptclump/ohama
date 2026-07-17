import React, { useState } from 'react';
import { Menu, Search, SlidersHorizontal, Plus, Calendar, ArrowRight, ChevronDown, Play } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
  activeScreen?: string;
  onExecuteSuite?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  searchQuery,
  setSearchQuery,
  activeScreen = 'dashboard',
  onExecuteSuite
}) => {
  const [localQuery, setLocalQuery] = useState('');
  const query = searchQuery !== undefined ? searchQuery : localQuery;
  const handleQueryChange = (val: string) => {
    if (setSearchQuery) {
      setSearchQuery(val);
    } else {
      setLocalQuery(val);
    }
  };

  // Determine breadcrumbs, placeholder, date selector, and primary action based on activeScreen
  let breadcrumbs = (
    <>
      <span className="text-slate-400 hover:text-slate-600 cursor-pointer">Dashboards</span>
      <span className="text-slate-300">/</span>
      <span className="text-slate-800">Monitoring</span>
    </>
  );

  let searchPlaceholder = 'Search tests, defects, runs...';

  let dateSelector = (
    <div className="hidden sm:flex items-center gap-1.5">
      {/* Start Date */}
      <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 shadow-sm hover:bg-slate-50 cursor-pointer transition-colors font-sans select-none">
        <Calendar className="h-3.5 w-3.5 text-slate-400" />
        <span>Start Date</span>
        <ChevronDown className="h-3 w-3 text-slate-400" />
      </div>

      <ArrowRight className="h-3 w-3 text-slate-400" />

      {/* End Date */}
      <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 shadow-sm hover:bg-slate-50 cursor-pointer transition-colors font-sans select-none">
        <Calendar className="h-3.5 w-3.5 text-slate-400" />
        <span>End Date</span>
        <ChevronDown className="h-3 w-3 text-slate-400" />
      </div>
    </div>
  );

  let primaryAction = (
    <button className="flex items-center gap-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white px-3 py-1.5 text-xs font-semibold shadow-sm transition-colors font-sans">
      <Plus className="h-3.5 w-3.5" />
      <span>New dashboard</span>
    </button>
  );

  if (activeScreen === 'detail') {
    breadcrumbs = (
      <>
        <span className="text-slate-400 hover:text-slate-600 cursor-pointer">Dashboards</span>
        <span className="text-slate-300">/</span>
        <span className="text-slate-800">ERP · executions</span>
      </>
    );

    searchPlaceholder = 'Search executions, suites, runs...';

    dateSelector = (
      <div className="hidden sm:flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm hover:bg-slate-50 cursor-pointer transition-colors font-sans select-none">
        <Calendar className="h-3.5 w-3.5 text-slate-400" />
        <span>Last 7 days</span>
        <ChevronDown className="h-3 w-3 text-slate-400" />
      </div>
    );

    primaryAction = (
      <button 
        onClick={onExecuteSuite}
        className="flex items-center gap-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white px-3 py-1.5 text-xs font-semibold shadow-sm transition-colors font-sans"
      >
        <Play className="h-3.5 w-3.5 fill-white text-white" />
        <span>Execute suite</span>
      </button>
    );
  } else if (activeScreen === 'test-cases') {
    breadcrumbs = (
      <>
        <span className="text-slate-400 hover:text-slate-600 cursor-pointer">Dashboards</span>
        <span className="text-slate-300">/</span>
        <span className="text-slate-800">ERP · Invoice posting · Test cases</span>
      </>
    );

    searchPlaceholder = 'Search test cases, folders, tags...';

    dateSelector = (
      <div className="hidden sm:flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm hover:bg-slate-50 cursor-pointer transition-colors font-sans select-none">
        <Calendar className="h-3.5 w-3.5 text-slate-400" />
        <span>Last 7 days</span>
        <ChevronDown className="h-3 w-3 text-slate-400" />
      </div>
    );

    primaryAction = (
      <button 
        onClick={() => window.dispatchEvent(new CustomEvent('trigger-new-test-case'))}
        className="flex items-center gap-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white px-3 py-1.5 text-xs font-semibold shadow-sm transition-colors font-sans"
      >
        <Plus className="h-3.5 w-3.5" />
        <span>New test case</span>
      </button>
    );
  }

  return (
    <header className="sticky top-0 z-30 flex flex-col gap-4 border-b border-slate-200 bg-white px-6 py-3.5 lg:h-16 lg:flex-row lg:items-center lg:justify-between lg:px-8">
      {/* Left side: Mobile Menu Trigger & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 active:bg-slate-100 lg:hidden transition-colors"
          aria-label="Toggle Sidebar"
        >
          <Menu className="h-4.5 w-4.5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-semibold font-sans tracking-wide">
          {breadcrumbs}
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 text-4xs font-bold text-emerald-700 uppercase animate-pulse">
            <span className="h-1 w-1 rounded-full bg-emerald-500"></span>
            live
          </span>
        </div>
      </div>

      {/* Right side: Search, Date Range, Filter & Actions */}
      <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto lg:justify-end">
        {/* Search Input bar */}
        <div className="relative flex-1 min-w-[200px] max-w-sm lg:flex-none">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-12 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-sans"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 inline-flex items-center rounded border border-slate-200 bg-white px-1.5 py-0.5 text-5xs font-bold text-slate-400 font-sans shadow-sm select-none">
            ⌘K
          </kbd>
        </div>

        {/* Filter Button */}
        <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 active:bg-slate-100 transition-colors font-sans">
          <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
          <span>Filter</span>
        </button>

        {/* Date Selector Row */}
        {dateSelector}

        {/* Dynamic Action Button */}
        {primaryAction}
      </div>
    </header>
  );
};
