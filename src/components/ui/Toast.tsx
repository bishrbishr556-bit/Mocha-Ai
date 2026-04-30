import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border ${
        type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
        type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
        'bg-white/10 border-white/10 text-white'
      }`}
    >
      {type === 'success' && <CheckCircle2 size={18} />}
      {type === 'error' && <AlertCircle size={18} />}
      {type === 'info' && <Info size={18} />}
      <span className="text-sm font-bold italic">{message}</span>
      <button onClick={onClose} className="ml-4 opacity-50 hover:opacity-100 transition-opacity">
        <X size={14} />
      </button>
    </motion.div>
  );
}
