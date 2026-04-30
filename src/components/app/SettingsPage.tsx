import { motion } from 'motion/react';
import { Settings, ChevronLeft, User, Shield, Bell, Coffee, Globe, Moon, Save, ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import { auth } from '../../lib/firebase';

export default function SettingsPage({ onBack, userPlan }: { onBack: () => void, userPlan: string }) {
  const user = auth.currentUser;
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="min-h-screen bg-mocha-950 flex flex-col font-sans">
      <header className="p-6 glass-dark border-b border-white/5 flex items-center justify-between z-10">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="text-mocha-400 hover:text-white transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-mocha-800 rounded-xl flex items-center justify-center text-gold-500 border border-white/10 shadow-lg">
              <Settings size={20} />
            </div>
            <div>
              <h1 className="text-xl font-serif font-bold text-white italic">Preferences</h1>
              <p className="text-[10px] font-mono text-mocha-500 uppercase tracking-widest">Mocha AI System Settings</p>
            </div>
          </div>
        </div>
        <button className="bg-gold-500 text-mocha-950 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gold-400 transition-all shadow-xl active:scale-95">
           <Save size={18} /> Save Changes
        </button>
      </header>

      <main className="flex-1 flex max-w-5xl mx-auto w-full py-12 px-6 gap-12 overflow-hidden">
        {/* Nav Tabs */}
        <div className="w-64 flex flex-col gap-2">
           {[
             { id: 'profile', label: 'User Profile', icon: <User size={18} /> },
             { id: 'security', label: 'Privacy & Security', icon: <Shield size={18} /> },
             { id: 'notifications', label: 'Alerts', icon: <Bell size={18} /> },
             { id: 'intelligence', label: 'AI Behavior', icon: <Coffee size={18} /> },
             { id: 'appearance', label: 'Interface', icon: <Moon size={18} /> }
           ].map(tab => (
             <button 
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all text-sm font-bold ${activeTab === tab.id ? 'bg-gold-500 text-mocha-950' : 'text-mocha-400 hover:bg-white/5 hover:text-white'}`}
             >
                {tab.icon} {tab.label}
             </button>
           ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 glass-dark rounded-[3rem] p-10 border-white/5 overflow-y-auto scrollbar-thin scrollbar-thumb-mocha-800">
           {activeTab === 'profile' && (
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="flex items-center gap-6 pb-8 border-b border-white/5">
                   <div className="w-24 h-24 rounded-[2rem] bg-mocha-800 border-2 border-gold-500 flex items-center justify-center text-4xl shadow-2xl relative group cursor-pointer overflow-hidden">
                      {user?.photoURL ? <img src={user.photoURL} alt="p" /> : '☕'}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                         <Globe size={24} className="text-gold-500" />
                      </div>
                   </div>
                   <div>
                      <h3 className="text-2xl font-serif font-bold text-white italic">{user?.displayName || 'The Barista'}</h3>
                      <p className="text-mocha-500 text-sm">{user?.email}</p>
                      <div className="mt-3 flex items-center gap-2">
                         <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-500/10 border border-gold-500/20 rounded-full text-[10px] font-mono text-gold-500 uppercase tracking-widest">
                            Active Roast: {userPlan}
                         </div>
                         {userPlan === 'free' && (
                            <button onClick={onBack} className="text-[10px] items-center gap-1 flex font-mono text-mocha-400 hover:text-gold-500 transition-colors uppercase tracking-widest">
                              Upgrade <ArrowUpRight size={10} />
                            </button>
                         )}
                      </div>
                   </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                   <div className="space-y-3">
                      <label className="text-[10px] font-mono text-mocha-600 uppercase tracking-widest ml-2">Public Name</label>
                      <input className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-gold-500/50" defaultValue={user?.displayName || ''} />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-mono text-mocha-600 uppercase tracking-widest ml-2">Handle</label>
                      <input className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-gold-500/50" placeholder="@mocha_user" />
                   </div>
                   <div className="space-y-3 col-span-2">
                      <label className="text-[10px] font-mono text-mocha-600 uppercase tracking-widest ml-2">Bio / Professional Roast</label>
                      <textarea className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-gold-500/50 h-32 resize-none" placeholder="Explain your professional vibe..." />
                   </div>
                </div>
             </motion.div>
           )}

           {activeTab !== 'profile' && (
             <div className="h-full flex flex-col items-center justify-center text-center opacity-40 italic">
                <Settings size={48} className="mb-6 text-gold-500" />
                <h3 className="text-2xl font-serif font-bold text-white">Advanced Controls Coming Soon</h3>
                <p className="text-mocha-400">Our engineers are perfecting the backend valves for these settings.</p>
             </div>
           )}
        </div>
      </main>
    </div>
  );
}
