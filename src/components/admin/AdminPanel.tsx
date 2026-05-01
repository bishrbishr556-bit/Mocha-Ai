import { motion } from 'motion/react';
import { ShieldAlert, ChevronLeft, Users, Activity, Zap, Server, BarChart3, Search, MoreVertical, CheckCircle2, AlertCircle, Bot, Send, Trash2, UserPlus, Radio, Image as ImageIcon, Upload, Edit3, Video as VideoIcon } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { sendAdminCommand } from '../../services/geminiService';
import { auth, db } from '../../lib/firebase';
import { getUserChats, getChatMessages, saveMessage, getGlobalRecentMessages, deleteDocumentByPath, getStudents, addStudent, deleteStudent, updateSystemBroadcast, getGalleryImages, addGalleryImage, deleteGalleryImage, getGalleryVideos, addGalleryVideo, deleteGalleryVideo } from '../../services/firestoreService';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ToastType } from '../ui/Toast';

export default function AdminPanel({ onBack, showToast }: { onBack: () => void, showToast: (msg: string, type?: ToastType) => void }) {
  const user = auth.currentUser;
  const [activeTab, setActiveTab] = useState('overview');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [globalMessages, setGlobalMessages] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [galleryVideos, setGalleryVideos] = useState<any[]>([]);
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [newStudentName, setNewStudentName] = useState('');
  const [newImageTitle, setNewImageTitle] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [showAddImage, setShowAddImage] = useState(false);
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [showAddVideo, setShowAddVideo] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Admin') {
      setIsAuthenticated(true);
      setError(false);
      showToast("Clearance Granted. Neural Link Established.", "success");
    } else {
      setError(true);
      setPassword('');
      showToast("Unauthorized Access. System Locked.", "error");
    }
  };

  // Load students
  useEffect(() => {
    if (!isAuthenticated) return;
    const unsubStudents = getStudents((data) => setStudents(data));
    const unsubGallery = getGalleryImages((data) => setGallery(data));
    const unsubVideos = getGalleryVideos((data) => setGalleryVideos(data));
    return () => {
      unsubStudents();
      unsubGallery();
      unsubVideos();
    };
  }, [isAuthenticated]);

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideoUrl.trim() || !newVideoTitle.trim()) return;
    await addGalleryVideo(newVideoTitle, newVideoUrl);
    setNewVideoUrl('');
    setNewVideoTitle('');
    setShowAddVideo(false);
    showToast("Video Asset Synchronized", "success");
  };

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl.trim() || !newImageTitle.trim()) return;
    await addGalleryImage(newImageTitle, newImageUrl);
    setNewImageUrl('');
    setNewImageTitle('');
    setShowAddImage(false);
    showToast("Visual Asset Synchronized", "success");
  };

  const handleAddStudent = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newStudentName.trim()) return;
    await addStudent(newStudentName);
    setNewStudentName('');
  };

  const handleSeedStudents = async () => {
    const list = ['Bishar', 'Aman', 'Rayyan', 'Khalil', 'Nadih', 'Midlaj', 'Ziyad', 'Anzil', 'Hisham', 'Shadi', 'Fawaz', 'Amin', 'Ashkar', 'Nihal', 'Razi', 'Yasin', 'Munfis'];
    for (const name of list) {
      if (!students.some(s => s.name === name)) {
        await addStudent(name);
      }
    }
    showToast("Manifest Seeded Successfully", "success");
  };

  const handleUpdateBroadcast = async () => {
    await updateSystemBroadcast(broadcastMsg);
    setBroadcastMsg('');
    showToast("Neural Broadcast Dispatched", "success");
  };

  const [commandInput, setCommandInput] = useState('');
  const [commandLogs, setCommandLogs] = useState<{ role: 'user' | 'model', content: string }[]>([
    { role: 'model', content: 'Mocha Command System Online. How may I assist your oversight today?' }
  ]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [activeUserChatId, setActiveUserChatId] = useState<string | null>(null);

  // Load user's latest chat for the "Mocha Eye" admin view
  useEffect(() => {
    if (!user || activeTab !== 'mocha-eye' || !isAuthenticated) return;
    
    const unsub = getUserChats(user.uid, (chats) => {
      if (chats.length > 0) {
        setActiveUserChatId(chats[0].id);
      }
    });

    return () => unsub();
  }, [user, activeTab, isAuthenticated]);

  // Load global messages for Overview
  useEffect(() => {
    if (!isAuthenticated) return;
    const unsub = getGlobalRecentMessages((msgs) => {
      setGlobalMessages(msgs);
    });
    return () => unsub();
  }, [isAuthenticated]);

  const handleDeleteMessage = async (path: string) => {
    try {
      await deleteDocumentByPath(path);
    } catch (err) {
      console.error('Failed to delete message:', err);
    }
  };

  // Sync command logs with the actual chat messages
  useEffect(() => {
    if (!user || !activeUserChatId || activeTab !== 'mocha-eye') return;

    const unsub = getChatMessages(user.uid, activeUserChatId, (msgs) => {
      setCommandLogs(msgs.map(m => ({ role: m.role as any, content: m.content })));
    });

    return () => unsub();
  }, [user, activeUserChatId, activeTab]);

  const handleSendCommand = async () => {
    if (!commandInput.trim() || isProcessing || !user || !activeUserChatId) return;
    
    const adminMsg = { 
      role: 'model' as const, // Admin acts as the AI/System
      content: "[ADMIN INTERVENTION]: " + commandInput,
      timestamp: new Date()
    };
    
    setIsProcessing(true);
    setCommandInput('');

    // Save to the user's active chat
    await saveMessage(user.uid, activeUserChatId, adminMsg);
    
    // If in Overview, we can use the admin command to talk to the core if needed
    // But for now, we'll keep the direct neural connection in Mocha Eye
    const response = await sendAdminCommand(commandInput);
    
    const systemMsg = {
      role: 'model' as const,
      content: response,
      timestamp: new Date()
    };

    setCommandLogs(prev => [...prev, { role: 'user', content: commandInput }, systemMsg]);
    setIsProcessing(false);
  };

  const stats = [
    { label: 'Total Users', value: '1,284', change: '+12%', icon: <Users className="text-blue-400" /> },
    { label: 'Eye Latency', value: '420ms', change: '-5%', icon: <Zap className="text-yellow-400" /> },
    { label: 'Cloud Credits', value: '84%', change: 'Normal', icon: <Server className="text-green-400" /> },
    { label: 'Oversight Rate', value: '99.2%', change: '+0.4%', icon: <Activity className="text-purple-400" /> },
  ];

  const recentUsers = [
    { name: 'Alex Rivera', email: 'alex@example.com', status: 'Active', plan: 'Gold' },
    { name: 'Sarah Chen', email: 'sarah.c@gmail.com', status: 'Paused', plan: 'Basic' },
    { name: 'James Wilson', email: 'j.wilson@outlook.com', status: 'Active', plan: 'Gold' },
    { name: 'Maria Garcia', email: 'm.garcia@tech.io', status: 'Banned', plan: 'Free' },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-mocha-950 flex flex-col items-center justify-center p-6 font-sans">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full glass-dark p-12 rounded-[3.5rem] border border-white/5 text-center space-y-8 shadow-2xl"
        >
          <div className="w-20 h-20 bg-red-500 rounded-3xl flex items-center justify-center text-white mx-auto shadow-2xl rotate-6">
            <ShieldAlert size={40} />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-3xl font-serif font-bold text-white italic">Clearance Required</h2>
            <p className="text-mocha-500 text-sm italic">Enter the administrative cipher to access Mocha command systems.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
             <div className="relative">
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  className={`w-full bg-white/5 border rounded-2xl p-4 text-center text-white focus:outline-none transition-all ${error ? 'border-red-500 animate-shake' : 'border-white/10 focus:border-gold-500/50'}`}
                />
                {error && <p className="text-red-400 text-[10px] font-mono mt-2 uppercase tracking-widest">Unauthorized Access Denied</p>}
             </div>
             <button 
               type="submit"
               className="w-full bg-white text-mocha-950 py-4 rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all shadow-xl"
             >
                Verify Identity
             </button>
          </form>

          <button onClick={onBack} className="text-mocha-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors">
            Return to Interface
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mocha-950 flex flex-col font-sans">
      <header className="p-6 glass-dark border-b border-white/5 flex items-center justify-between z-10">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="text-mocha-400 hover:text-white transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center text-white rotate-3 shadow-lg shadow-red-500/20">
              <ShieldAlert size={20} />
            </div>
            <div>
              <h1 className="text-xl font-serif font-bold text-white italic">Internal Command</h1>
              <p className="text-[10px] font-mono text-mocha-500 uppercase tracking-widest">Admin Oversight Panel</p>
            </div>
          </div>
        </div>

        <div className="flex glass rounded-2xl p-1 border border-white/5">
           {['overview', 'dashboard', 'users', 'mocha-eye', 'system'].map(tab => (
             <button 
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`px-6 py-2 rounded-xl text-xs font-bold transition-all uppercase tracking-widest ${activeTab === tab ? 'bg-white text-mocha-950 shadow-xl' : 'text-mocha-500 hover:text-white'}`}
             >
                {tab === 'mocha-eye' ? 'Mocha Eye' : tab}
             </button>
           ))}
        </div>
      </header>

      <main className="flex-1 p-12 max-w-7xl mx-auto w-full space-y-12 overflow-y-auto">
         {activeTab === 'overview' && (
           <>
              {/* Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                 {stats.map((stat, i) => (
                   <motion.div 
                     key={i}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: i * 0.1 }}
                     className="glass-dark border border-white/5 p-6 rounded-[2.5rem] hover:border-white/10 transition-all"
                   >
                      <div className="flex items-center justify-between mb-4">
                         <div className="p-3 bg-white/5 rounded-2xl">{stat.icon}</div>
                         <span className={`text-[10px] font-mono font-bold px-2 py-1 rounded-md ${stat.change.startsWith('+') ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>
                            {stat.change}
                         </span>
                      </div>
                      <h4 className="text-mocha-500 text-[10px] uppercase tracking-widest font-mono mb-1">{stat.label}</h4>
                      <p className="text-2xl font-serif font-bold text-white italic">{stat.value}</p>
                   </motion.div>
                 ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                 {/* Neural Feed */}
                 <div className="lg:col-span-8 space-y-6">
                    <div className="flex items-center justify-between px-4">
                       <h3 className="text-xl font-serif font-bold text-white italic">Neural Feed</h3>
                       <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gold-500 rounded-full animate-ping" />
                          <span className="text-[10px] font-mono text-gold-500 uppercase tracking-widest">Live Activity</span>
                       </div>
                    </div>
                    
                    <div className="glass-dark border border-white/5 rounded-[3rem] overflow-hidden max-h-[500px] flex flex-col">
                       <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-mocha-800">
                          <table className="w-full text-left">
                             <thead className="bg-white/5 border-b border-white/5 sticky top-0 z-10 backdrop-blur-md">
                                <tr>
                                   <th className="px-8 py-5 text-[10px] font-mono text-mocha-500 uppercase tracking-widest">Inquiry Source</th>
                                   <th className="px-8 py-5 text-[10px] font-mono text-mocha-500 uppercase tracking-widest">Content Roast</th>
                                   <th className="px-8 py-5 text-[10px] font-mono text-mocha-500 uppercase tracking-widest">Timestamp</th>
                                   <th className="px-8 py-5 text-[10px] font-mono text-mocha-500 uppercase tracking-widest">Manage</th>
                                </tr>
                             </thead>
                             <tbody className="divide-y divide-white/5">
                                {globalMessages.map((msg, i) => (
                                  <tr key={msg.id || i} className={`hover:bg-white/[0.02] transition-colors group ${msg.isNegative ? 'bg-red-500/5' : ''}`}>
                                     <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                           <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${msg.role === 'user' ? (msg.isNegative ? 'bg-red-500 text-white' : 'bg-gold-500 text-mocha-950') : 'bg-mocha-800 text-mocha-400'}`}>
                                              {msg.role === 'user' ? 'U' : 'M'}
                                           </div>
                                           <div>
                                              <p className="text-xs font-bold text-white truncate max-w-[120px]">{msg.userEmail || 'Anonymous'}</p>
                                              <p className="text-[9px] text-mocha-500 font-mono tracking-tighter">{msg.userId?.slice(0, 8)}...</p>
                                           </div>
                                        </div>
                                     </td>
                                     <td className="px-8 py-6">
                                        <div className="max-w-md">
                                           <p className="text-xs text-mocha-200 line-clamp-2 italic leading-relaxed">
                                              {msg.content}
                                           </p>
                                        </div>
                                     </td>
                                     <td className="px-8 py-6">
                                        <span className="text-[10px] font-mono text-mocha-500 whitespace-nowrap">
                                           {msg.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                     </td>
                                     <td className="px-8 py-6">
                                        <button 
                                          onClick={() => msg.path && handleDeleteMessage(msg.path)}
                                          className="p-2 text-mocha-500 hover:text-red-400 transition-colors"
                                          title="Remove from feed"
                                        >
                                          <Trash2 size={16} />
                                        </button>
                                     </td>
                                  </tr>
                                ))}
                                {globalMessages.length === 0 && (
                                  <tr>
                                    <td colSpan={4} className="px-8 py-12 text-center text-mocha-500 italic text-sm">
                                      Neural link quiet. Awaiting user interaction...
                                    </td>
                                  </tr>
                                )}
                             </tbody>
                          </table>
                       </div>
                    </div>
                 </div>

                 {/* Personnel Snapshot */}
                 <div className="lg:col-span-4 space-y-6">
                    <div className="flex items-center justify-between px-4">
                       <h3 className="text-xl font-serif font-bold text-white italic">Personnel</h3>
                       <button onClick={() => setActiveTab('users')} className="text-gold-500 text-xs font-bold uppercase tracking-widest hover:underline">Full Manifest</button>
                    </div>
                    <div className="glass-dark border border-white/5 rounded-[2rem] p-6 space-y-6">
                       {recentUsers.slice(0, 3).map((user, i) => (
                          <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-gold-500/30 transition-all">
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-mocha-800 flex items-center justify-center text-mocha-400 font-bold border border-white/10">
                                   {user.name.charAt(0)}
                                </div>
                                <div>
                                   <p className="text-sm font-bold text-white">{user.name}</p>
                                   <p className="text-[9px] text-mocha-500 font-mono">{user.plan}</p>
                                </div>
                             </div>
                             <div className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`} />
                          </div>
                       ))}
                    </div>
                    <div className="glass-dark border border-white/5 rounded-[2rem] p-8 text-center bg-mocha-900/40">
                       <p className="text-[10px] font-mono text-mocha-500 uppercase tracking-widest mb-4">Neural Integrity</p>
                       <div className="text-3xl font-display font-bold text-gold-500">99.8%</div>
                       <p className="text-[10px] text-mocha-600 mt-2 italic">Optimized through Gemini Core</p>
                    </div>
                 </div>
              </div>

                 {/* Performance */}
                 <div className="space-y-6">
                    <h3 className="text-xl font-serif font-bold text-white italic px-4">System Vitals</h3>
                    <div className="glass-dark border border-white/5 rounded-[3rem] p-8 space-y-8">
                       {[
                         { label: 'Compute Usage', value: 64, color: 'bg-gold-500' },
                         { label: 'API Bandwidth', value: 28, color: 'bg-blue-500' },
                         { label: 'Error Rate', value: 2, color: 'bg-red-500' }
                       ].map((vital, i) => (
                         <div key={i} className="space-y-3">
                            <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest text-mocha-500">
                               <span>{vital.label}</span>
                               <span className="text-white italic">{vital.value}%</span>
                            </div>
                            <div className="h-2 bg-mocha-900 rounded-full overflow-hidden">
                               <motion.div 
                                 initial={{ width: 0 }} 
                                 animate={{ width: `${vital.value}%` }} 
                                 transition={{ duration: 1, delay: 0.5 }}
                                 className={`h-full ${vital.color} shadow-[0_0_15px_rgba(212,175,55,0.3)]`} 
                               />
                            </div>
                         </div>
                       ))}

                       <div className="pt-6 border-t border-white/5">
                          <p className="text-[10px] font-mono text-mocha-600 uppercase tracking-[0.2em] mb-4">Infrastructure Status</p>
                          <div className="flex items-center gap-3 text-green-400 font-bold text-xs">
                             <div className="w-2 h-2 bg-green-400 rounded-full animate-ping" />
                             All Nodes Functional
                          </div>
                       </div>
                    </div>
                 </div>
           </>
         )}

         {activeTab === 'dashboard' && (
           <div className="space-y-12">
              <div className="flex items-center justify-between px-4">
                 <h3 className="text-2xl font-serif font-bold text-white italic">Operational Dashboard</h3>
                 <div className="flex items-center gap-4">
                    <button 
                      onClick={handleSeedStudents}
                      className="px-4 py-2 bg-gold-500 text-mocha-950 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
                    >
                      Initialize 17 Students Manifest
                    </button>
                    <div className="flex items-center gap-3 px-4 py-2 bg-gold-500/10 border border-gold-500/20 rounded-full">
                       <Users className="text-gold-500" size={16} />
                       <span className="text-[10px] font-mono text-gold-500 uppercase tracking-widest">Active Manifest</span>
                    </div>
                 </div>
              </div>

              {/* Priority Broadcast */}
              <div className="glass-dark border border-white/5 p-10 rounded-[3rem] bg-mocha-900/40 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Radio size={120} className="text-gold-500" />
                 </div>
                 <div className="flex items-center gap-4 mb-6 relative z-10">
                    <div className="p-3 bg-gold-500/10 rounded-2xl text-gold-500">
                       <Radio size={24} />
                    </div>
                    <div>
                       <h4 className="text-xl font-serif font-bold text-white italic">Neural Link Broadcast</h4>
                       <p className="text-mocha-500 text-xs italic">Instructions entered here reach the AI chat booth globally.</p>
                    </div>
                 </div>
                 <div className="flex gap-4 relative z-10">
                    <input 
                      type="text"
                      value={broadcastMsg}
                      onChange={(e) => setBroadcastMsg(e.target.value)}
                      placeholder="Enter priority protocol (reaches AI chat booth)..."
                      className="flex-1 bg-mocha-950 border border-white/10 rounded-2xl p-5 text-mocha-200 text-sm focus:border-gold-500 outline-none transition-all font-mono"
                    />
                    <button 
                      onClick={handleUpdateBroadcast}
                      className="px-10 bg-gold-500 text-mocha-950 font-bold rounded-2xl hover:bg-white transition-all shadow-xl text-sm"
                    >
                      Dispatch
                    </button>
                 </div>
              </div>

              {/* Students Manifest Grid */}
              <div className="space-y-8">
                 <div className="flex items-center justify-between px-4">
                    <h4 className="text-xl font-serif font-bold text-white italic underline decoration-gold-500/30 underline-offset-8">Students Manifest</h4>
                    <form onSubmit={handleAddStudent} className="flex gap-3">
                       <input 
                         type="text"
                         value={newStudentName}
                         onChange={(e) => setNewStudentName(e.target.value)}
                         placeholder="Create profile (e.g. Rahul)..."
                         className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:border-gold-500 outline-none w-48"
                       />
                       <button 
                         type="submit"
                         className="bg-white text-mocha-950 p-2 rounded-xl hover:bg-gold-500 transition-all font-bold"
                       >
                         <UserPlus size={18} />
                       </button>
                    </form>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {students.map((student, i) => (
                      <motion.div 
                        key={student.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.02 }}
                        className="glass-dark border border-white/5 p-8 rounded-[3rem] group hover:border-gold-500/40 transition-all relative"
                      >
                         <button 
                           onClick={() => deleteStudent(student.id)}
                           className="absolute top-6 right-6 text-mocha-700 hover:text-red-500 transition-colors"
                           title="Delete Profile"
                         >
                            <Trash2 size={16} />
                         </button>
                     <div className="flex items-center justify-between mb-6">
                        <div className="w-14 h-14 bg-mocha-800 rounded-2xl flex items-center justify-center text-gold-500 text-xl font-bold border border-white/5 shadow-inner group-hover:bg-gold-500 group-hover:text-mocha-950 transition-all duration-500">
                           {student.name.charAt(0)}
                        </div>
                        <div className="text-right">
                           <span className="text-[9px] font-mono text-mocha-500 uppercase block tracking-tighter">Login ID</span>
                           <span className="text-[10px] font-mono text-gold-500 font-bold tracking-tight">{student.name.toLowerCase()}@gmail.com</span>
                        </div>
                     </div>
                     <div>
                        <p className="text-white font-bold text-lg tracking-tight">{student.name}</p>
                        <div className="flex items-center gap-2 mt-2">
                           <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                           <span className="text-[9px] font-mono text-mocha-500 uppercase tracking-widest">Neural Profile Synchronized</span>
                        </div>
                     </div>
                      </motion.div>
                    ))}
                    {students.length === 0 && (
                      <div className="col-span-full py-32 text-center glass-dark rounded-[3rem] border border-white/5 bg-mocha-900/20">
                         <p className="text-mocha-500 italic font-serif text-lg">Manifest empty. Seed student data to initialize...</p>
                      </div>
                    )}
                 </div>
              </div>

              {/* Gallery Section */}
              <div className="space-y-8">
                 <div className="flex items-center justify-between px-4">
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-white/5 rounded-lg">
                          <ImageIcon size={20} className="text-gold-500" />
                       </div>
                       <h4 className="text-xl font-serif font-bold text-white italic underline decoration-gold-500/30 underline-offset-8">Gallery Images</h4>
                    </div>
                    <button 
                      onClick={() => setShowAddImage(true)}
                      className="flex items-center gap-2 px-6 py-3 bg-white text-mocha-950 rounded-2xl font-bold text-xs hover:bg-gold-500 transition-all shadow-xl"
                    >
                       <Upload size={14} />
                       Upload Image
                    </button>
                 </div>

                 {showAddImage && (
                   <motion.div 
                     initial={{ opacity: 0, height: 0 }}
                     animate={{ opacity: 1, height: 'auto' }}
                     className="glass-dark border border-gold-500/30 p-8 rounded-[3rem] bg-mocha-900/40 mb-10"
                   >
                      <form onSubmit={handleAddImage} className="space-y-6">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                               <label className="text-[10px] font-mono text-mocha-400 uppercase tracking-widest ml-1">Asset Title</label>
                               <input 
                                 type="text"
                                 value={newImageTitle}
                                 onChange={(e) => setNewImageTitle(e.target.value)}
                                 placeholder="e.g. Tour"
                                 className="w-full bg-mocha-950 border border-white/10 rounded-2xl p-4 text-white placeholder-mocha-700 outline-none focus:border-gold-500/50"
                               />
                            </div>
                            <div className="space-y-2">
                               <label className="text-[10px] font-mono text-mocha-400 uppercase tracking-widest ml-1">Image URL</label>
                               <input 
                                 type="text"
                                 value={newImageUrl}
                                 onChange={(e) => setNewImageUrl(e.target.value)}
                                 placeholder="https://..."
                                 className="w-full bg-mocha-950 border border-white/10 rounded-2xl p-4 text-white placeholder-mocha-700 outline-none focus:border-gold-500/50"
                               />
                            </div>
                         </div>
                         <div className="flex gap-4">
                            <button 
                              type="submit"
                              className="flex-1 bg-gold-500 text-mocha-950 font-bold py-4 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
                            >
                               Initialize Core Asset
                            </button>
                            <button 
                              type="button"
                              onClick={() => setShowAddImage(false)}
                              className="px-8 bg-white/5 text-white font-bold py-4 rounded-2xl hover:bg-white/10 transition-all"
                            >
                               Cancel
                            </button>
                         </div>
                      </form>
                   </motion.div>
                 )}

                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {gallery.map((img, i) => (
                      <motion.div 
                        key={img.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="glass-dark border border-white/5 rounded-[3rem] overflow-hidden group hover:border-gold-500/40 transition-all bg-mocha-950/20"
                      >
                         <div className="relative aspect-video overflow-hidden">
                            <img 
                              src={img.url} 
                              alt={img.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-mocha-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                               <button className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-mocha-950 transition-all">
                                  <Edit3 size={18} />
                               </button>
                               <button 
                                 onClick={() => deleteGalleryImage(img.id)}
                                 className="p-3 bg-red-500/20 backdrop-blur-md rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all"
                               >
                                  <Trash2 size={18} />
                               </button>
                            </div>
                         </div>
                         <div className="p-6 flex items-center justify-between">
                            <h5 className="text-white font-bold tracking-tight italic font-serif">{img.title}</h5>
                            <div className="flex gap-1">
                               <button className="text-mocha-600 hover:text-white transition-colors">
                                  <Edit3 size={14} />
                                </button>
                               <button 
                                 onClick={() => deleteGalleryImage(img.id)}
                                 className="text-mocha-600 hover:text-red-500 transition-colors"
                               >
                                  <Trash2 size={14} />
                               </button>
                            </div>
                         </div>
                      </motion.div>
                    ))}
                    {gallery.length === 0 && !showAddImage && (
                      <div className="col-span-full py-20 text-center glass-dark rounded-[3rem] border border-white/5 bg-mocha-900/20">
                         <p className="text-mocha-600 italic">No visual records found. Initialize neural gallery.</p>
                      </div>
                    )}
                 </div>
              </div>

              {/* Video Gallery Section */}
              <div className="space-y-8 pb-12">
                 <div className="flex items-center justify-between px-4">
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-white/5 rounded-lg">
                          <VideoIcon size={20} className="text-gold-500" />
                       </div>
                       <h4 className="text-xl font-serif font-bold text-white italic underline decoration-gold-500/30 underline-offset-8">Gallery Videos</h4>
                    </div>
                    <button 
                      onClick={() => setShowAddVideo(true)}
                      className="flex items-center gap-2 px-6 py-3 bg-white text-mocha-950 rounded-2xl font-bold text-xs hover:bg-gold-500 transition-all shadow-xl"
                    >
                       <Upload size={14} />
                       Upload Video
                    </button>
                 </div>

                 {showAddVideo && (
                   <motion.div 
                     initial={{ opacity: 0, height: 0 }}
                     animate={{ opacity: 1, height: 'auto' }}
                     className="glass-dark border border-gold-500/30 p-8 rounded-[3rem] bg-mocha-900/40 mb-10"
                   >
                      <form onSubmit={handleAddVideo} className="space-y-6">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                               <label className="text-[10px] font-mono text-mocha-400 uppercase tracking-widest ml-1">Video Title</label>
                               <input 
                                 type="text"
                                 value={newVideoTitle}
                                 onChange={(e) => setNewVideoTitle(e.target.value)}
                                 placeholder="e.g. 1776341681796 VID..."
                                 className="w-full bg-mocha-950 border border-white/10 rounded-2xl p-4 text-white placeholder-mocha-700 outline-none focus:border-gold-500/50"
                               />
                            </div>
                            <div className="space-y-2">
                               <label className="text-[10px] font-mono text-mocha-400 uppercase tracking-widest ml-1">Video Link</label>
                               <input 
                                 type="text"
                                 value={newVideoUrl}
                                 onChange={(e) => setNewVideoUrl(e.target.value)}
                                 placeholder="Paste direct video or embed URL..."
                                 className="w-full bg-mocha-950 border border-white/10 rounded-2xl p-4 text-white placeholder-mocha-700 outline-none focus:border-gold-500/50"
                               />
                            </div>
                         </div>
                         <div className="flex gap-4">
                            <button 
                              type="submit"
                              className="flex-1 bg-gold-500 text-mocha-950 font-bold py-4 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
                            >
                               Synchronize Video Node
                            </button>
                            <button 
                              type="button"
                              onClick={() => setShowAddVideo(false)}
                              className="px-8 bg-white/5 text-white font-bold py-4 rounded-2xl hover:bg-white/10 transition-all"
                            >
                               Cancel
                            </button>
                         </div>
                      </form>
                   </motion.div>
                 )}

                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {galleryVideos.map((vid, i) => (
                      <motion.div 
                        key={vid.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="glass-dark border border-white/5 rounded-3xl overflow-hidden group hover:border-gold-500/40 transition-all bg-mocha-950/20 shadow-2xl"
                      >
                         <div className="relative aspect-video overflow-hidden bg-black flex items-center justify-center">
                            {vid.url.includes('youtube.com') || vid.url.includes('youtu.be') ? (
                              <iframe
                                src={vid.url.replace('watch?v=', 'embed/').split('&')[0]}
                                className="w-full h-full pointer-events-none group-hover:pointer-events-auto"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            ) : (
                               <video 
                                 src={vid.url} 
                                 className="w-full h-full object-cover"
                                 muted
                                 loop
                                 playsInline
                                 onMouseOver={(e) => (e.currentTarget.play())}
                                 onMouseOut={(e) => (e.currentTarget.pause())}
                               />
                            )}
                            
                            {/* Overlay Controls */}
                            <div className="absolute inset-0 bg-mocha-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 z-20">
                               <button 
                                 onClick={() => deleteGalleryVideo(vid.id)}
                                 className="p-4 bg-red-500/20 backdrop-blur-md rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-xl"
                               >
                                  <Trash2 size={24} />
                               </button>
                            </div>

                            {/* Play Indicator */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 backdrop-blur-2xl rounded-full flex items-center justify-center text-white pointer-events-none group-hover:opacity-0 transition-all z-10 border border-white/10">
                               <VideoIcon size={24} className="fill-white ml-0.5" />
                            </div>
                         </div>
                         
                         {/* Footer info - matching image style */}
                         <div className="p-5 bg-mocha-900 border-t border-white/5 flex items-center justify-between">
                            <span className="text-[11px] font-mono font-bold text-mocha-300 tracking-tight truncate max-w-[80%] uppercase italic">
                               {vid.title}
                            </span>
                            <div className="flex gap-4">
                               <button className="text-mocha-600 hover:text-white transition-colors">
                                  <Edit3 size={15} />
                                </button>
                               <button 
                                 onClick={() => deleteGalleryVideo(vid.id)}
                                 className="text-mocha-600 hover:text-red-500 transition-colors"
                               >
                                  <Trash2 size={15} />
                               </button>
                            </div>
                         </div>
                      </motion.div>
                    ))}
                    {galleryVideos.length === 0 && !showAddVideo && (
                      <div className="col-span-full py-20 text-center glass-dark rounded-[3rem] border border-white/5 bg-mocha-900/20">
                         <p className="text-mocha-600 italic">No video records found. Initialize neural gallery.</p>
                      </div>
                    )}
                 </div>
              </div>
           </div>
         )}


         {activeTab === 'mocha-eye' && (
           <div className="h-full flex flex-col space-y-8">
              <div className="flex items-center justify-between px-4">
                 <div>
                    <h3 className="text-2xl font-serif font-bold text-white italic">Mocha Eye Interface</h3>
                    <p className="text-mocha-500 text-sm italic">Direct neural connection to Mocha AI Core.</p>
                 </div>
                 <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-mono text-green-400 uppercase tracking-widest">Sync Active</span>
                 </div>
              </div>

              <div className="flex-1 glass-dark border border-white/5 rounded-[3rem] flex flex-col overflow-hidden min-h-[500px]">
                 <div className="flex-1 p-8 overflow-y-auto space-y-6 scrollbar-thin scrollbar-thumb-mocha-800">
                    {commandLogs.map((log, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0, x: log.role === 'user' ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`flex ${log.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                         <div className={`max-w-[80%] p-6 rounded-[2rem] text-sm leading-relaxed ${log.role === 'user' ? 'bg-gold-500 text-mocha-950 font-bold rounded-tr-none' : 'glass border-white/5 text-mocha-200 rounded-tl-none font-mono text-[11px]'}`}>
                            {log.role === 'model' && <span className="text-gold-500 mr-2">[MOCHA_OS]:</span>}
                            {log.content}
                         </div>
                      </motion.div>
                    ))}
                 </div>

                 <div className="p-6 bg-white/5 border-t border-white/5">
                    <div className="relative">
                       <input 
                         type="text"
                         value={commandInput}
                         onChange={(e) => setCommandInput(e.target.value)}
                         onKeyDown={(e) => e.key === 'Enter' && handleSendCommand()}
                         placeholder="Execute protocol..."
                         className="w-full bg-mocha-950 border border-white/5 rounded-2xl py-4 pl-6 pr-16 focus:border-gold-500/50 transition-all text-white font-mono text-sm outline-none"
                       />
                       <button 
                         onClick={handleSendCommand}
                         disabled={isProcessing || !commandInput.trim()}
                         className="absolute right-2 top-2 bottom-2 px-4 bg-white text-mocha-950 rounded-xl font-bold hover:scale-105 active:scale-95 transition-all text-xs disabled:opacity-50"
                       >
                          {isProcessing ? 'Processing...' : 'Exec'}
                       </button>
                    </div>
                 </div>
              </div>
           </div>
         )}

         {activeTab === 'users' && (
           <div className="space-y-8">
              <div className="flex items-center justify-between px-4">
                 <h3 className="text-2xl font-serif font-bold text-white italic">Personnel Directory</h3>
                 <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-mocha-500" size={16} />
                    <input 
                      type="text" 
                      placeholder="Search users..." 
                      className="bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-6 text-sm text-white focus:border-gold-500/50 outline-none w-64"
                    />
                 </div>
              </div>

              <div className="glass-dark border border-white/5 rounded-[3rem] overflow-hidden">
                 <table className="w-full text-left">
                    <thead className="bg-white/5 border-b border-white/5">
                       <tr>
                          <th className="px-8 py-5 text-[10px] font-mono text-mocha-500 uppercase tracking-widest">User</th>
                          <th className="px-8 py-5 text-[10px] font-mono text-mocha-500 uppercase tracking-widest">Status</th>
                          <th className="px-8 py-5 text-[10px] font-mono text-mocha-500 uppercase tracking-widest">Plan</th>
                          <th className="px-8 py-5 text-[10px] font-mono text-mocha-500 uppercase tracking-widest">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                       {recentUsers.map((user, i) => (
                         <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                            <td className="px-8 py-6">
                               <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-full bg-mocha-800 flex items-center justify-center text-mocha-400 font-bold">
                                     {user.name.charAt(0)}
                                  </div>
                                  <div>
                                     <p className="text-sm font-bold text-white">{user.name}</p>
                                     <p className="text-[10px] text-mocha-500 font-mono">{user.email}</p>
                                  </div>
                               </div>
                            </td>
                            <td className="px-8 py-6">
                               <span className={`flex items-center gap-2 text-[10px] font-mono font-bold ${user.status === 'Active' ? 'text-green-400' : user.status === 'Banned' ? 'text-red-400' : 'text-mocha-500'}`}>
                                  {user.status === 'Active' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                                  {user.status}
                               </span>
                            </td>
                            <td className="px-8 py-6">
                               <span className="text-[10px] font-mono text-gold-500 border border-gold-500/20 px-2 py-1 rounded">
                                  {user.plan}
                               </span>
                            </td>
                            <td className="px-8 py-6 text-mocha-500">
                               <button className="hover:text-white transition-colors"><MoreVertical size={18} /></button>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
         )}
         {activeTab === 'system' && (
           <div className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                 <div className="space-y-6">
                    <h3 className="text-xl font-serif font-bold text-white italic px-4">Core Connectivity</h3>
                    <div className="glass-dark border border-white/5 rounded-[3rem] p-8 space-y-6">
                       {[
                         { label: 'Gemini-3 Flash', status: 'Online', delay: '142ms' },
                         { label: 'Firestore Pool', status: 'Online', delay: '24ms' },
                         { label: 'Auth Gateway', status: 'Online', delay: '8ms' },
                         { label: 'Edge Worker', status: 'Healthy', delay: '12ms' }
                       ].map((item, i) => (
                         <div key={i} className="flex items-center justify-between p-4 glass rounded-2xl border-white/5">
                            <div className="flex items-center gap-4">
                               <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                               <span className="text-sm font-bold text-white">{item.label}</span>
                            </div>
                            <div className="text-right">
                               <p className="text-[10px] font-mono text-mocha-500 uppercase tracking-widest">{item.status}</p>
                               <p className="text-xs text-gold-500 font-mono">{item.delay}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="space-y-6">
                    <h3 className="text-xl font-serif font-bold text-white italic px-4">Live Traffic Roast</h3>
                    <div className="glass-dark border border-white/5 rounded-[3rem] p-8 h-[400px] flex flex-col">
                       <div className="flex-1 overflow-y-auto space-y-4 scrollbar-none pr-4">
                          {[...Array(6)].map((_, i) => (
                            <div key={i} className="space-y-2 opacity-50 hover:opacity-100 transition-opacity">
                               <div className="flex justify-between text-[10px] font-mono text-mocha-500">
                                  <span className="uppercase tracking-widest">Inbound Request 0x{Math.floor(Math.random()*1000)}</span>
                                  <span>{new Date().toLocaleTimeString()}</span>
                               </div>
                               <div className="p-3 bg-white/5 rounded-xl border border-white/5 font-mono text-[9px] text-mocha-300">
                                  GET /api/v1/roast/inference HTTP/1.1
                                  <br />
                                  Host: mocha-core-primary
                                  <br />
                                  X-Priority: High-Roast
                               </div>
                            </div>
                          ))}
                       </div>
                       <div className="mt-6 pt-6 border-t border-white/5">
                          <button className="w-full py-4 glass text-red-400 font-bold rounded-2xl hover:bg-red-500/10 transition-all border-red-500/20 text-xs uppercase tracking-widest">
                             Emergency Core Shutdown
                          </button>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
         )}
      </main>
    </div>
  );
}
