import { motion, AnimatePresence } from 'motion/react';
import { Music, ChevronLeft, Play, Pause, SkipForward, SkipBack, Sparkles, Volume2, Plus, Download, Mic } from 'lucide-react';
import { useState } from 'react';

export default function MusicTool({ onBack }: { onBack: () => void }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [activeTab, setActiveTab] = useState('create');

  const handleCreate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 3500);
  };

  return (
    <div className="min-h-screen bg-mocha-950 flex flex-col font-sans overflow-hidden">
      <header className="p-6 glass-dark border-b border-white/5 flex items-center justify-between z-10">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="text-mocha-400 hover:text-white transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold-500 rounded-xl flex items-center justify-center text-mocha-950 rotate-3">
              <Music size={20} />
            </div>
            <div>
              <h1 className="text-xl font-serif font-bold text-white italic">Mocha Beats</h1>
              <p className="text-[10px] font-mono text-mocha-500 uppercase tracking-widest">Sonic Composition Engine</p>
            </div>
          </div>
        </div>

        <div className="flex bg-mocha-900 rounded-xl p-1 border border-white/5">
           <button 
             onClick={() => setActiveTab('create')} 
             className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'create' ? 'bg-gold-500 text-mocha-950' : 'text-mocha-500'}`}
           >
              Compose
           </button>
           <button 
             onClick={() => setActiveTab('library')} 
             className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'library' ? 'bg-gold-500 text-mocha-950' : 'text-mocha-500'}`}
           >
              Vinyls
           </button>
        </div>
      </header>

      <main className="flex-1 p-12 flex flex-col items-center justify-center relative">
         <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gold-500/5 blur-[150px] rounded-full pointer-events-none" />

         <div className="max-w-4xl w-full text-center space-y-12 relative z-10">
            <div className="flex justify-center items-center gap-8 h-48">
               {[...Array(30)].map((_, i) => (
                 <motion.div 
                   key={i}
                    animate={isPlaying ? {
                      height: [Math.random() * 40 + 20 + '%', Math.random() * 80 + 20 + '%', Math.random() * 40 + 20 + '%']
                    } : { height: '10%' }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.05 }}
                    className="w-2 bg-gold-500/40 rounded-full"
                 />
               ))}
            </div>

            <div className="space-y-6">
               <h2 className="text-4xl md:text-5xl font-serif font-bold text-white italic text-glow">The Future of Sound.</h2>
               <p className="text-mocha-400 max-w-lg mx-auto italic">Describe the mood, genre, and instruments for your custom AI roast. We'll compose the high-fidelity arrangement in seconds.</p>
            </div>

            <div className="glass p-4 rounded-[3rem] border-white/10 flex items-center gap-4 bg-white/5 backdrop-blur-3xl">
               <div className="w-16 h-16 bg-mocha-800 rounded-[2rem] flex items-center justify-center text-gold-500"><Mic size={24} /></div>
               <input 
                 value={prompt}
                 onChange={(e) => setPrompt(e.target.value)}
                 placeholder="Lofi hip hop with chill espresso vibes and rain sounds..."
                 className="flex-1 bg-transparent border-none outline-none text-white text-lg placeholder:text-mocha-700 italic"
               />
               <button 
                 onClick={handleCreate}
                 disabled={isGenerating || !prompt.trim()}
                 className="bg-gold-500 text-mocha-950 px-8 py-4 rounded-[2rem] font-bold flex items-center gap-2 hover:bg-gold-400 transition-all shadow-xl active:scale-95 disabled:opacity-50"
               >
                  {isGenerating ? <Sparkles className="animate-spin" /> : <>Create Music <Plus size={20} /></>}
               </button>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
               {['Cyberpunk', 'Jazz Noir', 'Classical Fusion', 'Deep Forest', '80s Synth'].map(genre => (
                 <button 
                   key={genre}
                   onClick={() => setPrompt(`Generate a ${genre} track...`)}
                   className="px-6 py-2 glass rounded-full text-[10px] font-mono text-mocha-400 border-white/5 hover:border-gold-500/30 transition-all uppercase tracking-widest"
                 >
                    {genre}
                 </button>
               ))}
            </div>
         </div>
      </main>

      {/* Playback Dock */}
      <footer className="p-8 glass-dark border-t border-white/5 flex items-center justify-between">
         <div className="flex items-center gap-6 w-1/3">
            <div className="w-16 h-16 bg-mocha-800 rounded-2xl flex items-center justify-center text-gold-500 border border-gold-500/20 shadow-2xl overflow-hidden group">
               <motion.div animate={{ rotate: isPlaying ? 360 : 0 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}>
                  <Music size={32} />
               </motion.div>
            </div>
            <div>
               <p className="text-sm font-bold text-white">Mocha Serenade</p>
               <p className="text-[10px] text-mocha-500 uppercase tracking-widest">AI Arrangement #124</p>
            </div>
         </div>

         <div className="flex flex-col items-center gap-4 flex-1 max-w-md">
            <div className="flex items-center gap-8">
               <button className="text-mocha-500 hover:text-white transition-colors"><SkipBack size={24} /></button>
               <button 
                 onClick={() => setIsPlaying(!isPlaying)}
                 className="w-16 h-16 bg-white text-mocha-950 rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-2xl"
               >
                  {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
               </button>
               <button className="text-mocha-500 hover:text-white transition-colors"><SkipForward size={24} /></button>
            </div>
            <div className="w-full flex items-center gap-4">
               <span className="text-[10px] font-mono text-mocha-600">01:24</span>
               <div className="flex-1 h-1.5 bg-mocha-800 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: '45%' }} className="h-full bg-gold-500" />
               </div>
               <span className="text-[10px] font-mono text-mocha-600">03:10</span>
            </div>
         </div>

         <div className="flex items-center justify-end gap-6 w-1/3 text-mocha-500">
            <Volume2 size={20} />
            <div className="w-24 h-1.5 bg-mocha-800 rounded-full overflow-hidden">
               <div className="w-2/3 h-full bg-mocha-600" />
            </div>
            <button className="p-3 glass rounded-xl hover:text-gold-500 transition-all"><Download size={20} /></button>
         </div>
      </footer>
    </div>
  );
}
