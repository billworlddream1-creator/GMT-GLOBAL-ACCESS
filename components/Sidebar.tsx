import React from 'react';
import { ViewMode } from '../types';
import { 
  LayoutDashboard, 
  Cpu, 
  Wifi, 
  TrendingUp, 
  Smartphone,
  ShieldAlert,
  Search,
  Eye,
  Crosshair,
  Lock,
  ChevronLeft,
  ChevronRight,
  UserCircle,
  LogOut,
  Bitcoin,
  Fingerprint,
  Wallet,
  Usb,
  Activity,
  HardDrive
} from 'lucide-react';

interface SidebarProps {
  currentView: ViewMode;
  setView: (view: ViewMode) => void;
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  onLogout: () => void;
  // System metrics props
  cpu: number;
  ram: number;
  latency: number;
}

const NavItem = ({ 
  icon: Icon, 
  label, 
  active, 
  onClick,
  collapsed
}: { 
  icon: any, 
  label: string, 
  active: boolean, 
  onClick: () => void,
  collapsed: boolean
}) => (
  <button
    onClick={onClick}
    title={collapsed ? label : undefined}
    className={`group flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200 
      ${collapsed ? 'justify-center w-12 mx-auto' : 'w-full'}
      ${active 
        ? 'bg-emerald-500/20 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]' 
        : 'text-gray-400 hover:bg-white/5 hover:text-white'
      }`}
  >
    <Icon className={`h-5 w-5 ${active ? 'animate-pulse' : ''} ${collapsed ? 'h-6 w-6' : ''}`} />
    {!collapsed && <span className="font-tech text-sm font-semibold tracking-wider uppercase whitespace-nowrap">{label}</span>}
    {active && !collapsed && <div className="ml-auto h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />}
  </button>
);

const HealthBar = ({ label, value, colorClass, icon: Icon, collapsed }: { label: string, value: number, colorClass: string, icon: any, collapsed: boolean }) => (
  <div className={`space-y-1.5 ${collapsed ? 'flex flex-col items-center' : ''}`}>
    {!collapsed && (
      <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-gray-500 px-1">
        <span className="flex items-center gap-1.5"><Icon size={10} className={colorClass} /> {label}</span>
        <span>{Math.round(value)}{label === 'NET' ? 'ms' : '%'}</span>
      </div>
    )}
    {collapsed ? (
       <div className={`h-8 w-1.5 rounded-full bg-white/5 overflow-hidden relative group`} title={`${label}: ${Math.round(value)}`}>
         <div 
          className={`absolute bottom-0 left-0 right-0 ${colorClass.replace('text-', 'bg-')} transition-all duration-500`}
          style={{ height: `${label === 'NET' ? Math.min(100, (value/200)*100) : value}%` }}
         />
       </div>
    ) : (
      <div className="h-1 w-full rounded-full bg-white/5 overflow-hidden">
        <div 
          className={`h-full ${colorClass.replace('text-', 'bg-')} transition-all duration-500 shadow-[0_0_8px_currentColor]`}
          style={{ width: `${label === 'NET' ? Math.min(100, (value/200)*100) : value}%` }}
        />
      </div>
    )}
  </div>
);

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, collapsed, setCollapsed, onLogout, cpu, ram, latency }) => {
  return (
    <div className={`flex flex-col border-r border-white/10 bg-black/60 backdrop-blur-2xl transition-all duration-300 ${collapsed ? 'w-20' : 'w-72'}`}>
      <div className={`flex items-center gap-3 border-b border-white/10 p-6 ${collapsed ? 'justify-center px-2' : ''}`}>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
          <ShieldAlert className="h-6 w-6" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="font-tech text-xl font-bold tracking-[0.1em] text-white leading-none">GMT GLOBAL</h1>
            <p className="text-[10px] font-bold tracking-[0.3em] text-emerald-500 mt-1">ACCESS SYSTEM</p>
          </div>
        )}
      </div>

      <div className="flex-1 space-y-1 overflow-y-auto overflow-x-hidden p-4 custom-scrollbar">
        {!collapsed && <div className="mb-2 px-4 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Core Control</div>}
        <NavItem 
          icon={LayoutDashboard} 
          label="Dashboard" 
          active={currentView === ViewMode.DASHBOARD} 
          onClick={() => setView(ViewMode.DASHBOARD)} 
          collapsed={collapsed}
        />
        <NavItem 
          icon={Search} 
          label="Intel Hub" 
          active={currentView === ViewMode.INTEL_ANALYSIS} 
          onClick={() => setView(ViewMode.INTEL_ANALYSIS)} 
          collapsed={collapsed}
        />
        <NavItem 
          icon={Fingerprint} 
          label="Identity Resolver" 
          active={currentView === ViewMode.IDENTITY_RESOLVER} 
          onClick={() => setView(ViewMode.IDENTITY_RESOLVER)} 
          collapsed={collapsed}
        />

        {!collapsed && <div className="mt-6 mb-2 px-4 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Market & Crypto</div>}
        <NavItem 
          icon={TrendingUp} 
          label="Global Markets" 
          active={currentView === ViewMode.GLOBAL_MARKET} 
          onClick={() => setView(ViewMode.GLOBAL_MARKET)} 
          collapsed={collapsed}
        />
        <NavItem 
          icon={Bitcoin} 
          label="Crypto Matrix" 
          active={currentView === ViewMode.CRYPTO_TRACKER} 
          onClick={() => setView(ViewMode.CRYPTO_TRACKER)} 
          collapsed={collapsed}
        />
        <NavItem 
          icon={Wallet} 
          label="Financial Intel" 
          active={currentView === ViewMode.FINANCIAL_INTEL} 
          onClick={() => setView(ViewMode.FINANCIAL_INTEL)} 
          collapsed={collapsed}
        />
        
        {!collapsed && <div className="mt-6 mb-2 px-4 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Surveillance</div>}
        <NavItem 
          icon={Eye} 
          label="Optical Sensors" 
          active={currentView === ViewMode.SURVEILLANCE} 
          onClick={() => setView(ViewMode.SURVEILLANCE)} 
          collapsed={collapsed}
        />
        <NavItem 
          icon={Crosshair} 
          label="Target Tracker" 
          active={currentView === ViewMode.LOCATION_TRACKER} 
          onClick={() => setView(ViewMode.LOCATION_TRACKER)} 
          collapsed={collapsed}
        />
        <NavItem 
          icon={Usb} 
          label="USB Extractor" 
          active={currentView === ViewMode.USB_EXTRACTOR} 
          onClick={() => setView(ViewMode.USB_EXTRACTOR)} 
          collapsed={collapsed}
        />
        
        {!collapsed && <div className="mt-6 mb-2 px-4 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Diagnostic</div>}
        <NavItem 
          icon={Lock} 
          label="Security Ops" 
          active={currentView === ViewMode.SECURITY_OPS} 
          onClick={() => setView(ViewMode.SECURITY_OPS)} 
          collapsed={collapsed}
        />
        <NavItem 
          icon={Smartphone} 
          label="Device Health" 
          active={currentView === ViewMode.DEVICE_SENSORS} 
          onClick={() => setView(ViewMode.DEVICE_SENSORS)} 
          collapsed={collapsed}
        />

        {/* System Health Section */}
        <div className={`mt-8 px-4 ${collapsed ? 'px-0 flex flex-col items-center gap-4' : 'space-y-4'}`}>
          {!collapsed && <div className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-2">System Health</div>}
          <HealthBar label="CPU" value={cpu} colorClass="text-blue-400" icon={Cpu} collapsed={collapsed} />
          <HealthBar label="RAM" value={ram} colorClass="text-amber-400" icon={HardDrive} collapsed={collapsed} />
          <HealthBar label="NET" value={latency} colorClass="text-emerald-400" icon={Activity} collapsed={collapsed} />
        </div>

        <div className="mt-auto border-t border-white/10 pt-4">
          <NavItem 
            icon={UserCircle} 
            label="Profile" 
            active={currentView === ViewMode.PROFILE} 
            onClick={() => setView(ViewMode.PROFILE)} 
            collapsed={collapsed}
          />
        </div>
      </div>

      <div className="border-t border-white/10 p-4">
         <button
            onClick={onLogout}
            title={collapsed ? "Logout" : undefined}
            className={`group mb-2 flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200 w-full text-red-400 hover:bg-red-500/10 ${collapsed ? 'justify-center' : ''}`}
          >
            <LogOut className="h-5 w-5 group-hover:text-red-300" />
            {!collapsed && <span className="font-tech text-sm font-semibold tracking-wider uppercase whitespace-nowrap">Logout</span>}
        </button>

        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center justify-center rounded-lg bg-white/5 p-2 text-gray-400 hover:bg-white/10 hover:text-white"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
    </div>
  );
};