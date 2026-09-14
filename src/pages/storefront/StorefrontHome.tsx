import React, { useState, useMemo } from 'react';
import { useRouter } from '../../context/RouterContext';
import { useStore } from '../../context/StoreContext';
import {
  ShoppingBag,
  Sparkles,
  ArrowRight,
  Filter,
  Search,
  CheckCircle2,
  ShieldCheck,
  Truck,
  MessageSquare,
  BookOpen,
  Layers,
  Star,
  ExternalLink,
} from 'lucide-react';
import { Product } from '../../types';

interface StorefrontHomeProps {
  onOpenCart: () => void;
}

export const StorefrontHome: React.FC<StorefrontHomeProps> = ({ onOpenCart }) => {
  const { navigate } = useRouter();
  const {
    currentTenant,
    products,
    categories,
    catalogues,
    addToCart,
    b2bModeActive,
    addToast,
  } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price_low' | 'price_high'>('featured');

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (p.status !== 'active') return false;
        const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
        const matchesStock = !inStockOnly || p.stock > 0;
        return matchesCat && matchesStock;
      })
      .sort((a, b) => {
        const priceA = a.salePrice || a.price;
        const priceB = b.salePrice || b.price;
        if (sortBy === 'price_low') return priceA - priceB;
        if (sortBy === 'price_high') return priceB - priceA;
        return (b.reviewsCount || 0) - (a.reviewsCount || 0);
      });
  }, [products, selectedCategory, inStockOnly, sortBy]);

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    onOpenCart();
  };

  const handleWhatsAppInquire = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const text = encodeURIComponent(
      `Hi ${currentTenant.name}! I'm interested in buying: *${product.name}* (SKU: ${product.sku}) listed at ₹${product.salePrice || product.price}. Please share availability and payment details.`
    );
    window.open(`https://wa.me/${currentTenant.supportPhone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden rounded-2xl bg-neutral-900 text-white min-h-[360px] flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
          style={{ backgroundImage: `url(${currentTenant.theme.bannerUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent" />

        <div className="relative max-w-2xl p-6 sm:p-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md border border-white/20 text-white">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Festive Mega Deals & B2B Wholesale Prices</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Premium Electronics & Home Essentials
          </h1>

          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-lg">
            Direct manufacturer wholesale pricing, instant UPI checkout, verified GST invoices, and express Pan-India shipping.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="#products-section"
              className="px-5 py-2.5 rounded-xl font-bold text-xs text-neutral-950 bg-white hover:bg-neutral-100 transition-colors shadow-lg flex items-center gap-2"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>

            <button
              type="button"
              onClick={() => {
                if (catalogues[0]) navigate(`/store/${currentTenant.slug}/catalogue/${catalogues[0].slug}`);
              }}
              className="px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-colors flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Browse Digital Catalogue</span>
            </button>
          </div>
        </div>
      </section>

      {/* Featured Digital Catalogues Showcase */}
      {catalogues.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-neutral-900 tracking-tight flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <span>Featured Digital Catalogues</span>
              </h2>
              <p className="text-xs text-neutral-500">
                Curated collections optimized for quick WhatsApp browsing and volume ordering
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {catalogues.slice(0, 2).map((cat) => (
              <div
                key={cat.id}
                onClick={() => navigate(`/store/${currentTenant.slug}/catalogue/${cat.slug}`)}
                className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row items-center gap-4"
              >
                <img
                  src={cat.coverImage}
                  alt={cat.name}
                  className="w-full sm:w-36 h-36 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                />
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                      {cat.pricingMode.toUpperCase()}
                    </span>
                    <span className="text-[11px] text-neutral-400">{cat.productIds.length} Products</span>
                  </div>
                  <h3 className="text-sm font-bold text-neutral-900 group-hover:text-indigo-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-neutral-500 line-clamp-2">{cat.description}</p>
                  <div className="pt-1 flex items-center gap-1.5 text-xs font-bold text-indigo-600">
                    <span>Open Interactive Catalogue</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Main Products Grid & Filtering Section */}
      <section id="products-section" className="space-y-6">
        {/* Filter Controls Bar */}
        <div className="bg-white rounded-xl border border-neutral-200 p-3.5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              All Items ({products.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Secondary Controls */}
          <div className="flex items-center gap-3 self-end md:self-auto text-xs">
            <label className="flex items-center gap-1.5 cursor-pointer text-neutral-600 font-medium">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded border-neutral-300 text-neutral-900"
              />
              <span>In Stock Only</span>
            </label>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs text-neutral-800 focus:outline-none"
            >
              <option value="featured">Featured Deals</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((p) => {
            const hasDiscount = p.salePrice && p.salePrice < p.price;
            const discountPercent = hasDiscount
              ? Math.round(((p.price - p.salePrice!) / p.price) * 100)
              : 0;

            const isWholesaleActive = b2bModeActive && p.wholesalePrice;
            const activePrice = isWholesaleActive ? p.wholesalePrice! : p.salePrice || p.price;

            return (
              <div
                key={p.id}
                onClick={() => navigate(`/store/${currentTenant.slug}/product/${p.slug}`)}
                className="group bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs hover:shadow-md hover:border-neutral-300 transition-all flex flex-col justify-between cursor-pointer"
              >
                <div>
                  {/* Image container */}
                  <div className="relative aspect-square overflow-hidden bg-neutral-100">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Discount badge */}
                    {hasDiscount && !isWholesaleActive && (
                      <span className="absolute top-2 left-2 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                        {discountPercent}% OFF
                      </span>
                    )}

                    {/* B2B Wholesale badge */}
                    {isWholesaleActive && (
                      <span className="absolute top-2 left-2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                        <Layers className="w-3 h-3" />
                        <span>B2B Rate</span>
                      </span>
                    )}

                    {/* WhatsApp Inquire quick icon */}
                    <button
                      type="button"
                      onClick={(e) => handleWhatsAppInquire(p, e)}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-emerald-600 flex items-center justify-center shadow-md transition-transform hover:scale-110"
                      title="Quick Inquiry on WhatsApp"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="p-3.5 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-neutral-400">
                      <span>{p.brand}</span>
                      <span className="flex items-center gap-1 text-amber-600 font-semibold">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        <span>{p.rating}</span>
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-neutral-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-tight">
                      {p.name}
                    </h3>

                    <p className="text-[11px] text-neutral-500 line-clamp-1">{p.shortDescription}</p>

                    {/* Pricing */}
                    <div className="pt-1 flex items-baseline gap-2">
                      <span className="text-sm sm:text-base font-bold text-neutral-900">
                        ₹{activePrice.toLocaleString('en-IN')}
                      </span>
                      {hasDiscount && !isWholesaleActive && (
                        <span className="text-xs text-neutral-400 line-through">
                          ₹{p.price.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    {isWholesaleActive && (
                      <p className="text-[10px] text-indigo-700 font-semibold">
                        MOQ: {p.b2bMinQty || 10} units
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Action */}
                <div className="p-3 pt-0">
                  <button
                    type="button"
                    onClick={(e) => handleQuickAdd(p, e)}
                    className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Bag</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Trust Badges Bar */}
      <section className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-700 shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-neutral-900">Pan-India Express Delivery</h4>
            <p className="text-[11px] text-neutral-500">Free delivery above ₹999</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-700 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-neutral-900">100% Genuine Quality</h4>
            <p className="text-[11px] text-neutral-500">Authorized direct distribution</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-700 shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-neutral-900">B2B Wholesale Trade</h4>
            <p className="text-[11px] text-neutral-500">Verified GST invoices & tax credits</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-700 shrink-0">
            <MessageSquare className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-neutral-900">WhatsApp Assistance</h4>
            <p className="text-[11px] text-neutral-500">Live support 7 days a week</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 pt-8 text-neutral-500 text-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-900">{currentTenant.name}</span>
            <span>·</span>
            <span>{currentTenant.tagline}</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard/overview')}
              className="text-indigo-600 font-semibold hover:underline flex items-center gap-1"
            >
              <span>Merchant Admin Portal</span>
              <ExternalLink className="w-3 h-3" />
            </button>
            <span>·</span>
            <span>Support: {currentTenant.supportEmail}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
