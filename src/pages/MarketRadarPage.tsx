import React, { useState, useEffect } from 'react';
import { localStore } from '@/services/localStore';
import { MarketIntelligenceItem } from '@/types';
import { Compass, ExternalLink, ShieldCheck, AlertCircle, Filter } from 'lucide-react';
import { clsx } from 'clsx';
import { formatShortISTDate } from '@/lib/date-utils';

export const MarketRadarPage: React.FC = () => {
  const [items, setItems] = useState<MarketIntelligenceItem[]>([]);
  const [filterVerifiedOnly, setFilterVerifiedOnly] = useState(false);

  useEffect(() => {
    async function loadData() {
      const data = await localStore.getMarketIntelligence();
      setItems(data);
    }
    loadData();
  }, []);

  const displayedItems = filterVerifiedOnly ? items.filter(i => i.isVerifiedPublicData) : items;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider">
            <Compass className="w-4 h-4" />
            <span>Verified Source Registry & Hiring Telemetry</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Market Intelligence Radar
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Grounded market data with verifiable public sources. We strictly differentiate empirical job datasets from employer survey intent.
          </p>
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setFilterVerifiedOnly(!filterVerifiedOnly)}
          className={clsx(
            'flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono transition-colors shrink-0 border',
            filterVerifiedOnly
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 font-semibold'
              : 'bg-surface border-border text-slate-400 hover:text-white'
          )}
        >
          <Filter className="w-3.5 h-3.5" />
          <span>Verified Datasets Only</span>
        </button>
      </div>

      {/* Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {displayedItems.map((item) => (
          <div
            key={item.id}
            className="bg-surface border border-border rounded-xl p-5 space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase bg-background px-2 py-0.5 rounded border border-border text-slate-400">
                      {item.geography}
                    </span>
                    {item.isVerifiedPublicData ? (
                      <span className="text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1 font-semibold">
                        <ShieldCheck className="w-3 h-3" />
                        Verified Data
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono uppercase bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/30 flex items-center gap-1 font-semibold">
                        <AlertCircle className="w-3 h-3" />
                        Survey Intent
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-white mt-1.5 flex items-center gap-1.5">
                    {item.sourceName}
                  </h3>
                </div>

                <a
                  href={item.originalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg bg-background border border-border text-slate-400 hover:text-emerald-400 transition-colors"
                  title="Visit Original Publication"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Stat Highlight Box */}
              <div className="p-3 bg-background border border-border rounded-lg">
                <div className="text-[10px] text-muted font-mono uppercase">Key Data Signal</div>
                <div className="text-xs font-semibold text-emerald-300 font-mono mt-0.5">
                  {item.keyStat}
                </div>
              </div>

              <div className="text-xs text-slate-300 leading-relaxed">
                {item.supportedConclusion}
              </div>

              <div className="text-[11px] text-slate-400 bg-background/50 p-2.5 rounded-lg border border-border/60">
                <span className="text-slate-500 font-semibold">Methodology: </span>
                {item.methodology}
              </div>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>Published: {item.publicationDate}</span>
              <span>Verified: {formatShortISTDate(item.lastVerifiedDate)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

