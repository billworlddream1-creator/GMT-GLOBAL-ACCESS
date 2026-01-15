
import React, { useState } from 'react';
import { GlassCard } from '../GlassCard';
// Removed non-existent export getGlobalIntel to resolve compilation error
import { analyzeQuery } from '../../services/geminiService';
import { Search, Database, Globe, Lock, Terminal } from 'lucide-react';

export const IntelAnalysis: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'GENERAL' | 'DEEP_SCAN' | 'VULNERABILITY'>('GENERAL');

  const handleScan = async () => {
    if (!query) return;
    setLoading(true);
    setResult('');
    
    let prompt = query;
    if (mode === 'DEEP_SCAN') {
      prompt = `Deep Scan Request: Extract detailed hidden information and context regarding: ${query}. Focus on obscure details.`;
    } else if (mode === 'VULNERABILITY') {
      prompt = `Vulnerability Assessment: Analyze the following system/concept for potential weaknesses, bridges, and security flaws: ${query}. Do not provide actionable exploit code, but provide a theoretical security audit.`;
    }

    const data = await analyzeQuery(prompt);
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <GlassCard className="col-span-2 min-h-[500px]" title="Neural Query Interface">
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <button 
                onClick={() => setMode('GENERAL')}
                className={`flex-1 rounded-lg border px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all
                ${mode === 'GENERAL' ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400' : 'border-white/10 bg-white/5 text-gray-400'}`}
              >
                General Intel
              </button>
              <button 
                onClick={() => setMode('DEEP_SCAN')}
                className={`flex-1 rounded-lg border px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all
                ${mode === 'DEEP_SCAN' ? 'border-amber-500 bg-amber-500/20 text-amber-400' : 'border-white/10 bg-white/5 text-gray-400'}`}
              >
                Deep Extraction
              </button>
              <button 
                onClick={() => setMode('VULNERABILITY')}
                className={`flex-1 rounded-lg border px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all
                ${mode === 'VULNERABILITY' ? 'border-red-500 bg-red-500/20 text-red-400' : 'border-white/10 bg-white/5 text-gray-400'}`}
              >
                Vuln Scan
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ENTER TARGET PARAMETERS / DOMAIN / ENTITY..."
                className="w-full rounded-lg border border-white/20 bg-black/50 p-4 pl-12 font-mono text-emerald-400 placeholder-emerald-800/50 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                onKeyDown={(e) => e.key === 'Enter' && handleScan()}
              />
              <Search className="absolute left-4 top-4 h-5 w-5 text-emerald-600" />
            </div>

            <button
              onClick={handleScan}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 p-4 font-tech font-bold uppercase tracking-widest text-black hover:bg-emerald-500 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Database className="h-5 w-5 animate-spin" />
                  Extracting Data...
                </>
              ) : (
                <>
                  <Terminal className="h-5 w-5" />
                  Initiate Sequence
                </>
              )}
            </button>

            <div className="mt-4 flex-1 rounded-lg border border-white/10 bg-black/80 p-6 font-mono text-sm leading-relaxed text-gray-300 shadow-inner">
               {loading && (
                 <div className="space-y-2 animate-pulse">
                   <div className="h-2 w-3/4 rounded bg-emerald-900/50"></div>
                   <div className="h-2 w-1/2 rounded bg-emerald-900/50"></div>
                   <div className="h-2 w-full rounded bg-emerald-900/50"></div>
                 </div>
               )}
               {!loading && !result && <div className="text-center text-gray-600">Awaiting Input...</div>}
               {!loading && result && (
                 <div className="whitespace-pre-wrap">{result}</div>
               )}
            </div>
          </div>
        </GlassCard>

        <div className="space-y-6">
          <GlassCard title="Target Metrics">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-xs text-gray-400">ENCRYPTION</span>
                <span className="font-mono text-emerald-400">AES-256</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-xs text-gray-400">PROXY CHAIN</span>
                <span className="font-mono text-emerald-400">ACTIVE (3 NODES)</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-xs text-gray-400">ANONYMITY</span>
                <span className="font-mono text-emerald-400">98.4%</span>
              </div>
            </div>
          </GlassCard>

          <GlassCard title="Active Protocols">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col items-center justify-center rounded-lg bg-white/5 p-4 text-center">
                <Globe className="mb-2 h-6 w-6 text-blue-400" />
                <span className="text-[10px] font-bold text-gray-300">OSINT</span>
              </div>
              <div className="flex flex-col items-center justify-center rounded-lg bg-white/5 p-4 text-center">
                <Lock className="mb-2 h-6 w-6 text-emerald-400" />
                <span className="text-[10px] font-bold text-gray-300">SECURE</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
