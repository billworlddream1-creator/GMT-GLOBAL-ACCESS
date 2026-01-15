import React, { useEffect, useState } from 'react';
import { GlassCard } from '../GlassCard';
import { Activity, Battery, Compass, Cpu, Zap, AlertTriangle, Thermometer } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';

interface SensorData {
  x: number;
  y: number;
  z: number;
  alpha: number;
  beta: number;
  gamma: number;
}

export const DeviceSensors: React.FC = () => {
  const [batteryLevel, setBatteryLevel] = useState<number>(100);
  const [isCharging, setIsCharging] = useState<boolean>(true);
  const [sensors, setSensors] = useState<SensorData>({ x: 0, y: 0, z: 0, alpha: 0, beta: 0, gamma: 0 });
  const [cpuLoad, setCpuLoad] = useState<{val: number, time: number}[]>([]);
  const [alert, setAlert] = useState<string | null>(null);

  useEffect(() => {
    // Battery API Check (Safe fallback)
    if ((navigator as any).getBattery) {
      (navigator as any).getBattery().then((battery: any) => {
        const updateBattery = () => {
          setBatteryLevel(Math.floor(battery.level * 100));
          setIsCharging(battery.charging);
        };
        updateBattery();
        battery.addEventListener('levelchange', updateBattery);
        battery.addEventListener('chargingchange', updateBattery);
      });
    } else {
        // Mock simulation if Battery API not supported
        const interval = setInterval(() => {
            setBatteryLevel(prev => Math.max(0, prev - (Math.random() > 0.8 ? 1 : 0)));
        }, 5000);
        return () => clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    // Simulate Accelerometer/Gyro/CPU Load
    const interval = setInterval(() => {
      setSensors(prev => ({
        x: Number((Math.sin(Date.now() / 1000) * 9.8).toFixed(2)),
        y: Number((Math.cos(Date.now() / 1000) * 9.8).toFixed(2)),
        z: Number((Math.sin(Date.now() / 2000) * 2).toFixed(2)),
        alpha: Math.floor(Math.random() * 360),
        beta: Math.floor(Math.random() * 180 - 90),
        gamma: Math.floor(Math.random() * 180 - 90)
      }));

      setCpuLoad(prev => {
        const newVal = Math.floor(Math.random() * 60) + 30; // 30-90% simulated load
        
        // Trigger alert if load is high
        if (newVal > 85) {
          setAlert("CRITICAL CPU LOAD DETECTED");
        } else if (newVal > 70) {
           setAlert("HIGH TEMPERATURE WARNING");
        } else {
          setAlert(null);
        }

        const newArr = [...prev, { val: newVal, time: Date.now() }];
        return newArr.slice(-30); // Keep last 30 points
      });

    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Alert Banner */}
      {alert && (
         <div className="flex w-full items-center justify-center gap-3 rounded-xl border border-red-500/50 bg-red-500/10 p-4 text-red-400 animate-pulse">
            <AlertTriangle className="h-6 w-6" />
            <span className="font-tech text-lg font-bold tracking-widest">{alert}</span>
         </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Battery Module */}
        <GlassCard title="Power Management">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="relative mb-4">
               <Battery className={`h-32 w-32 ${batteryLevel < 20 ? 'text-red-500' : 'text-emerald-400'}`} />
               <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-white">
                 {batteryLevel}%
               </div>
            </div>
            <div className="flex items-center gap-2">
                {isCharging ? (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400">
                        <Zap className="h-3 w-3 fill-current" /> CHARGING
                    </span>
                ) : (
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-gray-400">
                        DISCHARGING
                    </span>
                )}
            </div>
            <div className="mt-6 grid w-full grid-cols-2 gap-4 text-center">
                <div className="rounded bg-white/5 p-2">
                    <div className="text-[10px] text-gray-400">VOLTAGE</div>
                    <div className="font-mono text-lg text-white">3.8 V</div>
                </div>
                <div className="rounded bg-white/5 p-2">
                    <div className="text-[10px] text-gray-400">TEMP</div>
                    <div className="font-mono text-lg text-white">32°C</div>
                </div>
            </div>
          </div>
        </GlassCard>

        {/* Gyroscope / Accelerometer */}
        <GlassCard title="Inertial Measurement Unit">
            <div className="grid h-full grid-cols-1 gap-4">
                <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <span className="flex items-center gap-2 text-gray-400"><Compass className="h-4 w-4"/> X-AXIS</span>
                        <span className="font-mono text-emerald-400">{sensors.x} m/s²</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <span className="flex items-center gap-2 text-gray-400"><Compass className="h-4 w-4"/> Y-AXIS</span>
                        <span className="font-mono text-emerald-400">{sensors.y} m/s²</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <span className="flex items-center gap-2 text-gray-400"><Compass className="h-4 w-4"/> Z-AXIS</span>
                        <span className="font-mono text-emerald-400">{sensors.z} m/s²</span>
                    </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-lg bg-white/5 p-2">
                        <div className="text-[10px] text-gray-500">PITCH</div>
                        <div className="font-mono text-lg text-white">{sensors.beta}°</div>
                    </div>
                    <div className="rounded-lg bg-white/5 p-2">
                        <div className="text-[10px] text-gray-500">ROLL</div>
                        <div className="font-mono text-lg text-white">{sensors.gamma}°</div>
                    </div>
                    <div className="rounded-lg bg-white/5 p-2">
                        <div className="text-[10px] text-gray-500">YAW</div>
                        <div className="font-mono text-lg text-white">{sensors.alpha}°</div>
                    </div>
                </div>
            </div>
        </GlassCard>

        {/* System Load */}
        <GlassCard title="Core Processing Load">
            <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={cpuLoad}>
                        <defs>
                            <linearGradient id="cpuColor" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={alert ? "#ef4444" : "#3b82f6"} stopOpacity={0.8}/>
                                <stop offset="95%" stopColor={alert ? "#ef4444" : "#3b82f6"} stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <YAxis hide domain={[0, 100]} />
                        <Area 
                            type="monotone" 
                            dataKey="val" 
                            stroke={alert ? "#ef4444" : "#3b82f6"} 
                            strokeWidth={2} 
                            fillOpacity={1} 
                            fill="url(#cpuColor)" 
                            isAnimationActive={false} 
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {alert ? <Thermometer className="h-5 w-5 text-red-500 animate-bounce" /> : <Cpu className="h-5 w-5 text-blue-400" />}
                    <span className="text-sm text-gray-400">CPU LOAD</span>
                </div>
                <span className={`font-mono text-2xl font-bold ${alert ? 'text-red-500' : 'text-white'}`}>
                    {cpuLoad[cpuLoad.length - 1]?.val || 0}%
                </span>
            </div>
        </GlassCard>
      </div>
      
      {/* Device Info Footer */}
      <GlassCard className="flex items-center justify-between opacity-80">
          <div className="flex gap-8 text-xs text-gray-500 uppercase tracking-widest">
            <span>Platform: <span className="text-gray-300">{navigator.platform}</span></span>
            <span>Cores: <span className="text-gray-300">{navigator.hardwareConcurrency}</span></span>
            <span>Memory: <span className="text-gray-300">{(navigator as any).deviceMemory || 'N/A'} GB</span></span>
          </div>
          <Activity className="h-4 w-4 animate-pulse text-emerald-500" />
      </GlassCard>
    </div>
  );
};