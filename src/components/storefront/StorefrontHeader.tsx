import React, { useState } from 'react';
import { useRouter } from '../../context/RouterContext';
import { useStore } from '../../context/StoreContext';
import {
  ShoppingBag,
  Search,
  MessageSquare,
  X,
  Phone,
  Layers,
  Heart,
  Store,
  ChevronDown,
} from 'lucide-react';

interface StorefrontHeaderProps {
  onOpenCart: () => void;
  onOpenB2BModal?: () => void;
}

export const StorefrontHeader: React.FC<StorefrontHeaderProps> = ({ onOpenCart, onOpenB2BModal }) => {
  const { navigate } = useRouter();
  const { currentTenant, cart, categories, products, b2bModeActive, setB2bModeActive } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const searchResults = searchQuery.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      {/* Top Announcement Bar */}
      {currentTenant.theme.showAnnouncement && (
        <div
          className="py-1 px-4 text-center text-white text-[11px] font-semibold flex items-center justify-center gap-2"
          style={{ backgroundColor: currentTenant.theme.primaryColor || '#0f172a' }}
        >
          <span>{currentTenant.theme.announcementText}</span>
          <span className="opacity-60">|</span>
          <span className="underline cursor-pointer">Fast Pan-India Delivery</span>
        </div>
      )}

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(`/store/${currentTenant.slug}`)}
            className="flex items-center gap-2.5 text-left focus:outline-none group"
          >
            <div
              className="w-9 h-9 rounded-xl text-white flex items-center justify-center font-bold text-base shadow-xs group-hover:scale-105 transition-transform"
              style={{ backgroundColor: currentTenant.theme.primaryColor || '#0f172a' }}
            >
              {currentTenant.name[0]}
            </div>
            <div>
              <span className="font-bold text-neutral-900 text-base tracking-tight block leading-tight">
                {currentTenant.name}
              </span>
              <span className="text-[10px] text-neutral-400 font-medium">{currentTenant.tagline}</span>
            </div>
          </button>

          {/* B2B Mode Badge */}
          <button
            type="button"
            onClick={() => setB2bModeActive(!b2bModeActive)}
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all border ${
              b2bModeActive
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-xs'
                : 'bg-neutral-100 border-neutral-200 text-neutral-600 hover:bg-neutral-200'
            }`}
            title="Toggle B2B Wholesale Pricing"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            <span>{b2bModeActive ? 'B2B Wholesale Active' : 'Enable B2B Rates'}</span>
          </button>
        </div>

        {/* Central Search Bar with Dropdown */}
        <div className="relative flex-1 max-w-md hidden sm:block">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search products, brands, models..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
              className="w-full bg-neutral-100 border border-neutral-200 rounded-full pl-9 pr-8 py-1.5 text-xs text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setShowSearchDropdown(false);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Search autocomplete dropdown */}
          {showSearchDropdown && searchQuery && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl shadow-xl border border-neutral-200 overflow-hidden z-50 animate-in fade-in">
              {searchResults.length === 0 ? (
                <div className="p-4 text-center text-xs text-neutral-500">
                  No matching products found for "{searchQuery}"
                </div>
              ) : (
                <div className="divide-y divide-neutral-100 max-h-72 overflow-y-auto">
                  {searchResults.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setShowSearchDropdown(false);
                        setSearchQuery('');
                        navigate(`/store/${currentTenant.slug}/product/${p.slug}`);
                      }}
                      className="w-full p-2.5 flex items-center gap-3 hover:bg-neutral-50 text-left transition-colors"
                    >
                      <img src={p.images[0]} alt={p.name} className="w-9 h-9 rounded object-cover border" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-neutral-900 truncate">{p.name}</div>
                        <div className="text-[11px] text-neutral-500">
                          ₹{(b2bModeActive && p.wholesalePrice ? p.wholesalePrice : p.salePrice || p.price).toLocaleString('en-IN')}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Navigation Actions */}
        <div className="flex items-center gap-2.5">
          {/* WhatsApp Inquire */}
          <a
            href={`https://wa.me/${currentTenant.supportPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
              `Hello ${currentTenant.name}, I'm browsing your online store and would like some assistance.`
            )}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold transition-colors"
            title="Chat with Store Support on WhatsApp"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden lg:inline">WhatsApp Help</span>
          </a>

          {/* Cart Trigger */}
          <button
            id="storefront-cart-btn"
            type="button"
            onClick={onOpenCart}
            className="relative flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Bag</span>
            {cartCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center -mr-1">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Category Navigation Bar */}
      <div className="bg-neutral-50 border-t border-neutral-200/60 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate(`/store/${currentTenant.slug}`)}
            className="text-xs font-semibold px-2.5 py-1 rounded-md text-neutral-800 hover:bg-neutral-200/60 whitespace-nowrap"
          >
            All Products
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => navigate(`/store/${currentTenant.slug}/category/${cat.slug}`)}
              className="text-xs font-medium px-2.5 py-1 rounded-md text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60 whitespace-nowrap"
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
