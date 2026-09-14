import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  CreditCard,
  Download,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
  Building2,
  FileText,
} from 'lucide-react';
import { Transaction } from '../../types';

export const PaymentsPage: React.FC = () => {
  const { transactions, currentTenant, addToast } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending' | 'failed'>('all');

  const handleExportStatement = () => {
    addToast('Payment settlements statement (CSV/Excel) exported successfully', 'success');
  };

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.method.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCollected = transactions
    .filter((t) => t.status === 'paid')
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingSettlement = transactions
    .filter((t) => t.status === 'pending')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Payments & Settlements</h1>
          <p className="text-xs text-neutral-500">
            Real-time transaction logs, UPI / Card gateway settlements, and merchant account payout records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportStatement}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export Statement
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
        <div className="p-4 bg-white rounded-xl border border-neutral-200/80 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 text-xs">
            <span>Total Collected</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
              ₹
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-neutral-900">
              ₹{totalCollected.toLocaleString('en-IN')}
            </span>
          </div>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 block">
            +18.4% compared to last cycle
          </span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-neutral-200/80 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 text-xs">
            <span>Pending Payout</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-neutral-900">
              ₹{pendingSettlement.toLocaleString('en-IN')}
            </span>
          </div>
          <span className="text-[11px] text-neutral-500 mt-1 block">
            Settling to HDFC Bank (T+1)
          </span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-neutral-200/80 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 text-xs">
            <span>Gateway Success Rate</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-neutral-900">98.6%</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 block">
            UPI Intent routing healthy
          </span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-neutral-200/80 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 text-xs">
            <span>Active Merchant Account</span>
            <div className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm font-bold text-neutral-900">HDFC Escrow A/c</span>
            <span className="text-[11px] text-neutral-500 block">IFSC: HDFC0000240</span>
          </div>
          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold w-fit mt-1 block">
            Verified
          </span>
        </div>
      </div>

      {/* Gateway Providers Status Bar */}
      <div className="bg-white rounded-xl border border-neutral-200/80 p-4 shadow-xs">
        <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-3">
          Configured Payment Channels
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200/80 flex items-center justify-between text-xs">
            <div>
              <div className="font-semibold text-neutral-900">Razorpay Direct UPI</div>
              <div className="text-neutral-500 text-[11px]">0% MDR on UPI QR & Apps</div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
              Active
            </span>
          </div>

          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200/80 flex items-center justify-between text-xs">
            <div>
              <div className="font-semibold text-neutral-900">Cards & NetBanking</div>
              <div className="text-neutral-500 text-[11px]">Visa, Mastercard, RuPay, NetBanking</div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
              Active
            </span>
          </div>

          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200/80 flex items-center justify-between text-xs">
            <div>
              <div className="font-semibold text-neutral-900">Cash on Delivery (COD)</div>
              <div className="text-neutral-500 text-[11px]">₹45 OTP verification fee enabled</div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
              Active
            </span>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl border border-neutral-200/80 shadow-xs overflow-hidden">
        <div className="p-3.5 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-50/50">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search invoice, customer, order ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs placeholder:text-neutral-400 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1.5">
            {(['all', 'paid', 'pending', 'failed'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-colors ${
                  statusFilter === st
                    ? 'bg-neutral-900 text-white'
                    : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50/80 text-neutral-600 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3.5">Invoice #</th>
                <th className="py-2.5 px-3.5">Order ID</th>
                <th className="py-2.5 px-3.5">Customer</th>
                <th className="py-2.5 px-3.5">Method</th>
                <th className="py-2.5 px-3.5">Date & Time</th>
                <th className="py-2.5 px-3.5">Status</th>
                <th className="py-2.5 px-3.5 text-right">Fee</th>
                <th className="py-2.5 px-3.5 text-right">Net Payout</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-700">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-neutral-500">
                    No transactions matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-3 px-3.5 font-mono font-semibold text-neutral-900">
                      {tx.invoiceNumber}
                    </td>
                    <td className="py-3 px-3.5 font-mono text-neutral-600">
                      {tx.orderId}
                    </td>
                    <td className="py-3 px-3.5 font-medium text-neutral-900">
                      {tx.customerName}
                    </td>
                    <td className="py-3 px-3.5">
                      <span className="px-2 py-0.5 rounded-md bg-neutral-100 border border-neutral-200 text-neutral-800 text-[11px] font-medium">
                        {tx.method}
                      </span>
                    </td>
                    <td className="py-3 px-3.5 text-neutral-500">
                      {tx.date}
                    </td>
                    <td className="py-3 px-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          tx.status === 'paid'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : tx.status === 'pending'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {tx.status === 'paid' && <CheckCircle2 className="w-3 h-3" />}
                        {tx.status === 'pending' && <Clock className="w-3 h-3" />}
                        {tx.status === 'failed' && <AlertCircle className="w-3 h-3" />}
                        <span className="capitalize">{tx.status}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3.5 text-right text-neutral-500">
                      {tx.fee > 0 ? `₹${tx.fee}` : '₹0'}
                    </td>
                    <td className="py-3 px-3.5 text-right font-bold text-neutral-900">
                      ₹{tx.net.toLocaleString('en-IN')}
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
