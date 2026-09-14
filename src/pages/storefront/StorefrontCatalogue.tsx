import React, { useState } from 'react';
import { useRouter } from '../../context/RouterContext';
import { useStore } from '../../context/StoreContext';
import {
  BookOpen,
  Share2,
  ShoppingBag,
  MessageSquare,
  Search,
  Filter,
  Layers,
  ArrowRight,
  Plus,
  Minus,
  Check,
} from 'lucide-react';
import { Product } from '../../types';

interface StorefrontCatalogueProps {
  onOpenCart: () => void;
}

export const StorefrontCatalogue: React.FC<StorefrontCatalogueProps> = ({ onOpenCart }) => {
  const { params, navigate } = useRouter();
  const { catalogues, products, currentTenant, addToCart, cart, b2bModeActive, addToast } = useStore();

  const catalogue = catalogues.find((c) => c.slug === params.catalogueSlug);

  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  if (!catalogue) {
    return (
      <div className="py-20 text-center max-w-md mx-auto">
        <h2 className="text-base font-bold text-neutral-900">Catalogue Not Found</h2>
        <p className="text-xs text-neutral-500 mt-1">This digital collection does not exist or has expired.</p>
        <button
          type="button"
          onClick={() => navigate(`/store/${currentTenant.slug}`)}
          className="mt-4 px-4 py-2 bg-neutral-900 text-white rounded-lg text-xs font-semibold"
        >
          Go to Store
        </button>
      </div>
    );
  }

  const catalogueProducts = products.filter((p) => catalogue.productIds.includes(p.id));

  const filteredProducts = catalogueProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase())
  );

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = cart.reduce((sum, i) => {
    const p = b2bModeActive && i.product.wholesalePrice ? i.product.wholesalePrice : i.product.salePrice || i.product.price;
    return sum + p * i.quantity;
  }, 0);

  const handleWhatsAppCatalogueOrder = () => {
    if (cart.length === 0) {
      addToast('Please add items to your cart first', 'info');
      return;
    }
    const items = cart
      .map((i) => `• ${i.quantity}x ${i.product.name} (₹${i.product.salePrice || i.product.price})`)
      .join('\n');
    const msg = encodeURIComponent(
      `Hello ${currentTenant.name}! I am browsing your *${catalogue.name}* catalogue and would like to order:\n\n${items}\n\n*Total Amount:* ₹${cartTotal}\n\nPlease confirm availability!`
    );
    window.open(`https://wa.me/${currentTenant.supportPhone.replace(/[^0-9]/g, '')}?text=${msg}`, '_blank');
  };

  const handleShareCatalogue = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast('Catalogue link copied! Ready to paste in WhatsApp', 'success');
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Hero Banner for Digital Catalogue */}
      <div className="relative rounded-2xl overflow-hidden bg-neutral-900 text-white min-h-[240px] flex items-center p-6 sm:p-10">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay"
          style={{ backgroundImage: `url(${catalogue.coverImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent" />

        <div className="relative max-w-xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md border border-white/20 text-white">
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span>Digital Collection · {catalogue.productIds.length} Curated Products</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{catalogue.name}</h1>
          <p className="text-xs text-neutral-300 leading-relaxed">{catalogue.description}</p>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleShareCatalogue}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 border border-white/20 flex items-center gap-1.5 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Catalogue</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and layout controls */}
      <div className="bg-white rounded-xl border border-neutral-200 p-3.5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search within this catalogue..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-neutral-50 border border-neutral-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-neutral-900"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
          <span className="text-neutral-500 font-medium">Layout:</span>
          <div className="flex bg-neutral-100 p-0.5 rounded-lg">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`px-2.5 py-1 rounded-md font-semibold ${viewMode === 'grid' ? 'bg-white shadow-xs text-neutral-900' : 'text-neutral-600'}`}
            >
              Grid
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1 rounded-md font-semibold ${viewMode === 'table' ? 'bg-white shadow-xs text-neutral-900' : 'text-neutral-600'}`}
            >
              B2B Sheet
            </button>
          </div>
        </div>
      </div>

      {/* Products Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((p) => {
            const price = b2bModeActive && p.wholesalePrice ? p.wholesalePrice : p.salePrice || p.price;
            return (
              <div
                key={p.id}
                className="bg-white rounded-xl border border-neutral-200 overflow-hidden p-3 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div
                    onClick={() => navigate(`/store/${currentTenant.slug}/product/${p.slug}`)}
                    className="aspect-square bg-neutral-100 rounded-lg overflow-hidden cursor-pointer"
                  >
                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                  </div>
                  <div className="mt-2">
                    <span className="text-[10px] text-neutral-400 font-semibold">{p.brand}</span>
                    <h3
                      onClick={() => navigate(`/store/${currentTenant.slug}/product/${p.slug}`)}
                      className="text-xs font-bold text-neutral-900 truncate hover:text-indigo-600 cursor-pointer"
                    >
                      {p.name}
                    </h3>
                    <div className="text-xs font-bold text-neutral-900 mt-1">
                      ₹{price.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    addToCart(p, 1);
                    onOpenCart();
                  }}
                  className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Bag</span>
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        /* B2B Table Sheet Mode */
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 text-neutral-500 font-semibold border-b border-neutral-100">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Unit Rate</th>
                <th className="px-4 py-3 text-right">Quick Order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredProducts.map((p) => {
                const price = b2bModeActive && p.wholesalePrice ? p.wholesalePrice : p.salePrice || p.price;
                return (
                  <tr key={p.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3 flex items-center gap-3">
                      <img src={p.images[0]} alt={p.name} className="w-10 h-10 rounded-lg object-cover border" />
                      <div>
                        <div className="font-bold text-neutral-900">{p.name}</div>
                        <div className="text-[11px] text-neutral-400">{p.brand}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-neutral-600">{p.sku}</td>
                    <td className="px-4 py-3 font-semibold text-emerald-600">{p.stock} in stock</td>
                    <td className="px-4 py-3 font-bold text-neutral-900">₹{price.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          addToCart(p, 1);
                          onOpenCart();
                        }}
                        className="px-3 py-1 bg-neutral-900 text-white font-semibold rounded-lg hover:bg-neutral-800"
                      >
                        + Add
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Floating WhatsApp Sticky Action Bar */}
      {cartCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 max-w-2xl mx-auto z-40 bg-neutral-950 text-white rounded-2xl p-3 sm:p-4 shadow-2xl border border-neutral-800 flex items-center justify-between gap-3 animate-in slide-in-from-bottom-4">
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              <span>{cartCount} item(s) in bag</span>
            </div>
            <div className="text-xs text-neutral-300">
              Total: <strong className="text-white">₹{cartTotal.toLocaleString('en-IN')}</strong>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleWhatsAppCatalogueOrder}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Order via WhatsApp</span>
              <span className="sm:hidden">WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={onOpenCart}
              className="px-3.5 py-2 bg-white text-neutral-950 hover:bg-neutral-100 rounded-xl text-xs font-bold"
            >
              View Bag
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
