import React, { useState } from 'react';
import { ShieldCheck, Lock, AlertCircle, X, KeyRound } from 'lucide-react';

interface AdminPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  adminPin: string;
}

export const AdminPinModal: React.FC<AdminPinModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  adminPin,
}) => {
  const [enteredPin, setEnteredPin] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const expected = adminPin || '1234';
    if (enteredPin.trim() === expected.trim()) {
      setError('');
      setEnteredPin('');
      onSuccess();
    } else {
      setError('Incorrect Admin PIN. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="relative bg-stone-900 border border-stone-700 w-full max-w-sm rounded-2xl p-6 shadow-2xl text-stone-100 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-200 flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4">
          <KeyRound className="w-6 h-6" />
        </div>

        <h3 className="text-base font-black text-white">Workshop Admin Access</h3>
        <p className="text-xs text-stone-400 mt-1">
          Enter your owner security PIN to open the workshop admin panel, manage products, and view orders.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">
              Admin Security PIN
            </label>
            <div className="relative">
              <input
                type="password"
                id="admin-pin-prompt-input"
                autoFocus
                value={enteredPin}
                onChange={(e) => {
                  setEnteredPin(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter PIN"
                className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl text-center font-mono tracking-widest text-lg text-amber-300 placeholder:text-stone-600 focus:outline-none transition-colors"
              />
              <Lock className="w-4 h-4 text-stone-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {error && (
            <div className="text-xs text-rose-400 font-medium flex items-center gap-1.5 pt-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-3 bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-xs rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="btn-verify-admin-pin"
              className="flex-1 py-2.5 px-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-xs rounded-xl shadow-sm transition-all"
            >
              Verify PIN
            </button>
          </div>

          <div className="text-[10px] text-stone-500 text-center pt-2">
            Default initial PIN: <span className="font-mono text-stone-400 font-semibold">1234</span> (Change in Admin Settings).
          </div>
        </form>
      </div>
    </div>
  );
};
