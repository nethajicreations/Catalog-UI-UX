import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from '../../context/RouterContext';
import { useStore } from '../../context/StoreContext';
import {
  Search,
  Package,
  ShoppingBag,
  Users,
  BookOpen,
  Store,
  Settings,
  Plus,
  ArrowRight,
  X,
  Boxes,
  MessageSquare,
  BarChart3,
  ExternalLink,
} from 'lucide-react';
import { StatusBadge } from '../ui/Badge';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const { navigate } = useRouter();
  const { currentTenant, products, orders, customers, catalogues } = useStore();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Global ESC and key navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const trimmed = query.trim().toLowerCase();

  // Search matches
  const matchedProducts = products
    .filter(
      p =>
        !trimmed ||
        p.name.toLowerCase().includes(trimmed) ||
        p.sku.toLowerCase().includes(trimmed) ||
        p.category.toLowerCase().includes(trimmed)
    )
    .slice(0, 4);

  const matchedOrders = orders
    .filter(
      o =>
        !trimmed ||
        o.orderNumber.toLowerCase().includes(trimmed) ||
        o.customerName.toLowerCase().includes(trimmed) ||
        o.customerPhone.includes(trimmed)
    )
    .slice(0, 3);

  const matchedCustomers = customers
    .filter(
      c =>
        !trimmed ||
        c.name.toLowerCase().includes(trimmed) ||
        c.phone.includes(trimmed) ||
        c.city.toLowerCase().includes(trimmed)
    )
    .slice(0, 3);

  const matchedCatalogues = catalogues
    .filter(
      c =>
        !trimmed ||
        c.name.toLowerCase().includes(trimmed) ||
        c.pricingMode.toLowerCase().includes(trimmed)
    )
    .slice(0, 2);

  const quickActions = [
    {
      id: 'action-add-product',
      title: 'Add New Product',
      icon: Plus,
      category: 'Quick Action',
      action: () => navigate('/dashboard/products/new'),
    },
    {
      id: 'action-create-catalogue',
      title: 'Create Interactive Catalogue',
      icon: BookOpen,
      category: 'Quick Action',
      action: () => navigate('/dashboard/catalogues/new'),
    },
    {
      id: 'action-view-store',
      title: `View Storefront (${currentTenant.name})`,
      icon: ExternalLink,
      category: 'Navigation',
      action: () => navigate(`/store/${currentTenant.slug}`),
    },
    {
      id: 'action-inventory',
      title: 'Manage Stock & Restock Alerts',
      icon: Boxes,
      category: 'Navigation',
      action: () => navigate('/dashboard/inventory'),
    },
    {
      id: 'action-whatsapp',
      title: 'WhatsApp Broadcast & Commerce',
      icon: MessageSquare,
      category: 'Navigation',
      action: () => navigate('/dashboard/whatsapp'),
    },
    {
      id: 'action-settings',
      title: 'Store Settings & Payment Gateways',
      icon: Settings,
      category: 'Navigation',
      action: () => navigate('/dashboard/settings'),
    },
  ].filter(a => !trimmed || a.title.toLowerCase().includes(trimmed));

  const totalResults =
    matchedProducts.length +
    matchedOrders.length +
    matchedCustomers.length +
    matchedCatalogues.length +
    quickActions.length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20 flex items-start justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Palette Modal Box */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Search Input Bar */}
        <div className="relative border-b border-neutral-200 px-4 py-3 flex items-center gap-3">
          <Search className="w-5 h-5 text-neutral-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search products, orders, customers, catalogues, or type an action..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full text-sm text-neutral-900 placeholder-neutral-400 bg-transparent focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 rounded text-neutral-400 hover:text-neutral-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-semibold text-neutral-400 bg-neutral-100 border border-neutral-200 rounded">
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-4">
          {totalResults === 0 ? (
            <div className="py-12 text-center text-neutral-400">
              <Search className="w-8 h-8 mx-auto mb-2 text-neutral-300" />
              <p className="text-sm font-medium text-neutral-600">No results found for "{query}"</p>
              <p className="text-xs text-neutral-400 mt-1">Try searching by product name, order ID, phone number, or action.</p>
            </div>
          ) : (
            <>
              {/* Products Section */}
              {matchedProducts.length > 0 && (
                <div>
                  <div className="px-3 py-1 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                    Products
                  </div>
                  <div className="space-y-1">
                    {matchedProducts.map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          onClose();
                          navigate(`/dashboard/products/${p.id}`);
                        }}
                        className="w-full px-3 py-2 rounded-xl flex items-center justify-between text-left hover:bg-neutral-50 transition-colors group"
                      >
                        <div className="flex items-center gap-3 truncate">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-8 h-8 rounded-lg object-cover border border-neutral-200 shrink-0"
                          />
                          <div className="truncate">
                            <p className="text-xs font-semibold text-neutral-900 truncate group-hover:text-emerald-700">
                              {p.name}
                            </p>
                            <p className="text-[11px] text-neutral-400">
                              SKU: {p.sku} · ₹{p.salePrice || p.price} · {p.stock} in stock
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-neutral-300 group-hover:text-neutral-700 shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Orders Section */}
              {matchedOrders.length > 0 && (
                <div>
                  <div className="px-3 py-1 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                    Orders
                  </div>
                  <div className="space-y-1">
                    {matchedOrders.map(o => (
                      <button
                        key={o.id}
                        type="button"
                        onClick={() => {
                          onClose();
                          navigate(`/dashboard/orders/${o.id}`);
                        }}
                        className="w-full px-3 py-2 rounded-xl flex items-center justify-between text-left hover:bg-neutral-50 transition-colors group"
                      >
                        <div className="flex items-center gap-3 truncate">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
                            <ShoppingBag className="w-4 h-4" />
                          </div>
                          <div className="truncate">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-neutral-900 group-hover:text-indigo-700">
                                {o.orderNumber}
                              </span>
                              <StatusBadge status={o.fulfillmentStatus} />
                            </div>
                            <p className="text-[11px] text-neutral-400 truncate">
                              {o.customerName} · ₹{o.total.toLocaleString('en-IN')} · {o.paymentMethod}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-neutral-300 group-hover:text-neutral-700 shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Catalogues Section */}
              {matchedCatalogues.length > 0 && (
                <div>
                  <div className="px-3 py-1 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                    Digital Catalogues
                  </div>
                  <div className="space-y-1">
                    {matchedCatalogues.map(c => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          onClose();
                          navigate(`/store/${currentTenant.slug}/catalogue/${c.slug}`);
                        }}
                        className="w-full px-3 py-2 rounded-xl flex items-center justify-between text-left hover:bg-neutral-50 transition-colors group"
                      >
                        <div className="flex items-center gap-3 truncate">
                          <img
                            src={c.coverImage}
                            alt={c.name}
                            className="w-8 h-8 rounded-lg object-cover border border-neutral-200 shrink-0"
                          />
                          <div className="truncate">
                            <p className="text-xs font-semibold text-neutral-900 truncate group-hover:text-emerald-700">
                              {c.name}
                            </p>
                            <p className="text-[11px] text-neutral-400">
                              {c.productIds.length} items · {c.pricingMode.toUpperCase()}
                            </p>
                          </div>
                        </div>
                        <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1 shrink-0 ml-2">
                          <span>Preview</span>
                          <ExternalLink className="w-3 h-3" />
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Customers Section */}
              {matchedCustomers.length > 0 && (
                <div>
                  <div className="px-3 py-1 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                    Customers
                  </div>
                  <div className="space-y-1">
                    {matchedCustomers.map(c => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          onClose();
                          navigate(`/dashboard/customers/${c.id}`);
                        }}
                        className="w-full px-3 py-2 rounded-xl flex items-center justify-between text-left hover:bg-neutral-50 transition-colors group"
                      >
                        <div className="flex items-center gap-3 truncate">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                            <Users className="w-4 h-4" />
                          </div>
                          <div className="truncate">
                            <p className="text-xs font-semibold text-neutral-900 truncate group-hover:text-blue-700">
                              {c.name}
                            </p>
                            <p className="text-[11px] text-neutral-400">
                              {c.phone} · {c.city} · {c.totalOrders} order(s)
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-neutral-300 group-hover:text-neutral-700 shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              {quickActions.length > 0 && (
                <div>
                  <div className="px-3 py-1 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                    Quick Actions
                  </div>
                  <div className="space-y-1">
                    {quickActions.map(a => {
                      const Icon = a.icon;
                      return (
                        <button
                          key={a.id}
                          type="button"
                          onClick={() => {
                            onClose();
                            a.action();
                          }}
                          className="w-full px-3 py-2 rounded-xl flex items-center justify-between text-left hover:bg-neutral-50 transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-700 flex items-center justify-center shrink-0 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-xs font-medium text-neutral-800 group-hover:text-neutral-900">
                              {a.title}
                            </span>
                          </div>
                          <span className="text-[10px] text-neutral-400">{a.category}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer info */}
        <div className="border-t border-neutral-100 bg-neutral-50 px-4 py-2 flex items-center justify-between text-[11px] text-neutral-400">
          <div className="flex items-center gap-3">
            <span>Navigation: <kbd className="px-1.5 py-0.5 bg-white border rounded text-[10px]">↑</kbd> <kbd className="px-1.5 py-0.5 bg-white border rounded text-[10px]">↓</kbd></span>
            <span>Select: <kbd className="px-1.5 py-0.5 bg-white border rounded text-[10px]">ENTER</kbd></span>
          </div>
          <span>CatalogPro Universal Search</span>
        </div>
      </div>
    </div>
  );
};
