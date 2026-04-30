import { motion } from 'motion/react';
import { Layout, ChevronLeft, Send, Sparkles, Code, Play, Download, Save, Smartphone, Monitor } from 'lucide-react';
import { useState } from 'react';

export default function CanvasTool({ onBack }: { onBack: () => void }) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('preview');
  const [device, setDevice] = useState<'mobile' | 'desktop'>('desktop');

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 3000);
  };

  return (
    <div className="min-h-screen bg-mocha-950 flex flex-col font-sans">
      {/* Header */}
      <header className="p-6 glass-dark border-b border-white/5 flex items-center justify-between z-10">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="text-mocha-400 hover:text-white transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold-500 rounded-xl flex items-center justify-center text-mocha-950 rotate-3">
              <Layout size={20} />
            </div>
            <div>
              <h1 className="text-xl font-serif font-bold text-white italic">AI Canvas</h1>
              <p className="text-[10px] font-mono text-mocha-500 uppercase tracking-widest">Web & App Architect</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
           <div className="flex bg-mocha-900 rounded-xl p-1 border border-white/5">
              <button 
                onClick={() => setActiveTab('code')} 
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'code' ? 'bg-gold-500 text-mocha-950' : 'text-mocha-500 hover:text-white'}`}
              >
                 <Code size={14} /> Code
              </button>
              <button 
                onClick={() => setActiveTab('preview')} 
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'preview' ? 'bg-gold-500 text-mocha-950' : 'text-mocha-500 hover:text-white'}`}
              >
                 <Play size={14} /> Preview
              </button>
           </div>
           <button className="p-3 glass rounded-xl text-mocha-400 hover:text-gold-500 transition-colors"><Save size={20} /></button>
           <button className="p-3 glass rounded-xl text-mocha-400 hover:text-gold-500 transition-colors"><Download size={20} /></button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Editor Side */}
        <div className="w-1/3 p-6 glass-dark border-r border-white/5 flex flex-col gap-6">
           <div className="space-y-4">
              <p className="text-xs font-bold text-mocha-300 uppercase tracking-widest">App Vision</p>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the web application or app component you want to build..."
                className="w-full h-40 bg-white/5 border border-white/10 rounded-3xl p-6 text-sm text-mocha-100 focus:outline-none focus:border-gold-500/50 transition-all resize-none italic"
              />
              <button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-gold-500 text-mocha-950 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gold-400 transition-all shadow-xl active:scale-95 disabled:opacity-50"
              >
                {isGenerating ? (
                  <Sparkles size={18} className="animate-spin" />
                ) : (
                  <>Create Web & App <Send size={18} /></>
                )}
              </button>
           </div>

           <div className="flex-1 overflow-y-auto space-y-6 mt-6">
              <p className="text-[10px] font-mono text-mocha-600 uppercase tracking-widest">Suggested Brews</p>
              {[
                "Personal Portfolio with Dark Mode",
                "Crypto Dashboard UI Kit",
                "E-commerce Product Feed",
                "AI Chat UI with Sidebar"
              ].map((s, i) => (
                <button 
                  key={i} 
                  onClick={() => setPrompt(s)}
                  className="w-full text-left p-4 glass rounded-2xl text-[10px] text-mocha-400 hover:bg-white/10 hover:text-gold-400 transition-all border-mocha-800"
                >
                   {s}
                </button>
              ))}
           </div>
        </div>

        {/* Viewport Side */}
        <div className="flex-1 bg-mocha-900/30 p-12 relative overflow-hidden flex flex-col items-center">
           {/* Viewport Control */}
           <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-4 glass p-2 rounded-2xl border-white/5 z-20">
              <button 
                onClick={() => setDevice('desktop')}
                className={`p-2 rounded-xl transition-all ${device === 'desktop' ? 'bg-gold-500 text-mocha-950' : 'text-mocha-500'}`}
              >
                 <Monitor size={18} />
              </button>
              <button 
                onClick={() => setDevice('mobile')}
                className={`p-2 rounded-xl transition-all ${device === 'mobile' ? 'bg-gold-500 text-mocha-950' : 'text-mocha-500'}`}
              >
                 <Smartphone size={18} />
              </button>
           </div>

           <div className={`w-full h-full flex items-center justify-center transition-all duration-500 ${device === 'mobile' ? 'max-w-[400px]' : 'max-w-full'}`}>
              <div className="w-full h-full glass rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.5)] border-white/5 relative overflow-hidden bg-mocha-950">
                 {isGenerating ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
                       <div className="w-16 h-16 border-4 border-mocha-800 border-t-gold-500 rounded-full animate-spin" />
                       <p className="text-gold-500 font-mono text-[10px] uppercase tracking-widest animate-pulse">Assembling Components...</p>
                    </div>
                 ) : (
                    <div className="p-12 text-center h-full flex flex-col justify-center">
                       <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center text-mocha-700 mx-auto mb-8 border border-white/5">
                          <Code size={48} />
                       </div>
                       <h3 className="text-3xl font-serif font-bold text-white mb-4 italic text-glow">The Digital Loom</h3>
                       <p className="text-mocha-400 max-w-sm mx-auto leading-relaxed">Generated application preview will appear here. Describe your vision to begin the assembly process.</p>
                    </div>
                 )}
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
