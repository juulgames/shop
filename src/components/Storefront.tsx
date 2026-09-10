import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  ArrowUpDown, 
  Truck, 
  ShieldCheck, 
  CreditCard, 
  Search,
  PlusCircle,
  HelpCircle,
  Box,
  Layers,
  Cpu,
  Clock,
  Send,
  CheckCircle2
} from 'lucide-react';
import { Product, StoreSettings, CustomQuoteRequest, Filament } from '../types';
import { ProductCard } from './ProductCard';

interface StorefrontProps {
  products: Product[];
  filaments?: Filament[];
  settings: StoreSettings;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, e?: React.MouseEvent) => void;
  onQuickBuy: (product: Product, e?: React.MouseEvent) => void;
  onOpenGuide: () => void;
  onSwitchToAdmin: () => void;
}

export const Storefront: React.FC<StorefrontProps> = ({
  products,
  filaments = [],
  settings,
  searchQuery,
  setSearchQuery,
  onSelectProduct,
  onAddToCart,
  onQuickBuy,
  onOpenGuide,
  onSwitchToAdmin,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('featured');

  // Custom 3D Print Request Form state
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [customDetails, setCustomDetails] = useState('');
  const [customMaterial, setCustomMaterial] = useState('PLA+ (Standard Durable)');
  const [customInfill, setCustomInfill] = useState('20% Gyroid (Standard)');
  const [customSuccessToast, setCustomSuccessToast] = useState(false);

  // Derive unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => set.add(p.category));
    return ['All', ...Array.from(set)];
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Category filter
    if (selectedCategory !== 'All') {
      list = list.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.material && p.material.toLowerCase().includes(q))
      );
    }

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      default:
        // featured
        break;
    }

    return list;
  }, [products, selectedCategory, searchQuery, sortBy]);

  const handleSubmitCustomQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || !customEmail.trim() || !customDetails.trim()) return;

    setCustomSuccessToast(true);
    setCustomName('');
    setCustomEmail('');
    setCustomDetails('');
    setTimeout(() => setCustomSuccessToast(false), 4000);
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-stone-900 pb-20">
      
      {/* 3D Print Hero Section */}
      <section className="bg-stone-950 text-stone-100 py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-stone-800 relative overflow-hidden">
        {/* Futuristic grid layer lines */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[linear-gradient(to_right,#06b6d4_1px,transparent_1px),linear-gradient(to_bottom,#06b6d4_1px,transparent_1px)] [background-size:24px_24px]" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-bold rounded-full mb-3 shadow-xs">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>High-Speed 3D Print Farm • Rapid Global Dispatch</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              {settings.storeName}
            </h1>
            
            <p className="mt-3.5 text-sm sm:text-base text-stone-300 leading-relaxed max-w-2xl font-medium">
              {settings.tagline}
            </p>

            {/* Feature Badges */}
            <div className="mt-6 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-stone-300">
              <div className="flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-cyan-400" />
                <span>PayPal Direct Checkout</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-amber-400" />
                <span>Free Delivery</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Inspected Layer Perfection</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Filter and Sort Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200">
          
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map((category) => (
              <button
                key={category}
                id={`filter-cat-${category.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setSelectedCategory(category)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-stone-950 text-cyan-300 border border-cyan-500/40 shadow-xs'
                    : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Sort selector & Count */}
          <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
            <span className="text-stone-500 font-medium">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'model' : 'models'} available
            </span>

            <div className="flex items-center gap-1.5 bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 shadow-2xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
              <select
                id="sort-products-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs font-semibold text-stone-800 focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured Prints</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest Added</option>
              </select>
            </div>
          </div>

        </div>

        {/* Search Query Feedback */}
        {searchQuery && (
          <div className="mt-4 flex items-center justify-between bg-cyan-50 border border-cyan-200 text-stone-800 px-4 py-2 rounded-lg text-xs">
            <span>Showing 3D print results for "<strong>{searchQuery}</strong>"</span>
            <button
              onClick={() => setSearchQuery('')}
              className="text-cyan-800 hover:text-stone-950 font-bold underline"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-2xl border border-stone-200 mt-6 p-8">
            <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-3 text-stone-400">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-stone-800">No 3D prints found matching query</h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              Try searching for dragons, planters, mounts, or resin miniatures.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 bg-stone-950 text-white text-xs font-bold rounded-lg hover:bg-stone-800 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 mt-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                filaments={filaments}
                settings={settings}
                onSelectProduct={onSelectProduct}
                onAddToCart={onAddToCart}
                onQuickBuy={onQuickBuy}
              />
            ))}
          </div>
        )}

        {/* Custom 3D Print Request / Upload STL Banner */}
        <section className="mt-16 bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-cyan-100 text-cyan-900 font-bold text-[11px] rounded-md mb-2">
              <Box className="w-3.5 h-3.5 text-cyan-700" />
              <span>Have a Custom Model or STL?</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
              Request a Custom 3D Print from Juuls
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Found a 3D model on Thingiverse, Printables, or Thangs? Or have your own design? Send details below for a fast price quote and print dispatch.
            </p>
          </div>

          <form onSubmit={handleSubmitCustomQuote} className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Your Name</label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g. Jordan Lee"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Email</label>
              <input
                type="email"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Desired Material</label>
              <select
                value={customMaterial}
                onChange={(e) => setCustomMaterial(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500 font-medium"
              >
                <option value="PLA+ (Standard Durable)">PLA+ (Standard Tough)</option>
                <option value="Silk Dual-Color PLA">Silk Dual-Color PLA (Shiny)</option>
                <option value="PETG (Heat Resistant & Strong)">PETG (Heavy-Duty)</option>
                <option value="8K UV Resin (Micro Precision)">8K UV Resin (Ultra-Detail)</option>
                <option value="Carbon Fiber PLA">Carbon Fiber PLA (Rigid)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Link to Model / Details</label>
              <input
                type="text"
                value={customDetails}
                onChange={(e) => setCustomDetails(e.target.value)}
                placeholder="Thingiverse link, dimensions..."
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500"
                required
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-4 flex items-center justify-between pt-2">
              {customSuccessToast ? (
                <div className="text-emerald-700 font-bold flex items-center gap-1.5 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Custom print inquiry sent to Juuls 3D Express! We'll reply within 24 hours.</span>
                </div>
              ) : <span className="text-stone-400 text-[11px]">Free estimate • No commitment required</span>}

              <button
                type="submit"
                className="px-5 py-2.5 bg-stone-950 hover:bg-stone-800 text-white font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Send className="w-3.5 h-3.5 text-cyan-400" />
                <span>Submit Print Request</span>
              </button>
            </div>
          </form>
        </section>

        {/* Sell Your Own Items Workshop Callout */}
        <section className="mt-8 bg-gradient-to-r from-stone-950 via-stone-900 to-cyan-950 text-white rounded-2xl p-6 sm:p-8 border border-stone-800 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-500 text-stone-950 font-black text-[11px] rounded-md">
              <Box className="w-3 h-3" />
              <span>Workshop Owner Mode</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Manage Juuls 3D Express Inventory &amp; Orders
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 max-w-xl">
              Switch to <strong>Sell 3D Prints</strong> mode to add new 3D printed items, customize filament color options, configure your free PayPal links, and update print order statuses.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <button
              onClick={onOpenGuide}
              className="w-full sm:w-auto px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-stone-200 text-xs font-bold rounded-xl border border-stone-700 transition-colors flex items-center justify-center gap-1.5"
            >
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <span>Free Setup Guide</span>
            </button>
            <button
              onClick={onSwitchToAdmin}
              className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-amber-500 hover:from-cyan-400 hover:to-amber-400 text-stone-950 text-xs font-black rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4 text-stone-950" />
              <span>Manage 3D Prints</span>
            </button>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-stone-200 bg-white py-10 px-4 sm:px-6 lg:px-8 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-2">
            <span className="font-black text-stone-900">{settings.storeName}</span>
            <span className="text-stone-300">•</span>
            <span>Custom 3D Printing with Zero Monthly Fees</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button onClick={onOpenGuide} className="hover:text-stone-900 transition-colors">
              How PayPal Work
            </button>
            <span className="text-stone-300">•</span>
            <button onClick={onSwitchToAdmin} className="hover:text-stone-900 transition-colors font-bold text-cyan-700">
              Workshop Admin
            </button>
            <span className="text-stone-300">•</span>
            <a href={`mailto:${settings.supportEmail}`} className="hover:text-stone-900 transition-colors">
              {settings.supportEmail}
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
};
