import React, { useState } from 'react';
import { Search, ChevronRight, Play, Edit, ExternalLink, Download, Plus, Check, X, ShieldAlert } from 'lucide-react';

interface TestCase {
  id: string;
  name: string;
  status: 'PASS' | 'FAIL' | 'SKIP';
  type: 'auto' | 'manual';
  owner: string;
  runtime: string;
  lastRun: string;
  steps: { text: string; passed: boolean; error?: string }[];
  tags: string[];
  priority: 'high' | 'medium' | 'low';
  defect?: string;
  createdBy: string;
  createdDate: string;
  history: ('pass' | 'fail' | 'flaky')[];
}

export const TestCasesView: React.FC = () => {
  const testCasesData: TestCase[] = [
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
      tags: ['#erp', '#invoice', '#fx'],
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
      tags: ['#erp', '#invoice', '#happy'],
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
      tags: ['#erp', '#tax'],
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
      tags: ['#erp', '#invoice', '#validation'],
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
      tags: ['#erp', '#invoice'],
      steps: [
        { text: 'Select posted invoice', passed: true },
        { text: 'Click Void Invoice', passed: true },
        { text: 'Verify status changes to Void', passed: true },
        { text: 'Verify Reissue action creates cloned copy', passed: true }
      ],
      history: ['pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass']
    },
    {
      id: 'TC-00407',
      name: 'Invoice — attachment upload (>10MB)',
      status: 'FAIL',
      type: 'manual',
      owner: 'J. Diaz',
      runtime: '—',
      lastRun: '3d ago',
      priority: 'low',
      defect: 'D-3211',
      createdBy: 'J. Diaz',
      createdDate: 'Dec 18',
      tags: ['#erp', '#upload'],
      steps: [
        { text: 'Open Invoice attachment tab', passed: true },
        { text: 'Drag file of size 12MB', passed: true },
        { text: 'Verify 413 Payload Too Large is returned', passed: false, error: 'Expected client-side block, but file uploaded completely and crashed JVM' }
      ],
      history: ['fail', 'fail', 'pass', 'pass', 'pass', 'pass', 'pass', 'fail', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'fail']
    },
    {
      id: 'TC-00406',
      name: 'Invoice — payment terms lookup',
      status: 'PASS',
      type: 'auto',
      owner: 'L. Park',
      runtime: '00:27',
      lastRun: '2h ago',
      priority: 'low',
      createdBy: 'L. Park',
      createdDate: 'Dec 15',
      tags: ['#erp', '#terms'],
      steps: [
        { text: 'Open vendor lookup', passed: true },
        { text: 'Select vendor with Net-30', passed: true },
        { text: 'Verify invoice due date is exact 30 days ahead', passed: true }
      ],
      history: ['pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass']
    },
    {
      id: 'TC-00405',
      name: 'Invoice — bulk import CSV',
      status: 'PASS',
      type: 'auto',
      owner: 'R. Mehta',
      runtime: '01:14',
      lastRun: '2h ago',
      priority: 'high',
      createdBy: 'R. Mehta',
      createdDate: 'Dec 10',
      tags: ['#erp', '#import'],
      steps: [
        { text: 'Upload valid csv containing 50 entries', passed: true },
        { text: 'Verify import log shows 50 successes', passed: true },
        { text: 'Verify 50 drafts created in database', passed: true }
      ],
      history: ['pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass']
    },
    {
      id: 'TC-00404',
      name: 'Invoice — approval workflow escalation',
      status: 'FAIL',
      type: 'auto',
      owner: 'A. Khan',
      runtime: '02:05',
      lastRun: '2h ago',
      priority: 'high',
      defect: 'D-3522',
      createdBy: 'A. Khan',
      createdDate: 'Dec 05',
      tags: ['#erp', '#escalation', '#workflow'],
      steps: [
        { text: 'Submit invoice of value $50,000', passed: true },
        { text: 'Wait for 24 hour SLA threshold', passed: true },
        { text: 'Verify ticket automatically escalates to VP', passed: false, error: 'Escalation job failed to trigger. Ticket stuck in pending state.' }
      ],
      history: ['pass', 'pass', 'pass', 'fail', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'fail', 'pass', 'pass', 'pass', 'pass', 'pass', 'fail']
    }
  ];

  const testCases = testCasesData;
  const [selectedCase, setSelectedCase] = useState<TestCase>(testCasesData[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Any');

  const filteredCases = testCases.filter((tc) => {
    const matchesSearch = tc.name.toLowerCase().includes(searchQuery.toLowerCase()) || tc.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'Any' || tc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex-1 flex flex-col lg:flex-row gap-6 text-left font-sans items-start">
      
      {/* Left Panel: Test Cases List & Catalog Table */}
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
              <span className="text-sm font-bold text-slate-400">- 48</span>
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
            <button className="flex items-center gap-1 border border-slate-200 bg-white rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
              <Play className="h-3.5 w-3.5 text-slate-500 fill-slate-500" />
              <span>Run selected</span>
            </button>
            <button className="flex items-center gap-1 bg-indigo-600 text-white rounded-lg px-3.5 py-1.5 text-xs font-semibold hover:bg-indigo-700 shadow-sm">
              <Plus className="h-3.5 w-3.5" />
              <span>New test case</span>
            </button>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3 shadow-sm">
          <div className="flex flex-wrap items-center gap-2.5 flex-1">
            {/* Search Input */}
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

            {/* Status Dropdown */}
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

            {/* Selects placeholders matching design */}
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
        {/* Header Block */}
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
              {selectedCase.status === 'PASS' ? '× FAIL' : selectedCase.status === 'FAIL' ? '× FAIL' : '— SKIP'}
            </span>
          </div>

          <h3 className="text-base font-bold text-slate-800 tracking-tight leading-snug">
            {selectedCase.name}
          </h3>

          {/* Tags */}
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
            <span className="rounded bg-slate-50 border border-slate-200 text-slate-500 text-[10px] font-bold px-2 py-0.5 uppercase tracking-wide">
              env: staging
            </span>
            {selectedCase.tags.map((tag) => (
              <span key={tag} className="rounded bg-indigo-50/50 border border-indigo-100/50 text-indigo-500 text-[10px] font-semibold px-2 py-0.5">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="grid grid-cols-3 gap-2 pb-2">
          <button className="flex items-center justify-center gap-1.5 bg-indigo-600 text-white rounded-lg py-2 text-xs font-bold shadow hover:bg-indigo-700">
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

        {/* Metadata Details Grid */}
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

        {/* Steps checklist */}
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

        {/* Run History Section */}
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
  );
};
