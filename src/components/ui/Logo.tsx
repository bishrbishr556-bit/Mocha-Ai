import React from 'react';

export default function Logo({ size = 40, className = "", showGlow = true, url }: { size?: number, className?: string, showGlow?: boolean, url?: string }) {
  const defaultLogo = "https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?q=80&w=100&auto=format&fit=crop";
  const logoUrl = url || defaultLogo;
  
  return (
    <div 
      className={`relative group inline-block ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Premium Purple Glow Effect */}
      {showGlow && (
        <div className="absolute inset-0 bg-purple-500/40 blur-2xl rounded-full scale-125 opacity-0 group-hover:opacity-100 transition-all duration-700" />
      )}
      
      <div 
        className={`w-full h-full rounded-2xl flex items-center justify-center overflow-hidden shadow-2xl transition-all duration-700 
          group-hover:scale-110 group-hover:rotate-[3deg] group-hover:shadow-[0_0_40px_rgba(147,51,234,0.5)]
          border border-white/10 group-hover:border-purple-500/50 bg-primary-black`}
      >
        <img 
          src={logoUrl} 
          alt="Mocha Logo" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  );
}
