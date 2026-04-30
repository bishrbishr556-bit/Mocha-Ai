import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Coffee, Mail, Lock, ArrowRight, Github, Chrome } from 'lucide-react';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';

export default function LoginPage({ onToggle, onSuccess, onBack }: { onToggle: () => void, onSuccess: () => void, onBack: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-mocha-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-mocha-600/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full glass p-10 rounded-[3rem] shadow-2xl relative z-10 border-white/5"
      >
        <div className="flex flex-col items-center mb-10">
          <button onClick={onBack} className="absolute left-8 top-8 text-mocha-500 hover:text-white transition-colors">
            <ArrowRight className="rotate-180" size={20} />
          </button>
          <div className="w-16 h-16 bg-gold-500 rounded-2xl flex items-center justify-center text-mocha-950 shadow-xl mb-6 rotate-3">
            <Coffee size={32} />
          </div>
          <h2 className="text-3xl font-serif font-bold text-white italic">Welcome Back</h2>
          <p className="text-mocha-400 text-sm mt-2 font-mono uppercase tracking-widest">Mocha AI Portal</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-1">
            <label className="text-xs font-bold text-mocha-300 ml-1">EMAIL ADDRESS</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-mocha-600" size={18} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-gold-500 transition-colors text-white"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-mocha-300 ml-1">PASSWORD</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-mocha-600" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-gold-500 transition-colors text-white"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gold-500 text-mocha-950 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gold-400 transition-all shadow-xl active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Roasted...' : 'Sip & Sign In'} <ArrowRight size={18} />
          </button>
        </form>

        <div className="my-8 flex items-center gap-4 text-mocha-700">
          <div className="h-px bg-mocha-800 flex-1" />
          <span className="text-[10px] font-mono uppercase tracking-widest">OR</span>
          <div className="h-px bg-mocha-800 flex-1" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button onClick={handleGoogle} className="glass py-3 rounded-xl flex items-center justify-center gap-2 text-sm text-mocha-200 hover:bg-white/10 transition-all">
            <Chrome size={18} /> Google
          </button>
          <button className="glass py-3 rounded-xl flex items-center justify-center gap-2 text-sm text-mocha-200 hover:bg-white/10 transition-all">
            <Github size={18} /> GitHub
          </button>
        </div>

        <p className="text-center text-sm text-mocha-400 mt-10">
          New brewer? <button onClick={onToggle} className="text-gold-500 font-bold hover:underline">Start Sign Up</button>
        </p>
      </motion.div>
    </div>
  );
}
