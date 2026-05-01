import { motion } from 'motion/react';
import Logo from './Logo';

export default function SplashLoader({ logoUrl }: { logoUrl?: string }) {
  return (
    <div className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-gradient-to-b from-primary-black to-mocha-brown/20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05)_0%,transparent_70%)]" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ 
          duration: 2,
          ease: "easeOut"
        }}
        className="relative"
      >
        {/* Intense Gold Glow behind logo */}
        <div className="absolute inset-0 bg-gold-accent/30 blur-[120px] rounded-full animate-pulse" />
        
        <Logo size={180} url={logoUrl} className="relative z-10" />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1.5 }}
        className="mt-12 text-center relative z-10"
      >
        <h2 className="text-3xl font-display font-bold text-cream-text tracking-[0.2em] uppercase italic">Mocha AI</h2>
        <div className="mt-6 flex items-center gap-2 justify-center">
            <span className="w-1.5 h-1.5 bg-gold-accent rounded-full animate-bounce [animation-delay:-0.3s] shadow-[0_0_10px_#D4AF37]" />
            <span className="w-1.5 h-1.5 bg-gold-accent rounded-full animate-bounce [animation-delay:-0.15s] shadow-[0_0_10px_#D4AF37]" />
            <span className="w-1.5 h-1.5 bg-gold-accent rounded-full animate-bounce shadow-[0_0_10px_#D4AF37]" />
        </div>
        <p className="mt-4 text-mocha-500 text-[11px] font-mono tracking-[0.5em] uppercase font-bold">Brewing Intelligence</p>
      </motion.div>
    </div>
  );
}
