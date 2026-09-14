import React, { useState } from 'react';
import { useRouter } from '../../context/RouterContext';
import { useStore } from '../../context/StoreContext';
import { StatusBadge } from '../../components/ui/Badge';
import {
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Users,
  Eye,
  IndianRupee,
  Package,
  Plus,
  ArrowUpRight,
  BookOpen,
  Store,
  TicketPercent,
  AlertTriangle,
  ChevronRight,
  Activity,
} from 'lucide-react';

export const DashboardOverview: React.FC = () => {
  const { navigate } = useRouter();
  const { currentTenant, orders, products, customers, liveVisitors } = useStore();
  const [chartRange, setChartRange] = useState<'today' | '7d' | '30d' | '90d' | '12m'>('7d');

  const lowStockItems = products.filter(p => p.stock <= p.lowStockThreshold);

  // Chart data simulation for ranges
  const chartData = {
    today: [
      { label: '8 AM', rev: 4200, ord: 6 },
      { label: '11 AM', rev: 11400, ord: 18 },
      { label: '2 PM', rev: 23600, ord: 35 },
      { label: '5 PM', rev: 18900, ord: 28 },
      { label: '8 PM', rev: 26420, ord: 41 },
    ],
    '7d': [
      { label: 'Mon', rev: 62400, ord: 92 },
      { label: 'Tue', rev: 74200, ord: 110 },
      { label: 'Wed', rev: 68900, ord: 104 },
      { label: 'Thu', rev: 81200, ord: 122 },
      { label: 'Fri', rev: 94500, ord: 145 },
      { label: 'Sat', rev: 112000, ord: 178 },
      { label: 'Sun', rev: 84520, ord: 128 },
    ],
    '30d': [
      { label: 'Week 1', rev: 480000, ord: 710 },
      { label: 'Week 2', rev: 520000, ord: 780 },
      { label: 'Week 3', rev: 610000, ord: 920 },
      { label: 'Week 4', rev: 590000, ord: 890 },
    ],
    '90d': [
      { label: 'Month 1', rev: 2150000, ord: 3200 },
      { label: 'Month 2', rev: 2480000, ord: 3650 },
      { label: 'Month 3', rev: 2890000, ord: 4120 },
    ],
    '12m': [
      { label: 'Q1', rev: 6400000, ord: 9500 },
      { label: 'Q2', rev: 7200000, ord: 10800 },
      { label: 'Q3', rev: 8900000, ord: 13200 },
      { label: 'Q4', rev: 10400000, ord: 15600 },
    ],
  }[chartRange];

  const maxVal = Math.max(...chartData.map(d => d.rev));

  return (
    <div className="space-y-6">
      {/* Header & Greetings */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
            Good morning, {currentTenant.name}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Here's what's happening with your store today.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            id="overview-add-product-btn"
            type="button"
            onClick={() => navigate('/dashboard/products/new')}
            className="flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 text-white px-3 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Product</span>
          </button>

          <button
            id="overview-create-catalogue-btn"
            type="button"
            onClick={() => navigate('/dashboard/catalogues/new')}
            className="flex items-center gap-1.5 bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-800 px-3 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
            <span>Create Catalogue</span>
          </button>

          <button
            id="overview-preview-store-btn"
            type="button"
            onClick={() => navigate(`/store/${currentTenant.slug}`)}
            className="flex items-center gap-1.5 bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-800 px-3 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Store className="w-3.5 h-3.5 text-emerald-600" />
            <span>View Store</span>
          </button>
        </div>
      </div>

      {/* Low Stock Warning Banner if any */}
      {lowStockItems.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-center justify-between gap-3 text-amber-900 text-xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <div>
              <span className="font-bold">{lowStockItems.length} product(s) running low on inventory:</span>{' '}
              <span className="text-amber-800">
                {lowStockItems.map(p => `${p.name.substring(0, 22)}... (${p.stock} left)`).join(', ')}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/dashboard/inventory')}
            className="font-bold underline text-amber-900 hover:text-amber-950 shrink-0"
          >
            Restock Now →
          </button>
        </div>
      )}

      {/* Primary KPI Stat Cards (Revenue, Orders, Customers, Store Visits, Conversion, AOV) */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Revenue */}
        <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Revenue</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <IndianRupee className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-bold text-neutral-900">₹84,520</div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
            <TrendingUp className="w-3 h-3" />
            <span>+14.2%</span>
            <span className="text-neutral-400 font-normal ml-0.5">vs yesterday</span>
          </div>
        </div>

        {/* Orders */}
        <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Orders</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ShoppingBag className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-bold text-neutral-900">128</div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
            <TrendingUp className="w-3 h-3" />
            <span>+8.4%</span>
            <span className="text-neutral-400 font-normal ml-0.5">14 pending</span>
          </div>
        </div>

        {/* Customers */}
        <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Customers</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-bold text-neutral-900">1,842</div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
            <TrendingUp className="w-3 h-3" />
            <span>+12.0%</span>
            <span className="text-neutral-400 font-normal ml-0.5">this month</span>
          </div>
        </div>

        {/* Store Visits */}
        <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Store Visits</span>
            <div className="w-7 h-7 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
              <Eye className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-bold text-neutral-900">4,892</div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
            <Activity className="w-3 h-3 text-emerald-500" />
            <span>{liveVisitors.length} live</span>
            <span className="text-neutral-400 font-normal ml-0.5">active now</span>
          </div>
        </div>

        {/* Conversion */}
        <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Conversion</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-bold text-neutral-900">4.8%</div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
            <TrendingUp className="w-3 h-3" />
            <span>+0.6%</span>
            <span className="text-neutral-400 font-normal ml-0.5">industry avg 2.9%</span>
          </div>
        </div>

        {/* Average Order Value */}
        <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Avg. Order Value</span>
            <div className="w-7 h-7 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center">
              <Package className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-bold text-neutral-900">₹661</div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
            <TrendingUp className="w-3 h-3" />
            <span>+₹45</span>
            <span className="text-neutral-400 font-normal ml-0.5">from last week</span>
          </div>
        </div>
      </div>

      {/* Sales Chart Section */}
      <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-sm font-bold text-neutral-900">Revenue & Sales Performance</h2>
            <p className="text-xs text-neutral-500">Gross store sales before discounts and taxes</p>
          </div>

          {/* Time Range Switcher */}
          <div className="flex items-center bg-neutral-100 p-1 rounded-lg self-start">
            {(['today', '7d', '30d', '90d', '12m'] as const).map((range) => (
              <button
                key={range}
                id={`chart-range-${range}`}
                type="button"
                onClick={() => setChartRange(range)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                  chartRange === range
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {range === 'today' ? 'Today' : range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : range === '90d' ? '90 Days' : '12 Months'}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Bar & Metric Display */}
        <div className="h-48 sm:h-56 flex items-end gap-3 sm:gap-6 pt-6 px-2 border-b border-neutral-100">
          {chartData.map((point) => {
            const heightPercent = Math.max(15, Math.round((point.rev / maxVal) * 100));
            return (
              <div key={point.label} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-neutral-800 bg-neutral-100 px-1.5 py-0.5 rounded shadow-xs whitespace-nowrap">
                  ₹{point.rev.toLocaleString('en-IN')}
                </div>
                <div
                  className="w-full max-w-[48px] bg-neutral-900 group-hover:bg-indigo-600 rounded-t-md transition-all duration-300"
                  style={{ height: `${heightPercent}%` }}
                />
                <span className="text-[11px] text-neutral-500 font-medium">{point.label}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-neutral-500 pt-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-900" />
              <span>Direct Store Sales</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>WhatsApp Inquiries</span>
            </span>
          </div>
          <span className="text-neutral-400">Updated 2 minutes ago</span>
        </div>
      </div>

      {/* Two Column Grid: Recent Orders & Top Selling Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-neutral-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-neutral-900">Recent Customer Orders</h2>
              <p className="text-xs text-neutral-500">Live order queue ready for dispatch</p>
            </div>
            <button
              id="overview-view-all-orders"
              type="button"
              onClick={() => navigate('/dashboard/orders')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 text-neutral-500 font-semibold border-b border-neutral-100">
                <tr>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Items</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-neutral-700">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="px-4 py-3 font-semibold text-neutral-900">
                      {order.orderNumber}
                      <div className="text-[10px] text-neutral-400 font-normal">{order.paymentMethod}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-neutral-900">{order.customerName}</div>
                      <div className="text-[10px] text-neutral-400">{order.customerPhone}</div>
                    </td>
                    <td className="px-4 py-3">
                      {order.items.length} item{order.items.length > 1 ? 's' : ''}
                    </td>
                    <td className="px-4 py-3 font-bold text-neutral-900">
                      ₹{order.total.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={order.fulfillmentStatus} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => navigate(`/dashboard/orders`)}
                        className="text-neutral-600 hover:text-neutral-900 font-medium px-2 py-1 rounded bg-neutral-100 hover:bg-neutral-200 transition-colors"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products Breakdown (1 col) */}
        <div className="bg-white rounded-xl border border-neutral-200 shadow-xs p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-neutral-900">Top Performing Products</h2>
              <button
                type="button"
                onClick={() => navigate('/dashboard/products')}
                className="text-xs text-indigo-600 font-medium hover:underline"
              >
                All
              </button>
            </div>

            <div className="space-y-3.5">
              {products.slice(0, 4).map((p, idx) => (
                <div key={p.id} className="flex items-center gap-3">
                  <span className="w-5 text-xs font-bold text-neutral-400">#{idx + 1}</span>
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="w-10 h-10 rounded-lg object-cover border border-neutral-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-neutral-900 truncate">{p.name}</p>
                    <p className="text-[11px] text-neutral-500">
                      ₹{p.price.toLocaleString('en-IN')} · <span className="text-emerald-600 font-medium">{p.stock} in stock</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-100">
            <div className="bg-neutral-50 rounded-lg p-3 text-xs flex items-center justify-between">
              <div>
                <span className="font-semibold text-neutral-800">WhatsApp Commerce</span>
                <p className="text-[10px] text-neutral-500">28 conversions via shared catalogues</p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/dashboard/whatsapp')}
                className="text-[11px] font-bold text-emerald-600 hover:underline"
              >
                Broadcast →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
