import React, { useState } from 'react';
import { useRouter } from '../../context/RouterContext';
import { useStore } from '../../context/StoreContext';
import {
  Store,
  LayoutDashboard,
  Globe,
  ShoppingCart,
  ChevronDown,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export const AppSwitcherBar: React.FC = () => {
  const { currentPath, navigate } = useRouter();
  const { currentTenant, availableTenants, switchTenant, cart } = useStore();
  const [tenantDropdownOpen, setTenantDropdownOpen] = useState(false);

  const safePath = currentPath || '';
  const isDashboard = safePath.startsWith('/dashboard');
  const isStorefront = safePath.startsWith('/store');
  const isMarketing = !isDashboard && !isStorefront;

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="bg-neutral-900 text-neutral-300 text-xs border-b border-neutral-800 sticky top-0 z-40 px-3 py-1.5 flex flex-wrap items-center justify-between gap-2">
      {/* Brand & Experience Switcher */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
        <div className="flex items-center gap-1.5 font-bold text-white pr-2 border-r border-neutral-700">
          <span className="w-5 h-5 rounded bg-indigo-600 flex items-center justify-center text-[10px] text-white">
            CP
          </span>
          <span className="hidden sm:inline tracking-tight font-display text-sm">CatalogPro</span>
        </div>

        <nav className="flex items-center gap-1">
          <button
            id="nav-switch-marketing"
            type="button"
            onClick={() => navigate('/')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
              isMarketing
                ? 'bg-neutral-800 text-white font-semibold'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>SaaS Platform</span>
          </button>

          <button
            id="nav-switch-dashboard"
            type="button"
            onClick={() => navigate('/dashboard')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
              isDashboard
                ? 'bg-neutral-800 text-white font-semibold'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-emerald-400" />
            <span>Admin Dashboard</span>
          </button>

          <button
            id="nav-switch-storefront"
            type="button"
            onClick={() => navigate(`/store/${currentTenant.slug}`)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
              isStorefront
                ? 'bg-neutral-800 text-white font-semibold'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
            }`}
          >
            <Store className="w-3.5 h-3.5 text-indigo-400" />
            <span>Live Storefront</span>
            {totalCartCount > 0 && (
              <span className="bg-indigo-600 text-white px-1.5 py-0.2 rounded-full text-[10px] font-bold">
                {totalCartCount}
              </span>
            )}
          </button>
        </nav>
      </div>

      {/* Tenant Switcher & Quick Action */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            id="tenant-switcher-btn"
            type="button"
            onClick={() => setTenantDropdownOpen(!tenantDropdownOpen)}
            className="flex items-center gap-1.5 bg-neutral-800 hover:bg-neutral-700/80 text-white px-2.5 py-1 rounded-md border border-neutral-700 transition-colors"
          >
            <span>{currentTenant.logo}</span>
            <span className="font-medium max-w-[120px] truncate">{currentTenant.name}</span>
            <ChevronDown className="w-3 h-3 text-neutral-400" />
          </button>

          {tenantDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setTenantDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-1 w-56 bg-neutral-900 border border-neutral-700 rounded-xl shadow-xl py-1 z-50">
                <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-neutral-400 font-semibold border-b border-neutral-800">
                  Switch Active Storefront Tenant
                </div>
                {availableTenants.map((tenant) => (
                  <button
                    key={tenant.id}
                    id={`tenant-opt-${tenant.id}`}
                    type="button"
                    onClick={() => {
                      switchTenant(tenant.id);
                      setTenantDropdownOpen(false);
                      if (isStorefront) {
                        navigate(`/store/${tenant.slug}`);
                      }
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center gap-2 text-xs hover:bg-neutral-800 transition-colors ${
                      currentTenant.id === tenant.id
                        ? 'text-indigo-400 font-semibold bg-neutral-800/40'
                        : 'text-neutral-200'
                    }`}
                  >
                    <span className="text-base">{tenant.logo}</span>
                    <div className="flex-1 truncate">
                      <div className="truncate">{tenant.name}</div>
                      <div className="text-[10px] text-neutral-500 truncate">{tenant.categoryTheme}</div>
                    </div>
                    {currentTenant.id === tenant.id && (
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {isDashboard && (
          <button
            id="quick-view-store-btn"
            type="button"
            onClick={() => navigate(`/store/${currentTenant.slug}`)}
            className="hidden md:flex items-center gap-1 text-neutral-400 hover:text-white transition-colors"
            title="Preview Customer Storefront"
          >
            <span>Preview Store</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        )}

        {isStorefront && (
          <button
            id="quick-view-cart-btn"
            type="button"
            onClick={() => navigate(`/store/${currentTenant.slug}/cart`)}
            className="flex items-center gap-1 text-neutral-300 hover:text-white bg-neutral-800 px-2 py-0.5 rounded"
          >
            <ShoppingCart className="w-3 h-3" />
            <span>Cart ({totalCartCount})</span>
          </button>
        )}
      </div>
    </div>
  );
};
