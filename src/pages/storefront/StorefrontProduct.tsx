import React, { useState } from 'react';
import { useRouter } from '../../context/RouterContext';
import { useStore } from '../../context/StoreContext';
import {
  ArrowLeft,
  Star,
  ShoppingBag,
  MessageSquare,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  Plus,
  Minus,
  Layers,
  Share2,
  Heart,
  ChevronRight,
} from 'lucide-react';

interface StorefrontProductProps {
  onOpenCart: () => void;
}

export const StorefrontProduct: React.FC<StorefrontProductProps> = ({ onOpenCart }) => {
  const { navigate, params } = useRouter();
  const { products, categories, currentTenant, addToCart, b2bModeActive, addToast } = useStore();

  const product = products.find((p) => p.slug === params.productSlug);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'b2b' | 'shipping'>('desc');

  if (!product) {
    return (
      <div className="py-20 text-center max-w-md mx-auto">
        <h2 className="text-base font-bold text-neutral-900">Product Not Found</h2>
        <p className="text-xs text-neutral-500 mt-1">This product is currently unavailable in the storefront.</p>
        <button
          type="button"
          onClick={() => navigate(`/store/${currentTenant.slug}`)}
          className="mt-4 px-4 py-2 bg-neutral-900 text-white rounded-lg text-xs font-semibold"
        >
          Return to Storefront
        </button>
      </div>
    );
  }

  const category = categories.find((c) => c.id === product.category);
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const isWholesaleActive = b2bModeActive && product.wholesalePrice;
  const activePrice = isWholesaleActive ? product.wholesalePrice! : product.salePrice || product.price;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onOpenCart();
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    onOpenCart();
  };

  const handleWhatsAppOrder = () => {
    const text = encodeURIComponent(
      `Hello ${currentTenant.name}! I would like to order:\n\n*${product.name}*\nSKU: ${product.sku}\nQuantity: ${quantity} unit(s)\nPrice: ₹${activePrice * quantity}\n\nPlease confirm availability!`
    );
    window.open(`https://wa.me/${currentTenant.supportPhone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast('Product link copied to clipboard!', 'success');
    }
  };

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="space-y-10 pb-16">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-neutral-500">
        <button
          type="button"
          onClick={() => navigate(`/store/${currentTenant.slug}`)}
          className="hover:text-neutral-900"
        >
          Home
        </button>
        <ChevronRight className="w-3 h-3" />
        <span className="hover:text-neutral-900 cursor-pointer">{category?.name || 'Products'}</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-neutral-900 font-semibold truncate max-w-xs">{product.name}</span>
      </div>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Gallery (6 cols) */}
        <div className="md:col-span-6 space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200">
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {hasDiscount && (
              <span className="absolute top-3 left-3 bg-rose-600 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-sm">
                Save ₹{(product.price - (product.salePrice || product.price)).toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImageIndex(i)}
                  className={`w-16 h-16 rounded-xl border overflow-hidden shrink-0 transition-all ${
                    activeImageIndex === i ? 'ring-2 ring-neutral-900 border-neutral-900' : 'border-neutral-200 opacity-70'
                  }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Purchase Actions & Details (6 cols) */}
        <div className="md:col-span-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-neutral-500">
              <span className="font-semibold text-neutral-700 uppercase tracking-wider">{product.brand}</span>
              <button
                type="button"
                onClick={handleShare}
                className="flex items-center gap-1 text-neutral-600 hover:text-neutral-900"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1 text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{product.rating}</span>
              </div>
              <span className="text-neutral-400">({product.reviewsCount} customer reviews)</span>
              <span className="text-neutral-300">|</span>
              <span className="font-mono text-neutral-500 text-[11px]">SKU: {product.sku}</span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-bold text-neutral-900">
                ₹{activePrice.toLocaleString('en-IN')}
              </span>
              {hasDiscount && !isWholesaleActive && (
                <span className="text-sm text-neutral-400 line-through">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
              )}
              {isWholesaleActive && (
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-indigo-100 text-indigo-700">
                  B2B Trade Rate
                </span>
              )}
            </div>

            <p className="text-[11px] text-neutral-500">
              Inclusive of all taxes & GST. Free delivery on orders above ₹999.
            </p>

            {/* B2B Wholesale Tier Sheet if configured */}
            {product.wholesalePrice && (
              <div className="mt-3 pt-3 border-t border-neutral-200">
                <div className="flex items-center justify-between text-xs font-semibold text-neutral-800 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Wholesale Bulk Pricing</span>
                  </span>
                  <span className="text-[10px] text-indigo-600 font-bold">MOQ: {product.b2bMinQty || 10}+ Units</span>
                </div>
                <div className="text-xs text-neutral-600 flex justify-between bg-white p-2.5 rounded-lg border border-neutral-200">
                  <span>Order {product.b2bMinQty || 10} or more:</span>
                  <span className="font-bold text-indigo-700">
                    ₹{product.wholesalePrice.toLocaleString('en-IN')} / unit
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Stock availability */}
          <div className="flex items-center gap-2 text-xs">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="font-semibold text-emerald-800">
              In Stock ({product.stock} units available)
            </span>
            <span className="text-neutral-400">· Ready to dispatch in 24 hours</span>
          </div>

          {/* Quantity Selector & Action Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-neutral-300 rounded-xl bg-white p-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-neutral-100 text-neutral-700"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center font-bold text-xs text-neutral-900">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-neutral-100 text-neutral-700"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Bag */}
              <button
                id="product-add-to-bag-btn"
                type="button"
                onClick={handleAddToCart}
                className="flex-1 py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Shopping Bag</span>
              </button>
            </div>

            {/* Direct WhatsApp Ordering */}
            <button
              id="product-order-whatsapp-btn"
              type="button"
              onClick={handleWhatsAppOrder}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Order via WhatsApp (Quick Chat)</span>
            </button>
          </div>

          {/* Quick value badges */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-neutral-200 text-[11px] text-neutral-600">
            <div className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-neutral-400" />
              <span>Free Delivery &gt;₹999</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
              <span>1 Year Warranty</span>
            </div>
            <div className="flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5 text-neutral-400" />
              <span>7-Day Replacement</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Specifications & Policies */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-4">
        <div className="flex border-b border-neutral-200 gap-6 text-xs font-semibold">
          {[
            { id: 'desc', label: 'Detailed Description' },
            { id: 'specs', label: 'Technical Specifications' },
            { id: 'b2b', label: 'B2B Wholesale & GST' },
            { id: 'shipping', label: 'Shipping & Returns' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-neutral-900 text-neutral-900 font-bold'
                  : 'border-transparent text-neutral-500 hover:text-neutral-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="text-xs text-neutral-700 leading-relaxed pt-2">
          {activeTab === 'desc' && (
            <div className="space-y-3">
              <p>{product.description}</p>
              <p className="font-semibold text-neutral-900">Key Features & Highlights:</p>
              <ul className="list-disc pl-5 space-y-1 text-neutral-600">
                <li>Engineered with industrial grade components for longevity.</li>
                <li>Comprehensive compatibility with all major smartphone operating systems.</li>
                <li>Direct factory warranty support with quick replacement.</li>
              </ul>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
              <div className="p-2.5 bg-neutral-50 rounded-lg flex justify-between">
                <span className="text-neutral-500">Brand:</span>
                <span className="font-bold text-neutral-900">{product.brand}</span>
              </div>
              <div className="p-2.5 bg-neutral-50 rounded-lg flex justify-between">
                <span className="text-neutral-500">Model SKU:</span>
                <span className="font-mono font-bold text-neutral-900">{product.sku}</span>
              </div>
              <div className="p-2.5 bg-neutral-50 rounded-lg flex justify-between">
                <span className="text-neutral-500">Weight:</span>
                <span className="font-bold text-neutral-900">{product.weightKg || 0.3} kg</span>
              </div>
              <div className="p-2.5 bg-neutral-50 rounded-lg flex justify-between">
                <span className="text-neutral-500">Country of Origin:</span>
                <span className="font-bold text-neutral-900">India</span>
              </div>
            </div>
          )}

          {activeTab === 'b2b' && (
            <div className="space-y-3">
              <p>
                We provide registered tax invoices with Input Tax Credit (ITC) eligibility for all B2B trade buyers.
                Enter your company GSTIN during checkout or contact our trade desk via WhatsApp for credit terms.
              </p>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-2">
              <p>
                Standard orders are dispatched within 24 hours from our Mumbai & Bengaluru fulfillment centers.
                Delivery timeline: 2-4 business days for metro cities, 4-6 business days for rest of India.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
