import React from 'react';

export default function Logo({ size = 40, className = "", showGlow = true, url }: { size?: number, className?: string, showGlow?: boolean, url?: string }) {
  const defaultLogo = "/mocha-logo.png";
  const logoUrl = url || defaultLogo;
  
  return (
    <div 
      className={`relative group inline-block ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Premium Multi-Layer Gold Glow Effect */}
      {showGlow && (
        <>
          <div className="absolute inset-0 bg-gold-500/30 blur-3xl rounded-full scale-150 opacity-60 group-hover:opacity-100 transition-all duration-700 animate-pulse" />
          <div className="absolute inset-0 bg-gold-400/20 blur-2xl rounded-full scale-125 opacity-0 group-hover:opacity-80 transition-all duration-500" />
        </>
      )}
      
      {/* Glassmorphism Container with Premium Effects */}
      <div 
        className={`relative w-full h-full rounded-3xl flex items-center justify-center overflow-hidden
          transition-all duration-700 
          group-hover:scale-105 group-hover:rotate-[2deg]
          bg-gradient-to-br from-mocha-900/80 via-mocha-950/90 to-black/95
          backdrop-blur-xl
          border border-gold-500/20 group-hover:border-gold-400/60
          shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_0_1px_rgba(212,175,55,0.1)]
          group-hover:shadow-[0_20px_60px_rgba(212,175,55,0.3),0_0_0_1px_rgba(212,175,55,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]`}
      >
        {/* Inner Glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-gold-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Logo Image */}
        <div className="relative w-[85%] h-[85%] flex items-center justify-center">
          <img 
            src={logoUrl} 
            alt="Mocha AI Logo" 
            className="w-full h-full object-contain drop-shadow-[0_4px_12px_rgba(212,175,55,0.4)] 
              group-hover:drop-shadow-[0_8px_24px_rgba(212,175,55,0.6)]
              transition-all duration-700 group-hover:scale-105"
            referrerPolicy="no-referrer"
            style={{ 
              filter: 'contrast(1.05) brightness(1.05)',
              imageRendering: 'crisp-edges'
            }}
          />
        </div>
        
        {/* Subtle Reflection Effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-transparent opacity-40 pointer-events-none" />
      </div>
    </div>
  );
}
