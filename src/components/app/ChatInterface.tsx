import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Coffee, Send, User as UserIcon, Bot, Sparkles, Mic, Image as ImageIcon, Code, Settings, LogOut, ChevronLeft, Plus, MessageSquare, Trash2, X, Layout, Music, Search, BookOpen, ShieldAlert } from 'lucide-react';
import { Message } from '../../types';
import { sendMessage } from '../../services/geminiService';
import { auth, db } from '../../lib/firebase';
import { saveMessage, getChatMessages, getUserChats, createNewChat } from '../../services/firestoreService';
import { doc, updateDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { ToastType } from '../ui/Toast';

interface ChatInterfaceProps {
  onBack: () => void;
  onNavigate: (view: any) => void;
  userPlan: 'free' | 'pro' | 'premium';
  showToast: (msg: string, type?: ToastType) => void;
}

export default function ChatInterface({ onBack, onNavigate, userPlan, showToast }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chats, setChats] = useState<any[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const user = auth.currentUser;

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
  }, [messages, isTyping]);

  // Plan limit tracking
  const [dailyMessages, setDailyMessages] = useState<number>(0);
  const today = new Date().toISOString().split('T')[0];

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

    // Creat a new chat if none exists
    if (!chatId) {
      chatId = await createNewChat(user.uid, input.slice(0, 30) + '...');
      setActiveChatId(chatId);
    }

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setInput('');
    setIsTyping(true);

    // Save user message to Firestore
    await saveMessage(user.uid, chatId!, userMessage);

    // Update chat timestamp
    await updateDoc(doc(db, 'users', user.uid, 'chats', chatId!), {
      updatedAt: serverTimestamp()
    });

    // Get AI response
    const response = await sendMessage([...messages, userMessage]);
    
    const aiMessage: Message = {
      role: 'model',
      content: response,
      timestamp: new Date()
    };

    // Save AI message to Firestore
    await saveMessage(user.uid, chatId!, aiMessage);
    setIsTyping(false);
  };

  const startNewChat = async () => {
    if (!user) return;
    const id = await createNewChat(user.uid, "New Roast");
    setActiveChatId(id);
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

  const toggleVoice = () => {
    setIsVoiceActive(!isVoiceActive);
  };

  return (
    <div className="flex h-screen bg-mocha-950 overflow-hidden font-sans text-mocha-100">
      {/* Voice Waveform Overlay */}
      <AnimatePresence>
        {isVoiceActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-mocha-950/90 backdrop-blur-2xl flex flex-col items-center justify-center"
          >
             <div className="flex gap-1 h-32 items-center mb-12">
                {[...Array(20)].map((_, i) => (
                  <motion.div 
                    key={i}
                    animate={{ height: ['20%', '100%', '20%'] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.05 }}
                    className="w-1.5 bg-gold-500 rounded-full shadow-[0_0_20px_var(--color-gold-500)]"
                  />
                ))}
             </div>
             <h3 className="text-3xl font-serif font-bold text-white mb-6 italic">Listening to your thoughts...</h3>
             <button 
               onClick={() => setIsVoiceActive(false)}
               className="w-20 h-20 bg-mocha-800 rounded-full flex items-center justify-center text-red-400 border border-white/5 hover:bg-white/5 transition-colors"
             >
                <X size={32} />
             </button>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Sidebar for Chat History */}
      <aside className="hidden lg:flex w-72 flex-col glass-dark border-r border-white/5 z-20">
         <div className="p-6">
            <div className="flex items-center gap-3 mb-8 cursor-pointer" onClick={onBack}>
              <div className="w-10 h-10 bg-gold-500 rounded-xl flex items-center justify-center text-mocha-950 rotate-3">
                <Coffee size={20} />
              </div>
              <span className="font-serif text-xl font-bold italic">Mocha AI</span>
            </div>

            <button 
              onClick={startNewChat}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-bold text-sm text-gold-500 mb-6"
            >
              <Plus size={18} /> New Brew
            </button>
            
            <div className="mb-8">
               <p className="text-[10px] font-mono text-mocha-600 uppercase tracking-[0.2em] mb-4 ml-4">Mocha Toolset</p>
               <div className="space-y-1">
                  {[
                    { id: 'canvas', icon: <Layout size={18} />, label: 'Web & App Create' },
                    { id: 'image-gen', icon: <ImageIcon size={18} />, label: 'Create Image' },
                    { id: 'music-gen', icon: <Music size={18} />, label: 'Create Music' },
                    { id: 'research', icon: <Search size={18} />, label: 'Deep Research' },
                    { id: 'learning', icon: <BookOpen size={18} />, label: 'Learning' },
                  ].map(tool => (
                    <button 
                      key={tool.id}
                      onClick={() => onNavigate(tool.id)}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-white/5 transition-all text-sm text-mocha-300 hover:text-gold-400 group"
                    >
                      <span className="group-hover:scale-110 transition-transform">{tool.icon}</span>
                      {tool.label}
                    </button>
                  ))}
               </div>
            </div>

            <p className="text-[10px] font-mono text-mocha-600 uppercase tracking-[0.2em] mb-4 ml-4">Recent Brews</p>
            <div className="space-y-2 overflow-y-auto max-h-[30vh] pr-2 scrollbar-thin scrollbar-thumb-mocha-800">
               {chats.map(chat => (
                 <div 
                   key={chat.id}
                   onClick={() => setActiveChatId(chat.id)}
                   className={`group flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all ${activeChatId === chat.id ? 'bg-mocha-800 border border-gold-500/30' : 'hover:bg-white/5'}`}
                 >
                    <div className="flex items-center gap-3 overflow-hidden">
                       <MessageSquare size={16} className={activeChatId === chat.id ? 'text-gold-500' : 'text-mocha-600'} />
                       <p className="text-xs font-medium truncate text-mocha-200">{chat.title}</p>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteChat(chat.id); }} 
                      className="opacity-0 group-hover:opacity-100 text-mocha-600 hover:text-red-400 p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                 </div>
               ))}
            </div>
         </div>

         <div className="mt-auto p-6 border-t border-white/5">
            <div className="flex items-center gap-3 p-3 glass rounded-2xl border-white/5">
               <div className="w-10 h-10 rounded-xl bg-mocha-700 overflow-hidden shrink-0">
                  <img src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} alt="Avatar" />
               </div>
               <div className="flex-1 overflow-hidden">
                  <p className="text-xs font-bold truncate">{user?.displayName || 'Barista'}</p>
                  <p className="text-[10px] text-mocha-500 truncate">{user?.email}</p>
               </div>
               <div className="flex flex-col gap-2">
                  <button onClick={() => onNavigate('admin')} className="text-mocha-600 hover:text-gold-500 transition-colors" title="Admin Panel">
                     <ShieldAlert size={16} />
                  </button>
                  <button onClick={() => onNavigate('settings')} className="text-mocha-600 hover:text-gold-500 transition-colors">
                     <Settings size={16} />
                  </button>
                  <button onClick={handleLogout} className="text-mocha-600 hover:text-red-400 transition-colors">
                     <LogOut size={16} />
                  </button>
               </div>
            </div>
         </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col relative">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-600/5 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-mocha-600/5 blur-[100px] pointer-events-none" />

        {/* Chat Header */}
        <header className="p-4 md:p-6 glass-dark border-b border-white/5 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="lg:hidden text-mocha-400 hover:text-white transition-colors">
              <ChevronLeft size={24} />
            </button>
            <div className="relative">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-mocha-800 rounded-2xl flex items-center justify-center text-gold-500 shadow-xl">
                 <Bot size={24} />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-mocha-950 rounded-full" />
            </div>
            <div className="hidden sm:block">
              <h2 className="font-serif text-lg md:text-xl font-bold text-white italic">Mocha Roast</h2>
              <div className="flex items-center gap-2">
                 <p className="text-[10px] md:text-xs font-mono uppercase tracking-[0.2em] text-mocha-400">Session Active • {messages.length} Brews</p>
                 <div className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-tighter shadow-sm ${userPlan === 'free' ? 'bg-mocha-800 text-mocha-400' : 'bg-gold-500 text-mocha-950'}`}>
                    {userPlan}
                 </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
             <button 
               onClick={toggleVoice}
               className="p-2 md:p-3 hover:bg-white/5 rounded-xl transition-colors text-mocha-400 hover:text-mocha-100 hidden sm:block"
             >
               <Mic size={20} />
             </button>
             <button className="p-2 md:p-3 hover:bg-white/5 rounded-xl transition-colors text-mocha-400 hover:text-mocha-100" title="AI Image Gen WIP"><ImageIcon size={20} /></button>
             <button className="lg:hidden p-2 text-mocha-400" onClick={startNewChat}><Plus size={24} /></button>
          </div>
        </header>

        {/* Message Viewport */}
        <main 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 md:p-10 space-y-10 scrollbar-thin scrollbar-thumb-mocha-800 scrollbar-track-transparent z-0"
        >
          {messages.length === 0 && !isTyping && (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
               <motion.div 
                 initial={{ scale: 0 }} 
                 animate={{ scale: 1 }}
                 className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center text-gold-500 mb-8 border border-white/5"
               >
                  <Sparkles size={48} />
               </motion.div>
               <h3 className="text-3xl font-serif font-bold text-white mb-4 italic">Start a New Batch.</h3>
               <p className="text-mocha-400 max-w-sm">Ask me to write code, generate ideas, or explain the complex nuances of a light roast.</p>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 w-full max-w-lg">
                  {[
                    "Explain Quantum Computing like a coffee blend",
                    "Write a Python script for an espresso timer",
                    "Compare React and Vue as coffee roasts",
                    "Design a futuristic coffee shop UI"
                  ].map((text, i) => (
                    <button 
                      key={i} 
                      onClick={() => setInput(text)}
                      className="p-4 glass rounded-2xl text-xs text-left text-mocha-200 hover:bg-white/10 transition-all border-mocha-800"
                    >
                      {text}
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
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[90%] md:max-w-3xl flex gap-5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 md:w-12 md:h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-2xl mt-1 border border-white/5 ${
                    msg.role === 'user' ? 'bg-gold-500 text-mocha-950' : 'glass text-gold-400'
                  }`}>
                    {msg.role === 'user' ? <UserIcon size={20} /> : <Bot size={24} />}
                  </div>
                  
                  <div className={`p-6 md:p-8 rounded-[2.5rem] shadow-[0_30px_70px_rgba(0,0,0,0.3)] text-base md:text-lg leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-mocha-800 text-mocha-50 rounded-tr-none' 
                      : 'glass border-white/5 text-mocha-200 rounded-tl-none font-sans prose prose-invert'
                  }`}>
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                    <div className={`flex items-center gap-2 mt-4 opacity-30 text-[10px] ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <span>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {msg.role === 'model' && <Sparkles size={10} />}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start items-center gap-5"
            >
              <div className="w-8 h-8 md:w-12 md:h-12 rounded-2xl glass border-white/10 flex items-center justify-center text-gold-400 shrink-0">
                <Bot size={24} />
              </div>
              <div className="glass border-white/5 p-6 rounded-[2rem] flex gap-2 items-center shadow-lg">
                <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1, repeat: Infinity }} className="w-2.5 h-2.5 bg-gold-500 rounded-full" />
                <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }} className="w-2.5 h-2.5 bg-gold-500 rounded-full" />
                <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }} className="w-2.5 h-2.5 bg-gold-500 rounded-full" />
              </div>
            </motion.div>
          )}
        </main>

        {/* Input Dock */}
        <footer className="p-4 md:p-10 z-10 bg-gradient-to-t from-mocha-950 via-mocha-950/80 to-transparent">
           <div className="max-w-4xl mx-auto">
              <div className="relative group">
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
                  placeholder="Tell Mocha your vision..."
                  className="w-full bg-white/5 border-2 border-white/5 rounded-3xl py-5 pl-8 pr-16 focus:border-gold-500/50 focus:bg-white/10 transition-all placeholder:text-mocha-600 text-lg shadow-inner outline-none text-mocha-100 resize-none min-h-[64px] max-h-[200px]"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="absolute right-3 bottom-3 w-12 h-12 bg-gold-500 text-mocha-950 rounded-2xl flex items-center justify-center hover:bg-gold-400 disabled:bg-mocha-800 disabled:text-mocha-600 disabled:cursor-not-allowed transition-all shadow-xl active:scale-95 z-10"
                >
                  <Send size={24} />
                </button>
              </div>
              
              <div className="flex justify-between items-center mt-6 px-4">
                 <div className="flex gap-6 items-center">
                    <div className="flex items-center gap-2">
                       <span className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_var(--color-green-500)]" />
                       <span className="text-[10px] text-mocha-600 font-mono tracking-widest uppercase">Barista Ready</span>
                    </div>
                    <div className="w-px h-3 bg-mocha-800" />
                    <p className="text-[10px] text-mocha-600 font-mono tracking-widest uppercase">
                       Model: Gemini-3 Flash (Experimental)
                    </p>
                 </div>
                 <p className="hidden md:block text-[10px] text-mocha-700 italic">
                    Roasted with precision in AI Studio
                 </p>
              </div>
           </div>
        </footer>
      </div>
    </div>
  );
}
