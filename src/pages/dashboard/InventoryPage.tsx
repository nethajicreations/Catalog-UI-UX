import React, { useState } from 'react';
import { useRouter } from '../../context/RouterContext';
import { useStore } from '../../context/StoreContext';
import {
  Boxes,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Plus,
  ArrowUpDown,
  History,
  TrendingDown,
  Warehouse,
} from 'lucide-react';

export const InventoryPage: React.FC = () => {
  const { navigate } = useRouter();
  const { products, stockMovements, stockLogs: ctxLogs, adjustStock, currentTenant } = useStore();

  const [search, setSearch] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'low' | 'out'>('all');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [adjustmentQty, setAdjustmentQty] = useState<number>(10);
  const [adjustmentReason, setAdjustmentReason] = useState('Stock replenishment');
  const [location, setLocation] = useState('Main Warehouse');

  const stockLogs = stockMovements || ctxLogs || [];
  const totalSKUs = products?.length || 0;
  const totalUnits = (products || []).reduce((acc, p) => acc + p.stock, 0);
  const lowStockItems = (products || []).filter((p) => p.stock > 0 && p.stock <= p.lowStockThreshold);
  const outOfStockItems = (products || []).filter((p) => p.stock === 0);

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filterMode === 'all' ||
      (filterMode === 'low' && p.stock <= p.lowStockThreshold && p.stock > 0) ||
      (filterMode === 'out' && p.stock === 0);

    return matchesSearch && matchesFilter;
  });

  const handleAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) return;
    adjustStock(selectedProductId, adjustmentQty, adjustmentReason, location);
    setSelectedProductId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Inventory & Stock Tracking</h1>
        <p className="text-xs text-neutral-500">
          Monitor warehouse stock levels, configure low-stock safety buffers, and audit adjustment logs.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs">
          <span className="text-xs text-neutral-500 font-medium">Total SKUs</span>
          <div className="text-xl font-bold text-neutral-900 mt-1">{totalSKUs}</div>
          <span className="text-[11px] text-neutral-400">Tracked in catalogue</span>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs">
          <span className="text-xs text-neutral-500 font-medium">Total In-Stock Units</span>
          <div className="text-xl font-bold text-neutral-900 mt-1">{totalUnits.toLocaleString()}</div>
          <span className="text-[11px] text-emerald-600 font-medium">Available across hubs</span>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs">
          <span className="text-xs text-neutral-500 font-medium">Low Stock Alerts</span>
          <div className="text-xl font-bold text-amber-600 mt-1">{lowStockItems.length}</div>
          <span className="text-[11px] text-amber-700 font-medium">Below safety threshold</span>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs">
          <span className="text-xs text-neutral-500 font-medium">Out of Stock</span>
          <div className="text-xl font-bold text-rose-600 mt-1">{outOfStockItems.length}</div>
          <span className="text-[11px] text-rose-700 font-medium">Needs urgent reorder</span>
        </div>
      </div>

      {/* Product Stock Table & Log History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Products & Quick Adjust */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-neutral-200 p-3.5 shadow-xs flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search SKU or Product title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-neutral-900 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-lg self-stretch sm:self-auto">
              {(['all', 'low', 'out'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setFilterMode(mode)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                    filterMode === mode ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  {mode === 'all' ? 'All' : mode === 'low' ? 'Low Stock' : 'Out of Stock'}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-neutral-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 text-neutral-500 font-semibold border-b border-neutral-100">
                  <tr>
                    <th className="px-4 py-3">Product / SKU</th>
                    <th className="px-4 py-3">Current Stock</th>
                    <th className="px-4 py-3">Alert Threshold</th>
                    <th className="px-4 py-3 text-right">Quick Restock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-neutral-700">
                  {filteredProducts.map((p) => {
                    const isLow = p.stock <= p.lowStockThreshold;
                    return (
                      <tr key={p.id} className="hover:bg-neutral-50/70">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <img src={p.images[0]} alt={p.name} className="w-9 h-9 rounded object-cover border" />
                            <div className="min-w-0 max-w-xs">
                              <p className="font-semibold text-neutral-900 truncate">{p.name}</p>
                              <p className="font-mono text-[10px] text-neutral-400">{p.sku}</p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3 font-bold">
                          <span className={isLow ? 'text-rose-600' : 'text-neutral-900'}>{p.stock} units</span>
                        </td>

                        <td className="px-4 py-3 text-neutral-500 font-medium">{p.lowStockThreshold} units</td>

                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedProductId(p.id)}
                            className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-md font-semibold text-xs transition-colors"
                          >
                            Adjust Stock
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Stock Logs Audit Trail */}
        <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
            <h2 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-neutral-500" />
              <span>Stock Adjustment Logs</span>
            </h2>
            <span className="text-[10px] text-neutral-400">{stockLogs.length} events</span>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {stockLogs.map((log: any) => {
              const qty = log.change ?? (log.type === 'in' || log.type === 'return' ? log.quantity : -log.quantity) ?? log.quantity ?? 0;
              const isPositive = qty > 0 || log.type === 'in' || log.type === 'return';
              return (
                <div key={log.id} className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-100 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-neutral-900 truncate max-w-[140px]">{log.productName}</span>
                    <span
                      className={`font-bold ${
                        isPositive ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {qty > 0 ? `+${qty}` : qty}
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-1 flex justify-between">
                    <span>{log.reason}</span>
                    <span className="font-mono text-[10px]">{log.newStock} left</span>
                  </div>
                  <div className="text-[10px] text-neutral-400 mt-1 flex justify-between">
                    <span>{log.warehouse || log.location || 'Main Warehouse'}</span>
                    <span>{log.date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Adjust Modal */}
      {selectedProductId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95">
            <h3 className="text-sm font-bold text-neutral-900">Adjust Inventory Quantity</h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              {products.find((p) => p.id === selectedProductId)?.name}
            </p>

            <form onSubmit={handleAdjustSubmit} className="space-y-3.5 mt-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Stock Change (use negative to deduct)
                </label>
                <input
                  type="number"
                  value={adjustmentQty}
                  onChange={(e) => setAdjustmentQty(Number(e.target.value))}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-xs font-bold text-neutral-900 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Reason for Adjustment</label>
                <select
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-2 text-xs text-neutral-900"
                >
                  <option value="Supplier replenishment">Supplier replenishment</option>
                  <option value="Damaged / Broken goods">Damaged / Broken goods</option>
                  <option value="Customer return">Customer return</option>
                  <option value="Stock take correction">Stock take correction</option>
                  <option value="Promotional sample dispatch">Promotional sample dispatch</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Warehouse Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-1.5 text-xs text-neutral-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setSelectedProductId(null)}
                  className="px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold"
                >
                  Apply Change
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
