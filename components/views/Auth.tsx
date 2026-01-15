import React, { useState } from 'react';
import { GlassCard } from '../GlassCard';
import { Eye, EyeOff, Lock, Mail, User, ShieldCheck, ArrowRight, Chrome } from 'lucide-react';

interface AuthProps {
  onLogin: () => void;
}

type AuthMode = 'LOGIN' | 'SIGNUP' | 'FORGOT';

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<AuthMode>('LOGIN');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1500);
  };

  const toggleMode = (newMode: AuthMode) => {
    setMode(newMode);
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        {/* Animated Background Glow */}
        <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/30 to-blue-500/30 blur-2xl opacity-50 animate-pulse" />
        
        <GlassCard className="relative overflow-hidden border-white/20 bg-black/60 backdrop-blur-3xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <ShieldCheck className="h-8 w-8 text-emerald-400" />
            </div>
            <h1 className="font-tech text-3xl font-bold tracking-widest text-white">GMT GLOBAL</h1>
            <p className="mt-2 text-xs font-bold uppercase tracking-[0.3em] text-emerald-500">Secure Access Gateway</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'SIGNUP' && (
              <div className="group relative">
                <User className="absolute left-4 top-3.5 h-5 w-5 text-gray-500 transition-colors group-focus-within:text-emerald-400" />
                <input 
                  type="text" 
                  placeholder="FULL OPERATOR NAME" 
                  className="w-full rounded-xl border border-white/10 bg-black/40 py-3 pl-12 pr-4 font-mono text-sm text-white placeholder-gray-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>
            )}

            <div className="group relative">
              <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-500 transition-colors group-focus-within:text-emerald-400" />
              <input 
                type="email" 
                placeholder={mode === 'FORGOT' ? "RECOVERY EMAIL ADDRESS" : "IDENTIFICATION EMAIL"}
                className="w-full rounded-xl border border-white/10 bg-black/40 py-3 pl-12 pr-4 font-mono text-sm text-white placeholder-gray-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                required
              />
            </div>

            {mode !== 'FORGOT' && (
              <div className="group relative">
                <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-500 transition-colors group-focus-within:text-emerald-400" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="ACCESS CODE" 
                  className="w-full rounded-xl border border-white/10 bg-black/40 py-3 pl-12 pr-12 font-mono text-sm text-white placeholder-gray-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-gray-500 hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            )}

            {mode === 'LOGIN' && (
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-gray-400 hover:text-white">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-3 w-3 rounded border-gray-600 bg-transparent text-emerald-500 focus:ring-0 focus:ring-offset-0" 
                  />
                  REMEMBER DEVICE
                </label>
                <button type="button" onClick={() => toggleMode('FORGOT')} className="font-bold text-emerald-500 hover:text-emerald-400 hover:underline">
                  FORGOT CODE?
                </button>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="group relative w-full overflow-hidden rounded-xl bg-emerald-600 py-3.5 font-tech text-lg font-bold tracking-widest text-black transition-all hover:bg-emerald-500 disabled:opacity-70"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? 'AUTHENTICATING...' : mode === 'LOGIN' ? 'INITIATE SESSION' : mode === 'SIGNUP' ? 'REGISTER UNIT' : 'SEND RESET LINK'}
                {!isLoading && <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />}
              </span>
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
            </button>
          </form>

          {mode === 'LOGIN' && (
             <div className="mt-6">
                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-black px-2 text-gray-500">Or Access Via</span></div>
                </div>
                <button onClick={onLogin} className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10">
                   <Chrome className="h-5 w-5 text-white" />
                   Google Workspace
                </button>
             </div>
          )}

          <div className="mt-8 text-center text-xs">
             {mode === 'LOGIN' ? (
                <p className="text-gray-400">
                  UNREGISTERED DEVICE? <button onClick={() => toggleMode('SIGNUP')} className="font-bold text-emerald-500 hover:underline">REQUEST ACCESS</button>
                </p>
             ) : (
                <p className="text-gray-400">
                  ALREADY REGISTERED? <button onClick={() => toggleMode('LOGIN')} className="font-bold text-emerald-500 hover:underline">RETURN TO LOGIN</button>
                </p>
             )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};