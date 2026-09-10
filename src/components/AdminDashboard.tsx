import React, { useState } from 'react';
import { 
  Package, 
  ShoppingBag, 
  Settings as SettingsIcon, 
  Plus, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  Copy, 
  Check, 
  DollarSign, 
  Truck, 
  HelpCircle,
  Eye,
  AlertCircle,
  Image as ImageIcon,
  Layers,
  Clock,
  Box,
  Printer,
  Sparkles,
  Palette,
  Disc,
  CheckCircle2,
  XCircle,
  PlusCircle,
  Globe,
  Lock,
  Unlock,
  MapPin,
  KeyRound,
  Navigation,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';
import { Product, Order, StoreSettings, Filament, AccessGateSettings } from '../types';
import { PRESET_IMAGE_SUGGESTIONS } from '../data/initialProducts';

interface AdminDashboardProps {
  products: Product[];
  filaments: Filament[];
  orders: Order[];
  settings: StoreSettings;
  onUpdateSettings: (settings: StoreSettings) => void;
  onAddProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onAddFilament: (filament: Omit<Filament, 'id'>) => void;
  onUpdateFilament: (filament: Filament) => void;
  onDeleteFilament: (filamentId: string) => void;
  onToggleFilamentStock: (filamentId: string) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  onSwitchToStore: () => void;
  onOpenGuide: () => void;
  onRelockStore?: () => void;
}

const COMMON_COLOR_PRESETS = [
  { name: 'Black', hex: '#18181b' },
  { name: 'White', hex: '#f8fafc' },
  { name: 'Slate Gray', hex: '#64748b' },
  { name: 'Cyan Blue', hex: '#06b6d4' },
  { name: 'Royal Blue', hex: '#2563eb' },
  { name: 'Emerald Green', hex: '#059669' },
  { name: 'Neon Green', hex: '#22c55e' },
  { name: 'Signal Orange', hex: '#f97316' },
  { name: 'Ruby Red', hex: '#dc2626' },
  { name: 'Galaxy Purple', hex: '#8b5cf6' },
  { name: 'Silk Pink', hex: '#ec4899' },
  { name: 'Rich Gold', hex: '#d97706' },
  { name: 'Bronze', hex: '#92400e' },
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  filaments,
  orders,
  settings,
  onUpdateSettings,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onAddFilament,
  onUpdateFilament,
  onDeleteFilament,
  onToggleFilamentStock,
  onUpdateOrderStatus,
  onSwitchToStore,
  onOpenGuide,
  onRelockStore,
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'filaments' | 'orders' | 'settings'>('products');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [copiedStoreUrl, setCopiedStoreUrl] = useState(false);
  const [showGatePassword, setShowGatePassword] = useState(false);
  const [detectingGpsWorkshop, setDetectingGpsWorkshop] = useState(false);

  // Filament Spool Modal state
  const [isFilamentModalOpen, setIsFilamentModalOpen] = useState(false);
  const [editingFilament, setEditingFilament] = useState<Filament | null>(null);
  const [filName, setFilName] = useState('');
  const [filMaterial, setFilMaterial] = useState('Silk PLA');
  const [filColorHex, setFilColorHex] = useState('#ec4899');
  const [filBrand, setFilBrand] = useState('Bambu Lab');
  const [filInStock, setFilInStock] = useState(true);
  const [filNotes, setFilNotes] = useState('');
  const [filError, setFilError] = useState('');

  // Product form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('24.00');
  const [category, setCategory] = useState('Articulated & Fidgets');
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGE_SUGGESTIONS[0].url);
  const [inventory, setInventory] = useState('15');
  const [material, setMaterial] = useState('Silk Multi-Color PLA');
  const [selectedFilamentNames, setSelectedFilamentNames] = useState<string[]>([]);
  const [customColorInput, setCustomColorInput] = useState('');
  const [supportsMultiColor, setSupportsMultiColor] = useState(true);
  const [optionsText, setOptionsText] = useState('Standard (100%), Large Pro (125%), Collector Scale (150%)');
  const [dimensions, setDimensions] = useState('20 × 12 × 8 cm');
  const [printTimeHours, setPrintTimeHours] = useState('8');

  const [paypalPaymentLink, setPaypalPaymentLink] = useState('');
  const [badge, setBadge] = useState('');
  const [formError, setFormError] = useState('');

  // Settings form state
  const [tempSettings, setTempSettings] = useState<StoreSettings>(settings);
  const [postalInput, setPostalInput] = useState<string | null>(null);
  const [radiusInput, setRadiusInput] = useState<string | null>(null);
  const [settingsSavedMessage, setSettingsSavedMessage] = useState(false);

  const resetProductForm = () => {
    setTitle('');
    setDescription('');
    setPrice('24.00');
    setCategory('Articulated & Fidgets');
    setImageUrl(PRESET_IMAGE_SUGGESTIONS[0].url);
    setInventory('15');
    setMaterial('Silk Multi-Color PLA');
    setSelectedFilamentNames(filaments.filter(f => f.inStock).slice(0, 3).map(f => f.name));
    setCustomColorInput('');
    setSupportsMultiColor(true);
    setOptionsText('Standard (100%), Large Pro (125%), Collector Scale (150%)');
    setDimensions('20 × 12 × 8 cm');
    setPrintTimeHours('8');
    setPaypalPaymentLink('');
    setBadge('');
    setFormError('');
    setEditingProduct(null);
  };

  const handleOpenAddProduct = () => {
    resetProductForm();
    setIsAddModalOpen(true);
  };

  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    setTitle(p.title);
    setDescription(p.description);
    setPrice(p.price.toString());
    setCategory(p.category);
    setImageUrl(p.imageUrl);
    setInventory(p.inventory.toString());
    setMaterial(p.material || 'PLA+');
    setSelectedFilamentNames(p.colorOptions || []);
    setCustomColorInput('');
    setSupportsMultiColor(p.supportsMultiColor ?? true);
    if (p.options && p.options.length > 0) {
      setOptionsText(p.options[0].values.join(', '));
    } else {
      setOptionsText('Standard (100%), Large Pro (125%)');
    }
    setDimensions(p.dimensions || '');
    setPrintTimeHours(p.printTimeHours ? p.printTimeHours.toString() : '');
    setPaypalPaymentLink(p.paypalPaymentLink || '');
    setBadge(p.badge || '');
    setFormError('');
    setIsAddModalOpen(true);
  };

  const handleToggleProductFilament = (name: string) => {
    setSelectedFilamentNames(prev => 
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  const handleSelectAllInStockFilaments = () => {
    const inStockNames = filaments.filter(f => f.inStock).map(f => f.name);
    setSelectedFilamentNames(inStockNames);
  };

  const handleAddCustomColor = () => {
    if (!customColorInput.trim()) return;
    const clean = customColorInput.trim();
    if (!selectedFilamentNames.includes(clean)) {
      setSelectedFilamentNames(prev => [...prev, clean]);
    }
    setCustomColorInput('');
  };

  const handleSubmitProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError('Product title is required.');
      return;
    }
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice < 0) {
      setFormError('Please enter a valid price.');
      return;
    }
    const numInv = parseInt(inventory, 10);
    if (isNaN(numInv) || numInv < 0) {
      setFormError('Please enter a valid inventory count.');
      return;
    }

    const finalColors = selectedFilamentNames.length > 0 ? selectedFilamentNames : ['Default'];
    const parsedValues = optionsText.split(',').map(v => v.trim()).filter(Boolean);
    const finalOptions = parsedValues.length > 0 ? [{ name: 'Model Version / Size', values: parsedValues }] : undefined;

    if (editingProduct) {
      onUpdateProduct({
        ...editingProduct,
        title: title.trim(),
        description: description.trim(),
        price: numPrice,
        category,
        imageUrl: imageUrl.trim() || PRESET_IMAGE_SUGGESTIONS[0].url,
        inventory: numInv,
        material: material.trim(),
        colorOptions: finalColors,
        supportsMultiColor,
        options: finalOptions,
        dimensions: dimensions.trim(),
        printTimeHours: printTimeHours ? parseFloat(printTimeHours) : undefined,
        paypalPaymentLink: paypalPaymentLink.trim() || undefined,
        badge: badge.trim() || undefined,
      });
    } else {
      onAddProduct({
        title: title.trim(),
        description: description.trim(),
        price: numPrice,
        category,
        imageUrl: imageUrl.trim() || PRESET_IMAGE_SUGGESTIONS[0].url,
        inventory: numInv,
        material: material.trim(),
        colorOptions: finalColors,
        supportsMultiColor,
        options: finalOptions,
        dimensions: dimensions.trim(),
        printTimeHours: printTimeHours ? parseFloat(printTimeHours) : undefined,
        paypalPaymentLink: paypalPaymentLink.trim() || undefined,
        badge: badge.trim() || undefined,
        rating: 5.0,
        reviewsCount: 1,
      });
    }

    setIsAddModalOpen(false);
    resetProductForm();
  };

  // Filament Spool Form Handlers
  const resetFilamentForm = () => {
    setFilName('');
    setFilMaterial('Silk PLA');
    setFilColorHex('#ec4899');
    setFilBrand('Bambu Lab');
    setFilInStock(true);
    setFilNotes('');
    setFilError('');
    setEditingFilament(null);
  };

  const handleOpenAddFilament = () => {
    resetFilamentForm();
    setIsFilamentModalOpen(true);
  };

  const handleOpenEditFilament = (f: Filament) => {
    setEditingFilament(f);
    setFilName(f.name);
    setFilMaterial(f.material);
    setFilColorHex(f.colorHex);
    setFilBrand(f.brand || 'Bambu Lab');
    setFilInStock(f.inStock);
    setFilNotes(f.notes || '');
    setFilError('');
    setIsFilamentModalOpen(true);
  };

  const handleSubmitFilament = (e: React.FormEvent) => {
    e.preventDefault();
    if (!filName.trim()) {
      setFilError('Filament name is required.');
      return;
    }

    if (editingFilament) {
      onUpdateFilament({
        ...editingFilament,
        name: filName.trim(),
        material: filMaterial,
        colorHex: filColorHex,
        brand: filBrand.trim(),
        inStock: filInStock,
        notes: filNotes.trim(),
      });
    } else {
      onAddFilament({
        name: filName.trim(),
        material: filMaterial,
        colorHex: filColorHex,
        brand: filBrand.trim(),
        inStock: filInStock,
        notes: filNotes.trim(),
      });
    }

    setIsFilamentModalOpen(false);
    resetFilamentForm();
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(tempSettings);
    setSettingsSavedMessage(true);
    setTimeout(() => setSettingsSavedMessage(false), 2500);
  };

  const handleCopyStoreUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedStoreUrl(true);
    setTimeout(() => setCopiedStoreUrl(false), 2500);
  };

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const inStockFilamentsCount = filaments.filter(f => f.inStock).length;

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 pb-20">
      
      {/* Dashboard Topbar */}
      <div className="bg-stone-950 text-white border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-amber-500 text-stone-950 text-xs font-black rounded-md mb-2">
                <Box className="w-3.5 h-3.5" />
                <span>Juuls 3D Express Workshop Manager</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                3D Print Store Manager
              </h1>
              <p className="text-xs sm:text-sm text-stone-400 mt-1">
                Manage your 3D printed items, filament inventory spools, customer print queue, and zero-fee checkout links.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <button
                id="admin-open-guide-button"
                onClick={onOpenGuide}
                className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-stone-200 text-xs font-semibold rounded-xl border border-stone-700 transition-colors flex items-center gap-1.5"
              >
                <HelpCircle className="w-4 h-4 text-cyan-400" />
                <span>PayPal Setup</span>
              </button>

              <button
                id="admin-copy-url-button"
                onClick={handleCopyStoreUrl}
                className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-stone-200 text-xs font-semibold rounded-xl border border-stone-700 transition-colors flex items-center gap-1.5"
              >
                {copiedStoreUrl ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">Store URL Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-stone-400" />
                    <span>Copy Store URL</span>
                  </>
                )}
              </button>

              <button
                id="admin-view-storefront-button"
                onClick={onSwitchToStore}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-stone-950 font-black text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Eye className="w-4 h-4" />
                <span>View Live Storefront</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-stone-800 text-xs">
            <div className="bg-stone-900/90 p-3.5 rounded-xl border border-stone-800">
              <span className="text-stone-400 block text-[11px] font-semibold">Total Revenue</span>
              <span className="text-lg sm:text-xl font-black text-white mt-0.5 block">
                {settings.currencySymbol}{totalRevenue.toFixed(2)}
              </span>
            </div>
            <div className="bg-stone-900/90 p-3.5 rounded-xl border border-stone-800">
              <span className="text-stone-400 block text-[11px] font-semibold">Active Models</span>
              <span className="text-lg sm:text-xl font-black text-cyan-400 mt-0.5 block">
                {products.length} 3D prints
              </span>
            </div>
            <div className="bg-stone-900/90 p-3.5 rounded-xl border border-stone-800">
              <span className="text-stone-400 block text-[11px] font-semibold">My Filament Spools</span>
              <span className="text-lg sm:text-xl font-black text-amber-400 mt-0.5 block">
                {inStockFilamentsCount} / {filaments.length} in stock
              </span>
            </div>
            <div className="bg-stone-900/90 p-3.5 rounded-xl border border-stone-800">
              <span className="text-stone-400 block text-[11px] font-semibold">Orders in Queue</span>
              <span className="text-lg sm:text-xl font-black text-emerald-400 mt-0.5 block">
                {orders.length} orders
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-stone-200 pb-3 overflow-x-auto">
          <button
            id="tab-products"
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'products'
                ? 'bg-stone-950 text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-200'
            }`}
          >
            <Box className="w-4 h-4" />
            <span>3D Print Catalog ({products.length})</span>
          </button>

          <button
            id="tab-filaments"
            onClick={() => setActiveTab('filaments')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'filaments'
                ? 'bg-stone-950 text-cyan-300 shadow-xs border border-cyan-500/40'
                : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-200'
            }`}
          >
            <Palette className="w-4 h-4 text-cyan-500" />
            <span>My Filaments &amp; Spools ({filaments.length})</span>
          </button>

          <button
            id="tab-orders"
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-stone-950 text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-200'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders &amp; Queue ({orders.length})</span>
          </button>

          <button
            id="tab-settings"
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-stone-950 text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-200'
            }`}
          >
            <SettingsIcon className="w-4 h-4" />
            <span>Workshop Settings</span>
          </button>
        </div>

        {/* TAB 1: 3D PRINT CATALOG */}
        {activeTab === 'products' && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-stone-900">Your 3D Printed Items</h3>
                <p className="text-xs text-stone-500">
                  Add new 3D printed items, attach filaments from your spools inventory, set print times, and attach PayPal links.
                </p>
              </div>

              <button
                id="admin-add-product-button"
                onClick={handleOpenAddProduct}
                className="px-4 py-2 bg-stone-950 hover:bg-cyan-500 hover:text-stone-950 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add New 3D Print</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase text-[10px] font-bold">
                    <tr>
                      <th className="py-3 px-4">Print Model</th>
                      <th className="py-3 px-4">Category &amp; Material</th>
                      <th className="py-3 px-4">Filament Colors Available</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Stock</th>
                      <th className="py-3 px-4">Checkout Link</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 text-stone-700">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-stone-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.imageUrl}
                              alt={p.title}
                              referrerPolicy="no-referrer"
                              className="w-12 h-12 rounded-lg object-cover bg-stone-900 flex-shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="font-bold text-stone-900 truncate max-w-xs">{p.title}</div>
                              {p.badge && (
                                <span className="inline-block mt-0.5 px-1.5 py-0.2 bg-cyan-100 text-cyan-800 text-[10px] font-bold rounded">
                                  {p.badge}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-medium text-stone-900">{p.category}</div>
                          <div className="text-[11px] text-stone-500 truncate max-w-[140px]">{p.material || 'PLA'}</div>
                        </td>

                        <td className="py-3 px-4">
                          {p.colorOptions && p.colorOptions.length > 0 ? (
                            <div className="flex flex-wrap gap-1 max-w-[220px]">
                              {p.colorOptions.map((cName, idx) => {
                                const matchingFil = filaments.find(f => f.name.toLowerCase() === cName.toLowerCase());
                                return (
                                  <span 
                                    key={idx} 
                                    className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-stone-100 border border-stone-200 text-stone-800 rounded text-[10px] font-medium"
                                  >
                                    {matchingFil && (
                                      <span 
                                        className="w-2 h-2 rounded-full border border-stone-400 flex-shrink-0"
                                        style={{ backgroundColor: matchingFil.colorHex }}
                                      />
                                    )}
                                    <span className="truncate max-w-[100px]">{cName}</span>
                                  </span>
                                );
                              })}
                            </div>
                          ) : (
                            <span className="text-stone-400 italic text-[11px]">Default</span>
                          )}
                        </td>

                        <td className="py-3 px-4 font-black text-stone-900">
                          {settings.currencySymbol}{p.price.toFixed(2)}
                        </td>

                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              p.inventory <= 0
                                ? 'bg-rose-100 text-rose-700'
                                : p.inventory <= 3
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-emerald-100 text-emerald-700'
                            }`}
                          >
                            {p.inventory <= 0 ? 'Out of Stock' : `${p.inventory} ready`}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          {p.paypalPaymentLink ? (
                            <a
                              href={p.paypalPaymentLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sky-600 hover:text-sky-800 font-bold text-[11px] flex items-center gap-1"
                            >
                              <span>PayPal Link</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-stone-400 text-[11px]">In-app cart</span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditProduct(p)}
                              className="p-1.5 text-stone-600 hover:text-stone-950 hover:bg-stone-100 rounded-md transition-colors"
                              title="Edit print details"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onDeleteProduct(p.id)}
                              className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                              title="Delete model"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FILAMENT INVENTORY & SPOOLS MANAGER */}
        {activeTab === 'filaments' && (
          <div className="mt-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-cyan-100 text-cyan-900 text-[11px] font-bold rounded-md mb-1">
                  <Palette className="w-3.5 h-3.5 text-cyan-700" />
                  <span>Workshop Filament Stock</span>
                </div>
                <h3 className="text-lg font-black text-stone-900">Your Filament Spool Inventory</h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Add, edit, or remove the exact filament spools and colors you have in your workshop. Toggle in-stock status anytime so customers only order what you can print.
                </p>
              </div>

              <button
                id="admin-add-filament-button"
                onClick={handleOpenAddFilament}
                className="px-4 py-2.5 bg-stone-950 hover:bg-cyan-500 hover:text-stone-950 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 flex-shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Filament Spool</span>
              </button>
            </div>

            {/* Filaments Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filaments.map((fil) => (
                <div
                  key={fil.id}
                  className={`bg-white rounded-xl border p-4 shadow-xs flex flex-col justify-between transition-all ${
                    fil.inStock ? 'border-stone-200' : 'border-rose-200 bg-stone-50/70 opacity-80'
                  }`}
                >
                  <div>
                    {/* Header with Swatch */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-8 h-8 rounded-full border-2 border-white shadow-md flex-shrink-0 flex items-center justify-center"
                          style={{ backgroundColor: fil.colorHex }}
                          title={fil.colorHex}
                        />
                        <div>
                          <h4 className="font-bold text-stone-900 text-sm leading-tight">
                            {fil.name}
                          </h4>
                          <span className="text-[11px] text-cyan-700 font-semibold">
                            {fil.material}
                          </span>
                        </div>
                      </div>

                      {/* Stock Toggle Badge */}
                      <button
                        onClick={() => onToggleFilamentStock(fil.id)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-all ${
                          fil.inStock
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                        }`}
                        title="Click to toggle In-Stock / Out of Stock"
                      >
                        {fil.inStock ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>In Stock</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-rose-600" />
                            <span>Out of Stock</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Brand & Notes */}
                    <div className="mt-3 text-xs space-y-1 text-stone-600 bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                      <div className="flex justify-between">
                        <span className="text-stone-400 font-medium">Brand / Spool:</span>
                        <span className="font-semibold text-stone-800">{fil.brand || 'Unbranded'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-400 font-medium">Color Hex:</span>
                        <span className="font-mono text-stone-700 font-semibold uppercase">{fil.colorHex}</span>
                      </div>
                      {fil.notes && (
                        <div className="text-[11px] text-stone-500 pt-1 border-t border-stone-200 mt-1 italic">
                          "{fil.notes}"
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions (Edit / Remove) */}
                  <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between">
                    <button
                      onClick={() => onToggleFilamentStock(fil.id)}
                      className="text-xs font-semibold text-stone-600 hover:text-stone-950 transition-colors"
                    >
                      {fil.inStock ? 'Mark Out of Stock' : 'Mark Available'}
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditFilament(fil)}
                        className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors"
                        title="Edit spool"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteFilament(fil.id)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                        title="Remove filament spool"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>

            {filaments.length === 0 && (
              <div className="bg-white rounded-xl border border-stone-200 p-10 text-center text-stone-500">
                <Palette className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-stone-800">No filaments recorded yet</h4>
                <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                  Add the filament spools you own so you and your customers can pick from them when ordering prints.
                </p>
                <button
                  onClick={handleOpenAddFilament}
                  className="mt-4 px-4 py-2 bg-stone-950 text-white text-xs font-bold rounded-lg hover:bg-stone-800"
                >
                  Add Your First Filament
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CUSTOMER PRINT ORDERS */}
        {activeTab === 'orders' && (
          <div className="mt-6 space-y-4">
            <div>
              <h3 className="text-base font-bold text-stone-900">Customer Print Queue &amp; Orders</h3>
              <p className="text-xs text-stone-500">
                Customer delivery details and fulfillment status updates as your 3D printers complete the orders.
              </p>
            </div>

            {orders.length === 0 ? (
              <div className="bg-white rounded-xl border border-stone-200 p-12 text-center text-stone-500">
                <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-stone-800">No orders received yet</h4>
                <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                  When customers purchase 3D prints on your live store or through checkout, their shipping info and chosen filament color appear here.
                </p>
                <button
                  onClick={onSwitchToStore}
                  className="mt-4 px-4 py-2 bg-stone-950 text-white text-xs font-bold rounded-lg hover:bg-stone-800"
                >
                  Test Storefront Checkout
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((o) => (
                  <div
                    key={o.id}
                    className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-xs bg-stone-100 px-2 py-0.5 rounded border border-stone-300 text-stone-800">
                          #{o.id}
                        </span>
                        <span className="text-xs text-stone-500">
                          {new Date(o.date).toLocaleDateString()} at {new Date(o.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="px-2 py-0.5 bg-cyan-100 text-cyan-800 text-[10px] font-bold rounded-full">
                          Paid via {o.paymentMethod.toUpperCase()}
                        </span>
                      </div>

                      <div className="text-xs text-stone-800">
                        <span className="font-bold">{o.customer.name}</span> • {o.customer.email} • {o.customer.address}, {o.customer.city} {o.customer.zip}
                      </div>

                      <div className="flex flex-wrap gap-2 text-xs text-stone-600">
                        {o.items.map((it, idx) => (
                          <span key={idx} className="bg-stone-50 border border-stone-200 px-2 py-1 rounded text-[11px]">
                            {it.quantity}× {it.title} {it.selectedColor ? `(${it.selectedColor})` : ''}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-stone-100 justify-between md:justify-end">
                      <div className="text-right">
                        <div className="text-[10px] uppercase font-bold text-stone-400">Total</div>
                        <div className="text-base font-black text-stone-900">
                          {settings.currencySymbol}{o.total.toFixed(2)}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={o.status}
                          onChange={(e) => onUpdateOrderStatus(o.id, e.target.value as any)}
                          className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border focus:outline-none cursor-pointer ${
                            o.status === 'delivered'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                              : o.status === 'shipped'
                              ? 'bg-sky-50 text-sky-700 border-sky-300'
                              : o.status === 'processing'
                              ? 'bg-cyan-50 text-cyan-700 border-cyan-300'
                              : 'bg-amber-50 text-amber-700 border-amber-300'
                          }`}
                        >
                          <option value="pending">Pending Print</option>
                          <option value="processing">Printing on Bed</option>
                          <option value="shipped">Shipped &amp; Dispatched</option>
                          <option value="delivered">Delivered to Customer</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: WORKSHOP SETTINGS */}
        {activeTab === 'settings' && (
          <div className="mt-6 max-w-3xl">
            <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs">
              <h3 className="text-base font-bold text-stone-900 mb-1">Store &amp; Workshop Configuration</h3>
              <p className="text-xs text-stone-500 mb-6">
                Customize your store name, free shipping minimums, and default PayPal account.
              </p>

              <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Store Name</label>
                  <input
                    type="text"
                    value={tempSettings.storeName}
                    onChange={(e) => setTempSettings({ ...tempSettings, storeName: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500 font-semibold text-stone-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Tagline</label>
                  <input
                    type="text"
                    value={tempSettings.tagline}
                    onChange={(e) => setTempSettings({ ...tempSettings, tagline: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Announcement Banner Message</label>
                  <input
                    type="text"
                    value={tempSettings.bannerNotice}
                    onChange={(e) => setTempSettings({ ...tempSettings, bannerNotice: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Currency Symbol</label>
                    <input
                      type="text"
                      value={tempSettings.currencySymbol}
                      onChange={(e) => setTempSettings({ ...tempSettings, currencySymbol: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Free Shipping Threshold ($)</label>
                    <input
                      type="number"
                      value={tempSettings.freeShippingThreshold}
                      onChange={(e) => setTempSettings({ ...tempSettings, freeShippingThreshold: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Globe className="w-4 h-4 text-cyan-600" />
                    <h4 className="font-bold text-stone-900 text-sm">Custom Domain &amp; Live Web Addresses</h4>
                  </div>
                  <p className="text-stone-500 text-[11px] mb-3">
                    Your store is already online and live. You can connect a custom domain like <strong>juuls3dexpress.com</strong> or share your free live link.
                  </p>

                  <div className="space-y-4">
                    {/* Current Live URL Display */}
                    <div className="p-3.5 bg-stone-900 text-white rounded-xl space-y-2 border border-stone-800">
                      <div className="flex items-center justify-between text-[11px] text-stone-400">
                        <span className="font-semibold uppercase tracking-wider text-cyan-400">Your Current Live Store Address:</span>
                        <span className="bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded text-[10px]">
                          ● Live &amp; Active
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2 p-2 bg-stone-950 rounded-lg border border-stone-800 font-mono text-xs text-amber-300 break-all">
                        <span>{typeof window !== 'undefined' ? window.location.href : 'https://ais-pre-xchkmrdpwdeu4jrvkt4ico-740934486857.europe-west2.run.app'}</span>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            type="button"
                            onClick={handleCopyStoreUrl}
                            className="p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded transition-colors"
                            title="Copy Live Store URL"
                          >
                            {copiedStoreUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <a
                            href={typeof window !== 'undefined' ? window.location.href : '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded transition-colors"
                            title="Open in new window"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                      <p className="text-[11px] text-stone-400">
                        Send this link to anyone on WhatsApp, Instagram bio, or customers — they can browse and order prints immediately!
                      </p>
                    </div>

                    {/* Custom Domain Input */}
                    <div>
                      <label className="block font-medium text-stone-700 mb-1">Your Custom Domain Name</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={tempSettings.customDomain || ''}
                          onChange={(e) => setTempSettings({ ...tempSettings, customDomain: e.target.value })}
                          placeholder="e.g. juuls3dexpress.com"
                          className="flex-1 px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono text-xs font-bold text-stone-900"
                        />
                      </div>
                      <span className="text-[10px] text-stone-500 mt-1 block">
                        Enter the domain you own or plan to register (e.g. from Namecheap, Porkbun, or Cloudflare for ~$9/year).
                      </span>
                    </div>

                    {/* Step-by-step custom domain connection options */}
                    <div className="p-3.5 bg-cyan-50/70 rounded-xl border border-cyan-200 text-xs space-y-3">
                      <div className="font-bold text-stone-900 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-700" />
                        <span>How to Connect Your Custom Domain ({tempSettings.customDomain || 'juuls3dexpress.com'}):</span>
                      </div>

                      {/* Option 1: Instant Free Domain Forwarding */}
                      <div className="bg-white p-3 rounded-lg border border-cyan-200 space-y-1">
                        <div className="font-bold text-stone-900 flex items-center gap-1.5 text-[11px]">
                          <span className="w-4 h-4 rounded-full bg-cyan-600 text-white flex items-center justify-center text-[10px]">1</span>
                          <span>Method 1: Instant Domain Forwarding / Redirect (Easiest — 60 Seconds)</span>
                        </div>
                        <p className="text-[11px] text-stone-600 leading-relaxed">
                          Buy <strong>{tempSettings.customDomain || 'juuls3dexpress.com'}</strong> on any registrar (Namecheap, Cloudflare, Porkbun, or GoDaddy for ~$9/year). Go to <strong>Domain Redirect / Forwarding</strong> and forward it to your store URL above with 301 Permanent Redirect. Whenever someone visits your domain, they arrive directly at your store!
                        </p>
                      </div>

                      {/* Option 2: CNAME DNS Setup */}
                      <div className="bg-white p-3 rounded-lg border border-cyan-200 space-y-1.5">
                        <div className="font-bold text-stone-900 flex items-center gap-1.5 text-[11px]">
                          <span className="w-4 h-4 rounded-full bg-cyan-600 text-white flex items-center justify-center text-[10px]">2</span>
                          <span>Method 2: Direct DNS Mapping (CNAME Record)</span>
                        </div>
                        <p className="text-[11px] text-stone-600">
                          In your domain registrar's DNS settings, add the following record:
                        </p>
                        <div className="overflow-x-auto">
                          <table className="w-full text-[10px] font-mono border border-stone-200 rounded">
                            <thead className="bg-stone-100 text-stone-700">
                              <tr>
                                <th className="p-1.5 text-left">Record Type</th>
                                <th className="p-1.5 text-left">Host / Name</th>
                                <th className="p-1.5 text-left">Value / Destination</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-stone-200">
                              <tr>
                                <td className="p-1.5 font-bold text-indigo-700">CNAME</td>
                                <td className="p-1.5 font-bold">www</td>
                                <td className="p-1.5 text-stone-600 break-all">ais-pre-xchkmrdpwdeu4jrvkt4ico-740934486857.europe-west2.run.app</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Option 3: 100% Free Lifetime Hosting via GitHub/Vercel */}
                      <div className="bg-white p-3 rounded-lg border border-cyan-200 space-y-1">
                        <div className="font-bold text-stone-900 flex items-center gap-1.5 text-[11px]">
                          <span className="w-4 h-4 rounded-full bg-cyan-600 text-white flex items-center justify-center text-[10px]">3</span>
                          <span>Method 3: Export to GitHub &amp; Free Custom Domain via Vercel / Cloudflare</span>
                        </div>
                        <p className="text-[11px] text-stone-600 leading-relaxed">
                          In AI Studio top-right settings, click <strong>Export to GitHub</strong> or <strong>Download ZIP</strong>. Link it to Vercel or Cloudflare Pages (100% free hosting forever). Add your domain in Vercel/Cloudflare with free automatic SSL certificates!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-200">
                  <h4 className="font-bold text-stone-900 mb-1">Payment Gateways ($0/month)</h4>
                  <p className="text-stone-500 text-[11px] mb-3">
                    Enter your free PayPal handle to receive direct payouts.
                  </p>

                  <div className="space-y-3">

                    <div>
                      <label className="block font-medium text-stone-700 mb-1">PayPal Account or PayPal.Me</label>
                      <input
                        type="text"
                        value={tempSettings.paypalUsernameOrEmail}
                        onChange={(e) => setTempSettings({ ...tempSettings, paypalUsernameOrEmail: e.target.value })}
                        placeholder="paypal.me/juuls3dexpress or email"
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 font-mono text-[11px]"
                      />
                    </div>
                  </div>
                </div>

                {/* Password & Location Access Gate Section */}
                <div className="pt-4 border-t border-stone-200">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-stone-900 text-cyan-400 flex items-center justify-center">
                        <Lock className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                          <span>Access Gate: Password or Local Space Only</span>
                          {tempSettings.accessGate?.enabled && (
                            <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                              Active
                            </span>
                          )}
                        </h4>
                        <p className="text-stone-500 text-[11px]">
                          Only grant website access to visitors with a password or who live in a certain area.
                        </p>
                      </div>
                    </div>

                    {/* Master Switch */}
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        id="toggle-gate-enabled"
                        checked={tempSettings.accessGate?.enabled ?? true}
                        onChange={(e) => {
                          const prevGate = tempSettings.accessGate || {
                            enabled: true,
                            storePassword: 'juuls3dexpress',
                            allowLocationAccess: true,
                            locationType: 'radius',
                            workshopCity: 'Local Delivery & Pickup Zone',
                            workshopLat: 52.0,
                            workshopLng: 5.0,
                            radiusKm: 50,
                            allowedPostalCodes: ['1000', '2000', '90210'],
                            allowedCity: 'Local City',
                            allowedCountry: 'NL',
                            headline: 'Juuls 3D Express — Member & Local Access',
                            subheadline: 'Access is restricted to authorized customers with a store password, or residents within our local 3D print service area.',
                          };
                          setTempSettings({
                            ...tempSettings,
                            accessGate: {
                              ...prevGate,
                              enabled: e.target.checked,
                            },
                          });
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                    </label>
                  </div>

                  {(tempSettings.accessGate?.enabled ?? true) && (
                    <div className="mt-4 p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-4 text-xs">
                      {/* Password Config */}
                      <div className="p-3 bg-white rounded-lg border border-stone-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="font-bold text-stone-800 flex items-center gap-1.5">
                            <KeyRound className="w-3.5 h-3.5 text-cyan-600" />
                            <span>1. Store Access Password</span>
                          </label>
                          <span className="text-[10px] text-stone-400">Share this with authorized buyers</span>
                        </div>

                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <input
                              type={showGatePassword ? 'text' : 'password'}
                              id="setting-gate-password"
                              value={tempSettings.accessGate?.storePassword || ''}
                              onChange={(e) => {
                                const g = tempSettings.accessGate || {
                                  enabled: true,
                                  storePassword: '',
                                  allowLocationAccess: true,
                                  locationType: 'radius',
                                  workshopCity: '',
                                  workshopLat: 52.0,
                                  workshopLng: 5.0,
                                  radiusKm: 50,
                                  allowedPostalCodes: [],
                                  allowedCity: '',
                                  allowedCountry: 'NL',
                                  headline: '',
                                  subheadline: '',
                                };
                                setTempSettings({
                                  ...tempSettings,
                                  accessGate: { ...g, storePassword: e.target.value },
                                });
                              }}
                              placeholder="e.g. juuls3dexpress"
                              className="w-full pl-3 pr-10 py-2 bg-stone-50 border border-stone-300 rounded-lg font-mono text-xs font-bold text-stone-900 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                            />
                            <button
                              type="button"
                              onClick={() => setShowGatePassword(!showGatePassword)}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs"
                            >
                              {showGatePassword ? 'Hide' : 'Show'}
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              const randomPass = 'juuls-' + Math.floor(1000 + Math.random() * 9000);
                              const g = tempSettings.accessGate || {
                                enabled: true,
                                storePassword: '',
                                allowLocationAccess: true,
                                locationType: 'radius',
                                workshopCity: '',
                                workshopLat: 52.0,
                                workshopLng: 5.0,
                                radiusKm: 50,
                                allowedPostalCodes: [],
                                allowedCity: '',
                                allowedCountry: 'NL',
                                headline: '',
                                subheadline: '',
                              };
                              setTempSettings({
                                ...tempSettings,
                                accessGate: { ...g, storePassword: randomPass },
                              });
                            }}
                            className="px-3 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold rounded-lg transition-colors shrink-0"
                          >
                            Generate Code
                          </button>
                        </div>
                      </div>

                      {/* Location / Space Verification Config */}
                      <div className="p-3 bg-white rounded-lg border border-stone-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="font-bold text-stone-800 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-rose-500" />
                            <span>2. Local Space &amp; Geographic Access</span>
                          </label>
                          <label className="flex items-center gap-1.5 text-[11px] text-stone-600 font-medium cursor-pointer">
                            <input
                              type="checkbox"
                              checked={tempSettings.accessGate?.allowLocationAccess ?? true}
                              onChange={(e) => {
                                const g = tempSettings.accessGate || {
                                  enabled: true,
                                  storePassword: 'juuls3dexpress',
                                  allowLocationAccess: true,
                                  locationType: 'radius',
                                  workshopCity: 'Local Delivery & Pickup Zone',
                                  workshopLat: 52.0,
                                  workshopLng: 5.0,
                                  radiusKm: 50,
                                  allowedPostalCodes: ['1000', '2000', '90210'],
                                  allowedCity: 'Local City',
                                  allowedCountry: 'NL',
                                  headline: 'Juuls 3D Express Access',
                                  subheadline: '',
                                };
                                setTempSettings({
                                  ...tempSettings,
                                  accessGate: { ...g, allowLocationAccess: e.target.checked },
                                });
                              }}
                              className="rounded text-cyan-600 focus:ring-cyan-500"
                            />
                            <span>Allow local space visitors</span>
                          </label>
                        </div>

                        {tempSettings.accessGate?.allowLocationAccess !== false && (
                          <div className="space-y-3 pt-1 border-t border-stone-100">
                            {/* Radius & Workshop Coordinates */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block font-medium text-stone-700 mb-1">
                                  Allowed Delivery / Service Radius (km)
                                </label>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="number"
                                    min="1"
                                    max="500"
                                    value={radiusInput !== null ? radiusInput : (tempSettings.accessGate?.radiusKm ?? 50)}
                                    onChange={(e) => {
                                      setRadiusInput(e.target.value);
                                      const num = parseInt(e.target.value, 10);
                                      const g = tempSettings.accessGate!;
                                      setTempSettings({
                                        ...tempSettings,
                                        accessGate: { ...g, radiusKm: isNaN(num) ? 0 : num },
                                      });
                                    }}
                                    onBlur={() => setRadiusInput(null)}
                                    className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg font-bold text-stone-900"
                                  />
                                  <span className="text-stone-500 font-bold shrink-0">km</span>
                                </div>
                                <span className="text-[10px] text-stone-400">Visitors within this distance can enter.</span>
                              </div>

                              <div>
                                <label className="block font-medium text-stone-700 mb-1">
                                  Workshop City / Area Name
                                </label>
                                <input
                                  type="text"
                                  value={tempSettings.accessGate?.workshopCity || ''}
                                  onChange={(e) => {
                                    const g = tempSettings.accessGate!;
                                    setTempSettings({
                                      ...tempSettings,
                                      accessGate: { ...g, workshopCity: e.target.value },
                                    });
                                  }}
                                  placeholder="e.g. Metro Area or Local Region"
                                  className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
                                />
                                <span className="text-[10px] text-stone-400">Shown to visitors on the lock screen.</span>
                              </div>
                            </div>

                            {/* Center Coordinates */}
                            <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200">
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="font-semibold text-stone-700 text-[11px]">
                                  Workshop Center Coordinates (for GPS distance)
                                </span>
                                <button
                                  type="button"
                                  disabled={detectingGpsWorkshop}
                                  onClick={() => {
                                    if (!navigator.geolocation) {
                                      alert('Geolocation is not supported by your browser.');
                                      return;
                                    }
                                    setDetectingGpsWorkshop(true);
                                    navigator.geolocation.getCurrentPosition(
                                      (pos) => {
                                        setDetectingGpsWorkshop(false);
                                        const g = tempSettings.accessGate!;
                                        setTempSettings({
                                          ...tempSettings,
                                          accessGate: {
                                            ...g,
                                            workshopLat: Math.round(pos.coords.latitude * 10000) / 10000,
                                            workshopLng: Math.round(pos.coords.longitude * 10000) / 10000,
                                          },
                                        });
                                      },
                                      (err) => {
                                        setDetectingGpsWorkshop(false);
                                        alert('Unable to retrieve location: ' + err.message);
                                      }
                                    );
                                  }}
                                  className="text-[10px] font-bold text-cyan-800 hover:text-stone-950 flex items-center gap-1 underline cursor-pointer"
                                >
                                  <Navigation className="w-3 h-3" />
                                  <span>{detectingGpsWorkshop ? 'Detecting...' : 'Set to My Current Location'}</span>
                                </button>
                              </div>

                              <div className="grid grid-cols-2 gap-2 text-[11px]">
                                <div>
                                  <span className="text-stone-400">Lat:</span>{' '}
                                  <input
                                    type="number"
                                    step="0.0001"
                                    value={tempSettings.accessGate?.workshopLat ?? 52.0}
                                    onChange={(e) => {
                                      const g = tempSettings.accessGate!;
                                      setTempSettings({
                                        ...tempSettings,
                                        accessGate: { ...g, workshopLat: parseFloat(e.target.value) || 0 },
                                      });
                                    }}
                                    className="w-full px-2 py-1 bg-white border border-stone-300 rounded font-mono text-xs"
                                  />
                                </div>
                                <div>
                                  <span className="text-stone-400">Lng:</span>{' '}
                                  <input
                                    type="number"
                                    step="0.0001"
                                    value={tempSettings.accessGate?.workshopLng ?? 5.0}
                                    onChange={(e) => {
                                      const g = tempSettings.accessGate!;
                                      setTempSettings({
                                        ...tempSettings,
                                        accessGate: { ...g, workshopLng: parseFloat(e.target.value) || 0 },
                                      });
                                    }}
                                    className="w-full px-2 py-1 bg-white border border-stone-300 rounded font-mono text-xs"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Allowed Postal / Zip Codes & Allowed City */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block font-medium text-stone-700 mb-1">
                                  Allowed Postal / Zip Codes (comma-separated)
                                </label>
                                <input
                                  type="text"
                                  value={postalInput !== null ? postalInput : (tempSettings.accessGate?.allowedPostalCodes || []).join(', ')}
                                  onChange={(e) => {
                                    setPostalInput(e.target.value);
                                    const list = e.target.value
                                      .split(',')
                                      .map((s) => s.trim())
                                      .filter(Boolean);
                                    const g = tempSettings.accessGate!;
                                    setTempSettings({
                                      ...tempSettings,
                                      accessGate: { ...g, allowedPostalCodes: list },
                                    });
                                  }}
                                  onBlur={() => setPostalInput(null)}
                                  placeholder="1000, 2000, 90210"
                                  className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 font-mono text-[11px]"
                                />
                                <span className="text-[10px] text-stone-400">Visitors can type their postal code to unlock.</span>
                              </div>

                              <div>
                                <label className="block font-medium text-stone-700 mb-1">
                                  Allowed City Name
                                </label>
                                <input
                                  type="text"
                                  value={tempSettings.accessGate?.allowedCity || ''}
                                  onChange={(e) => {
                                    const g = tempSettings.accessGate!;
                                    setTempSettings({
                                      ...tempSettings,
                                      accessGate: { ...g, allowedCity: e.target.value },
                                    });
                                  }}
                                  placeholder="e.g. Your City Name"
                                  className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
                                />
                                <span className="text-[10px] text-stone-400">Visitors entering this city gain access.</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Lock Screen Custom Copy */}
                      <div className="p-3 bg-white rounded-lg border border-stone-200 space-y-2">
                        <label className="font-bold text-stone-800 block">
                          3. Lock Screen Headline &amp; Message
                        </label>
                        <div>
                          <input
                            type="text"
                            value={tempSettings.accessGate?.headline || ''}
                            onChange={(e) => {
                              const g = tempSettings.accessGate!;
                              setTempSettings({
                                ...tempSettings,
                                accessGate: { ...g, headline: e.target.value },
                              });
                            }}
                            placeholder="Juuls 3D Express — Member & Local Access"
                            className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg font-bold text-stone-900"
                          />
                        </div>
                        <div>
                          <textarea
                            rows={2}
                            value={tempSettings.accessGate?.subheadline || ''}
                            onChange={(e) => {
                              const g = tempSettings.accessGate!;
                              setTempSettings({
                                ...tempSettings,
                                accessGate: { ...g, subheadline: e.target.value },
                              });
                            }}
                            placeholder="Access is restricted to authorized customers with a password or local area residents..."
                            className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-700 resize-none"
                          />
                        </div>
                      </div>

                      {/* Test Lock Screen Action */}
                      <div className="pt-2 flex items-center justify-between">
                        <span className="text-[11px] text-stone-500">
                          Want to see what customers will see?
                        </span>
                        <button
                          type="button"
                          id="btn-test-lock-screen"
                          onClick={() => {
                            if (onRelockStore) {
                              onRelockStore();
                            }
                            onSwitchToStore();
                          }}
                          className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-cyan-400 font-bold rounded-lg transition-colors flex items-center gap-1.5"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>Test Lock Screen Now</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Owner Admin Access Security PIN */}
                <div className="p-4 bg-stone-900/40 border border-stone-800 rounded-xl space-y-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <h4 className="font-bold text-stone-200 text-xs sm:text-sm">Workshop Admin Protection PIN</h4>
                      <p className="text-[11px] text-stone-400">
                        Prevents unauthorized customers from entering your admin dashboard and viewing orders or modifying products.
                      </p>
                    </div>
                  </div>

                  <div className="max-w-xs">
                    <label className="block text-xs font-medium text-stone-300 mb-1">
                      Admin Access PIN (4-8 characters)
                    </label>
                    <input
                      type="text"
                      id="admin-security-pin"
                      value={tempSettings.adminPin ?? '1234'}
                      onChange={(e) => setTempSettings({ ...tempSettings, adminPin: e.target.value })}
                      placeholder="e.g. 1234"
                      className="w-full px-3 py-1.5 bg-stone-950 border border-stone-700 rounded-lg text-amber-300 font-mono text-sm tracking-widest"
                    />
                    <span className="text-[10px] text-stone-400 mt-1 block">
                      Default PIN is <span className="font-mono text-stone-300">1234</span>. Change it to any private secret code.
                    </span>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  {settingsSavedMessage && (
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <Check className="w-4 h-4" /> Settings updated successfully!
                    </span>
                  )}
                  <div className="ml-auto">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-stone-950 hover:bg-stone-800 text-white font-bold rounded-xl shadow-xs transition-colors"
                    >
                      Save Settings
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>

      {/* ADD / EDIT 3D PRINT PRODUCT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl border border-stone-200 flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-950 text-white">
              <div className="flex items-center gap-2">
                <Box className="w-4 h-4 text-cyan-400" />
                <h3 className="text-base sm:text-lg font-bold">
                  {editingProduct ? 'Edit 3D Print Model' : 'Add New 3D Print to Juuls Express'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitProduct} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block font-bold text-stone-700 mb-1">Print Title / Name *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Articulated Dragon, Cyber Skull Stand..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500 font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Price ({settings.currencySymbol}) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="25.00"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500 font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Stock in Queue *</label>
                  <input
                    type="number"
                    value={inventory}
                    onChange={(e) => setInventory(e.target.value)}
                    placeholder="10"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500 font-medium"
                  >
                    <option value="Articulated & Fidgets">Articulated &amp; Fidgets</option>
                    <option value="Gaming & Setup">Gaming &amp; Setup</option>
                    <option value="Home & Desk Decor">Home &amp; Desk Decor</option>
                    <option value="Mechanical & Gadgets">Mechanical &amp; Gadgets</option>
                    <option value="Miniatures & Resin">Miniatures &amp; Resin</option>
                  </select>
                </div>
              </div>

              {/* 3D Printing Technical Specs */}
              <div className="p-3.5 bg-cyan-50/70 rounded-xl border border-cyan-100 space-y-3">
                <div className="font-bold text-stone-900 flex items-center gap-1.5 text-xs">
                  <Layers className="w-3.5 h-3.5 text-cyan-700" />
                  <span>3D Printing Specifications &amp; Filaments</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-medium text-stone-700 mb-1">Base Material</label>
                    <input
                      type="text"
                      value={material}
                      onChange={(e) => setMaterial(e.target.value)}
                      placeholder="Silk PLA, Tough PETG, 8K Resin"
                      className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-stone-700 mb-1">Approx Print Time (Hrs)</label>
                    <input
                      type="number"
                      value={printTimeHours}
                      onChange={(e) => setPrintTimeHours(e.target.value)}
                      placeholder="8"
                      className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-stone-700 mb-1">Dimensions / Scale</label>
                    <input
                      type="text"
                      value={dimensions}
                      onChange={(e) => setDimensions(e.target.value)}
                      placeholder="e.g. 15 × 12 × 9 cm"
                      className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>
                </div>

                {/* Pick Filaments from Spools Inventory */}
                <div className="pt-2 border-t border-cyan-200/60">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block font-bold text-stone-800 flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-cyan-700" />
                      <span>Attach Filaments from Your Spool Inventory:</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleSelectAllInStockFilaments}
                      className="text-[11px] font-bold text-cyan-700 hover:text-cyan-900 underline"
                    >
                      Select All In-Stock
                    </button>
                  </div>

                  {filaments.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1 bg-white rounded-lg border border-cyan-200">
                      {filaments.map((f) => {
                        const isSelected = selectedFilamentNames.includes(f.name);
                        return (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => handleToggleProductFilament(f.name)}
                            className={`px-2 py-1 rounded-md text-[11px] font-medium border flex items-center gap-1.5 transition-all ${
                              isSelected
                                ? 'bg-stone-900 border-stone-900 text-white font-bold shadow-xs'
                                : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                            } ${!f.inStock ? 'opacity-60' : ''}`}
                          >
                            <span 
                              className="w-2.5 h-2.5 rounded-full border border-white flex-shrink-0"
                              style={{ backgroundColor: f.colorHex }}
                            />
                            <span>{f.name}</span>
                            {!f.inStock && <span className="text-[9px] text-rose-500 font-bold">(Out)</span>}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-[11px] text-stone-500">
                      No filaments recorded yet in your workshop. You can add custom colors below.
                    </p>
                  )}

                  {/* Add Custom / One-Off Color */}
                  <div className="mt-2 flex gap-2">
                    <input
                      type="text"
                      value={customColorInput}
                      onChange={(e) => setCustomColorInput(e.target.value)}
                      placeholder="Or type custom color variant..."
                      className="flex-1 px-2.5 py-1 text-xs bg-white border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomColor}
                      className="px-2.5 py-1 bg-stone-900 hover:bg-stone-800 text-white rounded-md text-xs font-semibold"
                    >
                      Add Color
                    </button>
                  </div>

                  {/* Selected summary */}
                  <div className="mt-2 text-[11px] text-stone-600">
                    Active on this model: <strong>{selectedFilamentNames.join(', ') || 'Default'}</strong>
                  </div>

                  {/* Multi-color selection & options capability toggles */}
                  <div className="mt-3 pt-3 border-t border-cyan-200/60 space-y-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={supportsMultiColor}
                        onChange={(e) => setSupportsMultiColor(e.target.checked)}
                        className="rounded border-stone-300 text-cyan-600 focus:ring-cyan-500 w-4 h-4"
                      />
                      <span className="text-xs font-bold text-stone-800">
                        Allow customers to select dual / secondary filament colors for this model
                      </span>
                    </label>

                    <div>
                      <label className="block text-xs font-bold text-stone-800 mb-1">
                        Model Options / Sizes (comma separated, e.g. Standard (100%), Large Pro (125%), Collector Scale (150%))
                      </label>
                      <input
                        type="text"
                        value={optionsText}
                        onChange={(e) => setOptionsText(e.target.value)}
                        placeholder="Standard (100%), Large Pro (125%)"
                        className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Item Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Infill details, finishing, moving joints, and usage notes..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              {/* Preset 3D Model Images Picker */}
              <div>
                <label className="block font-bold text-stone-700 mb-1 flex items-center justify-between">
                  <span>Photo URL or 1-Click Preset Selection</span>
                  <span className="text-cyan-700 font-semibold">Click a preset below</span>
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono text-[11px]"
                />

                <div className="flex flex-wrap gap-1.5 mt-2">
                  {PRESET_IMAGE_SUGGESTIONS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setImageUrl(preset.url)}
                      className={`px-2 py-1 text-[10px] rounded-md border font-semibold transition-all ${
                        imageUrl === preset.url
                          ? 'bg-stone-950 text-cyan-300 border-stone-950'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border-stone-200'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Free PayPal payment link */}
              <div className="pt-2 border-t border-stone-200">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Highlight Badge (Optional)</label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="Bestseller, High Detail, New"
                    className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-stone-600 hover:text-stone-900 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-stone-950 hover:bg-stone-800 text-white font-bold rounded-xl shadow-xs transition-colors"
                >
                  {editingProduct ? 'Save Changes' : 'Add 3D Print to Store'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD / EDIT FILAMENT SPOOL MODAL */}
      {isFilamentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border border-stone-200 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-950 text-white">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-cyan-400" />
                <h3 className="text-base sm:text-lg font-bold">
                  {editingFilament ? 'Edit Filament Spool' : 'Add Filament Spool to Workshop'}
                </h3>
              </div>
              <button
                onClick={() => setIsFilamentModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitFilament} className="p-5 sm:p-6 space-y-4 text-xs">
              {filError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{filError}</span>
                </div>
              )}

              <div>
                <label className="block font-bold text-stone-700 mb-1">Filament Color Name *</label>
                <input
                  type="text"
                  value={filName}
                  onChange={(e) => setFilName(e.target.value)}
                  placeholder="e.g. Silk Dual-Color Rose Gold, Matte Army Green"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500 font-semibold text-stone-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Material Type</label>
                  <select
                    value={filMaterial}
                    onChange={(e) => setFilMaterial(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500 font-medium cursor-pointer"
                  >
                    <option value="Silk PLA">Silk PLA (High Sheen)</option>
                    <option value="Dual-Silk PLA">Dual-Silk Co-Extruded</option>
                    <option value="PLA+">PLA+ (Tough / Standard)</option>
                    <option value="Matte PLA">Matte Architectural PLA</option>
                    <option value="High-Strength PETG">Heavy-Duty PETG</option>
                    <option value="UV Photopolymer Resin">8K UV Resin</option>
                    <option value="TPU Flexible">TPU Flexible Rubber</option>
                    <option value="Carbon Fiber PLA">Carbon Fiber Composite</option>
                    <option value="Glow-in-the-Dark PLA">Phosphorescent Glow</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Brand / Manufacturer</label>
                  <input
                    type="text"
                    value={filBrand}
                    onChange={(e) => setFilBrand(e.target.value)}
                    placeholder="Bambu Lab, eSUN, Polymaker..."
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
              </div>

              {/* Color Picker & Presets */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <label className="block font-bold text-stone-800 flex items-center justify-between">
                  <span>Color Swatch Preview:</span>
                  <span className="font-mono text-xs font-semibold">{filColorHex}</span>
                </label>

                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={filColorHex}
                    onChange={(e) => setFilColorHex(e.target.value)}
                    className="w-10 h-10 rounded-lg border border-stone-300 cursor-pointer p-0.5 bg-white"
                  />
                  <div 
                    className="flex-1 h-10 rounded-lg border border-stone-300 flex items-center justify-center font-bold text-xs text-white shadow-inner"
                    style={{ backgroundColor: filColorHex, textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}
                  >
                    {filName || 'Filament Swatch'}
                  </div>
                </div>

                {/* Preset quick colors */}
                <div>
                  <span className="text-[10px] text-stone-400 block mb-1">Quick Color Palette:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {COMMON_COLOR_PRESETS.map((preset) => (
                      <button
                        key={preset.hex}
                        type="button"
                        onClick={() => setFilColorHex(preset.hex)}
                        className="w-5 h-5 rounded-full border border-stone-300 hover:scale-110 transition-transform shadow-2xs"
                        style={{ backgroundColor: preset.hex }}
                        title={preset.name}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* In-Stock Status Checkbox */}
              <div className="flex items-center gap-2 p-3 bg-stone-50 rounded-xl border border-stone-200">
                <input
                  type="checkbox"
                  id="filInStockCheck"
                  checked={filInStock}
                  onChange={(e) => setFilInStock(e.target.checked)}
                  className="w-4 h-4 text-cyan-600 rounded focus:ring-cyan-500"
                />
                <label htmlFor="filInStockCheck" className="font-bold text-stone-800 cursor-pointer select-none">
                  Currently In Stock in Workshop (Buyers can order this color)
                </label>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Spool Notes (Optional)</label>
                <input
                  type="text"
                  value={filNotes}
                  onChange={(e) => setFilNotes(e.target.value)}
                  placeholder="e.g. 1kg sealed spool, 0.4mm nozzle recommended"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFilamentModalOpen(false)}
                  className="px-4 py-2 text-stone-600 hover:text-stone-900 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-stone-950 hover:bg-stone-800 text-white font-bold rounded-xl shadow-xs transition-colors"
                >
                  {editingFilament ? 'Save Changes' : 'Add Spool'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
