import React, { useState } from 'react';
import { Mail, Lock, ShieldCheck, Cpu, Database, Globe } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('test@email.com');
  const [password, setPassword] = useState('password123');
  const [keepSigned, setKeepSigned] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    // Simulate successful login
    onLoginSuccess();
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-[calc(100vh-3.5rem)] bg-slate-50 font-sans">
      {/* Left Panel: Branding & Platform Statistics */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white flex flex-col justify-between p-8 lg:p-12 relative overflow-hidden border-r border-slate-800">
        {/* Decorative Grid and Glow */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

        {/* Top Branding Logo & Pill */}
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3">
            {/* Logo Icon */}
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-500/20 font-bold text-xl">
              ✢
            </div>
            <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Omaha
            </span>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-950/60 px-3 py-1 text-xxs font-semibold tracking-wider text-indigo-300 uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Upstream Testing Platform
          </div>
        </div>

        {/* Hero Copy */}
        <div className="relative z-10 my-12 md:my-auto max-w-md">
          <h2 className="text-3xl font-extrabold tracking-tight leading-tight lg:text-4xl text-white">
            Go upstream. <br />
            <span className="bg-gradient-to-r from-indigo-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Ship with confidence.
            </span>
          </h2>
          <p className="mt-4 text-sm text-slate-400 leading-relaxed">
            One workspace for every test case, run, and defect across your modules — from unit to e2e, manual to fully automated.
          </p>
        </div>

        {/* Bottom Panel: Statistics Grid */}
        <div className="relative z-10 space-y-6">
          <div className="grid grid-cols-3 gap-4 border-t border-slate-800 pt-6">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold tracking-wide uppercase">
                <Database className="h-3.5 w-3.5 text-indigo-400" />
                Runs
              </div>
              <div className="text-xl font-bold text-white tracking-tight">14k+</div>
              <div className="text-xxs text-slate-500 font-medium">daily executions</div>
            </div>

            <div className="space-y-1 border-l border-slate-800 pl-4">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold tracking-wide uppercase">
                <Cpu className="h-3.5 w-3.5 text-emerald-400" />
                Auto
              </div>
              <div className="text-xl font-bold text-white tracking-tight">68%</div>
              <div className="text-xxs text-slate-500 font-medium">automation rate</div>
            </div>

            <div className="space-y-1 border-l border-slate-800 pl-4">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold tracking-wide uppercase">
                <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
                Security
              </div>
              <div className="text-xl font-bold text-white tracking-tight">SOC 2</div>
              <div className="text-xxs text-slate-500 font-medium">Type II Certified</div>
            </div>
          </div>

          <div className="text-xxs text-slate-600 tracking-wider uppercase font-semibold">
            © 2026 Omaha Technologies · v3.2.1
          </div>
        </div>
      </div>

      {/* Right Panel: Sign In Form Container */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 p-8 shadow-xl shadow-slate-100/50">
          <div className="text-left space-y-1.5">
            <span className="text-xxs font-bold uppercase tracking-widest text-indigo-600">
              Sign In
            </span>
            <h3 className="text-2xl font-bold tracking-tight text-slate-900">
              Welcome back
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Use your work email or continue with SSO.
            </p>
          </div>

          {error && (
            <div className="mt-4 rounded-lg bg-rose-50 border border-rose-100 p-3 text-xs text-rose-600 font-medium">
              {error}
            </div>
          )}

          {/* SSO Buttons Grid */}
          <div className="mt-6 space-y-2.5">
            {/* SAML SSO */}
            <button
              type="button"
              onClick={onLoginSuccess}
              className="flex items-center justify-center gap-3 w-full border border-slate-200 rounded-xl py-3 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all duration-150 shadow-sm"
            >
              <div className="flex h-5 w-5 items-center justify-center rounded bg-indigo-600 text-xxs font-extrabold text-white">
                S
              </div>
              <span>Continue with SAML SSO</span>
            </button>

            {/* Google Workspace */}
            <button
              type="button"
              onClick={onLoginSuccess}
              className="flex items-center justify-center gap-3 w-full border border-slate-200 rounded-xl py-3 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all duration-150 shadow-sm"
            >
              <Globe className="h-4.5 w-4.5 text-rose-500" />
              <span>Continue with Google Workspace</span>
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-slate-200" />
            <span className="px-3 text-xxs text-slate-400 uppercase font-bold tracking-widest">
              or
            </span>
            <div className="flex-1 border-t border-slate-200" />
          </div>

          {/* Credentials Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1.5 block">
                Work email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Mail className="h-4.5 w-4.5" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all bg-slate-50/50"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  Password
                </label>
                <a
                  href="#forgot"
                  onClick={() => setError('Reset password flow initiated. Check email inbox.')}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Lock className="h-4.5 w-4.5" />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all bg-slate-50/50"
                  required
                />
              </div>
            </div>

            {/* Checkbox */}
            <div className="flex items-center">
              <input
                id="keep-signed"
                type="checkbox"
                checked={keepSigned}
                onChange={(e) => setKeepSigned(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="keep-signed" className="ml-2.5 text-xs font-medium text-slate-600 cursor-pointer select-none">
                Keep me signed in on this device
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white rounded-xl py-3 font-semibold text-sm shadow-lg shadow-indigo-600/20 hover:shadow-xl hover:shadow-indigo-600/30 transition-all flex items-center justify-center gap-1.5"
            >
              Sign in to Omaha →
            </button>
          </form>

          {/* Request Access Link */}
          <div className="mt-6 text-center">
            <a
              href="#request-access"
              onClick={() => setError('Access request form submitted to workspace admins.')}
              className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors"
            >
              New to Omaha? Request access →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
