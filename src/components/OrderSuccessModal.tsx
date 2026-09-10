import React from 'react';
import { 
  CheckCircle2, 
  Printer, 
  ArrowRight, 
  Calendar, 
  MapPin, 
  CreditCard,
  Check,
  Box,
  Layers,
  Sparkles
} from 'lucide-react';
import { Order, StoreSettings } from '../types';

interface OrderSuccessModalProps {
  order: Order | null;
  settings: StoreSettings;
  onClose: () => void;
  onViewOrdersInAdmin: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  settings,
  onClose,
  onViewOrdersInAdmin,
}) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const deliveryEstimate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString(
    undefined, 
    { weekday: 'short', month: 'short', day: 'numeric' }
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        id="order-success-receipt"
        className="relative bg-white w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl border border-stone-200 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-br from-stone-950 to-cyan-950 text-white border-b border-stone-800 text-center">
          <div className="w-14 h-14 mx-auto rounded-full bg-cyan-500 text-stone-950 flex items-center justify-center shadow-lg mb-3">
            <Check className="w-8 h-8 stroke-[3]" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight">
            Print Order Sent to Queue!
          </h3>
          <p className="text-xs sm:text-sm text-cyan-200 font-medium mt-1">
            Thank you, {order.customer.name}! Juuls 3D Express is prepping your print.
          </p>
          <div className="mt-2.5 inline-flex items-center gap-2 px-3 py-1 bg-stone-900/90 rounded-full border border-cyan-500/40 text-xs font-mono font-bold text-cyan-300">
            <span>Order #{order.id}</span>
          </div>
        </div>

        {/* Receipt Details */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-stone-600">
          
          {/* Status & Delivery info */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
            <div className="flex items-start gap-2">
              <Calendar className="w-4 h-4 text-stone-400 mt-0.5" />
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Date Ordered</span>
                <span className="font-semibold text-stone-800">
                  {new Date(order.date).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Box className="w-4 h-4 text-cyan-600 mt-0.5" />
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Est. Dispatch</span>
                <span className="font-bold text-stone-900">{deliveryEstimate}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="flex items-start gap-2.5 p-3 bg-stone-50 rounded-xl border border-stone-200">
            <MapPin className="w-4 h-4 text-stone-400 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 block mb-0.5">Shipping Destination</span>
              <div className="font-medium text-stone-800">
                {order.customer.name}<br />
                {order.customer.address}<br />
                {order.customer.city}, {order.customer.zip}, {order.customer.country}
              </div>
              <div className="text-[11px] text-stone-500 mt-1">
                Receipt sent to: <span className="font-semibold text-stone-700">{order.customer.email}</span>
              </div>
            </div>
          </div>

          {/* Itemized list */}
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-400 block mb-2">3D Printed Items</span>
            <div className="space-y-2 border-t border-b border-stone-200 py-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-md object-cover bg-stone-900 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-bold text-stone-900 truncate text-xs">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-stone-500 flex items-center gap-1.5">
                        <span>Qty: {item.quantity} × {settings.currencySymbol}{item.price.toFixed(2)}</span>
                        {item.selectedColor && (
                          <span className="px-1.5 py-0.2 bg-cyan-100 text-cyan-800 rounded font-semibold text-[10px]">
                            {item.selectedColor}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className="font-bold text-stone-900 text-xs flex-shrink-0">
                    {settings.currencySymbol}{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{settings.currencySymbol}{order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>
                {order.shipping === 0 ? (
                  <span className="text-emerald-600 font-bold">FREE EXPRESS</span>
                ) : (
                  `${settings.currencySymbol}${order.shipping.toFixed(2)}`
                )}
              </span>
            </div>
            <div className="flex justify-between text-sm font-black text-stone-900 pt-2 border-t border-stone-200">
              <span>Total Paid</span>
              <span>{settings.currencySymbol}{order.total.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-cyan-700 pt-1 font-medium">
              <CreditCard className="w-3.5 h-3.5" />
              <span>Paid via {order.paymentMethod === 'cash' ? 'Cash (Pay Later)' : order.paymentMethod === 'ideal' ? 'iDEAL (Dutch Bank)' : order.paymentMethod === 'paypal' ? 'PayPal' : 'Direct Card'}</span>
            </div>
          </div>

          {/* Maker note */}
          <div className="p-3 bg-cyan-50 border border-cyan-200 rounded-xl text-[11px] text-cyan-900">
            <span className="font-bold">Workshop Note:</span> This order is stored in your Juuls 3D Express database. Switch to <strong>Sell 3D Prints</strong> mode in the header to view this and update status as your printers finish!
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50 flex items-center justify-between gap-3">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 text-xs font-semibold text-stone-700 hover:text-stone-900 bg-white border border-stone-200 rounded-lg hover:bg-stone-100 transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => {
                onClose();
                onViewOrdersInAdmin();
              }}
              className="px-3.5 py-2 text-xs font-bold text-cyan-950 bg-cyan-200 hover:bg-cyan-300 rounded-lg transition-colors"
            >
              View in Workshop Admin
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-white bg-stone-950 hover:bg-stone-800 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <span>Done</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
