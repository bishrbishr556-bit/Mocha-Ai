import { motion } from 'motion/react';
import { ShieldAlert, ChevronLeft, Users, Activity, Zap, Server, BarChart3, Search, MoreVertical, CheckCircle2, AlertCircle } from 'lucide-react';
import React, { useState } from 'react';

export default function AdminPanel({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Admin') {
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
      setPassword('');
    }
  };

  const stats = [
    { label: 'Total Users', value: '1,284', change: '+12%', icon: <Users className="text-blue-400" /> },
    { label: 'Avg AI Latency', value: '420ms', change: '-5%', icon: <Zap className="text-yellow-400" /> },
    { label: 'Cloud Credits', value: '84%', change: 'Normal', icon: <Server className="text-green-400" /> },
    { label: 'Success Rate', value: '99.2%', change: '+0.4%', icon: <Activity className="text-purple-400" /> },
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
           {['overview', 'users', 'logs', 'system'].map(tab => (
             <button 
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`px-6 py-2 rounded-xl text-xs font-bold transition-all uppercase tracking-widest ${activeTab === tab ? 'bg-white text-mocha-950 shadow-xl' : 'text-mocha-500 hover:text-white'}`}
             >
                {tab}
             </button>
           ))}
        </div>
      </header>

      <main className="flex-1 p-12 max-w-7xl mx-auto w-full space-y-12 overflow-y-auto">
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

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* User List */}
            <div className="lg:col-span-2 space-y-6">
               <div className="flex items-center justify-between px-4">
                  <h3 className="text-xl font-serif font-bold text-white italic">Recent Personnel</h3>
                  <button className="text-gold-500 text-xs font-bold uppercase tracking-widest hover:underline">View All Users</button>
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
         </div>
      </main>
    </div>
  );
}
