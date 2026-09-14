import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Tag,
  Plus,
  Copy,
  Check,
  Calendar,
  IndianRupee,
  Percent,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  SlidersHorizontal,
} from 'lucide-react';
import { Coupon } from '../../types';

export const CouponsPage: React.FC = () => {
  const { coupons, addCoupon, toggleCouponStatus, addToast } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'expired'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Form State
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [minOrderValue, setMinOrderValue] = useState<number>(499);
  const [maxDiscount, setMaxDiscount] = useState<number>(200);
  const [usageLimit, setUsageLimit] = useState<number>(500);
  const [expiryDate, setExpiryDate] = useState('2026-12-31');

  const handleCopy = (couponCode: string) => {
    navigator.clipboard.writeText(couponCode);
    setCopiedCode(couponCode);
    addToast(`Coupon code ${couponCode} copied to clipboard`, 'success');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      addToast('Please enter a coupon code', 'error');
      return;
    }

    addCoupon({
      code: code.trim().toUpperCase(),
      discountType,
      amount: Number(discountValue),
      discountValue: Number(discountValue),
      minOrder: Number(minOrderValue),
      minOrderValue: Number(minOrderValue),
      maxDiscount: discountType === 'percentage' ? Number(maxDiscount) : undefined,
      expiration: expiryDate,
      expiryDate,
      usageLimit: Number(usageLimit),
      status: 'active',
      description: `Offer: ${discountType === 'percentage' ? `${discountValue}% OFF` : `₹${discountValue} OFF`} on minimum purchase of ₹${minOrderValue}`,
    });

    addToast(`Coupon ${code.toUpperCase()} created successfully!`, 'success');
    setIsModalOpen(false);
    setCode('');
  };

  const filteredCoupons = coupons.filter((c) => {
    const matchesSearch = c.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === 'all'
        ? true
        : filterStatus === 'active'
        ? c.status === 'active'
        : c.status === 'expired' || c.status === 'disabled';
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Coupons & Discounts</h1>
          <p className="text-xs text-neutral-500">
            Create promotional discount codes to boost checkout conversions and repeat orders.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create New Coupon
        </button>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-4 bg-white rounded-xl border border-neutral-200/80 shadow-xs">
          <span className="text-xs text-neutral-500">Total Active Coupons</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-neutral-900">
              {coupons.filter((c) => c.status === 'active').length}
            </span>
            <span className="text-xs text-emerald-600 font-medium">campaigns running</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-neutral-200/80 shadow-xs">
          <span className="text-xs text-neutral-500">Total Times Redeemed</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-neutral-900">
              {coupons.reduce((sum, c) => sum + c.usedCount, 0)}
            </span>
            <span className="text-xs text-neutral-500">checkouts with discounts</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-neutral-200/80 shadow-xs">
          <span className="text-xs text-neutral-500">Top Performing Code</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold text-emerald-700">
              {coupons.length > 0 ? coupons.reduce((prev, curr) => (curr.usedCount > prev.usedCount ? curr : prev)).code : 'None'}
            </span>
            <span className="text-xs text-neutral-500">highest usage</span>
          </div>
        </div>
      </div>

      {/* Coupon List Container */}
      <div className="bg-white rounded-xl border border-neutral-200/80 shadow-xs overflow-hidden">
        {/* Filters Header */}
        <div className="p-3.5 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-50/50">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search coupon codes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs placeholder:text-neutral-400 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1.5">
            {(['all', 'active', 'expired'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-colors ${
                  filterStatus === st
                    ? 'bg-neutral-900 text-white'
                    : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50/80 text-neutral-600 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3.5">Coupon Code</th>
                <th className="py-2.5 px-3.5">Discount</th>
                <th className="py-2.5 px-3.5">Min Order</th>
                <th className="py-2.5 px-3.5">Usage / Limit</th>
                <th className="py-2.5 px-3.5">Expires</th>
                <th className="py-2.5 px-3.5">Status</th>
                <th className="py-2.5 px-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-700">
              {filteredCoupons.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-neutral-500">
                    No coupons found matching your search.
                  </td>
                </tr>
              ) : (
                filteredCoupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-3 px-3.5 font-mono font-bold text-neutral-900">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-neutral-100 border border-neutral-200 tracking-wider">
                          {coupon.code}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(coupon.code)}
                          title="Copy Code"
                          className="text-neutral-400 hover:text-neutral-700 transition-colors p-1"
                        >
                          {copiedCode === coupon.code ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-3.5">
                      <span className="font-semibold text-emerald-700">
                        {coupon.discountType === 'percentage'
                          ? `${coupon.amount ?? coupon.discountValue ?? 0}% OFF`
                          : `₹${coupon.amount ?? coupon.discountValue ?? 0} FLAT OFF`}
                      </span>
                      {coupon.maxDiscount && (
                        <span className="text-[11px] text-neutral-400 block">
                          Max cap: ₹{coupon.maxDiscount}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3.5 font-medium">
                      ₹{(coupon.minOrder ?? coupon.minOrderValue ?? 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-neutral-900">{coupon.usedCount || 0}</span>
                        <span className="text-neutral-400">/</span>
                        <span className="text-neutral-500">{coupon.usageLimit ? coupon.usageLimit : '∞'}</span>
                      </div>
                      {/* Mini progress bar */}
                      <div className="w-24 h-1 bg-neutral-100 rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{
                            width: `${coupon.usageLimit ? Math.min(100, ((coupon.usedCount || 0) / coupon.usageLimit) * 100) : 50}%`,
                          }}
                        />
                      </div>
                    </td>
                    <td className="py-3 px-3.5 text-neutral-500">
                      {coupon.expiration || coupon.expiryDate || 'Ongoing'}
                    </td>
                    <td className="py-3 px-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          coupon.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-neutral-100 text-neutral-600 border border-neutral-200'
                        }`}
                      >
                        {coupon.status === 'active' ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        <span className="capitalize">{coupon.status}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => toggleCouponStatus(coupon.id)}
                        className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-colors ${
                          coupon.status === 'active'
                            ? 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                            : 'border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                        }`}
                      >
                        {coupon.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create Coupon */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-neutral-200 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-neutral-900">Create New Promo Code</h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Specify the discount mechanism, eligibility and validity window.
            </p>

            <form onSubmit={handleCreateCoupon} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Coupon Code</label>
                <input
                  type="text"
                  placeholder="e.g. FESTIVE20 or WELCOME100"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  required
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg uppercase tracking-wider font-mono font-bold focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as 'percentage' | 'fixed')}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Discount Value</label>
                  <input
                    type="number"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    min={1}
                    required
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Min Order Value (₹)</label>
                  <input
                    type="number"
                    value={minOrderValue}
                    onChange={(e) => setMinOrderValue(Number(e.target.value))}
                    min={0}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                {discountType === 'percentage' && (
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Max Cap (₹)</label>
                    <input
                      type="number"
                      value={maxDiscount}
                      onChange={(e) => setMaxDiscount(Number(e.target.value))}
                      min={10}
                      className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Usage Limit</label>
                  <input
                    type="number"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(Number(e.target.value))}
                    min={1}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-xs transition-colors"
                >
                  Publish Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
