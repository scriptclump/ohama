import React, { useState, useEffect } from 'react';
import { 
  Search, ChevronRight, Play, 
  Plus, ArrowLeft, 
  Trash2, Save, RefreshCw
} from 'lucide-react';
import Editor from '@monaco-editor/react';
import { useTestCases } from '../hooks/useTestCases';
import { useTestRuns } from '../hooks/useTestRuns';
import { useDevices } from '../hooks/useDevices';
import { useSearchParams } from 'react-router-dom';
import { TestCase } from '../api/types';

const defaultSpecCode = `// Omaha Playwright Test Specification
const { chromium } = require('playwright');

(async () => {
  console.log('Initiating headload test...');
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('https://example.com');
  const title = await page.title();
  console.log('Success! Page title is:', title);
  
  await browser.close();
})();`;

export const TestCasesView: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { tests, loading: testsLoading, createTest, deleteTest, refresh: refreshTests } = useTestCases();
  const { devices: emulationDevices } = useDevices();

  // Navigation View State: 'list' | 'create' | 'execute'
  const [viewState, setViewState] = useState<'list' | 'create' | 'execute'>('list');

  // Trigger Create View if query param ?action=new is set
  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      setViewState('create');
      // Clean up search params
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const [selectedCase, setSelectedCase] = useState<TestCase | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Set initial selected case when tests load
  useEffect(() => {
    if (tests.length > 0 && !selectedCase) {
      setSelectedCase(tests[0]);
    }
  }, [tests, selectedCase]);

  // Load runs for the selected test case
  const { runs: runHistory, executeRun, executing: isExecuting, refresh: refreshRuns } = useTestRuns(selectedCase?._id || '');

  // --- Create Test Case Form State ---
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newTargetUrl, setNewTargetUrl] = useState('https://example.com');
  const [newModule, setNewModule] = useState('Invoice posting');
  const [newSource, setNewSource] = useState<'manual' | 'codegen'>('manual');
  const [tags, setTags] = useState<string[]>(['regression', 'automation-ready']);
  const [tagInput, setTagInput] = useState('');
  const [specCode, setSpecCode] = useState(defaultSpecCode);
  const selectedBrowser = 'chromium';
  const selectedDevice = '';

  // --- Execute Test Case Form State ---
  const [execBrowser, setExecBrowser] = useState('chromium');
  const [execDevice, setExecDevice] = useState('');
  const [lastExecutedRun, setLastExecutedRun] = useState<any>(null);

  // Set default form values when editing/selecting
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (t: string) => {
    setTags(tags.filter((x) => x !== t));
  };

  // Submit and create
  const handleSaveTestCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    try {
      const payload: Partial<TestCase> = {
        name: newName,
        description: newDesc,
        targetUrl: newTargetUrl,
        specCode: specCode,
        module: newModule,
        source: newSource,
        tags: tags,
        defaultEmulation: {
          browser: selectedBrowser,
          device: selectedDevice || undefined
        }
      };

      const newTC = await createTest(payload);
      setSelectedCase(newTC);
      setViewState('list');
      
      // Reset Form
      setNewName('');
      setNewDesc('');
      setNewTargetUrl('https://example.com');
      setSpecCode(defaultSpecCode);
      setTags(['regression', 'automation-ready']);
    } catch (err) {
      console.error(err);
    }
  };

  // Run suite execution
  const handleTriggerRun = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase) return;

    try {
      const emulation = {
        browser: execBrowser,
        device: execDevice || undefined
      };
      const result = await executeRun(emulation);
      setLastExecutedRun(result);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredCases = tests.filter((tc) => {
    const matchesSearch = tc.name.toLowerCase().includes(searchQuery.toLowerCase()) || tc._id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="flex-1 w-full text-left font-sans animate-fadeIn">
      {/* 1. CATALOG LIST VIEW */}
      {viewState === 'list' && (
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Left Panel: List & Table */}
          <div className="flex-1 w-full space-y-4">
            {/* Breadcrumb & Actions Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-xxs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <span>Dashboard</span>
                  <ChevronRight className="h-3 w-3" />
                  <span className="text-indigo-600">Test Cases</span>
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Test Catalog</h2>
                  <span className="text-sm font-bold text-slate-400">- {tests.length} cases</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Drill into a case to see execution logs, live specs, and run history.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={refreshTests}
                  className="flex items-center gap-1.5 border border-slate-200 bg-white rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <RefreshCw className="h-3.5 w-3.5 text-slate-500" />
                  <span>Refresh</span>
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
                    placeholder="Search test cases..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 bg-slate-50/50"
                  />
                </div>
              </div>

              <div className="text-xxs font-bold text-slate-400 uppercase tracking-wider">
                Showing {filteredCases.length} of {tests.length}
              </div>
            </div>

            {/* Datatable */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              {testsLoading ? (
                <div className="p-12 text-center text-xs text-slate-500 font-semibold">
                  <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-indigo-600" />
                  Loading test cases...
                </div>
              ) : filteredCases.length === 0 ? (
                <div className="p-12 text-center text-xs text-slate-400">
                  No test cases found. Click "New test case" to create one.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                        <th className="py-3 px-4 w-10">
                          <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5 border-slate-300" defaultChecked />
                        </th>
                        <th className="py-3 px-4">NAME</th>
                        <th className="py-3 px-4">MODULE</th>
                        <th className="py-3 px-4">SOURCE</th>
                        <th className="py-3 px-4">CREATED</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                      {filteredCases.map((tc) => {
                        const isSelected = selectedCase?._id === tc._id;
                        return (
                          <tr
                            key={tc._id}
                            onClick={() => setSelectedCase(tc)}
                            className={`cursor-pointer transition-colors ${
                              isSelected ? 'bg-indigo-50/60 hover:bg-indigo-50' : 'hover:bg-slate-50/50'
                            }`}
                          >
                            <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                              <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5 border-slate-300" defaultChecked />
                            </td>
                            <td className={`py-3.5 px-4 font-bold text-slate-800 ${isSelected ? 'text-indigo-900' : ''}`}>
                              <div className="font-bold text-slate-900">{tc.name}</div>
                              <div className="text-[10px] font-mono text-slate-400 mt-0.5">{tc._id}</div>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-bold uppercase px-2 py-0.5 rounded">
                                {tc.module || 'General'}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded text-[10px] font-semibold text-slate-500">
                                {tc.source === 'codegen' ? '⚙ codegen' : '✋ manual'}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-semibold text-slate-400">{new Date(tc.createdAt).toLocaleDateString()}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel: Side Detail Drawer Panel */}
          {selectedCase && (
            <div className="w-full lg:w-96 bg-white border border-slate-200 rounded-2xl p-5 shadow-lg space-y-5 sticky top-20">
              <div className="space-y-2 pb-4 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold font-mono text-slate-400">DETAIL</span>
                  <span className="rounded bg-indigo-50 border border-indigo-100 text-indigo-600 text-xxs font-bold px-2 py-0.5 uppercase">
                    {selectedCase.source}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-800 tracking-tight leading-snug">
                  {selectedCase.name}
                </h3>

                <p className="text-xs text-slate-500 leading-relaxed">
                  {selectedCase.description || 'No description provided.'}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-2">
                  {selectedCase.tags?.map((tag) => (
                    <span key={tag} className="rounded bg-indigo-50/50 border border-indigo-100/50 text-indigo-500 text-[10px] font-semibold px-2 py-0.5">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pb-2">
                <button 
                  onClick={() => setViewState('execute')}
                  className="flex items-center justify-center gap-1.5 bg-indigo-600 text-white rounded-lg py-2 text-xs font-bold shadow hover:bg-indigo-700"
                >
                  <Play className="h-3.5 w-3.5 fill-white" />
                  <span>Execute test</span>
                </button>
                <button 
                  onClick={async () => {
                    if (confirm('Are you sure you want to delete this test case?')) {
                      await deleteTest(selectedCase._id);
                      setSelectedCase(null);
                    }
                  }}
                  className="flex items-center justify-center gap-1.5 border border-rose-200 rounded-lg py-2 text-xs font-bold text-rose-600 hover:bg-rose-50"
                >
                  <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                  <span>Delete</span>
                </button>
              </div>

              {/* Spec Code Panel */}
              <div className="space-y-2">
                <h4 className="text-xxs font-bold text-slate-400 uppercase tracking-widest">Spec Code Script</h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-950 p-3 text-3xs font-mono text-slate-300 max-h-48 overflow-y-auto">
                  <pre className="whitespace-pre-wrap">{selectedCase.specCode}</pre>
                </div>
              </div>

              {/* Run History list */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-xxs font-bold uppercase tracking-widest text-slate-400">
                  <span>Execution History</span>
                  <button onClick={refreshRuns} className="hover:text-indigo-600">
                    <RefreshCw className="h-3 w-3" />
                  </button>
                </div>

                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {runHistory.length === 0 ? (
                    <div className="text-center py-4 text-xxs text-slate-400">No executions logged yet</div>
                  ) : (
                    runHistory.map((run) => (
                      <div key={run._id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-xxs">
                        <div className="flex items-center gap-2">
                          <span className={`h-2 w-2 rounded-full ${
                            run.status === 'passed' ? 'bg-emerald-500' : 'bg-rose-500'
                          }`} />
                          <span className="font-semibold text-slate-700 uppercase">{run.status}</span>
                        </div>
                        <span className="text-slate-400 font-mono">{(run.durationMs / 1000).toFixed(2)}s</span>
                        <span className="text-slate-400">{new Date(run.startedAt).toLocaleDateString()}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
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
                <span>‹ Back to Catalog</span>
              </button>
              <div className="flex items-baseline gap-2">
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Create Test Case</h2>
                <span className="rounded bg-indigo-50 border border-indigo-100 text-indigo-600 px-2 py-0.5 text-xxs font-bold uppercase">
                  Draft
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Define a new automation spec script and save to the database.
              </p>
            </div>

            {/* Section 1: Core Details */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1.5">
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Target URL</label>
                  <input
                    type="text"
                    value={newTargetUrl}
                    onChange={(e) => setNewTargetUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-slate-50/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Description</label>
                  <textarea
                    rows={3}
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Add a detailed description of what this test case validates..."
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-slate-50/30"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Classification & Environment */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-50 text-xxs font-bold text-indigo-600">2</span>
                <span>Classification & Environment</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Test Case Source</label>
                  <select
                    value={newSource}
                    onChange={(e) => setNewSource(e.target.value as any)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  >
                    <option value="manual">✋ Manual Script</option>
                    <option value="codegen">⚙ Codegen Automated</option>
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
                    <option value="ERP">ERP</option>
                    <option value="Auth">Auth</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3: Monaco Code Editor */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-50 text-xxs font-bold text-indigo-600">3</span>
                <span>Playwright Spec Script Code</span>
              </h3>

              <div className="pl-6.5 space-y-2">
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm h-64">
                  <Editor
                    height="100%"
                    defaultLanguage="javascript"
                    theme="vs-dark"
                    value={specCode}
                    onChange={(value) => setSpecCode(value || '')}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 12,
                      scrollBeyondLastLine: false,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Tags & Labels */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-50 text-xxs font-bold text-indigo-600">4</span>
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

            {/* Bottom Actions Row */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100 pl-6.5">
              <button
                type="button"
                onClick={() => setViewState('list')}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                ✕ Cancel
              </button>

              <button
                type="submit"
                className="rounded-xl bg-indigo-650 text-white px-5 py-2 text-xs font-bold hover:bg-indigo-750 shadow-md flex items-center gap-1.5"
              >
                <Save className="h-4 w-4" />
                <span>✓ Save Spec Script</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. EXECUTE TEST CASE VIEW */}
      {viewState === 'execute' && selectedCase && (
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
                <span>‹ Back to Catalog</span>
              </button>
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Execute Automation Script</h2>
              <p className="text-xs text-slate-500">
                Trigger execution in the backend headless browser.
              </p>
            </div>

            {/* Test Case Metadata Block */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-semibold">
              <div>
                <span className="text-xxs font-bold text-slate-400 uppercase block tracking-wider">Test Case</span>
                <span className="text-sm font-extrabold text-slate-800 mt-1 block">{selectedCase.name}</span>
                <span className="text-xxs text-slate-400 font-medium block mt-0.5">{selectedCase._id} · {selectedCase.source}</span>
              </div>
            </div>

            {/* Emulation parameters */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-indigo-650 uppercase tracking-widest flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-50 text-xxs font-bold text-indigo-600">1</span>
                <span>Select Browser & Device Emulation</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Browser Emulation</label>
                  <select
                    value={execBrowser}
                    onChange={(e) => setExecBrowser(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  >
                    <option value="chromium">Chromium (default)</option>
                    <option value="firefox">Firefox</option>
                    <option value="webkit">WebKit (Safari engine)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Device Preset (optional)</label>
                  <select
                    value={execDevice}
                    onChange={(e) => setExecDevice(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  >
                    <option value="">No device emulation (standard Desktop)</option>
                    {emulationDevices.map((dev) => (
                      <option key={dev} value={dev}>{dev}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Live Terminal Terminal Output */}
            {isExecuting && (
              <div className="space-y-2 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider pl-6.5">Execution Status</h4>
                <div className="pl-6.5">
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 font-mono text-xs text-indigo-400 animate-pulse">
                    &gt; Executing script code on headless client container...
                    <br />
                    &gt; Please wait...
                  </div>
                </div>
              </div>
            )}

            {lastExecutedRun && !isExecuting && (
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider pl-6.5">Execution Result</h4>
                <div className="pl-6.5 space-y-3">
                  <div className={`p-4 rounded-xl border flex items-center justify-between ${
                    lastExecutedRun.status === 'passed' 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                      : 'bg-rose-50 border-rose-200 text-rose-800'
                  }`}>
                    <div className="text-xs font-bold">
                      Run Finished: {lastExecutedRun.status.toUpperCase()}
                      {lastExecutedRun.errorMessage && (
                        <div className="text-xxs font-normal mt-1 text-rose-600">{lastExecutedRun.errorMessage}</div>
                      )}
                    </div>
                    <span className="text-xs font-mono">{(lastExecutedRun.durationMs / 1000).toFixed(2)}s</span>
                  </div>

                  {/* Standard output logs */}
                  <div className="space-y-1">
                    <span className="text-xxs font-bold text-slate-400 uppercase tracking-wider block">Terminal Logs (stdout)</span>
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-2xs text-slate-300 max-h-48 overflow-y-auto leading-relaxed">
                      {lastExecutedRun.stdout ? (
                        <pre className="whitespace-pre-wrap">{lastExecutedRun.stdout}</pre>
                      ) : (
                        <span className="text-slate-500">&lt; No stdout logs output &gt;</span>
                      )}
                      {lastExecutedRun.stderr && (
                        <pre className="text-rose-400 mt-2 whitespace-pre-wrap">{lastExecutedRun.stderr}</pre>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Actions Row */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100 pl-6.5">
              <button
                type="button"
                onClick={() => setViewState('list')}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                ✕ Cancel
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
          </form>
        </div>
      )}
    </div>
  );
};
