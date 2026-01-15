import React, { useEffect, useState, useRef, useMemo } from 'react';
import { GlassCard } from '../GlassCard';
import { Crosshair, MapPin, Navigation, Radar, Maximize2, X, Search, Filter, ZoomIn, ZoomOut, RotateCcw, ChevronRight } from 'lucide-react';

interface Target {
  id: string;
  lat: number;
  lng: number;
  speed: number;
  heading: number;
  status: 'ACTIVE' | 'IDLE' | 'LOST';
  name: string;
  history: { x: number, y: number }[];
}

export const LocationTracker: React.FC = () => {
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'IDLE' | 'LOST'>('ALL');
  
  // Map State
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const mapRef = useRef<HTMLDivElement>(null);

  const [targets, setTargets] = useState<Target[]>([
    { id: 'T-01', lat: 40.7128, lng: -74.0060, speed: 45, heading: 120, status: 'ACTIVE', name: 'Asset Alpha', history: [] },
    { id: 'T-02', lat: 51.5074, lng: -0.1278, speed: 0, heading: 0, status: 'IDLE', name: 'Asset Bravo', history: [] },
    { id: 'T-03', lat: 35.6762, lng: 139.6503, speed: 88, heading: 240, status: 'ACTIVE', name: 'Target X', history: [] },
    { id: 'T-04', lat: 48.8566, lng: 2.3522, speed: 12, heading: 45, status: 'ACTIVE', name: 'Courier 9', history: [] },
    { id: 'T-05', lat: -33.8688, lng: 151.2093, speed: 0, heading: 0, status: 'LOST', name: 'Ghost Node', history: [] },
  ]);

  // Simulate movement
  useEffect(() => {
    const interval = setInterval(() => {
      setTargets(prev => prev.map((t, idx) => {
        if (t.status === 'ACTIVE') {
          // Calculate arbitrary map coordinates for visualization (0-100 scale)
          const baseX = 50 + (idx === 0 ? Math.sin(Date.now() / 1500) * 30 : idx === 2 ? Math.cos(Date.now() / 2000) * 25 : Math.sin(Date.now() / 3000) * 40);
          const baseY = 50 + (idx === 0 ? Math.cos(Date.now() / 1500) * 15 : idx === 2 ? Math.sin(Date.now() / 2000) * 20 : Math.cos(Date.now() / 3000) * 10);
          
          const newPos = { x: baseX, y: baseY };
          const newHistory = [...t.history, newPos].slice(-30);

          return {
            ...t,
            lat: t.lat + (Math.random() - 0.5) * 0.01,
            lng: t.lng + (Math.random() - 0.5) * 0.01,
            speed: Math.max(5, t.speed + (Math.random() - 0.5) * 8),
            heading: (t.heading + (Math.random() - 0.5) * 15 + 360) % 360,
            history: newHistory
          };
        }
        return t;
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Filtered Targets
  const filteredTargets = useMemo(() => {
    return targets.filter(t => {
      const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [targets, searchQuery, statusFilter]);

  const selectedTarget = targets.find(t => t.id === selectedTargetId);

  // Map Controls
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.min(5, Math.max(0.5, prev * delta)));
  };

  const resetMap = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className="grid h-full grid-cols-1 gap-6 lg:grid-cols-4">
      {/* Target Control Panel */}
      <GlassCard title="Signal Logistics" className="lg:col-span-1 flex flex-col h-[700px]">
        <div className="space-y-4 mb-4">
          <div className="relative">
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search assets..."
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm font-mono text-emerald-400 focus:outline-none focus:border-emerald-500/50"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          </div>

          <div className="flex flex-wrap gap-2">
            {(['ALL', 'ACTIVE', 'IDLE', 'LOST'] as const).map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-2 py-1 rounded text-[10px] font-bold tracking-widest border transition-all
                ${statusFilter === s ? 'bg-emerald-500 border-emerald-500 text-black' : 'bg-white/5 border-white/10 text-gray-500 hover:text-white'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
          {filteredTargets.map(target => (
            <div 
              key={target.id} 
              onClick={() => setSelectedTargetId(target.id)}
              className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-all duration-200 group
                ${selectedTargetId === target.id 
                  ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                  : 'border-white/5 bg-white/5 hover:border-emerald-500/30 hover:bg-white/10'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`h-2 w-2 rounded-full ${target.status === 'ACTIVE' ? 'bg-emerald-500 animate-pulse' : target.status === 'LOST' ? 'bg-red-500' : 'bg-amber-500'}`} />
                <div>
                  <div className="font-tech font-bold text-white text-sm">{target.name}</div>
                  <div className="font-mono text-[10px] text-gray-500 uppercase">{target.id}</div>
                </div>
              </div>
              <ChevronRight size={14} className={`text-gray-600 group-hover:text-emerald-500 transition-transform ${selectedTargetId === target.id ? 'rotate-90 text-emerald-500' : ''}`} />
            </div>
          ))}
          {filteredTargets.length === 0 && (
            <div className="text-center py-10 opacity-30 font-tech uppercase text-xs">No matching signals</div>
          )}
        </div>

        {selectedTarget && (
          <div className="mt-4 pt-4 border-t border-white/10 animate-in fade-in slide-in-from-bottom-2">
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
              <div className="bg-white/5 p-2 rounded border border-white/5">
                <span className="text-gray-500 block uppercase mb-1">Velocity</span>
                <span className="text-emerald-400 font-bold">{Math.round(selectedTarget.speed)} KM/H</span>
              </div>
              <div className="bg-white/5 p-2 rounded border border-white/5">
                <span className="text-gray-500 block uppercase mb-1">Bearing</span>
                <span className="text-blue-400 font-bold">{Math.round(selectedTarget.heading)}° N</span>
              </div>
            </div>
          </div>
        )}
      </GlassCard>

      {/* Tactical Grid Visualization */}
      <GlassCard className="relative overflow-hidden p-0 lg:col-span-3 h-[700px]" title="Tactical Grid - Asset Distribution">
        {/* Map Controls Overlay */}
        <div className="absolute top-4 left-4 z-50 flex flex-col gap-2">
           <button onClick={() => setZoom(prev => Math.min(5, prev + 0.2))} className="p-2 bg-black/60 border border-white/10 rounded-lg text-emerald-400 hover:bg-white/10" title="Zoom In"><ZoomIn size={18}/></button>
           <button onClick={() => setZoom(prev => Math.max(0.5, prev - 0.2))} className="p-2 bg-black/60 border border-white/10 rounded-lg text-emerald-400 hover:bg-white/10" title="Zoom Out"><ZoomOut size={18}/></button>
           <button onClick={resetMap} className="p-2 bg-black/60 border border-white/10 rounded-lg text-amber-400 hover:bg-white/10" title="Reset Map"><RotateCcw size={18}/></button>
        </div>

        <div 
          ref={mapRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          className="absolute inset-0 bg-black cursor-grab active:cursor-grabbing select-none"
          style={{ transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)` }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedTargetId(null);
          }}
        >
           {/* Grid Lines */}
           <div className="absolute inset-[-200%] bg-[linear-gradient(#333_1px,transparent_1px),linear-gradient(90deg,#333_1px,transparent_1px)] bg-[size:50px_50px] opacity-10 pointer-events-none" />
           
           {/* Radar Sweep Effect (Fixed at center of viewport relative) */}
           <div className="absolute left-1/2 top-1/2 h-[2000px] w-[2000px] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,transparent_0deg,transparent_270deg,rgba(16,185,129,0.03)_360deg)] animate-[spin_6s_linear_infinite] pointer-events-none" />

           {/* Trail Visualizations */}
           <svg className="absolute inset-0 h-full w-full pointer-events-none overflow-visible">
             {targets.map(t => (
               t.history.length > 1 && (
                 <polyline 
                   key={`trail-${t.id}`}
                   points={t.history.map(p => `${p.x}%,${p.y}%`).join(' ')}
                   fill="none"
                   stroke={selectedTargetId === t.id ? "#10b981" : "#ffffff15"}
                   strokeWidth={selectedTargetId === t.id ? 2 : 1}
                   strokeOpacity={selectedTargetId === t.id ? 0.6 : 0.3}
                   strokeDasharray={selectedTargetId === t.id ? "0" : "5,5"}
                 />
               )
             ))}
           </svg>

           {/* Asset Markers */}
           {targets.map((target, idx) => {
              const lastPos = target.history[target.history.length - 1] || { x: 50, y: 50 };
              const isSelected = selectedTargetId === target.id;
              
              // Hide if filtered out but keep in state for smooth transitions
              const isVisible = filteredTargets.some(ft => ft.id === target.id);

              return (
               <div 
                 key={target.id}
                 onClick={(e) => { e.stopPropagation(); setSelectedTargetId(target.id); }}
                 className={`absolute flex flex-col items-center transition-all duration-300 ease-out cursor-pointer group 
                    ${isSelected ? 'z-50' : 'z-10'}
                    ${isVisible ? 'opacity-100' : 'opacity-0 scale-50 pointer-events-none'}
                 `}
                 style={{
                   left: `${lastPos.x}%`,
                   top: `${lastPos.y}%`,
                   transform: `translate(-50%, -50%) scale(${1 / Math.sqrt(zoom)})` // Adjust marker size based on zoom
                 }}
               >
                  <div className="relative">
                    {/* Background target ring */}
                    <div className={`absolute -inset-4 rounded-full border transition-all duration-500
                       ${isSelected ? 'border-emerald-500 scale-125 opacity-100 animate-pulse' : 'border-white/5 opacity-0 scale-50'}
                    `} />
                    
                    {/* Target Icon */}
                    <div className={`relative flex items-center justify-center p-1 rounded-full border transition-all duration-300
                      ${isSelected ? 'bg-emerald-500 text-black border-emerald-400' : 'bg-black/80 text-gray-400 border-white/10 group-hover:border-emerald-500/50'}
                    `}>
                       {target.status === 'LOST' ? <X size={16} /> : <Crosshair size={16} />}
                    </div>

                    {/* Direction Arrow */}
                    {isSelected && target.status === 'ACTIVE' && (
                      <div 
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                        style={{ transform: `translate(-50%, -50%) rotate(${target.heading}deg)` }}
                      >
                         <Navigation 
                           className="text-emerald-400 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)] translate-y-[-24px]" 
                           size={14} 
                           fill="currentColor" 
                         />
                      </div>
                    )}
                  </div>

                  {/* Info Tag */}
                  {(isSelected || zoom > 2) && (
                    <div className={`mt-2 px-2 py-0.5 rounded text-[8px] font-mono font-bold whitespace-nowrap border transition-all
                      ${isSelected ? 'bg-emerald-500 text-black border-emerald-400 translate-y-1 shadow-lg shadow-emerald-500/20' : 'bg-black/80 text-gray-300 border-white/10'}
                    `}>
                      {target.id} // {Math.round(target.speed)} KM/H
                    </div>
                  )}
               </div>
             );
           })}
        </div>
        
        {/* Status Legends */}
        <div className="absolute bottom-4 left-4 flex flex-col gap-2 font-mono text-[10px] uppercase tracking-tighter bg-black/60 p-3 rounded-lg border border-white/10 backdrop-blur-sm pointer-events-none">
           <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Asset Active</div>
           <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-amber-500" /> Asset Idle</div>
           <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-red-500" /> Signal Lost</div>
           <div className="mt-2 text-[8px] text-gray-500">ZOOM: {zoom.toFixed(1)}x // LATENCY: 12ms</div>
        </div>

        {/* Selected Target Deep Readout Overlay */}
        {selectedTarget && (
          <div className="absolute bottom-4 right-4 w-72 animate-in slide-in-from-bottom-4 duration-300">
             <div className="rounded-xl border border-emerald-500/30 bg-black/90 p-5 backdrop-blur-2xl shadow-2xl ring-1 ring-emerald-500/20">
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Radar className="text-emerald-400 h-5 w-5" />
                    <span className="font-tech font-bold text-white text-lg tracking-wider">{selectedTarget.id}</span>
                  </div>
                  <button onClick={() => setSelectedTargetId(null)} className="text-gray-500 hover:text-white transition-colors"><X size={18}/></button>
                </div>
                
                <div className="space-y-3 font-mono text-[11px]">
                  <div className="flex justify-between items-center py-1 border-b border-white/5">
                    <span className="text-gray-500">DESIGNATION</span>
                    <span className="text-white font-bold">{selectedTarget.name}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-white/5">
                    <span className="text-gray-500">COORDINATES</span>
                    <span className="text-emerald-400">{selectedTarget.lat.toFixed(5)}N, {selectedTarget.lng.toFixed(5)}E</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-white/5">
                    <span className="text-gray-500">VELOCITY</span>
                    <span className="text-blue-400">{Math.round(selectedTarget.speed)} KM/H</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-white/5">
                    <span className="text-gray-500">BEARING</span>
                    <span className="text-blue-400">{Math.round(selectedTarget.heading)}° TRUE NORTH</span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-gray-500">LINK STATUS</span>
                    <span className={`font-bold ${selectedTarget.status === 'ACTIVE' ? 'text-emerald-500' : 'text-amber-500'}`}>{selectedTarget.status}</span>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2">
                  <button className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600/10 py-2.5 text-xs font-bold text-emerald-400 hover:bg-emerald-600/20 border border-emerald-600/30 transition-all">
                    <Maximize2 size={12} /> PIN POINT
                  </button>
                  <button className="flex items-center justify-center gap-2 rounded-lg bg-white/5 py-2.5 text-xs font-bold text-white hover:bg-white/10 transition-all">
                    <Navigation size={12} /> INTERCEPT
                  </button>
                </div>
             </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
};