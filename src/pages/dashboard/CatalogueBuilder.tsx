import React, { useState, useEffect } from 'react';
import { useRouter } from '../../context/RouterContext';
import { useStore } from '../../context/StoreContext';
import {
  ArrowLeft,
  Save,
  Eye,
  Smartphone,
  Tablet,
  Monitor,
  Share2,
  Check,
  Plus,
  BookOpen,
  MessageSquare,
  Sparkles,
  Layers,
  Palette,
  ExternalLink,
} from 'lucide-react';
import { Catalogue } from '../../types';

export const CatalogueBuilder: React.FC = () => {
  const { navigate, params } = useRouter();
  const { catalogues, products, categories, currentTenant, addCatalogue, updateCatalogue, addToast } = useStore();

  const isEditing = Boolean(params.catalogueId);
  const existingCat = isEditing ? catalogues.find((c) => c.id === params.catalogueId) : null;

  // Builder States
  const [name, setName] = useState(existingCat?.name || 'Festive Deals & Smart Tech 2026');
  const [description, setDescription] = useState(
    existingCat?.description || 'Curated consumer tech and home upgrades handpicked for festive season shoppers.'
  );
  const [coverImage, setCoverImage] = useState(
    existingCat?.coverImage || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80'
  );
  const [customerAccess, setCustomerAccess] = useState<Catalogue['customerAccess']>(
    existingCat?.customerAccess || 'public'
  );
  const [pricingMode, setPricingMode] = useState<Catalogue['pricingMode']>(
    existingCat?.pricingMode || 'retail'
  );
  const [layoutStyle, setLayoutStyle] = useState<Catalogue['layoutStyle']>(
    existingCat?.layoutStyle || 'grid_modern'
  );
  const [primaryColor, setPrimaryColor] = useState(existingCat?.primaryColor || '#059669');
  const [showPrices, setShowPrices] = useState(existingCat ? existingCat.showPrices : true);
  const [allowDirectOrder, setAllowDirectOrder] = useState(existingCat ? existingCat.allowDirectOrder : true);
  const [enableWhatsAppCheckout, setEnableWhatsAppCheckout] = useState(
    existingCat ? existingCat.enableWhatsAppCheckout : true
  );
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(
    existingCat ? existingCat.productIds : products.slice(0, 5).map((p) => p.id)
  );

  // Device preview mode
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const selectedProducts = products.filter((p) => selectedProductIds.includes(p.id));

  const handleToggleProduct = (id: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    if (!name.trim()) {
      addToast('Please enter a catalogue title', 'error');
      return;
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const catPayload = {
      name,
      slug: existingCat ? existingCat.slug : slug,
      description,
      coverImage,
      productIds: selectedProductIds,
      categoryIds: ['cat_electronics'],
      customerAccess,
      pricingMode,
      visibility: 'published' as const,
      layoutStyle,
      primaryColor,
      showPrices,
      allowDirectOrder,
      enableWhatsAppCheckout,
      viewCount: existingCat?.viewCount || 0,
    };

    if (isEditing && existingCat) {
      updateCatalogue(existingCat.id, catPayload);
      navigate('/dashboard/catalogues');
    } else {
      addCatalogue(catPayload);
      navigate('/dashboard/catalogues');
    }
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Top Builder Control Header */}
      <div className="bg-white border border-neutral-200 rounded-xl p-3.5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard/catalogues')}
            className="p-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 text-neutral-600"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <span>Visual Catalogue Builder</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700">
                Live Preview
              </span>
            </h1>
            <p className="text-[11px] text-neutral-500">
              Changes reflect instantly in the interactive preview below.
            </p>
          </div>
        </div>

        {/* Center Viewport Switcher */}
        <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-lg self-center">
          <button
            type="button"
            onClick={() => setPreviewDevice('desktop')}
            className={`p-1.5 rounded-md ${
              previewDevice === 'desktop' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500'
            }`}
            title="Desktop View"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setPreviewDevice('tablet')}
            className={`p-1.5 rounded-md ${
              previewDevice === 'tablet' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500'
            }`}
            title="Tablet View"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setPreviewDevice('mobile')}
            className={`p-1.5 rounded-md ${
              previewDevice === 'mobile' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500'
            }`}
            title="Mobile Phone View"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        {/* Save Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/dashboard/catalogues')}
            className="px-3 py-1.5 border border-neutral-200 text-neutral-700 hover:bg-neutral-50 rounded-lg text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            id="catalogue-save-btn"
            type="button"
            onClick={handleSave}
            className="px-4 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save & Publish</span>
          </button>
        </div>
      </div>

      {/* 3-Panel Visual Builder Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Panel: Content Configuration (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-neutral-200 p-4 shadow-xs space-y-4 max-h-[85vh] overflow-y-auto">
          <h2 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">Catalogue Setup</h2>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">Catalogue Title</label>
            <input
              id="catalogue-title-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">Header Subtitle</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-lg p-2.5 text-xs text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">Cover Banner URL</label>
            <input
              type="text"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">Customer Audience</label>
            <select
              value={customerAccess}
              onChange={(e) => setCustomerAccess(e.target.value as any)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs text-neutral-900"
            >
              <option value="public">Public (Everyone)</option>
              <option value="b2b_only">B2B Wholesale Only</option>
              <option value="vip_only">VIP Corporate Clients</option>
              <option value="private">Private (Password Protected)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">Pricing Display Mode</label>
            <select
              value={pricingMode}
              onChange={(e) => setPricingMode(e.target.value as any)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs text-neutral-900"
            >
              <option value="retail">Standard Retail MRP</option>
              <option value="wholesale">B2B Wholesale / Distributor Rates</option>
              <option value="inquire_only">Inquire Only (Hide Numeric Prices)</option>
            </select>
          </div>

          {/* Feature Toggles */}
          <div className="space-y-2 pt-2 border-t border-neutral-100 text-xs">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-neutral-700 font-medium">Show Numeric Prices</span>
              <input
                type="checkbox"
                checked={showPrices}
                onChange={(e) => setShowPrices(e.target.checked)}
                className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
              >
              </input>
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-neutral-700 font-medium">Allow Direct Ordering</span>
              <input
                type="checkbox"
                checked={allowDirectOrder}
                onChange={(e) => setAllowDirectOrder(e.target.checked)}
                className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
              >
              </input>
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-neutral-700 font-medium">WhatsApp Quick Order</span>
              <input
                type="checkbox"
                checked={enableWhatsAppCheckout}
                onChange={(e) => setEnableWhatsAppCheckout(e.target.checked)}
                className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
              >
              </input>
            </label>
          </div>
        </div>

        {/* Center: Live Interactive Preview (6 cols) */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div
            className={`w-full bg-neutral-900/5 rounded-2xl p-3 transition-all duration-300 border border-neutral-300/60 ${
              previewDevice === 'mobile'
                ? 'max-w-sm'
                : previewDevice === 'tablet'
                ? 'max-w-xl'
                : 'max-w-full'
            }`}
          >
            {/* Mock device viewport */}
            <div className="bg-white rounded-xl shadow-md border border-neutral-200 overflow-hidden min-h-[500px]">
              {/* Catalogue Hero Section */}
              <div
                className="relative p-5 text-white bg-cover bg-center"
                style={{
                  backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.85)), url(${coverImage})`,
                  backgroundColor: primaryColor,
                }}
              >
                <div className="flex items-center justify-between text-[11px] mb-4">
                  <span className="bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded font-semibold">
                    {currentTenant.name}
                  </span>
                  <span className="bg-emerald-500/90 text-white px-2 py-0.5 rounded font-bold">
                    {pricingMode.toUpperCase()}
                  </span>
                </div>

                <h2 className="text-base sm:text-lg font-bold leading-tight">{name}</h2>
                <p className="text-xs text-neutral-200 mt-1 line-clamp-2">{description}</p>

                <div className="mt-3 flex items-center gap-2">
                  <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded">
                    {selectedProducts.length} Items Listed
                  </span>
                  {enableWhatsAppCheckout && (
                    <span className="text-[11px] bg-emerald-500 text-white px-2 py-0.5 rounded font-bold flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" /> WhatsApp Order
                    </span>
                  )}
                </div>
              </div>

              {/* Rendered Layout in Preview */}
              <div className="p-4">
                <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-3">
                  Catalogue Items ({selectedProducts.length})
                </div>

                {layoutStyle === 'compact_b2b' ? (
                  // Compact B2B Wholesale Table
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-neutral-100 text-neutral-600">
                        <tr>
                          <th className="p-2">Item</th>
                          <th className="p-2">SKU</th>
                          <th className="p-2">Rate</th>
                          <th className="p-2 text-right">Order</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100">
                        {selectedProducts.map((p) => (
                          <tr key={p.id}>
                            <td className="p-2 flex items-center gap-2">
                              <img src={p.images[0]} alt={p.name} className="w-8 h-8 rounded object-cover" />
                              <span className="font-semibold text-neutral-900 truncate max-w-[120px]">{p.name}</span>
                            </td>
                            <td className="p-2 font-mono text-[10px] text-neutral-400">{p.sku}</td>
                            <td className="p-2 font-bold text-indigo-700">
                              ₹{(p.wholesalePrice || p.salePrice || p.price).toLocaleString('en-IN')}
                            </td>
                            <td className="p-2 text-right">
                              <button
                                type="button"
                                className="bg-neutral-900 text-white px-2 py-1 rounded text-[10px] font-bold"
                              >
                                + Add
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  // Grid Modern / Magazine cards
                  <div
                    className={`grid gap-3 ${
                      previewDevice === 'mobile'
                        ? 'grid-cols-1'
                        : layoutStyle === 'magazine'
                        ? 'grid-cols-1 sm:grid-cols-2'
                        : 'grid-cols-2 sm:grid-cols-3'
                    }`}
                  >
                    {selectedProducts.map((p) => (
                      <div
                        key={p.id}
                        className="bg-neutral-50 border border-neutral-200 rounded-xl overflow-hidden p-2.5 flex flex-col justify-between"
                      >
                        <div>
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-full aspect-square rounded-lg object-cover mb-2"
                          />
                          <h4 className="text-xs font-bold text-neutral-900 line-clamp-1">{p.name}</h4>
                          <p className="text-[10px] text-neutral-500 font-mono">{p.sku}</p>
                        </div>

                        <div className="mt-2 flex items-center justify-between pt-1 border-t border-neutral-200">
                          {showPrices ? (
                            <span className="text-xs font-bold text-neutral-900">
                              ₹{(pricingMode === 'wholesale' && p.wholesalePrice ? p.wholesalePrice : p.salePrice || p.price).toLocaleString('en-IN')}
                            </span>
                          ) : (
                            <span className="text-[10px] text-neutral-500 font-semibold">Contact for Price</span>
                          )}

                          {allowDirectOrder && (
                            <button
                              type="button"
                              className="text-[10px] font-bold px-2 py-0.5 rounded text-white"
                              style={{ backgroundColor: primaryColor }}
                            >
                              Inquire
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Layout & Product Checklist (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-neutral-200 p-4 shadow-xs space-y-4 max-h-[85vh] overflow-y-auto">
          <h2 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">Design & Layout</h2>

          {/* Layout style picker */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Visual Layout Style</label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'grid_modern', label: 'Grid Modern' },
                { id: 'compact_b2b', label: 'Compact B2B' },
                { id: 'magazine', label: 'Magazine Look' },
                { id: 'showcase_slider', label: 'Showcase' },
              ].map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setLayoutStyle(style.id as any)}
                  className={`p-2 rounded-lg border text-left text-xs font-medium transition-all ${
                    layoutStyle === style.id
                      ? 'border-neutral-900 bg-neutral-900 text-white font-bold'
                      : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          {/* Accent color picker */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Accent Theme Color</label>
            <div className="flex items-center gap-2">
              {['#059669', '#6366f1', '#d97706', '#0284c7', '#dc2626', '#0f172a'].map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setPrimaryColor(color)}
                  className={`w-7 h-7 rounded-full border transition-all ${
                    primaryColor === color ? 'ring-2 ring-offset-2 ring-neutral-900 scale-110' : 'opacity-80'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Product Checklist */}
          <div className="pt-2 border-t border-neutral-100">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-neutral-700">Select Included Products</label>
              <span className="text-[10px] text-neutral-400">
                {selectedProductIds.length} / {products.length}
              </span>
            </div>

            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {products.map((p) => {
                const isChecked = selectedProductIds.includes(p.id);
                return (
                  <label
                    key={p.id}
                    className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                      isChecked ? 'bg-neutral-50 border-neutral-300 font-semibold' : 'border-neutral-100 hover:bg-neutral-50/50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleProduct(p.id)}
                      className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                    />
                    <img src={p.images[0]} alt={p.name} className="w-7 h-7 rounded object-cover shrink-0" />
                    <span className="truncate flex-1 text-neutral-800">{p.name}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
