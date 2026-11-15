import React, { useState } from 'react';
import { Lock, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

interface PinGateProps {
  onUnlock: () => void;
  apiUnlock: (pin: string) => Promise<any>;
}

export const PinGate: React.FC<PinGateProps> = ({ onUnlock, apiUnlock }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin) return;

    setLoading(true);
    setError('');

    try {
      await apiUnlock(pin);
      onUnlock();
    } catch (err: any) {
      setError(err.message || 'Incorrect PIN');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-slate-100 select-none">
      <div className="w-full max-w-sm space-y-6 text-center">
        {/* Brand Icon */}
        <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500/20 to-cyan-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 font-mono text-xl font-bold shadow-lg shadow-teal-500/10">
          <Lock className="w-5 h-5 text-teal-400" />
        </div>

        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">FORGE OS</h1>
          <p className="text-xs text-slate-400 mt-1">Enter your personal access PIN to unlock</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="password"
              maxLength={8}
              placeholder="••••"
              value={pin}
              autoFocus
              onChange={(e) => {
                setPin(e.target.value);
                setError('');
              }}
              className="w-full bg-surface border border-border focus:border-teal-400 rounded-xl py-3 px-4 text-center text-xl tracking-widest text-white outline-none font-mono transition-colors"
            />
          </div>

          {error && (
            <div className="text-xs text-rose-400 flex items-center justify-center gap-1.5 font-mono">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !pin}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-slate-950 font-semibold text-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-teal-500/10"
          >
            <span>{loading ? 'Verifying...' : 'Unlock Workspace'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5 pt-4">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-500/60" />
          <span>1-Hour Secure Session · Private Personal OS</span>
        </div>
      </div>
    </div>
  );
};

