import React, { useState, useEffect } from 'react';
import { useRouter } from '../../context/RouterContext';
import { useStore } from '../../context/StoreContext';
import { CommandPalette } from './CommandPalette';
import {
  LayoutDashboard,
  Store,
  Package,
  FolderTree,
  BookOpen,
  ShoppingBag,
  Users,
  ShoppingCart,
  Boxes,
  ArrowLeftRight,
  Warehouse,
  TicketPercent,
  Megaphone,
  MessageSquare,
  BarChart3,
  TrendingUp,
  Activity,
  CreditCard,
  Receipt,
  UserCheck,
  CreditCard as BillingIcon,
  Settings,
  Search,
  Bell,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  ExternalLink,
  Plus,
  LogOut,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

interface DashboardShellProps {
  children: React.ReactNode;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({ children }) => {
  const { currentPath, navigate } = useRouter();
  const { currentTenant, availableTenants, switchTenant, orders, products, liveVisitors } = useStore();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [quickActionOpen, setQuickActionOpen] = useState(false);
  const [storeMenuOpen, setStoreMenuOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Global Cmd+K / Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Count pending orders
  const pendingOrdersCount = orders.filter(o => o.fulfillmentStatus === 'pending' || o.fulfillmentStatus === 'processing').length;
  const lowStockCount = products.filter(p => p.stock <= p.lowStockThreshold).length;

  const navSections = [
    {
      label: 'STORE',
      items: [
        { label: 'Overview', path: '/dashboard/overview', icon: LayoutDashboard },
        { label: 'Products', path: '/dashboard/products', icon: Package, badge: products.length },
        { label: 'Categories', path: '/dashboard/categories', icon: FolderTree },
        { label: 'Catalogues', path: '/dashboard/catalogues', icon: BookOpen, highlight: true },
      ],
    },
    {
      label: 'SALES',
      items: [
        { label: 'Orders', path: '/dashboard/orders', icon: ShoppingBag, badge: pendingOrdersCount ? `${pendingOrdersCount}` : undefined, badgeColor: 'bg-amber-500' },
        { label: 'Customers', path: '/dashboard/customers', icon: Users },
        { label: 'Abandoned Carts', path: '/dashboard/whatsapp', icon: ShoppingCart, sublabel: 'Recover' },
      ],
    },
    {
      label: 'INVENTORY',
      items: [
        { label: 'Stock Manager', path: '/dashboard/inventory', icon: Boxes, badge: lowStockCount ? `${lowStockCount} Low` : undefined, badgeColor: 'bg-rose-500' },
        { label: 'Stock Movements', path: '/dashboard/inventory/movements', icon: ArrowLeftRight },
      ],
    },
    {
      label: 'MARKETING',
      items: [
        { label: 'Coupons & Deals', path: '/dashboard/coupons', icon: TicketPercent },
        { label: 'Banners & Offers', path: '/dashboard/banners', icon: Megaphone },
        { label: 'WhatsApp Selling', path: '/dashboard/whatsapp', icon: MessageSquare, highlight: true },
      ],
    },
    {
      label: 'ANALYTICS',
      items: [
        { label: 'Sales & Revenue', path: '/dashboard/analytics', icon: BarChart3 },
        { label: 'Live Visitors', path: '/dashboard/live-visitors', icon: Activity, badge: `${liveVisitors.length} Live`, badgeColor: 'bg-emerald-500' },
      ],
    },
    {
      label: 'FINANCE & TEAM',
      items: [
        { label: 'Payments & Invoices', path: '/dashboard/payments', icon: Receipt },
        { label: 'Team Members', path: '/dashboard/team', icon: UserCheck },
        { label: 'SaaS Plan & Billing', path: '/dashboard/billing', icon: BillingIcon },
      ],
    },
    {
      label: 'SETTINGS',
      items: [
        { label: 'Store Settings', path: '/dashboard/settings', icon: Settings },
      ],
    },
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
    setMobileDrawerOpen(false);
  };

  const isActive = (itemPath: string) => {
    const safePath = currentPath || '';
    if (itemPath === '/dashboard/overview' && (safePath === '/dashboard' || safePath === '/dashboard/overview')) {
      return true;
    }
    return safePath === itemPath || (itemPath !== '/dashboard/overview' && safePath.startsWith(itemPath));
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col antialiased text-neutral-900">
      {/* Top Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-30 h-16 flex items-center justify-between px-4 sm:px-6 shadow-xs">
        <div className="flex items-center gap-3">
          {/* Mobile menu toggle */}
          <button
            id="mobile-nav-toggle-btn"
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            className="md:hidden p-2 rounded-lg text-neutral-600 hover:bg-neutral-100 focus:outline-none"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Store identity & Switcher */}
          <div className="relative">
            <button
              id="dashboard-store-switcher-btn"
              type="button"
              onClick={() => setStoreMenuOpen(!storeMenuOpen)}
              className="flex items-center gap-2.5 p-1 -m-1 rounded-xl hover:bg-neutral-50 transition-colors text-left focus:outline-none group"
              title="Click to switch active store"
            >
              <span className="w-9 h-9 rounded-xl bg-neutral-900 text-white flex items-center justify-center text-lg shadow-xs font-bold shrink-0">
                {currentTenant.logo}
              </span>
              <div className="leading-tight">
                <h1 className="text-sm font-bold text-neutral-900 tracking-tight flex items-center gap-1.5">
                  <span>{currentTenant.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-700 transition-colors" />
                </h1>
                <p className="text-xs text-neutral-500 hidden sm:block truncate max-w-[180px]">
                  {currentTenant.tagline}
                </p>
              </div>
            </button>

            {storeMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setStoreMenuOpen(false)} />
                <div className="absolute left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-neutral-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                    Switch Active Store
                  </div>
                  {availableTenants.map(tenant => (
                    <button
                      key={tenant.id}
                      type="button"
                      onClick={() => {
                        switchTenant(tenant.id);
                        setStoreMenuOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-neutral-50 transition-colors ${
                        tenant.id === currentTenant.id ? 'bg-emerald-50/60' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className="w-7 h-7 rounded-lg bg-neutral-900 text-white flex items-center justify-center text-sm font-bold shrink-0">
                          {tenant.logo}
                        </span>
                        <div className="truncate">
                          <p className="text-xs font-bold text-neutral-900 truncate">{tenant.name}</p>
                          <p className="text-[10px] text-neutral-400 truncate">{tenant.categoryTheme}</p>
                        </div>
                      </div>
                      {tenant.id === currentTenant.id && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                    </button>
                  ))}
                  <div className="border-t border-neutral-100 my-1 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setStoreMenuOpen(false);
                        navigate('/dashboard/settings');
                      }}
                      className="w-full px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 flex items-center gap-2 font-medium"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>Manage All Stores & Domains</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Global Search & Quick Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile search button */}
          <button
            id="mobile-search-btn"
            type="button"
            onClick={() => setCommandPaletteOpen(true)}
            className="md:hidden p-2 rounded-lg text-neutral-600 hover:bg-neutral-100 transition-colors"
            title="Search (⌘K)"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Desktop Search bar button */}
          <button
            id="dashboard-global-search-btn"
            type="button"
            onClick={() => setCommandPaletteOpen(true)}
            className="hidden md:flex items-center justify-between w-64 lg:w-80 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-lg px-3 py-1.5 text-xs text-neutral-500 hover:text-neutral-900 transition-colors text-left group"
          >
            <div className="flex items-center gap-2 truncate">
              <Search className="w-4 h-4 text-neutral-400 group-hover:text-neutral-600 shrink-0" />
              <span className="truncate">Search products, orders, customers...</span>
            </div>
            <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold text-neutral-400 bg-white border border-neutral-200 rounded shadow-2xs">
              <span className="text-[9px]">⌘</span>K
            </kbd>
          </button>

          {/* Quick Create Action Button */}
          <div className="relative">
            <button
              id="dashboard-quick-add-btn"
              type="button"
              onClick={() => setQuickActionOpen(!quickActionOpen)}
              className="flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Create</span>
            </button>

            {quickActionOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setQuickActionOpen(false)} />
                <div className="absolute right-0 mt-2 w-48 bg-white border border-neutral-200 rounded-xl shadow-xl py-1 z-50 animate-in fade-in zoom-in-95">
                  <button
                    id="quick-add-product"
                    type="button"
                    onClick={() => {
                      navigate('/dashboard/products/new');
                      setQuickActionOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-neutral-700 hover:bg-neutral-50 flex items-center gap-2"
                  >
                    <Package className="w-4 h-4 text-emerald-600" />
                    <span>Add New Product</span>
                  </button>
                  <button
                    id="quick-create-catalogue"
                    type="button"
                    onClick={() => {
                      navigate('/dashboard/catalogues/new');
                      setQuickActionOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-neutral-700 hover:bg-neutral-50 flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    <span>Create Catalogue</span>
                  </button>
                  <button
                    id="quick-create-coupon"
                    type="button"
                    onClick={() => {
                      navigate('/dashboard/coupons');
                      setQuickActionOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-neutral-700 hover:bg-neutral-50 flex items-center gap-2"
                  >
                    <TicketPercent className="w-4 h-4 text-amber-600" />
                    <span>Create Discount Coupon</span>
                  </button>
                  <button
                    id="quick-send-whatsapp"
                    type="button"
                    onClick={() => {
                      navigate('/dashboard/whatsapp');
                      setQuickActionOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-neutral-700 hover:bg-neutral-50 flex items-center gap-2 border-t border-neutral-100"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-500" />
                    <span>WhatsApp Broadcast</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* View Storefront Link */}
          <button
            id="header-preview-store-btn"
            type="button"
            onClick={() => navigate(`/store/${currentTenant.slug}`)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-medium text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
            title="Preview Live Storefront in Customer View"
          >
            <span className="hidden sm:inline">View Store</span>
            <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              id="notifications-bell-btn"
              type="button"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-lg text-neutral-600 hover:bg-neutral-100 transition-colors"
            >
              <Bell className="w-4 h-4" />
              {pendingOrdersCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
              )}
            </button>

            {notificationsOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-neutral-200 rounded-xl shadow-2xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-neutral-100 flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700">Notifications</h3>
                    <span className="text-[10px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded font-medium">
                      {pendingOrdersCount} action items
                    </span>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-neutral-100">
                    <div className="p-3 hover:bg-neutral-50 text-xs flex gap-3 cursor-pointer" onClick={() => { navigate('/dashboard/orders'); setNotificationsOpen(false); }}>
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <ShoppingBag className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-neutral-900">New order #ORD-1024 confirmed</p>
                        <p className="text-neutral-500 text-[11px]">Rahul Kumar placed order for ₹3,568 via UPI.</p>
                        <span className="text-[10px] text-neutral-400">7:15 AM today</span>
                      </div>
                    </div>

                    <div className="p-3 hover:bg-neutral-50 text-xs flex gap-3 cursor-pointer" onClick={() => { navigate('/dashboard/inventory'); setNotificationsOpen(false); }}>
                      <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                        <Boxes className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-neutral-900">Low Stock Alert: Insulated Flask</p>
                        <p className="text-neutral-500 text-[11px]">Stock reached 9 units (Threshold is 15 units).</p>
                        <span className="text-[10px] text-neutral-400">Yesterday</span>
                      </div>
                    </div>

                    <div className="p-3 hover:bg-neutral-50 text-xs flex gap-3 cursor-pointer" onClick={() => { navigate('/dashboard/live-visitors'); setNotificationsOpen(false); }}>
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                        <Activity className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-neutral-900">Live Traffic Spike</p>
                        <p className="text-neutral-500 text-[11px]">18 shoppers currently browsing your catalogue.</p>
                        <span className="text-[10px] text-neutral-400">Live now</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-2 border-t border-neutral-100 text-center">
                    <button
                      type="button"
                      onClick={() => { navigate('/dashboard/orders'); setNotificationsOpen(false); }}
                      className="text-xs text-indigo-600 font-semibold hover:underline"
                    >
                      View All Orders & Alerts
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              id="dashboard-user-avatar-btn"
              type="button"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 p-1 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80"
                alt="Suresh Singhania"
                className="w-8 h-8 rounded-full object-cover border border-neutral-200"
              />
              <span className="hidden md:block text-xs font-semibold text-neutral-800 text-left">
                Suresh S.
              </span>
            </button>

            {userMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                <div className="absolute right-0 mt-2 w-56 bg-white border border-neutral-200 rounded-xl shadow-xl py-1 z-50">
                  <div className="px-4 py-2 border-b border-neutral-100">
                    <p className="text-xs font-bold text-neutral-900">Suresh Singhania</p>
                    <p className="text-[11px] text-neutral-500 truncate">suresh@dailyneeddeals.in</p>
                    <span className="inline-block mt-1 px-1.5 py-0.2 rounded text-[10px] font-semibold bg-neutral-100 text-neutral-700">
                      Store Owner
                    </span>
                  </div>
                  <button
                    id="user-menu-store-settings"
                    type="button"
                    onClick={() => { navigate('/dashboard/settings'); setUserMenuOpen(false); }}
                    className="w-full text-left px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 flex items-center gap-2"
                  >
                    <Settings className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Store Settings</span>
                  </button>
                  <button
                    id="user-menu-billing"
                    type="button"
                    onClick={() => { navigate('/dashboard/billing'); setUserMenuOpen(false); }}
                    className="w-full text-left px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 flex items-center gap-2"
                  >
                    <BillingIcon className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Plan & Billing</span>
                  </button>
                  <button
                    id="user-menu-signout"
                    type="button"
                    onClick={() => { navigate('/'); setUserMenuOpen(false); }}
                    className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 border-t border-neutral-100"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Back to Marketing Site</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Desktop Left Sidebar */}
        <aside
          className={`hidden md:flex flex-col bg-white border-r border-neutral-200 transition-all duration-200 shrink-0 ${
            collapsed ? 'w-16' : 'w-64'
          }`}
        >
          {/* Collapse Toggle */}
          <div className="h-10 px-3 border-b border-neutral-100 flex items-center justify-between text-neutral-400">
            {!collapsed && <span className="text-[10px] font-bold tracking-wider uppercase">Menu</span>}
            <button
              id="sidebar-toggle-collapse-btn"
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              className="p-1 rounded hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 transition-colors ml-auto"
              title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
            {navSections.map((section) => (
              <div key={section.label}>
                {!collapsed && (
                  <div className="px-3 mb-1.5 text-[10px] font-bold text-neutral-400 tracking-wider">
                    {section.label}
                  </div>
                )}
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const active = isActive(item.path);
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.path}
                        id={`nav-${item.path.replace(/\//g, '-')}`}
                        type="button"
                        onClick={() => handleNavClick(item.path)}
                        title={collapsed ? item.label : undefined}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all group relative ${
                          active
                            ? 'bg-neutral-900 text-white shadow-xs'
                            : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                        }`}
                      >
                        <Icon
                          className={`w-4 h-4 shrink-0 transition-colors ${
                            active
                              ? 'text-white'
                              : item.highlight
                              ? 'text-indigo-600'
                              : 'text-neutral-500 group-hover:text-neutral-900'
                          }`}
                        />
                        {!collapsed && (
                          <div className="flex-1 flex items-center justify-between truncate">
                            <span className="truncate">{item.label}</span>
                            {item.badge && (
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                                  item.badgeColor
                                    ? `${item.badgeColor} text-white`
                                    : active
                                    ? 'bg-neutral-800 text-neutral-200'
                                    : 'bg-neutral-100 text-neutral-600'
                                }`}
                              >
                                {item.badge}
                              </span>
                            )}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Store switcher bottom card */}
          {!collapsed && (
            <div className="p-3 border-t border-neutral-100 bg-neutral-50">
              <div className="text-[10px] font-semibold text-neutral-500 mb-1">CURRENT STOREFRONT</div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-900 truncate">{currentTenant.name}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <p className="text-[10px] text-neutral-400 mt-0.5">{currentTenant.city}, {currentTenant.currencySymbol}</p>
            </div>
          )}
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div
              className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs"
              onClick={() => setMobileDrawerOpen(false)}
            />
            <div className="relative w-72 bg-white h-full flex flex-col shadow-2xl z-50">
              <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{currentTenant.logo}</span>
                  <span className="font-bold text-sm text-neutral-900">{currentTenant.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-4">
                {navSections.map((section) => (
                  <div key={section.label}>
                    <div className="px-3 mb-1 text-[10px] font-bold text-neutral-400 tracking-wider">
                      {section.label}
                    </div>
                    <div className="space-y-1">
                      {section.items.map((item) => {
                        const active = isActive(item.path);
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.path}
                            type="button"
                            onClick={() => handleNavClick(item.path)}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium ${
                              active ? 'bg-neutral-900 text-white' : 'text-neutral-700 hover:bg-neutral-100'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <Icon className="w-4 h-4" />
                              <span>{item.label}</span>
                            </div>
                            {item.badge && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-neutral-200 text-neutral-800">
                                {item.badge}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 border-t border-neutral-200 bg-neutral-50">
                <button
                  type="button"
                  onClick={() => {
                    navigate(`/store/${currentTenant.slug}`);
                    setMobileDrawerOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-neutral-900 text-white rounded-lg text-xs font-semibold"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Preview Customer Store</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-neutral-100 p-4 sm:p-6 lg:p-8 pb-20 md:pb-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (Home, Orders, Products, Analytics, More) as requested in Section 35 */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-neutral-200 h-16 flex items-center justify-around px-2 shadow-lg">
        <button
          id="mobile-tab-home"
          type="button"
          onClick={() => navigate('/dashboard/overview')}
          className={`flex flex-col items-center justify-center w-14 py-1 text-[10px] font-medium transition-colors ${
            isActive('/dashboard/overview') ? 'text-neutral-900 font-bold' : 'text-neutral-500'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span>Home</span>
        </button>

        <button
          id="mobile-tab-orders"
          type="button"
          onClick={() => navigate('/dashboard/orders')}
          className={`flex flex-col items-center justify-center w-14 py-1 text-[10px] font-medium relative transition-colors ${
            isActive('/dashboard/orders') ? 'text-neutral-900 font-bold' : 'text-neutral-500'
          }`}
        >
          <ShoppingBag className="w-5 h-5 mb-0.5" />
          <span>Orders</span>
          {pendingOrdersCount > 0 && (
            <span className="absolute top-0 right-3 w-2 h-2 rounded-full bg-amber-500" />
          )}
        </button>

        <button
          id="mobile-tab-products"
          type="button"
          onClick={() => navigate('/dashboard/products')}
          className={`flex flex-col items-center justify-center w-14 py-1 text-[10px] font-medium transition-colors ${
            isActive('/dashboard/products') ? 'text-neutral-900 font-bold' : 'text-neutral-500'
          }`}
        >
          <Package className="w-5 h-5 mb-0.5" />
          <span>Products</span>
        </button>

        <button
          id="mobile-tab-analytics"
          type="button"
          onClick={() => navigate('/dashboard/analytics')}
          className={`flex flex-col items-center justify-center w-14 py-1 text-[10px] font-medium transition-colors ${
            isActive('/dashboard/analytics') ? 'text-neutral-900 font-bold' : 'text-neutral-500'
          }`}
        >
          <BarChart3 className="w-5 h-5 mb-0.5" />
          <span>Analytics</span>
        </button>

        <button
          id="mobile-tab-more"
          type="button"
          onClick={() => setMobileDrawerOpen(true)}
          className="flex flex-col items-center justify-center w-14 py-1 text-[10px] font-medium text-neutral-500 hover:text-neutral-900"
        >
          <Menu className="w-5 h-5 mb-0.5" />
          <span>More</span>
        </button>
      </nav>

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </div>
  );
};
