import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, Layers, Cpu, Sparkles, Share2, 
  Play, Save, Plus, Settings2, Zap, 
  GitBranch, Terminal, Coffee
} from 'lucide-react';
import React, { useState } from 'react';

interface LoomNode {
  id: string;
  type: 'core' | 'filter' | 'output';
  label: string;
  status: 'active' | 'processing' | 'idle';
  position: { x: number; y: number };
}

export default function DigitalLoom({ onBack }: { onBack: () => void }) {
  const [nodes, setNodes] = useState<LoomNode[]>([
    { id: '1', type: 'core', label: 'Espresso Core v4', status: 'active', position: { x: 100, y: 150 } },
    { id: '2', type: 'filter', label: 'Sentiment Roast', status: 'idle', position: { x: 400, y: 100 } },
    { id: '3', type: 'filter', label: 'Creative Steam', status: 'idle', position: { x: 400, y: 250 } },
    { id: '4', type: 'output', label: 'Neural Brew', status: 'idle', position: { x: 700, y: 175 } },
  ]);

  const [activeTab, setActiveTab] = useState<'threads' | 'logs' | 'config'>('threads');
  const [isAssembling, setIsAssembling] = useState(false);

  const startAssembly = () => {
    setIsAssembling(true);
    setTimeout(() => setIsAssembling(false), 3000);
  };

  return (
    <div className="min-h-screen bg-mocha-950 text-white font-sans overflow-hidden flex flex-col">
      {/* HUD Header */}
      <header className="p-6 border-b border-white/5 bg-mocha-950/80 backdrop-blur-2xl flex items-center justify-between z-50">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="p-3 glass rounded-2xl text-mocha-400 hover:text-white transition-all hover:scale-110">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-serif font-bold italic flex items-center gap-3">
              The Digital Loom 
              <span className="px-2 py-0.5 bg-gold-500 text-mocha-950 text-[10px] font-mono font-bold rounded-full uppercase tracking-tighter shadow-[0_0_15px_rgba(212,175,55,0.3)]">Beta</span>
            </h1>
            <p className="text-[10px] font-mono text-mocha-500 uppercase tracking-[0.3em]">Neural Assembly Unit 01</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-8 mr-8">
            <div className="text-right">
              <p className="text-[10px] font-mono text-mocha-600 uppercase tracking-widest">Compute Load</p>
              <div className="w-24 h-1 bg-white/5 rounded-full mt-1 overflow-hidden">
                <motion.div 
                  animate={{ width: ['20%', '45%', '30%'] }} 
                  transition={{ duration: 4, repeat: Infinity }}
                  className="h-full bg-gold-500 shadow-[0_0_10px_rgba(212,175,55,0.5)]" 
                />
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-mono text-mocha-600 uppercase tracking-widest">Roast Latency</p>
              <p className="text-xs font-mono text-gold-500">14ms</p>
            </div>
          </div>
          
          <button className="p-3 glass rounded-xl text-mocha-400 hover:text-white transition-all">
            <Save size={18} />
          </button>
          <button className="p-3 glass rounded-xl text-mocha-400 hover:text-white transition-all">
             <Share2 size={18} />
          </button>
          <button 
            onClick={startAssembly}
            disabled={isAssembling}
            className="flex items-center gap-2 px-6 py-3 bg-white text-mocha-950 rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all shadow-2xl disabled:opacity-50"
          >
            {isAssembling ? <Zap size={18} className="animate-pulse" /> : <Play size={18} fill="currentColor" />}
            Assemble
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row relative">
        {/* Workspace Sidebar */}
        <aside className="w-full md:w-80 border-r border-white/5 bg-mocha-950/50 p-6 space-y-8 z-20">
           <div className="space-y-4">
              <p className="text-[10px] font-mono text-mocha-600 uppercase tracking-widest">Capabilities Library</p>
              <div className="grid grid-cols-1 gap-3">
                 {[
                   { label: 'Hyper-Grind', icon: Layers, desc: 'Enhanced resolution scaling' },
                   { label: 'Aroma-Synch', icon: Sparkles, desc: 'Contextual pattern matching' },
                   { label: 'Neural Steam', icon: Cpu, desc: 'Volatile logic generation' }
                 ].map(lib => (
                   <button key={lib.label} className="flex items-center gap-4 p-4 glass rounded-2xl text-left hover:bg-white/5 transition-all group">
                      <div className="p-3 bg-mocha-900 rounded-xl text-gold-500 group-hover:scale-110 transition-transform">
                         <lib.icon size={18} />
                      </div>
                      <div>
                         <p className="text-sm font-bold text-white italic">{lib.label}</p>
                         <p className="text-[10px] text-mocha-500 italic mt-0.5">{lib.desc}</p>
                      </div>
                   </button>
                 ))}
                 <button className="w-full py-4 border-2 border-dashed border-white/5 rounded-2xl text-mocha-600 flex items-center justify-center gap-2 hover:border-gold-500/20 hover:text-gold-500 transition-all text-xs font-mono uppercase tracking-widest">
                    <Plus size={14} /> Import Protocol
                 </button>
              </div>
           </div>

           <div className="space-y-4">
              <p className="text-[10px] font-mono text-mocha-600 uppercase tracking-widest">Thread Density</p>
              <div className="glass p-6 rounded-3xl border-white/5">
                 <input type="range" className="w-full accent-gold-500 opacity-50" />
                 <div className="flex justify-between mt-2 text-[10px] font-mono text-mocha-600">
                    <span>Fine</span>
                    <span className="text-gold-500">Coarse</span>
                 </div>
              </div>
           </div>
        </aside>

        {/* Main Canvas Area */}
        <main className="flex-1 relative bg-mocha-950 p-6 md:p-12 overflow-hidden">
            {/* Background Texture/Image */}
            <div className="absolute inset-0 z-0 opacity-20">
               <img 
                 src="https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2574&auto=format&fit=crop" 
                 alt="Neural Grid" 
                 className="w-full h-full object-cover"
                 referrerPolicy="no-referrer"
               />
            </div>
            
            {/* Thread Grid (Visual only) */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-1" 
                 style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
            />

            {/* Neural Links (SVG) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
               <defs>
                  <linearGradient id="threadGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                     <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.8" />
                     <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.1" />
                  </linearGradient>
               </defs>
               <motion.path 
                 d="M 220 185 C 310 185, 310 145, 400 145" 
                 stroke="url(#threadGrad)" 
                 strokeWidth="2" 
                 fill="none"
                 initial={{ pathLength: 0 }}
                 animate={{ pathLength: 1 }}
                 transition={{ duration: 2, repeat: Infinity }}
               />
               <motion.path 
                 d="M 220 185 C 310 185, 310 325, 400 325" 
                 stroke="url(#threadGrad)" 
                 strokeWidth="2" 
                 fill="none"
                 initial={{ pathLength: 0 }}
                 animate={{ pathLength: 1 }}
                 transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
               />
               <motion.path 
                 d="M 520 145 C 610 145, 610 215, 700 215" 
                 stroke="url(#threadGrad)" 
                 strokeWidth="2" 
                 fill="none"
               />
               <motion.path 
                 d="M 520 325 C 610 325, 610 215, 700 215" 
                 stroke="url(#threadGrad)" 
                 strokeWidth="2" 
                 fill="none"
               />
            </svg>

            <AnimatePresence>
              {nodes.map(node => (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  className="absolute z-20"
                  style={{ left: node.position.x, top: node.position.y }}
                >
                  <div className={`p-1 rounded-[2rem] ${node.type === 'core' ? 'bg-gold-500 shadow-[0_0_30px_rgba(212,175,55,0.2)]' : 'glass border-white/10 shadow-2xl'}`}>
                     <div className="bg-mocha-950/90 backdrop-blur-xl rounded-[1.8rem] p-6 flex flex-col items-center gap-3 border border-white/5 w-48">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${node.type === 'core' ? 'bg-gold-500 text-mocha-950' : 'bg-mocha-900 text-gold-500'}`}>
                           {node.type === 'core' && <Cpu size={20} />}
                           {node.type === 'filter' && <Settings2 size={20} />}
                           {node.type === 'output' && <Coffee size={20} />}
                        </div>
                        <div className="text-center">
                           <p className="text-sm font-bold italic text-white">{node.label}</p>
                           <p className="text-[10px] font-mono text-mocha-500 uppercase tracking-widest mt-1">{node.id} - Protocol Ready</p>
                        </div>
                     </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Assembly Overlay */}
            {isAssembling && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 flex items-center justify-center bg-mocha-950/20 backdrop-blur-sm"
              >
                 <div className="relative">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                      className="w-48 h-48 border-4 border-gold-500/20 rounded-full border-t-gold-500"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                       <p className="text-[10px] font-mono text-gold-500 uppercase tracking-[0.5em] mb-2 animate-pulse">Assembling</p>
                       <h3 className="text-2xl font-serif font-bold italic text-white">Weaving Threads</h3>
                    </div>
                 </div>
              </motion.div>
            )}
        </main>

        {/* Console / Info Fixed HUD */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-lg px-6 z-30">
           <div className="glass-dark border border-white/5 rounded-[2.5rem] p-6 shadow-2xl backdrop-blur-3xl">
              <div className="flex gap-4 mb-6">
                 {['threads', 'logs', 'config'].map((t) => (
                   <button 
                     key={t}
                     onClick={() => setActiveTab(t as any)}
                     className={`flex-1 py-2 text-[10px] font-mono uppercase tracking-widest rounded-xl transition-all ${activeTab === t ? 'bg-white/10 text-white font-bold' : 'text-mocha-500 hover:text-mocha-400'}`}
                   >
                     {t}
                   </button>
                 ))}
              </div>
              
              <div className="h-24 overflow-hidden mask-fade-bottom">
                 <AnimatePresence mode="wait">
                    {activeTab === 'logs' ? (
                       <motion.div key="logs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1 font-mono text-[10px] text-mocha-400">
                          <p className="text-green-500">[SYSTEM] Connection established with Alpha Cluster</p>
                          <p>[LOOM] Thread density synchronized at 0.82</p>
                          <p>[CORE] Espresso v4 ready for high-temperature inference</p>
                          <p className="text-gold-500">[WARN] Volatile steam detected in Output Buffer 02</p>
                       </motion.div>
                    ) : (
                       <motion.div key="threads" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between h-full group">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-gold-500">
                                <GitBranch size={20} />
                             </div>
                             <div>
                                <p className="text-xs font-bold text-white italic">Active Web: Synthesis_Master</p>
                                <p className="text-[10px] text-mocha-500 mt-1 italic">32 connected intelligence nodes</p>
                             </div>
                          </div>
                          <Terminal size={16} className="text-mocha-600 group-hover:text-gold-500 transition-colors" />
                       </motion.div>
                    )}
                 </AnimatePresence>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
