import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Settings, 
  Copy, 
  Check, 
  HelpCircle, 
  Search,
  Box,
  Layers,
  Printer,
  Sparkles,
  Lock,
  Unlock
} from 'lucide-react';
import { StoreSettings } from '../types';

interface NavbarProps {
  settings: StoreSettings;
  activeView: 'store' | 'admin';
  setActiveView: (view: 'store' | 'admin') => void;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onOpenGuide: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isStoreUnlocked?: boolean;
  onRelockStore?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  activeView,
  setActiveView,
  cartCount,
  cartTotal,
  onOpenCart,
  onOpenGuide,
  searchQuery,
  setSearchQuery,
  isStoreUnlocked = true,
  onRelockStore,
}) => {
  const [copiedUrl, setCopiedUrl] = useState(false);

  const handleCopyUrl = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  return (
    <header className="sticky top-0 z-40 bg-stone-950 text-stone-100 border-b border-stone-800 shadow-md">
      {/* Top 3D Printing Announcement Bar */}
      {settings.bannerNotice && (
        <div className="bg-gradient-to-r from-cyan-600 via-teal-600 to-amber-500 text-stone-950 text-xs font-bold py-1.5 px-4 text-center tracking-wide flex items-center justify-center gap-2">
          <span>{settings.bannerNotice}</span>
          <span className="hidden md:inline text-stone-950/80">• Made to order in PLA+, PETG &amp; 8K Resin</span>
        </div>
      )}

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand & Store Name */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              id="brand-home-button"
              onClick={() => setActiveView('store')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-amber-500 p-0.5 shadow-sm group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-stone-950 rounded-[10px] flex items-center justify-center text-cyan-400">
                  <Box className="w-5 h-5 text-cyan-400 group-hover:text-amber-400 transition-colors" />
                </div>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h1 className="text-base sm:text-lg font-black tracking-tight text-white truncate group-hover:text-cyan-400 transition-colors">
                    {settings.storeName}
                  </h1>
                  <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 bg-cyan-950 border border-cyan-800 text-cyan-300 text-[10px] font-bold rounded">
                    3D PRINT
                  </span>
                </div>
                <p className="text-[11px] text-stone-400 truncate hidden sm:block">
                  Custom 3D Prints &amp; Rapid Maker Dispatch
                </p>
              </div>
            </button>
          </div>

          {/* Search Bar (Storefront view only) */}
          {activeView === 'store' && (
            <div className="flex-1 max-w-md hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  id="nav-search-input"
                  type="text"
                  placeholder="Search dragons, planters, mounts, resin miniatures..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 bg-stone-900 border border-stone-800 rounded-lg text-xs sm:text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-200"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Actions & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Guide Button */}
            <button
              id="nav-guide-button"
              onClick={onOpenGuide}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-300 hover:text-cyan-400 hover:bg-stone-900 rounded-lg transition-colors border border-stone-800"
              title="How free 3D print selling with PayPal works"
            >
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span>Selling Guide</span>
            </button>

            {/* Share / Copy Store URL */}
            <button
              id="nav-copy-url-button"
              onClick={handleCopyUrl}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-200 rounded-lg transition-all"
              title="Copy your free 3D print store URL"
            >
              {copiedUrl ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">URL Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-stone-400" />
                  <span className="hidden sm:inline">Share Store URL</span>
                  <span className="sm:hidden">Share</span>
                </>
              )}
            </button>

            {/* Access Gate Indicator / Lock Toggle */}
            {(settings.accessGate?.enabled ?? true) && onRelockStore && (
              <button
                type="button"
                id="nav-gate-status-button"
                onClick={onRelockStore}
                className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                  isStoreUnlocked
                    ? 'text-emerald-300 bg-emerald-950/40 border-emerald-800/60 hover:bg-emerald-900/50'
                    : 'text-amber-300 bg-amber-950/40 border-amber-800/60 hover:bg-amber-900/50'
                }`}
                title={
                  isStoreUnlocked
                    ? 'Store unlocked (Password / Area verified). Click to re-lock for testing.'
                    : 'Store access is currently locked. Click to view lock screen.'
                }
              >
                {isStoreUnlocked ? (
                  <>
                    <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="hidden xl:inline">Access:</span>
                    <span>Unlocked</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden xl:inline">Access:</span>
                    <span>Locked</span>
                  </>
                )}
              </button>
            )}

            {/* View Switcher: Store vs Admin Mode */}
            <div className="bg-stone-900 p-0.5 rounded-lg border border-stone-800 flex items-center">
              <button
                id="toggle-view-store"
                onClick={() => setActiveView('store')}
                className={`px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                  activeView === 'store'
                    ? 'bg-cyan-500 text-stone-950 shadow-sm font-bold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Box className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Storefront</span>
              </button>
              <button
                id="toggle-view-admin"
                onClick={() => setActiveView('admin')}
                className={`px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                  activeView === 'admin'
                    ? 'bg-amber-500 text-stone-950 shadow-sm font-bold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Sell 3D Prints</span>
              </button>
            </div>

            {/* Cart Button */}
            <button
              id="nav-cart-button"
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-amber-500 hover:from-cyan-400 hover:to-amber-400 text-stone-950 font-black text-xs sm:text-sm rounded-lg shadow-sm transition-all focus:ring-2 focus:ring-cyan-400 focus:outline-none"
              aria-label={`Shopping cart with ${cartCount} items`}
            >
              <ShoppingBag className="w-4 h-4 text-stone-950 stroke-[2.5]" />
              <span className="hidden sm:inline">
                {settings.currencySymbol}{cartTotal.toFixed(2)}
              </span>
              {cartCount > 0 && (
                <span className="w-5 h-5 bg-stone-950 text-cyan-300 text-[11px] font-black rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

          </div>
        </div>

        {/* Mobile Search input */}
        {activeView === 'store' && (
          <div className="pb-3 md:hidden">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                id="mobile-search-input"
                type="text"
                placeholder="Search 3D prints, fidgets, dragons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 bg-stone-900 border border-stone-800 rounded-lg text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
