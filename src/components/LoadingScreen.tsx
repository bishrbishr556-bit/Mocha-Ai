import { motion } from 'motion/react';
import { Coffee } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-mocha-950 flex flex-col items-center justify-center gap-10">
      <div className="relative">
        {/* Pulsing Outer Ring */}
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-gold-500 rounded-full blur-3xl"
        />
        
        <motion.div 
          initial={{ rotate: -10, scale: 0.8 }}
          animate={{ rotate: 10, scale: 1 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "mirror" }}
          className="w-24 h-24 bg-gold-500 rounded-3xl flex items-center justify-center text-mocha-950 shadow-[0_0_50px_rgba(212,175,55,0.4)] relative z-10"
        >
          <Coffee size={48} />
        </motion.div>
      </div>

      <div className="text-center space-y-4">
        <h2 className="text-2xl font-serif font-bold text-white italic tracking-widest uppercase">Mocha AI</h2>
        <div className="flex justify-center gap-1">
          {[...Array(3)].map((_, i) => (
            <motion.div 
              key={i}
              animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              className="w-2 h-2 bg-gold-500 rounded-full"
            />
          ))}
        </div>
        <p className="text-mocha-500 font-mono text-[10px] uppercase tracking-[0.3em]">Perfecting the Roast...</p>
      </div>
    </div>
  );
}
