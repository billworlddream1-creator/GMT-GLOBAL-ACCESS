import React, { useEffect, useState, useRef } from 'react';
import { GlassCard } from '../GlassCard';
import { Shield, Fingerprint, Activity, Clock, BadgeCheck, FileText, Settings, Key, Download, Mic, MicOff, Globe, ShieldAlert, TrendingUp, AlertOctagon, Share2, Server, Terminal } from 'lucide-react';
import { UserProfile as IUserProfile } from '../../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const UserProfile: React.FC = () => {
  const user: IUserProfile = {
    name: 'COMMANDER SHEPARD',
    email: 'cmdr.shepard@gmt-global.mil',
    role: 'SYSTEM ADMINISTRATOR',
    clearanceLevel: 5,
    department: 'SPECIAL TACTICS & RECON',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  };

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [cpcData, setCpcData] = useState<{time: string, value: number}[]>([]);
  const [cyberStats, setCyberStats] = useState({
    threatLevel: 'ELEVATED',
    theftAttempts: 8432,
    activeThreats: 12,
    globalRisk: 45 // percentage
  });
  
  const settingsRef = useRef<HTMLDivElement>(null);

  // Initialize Data
  useEffect(() => {
    // Generate initial history
    const initialData = Array.from({ length: 20 }, (_, i) => ({
      time: `${i}:00`,
      value: Math.floor(Math.random() * 50) + 20
    }));
    setCpcData(initialData);

    const interval = setInterval(() => {
      // Update CPC Data
      setCpcData(prev => {
        const newData = [...prev.slice(1), {
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          value: Math.floor(Math.random() * 60) + 20
        }];
        return newData;
      });

      // Update Cyber Stats
      setCyberStats(prev => ({
        ...prev,
        theftAttempts: prev.theftAttempts + (Math.random() > 0.7 ? 1 : 0),
        activeThreats: Math.max(0, prev.activeThreats + (Math.random() > 0.5 ? (Math.random() > 0.5 ? 1 : -1) : 0)),
        globalRisk: Math.min(100, Math.max(0, prev.globalRisk + (Math.random() - 0.5) * 2))
      }));

    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Voice Recognition Logic
  useEffect(() => {
    if (!isListening) return;

    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition not supported in this browser.");
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      console.log("Voice recognition started");
    };

    recognition.onresult = (event: any) => {
      const last = event.results.length - 1;
      const command = event.results[last][0].transcript.trim().toLowerCase();
      setTranscript(command);
      console.log("Command received:", command);

      if (command.includes('open account settings') || command.includes('settings') || command.includes('configure')) {
        if (settingsRef.current) {
          settingsRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
          settingsRef.current.classList.add('ring-2', 'ring-emerald-500');
          setTimeout(() => settingsRef.current?.classList.remove('ring-2', 'ring-emerald-500'), 2000);
        }
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      if (isListening) recognition.start();
    };

    recognition.start();

    return () => {
      recognition.stop();
    };
  }, [isListening]);

  const handleExportData = () => {
    const exportData = {
      userProfile: user,
      systemInfo: {
        exportedAt: new Date().toISOString(),
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        hardwareConcurrency: navigator.hardwareConcurrency,
        onlineStatus: navigator.onLine,
        cookiesEnabled: navigator.cookieEnabled
      },
      environmentalSnapshot: {
        cyberDefenseEfficiency: cpcData,
        threatLevel: cyberStats.threatLevel,
        globalRiskIndex: cyberStats.globalRisk,
        activeThreats: cyberStats.activeThreats,
        totalAttemptsBlocked: cyberStats.theftAttempts
      },
      activityLogs: [
        { id: 'log-1024', action: 'LOGIN_SUCCESS', timestamp: new Date(Date.now() - 3600000).toISOString() },
        { id: 'log-1025', action: 'ACCESS_VAULT_B', timestamp: new Date(Date.now() - 1800000).toISOString() },
        { id: 'log-1026', action: 'EXECUTE_DIAGNOSTICS', timestamp: new Date(Date.now() - 900000).toISOString() },
        { id: 'log-1027', action: 'UNIVERSAL_SCAN_INIT', timestamp: new Date(Date.now() - 300000).toISOString() }
      ]
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `gmt_MASTER_DUMP_${Date.now()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <GlassCard className="relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center">
          <div className="relative">
            <div className="h-24 w-24 overflow-hidden rounded-2xl border-2 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <img src={user.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
            </div>
            <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-black shadow-lg">
              <Shield size={16} fill="black" />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="font-tech text-3xl font-bold text-white">{user.name}</h2>
              <BadgeCheck className="text-emerald-400" size={24} />
            </div>
            <p className="font-mono text-sm text-gray-400">{user.email}</p>
            <div className="mt-3 flex gap-3">
              <span className="inline-flex items-center rounded bg-emerald-500/10 px-2 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
                LEVEL {user.clearanceLevel} CLEARANCE
              </span>
              <span className="inline-flex items-center rounded bg-blue-500/10 px-2 py-1 text-xs font-bold text-blue-400 border border-blue-500/20">
                {user.department}
              </span>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-3">
            <button 
              onClick={() => setIsListening(!isListening)}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all
              ${isListening 
                ? 'border-red-500 bg-red-500/10 text-red-400 animate-pulse' 
                : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {isListening ? <Mic size={14} /> : <MicOff size={14} />}
              {isListening ? 'VOICE COMMAND: ACTIVE' : 'VOICE COMMAND: OFF'}
            </button>
            {isListening && transcript && (
               <div className="text-[10px] text-emerald-400 font-mono">
                 Last: "{transcript}"
               </div>
            )}
          </div>
        </div>
      </GlassCard>

      {/* Cyber Security Analytics Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <GlassCard title="Real-Time CPC Analysis (Cost Per Cyber-defense)">
          <div className="h-[250px] w-full">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={cpcData}>
                 <defs>
                   <linearGradient id="colorCpc" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                     <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                 <XAxis dataKey="time" hide />
                 <YAxis hide domain={[0, 100]} />
                 <Tooltip 
                   contentStyle={{ backgroundColor: '#000000aa', backdropFilter: 'blur(10px)', border: '1px solid #333' }}
                   itemStyle={{ color: '#10b981' }}
                 />
                 <Area type="monotone" dataKey="value" stroke="#10b981" fillOpacity={1} fill="url(#colorCpc)" />
               </AreaChart>
             </ResponsiveContainer>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
               <TrendingUp className="h-5 w-5 text-emerald-400" />
               <span className="text-xs text-gray-400">EFFICIENCY RATING</span>
            </div>
            <div className="font-mono text-xl text-white">
              {cpcData[cpcData.length - 1]?.value.toFixed(2)} <span className="text-xs text-gray-500">units</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard title="Global Threat & Cyber Theft">
           <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center justify-center rounded-xl bg-red-500/10 p-6 border border-red-500/20">
                 <ShieldAlert className="h-10 w-10 text-red-500 mb-2 animate-pulse" />
                 <div className="text-2xl font-bold text-white">{cyberStats.theftAttempts.toLocaleString()}</div>
                 <div className="text-[10px] uppercase tracking-widest text-red-400">Theft Attempts Blocked</div>
              </div>
              <div className="flex flex-col items-center justify-center rounded-xl bg-amber-500/10 p-6 border border-amber-500/20">
                 <Globe className="h-10 w-10 text-amber-500 mb-2" />
                 <div className="text-2xl font-bold text-white">{cyberStats.activeThreats}</div>
                 <div className="text-[10px] uppercase tracking-widest text-amber-400">Active Global Threats</div>
              </div>
           </div>
           <div className="mt-4 space-y-2">
             <div className="flex justify-between text-xs font-bold">
               <span className="text-gray-400">GLOBAL RISK INDEX</span>
               <span className={cyberStats.globalRisk > 70 ? 'text-red-500' : 'text-emerald-400'}>
                 {cyberStats.globalRisk.toFixed(1)}%
               </span>
             </div>
             <div className="h-2 w-full overflow-hidden rounded-full bg-black">
               <div 
                 className={`h-full transition-all duration-500 ${cyberStats.globalRisk > 70 ? 'bg-red-500' : 'bg-gradient-to-r from-emerald-500 to-blue-500'}`} 
                 style={{ width: `${cyberStats.globalRisk}%` }}
               />
             </div>
             <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-2">
               <AlertOctagon size={12} />
               <span>DATA SOURCE: SATELLITE UPLINK ALPHA-9</span>
             </div>
           </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <GlassCard title="Node Security & Status">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
               <div className="flex items-center gap-3">
                 <Server className="text-blue-400" />
                 <div className="text-sm font-bold text-white uppercase tracking-wider">Main Node Alpha</div>
               </div>
               <div className="text-[10px] font-bold text-emerald-400">SYNCED</div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 opacity-50">
               <div className="flex items-center gap-3">
                 <Terminal className="text-gray-400" />
                 <div className="text-sm font-bold text-white uppercase tracking-wider">Aux Node Beta</div>
               </div>
               <div className="text-[10px] font-bold text-amber-400">STANDBY</div>
            </div>
            <div className="mt-6">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Recent Security Patches</div>
              <div className="space-y-2">
                <div className="text-xs text-gray-400 flex items-center gap-2">
                   <Shield className="h-3 w-3 text-emerald-500" /> KERNEL_MOD_72 INJECTED
                </div>
                <div className="text-xs text-gray-400 flex items-center gap-2">
                   <Shield className="h-3 w-3 text-emerald-500" /> FIREWALL_DELTA REINFORCED
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Account Settings Section */}
        <div ref={settingsRef} id="account-settings" className="transition-all duration-300 rounded-2xl">
          <GlassCard title="Account Settings">
             <div className="space-y-2">
               <button className="flex w-full items-center justify-between rounded-lg bg-white/5 p-4 transition hover:bg-white/10">
                 <div className="flex items-center gap-3">
                   <Settings size={18} className="text-gray-400" />
                   <span className="font-bold text-sm text-white">General Configuration</span>
                 </div>
                 <div className="text-gray-500">Edit</div>
               </button>
               <button className="flex w-full items-center justify-between rounded-lg bg-white/5 p-4 transition hover:bg-white/10">
                 <div className="flex items-center gap-3">
                   <Key size={18} className="text-gray-400" />
                   <span className="font-bold text-sm text-white">Security Keys</span>
                 </div>
                 <div className="text-emerald-400 text-xs font-bold">2 ACTIVE</div>
               </button>
               
               {/* Export Button */}
               <button 
                  onClick={handleExportData}
                  className="flex w-full items-center justify-between rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-4 transition hover:bg-emerald-500/20 group"
                >
                 <div className="flex items-center gap-3">
                   <Download size={18} className="text-emerald-400 group-hover:animate-bounce" />
                   <span className="font-bold text-sm text-white">Master Export (Comprehensive)</span>
                 </div>
                 <div className="text-emerald-400 text-xs font-bold group-hover:text-white uppercase">Download JSON</div>
               </button>
               
               <button className="flex w-full items-center justify-between rounded-lg bg-white/5 p-4 transition hover:bg-white/10">
                 <div className="flex items-center gap-3">
                   <Share2 size={18} className="text-gray-400" />
                   <span className="font-bold text-sm text-white">External Node Access</span>
                 </div>
                 <div className="text-gray-500">Link</div>
               </button>
             </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};