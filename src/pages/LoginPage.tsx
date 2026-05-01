import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Coffee, Mail, Lock, ArrowRight, Github, Chrome } from 'lucide-react';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';
import Logo from '../components/ui/Logo';

export default function LoginPage({ onToggle, onSuccess, onBack, appLogoUrl }: { onToggle: () => void, onSuccess: () => void, onBack: () => void, appLogoUrl?: string }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const specialAccounts = [
    'Rahul@gmail.com',
    'Ashkar@gmail.com',
    'Khaleel@gmail.com',
    'Munfis@gmail.com',
    'Just@gmail.com',
    'Yaseen@gmail.com',
    // Students manifesting as authorized accounts
    'Bishar@gmail.com', 'Aman@gmail.com', 'Rayyan@gmail.com', 'Khalil@gmail.com', 
    'Nadih@gmail.com', 'Midlaj@gmail.com', 'Ziyad@gmail.com', 'Anzil@gmail.com', 
    'Hisham@gmail.com', 'Shadi@gmail.com', 'Fawaz@gmail.com', 'Amin@gmail.com', 
    'Ashkar@gmail.com', 'Nihal@gmail.com', 'Razi@gmail.com', 'Yasin@gmail.com', 'Munfis@gmail.com'
  ].map(email => email.toLowerCase());

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const isSpecialAccount = specialAccounts.includes(email.toLowerCase()) && password === '123456';

    try {
      if (isSpecialAccount) {
        // Special logic for the 6 accounts
        try {
          await signInWithEmailAndPassword(auth, email, password);
        } catch (err: any) {
          if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
            // Attempt to create if it doesn't exist
            const { createUserWithEmailAndPassword } = await import('firebase/auth');
            await createUserWithEmailAndPassword(auth, email, password);
          } else {
            throw err;
          }
        }
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
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
      setLoading(true);
      await signInWithPopup(auth, provider);
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGithub = async () => {
    const provider = new GithubAuthProvider();
    try {
      setLoading(true);
      await signInWithPopup(auth, provider);
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold-accent/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-mocha-brown/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full glass p-10 md:p-12 rounded-[2.5rem] shadow-2xl relative z-10 border-white/5 backdrop-blur-3xl"
      >
        <div className="flex flex-col items-center mb-10">
          <button onClick={onBack} className="absolute left-8 top-8 text-cream-text/40 hover:text-white transition-colors">
            <ArrowRight className="rotate-180" size={24} />
          </button>
          <div className="mb-8">
            <Logo size={100} url={appLogoUrl} className="shadow-[0_0_50px_rgba(212,175,55,0.2)]" />
          </div>
          <h2 className="text-4xl font-display font-bold text-white tracking-tight">Welcome Back</h2>
          <p className="text-gold-accent text-xs mt-3 font-mono uppercase tracking-[0.4em] font-bold">Smart AI Chatbot</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-4 rounded-xl mb-8">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-bold text-mocha-500 ml-1 uppercase tracking-widest">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-mocha-500" size={18} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-4 focus:outline-none focus:border-gold-accent transition-all text-white placeholder:text-mocha-500/50"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-mono font-bold text-mocha-500 ml-1 uppercase tracking-widest">Password</label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-mocha-500" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-4 focus:outline-none focus:border-gold-accent transition-all text-white placeholder:text-mocha-500/50"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gold-accent text-primary-black py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-glow-gold transition-all shadow-[0_0_30px_rgba(212,175,55,0.2)] active:scale-95 disabled:opacity-50 text-lg"
          >
            {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={20} />
          </button>
        </form>

        <div className="my-10 flex items-center gap-4">
          <div className="h-px bg-white/5 flex-1" />
          <span className="text-[10px] font-mono uppercase tracking-[0.5em] text-mocha-500">OR</span>
          <div className="h-px bg-white/5 flex-1" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={handleGoogle} 
            disabled={loading}
            className="glass py-4 rounded-xl flex items-center justify-center gap-3 text-sm text-cream-text/60 hover:bg-white/10 hover:text-white transition-all border-white/5 disabled:opacity-50"
          >
            <Chrome size={20} /> Google
          </button>
          <button 
            onClick={handleGithub}
            disabled={loading}
            className="glass py-4 rounded-xl flex items-center justify-center gap-3 text-sm text-cream-text/60 hover:bg-white/10 hover:text-white transition-all border-white/5 disabled:opacity-50"
          >
            <Github size={20} /> GitHub
          </button>
        </div>

        <p className="text-center text-sm text-mocha-500 mt-12">
          New brewer? <button onClick={onToggle} className="text-gold-accent font-bold hover:text-glow-gold transition-colors ml-1">Create Account</button>
        </p>
      </motion.div>
    </div>
  );
}
