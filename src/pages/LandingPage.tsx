import { motion } from 'motion/react';
import { Coffee, Menu, X, ArrowRight, Play, Sparkles, Send } from 'lucide-react';
import { useState, useEffect } from 'react';

const Navbar = ({ onOpenApp, onLogin }: { onOpenApp: () => void, onLogin: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto glass rounded-2xl px-6 py-3 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gold-500 rounded-xl flex items-center justify-center text-mocha-950 rotate-3 shadow-lg group hover:rotate-0 transition-transform">
            <Coffee className="w-6 h-6" />
          </div>
          <span className="font-serif text-xl font-bold tracking-tight text-white italic">Mocha AI</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-mocha-200">
          <a href="#features" className="hover:text-gold-400 transition-colors">Features</a>
          <a href="#pricing" className="hover:text-gold-400 transition-colors">Pricing</a>
          <button 
            onClick={onLogin}
            className="text-mocha-100 hover:text-gold-400 font-bold transition-colors"
          >
            Sign In
          </button>
          <button 
            onClick={onOpenApp}
            className="bg-gold-500 text-mocha-950 px-5 py-2 rounded-xl font-bold hover:bg-gold-400 transition-all shadow-lg active:scale-95"
          >
            Launch Chat
          </button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-mocha-100" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Menu (simplified) */}
      {isOpen && (
        <div className="md:hidden mt-4 glass rounded-2xl p-6 flex flex-col gap-4">
          <a href="#features" onClick={() => setIsOpen(false)}>Features</a>
          <a href="#pricing" onClick={() => setIsOpen(false)}>Pricing</a>
          <button onClick={() => { onOpenApp(); setIsOpen(false); }} className="bg-gold-500 text-mocha-950 py-3 rounded-xl font-bold">Launch App</button>
        </div>
      )}
    </nav>
  );
};

const Hero = ({ onOpenApp }: { onOpenApp: () => void }) => {
  const [displayText, setDisplayText] = useState("");
  const fullText = "Smarter. Faster. More Human than ever.";
  
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setDisplayText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(timer);
    }, 50);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden min-h-screen flex items-center">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gold-600/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-mocha-600/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
        <motion.div
           initial={{ opacity: 0, x: -50 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gold-400 text-xs font-mono mb-8 tracking-widest uppercase">
            <Sparkles size={12} /> THE BRAIN BEHIND YOUR DIGITAL LIFE
          </div>
          <h1 className="text-6xl md:text-8xl font-serif font-bold text-white leading-[1.05] mb-8 italic tracking-tighter">
            Meet <span className="text-gold-500">Mocha AI</span>. <br />
            Personalized <br />Intelligence.
          </h1>
          <p className="text-mocha-400 text-xl font-mono min-h-[1.5em] mb-12">
            {displayText}<span className="animate-pulse text-gold-500">|</span>
          </p>
          <div className="flex flex-wrap gap-6">
            <button 
              onClick={onOpenApp}
              className="px-10 py-5 bg-gold-500 text-mocha-950 rounded-2xl font-bold text-xl hover:scale-105 transition-all shadow-[0_0_50px_rgba(212,175,55,0.3)] flex items-center gap-2"
            >
              Start for Free <ArrowRight size={20} />
            </button>
            <button className="px-10 py-5 glass text-white rounded-2xl font-bold text-xl hover:bg-white/10 transition-all flex items-center gap-2 group">
              <Play size={20} fill="currentColor" className="group-hover:scale-110 transition-transform" /> Watch Demo
            </button>
          </div>
          
          <div className="mt-16 flex items-center gap-8">
            <div className="flex -space-x-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-12 h-12 rounded-full border-4 border-mocha-950 bg-mocha-800 flex items-center justify-center text-[10px] font-bold overflow-hidden">
                   <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" />
                </div>
              ))}
            </div>
            <p className="text-sm text-mocha-500">Trusted by <span className="text-mocha-100 font-bold">1M+</span> discernment-driven professionals</p>
          </div>
        </motion.div>

        <motion.div 
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 1, delay: 0.2 }}
           className="relative"
        >
          {/* Futuristic Mockup Frame */}
          <div className="glass rounded-[4rem] p-4 shadow-[0_0_100px_rgba(212,175,55,0.1)] relative z-10">
             <div className="absolute inset-0 bg-gradient-to-tr from-gold-500/10 to-transparent rounded-[4rem] pointer-events-none" />
             <img 
               src="https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2574&auto=format&fit=crop" 
               alt="AI Visual" 
               className="w-full h-auto rounded-[3.2rem]"
             />
          </div>
          
          {/* Floating UI Elements */}
          <motion.div 
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -right-10 top-1/4 glass-dark p-6 rounded-3xl shadow-2xl z-20 border-white/5"
          >
             <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gold-500 rounded-xl flex items-center justify-center text-mocha-950"><Sparkles size={20} /></div>
                <div>
                   <p className="text-xs font-bold text-white">Neural Load</p>
                   <p className="text-[10px] text-mocha-500">Optimized Blend</p>
                </div>
             </div>
             <div className="h-1 bg-mocha-800 rounded-full w-32 overflow-hidden">
                <motion.div animate={{ width: ['0%', '85%'] }} transition={{ duration: 2, delay: 1 }} className="h-full bg-gold-500" />
             </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default function LandingPage({ onOpenApp, onLogin, onNavigate, currentPlan }: { onOpenApp: () => void, onLogin: () => void, onNavigate: (v: string) => void, currentPlan: string }) {
  return (
    <div className="bg-mocha-950 min-h-screen">
      <Navbar onOpenApp={onOpenApp} onLogin={onLogin} />
      <Hero onOpenApp={onOpenApp} />
      
      {/* Live AI Demo Section */}
      <section className="py-24 px-6 relative overflow-hidden bg-mocha-900/30">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
           <div>
              <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-8 italic">Experience <br />Instant Fusion.</h2>
              <p className="text-mocha-400 text-lg mb-10 leading-relaxed italic">
                Type a prompt, watch the magic brew. Mocha AI responds with the nuance of a master barista and the logic of a senior architect.
              </p>
              <div className="space-y-4">
                 {["Generate a marketing strategy for a sustainable coffee startup", "Write a secure React component for biometric login", "Explain the history of espresso in a Shakespearean sonnet"].map((prompt, i) => (
                   <div key={i} className="glass p-5 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-all border-mocha-800">
                      <span className="text-sm text-mocha-300 italic">{prompt}</span>
                      <ArrowRight size={16} className="text-gold-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                   </div>
                 ))}
              </div>
           </div>
           
           <div className="glass-dark rounded-[3rem] p-8 shadow-[0_0_100px_rgba(0,0,0,0.5)] border-white/5 h-[500px] flex flex-col">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-mocha-800 rounded-xl flex items-center justify-center text-gold-500">
                       <Sparkles size={20} />
                    </div>
                    <div>
                       <p className="text-sm font-bold text-white">Mocha Fusion-3</p>
                       <p className="text-[10px] text-green-500 font-mono tracking-widest uppercase">Steaming Live</p>
                    </div>
                 </div>
                 <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <div className="w-3 h-3 bg-gold-500 rounded-full" />
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                 </div>
              </div>
              
              <div className="flex-1 space-y-6 overflow-hidden">
                 <motion.div 
                   initial={{ x: -20, opacity: 0 }}
                   whileInView={{ x: 0, opacity: 1 }}
                   className="glass p-4 rounded-2xl rounded-tl-none max-w-[80%]"
                 >
                    <p className="text-xs text-mocha-300">How can I brew excellence for you today?</p>
                 </motion.div>
                 
                 <motion.div 
                   initial={{ x: 20, opacity: 0 }}
                   whileInView={{ x: 0, opacity: 1 }}
                   transition={{ delay: 1 }}
                   className="bg-gold-500 text-mocha-950 p-4 rounded-2xl rounded-tr-none max-w-[80%] ml-auto"
                 >
                    <p className="text-xs font-bold">Write a Python script for a coffee temperature sensor.</p>
                 </motion.div>

                 <motion.div 
                   initial={{ opacity: 0 }}
                   whileInView={{ opacity: 1 }}
                   transition={{ delay: 2 }}
                   className="glass p-6 rounded-2xl rounded-tl-none border-gold-500/20"
                 >
                    <p className="text-[10px] font-mono text-gold-500 mb-2 uppercase tracking-widest">Mocha Code</p>
                    <p className="text-xs text-mocha-300 font-mono leading-relaxed">
                       import time<br />
                       class MochaSensor:<br />
                       &nbsp;&nbsp;def watch_roast(self):<br />
                       &nbsp;&nbsp;&nbsp;&nbsp;return "Roasted to Perfection"
                    </p>
                 </motion.div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-white/5 flex gap-4">
                 <div className="flex-1 h-12 glass rounded-2xl border-white/10 flex items-center px-4">
                    <span className="text-[10px] text-mocha-600 italic">Waiting for prompt...</span>
                 </div>
                 <div className="w-12 h-12 bg-gold-500 rounded-2xl flex items-center justify-center text-mocha-950">
                    <Send size={20} />
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* App Preview Section */}
      <section id="preview" className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gold-400 text-xs font-mono mb-8">
              PREMIUM EXPERIENCE
           </div>
           <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-16 text-center italic">The Roasting Room <br />In Your Pocket.</h2>
           
           <div className="relative w-full max-w-5xl mx-auto">
              <motion.div 
                 initial={{ y: 100, opacity: 0 }}
                 whileInView={{ y: 0, opacity: 1 }}
                 viewport={{ once: true }}
                 className="glass rounded-[4rem] p-4 shadow-[0_0_100px_rgba(212,175,55,0.1)] border-gold-500/10"
              >
                 <img 
                    src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2574&auto=format&fit=crop" 
                    alt="App Preview" 
                    className="w-full h-full object-cover rounded-[3.2rem]"
                 />
              </motion.div>
              
              {/* Floating Mockup Widgets */}
              <motion.div 
                animate={{ y: [0, -20, 0] }} 
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute -left-12 top-1/4 glass-dark p-6 rounded-3xl shadow-2xl hidden md:block border-mocha-800"
              >
                 <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500"><Sparkles size={20} /></div>
                    <div>
                       <p className="text-xs font-bold text-white">Voice Synthesis</p>
                       <p className="text-[10px] text-mocha-500">Perfectly Roasted Audio</p>
                    </div>
                 </div>
                 <div className="h-1 bg-mocha-800 w-full rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} whileInView={{ width: '80%' }} className="h-full bg-gold-500" />
                 </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 20, 0] }} 
                transition={{ duration: 6, repeat: Infinity, delay: 1 }}
                className="absolute -right-12 bottom-1/4 glass-dark p-6 rounded-3xl shadow-2xl hidden md:block border-mocha-800"
              >
                 <p className="text-xs font-bold text-gold-500 mb-2">Brew Stats</p>
                 <div className="flex gap-2 items-end h-16">
                    {[3, 5, 2, 8, 4].map((h, i) => (
                      <div key={i} className="flex-1 bg-mocha-800 rounded-sm" style={{ height: `${h * 10}%` }} />
                    ))}
                 </div>
              </motion.div>
           </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="use-cases" className="py-24 px-6 bg-mocha-900 overflow-hidden">
         <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2">
               <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-8 italic">Blended for Every <br />Discerning Palate.</h2>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { title: "Students", desc: "Perfectly brewed summaries and research assistance." },
                    { title: "Business", desc: "Enterprise-grade automation for your boardroom." },
                    { title: "Developers", desc: "Roasted code snippets that compile on the first sip." },
                    { title: "Creators", desc: "Fresh visual ingredients for your next masterpiece." }
                  ].map((useCase, i) => (
                    <div key={i} className="glass p-6 rounded-3xl hover:border-gold-500/30 transition-colors">
                       <h4 className="text-xl font-serif font-bold text-white mb-2 italic">{useCase.title}</h4>
                       <p className="text-mocha-400 text-xs leading-relaxed">{useCase.desc}</p>
                    </div>
                  ))}
               </div>
            </div>
            
            <div className="lg:w-1/2 relative">
               <div className="aspect-video glass rounded-[3rem] p-1 shadow-2xl overflow-hidden">
                  <div className="w-full h-full bg-mocha-800 flex items-center justify-center relative">
                     <Play size={48} className="text-gold-500 z-10" />
                     <div className="absolute inset-0 bg-gold-500/5 backdrop-blur-sm" />
                  </div>
               </div>
               <p className="text-center text-mocha-600 text-xs mt-6 font-mono uppercase tracking-widest italic">Experience the Aroma of Innovation</p>
            </div>
         </div>
      </section>

      {/* Security Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
           <div className="w-20 h-20 bg-gold-500/10 rounded-full flex items-center justify-center text-gold-500 mx-auto mb-8 shadow-[0_0_40px_rgba(212,175,55,0.1)]">
              <Sparkles size={40} />
           </div>
           <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-8 italic">Your Private Reserve.</h2>
           <p className="text-mocha-400 text-lg mb-12 max-w-2xl mx-auto leading-relaxed italic">
             We roast with a privacy-first philosophy. Your conversations are end-to-end encrypted, and your data beans never leave our secure temperature-controlled vaults.
           </p>
           
           <div className="flex flex-wrap justify-center gap-8">
              {['SOC2 Type II', 'GDPR Roasted', 'ISO 27001 Blend'].map((badge, i) => (
                <div key={i} className="px-6 py-2 glass rounded-full text-mocha-300 text-xs font-mono tracking-widest border-mocha-800">
                   {badge}
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
           <div className="order-2 lg:order-1">
             <div className="grid grid-cols-2 gap-4">
                <div className="glass p-6 rounded-3xl h-48 flex flex-col justify-end">
                   <p className="text-3xl font-serif font-bold text-gold-500">99.9%</p>
                   <p className="text-xs text-mocha-400 uppercase tracking-widest mt-2">Uptime Brew</p>
                </div>
                <div className="glass p-6 rounded-3xl h-64 flex flex-col justify-end translate-y-4">
                   <p className="text-3xl font-serif font-bold text-gold-500">200ms</p>
                   <p className="text-xs text-mocha-400 uppercase tracking-widest mt-2">Latte Response</p>
                </div>
                <div className="glass p-6 rounded-3xl h-64 flex flex-col justify-end -translate-y-4">
                   <p className="text-3xl font-serif font-bold text-gold-500">128-bit</p>
                   <p className="text-xs text-mocha-400 uppercase tracking-widest mt-2">Roasted Encryption</p>
                </div>
                <div className="glass p-6 rounded-3xl h-48 flex flex-col justify-end">
                   <p className="text-3xl font-serif font-bold text-gold-500">Infinite</p>
                   <p className="text-xs text-mocha-400 uppercase tracking-widest mt-2">Scalability</p>
                </div>
             </div>
           </div>
           
           <div className="order-1 lg:order-2">
              <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-8 italic">Better than your <br />Morning Coffee.</h2>
              <div className="space-y-6">
                 {[
                   { label: "Secure & Private", sub: "Your data stays in your cup. We never sell your personal 'coffee beans'." },
                   { label: "Instant Execution", sub: "No cold brews here. Everything is lightning fast and freshly prepared." },
                   { label: "Multi-language Support", sub: "We speak over 50 global dialects of coffee and code." }
                 ].map((item, i) => (
                   <div key={i} className="flex gap-4">
                      <div className="w-1.5 h-auto bg-gold-500 rounded-full shrink-0" />
                      <div>
                        <p className="font-serif text-xl font-bold text-white italic">{item.label}</p>
                        <p className="text-mocha-400 text-sm mt-1">{item.sub}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 px-6 bg-mocha-900 border-y border-mocha-800">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
            <motion.div
               initial={{ opacity: 0, x: -20 }}
               whileInView={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-4xl md:text-6xl font-serif font-bold text-white italic tracking-tighter">Select your Roast.</h2>
              <p className="text-mocha-400 mt-4 max-w-md italic">Simple pricing that scales with your creative and business needs. No hidden fees, just pure filtered intelligence.</p>
            </motion.div>
            <div className="flex glass p-1.5 rounded-2xl border-white/5">
                <button className="px-8 py-3 bg-gold-500 text-mocha-950 rounded-xl text-xs font-bold shadow-2xl transition-all">Monthly</button>
                <button className="px-8 py-3 text-mocha-400 rounded-xl text-xs font-bold hover:text-white transition-all">Yearly <span className="text-gold-500 ml-1">-20%</span></button>
            </div>
         </div>

         <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
            {[
              { 
                name: "Single Shot", 
                price: "Free", 
                items: ["100 messages/day", "Standard roasting", "Community access"], 
                button: currentPlan === 'free' ? "Already Subscribed" : "Start Free",
                action: () => onNavigate('dashboard'),
                disabled: currentPlan === 'free'
              },
              { 
                name: "Double Espresso", 
                price: "$29", 
                items: ["Unlimited messages", "Priority roasting", "Advanced tools", "Beta features"], 
                button: currentPlan === 'pro' ? "Active Plan" : "Go Pro", 
                spotlight: true,
                action: () => onNavigate('payment'),
                disabled: currentPlan === 'pro'
              },
              { 
                name: "Cold Brew Master", 
                price: "$99", 
                items: ["Dedicated cluster", "API access", "SSO integration", "Personal barista support"], 
                button: currentPlan === 'premium' ? "Active Plan" : "Contact Sales",
                action: () => onNavigate('contact'),
                disabled: currentPlan === 'premium'
              }
            ].map((plan, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -12, transition: { duration: 0.3 } }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className={`p-10 rounded-[3.5rem] flex flex-col relative overflow-hidden transition-all duration-500 group ${plan.spotlight ? 'bg-mocha-800 border-2 border-gold-500 shadow-[0_30px_100px_rgba(212,175,55,0.15)] scale-105 z-10' : 'glass border-white/5 hover:border-white/20'}`}
              >
                 {plan.spotlight && <div className="absolute top-0 right-0 bg-gold-500 text-mocha-950 text-[10px] font-mono font-bold px-6 py-2 rounded-bl-3xl uppercase tracking-widest shadow-xl">Most Popular</div>}
                 <h4 className="text-3xl font-serif font-bold text-white mb-2 italic tracking-tight">{plan.name}</h4>
                 <div className="flex items-baseline gap-2 mb-10">
                    <span className="text-6xl font-serif font-bold text-white">{plan.price}</span>
                    {plan.price !== "Free" && <span className="text-mocha-500 text-lg">/mo</span>}
                 </div>
                 <div className="space-y-5 mb-12 flex-1">
                    {plan.items.map((item, j) => (
                      <div key={j} className="flex items-center gap-4 text-mocha-300 text-sm italic">
                         <div className="w-1.5 h-1.5 bg-gold-500 rounded-full shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
                         {item}
                      </div>
                    ))}
                 </div>
                 <button 
                   onClick={plan.action}
                   disabled={plan.disabled}
                   className={`w-full py-5 rounded-[2rem] font-bold text-lg transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 ${plan.spotlight ? 'bg-gold-500 text-mocha-950 shadow-2xl hover:bg-gold-400' : 'glass border-white/20 text-white hover:bg-white/10'}`}
                 >
                    {plan.button}
                 </button>
              </motion.div>
            ))}
         </div>
      </section>

      {/* Future Vision Section */}
      <section className="py-24 px-6 bg-mocha-950 overflow-hidden relative">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
           <div className="w-px h-24 bg-gradient-to-b from-transparent to-gold-500 mb-12" />
           <h2 className="text-5xl md:text-7xl font-serif font-bold text-white mb-12 italic leading-tight">Beyond Apps. <br />Your Companion for the <br />Autonomous Age.</h2>
           
           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20 w-full">
              {[
                { title: "Mobile Essence", desc: "Your personal AI follows you everywhere, adapting to your location and context.", icon: <Sparkles size={24} /> },
                { title: "Digital Blueprint", desc: "We learn your unique workflows and suggest optimizations in real-time.", icon: <Play size={24} /> },
                { title: "Universal Bridge", desc: "Connect Mocha to any API or hardware. The only limit is your imagination.", icon: <ArrowRight size={24} /> }
              ].map((item, i) => (
                <div key={i} className="glass p-10 rounded-[3rem] text-left hover:bg-white/10 transition-colors group">
                   <div className="w-16 h-16 bg-mocha-800 rounded-2xl flex items-center justify-center text-gold-500 mb-8 group-hover:scale-110 transition-transform">
                      {item.icon}
                   </div>
                   <h4 className="text-2xl font-serif font-bold text-white mb-4 italic">{item.title}</h4>
                   <p className="text-mocha-400 leading-relaxed italic">{item.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-mocha-800">
         <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2">
               <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-gold-500 rounded-lg flex items-center justify-center text-mocha-950">
                  <Coffee size={18} />
                </div>
                <span className="font-serif text-xl font-bold text-white italic">Mocha AI</span>
              </div>
              <p className="text-mocha-400 max-w-sm leading-relaxed italic">
                From the first bean to the final byte, we provide the intelligence that fuels your most daring ideas. Join the future of human-AI collaboration.
              </p>
            </div>
            <div>
               <h5 className="text-white font-serif font-bold mb-6 text-lg italic">Platform</h5>
               <ul className="space-y-3 text-mocha-500 text-sm">
                  <li><a href="#" className="hover:text-gold-400">Features</a></li>
                  <li><a href="#" className="hover:text-gold-400">Security</a></li>
                  <li><a href="#" className="hover:text-gold-400">Integrations</a></li>
                  <li><a href="#" className="hover:text-gold-400">Enterprise</a></li>
               </ul>
            </div>
            <div>
               <h5 className="text-white font-serif font-bold mb-6 text-lg italic">Company</h5>
               <ul className="space-y-3 text-mocha-500 text-sm">
                  <li><a href="#" className="hover:text-gold-400">About Us</a></li>
                  <li><a href="#" className="hover:text-gold-400">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-gold-400">Terms of Roast</a></li>
                  <li><a href="#" className="hover:text-gold-400">Contact</a></li>
               </ul>
            </div>
         </div>
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 pt-10 border-t border-mocha-900">
            <p className="text-mocha-600 text-[10px] font-mono tracking-widest uppercase">© 2026 Mocha AI. All rights reserved.</p>
            <div className="flex gap-8">
               {['Twitter', 'Instagram', 'LinkedIn', 'YouTube'].map(social => (
                 <a key={social} href="#" className="text-mocha-600 hover:text-gold-500 transition-colors uppercase text-[10px] font-mono tracking-widest">
                   {social}
                 </a>
               ))}
            </div>
         </div>
      </footer>
      {/* Floating Chat Trigger */}
      <motion.button
         initial={{ scale: 0 }}
         animate={{ scale: 1 }}
         onClick={onOpenApp}
         className="fixed bottom-8 right-8 w-16 h-16 bg-gold-500 text-mocha-950 rounded-full shadow-[0_0_50px_rgba(212,175,55,0.3)] flex items-center justify-center group z-[100] border-4 border-mocha-950"
      >
         <Coffee size={28} className="group-hover:rotate-12 transition-transform" />
         <div className="absolute -top-12 right-0 glass-dark px-3 py-1 rounded-lg text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border-gold-500/20">
            Fresh brew ready?
         </div>
      </motion.button>
    </div>
  );
}
