import React, { useEffect, useState } from 'react';
import { GlassCard } from '../GlassCard';
import { Bitcoin, TrendingUp, TrendingDown, Activity, DollarSign, PieChart, RefreshCw, Layers, Zap } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar } from 'recharts';
import { CryptoCoin } from '../../types';

export const CryptoTracker: React.FC = () => {
  const [coins, setCoins] = useState<CryptoCoin[]>([
    { symbol: 'BTC', name: 'Bitcoin', price: 68432.12, change24h: 2.4, marketCap: '1.34T', volume24h: '32.1B' },
    { symbol: 'ETH', name: 'Ethereum', price: 3456.78, change24h: -1.2, marketCap: '415B', volume24h: '15.4B' },
    { symbol: 'SOL', name: 'Solana', price: 142.55, change24h: 8.5, marketCap: '63B', volume24h: '4.2B' },
    { symbol: 'DOT', name: 'Polkadot', price: 7.23, change24h: -0.4, marketCap: '10B', volume24h: '210M' },
    { symbol: 'ADA', name: 'Cardano', price: 0.45, change24h: 1.2, marketCap: '16B', volume24h: '340M' },
    { symbol: 'LINK', name: 'Chainlink', price: 18.12, change24h: 3.5, marketCap: '10.2B', volume24h: '600M' },
    { symbol: 'AVAX', name: 'Avalanche', price: 38.44, change24h: -2.1, marketCap: '14B', volume24h: '500M' },
    { symbol: 'XRP', name: 'XRP', price: 0.62, change24h: 0.5, marketCap: '34B', volume24h: '1.2B' },
  ]);

  const [sparklineData, setSparklineData] = useState(
    Array.from({ length: 20 }, (_, i) => ({ time: i, value: 50 + Math.random() * 20 }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCoins(prev => prev.map(coin => ({
        ...coin,
        price: coin.price + (Math.random() - 0.5) * (coin.price * 0.001),
        change24h: coin.change24h + (Math.random() - 0.5) * 0.1
      })));

      setSparklineData(prev => {
        const next = [...prev.slice(1), { time: Date.now(), value: 50 + Math.random() * 20 }];
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const btc = coins.find(c => c.symbol === 'BTC') || coins[0];

  return (
    <div className="space-y-6">
      {/* Prime Highlight: Bitcoin */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2 relative overflow-hidden" title="Prime Asset: Bitcoin (BTC)">
          <div className="absolute top-4 right-4 animate-pulse">
            <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
              LIVE BROADCAST
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-8 items-center py-4">
             <div className="relative">
                <div className="absolute inset-0 bg-emerald-500 blur-3xl opacity-10 animate-pulse rounded-full" />
                <div className="relative h-32 w-32 rounded-full bg-gradient-to-br from-emerald-400/20 to-emerald-900/40 border border-emerald-500/30 flex items-center justify-center">
                   <Bitcoin size={64} className="text-emerald-500 drop-shadow-[0_0_15px_#10b981]" />
                </div>
             </div>
             <div className="flex-1 w-full">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                   <div>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Current Price</p>
                      <p className="text-3xl font-black text-white font-mono">${btc.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                   </div>
                   <div>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">24H Change</p>
                      <p className={`text-2xl font-bold font-mono ${btc.change24h >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                         {btc.change24h >= 0 ? '+' : ''}{btc.change24h.toFixed(2)}%
                      </p>
                   </div>
                   <div>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Market Cap</p>
                      <p className="text-2xl font-bold text-white font-mono">${btc.marketCap}</p>
                   </div>
                   <div>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Volume (24h)</p>
                      <p className="text-2xl font-bold text-white font-mono">${btc.volume24h}</p>
                   </div>
                </div>
                <div className="mt-8 h-20 w-full opacity-60">
                   <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={sparklineData}>
                         <Area type="monotone" dataKey="value" stroke="#10b981" fill="#10b98133" strokeWidth={3} isAnimationActive={false} />
                      </AreaChart>
                   </ResponsiveContainer>
                </div>
             </div>
          </div>
        </GlassCard>

        <div className="space-y-6">
           <GlassCard title="Network Dominance">
              <div className="space-y-4">
                 <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">BTC Dominance</span>
                    <span className="text-white font-bold">54.2%</span>
                 </div>
                 <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: '54.2%' }} />
                 </div>
                 <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">ETH Dominance</span>
                    <span className="text-white font-bold">17.8%</span>
                 </div>
                 <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: '17.8%' }} />
                 </div>
                 <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Altcoins</span>
                    <span className="text-white font-bold">28.0%</span>
                 </div>
                 <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gray-500" style={{ width: '28.0%' }} />
                 </div>
              </div>
           </GlassCard>
           
           <GlassCard title="Node Signals">
              <div className="grid grid-cols-2 gap-2">
                 <div className="p-3 bg-white/5 rounded-lg border border-white/10 flex flex-col items-center">
                    <Layers className="text-emerald-400 h-5 w-5 mb-2" />
                    <span className="text-[10px] font-bold text-gray-500 uppercase">Blocks</span>
                    <span className="text-xs font-mono text-white">842,112</span>
                 </div>
                 <div className="p-3 bg-white/5 rounded-lg border border-white/10 flex flex-col items-center">
                    <Zap className="text-blue-400 h-5 w-5 mb-2" />
                    <span className="text-[10px] font-bold text-gray-500 uppercase">Hashrate</span>
                    <span className="text-xs font-mono text-white">612 EH/s</span>
                 </div>
              </div>
           </GlassCard>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {coins.slice(1, 5).map(coin => (
          <GlassCard key={coin.symbol} className="relative overflow-hidden group">
            <div className="flex items-center justify-between mb-4">
               <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${coin.change24h >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                    <Activity size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{coin.symbol}</h4>
                    <p className="text-[10px] text-gray-500 font-mono">{coin.name}</p>
                  </div>
               </div>
               <div className={`flex items-center gap-1 text-xs font-bold ${coin.change24h >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {coin.change24h >= 0 ? <TrendingUp size={14}/> : <TrendingDown size={14}/>}
                  {Math.abs(coin.change24h).toFixed(2)}%
               </div>
            </div>
            <div className="font-mono text-xl font-bold text-white mb-4">
              ${coin.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="h-12 -mx-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparklineData}>
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke={coin.change24h >= 0 ? '#10b981' : '#ef4444'} 
                    fill={coin.change24h >= 0 ? '#10b98122' : '#ef444422'} 
                    strokeWidth={2}
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2" title="Crypto Market Overview">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm font-mono">
              <thead>
                <tr className="border-b border-white/10 text-[10px] text-gray-500 uppercase tracking-widest">
                  <th className="px-4 py-4">Asset</th>
                  <th className="px-4 py-4">Price</th>
                  <th className="px-4 py-4">24H Change</th>
                  <th className="px-4 py-4">Market Cap</th>
                  <th className="px-4 py-4">Volume (24h)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {coins.map(coin => (
                  <tr key={coin.symbol} className="hover:bg-white/5 transition-all group">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center font-bold text-xs">
                           {coin.symbol[0]}
                         </div>
                         <span>{coin.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-white font-bold">
                      ${coin.price.toLocaleString()}
                    </td>
                    <td className={`px-4 py-4 font-bold ${coin.change24h >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {coin.change24h > 0 ? '+' : ''}{coin.change24h.toFixed(2)}%
                    </td>
                    <td className="px-4 py-4 text-gray-400">${coin.marketCap}</td>
                    <td className="px-4 py-4 text-gray-400">${coin.volume24h}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        <div className="space-y-6">
           <GlassCard title="Global Sentiment">
              <div className="flex flex-col items-center justify-center py-6">
                 <div className="relative h-32 w-32 mb-4">
                    <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20" />
                    <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-[spin_3s_linear_infinite]" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                       <span className="text-3xl font-black text-emerald-400">72</span>
                       <span className="text-[10px] text-gray-500 uppercase font-bold">Fear & Greed</span>
                    </div>
                 </div>
                 <p className="text-sm font-bold text-white uppercase tracking-widest">Extreme Greed</p>
                 <p className="text-[10px] text-gray-500 mt-2 text-center">Market data suggests high institutional accumulation in BTC and SOL nodes.</p>
              </div>
           </GlassCard>

           <GlassCard title="Recent Transfers (Simulated)">
              <div className="space-y-4">
                 {[1,2,3].map(i => (
                   <div key={i} className="flex items-center justify-between text-xs border-b border-white/5 pb-2">
                      <div className="flex items-center gap-2">
                        <RefreshCw size={12} className="text-blue-400 animate-spin-slow" />
                        <span className="text-gray-400">0x...{Math.random().toString(16).slice(2,6)}</span>
                      </div>
                      <span className="text-emerald-400">+{Math.floor(Math.random() * 50)} ETH</span>
                   </div>
                 ))}
              </div>
           </GlassCard>
        </div>
      </div>
    </div>
  );
};