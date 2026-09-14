import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from '../../context/RouterContext';
import { useStore } from '../../context/StoreContext';
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  MessageSquare,
  LayoutDashboard,
  Tag,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Phone,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface StorefrontHeaderProps {
  onOpenCart: () => void;
  cartCount: number;
}

export const StorefrontHeader: React.FC<StorefrontHeaderProps> = ({ onOpenCart, cartCount }) => {
  const { navigate, currentPath } = useRouter();
  const { currentTenant, products, categories, b2bModeActive, toggleB2BMode } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchExpanded, setMobileSearchExpanded] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Safe fallback for supportPhone
  const cleanPhone = (currentTenant?.supportPhone || currentTenant?.phone || '919876543210').replace(/[^0-9]/g, '');

  // Filter products for instant autocomplete
  const searchResults = searchQuery.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 shadow-2xs">
      {/* 1. Compact Announcement Bar */}
      <div className="bg-neutral-900 text-white text-[11px] sm:text-xs py-1.5 px-4 font-medium tracking-wide">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 mx-auto sm:mx-0 truncate">
            <span className="inline-block px-1.5 py-0.2 bg-emerald-500 text-white rounded text-[10px] font-bold uppercase">
              Limited Offer
            </span>
            <span className="truncate">
              ⚡ Extra 10% OFF on Prepaid UPI Orders | Code:{' '}
              <span className="font-bold text-emerald-400">FESTIVE10</span> | Pan-India Fast Delivery
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-neutral-300 text-[11px] shrink-0">
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-emerald-400" />
              Verified GST Invoices
            </span>
            {cleanPhone && (
              <a
                href={`https://wa.me/${cleanPhone}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white flex items-center gap-1 transition-colors"
              >
                <Phone className="w-3 h-3 text-emerald-400" />
                Support: {currentTenant?.supportPhone || currentTenant?.phone}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* 2. Main Store Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Left: Mobile menu button + Brand identity */}
        <div className="flex items-center gap-3">
          <button
            id="mobile-storefront-menu-btn"
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-1.5 rounded-lg text-neutral-700 hover:bg-neutral-100 transition-colors"
            aria-label="Open storefront menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            id="storefront-brand-logo-btn"
            type="button"
            onClick={() => navigate(`/store/${currentTenant?.slug || 'daily-need-deals'}`)}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-lg font-bold shadow-xs group-hover:bg-emerald-700 transition-colors">
              {currentTenant?.logo || '🛍️'}
            </div>
            <div>
              <div className="text-base font-bold text-neutral-900 tracking-tight leading-none group-hover:text-emerald-700 transition-colors">
                {currentTenant?.name || 'Daily Need Deals'}
              </div>
              <div className="text-[11px] text-neutral-500 font-medium hidden sm:block truncate max-w-[240px] mt-0.5">
                {currentTenant?.tagline || 'Everyday Essentials & Wholesale Deals'}
              </div>
            </div>
          </button>
        </div>

        {/* Center: Desktop Search with Instant Autocomplete */}
        <div ref={searchContainerRef} className="hidden md:block flex-1 max-w-lg mx-4 relative">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              id="storefront-desktop-search"
              type="text"
              placeholder="Search products, brands, or categories..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
              className="w-full bg-neutral-100/80 hover:bg-neutral-100 focus:bg-white border border-neutral-200/80 rounded-xl pl-10 pr-4 py-2 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
            />
          </div>

          {/* Instant Dropdown Preview */}
          {showSearchDropdown && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-neutral-200 rounded-xl shadow-xl overflow-hidden z-50 divide-y divide-neutral-100">
              <div className="px-3 py-1.5 bg-neutral-50 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                Matching Products
              </div>
              {searchResults.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setShowSearchDropdown(false);
                    setSearchQuery('');
                    navigate(`/store/${currentTenant?.slug}/product/${p.slug}`);
                  }}
                  className="w-full p-2.5 flex items-center gap-3 hover:bg-neutral-50 text-left transition-colors group"
                >
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="w-10 h-10 rounded-lg object-cover border border-neutral-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-neutral-900 truncate group-hover:text-emerald-700">
                      {p.name}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-neutral-500 mt-0.5">
                      <span className="font-bold text-neutral-900">
                        ₹{(b2bModeActive && p.wholesalePrice ? p.wholesalePrice : p.salePrice || p.price).toLocaleString('en-IN')}
                      </span>
                      {p.salePrice && p.price > p.salePrice && (
                        <span className="line-through text-neutral-400 text-[10px]">
                          ₹{p.price.toLocaleString('en-IN')}
                        </span>
                      )}
                      <span className="text-neutral-400">·</span>
                      <span className="text-[10px] text-neutral-400">{p.category}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-300 group-hover:text-neutral-700 shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Mobile search trigger */}
          <button
            id="mobile-search-toggle-btn"
            type="button"
            onClick={() => setMobileSearchExpanded(!mobileSearchExpanded)}
            className="md:hidden p-2 rounded-lg text-neutral-700 hover:bg-neutral-100 transition-colors"
            aria-label="Toggle mobile search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* B2B Wholesale Toggle */}
          <button
            id="storefront-b2b-toggle-btn"
            type="button"
            onClick={toggleB2BMode}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              b2bModeActive
                ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs ring-2 ring-emerald-200'
                : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
            }`}
            title="Toggle B2B Wholesale Pricing Mode"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Wholesale (B2B)</span>
            {b2bModeActive && (
              <span className="w-2 h-2 rounded-full bg-emerald-200" />
            )}
          </button>

          {/* WhatsApp Direct Help */}
          {cleanPhone && (
            <a
              id="storefront-whatsapp-header-btn"
              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                `Hello ${currentTenant?.name}, I'm browsing your online store and have an inquiry.`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold transition-colors"
              title="Chat with Merchant on WhatsApp"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp Help</span>
            </a>
          )}

          {/* Merchant Admin Dashboard switch */}
          <button
            id="storefront-admin-dashboard-btn"
            type="button"
            onClick={() => navigate('/dashboard/overview')}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-800 rounded-lg text-xs font-semibold transition-colors"
            title="Open Merchant Admin Dashboard"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Merchant Admin</span>
          </button>

          {/* Shopping Bag Trigger */}
          <button
            id="storefront-cart-bag-btn"
            type="button"
            onClick={onOpenCart}
            className="relative flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Bag</span>
            {cartCount > 0 ? (
              <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center -mr-1">
                {cartCount}
              </span>
            ) : (
              <span className="text-[11px] text-neutral-400 hidden sm:inline">(0)</span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Expandable Bar */}
      {mobileSearchExpanded && (
        <div className="md:hidden px-4 pb-3 pt-1 border-t border-neutral-100 bg-neutral-50 animate-in fade-in">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search products, brands, or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-neutral-200 rounded-lg pl-9 pr-3 py-2 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              autoFocus
            />
          </div>
          {searchQuery.trim() && searchResults.length > 0 && (
            <div className="mt-2 bg-white rounded-lg border border-neutral-200 divide-y divide-neutral-100 overflow-hidden shadow-md">
              {searchResults.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setMobileSearchExpanded(false);
                    setSearchQuery('');
                    navigate(`/store/${currentTenant?.slug}/product/${p.slug}`);
                  }}
                  className="w-full p-2.5 flex items-center gap-3 text-left hover:bg-neutral-50"
                >
                  <img src={p.images[0]} alt={p.name} className="w-8 h-8 rounded object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-neutral-900 truncate">{p.name}</p>
                    <p className="text-[11px] text-neutral-500">₹{p.salePrice || p.price}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. Category Navigation Bar (Horizontal scrolling, active indicator, clean typography) */}
      <div className="bg-neutral-50/80 border-t border-neutral-200/60 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center gap-1.5">
          <button
            id="cat-tab-all-products"
            type="button"
            onClick={() => navigate(`/store/${currentTenant?.slug}`)}
            className={`text-xs font-semibold px-3 py-1 rounded-md transition-colors whitespace-nowrap ${
              !currentPath.includes('/category/')
                ? 'bg-neutral-900 text-white shadow-2xs'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60'
            }`}
          >
            All Products
          </button>

          {categories.map((cat) => {
            const isSelected = currentPath.includes(`/category/${cat.slug}`);
            return (
              <button
                key={cat.id}
                id={`cat-tab-${cat.slug}`}
                type="button"
                onClick={() => navigate(`/store/${currentTenant?.slug}/category/${cat.slug}`)}
                className={`text-xs font-medium px-3 py-1 rounded-md transition-colors whitespace-nowrap ${
                  isSelected
                    ? 'bg-neutral-900 text-white font-semibold shadow-2xs'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Dedicated Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto z-10 animate-in slide-in-from-left duration-200">
            <div>
              {/* Drawer Header */}
              <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                    {currentTenant?.logo || '🛍️'}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900">{currentTenant?.name}</h3>
                    <p className="text-[11px] text-neutral-400 truncate max-w-[160px]">{currentTenant?.city}, {currentTenant?.state}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* B2B Mode Toggle inside Drawer */}
              <div className="p-4 border-b border-neutral-100 bg-neutral-50">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-neutral-900">Wholesale (B2B) Mode</span>
                    <p className="text-[11px] text-neutral-500">View bulk tiered pricing & MOQs</p>
                  </div>
                  <button
                    type="button"
                    onClick={toggleB2BMode}
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                      b2bModeActive ? 'bg-emerald-600' : 'bg-neutral-300'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        b2bModeActive ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Drawer Links */}
              <div className="p-3 space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    navigate(`/store/${currentTenant?.slug}`);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-neutral-800 hover:bg-neutral-50 text-left"
                >
                  <span>Storefront Home</span>
                  <ChevronRight className="w-4 h-4 text-neutral-400" />
                </button>

                <div className="pt-2 pb-1 px-3 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  Shop Categories
                </div>

                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      navigate(`/store/${currentTenant?.slug}/category/${cat.slug}`);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 text-left"
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] text-neutral-400">{cat.productCount} items</span>
                  </button>
                ))}

                <div className="pt-3 pb-1 px-3 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  Store Information
                </div>

                {cleanPhone && (
                  <a
                    href={`https://wa.me/${cleanPhone}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 rounded-xl"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    <span>WhatsApp Customer Support</span>
                  </a>
                )}
              </div>
            </div>

            {/* Drawer Bottom Actions */}
            <div className="p-4 border-t border-neutral-100 bg-neutral-50 space-y-2">
              <button
                type="button"
                onClick={() => {
                  navigate('/dashboard/overview');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold shadow-xs"
              >
                <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                <span>Switch to Merchant Admin</span>
              </button>
              <p className="text-[10px] text-center text-neutral-400">
                Powered by CatalogPro Multi-Tenant Commerce
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
