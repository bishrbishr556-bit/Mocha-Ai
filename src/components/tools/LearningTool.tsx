import { BookOpen, ChevronLeft, Send } from 'lucide-react';

export default function LearningTool({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-mocha-950 p-12 text-center flex flex-col items-center justify-center">
      <header className="absolute top-0 left-0 w-full p-6 flex items-center gap-6">
        <button onClick={onBack} className="text-mocha-400 hover:text-white transition-colors">
          <ChevronLeft size={24} />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gold-500 rounded-xl flex items-center justify-center text-mocha-950 rotate-3">
            <BookOpen size={20} />
          </div>
          <div>
            <h1 className="text-xl font-serif font-bold text-white italic">Learning Hub</h1>
            <p className="text-[10px] font-mono text-mocha-500 uppercase tracking-widest">Knowledge Curator</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl w-full">
        <div className="w-24 h-24 bg-gold-500/10 rounded-full flex items-center justify-center text-gold-500 mx-auto mb-8 shadow-2xl">
          <BookOpen size={48} />
        </div>
        <h2 className="text-4xl font-serif font-bold text-white mb-4 italic text-glow">Master Any Craft.</h2>
        <p className="text-mocha-400 max-w-sm mx-auto mb-12 italic">Curation of knowledge for the curious barista. Select a path to begin your personalized curriculum.</p>
        
        <div className="grid md:grid-cols-3 gap-6 text-left">
           {[
             { title: 'Computer Science', level: 'Beginner to Master' },
             { title: 'Digital Design', level: 'Visual Theory' },
             { title: 'Philosophy', level: 'Ethics of AI' }
           ].map((path, i) => (
             <button key={i} className="glass p-8 rounded-[2.5rem] border-white/5 hover:bg-white/10 transition-all group">
                <h4 className="text-xl font-serif font-bold text-white mb-2 italic group-hover:text-gold-500 transition-colors uppercase tracking-tight">{path.title}</h4>
                <p className="text-[10px] font-mono text-mocha-600 uppercase tracking-widest">{path.level}</p>
                <div className="mt-6 flex justify-end">
                   <div className="w-10 h-10 bg-mocha-800 rounded-xl flex items-center justify-center text-gold-500"><Send size={18} /></div>
                </div>
             </button>
           ))}
        </div>
      </div>
    </div>
  );
}
