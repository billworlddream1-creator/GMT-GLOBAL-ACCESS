import React, { useState } from 'react';
import { GlassCard } from '../GlassCard';
import { Bug, CheckCircle, Shield, ShieldAlert, Zap } from 'lucide-react';

interface Vulnerability {
  id: string;
  name: string;
  cve: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  status: 'OPEN' | 'PATCHING' | 'SECURE';
  progress: number;
}

export const SecurityOps: React.FC = () => {
  const [vulns, setVulns] = useState<Vulnerability[]>([
    { id: '1', name: 'SQL Injection in Auth Module', cve: 'CVE-2024-8821', severity: 'CRITICAL', status: 'OPEN', progress: 0 },
    { id: '2', name: 'Cross-Site Scripting (XSS)', cve: 'CVE-2024-1029', severity: 'HIGH', status: 'OPEN', progress: 0 },
    { id: '3', name: 'Open SSL Heartbeat Echo', cve: 'CVE-2024-5541', severity: 'MEDIUM', status: 'SECURE', progress: 100 },
  ]);

  const handlePatch = (id: string) => {
    setVulns(prev => prev.map(v => {
      if (v.id === id) return { ...v, status: 'PATCHING' };
      return v;
    }));

    // Simulate Patching Process
    let p = 0;
    const interval = setInterval(() => {
      p += 5;
      setVulns(prev => prev.map(v => {
        if (v.id === id) {
          if (p >= 100) return { ...v, status: 'SECURE', progress: 100 };
          return { ...v, progress: p };
        }
        return v;
      }));
      if (p >= 100) clearInterval(interval);
    }, 100);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <GlassCard title="Security Status" className="md:col-span-2">
           <div className="flex items-center gap-6">
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-4 border-emerald-500/30 bg-black">
                 <Shield className={`h-10 w-10 ${vulns.some(v => v.status !== 'SECURE') ? 'text-amber-500' : 'text-emerald-500'}`} />
                 {vulns.some(v => v.status !== 'SECURE') && (
                   <div className="absolute right-0 top-0 h-4 w-4 animate-bounce rounded-full bg-amber-500" />
                 )}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">
                  {vulns.every(v => v.status === 'SECURE') ? 'SYSTEM SECURE' : 'THREATS DETECTED'}
                </h3>
                <p className="text-gray-400">
                  {vulns.filter(v => v.status !== 'SECURE').length} Active Vulnerabilities found in sub-systems.
                </p>
              </div>
           </div>
        </GlassCard>

        <GlassCard title="Firewall Integrity">
           <div className="text-center">
             <div className="mb-2 text-5xl font-bold text-emerald-400">99.9%</div>
             <div className="text-xs text-gray-500">UPTIME</div>
           </div>
           <div className="mt-4 flex gap-1">
             {[...Array(20)].map((_, i) => (
               <div key={i} className="h-8 flex-1 rounded-sm bg-emerald-500/20">
                 <div className="h-full bg-emerald-500 animate-pulse" style={{ opacity: Math.random() }} />
               </div>
             ))}
           </div>
        </GlassCard>
      </div>

      <GlassCard title="Vulnerability Matrix">
        <div className="space-y-4">
          {vulns.map(v => (
            <div key={v.id} className="relative overflow-hidden rounded-xl border border-white/5 bg-white/5 p-6 transition hover:border-white/10">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div className="flex items-start gap-4">
                  <div className={`mt-1 rounded p-2 ${
                    v.status === 'SECURE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {v.status === 'SECURE' ? <CheckCircle size={24} /> : <Bug size={24} />}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{v.name}</h4>
                    <div className="flex gap-2 text-xs">
                      <span className="font-mono text-gray-400">{v.cve}</span>
                      <span className={`font-bold ${
                        v.severity === 'CRITICAL' ? 'text-red-500' : 
                        v.severity === 'HIGH' ? 'text-amber-500' : 'text-blue-500'
                      }`}>
                        {v.severity}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {v.status === 'OPEN' && (
                    <button 
                      onClick={() => handlePatch(v.id)}
                      className="group flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-2 font-bold text-black transition hover:bg-emerald-500"
                    >
                      <Zap size={16} className="transition group-hover:fill-black" />
                      DEPLOY PATCH
                    </button>
                  )}
                  {v.status === 'PATCHING' && (
                    <div className="w-48">
                      <div className="mb-1 flex justify-between text-[10px] font-bold text-emerald-400">
                        <span>PATCHING CODEBASE...</span>
                        <span>{v.progress}%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-black">
                        <div 
                          className="h-full bg-emerald-500 transition-all duration-100 ease-out"
                          style={{ width: `${v.progress}%` }} 
                        />
                      </div>
                    </div>
                  )}
                  {v.status === 'SECURE' && (
                     <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-bold text-emerald-400">
                        <ShieldAlert size={16} /> PATCHED
                     </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};