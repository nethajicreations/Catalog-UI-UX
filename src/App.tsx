import React, { useState, useEffect } from 'react';
import { RouterProvider, useRouter } from './context/RouterContext';
import { StoreProvider, useStore } from './context/StoreContext';
import { DashboardShell } from './components/dashboard/DashboardShell';
import { ToastContainer } from './components/ui/ToastContainer';

// Dashboard Pages
import { DashboardOverview } from './pages/dashboard/DashboardOverview';
import { ProductsList } from './pages/dashboard/ProductsList';
import { ProductForm } from './pages/dashboard/ProductForm';
import { ProductDetails } from './pages/dashboard/ProductDetails';
import { CategoriesPage } from './pages/dashboard/CategoriesPage';
import { CataloguesList } from './pages/dashboard/CataloguesList';
import { CatalogueBuilder } from './pages/dashboard/CatalogueBuilder';
import { OrdersList } from './pages/dashboard/OrdersList';
import { OrderDetails } from './pages/dashboard/OrderDetails';
import { InventoryPage } from './pages/dashboard/InventoryPage';
import { CustomersPage } from './pages/dashboard/CustomersPage';
import { WhatsAppCommerce } from './pages/dashboard/WhatsAppCommerce';
import { AnalyticsPage } from './pages/dashboard/AnalyticsPage';
import { StoreCustomizer } from './pages/dashboard/StoreCustomizer';
import { SettingsPage } from './pages/dashboard/SettingsPage';

// Storefront Pages & Components
import { StorefrontHeader } from './components/storefront/StorefrontHeader';
import { StorefrontCartDrawer } from './components/storefront/StorefrontCartDrawer';
import { StorefrontHome } from './pages/storefront/StorefrontHome';
import { StorefrontProduct } from './pages/storefront/StorefrontProduct';
import { StorefrontCatalogue } from './pages/storefront/StorefrontCatalogue';
import { StorefrontCategory } from './pages/storefront/StorefrontCategory';

import {
  Store,
  LayoutDashboard,
  ExternalLink,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';

const AppRouter: React.FC = () => {
  const { path, currentPath, navigate, params } = useRouter();
  const { currentTenant } = useStore();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const activePath = path || currentPath || '/';

  // Default redirect from root to dashboard overview
  useEffect(() => {
    if (activePath === '/' || activePath === '') {
      navigate('/dashboard/overview');
    }
  }, [activePath, navigate]);

  const isStorefront = activePath.startsWith('/store');

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col">
      {/* Quick Environment Switcher Banner for previewing & testing */}
      <div className="bg-neutral-900 text-neutral-300 text-[11px] px-4 py-1.5 flex items-center justify-between border-b border-neutral-800 z-50">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="font-semibold text-white tracking-wide">CatalogPro Commerce Suite</span>
          <span className="text-neutral-500">|</span>
          <span className="text-neutral-400">Current Store: <strong className="text-white">{currentTenant.name}</strong></span>
        </div>

        <div className="flex items-center gap-2">
          {isStorefront ? (
            <button
              type="button"
              onClick={() => navigate('/dashboard/overview')}
              className="flex items-center gap-1.5 bg-neutral-800 hover:bg-neutral-700 text-white px-2.5 py-0.5 rounded text-[11px] font-semibold transition-colors"
            >
              <LayoutDashboard className="w-3 h-3 text-indigo-400" />
              <span>Switch to Merchant Admin</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate(`/store/${currentTenant.slug}`)}
              className="flex items-center gap-1.5 bg-neutral-800 hover:bg-neutral-700 text-white px-2.5 py-0.5 rounded text-[11px] font-semibold transition-colors"
            >
              <Store className="w-3 h-3 text-emerald-400" />
              <span>Preview Live Storefront</span>
              <ExternalLink className="w-3 h-3 text-neutral-400" />
            </button>
          )}
        </div>
      </div>

      {/* Storefront Layout */}
      {isStorefront ? (
        <div className="flex-1 flex flex-col min-h-screen">
          <StorefrontHeader onOpenCart={() => setIsCartOpen(true)} />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6">
            {!activePath.includes('/product/') &&
              !activePath.includes('/catalogue/') &&
              !activePath.includes('/category/') && (
                <StorefrontHome onOpenCart={() => setIsCartOpen(true)} />
              )}

            {activePath.includes('/product/') && (
              <StorefrontProduct onOpenCart={() => setIsCartOpen(true)} />
            )}

            {activePath.includes('/catalogue/') && (
              <StorefrontCatalogue onOpenCart={() => setIsCartOpen(true)} />
            )}

            {activePath.includes('/category/') && (
              <StorefrontCategory onOpenCart={() => setIsCartOpen(true)} />
            )}
          </main>

          <StorefrontCartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </div>
      ) : (
        /* Dashboard Layout */
        <DashboardShell>
          {(activePath === '/dashboard/overview' || activePath === '/dashboard') && <DashboardOverview />}
          {activePath === '/dashboard/products' && <ProductsList />}
          {activePath === '/dashboard/products/new' && <ProductForm />}
          {activePath.startsWith('/dashboard/products/') && activePath.endsWith('/edit') && <ProductForm />}
          {activePath.startsWith('/dashboard/products/') && !activePath.endsWith('/edit') && !activePath.endsWith('/new') && <ProductDetails />}
          {activePath === '/dashboard/categories' && <CategoriesPage />}
          {activePath === '/dashboard/catalogues' && <CataloguesList />}
          {activePath === '/dashboard/catalogues/new' && <CatalogueBuilder />}
          {activePath.startsWith('/dashboard/catalogues/') && activePath.endsWith('/edit') && <CatalogueBuilder />}
          {activePath === '/dashboard/orders' && <OrdersList />}
          {activePath.startsWith('/dashboard/orders/') && <OrderDetails />}
          {activePath === '/dashboard/inventory' && <InventoryPage />}
          {activePath === '/dashboard/customers' && <CustomersPage />}
          {activePath === '/dashboard/whatsapp' && <WhatsAppCommerce />}
          {activePath === '/dashboard/analytics' && <AnalyticsPage />}
          {activePath === '/dashboard/customizer' && <StoreCustomizer />}
          {activePath === '/dashboard/settings' && <SettingsPage />}
        </DashboardShell>
      )}

      {/* Global Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <RouterProvider>
      <StoreProvider>
        <AppRouter />
      </StoreProvider>
    </RouterProvider>
  );
}
