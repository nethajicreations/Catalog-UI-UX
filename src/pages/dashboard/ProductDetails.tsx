import React, { useState } from 'react';
import { useRouter } from '../../context/RouterContext';
import { useStore } from '../../context/StoreContext';
import { StatusBadge } from '../../components/ui/Badge';
import {
  ArrowLeft,
  Edit,
  ExternalLink,
  Copy,
  Trash2,
  Package,
  Boxes,
  IndianRupee,
  Layers,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

export const ProductDetails: React.FC = () => {
  const { navigate, params } = useRouter();
  const { products, categories, currentTenant, orders, deleteProduct, toggleProductStatus, adjustStock, addToast } = useStore();

  const product = products.find((p) => p.id === params.productId);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [stockAdjustmentQty, setStockAdjustmentQty] = useState<number>(10);
  const [stockAdjustmentReason, setStockAdjustmentReason] = useState('Manual replenishment');

  if (!product) {
    return (
      <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center max-w-lg mx-auto">
        <Package className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
        <h2 className="text-base font-bold text-neutral-900">Product Not Found</h2>
        <p className="text-xs text-neutral-500 mt-1">This product might have been deleted or archived.</p>
        <button
          type="button"
          onClick={() => navigate('/dashboard/products')}
          className="mt-4 px-4 py-2 bg-neutral-900 text-white rounded-lg text-xs font-semibold"
        >
          Return to Products
        </button>
      </div>
    );
  }

  const category = categories.find((c) => c.id === product.category);
  const relatedOrders = orders.filter((o) =>
    o.items.some((item) => item.productId === product.id)
  );

  const profit = (product.salePrice || product.price) - product.costPrice;
  const marginPercent = Math.round((profit / (product.salePrice || product.price)) * 100);

  const handleStockAdjust = () => {
    adjustStock(product.id, stockAdjustmentQty, stockAdjustmentReason, 'Main Hub');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Bar */}
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
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-neutral-900 tracking-tight">{product.name}</h1>
              <StatusBadge status={product.status} />
            </div>
            <p className="text-xs text-neutral-500 font-mono">
              SKU: {product.sku} · Brand: {product.brand} · Category: {category?.name || 'General'}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            id="product-edit-btn"
            type="button"
            onClick={() => navigate(`/dashboard/products/${product.id}/edit`)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-200 text-neutral-800 hover:bg-neutral-50 rounded-lg text-xs font-semibold shadow-xs"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit Product</span>
          </button>

          <button
            id="product-view-storefront-btn"
            type="button"
            onClick={() => navigate(`/store/${currentTenant.slug}/product/${product.slug}`)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-200 text-indigo-600 hover:bg-indigo-50 rounded-lg text-xs font-semibold shadow-xs"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Storefront View</span>
          </button>

          <button
            type="button"
            onClick={() => toggleProductStatus(product.id)}
            className="px-3 py-1.5 bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 rounded-lg text-xs font-semibold shadow-xs"
          >
            {product.status === 'active' ? 'Set as Draft' : 'Set as Active'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Images & Specs */}
        <div className="space-y-6">
          {/* Image Gallery */}
          <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs space-y-3">
            <div className="rounded-xl overflow-hidden border border-neutral-200 aspect-square bg-neutral-50">
              <img
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedImageIndex(i)}
                    className={`w-14 h-14 rounded-lg border overflow-hidden shrink-0 ${
                      selectedImageIndex === i ? 'ring-2 ring-neutral-900 border-neutral-900' : 'border-neutral-200 opacity-70'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Inventory Adjust Card */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
              <Boxes className="w-4 h-4 text-neutral-500" />
              <span>Quick Stock Adjustment</span>
            </h3>

            <div className="flex items-center justify-between text-xs text-neutral-600">
              <span>Current Stock:</span>
              <span className={`font-bold ${product.stock <= product.lowStockThreshold ? 'text-rose-600' : 'text-neutral-900'}`}>
                {product.stock} units
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Add / Deduct Quantity</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={stockAdjustmentQty}
                  onChange={(e) => setStockAdjustmentQty(Number(e.target.value))}
                  className="w-24 bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-1 text-xs font-bold"
                />
                <button
                  type="button"
                  onClick={handleStockAdjust}
                  className="flex-1 bg-neutral-900 text-white hover:bg-neutral-800 rounded-lg text-xs font-semibold py-1"
                >
                  Apply Stock Update
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Financials, B2B Tiers, Description, and Order History */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl border border-neutral-200 p-3.5 shadow-xs">
              <span className="text-[11px] font-medium text-neutral-500">Retail Price</span>
              <div className="text-base font-bold text-neutral-900 mt-1">
                ₹{(product.salePrice || product.price).toLocaleString('en-IN')}
              </div>
              {product.salePrice && (
                <span className="text-[10px] text-neutral-400 line-through">₹{product.price.toLocaleString('en-IN')}</span>
              )}
            </div>

            <div className="bg-white rounded-xl border border-neutral-200 p-3.5 shadow-xs">
              <span className="text-[11px] font-medium text-neutral-500">Unit Cost</span>
              <div className="text-base font-bold text-neutral-900 mt-1">
                ₹{product.costPrice.toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-neutral-400">COGS</span>
            </div>

            <div className="bg-white rounded-xl border border-neutral-200 p-3.5 shadow-xs">
              <span className="text-[11px] font-medium text-neutral-500">Gross Margin</span>
              <div className="text-base font-bold text-emerald-600 mt-1">{marginPercent}%</div>
              <span className="text-[10px] text-emerald-700 font-semibold">+₹{profit.toLocaleString('en-IN')} / unit</span>
            </div>

            <div className="bg-white rounded-xl border border-neutral-200 p-3.5 shadow-xs">
              <span className="text-[11px] font-medium text-neutral-500">Rating</span>
              <div className="text-base font-bold text-amber-600 mt-1">★ {product.rating}</div>
              <span className="text-[10px] text-neutral-500">{product.reviewsCount} customer reviews</span>
            </div>
          </div>

          {/* Description & Specs Card */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-neutral-900">Description & Overview</h3>
            <p className="text-xs text-neutral-700 leading-relaxed font-medium bg-neutral-50 p-3 rounded-lg border border-neutral-100">
              {product.shortDescription}
            </p>
            <p className="text-xs text-neutral-600 leading-relaxed">
              {product.description}
            </p>

            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {product.tags.map((tag) => (
                  <span key={tag} className="text-[11px] bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* B2B Wholesale Tier Card */}
          {product.wholesalePrice && (
            <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <span>B2B Wholesale Tiering</span>
                </h3>
                <span className="text-xs text-indigo-600 font-semibold">Verified Retailers Only</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50 text-neutral-500 border-b border-neutral-100">
                    <tr>
                      <th className="px-3 py-2">Customer Group</th>
                      <th className="px-3 py-2">Min. Quantity (MOQ)</th>
                      <th className="px-3 py-2">Rate per Unit</th>
                      <th className="px-3 py-2">Discount vs Retail</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    <tr>
                      <td className="px-3 py-2 font-semibold text-neutral-900">Standard Retail</td>
                      <td className="px-3 py-2">1 unit</td>
                      <td className="px-3 py-2 font-bold">₹{(product.salePrice || product.price).toLocaleString('en-IN')}</td>
                      <td className="px-3 py-2 text-neutral-400">—</td>
                    </tr>
                    <tr className="bg-indigo-50/40">
                      <td className="px-3 py-2 font-semibold text-indigo-900">Wholesale / Distributor</td>
                      <td className="px-3 py-2 font-bold text-indigo-700">{product.b2bMinQty || 10}+ units</td>
                      <td className="px-3 py-2 font-bold text-indigo-700">₹{product.wholesalePrice.toLocaleString('en-IN')}</td>
                      <td className="px-3 py-2 font-semibold text-emerald-600">
                        {Math.round((((product.salePrice || product.price) - product.wholesalePrice) / (product.salePrice || product.price)) * 100)}% off
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Recent Orders containing this item */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-neutral-500" />
              <span>Recent Orders Containing This Product</span>
            </h3>

            {relatedOrders.length === 0 ? (
              <p className="text-xs text-neutral-500 italic py-2">No completed orders containing this product yet.</p>
            ) : (
              <div className="divide-y divide-neutral-100 text-xs">
                {relatedOrders.map((ord) => (
                  <div key={ord.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-neutral-900">{ord.orderNumber}</span>
                      <span className="text-neutral-500 ml-2">{ord.customerName}</span>
                      <div className="text-[10px] text-neutral-400">{ord.date}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={ord.fulfillmentStatus} />
                      <button
                        type="button"
                        onClick={() => navigate(`/dashboard/orders`)}
                        className="text-xs text-indigo-600 font-semibold hover:underline"
                      >
                        View Order
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
