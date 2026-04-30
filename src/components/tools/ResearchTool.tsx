import { Search, ChevronLeft, Send } from 'lucide-react';

export default function ResearchTool({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-mocha-950 p-12 text-center flex flex-col items-center justify-center">
      <header className="absolute top-0 left-0 w-full p-6 flex items-center gap-6">
        <button onClick={onBack} className="text-mocha-400 hover:text-white transition-colors">
          <ChevronLeft size={24} />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gold-500 rounded-xl flex items-center justify-center text-mocha-950 rotate-3">
            <Search size={20} />
          </div>
          <div>
            <h1 className="text-xl font-serif font-bold text-white italic">Deep Research</h1>
            <p className="text-[10px] font-mono text-mocha-500 uppercase tracking-widest">Intelligence Suite</p>
          </div>
        </div>
      </header>

      <div className="max-w-2xl w-full space-y-8">
        <div className="w-24 h-24 bg-gold-500/10 rounded-full flex items-center justify-center text-gold-500 mx-auto shadow-[0_0_50px_rgba(212,175,55,0.1)]">
          <Search size={48} />
        </div>
        <div className="text-center">
          <h2 className="text-4xl font-serif font-bold text-white mb-4 italic text-glow">Synthesize Knowledge.</h2>
          <p className="text-mocha-400 max-w-sm mx-auto mb-12 italic leading-relaxed">Enter a topic for comprehensive cross-domain intelligence gathering. Our agent scales the web for truth.</p>
        </div>

        <div className="glass p-3 rounded-[2.5rem] border-white/10 flex items-center gap-4 bg-white/5 backdrop-blur-3xl">
           <input 
             placeholder="What would you like to investigate deeply?"
             className="flex-1 bg-transparent border-none outline-none text-white text-lg px-6 placeholder:text-mocha-700 italic"
           />
           <button className="bg-gold-500 text-mocha-950 px-8 py-4 rounded-[2rem] font-bold flex items-center gap-2 hover:bg-gold-400 transition-all shadow-xl active:scale-95">
              Start Research <Send size={20} />
           </button>
        </div>
      </div>
    </div>
  );
}
