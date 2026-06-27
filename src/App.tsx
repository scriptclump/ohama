import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { KPICards } from './components/KPICards';
import { TopBar } from './components/TopBar';
import { Login } from './components/Login';
import { DetailView } from './components/DetailView';
import { TestCasesView } from './components/TestCasesView';
import { 
  ExecutionResults, 
  ExecutionTrend, 
  BugsByModule, 
  AutomationVsManual, 
  ExecutionActivity 
} from './components/Charts';
import { Info, AlertCircle } from 'lucide-react';

function App() {
  const [activeScreen, setActiveScreen] = useState('login'); // Starts on the Login page as per Figma design flow
  const [activeTab, setActiveTab] = useState('monitoring');
  const [timeframe, setTimeframe] = useState('7d');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Trigger temporary toast feedback
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Mock refresh trigger
  const handleRefresh = () => {
    setIsRefreshing(true);
    triggerToast('Refreshed monitoring metrics from database.');
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1200);
  };

  // Mock test execution run
  const handleRunAll = () => {
    setIsRunning(true);
    triggerToast('Initiating execution suite across all modules...');
    setTimeout(() => {
      setIsRunning(false);
      triggerToast('All test cases completed. No new failures found!');
    }, 3000);
  };

  // Synchronization between TopBar tabs and Sidebar active state
  const handleSetActiveScreen = (screen: string) => {
    setActiveScreen(screen);
    if (screen === 'dashboard') {
      setActiveTab('monitoring');
    } else if (screen === 'detail') {
      setActiveTab('executions');
    } else if (screen === 'test-cases') {
      setActiveTab('test-cases');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* Figma Top-Bar Navigation */}
      <TopBar 
        activeScreen={activeScreen} 
        setActiveScreen={handleSetActiveScreen} 
        isLoggedIn={activeScreen !== 'login'} 
      />

      {activeScreen === 'login' ? (
        <Login onLoginSuccess={() => handleSetActiveScreen('dashboard')} />
      ) : (
        <div className="flex-1 flex relative">
          {/* Sidebar Navigation */}
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={(tab) => {
              setActiveTab(tab);
              if (tab === 'monitoring') {
                setActiveScreen('dashboard');
              } else if (tab === 'executions' || tab === 'defects') {
                setActiveScreen('detail');
              } else if (tab === 'test-cases') {
                setActiveScreen('test-cases');
              }
            }} 
            isOpen={sidebarOpen} 
            setIsOpen={setSidebarOpen} 
          />

          {/* Main Content Pane */}
          <div className="flex-1 flex flex-col lg:pl-64 min-h-[calc(100vh-3.5rem)]">
            {/* Header Controls */}
            <Header 
              onToggleSidebar={() => setSidebarOpen(true)}
            />

            {/* View switching logic */}
            <main className="flex-1 p-6 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
              {activeScreen === 'dashboard' ? (
                <>
                  {/* Dashboard Title & Timeframe Selector Header */}
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-2">
                    <div>
                      <h2 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl font-sans">
                        Monitoring
                      </h2>
                      <p className="mt-0.5 text-xs text-slate-500 font-sans md:text-sm">
                        Live overview of test execution and project health across your stack.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      {/* Timeframe Selector Pill */}
                      <div className="flex rounded-lg bg-slate-100 p-0.5 border border-slate-200">
                        {['1d', '7d', '30d', '90d'].map((tf) => (
                          <button
                            key={tf}
                            onClick={() => {
                              setTimeframe(tf);
                              triggerToast(`Updated stats timeframe to ${tf}.`);
                            }}
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
                          onClick={handleRefresh}
                          disabled={isRefreshing}
                          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 active:bg-slate-100 disabled:opacity-50 transition-all"
                        >
                          <svg className={`h-3.5 w-3.5 text-slate-500 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M21 20v-5h-.581" />
                          </svg>
                          <span>Refresh</span>
                        </button>

                        {/* Share Button */}
                        <button
                          onClick={() => triggerToast('Generating dashboard share link...')}
                          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 active:bg-slate-100 transition-all"
                        >
                          <svg className="h-3.5 w-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 10.742l4.632-2.316m0 0a3 3 0 102.684-2.684 3 3 0 00-2.684 2.684zm-4.632 2.316a3 3 0 010 3.632l-4.632 2.316m0 0a3 3 0 10-2.684 2.684 3 3 0 002.684-2.684zm4.632-2.316a3 3 0 002.684-2.684" />
                          </svg>
                          <span>Share</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Hero Release & Stats Banner */}
                  <HeroBanner onRunAll={handleRunAll} isRunning={isRunning} />

                  {/* Secondary KPI Cards */}
                  <KPICards />

                  {/* Main Charts Row */}
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <ExecutionResults />
                    <ExecutionTrend />
                  </div>

                  {/* Secondary Metrics Split Row */}
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <BugsByModule />
                    <AutomationVsManual />
                  </div>

                  {/* Heatmap Section */}
                  <ExecutionActivity />
                </>
              ) : activeScreen === 'detail' ? (
                <DetailView />
              ) : activeScreen === 'test-cases' ? (
                <TestCasesView />
              ) : (
                /* Elegant placeholder for other tabs */
                <div className="flex flex-col items-center justify-center min-h-[50vh] rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                    <Info className="h-6 w-6" />
                  </div>
                  <h2 className="mt-4 text-base font-bold text-slate-800 uppercase tracking-wide">
                    {activeScreen.replace('-', ' ')} Page
                  </h2>
                  <p className="mt-1 text-sm text-slate-400 max-w-md">
                    You are currently viewing the mocked {activeScreen} section of the Omaha platform. Select "2 · Dashboard" to return to the interactive dashboard.
                  </p>
                </div>
              )}
            </main>
          </div>
        </div>
      )}

      {/* Floating Action Feedback Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-800 px-4 py-3 text-xs font-medium text-white shadow-2xl animate-slideUp">
          <AlertCircle className="h-4 w-4 text-blue-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default App;

