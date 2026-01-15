import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  action?: React.ReactNode;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', title, action }) => {
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:border-white/20 ${className}`}>
      {/* Glare effect */}
      <div className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100" />
      
      {(title || action) && (
        <div className="flex items-center justify-between border-b border-white/5 bg-white/5 px-6 py-4">
          {title && <h3 className="font-tech text-lg font-bold tracking-widest text-emerald-400 uppercase">{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};