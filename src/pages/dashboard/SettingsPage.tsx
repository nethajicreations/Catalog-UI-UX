import React, { useState } from 'react';
import { useRouter } from '../../context/RouterContext';
import { useStore } from '../../context/StoreContext';
import {
  Settings,
  Store,
  CreditCard,
  Truck,
  Globe,
  Save,
  Plus,
  Check,
  ShieldCheck,
  Building,
  DollarSign,
  IndianRupee,
  ExternalLink,
} from 'lucide-react';
import { Tenant } from '../../types';

export const SettingsPage: React.FC = () => {
  const { currentTenant, tenants, switchTenant, createTenant, updateTenant, addToast } = useStore();

  const [name, setName] = useState(currentTenant.name);
  const [tagline, setTagline] = useState(currentTenant.tagline);
  const [supportEmail, setSupportEmail] = useState(currentTenant.supportEmail);
  const [supportPhone, setSupportPhone] = useState(currentTenant.supportPhone);
  const [currency, setCurrency] = useState(currentTenant.currency);
  const [customDomain, setCustomDomain] = useState(currentTenant.customDomain || '');

  // Payment settings
  const [enableCod, setEnableCod] = useState(true);
  const [enableUpi, setEnableUpi] = useState(true);
  const [upiId, setUpiId] = useState('dailyneeddeals@okaxis');
  const [razorpayKey, setRazorpayKey] = useState('rzp_live_9482910482');

  // Shipping settings
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(999);
  const [standardShippingFee, setStandardShippingFee] = useState(60);

  // New Tenant Modal
  const [newStoreModal, setNewStoreModal] = useState(false);
  const [newStoreName, setNewStoreName] = useState('');
  const [newStoreSlug, setNewStoreSlug] = useState('');
  const [newStoreCategory, setNewStoreCategory] = useState('Fashion & Apparel');

  const handleSaveSettings = () => {
    updateTenant(currentTenant.id, {
      name,
      tagline,
      supportEmail,
      supportPhone,
      currency,
      customDomain,
    });
    addToast('Store configuration saved successfully', 'success');
  };

  const handleCreateNewStore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoreName.trim()) return;

    const slug = (newStoreSlug || newStoreName).toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newT = createTenant(newStoreName, slug);
    setNewStoreModal(false);
    setNewStoreName('');
    setNewStoreSlug('');
    addToast(`Store "${newStoreName}" created and switched!`, 'success');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Store Settings & Configuration</h1>
          <p className="text-xs text-neutral-500">
            Manage store details, payment gateways, delivery rates, and multi-tenant environments.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveSettings}
          className="flex items-center gap-1.5 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold shadow-xs"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save All Settings</span>
        </button>
      </div>

      {/* Multi-Tenant Switcher Card */}
      <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-indigo-600" />
            <div>
              <h2 className="text-sm font-bold text-neutral-900">Multi-Tenant Store Management</h2>
              <p className="text-xs text-neutral-500">Switch between separate store databases or launch a new brand</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setNewStoreModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg text-xs font-semibold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Store</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {tenants.map((t) => {
            const isCurrent = t.id === currentTenant.id;
            return (
              <div
                key={t.id}
                className={`p-3.5 rounded-xl border text-xs flex items-center justify-between transition-all ${
                  isCurrent
                    ? 'border-neutral-900 bg-neutral-50/70 shadow-xs'
                    : 'border-neutral-200 hover:border-neutral-300 bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-neutral-900 text-sm">{t.name}</span>
                    {isCurrent && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-neutral-900 text-white">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <p className="text-neutral-500 text-[11px] mt-0.5">https://{t.slug}.catalogpro.shop</p>
                </div>

                {!isCurrent && (
                  <button
                    type="button"
                    onClick={() => switchTenant(t.id)}
                    className="px-2.5 py-1 bg-white border border-neutral-200 hover:bg-neutral-100 text-neutral-800 rounded-md font-semibold text-xs shadow-xs"
                  >
                    Switch
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* General Store Details */}
      <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs space-y-4 text-xs">
        <h2 className="text-sm font-bold text-neutral-900">General Information</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Store Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-neutral-900 focus:bg-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Store Tagline</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-neutral-900 focus:bg-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Support Email</label>
            <input
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-neutral-900 focus:bg-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Support Phone / WhatsApp</label>
            <input
              type="text"
              value={supportPhone}
              onChange={(e) => setSupportPhone(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-neutral-900 focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* Payment Gateways & UPI */}
      <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs space-y-4 text-xs">
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-neutral-600" />
          <h2 className="text-sm font-bold text-neutral-900">Payment Gateways & UPI QR</h2>
        </div>

        <div className="space-y-3 divide-y divide-neutral-100">
          {/* UPI Direct */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="font-semibold text-neutral-900">Direct UPI Payments (0% Gateway Fee)</div>
              <p className="text-neutral-500 text-[11px]">Customers scan QR code or open GPay / PhonePe / Paytm directly</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-1 text-xs font-mono"
                placeholder="store@upi"
              />
              <input
                type="checkbox"
                checked={enableUpi}
                onChange={(e) => setEnableUpi(e.target.checked)}
                className="rounded border-neutral-300 text-neutral-900"
              />
            </div>
          </div>

          {/* Cash On Delivery */}
          <div className="pt-3 flex items-center justify-between">
            <div>
              <div className="font-semibold text-neutral-900">Cash on Delivery (COD)</div>
              <p className="text-neutral-500 text-[11px]">Pay cash upon package arrival</p>
            </div>
            <input
              type="checkbox"
              checked={enableCod}
              onChange={(e) => setEnableCod(e.target.checked)}
              className="rounded border-neutral-300 text-neutral-900"
            />
          </div>

          {/* Razorpay Online Checkout */}
          <div className="pt-3 space-y-2">
            <div className="font-semibold text-neutral-900">Razorpay / Cards / NetBanking</div>
            <input
              type="password"
              value={razorpayKey}
              onChange={(e) => setRazorpayKey(e.target.value)}
              className="w-full sm:w-80 bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-1.5 font-mono text-xs"
            />
          </div>
        </div>
      </div>

      {/* Shipping & Delivery Rules */}
      <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs space-y-4 text-xs">
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-neutral-600" />
          <h2 className="text-sm font-bold text-neutral-900">Shipping & Delivery Rates</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-neutral-700 mb-1">
              Free Shipping Order Minimum (₹)
            </label>
            <input
              type="number"
              value={freeShippingThreshold}
              onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-neutral-900"
            />
            <p className="text-[10px] text-neutral-400 mt-0.5">Orders above this qualify for free shipping automatically</p>
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">
              Standard Shipping Fee (₹)
            </label>
            <input
              type="number"
              value={standardShippingFee}
              onChange={(e) => setStandardShippingFee(Number(e.target.value))}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-neutral-900"
            />
            <p className="text-[10px] text-neutral-400 mt-0.5">Applied to orders below minimum cart value</p>
          </div>
        </div>
      </div>

      {/* Custom Domain Settings */}
      <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs space-y-3 text-xs">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-neutral-600" />
          <h2 className="text-sm font-bold text-neutral-900">Custom Domain Name</h2>
        </div>

        <p className="text-neutral-500">
          Connect your custom domain (e.g. <code>store.dailyneeddeals.in</code>) by pointing a CNAME record to <code>cname.catalogpro.shop</code>.
        </p>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. shop.mybrand.in"
            value={customDomain}
            onChange={(e) => setCustomDomain(e.target.value)}
            className="flex-1 bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-1.5 font-mono text-neutral-900"
          />
          <button
            type="button"
            onClick={handleSaveSettings}
            className="px-3.5 py-1.5 bg-neutral-900 text-white rounded-lg font-semibold"
          >
            Connect Domain
          </button>
        </div>
      </div>

      {/* Create New Store Modal */}
      {newStoreModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95">
            <h3 className="text-sm font-bold text-neutral-900">Create New Merchant Tenant Store</h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Each store maintains its own independent catalogue, inventory, and orders database.
            </p>

            <form onSubmit={handleCreateNewStore} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Brand Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Urban Threads Apparel"
                  value={newStoreName}
                  onChange={(e) => setNewStoreName(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-neutral-900"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Subdomain Slug</label>
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="urban-threads"
                    value={newStoreSlug}
                    onChange={(e) => setNewStoreSlug(e.target.value)}
                    className="flex-1 bg-neutral-50 border border-neutral-200 rounded-l-lg px-3 py-2 font-mono text-neutral-900"
                  />
                  <span className="bg-neutral-100 border border-l-0 border-neutral-200 px-2.5 py-2 text-neutral-500 rounded-r-lg font-mono">
                    .catalogpro.shop
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setNewStoreModal(false)}
                  className="px-3 py-1.5 border border-neutral-200 rounded-lg font-semibold text-neutral-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg font-semibold"
                >
                  Create & Launch Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
