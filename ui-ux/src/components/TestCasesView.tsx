import React, { useState, useEffect } from 'react';
import { 
  Search, ChevronRight, Play, Edit, ExternalLink, Download, 
  Plus, Check, X, ShieldAlert, ArrowLeft, Sparkles, 
  Trash2, Monitor, Laptop, Smartphone, Tablet, Calendar, 
  Save
} from 'lucide-react';

interface Step {
  text: string;
  passed: boolean;
  error?: string;
  expected?: string;
}

interface TestCase {
  id: string;
  name: string;
  status: 'PASS' | 'FAIL' | 'SKIP';
  type: 'auto' | 'manual';
  owner: string;
  runtime: string;
  lastRun: string;
  steps: Step[];
  tags: string[];
  priority: 'high' | 'medium' | 'low';
  defect?: string;
  createdBy: string;
  createdDate: string;
  history: ('pass' | 'fail' | 'flaky')[];
  description?: string;
}

export const TestCasesView: React.FC = () => {
  // Navigation View State: 'list' | 'create' | 'execute'
  const [viewState, setViewState] = useState<'list' | 'create' | 'execute'>('list');

  useEffect(() => {
    const handleTrigger = () => setViewState('create');
    window.addEventListener('trigger-new-test-case', handleTrigger);
    return () => window.removeEventListener('trigger-new-test-case', handleTrigger);
  }, []);

  // Initial test case list
  const [testCases, setTestCases] = useState<TestCase[]>([
    {
      id: 'TC-00412',
      name: 'Invoice — multi-currency rounding',
      status: 'FAIL',
      type: 'auto',
      owner: 'R. Mehta',
      runtime: '00:42',
      lastRun: '2h ago',
      priority: 'high',
      defect: 'D-2041',
      createdBy: 'L. Park',
      createdDate: 'Jan 14',
      tags: ['regression', 'invoice', 'fx'],
      description: 'Verifies the multi-currency rounding calculations during invoice GL ledger postings.',
      steps: [
        { text: 'Open Invoice → New', passed: true },
        { text: 'Select vendor — ACME-EUR', passed: true },
        { text: 'Add line: 1 x 199.99 EUR', passed: true },
        { text: 'Post invoice', passed: true },
        { text: 'Verify GL entry rounds to 2dp', passed: false, error: 'AssertionError: expected 199.99, got 200.00' }
      ],
      history: ['pass', 'pass', 'pass', 'pass', 'fail', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'fail', 'pass', 'pass', 'pass', 'pass', 'pass', 'fail']
    },
    {
      id: 'TC-00411',
      name: 'Invoice — single-line posting happy path',
      status: 'PASS',
      type: 'auto',
      owner: 'R. Mehta',
      runtime: '00:31',
      lastRun: '2h ago',
      priority: 'high',
      createdBy: 'L. Park',
      createdDate: 'Jan 10',
      tags: ['regression', 'invoice', 'happy'],
      description: 'Validates a standard single line item invoice posting from creation to ledger confirmation.',
      steps: [
        { text: 'Open Invoice → New', passed: true },
        { text: 'Select vendor — ACME-US', passed: true },
        { text: 'Add line: 1 x 1000.00 USD', passed: true },
        { text: 'Post invoice', passed: true },
        { text: 'Verify GL accounts balanced', passed: true }
      ],
      history: ['pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass']
    },
    {
      id: 'TC-00410',
      name: 'Invoice — tax override applied correctly',
      status: 'PASS',
      type: 'auto',
      owner: 'L. Park',
      runtime: '00:58',
      lastRun: '2h ago',
      priority: 'medium',
      createdBy: 'L. Park',
      createdDate: 'Jan 12',
      tags: ['tax', 'override'],
      description: 'Ensures manual tax overrides are prioritized over default system rules.',
      steps: [
        { text: 'Open Invoice → New', passed: true },
        { text: 'Toggle manual tax override', passed: true },
        { text: 'Set tax rate to 5%', passed: true },
        { text: 'Verify tax totals recalculate', passed: true }
      ],
      history: ['pass', 'pass', 'pass', 'pass', 'flaky', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass']
    },
    {
      id: 'TC-00409',
      name: 'Invoice — duplicate detection',
      status: 'FAIL',
      type: 'manual',
      owner: 'A. Khan',
      runtime: '—',
      lastRun: 'yesterday',
      priority: 'high',
      defect: 'D-3512',
      createdBy: 'A. Khan',
      createdDate: 'Jan 08',
      tags: ['validation', 'duplicate'],
      description: 'Verifies the system detects and blocks duplicate invoices submitted in parallel threads.',
      steps: [
        { text: 'Create draft invoice with duplicate invoice number', passed: true },
        { text: 'Attempt to submit invoice', passed: true },
        { text: 'Verify warning modal is shown', passed: false, error: 'Manual Verification Failed: Modal did not block submission' }
      ],
      history: ['pass', 'pass', 'fail', 'pass', 'pass', 'pass', 'pass', 'fail', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'fail']
    },
    {
      id: 'TC-00408',
      name: 'Invoice — void and reissue',
      status: 'SKIP',
      type: 'auto',
      owner: 'R. Mehta',
      runtime: '—',
      lastRun: 'skipped',
      priority: 'medium',
      createdBy: 'J. Diaz',
      createdDate: 'Jan 02',
      tags: ['workflow', 'void'],
      description: 'Checks invoice status transition flows upon void and reissue triggers.',
      steps: [
        { text: 'Select posted invoice', passed: true },
        { text: 'Click Void Invoice', passed: true },
        { text: 'Verify status changes to Void', passed: true },
        { text: 'Verify Reissue action creates cloned copy', passed: true }
      ],
      history: ['pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass']
    }
  ]);

  const [selectedCase, setSelectedCase] = useState<TestCase>(testCases[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Any');

  // --- Create Test Case Form State ---
  const [newName, setNewName] = useState('');
  const [newScenario, setNewScenario] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newType, setNewType] = useState<'auto' | 'manual'>('auto');
  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [newApp, setNewApp] = useState('MS Dynamics');
  const [newModule, setNewModule] = useState('Invoice posting');
  const [newEnv, setNewEnv] = useState('Staging');
  const [newOwner, setNewOwner] = useState('Jordan Miles');
  const [newSprint, setNewSprint] = useState('Sprint 14');
  const [newPreconditions, setNewPreconditions] = useState('');
  const [tags, setTags] = useState<string[]>(['regression', 'login-flow', 'high-priority', 'automation-ready']);
  const [tagInput, setTagInput] = useState('');
  const [steps, setSteps] = useState<Step[]>([
    { text: 'Navigate to login page', passed: true, expected: 'Login page is displayed' },
    { text: 'Enter valid credentials', passed: true, expected: 'Fields accept input' },
    { text: 'Click login button', passed: true, expected: 'Redirect to dashboard' }
  ]);
  const [isGeneratingSteps, setIsGeneratingSteps] = useState(false);

  // --- Execute Test Case Form State ---
  const [execEnv, setExecEnv] = useState('DEV');
  const [execType, setExecType] = useState('Smoke');
  const [execDataTag, setExecDataTag] = useState('');
  const [execRunLabel, setExecRunLabel] = useState('Pre-release smoke run');
  const [browsers, setBrowsers] = useState({ chrome: true, firefox: true, edge: false, safari: false, others: false });
  const [devices, setDevices] = useState({ desktop: true, laptop: true, mobile: false, tablet: false });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);

  // --- Actions ---
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (t: string) => {
    setTags(tags.filter((x) => x !== t));
  };

  const handleAddStep = () => {
    setSteps([...steps, { text: '', passed: true, expected: '' }]);
  };

  const handleStepChange = (index: number, field: keyof Step, val: string) => {
    const updated = [...steps];
    updated[index] = { ...updated[index], [field]: val };
    setSteps(updated);
  };

  const handleRemoveStep = (index: number) => {
    setSteps(steps.filter((_, idx) => idx !== index));
  };

  // Simulated AI Steps generation
  const handleAIGenerateSteps = () => {
    setIsGeneratingSteps(true);
    setTimeout(() => {
      setSteps([
        { text: 'Navigate to invoice catalog page', passed: true, expected: 'Catalog loads within 500ms' },
        { text: 'Select bulk edit → update currency multiplier', passed: true, expected: 'Multi-select options show EUR, USD, GBP' },
        { text: 'Input manual FX conversion overrides', passed: true, expected: 'Override flags reflect in database session state' },
        { text: 'Verify calculation matrix for EUR rounding discrepancies', passed: true, expected: 'Assertion matches 199.99 limit trace' }
      ]);
      setIsGeneratingSteps(false);
    }, 1500);
  };

  // Submit and create
  const handleSaveTestCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newTC: TestCase = {
      id: `TC-00${413 + testCases.length}`,
      name: newName,
      status: 'SKIP',
      type: newType,
      owner: newOwner,
      runtime: '—',
      lastRun: 'never',
      priority: newPriority,
      createdBy: 'Jordan Miles',
      createdDate: 'Today',
      tags: tags,
      description: newDesc || newScenario || 'No description provided.',
      steps: steps,
      history: ['pass', 'pass', 'pass']
    };

    setTestCases([newTC, ...testCases]);
    setSelectedCase(newTC);
    setViewState('list');
    
    // Reset Form
    setNewName('');
    setNewScenario('');
    setNewDesc('');
    setNewPreconditions('');
  };

  // Run suite simulation
  const handleTriggerRun = (e: React.FormEvent) => {
    e.preventDefault();
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      // Simulate status update on test run completion
      const updatedList = testCases.map((tc) => {
        if (tc.id === selectedCase.id) {
          return {
            ...tc,
            status: 'PASS' as const,
            lastRun: '1m ago',
            runtime: '00:28',
            history: ['pass', ...tc.history] as any
          };
        }
        return tc;
      });
      setTestCases(updatedList);
      setSelectedCase({
        ...selectedCase,
        status: 'PASS',
        lastRun: '1m ago',
        runtime: '00:28',
        history: ['pass', ...selectedCase.history] as any
      });
      setViewState('list');
    }, 2000);
  };

  const filteredCases = testCases.filter((tc) => {
    const matchesSearch = tc.name.toLowerCase().includes(searchQuery.toLowerCase()) || tc.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'Any' || tc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex-1 w-full text-left font-sans">
      
      {/* 1. CATALOG LIST VIEW */}
      {viewState === 'list' && (
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Left Panel: List & Table */}
          <div className="flex-1 w-full space-y-4">
            {/* Breadcrumb & Actions Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-xxs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <span>ERP</span>
                  <ChevronRight className="h-3 w-3" />
                  <span className="text-indigo-600">Invoice posting</span>
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Test cases</h2>
                  <span className="text-sm font-bold text-slate-400">- {testCases.length}</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Drill into a case to see steps, assertions, and run history.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1 border border-slate-200 bg-white rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                  <Download className="h-3.5 w-3.5 text-slate-500" />
                  <span>Export</span>
                </button>
                <button 
                  onClick={() => setViewState('execute')}
                  className="flex items-center gap-1 border border-slate-200 bg-white rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <Play className="h-3.5 w-3.5 text-slate-500 fill-slate-500" />
                  <span>Execute test case</span>
                </button>
                <button 
                  onClick={() => setViewState('create')}
                  className="flex items-center gap-1 bg-indigo-600 text-white rounded-lg px-3.5 py-1.5 text-xs font-semibold hover:bg-indigo-700 shadow-sm"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>New test case</span>
                </button>
              </div>
            </div>

            {/* Filters and Search Bar */}
            <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3 shadow-sm">
              <div className="flex flex-wrap items-center gap-2.5 flex-1">
                <div className="relative flex-1 min-w-[200px] max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search in this module..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 bg-slate-50/50"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-white cursor-pointer focus:outline-none"
                >
                  <option value="Any">Status : Any</option>
                  <option value="PASS">Status : PASS</option>
                  <option value="FAIL">Status : FAIL</option>
                  <option value="SKIP">Status : SKIP</option>
                </select>

                <select className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-400 bg-white cursor-not-allowed" disabled>
                  <option>Tags : Any</option>
                </select>

                <select className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-400 bg-white cursor-not-allowed" disabled>
                  <option>ENV : Staging</option>
                </select>
              </div>

              <div className="text-xxs font-bold text-slate-400 uppercase tracking-wider">
                Showing {filteredCases.length} of {testCases.length}
              </div>
            </div>

            {/* Datatable */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                      <th className="py-3 px-4 w-10">
                        <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5 border-slate-300" defaultChecked />
                      </th>
                      <th className="py-3 px-4">ID</th>
                      <th className="py-3 px-4">NAME</th>
                      <th className="py-3 px-4">STATUS</th>
                      <th className="py-3 px-4">TYPE</th>
                      <th className="py-3 px-4">OWNER</th>
                      <th className="py-3 px-4">RUNTIME</th>
                      <th className="py-3 px-4">RUN</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                    {filteredCases.map((tc) => {
                      const isSelected = selectedCase.id === tc.id;
                      return (
                        <tr
                          key={tc.id}
                          onClick={() => setSelectedCase(tc)}
                          className={`cursor-pointer transition-colors ${
                            isSelected ? 'bg-indigo-50/60 hover:bg-indigo-50' : 'hover:bg-slate-50/50'
                          }`}
                        >
                          <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                            <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5 border-slate-300" defaultChecked />
                          </td>
                          <td className="py-3.5 px-4 font-mono font-semibold text-slate-500">{tc.id}</td>
                          <td className={`py-3.5 px-4 font-bold text-slate-800 ${isSelected ? 'text-indigo-900' : ''}`}>
                            {tc.name}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded border ${
                                tc.status === 'PASS'
                                  ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                                  : tc.status === 'FAIL'
                                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                                  : 'bg-slate-100 border-slate-200 text-slate-500'
                              }`}
                            >
                              {tc.status === 'PASS' ? '✓ PASS' : tc.status === 'FAIL' ? '× FAIL' : '— SKIP'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded text-[10px] font-semibold text-slate-500">
                              {tc.type === 'auto' ? '⚙ auto' : '✋ manual'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-slate-500">{tc.owner}</td>
                          <td className="py-3.5 px-4 font-mono font-semibold text-slate-400">{tc.runtime}</td>
                          <td className="py-3.5 px-4 text-slate-400 font-semibold">{tc.lastRun}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Panel: Side Detail Drawer Panel */}
          <div className="w-full lg:w-96 bg-white border border-slate-200 rounded-2xl p-5 shadow-lg space-y-5 sticky top-20">
            <div className="space-y-2 pb-4 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold font-mono text-slate-400">{selectedCase.id}</span>
                <span
                  className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                    selectedCase.status === 'PASS'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                      : selectedCase.status === 'FAIL'
                      ? 'bg-rose-50 border-rose-200 text-rose-600'
                      : 'bg-slate-100 border-slate-200 text-slate-500'
                  }`}
                >
                  {selectedCase.status === 'PASS' ? '✓ PASS' : selectedCase.status === 'FAIL' ? '× FAIL' : '— SKIP'}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-800 tracking-tight leading-snug">
                {selectedCase.name}
              </h3>

              <div className="flex flex-wrap gap-1.5">
                <span className="rounded bg-slate-50 border border-slate-200 text-slate-500 text-[10px] font-bold px-2 py-0.5 uppercase tracking-wide">
                  {selectedCase.type === 'auto' ? '⚙ automation' : '✋ manual'}
                </span>
                <span className={`rounded text-[10px] font-bold px-2 py-0.5 uppercase tracking-wide border ${
                  selectedCase.priority === 'high' 
                    ? 'bg-rose-50 border-rose-100 text-rose-600'
                    : selectedCase.priority === 'medium'
                    ? 'bg-amber-50 border-amber-100 text-amber-600'
                    : 'bg-slate-100 border-slate-200 text-slate-500'
                }`}>
                  priority: {selectedCase.priority}
                </span>
                {selectedCase.tags.map((tag) => (
                  <span key={tag} className="rounded bg-indigo-50/50 border border-indigo-100/50 text-indigo-500 text-[10px] font-semibold px-2 py-0.5">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pb-2">
              <button 
                onClick={() => setViewState('execute')}
                className="flex items-center justify-center gap-1.5 bg-indigo-600 text-white rounded-lg py-2 text-xs font-bold shadow hover:bg-indigo-700"
              >
                <Play className="h-3.5 w-3.5 fill-white" />
                <span>Run now</span>
              </button>
              <button className="flex items-center justify-center gap-1.5 border border-slate-200 rounded-lg py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">
                <Edit className="h-3.5 w-3.5 text-slate-500" />
                <span>Edit</span>
              </button>
              <button className="flex items-center justify-center gap-1.5 border border-slate-200 rounded-lg py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">
                <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
                <span>Open</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-xxs font-semibold">
              <div>
                <span className="text-slate-400 uppercase tracking-wider block">Owner</span>
                <span className="text-slate-800 text-xs font-bold mt-0.5 block">{selectedCase.owner}</span>
              </div>
              <div>
                <span className="text-slate-400 uppercase tracking-wider block">Last Run</span>
                <span className="text-slate-800 text-xs font-bold mt-0.5 block">{selectedCase.lastRun === 'skipped' ? 'skipped' : `${selectedCase.lastRun} · ${selectedCase.runtime}`}</span>
              </div>
              <div>
                <span className="text-slate-400 uppercase tracking-wider block">Linked Defect</span>
                {selectedCase.defect ? (
                  <span className="text-indigo-600 text-xs font-bold mt-0.5 block hover:underline cursor-pointer flex items-center gap-0.5">
                    <ShieldAlert className="h-3.5 w-3.5 text-rose-500 inline" /> {selectedCase.defect}
                  </span>
                ) : (
                  <span className="text-slate-400 text-xs font-bold mt-0.5 block">—</span>
                )}
              </div>
              <div>
                <span className="text-slate-400 uppercase tracking-wider block">Created By</span>
                <span className="text-slate-800 text-xs font-bold mt-0.5 block">
                  {selectedCase.createdBy}{' '}
                  <span className="text-xxs text-slate-400 font-normal">({selectedCase.createdDate})</span>
                </span>
              </div>
            </div>

            <div className="space-y-2.5">
              <h4 className="text-xxs font-bold text-slate-400 uppercase tracking-widest">Steps</h4>
              <div className="space-y-2 font-sans">
                {selectedCase.steps.map((step, idx) => (
                  <div key={idx} className="flex gap-3 text-xs">
                    <span className="text-slate-400 font-semibold font-mono w-4">{idx + 1}.</span>
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`h-4 w-4 rounded-full flex items-center justify-center shrink-0 border ${
                          step.passed 
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                            : 'bg-rose-50 border-rose-200 text-rose-600'
                        }`}>
                          {step.passed ? (
                            <Check className="h-2.5 w-2.5 stroke-[3px]" />
                          ) : (
                            <X className="h-2.5 w-2.5 stroke-[3px]" />
                          )}
                        </span>
                        <span className={`font-semibold ${step.passed ? 'text-slate-700' : 'text-rose-600'}`}>
                          {step.text}
                        </span>
                      </div>
                      {step.error && (
                        <div className="bg-rose-50/60 border border-rose-100/50 rounded-lg p-2.5 text-[10px] text-rose-700 font-semibold font-mono leading-relaxed pl-3.5 relative">
                          <span className="absolute left-2 text-rose-400">↳</span>
                          {step.error}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-xxs font-bold uppercase tracking-widest text-slate-400">
                <span>Run History - Last 20</span>
                <span className="text-slate-500 font-mono">85% pass</span>
              </div>
              
              <div className="flex justify-between items-end h-5 gap-[2px]">
                {selectedCase.history.map((outcome, idx) => (
                  <div
                    key={idx}
                    className={`flex-1 h-full rounded-[1px] ${
                      outcome === 'pass'
                        ? 'bg-emerald-500'
                        : outcome === 'fail'
                        ? 'bg-rose-500'
                        : 'bg-amber-400'
                    }`}
                  />
                ))}
              </div>

              <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                <span>Older</span>
                <span>Newest</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. CREATE TEST CASE VIEW */}
      {viewState === 'create' && (
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Panel: Creation Form */}
          <form onSubmit={handleSaveTestCase} className="flex-1 w-full space-y-6 bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 shadow-sm">
            <div className="space-y-1 pb-4 border-b border-slate-100">
              <button 
                type="button" 
                onClick={() => setViewState('list')} 
                className="flex items-center gap-1 text-slate-500 hover:text-slate-800 text-xs font-bold pb-2 transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>‹ Back to Test Cases</span>
              </button>
              <div className="flex items-baseline gap-2">
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Create Test Case</h2>
                <span className="rounded bg-indigo-550 border border-slate-200 text-slate-500 px-2 py-0.5 text-xxs font-bold uppercase">
                  Draft
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Define a new test case for your project scope.
              </p>
            </div>

            {/* Section 1: Core Details */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-indigo-650 uppercase tracking-widest flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-50 text-xxs font-bold text-indigo-600">1</span>
                <span>Core Details</span>
              </h3>

              <div className="space-y-4 pl-6.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Test Case Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Verify user login with valid credentials"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-slate-50/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Business Scenario</label>
                  <textarea
                    rows={2}
                    value={newScenario}
                    onChange={(e) => setNewScenario(e.target.value)}
                    placeholder="Describe the business flow this test case covers..."
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-slate-50/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Description</label>
                  <textarea
                    rows={3}
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Add a detailed description of what this test case validates, expected behavior, and any preconditions..."
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-slate-50/30"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Classification & Environment */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold text-indigo-650 uppercase tracking-widest flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-50 text-xxs font-bold text-indigo-600">2</span>
                <span>Classification & Environment</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Test Case Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  >
                    <option value="auto">⚙ Automation</option>
                    <option value="manual">✋ Manual</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Criticality</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  >
                    <option value="high">▲ High</option>
                    <option value="medium">◆ Medium</option>
                    <option value="low">▼ Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Application</label>
                  <select
                    value={newApp}
                    onChange={(e) => setNewApp(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  >
                    <option value="MS Dynamics">■ MS Dynamics</option>
                    <option value="SAP ERP">■ SAP ERP</option>
                    <option value="Salesforce">■ Salesforce</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Module</label>
                  <select
                    value={newModule}
                    onChange={(e) => setNewModule(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  >
                    <option value="Invoice posting">Invoice posting</option>
                    <option value="Purchase orders">Purchase orders</option>
                    <option value="GL entries">GL entries</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Environment Context</label>
                  <select
                    value={newEnv}
                    onChange={(e) => setNewEnv(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  >
                    <option value="Staging">Staging</option>
                    <option value="QA">QA</option>
                    <option value="DEV">DEV</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Assigned Owner</label>
                  <select
                    value={newOwner}
                    onChange={(e) => setNewOwner(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  >
                    <option value="Jordan Miles">Jordan Miles</option>
                    <option value="R. Mehta">Riya Mehta</option>
                    <option value="L. Park">Luke Park</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Sprint</label>
                  <select
                    value={newSprint}
                    onChange={(e) => setNewSprint(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  >
                    <option value="Sprint 14">Sprint 14</option>
                    <option value="Sprint 15">Sprint 15</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3: Tags & Labels */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold text-indigo-650 uppercase tracking-widest flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-50 text-xxs font-bold text-indigo-600">3</span>
                <span>Tags & Labels</span>
              </h3>

              <div className="space-y-3 pl-6.5">
                <div className="flex gap-2 max-w-sm">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
                    placeholder="Add a tag..."
                    className="flex-1 border border-slate-200 rounded-xl px-3.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-slate-50/50"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="bg-slate-100 border border-slate-200 text-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold hover:bg-slate-200 transition-colors"
                  >
                    + Add Tag
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {tags.map((t) => (
                    <span 
                      key={t}
                      className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 border border-slate-200 pl-3 pr-2 py-0.5 text-xxs font-bold text-slate-600"
                    >
                      <span>{t}</span>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveTag(t)}
                        className="h-3.5 w-3.5 rounded-full hover:bg-slate-200 flex items-center justify-center font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 4: Preconditions & Test Steps */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-indigo-650 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-50 text-xxs font-bold text-indigo-600">4</span>
                  <span>Preconditions & Test Steps</span>
                </h3>
                <button
                  type="button"
                  onClick={handleAIGenerateSteps}
                  disabled={isGeneratingSteps}
                  className="flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg px-2.5 py-1 text-xxs font-bold transition-all disabled:opacity-50"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{isGeneratingSteps ? 'Generating...' : '+ AI Generate Steps'}</span>
                </button>
              </div>

              <div className="space-y-4 pl-6.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Preconditions</label>
                  <textarea
                    rows={2}
                    value={newPreconditions}
                    onChange={(e) => setNewPreconditions(e.target.value)}
                    placeholder="List any preconditions required before executing this test..."
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-slate-50/30"
                  />
                </div>

                {/* Steps Table */}
                <div className="space-y-3">
                  <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Define steps & assertions</span>
                  <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full border-collapse text-left">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-xxs font-bold text-slate-400 uppercase tracking-wider">
                          <th className="py-2.5 px-4 w-12">#</th>
                          <th className="py-2.5 px-4">Step Action</th>
                          <th className="py-2.5 px-4">Expected Result</th>
                          <th className="py-2.5 px-4 w-20">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs">
                        {steps.map((st, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/30">
                            <td className="py-2 px-4 font-mono font-bold text-slate-400">{idx + 1}</td>
                            <td className="py-2 px-4">
                              <input
                                type="text"
                                value={st.text}
                                required
                                onChange={(e) => handleStepChange(idx, 'text', e.target.value)}
                                placeholder="Navigate to..."
                                className="w-full border-0 focus:ring-0 p-0 text-xs font-medium text-slate-700 placeholder-slate-300"
                              />
                            </td>
                            <td className="py-2 px-4">
                              <input
                                type="text"
                                value={st.expected || ''}
                                onChange={(e) => handleStepChange(idx, 'expected', e.target.value)}
                                placeholder="Expected outcome..."
                                className="w-full border-0 focus:ring-0 p-0 text-xs font-medium text-slate-700 placeholder-slate-300"
                              />
                            </td>
                            <td className="py-2 px-4">
                              <button
                                type="button"
                                onClick={() => handleRemoveStep(idx)}
                                className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddStep}
                    className="border border-dashed border-slate-300 hover:border-indigo-400 hover:text-indigo-600 rounded-xl w-full py-2.5 text-xs font-semibold text-slate-500 flex items-center justify-center gap-1.5 transition-all bg-white"
                  >
                    <Plus className="h-4 w-4" />
                    <span>+ Add Step</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Actions Row */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100 pl-6.5">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setViewState('list')}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  ✕ Cancel
                </button>
                <button
                  type="button"
                  onClick={() => { setSteps([]); setTags([]); }}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  + Reset
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-400 cursor-not-allowed"
                  disabled
                >
                  ⓵ Need Help
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-650 text-white px-5 py-2 text-xs font-bold hover:bg-indigo-750 shadow-md flex items-center gap-1.5"
                >
                  <Save className="h-4 w-4" />
                  <span>✓ Capture & Save</span>
                </button>
              </div>
            </div>
          </form>

          {/* Right Panel: AI Assistant Sidebar */}
          <div className="w-full lg:w-96 space-y-6 shrink-0">
            
            {/* AI Assistant panel */}
            <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-sm">
                  ✢
                </div>
                <div>
                  <h4 className="text-xs font-bold">AI Test Case Assistant</h4>
                  <p className="text-[10px] text-slate-500 font-mono">Powered by Omaha Intelligence Engine v2.4</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAIGenerateSteps}
                disabled={isGeneratingSteps}
                className="w-full flex items-center justify-center gap-1.5 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl py-2.5 text-xs font-bold transition-all disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" />
                <span>{isGeneratingSteps ? 'Processing...' : 'Generate Test Steps'}</span>
              </button>

              <div className="border-t border-slate-800/80 pt-3 space-y-2.5">
                <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">AI Capabilities</h5>
                <div className="grid grid-cols-1 gap-2.5 text-xxs font-semibold text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-400">★</span> Generate sequence with AI
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-400">★</span> Personalize automation flow
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-400">★</span> Suggest edge cases
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-400">★</span> Generate assertions
                  </div>
                </div>
              </div>
            </div>

            {/* Risk & Automation Potential */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-md space-y-4 text-xs">
              <div className="space-y-1.5">
                <span className="text-xxs font-bold text-slate-400 uppercase tracking-wider block">Risk Analysis</span>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <span className="text-amber-500 font-bold">▲</span> Medium Risk
                  </span>
                  <span className="text-xxs text-slate-400">Based on coverage & complexity</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full" style={{ width: '55%' }} />
                </div>
              </div>

              <div className="space-y-1.5 pt-3 border-t border-slate-100">
                <span className="text-xxs font-bold text-slate-400 uppercase tracking-wider block">Automation Feasibility</span>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-600">82% Automatable</span>
                  <span className="text-xxs text-slate-400">High feasibility detected</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full" style={{ width: '82%' }} />
                </div>
              </div>

              {/* Confidence Score circular representation */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <span className="text-xxs font-bold text-slate-400 uppercase tracking-wider block">AI Confidence Score</span>
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full border-4 border-indigo-100 flex items-center justify-center relative shrink-0">
                    <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-r-transparent border-b-transparent animate-spin-slow" />
                    <span className="font-extrabold text-sm text-slate-800">91%</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block text-xs">Highly Reliable</span>
                    <span className="text-xxs text-emerald-600 font-semibold">✓ AI Verified</span>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 text-xxs font-semibold text-slate-500">
                  <div className="flex justify-between">
                    <span>Step Coverage</span>
                    <span className="font-bold text-slate-700">94%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Assertion Quality</span>
                    <span className="font-bold text-slate-700">88%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Edge Case Detection</span>
                    <span className="font-bold text-slate-700">79%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Collaboration */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-md space-y-3">
              <span className="text-xxs font-bold text-slate-400 uppercase tracking-wider block">Team Collaboration</span>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="h-7 w-7 rounded-full bg-indigo-100 border border-white flex items-center justify-center text-[10px] font-bold text-indigo-700">JM</div>
                  <div className="h-7 w-7 rounded-full bg-emerald-100 border border-white flex items-center justify-center text-[10px] font-bold text-emerald-700">AS</div>
                  <div className="h-7 w-7 rounded-full bg-blue-100 border border-white flex items-center justify-center text-[10px] font-bold text-blue-700">PR</div>
                  <div className="h-7 w-7 rounded-full bg-slate-100 border border-white flex items-center justify-center text-[10px] font-bold text-slate-500">+4</div>
                </div>
                <div className="text-xxs font-semibold text-slate-500">
                  <span className="text-emerald-500 font-bold block">Active</span>
                  7 members · 3 online
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-100 text-xxs font-bold text-slate-500">
                <div>
                  <span className="text-slate-800 text-xs block">14</span>
                  Comments
                </div>
                <div>
                  <span className="text-slate-800 text-xs block">5</span>
                  Reviews
                </div>
                <div>
                  <span className="text-slate-800 text-xs block">3</span>
                  Approved
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. EXECUTE TEST CASE VIEW */}
      {viewState === 'execute' && (
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Panel: Form */}
          <form onSubmit={handleTriggerRun} className="flex-1 w-full space-y-6 bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 shadow-sm">
            <div className="space-y-1 pb-4 border-b border-slate-100">
              <button 
                type="button" 
                onClick={() => setViewState('list')} 
                className="flex items-center gap-1 text-slate-500 hover:text-slate-800 text-xs font-bold pb-2 transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>‹ Back to Test Cases</span>
              </button>
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Execute Test Case</h2>
              <p className="text-xs text-slate-500">
                Configure runtime parameters and trigger an execution run.
              </p>
            </div>

            {/* Test Case Metadata Block */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-semibold">
              <div>
                <span className="text-xxs font-bold text-slate-400 uppercase block tracking-wider">Test Case</span>
                <span className="text-sm font-extrabold text-slate-800 mt-1 block">{selectedCase.name}</span>
                <span className="text-xxs text-slate-400 font-medium block mt-0.5">{selectedCase.id} · {selectedCase.type === 'auto' ? '⚙ Automated' : '✋ Manual'}</span>
              </div>
              <div className="flex gap-6 text-center shrink-0">
                <div>
                  <span className="text-xxs text-slate-400 block uppercase">Pass Rate</span>
                  <span className="text-sm font-extrabold text-slate-800 block">89%</span>
                </div>
                <div>
                  <span className="text-xxs text-slate-400 block uppercase">Application</span>
                  <span className="text-sm font-extrabold text-slate-800 block">■ MS Dynamics</span>
                </div>
                <div>
                  <span className="text-xxs text-slate-400 block uppercase">Status</span>
                  <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-600 mt-0.5">Ready</span>
                </div>
              </div>
            </div>

            {/* Section 1: Configuration parameters */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-indigo-650 uppercase tracking-widest flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-50 text-xxs font-bold text-indigo-600">1</span>
                <span>Execution Configuration</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Environment <span className="text-rose-500">*</span></label>
                  <select
                    value={execEnv}
                    onChange={(e) => setExecEnv(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  >
                    <option value="DEV">DEV</option>
                    <option value="QA">QA</option>
                    <option value="STAGING">STAGING</option>
                    <option value="PROD">PROD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Execution Type <span className="text-rose-500">*</span></label>
                  <select
                    value={execType}
                    onChange={(e) => setExecType(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  >
                    <option value="Smoke">Smoke Run</option>
                    <option value="Regression">Full Regression</option>
                    <option value="Sanity">Sanity Check</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Test Data Tag</label>
                  <input
                    type="text"
                    value={execDataTag}
                    onChange={(e) => setExecDataTag(e.target.value)}
                    placeholder="e.g. smoke, regression-v2"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-slate-50/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Run Label</label>
                  <input
                    type="text"
                    value={execRunLabel}
                    onChange={(e) => setExecRunLabel(e.target.value)}
                    placeholder="e.g. Pre-release smoke run"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-slate-50/30"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Browser Selection */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-indigo-650 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-50 text-xxs font-bold text-indigo-600">2</span>
                  <span>Browser Selection *</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setBrowsers({ chrome: true, firefox: true, edge: true, safari: true, others: false })}
                  className="text-indigo-600 text-xxs font-bold hover:underline"
                >
                  Select All Browsers
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pl-6.5">
                {[
                  { id: 'chrome', name: 'Chrome', icon: 'C' },
                  { id: 'firefox', name: 'Firefox', icon: 'F' },
                  { id: 'edge', name: 'Edge', icon: 'E' },
                  { id: 'safari', name: 'Safari', icon: 'S' },
                  { id: 'others', name: 'Others', icon: '+' }
                ].map((b) => (
                  <label
                    key={b.id}
                    className={`flex items-center gap-2.5 rounded-xl border p-3 cursor-pointer select-none transition-all ${
                      (browsers as any)[b.id]
                        ? 'border-indigo-600 bg-indigo-50/40 text-indigo-900 font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={(browsers as any)[b.id]}
                      onChange={(e) => setBrowsers({ ...browsers, [b.id]: e.target.checked })}
                      className="rounded text-indigo-650 focus:ring-indigo-500 h-4 w-4 border-slate-300"
                    />
                    <div className="flex h-6 w-6 items-center justify-center rounded bg-slate-100 text-xs font-extrabold border border-slate-200">
                      {b.icon}
                    </div>
                    <span className="text-xs">{b.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Section 3: Device Selection */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-indigo-650 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-50 text-xxs font-bold text-indigo-600">3</span>
                  <span>Device Selection *</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setDevices({ desktop: true, laptop: true, mobile: true, tablet: true })}
                  className="text-indigo-600 text-xxs font-bold hover:underline"
                >
                  Select All Devices
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pl-6.5">
                {[
                  { id: 'desktop', name: 'Desktop', icon: <Monitor className="h-4 w-4" /> },
                  { id: 'laptop', name: 'Laptop', icon: <Laptop className="h-4 w-4" /> },
                  { id: 'mobile', name: 'Mobile', icon: <Smartphone className="h-4 w-4" /> },
                  { id: 'tablet', name: 'Tablet', icon: <Tablet className="h-4 w-4" /> }
                ].map((d) => (
                  <label
                    key={d.id}
                    className={`flex items-center gap-2.5 rounded-xl border p-3 cursor-pointer select-none transition-all ${
                      (devices as any)[d.id]
                        ? 'border-indigo-600 bg-indigo-50/40 text-indigo-900 font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={(devices as any)[d.id]}
                      onChange={(e) => setDevices({ ...devices, [d.id]: e.target.checked })}
                      className="rounded text-indigo-650 focus:ring-indigo-500 h-4 w-4 border-slate-300"
                    />
                    <div className="flex h-6 w-6 items-center justify-center rounded bg-slate-100 text-slate-500 border border-slate-200">
                      {d.icon}
                    </div>
                    <span className="text-xs">{d.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Section 4: Advanced settings collapsible */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 pl-6.5"
              >
                <span>≡ Advanced Settings</span>
                <span className="text-[10px] text-slate-400">({showAdvanced ? 'Hide Optional ▾' : 'Show Optional ▾'})</span>
              </button>

              {showAdvanced && (
                <div className="pl-6.5 mt-3 space-y-4 pt-3 border-t border-slate-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Timeout (seconds)</label>
                      <input type="number" defaultValue="60" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Retry Count</label>
                      <input type="number" defaultValue="2" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions Row */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100 pl-6.5">
              <button
                type="button"
                onClick={() => setViewState('list')}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                ✕ Cancel
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50"
                >
                  ⌃ Save as Draft
                </button>
                <button
                  type="button"
                  className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 flex items-center gap-1"
                >
                  <Calendar className="h-4.5 w-4.5 text-slate-400" />
                  <span>📅 Schedule Run</span>
                </button>
                <button
                  type="submit"
                  disabled={isExecuting}
                  className="rounded-xl bg-indigo-600 text-white px-6 py-2.5 text-xs font-bold hover:bg-indigo-700 shadow-md flex items-center gap-1.5 disabled:opacity-75"
                >
                  <Play className="h-4 w-4 fill-white" />
                  <span>{isExecuting ? 'Executing...' : '▶ Run Now'}</span>
                </button>
              </div>
            </div>
          </form>

          {/* Right Panel: Info Sidebar */}
          <div className="w-full lg:w-96 space-y-6 shrink-0">
            {/* Same AI Assistant Sidebar for branding & visual consistency */}
            <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-sm">
                  ✢
                </div>
                <div>
                  <h4 className="text-xs font-bold">AI Test Case Assistant</h4>
                  <p className="text-[10px] text-slate-500 font-mono">Powered by Omaha Intelligence Engine v2.4</p>
                </div>
              </div>

              <button
                type="button"
                className="w-full flex items-center justify-center gap-1.5 bg-slate-800 text-slate-400 cursor-not-allowed rounded-xl py-2.5 text-xs font-bold"
                disabled
              >
                <Sparkles className="h-4 w-4" />
                <span>Generate Test Steps</span>
              </button>

              <div className="border-t border-slate-800/80 pt-3 space-y-2.5">
                <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">AI Capabilities</h5>
                <div className="grid grid-cols-1 gap-2.5 text-xxs font-semibold text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-400">★</span> Generate sequence with AI
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-400">★</span> Personalize automation flow
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-400">★</span> Suggest edge cases
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-400">★</span> Generate assertions
                  </div>
                </div>
              </div>
            </div>

            {/* Risk & Automation */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-md space-y-4 text-xs">
              <div className="space-y-1.5">
                <span className="text-xxs font-bold text-slate-400 uppercase tracking-wider block">Risk Analysis</span>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <span className="text-amber-500 font-bold">▲</span> Medium Risk
                  </span>
                  <span className="text-xxs text-slate-400">Based on coverage & complexity</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full" style={{ width: '55%' }} />
                </div>
              </div>

              <div className="space-y-1.5 pt-3 border-t border-slate-100">
                <span className="text-xxs font-bold text-slate-400 uppercase tracking-wider block">Automation Feasibility</span>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-600">82% Automatable</span>
                  <span className="text-xxs text-slate-400">High feasibility detected</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full" style={{ width: '82%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
