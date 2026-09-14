import React, { useState } from 'react';
import { useRouter } from '../../context/RouterContext';
import { useStore } from '../../context/StoreContext';
import {
  TrendingUp,
  IndianRupee,
  ShoppingBag,
  Users,
  Download,
  Calendar,
  PieChart,
  BarChart2,
  ArrowUpRight,
  ArrowDownRight,
  MapPin,
  CreditCard,
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { currentTenant, products, orders, addToast } = useStore();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '12m'>('30d');

  const handleExportReport = () => {
    addToast('Detailed business analytics report downloaded (PDF/CSV)', 'success');
  };

  const revenueData = {
    '7d': [
      { day: 'Mon', revenue: 64200, orders: 94 },
      { day: 'Tue', revenue: 72100, orders: 108 },
      { day: 'Wed', revenue: 68900, orders: 102 },
      { day: 'Thu', revenue: 84500, orders: 126 },
      { day: 'Fri', revenue: 98200, orders: 148 },
      { day: 'Sat', revenue: 115400, orders: 182 },
      { day: 'Sun', revenue: 84520, orders: 128 },
    ],
    '30d': [
      { day: 'Week 1', revenue: 480000, orders: 710 },
      { day: 'Week 2', revenue: 520000, orders: 780 },
      { day: 'Week 3', revenue: 610000, orders: 920 },
      { day: 'Week 4', revenue: 590000, orders: 890 },
    ],
    '90d': [
      { day: 'July', revenue: 2150000, orders: 3200 },
      { day: 'August', revenue: 2480000, orders: 3650 },
      { day: 'September', revenue: 2890000, orders: 4120 },
    ],
    '12m': [
      { day: 'Q1', revenue: 6400000, orders: 9500 },
      { day: 'Q2', revenue: 7200000, orders: 10800 },
      { day: 'Q3', revenue: 8900000, orders: 13200 },
      { day: 'Q4', revenue: 10400000, orders: 15600 },
    ],
  }[timeRange];

  const maxRevenue = Math.max(...revenueData.map((d) => d.revenue));

  const cityDistribution = [
    { city: 'Mumbai', orders: 420, percent: 34 },
    { city: 'Bengaluru', orders: 310, percent: 25 },
    { city: 'Delhi NCR', orders: 245, percent: 20 },
    { city: 'Hyderabad', orders: 155, percent: 12 },
    { city: 'Pune', orders: 112, percent: 9 },
  ];

  const paymentMethods = [
    { name: 'UPI (GPay / PhonePe)', percent: 58, amount: '₹12,76,000', color: 'bg-emerald-500' },
    { name: 'Credit & Debit Cards', percent: 26, amount: '₹5,72,000', color: 'bg-indigo-500' },
    { name: 'Cash on Delivery (COD)', percent: 12, amount: '₹2,64,000', color: 'bg-amber-500' },
    { name: 'Net Banking / B2B NEFT', percent: 4, amount: '₹88,000', color: 'bg-neutral-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Business Analytics & Insights</h1>
          <p className="text-xs text-neutral-500">
            Real-time sales velocity, revenue trends, customer lifetime value, and channel performance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Time Filter */}
          <div className="flex items-center bg-white border border-neutral-200 p-1 rounded-lg">
            {(['7d', '30d', '90d', '12m'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setTimeRange(r)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                  timeRange === r ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {r === '7d' ? '7D' : r === '30d' ? '30D' : r === '90d' ? '90D' : '1Y'}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleExportReport}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 text-white hover:bg-neutral-800 rounded-lg text-xs font-semibold shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs">
          <span className="text-xs text-neutral-500 font-medium">Gross Revenue</span>
          <div className="text-xl font-bold text-neutral-900 mt-1">₹22,00,000</div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
            <TrendingUp className="w-3 h-3" />
            <span>+18.4%</span>
            <span className="text-neutral-400 font-normal">vs prev period</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs">
          <span className="text-xs text-neutral-500 font-medium">Total Orders</span>
          <div className="text-xl font-bold text-neutral-900 mt-1">3,320</div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
            <TrendingUp className="w-3 h-3" />
            <span>+11.2%</span>
            <span className="text-neutral-400 font-normal">volume growth</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs">
          <span className="text-xs text-neutral-500 font-medium">Average Order Value</span>
          <div className="text-xl font-bold text-neutral-900 mt-1">₹662</div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
            <TrendingUp className="w-3 h-3" />
            <span>+₹48</span>
            <span className="text-neutral-400 font-normal">basket size</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs">
          <span className="text-xs text-neutral-500 font-medium">Store Conversion Rate</span>
          <div className="text-xl font-bold text-neutral-900 mt-1">4.82%</div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
            <TrendingUp className="w-3 h-3" />
            <span>+0.6%</span>
            <span className="text-neutral-400 font-normal">visits to orders</span>
          </div>
        </div>
      </div>

      {/* Sales Velocity Bar Chart */}
      <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-sm font-bold text-neutral-900">Revenue & Order Volume Trends</h2>
            <p className="text-xs text-neutral-500">Gross store revenue across selected timeframe</p>
          </div>
          <span className="text-xs font-semibold text-neutral-500">All currency in INR (₹)</span>
        </div>

        <div className="h-56 flex items-end gap-4 sm:gap-8 pt-6 px-2 border-b border-neutral-100">
          {revenueData.map((d) => {
            const heightPercent = Math.max(20, Math.round((d.revenue / maxRevenue) * 100));
            return (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-neutral-800 bg-neutral-100 px-1.5 py-0.5 rounded shadow-xs whitespace-nowrap">
                  ₹{d.revenue.toLocaleString('en-IN')} ({d.orders} ord)
                </div>
                <div
                  className="w-full max-w-[56px] bg-neutral-900 group-hover:bg-indigo-600 rounded-t-md transition-all duration-300"
                  style={{ height: `${heightPercent}%` }}
                />
                <span className="text-xs text-neutral-500 font-medium">{d.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2 Column breakdown: Top Products & Geo Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Methods Breakdown */}
        <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-neutral-500" />
            <span>Sales by Payment Method</span>
          </h2>

          <div className="space-y-3">
            {paymentMethods.map((pm) => (
              <div key={pm.name} className="space-y-1 text-xs">
                <div className="flex justify-between font-medium">
                  <span className="text-neutral-800">{pm.name}</span>
                  <span className="font-bold text-neutral-900">
                    {pm.amount} ({pm.percent}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div className={`h-full ${pm.color} rounded-full`} style={{ width: `${pm.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* City Distribution */}
        <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-neutral-500" />
            <span>Top Customer Cities</span>
          </h2>

          <div className="space-y-3">
            {cityDistribution.map((item) => (
              <div key={item.city} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-neutral-900" />
                  <span className="font-semibold text-neutral-800">{item.city}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-neutral-500">{item.orders} orders</span>
                  <span className="font-bold text-neutral-900 w-10 text-right">{item.percent}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
