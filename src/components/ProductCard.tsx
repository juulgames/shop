import React from 'react';
import { ShoppingBag, Star, Zap, CheckCircle2, Layers, Clock } from 'lucide-react';
import { Product, StoreSettings, Filament } from '../types';

interface ProductCardProps {
  product: Product;
  filaments?: Filament[];
  settings: StoreSettings;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, e?: React.MouseEvent) => void;
  onQuickBuy: (product: Product, e?: React.MouseEvent) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  filaments = [],
  settings,
  onSelectProduct,
  onAddToCart,
  onQuickBuy,
}) => {
  const isOutOfStock = product.inventory <= 0;
  const isLowStock = product.inventory > 0 && product.inventory <= 3;

  return (
    <div 
      id={`product-card-${product.id}`}
      className="group relative bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
    >
      {/* 3D Print Image & Badges */}
      <div 
        className="relative aspect-square w-full overflow-hidden bg-stone-100 cursor-pointer"
        onClick={() => onSelectProduct(product)}
      >
        <img
          src={product.imageUrl}
          alt={product.title}
          referrerPolicy="no-referrer"
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badge Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 items-start">
          {product.badge && (
            <span className="px-2.5 py-0.5 bg-stone-950/90 text-cyan-300 text-[10px] font-black uppercase tracking-wider rounded-full shadow-sm backdrop-blur-xs border border-cyan-500/30">
              {product.badge}
            </span>
          )}
          {isOutOfStock ? (
            <span className="px-2 py-0.5 bg-rose-600 text-white text-[10px] font-bold uppercase tracking-wide rounded-full">
              Made to Order / Queue Full
            </span>
          ) : isLowStock ? (
            <span className="px-2 py-0.5 bg-amber-600 text-white text-[10px] font-bold uppercase tracking-wide rounded-full">
              Only {product.inventory} in print queue
            </span>
          ) : null}
        </div>

        {/* 3D Print Specs Pill (Material & Layer) */}
        {product.material && (
          <div className="absolute bottom-2.5 left-2.5">
            <span className="px-2 py-0.5 bg-stone-950/85 text-stone-200 text-[10px] font-semibold rounded-md shadow-xs flex items-center gap-1 backdrop-blur-xs border border-stone-700">
              <Layers className="w-2.5 h-2.5 text-cyan-400" />
              <span className="truncate max-w-[140px]">{product.material}</span>
            </span>
          </div>
        )}

        {/* Instant Checkout badge if direct link configured */}
        {product.paypalPaymentLink && (
          <div className="absolute top-2.5 right-2.5">
            <span className="px-2 py-0.5 bg-emerald-600/90 text-white text-[10px] font-semibold rounded-md shadow-xs flex items-center gap-1 backdrop-blur-xs">
              <CheckCircle2 className="w-2.5 h-2.5" />
              Instant Pay
            </span>
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[11px] font-bold text-cyan-700 uppercase tracking-wider">
              {product.category}
            </span>
            {product.rating && (
              <div className="flex items-center gap-1 text-xs text-stone-700">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-bold">{product.rating}</span>
                {product.reviewsCount && (
                  <span className="text-stone-400 text-[10px]">({product.reviewsCount})</span>
                )}
              </div>
            )}
          </div>

          <h3 
            onClick={() => onSelectProduct(product)}
            className="text-sm sm:text-base font-bold text-stone-900 hover:text-cyan-700 cursor-pointer line-clamp-1 transition-colors"
            title={product.title}
          >
            {product.title}
          </h3>

          <p className="mt-1 text-xs text-stone-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Color Variants with visual swatches & Print Time preview */}
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-stone-500">
            {product.colorOptions && product.colorOptions.length > 0 ? (
              <div className="flex items-center gap-1.5">
                <div className="flex -space-x-1 items-center">
                  {product.colorOptions.slice(0, 4).map((cName, idx) => {
                    const matchedFil = filaments.find(
                      f => f.name.toLowerCase() === cName.toLowerCase()
                    );
                    const hex = matchedFil?.colorHex || '#94a3b8';
                    return (
                      <span
                        key={idx}
                        className="w-3 h-3 rounded-full border border-white shadow-2xs inline-block"
                        style={{ backgroundColor: hex }}
                        title={cName}
                      />
                    );
                  })}
                </div>
                <span className="font-medium text-stone-600 text-[10px]">
                  {product.colorOptions.length} {product.colorOptions.length === 1 ? 'color' : 'colors'}
                </span>
              </div>
            ) : <span />}

            {product.printTimeHours && (
              <span className="flex items-center gap-1 text-stone-400">
                <Clock className="w-3 h-3" />
                <span>{product.printTimeHours}h print</span>
              </span>
            )}
          </div>
        </div>

        {/* Price and Actions */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          <div>
            <div className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Price</div>
            <div className="text-base sm:text-lg font-black text-stone-900 tracking-tight">
              {settings.currencySymbol}{product.price.toFixed(2)}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Quick Buy Button */}
            <button
              id={`quick-buy-${product.id}`}
              onClick={(e) => onQuickBuy(product, e)}
              disabled={isOutOfStock}
              className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 disabled:opacity-50 text-stone-800 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
              title="Buy print now"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Buy</span>
            </button>

            {/* Add to Cart */}
            <button
              id={`add-to-cart-${product.id}`}
              onClick={(e) => onAddToCart(product, e)}
              disabled={isOutOfStock}
              className="p-1.5 bg-stone-950 hover:bg-cyan-500 hover:text-stone-950 disabled:bg-stone-200 disabled:text-stone-400 text-white rounded-lg transition-colors"
              title="Add to queue"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
