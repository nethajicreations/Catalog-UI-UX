import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { useRouter } from '../../context/RouterContext';
import {
  Users,
  Smartphone,
  Laptop,
  Tablet,
  Globe,
  ShoppingBag,
  Clock,
  ArrowUpRight,
  Search,
  Filter,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Eye,
} from 'lucide-react';
import { LiveVisitor } from '../../types';

export const LiveVisitorsPage: React.FC = () => {
  const { liveVisitors, currentTenant } = useStore();
  const { navigate } = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [deviceFilter, setDeviceFilter] = useState<'all' | 'mobile' | 'desktop' | 'tablet'>('all');
  const [hasCartOnly, setHasCartOnly] = useState(false);
  const [visitors, setVisitors] = useState<LiveVisitor[]>(liveVisitors);
  const [lastRefreshed, setLastRefreshed] = useState<string>('Just now');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setVisitors(liveVisitors);
  }, [liveVisitors]);

  // Simulated live pulse - periodically update seconds
  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastRefreshed('Just now');
    }, 400);
  };

  const filteredVisitors = visitors.filter((v) => {
    const matchesSearch =
      v.visitorNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.productViewed && v.productViewed.toLowerCase().includes(searchQuery.toLowerCase())) ||
      v.currentPage.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDevice = deviceFilter === 'all' || v.device === deviceFilter;
    const matchesCart = !hasCartOnly || (v.cartTotal && v.cartTotal > 0);

    return matchesSearch && matchesDevice && matchesCart;
  });

  const mobileCount = visitors.filter((v) => v.device === 'mobile').length;
  const desktopCount = visitors.filter((v) => v.device === 'desktop').length;
  const tabletCount = visitors.filter((v) => v.device === 'tablet').length;
  const visitorsWithCart = visitors.filter((v) => v.cartTotal && v.cartTotal > 0);
  const totalCartValue = visitorsWithCart.reduce((sum, v) => sum + (v.cartTotal || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Live Store Visitors</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Stream
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            Real-time storefront telemetry for {currentTenant?.name || 'Store'} • Updated {lastRefreshed}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleManualRefresh}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            type="button"
            onClick={() => navigate(`/store/${currentTenant?.slug || 'daily-need-deals'}`)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Open Storefront
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 bg-white rounded-xl border border-neutral-200/80 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 text-xs">
            <span>Active Right Now</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-neutral-900">{visitors.length}</span>
            <span className="text-xs text-emerald-600 font-medium">browsing online</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-neutral-200/80 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 text-xs">
            <span>Carts in Progress</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-neutral-900">{visitorsWithCart.length}</span>
            <span className="text-xs text-neutral-500">active carts</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-neutral-200/80 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 text-xs">
            <span>Potential Cart Value</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
              ₹
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-neutral-900">
              ₹{totalCartValue.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-amber-600 font-medium">unconverted</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-neutral-200/80 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 text-xs">
            <span>Device Split</span>
            <div className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-600 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1 font-semibold text-neutral-800">
              <Smartphone className="w-3.5 h-3.5 text-neutral-400" />
              {mobileCount}
            </div>
            <div className="flex items-center gap-1 font-semibold text-neutral-800">
              <Laptop className="w-3.5 h-3.5 text-neutral-400" />
              {desktopCount}
            </div>
            <div className="flex items-center gap-1 font-semibold text-neutral-800">
              <Tablet className="w-3.5 h-3.5 text-neutral-400" />
              {tabletCount}
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Table */}
      <div className="bg-white rounded-xl border border-neutral-200/80 shadow-xs overflow-hidden">
        <div className="p-3.5 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-50/50">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by city, visitor ID, product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs placeholder:text-neutral-400 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Device tabs */}
            <div className="flex items-center bg-white border border-neutral-200 rounded-lg p-0.5">
              {(['all', 'mobile', 'desktop', 'tablet'] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDeviceFilter(d)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md capitalize transition-colors ${
                    deviceFilter === d
                      ? 'bg-neutral-900 text-white'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            {/* Cart only toggle */}
            <button
              type="button"
              onClick={() => setHasCartOnly(!hasCartOnly)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-colors ${
                hasCartOnly
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
              }`}
            >
              Has Items in Cart
            </button>
          </div>
        </div>

        {/* Visitors Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50/80 text-neutral-600 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3.5">Visitor</th>
                <th className="py-2.5 px-3.5">Location</th>
                <th className="py-2.5 px-3.5">Currently Viewing</th>
                <th className="py-2.5 px-3.5">Traffic Source</th>
                <th className="py-2.5 px-3.5">Device</th>
                <th className="py-2.5 px-3.5">Active Time</th>
                <th className="py-2.5 px-3.5 text-right">Cart</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-700">
              {filteredVisitors.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-neutral-500">
                    No active visitors matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredVisitors.map((visitor) => (
                  <tr key={visitor.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-3 px-3.5 font-medium text-neutral-900">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>{visitor.visitorNumber}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3.5">
                      <div className="flex items-center gap-1.5 text-neutral-800 font-medium">
                        <Globe className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{visitor.city}</span>
                        <span className="text-neutral-400 text-[11px]">({visitor.country})</span>
                      </div>
                    </td>
                    <td className="py-3 px-3.5 max-w-xs">
                      {visitor.productViewed ? (
                        <div className="truncate font-semibold text-neutral-900 flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                          <span className="truncate">{visitor.productViewed}</span>
                        </div>
                      ) : (
                        <span className="text-neutral-500 font-mono text-[11px] truncate block">
                          {visitor.currentPage}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-neutral-100 text-neutral-700 border border-neutral-200">
                        {visitor.referrer}
                      </span>
                    </td>
                    <td className="py-3 px-3.5">
                      <div className="flex items-center gap-1 text-neutral-600 capitalize">
                        {visitor.device === 'mobile' && <Smartphone className="w-3.5 h-3.5 text-neutral-500" />}
                        {visitor.device === 'desktop' && <Laptop className="w-3.5 h-3.5 text-neutral-500" />}
                        {visitor.device === 'tablet' && <Tablet className="w-3.5 h-3.5 text-neutral-500" />}
                        <span>{visitor.device}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3.5 text-neutral-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-neutral-400" />
                        <span>{visitor.timeActive}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3.5 text-right font-medium">
                      {visitor.cartTotal && visitor.cartTotal > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 text-xs">
                          ₹{visitor.cartTotal.toLocaleString('en-IN')}
                        </span>
                      ) : (
                        <span className="text-neutral-400 text-[11px]">Empty</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
