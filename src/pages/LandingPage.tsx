import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Brain, Mic, Zap, ArrowRight, MessageSquare, Shield, Smartphone, GraduationCap, ChevronDown, Mail } from 'lucide-react';
import Logo from '../components/ui/Logo';

export default function LandingPage({ onOpenApp, onLogin, onNavigate, appLogoUrl, currentPlan }: { onOpenApp: () => void, onLogin: () => void, onNavigate: (v: string) => void, appLogoUrl?: string, currentPlan: string }) {
  return (
    <div className="relative min-h-screen bg-primary-black overflow-hidden selection:bg-purple-500 selection:text-white font-sans">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-8 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between bg-black/40 backdrop-blur-xl px-10 py-5 rounded-full border border-white/5 shadow-2xl">
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => onNavigate('landing')}>
            <Logo size={48} url={appLogoUrl} />
            <div className="flex flex-col">
              <span className="font-display text-xl font-black tracking-tight text-white leading-none uppercase">Mocha <span className="text-purple-500">AI</span></span>
              <span className="text-[10px] font-mono text-white/40 tracking-[0.3em] uppercase mt-1">Innovation Core</span>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-8 text-sm font-medium">
             <a href="#" className="text-white bg-white/10 px-6 py-2 rounded-xl font-bold transition-all border border-white/10 shadow-lg shadow-purple-500/10 relative overflow-hidden group">
               <span className="relative z-10">Home</span>
               <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500 group-hover:h-1 transition-all" />
             </a>
            {['About', 'Committee', 'Students', 'Events', 'Gallery', 'Contact'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-white/60 hover:text-white transition-all duration-300 text-[13px] font-bold">{item}</a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={onOpenApp}
              className="px-8 py-3.5 bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 text-white rounded-2xl font-bold text-sm flex items-center gap-2 hover:scale-[1.05] active:scale-95 transition-all shadow-[0_0_30px_rgba(147,51,234,0.3)] border border-white/10"
            >
              <Sparkles size={16} />
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-20 px-6 max-w-7xl mx-auto text-center" id="home">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
           className="flex flex-col items-center"
        >
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="mb-10"
          >
            <Logo size={120} url={appLogoUrl} className="shadow-[0_0_50px_rgba(147,51,234,0.2)]" />
          </motion.div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-purple-400 text-xs font-mono mb-8 tracking-[0.3em] uppercase backdrop-blur-md">
            <Sparkles size={14} className="animate-pulse" /> Your Intelligent AI Assistant 🤖
          </div>

          <h1 className="text-5xl md:text-8xl font-display font-bold text-cream-text mb-8 leading-[1.1] tracking-tight">
            The Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-400">Excellence</span> Is Here
          </h1>
          
          <p className="max-w-2xl mx-auto text-cream-text/40 text-lg md:text-xl font-light mb-12 leading-relaxed">
            Connect, Collaborate, and Innovate with Mocha AI. A premium digital ecosystem designed to brew excellence into your daily digital workflow.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={onOpenApp}
              className="px-10 py-5 bg-purple-600 text-white rounded-2xl font-bold text-lg flex items-center gap-3 hover:bg-purple-500 transition-all shadow-[0_10px_30px_rgba(147,51,234,0.3)] active:scale-95"
            >
              Start For Free <ArrowRight size={20} />
            </button>
            <button 
              onClick={() => onNavigate('dashboard')}
              className="px-10 py-5 rounded-2xl bg-white/5 border border-white/10 text-cream-text font-semibold hover:bg-white/10 transition-all duration-300"
            >
              View Analytics
            </button>
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">About Us</h2>
            <p className="text-cream-text/40 text-lg">Learn about our mission, values, and the community we've built together</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
             <div className="glass p-10 rounded-[2rem] border-white/5">
                <h3 className="text-2xl font-bold text-white mb-6 italic">Our Mission</h3>
                <p className="text-cream-text/60 leading-relaxed mb-6 italic">
                  Mocha AI is born from the vision of empowering students and professionals with seamless digital tools. We believe in the power of connection and the clarity of intelligence.
                </p>
                <div className="flex gap-4">
                   <div className="flex-1 p-6 bg-white/5 rounded-2xl text-center">
                      <div className="text-3xl font-black text-purple-400 mb-1">100+</div>
                      <div className="text-[10px] uppercase tracking-widest text-mocha-500 font-bold">Members</div>
                   </div>
                   <div className="flex-1 p-6 bg-white/5 rounded-2xl text-center">
                      <div className="text-3xl font-black text-indigo-400 mb-1">5★</div>
                      <div className="text-[10px] uppercase tracking-widest text-mocha-500 font-bold">Rating</div>
                   </div>
                </div>
             </div>
             <div className="relative aspect-square rounded-[3rem] overflow-hidden group">
                <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2670&auto=format&fit=crop" alt="Campus Life" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
             </div>
          </div>

          <div className="text-center">
             <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">Class Usthad</h2>
             <p className="text-cream-text/40 font-mono text-[10px] uppercase tracking-[0.5em] mb-16">The guiding light of Mocha AI Core</p>
             
             <div className="max-w-4xl mx-auto glass p-12 rounded-[3rem] border-purple-500/20 relative overflow-hidden group">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full" />
                <div className="relative flex flex-col md:flex-row items-center gap-12 text-left">
                   <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-purple-500/30 p-2 shrink-0">
                      <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=2680&auto=format&fit=crop" alt="Usthad" className="w-full h-full object-cover rounded-full" />
                   </div>
                   <div>
                      <div className="text-5xl text-purple-500/30 font-serif mb-4 leading-none">“</div>
                      <p className="text-lg md:text-xl text-cream-text/80 italic leading-relaxed mb-8">
                        "It has been a privilege to guide this remarkable class. Each student carries the spirit of Mocha — curiosity, integrity, and the drive to make a difference. I am proud of every one of you."
                      </p>
                      <div className="h-px w-20 bg-purple-500/30 mb-6" />
                      <h4 className="text-2xl font-bold text-white">Hafiz Ahmed Dilqash Furqani</h4>
                      <p className="text-purple-400 font-mono text-sm uppercase tracking-widest mt-1">Class Teacher • Mocha AI Core 2026</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Committee Section */}
      <section id="committee" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-7xl font-display font-bold text-white mb-6">Executive Committee</h2>
            <p className="text-cream-text/40 text-lg">Meet the dedicated team leading Mocha AI innovation</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "Yaseen", role: "President", color: "bg-purple-500" },
              { name: "Rayyan", role: "Treasurer", color: "bg-orange-500" },
              { name: "Razi", role: "Joint Secretary", color: "bg-pink-500" },
              { name: "Anas", role: "Working Secretary", color: "bg-emerald-500" },
              { name: "Ameen", role: "Secretary", color: "bg-cyan-500" },
              { name: "Shehin", role: "Vice President", color: "bg-indigo-500" }
            ].map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass p-8 rounded-[2.5rem] text-center border-white/5 hover:border-purple-500/30 transition-all group"
              >
                <div className={`w-24 h-24 mx-auto ${member.color} rounded-full flex items-center justify-center text-white text-3xl font-black mb-6 shadow-2xl group-hover:scale-110 transition-transform`}>
                   {member.name.substring(0, 2).toUpperCase()}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{member.name}</h3>
                <span className={`inline-block px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white ${member.color} bg-opacity-80`}>
                   {member.role}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Students Section */}
      <section id="students" className="py-24 px-6 bg-black/20">
        <div className="max-w-7xl mx-auto">
           <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
              <div>
                 <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-4">The Students</h2>
                 <p className="text-cream-text/40 text-lg">Excellence in diversity, united by vision</p>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-mono tracking-[0.3em] uppercase text-mocha-300">
                 <span className="w-12 h-px bg-white/10" />
                 Showing 17 members
                 <span className="w-12 h-px bg-white/10" />
              </div>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {['Bishar', 'Aman', 'Rayyan', 'Khalil', 'Nadih', 'Midlaj', 'Ziyad', 'Anzil', 'Hisham', 'Shadi', 'Fawaz', 'Amin', 'Ashkar', 'Nihal', 'Razi', 'Yasin', 'Munfis'].map((name, i) => (
                <div key={i} className="glass border-white/5 rounded-3xl overflow-hidden group hover:border-purple-500/40 transition-all">
                   <div className="aspect-[4/5] relative bg-mocha-900 flex items-center justify-center">
                      <span className="text-8xl font-black text-white/5 uppercase select-none">{name.substring(0, 2)}</span>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-6 left-6">
                        <h4 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">{name}</h4>
                        <p className="text-[10px] font-mono text-mocha-500 uppercase tracking-widest">Mocha AI Scholar</p>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-7xl font-display font-bold text-white mb-6">Events & Activities</h2>
            <p className="text-cream-text/40 text-lg">Join us at our upcoming events and create lasting memories</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
             <div className="glass p-8 rounded-[3rem] border-white/5 hover:border-purple-500/30 transition-all overflow-hidden relative group">
                <div className="aspect-video rounded-2xl overflow-hidden mb-8">
                   <img src="https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?q=80&w=2676&auto=format&fit=crop" alt="Iftar" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-bold uppercase tracking-widest mb-6">
                   <Zap size={10} /> Class Interaction
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">Iftar Meet 2026</h3>
                <p className="text-cream-text/60 leading-relaxed mb-8">
                  A beautiful gathering of students and mentors to celebrate the spirit of Ramadan together with prayer, reflection, and community.
                </p>
                <div className="flex items-center gap-6 text-sm font-mono text-mocha-400">
                   <span className="flex items-center gap-2">📅 March 14, 2026</span>
                   <span className="flex items-center gap-2">📍 Thamarassery</span>
                </div>
             </div>

             <div className="flex flex-col gap-8">
                {[
                  { title: "Tech Symposium", date: "April 05, 2026", icon: <Brain size={20} /> },
                  { title: "Sports Meet", date: "May 12, 2026", icon: <Zap size={20} /> },
                  { title: "Alumni Meet", date: "June 20, 2026", icon: <GraduationCap size={20} /> }
                ].map((ev, i) => (
                  <div key={i} className="glass p-8 rounded-[2rem] border-white/5 flex items-center justify-between group hover:bg-white/5 transition-all">
                     <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                           {ev.icon}
                        </div>
                        <div>
                           <h4 className="text-xl font-bold text-white">{ev.title}</h4>
                           <p className="text-mocha-500 text-sm mt-1">{ev.date}</p>
                        </div>
                     </div>
                     <ArrowRight className="text-mocha-700 group-hover:translate-x-2 transition-transform" />
                  </div>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-24 px-6 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-20">
             <h2 className="text-4xl md:text-6xl font-display font-bold text-white">Gallery</h2>
             <div className="flex gap-4 p-2 bg-white/5 rounded-2xl border border-white/5">
                <button className="px-8 py-3 bg-purple-600 text-white rounded-xl font-bold text-sm shadow-xl">Photos</button>
                <button className="px-8 py-3 hover:bg-white/5 text-mocha-400 font-bold text-sm transition-all rounded-xl">Videos</button>
             </div>
          </div>

          <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
             {[1,2,3,4,5,6].map((idx) => (
               <div key={idx} className="break-inside-avoid glass rounded-3xl overflow-hidden border-white/5 group relative cursor-pointer">
                  <img src={`https://images.unsplash.com/photo-${1500000000000 + idx * 1000000}?q=80&w=1000&auto=format&fit=crop`} alt="Gallery" className="w-full hover:scale-105 transition-all duration-700" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-purple-600 scale-0 group-hover:scale-100 transition-transform duration-500">
                        <Sparkles size={20} />
                     </div>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-7xl font-display font-bold text-white mb-6 tracking-tight">Contact <span className="text-purple-500">Us</span></h2>
            <p className="text-cream-text/40 text-lg">Have questions? We'd love to hear from you.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
             <div className="lg:col-span-1 space-y-8">
                <div className="glass p-10 rounded-[2.5rem] border-white/5">
                   <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 mb-8">
                      <Mail size={24} />
                   </div>
                   <h4 className="text-xl font-bold text-white mb-4">Email Us</h4>
                   <p className="text-mocha-500 text-sm mb-2 italic">mocha.nexus@gmail.com</p>
                   <p className="text-mocha-500 text-sm italic">support@mochaai.core</p>
                </div>
                <div className="glass p-10 rounded-[2.5rem] border-white/5">
                   <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 mb-8">
                      <Smartphone size={24} />
                   </div>
                   <h4 className="text-xl font-bold text-white mb-4">Call Us</h4>
                   <p className="text-mocha-500 text-sm mb-2 italic">+1 (555) 734-2910</p>
                   <p className="text-mocha-500 text-sm italic">+1 (555) 902-1145</p>
                </div>
             </div>

             <div className="lg:col-span-2 glass p-12 md:p-16 rounded-[3rem] border-white/5">
                <form className="grid sm:grid-cols-2 gap-8" onSubmit={(e) => e.preventDefault()}>
                   <div className="space-y-3">
                      <label className="text-[10px] font-mono uppercase tracking-widest text-mocha-400 ml-4 font-bold">Full Name</label>
                      <input type="text" placeholder="Your name" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-purple-500 transition-all outline-none" />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-mono uppercase tracking-widest text-mocha-400 ml-4 font-bold">Email Address</label>
                      <input type="email" placeholder="Your email" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-purple-500 transition-all outline-none" />
                   </div>
                   <div className="sm:col-span-2 space-y-3">
                      <label className="text-[10px] font-mono uppercase tracking-widest text-mocha-400 ml-4 font-bold">Message</label>
                      <textarea placeholder="How can we help?" rows={6} className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-6 text-white focus:border-purple-500 transition-all outline-none resize-none" />
                   </div>
                   <div className="sm:col-span-2">
                      <button className="w-full py-6 bg-purple-600 text-white rounded-3xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-purple-500 shadow-2xl active:scale-[0.98] transition-all">
                         Send Transmission <ArrowRight size={20} />
                      </button>
                   </div>
                </form>
             </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto glass rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden border-white/5">
           <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-500/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
           
           <h2 className="text-4xl md:text-7xl font-display font-bold text-cream-text mb-8 tracking-tighter">Ready to brew <span className="italic text-purple-400 font-serif">excellence?</span></h2>
           <p className="max-w-xl mx-auto text-cream-text/50 text-lg mb-12">Join thousands of creatives and professionals using Mocha AI to supercharge their life.</p>
           
           <button 
             onClick={onOpenApp}
             className="px-12 py-6 bg-purple-600 text-white rounded-[2rem] font-bold text-xl shadow-[0_0_50px_rgba(147,51,234,0.4)] hover:bg-purple-500 transition-all active:scale-95"
           >
             Start Generating Now
           </button>
        </div>
      </section>

      {/* Floating Chat Button */}
      <motion.button 
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={onOpenApp}
        className="fixed bottom-10 right-10 z-[100] w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center shadow-[0_10px_40px_rgba(147,51,234,0.4)] border border-white/20 group"
      >
         <MessageSquare size={28} className="group-hover:animate-bounce" />
         <div className="absolute right-full mr-4 px-4 py-2 bg-black/80 backdrop-blur-md rounded-xl text-white text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 whitespace-nowrap pointer-events-none">
            Chat with Mocha AI
         </div>
      </motion.button>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
             <Logo size={35} url={appLogoUrl} />
             <span className="font-display font-bold text-cream-text tracking-tight italic uppercase">Mocha AI</span>
          </div>
          <p className="text-cream-text/20 text-xs font-mono uppercase tracking-widest leading-loose text-center md:text-left">© 2026 Mocha • Official AI Ecosystem • All Rights Reserved</p>
          <div className="flex gap-8 text-xs font-mono uppercase tracking-[0.2em] text-cream-text/40">
             <a href="#" className="hover:text-purple-400 transition-colors">Privacy</a>
             <a href="#" className="hover:text-purple-400 transition-colors">Terms</a>
             <a href="#" className="hover:text-purple-400 transition-colors">Status</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
