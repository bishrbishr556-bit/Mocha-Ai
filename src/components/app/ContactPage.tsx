import { motion } from 'motion/react';
import { ChevronLeft, Send, Mail, MapPin, Phone, Coffee } from 'lucide-react';
import React, { useState } from 'react';

export default function ContactPage({ onBack }: { onBack: () => void }) {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onBack();
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-mocha-950 flex flex-col font-sans">
      <header className="p-6 glass-dark border-b border-white/5 flex items-center justify-between z-10 sticky top-0">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="text-mocha-400 hover:text-white transition-colors p-2 glass rounded-xl">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-serif font-bold text-white italic">Sales Inquiry</h1>
            <p className="text-[10px] font-mono text-mocha-500 uppercase tracking-widest">Cold Brew Master Access</p>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full py-12 px-6 grid lg:grid-cols-2 gap-16 items-start">
        <div className="space-y-12">
           <div className="space-y-6">
              <h2 className="text-5xl font-serif font-bold text-white italic">Enterprise <br />Intelligence.</h2>
              <p className="text-mocha-400 text-lg leading-relaxed italic">
                 For high-volume roasting, custom SSL requirements, and dedicated compute clusters. Let's discuss your organization's unique requirements.
              </p>
           </div>

           <div className="space-y-6">
              <div className="flex items-center gap-6 group">
                 <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-gold-500 group-hover:scale-110 transition-transform">
                    <Mail size={24} />
                 </div>
                 <div>
                    <p className="text-[10px] font-mono text-mocha-600 uppercase tracking-widest">Email Us</p>
                    <a href="mailto:sales@mochaai.com" className="text-white font-bold hover:text-gold-500 transition-colors">sales@mochaai.com</a>
                 </div>
              </div>
              
              <div className="flex items-center gap-6 group">
                 <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-gold-500 group-hover:scale-110 transition-transform">
                    <MapPin size={24} />
                 </div>
                 <div>
                    <p className="text-[10px] font-mono text-mocha-600 uppercase tracking-widest">The Vault</p>
                    <p className="text-white font-bold">San Francisco, Roasted District</p>
                 </div>
              </div>
           </div>
           
           <div className="p-8 glass rounded-[3rem] border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><Coffee size={64} /></div>
              <h4 className="text-white font-serif font-bold mb-2 italic">Looking for support?</h4>
              <p className="text-mocha-400 text-xs italic">Visit our documentation hub or open a ticket in the learning center.</p>
           </div>
        </div>

        <div className="glass-dark border border-white/5 rounded-[3rem] p-10 relative overflow-hidden">
           {submitted ? (
             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="h-[400px] flex flex-col items-center justify-center text-center space-y-6"
             >
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-mocha-950 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                   <Send size={32} />
                </div>
                <h3 className="text-3xl font-serif font-bold text-white italic">Inquiry Received.</h3>
                <p className="text-mocha-500 text-sm italic">Our enterprise barista will be in touch within 24 roasting hours.</p>
             </motion.div>
           ) : (
             <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-mono text-mocha-600 uppercase tracking-widest ml-2">Full Name</label>
                      <input className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-gold-500/50" placeholder="John Connoisseur" required />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-mono text-mocha-600 uppercase tracking-widest ml-2">Work Email</label>
                      <input type="email" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-gold-500/50" placeholder="john@company.io" required />
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-mono text-mocha-600 uppercase tracking-widest ml-2">Company Name</label>
                   <input className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-gold-500/50" placeholder="Acme Roasters Inc." required />
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-mono text-mocha-600 uppercase tracking-widest ml-2">Interest</label>
                   <select className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-gold-500/50 appearance-none italic">
                      <option className="bg-mocha-900">Custom Integration</option>
                      <option className="bg-mocha-900">Dedicated Compute</option>
                      <option className="bg-mocha-900">Enterprise Licensing</option>
                   </select>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-mono text-mocha-600 uppercase tracking-widest ml-2">Message</label>
                   <textarea className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-gold-500/50 h-32 resize-none italic" placeholder="Tell us about your roasting scale..." required />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-gold-500 text-mocha-950 py-5 rounded-[2rem] font-bold text-lg hover:bg-gold-400 transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3"
                >
                   Send Inquiry <Send size={20} />
                </button>
             </form>
           )}
        </div>
      </main>
    </div>
  );
}
