import React, { useState } from 'react';
import { GlassCard } from '../GlassCard';
// Fix: Added missing Zap icon to lucide-react imports
import { Search, User, Phone, Mail, ShieldAlert, Database, Globe, MessageSquare, History, PhoneIncoming, Zap } from 'lucide-react';
import { resolveIdentity, extractCommLogs } from '../../services/geminiService';

export const IdentityResolver: React.FC = () => {
  const [target, setTarget] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'IDENTITY' | 'COMM_LOGS'>('IDENTITY');
  const [inputType, setInputType] = useState<'EMAIL' | 'PHONE'>('EMAIL');

  const handleAction = async () => {
    if (!target) return;
    setLoading(true);
    setResult('');
    const data = mode === 'IDENTITY' ? await resolveIdentity(target) : await extractCommLogs(target);
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <GlassCard className="lg:col-span-1" title="Resolver / Extractor Interface">
          <div className="space-y-6">
            <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
              <button 
                onClick={() => setMode('IDENTITY')}
                className={`flex-1 py-2 rounded-lg text-[10px] font-black tracking-widest transition-all ${mode === 'IDENTITY' ? 'bg-emerald-500 text-black' : 'text-gray-400 hover:text-white'}`}
              >
                IDENTITY RESOLUTION
              </button>
              <button 
                onClick={() => setMode('COMM_LOGS')}
                className={`flex-1 py-2 rounded-lg text-[10px] font-black tracking-widest transition-all ${mode === 'COMM_LOGS' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                COMMUNICATION LOGS
              </button>
            </div>

            <div className="flex gap-2 p-1 bg-black/20 rounded-lg border border-white/5">
              <button onClick={() => setInputType('EMAIL')} className={`flex-1 py-1.5 rounded text-[9px] font-bold ${inputType === 'EMAIL' ? 'bg-white/10 text-white' : 'text-gray-600'}`}>EMAIL</button>
              <button onClick={() => setInputType('PHONE')} className={`flex-1 py-1.5 rounded text-[9px] font-bold ${inputType === 'PHONE' ? 'bg-white/10 text-white' : 'text-gray-600'}`}>PHONE</button>
            </div>

            <div className="relative">
              <input 
                type="text"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder={inputType === 'EMAIL' ? 'operator@domain.mil' : '+1 555-0199...'}
                className="w-full bg-black/50 border border-white/20 rounded-xl py-4 pl-12 pr-4 text-emerald-400 font-mono focus:border-emerald-500 focus:outline-none"
                onKeyDown={(e) => e.key === 'Enter' && handleAction()}
              />
              {inputType === 'EMAIL' ? <Mail className="absolute left-4 top-4 h-5 w-5 text-emerald-600" /> : <Phone className="absolute left-4 top-4 h-5 w-5 text-emerald-600" />}
            </div>

            <button 
              onClick={handleAction}
              disabled={loading}
              className={`w-full font-tech font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50
              ${mode === 'IDENTITY' ? 'bg-emerald-600 hover:bg-emerald-500 text-black' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
            >
              {loading ? <Database className="h-5 w-5 animate-spin" /> : mode === 'IDENTITY' ? <Globe className="h-5 w-5" /> : <History className="h-5 w-5" />}
              {loading ? 'PENETRATING DATABASES...' : mode === 'IDENTITY' ? 'RESOLVE IDENTITY' : 'EXTRACT CALL/SMS LOGS'}
            </button>

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
              <div className="flex items-center gap-2 text-amber-500 mb-2">
                <ShieldAlert size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Signal Intelligence Protocol</span>
              </div>
              <p className="text-[10px] text-gray-500 leading-relaxed">
                Extraction initiated via SIGINT Node Sigma. Logs include metadata snapshots, call durations, and SMS routing headers. Full content may be obfuscated depending on encryption grade.
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="lg:col-span-2 min-h-[500px]" title={mode === 'IDENTITY' ? 'Resolution Intel Report' : 'Extracted Communication Metadata'}>
          <div className="h-full bg-black/50 border border-white/10 rounded-xl p-6 font-mono text-sm overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full space-y-4">
                <div className="relative h-16 w-16">
                  <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20" />
                  <div className="absolute inset-0 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Zap className="text-emerald-500 h-6 w-6 animate-pulse" />
                  </div>
                </div>
                <span className="text-emerald-500 text-[10px] font-black animate-pulse tracking-[0.2em] uppercase">Bypassing Cellular Encryption...</span>
              </div>
            ) : result ? (
              <div className="whitespace-pre-wrap text-emerald-100/90 leading-relaxed prose prose-invert max-w-none">
                {result}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-700 space-y-4">
                {mode === 'IDENTITY' ? <User size={64} className="opacity-10" /> : <MessageSquare size={64} className="opacity-10" />}
                <p className="tracking-widest text-xs font-bold uppercase">Awaiting target for signal capture</p>
              </div>
            )}
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard title="Mobile Signal Tracking">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <PhoneIncoming className="text-blue-500 h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">LATEST_SIGNAL</div>
              <div className="text-[10px] text-gray-500">GSM_CELL_NODE_82</div>
            </div>
          </div>
        </GlassCard>
        <GlassCard title="Tracking Precision">
          <div className="flex items-end gap-2">
            <span className="text-4xl font-black text-white">92%</span>
            <span className="text-emerald-400 font-bold mb-1">HIGH</span>
          </div>
          <p className="text-[10px] text-gray-500 mt-2">Triangulated via 3 nearby cell towers and SS7 intercept.</p>
        </GlassCard>
        <GlassCard title="Encryption Level">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-500/10 rounded-lg">
              <ShieldAlert className="text-red-500 h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">A5/3 KASUMI</div>
              <div className="text-[10px] text-gray-500">PENETRATION SUCCESSFUL</div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};