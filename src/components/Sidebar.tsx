import React from 'react';
import { 
  BarChart2, 
  Play, 
  Clock, 
  CheckSquare, 
  Folder, 
  AlertTriangle, 
  Box, 
  Cloud, 
  Zap, 
  ChevronDown,
  X
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  isOpen, 
  setIsOpen 
}) => {
  const navGroups: NavGroup[] = [
    {
      title: 'OVERVIEW',
      items: [
        { id: 'monitoring', label: 'Monitoring', icon: BarChart2 },
        { id: 'executions', label: 'Executions', icon: Play, badge: '13' },
        { id: 'schedules', label: 'Schedules', icon: Clock },
      ]
    },
    {
      title: 'QUALITY',
      items: [
        { id: 'test-cases', label: 'Test cases', icon: CheckSquare },
        { id: 'suites', label: 'Suites', icon: Folder },
        { id: 'defects', label: 'Defects', icon: AlertTriangle, badge: '14', badgeColor: 'bg-amber-100 text-amber-800 border-amber-200' },
      ]
    },
    {
      title: 'PLATFORM',
      items: [
        { id: 'modules', label: 'Modules', icon: Box },
        { id: 'environments', label: 'Environments', icon: Cloud },
        { id: 'integrations', label: 'Integrations', icon: Zap },
      ]
    }
  ];


  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 ease-in-out lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Org Selector Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
          <div className="flex items-center gap-3">
            {/* Org Icon */}
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 border border-indigo-100">
              <span className="text-sm font-bold text-indigo-600">O</span>
            </div>
            {/* Org Info */}
            <div className="flex flex-col text-left">
              <span className="text-sm font-semibold text-slate-900 leading-tight">Omaha</span>
              <span className="text-xxs text-slate-500 font-medium">prod workspace</span>
            </div>
          </div>

          <button 
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              <h4 className="px-3 text-xxs font-semibold tracking-wider text-slate-400 uppercase">
                {group.title}
              </h4>
              <nav className="space-y-[2px]">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsOpen(false);
                      }}
                      className={`
                        group flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150
                        ${isActive 
                          ? 'bg-blue-50/80 text-blue-700 border-l-4 border-blue-600 pl-2 rounded-l-none' 
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-l-4 border-transparent'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`h-4.5 w-4.5 transition-colors duration-150 ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`
                          rounded px-1.5 py-0.5 text-xxs font-semibold border
                          ${item.badgeColor || 'bg-slate-100 text-slate-600 border-slate-200'}
                        `}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* User Profile Footer */}
        <div className="border-t border-slate-200 bg-slate-50/50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* User Avatar */}
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 border border-amber-200">
                <span className="text-xs font-bold text-amber-800">JM</span>
              </div>
              {/* User Info */}
              <div className="flex flex-col text-left">
                <span className="text-sm font-semibold text-slate-800 leading-tight">Jordan Miles</span>
                <span className="text-xs text-slate-500 font-normal">QA Lead</span>
              </div>
            </div>
            <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
