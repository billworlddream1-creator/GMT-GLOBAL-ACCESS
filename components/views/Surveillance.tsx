import React, { useEffect, useRef, useState } from 'react';
import { GlassCard } from '../GlassCard';
import { Eye, EyeOff, Camera, Aperture, Target, Zap, Shield, Maximize2, ZoomIn, ZoomOut, Sun, Moon, Thermometer, Scan, AlertCircle } from 'lucide-react';

type FilterMode = 'NORMAL' | 'NIGHT' | 'THERMAL' | 'SECURITY';

interface Detection {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
}

export const Surveillance: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [streamActive, setStreamActive] = useState(false);
  const [error, setError] = useState<string>('');
  const [filterMode, setFilterMode] = useState<FilterMode>('NORMAL');
  const [zoom, setZoom] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [lastCapture, setLastCapture] = useState<string | null>(null);

  // Initialize Camera
  useEffect(() => {
    let stream: MediaStream | null = null;
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setStreamActive(true);
        }
      } catch (err) {
        setError('OPTICAL SENSORS OFFLINE / ACCESS DENIED');
      }
    };
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Simulated AI Object Detection
  useEffect(() => {
    if (!streamActive) return;
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const labels = ['HUMAN', 'VEHICLE', 'UNIDENTIFIED', 'MOBILE_NODE', 'THREAT_ALPHA'];
        const newDetection: Detection = {
          id: Math.random().toString(36).substr(2, 5),
          label: labels[Math.floor(Math.random() * labels.length)],
          x: 20 + Math.random() * 60,
          y: 20 + Math.random() * 60,
          width: 10 + Math.random() * 20,
          height: 15 + Math.random() * 30,
          confidence: 0.85 + Math.random() * 0.14
        };
        setDetections(prev => [...prev.slice(-2), newDetection]);
      } else if (Math.random() > 0.8) {
        setDetections([]);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [streamActive]);

  const handleCapture = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Apply filters to canvas if needed, or just grab raw
      ctx.drawImage(videoRef.current, 0, 0);
      setLastCapture(canvas.toDataURL('image/jpeg'));
      // Flash effect
      const overlay = document.getElementById('flash-overlay');
      if (overlay) {
        overlay.style.opacity = '1';
        setTimeout(() => overlay.style.opacity = '0', 100);
      }
    }
  };

  const getFilterStyles = () => {
    switch (filterMode) {
      case 'NIGHT': return 'sepia(1) hue-rotate(60deg) brightness(1.4) contrast(1.2) saturate(2)';
      case 'THERMAL': return 'invert(1) hue-rotate(180deg) saturate(3) contrast(1.5)';
      case 'SECURITY': return 'grayscale(1) contrast(1.5) brightness(0.8)';
      default: return 'none';
    }
  };

  return (
    <div className="space-y-6 h-full">
      <GlassCard title="Optical Feed // LIVE" className="relative h-[calc(100vh-180px)] overflow-hidden p-0">
        <div id="flash-overlay" className="absolute inset-0 z-[100] bg-white opacity-0 transition-opacity pointer-events-none" />
        
        <div className="absolute inset-0 bg-black">
          {error ? (
            <div className="flex h-full flex-col items-center justify-center text-red-500">
              <EyeOff className="mb-4 h-16 w-16" />
              <p className="font-tech text-xl tracking-widest">{error}</p>
              <p className="mt-2 text-xs text-gray-400">HARDWARE INITIALIZATION FAILED</p>
            </div>
          ) : (
            <>
              <div className="h-full w-full overflow-hidden">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  className="h-full w-full object-cover transition-all duration-500"
                  style={{ 
                    filter: getFilterStyles(),
                    transform: `scale(${zoom})`
                  }}
                />
              </div>
              
              {/* HUD Overlay */}
              <div className="pointer-events-none absolute inset-0">
                {/* Simulated Scanline */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[size:100%_4px,3px_100%]" />
                
                {/* Detection Bounding Boxes */}
                {detections.map(d => (
                  <div 
                    key={d.id}
                    className="absolute border-2 border-red-500/50 transition-all duration-700 ease-out"
                    style={{ 
                      left: `${d.x}%`, 
                      top: `${d.y}%`, 
                      width: `${d.width}%`, 
                      height: `${d.height}%` 
                    }}
                  >
                    <div className="absolute -top-6 left-0 flex items-center gap-1 bg-red-500 px-2 py-0.5 text-[10px] font-black text-black">
                      <Scan size={10} />
                      {d.label} ({(d.confidence * 100).toFixed(0)}%)
                    </div>
                    <div className="absolute -bottom-1 -right-1 h-2 w-2 border-b-2 border-r-2 border-red-500" />
                    <div className="absolute -top-1 -left-1 h-2 w-2 border-t-2 border-l-2 border-red-500" />
                  </div>
                ))}

                {/* Grid & Vignette */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:100px_100px]" />
                <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.9)]" />

                {/* Central Reticle */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                   <Target className={`h-48 w-48 transition-colors duration-500 ${filterMode === 'NIGHT' ? 'text-emerald-500/20' : filterMode === 'THERMAL' ? 'text-red-500/20' : 'text-emerald-500/10'}`} strokeWidth={0.5} />
                   <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-500/50 animate-ping" />
                </div>

                {/* Top Readout */}
                <div className="absolute left-10 top-10 flex items-center gap-6 font-mono text-[10px] text-emerald-400">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
                    <span>REC MODE: {filterMode}</span>
                  </div>
                  <span>ZOOM: {zoom.toFixed(1)}X</span>
                  <span>FPS: 60.0</span>
                  <span>LATENCY: 4.2ms</span>
                </div>

                {/* Right Data Sidebar */}
                <div className="absolute right-12 top-24 space-y-4 text-right font-mono text-[10px] text-emerald-400/70">
                   <div className="space-y-1">
                      <p className="font-bold text-white">ENVIRONMENTAL</p>
                      <p>TEMP: 22.4°C</p>
                      <p>HUMIDITY: 42%</p>
                      <p>O2: 20.9%</p>
                   </div>
                   <div className="space-y-1">
                      <p className="font-bold text-white">OPTICAL_UNIT_04</p>
                      <p>LENS: 35mm F/1.4G</p>
                      <p>FOCUS: AUTOFOCUS_AI</p>
                      <p>BITRATE: 12.4 Mbps</p>
                   </div>
                </div>

                {/* Active Alerts */}
                {detections.length > 0 && (
                  <div className="absolute bottom-24 left-10 animate-bounce">
                    <div className="flex items-center gap-2 rounded-lg bg-red-600/20 border border-red-600/50 px-3 py-2 text-red-500 font-bold text-xs tracking-widest uppercase">
                      <AlertCircle size={16} /> Object Trace Detected
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Floating Capture Preview */}
        {lastCapture && (
          <div className="absolute right-6 bottom-32 w-24 h-24 border-2 border-emerald-500/30 rounded-lg overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <img src={lastCapture} className="w-full h-full object-cover" alt="Capture preview" />
            <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <span className="text-[10px] font-black text-black bg-emerald-400 px-1">SAVED</span>
            </div>
          </div>
        )}

        {/* Controls Console */}
        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-3 rounded-2xl border border-white/10 bg-black/80 p-2 backdrop-blur-xl shadow-2xl ring-1 ring-white/5">
           {/* Zoom Controls */}
           <div className="flex items-center border-r border-white/10 pr-2 mr-2">
             <button onClick={() => setZoom(prev => Math.max(1, prev - 0.2))} className="p-2.5 text-gray-400 hover:text-white transition-colors"><ZoomOut size={18}/></button>
             <button onClick={() => setZoom(prev => Math.min(4, prev + 0.2))} className="p-2.5 text-gray-400 hover:text-white transition-colors"><ZoomIn size={18}/></button>
           </div>

           {/* Mode Toggles */}
           <button 
             onClick={() => setFilterMode('NORMAL')}
             title="Visible Spectrum"
             className={`p-2.5 rounded-xl transition-all ${filterMode === 'NORMAL' ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
           >
             <Sun size={20} />
           </button>
           <button 
             onClick={() => setFilterMode('NIGHT')}
             title="Night Vision"
             className={`p-2.5 rounded-xl transition-all ${filterMode === 'NIGHT' ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
           >
             <Moon size={20} />
           </button>
           <button 
             onClick={() => setFilterMode('THERMAL')}
             title="Thermal Spectrum"
             className={`p-2.5 rounded-xl transition-all ${filterMode === 'THERMAL' ? 'bg-red-500 text-black shadow-[0_0_15px_rgba(239,68,68,0.4)]' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
           >
             <Thermometer size={20} />
           </button>
           <button 
             onClick={() => setFilterMode('SECURITY')}
             title="High-Contrast Security"
             className={`p-2.5 rounded-xl transition-all ${filterMode === 'SECURITY' ? 'bg-blue-500 text-black shadow-[0_0_15px_rgba(59,130,246,0.4)]' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
           >
             <Shield size={20} />
           </button>

           <div className="w-px bg-white/10 mx-1" />

           {/* Action Buttons */}
           <button 
             onClick={handleCapture}
             title="Capture Frame"
             className="p-2.5 rounded-xl text-emerald-400 hover:bg-emerald-500/20 transition-all active:scale-90"
           >
             <Camera size={20} />
           </button>
           <button 
             onClick={() => setIsRecording(!isRecording)}
             title={isRecording ? "Stop Recording" : "Start Recording"}
             className={`p-2.5 rounded-xl transition-all ${isRecording ? 'bg-red-500 text-black animate-pulse' : 'text-red-500 hover:bg-red-500/10'}`}
           >
             <div className={`h-5 w-5 rounded-full border-2 ${isRecording ? 'bg-black border-black' : 'border-red-500'}`} />
           </button>
        </div>
      </GlassCard>

      {/* Sensor Metadata Bar */}
      <GlassCard className="flex items-center justify-between opacity-80 py-3">
          <div className="flex gap-8 text-[10px] font-mono text-gray-500 uppercase tracking-widest">
            <div className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> SENSOR_A: VERIFIED</div>
            <div className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> SYNC_CLOCK: 0.00ms</div>
            <div className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" /> UPLINK: STABLE</div>
          </div>
          <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase">
            <Maximize2 size={12} />
            Full Spectrum Access
          </div>
      </GlassCard>
    </div>
  );
};