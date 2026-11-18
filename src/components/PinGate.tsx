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
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center p-6 text-ink select-none font-mono">
      <div className="w-full max-w-sm space-y-6 text-center bg-surface border-2 border-border p-8 rounded-3xl shadow-crisp-lg">
        {/* Black logo with zinc-200 outline and shadow */}
        <div className="mx-auto w-16 h-16 rounded-2xl p-1 overflow-hidden border-t-2 border-zinc-700 flex items-center justify-center text-[#E8D2B5] dark:text-zinc-100 font-bold text-2xl shadow-crisp">
          <img src="/public/Icon.png" alt='icon' />
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold tracking-widest text-ink uppercase">
            FORGE OS
          </h1>
          <p className="text-xs text-ink-muted font-bold tracking-wide">
            ENTER PERSONAL PIN TO UNLOCK
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
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
              className="w-full bg-surface-bright border-2 border-border focus:border-accent rounded-2xl py-3.5 px-4 text-center text-2xl tracking-widest text-ink outline-none font-extrabold transition-all shadow-crisp-sm"
            />
          </div>

          {error && (
            <div className="text-xs text-red-600 flex items-center justify-center gap-1.5 font-bold tracking-wide">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !pin}
            className="w-full py-3.5 rounded-2xl bg-accent hover:bg-accent-hover text-white font-extrabold text-xs uppercase tracking-widest border-2 border-border shadow-crisp hover:shadow-crisp-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{loading ? 'VERIFYING...' : 'UNLOCK WORKSPACE'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-[11px] text-ink-muted flex items-center justify-center gap-1.5 pt-2 font-bold tracking-wide">
          <ShieldCheck className="w-4 h-4 text-accent" />
          <span>1-HOUR SECURE SESSION · PRIVATE OS</span>
        </div>
      </div>
    </div>
  );
};
