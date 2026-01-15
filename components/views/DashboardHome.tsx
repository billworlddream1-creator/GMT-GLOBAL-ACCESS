import React, { useEffect, useState } from 'react';
import { GlassCard } from '../GlassCard';
import { WeatherData } from '../../types';
import { CloudRain, MapPin, Activity, HardDrive, Download, AlertTriangle, Check, X, Volume2 } from 'lucide-react';

interface ModalConfig {
  title: string;
  message: string;
  actionLabel: string;
  onConfirm: () => void;
  isDestructive?: boolean;
}

export const DashboardHome: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [time, setTime] = useState(new Date());
  const [systemStatus, setSystemStatus] = useState<'OPTIMAL' | 'CAUTION' | 'CRITICAL'>('OPTIMAL');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [modal, setModal] = useState<ModalConfig | null>(null);

  useEffect(() => {
    // Clock
    const timer = setInterval(() => setTime(new Date()), 1000);

    // Initialize Speech
    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices();
      setVoices(available);
    };
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();

    // Randomize Status for Dynamic Feel
    const statuses: ('OPTIMAL' | 'CAUTION' | 'CRITICAL')[] = ['OPTIMAL', 'OPTIMAL', 'OPTIMAL', 'CAUTION'];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    setSystemStatus(status);

    // Initial Greeting
    const greetTimeout = setTimeout(() => {
      speak(`System status ${status.toLowerCase()}. Welcome back, Operator.`);
    }, 1000);

    // Mock Weather & Location
    if (navigator.geolocation) {
       navigator.geolocation.getCurrentPosition((pos) => {
         setWeather({
           temp: 24,
           condition: 'Overcast',
           location: `LAT: ${pos.coords.latitude.toFixed(2)} | LONG: ${pos.coords.longitude.toFixed(2)}`,
           humidity: 65,
           windSpeed: 12
         });
       }, () => {
         setWeather({
            temp: 0,
            condition: 'Signal Lost',
            location: 'Unknown Sector',
            humidity: 0,
            windSpeed: 0
         });
       });
    }

    return () => {
      clearInterval(timer);
      clearTimeout(greetTimeout);
    };
  }, []);

  const speak = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel(); // Stop previous
    
    const utterance = new SpeechSynthesisUtterance(text);
    if (voices.length > 0) {
      // Pick a random voice
      const randomVoice = voices[Math.floor(Math.random() * voices.length)];
      utterance.voice = randomVoice;
    }
    utterance.pitch = 0.8 + Math.random() * 0.3; // Randomize pitch slightly
    utterance.rate = 1.05;
    window.speechSynthesis.speak(utterance);
  };

  const openModal = (config: ModalConfig) => {
    speak("Awaiting confirmation.");
    setModal(config);
  };

  const handleFixBridges = () => {
    openModal({
      title: "Repair System Bridges",
      message: "This will initiate a heuristic repair sequence on all connected neural bridges. Network latency may increase momentarily.",
      actionLabel: "INITIATE REPAIR",
      onConfirm: () => {
        speak("Repair sequence initiated. Bridges stabilizing.");
        // Logic would go here
      }
    });
  };

  const handleScanUSB = () => {
    openModal({
      title: "External Drive Scan",
      message: "Scanning all mounted external volumes for malicious signatures and anomalies.",
      actionLabel: "START SCAN",
      onConfirm: () => {
        speak("Scanning external drives. No threats detected.");
      }
    });
  };

  const handleExport = () => {
    openModal({
      title: "Export System Logs",
      message: "Generate and download a full encrypted dump of current system metrics and sensor data?",
      actionLabel: "DOWNLOAD",
      onConfirm: () => {
        speak("Exporting data.");
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
          report: "ACCESS SYSTEM DUMP",
          timestamp: new Date().toISOString(),
          status: systemStatus
        }));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "access_report.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
      }
    });
  };

  const handleSensors = () => {
    openModal({
      title: "Calibrate Sensors",
      message: "Recalibrate environmental and biometric sensors? This process takes approximately 10 seconds.",
      actionLabel: "CALIBRATE",
      onConfirm: () => {
        speak("Calibrating sensors. Please stand by.");
      }
    });
  };

  const getStatusColor = () => {
    switch(systemStatus) {
      case 'OPTIMAL': return 'text-emerald-500';
      case 'CAUTION': return 'text-amber-500';
      case 'CRITICAL': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Modal Overlay */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-black/90 shadow-2xl ring-1 ring-white/10">
            <div className="border-b border-white/10 bg-white/5 p-6">
              <h3 className="font-tech text-xl font-bold uppercase tracking-widest text-white">{modal.title}</h3>
            </div>
            <div className="p-6">
              <p className="font-mono text-sm leading-relaxed text-gray-400">{modal.message}</p>
            </div>
            <div className="flex gap-3 bg-white/5 p-6">
              <button 
                onClick={() => setModal(null)}
                className="flex-1 rounded-lg border border-white/10 bg-transparent py-3 font-tech text-sm font-bold tracking-wider text-gray-400 hover:bg-white/5"
              >
                CANCEL
              </button>
              <button 
                onClick={() => { modal.onConfirm(); setModal(null); }}
                className={`flex-1 rounded-lg py-3 font-tech text-sm font-bold tracking-wider text-black shadow-lg transition-all hover:scale-105 active:scale-95
                  ${modal.isDestructive ? 'bg-red-500 hover:bg-red-400' : 'bg-emerald-500 hover:bg-emerald-400'}`}
              >
                {modal.actionLabel}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Welcome / Status */}
        <GlassCard className="flex-1 bg-gradient-to-br from-gray-900/60 to-black/60">
           <div className="flex items-start justify-between">
             <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h2 className="font-tech text-3xl font-bold text-white">
                    {systemStatus === 'OPTIMAL' ? 'WELCOME, OPERATOR' : 'ATTENTION REQUIRED'}
                  </h2>
                </div>
                
                <div className={`flex items-center gap-2 text-sm font-bold tracking-widest uppercase ${getStatusColor()}`}>
                  <div className={`h-2 w-2 rounded-full ${systemStatus === 'OPTIMAL' ? 'bg-emerald-500' : systemStatus === 'CAUTION' ? 'bg-amber-500' : 'bg-red-500'} animate-pulse`} />
                  SYSTEM STATUS: {systemStatus}
                </div>

                <div className="mt-8 font-mono text-5xl font-light tracking-tighter text-white">
                  {time.toLocaleTimeString()}
                </div>
                <div className="text-sm font-bold tracking-widest text-gray-500">{time.toDateString().toUpperCase()}</div>
             </div>
             
             <div className="relative">
               <Activity className={`h-16 w-16 ${getStatusColor()} transition-all duration-500 ${systemStatus !== 'OPTIMAL' ? 'animate-bounce' : 'animate-pulse'}`} />
               {systemStatus !== 'OPTIMAL' && (
                 <div className="absolute -right-1 -top-1">
                   <AlertTriangle className="h-6 w-6 text-amber-500 animate-ping" />
                 </div>
               )}
             </div>
           </div>
        </GlassCard>

        {/* Location / Weather */}
        <GlassCard className="w-full lg:w-1/3" title="Environmental Sensors">
           <div className="flex items-center justify-between">
             <div>
               <div className="flex items-center gap-2 text-gray-400">
                 <MapPin className="h-4 w-4" />
                 <span className="text-xs font-bold tracking-widest">{weather?.location || 'TRIANGULATING...'}</span>
               </div>
               <div className="mt-4 text-4xl font-bold text-white">{weather?.temp}°C</div>
               <div className="text-emerald-400">{weather?.condition}</div>
             </div>
             <CloudRain className="h-16 w-16 text-gray-300 opacity-50" />
           </div>
           <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs text-gray-400">
             <div className="rounded bg-white/5 p-2">
               HUM: <span className="text-white">{weather?.humidity}%</span>
             </div>
             <div className="rounded bg-white/5 p-2">
               WIND: <span className="text-white">{weather?.windSpeed} km/h</span>
             </div>
           </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Quick Actions */}
        <GlassCard title="System Bridges" className="md:col-span-2">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <button 
              onClick={handleFixBridges}
              className="group flex flex-col items-center gap-3 rounded-xl border border-white/5 bg-white/5 py-6 transition-all duration-300 hover:bg-emerald-500/10 hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]"
            >
              <div className="rounded-full bg-white/5 p-3 group-hover:bg-emerald-500/20 group-hover:text-emerald-400 transition-colors">
                <Activity className="h-6 w-6" />
              </div>
              <span className="text-[10px] font-bold tracking-widest text-gray-400 group-hover:text-white">FIX BRIDGES</span>
            </button>

            <button 
              onClick={handleScanUSB}
              className="group flex flex-col items-center gap-3 rounded-xl border border-white/5 bg-white/5 py-6 transition-all duration-300 hover:bg-blue-500/10 hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.1)]"
            >
              <div className="rounded-full bg-white/5 p-3 group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors">
                <HardDrive className="h-6 w-6" />
              </div>
              <span className="text-[10px] font-bold tracking-widest text-gray-400 group-hover:text-white">SCAN USB</span>
            </button>

             <button 
              onClick={handleExport}
              className="group flex flex-col items-center gap-3 rounded-xl border border-white/5 bg-white/5 py-6 transition-all duration-300 hover:bg-amber-500/10 hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.1)]"
            >
              <div className="rounded-full bg-white/5 p-3 group-hover:bg-amber-500/20 group-hover:text-amber-400 transition-colors">
                <Download className="h-6 w-6" />
              </div>
              <span className="text-[10px] font-bold tracking-widest text-gray-400 group-hover:text-white">EXPORT DATA</span>
            </button>

             <button 
              onClick={handleSensors}
              className="group flex flex-col items-center gap-3 rounded-xl border border-white/5 bg-white/5 py-6 transition-all duration-300 hover:bg-red-500/10 hover:border-red-500/50 hover:shadow-[0_0_20px_rgba(239,68,68,0.1)]"
            >
              <div className="rounded-full bg-white/5 p-3 group-hover:bg-red-500/20 group-hover:text-red-400 transition-colors">
                <Volume2 className="h-6 w-6" />
              </div>
              <span className="text-[10px] font-bold tracking-widest text-gray-400 group-hover:text-white">SENSORS</span>
            </button>
          </div>
        </GlassCard>

        <GlassCard title="Threat Level">
           <div className="flex h-full flex-col items-center justify-center">
             <div className={`relative flex h-32 w-32 items-center justify-center rounded-full border-4 ${systemStatus === 'OPTIMAL' ? 'border-emerald-900' : 'border-amber-900'} bg-black`}>
               <div className={`absolute h-full w-full animate-ping rounded-full ${systemStatus === 'OPTIMAL' ? 'bg-emerald-500/10' : 'bg-amber-500/10'}`}></div>
               <span className={`text-3xl font-bold ${getStatusColor()}`}>
                 {systemStatus === 'OPTIMAL' ? 'LOW' : 'ELEVATED'}
               </span>
             </div>
             <p className="mt-4 text-center text-xs text-gray-400">
               GLOBAL DEFCON: {systemStatus === 'OPTIMAL' ? '5' : '4'}
             </p>
           </div>
        </GlassCard>
      </div>
    </div>
  );
};