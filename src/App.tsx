import { useState, useEffect } from 'react';
import { auth } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { AnimatePresence } from 'motion/react';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ChatInterface from './components/app/ChatInterface';
import Dashboard from './components/dashboard/Dashboard';
import LoadingScreen from './components/LoadingScreen';
import CanvasTool from './components/tools/CanvasTool';
import ImageTool from './components/tools/ImageTool';
import MusicTool from './components/tools/MusicTool';
import ResearchTool from './components/tools/ResearchTool';
import LearningTool from './components/tools/LearningTool';
import SettingsPage from './components/app/SettingsPage';
import AdminPanel from './components/admin/AdminPanel';
import PaymentPage from './components/payment/PaymentPage';
import ContactPage from './components/app/ContactPage';
import SuccessPage from './components/payment/SuccessPage';
import Toast, { ToastType } from './components/ui/Toast';

type View = 'landing' | 'login' | 'signup' | 'app' | 'dashboard' | 'canvas' | 'image-gen' | 'music-gen' | 'research' | 'learning' | 'settings' | 'admin' | 'payment' | 'contact' | 'success';
type Plan = 'free' | 'pro' | 'premium';

export default function App() {
  const [view, setView] = useState<View>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<Plan>(() => {
    return (localStorage.getItem('mocha_plan') as Plan) || 'free';
  });
  const [toast, setToast] = useState<{ message: string, type: ToastType } | null>(null);

  const showToast = (message: string, type: ToastType = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    localStorage.setItem('mocha_plan', plan);
  }, [plan]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      if (u && view === 'login') setView('app');
    });
    return () => unsubscribe();
  }, [view]);

  // Protected action: Go to App requires login
  const handleOpenApp = () => {
    if (user) {
      setView('app');
    } else {
      setView('login');
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="bg-mocha-950 min-h-screen text-mocha-100 selection:bg-gold-500 selection:text-mocha-950">
      {view === 'landing' && (
        <LandingPage 
          onOpenApp={handleOpenApp} 
          onLogin={() => setView('login')}
          onNavigate={(v) => {
            if ((v === 'app' || v === 'payment' || v === 'dashboard') && !user) {
               setView('login');
               showToast('Please login to continue', 'info');
               return;
            }
            setView(v as View);
          }}
          currentPlan={plan}
        />
      )}

      {view === 'login' && (
        <LoginPage 
          onToggle={() => setView('signup')} 
          onSuccess={() => setView('app')}
          onBack={() => setView('landing')}
        />
      )}

      {view === 'signup' && (
        <SignupPage 
          onToggle={() => setView('login')} 
          onSuccess={() => setView('app')}
          onBack={() => setView('landing')}
        />
      )}

      {view === 'app' && user && (
        <ChatInterface 
          onBack={() => setView('landing')} 
          onNavigate={(v) => setView(v)} 
          userPlan={plan} 
          showToast={showToast}
        />
      )}
      {view === 'dashboard' && (
        <Dashboard 
          onBack={() => setView('landing')} 
          userPlan={plan} 
          onNavigate={(v) => {
            if ((v === 'app' || v === 'payment' || v === 'dashboard') && !user) {
               setView('login');
               showToast('Please login to continue', 'info');
               return;
            }
            setView(v as View);
          }}
        />
      )}

      {view === 'canvas' && <CanvasTool onBack={() => setView('app')} />}
      {view === 'image-gen' && <ImageTool onBack={() => setView('app')} />}
      {view === 'music-gen' && <MusicTool onBack={() => setView('app')} />}
      {view === 'research' && <ResearchTool onBack={() => setView('app')} />}
      {view === 'learning' && <LearningTool onBack={() => setView('app')} />}
      {view === 'settings' && <SettingsPage onBack={() => setView('app')} userPlan={plan} />}
      {view === 'admin' && <AdminPanel onBack={() => setView('app')} />}
      {view === 'payment' && (
        <PaymentPage 
          onBack={() => setView('landing')} 
          onSuccess={() => {
            setPlan('pro');
            showToast('Premium Access Activated!', 'success');
            setView('success');
          }} 
        />
      )}
      {view === 'contact' && <ContactPage onBack={() => {
        showToast('Inquiry Sent Successfully', 'success');
        setView('landing');
      }} />}
      {view === 'success' && <SuccessPage onComplete={() => setView('dashboard')} />}
      
      <AnimatePresence>
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

