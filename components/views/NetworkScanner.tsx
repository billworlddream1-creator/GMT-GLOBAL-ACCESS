import React, { useEffect, useState } from 'react';
import { GlassCard } from '../GlassCard';
import { Radar, RadialBarChart, RadialBar, Legend, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid, BarChart, Bar } from 'recharts';
import { Wifi, Radio, Signal, ShieldCheck, Laptop, Smartphone, Router, Server, Users, Globe, ArrowUpRight } from 'lucide-react';

interface NetworkNode {
  id: string;
  name: string;
  ip: string;
  mac: string;
  signal: number;
  latency: number;
  type: 'MOBILE' | 'DESKTOP' | 'SERVER' | 'IOT';
}

const initialNodes: NetworkNode[] = [
  { id: '1', name: 'Gateway-Alpha', ip: '192.168.1.1', mac: '00:1A:2B:3C:4D:5E', signal: 98, latency: 2, type: 'SERVER' },
  { id: '2', name: 'Workstation-Prime', ip: '192.168.1.105', mac: 'A1:B2:C3:D4:E5:F6', signal: 85, latency: 12, type: 'DESKTOP' },
  { id: '3', name: 'Mobile-Unit-7', ip: '192.168.1.142', mac: '11:22:33:44:55:66', signal: 62, latency: 45, type: 'MOBILE' },
  { id: '4', name: 'IoT-Sensor-Cluster', ip: '192.168.1.201', mac: 'AA:BB:CC:DD:EE:FF', signal: 78, latency: 24, type: 'IOT' },
];

const trafficHistory = {
  Day: Array.from({ length: 24 }, (_, i) => ({ name: `${i}h`, visitors: Math.floor(Math.random() * 500) + 100 })),
  Week: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => ({ name: d, visitors: Math.floor(Math.random() * 3000) + 1000 })),
  Month: Array.from({ length: 30 }, (_, i) => ({ name: `D${i+1}`, visitors: Math.floor(Math.random() * 4000) + 2000 })),
  Year: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => ({ name: m, visitors: Math.floor(Math.random() * 50000) + 20000 })),
};

export const NetworkScanner: React.FC = () => {
  const [trafficData, setTrafficData] = useState(Array.from({ length: 20 }, (_, i) => ({
    name: `T-${i}`,
    signal: Math.floor(Math.random() * 30) + 70,
    latency: Math.floor(Math.random() * 40) + 5,
  })));
  const [nodes, setNodes] = useState<NetworkNode[]>(initialNodes);
  const [timeScale, setTimeScale] = useState<'Day' | 'Week' | 'Month' | 'Year'>('Day');

  useEffect(() => {
    const interval = setInterval(() => {
      setTrafficData(prev => {
        const newData = [...prev.slice(1), {
          name: `T-${Date.now()}`,
          signal: Math.floor(Math.random() * 30) + 60,
          latency: Math.floor(Math.random() * 50) + 10,
        }];
        return newData;
      });

      setNodes(prev => prev.map(node => ({
        ...node,
        signal: Math.min(100, Math.max(0, node.signal + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 5))),
        latency: Math.max(1, node.latency + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3))
      })));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const deviceDistribution = [
    { name: 'Servers', count: nodes.filter(n => n.type === 'SERVER').length * 100, fill: '#34d399' },
    { name: 'Desktops', count: nodes.filter(n => n.type === 'DESKTOP').length * 100, fill: '#10b981' },
    { name: 'Mobile', count: nodes.filter(n => n.type === 'MOBILE').length * 100, fill: '#059669' },
    { name: 'IoT', count: nodes.filter(n => n.type === 'IOT').length * 100, fill: '#047857' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { icon: Globe, label: 'Internet Status', val: 'STABLE', color: 'text-emerald-400' },
          { icon: Users, label: 'Current Users', val: '1,242', color: 'text-blue-400' },
          { icon: Signal, label: 'Traffic Bandwidth', val: '4.2 TB/s', color: 'text-amber-400' },
          { icon: ShieldCheck, label: 'Packet Integrity', val: '99.9%', color: 'text-emerald-400' },
        ].map((item, idx) => (
          <GlassCard key={idx} className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase text-gray-400">{item.label}</p>
              <p className={`font-mono text-2xl font-bold ${item.color}`}>{item.val}</p>
            </div>
            <item.icon className={`h-8 w-8 ${item.color} opacity-50`} />
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <GlassCard className="col-span-1 md:col-span-2 min-h-[400px]" title="Network Mass Spectrum">
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={trafficData}>
              <defs>
                <linearGradient id="colorSignal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="name" hide />
              <YAxis hide />
              <Tooltip contentStyle={{ backgroundColor: '#000000aa', backdropFilter: 'blur(10px)', border: '1px solid #333' }} />
              <Area type="monotone" dataKey="signal" stroke="#34d399" fillOpacity={1} fill="url(#colorSignal)" />
              <Area type="monotone" dataKey="latency" stroke="#ef4444" fillOpacity={0} />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard title="Node Distribution" className="min-h-[400px]">
           <ResponsiveContainer width="100%" height={350}>
            <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" barSize={15} data={deviceDistribution}>
              <RadialBar background={{ fill: '#ffffff10' }} dataKey="count" />
              <Legend iconSize={10} layout="vertical" verticalAlign="middle" />
            </RadialBarChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      <GlassCard title="Global Traffic & Visitors" action={
        <div className="flex gap-2">
          {(['Day', 'Week', 'Month', 'Year'] as const).map(s => (
            <button key={s} onClick={() => setTimeScale(s)} className={`px-2 py-1 rounded text-[10px] font-bold ${timeScale === s ? 'bg-emerald-500 text-black' : 'bg-white/5 text-gray-500'}`}>
              {s.toUpperCase()}
            </button>
          ))}
        </div>
      }>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trafficHistory[timeScale]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#4b5563', fontSize: 10}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#4b5563', fontSize: 10}} />
              <Tooltip cursor={{fill: '#ffffff05'}} contentStyle={{ backgroundColor: '#000000dd', border: '1px solid #ffffff10' }} />
              <Bar dataKey="visitors" fill="#10b981" radius={[4, 4, 0, 0]} opacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      <GlassCard title="Active Signal Points">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm font-mono">
            <thead>
              <tr className="border-b border-white/10 text-[10px] text-gray-500 uppercase tracking-widest">
                <th className="px-4 py-3">Node</th>
                <th className="px-4 py-3">IP Address</th>
                <th className="px-4 py-3">Throughput</th>
                <th className="px-4 py-3">ISP Origin</th>
                <th className="px-4 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {nodes.map((node) => (
                <tr key={node.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 text-emerald-400 font-bold">{node.name}</td>
                  <td className="px-4 py-3 text-gray-400">{node.ip}</td>
                  <td className="px-4 py-3 text-gray-400">{Math.floor(node.signal * 12.4)} Mbps</td>
                  <td className="px-4 py-3 text-gray-500">STARLINK_BETA_9</td>
                  <td className="px-4 py-3 text-right">
                    <span className="inline-flex items-center rounded-full bg-emerald-400/10 px-2 py-1 text-[10px] font-bold text-emerald-400 ring-1 ring-inset ring-emerald-400/20">
                      ENCRYPTED
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};