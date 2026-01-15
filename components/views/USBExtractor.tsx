import React, { useState, useEffect } from 'react';
import { GlassCard } from '../GlassCard';
import { Usb, Database, ShieldAlert, Cpu, HardDrive, RefreshCw, Zap, Search, Terminal, Lock, Unlock, FileWarning } from 'lucide-react';
import { extractUSBData } from '../../services/geminiService';

interface USBDevice {
  id: string;
  label: string;
  vendorId: string;
  productId: string;
  status: 'CONNECTED' | 'SCANNING' | 'LOCKED' | 'ACCESS_GRANTED';
  encryption: 'NONE' | 'AES-128' | 'AES-256' | 'RSA-4096';
}

export const USBExtractor: React.FC = () => {
  const [devices, setDevices] = useState<USBDevice[]>([
    { id: 'usb-01', label: 'External Drive Alpha', vendorId: '0x0781', productId: '0x5581', status: 'CONNECTED', encryption: 'AES-128' },
    { id: 'usb-02', label: 'Mobile Handset Node', vendorId: '0x05AC', productId: '0x12A8', status: 'LOCKED', encryption: 'AES-256' },
    { id: 'usb-03', label: 'Secure Crypt-Token', vendorId: '0x1050', productId: '0x0407', status: 'CONNECTED', encryption: 'RSA-4096' },
  ]);

  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [extractionResult, setExtractionResult] = useState<string>('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const selectedDevice = devices.find(d => d.id === selectedDeviceId);

  const handleRequestDevice = async () => {
    try {
      // Use WebUSB API if available to "Practicaly" detect real devices (educational descriptors only)
      // @ts-ignore
      if (navigator.usb) {
        // @ts-ignore
        const device = await navigator.usb.requestDevice({ filters: [] });
        const newDevice: USBDevice = {
          id: `usb-${Date.now()}`,
          label: device.productName || 'Unknown Hardware Node',
          vendorId: `0x${device.vendorId.toString(16).padStart(4, '0')}`,
          productId: `0x${device.productId.toString(16).padStart(4, '0')}`,
          status: 'CONNECTED',
          encryption: 'NONE'
        };
        setDevices(prev => [...prev, newDevice]);
      } else {
        alert("WebUSB not supported in this secure environment.");
      }
    } catch (err) {
      console.warn("Handshake aborted by operator.");
    }
  };

  const startExtraction = async () => {
    if (!selectedDevice) return;
    
    setIsExtracting(true);
    setExtractionResult('');
    setScanProgress(0);

    // Simulate "Bypassing" animation
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 5;
      });
    }, 150);

    const result = await extractUSBData(`${selectedDevice.label} (${selectedDevice.vendorId}:${selectedDevice.productId})`);
    
    // Ensure animation finishes before showing result
    setTimeout(() => {
      setExtractionResult(result);
      setIsExtracting(false);
      setDevices(prev => prev.map(d => d.id === selectedDeviceId ? { ...d, status: 'ACCESS_GRANTED' } : d));
    }, 3500);
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 h-full">
      {/* Hardware Node Explorer */}
      <GlassCard title="Hardware Nodes" className="lg:col-span-1 flex flex-col h-[700px]">
        <div className="mb-4">
          <button 
            onClick={handleRequestDevice}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-black font-tech font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all uppercase tracking-widest text-xs"
          >
            <Usb size={16} /> Mount New Node
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
          {devices.map(device => (
            <div 
              key={device.id}
              onClick={() => setSelectedDeviceId(device.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer group
                ${selectedDeviceId === device.id 
                  ? 'bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                  : 'bg-white/5 border-white/5 hover:border-white/20'}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${device.status === 'ACCESS_GRANTED' ? 'bg-emerald-500 text-black' : 'bg-white/5 text-gray-500'}`}>
                    {device.status === 'ACCESS_GRANTED' ? <Unlock size={16} /> : <Lock size={16} />}
                  </div>
                  <div>
                    <h4 className="font-tech font-bold text-white text-sm">{device.label}</h4>
                    <p className="text-[10px] font-mono text-gray-500 uppercase tracking-tighter">{device.vendorId}:{device.productId}</p>
                  </div>
                </div>
                <div className={`h-1.5 w-1.5 rounded-full ${device.status === 'CONNECTED' ? 'bg-blue-500' : device.status === 'LOCKED' ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'}`} />
              </div>
              
              <div className="mt-4 flex gap-2">
                <span className="text-[9px] font-black text-gray-600 bg-white/5 px-1.5 py-0.5 rounded border border-white/5">{device.encryption}</span>
                <span className="text-[9px] font-black text-gray-600 bg-white/5 px-1.5 py-0.5 rounded border border-white/5 uppercase">{device.status}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-white/10 opacity-50">
           <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500">
             <RefreshCw size={10} className="animate-spin-slow" />
             POOLING USB BUS 001...
           </div>
        </div>
      </GlassCard>

      {/* Extraction Hub */}
      <GlassCard className="lg:col-span-3 h-[700px] relative overflow-hidden flex flex-col" title="Extraction & Analysis Hub">
        {!selectedDevice ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-700 space-y-4 opacity-20">
            <Usb size={120} strokeWidth={0.5} />
            <p className="font-tech text-xl tracking-[0.3em] uppercase">Select Hardware Node to Probe</p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Action Bar */}
            <div className="flex items-center justify-between mb-6 p-1 bg-black/20 rounded-xl border border-white/5">
               <div className="flex items-center gap-4 px-4">
                  <div className="flex flex-col">
                     <span className="text-[10px] font-black text-gray-500 uppercase">Selected Target</span>
                     <span className="text-sm font-tech font-bold text-white uppercase">{selectedDevice.label}</span>
                  </div>
                  <div className="h-8 w-px bg-white/10" />
                  <div className="flex flex-col">
                     <span className="text-[10px] font-black text-gray-500 uppercase">FS Protocol</span>
                     <span className="text-sm font-tech font-bold text-blue-400 uppercase">MTP/UFS 3.1</span>
                  </div>
               </div>
               <button 
                onClick={startExtraction}
                disabled={isExtracting}
                className="bg-emerald-600 hover:bg-emerald-500 text-black px-8 py-3 rounded-lg font-tech font-bold tracking-widest transition-all disabled:opacity-50 flex items-center gap-2"
               >
                  {isExtracting ? <RefreshCw className="animate-spin" size={18} /> : <Zap size={18} />}
                  {isExtracting ? 'BYPASSING SECURITY...' : 'INITIATE DEEP EXTRACTION'}
               </button>
            </div>

            {/* Main Readout Area */}
            <div className="flex-1 bg-black/40 border border-white/10 rounded-2xl overflow-hidden flex flex-col">
               <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border-b border-white/10">
                  <Terminal size={12} className="text-emerald-500" />
                  <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest font-black">Secure Signal Feed</span>
               </div>

               <div className="flex-1 overflow-y-auto p-6 font-mono text-xs custom-scrollbar">
                  {isExtracting ? (
                    <div className="h-full flex flex-col items-center justify-center space-y-6">
                       <div className="w-64 space-y-2">
                          <div className="flex justify-between text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                             <span>Penetrating Hardware Bridge</span>
                             <span>{Math.round(scanProgress)}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-emerald-900/20 rounded-full overflow-hidden border border-emerald-900/30">
                             <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${scanProgress}%` }} />
                          </div>
                       </div>
                       
                       <div className="space-y-1 w-full max-w-lg opacity-40">
                          <p className="animate-pulse">>> INJECTING HEURISTIC PAYLOADS...</p>
                          <p className="animate-pulse delay-75">>> BRUTE-FORCING AES BLOCK 0x242A...</p>
                          <p className="animate-pulse delay-150">>> MAPPING HIDDEN SYSTEM PARTITIONS...</p>
                          <p className="animate-pulse delay-300 text-emerald-400">>> DATA STREAM CAPTURED.</p>
                       </div>
                    </div>
                  ) : extractionResult ? (
                    <div className="prose prose-invert max-w-none text-emerald-100/80 leading-relaxed whitespace-pre-wrap">
                       {extractionResult}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-700 opacity-20 space-y-4">
                       <Search size={48} />
                       <p className="uppercase tracking-widest font-black text-[10px]">Awaiting handshake signal</p>
                    </div>
                  )}
               </div>
            </div>

            {/* Bottom Info Panels */}
            <div className="grid grid-cols-3 gap-4 mt-6">
               <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2 text-blue-400">
                     <HardDrive size={14} />
                     <span className="text-[10px] font-black uppercase">IO Throughput</span>
                  </div>
                  <div className="flex items-end gap-2">
                     <span className="text-2xl font-tech font-bold text-white">4.2</span>
                     <span className="text-xs text-gray-500 font-mono mb-1">GB/s</span>
                  </div>
               </div>
               <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2 text-amber-400">
                     <ShieldAlert size={14} />
                     <span className="text-[10px] font-black uppercase">Intel Value</span>
                  </div>
                  <div className="flex items-end gap-2">
                     <span className="text-2xl font-tech font-bold text-white">HIGH</span>
                  </div>
               </div>
               <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2 text-emerald-400">
                     <Lock size={14} />
                     <span className="text-[10px] font-black uppercase">Obfuscation</span>
                  </div>
                  <div className="flex items-end gap-2">
                     <span className="text-2xl font-tech font-bold text-white">94%</span>
                     <span className="text-[10px] text-emerald-500 font-mono mb-1">BYPASSED</span>
                  </div>
               </div>
            </div>
          </div>
        )}
      </GlassCard>

      {/* Floating Alert for "Secret Data" detection */}
      {extractionResult.toLowerCase().includes('secret') && !isExtracting && (
         <div className="fixed bottom-10 right-10 z-[100] animate-in zoom-in slide-in-from-right-10 duration-500">
            <div className="bg-red-600 border border-red-400 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-4 ring-4 ring-red-600/20">
               <div className="bg-white/20 p-2 rounded-xl">
                  <FileWarning className="animate-pulse" />
               </div>
               <div>
                  <h5 className="font-tech font-bold tracking-widest leading-none">REDACTED INTEL FOUND</h5>
                  <p className="text-[10px] opacity-80 uppercase tracking-tighter mt-1 font-mono">Hidden partitions accessed successfully</p>
               </div>
               <button onClick={() => setExtractionResult('')} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                  <X size={16} />
               </button>
            </div>
         </div>
      )}
    </div>
  );
};

// Simple X icon missing from previous list
const X: React.FC<{size?: number}> = ({size = 16}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);