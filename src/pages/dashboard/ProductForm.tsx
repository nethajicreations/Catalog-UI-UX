import React, { useState, useEffect } from 'react';
import { useRouter } from '../../context/RouterContext';
import { useStore } from '../../context/StoreContext';
import {
  ArrowLeft,
  Upload,
  Plus,
  Trash2,
  Check,
  Package,
  Layers,
  IndianRupee,
  Truck,
  Globe,
  Tag,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { Product } from '../../types';

export const ProductForm: React.FC = () => {
  const { navigate, params } = useRouter();
  const { products, categories, addProduct, updateProduct, addToast } = useStore();

  const isEditing = Boolean(params.productId);
  const existingProduct = isEditing ? products.find((p) => p.id === params.productId) : null;

  // Form states
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(1999);
  const [salePrice, setSalePrice] = useState<number | undefined>(1499);
  const [costPrice, setCostPrice] = useState<number>(750);
  const [stock, setStock] = useState<number>(50);
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(10);
  const [status, setStatus] = useState<'active' | 'draft'>('active');
  const [wholesalePrice, setWholesalePrice] = useState<number | undefined>(1100);
  const [b2bMinQty, setB2bMinQty] = useState<number | undefined>(10);
  const [weightKg, setWeightKg] = useState<number>(0.35);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  // Image media list
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
  ]);
  const [newImageUrl, setNewImageUrl] = useState('');

  // Preset stock photos for rapid prototype testing
  const sampleImages = [
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=800&q=80',
    'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80',
    'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&q=80',
  ];

  useEffect(() => {
    if (existingProduct) {
      setName(existingProduct.name);
      setSku(existingProduct.sku);
      setBrand(existingProduct.brand);
      setCategory(existingProduct.category);
      setTags(existingProduct.tags || []);
      setShortDescription(existingProduct.shortDescription || '');
      setDescription(existingProduct.description || '');
      setPrice(existingProduct.price);
      setSalePrice(existingProduct.salePrice);
      setCostPrice(existingProduct.costPrice);
      setStock(existingProduct.stock);
      setLowStockThreshold(existingProduct.lowStockThreshold);
      setStatus(existingProduct.status === 'archived' ? 'draft' : existingProduct.status);
      setWholesalePrice(existingProduct.wholesalePrice);
      setB2bMinQty(existingProduct.b2bMinQty);
      setWeightKg(existingProduct.weightKg || 0.3);
      setImages(existingProduct.images || []);
      setSeoTitle(existingProduct.seoTitle || existingProduct.name);
      setSeoDescription(existingProduct.seoDescription || existingProduct.shortDescription);
    } else if (categories.length > 0) {
      setCategory(categories[0].id);
      setSku('SKU-' + Math.floor(1000 + Math.random() * 9000));
    }
  }, [existingProduct, categories]);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim().toLowerCase())) {
      setTags([...tags, tagInput.trim().toLowerCase()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleAddImage = (urlToAdd?: string) => {
    const url = urlToAdd || newImageUrl.trim();
    if (url && !images.includes(url)) {
      setImages([...images, url]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (publishStatus: 'active' | 'draft') => {
    if (!name.trim()) {
      addToast('Please enter a product name', 'error');
      return;
    }
    if (!sku.trim()) {
      addToast('Please provide a SKU', 'error');
      return;
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const productPayload = {
      name,
      slug: existingProduct ? existingProduct.slug : slug,
      sku,
      category: category || categories[0]?.id || 'cat_electronics',
      brand: brand || 'Generic',
      price: Number(price) || 999,
      salePrice: salePrice ? Number(salePrice) : undefined,
      costPrice: Number(costPrice) || 500,
      stock: Number(stock) || 0,
      lowStockThreshold: Number(lowStockThreshold) || 10,
      status: publishStatus,
      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'],
      shortDescription,
      description,
      tags,
      rating: existingProduct?.rating || 4.8,
      reviewsCount: existingProduct?.reviewsCount || 1,
      wholesalePrice: wholesalePrice ? Number(wholesalePrice) : undefined,
      b2bMinQty: b2bMinQty ? Number(b2bMinQty) : undefined,
      weightKg: Number(weightKg) || 0.25,
      seoTitle: seoTitle || name,
      seoDescription: seoDescription || shortDescription,
    };

    if (isEditing && existingProduct) {
      updateProduct(existingProduct.id, productPayload);
      navigate(`/dashboard/products/${existingProduct.id}`);
    } else {
      const created = addProduct(productPayload);
      navigate(`/dashboard/products/${created.id}`);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard/products')}
            className="p-2 rounded-lg bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
              {isEditing ? `Edit "${existingProduct?.name}"` : 'Create New Product'}
            </h1>
            <p className="text-xs text-neutral-500">
              Configure product details, variants, B2B wholesale pricing, and media.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="product-save-draft-btn"
            type="button"
            onClick={() => handleSubmit('draft')}
            className="px-3.5 py-1.5 bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 rounded-lg text-xs font-semibold shadow-xs"
          >
            Save as Draft
          </button>
          <button
            id="product-publish-btn"
            type="button"
            onClick={() => handleSubmit('active')}
            className="px-4 py-1.5 bg-neutral-900 text-white hover:bg-neutral-800 rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>{isEditing ? 'Update & Publish' : 'Publish Product'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Basic Information */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <Package className="w-4 h-4 text-neutral-500" />
              <span>Basic Information</span>
            </h2>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Product Title <span className="text-rose-500">*</span>
              </label>
              <input
                id="product-title-input"
                type="text"
                placeholder='e.g. Apex Pro 1.96" AMOLED Bluetooth Calling Smartwatch'
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  SKU (Stock Keeping Unit) <span className="text-rose-500">*</span>
                </label>
                <input
                  id="product-sku-input"
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-xs font-mono text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Brand</label>
                <input
                  id="product-brand-input"
                  type="text"
                  placeholder="e.g. ApexTech"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Category</label>
                <select
                  id="product-category-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Tags</label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    placeholder="e.g. smartwatch, bestsellers"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    className="flex-1 bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-1.5 text-xs text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-2.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-xs font-semibold"
                  >
                    Add
                  </button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {tags.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1 bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded text-[11px]"
                      >
                        #{t}
                        <button type="button" onClick={() => handleRemoveTag(t)}>
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Description */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-neutral-900">Product Description</h2>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Short Bullet Summary (Storefront Cards & WhatsApp Share)
              </label>
              <input
                id="product-short-desc-input"
                type="text"
                placeholder="Key selling proposition in one sentence"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Full Description & Specifications
              </label>
              <textarea
                id="product-full-desc-textarea"
                rows={4}
                placeholder="Comprehensive technical details, materials, warranty, and package contents..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg p-3 text-xs text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>
          </div>

          {/* Section 3: Media & Images */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-neutral-900">Product Media & Gallery</h2>
              <span className="text-[11px] text-neutral-400">{images.length} images added</span>
            </div>

            {/* Image Gallery Previews */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative group rounded-xl overflow-hidden border border-neutral-200 aspect-square bg-neutral-50"
                >
                  <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                  {idx === 0 && (
                    <span className="absolute top-1.5 left-1.5 bg-neutral-900/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                      Primary
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1.5 right-1.5 bg-rose-600/90 hover:bg-rose-700 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Custom Image URL Input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Paste external image URL (Unsplash or direct image link)..."
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="flex-1 bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-1.5 text-xs text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
              <button
                type="button"
                onClick={() => handleAddImage()}
                className="px-3 py-1.5 bg-neutral-900 text-white hover:bg-neutral-800 rounded-lg text-xs font-semibold shrink-0"
              >
                Add Image
              </button>
            </div>

            {/* Preset Sample Images for quick addition */}
            <div>
              <p className="text-[11px] font-medium text-neutral-500 mb-1.5">Or pick from sample high-res library:</p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {sampleImages.map((sImg, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleAddImage(sImg)}
                    className="w-12 h-12 rounded-lg border border-neutral-200 overflow-hidden shrink-0 hover:ring-2 hover:ring-neutral-900 transition-all"
                  >
                    <img src={sImg} alt="sample" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 4: B2B Wholesale Pricing & Volume Tiers */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <span>B2B Wholesale & Distributor Pricing</span>
                </h2>
                <p className="text-xs text-neutral-500">
                  Allow bulk buyers and retail resellers to access volume discounts
                </p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700">
                B2B Enabled
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Wholesale Price (₹ INR)
                </label>
                <div className="relative">
                  <IndianRupee className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="number"
                    value={wholesalePrice || ''}
                    onChange={(e) => setWholesalePrice(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="1250"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-lg pl-8 pr-3 py-2 text-xs font-semibold text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Minimum Order Quantity (MOQ)
                </label>
                <input
                  type="number"
                  value={b2bMinQty || ''}
                  onChange={(e) => setB2bMinQty(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="10"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-xs font-semibold text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Pricing, Inventory, SEO & Publishing */}
        <div className="space-y-6">
          {/* Pricing Card */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-neutral-900">Pricing & Margins</h2>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Regular Retail Price (₹) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <IndianRupee className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  id="product-price-input"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg pl-8 pr-3 py-2 text-xs font-bold text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Discounted Sale Price (₹)
              </label>
              <div className="relative">
                <IndianRupee className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  id="product-saleprice-input"
                  type="number"
                  value={salePrice || ''}
                  onChange={(e) => setSalePrice(e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg pl-8 pr-3 py-2 text-xs font-bold text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Cost Price (For Margin Calculation)
              </label>
              <div className="relative">
                <IndianRupee className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  id="product-costprice-input"
                  type="number"
                  value={costPrice}
                  onChange={(e) => setCostPrice(Number(e.target.value))}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg pl-8 pr-3 py-2 text-xs text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>
            </div>

            {/* Profit margin live feedback */}
            <div className="bg-emerald-50 rounded-lg p-3 text-xs text-emerald-900">
              <div className="flex justify-between font-semibold">
                <span>Gross Profit Margin:</span>
                <span>
                  {price > 0 ? `${Math.round((((salePrice || price) - costPrice) / (salePrice || price)) * 100)}%` : '0%'}
                </span>
              </div>
              <p className="text-[10px] text-emerald-700 mt-0.5">
                Profit per unit: ₹{((salePrice || price) - costPrice).toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          {/* Inventory Card */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-neutral-900">Inventory & Stock Tracking</h2>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Current Available Stock Quantity
              </label>
              <input
                id="product-stock-input"
                type="number"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-xs font-bold text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Low Stock Threshold Alert
              </label>
              <input
                id="product-lowstock-input"
                type="number"
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
              <p className="text-[10px] text-neutral-400 mt-1">Alerts show on dashboard when inventory reaches this level.</p>
            </div>
          </div>

          {/* Shipping & Dimensions Card */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-neutral-500" />
              <span>Shipping Specs</span>
            </h2>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Package Weight (in Kilograms)
              </label>
              <input
                type="number"
                step="0.05"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>
          </div>

          {/* SEO Preview Card */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-neutral-500" />
              <span>Google Search (SEO) Preview</span>
            </h2>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">SEO Title</label>
              <input
                type="text"
                placeholder={name || 'Product Title'}
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-1.5 text-xs text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>

            <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-100 font-sans">
              <span className="text-[10px] text-emerald-700 font-medium">https://dailyneeddeals.in/product/{name ? name.toLowerCase().replace(/[^a-z0-9]/g, '-') : 'product-slug'}</span>
              <h4 className="text-xs font-bold text-indigo-700 hover:underline cursor-pointer truncate">
                {seoTitle || name || 'Product Name Example'}
              </h4>
              <p className="text-[11px] text-neutral-600 line-clamp-2 mt-0.5">
                {seoDescription || shortDescription || 'Buy high quality electronics and everyday essentials with best festive deals and fast delivery.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
