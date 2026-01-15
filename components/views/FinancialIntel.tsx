import React, { useState } from 'react';
import { GlassCard } from '../GlassCard';
import { Search, Landmark, MapPin, Building2, Globe, FileText, Database, ShieldCheck, AlertCircle } from 'lucide-react';
import { queryFinancialIntel } from '../../services/geminiService';

export const FinancialIntel: React.FC = () => {
  const [accountNum, setAccountNum] = useState('');
  const [location, setLocation] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleExtract = async () => {
    if (!accountNum || !location) return;
    setLoading(true);
    const data = await queryFinancialIntel(accountNum, location);
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <GlassCard className="lg:col-span-1" title="Financial Recon Input">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Account Number / IBAN</label>
              <div className="relative">
                <input 
                  type="text"
                  value={accountNum}
                  onChange={(e) => setAccountNum(e.target.value)}
                  placeholder="EX: GB29 0000 0012 3456..."
                  className="w-full bg-black/50 border border-white/20 rounded-xl py-4 pl-12 pr-4 text-emerald-400 font-mono focus:border-emerald-500 focus:outline-none"
                />
                <Landmark className="absolute left-4 top-4 h-5 w-5 text-emerald-600" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Target Location (City/Country)</label>
              <div className="relative">
                <input 
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="EX: Zurich, Switzerland"
                  className="w-full bg-black/50 border border-white/20 rounded-xl py-4 pl-12 pr-4 text-emerald-400 font-mono focus:border-emerald-500 focus:outline-none"
                />
                <MapPin className="absolute left-4 top-4 h-5 w-5 text-emerald-600" />
              </div>
            </div>

            <button 
              onClick={handleExtract}
              disabled={loading || !accountNum || !location}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-black font-tech font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? <Database className="h-5 w-5 animate-spin" /> : <ShieldCheck className="h-5 w-5" />}
              {loading ? 'PENETRATING LEDGER...' : 'EXTRACT DEEP INTEL'}
            </button>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
              <div className="flex items-center gap-2 text-blue-400 mb-2">
                <Globe size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Network Node</span>
              </div>
              <p className="text-[10px] text-gray-500 leading-relaxed font-mono">
                CONNECTED TO SWIFT GATEWAY DELTA-4. <br/>
                LATENCY: 42ms <br/>
                ENCRYPTION: QUANTUM-RSA
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="lg:col-span-2 min-h-[500px]" title="Financial Dossier // EXTRACTION">
          <div className="h-full bg-black/50 border border-white/10 rounded-xl p-6 font-mono text-sm overflow-y-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full space-y-4">
                <div className="relative h-20 w-20">
                   <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20" />
                   <div className="absolute inset-0 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
                   <div className="absolute inset-0 flex items-center justify-center">
                      <Database className="text-emerald-500 h-8 w-8 animate-pulse" />
                   </div>
                </div>
                <span className="text-emerald-500 text-xs animate-pulse tracking-widest uppercase">Querying Central Banking Ledger...</span>
              </div>
            ) : result ? (
              <div className="whitespace-pre-wrap text-emerald-100/90 leading-relaxed prose prose-invert max-w-none">
                {result}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-700 space-y-4">
                <FileText size={64} className="opacity-10" />
                <p className="tracking-widest text-xs font-bold uppercase">Awaiting Bank Parameters for Extraction</p>
              </div>
            )}
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard title="Entity Risk Index">
             <div className="flex items-end gap-2">
                <span className="text-4xl font-black text-white">4.2</span>
                <span className="text-emerald-400 font-bold mb-1">STABLE</span>
             </div>
             <p className="text-[10px] text-gray-500 mt-2">Historical volatility indicates low likelihood of liquidity evasion.</p>
          </GlassCard>
          <GlassCard title="Node Security">
             <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-500/10 rounded-full">
                  <Building2 className="text-emerald-500 h-6 w-6" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">CENTRAL NODE</div>
                  <div className="text-[10px] text-gray-500">VERIFIED GATEWAY</div>
                </div>
             </div>
          </GlassCard>
          <GlassCard title="Anomaly Detection">
             <div className="flex items-center gap-3">
                <div className="p-3 bg-red-500/10 rounded-full">
                  <AlertCircle className="text-red-500 h-6 w-6" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">ZERO THREATS</div>
                  <div className="text-[10px] text-gray-500">SCAN COMPLETE</div>
                </div>
             </div>
          </GlassCard>
      </div>
    </div>
  );
};