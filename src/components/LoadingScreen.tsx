import { motion } from 'motion/react';
import { Coffee } from 'lucide-react';

import Logo from './ui/Logo';

export default function LoadingScreen({ logoUrl }: { logoUrl?: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-mocha-950 to-mocha-900 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gold-600/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-mocha-600/5 blur-[150px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center"
      >
        <div className="relative group">
          <div className="absolute inset-0 bg-gold-500/20 blur-[60px] rounded-full animate-pulse transition-all group-hover:blur-[80px]" />
          <Logo size={120} url={logoUrl} className="shadow-[0_0_50px_rgba(212,175,55,0.3)] hover:scale-105 transition-transform duration-700" showGlow={false} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-10 text-center"
        >
          <h1 className="text-4xl font-serif font-bold text-white italic tracking-[0.2em] uppercase mb-4">Mocha</h1>
          <div className="flex justify-center gap-1.5">
            {[0.2, 0.4, 0.6].map((delay, i) => (
              <motion.div 
                key={i}
                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, delay }}
                className="w-1.5 h-1.5 bg-gold-500 rounded-full"
              />
            ))}
          </div>
          <p className="mt-8 text-mocha-500 font-mono text-[10px] uppercase tracking-[0.5em] italic">Brewing Intelligence...</p>
        </motion.div>
      </motion.div>

      {/* Aesthetic Accents */}
      <div className="absolute bottom-8 left-8 flex items-center gap-2">
         <div className="w-1 h-1 bg-gold-500 rounded-full" />
         <p className="text-mocha-700 font-mono text-[8px] uppercase tracking-widest leading-none">v2.4.0 • Discerning Blend</p>
      </div>
    </div>
  );
}
