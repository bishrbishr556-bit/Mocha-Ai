import { motion } from 'motion/react';
import { Settings, ChevronLeft, User, Shield, Bell, Coffee, Globe, Moon, Save, ArrowUpRight, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { auth } from '../../lib/firebase';
import { updateProfile } from 'firebase/auth';
import { saveUserSettings, getUserSettings } from '../../services/firestoreService';
import Logo from '../ui/Logo';

export default function SettingsPage({ onBack, userPlan }: { onBack: () => void, userPlan: string }) {
  const user = auth.currentUser;
  const [activeTab, setActiveTab] = useState('profile');
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [handle, setHandle] = useState('@mocha_user');
  const [bio, setBio] = useState('AI enthusiast and certified coffee lover.');
  const [profilePicUrl, setProfilePicUrl] = useState(user?.photoURL || '');
  const [appLogoUrl, setAppLogoUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<null | 'success'>(null);

  // Notifications State
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(false);

  // AI Behavior state
  const [creativity, setCreativity] = useState(0.8);
  const [verbosity, setVerbosity] = useState('Balanced');

  // Load existing settings
  useEffect(() => {
    if (!user) return;
    const loadSettings = async () => {
      const settings = await getUserSettings(user.uid);
      if (settings) {
        setHandle(settings.handle || '@mocha_user');
        setBio(settings.bio || 'AI enthusiast and certified coffee lover.');
        setProfilePicUrl(settings.profilePicUrl || user.photoURL || '');
        setAppLogoUrl(settings.appLogoUrl || '');
        setEmailAlerts(settings.emailAlerts !== undefined ? settings.emailAlerts : true);
        setPushAlerts(settings.pushAlerts !== undefined ? settings.pushAlerts : false);
        setCreativity(settings.creativity || 0.8);
        setVerbosity(settings.verbosity || 'Balanced');
      }
    };
    loadSettings();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      // Update Firebase Profile for standard attributes
      await updateProfile(user, { 
        displayName,
        photoURL: profilePicUrl
      });
      
      // Update custom settings in Firestore
      await saveUserSettings(user.uid, {
        displayName,
        handle,
        bio,
        profilePicUrl,
        appLogoUrl,
        emailAlerts,
        pushAlerts,
        creativity,
        verbosity
      });

      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-mocha-950 flex flex-col font-sans">
      <header className="p-6 glass-dark border-b border-white/5 flex items-center justify-between z-10">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="text-mocha-400 hover:text-white transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-mocha-800 rounded-xl flex items-center justify-center text-gold-500 border border-white/10 shadow-lg" id="settings-icon">
              <Settings size={20} />
            </div>
            <div>
              <h1 className="text-xl font-serif font-bold text-white italic">Preferences</h1>
              <p className="text-[10px] font-mono text-mocha-500 uppercase tracking-widest">Mocha AI System Settings</p>
            </div>
          </div>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          id="save-settings-button"
          className={`${saveStatus === 'success' ? 'bg-green-500' : 'bg-gold-500'} text-mocha-950 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-xl active:scale-95 disabled:opacity-50`}
        >
           {isSaving ? 'Saving...' : saveStatus === 'success' ? <><Check size={18} /> Saved</> : <><Save size={18} /> Save Changes</>}
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
                   <div className="w-24 h-24 rounded-[2rem] bg-mocha-800 border-2 border-gold-500 flex items-center justify-center text-4xl shadow-2xl relative group cursor-pointer overflow-hidden" 
                     onClick={() => {
                        const url = window.prompt('Enter Profile Picture URL:', profilePicUrl);
                        if (url !== null) setProfilePicUrl(url);
                     }}
                   >
                      {profilePicUrl ? <img src={profilePicUrl} alt="p" className="w-full h-full object-cover" /> : '☕'}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-[10px] font-bold text-white text-center px-2">
                         CHANGE AVATAR
                      </div>
                   </div>
                   <div>
                      <h3 className="text-2xl font-serif font-bold text-white italic">{displayName || 'The Barista'}</h3>
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
                      <input 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-gold-500/50" 
                        value={displayName} 
                        onChange={(e) => setDisplayName(e.target.value)}
                      />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-mono text-mocha-600 uppercase tracking-widest ml-2">Handle</label>
                      <input 
                         className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-gold-500/50" 
                         value={handle}
                         onChange={(e) => setHandle(e.target.value)}
                         placeholder="@mocha_user" 
                      />
                   </div>
                   <div className="space-y-3 col-span-2">
                      <label className="text-[10px] font-mono text-mocha-600 uppercase tracking-widest ml-2">Bio / Professional Roast</label>
                      <textarea 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-gold-500/50 h-32 resize-none" 
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Explain your professional vibe..." 
                      />
                   </div>

                   <div className="col-span-2 mt-4 pt-8 border-t border-white/5">
                       <h4 className="text-lg font-serif font-bold text-white italic mb-6">Visual Identity</h4>
                       <div className="grid md:grid-cols-2 gap-8">
                          <div className="space-y-3">
                             <label className="text-[10px] font-mono text-mocha-600 uppercase tracking-widest ml-2">App Logo URL (Branding)</label>
                             <div className="relative group">
                                <input 
                                   className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 text-white focus:outline-none focus:border-gold-500/50" 
                                   value={appLogoUrl}
                                   onChange={(e) => setAppLogoUrl(e.target.value)}
                                   placeholder="https://example.com/logo.png" 
                                />
                                <div 
                                  className="absolute left-4 top-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform"
                                  onClick={() => {
                                    const url = window.prompt('Enter App Logo URL:', appLogoUrl);
                                    if (url !== null) setAppLogoUrl(url);
                                  }}
                                >
                                   <Logo size={20} url={appLogoUrl} showGlow={false} />
                                </div>
                             </div>
                             <p className="text-[9px] text-mocha-500 ml-2 italic">Click the icon to change via URL prompt</p>
                          </div>
                          <div className="space-y-3">
                             <label className="text-[10px] font-mono text-mocha-600 uppercase tracking-widest ml-2">Avatar URL</label>
                             <div className="relative">
                                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-mocha-500" size={18} />
                                <input 
                                   className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 text-white focus:outline-none focus:border-gold-500/50" 
                                   value={profilePicUrl}
                                   onChange={(e) => setProfilePicUrl(e.target.value)}
                                   placeholder="https://example.com/avatar.png" 
                                />
                             </div>
                          </div>
                       </div>
                    </div>
                </div>
             </motion.div>
           )}

           {activeTab === 'notifications' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                 <h3 className="text-xl font-serif font-bold text-white italic">Alert Preferences</h3>
                 <div className="space-y-4">
                    <div className="flex items-center justify-between p-6 glass rounded-3xl border-white/5">
                       <div>
                          <p className="font-bold text-mocha-100">Email Updates</p>
                          <p className="text-xs text-mocha-500">Receive weekly summaries of your top brews.</p>
                       </div>
                       <button 
                         onClick={() => setEmailAlerts(!emailAlerts)}
                         className={`w-14 h-8 rounded-full transition-all relative ${emailAlerts ? 'bg-gold-500' : 'bg-mocha-800'}`}
                       >
                          <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${emailAlerts ? 'right-1' : 'left-1'}`} />
                       </button>
                    </div>

                    <div className="flex items-center justify-between p-6 glass rounded-3xl border-white/5">
                       <div>
                          <p className="font-bold text-mocha-100">Push Notifications</p>
                          <p className="text-xs text-mocha-500">Real-time alerts when your synthesis completes.</p>
                       </div>
                       <button 
                         onClick={() => setPushAlerts(!pushAlerts)}
                         className={`w-14 h-8 rounded-full transition-all relative ${pushAlerts ? 'bg-gold-500' : 'bg-mocha-800'}`}
                       >
                          <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${pushAlerts ? 'right-1' : 'left-1'}`} />
                       </button>
                    </div>
                 </div>
              </motion.div>
           )}

           {activeTab === 'intelligence' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                 <h3 className="text-xl font-serif font-bold text-white italic">AI Behavior Controls</h3>
                 <div className="space-y-8">
                    <div className="space-y-4">
                       <div className="flex justify-between items-center">
                          <label className="text-xs font-mono text-mocha-400 uppercase tracking-widest">Creativity Quotient</label>
                          <span className="text-gold-500 text-sm font-bold">{creativity}</span>
                       </div>
                       <input 
                         type="range" min="0" max="1" step="0.1" 
                         value={creativity}
                         onChange={(e) => setCreativity(parseFloat(e.target.value))}
                         className="w-full accent-gold-500 opacity-80" 
                       />
                       <p className="text-[10px] text-mocha-500 italic">Higher values lead to more creative, diverse brews.</p>
                    </div>

                    <div className="space-y-4">
                       <label className="text-xs font-mono text-mocha-400 uppercase tracking-widest">Output Verbosity</label>
                       <div className="flex gap-2">
                          {['Concise', 'Balanced', 'Deep Roast'].map(v => (
                             <button 
                                key={v}
                                onClick={() => setVerbosity(v)}
                                className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all border ${verbosity === v ? 'bg-gold-500 text-mocha-950 border-gold-500 shadow-lg' : 'bg-white/5 text-mocha-500 border-white/5 hover:border-white/10'}`}
                             >
                                {v}
                             </button>
                          ))}
                       </div>
                    </div>
                 </div>
              </motion.div>
           )}

           {activeTab === 'security' && (
             <div className="h-full flex flex-col items-center justify-center text-center opacity-40 italic">
                <Shield size={48} className="mb-6 text-gold-500" />
                <h3 className="text-2xl font-serif font-bold text-white">Privacy Vault Locked</h3>
                <p className="text-mocha-400">All your brews are encrypted end-to-end by default.</p>
             </div>
           )}

           {activeTab === 'appearance' && (
             <div className="h-full flex flex-col items-center justify-center text-center opacity-40 italic">
                <Moon size={48} className="mb-6 text-gold-500" />
                <h3 className="text-2xl font-serif font-bold text-white">Defaulting to Dark Roast</h3>
                <p className="text-mocha-400">Mocha is optimized for low-light creative sessions.</p>
             </div>
           )}
        </div>
      </main>
    </div>
  );
}
