import { motion, AnimatePresence } from 'motion/react';
import { Image as ImageIcon, ChevronLeft, Send, Sparkles, Wand2, Download, Layers, Eye } from 'lucide-react';
import { useState } from 'react';
import { generateImage } from '../../services/geminiService';

export default function ImageTool({ onBack }: { onBack: () => void }) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [selectedStyle, setSelectedStyle] = useState('Cinematic');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    
    const url = await generateImage(prompt + ", style: " + selectedStyle);
    
    if (url) {
      setGeneratedImages(prev => [url, ...prev]);
    }
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-mocha-950 flex flex-col font-sans">
      <header className="p-6 glass-dark border-b border-white/5 flex items-center justify-between z-10">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="text-mocha-400 hover:text-white transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold-500 rounded-xl flex items-center justify-center text-mocha-950 rotate-3">
              <ImageIcon size={20} />
            </div>
            <div>
              <h1 className="text-xl font-serif font-bold text-white italic">Image Roaster</h1>
              <p className="text-[10px] font-mono text-mocha-500 uppercase tracking-widest">Visual Synthesis Engine</p>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
           <button className="flex items-center gap-2 px-6 py-3 glass rounded-xl text-sm font-bold text-mocha-200 hover:text-gold-500 transition-all">
              <Layers size={18} /> My Library
           </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <div className="w-[400px] p-8 glass-dark border-r border-white/5 flex flex-col gap-8">
           <div className="space-y-4">
              <label className="text-[10px] font-mono text-mocha-500 uppercase tracking-widest ml-1">Visual Prompt</label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A futuristic espresso bar on Mars, neon lighting, highly detailed..."
                className="w-full h-40 bg-white/5 border border-white/10 rounded-3xl p-6 text-sm text-mocha-100 focus:outline-none focus:border-gold-500/50 transition-all resize-none italic"
              />
           </div>

           <div className="space-y-4">
              <label className="text-[10px] font-mono text-mocha-500 uppercase tracking-widest ml-1">Aesthetic Style</label>
              <div className="grid grid-cols-2 gap-2">
                 {['Cinematic', 'Minimalist', 'Noir', 'Oil Painting', 'Digital Art', '3D Render'].map(style => (
                    <button 
                      key={style}
                      onClick={() => setSelectedStyle(style)}
                      className={`py-3 rounded-xl text-[10px] font-bold transition-all border ${selectedStyle === style ? 'bg-gold-500 text-mocha-950 border-gold-500' : 'bg-white/5 text-mocha-500 border-white/5 hover:bg-white/10'}`}
                    >
                       {style}
                    </button>
                 ))}
              </div>
           </div>

           <button 
             onClick={handleGenerate}
             disabled={isGenerating || !prompt.trim()}
             className="w-full bg-gold-500 text-mocha-950 py-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gold-400 transition-all shadow-xl active:scale-95 disabled:opacity-50 mt-auto"
           >
             {isGenerating ? <Wand2 size={20} className="animate-pulse" /> : <><Sparkles size={20} /> Create Image</>}
           </button>
        </div>

        <div className="flex-1 p-12 overflow-y-auto scrollbar-thin scrollbar-thumb-mocha-800">
           {isGenerating && (
             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }} 
               animate={{ opacity: 1, scale: 1 }}
               className="aspect-square max-w-2xl mx-auto glass rounded-[4rem] relative overflow-hidden flex items-center justify-center"
             >
                <div className="absolute inset-0 bg-gradient-to-tr from-gold-500/20 to-transparent animate-pulse" />
                <div className="text-center relative z-10">
                   <div className="w-20 h-20 bg-gold-500 rounded-3xl flex items-center justify-center text-mocha-950 mx-auto mb-6 shadow-[0_0_50px_rgba(212,175,55,0.4)] animate-bounce">
                      <Sparkles size={40} />
                   </div>
                   <h3 className="text-2xl font-serif font-bold text-white mb-2 italic">Developing Shadows...</h3>
                   <p className="text-mocha-500 font-mono text-[10px] uppercase tracking-widest">Processing Latent Space</p>
                </div>
             </motion.div>
           )}

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {generatedImages.map((url, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group relative glass rounded-[3rem] p-2 overflow-hidden shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all"
                >
                   <img src={url} alt="Generated" className="w-full h-auto rounded-[2.5rem] grayscale group-hover:grayscale-0 transition-all duration-700" />
                   <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                      <button className="w-14 h-14 glass rounded-full flex items-center justify-center text-white hover:text-gold-400 hover:scale-110 transition-all"><Eye size={24} /></button>
                      <button className="w-14 h-14 glass rounded-full flex items-center justify-center text-white hover:text-gold-400 hover:scale-110 transition-all"><Download size={24} /></button>
                   </div>
                   <div className="absolute bottom-6 left-1/2 -translate-x-1/2 glass px-6 py-2 rounded-full border-white/10 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                      <p className="text-[10px] font-mono text-mocha-200 tracking-widest uppercase">HD COMPACTED • CINEMATIC</p>
                   </div>
                </motion.div>
              ))}

              {!isGenerating && generatedImages.length === 0 && (
                <div className="col-span-2 h-[60vh] flex flex-col items-center justify-center text-center">
                   <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center text-mocha-700 mb-8">
                      <ImageIcon size={48} />
                   </div>
                   <h2 className="text-3xl font-serif font-bold text-white mb-4 italic">Empty Canvas.</h2>
                   <p className="text-mocha-400 max-w-sm">Use the prompt bar to begin roasting your first visual masterpiece. Our AI understands lighting, composition, and mood.</p>
                </div>
              )}
           </div>
        </div>
      </main>
    </div>
  );
}
