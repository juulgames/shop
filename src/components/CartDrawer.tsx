import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  ArrowRight, 
  Box,
  ShieldCheck,
  Tag,
  Palette
} from 'lucide-react';
import { CartItem, StoreSettings } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  settings: StoreSettings;
  onUpdateQuantity: (index: number, delta: number) => void;
  onRemoveItem: (index: number) => void;
  onProceedToCheckout: (discountAmount: number) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  settings,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  if (!isOpen) return null;

  const rawSubtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity, 
    0
  );

  const discountAmount = rawSubtotal * (discountPercent / 100);
  const subtotal = Math.max(0, rawSubtotal - discountAmount);
  
  const shippingFee = 0;
  const estimatedTax = subtotal * 0.08;
  const grandTotal = subtotal + shippingFee + estimatedTax;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');

    const cleanCode = promoCode.trim().toUpperCase();
    if (cleanCode === 'JUULS3D' || cleanCode === 'PRINT10' || cleanCode === 'SAVE10') {
      setDiscountPercent(10);
      setPromoSuccess('10% maker discount applied!');
    } else if (cleanCode === 'EXPRESS20') {
      setDiscountPercent(20);
      setPromoSuccess('20% Juuls 3D Express discount applied!');
    } else {
      setPromoError('Invalid code. Try "JUULS3D" or "PRINT10"');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div 
        id="shopping-cart-drawer"
        className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300 border-l border-stone-200"
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-950 text-white">
          <div className="flex items-center gap-2">
            <Box className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base sm:text-lg font-bold">
              3D Print Queue ({cartItems.reduce((s, i) => s + i.quantity, 0)})
            </h2>
          </div>
          <button
            id="close-cart-drawer"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-500">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mb-3 text-stone-400">
                <Box className="w-8 h-8 text-stone-300" />
              </div>
              <h3 className="text-base font-bold text-stone-800">Your print queue is empty</h3>
              <p className="text-xs text-stone-500 mt-1 max-w-xs">
                Browse Juuls 3D Express models, choose your filament colors & options, and add to your print queue.
              </p>
              <button
                onClick={onClose}
                className="mt-5 px-4 py-2 bg-stone-950 hover:bg-stone-800 text-white text-xs font-bold rounded-lg transition-colors"
              >
                Browse 3D Prints
              </button>
            </div>
          ) : (
            cartItems.map((item, index) => (
              <div 
                key={`${item.product.id}-${index}`}
                className="flex gap-3.5 p-3 rounded-xl border border-stone-200 hover:border-stone-300 transition-colors bg-white shadow-2xs"
              >
                <img
                  src={item.product.imageUrl}
                  alt={item.product.title}
                  referrerPolicy="no-referrer"
                  className="w-18 h-18 rounded-lg object-cover bg-stone-900 flex-shrink-0"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-stone-900 truncate">
                        {item.product.title}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(index)}
                        className="text-stone-400 hover:text-rose-600 transition-colors p-0.5"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {/* Filament colors & Options badges */}
                    <div className="flex flex-wrap items-center gap-1 mt-1">
                      {item.selectedColor && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-cyan-100 text-cyan-900 font-bold rounded flex items-center gap-1">
                          <Palette className="w-2.5 h-2.5 text-cyan-700" />
                          Pri: {item.selectedColor}
                        </span>
                      )}
                      {item.selectedSecondaryColor && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-900 font-bold rounded flex items-center gap-1">
                          <Palette className="w-2.5 h-2.5 text-amber-700" />
                          Sec: {item.selectedSecondaryColor}
                        </span>
                      )}
                      {item.selectedOptions && Object.entries(item.selectedOptions).map(([key, val]) => (
                        <span key={key} className="text-[10px] px-1.5 py-0.5 bg-stone-100 text-stone-800 font-medium rounded">
                          {val}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2.5">
                    <div className="flex items-center border border-stone-200 rounded-md">
                      <button
                        onClick={() => onUpdateQuantity(index, -1)}
                        className="px-2 py-0.5 text-xs text-stone-600 hover:bg-stone-100 font-bold"
                      >
                        -
                      </button>
                      <span className="px-2.5 py-0.5 text-xs font-semibold text-stone-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(index, 1)}
                        className="px-2 py-0.5 text-xs text-stone-600 hover:bg-stone-100 font-bold"
                        disabled={item.quantity >= item.product.inventory}
                      >
                        +
                      </button>
                    </div>

                    <span className="text-xs sm:text-sm font-black text-stone-900">
                      {settings.currencySymbol}{(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Footer */}
        {cartItems.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50 space-y-3.5">
            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                <input
                  type="text"
                  placeholder="Promo code (try JUULS3D)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500 uppercase"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-bold bg-stone-900 hover:bg-stone-800 text-white rounded-lg transition-colors"
              >
                Apply
              </button>
            </form>

            {promoSuccess && (
              <p className="text-[11px] text-emerald-600 font-medium">{promoSuccess}</p>
            )}
            {promoError && (
              <p className="text-[11px] text-rose-600 font-medium">{promoError}</p>
            )}

            {/* Financial Breakdown */}
            <div className="space-y-1.5 text-xs text-stone-600 pt-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-stone-900">
                  {settings.currencySymbol}{rawSubtotal.toFixed(2)}
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Maker Discount ({discountPercent}%)</span>
                  <span>-{settings.currencySymbol}{discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated Tax (8%)</span>
                <span>{settings.currencySymbol}{estimatedTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base font-black text-stone-900 pt-2 border-t border-stone-200">
                <span>Total Due</span>
                <span>{settings.currencySymbol}{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Primary Checkout Button */}
            <button
              id="cart-proceed-checkout-button"
              onClick={() => onProceedToCheckout(discountAmount)}
              className="w-full py-3 px-4 bg-gradient-to-r from-stone-950 via-stone-900 to-cyan-950 hover:bg-stone-800 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 border border-cyan-800/40"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 text-cyan-400" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-stone-400">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              <span>Direct dispatch from Juuls 3D Express workshop</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
