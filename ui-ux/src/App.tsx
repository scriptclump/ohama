import { useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
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
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { useDashboard } from './hooks/useDashboard';

const DashboardView: React.FC = () => {
  const [timeframe, setTimeframe] = useState('7d');
  const { stats, chartData, loading, error, refresh } = useDashboard(timeframe);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleRefresh = async () => {
    await refresh();
    triggerToast('Refreshed monitoring metrics from database.');
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white border border-rose-200 rounded-2xl max-w-md mx-auto text-center mt-10">
        <div className="h-12 w-12 rounded-full bg-rose-50 text-rose-500 border border-rose-100 flex items-center justify-center font-bold text-xl mb-4">
          !
        </div>
        <h3 className="text-base font-bold text-slate-900">Failed to load dashboard metrics</h3>
        <p className="text-xs text-slate-500 mt-1 mb-4">{error}</p>
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

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Dashboard Title & Timeframe Selector Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl font-sans">
            Monitoring
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 font-sans md:text-sm">
            Live overview of test execution and project health across your MERN stack.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Timeframe Selector Pill */}
          <div className="flex rounded-lg bg-slate-100 p-0.5 border border-slate-200">
            {['1d', '7d', '30d', '90d'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
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
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 active:bg-slate-100 disabled:opacity-50 transition-all font-sans"
            >
              <RefreshCw className={`h-3.5 w-3.5 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <button
              onClick={() => triggerToast('Generating dashboard share link...')}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 active:bg-slate-100 transition-all font-sans"
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
      <HeroBanner 
        onRunAll={handleRefresh} 
        isRunning={loading} 
        totalTests={stats?.totalTests || 0}
        activeSuites={stats?.activeSuites || 0}
        executionsToday={stats?.executionsToday || 0}
        passRate={stats?.passRate || 0}
        avgRuntimeMs={stats?.avgRuntimeMs || 0}
        isLoading={loading}
      />

      {/* Secondary KPI Cards */}
      <KPICards 
        totalTests={stats?.totalTests || 0}
        automationCoverage={stats?.automationCoverage || 0}
        openDefects={stats?.openDefects || 0}
        activeSuites={stats?.activeSuites || 0}
        isLoading={loading}
      />

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ExecutionResults data={chartData?.executionResults} />
        <ExecutionTrend data={chartData?.executionTrend} isLoading={loading} />
      </div>

      {/* Secondary Metrics Split Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <BugsByModule data={chartData?.bugsByModule} isLoading={loading} />
        <AutomationVsManual data={chartData?.automationVsManual} isLoading={loading} />
      </div>

      {/* Heatmap Section */}
      <ExecutionActivity data={chartData?.activityHeatmap} isLoading={loading} />

      {/* Floating Action Feedback Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-800 px-4 py-3 text-xs font-medium text-white shadow-2xl animate-slideUp">
          <AlertCircle className="h-4 w-4 text-blue-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

function App() {
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Derive active screen based on routing pathname for the TopBar
  let activeScreen = 'dashboard';
  if (location.pathname === '/login') {
    activeScreen = 'login';
  } else if (location.pathname.startsWith('/detail')) {
    activeScreen = 'detail';
  } else if (location.pathname.startsWith('/tests')) {
    activeScreen = 'test-cases';
  }

  // Derive active screen logic from TopBar clicks
  const handleSetActiveScreen = (screen: string) => {
    if (screen === 'login') {
      navigate('/login');
    } else if (screen === 'dashboard') {
      navigate('/');
    } else if (screen === 'detail') {
      navigate('/detail/ERP');
    } else if (screen === 'test-cases') {
      navigate('/tests');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="h-8 w-8 animate-spin text-indigo-600" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Restoring auth session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* Figma Top-Bar Navigation */}
      <TopBar 
        activeScreen={activeScreen} 
        setActiveScreen={handleSetActiveScreen} 
        isLoggedIn={!!user} 
      />

      <div className="flex-1 flex relative">
        {/* Render Sidebar and main layout wrapper only if user is logged in */}
        {user && (
          <Sidebar 
            isOpen={sidebarOpen} 
            setIsOpen={setSidebarOpen} 
          />
        )}

        <div className={`flex-1 flex flex-col min-h-[calc(100vh-3.5rem)] ${user ? 'lg:pl-64' : ''}`}>
          {/* Header Controls only for logged-in users */}
          {user && (
            <Header 
              onToggleSidebar={() => setSidebarOpen(true)}
            />
          )}

          {/* View switching logic using Routes */}
          <main className="flex-1 p-6 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
            <Routes>
              {/* Unauthenticated flow: Login screen */}
              <Route 
                path="/login" 
                element={user ? <Navigate to="/" replace /> : <Login />} 
              />

              {/* Authenticated routes */}
              <Route 
                path="/" 
                element={user ? <DashboardView /> : <Navigate to="/login" replace />} 
              />
              <Route 
                path="/detail/:moduleName" 
                element={user ? <DetailView /> : <Navigate to="/login" replace />} 
              />
              <Route 
                path="/tests" 
                element={user ? <TestCasesView /> : <Navigate to="/login" replace />} 
              />

              {/* Fallback */}
              <Route 
                path="*" 
                element={<Navigate to={user ? '/' : '/login'} replace />} 
              />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
