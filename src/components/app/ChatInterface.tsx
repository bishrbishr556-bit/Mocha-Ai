import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, User as UserIcon, Bot, Sparkles, Mic, Image as ImageIcon, Settings, LogOut, ChevronLeft, Plus, MessageSquare, Trash2, X, Layout, Music, Search, BookOpen, ShieldAlert, Copy, RotateCcw, Zap, Radio } from 'lucide-react';
import { Message } from '../../types';
import { streamChat } from '../../services/geminiService';
import { auth, db } from '../../lib/firebase';
import { saveMessage, getChatMessages, getUserChats, createNewChat, getSystemConfig } from '../../services/firestoreService';
import { doc, updateDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { ToastType } from '../ui/Toast';
import ReactMarkdown from 'react-markdown';
import Logo from '../ui/Logo';

interface ChatInterfaceProps {
  onBack: () => void;
  onNavigate: (view: any) => void;
  userPlan: 'free' | 'pro' | 'premium';
  showToast: (msg: string, type?: ToastType) => void;
  appLogoUrl?: string;
}

export default function ChatInterface({ onBack, onNavigate, userPlan, showToast, appLogoUrl }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chats, setChats] = useState<any[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [activeLanguage, setActiveLanguage] = useState<'English' | 'Malayalam' | 'Arabic'>('English');
  const [isRMode, setIsRMode] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [systemConfig, setSystemConfig] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const user = auth.currentUser;

  // Listen for system config (broadcasts)
  useEffect(() => {
    const unsub = getSystemConfig((config) => {
      setSystemConfig(config);
      if (config?.broadcast) {
        showToast(`Incoming Neural Command: ${config.broadcast}`, "info");
      }
    });
    return () => unsub();
  }, []);

  // Load user chats
  useEffect(() => {
    if (!user) return;
    const unsub = getUserChats(user.uid, (data) => {
      setChats(data);
      if (data.length > 0 && !activeChatId) {
        setActiveChatId(data[0].id);
      }
    });
    return () => unsub();
  }, [user]);

  // Load active chat messages
  useEffect(() => {
    if (!user || !activeChatId) return;
    const unsub = getChatMessages(user.uid, activeChatId, (msgs) => {
      setMessages(msgs);
    });
    return () => unsub();
  }, [user, activeChatId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, streamingMessage]);

  // Plan limit tracking
  const [dailyMessages, setDailyMessages] = useState<number>(0);
  const today = new Date().toISOString().split('T')[0];
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Negative sentiment keywords
  const negativeKeywords = ['hate', 'kill', 'stupid', 'idiot', 'useless', 'bad', 'wrong', 'die', 'threat', 'scam'];
  
  const checkNegative = (text: string) => {
    const lower = text.toLowerCase();
    return negativeKeywords.some(word => lower.includes(word));
  };

  const playAlert = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    }
    audioRef.current.play().catch(e => console.log('Audio blocked', e));
  };

  useEffect(() => {
    if (!user) return;
    const key = `mocha_limit_${user.uid}_${today}`;
    const count = parseInt(localStorage.getItem(key) || '0');
    setDailyMessages(count);
  }, [user, today]);

  const handleSend = async () => {
    if (!input.trim() || isTyping || !user) return;

    // Plan limit check
    if (userPlan === 'free' && dailyMessages >= 100) {
       showToast("Daily Roast Limit Reached. Upgrade for unlimited brewing!", 'info');
       onNavigate('payment');
       return;
    }

    let chatId = activeChatId;
    
    // Increment count
    const newCount = dailyMessages + 1;
    setDailyMessages(newCount);
    localStorage.setItem(`mocha_limit_${user.uid}_${today}`, newCount.toString());

    // Create a new chat if none exists
    if (!chatId) {
      chatId = await createNewChat(user.uid, input.slice(0, 30) + '...');
      setActiveChatId(chatId);
    }

    const isNegative = checkNegative(input);
    if (isNegative) {
      playAlert();
      showToast("System Alert: Negative sequence detected.", "error");
    }

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    setStreamingMessage('');

    // Save user message to Firestore with sentiment flag
    await saveMessage(user.uid, chatId!, { ...userMessage, isNegative } as any);

    // Update chat timestamp
    await updateDoc(doc(db, 'users', user.uid, 'chats', chatId!), {
      updatedAt: serverTimestamp()
    });

    try {
      const languageInstruction = activeLanguage === 'English' ? '' : ` IMPORTANT: Respond strictly in ${activeLanguage}.`;
      const modeInstruction = isRMode ? " Apply deep reasoning and step-by-step logic (R-Mode)." : "";
      const broadcastInstruction = systemConfig?.broadcast ? ` GLOBAL PROTOCOL: ${systemConfig.broadcast}` : "";
      
      const chatMessages = messages.map(m => ({ role: m.role === 'user' ? 'user' as const : 'model' as const, content: m.content }));
      chatMessages.push({ role: 'user', content: userMessage.content + languageInstruction + modeInstruction + broadcastInstruction });

      const stream = streamChat(chatMessages);
      let fullContent = '';

      for await (const chunk of stream) {
        fullContent += chunk;
        setStreamingMessage(fullContent);
      }
      
      const aiMessage: Message = {
        role: 'model',
        content: fullContent,
        timestamp: new Date()
      };

      // Save AI message to Firestore
      await saveMessage(user.uid, chatId!, aiMessage);
    } catch (err) {
      showToast("Brewing failed. Check connection.", "error");
    } finally {
      setIsTyping(false);
      setStreamingMessage('');
    }
  };

  const startNewChat = async () => {
    if (!user) return;
    const id = await createNewChat(user.uid, "New Roast");
    setActiveChatId(id);
    setMessages([]);
  };

  const deleteChat = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, 'users', user.uid, 'chats', id));
    if (activeChatId === id) setActiveChatId(null);
  };

  const handleLogout = async () => {
    await auth.signOut();
    onBack();
  };

  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const toggleVoice = () => setIsVoiceActive(!isVoiceActive);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast("Message copied to clipboard", "success");
  };

  return (
    <div className="flex h-screen bg-primary-black overflow-hidden font-sans text-cream-text">
      {/* Voice Waveform Overlay */}
      <AnimatePresence>
        {isVoiceActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-primary-black/95 backdrop-blur-3xl flex flex-col items-center justify-center"
          >
             <div className="flex gap-2 h-40 items-center mb-12">
                {[...Array(30)].map((_, i) => (
                  <motion.div 
                    key={i}
                    animate={{ height: ['15%', '100%', '15%'] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.03 }}
                    className="w-1.5 bg-gold-accent rounded-full shadow-[0_0_30px_#D4AF37]"
                  />
                ))}
             </div>
             <h3 className="text-4xl font-display font-bold text-white mb-8 italic">Listening to your vision...</h3>
             <button 
               onClick={() => setIsVoiceActive(false)}
               className="w-24 h-24 bg-mocha-brown/20 rounded-full flex items-center justify-center text-white border border-white/10 hover:bg-white/10 transition-colors shadow-2xl"
             >
                <X size={32} />
             </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar for Chat History */}
      <aside className="hidden lg:flex w-80 flex-col glass border-r border-white/5 z-20">
         <div className="p-8 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-10 cursor-pointer group" onClick={onBack}>
              <Logo size={45} url={appLogoUrl} className="group-hover:rotate-[10deg] transition-transform duration-500" />
              <span className="font-display text-2xl font-bold tracking-tight">MOCHA <span className="text-purple-500">AI</span></span>
            </div>

            <button 
              onClick={startNewChat}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 transition-all font-bold text-sm text-purple-500 mb-10 shadow-[0_0_20px_rgba(147,51,234,0.05)]"
            >
              <Plus size={18} /> New Chat
            </button>
            
            <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/5">
                <p className="text-[10px] font-mono text-mocha-500 uppercase tracking-[0.3em] mb-6 ml-2 font-bold">Workspace</p>
                <div className="space-y-1 mb-8">
                  {[
                    { id: 'canvas', icon: <Layout size={18} />, label: 'Studio Tools' },
                    { id: 'image-gen', icon: <ImageIcon size={18} />, label: 'Visual Creation' },
                    { id: 'research', icon: <Search size={18} />, label: 'Deep Context' },
                  ].map(tool => (
                    <button 
                      key={tool.id}
                      onClick={() => onNavigate(tool.id)}
                      className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/5 transition-all text-sm text-cream-text/60 hover:text-purple-500 group"
                    >
                      <span className="group-hover:scale-110 transition-transform">{tool.icon}</span>
                      <span className="font-medium tracking-wide">{tool.label}</span>
                    </button>
                  ))}
                </div>

                <p className="text-[10px] font-mono text-mocha-500 uppercase tracking-[0.3em] mb-6 ml-2 font-bold">Recent History</p>
                <div className="space-y-2">
                   {chats.map(chat => (
                     <div 
                       key={chat.id}
                       onClick={() => setActiveChatId(chat.id)}
                       className={`group flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all ${activeChatId === chat.id ? 'bg-white/5 border border-white/10' : 'hover:bg-white/5 border border-transparent'}`}
                     >
                        <div className="flex items-center gap-3 overflow-hidden">
                           <MessageSquare size={16} className={activeChatId === chat.id ? 'text-gold-accent' : 'text-mocha-500'} />
                           <p className={`text-xs font-medium truncate ${activeChatId === chat.id ? 'text-white' : 'text-cream-text/50'}`}>{chat.title}</p>
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); deleteChat(chat.id); }} 
                          className="opacity-0 group-hover:opacity-100 text-mocha-500 hover:text-red-400 p-1 transition-all"
                        >
                          <Trash2 size={12} />
                        </button>
                     </div>
                   ))}
                </div>
            </div>

            <div className="pt-8 mt-auto border-t border-white/5 flex flex-col gap-4">
                <button 
                  onClick={() => onNavigate('admin')}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/5 text-sm text-cream-text/50 transition-all font-medium"
                >
                   <ShieldAlert size={18} /> Admin Dashboard
                </button>
                <div className="flex items-center gap-4 p-4 glass rounded-2xl border-white/5 group">
                   <div className="w-12 h-12 rounded-xl bg-mocha-brown/20 overflow-hidden shrink-0 border border-white/5">
                      <img src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} alt="Avatar" className="w-full h-full object-cover" />
                   </div>
                   <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-bold truncate text-white">{user?.displayName || 'Executive'}</p>
                      <p className="text-[10px] text-mocha-500 truncate font-mono uppercase tracking-widest">{userPlan} Plan</p>
                   </div>
                   <button onClick={handleLogout} className="text-mocha-500 hover:text-red-400 p-2 transition-colors">
                      <LogOut size={18} />
                   </button>
                </div>
            </div>
         </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col relative bg-primary-black">
        {/* Subtle Brand Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none select-none">
           <Logo size={600} url={appLogoUrl} showGlow={false} className="grayscale brightness-0 invert" />
        </div>

        {/* Chat Header */}
        <header className="px-8 py-6 glass-dark border-b border-white/5 flex items-center justify-between z-10 backdrop-blur-3xl relative">
          <AnimatePresence>
            {systemConfig?.broadcast && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="absolute top-full left-0 right-0 bg-gold-500 text-mocha-950 px-8 py-2 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-3 z-50 shadow-2xl overflow-hidden"
              >
                <Radio size={14} className="animate-pulse" />
                <span>Priority Broadcast: {systemConfig.broadcast}</span>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex items-center gap-5">
            <button onClick={onBack} className="lg:hidden text-cream-text/50 hover:text-white transition-colors">
              <ChevronLeft size={24} />
            </button>
            <div className="hidden lg:block">
              <div className="flex items-center gap-3">
                <h2 className="font-display text-xl font-bold text-white tracking-tight">MOCHA <span className="text-purple-500 font-serif italic">AI</span></h2>
                {isRMode && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }}
                    className="px-2 py-0.5 rounded bg-purple-500 text-primary-black text-[9px] font-bold uppercase tracking-wider"
                  >
                    Neural Mode R
                  </motion.div>
                )}
              </div>
              <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-mocha-500 mt-1">Live • Neural Core Active</p>
            </div>
            <div className="lg:hidden flex items-center gap-3">
               <Logo size={40} url={appLogoUrl} />
               <h2 className="font-display font-bold text-white tracking-tight uppercase">Mocha AI</h2>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             {/* Language Selector */}
             <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10 mr-4">
                {(['English', 'Malayalam', 'Arabic'] as const).map(lang => (
                  <button 
                    key={lang}
                    onClick={() => setActiveLanguage(lang)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${activeLanguage === lang ? 'bg-gold-accent text-primary-black' : 'text-mocha-500 hover:text-white'}`}
                  >
                    {lang.slice(0, 3)}
                  </button>
                ))}
             </div>

             {/* R Mode Toggle */}
             <button 
              onClick={() => setIsRMode(!isRMode)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${isRMode ? 'bg-gold-500/10 border-gold-500 text-gold-500' : 'bg-white/5 border-white/10 text-mocha-500 opacity-50'}`}
             >
                <div className={`w-2 h-2 rounded-full ${isRMode ? 'bg-gold-500 animate-pulse' : 'bg-mocha-800'}`} />
                <span className="text-[10px] font-mono uppercase tracking-widest font-bold">R</span>
             </button>

             <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                 <span className="text-[10px] font-mono text-mocha-500 uppercase tracking-widest leading-none">Operational</span>
             </div>
             <button 
               onClick={() => onNavigate('settings')}
               className="p-3 glass hover:bg-white/10 rounded-xl transition-all text-cream-text/50 hover:text-white"
             >
               <Settings size={20} />
             </button>
          </div>
        </header>

        {/* Message Viewport */}
        <main 
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-6 md:px-20 py-12 space-y-12 scrollbar-thin scrollbar-thumb-white/5 z-0"
        >
          {messages.length === 0 && !isTyping && !streamingMessage && (
            <div className="h-full flex flex-col items-center justify-center text-center">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.8 }} 
                 animate={{ opacity: 1, scale: 1 }}
                 className="mb-12"
               >
                  <Logo size={120} url={appLogoUrl} className="shadow-[0_0_60px_rgba(212,175,55,0.15)]" />
               </motion.div>
               <h3 className="text-4xl font-display font-bold text-white mb-6 tracking-tight">The Digital Brew Awaits.</h3>
               <p className="text-cream-text/30 max-w-md text-lg font-light leading-relaxed mb-12">How can Mocha AI supercharge your vision today? Choose a preset or start typing.</p>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
                  {[
                    "Craft a business pitch for an AI venture",
                    "Write a professional email for a partnership",
                    "Explain black holes using coffee metaphors",
                    "Design a minimalist mobile app layout"
                  ].map((text, i) => (
                    <button 
                      key={i} 
                      onClick={() => setInput(text)}
                      className="p-6 glass rounded-2xl text-sm text-left text-cream-text/60 hover:bg-white/5 hover:border-gold-accent/30 transition-all border-white/5 group"
                    >
                       <div className="flex items-center gap-3">
                          <Zap size={14} className="text-mocha-500 group-hover:text-gold-accent transition-colors" />
                          <span className="group-hover:text-cream-text/90 transition-colors">{text}</span>
                       </div>
                    </button>
                  ))}
               </div>
            </div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-6 max-w-full md:max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-10 h-10 md:w-14 md:h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-2xl mt-1 border border-white/5 transition-all duration-300 ${
                    msg.role === 'user' ? 'bg-purple-600 text-white rotate-[-3deg]' : 'glass text-purple-400 rotate-[3deg]'
                  }`}>
                    {msg.role === 'user' ? <UserIcon size={24} /> : <Bot size={28} />}
                  </div>
                  
                  <div className={`relative group p-8 rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] text-base md:text-lg leading-relaxed border border-white/5 transition-all duration-300 ${
                    msg.role === 'user' 
                      ? 'bg-mocha-brown/10 text-cream-text rounded-tr-none' 
                      : 'glass text-cream-text/90 rounded-tl-none font-sans'
                  }`}>
                    <div className="prose prose-invert max-w-none">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                    
                    <div className={`flex items-center gap-4 mt-6 border-t border-white/5 pt-4 opacity-0 group-hover:opacity-100 transition-opacity`}>
                       <button onClick={() => copyToClipboard(msg.content)} className="text-mocha-500 hover:text-gold-accent transition-colors">
                          <Copy size={14} />
                       </button>
                       {msg.role === 'model' && (
                         <button className="text-mocha-500 hover:text-gold-accent transition-colors">
                            <RotateCcw size={14} />
                         </button>
                       )}
                       <span className="ml-auto text-[10px] font-mono uppercase tracking-widest text-mocha-600">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                       </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {(isTyping || streamingMessage) && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start w-full"
              >
                <div className="flex gap-6 max-w-full md:max-w-[85%]">
                  <div className="w-10 h-10 md:w-14 md:h-14 rounded-2xl glass border-white/10 flex items-center justify-center text-purple-400 shrink-0 rotate-[3deg]">
                    <Bot size={28} />
                  </div>
                  <div className="glass border-white/5 p-8 rounded-[1.5rem] rounded-tl-none shadow-[0_20px_50px_rgba(0,0,0,0.2)] text-base md:text-lg text-cream-text/90 max-w-none">
                    {streamingMessage ? (
                       <div className="prose prose-invert max-w-none whitespace-pre-wrap">
                          <ReactMarkdown>{streamingMessage}</ReactMarkdown>
                          <motion.span 
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                            className="inline-block w-1 h-5 bg-gold-accent ml-1 align-middle"
                          />
                       </div>
                    ) : (
                       <div className="flex gap-2 items-center py-2">
                          <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity }} className="w-2.5 h-2.5 bg-gold-accent rounded-full" />
                          <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }} className="w-2.5 h-2.5 bg-gold-accent rounded-full" />
                          <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }} className="w-2.5 h-2.5 bg-gold-accent rounded-full" />
                       </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Input Dock */}
        <footer className="px-6 md:px-20 py-10 z-10">
           <div className="max-w-4xl mx-auto">
              <div className="relative glass rounded-3xl p-2 border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.5)]">
                <div className="flex items-end gap-2 px-4">
                   <button onClick={toggleVoice} className="mb-4 p-3 hover:bg-white/5 rounded-xl transition-colors text-cream-text/40 hover:text-gold-accent">
                      <Mic size={22} />
                   </button>
                   <textarea
                    rows={1}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Describe your vision..."
                    className="w-full bg-transparent py-5 px-4 focus:outline-none placeholder:text-mocha-500 text-lg text-cream-text resize-none min-h-[64px] max-h-[200px] scrollbar-none"
                  />
                  <div className="flex gap-2 mb-2">
                     <button className="p-3 hover:bg-white/5 rounded-xl transition-colors text-cream-text/40 hover:text-white">
                        <ImageIcon size={22} />
                     </button>
                     <button
                      onClick={handleSend}
                      disabled={!input.trim() || isTyping}
                      className="w-14 h-14 bg-purple-600 text-white rounded-2xl flex items-center justify-center hover:bg-purple-500 disabled:bg-mocha-brown/20 disabled:text-mocha-500 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(147,51,234,0.2)] active:scale-95 group"
                    >
                      <Send size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center mt-6">
                 <p className="text-[10px] text-mocha-500 font-mono tracking-[0.4em] uppercase text-center opacity-50">
                    Precision Brewed Intelligence • Production v2.4.0
                 </p>
              </div>
           </div>
        </footer>
      </div>
    </div>
  );
}
