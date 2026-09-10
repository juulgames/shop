import React, { useState } from 'react';
import { 
  X, 
  ShoppingBag, 
  Star, 
  Truck, 
  Check, 
  Zap,
  Layers,
  Clock,
  Maximize2,
  Cpu,
  Palette,
  Plus
} from 'lucide-react';
import { Product, StoreSettings, Filament } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  filaments?: Filament[];
  settings: StoreSettings;
  onClose: () => void;
  onAddToCart: (
    product: Product, 
    quantity: number, 
    selectedColor?: string, 
    selectedSecondaryColor?: string, 
    selectedOptions?: Record<string, string>
  ) => void;
  onDirectCheckout: (
    product: Product, 
    quantity: number, 
    selectedColor?: string, 
    selectedSecondaryColor?: string, 
    selectedOptions?: Record<string, string>
  ) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  filaments = [],
  settings,
  onClose,
  onAddToCart,
  onDirectCheckout,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>(() => {
    return product?.colorOptions?.[0] || 'Default';
  });

  // Multi-filament 2-color support
  const [enableSecondColor, setEnableSecondColor] = useState(false);
  const [selectedSecondaryColor, setSelectedSecondaryColor] = useState<string>(() => {
    return product?.colorOptions?.[1] || product?.colorOptions?.[0] || 'Default';
  });

  // Product options (e.g. Size / Scale, Finish, Version)
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const defaults: Record<string, string> = {};
    if (product?.options && product.options.length > 0) {
      product.options.forEach(opt => {
        if (opt.values && opt.values[0]) {
          defaults[opt.name] = opt.values[0];
        }
      });
    } else {
      // Default standard options if none defined on model
      defaults['Model Version / Size'] = 'Standard (100%)';
    }
    return defaults;
  });

  const [addedAnimation, setAddedAnimation] = useState(false);

  // Sync selected colors & options when product changes
  React.useEffect(() => {
    if (product?.colorOptions?.[0]) {
      const inStockOption = product.colorOptions.find(c => {
        const fil = filaments.find(f => f.name.toLowerCase() === c.toLowerCase());
        return !fil || fil.inStock;
      });
      setSelectedColor(inStockOption || product.colorOptions[0]);
      if (product.colorOptions[1]) {
        setSelectedSecondaryColor(product.colorOptions[1]);
      }
    }

    if (product?.options && product.options.length > 0) {
      const defaults: Record<string, string> = {};
      product.options.forEach(opt => {
        if (opt.values && opt.values[0]) {
          defaults[opt.name] = opt.values[0];
        }
      });
      setSelectedOptions(defaults);
    } else {
      setSelectedOptions({ 'Model Version / Size': 'Standard (100%)' });
    }
  }, [product, filaments]);

  if (!product) return null;

  const isOutOfStock = product.inventory <= 0;

  const handleAdd = () => {
    onAddToCart(
      product, 
      quantity, 
      selectedColor, 
      enableSecondColor ? selectedSecondaryColor : undefined, 
      selectedOptions
    );
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1800);
  };

  const handleInstantCheckout = () => {
    onDirectCheckout(
      product, 
      quantity, 
      selectedColor, 
      enableSecondColor ? selectedSecondaryColor : undefined, 
      selectedOptions
    );
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        id="product-detail-modal"
        className="relative bg-white w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl border border-stone-200 flex flex-col md:flex-row max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="close-product-modal"
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-stone-900/70 hover:bg-stone-900 text-white flex items-center justify-center transition-colors shadow-sm"
          aria-label="Close 3D print details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image Column */}
        <div className="md:w-1/2 bg-stone-950 relative flex items-center justify-center p-6">
          <img
            src={product.imageUrl}
            alt={product.title}
            referrerPolicy="no-referrer"
            className="w-full h-64 md:h-full object-cover rounded-xl shadow-lg"
          />
          {product.badge && (
            <span className="absolute top-5 left-5 px-3 py-1 bg-cyan-500 text-stone-950 text-xs font-black uppercase tracking-wider rounded-md shadow-md">
              {product.badge}
            </span>
          )}
          <span className="absolute bottom-5 left-5 px-2.5 py-1 bg-stone-900/90 text-stone-300 text-[10px] font-mono rounded border border-stone-700">
            juuls3dexpress • Multi-Filament Ready
          </span>
        </div>

        {/* Product Info Column */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
              <span className="font-semibold uppercase tracking-wider text-cyan-700">{product.category}</span>
              <div className="flex items-center gap-1 text-amber-500 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{product.rating || 5.0}</span>
                <span className="text-stone-400">({product.reviewsCount || 12})</span>
              </div>
            </div>

            <h3 className="text-lg sm:text-xl font-black text-stone-950 leading-tight">
              {product.title}
            </h3>

            {/* Price & Stock Status */}
            <div className="mt-2 flex items-center gap-3">
              <span className="text-2xl font-black text-stone-900">
                {settings.currencySymbol}{product.price.toFixed(2)}
              </span>

              {isOutOfStock ? (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700">
                  Sold Out
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  Ready to print ({product.inventory} in stock)
                </span>
              )}
            </div>

            {/* 3D Print Specs Card */}
            <div className="mt-3 p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs grid grid-cols-2 gap-2">
              {product.material && (
                <div className="flex items-center gap-1.5 text-stone-700">
                  <Layers className="w-3.5 h-3.5 text-cyan-600 flex-shrink-0" />
                  <span className="truncate"><strong>Material:</strong> {product.material}</span>
                </div>
              )}
              {product.printTimeHours && (
                <div className="flex items-center gap-1.5 text-stone-700">
                  <Clock className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                  <span><strong>Print Time:</strong> ~{product.printTimeHours}h</span>
                </div>
              )}
              {product.dimensions && (
                <div className="flex items-center gap-1.5 text-stone-700 col-span-2">
                  <Maximize2 className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                  <span><strong>Dimensions:</strong> {product.dimensions}</span>
                </div>
              )}
            </div>

            {/* --- FEATURE 1: MULTI-FILAMENT COLOR SELECTION (Primary & Secondary) --- */}
            {product.colorOptions && product.colorOptions.length > 0 && (
              <div className="mt-4 space-y-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-cyan-600" />
                      Primary Filament Color:
                    </span>
                    <span className="text-cyan-800 font-black text-xs">{selectedColor}</span>
                  </label>
                  
                  <div className="flex flex-wrap gap-1.5">
                    {product.colorOptions.map((colorName) => {
                      const matchedFil = filaments.find(
                        f => f.name.toLowerCase() === colorName.toLowerCase()
                      );
                      const isFilOutOfStock = matchedFil ? !matchedFil.inStock : false;
                      const isSelected = selectedColor === colorName;

                      return (
                        <button
                          key={colorName}
                          type="button"
                          onClick={() => setSelectedColor(colorName)}
                          className={`px-2.5 py-1.5 text-xs rounded-lg border font-semibold flex items-center gap-2 transition-all ${
                            isSelected
                              ? 'bg-stone-900 border-stone-900 text-cyan-300 shadow-xs ring-2 ring-cyan-500/50'
                              : isFilOutOfStock
                              ? 'bg-stone-50 border-stone-200 text-stone-400 hover:border-stone-300'
                              : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-100'
                          }`}
                        >
                          {matchedFil && (
                            <span 
                              className="w-3 h-3 rounded-full border border-stone-400 flex-shrink-0 shadow-2xs"
                              style={{ backgroundColor: matchedFil.colorHex }}
                            />
                          )}
                          <span>{colorName}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Second Color Toggle (Only if product supports multi-color) */}
                {product.supportsMultiColor !== false && (
                  <div className="pt-2 border-t border-stone-100">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={enableSecondColor}
                        onChange={(e) => setEnableSecondColor(e.target.checked)}
                        className="rounded border-stone-300 text-cyan-600 focus:ring-cyan-500 w-4 h-4"
                      />
                      <span className="flex items-center gap-1">
                        <Plus className="w-3.5 h-3.5 text-amber-600" />
                        Add Secondary Filament Color (2-Color Print)
                      </span>
                    </label>
                    {enableSecondColor && (
                      <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                        Dual Color
                      </span>
                    )}
                  </div>

                  {enableSecondColor && (
                    <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200 space-y-2 animate-in fade-in duration-200">
                      <div className="text-[11px] font-bold text-stone-700 flex items-center justify-between">
                        <span>Secondary Color (Accents / Details):</span>
                        <span className="text-amber-800 font-black">{selectedSecondaryColor}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {product.colorOptions.map((colorName) => {
                          const matchedFil = filaments.find(
                            f => f.name.toLowerCase() === colorName.toLowerCase()
                          );
                          const isSelected = selectedSecondaryColor === colorName;

                          return (
                            <button
                              key={`sec-${colorName}`}
                              type="button"
                              onClick={() => setSelectedSecondaryColor(colorName)}
                              className={`px-2 py-1 text-[11px] rounded-lg border font-semibold flex items-center gap-1.5 transition-all ${
                                isSelected
                                  ? 'bg-amber-600 border-amber-600 text-white shadow-xs'
                                  : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-100'
                              }`}
                            >
                              {matchedFil && (
                                <span 
                                  className="w-2.5 h-2.5 rounded-full border border-stone-400 flex-shrink-0"
                                  style={{ backgroundColor: matchedFil.colorHex }}
                                />
                              )}
                              <span>{colorName}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
                )}
              </div>
            )}

            {/* --- FEATURE 2: PRODUCT OPTIONS (Size / Scale / Version) --- */}
            {product.options && product.options.length > 0 && (
              <div className="mt-4 pt-3 border-t border-stone-100 space-y-3">
                {product.options.map((optGroup) => (
                  <div key={optGroup.name}>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5 flex items-center justify-between">
                      <span>{optGroup.name}:</span>
                      <span className="text-stone-900 font-black text-xs">
                        {selectedOptions[optGroup.name] || optGroup.values[0]}
                      </span>
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {optGroup.values.map((val) => {
                        const isChosen = (selectedOptions[optGroup.name] || optGroup.values[0]) === val;
                        return (
                          <button
                            key={val}
                            type="button"
                            onClick={() => setSelectedOptions(prev => ({ ...prev, [optGroup.name]: val }))}
                            className={`px-3 py-1.5 text-xs rounded-lg border font-semibold transition-all ${
                              isChosen
                                ? 'bg-cyan-600 border-cyan-600 text-white shadow-xs'
                                : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-100'
                            }`}
                          >
                            {val}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Description */}
            <div className="mt-4 pt-3 border-t border-stone-100">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                Print Details
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Quantity Selector */}
            {!isOutOfStock && (
              <div className="mt-4 flex items-center gap-4">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-600">
                  Quantity:
                </span>
                <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-stone-600 hover:bg-stone-100 text-sm font-bold transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 text-sm font-semibold text-stone-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.inventory, quantity + 1))}
                    className="px-3 py-1 text-stone-600 hover:bg-stone-100 text-sm font-bold transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-3 border-t border-stone-200">

            <div className="flex items-center gap-2">
              <button
                id="modal-add-to-cart-button"
                onClick={handleAdd}
                disabled={isOutOfStock}
                className="flex-1 py-3 px-4 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-300">Added to Queue!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Queue</span>
                  </>
                )}
              </button>

              <button
                id="modal-instant-checkout-button"
                onClick={handleInstantCheckout}
                disabled={isOutOfStock}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-cyan-500 to-amber-500 hover:from-cyan-400 hover:to-amber-400 disabled:bg-stone-300 disabled:cursor-not-allowed text-stone-950 text-xs sm:text-sm font-black rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <Zap className="w-4 h-4 fill-stone-950" />
                <span>Instant Checkout</span>
              </button>
            </div>

            {/* Maker Guarantee */}
            <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-stone-500">
              <div className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-600" />
                <span>Zero defect layer check</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-amber-600" />
                <span>Padded shockproof box</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
