import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, CreditCard, ShieldCheck, Sparkles, Coffee, Check, Loader2, Landmark, Wallet } from 'lucide-react';
import React, { useState, useEffect } from 'react';

interface PaymentPageProps {
  onBack: () => void;
  onSuccess: () => void;
}

export default function PaymentPage({ onBack, onSuccess }: PaymentPageProps) {
  const [step, setStep] = useState<'details' | 'processing'>('details');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | 'wallet'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
    setTimeout(() => {
      onSuccess();
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-mocha-950 flex flex-col font-sans">
      <header className="p-6 flex items-center justify-between border-b border-white/5 bg-mocha-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="text-mocha-400 hover:text-white transition-colors p-2 glass rounded-xl">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-serif font-bold text-white italic">Checkout</h1>
            <p className="text-[10px] font-mono text-mocha-500 uppercase tracking-widest">Secure Roasting Acquisition</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-mocha-500 text-xs font-mono">
           <ShieldCheck size={14} className="text-green-500" />
           256-bit AES Encryption
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full py-12 px-6 grid lg:grid-cols-5 gap-12">
        {/* Left: Summary */}
        <div className="lg:col-span-2 space-y-8">
           <div className="glass-dark p-10 rounded-[3rem] border border-gold-500/10 space-y-8">
              <div className="flex items-center gap-4">
                 <div className="w-16 h-16 bg-gold-500 rounded-3xl flex items-center justify-center text-mocha-950 shadow-2xl rotate-3">
                    <Coffee size={32} />
                 </div>
                 <div>
                    <h3 className="text-2xl font-serif font-bold text-white italic">Double Espresso</h3>
                    <p className="text-mocha-500 text-sm italic">Pro Plan Access</p>
                 </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-white/5">
                 {[
                   "Unlimited Neural Brews",
                   "Priority Roast Processing",
                   "Advanced Visual Architecture Tools",
                   "Early Access to Experimental Blends"
                 ].map((item, i) => (
                   <div key={i} className="flex items-center gap-3 text-mocha-300 text-sm italic">
                      <div className="w-5 h-5 bg-gold-500/10 rounded-full flex items-center justify-center text-gold-500">
                         <Check size={12} />
                      </div>
                      {item}
                   </div>
                 ))}
              </div>

              <div className="pt-8 border-t border-white/5 space-y-4">
                 <div className="flex justify-between text-mocha-400">
                    <span>Monthly Roast Charge</span>
                    <span>$29.00</span>
                 </div>
                 <div className="flex justify-between text-mocha-400">
                    <span>Platform Gratuity (Tax)</span>
                    <span>$0.00</span>
                 </div>
                 <div className="flex justify-between text-2xl font-serif font-bold text-white pt-4">
                    <span className="italic">Total per Month</span>
                    <span className="text-gold-500">$29.00</span>
                 </div>
              </div>
           </div>

           <div className="p-8 glass rounded-[2.5rem] flex items-center gap-4 border-white/5 italic text-mocha-500 text-sm">
              <Sparkles size={24} className="text-gold-500 shrink-0" />
              <p>Upgrading now will immediately unlock all Pro features for your current session.</p>
           </div>
        </div>

        {/* Right: Payment Input */}
        <div className="lg:col-span-3">
           <AnimatePresence mode="wait">
              {step === 'details' ? (
                <motion.div 
                  key="details"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                   <div className="space-y-4">
                      <h4 className="text-lg font-serif font-bold text-white italic ml-2">Choose Method</h4>
                      <div className="grid grid-cols-3 gap-4">
                         {[
                           { id: 'card', icon: <CreditCard />, label: 'Card' },
                           { id: 'bank', icon: <Landmark />, label: 'Bank' },
                           { id: 'wallet', icon: <Wallet />, label: 'Wallet' }
                         ].map(m => (
                           <button 
                             key={m.id}
                             onClick={() => setPaymentMethod(m.id as any)}
                             className={`flex flex-col items-center gap-3 p-6 rounded-[2rem] border transition-all ${paymentMethod === m.id ? 'bg-gold-500 text-mocha-950 border-gold-500 shadow-xl scale-105' : 'glass border-white/5 text-mocha-400 hover:text-white hover:bg-white/5'}`}
                           >
                              {m.icon}
                              <span className="text-[10px] font-mono font-bold uppercase tracking-widest">{m.label}</span>
                           </button>
                         ))}
                      </div>
                   </div>

                   <form onSubmit={handlePayment} className="glass-dark p-10 rounded-[3rem] border border-white/5 space-y-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-mono text-mocha-600 uppercase tracking-[0.2em] ml-2">Cardholder Name</label>
                         <input 
                           required
                           className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-gold-500/50 transition-all italic" 
                           placeholder="THE CONNOISSEUR"
                           style={{ textTransform: 'uppercase' }}
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-mono text-mocha-600 uppercase tracking-[0.2em] ml-2">Card Number</label>
                         <div className="relative">
                            <input 
                              required
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-gold-500/50 transition-all font-mono tracking-widest" 
                              placeholder="•••• •••• •••• ••••"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                               <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 opacity-50" />
                               <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="MC" className="h-4 opacity-50" />
                            </div>
                         </div>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <label className="text-[10px] font-mono text-mocha-600 uppercase tracking-[0.2em] ml-2">Expiry Date</label>
                            <input 
                              required
                              value={expiry}
                              onChange={(e) => setExpiry(e.target.value.slice(0, 5))}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-gold-500/50 transition-all font-mono" 
                              placeholder="MM / YY"
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-mono text-mocha-600 uppercase tracking-[0.2em] ml-2">CVV / Security</label>
                            <input 
                              required
                              type="password"
                              value={cvv}
                              onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-gold-500/50 transition-all font-mono" 
                              placeholder="•••"
                            />
                         </div>
                      </div>

                      <button 
                         type="submit"
                         className="w-full bg-gold-500 text-mocha-950 py-6 rounded-[2rem] font-bold text-lg hover:bg-gold-400 transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3 mt-4"
                      >
                         Seal the Roast <Sparkles size={20} />
                      </button>

                      <p className="text-center text-mocha-600 text-[10px] font-mono uppercase tracking-widest pt-4">
                         By clicking, you authorize Mocha AI to charge $29/mo until cancelled.
                      </p>
                   </form>
                </motion.div>
              ) : (
                <motion.div 
                  key="processing"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-[600px] flex flex-col items-center justify-center text-center space-y-8"
                >
                   <div className="relative">
                      <Loader2 size={120} className="text-gold-500 animate-spin opacity-20" />
                      <div className="absolute inset-0 flex items-center justify-center">
                         <Coffee size={48} className="text-gold-500 animate-bounce" />
                      </div>
                   </div>
                   <div className="space-y-4">
                      <h3 className="text-3xl font-serif font-bold text-white italic">Brewing your License...</h3>
                      <p className="text-mocha-500 max-w-sm italic">Our servers are synchronizing with your bank. Please do not close the roast chamber.</p>
                   </div>
                   <div className="flex gap-1 justify-center">
                      {[0,1,2].map(i => (
                        <motion.div 
                          key={i}
                          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                          transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                          className="w-2 h-2 bg-gold-500 rounded-full"
                        />
                      ))}
                   </div>
                </motion.div>
              )}
           </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
