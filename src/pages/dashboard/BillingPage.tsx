import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  CreditCard,
  Check,
  Download,
  Zap,
  ShieldCheck,
  Calendar,
  Sparkles,
  ArrowUpRight,
  Receipt,
  CheckCircle2,
} from 'lucide-react';

export const BillingPage: React.FC = () => {
  const { addToast } = useStore();
  const [selectedCycle, setSelectedCycle] = useState<'monthly' | 'annual'>('annual');

  const invoices = [
    {
      id: 'inv_sub_109',
      date: '01 Sep 2026',
      description: 'CatalogPro Scale Annual Subscription (12 Months)',
      amount: 39990,
      status: 'paid',
      pdfUrl: '#',
    },
    {
      id: 'inv_sub_108',
      date: '01 Sep 2025',
      description: 'CatalogPro Growth Annual Subscription',
      amount: 24990,
      status: 'paid',
      pdfUrl: '#',
    },
    {
      id: 'inv_sub_107',
      date: '15 Aug 2025',
      description: 'WhatsApp Cloud API 10k Broadcast Boost Pack',
      amount: 1499,
      status: 'paid',
      pdfUrl: '#',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 tracking-tight">SaaS Subscription & Billing</h1>
          <p className="text-xs text-neutral-500">
            Manage your CatalogPro commerce platform license, cloud bandwidth quotas, and tax invoices.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Plan Active & Renews 01 Sep 2027
          </span>
        </div>
      </div>

      {/* Current Active Plan Overview Card */}
      <div className="bg-neutral-900 text-white rounded-2xl p-6 relative overflow-hidden shadow-lg">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                Enterprise Grade
              </span>
              <span className="text-xs text-neutral-400">Annual Billing (20% Savings)</span>
            </div>
            <h2 className="text-2xl font-bold mt-2 tracking-tight">CatalogPro Commerce — Scale Tier</h2>
            <p className="text-xs text-neutral-300 mt-1 max-w-xl">
              Equipped with high-throughput multi-catalog generation, automated WhatsApp business broadcasts, B2B wholesale pricing tiers, and unlimited SKUs.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-neutral-800 text-xs">
              <div>
                <span className="text-neutral-400 block text-[11px]">SKU Catalog Limit</span>
                <span className="font-bold text-white text-sm">Unlimited</span>
              </div>
              <div>
                <span className="text-neutral-400 block text-[11px]">Team Seats</span>
                <span className="font-bold text-white text-sm">10 Allocated</span>
              </div>
              <div>
                <span className="text-neutral-400 block text-[11px]">Platform Commission</span>
                <span className="font-bold text-emerald-400 text-sm">0% Take Rate</span>
              </div>
              <div>
                <span className="text-neutral-400 block text-[11px]">Next Billing</span>
                <span className="font-bold text-white text-sm">01 Sep 2027</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => addToast('Enterprise upgrade request initiated. Dedicated account manager will reach out.', 'info')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Upgrade to Custom Enterprise
            </button>
            <button
              type="button"
              onClick={() => addToast('Payment method update dialog opened', 'info')}
              className="px-4 py-2 bg-white/10 hover:bg-white/15 text-neutral-200 font-semibold text-xs rounded-xl border border-white/10 transition-colors text-center"
            >
              Manage Card & GST Details
            </button>
          </div>
        </div>
      </div>

      {/* Payment Method & GSTIN Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded-xl border border-neutral-200/80 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-700">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-neutral-900 text-xs">HDFC Bank Corporate Visa •••• 4022</div>
              <div className="text-neutral-500 text-[11px]">Expires 08/29 • Default Auto-pay card</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => addToast('Card details updated', 'success')}
            className="text-xs font-semibold text-neutral-700 hover:text-neutral-900 border border-neutral-200 px-2.5 py-1 rounded-lg hover:bg-neutral-50"
          >
            Update
          </button>
        </div>

        <div className="p-4 bg-white rounded-xl border border-neutral-200/80 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-700">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-neutral-900 text-xs">GSTIN: 27AABCU9603R1ZM</div>
              <div className="text-neutral-500 text-[11px]">Daily Need Deals Private Limited • Maharashtra</div>
            </div>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
            Tax Compliant
          </span>
        </div>
      </div>

      {/* Invoices History Table */}
      <div className="bg-white rounded-xl border border-neutral-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-neutral-200 bg-neutral-50/50 flex items-center justify-between">
          <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
            Subscription Tax Invoices & Receipts
          </h3>
          <span className="text-xs text-neutral-500">Includes 18% GST Input Credit</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50/80 text-neutral-600 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3.5">Invoice #</th>
                <th className="py-2.5 px-3.5">Billing Date</th>
                <th className="py-2.5 px-3.5">Description</th>
                <th className="py-2.5 px-3.5">Amount (INR)</th>
                <th className="py-2.5 px-3.5">Status</th>
                <th className="py-2.5 px-3.5 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-700">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-neutral-50/70 transition-colors">
                  <td className="py-3 px-3.5 font-mono font-semibold text-neutral-900">
                    {inv.id}
                  </td>
                  <td className="py-3 px-3.5 text-neutral-500">
                    {inv.date}
                  </td>
                  <td className="py-3 px-3.5 font-medium text-neutral-900">
                    {inv.description}
                  </td>
                  <td className="py-3 px-3.5 font-bold text-neutral-900">
                    ₹{inv.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" />
                      Paid
                    </span>
                  </td>
                  <td className="py-3 px-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => addToast(`Tax Invoice ${inv.id} downloaded (PDF)`, 'success')}
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 rounded-md transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
