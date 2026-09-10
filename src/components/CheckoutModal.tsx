import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  ShieldCheck, 
  Lock, 
  ExternalLink, 
  AlertCircle, 
  Check, 
  CheckCircle2, 
  Sparkles,
  Box,
  Layers,
  Truck
} from 'lucide-react';
import { CartItem, CustomerInfo, Order, StoreSettings } from '../types';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  settings: StoreSettings;
  discountAmount: number;
  onOrderComplete: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  settings,
  discountAmount,
  onOrderComplete,
}) => {
  const [activeTab, setActiveTab] = useState<'paypal' | 'cash'>('paypal');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Customer shipping details state
  const [customer, setCustomer] = useState<CustomerInfo>({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    country: 'Netherlands',
  });

  // Card details state
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('123');
  const [cardError, setCardError] = useState('');

  if (!isOpen || cartItems.length === 0) return null;

  const rawSubtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity, 
    0
  );
  const subtotal = Math.max(0, rawSubtotal - discountAmount);
  const isFreeShipping = true;
  const shippingFee = 0; // Removed shipping cost
  const estimatedTax = subtotal * 0.08;
  const grandTotal = subtotal + shippingFee + estimatedTax;

  const handleFillDemoCard = () => {
    setCardNumber('4242 4242 4242 4242');
    setExpiry('08/29');
    setCvc('789');
    setCardError('');
  };

  const handlePlaceOrder = (paymentMethod: 'paypal' | 'card_instant' | 'cash' | 'ideal') => {
    if (!customer.name.trim() || !customer.email.trim() || !customer.address.trim()) {
      setCardError('Please complete all contact and shipping address fields.');
      return;
    }

    if (paymentMethod === 'ideal' && idealStep === 'select') {
      setIdealStep('authorizing');
      return;
    }

    setIsSubmitting(true);
    setCardError('');

    setTimeout(() => {
      const newOrder: Order = {
        id: `J3D-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toISOString(),
        customer,
        items: cartItems.map(item => ({
          productId: item.product.id,
          title: item.product.title,
          price: item.product.price,
          quantity: item.quantity,
          imageUrl: item.product.imageUrl,
          selectedColor: item.selectedColor,
          material: item.product.material,
        })),
        subtotal,
        shipping: shippingFee,
        total: grandTotal,
        paymentMethod,
        status: 'pending',
      };

      setIsSubmitting(false);
      onOrderComplete(newOrder);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        id="checkout-modal-container"
        className="relative bg-white w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl border border-stone-200 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-950 text-white">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base sm:text-lg font-bold">
              Juuls 3D Express Checkout
            </h3>
            <span className="text-xs bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold px-2 py-0.5 rounded-full">
              SSL Encrypted
            </span>
          </div>
          <button
            id="close-checkout-modal"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
              Select Payment Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('paypal')}
                className={`py-3 px-3 sm:px-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  activeTab === 'paypal'
                    ? 'border-[#0070BA] bg-[#0070BA] text-white shadow-sm'
                    : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-xs tracking-tight">PayPal &amp; Cards</span>
                  {activeTab === 'paypal' && <Check className="w-3.5 h-3.5 text-white" />}
                </div>
                <div className="mt-2">
                  <div className="text-xs font-bold leading-tight">PayPal / Debit / Credit</div>
                  <div className={`text-[10px] ${activeTab === 'paypal' ? 'text-sky-100' : 'text-stone-500'}`}>
                    Secure Online Checkout
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('cash')}
                className={`py-3 px-3 sm:px-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  activeTab === 'cash'
                    ? 'border-emerald-600 bg-emerald-600 text-white shadow-sm'
                    : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-xs tracking-tight">Cash</span>
                  {activeTab === 'cash' && <Check className="w-3.5 h-3.5 text-white" />}
                </div>
                <div className="mt-2">
                  <div className="text-xs font-bold leading-tight">Pay Later</div>
                  <div className={`text-[10px] ${activeTab === 'cash' ? 'text-emerald-100' : 'text-stone-500'}`}>
                    Pay Upon Delivery
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Shipping Details */}
          <div className="border border-stone-200 rounded-xl p-4 bg-stone-50/50">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-3 flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-cyan-600" />
              <span>3D Print Delivery &amp; Contact Info</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-stone-600 mb-1">Full Name</label>
                <input
                  type="text"
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  placeholder="Your full name"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-stone-600 mb-1">Email for Print Updates</label>
                <input
                  type="email"
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  placeholder="email@example.com"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-medium text-stone-600 mb-1">Shipping Street Address</label>
                <input
                  type="text"
                  value={customer.address}
                  onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                  placeholder="123 Maker Street, Apt 4"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-stone-600 mb-1">City</label>
                <input
                  type="text"
                  value={customer.city}
                  onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                  placeholder="City"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-stone-600 mb-1">ZIP / Postal</label>
                  <input
                    type="text"
                    value={customer.zip}
                    onChange={(e) => setCustomer({ ...customer, zip: e.target.value })}
                    placeholder="ZIP"
                    className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-stone-600 mb-1">Country</label>
                  <input
                    type="text"
                    value={customer.country}
                    onChange={(e) => setCustomer({ ...customer, country: e.target.value })}
                    placeholder="Country"
                    className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Active Payment Details Panel */}
          {activeTab === 'card' && (
            <div className="border border-stone-200 rounded-xl p-4 bg-white space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Credit / Debit Card
                </h4>
                <button
                  type="button"
                  onClick={handleFillDemoCard}
                  className="text-[11px] text-cyan-600 hover:text-cyan-700 font-bold flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  Fill Demo Card (4242)
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-stone-600 mb-1">Card Number</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4242 4242 4242 4242"
                    className="w-full pl-9 pr-3 py-2 text-xs font-mono bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-stone-600 mb-1">Expires (MM/YY)</label>
                  <input
                    type="text"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    placeholder="MM/YY"
                    className="w-full px-3 py-2 text-xs font-mono bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-stone-600 mb-1">CVC / Security Code</label>
                  <input
                    type="password"
                    maxLength={4}
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    placeholder="CVC"
                    className="w-full px-3 py-2 text-xs font-mono bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1 text-[11px] text-stone-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Zero Card Storage: Card numbers and CVC codes are never recorded or saved to any database.</span>
              </div>
            </div>
          )}



          {activeTab === 'paypal' && (
            <div className="border border-sky-100 rounded-xl p-4 bg-sky-50/50 space-y-3">
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#0070BA] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">
                    PayPal &amp; Debit / Credit Card Secure Checkout
                  </h4>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    Pay securely using your PayPal balance, bank account, or any Debit / Credit Card without needing an account.
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <PayPalButtons
                  style={{ layout: "vertical", shape: "rect", height: 40 }}
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      intent: "CAPTURE",
                      purchase_units: [
                        {
                          amount: {
                            currency_code: "USD",
                            value: grandTotal.toFixed(2),
                          },
                          description: "Juuls 3D Express Order",
                        },
                      ],
                    });
                  }}
                  onApprove={async (data, actions) => {
                    if (actions.order) {
                      const details = await actions.order.capture();
                      // Trigger order complete
                      const newOrder: Order = {
                        id: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                        customer,
                        date: new Date().toISOString(),
                        items: cartItems.map(item => ({
                          productId: item.product.id,
                          title: item.product.title,
                          price: item.product.price,
                          quantity: item.quantity,
                          imageUrl: item.product.images[0]?.url || '',
                          selectedColor: item.selectedColor,
                          material: item.product.material
                        })),
                        subtotal,
                        shipping: shippingFee,
                        total: grandTotal,
                        paymentMethod: 'paypal',
                        status: 'pending',
                      };
                      onOrderComplete(newOrder);
                    }
                  }}
                  onError={(err) => {
                    setCardError("PayPal Checkout failed. Please try again or use another payment method.");
                    console.error("PayPal Error:", err);
                  }}
                />
              </div>
            </div>
          )}

          {activeTab === 'cash' && (
            <div className="border border-emerald-100 rounded-xl p-4 bg-emerald-50/50 space-y-3">
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">
                    Pay Later with Cash
                  </h4>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    Your order will be sent to the print queue immediately. You can pay with cash upon receiving your 3D print.
                  </p>
                </div>
              </div>
            </div>
          )}

          {cardError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{cardError}</span>
            </div>
          )}

          {/* Order Summary Recap with filament colors */}
          <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 space-y-2 text-xs">
            <h4 className="font-bold text-stone-800 uppercase tracking-wider text-[11px] flex items-center justify-between">
              <span>Print Queue Summary ({cartItems.length} items)</span>
              <span className="text-cyan-700 font-semibold">Ready to print</span>
            </h4>

            <div className="space-y-1.5 py-1">
              {cartItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-stone-700 text-[11px]">
                  <span className="truncate mr-2">
                    {item.quantity}× {item.product.title} {item.selectedColor ? `(${item.selectedColor})` : ''}
                  </span>
                  <span className="font-mono font-semibold text-stone-900">
                    {settings.currencySymbol}{(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between text-stone-600 pt-2 border-t border-stone-200">
              <span>Subtotal</span>
              <span>{settings.currencySymbol}{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-stone-600">
              <span>Estimated Tax</span>
              <span>{settings.currencySymbol}{estimatedTax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm sm:text-base font-black text-stone-900 pt-2 border-t border-stone-200">
              <span>Total to Pay</span>
              <span className="text-stone-900">{settings.currencySymbol}{grandTotal.toFixed(2)}</span>
            </div>
          </div>

        </div>

        {/* Modal Footer / Submit Button */}
        <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
          >
            Cancel
          </button>

          {activeTab !== 'paypal' && (
            <button
              id="submit-order-button"
              onClick={() => handlePlaceOrder(activeTab === 'cash' ? 'cash' : activeTab === 'ideal' ? 'ideal' : 'card_instant')}
              disabled={isSubmitting}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white shadow-md transition-all flex items-center gap-2 ${
                activeTab === 'cash'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : activeTab === 'ideal'
                    ? 'bg-orange-600 hover:bg-orange-700'
                    : 'bg-stone-950 hover:bg-stone-800'
              } disabled:opacity-50`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Sending to 3D Print Queue...</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>
                    {activeTab === 'cash'
                      ? `Complete Order (${settings.currencySymbol}${grandTotal.toFixed(2)})`
                      : activeTab === 'ideal'
                        ? `Pay via iDEAL (${settings.currencySymbol}${grandTotal.toFixed(2)})`
                        : `Confirm & Pay ${settings.currencySymbol}${grandTotal.toFixed(2)}`}
                  </span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
