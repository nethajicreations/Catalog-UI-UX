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
  Heart,
  ChevronRight,
  Flame,
  Award,
  Percent,
  Phone,
  Mail,
  MapPin,
  FileText,
  CreditCard,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';
import { Product, Catalogue } from '../../types';

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
    toggleB2BMode,
    addToast,
  } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price_low' | 'price_high'>('featured');
  const [wishlist, setWishlist] = useState<string[]>([]);

  const toggleWishlist = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter(id => id !== productId));
      addToast('Removed from your wishlist', 'info');
    } else {
      setWishlist([...wishlist, productId]);
      addToast('Added to your wishlist', 'success');
    }
  };

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    onOpenCart();
  };

  const handleWhatsAppInquire = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const cleanPhone = (currentTenant.supportPhone || currentTenant.whatsappNumber || currentTenant.phone || '919876543210').replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `Hi ${currentTenant.name}! I'm interested in: *${product.name}* (SKU: ${product.sku}) listed at ₹${b2bModeActive && product.wholesalePrice ? product.wholesalePrice : product.salePrice || product.price}. Please share availability and payment details.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  const cleanPhone = (currentTenant.supportPhone || currentTenant.whatsappNumber || currentTenant.phone || '919876543210').replace(/[^0-9]/g, '');
  const bannerBg = currentTenant.theme?.bannerUrl || currentTenant.bannerImage || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&q=80';

  // Hero showcase item
  const heroProduct = products[0] || {
    id: 'hero-sample',
    name: 'Noise-Cancelling Wireless Headphones Pro',
    price: 4999,
    salePrice: 2499,
    rating: 4.9,
    reviewsCount: 1240,
    images: ['https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&q=80'],
  };

  // Grouped products
  const trendingProducts = useMemo(() => products.slice(0, 4), [products]);
  const bestSellers = useMemo(() => [...products].sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0)).slice(0, 4), [products]);
  const specialOffers = useMemo(() => products.filter(p => p.salePrice && p.salePrice < p.price).slice(0, 4), [products]);

  // Main catalog filtered
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

  // Reusable Product Card Component
  const renderProductCard = (p: Product) => {
    const hasDiscount = p.salePrice && p.salePrice < p.price;
    const discountPercent = hasDiscount
      ? Math.round(((p.price - p.salePrice!) / p.price) * 100)
      : 0;

    const isWholesaleActive = b2bModeActive && p.wholesalePrice;
    const activePrice = isWholesaleActive ? p.wholesalePrice! : p.salePrice || p.price;
    const isWishlisted = wishlist.includes(p.id);

    return (
      <div
        key={p.id}
        onClick={() => navigate(`/store/${currentTenant.slug}/product/${p.slug}`)}
        className="group bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs hover:shadow-md hover:border-neutral-300 transition-all flex flex-col justify-between cursor-pointer"
      >
        <div>
          {/* Image & Badges */}
          <div className="relative aspect-square overflow-hidden bg-neutral-100">
            <img
              src={p.images[0]}
              alt={p.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {/* Top badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
              {hasDiscount && !isWholesaleActive && (
                <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-2xs">
                  {discountPercent}% OFF
                </span>
              )}

              {isWholesaleActive && (
                <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-2xs flex items-center gap-1">
                  <Layers className="w-3 h-3" />
                  <span>B2B Rate</span>
                </span>
              )}
            </div>

            {/* Top Right: Wishlist & WhatsApp */}
            <div className="absolute top-2 right-2 flex flex-col gap-1.5 z-10">
              <button
                type="button"
                onClick={(e) => toggleWishlist(p.id, e)}
                className={`w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md shadow-xs transition-all ${
                  isWishlisted
                    ? 'bg-rose-50 text-rose-600 fill-rose-600'
                    : 'bg-white/90 text-neutral-500 hover:text-rose-600 hover:bg-white'
                }`}
                title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-600 text-rose-600' : ''}`} />
              </button>

              <button
                type="button"
                onClick={(e) => handleWhatsAppInquire(p, e)}
                className="w-7 h-7 rounded-full bg-white/90 hover:bg-white text-emerald-600 flex items-center justify-center shadow-xs transition-transform hover:scale-105"
                title="Quick WhatsApp Inquiry"
              >
                <MessageSquare className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Product Details */}
          <div className="p-3 sm:p-3.5 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-neutral-400">
              <span className="font-medium text-neutral-500">{p.brand}</span>
              <span className="flex items-center gap-1 text-amber-600 font-semibold">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                <span>{p.rating}</span>
                <span className="text-neutral-400 font-normal">({p.reviewsCount || 48})</span>
              </span>
            </div>

            <h3 className="text-xs font-bold text-neutral-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-tight">
              {p.name}
            </h3>

            {/* Price & Discounts */}
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

            {/* Stock indicator */}
            <div className="flex items-center justify-between text-[10px] pt-0.5">
              {p.stock > 0 ? (
                <span className="text-emerald-600 font-medium">In Stock ({p.stock} units)</span>
              ) : (
                <span className="text-rose-600 font-medium">Out of Stock</span>
              )}

              {isWholesaleActive && (
                <span className="text-emerald-700 font-bold">
                  MOQ: {p.b2bMinQty || 10}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Quick Add Action */}
        <div className="p-3 sm:p-3.5 pt-0">
          <button
            type="button"
            onClick={(e) => handleQuickAdd(p, e)}
            className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add to Bag</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Hero Banner Section (Clean commerce composition with product showcase) */}
      <section className="relative overflow-hidden rounded-2xl bg-neutral-950 text-white min-h-[380px] lg:min-h-[420px] flex items-center border border-neutral-800 shadow-sm">
        {/* Background Image with subtle gradient darkening */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity"
          style={{ backgroundImage: `url(${bannerBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/90 to-transparent" />

        <div className="relative max-w-7xl mx-auto w-full p-6 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Campaign Copy */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Festive Mega Deals & B2B Wholesale Prices</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Premium Electronics & Home Essentials
            </h1>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-lg">
              Direct manufacturer wholesale pricing, instant UPI checkout, verified GST invoices, and express Pan-India shipping.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#shop-catalog-section"
                className="px-5 py-2.5 rounded-xl font-bold text-xs text-neutral-950 bg-white hover:bg-neutral-100 transition-colors shadow-md flex items-center gap-2"
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
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>Browse Digital Catalogue</span>
              </button>

              <button
                type="button"
                onClick={toggleB2BMode}
                className={`px-4 py-2.5 rounded-xl font-semibold text-xs border transition-colors flex items-center gap-2 ${
                  b2bModeActive
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/60'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>{b2bModeActive ? 'B2B Wholesale Active' : 'Switch to B2B Pricing'}</span>
              </button>
            </div>
          </div>

          {/* Right: Real Commerce Product Card Showcase */}
          <div className="hidden lg:flex lg:col-span-5 justify-end">
            <div
              onClick={() => navigate(`/store/${currentTenant.slug}/product/${products[0]?.slug || 'sample'}`)}
              className="w-80 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-2xl text-white cursor-pointer hover:bg-white/15 transition-all"
            >
              <div className="relative aspect-video rounded-xl overflow-hidden mb-3 bg-neutral-900">
                <img
                  src={heroProduct.images[0]}
                  alt={heroProduct.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 bg-emerald-500 text-neutral-950 text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                  Bestseller
                </span>
                <span className="absolute bottom-2 right-2 bg-neutral-950/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  {heroProduct.rating} ({heroProduct.reviewsCount} reviews)
                </span>
              </div>

              <h4 className="text-sm font-bold text-white line-clamp-1">{heroProduct.name}</h4>
              <p className="text-[11px] text-neutral-300 mt-1">Direct Pan-India Dispatch · 1-Year Warranty</p>

              <div className="mt-3 pt-3 border-t border-white/15 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Special Deal</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-base font-bold text-emerald-400">
                      ₹{(heroProduct.salePrice || heroProduct.price).toLocaleString('en-IN')}
                    </span>
                    {heroProduct.salePrice && (
                      <span className="text-xs text-neutral-400 line-through">
                        ₹{heroProduct.price.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>

                <span className="text-xs font-semibold text-emerald-300 flex items-center gap-1 hover:underline">
                  <span>View Product</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Shop by Category Section (Visual category tiles with realistic commerce imagery) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 tracking-tight">
              Shop by Category
            </h2>
            <p className="text-xs text-neutral-500">Explore collections curated for retail shoppers and bulk buyers</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => navigate(`/store/${currentTenant.slug}/category/${cat.slug}`)}
              className="group relative overflow-hidden rounded-xl border border-neutral-200 bg-white p-3 text-left shadow-xs hover:shadow-md hover:border-neutral-300 transition-all flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 rounded-full overflow-hidden mb-2 bg-neutral-100 border border-neutral-200 group-hover:scale-105 transition-transform">
                <img
                  src={cat.image || 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&q=80'}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xs font-bold text-neutral-900 group-hover:text-emerald-700 transition-colors">
                {cat.name}
              </h3>
              <p className="text-[11px] text-neutral-400 mt-0.5">{cat.productCount} Items</p>
            </button>
          ))}
        </div>
      </section>

      {/* 3. Featured Digital Catalogues (Visual distinction: RETAIL vs WHOLESALE B2B) */}
      {catalogues.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-neutral-900 tracking-tight flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                <span>Featured Digital Catalogues</span>
              </h2>
              <p className="text-xs text-neutral-500">
                Interactive digital flipbooks optimized for fast WhatsApp ordering and volume wholesale buyers
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (catalogues[0]) navigate(`/store/${currentTenant.slug}/catalogue/${catalogues[0].slug}`);
              }}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {catalogues.slice(0, 2).map((cat, idx) => {
              const isWholesaleCatalogue = cat.pricingMode === 'wholesale' || idx === 1;
              return (
                <div
                  key={cat.id}
                  onClick={() => navigate(`/store/${currentTenant.slug}/catalogue/${cat.slug}`)}
                  className={`group relative overflow-hidden rounded-2xl border p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row items-center gap-5 ${
                    isWholesaleCatalogue
                      ? 'bg-gradient-to-br from-neutral-900 to-neutral-950 text-white border-neutral-800'
                      : 'bg-white border-neutral-200'
                  }`}
                >
                  <img
                    src={cat.coverImage}
                    alt={cat.name}
                    className="w-full sm:w-36 h-36 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          isWholesaleCatalogue
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        {isWholesaleCatalogue ? 'B2B WHOLESALE' : 'RETAIL CATALOGUE'}
                      </span>
                      <span className={`text-[11px] ${isWholesaleCatalogue ? 'text-neutral-400' : 'text-neutral-500'}`}>
                        {cat.productIds.length} Products
                      </span>
                    </div>

                    <h3
                      className={`text-sm sm:text-base font-bold transition-colors line-clamp-1 ${
                        isWholesaleCatalogue ? 'text-white group-hover:text-emerald-400' : 'text-neutral-900 group-hover:text-emerald-700'
                      }`}
                    >
                      {cat.name}
                    </h3>

                    <p className={`text-xs line-clamp-2 ${isWholesaleCatalogue ? 'text-neutral-300' : 'text-neutral-500'}`}>
                      {cat.description}
                    </p>

                    <div className="pt-1 flex items-center gap-1.5 text-xs font-bold text-emerald-600 group-hover:translate-x-0.5 transition-transform">
                      <span>{isWholesaleCatalogue ? 'Open Wholesale Flipbook' : 'Open Retail Catalogue'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 4. Trending Products Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-rose-500" />
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-neutral-900 tracking-tight">
                Trending Right Now
              </h2>
              <p className="text-xs text-neutral-500">Most viewed products across customer storefronts this week</p>
            </div>
          </div>
          <a
            href="#shop-catalog-section"
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>See All</span>
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {trendingProducts.map(renderProductCard)}
        </div>
      </section>

      {/* 5. Dedicated B2B Selling Section (Wholesale pricing for serious buyers) */}
      <section className="bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 text-white rounded-2xl p-6 sm:p-10 border border-neutral-800 shadow-sm space-y-6">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Layers className="w-3.5 h-3.5" />
            <span>Dedicated B2B Trade Portal</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white">
            Wholesale Pricing for Retailers & Bulk Buyers
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            Unlock tiered volume discounts, input tax credit (ITC) with valid GSTIN invoices, customized packaging, and dedicated account manager support.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-1">
            <div className="text-emerald-400 font-bold text-sm">Tiered Volume Pricing</div>
            <p className="text-xs text-neutral-300">Save up to 35% on orders exceeding 25 units per SKU.</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-1">
            <div className="text-emerald-400 font-bold text-sm">Verified GST Tax Invoices</div>
            <p className="text-xs text-neutral-300">Automatic GSTIN verification and monthly e-invoicing compliance.</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-1">
            <div className="text-emerald-400 font-bold text-sm">Express Surface & Air Cargo</div>
            <p className="text-xs text-neutral-300">Discounted bulk freight rates with real-time consignment tracking.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button
            type="button"
            onClick={toggleB2BMode}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-colors shadow-md flex items-center gap-2 ${
              b2bModeActive
                ? 'bg-emerald-500 text-neutral-950 hover:bg-emerald-400'
                : 'bg-white text-neutral-950 hover:bg-neutral-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{b2bModeActive ? 'B2B Mode Active (Disable)' : 'Enable B2B Wholesale Pricing'}</span>
          </button>

          {cleanPhone && (
            <a
              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                `Hello ${currentTenant.name}, I am a wholesale buyer looking to procure items in bulk. Please share your wholesale catalogue and trade terms.`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-colors flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Request Wholesale Quote on WhatsApp</span>
            </a>
          )}
        </div>
      </section>

      {/* 6. Best Sellers Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-neutral-900 tracking-tight">
                All-Time Best Sellers
              </h2>
              <p className="text-xs text-neutral-500">Proven customer favorites with high 5-star review ratings</p>
            </div>
          </div>
          <a
            href="#shop-catalog-section"
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>See All</span>
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {bestSellers.map(renderProductCard)}
        </div>
      </section>

      {/* 7. WhatsApp Commerce Selling Section */}
      <section className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
            <span>Direct WhatsApp Shopping</span>
          </div>
          <h3 className="text-lg sm:text-2xl font-bold text-neutral-900">
            Order Directly on WhatsApp with 1 Tap
          </h3>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            Prefer chatting? Inquire about products, request personalized bulk quotes, verify stock availability, and receive instant UPI payment QR codes directly inside your WhatsApp chat.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
          {cleanPhone && (
            <a
              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                `Hello ${currentTenant.name}, I am browsing your store and would like some assistance.`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>
          )}
          <button
            type="button"
            onClick={() => {
              if (catalogues[0]) navigate(`/store/${currentTenant.slug}/catalogue/${catalogues[0].slug}`);
            }}
            className="w-full sm:w-auto px-4 py-2.5 bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <BookOpen className="w-4 h-4 text-neutral-500" />
            <span>View Catalogue</span>
          </button>
        </div>
      </section>

      {/* 8. Full Main Catalog Section (Filterable & Searchable) */}
      <section id="shop-catalog-section" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 tracking-tight">
              All Products Catalog
            </h2>
            <p className="text-xs text-neutral-500">
              Showing {filteredProducts.length} product(s) available for immediate dispatch
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-3 self-end sm:self-auto text-xs">
            <label className="flex items-center gap-1.5 cursor-pointer text-neutral-600 font-medium select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span>In Stock Only</span>
            </label>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs text-neutral-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            All Categories ({products.length})
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
              {cat.name} ({products.filter(p => p.category === cat.id).length})
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-neutral-200">
            <ShoppingBag className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-neutral-700">No matching products found</p>
            <p className="text-xs text-neutral-400 mt-1">Try changing category filters or clear stock criteria.</p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setInStockOnly(false);
              }}
              className="mt-4 px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map(renderProductCard)}
          </div>
        )}
      </section>

      {/* 9. Trust & Guarantee Section */}
      <section className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-neutral-900">Express Pan-India Delivery</h4>
            <p className="text-[11px] text-neutral-500">Free delivery on orders above ₹999</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-neutral-900">100% Genuine Quality</h4>
            <p className="text-[11px] text-neutral-500">Direct authorized merchant distribution</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-neutral-900">Instant UPI & Cards</h4>
            <p className="text-[11px] text-neutral-500">Encrypted checkout with GST receipt</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-neutral-900">Easy 7-Day Replacement</h4>
            <p className="text-[11px] text-neutral-500">Hassle-free doorstep pickup policy</p>
          </div>
        </div>
      </section>

      {/* 10. Real Multi-Column Commerce Storefront Footer */}
      <footer className="bg-neutral-900 text-neutral-300 rounded-2xl p-8 sm:p-12 space-y-10 border border-neutral-800">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-lg font-bold">
                {currentTenant.logo || '🛍️'}
              </div>
              <span className="text-base font-bold text-white tracking-tight">{currentTenant.name}</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              {currentTenant.tagline || 'Everyday Essentials & Wholesale Deals'}
            </p>
            <div className="space-y-1.5 text-xs text-neutral-400 pt-2">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{currentTenant.address}, {currentTenant.city} - {currentTenant.pincode}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Phone / WhatsApp: {currentTenant.supportPhone || currentTenant.phone}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Email: {currentTenant.supportEmail || currentTenant.email}</span>
              </p>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Categories</h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    type="button"
                    onClick={() => navigate(`/store/${currentTenant.slug}/category/${cat.slug}`)}
                    className="hover:text-white transition-colors"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links & B2B */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Wholesale & B2B</h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <button type="button" onClick={toggleB2BMode} className="hover:text-white transition-colors">
                  {b2bModeActive ? 'Disable B2B Pricing' : 'Enable B2B Mode'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    if (catalogues[0]) navigate(`/store/${currentTenant.slug}/catalogue/${catalogues[0].slug}`);
                  }}
                  className="hover:text-white transition-colors"
                >
                  Digital Catalogues
                </button>
              </li>
              {cleanPhone && (
                <li>
                  <a
                    href={`https://wa.me/${cleanPhone}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    WhatsApp Bulk Order Desk
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Customer Service & Merchant Admin */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Merchant Portal</h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/overview')}
                  className="text-emerald-400 font-semibold hover:underline flex items-center gap-1"
                >
                  <span>Merchant Admin Dashboard</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/orders')}
                  className="hover:text-white transition-colors"
                >
                  Manage Store Orders
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/inventory')}
                  className="hover:text-white transition-colors"
                >
                  Inventory & Stock Manager
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Strip */}
        <div className="border-t border-neutral-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-400">
          <div>
            © {new Date().getFullYear()} {currentTenant.name}. All rights reserved. Powered by{' '}
            <span className="text-neutral-200 font-semibold">CatalogPro</span> Commerce.
          </div>

          <div className="flex items-center gap-4">
            <span className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 font-mono text-[10px]">
              GSTIN: 27AABCC1234F1Z9
            </span>
            <span className="hidden sm:inline">·</span>
            <span>UPI / RuPay / Cards Accepted</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
