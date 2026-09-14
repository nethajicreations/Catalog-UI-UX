import React, { useState, useMemo } from 'react';
import { useRouter } from '../../context/RouterContext';
import { useStore } from '../../context/StoreContext';
import { StatusBadge } from '../../components/ui/Badge';
import {
  Users,
  Search,
  Filter,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  IndianRupee,
  ShoppingBag,
  ExternalLink,
  MessageSquare,
  Building,
  CreditCard,
  X,
} from 'lucide-react';
import { Customer } from '../../types';

export const CustomersPage: React.FC = () => {
  const { navigate } = useRouter();
  const { customers, updateCustomerGroup, approveB2BRequest, currentTenant, orders, addToast } = useStore();

  const [search, setSearch] = useState('');
  const [groupFilter, setGroupFilter] = useState<string>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search) ||
        (c.companyName && c.companyName.toLowerCase().includes(search.toLowerCase()));

      const matchesGroup = groupFilter === 'all' || c.group === groupFilter;

      return matchesSearch && matchesGroup;
    });
  }, [customers, search, groupFilter]);

  const pendingB2BCount = customers.filter((c) => c.group === 'b2b' && c.b2bApproved === false).length;

  const handleWhatsAppCustomer = (c: Customer) => {
    const text = encodeURIComponent(`Hello ${c.name}, greetings from ${currentTenant.name}!`);
    window.open(`https://wa.me/${c.phone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Customer Directory & B2B Accounts</h1>
          <p className="text-xs text-neutral-500">
            Manage retail buyers, wholesale distributors, B2B credit terms, and trade tax GST numbers.
          </p>
        </div>

        {pendingB2BCount > 0 && (
          <div className="bg-indigo-50 border border-indigo-200 text-indigo-900 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-indigo-600" />
            <span>{pendingB2BCount} B2B Trade Application(s) Pending Approval</span>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white rounded-xl border border-neutral-200 p-3.5 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by customer name, phone, GSTIN, business..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-neutral-50 border border-neutral-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
          />
        </div>

        <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-lg self-stretch sm:self-auto text-xs">
          {[
            { id: 'all', label: 'All Users' },
            { id: 'retail', label: 'Retail' },
            { id: 'b2b', label: 'B2B Wholesale' },
            { id: 'vip', label: 'VIP Clients' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setGroupFilter(tab.id)}
              className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                groupFilter === tab.id
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 text-neutral-500 font-semibold border-b border-neutral-100">
              <tr>
                <th className="px-4 py-3">Customer / Business</th>
                <th className="px-4 py-3">Account Group</th>
                <th className="px-4 py-3">B2B Trade Status</th>
                <th className="px-4 py-3">Orders</th>
                <th className="px-4 py-3">Total Spend</th>
                <th className="px-4 py-3">Credit Terms</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-700">
              {filteredCustomers.map((c) => (
                <tr key={c.id} className="hover:bg-neutral-50/70 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-neutral-900 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                        {c.name[0]}
                      </div>
                      <div>
                        <div className="font-semibold text-neutral-900">{c.name}</div>
                        <div className="text-[11px] text-neutral-400">
                          {c.email} · {c.phone}
                        </div>
                        {c.companyName && (
                          <div className="text-[10px] text-indigo-600 font-medium flex items-center gap-1 mt-0.5">
                            <Building className="w-3 h-3" />
                            <span>{c.companyName} {c.taxGstin ? `(${c.taxGstin})` : ''}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                        c.group === 'b2b'
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : c.group === 'vip'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-neutral-100 text-neutral-700'
                      }`}
                    >
                      {c.group}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    {c.group === 'b2b' ? (
                      c.b2bApproved ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                        </span>
                      ) : (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => approveB2BRequest(c.id, true)}
                            className="px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px]"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => approveB2BRequest(c.id, false)}
                            className="px-2 py-0.5 rounded bg-rose-100 text-rose-700 font-bold text-[10px]"
                          >
                            Reject
                          </button>
                        </div>
                      )
                    ) : (
                      <span className="text-neutral-400 text-[11px]">N/A</span>
                    )}
                  </td>

                  <td className="px-4 py-3 font-semibold text-neutral-900">{c.totalOrders}</td>

                  <td className="px-4 py-3 font-bold text-neutral-900">
                    ₹{c.totalSpent.toLocaleString('en-IN')}
                  </td>

                  <td className="px-4 py-3 text-neutral-500 font-medium">
                    {c.group === 'b2b' ? (
                      <div>
                        <span>{c.paymentTerms || 'Advance'}</span>
                        {c.creditLimit && (
                          <div className="text-[10px] text-neutral-400">Limit: ₹{c.creditLimit.toLocaleString()}</div>
                        )}
                      </div>
                    ) : (
                      'Prepaid / COD'
                    )}
                  </td>

                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleWhatsAppCustomer(c)}
                        className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50"
                        title="Chat on WhatsApp"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedCustomer(c)}
                        className="p-1.5 rounded-lg text-neutral-600 hover:bg-neutral-100"
                        title="View Profile"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Profile & B2B Terms Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-sm font-bold text-neutral-900">Customer Profile & Account Privileges</h3>
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 py-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-neutral-900 text-white font-bold flex items-center justify-center text-base">
                  {selectedCustomer.name[0]}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-900">{selectedCustomer.name}</h4>
                  <p className="text-neutral-500">{selectedCustomer.email} · {selectedCustomer.phone}</p>
                  {selectedCustomer.companyName && (
                    <p className="text-indigo-600 font-semibold mt-0.5">
                      {selectedCustomer.companyName} (GST: {selectedCustomer.taxGstin || 'Not provided'})
                    </p>
                  )}
                </div>
              </div>

              {/* Group selection */}
              <div className="bg-neutral-50 p-3 rounded-xl space-y-2 border border-neutral-100">
                <label className="block font-semibold text-neutral-800">Assigned Pricing Group</label>
                <div className="flex gap-2">
                  {(['retail', 'b2b', 'vip'] as const).map((grp) => (
                    <button
                      key={grp}
                      type="button"
                      onClick={() => updateCustomerGroup(selectedCustomer.id, grp)}
                      className={`flex-1 py-1.5 rounded-lg border font-semibold capitalize ${
                        selectedCustomer.group === grp
                          ? 'bg-neutral-900 text-white border-neutral-900'
                          : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                      }`}
                    >
                      {grp}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                  <span className="text-neutral-400 text-[10px] block uppercase font-bold">Total Orders</span>
                  <span className="text-base font-bold text-neutral-900 mt-1 block">
                    {selectedCustomer.totalOrders} orders
                  </span>
                </div>

                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                  <span className="text-neutral-400 text-[10px] block uppercase font-bold">Lifetime Revenue</span>
                  <span className="text-base font-bold text-neutral-900 mt-1 block">
                    ₹{selectedCustomer.totalSpent.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="border-t border-neutral-100 pt-3">
                <h5 className="font-bold text-neutral-900 mb-2">Delivery Address</h5>
                <p className="text-neutral-600 bg-neutral-50 p-2.5 rounded-lg border border-neutral-100">
                  {selectedCustomer.address}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-1.5 bg-neutral-900 text-white rounded-lg text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
