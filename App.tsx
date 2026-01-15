import React, { useEffect, useState, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { DashboardHome } from './components/views/DashboardHome';
import { IntelAnalysis } from './components/views/IntelAnalysis';
import { MathCore } from './components/views/MathCore';
import { NetworkScanner } from './components/views/NetworkScanner';
import { GlobalMarket } from './components/views/GlobalMarket';
import { DeviceSensors } from './components/views/DeviceSensors';
import { Surveillance } from './components/views/Surveillance';
import { LocationTracker } from './components/views/LocationTracker';
import { SecurityOps } from './components/views/SecurityOps';
import { UserProfile } from './components/views/UserProfile';
import { CryptoTracker } from './components/views/CryptoTracker';
import { IdentityResolver } from './components/views/IdentityResolver';
import { FinancialIntel } from './components/views/FinancialIntel';
import { USBExtractor } from './components/views/USBExtractor';
import { Auth } from './components/views/Auth';
import { ViewMode } from './types';
import { Cpu, Wifi, WifiOff, Search, Terminal, X, Zap, MessageSquare, BrainCircuit, Activity, HardDrive } from 'lucide-react';
import { analyzeQuery } from './services/geminiService';

const PALETTES: Record<string, Record<number, string>> = {
  emerald: { 50:'#ecfdf5', 100:'#d1fae5', 200:'#a7f3d0', 300:'#6ee7b7', 400:'#34d399', 500:'#10b981', 600:'#059669', 700:'#047857', 800:'#065f46', 900:'#064e3b', 950:'#022c22' },
  blue:    { 50:'#eff6ff', 100:'#dbeafe', 200:'#bfdbfe', 300:'#93c5fd', 400:'#60a5fa', 500:'#3b82f6', 600:'#2563eb', 700:'#1d4ed8', 800:'#1e40af', 900:'#1e3a8a', 950:'#172554' },
  violet:  { 50:'#f5f3ff', 100:'#ede9fe', 200:'#ddd6fe', 300:'#c4b5fd', 400:'#a78bfa', 500:'#8b5cf6', 600:'#7c3aed', 700:'#6d28d9', 800:'#5b21b6', 900:'#4c1d95', 950:'#2e1065' },
  rose:    { 50:'#fff1f2', 100:'#ffe4e6', 200:'#fecdd3', 300:'#fda4af', 400:'#fb7185', 500:'#f43f5e', 600:'#e11d48', 700:'#be123c', 800:'#9f1239', 900:'#881337', 950:'#4c0519' },
  cyan:    { 50:'#ecfeff', 100:'#cffafe', 200:'#a5f3fc', 300:'#67e8f9', 400:'#22d3ee', 500:'#06b6d4', 600:'#0891b2', 700:'#0e7490', 800:'#155e75', 900:'#164e63', 950:'#083344' },
  amber:   { 50:'#fffbeb', 100:'#fef3c7', 200:'#fde68a', 300:'#fcd34d', 400:'#fbbf24', 500:'#f59e0b', 600:'#d97706', 700:'#b45309', 800:'#92400e', 900:'#78350f', 950:'#451a03' },
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<ViewMode>(ViewMode.DASHBOARD);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [bootSequence, setBootSequence] = useState(false);
  const [bootLogs, setBootLogs] = useState<string[]>([]);
  
  // Universal Search State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // AI Assistant State
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [aiChat, setAiChat] = useState<{role: 'user' | 'assistant', text: string}[]>([]);
  const [isAIProcessing, setIsAIProcessing] = useState(false);

  // System Status State
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [cpuLoad, setCpuLoad] = useState(12);
  const [ramUsage, setRamUsage] = useState(42);
  const [latency, setLatency] = useState(24);
  const [platform, setPlatform] = useState('Unknown OS');

  // Handle Login and Theme Generation
  const handleLogin = () => {
    const themeNames = Object.keys(PALETTES);
    const randomTheme = themeNames[Math.floor(Math.random() * themeNames.length)];
    const colors = PALETTES[randomTheme];

    const root = document.documentElement;
    Object.entries(colors).forEach(([shade, value]) => {
      root.style.setProperty(`--theme-${shade}`, value);
    });

    setIsAuthenticated(true);
    setBootSequence(true);
    
    const logs = [
      "INITIALIZING KERNEL...",
      `LOADING THEME: ${randomTheme.toUpperCase()}...`,
      "CONNECTING TO SATELLITE UPLINK...",
      "DECRYPTING SECURE CHANNELS...",
      "BYPASSING FIREWALLS...",
      "ACCESS GRANTED."
    ];
    
    let delay = 0;
    logs.forEach((log, index) => {
      delay += Math.random() * 500 + 200;
      setTimeout(() => {
        setBootLogs(prev => [...prev, log]);
        if (index === logs.length - 1) {
          setTimeout(() => setBootSequence(false), 800);
        }
      }, delay);
    });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView(ViewMode.DASHBOARD);
    setBootLogs([]);
  };

  const handleUniversalSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!searchQuery) return;
    setIsSearching(true);
    setSearchResult('');
    const result = await analyzeQuery(`Universal Dashboard Search: ${searchQuery}. Include deep financial recon details if applicable.`);
    setSearchResult(result);
    setIsSearching(false);
  };

  const handleAIChat = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!aiMessage.trim()) return;
    
    const userMsg = aiMessage;
    setAiChat(prev => [...prev, { role: 'user', text: userMsg }]);
    setAiMessage('');
    setIsAIProcessing(true);

    const response = await analyzeQuery(userMsg);
    setAiChat(prev => [...prev, { role: 'assistant', text: response }]);
    setIsAIProcessing(false);
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isAuthenticated) return;
      if (e.altKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
      if (e.altKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        setCurrentView(ViewMode.CRYPTO_TRACKER);
      }
      if (e.altKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setIsAIOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthenticated]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      // Mock fluctuating metrics
      setCpuLoad(prev => Math.max(5, Math.min(95, prev + (Math.random() - 0.5) * 10)));
      setRamUsage(prev => Math.max(20, Math.min(85, prev + (Math.random() - 0.5) * 2)));
      setLatency(prev => Math.max(10, Math.min(150, prev + (Math.random() - 0.5) * 15)));
    }, 1500);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // @ts-ignore
    const platformInfo = navigator.userAgentData?.platform || navigator.platform || 'Unknown';
    setPlatform(platformInfo);

    return () => {
      clearInterval(timer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const renderView = () => {
    switch (currentView) {
      case ViewMode.DASHBOARD: return <DashboardHome />;
      case ViewMode.INTEL_ANALYSIS: return <IntelAnalysis />;
      case ViewMode.MATH_CORE: return <MathCore />;
      case ViewMode.NETWORK_SCANNER: return <NetworkScanner />;
      case ViewMode.GLOBAL_MARKET: return <GlobalMarket />;
      case ViewMode.DEVICE_SENSORS: return <DeviceSensors />;
      case ViewMode.SURVEILLANCE: return <Surveillance />;
      case ViewMode.LOCATION_TRACKER: return <LocationTracker />;
      case ViewMode.SECURITY_OPS: return <SecurityOps />;
      case ViewMode.PROFILE: return <UserProfile />;
      case ViewMode.CRYPTO_TRACKER: return <CryptoTracker />;
      case ViewMode.IDENTITY_RESOLVER: return <IdentityResolver />;
      case ViewMode.FINANCIAL_INTEL: return <FinancialIntel />;
      case ViewMode.USB_EXTRACTOR: return <USBExtractor />;
      default: return <DashboardHome />;
    }
  };

  if (!isAuthenticated) {
     return (
       <div className="h-screen w-screen overflow-hidden bg-black text-gray-200">
         <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: 'url("https://picsum.photos/1920/1080?grayscale&blur=2")' }}
        />
        <div className="absolute inset-0 z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-150 contrast-150"></div>
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-emerald-900/30 via-black/80 to-black pointer-events-none" />
        <div className="relative z-10 flex h-full items-center justify-center">
           <Auth onLogin={handleLogin} />
        </div>
       </div>
     )
  }

  if (bootSequence) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-black font-mono text-emerald-500">
        <div className="w-96 space-y-2">
          {bootLogs.map((log, i) => (
            <div key={i} className="animate-fade-in text-sm border-l-2 border-emerald-500 pl-2">
              {`> ${log}`}
            </div>
          ))}
          <div className="h-4 w-3 animate-pulse bg-emerald-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black text-gray-200">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: 'url("https://picsum.photos/1920/1080?grayscale&blur=2")' }}
      />
      <div className="absolute inset-0 z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-150 contrast-150"></div>
      
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-emerald-900/30 via-black/80 to-black pointer-events-none transition-colors duration-1000" />

      {/* AI Assistant Sidebar Overlay */}
      <div className={`fixed right-0 top-0 bottom-0 z-[60] w-96 bg-black/90 border-l border-emerald-500/20 backdrop-blur-2xl transition-transform duration-500 transform ${isAIOpen ? 'translate-x-0' : 'translate-x-full'} shadow-2xl`}>
         <div className="flex flex-col h-full">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <BrainCircuit className="text-emerald-500 h-6 w-6" />
                  <h3 className="font-tech font-bold text-lg text-white uppercase tracking-widest">Neural Assistant</h3>
               </div>
               <button onClick={() => setIsAIOpen(false)} className="text-gray-500 hover:text-white"><X size={20}/></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4 font-mono text-xs">
               {aiChat.length === 0 && (
                 <div className="h-full flex flex-col items-center justify-center text-gray-600 space-y-4 opacity-50">
                    <MessageSquare size={48} />
                    <p className="text-center px-8 uppercase tracking-widest">Awaiting command input. Neural link initialized.</p>
                 </div>
               )}
               {aiChat.map((msg, i) => (
                 <div key={i} className={`p-4 rounded-xl border ${msg.role === 'user' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300 ml-8' : 'bg-white/5 border-white/10 text-gray-300 mr-8'}`}>
                    <div className="uppercase text-[10px] font-black mb-2 text-gray-500">{msg.role}</div>
                    <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
                 </div>
               ))}
               {isAIProcessing && (
                 <div className="flex items-center gap-2 text-emerald-500 animate-pulse">
                    <Terminal size={14} />
                    <span className="uppercase tracking-widest">Processing response...</span>
                 </div>
               )}
            </div>
            <form onSubmit={handleAIChat} className="p-6 border-t border-white/10 bg-black/40">
               <div className="relative">
                  <input 
                    type="text"
                    value={aiMessage}
                    onChange={(e) => setAiMessage(e.target.value)}
                    placeholder="Ask ACCESS anything..."
                    className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-emerald-400 font-mono focus:border-emerald-500 focus:outline-none"
                  />
                  <button type="submit" className="absolute right-2 top-2 p-1.5 rounded-lg bg-emerald-600 text-black hover:bg-emerald-500 transition-colors">
                    <Zap size={16} />
                  </button>
               </div>
            </form>
         </div>
      </div>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-black/90 border border-emerald-500/30 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-emerald-500/10">
            <div className="p-4 flex items-center gap-4 border-b border-white/10">
              <Search className="text-emerald-500" />
              <form onSubmit={handleUniversalSearch} className="flex-1 flex gap-2">
                <input 
                  autoFocus
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Universal Scan (Alt+S)..."
                  className="w-full bg-transparent border-none text-emerald-400 font-mono focus:ring-0 placeholder-emerald-900/50"
                />
                <button 
                  type="submit"
                  disabled={isSearching}
                  className="bg-emerald-600 hover:bg-emerald-500 text-black px-4 py-1 rounded-lg font-tech font-bold uppercase text-[10px] tracking-widest flex items-center gap-1 transition-all disabled:opacity-50"
                >
                  {isSearching ? <Zap className="h-3 w-3 animate-spin" /> : <Search className="h-3 w-3" />}
                  INITIATE
                </button>
              </form>
              <button onClick={() => { setIsSearchOpen(false); setSearchResult(''); }} className="text-gray-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-6">
              {isSearching ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <Terminal className="text-emerald-500 animate-pulse" size={32} />
                  <span className="font-mono text-xs text-emerald-500 animate-pulse uppercase tracking-[0.2em]">Cross-referencing global databanks...</span>
                </div>
              ) : searchResult ? (
                <div className="font-mono text-sm prose prose-invert max-w-none whitespace-pre-wrap text-emerald-100/80">
                  {searchResult}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-600 font-mono text-xs uppercase tracking-widest">
                  Enter target parameters and press INITIATE
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 flex h-full">
        <Sidebar 
          currentView={currentView} 
          setView={setCurrentView} 
          collapsed={isSidebarCollapsed}
          setCollapsed={setIsSidebarCollapsed}
          onLogout={handleLogout}
          cpu={cpuLoad}
          ram={ramUsage}
          latency={latency}
        />
        
        <main className="flex-1 flex flex-col overflow-hidden">
           {/* Top System Header */}
           <div className="flex items-center justify-between gap-6 border-b border-white/10 bg-black/40 px-6 py-2 backdrop-blur-md">
              <div className="flex items-center gap-4">
                 <button 
                  onClick={() => setIsSearchOpen(true)}
                  title="Universal Scan (Alt+S)"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-emerald-400 transition-all text-xs font-mono"
                 >
                   <Search size={14} />
                   <span className="hidden sm:inline">SCAN</span>
                 </button>
                 <button 
                  onClick={() => setIsAIOpen(true)}
                  title="AI Neural Assistant (Alt+A)"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-all text-xs font-mono"
                 >
                   <BrainCircuit size={14} />
                   <span className="hidden sm:inline">ASSIST</span>
                 </button>
              </div>

              {/* Central Real-time System Metrics */}
              <div className="flex items-center gap-8 px-4 border-l border-r border-white/10">
                 <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500">
                       <Cpu size={10} className="text-blue-400" /> CPU
                    </div>
                    <div className="font-mono text-xs text-white">{cpuLoad.toFixed(1)}%</div>
                 </div>
                 <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500">
                       <HardDrive size={10} className="text-amber-400" /> RAM
                    </div>
                    <div className="font-mono text-xs text-white">{ramUsage.toFixed(1)}%</div>
                 </div>
                 <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500">
                       <Activity size={10} className="text-emerald-400" /> LATENCY
                    </div>
                    <div className="font-mono text-xs text-white">{latency.toFixed(0)}ms</div>
                 </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="hidden md:flex items-center gap-2 text-[10px] font-mono text-gray-500">
                  {isOnline ? <Wifi className="h-3 w-3 text-emerald-400" /> : <WifiOff className="h-3 w-3 text-red-500" />}
                  <span className="uppercase">{isOnline ? 'Online' : 'Offline'}</span>
                </div>
                <div className="font-tech text-lg font-bold tracking-widest text-white/90">
                  {currentTime.toLocaleTimeString([], { hour12: false })}
                </div>
              </div>
           </div>

           <div className="flex-1 overflow-y-auto p-4 lg:p-8">
             <div className={`mx-auto pb-10 transition-all duration-300 ${isSidebarCollapsed ? 'max-w-[1600px]' : 'max-w-7xl'}`}>
                {renderView()}
             </div>
           </div>
        </main>
      </div>
      
      {/* Floating AI Bubble Shortcut */}
      <button 
        onClick={() => setIsAIOpen(true)}
        className="fixed bottom-8 right-8 z-50 h-14 w-14 rounded-full bg-emerald-600 text-black shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all group"
      >
        <BrainCircuit className="h-7 w-7 group-hover:animate-pulse" />
      </button>
    </div>
  );
};

export default App;