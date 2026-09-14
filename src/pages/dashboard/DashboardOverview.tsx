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
  AlertTriangle,
  ChevronRight,
  Activity,
  ArrowRight,
  ExternalLink,
  Clock,
  CheckCircle2,
  Layers,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';

export const DashboardOverview: React.FC = () => {
  const { navigate } = useRouter();
  const { currentTenant, orders, products, customers, liveVisitors, addToast } = useStore();
  const [chartRange, setChartRange] = useState<'today' | '7d' | '30d' | '90d' | '12m'>('7d');
  const [activeMetricView, setActiveMetricView] = useState<'both' | 'revenue' | 'orders'>('both');
  const [hoveredDataIndex, setHoveredDataIndex] = useState<number | null>(null);

  const lowStockItems = products.filter(p => p.stock <= p.lowStockThreshold);

  // Time-period dataset
  const datasetByRange = {
    today: {
      periodLabel: 'Today vs Yesterday',
      totalRevenue: 84520,
      totalOrders: 128,
      points: [
        { label: '8:00 AM', rev: 4200, ord: 6 },
        { label: '11:00 AM', rev: 14800, ord: 22 },
        { label: '2:00 PM', rev: 27400, ord: 41 },
        { label: '5:00 PM', rev: 21200, ord: 32 },
        { label: '8:00 PM', rev: 16920, ord: 27 },
      ],
    },
    '7d': {
      periodLabel: 'Last 7 Days vs Prior 7 Days',
      totalRevenue: 574720,
      totalOrders: 879,
      points: [
        { label: 'Mon', rev: 62400, ord: 92 },
        { label: 'Tue', rev: 74200, ord: 110 },
        { label: 'Wed', rev: 68900, ord: 104 },
        { label: 'Thu', rev: 81200, ord: 122 },
        { label: 'Fri', rev: 94500, ord: 145 },
        { label: 'Sat', rev: 108000, ord: 178 },
        { label: 'Sun', rev: 85520, ord: 128 },
      ],
    },
    '30d': {
      periodLabel: 'Last 30 Days vs Prior 30 Days',
      totalRevenue: 2420000,
      totalOrders: 3680,
      points: [
        { label: 'Week 1', rev: 520000, ord: 780 },
        { label: 'Week 2', rev: 580000, ord: 890 },
        { label: 'Week 3', rev: 670000, ord: 1020 },
        { label: 'Week 4', rev: 650000, ord: 990 },
      ],
    },
    '90d': {
      periodLabel: 'Last 90 Days vs Prior Quarter',
      totalRevenue: 7520000,
      totalOrders: 11420,
      points: [
        { label: 'Month 1', rev: 2200000, ord: 3340 },
        { label: 'Month 2', rev: 2540000, ord: 3860 },
        { label: 'Month 3', rev: 2780000, ord: 4220 },
      ],
    },
    '12m': {
      periodLabel: 'Last 12 Months (FY 2025-26)',
      totalRevenue: 32900000,
      totalOrders: 49100,
      points: [
        { label: 'Q1', rev: 6400000, ord: 9500 },
        { label: 'Q2', rev: 7800000, ord: 11600 },
        { label: 'Q3', rev: 8900000, ord: 13200 },
        { label: 'Q4', rev: 9800000, ord: 14800 },
      ],
    },
  };

  const currentDataset = datasetByRange[chartRange];
  const chartPoints = currentDataset.points;

  // Chart SVG calculations
  const chartHeight = 180;
  const chartWidth = 600;
  const maxRev = Math.max(...chartPoints.map(p => p.rev)) * 1.15;
  const maxOrd = Math.max(...chartPoints.map(p => p.ord)) * 1.25;

  const revCoordinates = chartPoints.map((p, index) => {
    const x = (index / (chartPoints.length - 1)) * chartWidth;
    const y = chartHeight - (p.rev / maxRev) * chartHeight;
    return { x, y, data: p };
  });

  const ordCoordinates = chartPoints.map((p, index) => {
    const x = (index / (chartPoints.length - 1)) * chartWidth;
    const y = chartHeight - (p.ord / maxOrd) * chartHeight;
    return { x, y, data: p };
  });

  // Smooth SVG Path Builder
  const buildSvgPath = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? 0 : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return path;
  };

  const revPath = buildSvgPath(revCoordinates);
  const ordPath = buildSvgPath(ordCoordinates);
  const revAreaPath = `${revPath} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`;

  // Recent Commerce Activity Log
  const activityLogs = [
    {
      id: 'act_1',
      type: 'payment',
      title: 'UPI Payment Confirmed',
      description: '₹3,568 verified for Order #ORD-1024 (Rahul Kumar)',
      time: '12m ago',
      icon: CheckCircle2,
      iconColor: 'text-emerald-600 bg-emerald-50',
    },
    {
      id: 'act_2',
      type: 'whatsapp',
      title: 'Catalogue Shared on WhatsApp',
      description: 'Festive Bestsellers sent to 24 wholesale buyers',
      time: '45m ago',
      icon: MessageSquare,
      iconColor: 'text-emerald-600 bg-emerald-50',
    },
    {
      id: 'act_3',
      type: 'dispatch',
      title: 'Dispatch Ready: Delhivery Air',
      description: 'Waybill generated for Order #ORD-1021 (Express Pan-India)',
      time: '1h ago',
      icon: Package,
      iconColor: 'text-indigo-600 bg-indigo-50',
    },
    {
      id: 'act_4',
      type: 'b2b',
      title: 'B2B Wholesale Inquiry',
      description: 'Pooja Electricals requested quote for 50x 65W GaN Chargers',
      time: '2h ago',
      icon: Layers,
      iconColor: 'text-blue-600 bg-blue-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header (Hierarchy: Left Title, Right Actions with clear hierarchy) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1 border-b border-neutral-200/70">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
            Good morning, {currentTenant.name}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Here's what's happening with your store today.
          </p>
        </div>

        {/* Action hierarchy: Primary = Add Product, Secondary = Create Catalogue, Tertiary = View Store */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="overview-add-product-btn"
            type="button"
            onClick={() => navigate('/dashboard/products/new')}
            className="flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 text-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
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
            className="flex items-center gap-1.5 bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-600 hover:text-neutral-900 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
            <span>View Store</span>
          </button>
        </div>
      </div>

      {/* Low Stock Warning Banner if any */}
      {lowStockItems.length > 0 && (
        <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-900 text-xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <div>
              <span className="font-bold">{lowStockItems.length} product(s) running low on inventory:</span>{' '}
              <span className="text-amber-800">
                {lowStockItems.slice(0, 3).map(p => `${p.name.substring(0, 26)} (${p.stock} left)`).join(', ')}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/dashboard/inventory')}
            className="font-bold text-amber-900 hover:text-amber-950 underline shrink-0 text-left sm:text-right"
          >
            Restock Inventory →
          </button>
        </div>
      )}

      {/* 2. Structured KPI Section (4 Main Metrics + 2 Secondary Metrics with subtle sparklines) */}
      <div className="space-y-3">
        {/* Row 1: 4 Key Business Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Revenue */}
          <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs hover:border-neutral-300 transition-colors flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-neutral-500 mb-1.5">
                <span className="text-xs font-medium">Revenue</span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +14.2%
                </span>
              </div>
              <div className="text-2xl font-bold text-neutral-900 tracking-tight">₹84,520</div>
            </div>

            <div className="mt-3 pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
              <span>vs yesterday (₹74,010)</span>
              {/* Subtle mini sparkline */}
              <svg className="w-16 h-5 stroke-emerald-600 fill-none" viewBox="0 0 64 20">
                <path d="M 0 16 Q 16 14, 28 8 T 48 10 T 64 2" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Orders */}
          <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs hover:border-neutral-300 transition-colors flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-neutral-500 mb-1.5">
                <span className="text-xs font-medium">Orders</span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +8.4%
                </span>
              </div>
              <div className="text-2xl font-bold text-neutral-900 tracking-tight">128</div>
            </div>

            <div className="mt-3 pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
              <span className="text-amber-700 font-medium">14 pending dispatch</span>
              <svg className="w-16 h-5 stroke-indigo-600 fill-none" viewBox="0 0 64 20">
                <path d="M 0 14 Q 20 18, 36 10 T 52 6 T 64 4" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Customers */}
          <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs hover:border-neutral-300 transition-colors flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-neutral-500 mb-1.5">
                <span className="text-xs font-medium">Total Customers</span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +12.0%
                </span>
              </div>
              <div className="text-2xl font-bold text-neutral-900 tracking-tight">1,842</div>
            </div>

            <div className="mt-3 pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
              <span>+38 new this week</span>
              <svg className="w-16 h-5 stroke-blue-600 fill-none" viewBox="0 0 64 20">
                <path d="M 0 18 Q 18 12, 34 14 T 50 8 T 64 3" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Store Visits */}
          <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs hover:border-neutral-300 transition-colors flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-neutral-500 mb-1.5">
                <span className="text-xs font-medium">Store Visits</span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  {liveVisitors.length} live now
                </span>
              </div>
              <div className="text-2xl font-bold text-neutral-900 tracking-tight">4,892</div>
            </div>

            <div className="mt-3 pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
              <span>94.2% Pan-India mobile</span>
              <svg className="w-16 h-5 stroke-violet-600 fill-none" viewBox="0 0 64 20">
                <path d="M 0 16 Q 16 8, 32 14 T 48 6 T 64 2" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* Row 2: Secondary Contextual Commerce Metrics (Conversion Rate + Average Order Value) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-white rounded-xl border border-neutral-200 p-3.5 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-neutral-100 text-neutral-700 flex items-center justify-center shrink-0">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-neutral-500 font-medium">Checkout Conversion Rate</p>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-lg font-bold text-neutral-900">4.8%</span>
                  <span className="text-[11px] font-semibold text-emerald-600">+0.6%</span>
                  <span className="text-[11px] text-neutral-400 hidden sm:inline">vs industry avg (2.9%)</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate('/dashboard/analytics')}
              className="text-xs text-neutral-500 hover:text-neutral-900 font-medium flex items-center gap-1"
            >
              <span>Funnel</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 p-3.5 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-neutral-100 text-neutral-700 flex items-center justify-center shrink-0">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-neutral-500 font-medium">Average Order Value (AOV)</p>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-lg font-bold text-neutral-900">₹661</span>
                  <span className="text-[11px] font-semibold text-emerald-600">+₹45</span>
                  <span className="text-[11px] text-neutral-400 hidden sm:inline">from last week (₹616)</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate('/dashboard/analytics')}
              className="text-xs text-neutral-500 hover:text-neutral-900 font-medium flex items-center gap-1"
            >
              <span>Cohorts</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Professional Analytics Visualization (Revenue & Orders) */}
      <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs">
        {/* Chart Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-neutral-900">Revenue & Orders Performance</h2>
              <span className="text-[11px] text-neutral-400 font-medium">({currentDataset.periodLabel})</span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Interactive sales analytics across storefront checkouts and WhatsApp orders
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Metric Mode Filter */}
            <div className="flex items-center bg-neutral-100 p-0.5 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setActiveMetricView('both')}
                className={`px-2.5 py-1 font-semibold rounded-md transition-colors ${
                  activeMetricView === 'both' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                All Metrics
              </button>
              <button
                type="button"
                onClick={() => setActiveMetricView('revenue')}
                className={`px-2.5 py-1 font-semibold rounded-md transition-colors ${
                  activeMetricView === 'revenue' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                Revenue
              </button>
              <button
                type="button"
                onClick={() => setActiveMetricView('orders')}
                className={`px-2.5 py-1 font-semibold rounded-md transition-colors ${
                  activeMetricView === 'orders' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                Orders
              </button>
            </div>

            {/* Time Period Selector */}
            <div className="flex items-center bg-neutral-100 p-0.5 rounded-lg text-xs">
              {(['today', '7d', '30d', '90d', '12m'] as const).map(range => (
                <button
                  key={range}
                  id={`chart-range-${range}`}
                  type="button"
                  onClick={() => {
                    setChartRange(range);
                    setHoveredDataIndex(null);
                  }}
                  className={`px-2.5 py-1 font-semibold rounded-md transition-colors ${
                    chartRange === range
                      ? 'bg-neutral-900 text-white shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  {range === 'today'
                    ? 'Today'
                    : range === '7d'
                    ? '7 Days'
                    : range === '30d'
                    ? '30 Days'
                    : range === '90d'
                    ? '90 Days'
                    : '12 Months'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Aggregate Banner Stats for selected period */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6 p-3 bg-neutral-50 rounded-xl border border-neutral-100">
          <div>
            <span className="text-[11px] text-neutral-500 font-medium">Total Period Revenue</span>
            <p className="text-base sm:text-lg font-bold text-neutral-900">
              ₹{currentDataset.totalRevenue.toLocaleString('en-IN')}
            </p>
          </div>
          <div>
            <span className="text-[11px] text-neutral-500 font-medium">Total Period Orders</span>
            <p className="text-base sm:text-lg font-bold text-neutral-900">
              {currentDataset.totalOrders.toLocaleString('en-IN')} units
            </p>
          </div>
          <div className="hidden sm:block">
            <span className="text-[11px] text-neutral-500 font-medium">Average Order Size</span>
            <p className="text-base sm:text-lg font-bold text-neutral-900">
              ₹{Math.round(currentDataset.totalRevenue / currentDataset.totalOrders).toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* Smooth SVG Analytics Curve */}
        <div className="relative w-full h-56 sm:h-64">
          <svg
            className="w-full h-full overflow-visible"
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="revenueAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#059669" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#059669" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
              const y = chartHeight * ratio;
              return (
                <line
                  key={i}
                  x1="0"
                  y1={y}
                  x2={chartWidth}
                  y2={y}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              );
            })}

            {/* Revenue Area */}
            {(activeMetricView === 'both' || activeMetricView === 'revenue') && (
              <path d={revAreaPath} fill="url(#revenueAreaGradient)" />
            )}

            {/* Revenue Curve */}
            {(activeMetricView === 'both' || activeMetricView === 'revenue') && (
              <path
                d={revPath}
                fill="none"
                stroke="#059669"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Orders Curve */}
            {(activeMetricView === 'both' || activeMetricView === 'orders') && (
              <path
                d={ordPath}
                fill="none"
                stroke="#6366f1"
                strokeWidth="2"
                strokeDasharray={activeMetricView === 'both' ? '5 4' : undefined}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Interactive Data Point Markers */}
            {revCoordinates.map((pt, i) => {
              const isHovered = hoveredDataIndex === i;
              return (
                <g key={i}>
                  {/* Invisible target area */}
                  <rect
                    x={pt.x - chartWidth / (chartPoints.length * 2)}
                    y="0"
                    width={chartWidth / chartPoints.length}
                    height={chartHeight}
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredDataIndex(i)}
                  />

                  {/* Dot for Revenue */}
                  {(activeMetricView === 'both' || activeMetricView === 'revenue') && (
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? 5 : 3.5}
                      className="fill-white stroke-emerald-600 transition-all"
                      strokeWidth="2.5"
                    />
                  )}

                  {/* Dot for Orders */}
                  {(activeMetricView === 'both' || activeMetricView === 'orders') && (
                    <circle
                      cx={ordCoordinates[i].x}
                      cy={ordCoordinates[i].y}
                      r={isHovered ? 4.5 : 3}
                      className="fill-white stroke-indigo-600 transition-all"
                      strokeWidth="2"
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {/* Hover Tooltip Overlay */}
          {hoveredDataIndex !== null && chartPoints[hoveredDataIndex] && (
            <div
              className="absolute pointer-events-none bg-neutral-900 text-white rounded-xl shadow-xl px-3 py-2 text-xs z-20 transition-all -translate-x-1/2 -translate-y-full"
              style={{
                left: `${(hoveredDataIndex / (chartPoints.length - 1)) * 100}%`,
                top: `${(revCoordinates[hoveredDataIndex].y / chartHeight) * 100 - 8}%`,
              }}
            >
              <p className="text-[11px] font-medium text-neutral-400 border-b border-neutral-800 pb-1 mb-1">
                {chartPoints[hoveredDataIndex].label}
              </p>
              <div className="space-y-0.5">
                <p className="flex items-center justify-between gap-3 text-emerald-400 font-bold">
                  <span>Revenue:</span>
                  <span>₹{chartPoints[hoveredDataIndex].rev.toLocaleString('en-IN')}</span>
                </p>
                <p className="flex items-center justify-between gap-3 text-indigo-300 font-medium">
                  <span>Orders:</span>
                  <span>{chartPoints[hoveredDataIndex].ord} units</span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* X-Axis Labels */}
        <div className="flex justify-between text-[11px] text-neutral-400 font-medium pt-3 border-t border-neutral-100">
          {chartPoints.map((pt, i) => (
            <span
              key={i}
              className={`cursor-pointer transition-colors ${
                hoveredDataIndex === i ? 'text-neutral-900 font-bold' : ''
              }`}
              onMouseEnter={() => setHoveredDataIndex(i)}
            >
              {pt.label}
            </span>
          ))}
        </div>

        {/* Legend and Sync status */}
        <div className="mt-4 pt-3 border-t border-neutral-100 flex flex-wrap items-center justify-between text-xs text-neutral-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <span className="font-medium text-neutral-700">Gross Sales (₹)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
              <span className="font-medium text-neutral-700">Order Volume</span>
            </span>
          </div>
          <span className="text-neutral-400 text-[11px]">Real-time synchronization active</span>
        </div>
      </div>

      {/* 4. Two-Column Layout: Left (Recent Orders) + Right (Top Products) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Orders (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-neutral-200 shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-neutral-900">Recent Customer Orders</h2>
                <p className="text-xs text-neutral-500">Live order queue with fulfillment status</p>
              </div>
              <button
                id="overview-view-all-orders"
                type="button"
                onClick={() => navigate('/dashboard/orders')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
              >
                <span>View All Orders</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 text-neutral-500 font-semibold border-b border-neutral-100">
                  <tr>
                    <th className="px-4 py-3">Order</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-neutral-700">
                  {orders.slice(0, 5).map(order => (
                    <tr key={order.id} className="hover:bg-neutral-50/60 transition-colors">
                      <td className="px-4 py-3 font-semibold text-neutral-900">
                        {order.orderNumber}
                        <div className="text-[10px] text-neutral-400 font-normal">{order.paymentMethod}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-neutral-900">{order.customerName}</div>
                        <div className="text-[10px] text-neutral-400">{order.customerPhone}</div>
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
                          className="text-neutral-700 hover:text-neutral-900 font-medium px-2 py-1 rounded bg-neutral-100 hover:bg-neutral-200 transition-colors text-xs"
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

          <div className="p-3 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
            <span>Showing latest 5 orders</span>
            <button
              type="button"
              onClick={() => navigate('/dashboard/orders')}
              className="font-semibold text-neutral-800 hover:underline"
            >
              Export CSV
            </button>
          </div>
        </div>

        {/* Right Column: Top Performing Products (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-neutral-200 shadow-xs p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-neutral-900">Top Performing Products</h2>
                <p className="text-xs text-neutral-500">Ranked by revenue & sales velocity</p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/dashboard/products')}
                className="text-xs text-emerald-700 font-semibold hover:underline"
              >
                All Products
              </button>
            </div>

            <div className="space-y-3.5">
              {products.slice(0, 4).map((p, idx) => (
                <div
                  key={p.id}
                  onClick={() => navigate(`/dashboard/products/${p.id}`)}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-neutral-50 transition-colors cursor-pointer group"
                >
                  <span className="w-5 text-xs font-bold text-neutral-400 group-hover:text-neutral-900">
                    #{idx + 1}
                  </span>
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="w-11 h-11 rounded-lg object-cover border border-neutral-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-neutral-900 truncate group-hover:text-emerald-700">
                      {p.name}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-neutral-500 mt-0.5">
                      <span>₹{(p.salePrice || p.price).toLocaleString('en-IN')}</span>
                      <span>·</span>
                      <span className="text-emerald-600 font-medium">{p.stock} in stock</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold text-neutral-900">
                      ₹{((p.salePrice || p.price) * (idx === 0 ? 42 : idx === 1 ? 28 : 19)).toLocaleString('en-IN')}
                    </p>
                    <p className="text-[10px] text-neutral-400">
                      {idx === 0 ? 42 : idx === 1 ? 28 : 19} sold
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-100">
            <div className="bg-emerald-50/60 rounded-xl p-3 text-xs flex items-center justify-between border border-emerald-100">
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold text-emerald-950">WhatsApp Commerce Integration</span>
                  <p className="text-[11px] text-emerald-800">28 conversions recorded this week</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate('/dashboard/whatsapp')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-900 shrink-0 underline"
              >
                Broadcast →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Lower Section: Low Stock Alerts + Recent Store Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alerts */}
        <div className="bg-white rounded-xl border border-neutral-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold text-neutral-900">Inventory Attention Required</h3>
            </div>
            <button
              type="button"
              onClick={() => navigate('/dashboard/inventory')}
              className="text-xs text-neutral-500 hover:text-neutral-900 font-medium"
            >
              Manage Inventory
            </button>
          </div>

          {lowStockItems.length === 0 ? (
            <div className="py-6 text-center text-xs text-neutral-400">
              All inventory levels healthy. No items below threshold.
            </div>
          ) : (
            <div className="space-y-2.5">
              {lowStockItems.slice(0, 3).map(item => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-amber-100 bg-amber-50/30 text-xs"
                >
                  <div className="flex items-center gap-3 truncate">
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-9 h-9 rounded-lg object-cover border border-amber-200 shrink-0"
                    />
                    <div className="truncate">
                      <p className="font-bold text-neutral-900 truncate">{item.name}</p>
                      <p className="text-[11px] text-amber-800">
                        {item.stock} remaining (Minimum threshold: {item.lowStockThreshold})
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigate('/dashboard/inventory');
                      addToast(`Navigating to restock ${item.name}`, 'info');
                    }}
                    className="px-2.5 py-1.5 bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 rounded-lg font-bold text-[11px] shrink-0 transition-colors shadow-2xs"
                  >
                    Restock
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity Stream */}
        <div className="bg-white rounded-xl border border-neutral-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-neutral-500" />
              <h3 className="text-sm font-bold text-neutral-900">Recent Store Activity</h3>
            </div>
            <span className="text-[11px] text-neutral-400">Pan-India channels</span>
          </div>

          <div className="space-y-3">
            {activityLogs.map(log => {
              const Icon = log.icon;
              return (
                <div key={log.id} className="flex items-start gap-3 text-xs">
                  <div className={`w-7 h-7 rounded-lg ${log.iconColor} flex items-center justify-center shrink-0 mt-0.5`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-neutral-900">{log.title}</p>
                      <span className="text-[10px] text-neutral-400 shrink-0">{log.time}</span>
                    </div>
                    <p className="text-neutral-500 text-[11px] mt-0.5 truncate">{log.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
