/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Product, CartItem, Order, StoreSettings, Filament } from './types';
import { INITIAL_PRODUCTS, INITIAL_SETTINGS, INITIAL_FILAMENTS } from './data/initialProducts';
import { Navbar } from './components/Navbar';
import { Storefront } from './components/Storefront';
import { AdminDashboard } from './components/AdminDashboard';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { SetupGuideModal } from './components/SetupGuideModal';
import { AccessGateModal } from './components/AccessGateModal';
import { AdminPinModal } from './components/AdminPinModal';
import { CheckCircle2, Lock, Unlock, MapPin, KeyRound, ShieldCheck } from 'lucide-react';

const STORAGE_KEYS = {
  PRODUCTS: 'juuls3d_products_v2',
  SETTINGS: 'juuls3d_settings_v2',
  CART: 'juuls3d_cart_v2',
  ORDERS: 'juuls3d_orders_v2',
  FILAMENTS: 'juuls3d_filaments_v3',
  GATE_UNLOCKED: 'juuls3d_gate_unlocked_v2',
  GATE_METHOD: 'juuls3d_gate_method_v2',
  ADMIN_AUTH: 'juuls3d_admin_auth_v2',
};

import { PayPalScriptProvider } from '@paypal/react-paypal-js';

export default function App() {
  // Store settings
  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  // Access Gate unlock state
  const [isStoreUnlocked, setIsStoreUnlocked] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEYS.GATE_UNLOCKED) === 'true';
    } catch {
      return false;
    }
  });

  const [unlockDetail, setUnlockDetail] = useState<string>(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEYS.GATE_METHOD) || 'Verified';
    } catch {
      return 'Verified';
    }
  });

  const handleGateUnlock = (method: 'password' | 'location', detail?: string) => {
    setIsStoreUnlocked(true);
    const msg = detail || (method === 'password' ? 'Password verified' : 'Local area verified');
    setUnlockDetail(msg);
    try {
      sessionStorage.setItem(STORAGE_KEYS.GATE_UNLOCKED, 'true');
      sessionStorage.setItem(STORAGE_KEYS.GATE_METHOD, msg);
    } catch (e) {
      console.error(e);
    }
    showToast(`Access granted: ${msg}`);
  };

  const handleRelockStore = () => {
    setIsStoreUnlocked(false);
    try {
      sessionStorage.removeItem(STORAGE_KEYS.GATE_UNLOCKED);
      sessionStorage.removeItem(STORAGE_KEYS.GATE_METHOD);
    } catch (e) {
      console.error(e);
    }
    showToast('Storefront access locked.');
  };

  // Filament Inventory (Spools owned by Juuls)
  const [filaments, setFilaments] = useState<Filament[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FILAMENTS);
      return saved ? JSON.parse(saved) : INITIAL_FILAMENTS;
    } catch {
      return INITIAL_FILAMENTS;
    }
  });

  // Products catalog
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // Shopping cart
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Customer orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Navigation & View Mode
  const [activeView, setActiveView] = useState<'store' | 'admin'>('store');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
    } catch {
      return false;
    }
  });
  const [isAdminPinModalOpen, setIsAdminPinModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const requestSwitchToAdmin = () => {
    if (isAdminAuthenticated) {
      setActiveView('admin');
    } else {
      setIsAdminPinModalOpen(true);
    }
  };

  const handleAdminAuthSuccess = () => {
    setIsAdminAuthenticated(true);
    try {
      sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
    } catch (e) {
      console.error(e);
    }
    setIsAdminPinModalOpen(false);
    setActiveView('admin');
    showToast('Admin access verified');
  };

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Discount from promo code in cart
  const [discountAmount, setDiscountAmount] = useState(0);

  // Global feedback toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Load shared data from server on mount for cross-browser sync
  useEffect(() => {
    fetch('/api/store')
      .then(res => res.json())
      .then(data => {
        if (data) {
          if (data.products && data.products.length > 0) setProducts(data.products);
          if (data.filaments && data.filaments.length > 0) setFilaments(data.filaments);
          if (data.settings) setSettings(data.settings);
          if (data.orders) setOrders(data.orders);
        }
      })
      .catch(err => console.error("Failed to load store data from server", err));
  }, []);

  // Sync state changes to server for cross-browser persistence
  useEffect(() => {
    const saveData = async () => {
      try {
        await fetch('/api/store', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ products, filaments, settings, orders })
        });
      } catch (e) {
        console.error('Failed to sync store data to server', e);
      }
    };
    saveData();
  }, [products, filaments, settings, orders]);

  // Persist filaments to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FILAMENTS, JSON.stringify(filaments));
    } catch (e) {
      console.error('Failed to persist filaments', e);
    }
  }, [filaments]);

  // Persist products to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error('Failed to persist products', e);
    }
  }, [products]);

  // Persist settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to persist settings', e);
    }
  }, [settings]);

  // Persist cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to persist cart', e);
    }
  }, [cartItems]);

  // Persist orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to persist orders', e);
    }
  }, [orders]);

  // Cart actions
  const handleAddToCart = (
    product: Product,
    quantity = 1,
    selectedColor?: string,
    selectedSecondaryColor?: string,
    selectedOptions?: Record<string, string>,
    e?: React.MouseEvent
  ) => {
    if (e) e.stopPropagation();

    if (product.inventory <= 0) {
      showToast('This item is currently sold out.');
      return;
    }

    const chosenColor = selectedColor || product.colorOptions?.[0] || 'Default';
    const chosenSecondaryColor = selectedSecondaryColor || undefined;
    const chosenOptions = selectedOptions || {};

    setCartItems((prev) => {
      const existing = prev.find(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor === chosenColor &&
          item.selectedSecondaryColor === chosenSecondaryColor &&
          JSON.stringify(item.selectedOptions || {}) === JSON.stringify(chosenOptions)
      );
      if (existing) {
        const newQty = Math.min(product.inventory, existing.quantity + quantity);
        return prev.map((item) =>
          item === existing ? { ...item, quantity: newQty } : item
        );
      }
      return [
        ...prev,
        {
          product,
          quantity: Math.min(product.inventory, quantity),
          selectedColor: chosenColor,
          selectedSecondaryColor: chosenSecondaryColor,
          selectedOptions: chosenOptions,
        },
      ];
    });

    const detailsStr = [
      chosenColor,
      chosenSecondaryColor ? `+ ${chosenSecondaryColor}` : '',
      ...Object.values(chosenOptions),
    ].filter(Boolean).join(', ');

    showToast(`Added "${product.title}" (${detailsStr}) to print queue`);
  };

  const handleQuickBuy = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    // If product has a dedicated PayPal link, open it
    if (product.paypalPaymentLink) {
      window.open(product.paypalPaymentLink, '_blank', 'noopener,noreferrer');
      return;
    }

    // Otherwise add to cart and open checkout immediately
    handleAddToCart(product, 1);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleUpdateCartQuantity = (index: number, delta: number) => {
    setCartItems((prev) => {
      return prev
        .map((item, idx) => {
          if (idx === index) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveFromCart = (index: number) => {
    setCartItems((prev) => prev.filter((_, idx) => idx !== index));
    showToast('Item removed from cart');
  };

  const handleProceedToCheckout = (calculatedDiscount: number) => {
    setDiscountAmount(calculatedDiscount);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderComplete = (order: Order) => {
    // Add order to orders list
    setOrders((prev) => [order, ...prev]);

    // Deduct product inventory
    setProducts((prev) =>
      prev.map((prod) => {
        const purchasedItem = order.items.find((i) => i.productId === prod.id);
        if (purchasedItem) {
          const updatedStock = Math.max(0, prod.inventory - purchasedItem.quantity);
          return { ...prod, inventory: updatedStock };
        }
        return prod;
      })
    );

    // Empty cart
    setCartItems([]);
    setDiscountAmount(0);
    setIsCheckoutOpen(false);
    setCompletedOrder(order);
  };

  // Product CRUD (Admin)
  const handleAddProduct = (newProdData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...newProdData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Added "${newProduct.title}" to store`);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    showToast(`Updated "${updatedProduct.title}"`);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast('Product deleted');
  };

  // Filament CRUD (Admin)
  const handleAddFilament = (newFilamentData: Omit<Filament, 'id'>) => {
    const newFilament: Filament = {
      ...newFilamentData,
      id: `fil-${Date.now()}`,
    };
    setFilaments((prev) => [newFilament, ...prev]);
    showToast(`Added filament spool "${newFilament.name}"`);
  };

  const handleUpdateFilament = (updatedFilament: Filament) => {
    setFilaments((prev) =>
      prev.map((f) => (f.id === updatedFilament.id ? updatedFilament : f))
    );
    showToast(`Updated filament "${updatedFilament.name}"`);
  };

  const handleDeleteFilament = (filamentId: string) => {
    const fil = filaments.find((f) => f.id === filamentId);
    setFilaments((prev) => prev.filter((f) => f.id !== filamentId));
    showToast(`Removed filament "${fil?.name || 'Spool'}"`);
  };

  const handleToggleFilamentStock = (filamentId: string) => {
    setFilaments((prev) =>
      prev.map((f) => {
        if (f.id === filamentId) {
          const nextStock = !f.inStock;
          showToast(`Marked "${f.name}" as ${nextStock ? 'In Stock' : 'Out of Stock'}`);
          return { ...f, inStock: nextStock };
        }
        return f;
      })
    );
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    showToast(`Order status changed to ${status}`);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <PayPalScriptProvider options={{ clientId: "test", currency: "USD", intent: "capture" }}>
      <div className="min-h-screen bg-stone-50 font-sans antialiased text-stone-900 selection:bg-amber-400 selection:text-stone-950">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-stone-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl border border-stone-700 flex items-center gap-2 animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Persistent Navigation Bar */}
      <Navbar
        settings={settings}
        activeView={activeView}
        setActiveView={(v) => {
          if (v === 'admin') {
            requestSwitchToAdmin();
          } else {
            setActiveView('store');
          }
        }}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isStoreUnlocked={isStoreUnlocked}
        onRelockStore={handleRelockStore}
      />

      {/* Access Gate Verified Banner (When Unlocked) */}
      {activeView === 'store' && (settings.accessGate?.enabled ?? true) && isStoreUnlocked && (
        <div className="bg-stone-900 text-stone-200 border-b border-stone-800 px-4 py-1.5 text-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="text-[11px] text-stone-300">
                Store Access Verified: <strong className="text-emerald-300">{unlockDetail}</strong>
              </span>
            </div>
            <button
              type="button"
              id="banner-relock-store"
              onClick={handleRelockStore}
              className="text-[11px] text-stone-400 hover:text-amber-300 flex items-center gap-1 font-semibold transition-colors cursor-pointer"
              title="Lock store again to test customer experience"
            >
              <Lock className="w-3 h-3 text-stone-400" />
              <span>Lock Store</span>
            </button>
          </div>
        </div>
      )}

      {/* Main View Router */}
      {activeView === 'store' ? (
        <Storefront
          products={products}
          filaments={filaments}
          settings={settings}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onAddToCart={(p, e) => handleAddToCart(p, 1, undefined, e)}
          onQuickBuy={handleQuickBuy}
          onOpenGuide={() => setIsGuideOpen(true)}
          onSwitchToAdmin={requestSwitchToAdmin}
        />
      ) : (
        <AdminDashboard
          products={products}
          filaments={filaments}
          orders={orders}
          settings={settings}
          onUpdateSettings={setSettings}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
          onAddFilament={handleAddFilament}
          onUpdateFilament={handleUpdateFilament}
          onDeleteFilament={handleDeleteFilament}
          onToggleFilamentStock={handleToggleFilamentStock}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onSwitchToStore={() => setActiveView('store')}
          onOpenGuide={() => setIsGuideOpen(true)}
          onRelockStore={handleRelockStore}
        />
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        settings={settings}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        filaments={filaments}
        settings={settings}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(p, qty, color, secColor, opts) => {
          handleAddToCart(p, qty, color, secColor, opts);
        }}
        onDirectCheckout={(p, qty, color, secColor, opts) => {
          handleAddToCart(p, qty, color, secColor, opts);
          setSelectedProduct(null);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        settings={settings}
        discountAmount={discountAmount}
        onOrderComplete={handleOrderComplete}
      />

      {/* Order Success Receipt Modal */}
      <OrderSuccessModal
        order={completedOrder}
        settings={settings}
        onClose={() => setCompletedOrder(null)}
        onViewOrdersInAdmin={requestSwitchToAdmin}
      />

      {/* Free Setup Guide Modal */}
      <SetupGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        settings={settings}
        onGoToSettings={requestSwitchToAdmin}
      />

      {/* Access Gate Modal (Protected storefront overlay) */}
      {activeView === 'store' && (settings.accessGate?.enabled ?? true) && !isStoreUnlocked && (
        <AccessGateModal
          settings={settings}
          onUnlock={handleGateUnlock}
          onBypassToAdmin={requestSwitchToAdmin}
        />
      )}

      {/* Admin Owner Security PIN Prompt Modal */}
      <AdminPinModal
        isOpen={isAdminPinModalOpen}
        onClose={() => setIsAdminPinModalOpen(false)}
        onSuccess={handleAdminAuthSuccess}
        adminPin={settings.adminPin || '1234'}
      />

      </div>
    </PayPalScriptProvider>
  );
}
