import { motion } from 'motion/react';
import { 
  BarChart3, Users, CreditCard, Activity, TrendingUp, 
  ArrowUpRight, ArrowDownRight, Coffee, Settings, Search,
  Bell, ChevronRight, MoreVertical, Layers
} from 'lucide-react';
import { auth } from '../../lib/firebase';
import Logo from '../ui/Logo';

export default function Dashboard({ onBack, userPlan, onNavigate, appLogoUrl }: { onBack: () => void, userPlan: string, onNavigate: (v: string) => void, appLogoUrl?: string }) {
  const user = auth.currentUser;
  const stats = [
    { label: "Active Roast Plan", value: userPlan.toUpperCase(), change: "Primary", positive: true, icon: <Coffee className="text-gold-500" /> },
    { label: "Total Brews", value: "24.5k", change: "+12.5%", positive: true, icon: <Activity className="text-gold-500" /> },
    { label: "Active Baristas", value: "1,240", change: "+4.2%", positive: true, icon: <Users className="text-mocha-400" /> },
    { label: "GPU Temperature", value: "42°C", change: "Optimal", positive: true, icon: <TrendingUp className="text-green-500" /> },
  ];

  const recentBrewers = [
    { name: "Coffee Enthusiast", email: "espresso@mocha.ai", plan: "Pro", status: "Active" },
    { name: "Startup Founder", email: "latte@build.it", plan: "Enterprise", status: "Active" },
    { name: "Data Analyst", email: "beans@query.com", plan: "Free", status: "Idle" },
    { name: "Creative Director", email: "art@pixel.so", plan: "Pro", status: "Active" },
  ];

  return (
    <div className="min-h-screen bg-mocha-950 text-mocha-100 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 glass-dark border-r border-white/5 flex flex-col p-6 hidden lg:flex">
          <div className="flex items-center gap-3 mb-12 cursor-pointer" onClick={onBack}>
            <Logo size={40} url={appLogoUrl} />
            <span className="font-serif text-xl font-bold italic uppercase">Mocha AI</span>
          </div>

         <nav className="flex-1 space-y-2">
            {[
              { label: 'Overview', icon: <BarChart3 size={20} />, active: true, id: 'dashboard' },
              { label: 'Digital Loom', icon: <Layers size={20} />, id: 'loom' },
              { label: 'Chat Brew', icon: <Activity size={20} />, id: 'app' },
              { label: 'Settings', icon: <Settings size={20} />, id: 'settings' },
              { label: 'Back to Roast', icon: <ChevronRight size={20} />, id: 'back' },
            ].map((item, i) => (
              <button 
                key={i} 
                onClick={() => {
                  if (item.id === 'back') onBack();
                  else if (item.id) onNavigate(item.id);
                }}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${item.active ? 'bg-gold-500 text-mocha-950 font-bold' : 'text-mocha-400 hover:bg-white/5 hover:text-white'}`}
              >
                {item.icon}
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
         </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
         {/* Header */}
         <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            <div>
               <h1 className="text-3xl font-serif font-bold italic text-white">Barista Dashboard</h1>
               <p className="text-mocha-400 text-sm italic">Monitoring your AI bean roasting performance.</p>
            </div>
            
            <div className="flex items-center gap-4 w-full md:w-auto">
               <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-mocha-600" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search logs..." 
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-gold-500 transition-colors"
                  />
               </div>
               <button className="p-2.5 glass rounded-xl text-mocha-400 relative">
                  <Bell size={20} />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-gold-500 rounded-full" />
               </button>
               <div className="w-10 h-10 rounded-full bg-mocha-800 border border-white/10 overflow-hidden shrink-0 shadow-lg">
                  <img src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || 'Mocha'}`} alt="Profile" className="w-full h-full object-cover" />
               </div>
            </div>
         </header>

         {/* Stats Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {stats.map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass p-6 rounded-3xl"
              >
                <div className="flex items-center justify-between mb-4">
                   <div className="p-3 bg-white/5 rounded-2xl">{stat.icon}</div>
                   <div className={`flex items-center text-[10px] font-bold ${stat.positive ? 'text-green-500' : 'text-red-500'}`}>
                      {stat.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      {stat.change}
                   </div>
                </div>
                <p className="text-mocha-400 text-xs font-mono uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-2xl font-serif font-bold text-white italic">{stat.value}</p>
              </motion.div>
            ))}
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Usage Chart Placeholder */}
            <div className="lg:col-span-2 glass p-8 rounded-[2.5rem] relative overflow-hidden h-[400px]">
               <div className="flex justify-between items-center mb-8">
                  <h3 className="font-serif text-xl font-bold italic text-white flex items-center gap-2">
                     <TrendingUp className="text-gold-500" size={20} /> Roast Density Analytics
                  </h3>
                  <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-xs text-mocha-400 outline-none">
                     <option>Last 7 Days</option>
                     <option>Last 30 Days</option>
                  </select>
               </div>
               
               {/* Aesthetic Chart Mockup */}
               <div className="absolute inset-0 top-24 px-8 pb-12 flex items-end justify-between">
                  {[40, 70, 45, 90, 65, 80, 55, 75, 40, 95, 60, 30].map((h, i) => (
                    <motion.div 
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: i * 0.05, duration: 1 }}
                      className="w-4 md:w-8 bg-gradient-to-t from-gold-600/20 to-gold-500 rounded-lg group relative"
                    >
                       <div className="absolute -top-12 left-1/2 -translate-x-1/2 glass border-gold-500/30 px-2 py-1 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                          {h * 12}
                       </div>
                    </motion.div>
                  ))}
               </div>
            </div>

            {/* Recent Orders / Users */}
            <div className="glass p-8 rounded-[2.5rem]">
               <div className="flex justify-between items-center mb-8">
                  <h3 className="font-serif text-xl font-bold italic text-white">Recent Brewers</h3>
                  <button className="text-gold-500 text-xs font-bold hover:underline">View All</button>
               </div>
               <div className="space-y-6">
                  {recentBrewers.map((user, i) => (
                    <div key={i} className="flex items-center justify-between group cursor-pointer">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-mocha-800 border border-white/10 overflow-hidden flex items-center justify-center italic font-serif text-gold-500 shadow-lg">
                             {user.name.charAt(0)}
                          </div>
                          <div>
                             <p className="text-sm font-bold text-white">{user.name}</p>
                             <p className="text-[10px] text-mocha-500 font-mono tracking-tight">{user.email}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-4">
                          <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${user.plan === 'Enterprise' ? 'bg-gold-500/20 text-gold-500' : 'bg-white/5 text-mocha-400'}`}>
                             {user.plan}
                          </span>
                          <MoreVertical size={16} className="text-mocha-600 group-hover:text-white transition-colors" />
                       </div>
                    </div>
                  ))}
               </div>
               
               <button className="w-full mt-10 py-4 glass border-white/5 rounded-2xl flex items-center justify-center gap-2 group hover:bg-white/10 transition-all text-sm font-bold">
                  Export Roast Report <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
               </button>
            </div>
         </div>
      </main>
    </div>
  );
}
