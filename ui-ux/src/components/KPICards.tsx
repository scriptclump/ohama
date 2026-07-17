import React from 'react';
import { CheckSquare, Percent, AlertCircle, Layers } from 'lucide-react';

interface KPICardsProps {
  totalTests: number;
  automationCoverage: number;
  openDefects: number;
  activeSuites: number;
  isLoading?: boolean;
}

export const KPICards: React.FC<KPICardsProps> = ({
  totalTests,
  automationCoverage,
  openDefects,
  activeSuites,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-pulse">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="h-24 rounded-xl border border-slate-200 bg-slate-100" />
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'TOTAL TEST CASES',
      value: totalTests.toLocaleString(),
      trend: '▲ Live overview',
      isPositive: true,
      icon: CheckSquare,
      color: 'text-blue-600 bg-blue-50 border-blue-100',
    },
    {
      title: 'AUTOMATION COVERAGE',
      value: `${automationCoverage}%`,
      trend: '▲ Verified tests',
      isPositive: true,
      icon: Percent,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    },
    {
      title: 'OPEN DEFECTS',
      value: openDefects.toString(),
      trend: openDefects > 0 ? '▲ Active failures' : '✔ Healthy',
      isPositive: openDefects === 0,
      icon: AlertCircle,
      color: openDefects > 0 ? 'text-rose-600 bg-rose-50 border-rose-100' : 'text-slate-500 bg-slate-50 border-slate-100',
    },
    {
      title: 'ACTIVE SUITES',
      value: activeSuites.toString(),
      trend: '▲ Live modules',
      isPositive: true,
      icon: Layers,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div 
            key={card.title} 
            className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 cursor-pointer"
          >
            <div className="space-y-1.5">
              <span className="text-xxs font-bold tracking-wider text-slate-400 uppercase">
                {card.title}
              </span>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight leading-none">
                {card.value}
              </h3>
              <div className="pt-0.5">
                <span className={`
                  inline-flex items-center rounded px-1.5 py-0.5 text-xxs font-medium border
                  ${!card.isPositive
                    ? 'bg-rose-50 text-rose-700 border-rose-100'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                  }
                `}>
                  {card.trend}
                </span>
              </div>
            </div>
            
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${card.color} group-hover:scale-110 transition-transform duration-200`}>
              <Icon className="h-5 w-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
};
