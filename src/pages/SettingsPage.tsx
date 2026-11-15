import React, { useState, useEffect } from 'react';
import { localStore } from '@/services/localStore';
import { UserProfile } from '@/types';
import { Settings, Download, ShieldCheck, Database } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [exportJson, setExportJson] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      const p = await localStore.getProfile();
      setProfile(p);
    }
    loadProfile();
  }, []);

  const handleExport = async () => {
    const data = await localStore.exportAllData();
    const str = JSON.stringify(data, null, 2);
    setExportJson(str);

    // Trigger download
    const blob = new Blob([str], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `forge-os-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(exportJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!profile) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider">
          <Settings className="w-4 h-4" />
          <span>System Configuration & Data Sovereignty</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
          Settings & Local Sync
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Your learning journey is stored locally in high-performance IndexedDB. You can export a complete JSON snapshot at any time with zero vendor lock-in.
        </p>
      </div>

      {/* Profile Info */}
      <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Engineering Profile Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block font-mono text-[11px]">Full Name</span>
            <span className="text-white font-medium">{profile.fullName}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-mono text-[11px]">Degree & University</span>
            <span className="text-white font-medium">{profile.degree}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-mono text-[11px]">Academic Horizon</span>
            <span className="text-white font-medium">Year {profile.currentYear}, Semester {profile.currentSemester}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-mono text-[11px]">Connected GitHub</span>
            <span className="text-emerald-400 font-mono">@{profile.githubUsername}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-mono text-[11px]">Program Start Date</span>
            <span className="text-white font-mono">{profile.roadmapStartDate} (Asia/Kolkata)</span>
          </div>
          <div>
            <span className="text-slate-400 block font-mono text-[11px]">Daily Extracurricular Budget</span>
            <span className="text-white font-mono">{profile.dailyStudyHours} Hours / Day</span>
          </div>
        </div>
      </div>

      {/* Storage & Export Engine */}
      <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Database className="w-4 h-4 text-blue-400" />
          Data Portability & Full JSON Backup
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Export your entire 18-month history, including solved DSA problems, revision queues, engineering journal entries, and custom academic progress.
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-semibold text-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Complete JSON Backup
          </button>
        </div>

        {exportJson && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono">Preview JSON Payload:</span>
              <button
                onClick={handleCopy}
                className="text-emerald-400 hover:underline font-mono"
              >
                {copied ? 'Copied to Clipboard!' : 'Copy to Clipboard'}
              </button>
            </div>
            <pre className="p-3 bg-background border border-border rounded-lg text-[10px] font-mono text-slate-300 max-h-48 overflow-y-auto">
              {exportJson}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
