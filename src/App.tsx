import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { KPICards } from './components/KPICards';
import { 
  ExecutionResults, 
  ExecutionTrend, 
  BugsByModule, 
  AutomationVsManual, 
  ExecutionActivity 
} from './components/Charts';
import { Info, AlertCircle } from 'lucide-react';

function App() {
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex">
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
      />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col lg:pl-64 min-h-screen">
        {/* Header Controls */}
        <Header 
          timeframe={timeframe} 
          setTimeframe={(tf) => {
            setTimeframe(tf);
            triggerToast(`Updated stats timeframe to ${tf}.`);
          }} 
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          onToggleSidebar={() => setSidebarOpen(true)}
        />

        {/* View switching logic */}
        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {activeTab === 'monitoring' ? (
            <>
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
          ) : (
            /* Elegant placeholder for other tabs */
            <div className="flex flex-col items-center justify-center min-h-[50vh] rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                <Info className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-base font-bold text-slate-800 uppercase tracking-wide">
                {activeTab.replace('-', ' ')} Page
              </h2>
              <p className="mt-1 text-sm text-slate-400 max-w-md">
                You are currently viewing the mocked {activeTab} section of the Omaha platform. Select "Monitoring" to return to the interactive dashboard.
              </p>
            </div>
          )}
        </main>
      </div>

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
