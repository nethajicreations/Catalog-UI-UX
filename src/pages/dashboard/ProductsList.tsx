import React, { useState, useMemo } from 'react';
import { useRouter } from '../../context/RouterContext';
import { useStore } from '../../context/StoreContext';
import { StatusBadge } from '../../components/ui/Badge';
import {
  Package,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  MoreVertical,
  ExternalLink,
  Edit,
  Trash2,
  Download,
  Upload,
  Eye,
  AlertTriangle,
  CheckCircle2,
  X,
} from 'lucide-react';
import { Product } from '../../types';

export const ProductsList: React.FC = () => {
  const { navigate } = useRouter();
  const { products, categories, currentTenant, deleteProduct, toggleProductStatus, addToast } = useStore();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'instock'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'price_asc' | 'price_desc' | 'stock'>('name');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [importModalOpen, setImportModalOpen] = useState(false);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesSearch =
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.sku.toLowerCase().includes(search.toLowerCase()) ||
          p.brand.toLowerCase().includes(search.toLowerCase());

        const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
        const matchesStatus = selectedStatus === 'all' || p.status === selectedStatus;
        const matchesStock =
          stockFilter === 'all' ||
          (stockFilter === 'low' && p.stock <= p.lowStockThreshold) ||
          (stockFilter === 'instock' && p.stock > p.lowStockThreshold);

        return matchesSearch && matchesCat && matchesStatus && matchesStock;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return (a.salePrice || a.price) - (b.salePrice || b.price);
        if (sortBy === 'price_desc') return (b.salePrice || b.price) - (a.salePrice || a.price);
        if (sortBy === 'stock') return a.stock - b.stock;
        return a.name.localeCompare(b.name);
      });
  }, [products, search, selectedCategory, selectedStatus, stockFilter, sortBy]);

  // Bulk actions
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedProductIds(filteredProducts.map((p) => p.id));
    } else {
      setSelectedProductIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedProductIds.length} selected products?`)) {
      selectedProductIds.forEach((id) => deleteProduct(id));
      setSelectedProductIds([]);
      addToast(`Deleted ${selectedProductIds.length} products`, 'info');
    }
  };

  const handleExportCSV = () => {
    const csvContent = [
      ['ID', 'Name', 'SKU', 'Category', 'Price', 'SalePrice', 'Stock', 'Status'].join(','),
      ...filteredProducts.map((p) =>
        [
          p.id,
          `"${p.name.replace(/"/g, '""')}"`,
          p.sku,
          p.category,
          p.price,
          p.salePrice || '',
          p.stock,
          p.status,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${currentTenant.slug}-products.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Product catalogue CSV downloaded', 'success');
  };

  const getCategoryName = (catId: string) => {
    return categories.find((c) => c.id === catId)?.name || 'General';
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Products Management</h1>
          <p className="text-xs text-neutral-500">
            {filteredProducts.length} of {products.length} products active in catalogue
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            id="products-export-btn"
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-neutral-500" />
            <span>Export CSV</span>
          </button>

          <button
            id="products-import-btn"
            type="button"
            onClick={() => setImportModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-neutral-500" />
            <span>Import CSV</span>
          </button>

          <button
            id="products-add-new-btn"
            type="button"
            onClick={() => navigate('/dashboard/products/new')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-neutral-900 text-white hover:bg-neutral-800 rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-neutral-200 p-3.5 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              id="product-search-input"
              type="text"
              placeholder="Search by title, SKU, brand..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="w-full md:w-48">
            <select
              id="product-filter-category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Filter */}
          <div className="w-full md:w-36">
            <select
              id="product-filter-stock"
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value as any)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900"
            >
              <option value="all">All Stock Levels</option>
              <option value="low">⚠️ Low Stock Only</option>
              <option value="instock">In Stock</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="w-full md:w-32">
            <select
              id="product-filter-status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="w-full md:w-40">
            <select
              id="product-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900"
            >
              <option value="name">Sort by Name</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="stock">Stock Quantity</option>
            </select>
          </div>
        </div>

        {/* Bulk Action Bar if items selected */}
        {selectedProductIds.length > 0 && (
          <div className="bg-neutral-900 text-white px-3 py-2 rounded-lg flex items-center justify-between text-xs animate-in fade-in">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{selectedProductIds.length} item(s) selected</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleBulkDelete}
                className="flex items-center gap-1 bg-rose-600 hover:bg-rose-700 text-white px-2.5 py-1 rounded text-xs font-semibold"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Selected</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedProductIds([])}
                className="text-neutral-400 hover:text-white text-xs px-1.5"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-xs overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto mb-3">
              <Package className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-neutral-900">No products found</h3>
            <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
              No products match your current filters. Try changing your search query or reset filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setSelectedCategory('all');
                setSelectedStatus('all');
                setStockFilter('all');
              }}
              className="mt-4 px-3 py-1.5 bg-neutral-900 text-white rounded-lg text-xs font-semibold"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 text-neutral-500 font-semibold border-b border-neutral-100">
                <tr>
                  <th className="w-10 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedProductIds.length === filteredProducts.length && filteredProducts.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                    />
                  </th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">SKU</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-neutral-700">
                {filteredProducts.map((p) => {
                  const isSelected = selectedProductIds.includes(p.id);
                  const isLowStock = p.stock <= p.lowStockThreshold;

                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-neutral-50/70 transition-colors ${isSelected ? 'bg-indigo-50/40' : ''}`}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(p.id)}
                          className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                        />
                      </td>

                      {/* Product details */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-11 h-11 rounded-lg object-cover border border-neutral-200 shrink-0"
                          />
                          <div className="min-w-0 max-w-xs">
                            <button
                              type="button"
                              onClick={() => navigate(`/dashboard/products/${p.id}`)}
                              className="font-bold text-neutral-900 hover:text-indigo-600 truncate block text-left"
                            >
                              {p.name}
                            </button>
                            <p className="text-[11px] text-neutral-400 truncate">{p.brand} · {p.rating}★ ({p.reviewsCount})</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3 font-mono text-[11px] text-neutral-500">{p.sku}</td>

                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 font-medium">
                          {getCategoryName(p.category)}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <div>
                          <span className="font-bold text-neutral-900">
                            ₹{(p.salePrice || p.price).toLocaleString('en-IN')}
                          </span>
                          {p.salePrice && (
                            <span className="text-[10px] text-neutral-400 line-through ml-1.5">
                              ₹{p.price.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                        {p.wholesalePrice && (
                          <div className="text-[10px] text-indigo-600 font-semibold">
                            B2B: ₹{p.wholesalePrice.toLocaleString('en-IN')} (MOQ {p.b2bMinQty})
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className={`font-semibold ${isLowStock ? 'text-rose-600 font-bold' : 'text-neutral-900'}`}>
                            {p.stock}
                          </span>
                          {isLowStock && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-100 text-rose-700">
                              Low
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => toggleProductStatus(p.id)}
                          className="focus:outline-none"
                          title="Click to toggle status"
                        >
                          <StatusBadge status={p.status} />
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => navigate(`/dashboard/products/${p.id}`)}
                            className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                            title="View / Edit Product"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => navigate(`/store/${currentTenant.slug}/product/${p.slug}`)}
                            className="p-1.5 rounded-lg text-neutral-500 hover:text-indigo-600 hover:bg-neutral-100 transition-colors"
                            title="View on Customer Storefront"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(p.id)}
                            className="p-1.5 rounded-lg text-neutral-500 hover:text-rose-600 hover:bg-neutral-100 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-3">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-neutral-900">Delete this product?</h3>
            <p className="text-xs text-neutral-500 mt-1">
              This action will remove the product from your store catalogue and active shopping carts.
            </p>
            <div className="flex items-center justify-end gap-2 mt-5">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteProduct(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import CSV Modal Simulation */}
      {importModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-sm font-bold text-neutral-900">Import Products from CSV / Excel</h3>
              <button
                type="button"
                onClick={() => setImportModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-6 text-center border-2 border-dashed border-neutral-200 rounded-xl my-4 bg-neutral-50 hover:bg-neutral-100/50 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
              <p className="text-xs font-bold text-neutral-800">Drop your product catalog CSV here</p>
              <p className="text-[11px] text-neutral-500 mt-0.5">Supports Shopify, WooCommerce, and CatalogPro format</p>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setImportModalOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-semibold text-neutral-700"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setImportModalOpen(false);
                  addToast('Sample batch of 12 items imported successfully!', 'success');
                }}
                className="px-3.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold"
              >
                Simulate Import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
