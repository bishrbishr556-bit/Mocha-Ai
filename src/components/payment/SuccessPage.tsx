import { motion } from 'motion/react';
import { CheckCircle2, Sparkles, Coffee, ArrowRight } from 'lucide-react';
import { useEffect } from 'react';

export default function SuccessPage({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    // Optional auto-redirect after a while
    const timer = setTimeout(onComplete, 6000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-mocha-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         {[...Array(20)].map((_, i) => (
           <motion.div 
             key={i}
             initial={{ 
               top: Math.random() * 100 + '%', 
               left: Math.random() * 100 + '%',
               scale: 0,
               opacity: 0 
             }}
             animate={{ 
               scale: [0, 1, 0.5], 
               opacity: [0, 1, 0],
               y: -100 
             }}
             transition={{ 
               duration: 2 + Math.random() * 2, 
               repeat: Infinity, 
               delay: Math.random() * 2 
             }}
             className="absolute"
           >
              <Sparkles className="text-gold-500/30" size={Math.random() * 20 + 10} />
           </motion.div>
         ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 space-y-10"
      >
        <div className="relative inline-block">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1.2, opacity: 0 }}
            transition={{ duration: 1, repeat: Infinity }}
            className="absolute inset-0 bg-gold-500 rounded-full"
          />
          <div className="w-32 h-32 bg-gold-500 rounded-full flex items-center justify-center text-mocha-950 shadow-[0_0_80px_rgba(212,175,55,0.4)] relative z-10">
            <CheckCircle2 size={64} />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-5xl md:text-7xl font-serif font-bold text-white italic leading-tight">Roast Activated.</h2>
          <p className="text-mocha-400 text-xl font-mono uppercase tracking-[0.3em]">Payment Successful</p>
          <div className="flex items-center justify-center gap-3 text-gold-500 italic mt-8 text-lg font-serif">
             <Coffee size={24} />
             <span>Your Double Espresso is freshly prepared.</span>
          </div>
        </div>

        <div className="pt-8">
           <button 
             onClick={onComplete}
             className="px-12 py-5 bg-white text-mocha-950 rounded-[2rem] font-bold text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center gap-4 mx-auto group"
           >
             Enter Digital Loom <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
           </button>
        </div>
      </motion.div>
      
      <p className="fixed bottom-12 text-mocha-600 font-mono text-[10px] uppercase tracking-widest">Transaction ID: ROAST-{(Math.random() * 1000000).toFixed(0)}</p>
    </div>
  );
}
